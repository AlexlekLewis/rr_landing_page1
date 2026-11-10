import { describe, expect, it } from 'vitest';
import { COACH_GOALS, COACH_PROFILES } from './coachProfiles';
import { GOALS, deepLink, emptyDraft, parseCatalog, parseSlots, recoveredIntent, requestIntent } from '../booking/booking-model';
import { catalog, id, slots, starts } from '../booking/fixtures.test-helper';
import { readDraft, writeDraft } from '../booking/private-draft';

describe('booking goals derived from supplied coach strengths', () => {
  it('uses one ordered key list for every published profile and the booking decoder', () => {
    for (const [slug, profile] of Object.entries(COACH_PROFILES)) {
      expect(COACH_GOALS[slug]).toEqual(profile.strengths.map(strength => strength.key));
    }
    expect(Object.keys(GOALS).sort()).toEqual([...new Set(Object.values(COACH_GOALS).flat())].sort());
    expect(COACH_GOALS['ikroop-dhanoa']).toEqual(['leg-spin', 'batting', 't20-cricket', 'all-round-development']);
    expect(COACH_GOALS['alex-thornhill']).toEqual(['batting-technique', 'building-an-innings', 'school-cricket']);
    expect(COACH_GOALS['ritin-raman']).toEqual(['wicketkeeping', 'top-order-batting', 'all-round-development']);
    expect(COACH_GOALS['mihiraj-jayasekara']).toEqual(['batting-technique', 'small-group-batting', 'club-batting']);
    expect(GOALS['all-round-development']).toBe('All-round development');
    expect(GOALS['leg-spin']).toBe('Leg spin');
  });

  it('maps the supplied leg-spin strength to the existing spin focus without creating a new focus', () => {
    const strength = COACH_PROFILES['ikroop-dhanoa'].strengths[0];
    expect(strength).toMatchObject({ key: 'leg-spin', title: 'Leg spin', focus: 'spin', figure: 'spin' });
    const raw = catalog(); raw.coaches[0].slug = 'ikroop-dhanoa';
    const decoded = deepLink('?centre=mickleham&coach=ikroop-dhanoa&focus=spin&duration=60&goals=leg-spin,batting,t20-cricket,all-round-development', parseCatalog(raw));
    expect(decoded).toMatchObject({ profile_id: id(3), focus: 'spin', goals: COACH_GOALS['ikroop-dhanoa'], source_page: '/coaches/ikroop-dhanoa' });
    expect(deepLink('?focus=leg-spin', parseCatalog(raw))).not.toHaveProperty('focus');
  });

  it('retains the new key in the current request intent, exact recovery and private tab draft', () => {
    const draft = { ...emptyDraft(), centre: 'mickleham', kind: 'one_on_one', focus: 'spin', duration_minutes: 60,
      profile_id: id(3), starts_at: starts, goals: [...COACH_GOALS['ikroop-dhanoa']], source_page: '/coaches/ikroop-dhanoa',
      players: [{ name: 'Synthetic Goal Player', age: '12' }], parent: { name: 'Synthetic Parent', email: 'goal@example.test', mobile: '0400000000' }, consent_save_card: true };
    const option = parseSlots(slots(), 'mickleham').by_coach[0].slots[0];
    const intent = requestIntent(draft, option);
    if (!intent) throw new Error('Expected a valid booking intent');
    expect(intent.goals).toEqual(COACH_GOALS['ikroop-dhanoa']);
    expect(recoveredIntent({ nonce: id(50), payload: JSON.stringify(intent) })).toEqual(intent);
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
    expect(writeDraft(draft, storage, 1000)).toBe(true);
    expect(readDraft(storage, 1001)).toMatchObject({ goals: COACH_GOALS['ikroop-dhanoa'], focus: 'spin', consent_save_card: false });
  });
});
