// ─────────────────────────────────────────────────────────────
// OPEN AGE T20 TRIAL — /open-age-trial
//
// THE ONE CONFIG FILE. Every new fact on this page lives here.
// Anything reused from the live Performance Squads page is imported
// from ../performance-squads/data.js rather than copied, so the two
// pages can never drift on money, opportunities or Stripe links.
//
// This trial is an EXTRA INTAKE into the existing South-East Melbourne
// Performance Squad at Cranbourne North. It is not a new squad.
// ─────────────────────────────────────────────────────────────

import {
    CENTRES,
    OPPORTUNITIES,
    CASE_STUDIES,
    TRIAL_PRICE,
    TRIAL_INCLUDES,
    FINANCIAL_CONDITION,
    PLAYING_ROLES,
    SQUAD_COACHES,
    PAYMENT_LINKS,
    resolvePaymentLink,
} from '../performance-squads/data';

// Re-exported so this page reads one import. NOT redefined — these are the
// live, signed-off values and they stay verbatim.
export {
    OPPORTUNITIES,
    CASE_STUDIES,
    TRIAL_PRICE,
    TRIAL_INCLUDES,
    FINANCIAL_CONDITION,
    PLAYING_ROLES,
    PAYMENT_LINKS,
    resolvePaymentLink,
};

export const ROUTE = '/open-age-trial';

// ── The centre. One only. The existing South-East squad's home. ──
export const CENTRE_SLUG = 'south-east-melbourne';

// Pulled from the live centre list so the venue, suburb and head coach can
// never disagree with /performance-squads.
const SE = CENTRES.find((c) => c.slug === CENTRE_SLUG);

export const CENTRE = {
    slug: CENTRE_SLUG,
    name: SE.name,
    venue: SE.venue,
    suburb: SE.suburb,
    coach: SE.coach,
    coachTitle: SE.coachTitle,
};

// Head coach card — Alex Thornhill only. This trial recruits into his squad.
export const TRIAL_COACHES = SQUAD_COACHES.filter((c) => c.name === SE.coach);

// ─────────────────────────────────────────────────────────────
// TRIAL DATES AND TIMES — confirmed by Alex, 21 September 2026.
//
// One session only. Sunday 4 October 2026, 1:00 to 2:30 PM, at the
// Elite Cricket Centre, Cranbourne North.
//
// 90 minutes is the same length as the September trials at this venue,
// where 37 players were booked into one session and it had to be closed.
// This page is PUBLIC and promoted, so it can draw more than that. Set
// `full: true` to close bookings the moment the session is at capacity.
// ─────────────────────────────────────────────────────────────

export const TRIAL_SESSIONS = [
    { id: 'oa-2026-10-04', label: 'Sunday 4 October · 1:00–2:30 PM' },
];

// NOTE ON THE DAY, kept from the build's research: Sunday is one of the
// slots Victorian Premier Cricket uses for this age band, so a Sunday
// trial can clash with the players it is trying to reach. Alex chose
// Sunday 4 October knowing the catchment. Worth checking the 2026/27
// Premier Cricket fixture, and Dandenong and Casey-South Melbourne, if
// turnout is thin.
//
// Never delete a session to close it, or everyone already booked loses
// the date off their confirmation and off the coach's sheet. Set
// `full: true` instead. Add the id and label to TRIAL_SESSION_LABELS in
// api/sync-performance-squads.js so the sheet prints the date, not the id.

// The single switch the whole page reads. False until real dates land.
export const DATES_CONFIRMED = TRIAL_SESSIONS.length > 0;

// How many sessions one player may book.
//
// 2 IS A HARD CEILING, not a preference. Only 1-session and 2-session Stripe
// links exist for this centre (PAYMENT_LINKS['south-east-melbourne'].trial),
// and Alex has ruled out creating more. Set this to 3 and a player can book a
// third session, get their row written to the database, and then meet a
// disabled "Payment link coming soon" button with no way to pay. The guard
// below clamps it so that cannot happen; raising the real ceiling needs new
// Stripe links first.
const REQUESTED_MAX_TRIAL_SESSIONS = 2;

// The largest session count that actually has a Stripe link behind it.
const PAYABLE_SESSION_COUNTS = Object.keys(PAYMENT_LINKS[CENTRE_SLUG]?.trial || {})
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
const MAX_PAYABLE_SESSIONS = PAYABLE_SESSION_COUNTS.length
    ? Math.max(...PAYABLE_SESSION_COUNTS)
    : 1;

export const MAX_TRIAL_SESSIONS = Math.min(REQUESTED_MAX_TRIAL_SESSIONS, MAX_PAYABLE_SESSIONS);

// ── Session helpers. Same three checks the squads page uses. ──
export const getOpenTrialSessions = () => TRIAL_SESSIONS.filter((s) => s.full !== true);
export const isSessionFull = (id) =>
    (TRIAL_SESSIONS.find((s) => s.id === id) || {}).full === true;
// A player at a trial with one session left can only pick one, whatever the cap
// says. Every "choose up to N" line reads from here.
export const getSelectableSessionCount = () =>
    Math.min(MAX_TRIAL_SESSIONS, getOpenTrialSessions().length);
export const ALL_SESSIONS_FULL = DATES_CONFIRMED && getOpenTrialSessions().length === 0;

export const getSessionLabel = (id) =>
    TRIAL_SESSIONS.find((s) => s.id === id)?.label || id;

// ── Age gate. This page only. /performance-squads stays at 10 to 24. ──
// One set of constants drives the copy AND the form, so the page can never
// advertise one range while the form accepts another.
//
// AGE_AS_AT matters as much as the numbers. Without it, a 25 year old who
// turns 26 in December is eligible at the form and ineligible in the squad,
// and we have already taken his trial fee. The squads FAQ pins its range to
// the season the same way, and it matches Cricket Victoria's own convention.
//
// FOR ALEX, ONE DECISION TO SETTLE ONCE: the repo currently holds three
// different ranges. performance-squads/data.js says 10 to 24, the squad
// welcome page's welcomeConfig.js says 10 to 25 and also says "Age is not a
// limiting factor", and this page says 16 to 25. One number, one file,
// everything else imports it.
export const MIN_AGE = 16;
export const MAX_AGE = 25;
export const AGE_AS_AT = '1 September 2026';
export const AGE_LINE = `aged ${MIN_AGE} to ${MAX_AGE} as at ${AGE_AS_AT}`;

// Under 18 is a minor. For a minor the contact details on the registration are
// the PARENT OR GUARDIAN's, not the player's, so there is a reachable adult on
// the record for every cancellation, selection outcome or venue change.
export const PARENT_REQUIRED_UNDER = 18;

// ─────────────────────────────────────────────────────────────
// SID. The reason this page exists.
//
// EVIDENCE BASE, and the whole of it: his name, his title, his employer,
// the photo of him coaching Riyan Parag, and the fact he is scheduled to be
// at this trial. Nothing else about him goes on this page. No honours, no
// former clubs, no years of service, no quotes, no claims about players he
// has produced.
//
// FOR ALEX, ON THE RECORD AND FREE TO USE IF HE WANTS IT: the Royals have
// publicly announced Sid in bigger roles than the one used here, including
// Head of International Player Development for Royals Sports Group. Those are
// stronger credentials than the one on this page. They are NOT added without
// Alex's word, but he should know they exist.
// ─────────────────────────────────────────────────────────────
export const SID = {
    name: 'Sid Lahiri',
    title: 'Performance Coach',
    employer: 'Rajasthan Royals',
    titleLine: 'Performance Coach of the Rajasthan Royals',
    photo: '/assets/performance-squads/sid-lahiri-riyan-parag.jpg',
    photoAlt:
        'Sid Lahiri talking through a delivery with Riyan Parag at a Rajasthan Royals training session',
    photoCaption: 'Sid Lahiri working with Riyan Parag at a Rajasthan Royals session.',

    // THE HEDGE. This page takes money up front on the strength of one named
    // person turning up, and he flies in from overseas around an IPL and two
    // franchise seasons. Never state his attendance as a certainty. This line
    // renders under the hero, on the booking card and in the FAQ answer, and
    // it is the only promise about him the page is allowed to make.
    attendance:
        'Sid is scheduled to attend this trial. If anything changes we will tell every booked '
        + 'player before the session, and you can move to another session or take a full refund.',

    // Kills the most reasonable false read available to a disappointed player
    // or parent: that the man in the hero is the man who hands out the global
    // placements listed further down the page. He is not, on the day.
    separation:
        'Sid is at the trial to watch cricket. He is not selecting anyone for anything on the '
        + 'day. Selection into the squad is Alex Thornhill’s call, and the global '
        + 'opportunities are a separate process that happens later and is competitive.',
};

// ── Hero ──
export const HERO = {
    kicker: `Cranbourne North · Open Age T20 Trial · ${MIN_AGE} to ${MAX_AGE}`,
    headline: 'The Rajasthan Royals Performance Coach Is Coming To Cranbourne North.',
    tagline: 'Sid Lahiri is in the building.',
    body:
        'Sid Lahiri is the Performance Coach of the Rajasthan Royals. He is scheduled to be at '
        + 'this trial, on the floor at the Elite Cricket Centre in Cranbourne North, watching open '
        + `age players train. This is an extra intake into the South-East Melbourne Performance `
        + `Squad. $${TRIAL_PRICE} a session.`,
    primaryCta: 'Book your trial place',
    // Shown instead, and unclickable, until TRIAL_SESSIONS has real dates in it.
    primaryCtaPending: 'Trial dates to be confirmed',
    secondaryCta: 'What a squad place opens up',
    // While booking is closed this is the ONLY live button in the hero, so it
    // must not land on the global opportunities list. It points at the three
    // steps that explain there are two competitive gates before any of that.
    secondaryCtaPending: 'How the trial works',
};

// ── The Sid section. Sits second so nobody misses it. ──
export const SID_SECTION = {
    eyebrow: 'Who Is Running It',
    title: 'Sid Lahiri Is Coming To This Trial',
    paragraphs: [
        'Sid Lahiri is the Performance Coach of the Rajasthan Royals. The Royals run a global '
        + 'system across the IPL, the SA20 and the CPL, and Sid is part of the coaching staff '
        + 'inside it.',
        'He is coming to Cranbourne North for this trial. That is not a normal session of '
        + 'suburban cricket, and it is the reason this page exists.',
    ],
};

// ── Who it is for. Four cards, open age. ──
export const AUDIENCE = [
    {
        title: 'Out of the junior age groups',
        body: 'Players who have come through the junior age groups and are still chasing it.',
    },
    {
        title: 'Built for the short format',
        body: 'Players whose game suits T20, whatever a selection panel has decided so far.',
    },
    {
        title: 'Rebuilding after a break',
        body: 'Players coming back from injury or time away who want their trajectory back.',
    },
    {
        title: 'Playing well, want harder',
        body: 'Players in good form now who want a tougher standard to measure themselves against.',
    },
];

export const AUDIENCE_HEADING = {
    eyebrow: 'Who This Is For',
    title: `Open Age Players, ${MIN_AGE} to ${MAX_AGE}`,
    sub:
        `One trial, one squad, one standard. For players ${AGE_LINE}. You are judged on the `
        + 'cricket you play now, not on the age group you came through.',
};

// ── How the trial works. Three steps. Runs BEFORE the opportunity list. ──
// Order matters here. The global opportunities are what a SQUAD PLACE opens
// up, and there are two competitive gates between a player paying a trial fee
// and reaching them. Those gates are explained here, so this section goes
// first and the opportunity list reads as the destination, not the offer.
export const PATHWAY_HEADING = {
    eyebrow: 'How It Works',
    title: 'Trial. Get Selected. Compete.',
    sub: 'Three steps, and you will know where you stand at the end of them.',
};

export const PATHWAY_STEPS = [
    {
        n: '01',
        title: 'Trial',
        // Deliberately does NOT say Sid is on the floor for whichever session you
        // book. AWAITING ALEX: is Sid at every session, or one of them? Until he
        // says, Sid's attendance is stated of the trial, never of a given session.
        body: `Book a session, pay $${TRIAL_PRICE}, and train in front of our coaches.`,
    },
    {
        n: '02',
        title: 'Selection',
        // A measurable commitment beats "by the end of the trial period", which
        // nobody can be held to. OWNER: Alex Thornhill sends the outcomes.
        // BEFORE THIS PAGE GOES LIVE: check the September Cranbourne North cohort
        // actually received theirs, because a second unmet round is what turns
        // into the first angry email.
        body: 'Our coaches assess skill, athleticism and attitude. Every player who trials hears '
            + 'back within 10 days of the last session, selected or not.',
    },
    {
        n: '03',
        title: 'Compete',
        body: 'Selected players join the South-East Melbourne Performance Squad and go into its fixtures.',
    },
];

// Sits above the reused opportunity list on THIS page only. The sentences in
// that list are the live, signed-off wording and are not edited; this is the
// existing FAQ register put where the reader actually meets the claim.
export const OPPORTUNITY_LEAD =
    'These are squad opportunities, not trial outcomes. You trial, you are selected into the '
    + 'squad, and then you are in the pool that gets put forward. Every step is competitive and '
    + 'none of it is guaranteed.';

// ── Trials / booking section ──
export const TRIALS_HEADING = {
    eyebrow: 'Dates & Booking',
    title: 'One Centre. Cranbourne North.',
    sub: `$${TRIAL_PRICE} per player, per session, paid when you book.`,
};

// ── Fees. Stage one only. ──
// The Registration Fee for a selected player is not published here because the
// figure for this intake has not been set. The page says plainly that one
// exists rather than going quiet on it.
export const PRICING_HEADING = {
    eyebrow: 'Fees',
    title: 'What It Costs To Trial',
    sub: `$${TRIAL_PRICE} per player, per session. That is all you pay to be assessed.`,
};

// The live TRIAL_INCLUDES list, with one line made measurable. "By the end of
// the trial period" is not a date anyone can be held to, and this page has no
// trial period yet. Ten days from the last session is a commitment Alex
// Thornhill can meet and a player can hold us to. Everything else in the list
// is the signed-off wording and is untouched.
export const TRIAL_INCLUDES_OPEN_AGE = TRIAL_INCLUDES.map((line) =>
    line.toLowerCase().includes('selection outcome')
        ? 'A selection outcome within 10 days of the last session, selected or not'
        : line);

export const PRICING_FOOTNOTE =
    'If you are selected, a Registration Fee applies for your squad place, and the figure is '
    + 'confirmed with your offer. Nothing beyond the trial fee is paid unless you are offered a place.';

// ── The "tell me when the dates land" capture. ──
// This page is public, indexed and built to be shared, and until dates exist
// there is nothing to book. Without this the whole promotion window converts
// at zero and there is no list to tell when the dates arrive. It writes a
// waitlist row using the machinery the squads form already uses, takes no
// money, and lands in the existing interest tab of the coach's sheet.
export const WAITLIST = {
    eyebrow: 'Dates Coming',
    title: 'Tell Me When The Dates Are Announced',
    sub: 'The trial dates are being set now. Leave your details and you hear first.',
    body:
        'We are confirming the dates and times for this trial. Put your name down and we will '
        + 'email you the moment they are published, before the page goes out anywhere else. '
        + 'Nothing is booked and nothing is paid now.',
    cta: 'Tell me when the dates land',
    done: 'You are on the list. We will email you as soon as the dates are set.',
};

// ── FAQ. Reused shell, answers written for this trial. ──
// The hedge in the global opportunities answer is the live, signed-off wording
// and stays exactly as it is.
export const FAQS = [
    {
        q: 'Who is this trial for?',
        a: `Open age players ${AGE_LINE} who want to play and develop their T20 cricket. `
            + 'Players out of the junior age groups, players whose game suits the short format, players '
            + 'rebuilding after injury or time away, and players in good form who want a harder standard.',
    },
    {
        q: 'Is Sid Lahiri really going to be there?',
        a: 'That is the plan, and it is why we are running it. Sid Lahiri is the Performance Coach '
            + 'of the Rajasthan Royals and he is scheduled to be at this trial at the Elite Cricket '
            + 'Centre in Cranbourne North. If that changes we will tell you before you turn up, and '
            + 'you can move to another session or take a full refund.',
    },
    {
        q: 'Is Sid picking the squad?',
        a: SID.separation,
    },
    {
        q: 'When is the trial?',
        a: 'Dates and times are being confirmed and will be published on this page as soon as they are '
            + 'set. Nothing can be booked until then. Leave your details on this page and we will email '
            + 'you the moment they are announced.',
    },
    {
        q: 'What am I trialling for?',
        a: 'A place in the South-East Melbourne Performance Squad, based at the Elite Cricket Centre in '
            + 'Cranbourne North under Head Coach Alex Thornhill. This is an extra intake into that squad, '
            + 'not a new one.',
    },
    {
        q: 'What does it cost?',
        a: `$${TRIAL_PRICE} per player, per session, paid when you book. If you are selected, a `
            + 'Registration Fee applies for your squad place and the figure is confirmed with your offer. '
            + 'Nothing beyond the trial fee is paid unless you are offered a place.',
    },
    {
        q: 'What happens at the trial?',
        a: 'Our coaches assess you across batting, bowling and fielding. Every player who trials hears '
            + 'back within 10 days of the last session, selected or not. A selection outcome is part of '
            + 'what your trial fee covers.',
    },
    {
        q: 'Are the global opportunities real?',
        a: 'Yes. Our Rajasthan Royals Academy selection team has put forward four players for '
            + 'consideration as training partners with the Paarl Royals in the SA20, and Royals Academies '
            + 'in the USA have sent players as training partners of the Barbados Royals. Selection is '
            + 'competitive and never guaranteed, but the routes exist and are being used.',
    },
    {
        q: 'I am under 18. Can I trial?',
        a: `Yes, from age ${MIN_AGE}. If the player is under ${PARENT_REQUIRED_UNDER}, a parent or `
            + 'guardian fills in the registration and puts their own name, email and mobile on it, so '
            + 'there is an adult we can reach about anything to do with the session. The parent or '
            + 'guardian agrees to the codes of conduct at the same time.',
    },
];

export const FAQ_HEADING = {
    eyebrow: 'Questions',
    title: 'Frequently Asked',
    sub: 'Anything not covered here? Get in touch through the contact details on our website and we will come back to you.',
};

// ── Social preview. Consumed by src/seo/pageSeo.js. ──
// PUBLIC AND INDEXED on purpose. No noindex anywhere on this page.
//
// TWO THINGS MUST BE TRUE for this to work, and one of them is on Alex's list:
//  1. The tags have to be in the HTML BEFORE JavaScript runs, because no social
//     crawler runs JavaScript. scripts/prerender-seo.mjs bakes them into
//     dist/open-age-trial/index.html at build time. Verify the preview URL in
//     Facebook's Sharing Debugger before this link is posted anywhere.
//  2. The Sid photo is PORTRAIT (900 x 1349) and social cards are wide
//     (about 1200 x 630), so it will crop badly. A wide crop is on Alex's list;
//     swap SEO.ogImage and pageSeo.js to it when it exists.
export const SEO = {
    title: 'T20 Trial with the Royals Performance Coach | Melbourne',
    description:
        'Sid Lahiri, Performance Coach of the Rajasthan Royals, is coming to our open age T20 trial '
        + `in Cranbourne North. Players ${MIN_AGE} to ${MAX_AGE}. $${TRIAL_PRICE} a session.`,
    ogImage: SID.photo,
};
