import { afterEach, expect, it, vi } from 'vitest';
import { buildBookUrl, getCatalog, getCoachSlots } from './bookingClient';
import { COACH_ORDER, COACH_PROFILES } from './coachProfiles';
import { createPublicClient } from '../booking/public-client';
import { createFamilyOperationGate } from '../booking/family-operation-gate';
import { createFamilyPublicReader } from '../booking/family-public-reader';
import { deepLink } from '../booking/booking-model';
import { catalog, id, slots } from '../booking/fixtures.test-helper';
import { coachPagesEnabled } from './coachPagesConfig';
import { coachPageProfile, listedCoachPages } from './coachPageProfiles';
import { QA_PUBLIC_ORIGIN, QA_SUPABASE_URL } from '../booking/private-runtime';

const env = { VITE_APP_ENV: 'local', VITE_PRIVATE_BOOKING_URL: 'http://127.0.0.1:54321/functions/v1', VITE_PRIVATE_BOOKING_KEY: 'synthetic-public-key', VITE_PRIVATE_BOOKING_MOCK: 'false' };
const rawCatalog = () => { const c = catalog(); c.coaches[0]!.slug = 'ikroop-dhanoa'; return c; };
const now = new Date('2026-11-09T00:00:00Z');
const response = (value: unknown) => new Response(JSON.stringify(value), { status: 200 });
const coach = { profileId: id(3), slug: 'ikroop-dhanoa', homeCentre: 'mickleham', centres: ['mickleham'], offers: { one_on_one: true, group: true } };
const query = { coach, centre: 'mickleham', focus: 'batting', minutes: 60, now, env };
afterEach(() => vi.unstubAllEnvs());

it('uses the canonical public catalog/slots boundary, retains only safe fields and never writes', async () => {
  const raw = rawCatalog(); Object.assign(raw.coaches[0]!, { email: 'synthetic-private@example.test', pay_rate: 99 });
  const send = vi.fn().mockResolvedValueOnce(response(raw)).mockResolvedValueOnce(response(slots()));
  const reader = createFamilyPublicReader(createFamilyOperationGate(), createPublicClient(env, send));
  const current = await getCatalog({ reader, env });
  if (!current) throw new Error('Expected the live catalogue');
  expect(JSON.stringify(current)).not.toMatch(/synthetic-private|pay_rate|email/);
  expect(current.coaches[0]).toEqual(coach);
  expect(await getCoachSlots({ ...query, reader })).toEqual([{ startsAt: '2026-11-11T17:00:00+11:00', endsAt: '2026-11-11T18:00:00+11:00' }]);
  expect(send.mock.calls.map(([url]) => url)).toEqual([env.VITE_PRIVATE_BOOKING_URL + '/public-private-catalog', env.VITE_PRIVATE_BOOKING_URL + '/public-private-slots']);
  expect(JSON.parse(send.mock.calls[1]![1].body)).toMatchObject({ coach: id(3), centre: 'mickleham', from: '2026-11-09', to: '2026-11-15', weeks: 1, duration_minutes: 60, machine: 'either' });
  expect(send.mock.calls[1]![1]).toMatchObject({ credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
});

it('does not turn another coach, an unready series, another duration or an outside-week start into a bookable preview', async () => {
  const other = slots(); other.by_coach[0]!.profile_id = id(4);
  const blocked = slots();
  const unready = { ...blocked, by_coach: blocked.by_coach.map(c => ({ ...c, slots: c.slots.map(s => ({ ...s, decision_quote: null, series_check: { ...s.series_check, ready: false } })) })) };
  const wrongDuration = slots(); wrongDuration.by_coach[0]!.slots[0]!.ends_at = '2026-11-11T19:00:00+11:00';
  const outside = slots(); outside.by_coach[0]!.slots[0]!.starts_at = '2026-11-25T17:00:00+11:00'; outside.by_coach[0]!.slots[0]!.ends_at = '2026-11-25T18:00:00+11:00';
  for (const raw of [other, unready, wrongDuration, outside]) {
    const reader = createPublicClient(env, vi.fn().mockResolvedValue(response(raw)));
    expect(await getCoachSlots({ ...query, reader })).toEqual([]);
  }
  const send = vi.fn();
  await expect(getCoachSlots({ ...query, centre: 'cranbourne-north', reader: createPublicClient(env, send) })).rejects.toMatchObject({ code: 'invalid_request' });
  expect(send).not.toHaveBeenCalled();
});

it('keeps canonical429 sticky across availability and enquiry checks for this page visit', async () => {
  const gate = createFamilyOperationGate(), send = vi.fn().mockResolvedValue(new Response('', { status: 429 }));
  const reader = createFamilyPublicReader(gate, createPublicClient(env, send));
  await expect(getCatalog({ reader, env })).rejects.toMatchObject({ code: 'rate_limited' });
  await expect(getCoachSlots({ ...query, reader })).rejects.toMatchObject({ code: 'rate_limited' });
  expect(() => gate.assertReadable()).toThrow(); expect(send).toHaveBeenCalledTimes(1);
});

it('passes approved coach/context hints through the actual current wizard decoder without private values', async () => {
  const raw = rawCatalog(), reader = createPublicClient(env, vi.fn().mockResolvedValue(response(raw)));
  const current = await getCatalog({ reader, env });
  if (!current) throw new Error('Expected the live catalogue');
  const href = buildBookUrl({ centre: 'mickleham', coach: current.coaches[0].slug, startsAt: '2026-11-11T06:00:00Z', minutes: 60, focus: 'batting', goals: ['batting', 't20-cricket'] });
  const result = deepLink(href.slice(href.indexOf('?')), raw);
  expect(result).toMatchObject({ centre: 'mickleham', profile_id: id(3), start_hint: '2026-11-11T17:00', duration_minutes: 60, focus: 'batting', goals: ['batting', 't20-cricket'], source_page: '/coaches/ikroop-dhanoa' });
  expect(COACH_ORDER).toEqual(['ikroop-dhanoa', 'alex-thornhill', 'ritin-raman', 'mihiraj-jayasekara']);
  expect(Object.entries(COACH_PROFILES).every(([slug, profile]) => profile.slug === slug)).toBe(true);
  expect(COACH_ORDER).not.toContain('alex-lewis');
});

it('requires the exact launch value, never a truthy/default flag or mock catalogue', async () => {
  for (const value of [undefined, '', 'off', 'true', 'ON', true]) expect(coachPagesEnabled({ VITE_COACH_PAGES: value })).toBe(false);
  expect(coachPagesEnabled({ VITE_COACH_PAGES: 'on' })).toBe(true);
  const reader = { catalog: vi.fn(), slots: vi.fn() };
  expect(await getCatalog({ env: { ...env, VITE_PRIVATE_BOOKING_MOCK: 'true' }, reader })).toBeNull();
  expect(reader.catalog).not.toHaveBeenCalled();
});


it('refuses an explicitly unsupported format or invalid kind before availability reads', async () => {
  const send = vi.fn(), reader = createPublicClient(env, send);
  await expect(getCoachSlots({ ...query, coach: { ...coach, offers: { one_on_one: true, group: false } }, kind: 'group', groupSize: 2, reader })).rejects.toMatchObject({ code: 'invalid_request' });
  await expect(getCoachSlots({ ...query, coach: { ...coach, offers: { one_on_one: false, group: true } }, kind: 'one_on_one', reader })).rejects.toMatchObject({ code: 'invalid_request' });
  await expect(getCoachSlots({ ...query, kind: 'toString', reader })).rejects.toMatchObject({ code: 'invalid_request' });
  expect(send).not.toHaveBeenCalled();
});

it('opens the fictional coach only on the exact isolated site and only lists its exact live identity', () => {
  const backend = QA_SUPABASE_URL;
  const qa = {
    VITE_APP_ENV: 'test', VITE_QA_SUPABASE_URL: backend, VITE_QA_PUBLIC_ORIGIN: QA_PUBLIC_ORIGIN,
    VITE_COACH_PAGES: 'on', VITE_PRIVATE_BOOKING_URL: backend + '/functions/v1', VITE_SUPABASE_URL: backend,
    VITE_PRIVATE_BOOKING_KEY: 'fictional-test-publishable-key', VITE_SUPABASE_ANON_KEY: 'fictional-test-publishable-key',
  };
  const slug = 'qa-synthetic-coach';
  const profile = coachPageProfile(slug, qa, QA_PUBLIC_ORIGIN);
  expect(profile).toMatchObject({ slug, profileId: 'a9640000-0000-4000-8000-000000000401', name: 'QA Synthetic Coach' });
  expect(coachPageProfile(slug, qa, 'https://rramelbourne.com')).toBeNull();
  expect(coachPageProfile(slug, { ...qa, VITE_APP_ENV: 'production' }, QA_PUBLIC_ORIGIN)).toBeNull();
  expect(coachPageProfile(slug, { ...qa, VITE_COACH_PAGES: 'off' }, QA_PUBLIC_ORIGIN)).toBeNull();
  expect(coachPageProfile(slug, { ...qa, VITE_SUPABASE_URL: 'https://another.supabase.co' }, QA_PUBLIC_ORIGIN)).toBeNull();
  expect(coachPageProfile('constructor', qa, QA_PUBLIC_ORIGIN)).toBeNull();
  expect(coachPageProfile('unknown-coach', qa, QA_PUBLIC_ORIGIN)).toBeNull();
  expect(coachPageProfile('ikroop-dhanoa', env, 'https://rramelbourne.com')).toEqual(COACH_PROFILES['ikroop-dhanoa']);
  const live = { slug, profileId: profile?.profileId };
  expect(listedCoachPages({ coaches: [live] }, qa, QA_PUBLIC_ORIGIN)).toEqual([profile]);
  expect(listedCoachPages({ coaches: [live] }, qa, 'https://rramelbourne.com')).toEqual([]);
  expect(listedCoachPages({ coaches: [{ ...live, profileId: id(4) }] }, qa, QA_PUBLIC_ORIGIN)).toEqual([]);
  expect(listedCoachPages({ coaches: [] }, qa, QA_PUBLIC_ORIGIN)).toEqual([]);
  expect(COACH_ORDER).not.toContain(slug);
});

it('carries the exact fictional coach, goals and source page into the real booking wizard', () => {
  const raw = rawCatalog();
  raw.coaches[0]!.slug = 'qa-synthetic-coach';
  raw.coaches[0]!.profile_id = 'a9640000-0000-4000-8000-000000000401';
  const href = buildBookUrl({ centre: 'mickleham', coach: 'qa-synthetic-coach', startsAt: '2026-11-11T06:00:00Z',
    minutes: 60, focus: 'batting', goals: ['batting', 'leg-spin'] });
  expect(deepLink(href.slice(href.indexOf('?')), raw)).toMatchObject({
    centre: 'mickleham', profile_id: raw.coaches[0]!.profile_id, focus: 'batting', start_hint: '2026-11-11T17:00',
    goals: ['batting', 'leg-spin'], source_page: '/coaches/qa-synthetic-coach', duration_minutes: 60,
  });
});
