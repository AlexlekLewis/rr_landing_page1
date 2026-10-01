// ─────────────────────────────────────────────────────────────
// TRIAL DATES — the one place /performance-squads decides which trials to show.
//
// /performance-squads is a PERMANENT landing page (Alex, 2 October 2026). It
// always says where trials stand: the dates of the next trials, or "to be
// confirmed" with a register-your-interest form when none are set.
//
// Two kinds of trial feed it:
//   • Squad trials, all ages (10 to 25) — CENTRES[].trialSessions in ./data.js.
//     Booked on this page.
//   • The Open Age Trial (16 to 25) — TRIAL_SESSIONS in the open age trial's
//     own data file. Booked on its own page; this page only points to it.
//
// A trial drops off this page by itself once it has finished, so the page can
// never advertise a date that has passed:
//   • squad sessions: give the session an `endsAt`, or mark it `full: true`;
//   • open age sessions: add the finish time to OPEN_AGE_SESSION_ENDS below.
//     trialCalendar.test.ts fails if an open age session has no finish time.
// ─────────────────────────────────────────────────────────────

import { ACTIVE_CENTRES, MIN_AGE, MAX_AGE } from './data';
import {
    TRIAL_SESSIONS as OPEN_AGE_SESSIONS,
    MIN_AGE as OPEN_AGE_MIN,
    MAX_AGE as OPEN_AGE_MAX,
    AGE_AS_AT as OPEN_AGE_AS_AT,
} from '../open-age-trial/openAgeData';

// The open age trial's live page (the route in App.jsx and the navbar).
export const OPEN_AGE_TRIAL_ROUTE = '/performance-squads-open-trial';

// Read as "for players aged 16 to 25 (as at 1 September 2026)".
export const OPEN_AGE_AGE_LINE = `aged ${OPEN_AGE_MIN} to ${OPEN_AGE_MAX} (as at ${OPEN_AGE_AS_AT})`;
export const SQUAD_AGE_LINE = `aged ${MIN_AGE} to ${MAX_AGE}`;

// When each open age session finishes, Melbourne time. Daylight saving starts
// on Sunday 4 October 2026, so both are AEDT (+11:00).
export const OPEN_AGE_SESSION_ENDS = {
    'oa-2026-10-04': '2026-10-04T14:30:00+11:00',   // Cranbourne North, 1:00–2:30 PM
    'oa-2026-10-05': '2026-10-05T19:00:00+11:00',   // Mickleham, 5:30–7:00 PM
};

const hasEnded = (endsAt, now) => Boolean(endsAt) && now.getTime() >= new Date(endsAt).getTime();

// "Sunday 4 October" from "Sunday 4 October · 1:00–2:30 PM".
export const dayOf = (label) => label.split('·')[0].trim();
// "1:00–2:30 PM" from the same label.
export const timeOf = (label) => (label.includes('·') ? label.split('·').slice(1).join('·').trim() : '');

const byFinish = (a, b) => {
    if (!a.endsAt && !b.endsAt) return 0;
    if (!a.endsAt) return 1;
    if (!b.endsAt) return -1;
    return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
};

// Every trial still to come, soonest first. A full session stays listed (struck
// through) until it has been played, so a player can see it exists and is full.
export const getUpcomingTrials = (now = new Date()) => {
    const openAge = OPEN_AGE_SESSIONS
        .filter((s) => !hasEnded(OPEN_AGE_SESSION_ENDS[s.id], now))
        .map((s) => ({
            id: s.id,
            kind: 'open-age',
            centre: s.centre,
            label: s.label,
            full: s.full === true,
            endsAt: OPEN_AGE_SESSION_ENDS[s.id] || null,
            href: OPEN_AGE_TRIAL_ROUTE,
        }));

    // Squad sessions marked full are the September trials, already played.
    // A future squad session shows until it is full or its endsAt has passed.
    const squad = ACTIVE_CENTRES.flatMap((c) => c.trialSessions
        .filter((s) => s.full !== true && !hasEnded(s.endsAt, now))
        .map((s) => ({
            id: s.id,
            kind: 'squad',
            centre: c.slug,
            label: s.label,
            full: false,
            endsAt: s.endsAt || null,
            href: null,
        })));

    return [...openAge, ...squad].sort(byFinish);
};

export const getUpcomingTrialsForCentre = (slug, now = new Date()) =>
    getUpcomingTrials(now).filter((t) => t.centre === slug);

// The Open Age Trial is "on" while at least one of its sessions is still to
// come and still has places.
export const getBookableOpenAgeTrials = (now = new Date()) =>
    getUpcomingTrials(now).filter((t) => t.kind === 'open-age' && !t.full);

export const isOpenAgeTrialOn = (now = new Date()) => getBookableOpenAgeTrials(now).length > 0;

// True when a squad trial (all ages) can be booked on this page right now.
export const isSquadTrialBookable = (now = new Date()) =>
    getUpcomingTrials(now).some((t) => t.kind === 'squad');

// "Sunday 4 October and Monday 5 October", from the sessions themselves.
export const joinDays = (trials) => {
    const days = trials.map((t) => dayOf(t.label));
    if (days.length <= 1) return days.join('');
    return `${days.slice(0, -1).join(', ')} and ${days[days.length - 1]}`;
};
