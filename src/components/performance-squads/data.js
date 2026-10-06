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
            // Applications closed 6 Sep 2026, the morning of the session. Thursday 10
            // September is the only Mickleham trial still taking bookings; anyone
            // already booked in for today keeps their place.
            { id: 'nm-2026-09-06', label: 'Sunday 6 September · 2:00–4:00 PM', badge: 'Completed', full: true },
            { id: 'nm-2026-09-10', label: 'Thursday 10 September · 8:00–10:00 PM', badge: 'Completed', full: true },
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
            // Both Sunday sessions are now FULL — 6 Sept closed 1 Sep 2026 (37 players
            // booked into 90 minutes), 13 Sept closed 3 Sep 2026. `full` makes a session
            // unselectable on the form; everyone already booked keeps their place.
            { id: 'se-2026-09-06', label: 'Sunday 6 September · 7:00–8:30 PM', badge: 'Completed', full: true },
            { id: 'se-2026-09-11', label: 'Friday 11 September · 8:00–9:30 PM', badge: 'Completed', full: true },
            { id: 'se-2026-09-13', label: 'Sunday 13 September · 7:00–8:30 PM', badge: 'Completed', full: true },
        ],
        // Cranbourne North has fewer lanes — players attend at most 2 of the 3.
        // With both Sundays full, Friday 11 Sept is the only one still bookable; the
        // UI caps the picker at what is actually open rather than at this number.
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

// Age eligibility, SETTLED BY ALEX 26 Sep 2026: 10 to 25 inclusive.
// It was 10 to 24 until then, and the repo held three different ranges. This
// pair is the source of truth for the squads: the copy and both registration
// forms read from it, so the page can never advertise one range while the
// form accepts another. /performance-squads-open-trial keeps its own 16 to 25,
// because that trial is the open age end of this same range.
// The copy on the page AND both registration forms read from here, so the page
// can never advertise one range while the form quietly accepts another. The
// trial takes a $30 payment up front, so an ineligible player has to be stopped
// at the form rather than refunded afterwards.
export const MIN_AGE = 10;
export const MAX_AGE = 25;

// Trial pricing.
export const TRIAL_PRICE = 30;

// ── Membership — Alex, 2 October 2026. ──
// The ONE place this page's membership numbers live. They match the welcome
// page (/performance-squads/welcome) and the Stripe checkout: a one-off $149
// joining fee, then $29.95 a week. Alex's framing for every line of copy: the
// membership is a YEARLY fee, broken down for the family's convenience into a
// weekly payment, and it can be cancelled any time — but cancelling means the
// $149 joining fee is paid again to come back.
export const MEMBERSHIP = {
    joiningFee: 149,       // one-off, non-refundable, paid again to rejoin after cancelling
    weeklyFee: 29.95,      // charged weekly, in advance
    weeksPerYear: 52,
    graceWeeks: 2,         // if payments stop without notice, before the place is released
};
// "two-week" — the grace period in words, as the welcome page says it.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
export const GRACE_PERIOD = `${NUMBER_WORDS[MEMBERSHIP.graceWeeks] || MEMBERSHIP.graceWeeks}-week`;

// Member pricing has two tiers (Alex, 2 October 2026). Programs such as Spin
// Club get the member price while the membership is active. TOURS need a
// minimum period of continuous membership first. Terms & Conditions clause 13
// (/terms-conditions) is the binding version; every page quotes this line.
export const TOUR_MEMBER_MONTHS = 6;
export const TOUR_MEMBER_MONTHS_WORD = NUMBER_WORDS[TOUR_MEMBER_MONTHS] || String(TOUR_MEMBER_MONTHS);
// Counted to the date the TOUR STARTS (Alex, 2 October 2026), not the booking date.
export const MEMBER_PRICING_RULE = `Member pricing applies while your membership is active. For tours, including High Performance Centre tours, you need to have been a member for ${TOUR_MEMBER_MONTHS_WORD} months in a row by the date the tour starts.`;
export const TERMS_ROUTE = '/terms-conditions';
export const TERMS_MEMBERSHIP_CLAUSE = 'clause 13';

// $1,557.40 — worked out, never typed, so it can never disagree with the weekly fee.
export const MEMBERSHIP_YEARLY = Math.round(MEMBERSHIP.weeklyFee * MEMBERSHIP.weeksPerYear * 100) / 100;

// "$149", "$29.95", "$1,557.40" — whole dollars stay whole, anything else shows cents.
export const money = (n) => `$${n.toLocaleString('en-AU', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
})}`;

// What a squad place gives a member. Same six points as the welcome page, in
// the same order, so the promise a family reads before trialling is the promise
// they read when they join.
export const MEMBER_INCLUDES = [
    {
        title: 'Weekly squad training',
        body: 'Train every week at your centre with your Head Coach and a dedicated squad coach, on Monday nights.',
    },
    {
        title: '5 to 10 T20 match days',
        body: 'About one a month from September to April, in the Power League and showcase matches. Selection is based on performance.',
    },
    {
        title: 'Royals and guest coaches',
        body: 'Other Royals and guest coaches and players join from time to time, online and in person.',
    },
    {
        title: 'High Performance Centre camps',
        body: 'Invitations to Royals-run camps at the Rajasthan Royals High Performance Centre in Nagpur.',
    },
    {
        title: 'Train with Royals franchise teams',
        body: 'Select players get the chance to train with Royals franchise teams.',
    },
    {
        title: 'Global inter-academy matches',
        body: 'The chance to play in Global Royals Inter-Academy matches and tournaments.',
    },
];

// Member pricing — the programs a financial member pays less for.
export const MEMBER_PRICING_ON = [
    '12-week T20 Program',
    'Pre-Season Program',
    'Masterclasses',
    'Spin Club',
    'High Performance Centre tours',
    'Royals apparel and partner offers',
];

// PLACEHOLDER — replace with the real upfront figure and its saving.
export const REGISTRATION_WEEKLY_PRICE = 30;
export const REGISTRATION_UPFRONT_PRICE = null;   // e.g. 1100
export const REGISTRATION_UPFRONT_NOTE = 'Discounted rate — final figure confirming shortly.';

export const getCentre = (slug) => CENTRES.find((c) => c.slug === slug);
export const getTrialSessions = (slug) => getCentre(slug)?.trialSessions || [];
export const getMaxTrialSessions = (slug) => getCentre(slug)?.maxTrialSessions || 0;
// A centre is "full" (waitlist-only) when it has trial sessions but every one
// is closed. No sessions at all means "coming soon", not full.
export const isCentreFull = (slug) => {
    const sessions = getTrialSessions(slug);
    return sessions.length > 0 && sessions.every((s) => s.full);
};

// A session marked full can no longer be chosen. Checked in the picker, in the
// toggle handler and again on submit, so a stale id can never sneak through.
export const isSessionFull = (slug, id) =>
    (getTrialSessions(slug).find((x) => x.id === id) || {}).full === true;

// The sessions a player can still book, and how many they can actually pick.
// Once sessions fill, the centre's own cap stops being the real limit — a player
// at a centre with one session left can only choose one, whatever maxTrialSessions
// says. Every "choose up to N" line reads from here so the number on screen is
// always a number the player can reach.
export const getOpenTrialSessions = (slug) =>
    getTrialSessions(slug).filter((x) => x.full !== true);

export const getSelectableSessionCount = (slug) =>
    Math.min(getMaxTrialSessions(slug), getOpenTrialSessions(slug).length);

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
        body: 'Players in the junior age groups now, working towards a career in T20 cricket.',
    },
    {
        title: 'Past the age groups, still chasing it',
        body: 'Players who have come through the junior age groups and are still seeking outstanding opportunities in T20 cricket.',
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

// FAQ — this page only (the open age trial and Sid Juniors pages pass their own).
// Every number here comes from the constants above, so the answers can never
// quote a different fee from the membership section.
export const FAQS = [
    {
        q: 'Who are the Performance Squads for?',
        a: `Players aged ${MIN_AGE} to ${MAX_AGE} who want to build a T20 career: players in the current pathway, players still chasing outstanding opportunities in T20 cricket, players rebuilding after injury or time away, and players whose skillset suits short-format cricket. Squads are built around playing standard rather than one age bracket.`,
    },
    {
        q: 'How do I get into a squad?',
        a: 'Through a trial. Players in our T20 Elite and Pre-Season Programs are also eligible for selection. Trial dates are listed under Trial Dates on this page as soon as they are set. If there is no trial open for your age, register your interest and we will let you know as soon as the next one opens.',
    },
    {
        q: 'When is the next trial?',
        a: 'Check Trial Dates on this page. We post new dates there as soon as they are set. If none are listed for you yet, the dates are still to be confirmed. Register your interest and we will tell you first.',
    },
    {
        q: 'What happens at a trial?',
        a: 'Our coaches assess you across batting, bowling and fielding. You will be told where you stand either way. A selection outcome is part of what your trial fee covers.',
    },
    {
        q: 'What does it cost?',
        a: `A ${money(TRIAL_PRICE)} trial fee per session to be assessed. If you are offered a place, you pay a one-off ${money(MEMBERSHIP.joiningFee)} joining fee, then your membership: a yearly fee of ${money(MEMBERSHIP_YEARLY)}, broken down for your convenience into ${money(MEMBERSHIP.weeklyFee)} a week. Match fees are separate and set for each match.`,
    },
    {
        q: 'Can I cancel my membership?',
        a: `Yes, any time. But if you cancel and later want to come back, you will need to pay the ${money(MEMBERSHIP.joiningFee)} joining fee again. If payments stop without notice, there is a ${GRACE_PERIOD} grace period before your squad place is released.`,
    },
    {
        q: 'When do I get member pricing?',
        a: `While your membership is active, you get member pricing on our programs, such as Spin Club, masterclasses, the 12-week T20 Program and the Pre-Season Program. For tours, including High Performance Centre tours, you get member pricing if you will have been a member for ${TOUR_MEMBER_MONTHS_WORD} months in a row by the date the tour starts. If you cancel before the tour starts, the member discount becomes payable, and if you cancel and rejoin, the ${TOUR_MEMBER_MONTHS_WORD} months start again. The full rules are in ${TERMS_MEMBERSHIP_CLAUSE} of our Terms & Conditions.`,
    },
    {
        q: 'What do I get as a member?',
        a: 'Weekly training with your Head Coach and a squad coach, 5 to 10 T20 match days across the season, Royals and guest coaches from time to time, invitations to High Performance Centre camps, and the chance to train with Royals franchise teams and play Global Royals Inter-Academy matches. Members also get member pricing on our other programs.',
    },
    {
        q: 'Are the global opportunities real?',
        a: 'Yes. Our Rajasthan Royals Academy selection team has put forward four players for consideration as training partners with the Paarl Royals in the SA20, and Royals Academies in the USA have sent players as training partners of the Barbados Royals. Selection is competitive and never guaranteed, but the routes exist and are being used.',
    },
    {
        q: 'When are matches played?',
        a: 'From September to April. Squad players get 5 to 10 T20 match days across the season, about one a month, in the Power League and showcase matches. Selection is at the coaching staff’s discretion, and not every player plays every game.',
    },
    {
        q: 'Which centres are running squads?',
        a: 'North Melbourne (Mickleham Indoor Sports Centre) and South-East Melbourne (Elite Cricket Centre, Cranbourne North) are live now. West and East Melbourne arrive in 2027.',
    },
];
