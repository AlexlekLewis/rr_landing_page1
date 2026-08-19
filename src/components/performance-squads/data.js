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
        trialDates: [], // empty → "Trials Coming Soon" (Mickleham not live for trials yet)
        active: true,
    },
    {
        slug: 'south-east-melbourne',
        name: 'South-East Melbourne',
        venue: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        coach: 'Alex Thornhill',
        coachTitle: 'Head Coach',
        trialDates: [
            'Trial 1 — Sunday 6 September · 7:00–8:30 PM',
            'Trial 2 — Friday 11 September · 8:00–9:30 PM',
            'Trial 3 — Sunday 13 September · 7:00–8:30 PM',
        ],
        active: true,
    },
    // Future squads — displayed as "Coming 2027", not selectable.
    { slug: 'west-melbourne', name: 'West Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialDates: [], active: false },
    { slug: 'east-melbourne', name: 'East Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialDates: [], active: false },
];

export const ACTIVE_CENTRES = CENTRES.filter((c) => c.active);

// Stripe payment links — PASTE LIVE URLs when created in Stripe.
// While null, the pay button shows "Payment link coming soon" and is disabled.
export const PAYMENT_LINKS = {
    'north-melbourne': {
        trial: null,    // e.g. 'https://buy.stripe.com/xxxx'
        games: null,
        annual: null,
    },
    'south-east-melbourne': {
        trial: null,
        games: null,
        annual: null,
    },
};

// Prices confirmed Aug 2026. Stripe links still to come.
export const PAYMENT_OPTIONS = [
    { key: 'trial', label: 'Trial Fee', price: '$15', desc: 'Per session. Charged for each trial session you attend.' },
    { key: 'games', label: 'Match Fee', price: 'Format dependent', desc: 'Match fees vary by format. Confirmed ahead of each fixture.' },
    { key: 'annual', label: 'Annual Fee', price: '$30 / week', desc: 'Ongoing squad fee at your home centre.' },
];

// Selection condition — shown beneath the fee cards and in the FAQ.
export const FINANCIAL_CONDITION =
    'All players must remain financial to be eligible for selection.';

export const PLAYING_ROLES = ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Wicket-Keeper Batter'];

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
        q: 'What is a Performance Squad?',
        a: 'A Performance Squad is the representative arm of the Academy — a group of like-skilled, like-motivated players based at one centre who train together and compete together. Each squad fields a First XI plus additional teams for Power League rounds and fixtures against external opposition.',
    },
    {
        q: 'How do I get into a squad?',
        a: 'Two ways. You either trial at your nearest centre, or you are invited directly by our coaching staff. Both routes lead to the same standard — every player earns their place.',
    },
    {
        q: 'What happens at a trial?',
        a: 'Our coaches assess skill, athleticism and attitude across batting, bowling and fielding. Successful players are offered a squad place shortly after the trial period closes. You will be told either way.',
    },
    {
        q: 'What age groups are the squads for?',
        a: 'Squads are built around playing standard rather than a single age bracket. Register your interest with the player’s age and we will confirm the right group for your centre.',
    },
    {
        q: 'Do I need to be at a club to trial?',
        a: 'No. Club cricketers and non-club players are both welcome to trial. If you are at a club, add it when you register — it helps our coaches with context.',
    },
    {
        q: 'What does it cost?',
        a: 'Three fees. A $15 trial fee per session, match fees which vary by format, and a $30 per week annual fee. All players must remain financial to be eligible for selection.',
    },
    {
        q: 'What is the Power League?',
        a: 'The Power League is the Academy’s own match series — the competitive stage where Performance Squad teams from each centre face off, running from September 2026 through April 2027. Full format, fixtures and standings will be published here.',
    },
    {
        q: 'Which centres are running squads?',
        a: 'North Melbourne (Mickleham Indoor Sports Centre) and South-East Melbourne (Elite Cricket Centre, Cranbourne North) are live now. West and East Melbourne arrive in 2027.',
    },
];
