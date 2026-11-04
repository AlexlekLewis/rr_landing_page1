import { describe, expect, it } from 'vitest';
import { catalog, id, slot, slots, starts } from './fixtures.test-helper';
import { dayLabel, deepLink, emptyDraft, localStart, parseCatalog, parseSlots, recoveredIntent, requestIntent, slotAccessibleLabel, timeLabel } from './booking-model';
describe('public booking model', () => {
  it('keeps only declared public facts, including nested price and series fields', () => {
    const raw = slots(); Object.assign(raw.by_coach[0].slots[0], { net: { lane: 7 }, family_email: 'test-private@example.test' }); Object.assign(raw.by_coach[0], { pay_rate: 99 });
    const value = parseSlots(raw, 'mickleham'); expect(JSON.stringify(value)).not.toMatch(/family_email|test-private|pay_rate|lane/); expect(value.by_coach[0].slots[0].price.total_cents).toBe(13000);
  });
  it.each(['cranbourne-north', 'williamstown'])('refuses a response from the wrong centre %s', centre => expect(() => parseSlots(slots(), centre)).toThrow());
  it('refuses inconsistent aggregate, per-option and date-count quotes', () => {
    const raw = slots(); raw.by_coach[0].slots[0].price.total_cents = 1; expect(() => parseSlots(raw, 'mickleham')).toThrow();
    const other = slots(); other.by_coach[0].slots[0].series_check.actual_sessions = 2; expect(() => parseSlots(other, 'mickleham')).toThrow();
  });
  it('does not invent a missing price or infer a centre address', () => {
    const raw = catalog(); raw.prices.one_on_one_hour_cents = null as unknown as number;
    const parsed = parseCatalog(raw); expect(parsed.prices.one_on_one_hour_cents).toBeNull(); expect(parsed.centres[0].address).toBeNull();
  });
  it('resolves only catalogue centre/coach slugs and known deep-link intent', () => {
    const deep = deepLink('?centre=mickleham&coach=test-coach&start=2026-11-11T17%3A00&duration=60&focus=batting&goals=t20-cricket,unknown,batting,t20-cricket&email=test-private@example.test&amount=1', parseCatalog(catalog()));
    expect(deep).toMatchObject({ centre: 'mickleham', profile_id: id(3), start_hint: '2026-11-11T17:00', goals: ['t20-cricket', 'batting'], source_page: '/coaches/test-coach' }); expect(deep).not.toHaveProperty('email'); expect(deep).not.toHaveProperty('amount'); expect(deep).not.toHaveProperty('starts_at');
  });
  it('drops unavailable coaches, excluded centres, malformed dates and unsupported lengths', () => {
    const deep = deepLink('?centre=williamstown&coach=unknown&start=2026-02-31T17%3A00&duration=30&focus=secret&kind=group&group_size=9', parseCatalog(catalog()));
    expect(deep).toEqual({ kind: 'group', goals: [], source_page: '/book' });
    expect(deepLink('?centre=cranbourne-north&coach=test-coach', parseCatalog(catalog()))).not.toHaveProperty('profile_id');
  });
  it('keeps Melbourne wall time across actual offsets without converting a hint into authority', () => { expect(localStart(starts)).toBe('2026-11-11T17:00'); expect(localStart('2027-04-05T17:00:00+10:00')).toBe('2027-04-05T17:00'); });
  it('uses the Melbourne day and time across UTC midnight and the end of daylight saving', () => {
    expect(slotAccessibleLabel('2026-11-10T13:30:00Z', 3)).toBe('Wednesday 11 November 2026, 12:30am Melbourne time, 3 coaches free');
    expect(slotAccessibleLabel('2027-04-04T14:30:00Z', 1)).toBe('Monday 5 April 2027, 12:30am Melbourne time, 1 coach free');
    expect(dayLabel(starts)).toBe('Wed 11 Nov'); expect(timeLabel(starts)).toBe('5pm');
  });
  it('keeps the server policy deadline separate from provider facts and submitted intent', () => {
    const raw = slots(); Object.assign(raw.by_coach[0].slots[0].decision_quote, { provider_capture_before: '2099-01-01T00:00:00Z', family: 'private' });
    const parsed = parseSlots(raw, 'mickleham').by_coach[0].slots[0];
    expect(parsed.decision_quote).toEqual({ kind: 'policy_quote', quoted_at: '2026-11-09T09:00:00+11:00', confirm_by: '2026-11-10T09:00:00+11:00' });
    expect(requestIntent(draft(), parsed)).not.toHaveProperty('decision_quote');
  });
  it('refuses malformed or contradictory policy deadlines without deriving one in the browser', () => {
    for (const change of [{ kind: 'provider_authorization' }, { quoted_at: 'bad' }, { confirm_by: 'bad' }, { confirm_by: '2026-11-08T09:00:00+11:00' }, { confirm_by: '2026-11-12T09:00:00+11:00' }]) {
      const raw = slots(); Object.assign(raw.by_coach[0].slots[0].decision_quote, change); expect(() => parseSlots(raw, 'mickleham')).toThrow();
    }
    const raw = slots(); Object.assign(raw.by_coach[0].slots[0], { decision_quote: null });
    expect(parseSlots(raw, 'mickleham').by_coach[0].slots[0].decision_quote).toBeNull();
  });
  const draft = () => ({ ...emptyDraft(), centre: 'mickleham', kind: 'one_on_one', focus: 'batting', duration_minutes: 60, profile_id: id(3), starts_at: starts, players: [{ name: 'Test खिलाड़ी', age: '10' }], parent: { name: 'Test Parent', email: 'test-parent@example.test', mobile: '+61 400 000 001' }, consent_save_card: true });
  it('requires parent details for minors and an actual ready slot with card permission', () => {
    const s = { ...slot(), profile_id: id(3) }; expect(requestIntent(draft(), s)?.players[0].name).toBe('Test खिलाड़ी'); expect(requestIntent({ ...draft(), parent: { ...draft().parent, name: '' } }, s)).toBeNull(); expect(requestIntent({ ...draft(), consent_save_card: false }, s)).toBeNull(); expect(requestIntent(draft(), { ...s, series_check: { ...s.series_check, ready: false } })).toBeNull();
  });
  it('a recovered retry cannot forward stored prices, player IDs, clocks, nets or provider metadata', () => {
    const intent = requestIntent(draft(), { ...slot(), profile_id: id(3) }); const recovered = recoveredIntent({ payload: JSON.stringify({ ...intent, amount_cents: 1, player_id: id(99), as_at: '2030-01-01', net: 7, provider_ids: ['secret'] }) });
    expect(recovered).toEqual(intent); expect(recoveredIntent({ payload: '{bad' })).toBeNull();
  });
});
