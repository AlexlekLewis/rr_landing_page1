import { hostedBookingRuntime, QA_PUBLIC_ORIGIN } from '../booking/private-runtime';
import { COACH_ORDER, COACH_PROFILES } from './coachProfiles';

const qaCoach = Object.freeze({
  slug: 'qa-synthetic-coach',
  profileId: 'a9640000-0000-4000-8000-000000000401',
  name: 'QA Synthetic Coach',
  first: 'QA Coach',
  initials: 'QA',
  homeCentre: 'mickleham',
  roleStrengths: 'Batting and leg spin',
  intro: 'Fictional coach for the isolated booking test site. Use test information and Stripe test cards only.',
  card: { strengths: 'Batting · leg spin', cred: 'Fictional booking test profile.' },
  strengths: [
    {
      key: 'batting', title: 'Batting', focus: 'batting', figure: 'wagon',
      description: 'Choose batting to test how a goal carries into a booking request.',
      goodFor: 'Checking a one-on-one or small group request.',
      inSession: ['Batting technique', 'Scoring options'],
    },
    {
      key: 'leg-spin', title: 'Leg spin', focus: 'spin', figure: 'spin',
      description: 'Choose leg spin to test how the coach page selects a spin session.',
      goodFor: 'Checking a different focus with the same coach.',
      inSession: ['Grip and action', 'Changing pace'],
    },
  ],
  record: [{ heading: 'Test profile', items: [{ title: 'Booking fixture', detail: 'No real coaching credentials are represented.' }] }],
});

export function coachPageProfile(slug, env = import.meta.env, origin = globalThis.location?.origin) {
  if (Object.hasOwn(COACH_PROFILES, slug)) return COACH_PROFILES[slug];
  if (slug !== qaCoach.slug || origin !== QA_PUBLIC_ORIGIN || env?.VITE_COACH_PAGES !== 'on') return null;
  try {
    return hostedBookingRuntime(env) ? qaCoach : null;
  } catch {
    return null;
  }
}

export function coachMatchesCatalog(profile, coach) {
  return profile.slug === coach.slug && (!profile.profileId || profile.profileId === coach.profileId);
}

export function listedCoachPages(catalog, env, origin) {
  const profiles = [...COACH_ORDER.map(slug => COACH_PROFILES[slug]), coachPageProfile(qaCoach.slug, env, origin)];
  return profiles.filter(profile => profile && catalog?.coaches.some(coach => coachMatchesCatalog(profile, coach)));
}
