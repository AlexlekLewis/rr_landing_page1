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
// MARKETPLACE (Andy, 18 Nov 2026): the page shows NO prices and NO coach hierarchy. It sells
// the benefits and the coaches. The price appears only once a family has chosen a coach and
// is booking times (the booking form). TIER_PRICES still sets each coach's price behind that.
//
// STATUS: PREVIEW ONLY. Hidden route, noindex, not on the nav, the home page,
// What's On, the sitemap or programs_config. Families choose the coach's times and pay at
// booking (Stripe, server checkout).
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
    // No city in general copy (Andy, 18 Nov 2026: "we will soon be in Perth and Brisbane").
    // Name a city only where it is specific, e.g. a centre's address.
    eyebrow: 'Rajasthan Royals Academy · Private Coaching',
    h1: ['Royals', 'Private Coaching'],
    // No tagline under the title (Andy, 18 Nov 2026: removed "One coach. Your player. Every ball measured.").
    lead:
        'Private cricket coaching with a Rajasthan Royals Academy coach, and all of '
        + 'the Academy’s technology in the lane with you: the Match Centre, fielding heat maps and '
        + 'bowling maps. Train one-to-one, or bring a training partner and share the price.',
    // Who it's for (Andy, 18 Nov 2026), a ticked list like Junior Royals' "perfect for".
    forTitle: 'Royals Private Coaching is perfect for players who:',
    forList: [
        'Want a personal approach to coaching',
        'Take their cricket seriously and want to keep getting better',
        'Want more than cones, balls and stumps',
        'Want to see and understand their own game, with real data',
        'Want to learn the Royals way, from Royals Academy coaches, with Royals technology',
        'Want to train alongside a teammate and push each other',
    ],
    facts: [
        { label: 'Format', value: 'One-to-one, or bring a training partner' },
        { label: 'Coaches', value: 'Royals Academy coaches, trained on all our tools' },
        { label: 'Where', value: 'Cranbourne North · Hallam · Mickleham · Ravenhall' },
        { label: 'Now', value: 'Bookings open, including our new West Centre' },
    ],
    cta: 'Book Your Coach',
    secondary: 'See Coaches & Times',
};

// ("What we believe: players learn best with other players" section removed, Andy 20 Nov 2026.)

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
            caption: 'Setting a live field in the Match Centre.',
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
        'A full hour with a Royals Academy coach, one lane',
        'A baseline first, then progress compared session to session',
        'A plan to take home: the one or two things to practise',
    ],
};

// ── HOW: the steps from booking to first session ──────────
export const STEPS = [
    { key: 'coach', title: 'Choose your coach', body: 'Pick your preferred location, then tap a Royals Academy coach to see their profile and times.' },
    { key: 'pay', title: 'Pick your times and pay', body: 'Choose 1-to-1 or 1-to-2 and 1, 3 or 5 sessions from the coach’s rate card, pick their times, and pay securely by card.' },
    // Andy, 18 Nov 2026: after payment the booking goes to the coach, who confirms the times
    // and is the family's contact from then on, unless there are significant changes or issues.
    { key: 'confirm', title: 'Your coach confirms', body: 'Your booking goes straight to your coach, who gets in touch to confirm your times. From then on they’re your main contact, unless there’s a big change or issue.' },
    { key: 'train', title: 'Train with the tools', body: 'Your first session sets a baseline. Every session after works the plan and tracks the progress.' },
]

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

// EACH COACH HAS THEIR OWN RATE CARD (Andy, 18 Nov 2026: "each coach is going to basically
// have their own rate card", with a 1-to-1 and a 1-to-2 option). A family opens a coach's
// profile, taps one option (1-to-1 or 1-to-2, 1, 3 or 5 sessions) and pays that price.
// Per session, incl. GST. A coach not listed here uses their coach type's 1-to-1 prices
// for BOTH options. TODO Andy: the 1-to-2 prices (and any coach-specific 1-to-1 prices).
//   'alex-thornhill': { '1-1': { 1: 180, 3: 170, 5: 160 }, '1-2': { 1: 200, 3: 190, 5: 180 } },
export const RATE_CARDS = {
    // Andy, 20 Nov 2026: Alex Thornhill is the first coach with his own card. Same price per
    // session whether a family books 1, 3 or 5 (no pack discount for now).
    'alex-thornhill': {
        '1-1': { 1: 155, 3: 155, 5: 155 },
        '1-2': { 1: 190, 3: 190, 5: 190 },
    },
    // Andy, 20 Nov 2026: Rittin, Ikroop, Mihiraj and Siddharth: 1-to-1 $145, training partner $170.
    ...Object.fromEntries(['rittin-raman', 'ikroop-dhanoa', 'mihiraj-jayasekara', 'siddharth-banerjee'].map((slug) => [slug, {
        '1-1': { 1: 145, 3: 145, 5: 145 },
        '1-2': { 1: 170, 3: 170, 5: 170 },
    }])),
};

// Andy, 20 Nov 2026: 1-to-2 is called a "training partner session".
export const FORMAT_LABELS = { '1-1': '1-to-1', '1-2': 'Training partner session' };
export const FORMAT_BLURBS = {
    '1-1': 'One coach, your player. The whole session is theirs.',
    '1-2': 'One coach, your player and a training partner (1-to-2).',
};

export const rateCardFor = (coach) => {
    if (!coach) return null;
    if (RATE_CARDS[coach.slug]) return RATE_CARDS[coach.slug];
    const base = TIER_PRICES[coach.tier];
    return base ? { '1-1': base, '1-2': base } : null;
};
// Price per session for one coach, option and package (incl. GST), or null.
export const coachPrice = (coach, format, sessions) => rateCardFor(coach)?.[format]?.[sessions] ?? null;
export const coachTotal = (coach, format, sessions) => {
    const p = coachPrice(coach, format, sessions);
    return p == null ? null : p * sessions;
};
export const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

// PAYMENT (Andy, 18 Nov 2026): families pay at booking through the site's own Stripe
// checkout (api/private-coaching-checkout.js), priced on the server from TIER_PRICES above.
// No Stripe Payment Links are needed. 1-to-2: the booker pays the whole session price and
// the two families settle up between themselves; the second player completes their own
// form (governance + shirt) before the first session (/private-coaching-premium/partner).

// ── WHAT: the three coach tiers (draft copy, Andy to review) ───
// Shown as Elite Coach / Performance Coach / Academy Coach, never "Tier 1/2/3"
// (Andy, 18 Nov 2026: tier numbers "could be a little bit derogatory"). The keys stay
// head / performance / academy. "Head Coach" is Alex Thornhill's own title (Head Coach
// of our South-East Region), not the name of the Elite Coach group.
export const TIERS = [
    {
        key: 'head',
        greatFor: ['Players pushing for representative or Premier Cricket selection', 'Players who want the most experienced eye on their game', 'Serious players of any age'],
        plain: 'Our most experienced coaches',
        name: 'Elite Coach',
        body: 'Our most experienced coaches, including the people who lead our regions, design our programs and develop our other coaches. They coach every part of the game.',
        bestFor: 'Players who want the most experienced eye on their game, or are pushing for representative and Premier Cricket selection.',
    },
    {
        key: 'performance',
        greatFor: ['Players who want a specialist who still plays at a high level', 'Sharpening one skill: batting, spin, pace or keeping', 'Teenagers stepping up into senior cricket'],
        plain: 'Current Premier Cricket players',
        name: 'Performance Coach',
        body: 'Current Premier Cricket players with state and national pathway experience. Each brings a specialist skill, and coaches the whole game around it.',
        bestFor: 'Players who want a specialist who is still playing at a high level.',
    },
    {
        key: 'academy',
        greatFor: ['Younger players', 'Building good habits through regular sessions', 'Training 1-to-2 with a friend'],
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
// Harkirat Bajwa and Alex Lewis removed from private coaching (Andy, 20 Nov 2026).
// STILL DRAFT (not confirmed by Andy): Ikroop Performance Coach, Rittin
// Academy Coach. Kavya Khatri has no coach type yet.
const ALL_ASPECTS = 'Coaches all aspects of the game: batting, bowling, fielding and match play.';

export const COACHES = [
    {
        slug: 'alex-thornhill',
        focus: ['batting'], // for the "what to work on" filter
        name: 'Alex Thornhill',
        centres: ['cranbourne-north', 'hallam'], // Hallam added Andy 20 Nov 2026: same coaches as Cranbourne North
        tier: 'head',
        role: 'Head Coach, South-East Region',
        specialism: 'Batting specialist',
        img: '/assets/coaches/alex-thornhill.jpg',
        bio: 'Head Coach of our South-East Region and a batting specialist, with coaching experience in UK county cricket and the Australian premier system. He coaches the cricket program at Xavier College and within the Fitzroy Doncaster Academy.',
    },
    {
        slug: 'siddharth-banerjee',
        name: 'Siddharth Banerjee',
        centres: ['cranbourne-north', 'hallam'], // Hallam added Andy 20 Nov 2026: same coaches as Cranbourne North
        tier: 'performance', // Andy, 18 Nov 2026
        role: 'Performance Coach',
        specialism: null, // TODO Andy
        img: null, // TODO: headshot
        bio: null, // TODO Andy
    },
    {
        // Added Andy, 20 Nov 2026 (Mickleham). Profile from his coaching CV; no contact
        // details or referees on the page. TODO Andy: coach type (sets his rate card) and
        // headshot file (to go on the HALLA BOL! wall like the others).
        slug: 'mihiraj-jayasekara',
        name: 'Mihiraj Jayasekara',
        centres: ['mickleham'],
        tier: null, // TODO Andy: Elite, Performance or Academy Coach (no price until set)
        focus: ['batting'],
        role: 'Royals Academy Coach',
        specialism: 'Batting specialist',
        img: '/assets/coaches/mihiraj-jayasekara-halla.jpg',
        bio: 'A high-performance cricket coach with more than 25 years of coaching in Australia, England, India, Sri Lanka, the UAE and Nepal. He has been head coach of academies in the UAE, India and Nepal, coached First XI batting at leading Sri Lankan schools, and now coaches batting at Strathmore Cricket Club in Melbourne.',
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
        img: '/assets/coaches/hamid-qadri-halla.jpg', // Andy's photo, Royals training shirt + HALLA BOL! wall
        bio: null, // TODO Andy: two lines (playing and coaching background)
    },
    {
        slug: 'kavya-khatri',
        name: 'Kavya Khatri',
        centres: ['ravenhall'],
        tier: null, // TODO Andy
        role: 'Royals Academy Coach',
        specialism: null, // TODO Andy
        img: null, // TODO: headshot
        bio: null, // TODO Andy
    },
].map((c) => ({ focus: [], ...c, allAspects: ALL_ASPECTS, bookable: !!(RATE_CARDS[c.slug] || TIER_PRICES[c.tier]) }));

// ── WHERE: the three centres ──────────────────────────────
// Cranbourne North address = the Academy Shop pickup list (Alex, 5 Oct 2026).
// TODO Andy: confirm Medley Drive (older pages show 8-9 Becon Ct, Hallam).
// West Centre (M9 Sports Centre, Ravenhall): bookings open now (Andy, 17 Nov 2026).
export const CENTRES = [
    {
        slug: 'cranbourne-north',
        near: 'Narre Warren, Berwick, Cranbourne, Clyde North',
        name: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        city: 'Melbourne', // for when Perth and Brisbane centres are added
        region: 'South-East',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
        note: 'Close to Hallam, Narre Warren and Berwick.',
    },
    {
        // Added Andy, 20 Nov 2026: same coaches as Cranbourne North. Address confirmed by
        // Andy, 20 Nov 2026.
        slug: 'hallam',
        near: 'Dandenong, Endeavour Hills, Doveton, Narre Warren',
        name: 'Elite Cricket Centre',
        suburb: 'Hallam',
        city: 'Melbourne',
        region: 'South-East',
        address: '8-9 Becon Ct, Hallam VIC 3803',
        note: 'Our South-East centre in Hallam.',
    },
    {
        slug: 'mickleham',
        near: 'Craigieburn, Kalkallo, Donnybrook, Greenvale',
        name: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        city: 'Melbourne',
        region: 'North',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
        note: 'The Academy’s high-performance home in the north.',
    },
    {
        slug: 'ravenhall',
        near: 'Caroline Springs, Deer Park, Derrimut, Truganina',
        name: 'M9 Sports Centre',
        suburb: 'Ravenhall',
        city: 'Melbourne',
        region: 'West · our West Centre',
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

// (No FAQ: the Questions section was removed, Andy 18 Nov 2026.)

// ── Success page ─────────────────────────────────────────
export const SUCCESS = {
    title: 'You’re booked',
    paid: 'Payment received. Your coach has been told and will be in touch. Each session is subject to lane availability at the centre and our confirmation.',
    unpaid: 'We haven’t received your payment yet. If you closed the payment page, please book again: your times are held for 30 minutes.',
    partnerTitle: 'Your training partner needs to complete their form',
    partnerBody: 'Before the first session, the other player’s family must fill in a short form: their details, our agreements and consent, and the training shirt. Send them this link.',
};
