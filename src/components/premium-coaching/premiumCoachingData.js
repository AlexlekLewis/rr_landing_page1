// ============================================================
// premiumCoachingData.js: every fact and line of copy for the premium
// Royals Private Coaching page (/private-coaching-premium).
//
// Brief: Andy, 13 Nov 2026. A PREMIUM private coaching offer where the coach uses
// all of the Academy's tech in the lane: the Match Centre, fielding heat maps,
// bowling maps. Priced ABOVE ordinary private coaching. Three coach tiers, all
// under the Royals brand. Three centres.
//
// Andy, 17 Nov 2026:
//   • Formats are 1:1 and 1:2 ONLY, at the SAME price ("the ability to do 1:2 to
//     share the price"). No 1:3.
//   • Tier 1 = $180 for 1 session, $170 a session for 3, $160 a session for 5.
//   • Tier 1: Alex Thornhill (Head Coach of our South-East Region), Hamid Qadri
//     (West), Alex Lewis (North AND West). Tier 3: Jinang Shah (West only from 18 Nov).
//   • A coach NEVER has private sessions at two centres on the same night.
//   • Show each coach's availability, mirrored live from the coach portal; once
//     paid, sessions are subject to lane availability and confirmation.
//   • West bookings are open now.
//   • Message: we believe players learn best working with other players.
//
// STATUS: PREVIEW ONLY. Hidden route, noindex, not on the nav, the home page,
// What's On, the sitemap or programs_config. Stripe links are coming from Andy;
// until they are in PAYMENT_LINKS the form takes a booking REQUEST (nothing charged).
//
// Everything marked TODO is a fact we don't have yet. Don't invent it.
//
// The older Mickleham private coaching page (/mickleham, Alex, Jul–Aug 2026,
// $130/$160 an hour) lives in components/private-coaching and is untouched.
// ============================================================

export const ROUTE = '/private-coaching-premium';
export const SUCCESS_ROUTE = `${ROUTE}/success`;
export const DB_TABLE = 'premium_private_coaching_requests';
export const AVAILABILITY_VIEW = 'private_coaching_open_slots';
export const PROGRAM_NAME = 'Royals Private Coaching';
export const FORM_ANCHOR = 'request';

// ── The one-line belief (Why) ──────────────────────────────
export const HERO = {
    eyebrow: 'Royals Private Coaching · Melbourne',
    h1: ['Royals', 'Private Coaching'],
    why: 'One coach. Your player. Every ball measured.',
    lead:
        'Private cricket coaching in Melbourne with a Rajasthan Royals Academy coach, and all of '
        + 'the Academy’s technology in the lane with you: the Match Centre, fielding heat maps and '
        + 'bowling maps. Train one-to-one, or bring a training partner and share the price.',
    // Who it's for (Andy, 18 Nov 2026), a ticked list like Junior Royals' "perfect for".
    forTitle: 'Royals Private Coaching is perfect for players who:',
    forList: [
        'Take their cricket seriously and want to keep getting better',
        'Want more than cones, balls and stumps',
        'Want to see and understand their own game, with real data',
        'Want to learn the Royals way, from Royals coaches, with Royals technology',
        'Want to train alongside a teammate and push each other',
    ],
    facts: [
        { label: 'Format', value: '1-to-1 or 1-to-2, same price' },
        { label: 'Price', value: 'From $120 a session incl. GST' },
        { label: 'Where', value: 'Cranbourne North · Mickleham · Ravenhall' },
        { label: 'Now', value: 'Bookings open, including our new West Centre' },
    ],
    cta: 'Book Your Coach',
    secondary: 'See Coaches & Times',
};

// The belief Andy wants carried through the page (17 Nov 2026).
export const TOGETHER = {
    eyebrow: 'What we believe',
    title: 'Players learn best with other players.',
    body: [
        'We believe cricketers improve fastest when they train alongside someone else. They watch, '
        + 'they compete, they push each other, and they learn from each other’s mistakes as much as their own.',
        'So 1-to-2 costs the same as 1-to-1. Bring a teammate, a friend or a sibling at a similar level, '
        + 'share the price, and both players get the coach, the technology and the data.',
    ],
};

// ── HOW: the tools in the lane (Andy, 18 Nov 2026: the "Not just a lesson" section and
// the tech section said the same thing twice, so they are ONE section now, built on the
// "tools in the lane" version, with a visual for every tool). `visual` picks what shows:
//   photo:<path>  a real frame from our own footage
//   bowling-map / heat-map  an illustrated EXAMPLE (TechVisuals.jsx), labelled as one
export const TECH = {
    eyebrow: 'The tools in the lane',
    title: 'Not just a lesson. A coach with data.',
    intro:
        'In most private lessons the coach watches, and tells you what they saw. Here the coach '
        + 'watches, then shows you: where every ball pitched, where every shot went, and how it '
        + 'compares with last week. Our squads use these tools in groups. In private coaching the '
        + 'coach uses them on your player, every session.',
    items: [
        {
            key: 'match-centre',
            title: 'Match Centre',
            body: 'Our iPad match-up tool. The coach sets the field, the scenario and the ground size, then your player plays it in the lane.',
            more: 'It turns a net session into a match. A batter learns where the gaps are against a real field. A bowler learns which ball to bowl to which field. Players in our elite programs use it in every Execute phase.',
            visual: 'photo:/assets/premium-coaching/tech-match-centre.jpg',
            caption: 'Setting a live field in the Match Centre, Melbourne.',
        },
        {
            key: 'bowling-maps',
            title: 'Bowling maps',
            body: 'Every ball your player bowls, plotted on the pitch: line and length, ball by ball.',
            more: 'A bowler can see their good length, how often they hit it, and what happens when they get tired. It is the same picture the professionals look at after a spell.',
            visual: 'bowling-map',
            caption: 'Example: a bowling map from one spell.',
        },
        {
            key: 'fielding-heat-maps',
            title: 'Heat maps',
            body: 'Where the ball goes. The hot areas show where your player scores, or where catches come to them in the field.',
            more: 'Batters see their scoring areas and the parts of the ground they never reach. Fielders and keepers see where the work is. The coach uses it to choose what to train next.',
            visual: 'heat-map',
            caption: 'Example: a batter’s scoring areas.',
        },
        {
            key: 'performance-partners',
            title: 'Performance Partners',
            body: 'Full Track AI measures ball speed, swing and spin from video. Str8bat measures bat speed and the bat’s path through the ball.',
            more: 'The coach chooses which tool to use and when. Players see the numbers straight away, in the lane, and can compare them session to session.',
            visual: 'photo:/assets/premium-coaching/tech-fulltrack.jpg',
            caption: 'Full Track AI in our lanes: swing, spin and speed on every ball.',
            logos: [
                { name: 'Full Track AI', src: '/assets/powergame/partners/full-track-ai.png' },
                { name: 'Str8bat', src: '/assets/str8bat-logo.png' },
            ],
        },
    ],
    // What every session includes, beyond the tools above.
    every: [
        'A full hour with a Royals coach, one lane',
        'A baseline first, then progress compared session to session',
        'A plan to take home: the one or two things to practise',
    ],
};

// ── HOW: the steps from booking to first session ──────────
export const STEPS = [
    { title: 'Choose your coach', body: 'Pick a centre and a coach, see their open times, and choose 1, 3 or 5 sessions, 1-to-1 or 1-to-2.' },
    { title: 'Pick your times and pay', body: 'Choose the sessions you want from the coach’s live availability, then pay securely.' },
    { title: 'We confirm your lane', body: 'Our team confirms each session once the lane is booked at the centre. If a time can’t be confirmed, we offer the nearest one.' },
    { title: 'Train with the tools', body: 'The first session sets a baseline. Every session after works the plan, checks the data, and ends with the next thing to practise.' },
];

// Shown beside the availability and again before payment (Andy, 17 Nov 2026).
export const AVAILABILITY_NOTE =
    'Times shown are the coach’s availability, updated weekly. Once paid, each session is subject to '
    + 'lane availability at the centre and confirmation of the sessions you selected.';

// ── WHAT: formats (Andy, 17 Nov 2026: only 1:1 and 1:2, same price) ──
export const FORMATS = [
    { value: '1-1', label: '1-to-1', title: 'One coach, one player', body: 'The whole session, every ball, on your player.' },
    { value: '1-2', label: '1-to-2', title: 'One coach, two players', body: 'Same price, shared between two families. Train with a teammate or a sibling at a similar level, and both players get the data.', recommended: true },
];

// ── WHAT: packages and prices (GST-inclusive; the page labels every price "incl. GST") ──
// Tier 1 set by Andy, 17 Nov 2026. 1:2 is the SAME price as 1:1, shared by the two
// families (shown as "each" = half). TODO Andy: confirm the split, and whether each
// family pays its half or one family pays the whole session.
export const PACKAGES = [
    { sessions: 1, label: '1 session' },
    { sessions: 3, label: '3 sessions' },
    { sessions: 5, label: '5 sessions' },
];

export const TIER_PRICES = {
    head: { 1: 180, 3: 170, 5: 160 }, // per session, incl. GST
    performance: { 1: 160, 3: 150, 5: 140 }, // Andy, 18 Nov 2026
    academy: { 1: 140, 3: 130, 5: 120 }, // Andy, 18 Nov 2026
};

export const perSession = (tier, sessions) => TIER_PRICES[tier]?.[sessions] ?? null;
export const packageTotal = (tier, sessions) => {
    const p = perSession(tier, sessions);
    return p == null ? null : p * sessions;
};
export const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

// Stripe Payment Links (Andy is creating them). CLAUDE.md: every package needs a PAIR,
// `withShirt` (training shirt locked at quantity 1) for families who answer "No", and
// `noShirt` for "Yes". Add both plink_ ids to PAYMENT_LINK_PROGRAMS in
// api/stripe-webhook.js, and set each link's After-payment redirect to
// /private-coaching-premium/success?session_id={CHECKOUT_SESSION_ID}.
// While a pair is null the form saves a booking request and takes no payment.
export const PAYMENT_LINKS = {
    head: {
        1: { withShirt: null, noShirt: null },
        3: { withShirt: null, noShirt: null },
        5: { withShirt: null, noShirt: null },
    },
    performance: {
        1: { withShirt: null, noShirt: null },
        3: { withShirt: null, noShirt: null },
        5: { withShirt: null, noShirt: null },
    },
    academy: {
        1: { withShirt: null, noShirt: null },
        3: { withShirt: null, noShirt: null },
        5: { withShirt: null, noShirt: null },
    },
};
export const paymentLinksFor = (tier, sessions) => {
    const l = PAYMENT_LINKS[tier]?.[sessions];
    return l?.withShirt && l?.noShirt ? l : null;
};

// ── WHAT: the three coach tiers (draft copy, Andy to review) ───
// Shown as Elite Coach / Performance Coach / Academy Coach, never "Tier 1/2/3"
// (Andy, 18 Nov 2026: tier numbers "could be a little bit derogatory"). The keys stay
// head / performance / academy. "Head Coach" is Alex Thornhill's own title (Head Coach
// of our South-East Region), not the name of the Elite Coach group.
export const TIERS = [
    {
        key: 'head',
        plain: 'Our most experienced coaches',
        name: 'Elite Coach',
        body: 'Our most experienced coaches, including the people who lead our regions, design our programs and develop our other coaches. They coach every part of the game.',
        bestFor: 'Players who want the most experienced eye on their game, or are pushing for representative and Premier Cricket selection.',
    },
    {
        key: 'performance',
        plain: 'Current Premier Cricket players',
        name: 'Performance Coach',
        body: 'Current Premier Cricket players with state and national pathway experience. Each brings a specialist skill, and coaches the whole game around it.',
        bestFor: 'Players who want a specialist who is still playing at a high level.',
    },
    {
        key: 'academy',
        plain: 'Young coaches, great with younger players',
        name: 'Academy Coach',
        body: 'Talented young cricketers who coach in our programs every week. Trained on all of our tools and systems, and close in age to the players they coach.',
        bestFor: 'Younger players, and anyone building good habits through regular sessions.',
    },
];

// ── WHAT: the coaches ────────────────────────────────────
// Spelling follows the names already published on the site (Power Game,
// Master Landing Page): Harkirat Bajwa, Ikroop Dhanoa, Rittin Raman.
//
// `centres` is a list: a coach can work at more than one centre, but NEVER at two
// centres on the same night (enforced in the database, see the availability migration).
// `bookable` is true when the coach has a tier with prices (Tier 1 today).
//
// HEADSHOTS (Andy, 13 Nov 2026): every photo is on the pink HALLA BOL! media wall.
// The *-halla.jpg files are the original headshots cut out and placed on that wall.
//
// STILL DRAFT (not confirmed by Andy): Harkirat and Ikroop Performance Coach, Rittin
// Academy Coach. Kavya Khatri has no coach type yet.
const ALL_ASPECTS = 'Coaches all aspects of the game: batting, bowling, fielding and match play.';

export const COACHES = [
    {
        slug: 'alex-thornhill',
        focus: ['batting'], // for the "what to work on" filter
        name: 'Alex Thornhill',
        centres: ['cranbourne-north'],
        tier: 'head',
        role: 'Head Coach, South-East Region',
        specialism: 'Batting specialist',
        img: '/assets/coaches/alex-thornhill.jpg',
        bio: 'Head Coach of our South-East Region and a batting specialist, with coaching experience in UK county cricket and the Australian premier system. He coaches the cricket program at Xavier College and within the Fitzroy Doncaster Academy.',
    },
    {
        slug: 'harkirat-bajwa',
        focus: ['bowling'], // for the "what to work on" filter
        name: 'Harkirat Bajwa',
        centres: ['cranbourne-north'],
        tier: 'performance', // DRAFT
        role: 'Performance Coach',
        specialism: 'Spin bowling specialist (off spin)',
        img: '/assets/coaches/harkirat-bajwa-halla.jpg',
        bio: 'Played for Australia at the Under-19 World Cup and plays Premier Cricket. An attacking off spinner who teaches the variations and tactics that win matches.',
    },
    {
        slug: 'siddharth-banerjee',
        name: 'Siddharth Banerjee',
        centres: ['cranbourne-north'],
        tier: 'performance', // Andy, 18 Nov 2026
        role: 'Performance Coach',
        specialism: null, // TODO Andy
        img: null, // TODO: headshot
        bio: null, // TODO Andy
    },
    {
        slug: 'alex-lewis',
        focus: ['bowling'], // for the "what to work on" filter
        name: 'Alex Lewis',
        centres: ['mickleham', 'ravenhall'], // Andy, 17 Nov: North, and may also coach in the West
        tier: 'head',
        role: 'Director of Cricket · Academy Head Coach',
        specialism: 'Bowling specialist (pace and spin)',
        img: '/assets/coaches/alex-lewis.jpg',
        bio: 'More than 20 years coaching young cricketers through the representative pathways. Head of Academy and Head Bowling Coach at Fitzroy Doncaster, a Victorian Premier Cricket club, and a Cricket Australia Level 2 coach.',
    },
    {
        slug: 'ikroop-dhanoa',
        focus: ['batting'], // for the "what to work on" filter
        name: 'Ikroop Dhanoa',
        centres: ['mickleham'],
        tier: 'performance', // DRAFT
        role: 'Performance Coach',
        specialism: 'Batting specialist (360° and T20 power)',
        img: '/assets/coaches/ikroop-dhanoa-halla.jpg',
        bio: 'A First XI batter for Essendon in Victorian Premier Cricket and a Victorian pathway player up to Under-19s. He coaches a modern, attacking 360° game.',
    },
    {
        slug: 'rittin-raman',
        focus: ['wicketkeeping', 'batting'], // for the "what to work on" filter
        name: 'Rittin Raman',
        centres: ['mickleham'],
        tier: 'academy', // DRAFT
        role: 'Academy Coach',
        specialism: 'Wicketkeeping specialist',
        img: '/assets/coaches/rittin-raman-halla.jpg',
        bio: 'A wicketkeeper-batter playing First XI cricket for Melbourne Cricket Club, and a state-level representative. High energy and precise with technique.',
    },
    {
        slug: 'jinang-shah',
        name: 'Jinang Shah',
        centres: ['ravenhall'], // Andy, 18 Nov 2026: removed from Mickleham one-to-ones; West only
        tier: 'academy',
        role: 'Academy Coach',
        specialism: null, // TODO Andy: Jinang's specialty
        img: '/assets/coaches/jinang-shah-halla.jpg',
        bio: 'A high-quality cricketer with hands-on experience coaching young and developing players. Jinang coaches in our Junior Royals and holiday programs.',
    },
    {
        slug: 'hamid-qadri',
        name: 'Hamid Qadri',
        centres: ['ravenhall'],
        tier: 'head', // Andy, 17 Nov: Elite Coach, "replicate the Alex Thornhill version"
        role: 'Elite Coach, West Centre', // TODO Andy: Hamid's title
        specialism: null, // TODO Andy: Hamid's specialty
        img: null, // TODO: headshot on the HALLA BOL! wall
        bio: null, // TODO Andy: two lines (playing and coaching background)
    },
    {
        slug: 'kavya-khatri',
        name: 'Kavya Khatri',
        centres: ['ravenhall'],
        tier: null, // TODO Andy
        role: 'Royals Coach',
        specialism: null, // TODO Andy
        img: null, // TODO: headshot
        bio: null, // TODO Andy
    },
].map((c) => ({ focus: [], ...c, allAspects: ALL_ASPECTS, bookable: !!TIER_PRICES[c.tier] }));

// ── WHERE: the three centres ──────────────────────────────
// Cranbourne North address = the Academy Shop pickup list (Alex, 5 Oct 2026).
// TODO Andy: confirm Medley Drive (older pages show 8-9 Becon Ct, Hallam).
// West Centre (M9 Sports Centre, Ravenhall): bookings open now (Andy, 17 Nov 2026).
export const CENTRES = [
    {
        slug: 'cranbourne-north',
        near: 'Hallam, Narre Warren, Berwick, Cranbourne',
        name: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        region: 'South-East Melbourne',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
        note: 'Close to Hallam, Narre Warren and Berwick.',
    },
    {
        slug: 'mickleham',
        near: 'Craigieburn, Kalkallo, Donnybrook, Greenvale',
        name: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        region: 'Northern Melbourne',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
        note: 'The Academy’s high-performance home in the north.',
    },
    {
        slug: 'ravenhall',
        near: 'Caroline Springs, Deer Park, Derrimut, Truganina',
        name: 'M9 Sports Centre',
        suburb: 'Ravenhall',
        region: 'Western Melbourne · our West Centre',
        address: null, // TODO Andy: street address
        note: 'Our new West Centre. Bookings open now.',
        isNew: true,
        badge: 'Bookings open',
    },
];

// The "what does your player want to work on?" filter in the coach finder.
export const FOCUS_FILTERS = [
    { key: 'all', label: 'Everything' },
    { key: 'batting', label: 'Batting' },
    { key: 'bowling', label: 'Bowling' },
    { key: 'wicketkeeping', label: 'Wicketkeeping' },
];

export const coachesAt = (centreSlug) => COACHES.filter((c) => c.centres.includes(centreSlug));
export const coachOf = (slug) => COACHES.find((c) => c.slug === slug);
export const tierOf = (key) => TIERS.find((t) => t.key === key);
export const centreOf = (slug) => CENTRES.find((c) => c.slug === slug);

// ── Form options ─────────────────────────────────────────
export const FOCUS_OPTIONS = [
    { value: 'batting', label: 'Batting' },
    { value: 'pace', label: 'Pace bowling' },
    { value: 'spin', label: 'Spin bowling' },
    { value: 'wicketkeeping', label: 'Wicketkeeping' },
    { value: 'all-round', label: 'All-round' },
    { value: 'not-sure', label: 'Not sure, the coach can advise' },
];

export const LEVEL_OPTIONS = [
    { value: 'starting', label: 'Just starting out' },
    { value: 'junior-club', label: 'Junior club cricket' },
    { value: 'rep', label: 'Representative or pathway squads' },
    { value: 'senior-club', label: 'Senior club cricket' },
    { value: 'premier', label: 'Premier Cricket' },
];

export const MATCH_ME = 'match-me';

// ── FAQ (tap to open) ────────────────────────────────────
export const FAQ = [
    {
        q: 'How is this different from a normal private lesson?',
        a: 'The coach brings the Academy’s technology into the lane: the Match Centre, bowling maps and fielding heat maps, plus our Performance Partners’ tools. Your player doesn’t only hear what to fix. They see it, and they see it improve.',
    },
    {
        q: 'How does 1-to-2 work?',
        a: 'Two players, one coach, one lane, for the same price as 1-to-1. The two families share it. We believe players learn best training with other players, so we make it easy to bring a teammate, a friend or a sibling at a similar level. Tell us their name on the form and we send their family a short form before the first session.',
    },
    {
        q: 'How do the times work?',
        a: 'Each coach marks their availability every week in our coaching portal, and the page shows it as it is updated. When you book, you choose your sessions from the coach’s open times. Once paid, each session is subject to lane availability at the centre and our confirmation. If a time can’t be confirmed, we offer the nearest one.',
    },
    {
        q: 'Which coach should we choose?',
        a: 'Choose by centre first, then by what your player wants to work on: each coach shows their specialty, and every coach covers all aspects of the game. Not sure? Text us with the chat button and we will help you choose.',
    },
    {
        q: 'What ages do you coach?',
        // TODO Andy: confirm the age range for this program.
        a: 'Juniors and senior players. Tell us your player’s age and level on the form and we will match the right coach.',
    },
    {
        q: 'What does my player need to bring?',
        a: 'Their own cricket gear, water, and the Royals Academy training shirt. If they don’t have the shirt yet, you can order it on the form ($29.95 incl. GST) and it is added to the first payment.',
    },
    {
        q: 'What if we need to cancel or move a session?',
        // TODO Andy: notice period and make-up policy.
        a: 'Tell us as early as you can and we will try to move it. Our full cancellation terms are in the Terms & Conditions, and they never remove your rights under Australian Consumer Law.',
    },
];

// ── Success page ─────────────────────────────────────────
export const SUCCESS = {
    title: 'Booking received',
    body: 'Our team will confirm each session once the lane is booked at the centre, usually within two business days.', // TODO Andy: confirm the response time
    nothingPaid: 'Nothing has been charged yet. We will send your payment link with the confirmation.',
    paid: 'Payment received. Your sessions are subject to lane availability and our confirmation.',
};
