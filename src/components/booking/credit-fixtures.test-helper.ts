import { id, slot, starts } from './fixtures.test-helper';

export const familyMarker = 'b'.repeat(64);
export const reviewMarker = 'v1.' + 'ab'.repeat(32) + '.1794261600000000';
export const creditEnv = { VITE_APP_ENV: 'local', VITE_PRIVATE_BOOKING_URL: 'http://127.0.0.1:54321/functions/v1', VITE_PRIVATE_BOOKING_KEY: 'unit-public-anon' };
export function creditFixture(credits = [5000], sessions = 2, per = 13000) {
  const fields = { centre: 'mickleham', profile_id: id(3), starts_at: starts, duration_minutes: 60, weeks: sessions, skip_dates: [], kind: credits.length === 1 ? 'one_on_one' : 'group', ...(credits.length > 1 ? { group_size: credits.length } : {}), focus: 'batting', machine: 'either', players: credits.map((_, i) => ({ name: 'Test Player ' + (i + 1), age: 12 })), parent: { name: 'Test Parent', email: 'family@example.test', mobile: '0400000000' }, consent_save_card: false };
  const dates = Array.from({ length: sessions }, (_, i) => {
    const date = new Date(Date.UTC(2026, 10, 11 + i * 7)).toISOString().slice(0, 10);
    return { date, starts_at: date + 'T17:00:00+11:00', ends_at: date + 'T18:00:00+11:00' };
  });
  const players = credits.map((credit_cents, i) => ({ ordinal: i + 1, credit_cents, per_session_cents: Math.floor(per / credits.length) + (i < per % credits.length ? 1 : 0) }));
  const applied = credits.reduce((sum, value) => sum + value, 0), firstCredit = players.reduce((sum, player) => sum + Math.min(player.credit_cents, player.per_session_cents), 0);
  const first = per - firstCredit, rest = per * (sessions - 1) - (applied - firstCredit);
  const quote = { state: 'quoted', as_of: '2026-11-09T09:00:00+11:00', review: reviewMarker, price: { per_session_cents: per, sessions, discount_applied: false, first_session_hold_cents: per, rest_cents: per * (sessions - 1), total_cents: per * sessions }, series_check: { ready: true, requested_weeks: sessions, actual_sessions: sessions, ok_dates: dates.map(d => d.date), dates, flagged: [], blocked: [], skipped_dates: [], add_week: null }, decision_quote: slot().decision_quote, funding: { indicative: true, funding_mode: first > 0 ? 'card' : rest > 0 ? 'setup' : 'covered', first_due_cents: first, rest_due_cents: rest, credit_applied_cents: applied, players } };
  return { fields, quote, envelope: { ok: true, quote } };
}
export function creditReceipt(quote: ReturnType<typeof creditFixture>['quote']) {
  return { ok: true, request: { request_id: id(7), state: quote.funding.funding_mode === 'covered' ? 'requested' : 'checkout', server_now: quote.as_of, expires_at: '2026-11-09T09:30:00+11:00', expires_in_seconds: 1800, dates: quote.series_check.dates, price: { ...quote.price, first_session_hold_cents: quote.funding.first_due_cents, rest_cents: quote.funding.rest_due_cents, credit_reserved_cents: quote.funding.credit_applied_cents, funding_mode: quote.funding.funding_mode }, funding_mode: quote.funding.funding_mode, request_token: 'unit_scoped_credit_request_123456789', checkout_state: quote.funding.funding_mode === 'covered' ? 'not_needed' : 'ready', ...(quote.funding.funding_mode === 'covered' ? {} : { checkout_url: 'https://checkout.stripe.com/c/pay/cs_test_unit_credit' }) } };
}
export const creditResponse = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Retry-After': '30' } });
