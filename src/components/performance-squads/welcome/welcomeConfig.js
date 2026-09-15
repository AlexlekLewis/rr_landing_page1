// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUAD WELCOME — CONFIG
//
// ONE generic page for every selected player, whatever their centre:
//   /performance-squads/welcome
// The player tells us their region in the confirm form, so the page itself
// never names a centre.
//
// SOURCE OF TRUTH for benefits, pricing and membership wording:
//   v8 Performance Squads Membership Overview (Season 2026/27). Don't add
//   claims here that the overview doesn't make.
//
// A value left as null is a detail that isn't confirmed yet. The page shows
// it as "to be confirmed", puts a DRAFT banner across the top listing what is
// missing, and the form saves nothing while the page is a draft. Fill every
// null and the banner goes away.
// ─────────────────────────────────────────────────────────────

export const WELCOME = {
    // ── Still to come ──
    confirmBy: null,        // e.g. 'Friday 25 September'
    paymentLink: null,      // Stripe Payment Link for the Joining Fee
    kitItems: [],           // e.g. ['RRA Melbourne Training Shirt', 'Academy Cap']
    // Stripe link for the uniform at the Performance Squad player price. Selected
    // players order here, NOT through the Academy Shop.
    kitOrderLink: null,

    contactEmail: 'alex.lewis@rramelbourne.com',

    // ── Pricing (Membership Overview — first intake) ──
    pricing: {
        joiningFee: { amount: '$149.95', note: 'One-off, non-refundable. Locks in your place.' },
        squadFee: { amount: '$29.95', per: 'wk', note: 'Charged weekly, in advance.' },
        matchFees: { amount: 'Per match', note: 'Set for each fixture. Covers standard match day costs.' },
        cancel: 'You can cancel at any time. You must be financial to receive member benefits. If payments stop without notice, there is a two-week grace period before your squad place is released.',
    },

    // ── Membership benefits (Membership Overview, 01–06) ──
    benefits: [
        { title: 'Weekly squad training', body: 'Weekly squad training opportunity with the Head Coach and a dedicated squad coach. Training is likely to be Monday nights.' },
        { title: '5–10 T20 match days', body: 'Circa. average 1 a month from September to April (Season). Performance dependant.' },
        { title: '2 x squad sessions with Siddhartha Lahiri', body: 'Other Royals and guest coaches and players will join from time to time (online and in person).' },
        { title: 'Royals High Performance Centre camps', body: 'Invitation to attend multiple Rajasthan Royals operated camps at the Royals High Performance Centre in Nagpur.' },
        { title: 'Train with Royals Franchise teams', body: 'Select players receive the opportunity to train with Royals Franchise teams.' },
        { title: 'Global Royals Inter-Academy matches', body: 'Opportunity to play in Global Royals Inter-Academy matches and tournaments.' },
    ],

    squadDna: {
        ages: '10 – 25',
        body: 'Squads and teams are selected on a mixture of age, ability, physical maturity, experience, performance and other key criteria.',
        highlight: 'Age is not a limiting factor.',
    },

    selection: {
        body: 'Squad players are eligible for selection in Royals Academy matches — Power League and External Showcase.',
        note: "Selection is at the coaching staff's discretion. Not every player plays every game.",
    },

    // Year-round membership: what staying financial unlocks.
    memberPricing: {
        lead: 'Financial members receive special member pricing on our programs.',
        body: 'Members can choose to continue membership all year round. This holds your squad place, maintains member pricing and accumulates fees against other Academy programs, including:',
        programs: [
            { name: '12-week T20 Program', when: 'Flagship · April – July' },
            { name: 'Pre-Season Program', when: 'Dates to be confirmed' },
            { name: 'High Performance Centre Tour', when: 'September' },
            { name: 'Royals apparel and Partner Offers', when: 'Year round' },
        ],
        note: 'Full pricing on request.',
    },

    // ── Training and events (NOT match days — those are the fixture list) ──
    season: {
        firstTraining: { year: 2026, date: 'Monday 5 October', time: null },
        sidSessions: { year: 2026, when: 'Early October' },
    },

    // ── Power League fixture list ──
    fixtures: [
        { year: 2026, date: 'Sunday 11 October', first: true, venueAndTime: null },
        { year: 2026, date: 'Sunday 15 November' },
        // Standing rule: 24 January is always shown as the Australia Day long weekend.
        { year: 2027, date: 'Sunday 24 January', note: 'Australia Day long weekend' },
        { year: 2027, date: 'Sunday 7 March' },
        { year: 2027, date: 'Sunday 4 April' },
    ],
    moreFixtures: 'More Power League and Showcase Match dates will be added. We will let you know as they are confirmed.',

    // Kept OUT of the fixture list on purpose: only players who get an
    // offer can play, and the offer is sent separately.
    septemberGames: {
        dates: 'Monday 28 and Tuesday 29 September',
        venue: 'North Balwyn Cricket Club, Macleay Park',
    },

    letter: {
        from: 'Alex Lewis',
        title: 'Head Coach and Director of Cricket',
        paragraphs: [
            'Our Royals Academy family in Melbourne has grown to more than 500 players across all our programs in 7 months. We had a huge response to the Performance Squad trials, and you are one of the players we selected.',
            'I have worked in cricket academy programs for more than 20 years. At the Royals, we believe this program is the most important part of how a player gets better.',
            'Playing as well in a match as you do in the nets is one of the hardest things in cricket. This program helps you build the skills to do it.',
            'Every session and every match is a chance to learn. We want you to be brave, try new things and back yourself. At the Royals, we say "Courage over comfort." It means being brave, even when something feels hard.',
        ],
    },
};

// The region a player was selected in. Saved to centre_slug / venue_name so a
// confirmation is identifiable at a glance. Same slugs the trial tables use.
export const REGIONS = [
    { slug: 'north-melbourne', name: 'North Melbourne', venue: 'Mickleham Indoor Sports Centre' },
    { slug: 'south-east-melbourne', name: 'South-East Melbourne', venue: 'Elite Cricket Centre, Cranbourne North' },
];

export const SID = {
    name: 'Sid Lahiri',
    photo: '/assets/coaches/siddhartha-lahiri.jpg',
};

export const PLAYER_IMAGE = '/assets/performance-squads/selected-player-fist-pump.png';

// Every detail the page still needs before it can go to families.
export const getMissingDetails = (c) => {
    const missing = [];
    if (!c.confirmBy) missing.push('confirm-by date');
    if (!c.season?.firstTraining?.time) missing.push('first training time');
    if (!c.fixtures?.find((m) => m.first)?.venueAndTime) missing.push('first match venue and time');
    if (!c.paymentLink) missing.push('Joining Fee payment link');
    if (!c.kitItems?.length) missing.push('kit list');
    if (!c.kitOrderLink) missing.push('kit order link');
    return missing;
};
