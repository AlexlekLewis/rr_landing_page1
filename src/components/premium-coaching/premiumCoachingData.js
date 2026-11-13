// ============================================================
// premiumCoachingData.js: every fact and line of copy for the premium
// Royals Private Coaching page (/private-coaching-premium).
//
// Brief: Andy, 13 Nov 2026. A PREMIUM one-to-one (and one-to-two, one-to-three)
// offer where the coach uses all of the Academy's tech in the lane: the Match
// Centre, fielding heat maps, bowling maps. Priced ABOVE ordinary private
// coaching (we don't have to say so on the page, but nothing here should read
// like a budget product). Three price tiers, set by coach, all under the Royals
// brand. Three centres.
//
// STATUS: PREVIEW ONLY. Hidden route, noindex, not on the nav, the home page,
// What's On, the sitemap or programs_config. No payment links yet ("that'll
// come in time"), so the form takes a booking REQUEST: nothing is charged
// online, our team confirms the coach and time, then sends the payment link.
//
// Everything marked TODO is a fact we don't have yet. Don't invent it.
//
// The older Mickleham private coaching page (/mickleham, Alex, Jul–Aug 2026,
// $130/$160 an hour) lives in components/private-coaching and is untouched.
// ============================================================

export const ROUTE = '/private-coaching-premium';
export const SUCCESS_ROUTE = `${ROUTE}/success`;
export const DB_TABLE = 'premium_private_coaching_requests';
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
        + 'bowling maps. One-to-one, or share the lane with one or two friends.',
    facts: [
        { label: 'Format', value: '1-to-1, 1-to-2 or 1-to-3' },
        { label: 'Where', value: 'Cranbourne North · Mickleham · Ravenhall' },
        { label: 'Coaches', value: 'Three tiers of Royals coach' },
        { label: 'Today', value: 'Request your coach. Nothing to pay yet.' },
    ],
    cta: 'Request Your Coach',
    secondary: 'Meet the Coaches',
};

// ── WHY: what makes this different from an ordinary private lesson ──
export const WHY = {
    eyebrow: 'Why it is different',
    title: 'Not just a lesson. A coach with data.',
    body: [
        'In most private lessons the coach watches, and tells you what they saw. Here the coach '
        + 'watches, and then shows you. Where every ball pitched. Where every shot went. What it looks '
        + 'like next to last week.',
        'Every Royals private coach is trained to use the same tools we use in our elite programs. '
        + 'Your player sees their own game on the screen, understands it, and knows what to work on '
        + 'when they leave the lane.',
    ],
    // Benefits, plain words. Each one must stay true at every centre.
    benefits: [
        { title: 'The whole session is yours', body: 'One coach and one lane for your player. Or share it with one or two friends at the same level.' },
        { title: 'Every ball on a map', body: 'Bowling maps show where each ball pitched. Batting and fielding maps show where the ball went.' },
        { title: 'The Match Centre', body: 'The coach sets up a real match scenario on the iPad: the field, the bowler, the ground. Then your player plays it.' },
        { title: 'Progress you can see', body: 'Today next to last month, on the screen. Not just “it feels better”.' },
        { title: 'Choose your coach', body: 'Three tiers of Royals coach, at three centres. Pick one, or ask us to match you.' },
        { title: 'A plan you take home', body: 'You leave each session knowing the one or two things to practise before the next one.' },
    ],
};

// ── HOW: the tech (only tools the Academy already runs; see PartnerStack) ──
export const TECH = {
    eyebrow: 'The tools in the lane',
    title: 'Royals technology, one player at a time',
    intro:
        'Our squads use these tools in groups. In private coaching, the coach uses them on one player, '
        + 'every session.',
    items: [
        {
            key: 'match-centre',
            title: 'Match Centre',
            body: 'Our iPad match-up tool. The coach sets the field, the scenario and the ground size, then shows where the player bowled and where the ball went.',
            more: 'It turns a net session into a match. A batter learns where the gaps are against a real field. A bowler learns which ball to bowl to which field. Players in our elite programs use it in every Execute phase.',
        },
        {
            key: 'fielding-heat-maps',
            title: 'Fielding heat maps',
            body: 'A map of where the ball goes. The hot areas show where the player hits it, or where catches come to them.',
            more: 'Batters see their scoring areas and the parts of the ground they never reach. Fielders and keepers see where the work is. The coach uses it to choose what to train next.',
        },
        {
            key: 'bowling-maps',
            title: 'Bowling maps',
            body: 'Every ball the player bowls, plotted on the pitch: line and length, ball by ball.',
            more: 'A bowler can see their good length, how often they hit it, and what happens when they get tired. It is the same picture the professionals look at after a spell.',
        },
        {
            key: 'performance-partners',
            title: 'Our Performance Partners',
            body: 'Video and ball tracking from Full Track AI, and bat sensor data from Str8bat, when the session calls for it.',
            more: 'Full Track AI measures ball speed and where the ball pitched from video. Str8bat measures bat speed and the bat’s path through the ball. The coach chooses which tool to use and when.',
        },
    ],
};

// ── HOW: the steps from request to first session ──────────
export const STEPS = [
    { title: 'Request your coach', body: 'Choose a centre, a format (1-to-1, 1-to-2 or 1-to-3) and a coach. Or ask us to match you. It takes about three minutes.' },
    { title: 'We confirm your time', body: 'Our team calls or emails you to agree the day and time, and sends you the payment link. Nothing is charged until then.' },
    { title: 'First session: the baseline', body: 'The coach measures where your player is today, with the tools, so every session after it can be compared.' },
    { title: 'Every session after', body: 'Work on the plan, check the data together, and leave with the next thing to practise.' },
];

// ── WHAT: formats ─────────────────────────────────────────
// Prices are per tier (below), not per format: TODO Andy, does 1:2 / 1:3 price per
// player or per lane? Until then the page shows no price.
export const FORMATS = [
    { value: '1-1', label: '1-to-1', title: 'One coach, one player', body: 'The full session on your player. The most detail, the most data.' },
    { value: '1-2', label: '1-to-2', title: 'One coach, two players', body: 'Train with a friend or a sibling at a similar level. Both players get the data.' },
    { value: '1-3', label: '1-to-3', title: 'One coach, three players', body: 'The most players we take in one private session. Still small enough for every ball to be measured.' },
];

// ── WHAT: the three coach tiers ───────────────────────────
// DRAFT TIERING (13 Nov 2026, Claude): Andy said "each coach will be price tiered
// under the Royals brand", but not which coach sits in which tier, or the names
// or prices. This draft puts one coach of each tier at each of the two named
// centres. ANDY TO CONFIRM before the page goes live.
// price: null → the page shows "Price confirmed when we book you". When you add a
// price, it MUST be the GST-inclusive figure and the page labels it "incl. GST".
export const TIERS = [
    {
        key: 'head',
        name: 'Royals Head Coach',
        short: 'Tier 1',
        body: 'The coaches who lead our centres and design our programs.',
        price: null, // TODO Andy: price per session, incl. GST
        unit: 'per session',
    },
    {
        key: 'performance',
        name: 'Royals Performance Coach',
        short: 'Tier 2',
        body: 'Current Premier Cricket players with state and national pathway experience.',
        price: null, // TODO Andy
        unit: 'per session',
    },
    {
        key: 'academy',
        name: 'Royals Academy Coach',
        short: 'Tier 3',
        body: 'High-level players who coach in our programs every week, trained on all of our tools.',
        price: null, // TODO Andy
        unit: 'per session',
    },
];

// ── WHAT: the coaches ────────────────────────────────────
// Spelling follows the names already published on the site (Power Game,
// Master Landing Page): Harkirat Bajwa, Ikroop Dhanoa, Rittin Raman. Andy's brief
// spelt them "Harkrat", "Ikrup Danoa", "Ritan Rahman": TODO Andy, confirm.
// Bios come from copy already live on the site; Siddharth Banerjee has none yet.
export const COACHES = [
    {
        slug: 'alex-thornhill',
        name: 'Alex Thornhill',
        centre: 'cranbourne-north',
        tier: 'head',
        role: 'Head Coach, Cranbourne North',
        specialism: 'Batting',
        img: '/assets/coaches/alex-thornhill.jpg',
        bio: 'A batting specialist with coaching experience in UK county cricket and the Australian premier system. He leads the Cranbourne North centre and the Academy’s South-East Melbourne region.',
    },
    {
        slug: 'harkirat-bajwa',
        name: 'Harkirat Bajwa',
        centre: 'cranbourne-north',
        tier: 'performance',
        role: 'Performance Coach',
        specialism: 'Spin bowling',
        img: '/assets/coach-harkirat-bajwa.jpg', // Royals-kit headshot (Spin Club); the /coaches/ one is in Australia kit
        bio: 'Played for Australia in the Under-19 World Cup and plays Premier Cricket. An attacking off spinner who teaches the variations and tactics that win matches.',
    },
    {
        slug: 'siddharth-banerjee',
        name: 'Siddharth Banerjee',
        centre: 'cranbourne-north',
        tier: 'academy',
        role: 'Academy Coach',
        specialism: null, // TODO Andy
        img: null, // TODO: headshot → /assets/coaches/siddharth-banerjee.jpg
        bio: null, // TODO Andy: two lines (current club and level, what he coaches)
    },
    {
        slug: 'alex-lewis',
        name: 'Alex Lewis',
        centre: 'mickleham',
        tier: 'head',
        role: 'Director of Cricket · Academy Head Coach',
        specialism: 'Bowling and all-round',
        img: '/assets/coaches/alex-lewis.jpg',
        bio: 'More than 20 years coaching young cricketers through the representative pathways. Head of Academy at Fitzroy Doncaster, a Victorian Premier Cricket club, and a Cricket Australia Level 2 coach.',
    },
    {
        slug: 'ikroop-dhanoa',
        name: 'Ikroop Dhanoa',
        centre: 'mickleham',
        tier: 'performance',
        role: 'Performance Coach',
        specialism: 'Batting, 360° T20',
        img: '/assets/coaches/ikroop-dhanoa.jpg',
        bio: 'A First XI batter for Essendon in Victorian Premier Cricket and a Victorian pathway player up to Under-19s. He coaches a modern, attacking 360° game.',
    },
    {
        slug: 'rittin-raman',
        name: 'Rittin Raman',
        centre: 'mickleham',
        tier: 'academy',
        role: 'Academy Coach',
        specialism: 'Wicketkeeping',
        img: '/assets/coaches/rittin-raman.jpg',
        bio: 'A wicketkeeper-batter playing First XI cricket for Melbourne Cricket Club, and a state-level representative. High energy and precise with technique.',
    },
];

// ── WHERE: the three centres ──────────────────────────────
// Cranbourne North address = the Academy Shop pickup list (Alex, 5 Oct 2026).
// Andy's brief says "Hallam or Cranbourne North": older pages show the Elite
// Cricket Centre at 8-9 Becon Ct, Hallam. TODO Andy: confirm Medley Drive is right.
// The West Centre (M9 Sports Centre, Ravenhall) is NEW: address, days and
// coaches are all TODO.
export const CENTRES = [
    {
        slug: 'cranbourne-north',
        name: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        region: 'South-East Melbourne',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
        note: 'Close to Hallam, Narre Warren and Berwick.',
    },
    {
        slug: 'mickleham',
        name: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        region: 'Northern Melbourne',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
        note: 'The Academy’s high-performance home in the north.',
    },
    {
        slug: 'ravenhall',
        name: 'M9 Sports Centre',
        suburb: 'Ravenhall',
        region: 'Western Melbourne · our West Centre',
        address: null, // TODO Andy: street address
        note: 'Our new West Centre. Coaches announced soon.',
        isNew: true,
    },
];

export const coachesAt = (centreSlug) => COACHES.filter((c) => c.centre === centreSlug);
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
        q: 'Do I pay anything today?',
        a: 'No. Today you request a coach. Our team contacts you to agree the day and time, then sends a payment link. Your session is booked when it is paid.',
    },
    {
        q: 'Can my child train with a friend?',
        a: 'Yes. Choose 1-to-2 or 1-to-3 and tell us the other players’ names. They should be at a similar level and age, so the session works for everyone. We send each extra player’s family their own short form before the first session.',
    },
    {
        q: 'Which coach should we choose?',
        a: 'Choose by centre first, then by what your player wants to work on: each coach shows their specialism. Not sure? Choose “Match me with a coach” and we will pick the best fit.',
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
    title: 'Request received',
    body: 'Our team will contact you within two business days to confirm your coach, day and time, and send your payment link.', // TODO Andy: confirm the response time
    nothingPaid: 'Nothing has been charged. Your session is booked once it is paid.',
};
