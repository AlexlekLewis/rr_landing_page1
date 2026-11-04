import { expect, it } from 'vitest';
import { parseCreditQuote, creditReviewChanged } from './credit-quote';
import { creditFixture, reviewMarker } from './credit-fixtures.test-helper';

it.each([{ credits: [5000], mode: 'card' }, { credits: [13000], mode: 'setup' }, { credits: [26000], mode: 'covered' }, { credits: [7001, 0], mode: 'card', per: 14001 }])('preserves canonical gross value, ordinal shares and $mode funding', ({ credits, mode, per }) => {
  const f = creditFixture(credits, 2, per), out = parseCreditQuote(f.envelope, f.fields);
  expect(out.funding.funding_mode).toBe(mode); expect(out.price.total_cents).toBe(f.quote.price.total_cents);
  expect(out.funding).toEqual(f.quote.funding); expect(out.review).toBe(reviewMarker);
});
it.each([undefined, '', 'v1.' + 'AB'.repeat(32) + '.1', 'v1.' + 'ab'.repeat(32) + '.1e2', 'v1.' + 'ab'.repeat(32) + '.12345678901234567890', reviewMarker + '\n'])('refuses a missing or malformed opaque review binding %#', review => {
  const f = creditFixture(); Object.assign(f.quote, { review }); expect(() => parseCreditQuote(f.envelope, f.fields)).toThrow('unavailable');
});
it('retains the review string exactly without interpreting its comparison-only digits', () => {
  const f = creditFixture(); f.quote.review = 'v1.' + 'ac'.repeat(32) + '.0000000000000000001';
  expect(parseCreditQuote(f.envelope, f.fields).review).toBe(f.quote.review);
});
it('drops internal identifiers and does not invent financial values for unavailable slots', () => {
  const f = creditFixture(); Object.assign(f.quote, { family_id: 'private', provider_secret: 'private' }); Object.assign(f.quote.funding.players[0], { player_id: 'private' });
  const out = parseCreditQuote(f.envelope, f.fields); expect(JSON.stringify(out)).not.toContain('private');
  expect(parseCreditQuote({ ok: true, quote: { state: 'unavailable', code: 'slot_taken', as_of: f.quote.as_of, funding: f.quote.funding, review: reviewMarker } }, f.fields)).toEqual({ state: 'unavailable', code: 'slot_taken', as_of: f.quote.as_of });
});
it.each([
  (q: any) => { q.funding.first_due_cents++; },
  (q: any) => { q.funding.rest_due_cents++; },
  (q: any) => { q.funding.players[0].credit_cents++; },
  (q: any) => { q.funding.players[0].ordinal = 2; },
  (q: any) => { q.funding.players[0].per_session_cents++; },
  (q: any) => { q.funding.funding_mode = 'covered'; },
  (q: any) => { q.price.first_session_hold_cents -= 100; q.price.rest_cents += 100; },
  (q: any) => { q.series_check.dates[0].starts_at = '2026-11-11T18:00:00+11:00'; },
  (q: any) => { q.series_check.dates[0].ends_at = '2026-11-11T18:30:00+11:00'; },
  (q: any) => { q.series_check.skipped_dates = ['2026-11-11']; },
  (q: any) => { q.series_check.dates.reverse(); q.series_check.ok_dates.reverse(); },
])('fails closed when canonical funding or selected-series facts do not bind %#', mutate => {
  const f = creditFixture(); mutate(f.quote); expect(() => parseCreditQuote(f.envelope, f.fields)).toThrow('unavailable');
});
it('preserves a missing server deadline as null rather than inventing one', () => {
  const f = creditFixture(); Object.assign(f.quote, { decision_quote: null }); expect(parseCreditQuote(f.envelope, f.fields).decision_quote).toBeNull();
});
it('requires renewed review for funding, series or an earlier decision deadline', () => {
  const before = creditFixture(), funding = creditFixture([6000]), earlier = creditFixture(), skipped = creditFixture();
  earlier.quote.decision_quote.confirm_by = '2026-11-10T08:00:00+11:00'; skipped.quote.series_check.skipped_dates = ['2026-11-25'];
  expect(creditReviewChanged(before.quote, funding.quote)).toBe(true); expect(creditReviewChanged(before.quote, earlier.quote)).toBe(true); expect(creditReviewChanged(before.quote, skipped.quote)).toBe(true);
});
it('does not loop review for server clock or a later policy deadline advance', () => {
  const before = creditFixture(), after = creditFixture(); after.quote.as_of = '2026-11-09T09:01:00+11:00'; after.quote.review = 'v1.' + 'ac'.repeat(32) + '.2'; after.quote.decision_quote.quoted_at = after.quote.as_of; after.quote.decision_quote.confirm_by = '2026-11-10T09:01:00+11:00';
  expect(creditReviewChanged(before.quote, after.quote)).toBe(false);
});
it('renews an expired displayed deadline using fresh server time rather than the browser clock', () => {
  const before = creditFixture(), after = creditFixture(); after.quote.as_of = before.quote.decision_quote.confirm_by; after.quote.decision_quote.quoted_at = after.quote.as_of; after.quote.decision_quote.confirm_by = '2026-11-10T10:00:00+11:00';
  expect(creditReviewChanged(before.quote, after.quote)).toBe(true);
});
it.each([12975, 25975])('refuses a coherent25c card remainder without changing the quoted credit %s', credit => {
  const f = creditFixture([credit]); expect(() => parseCreditQuote(f.envelope, f.fields)).toThrow('payment_limit');
});
it.each([12950, 25950, 26000])('accepts50c and fully covered funding without rounding credit %s', credit => {
  const f = creditFixture([credit]); expect(parseCreditQuote(f.envelope, f.fields).funding).toEqual(f.quote.funding);
});
