// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — shared data
//
// PLACEHOLDERS (swap when Andy provides real details):
//   • North Melbourne trial dates      → CENTRES[0].trialDates
//   • Prices (trial / games / training) → PAYMENT_OPTIONS[].price
//   • Stripe payment links              → PAYMENT_LINKS
// ─────────────────────────────────────────────────────────────

export const CENTRES = [
    {
        slug: 'north-melbourne',
        name: 'North Melbourne',
        venue: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        coach: 'Alex Lewis',
        coachTitle: 'Head Coach',
        trialSessions: [
            { id: 'nm-2026-09-06', label: 'Sunday 6 September · 2:00–4:00 PM' },
            { id: 'nm-2026-09-10', label: 'Thursday 10 September · 7:00–9:00 PM' },
        ],
        maxTrialSessions: 2,
        active: true,
    },
    {
        slug: 'south-east-melbourne',
        name: 'South-East Melbourne',
        venue: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        coach: 'Alex Thornhill',
        coachTitle: 'Head Coach',
        trialSessions: [
            { id: 'se-2026-09-06', label: 'Sunday 6 September · 7:00–8:30 PM' },
            { id: 'se-2026-09-11', label: 'Friday 11 September · 8:00–9:30 PM' },
            { id: 'se-2026-09-13', label: 'Sunday 13 September · 7:00–8:30 PM' },
        ],
        // Cranbourne North has fewer lanes — players attend at most 2 of the 3.
        maxTrialSessions: 2,
        active: true,
    },
    // Future squads — displayed as "Coming 2027", not selectable.
    { slug: 'west-melbourne', name: 'West Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialSessions: [], maxTrialSessions: 0, active: false },
    { slug: 'east-melbourne', name: 'East Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialSessions: [], maxTrialSessions: 0, active: false },
];

export const ACTIVE_CENTRES = CENTRES.filter((c) => c.active);

// Stripe payment links — PASTE LIVE URLs when created in Stripe.
// While null, the pay button shows "Payment link coming soon" and is disabled.
export const PAYMENT_LINKS = {
    // Stripe Payment Links cannot have their quantity prefilled from a URL, so
    // each trial quantity needs its own fixed-price link. That keeps the amount
    // charged locked to what the player registered for.
    'north-melbourne': {
        trial: {
            1: 'https://buy.stripe.com/4gMcN56nvggZ2D233t9Zm0z',    // $30  — 1 session
            2: 'https://buy.stripe.com/8x2bJ17rz2q9elKeMb9Zm0A',    // $60  — 2 sessions
        },
        registration_upfront: null,
        registration_weekly: null,
    },
    'south-east-melbourne': {
        trial: {
            1: 'https://buy.stripe.com/6oU4gz3bj0i1elK1Zp9Zm0x',    // $30  — 1 session
            2: 'https://buy.stripe.com/9B6cN53bj8Ox6TifQf9Zm0y',    // $60  — 2 sessions
        },
        registration_upfront: null,
        registration_weekly: null,
    },
};

// Two stages: everyone pays a trial fee, and selected players then pay a
// Registration Fee — either upfront at a discount, or weekly by subscription.
export const PAYMENT_OPTIONS = [
    { key: 'trial', label: 'Trial Fee', price: '$30', desc: 'Per player, per session. Charged for each trial session you attend.' },
    { key: 'registration_upfront', label: 'Registration Fee — Upfront', price: 'TBC', desc: 'Paid once for the full season, at a discount on the weekly rate. Selected players only.' },
    { key: 'registration_weekly', label: 'Registration Fee — Weekly', price: '$30 / week', desc: 'Ongoing weekly subscription for your squad place. Selected players only.' },
];

// What a player can sign up for, driving the form dropdown and the modal.
// 'trial' needs session selection; the registration options are flat links.
export const SIGNUP_TYPES = [
    {
        key: 'trial',
        label: 'Trial — get assessed',
        short: 'Trial',
        linkKey: 'trial',
        needsSessions: true,
        selectedOnly: false,
        note: 'Book your trial session and pay the $30 per-session fee.',
    },
    {
        key: 'registration_upfront',
        label: 'Registration Fee — Upfront (discounted)',
        short: 'Registration Fee (Upfront)',
        linkKey: 'registration_upfront',
        needsSessions: false,
        selectedOnly: true,
        note: 'For selected players. One discounted payment for the season.',
    },
];

export const getSignupType = (key) => SIGNUP_TYPES.find((t) => t.key === key);

// Trial pricing.
export const TRIAL_PRICE = 30;

// PLACEHOLDER — replace with the real upfront figure and its saving.
export const REGISTRATION_WEEKLY_PRICE = 30;
export const REGISTRATION_UPFRONT_PRICE = null;   // e.g. 1100
export const REGISTRATION_UPFRONT_NOTE = 'Discounted rate — final figure confirming shortly.';

export const getCentre = (slug) => CENTRES.find((c) => c.slug === slug);
export const getTrialSessions = (slug) => getCentre(slug)?.trialSessions || [];
export const getMaxTrialSessions = (slug) => getCentre(slug)?.maxTrialSessions || 0;

// Resolves the Stripe link for a centre/type. Trial links are keyed by the
// number of sessions; everything else is a single link. Null until set.
export const resolvePaymentLink = (centre, type, sessions = 1) => {
    const entry = PAYMENT_LINKS[centre]?.[type];
    if (!entry) return null;
    if (typeof entry === 'object') return entry[sessions] || null;
    return entry;
};

// ── Who the squads are built for ──
export const AUDIENCE = [
    {
        title: 'In the pathway, aiming at T20',
        body: 'Players aged 10–19 currently in the traditional pathway who are looking to build a career in T20 cricket.',
    },
    {
        title: 'Past 19, still chasing it',
        body: 'Players over 19 who are still seeking outstanding opportunities in T20 cricket.',
    },
    {
        title: 'Rebuilding a trajectory',
        body: 'Players who have dropped out of the pathway through injury or other reasons, and are looking to reignite it.',
    },
    {
        title: 'Built for the short format',
        body: 'Players whose skillset is heavily suited to T20 cricket, whatever a selection panel has decided so far.',
    },
];

// ── What a squad place opens up ──
export const OPPORTUNITIES = [
    'Exposure within the global T20 ecosystem',
    'Opportunities for selection as a training partner at the Paarl Royals and Barbados Royals',
    'Invitational training opportunities within the Rajasthan Royals system and beyond',
    'Invitation to small group camps at the Rajasthan Royals High Performance Centre in Nagpur, home of the Royals and their coaching staff',
    'Player data and vision analysed throughout the year by Rajasthan Royals coaching staff',
    'Selection opportunity to compete in international Rajasthan Royals Academy fixtures',
];

// ── Proof that the pathway is already moving players ──
export const CASE_STUDIES = [
    {
        stat: '4',
        statLabel: 'Players put forward',
        title: 'Paarl Royals, SA20',
        body: 'Our Rajasthan Royals Academy selection team has put forward four players for consideration as training partners with the Paarl Royals in the SA20.',
    },
    {
        stat: 'USA',
        statLabel: 'Academies',
        title: 'Barbados Royals',
        body: 'Rajasthan Royals Academies based in the USA have sent Academy players as training partners of the Barbados Royals.',
    },
];

// ── What the trial fee buys vs what a squad place buys ──
export const TRIAL_INCLUDES = [
    'Assessment by a Royals accredited Head Coach',
    'Skill assessment across the sessions',
    'Your session at your home centre',
    'A selection outcome by the end of the trial period',
];

export const SELECTED_INCLUDES = [
    'A place in either the North Melbourne or Sth-East Melbourne Performance Squad',
    'Weekly training opportunity with your squad led by your Head Coach',
    'Selection for Power League fixtures staged at various times between Sept 2026 – April 2027',
    'Selection for fixtures against external opposition in showcase games',
    'Rajasthan Royals Academy First XI selection pathway, the peak of the Performance Squads',
    'Ongoing performance feedback from your coaching staff',
    'Royals Group global performance opportunities (High Performance Centre / Franchise Training Partners)',
];

// Selection condition — shown beneath the fee cards and in the FAQ.
export const FINANCIAL_CONDITION =
    'All players must remain financial to be eligible for selection.';

export const PLAYING_ROLES = [
    'Batter',
    'Pace Bowler',
    'Spin Bowler',
    'Batting All-Rounder (Pace)',
    'Batting All-Rounder (Spin)',
    'Bowling All-Rounder (Pace)',
    'Bowling All-Rounder (Spin)',
    'Wicket-Keeper',
    'Wicket-Keeper Batter',
];

// Head Coaches — one per live centre.
export const SQUAD_COACHES = [
    {
        name: 'Alex Lewis',
        role: 'Head Coach — North Melbourne',
        img: '/assets/coaches/alex-lewis.jpg',
        credential: 'Academy Head Coach',
        bio: 'Academy Head Coach and the man leading the North Melbourne Performance Squad out of Mickleham. Alex sets the technical and competitive standard across the Academy, and works with players on building a game that stands up under pressure — not just in the nets, but in the middle.',
    },
    {
        name: 'Alex Thornhill',
        role: 'Head Coach — South-East Melbourne',
        img: '/assets/coaches/alex-thornhill.jpg',
        credential: 'Expert Batting Coach',
        bio: 'South-East Region Head Coach and the Academy’s Expert Batting Coach, based at the Elite Cricket Centre in Cranbourne North. Alex specialises in power hitting and match-day decision making, developing players who can take a game away from the opposition.',
    },
];

// FAQ — DRAFT copy for Andy's review.
export const FAQS = [
    {
        q: 'Who are the Performance Squads for?',
        a: 'Players aged 10 to U21 as of the 2026/27 cricket season, in the current pathway who want to build a T20 career, players still chasing outstanding opportunities in T20 cricket, players rebuilding after injury or time away, and players whose skillset suits short-format cricket. Squads are built around playing standard rather than one age bracket.',
    },
    {
        q: 'How do I get into a squad?',
        a: 'You trial. Register, pay your trial fee, and take part at your nearest centre. Our coaches assess skill, athleticism and attitude, and successful players are offered a squad place once the trial period closes.',
    },
    {
        q: 'What happens at a trial?',
        a: 'Our coaches assess you across batting, bowling and fielding. You will be told where you stand either way — a selection outcome is part of what your trial fee covers.',
    },
    {
        q: 'What does it cost?',
        a: 'Two stages. A $30 trial fee per player per session to be assessed. If you are selected, a Registration Fee for your squad place is required. Nothing beyond the trial fee is paid unless you are offered a place.',
    },
    {
        q: 'What do I get if I am selected?',
        a: 'Weekly training with your squad under a Royals accredited Head Coach, selection for Power League rounds and external fixtures, the First XI pathway, ongoing performance feedback, and access to Royals Group global opportunities including High Performance Centre camps and training partner selection.',
    },
    {
        q: 'Are the global opportunities real?',
        a: 'Yes. Our Rajasthan Royals Academy selection team has put forward four players for consideration as training partners with the Paarl Royals in the SA20, and Royals Academies in the USA have sent players as training partners of the Barbados Royals. Selection is competitive and never guaranteed, but the routes exist and are being used.',
    },
    {
        q: 'When do Performance Squad games start?',
        a: 'Performance Squad games commence in late September for certain age groups, with the remainder following through the season.',
    },
    {
        q: 'Which centres are running squads?',
        a: 'North Melbourne (Mickleham Indoor Sports Centre) and South-East Melbourne (Elite Cricket Centre, Cranbourne North) are live now. West and East Melbourne arrive in 2027.',
    },
];
