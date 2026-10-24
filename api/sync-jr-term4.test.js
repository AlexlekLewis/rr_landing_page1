import { describe, it, expect } from 'vitest';
import { buildTabs, jrT4Status, jrT4Note, duplicateOf, summaryLines, tabFor, JR_T4_HEADERS, sinceStart, SINCE } from './sync-jr-term4.js';

const row = (over = {}) => ({
  id: 'id-' + Math.random().toString(36).slice(2, 8),
  created_at: '2026-10-21T01:00:00.000Z',
  player_name: 'Liam Smith', player_age: 8,
  parent_name: 'Jane Smith', parent_email: 'jane@example.com', parent_phone: '0400111222',
  preferred_centre: 'mickleham', preferred_day: 'monday',
  source: 'junior-royals-term4-booking|pay=upfront|group=5pm', paid: false,
  ...over,
});
const col = (name) => JR_T4_HEADERS.indexOf(name);

// Alex, 20 Oct 2026: a standalone Junior Royals Term 4 sign-up sheet with a tab per centre.
describe('Junior Royals Term 4 standalone sheet', () => {
  it('puts each sign-up on its centre tab; Williamstown with Mickleham, Hallam with Cranbourne North', () => {
    expect(tabFor('mickleham')).toBe('mickleham');
    expect(tabFor('williamstown')).toBe('mickleham');
    expect(tabFor('cranbourne-north')).toBe('cranbourne-north');
    expect(tabFor('hallam')).toBe('cranbourne-north');
    const tabs = buildTabs([
      row({ id: 'a' }),
      row({ id: 'b', player_name: 'Mia', parent_email: 'b@x.com', preferred_centre: 'any', source: 'junior-royals-term4-booking|pay=weekly|group=6pm|centre=cranbourne-north', player_age: 11 }),
      row({ id: 'c', player_name: 'Ari', parent_email: 'c@x.com', preferred_centre: 'williamstown', source: 'junior-royals-term4-entry' }),
      row({ id: 'd', player_name: 'Zed', parent_email: 'd@x.com', preferred_centre: 'hallam', source: 'junior-royals-term4-entry' }),
    ]);
    expect(tabs.mickleham.map((r) => r[0])).toEqual(['a', 'c']);
    expect(tabs['cranbourne-north'].map((r) => r[0])).toEqual(['b', 'd']);
    expect(tabs.unknown).toEqual([]);
  });

  it('says plainly what each row is', () => {
    expect(jrT4Status(row({ paid: true }))).toBe('PAID — place booked');
    expect(jrT4Status(row())).toBe('NOT PAID — went to checkout, no payment yet');
    expect(jrT4Status(row({ source: 'junior-royals-term4-night-request|day=thursday|group=5pm', preferred_day: null })))
      .toBe('STANDBY — asked for Thursday nights (nothing paid, no place held)');
    expect(jrT4Status(row({ source: 'junior-royals-term4-entry' }))).toBe('INTEREST ONLY — signed up before booking opened; not booked');
    expect(jrT4Status(row({ source: 'junior-royals-sold-out-page' }))).toBe('INTEREST ONLY — signed up before booking opened; not booked');
    expect(jrT4Status(row({ source: 'junior-royals-term4-entry', player_age: 13 }))).toBe('CHECK AGE — 13 is outside 7 to 12');
    expect(jrT4Note(row({ preferred_centre: 'hallam' }))).toMatch(/^Signed up for Hallam/);
    expect(jrT4Note(row({ preferred_centre: 'williamstown' }))).toMatch(/offer Mickleham/);
    expect(jrT4Note(row({ preferred_day: 'wednesday' }))).toMatch(/Mickleham is now on Mondays/);
  });

  it('marks the same player entered twice, keeping the paid entry, and never merges siblings', () => {
    const older = row({ id: 'old', created_at: '2026-09-01T00:00:00Z', source: 'junior-royals-term4-entry', player_name: 'Avaneesh Temkar' });
    const paid = row({ id: 'paid', created_at: '2026-10-22T00:00:00Z', paid: true, player_name: 'Avaneesh' });
    const sibling = row({ id: 'sib', player_name: 'Parvati Praveen', created_at: '2026-09-02T00:00:00Z' });
    const d = duplicateOf([older, paid, sibling]);
    expect(d.get('old')?.id).toBe('paid');
    expect(d.has('paid')).toBe(false);
    expect(d.has('sib')).toBe(false);
    const tabs = buildTabs([older, paid, sibling]);
    expect(tabs.mickleham.find((r) => r[0] === 'old')[col('Status')]).toMatch(/^DUPLICATE — same player as the entry from 2026-10-22/);
  });

  it('counts paid places per group and centre on the Summary tab', () => {
    const lines = summaryLines([
      row({ id: '1', paid: true }),
      row({ id: '2', paid: true, player_name: 'Big', player_age: 11, source: 'junior-royals-term4-booking|pay=weekly|group=6pm' }),
      row({ id: '3', player_name: 'Cee', parent_email: 'c@x.com', preferred_centre: 'any', source: 'junior-royals-term4-night-request|day=tuesday|group=5pm|centre=cranbourne-north', preferred_day: null }),
    ], new Date('2026-10-21T00:00:00Z'));
    const get = (label) => lines.find((l) => l[0].startsWith(label)).slice(1);
    expect(get('PAID: 5:00pm')).toEqual([1, 0]);
    expect(get('PAID: 6:00pm')).toEqual([1, 0]);
    expect(get('PAID: total')).toEqual([2, 0]);
    expect(get('   of which paid upfront')).toEqual([1, 0]);
    expect(get('   of which paying weekly')).toEqual([1, 0]);
    expect(get('STANDBY')).toEqual(['0', 'Tuesday 1']);
  });

  // Alex, 20 Oct 2026: nothing older than the last 7 days, so sign-ups from 13 Oct onwards.
  it('leaves out sign-ups made before Tuesday 13 October 2026 (Melbourne)', () => {
    expect(SINCE.toISOString()).toBe('2026-10-12T13:00:00.000Z');
    const kept = sinceStart([
      row({ id: 'old', created_at: '2026-10-12T12:59:59Z' }),        // 12 Oct, 11:59pm Melbourne
      row({ id: 'new', created_at: '2026-10-12T13:00:00Z' }),        // 13 Oct, midnight Melbourne
      row({ id: 'later', created_at: '2026-11-30T00:00:00Z', paid: true }),
    ]).map((r) => r.id);
    expect(kept).toEqual(['new', 'later']);
  });

  // 21 Oct 2026 live test: two different children from one email with the same first word
  // ("TEST Player" 8, "TEST Request" 11) were merged, and the booking was hidden behind the request.
  it('never merges different ages, and never hides a booking behind a later request', () => {
    const booking = row({ id: 'bk', player_name: 'TEST Player', player_age: 8, created_at: '2026-10-21T00:32:00Z' });
    const request = row({ id: 'rq', player_name: 'TEST Request', player_age: 11, created_at: '2026-10-21T00:32:46Z', preferred_centre: 'any', preferred_day: null, source: 'junior-royals-term4-night-request|day=thursday|group=6pm|centre=cranbourne-north' });
    expect(duplicateOf([booking, request]).size).toBe(0);
    // The same child books Mondays and also asks for Thursdays: the booking is the one that counts.
    const sameKidRequest = row({ id: 'rq2', created_at: '2026-10-21T00:40:00Z', preferred_day: null, source: 'junior-royals-term4-night-request|day=thursday|group=5pm' });
    const d = duplicateOf([row({ id: 'bk2', created_at: '2026-10-21T00:30:00Z' }), sameKidRequest]);
    expect(d.get('rq2')?.id).toBe('bk2');
    expect(d.has('bk2')).toBe(false);
  });
});
