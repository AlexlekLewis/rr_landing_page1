// ============================================================
// pcOptions.js — Private Coaching product + EOI form options (Mickleham).
//
// Pricing HELD by Alex 22 Jul 2026 (customer-facing, inc GST):
// $160 first consultation (session 1 for everyone) · 1-on-1 $130/hr
// PROFESSIONAL coach · $160/hr Leadership (6+ blocks only) · 30-min
// $70 (UNDER-14s ONLY) · groups $70pp (2) / $60pp (3) / $50pp (4) —
// groups deliberately undercut solo to push players toward them.
// Blocks: 3-session starter $390 (professional coaches only) or 6+.
// Weekly packages carry a 10% DISCOUNT: 10-wk term $1,170/$1,440,
// 40-wk season $4,680/$5,760. LAUNCH SPECIAL: 10% off GROUP
// SESSIONS ONLY booked in the first 30 days (NOT 1:1s, NOT
// consultations — Alex 22 Jul: "the margin just isn't there").
// Booking 6+ FULL HOURS = eligible for Power League T20 selection
// + India Tour HPC.
// Time bands are a first draft — adjust here when the Head Coach locks
// the Mickleham lane windows.
// ============================================================

export const CENTRE = {
    slug: 'mickleham',
    name: 'Mickleham Indoor Sports Centre',
    address: '3 Eclipse Drive, Mickleham VIC 3064',
};

export const SPECIALISMS = [
    { value: 'batting', label: 'Batting' },
    { value: 'bowling', label: 'Bowling' },
    { value: 'allrounder_spin', label: 'All-Rounder — Bowling Spin' },
    { value: 'allrounder_pace', label: 'All-Rounder — Bowling Pace' },
    { value: 'wicketkeeping', label: 'Wicketkeeping' },
];

export const YEARS_PLAYED = [
    { value: 'first-season', label: 'This is their first season' },
    { value: '1-2', label: '1–2 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '6-10', label: '6–10 years' },
    { value: '10+', label: 'More than 10 years' },
];

// Blocks, not one-offs: 3-session starter (academy coach) or 6+.
export const SESSION_COUNTS = [
    { value: '3', label: '3 sessions — starter block (professional coach)' },
    { value: '6', label: '6 sessions' },
    { value: '8', label: '8 sessions' },
    { value: '10', label: '10 sessions' },
    { value: '12+', label: '12+ sessions' },
];

export const BOOKING_TYPES = [
    { value: 'private', label: 'Private 1-on-1' },
    { value: 'group', label: 'Small group (2–4 players)' },
];

export const GROUP_SIZES = [
    { value: 2, label: '2 players — $70 per player / hr' },
    { value: 3, label: '3 players — $60 per player / hr' },
    { value: 4, label: '4 players — $50 per player / hr' },
];

// 30-minute sessions are for under-14s only; 14+ train full hours.
export const UNDER_14_CUTOFF = 14;
export const SESSION_LENGTHS = [
    { value: '60', label: 'Full hour — 60 minutes' },
    { value: '30', label: '30 minutes — under-14s option ($70)' },
];

// Programs: casual block, or weekly packages (term = 10 weeks; season = 40
// term-time weeks, Victorian school holidays excluded).
export const PROGRAM_TYPES = [
    { value: 'block', label: 'Casual session block (choose sessions below)' },
    { value: 'term-10', label: '10-Week Term Package — one session every week' },
    { value: 'season-40', label: '40-Week Season Package — weekly, school holidays off' },
];

// Price hints the form shows once a program + length is chosen.
// Packages carry a 10% discount (set by Alex 22 Jul).
export const PROGRAM_PRICE_HINTS = {
    'term-10': '10 weekly sessions with 10% off — $1,170 with a professional coach · $1,440 Leadership ($630 for the under-14 30-min option)',
    'season-40': '40 term-time weeks with 10% off — $4,680 with a professional coach · $5,760 Leadership. Locked weekly slot, first pick of times.',
};

// 6+ full hours unlock the pathway (Power League + India Tour) — casual blocks
// of 6+ full-hour sessions, or either weekly package at full-hour length.
export const ELIGIBLE_COUNTS = ['6', '8', '10', '12+'];
export const qualifiesForPathway = (sessionLength, sessionsRequested, packageType = 'none') =>
    sessionLength === '60' &&
    (['term-10', 'season-40'].includes(packageType) || ELIGIBLE_COUNTS.includes(sessionsRequested));

// Customer-facing price card (inc GST) — rendered on the page, used in copy.
// `minimum` states the smallest booking we accept for that product, in plain
// words, because "from $130/hr" means nothing to a parent who then discovers
// they cannot buy a single hour.
export const PRICING = [
    {
        key: 'consult',
        label: 'Assessment session with the Head Coach',
        price: '$50',
        wasPrice: '$160',
        unit: 'one hour · every player starts here',
        detail: 'One hour, one-on-one with Academy Head Coach Alex Lewis. He assesses the player, writes the development plan you keep, and decides which coach they go on to train with. The launch price is $50 until 28 August 2026; after that it returns to its standard price of $160.',
        minimum: 'Everyone does this first. You cannot skip it, and you can stop after it if you choose.',
    },
    {
        key: 'academy',
        label: 'One-on-one with a professional coach',
        price: '$130',
        unit: 'per hour · one player, one coach, one lane',
        detail: 'Your player and their assigned coach in a dedicated lane for a full hour, working through the plan set at the assessment.',
        minimum: 'Smallest booking is a 3-session starter block — $390. Most families then continue on 6 or more.',
    },
    {
        key: 'leadership',
        label: 'One-on-one with a leadership coach',
        price: '$160',
        unit: 'per hour · our most senior coaches',
        detail: 'The same hour, but with one of the Academy’s leadership-tier coaches — the people who run our elite programs.',
        minimum: 'Leadership coaches are booked in blocks of 6 sessions or more. There is no 3-session option at this tier.',
    },
    {
        key: 'group',
        label: 'Small group — train with mates',
        price: '$70',
        unit: 'per player per hour, with 2 players',
        detail: 'Same coach, same lane, shared between friends or teammates. Three players is $60 each per hour; four players is $50 each per hour. The more players share the lane, the less each family pays.',
        minimum: 'Same as one-on-one: a 3-session starter block at the least. You bring your own group of 2 to 4 players.',
    },
    {
        key: 'junior30',
        label: 'Half-hour session for under-14s',
        price: '$70',
        unit: 'per 30 minutes · under-14s only',
        detail: 'A shorter, sharper session for younger players whose concentration is better served by half an hour than a full one.',
        minimum: 'Only available to players aged 13 and under. From 14 up, players train in full hours.',
    },
    {
        key: 'term',
        label: '10-week term package',
        price: '$1,170',
        unit: 'with a professional coach · $1,440 leadership',
        detail: 'One session every week for a full school term, paid up front, with 10% taken off the hourly rate — in effect your tenth session is free. Your night and time are locked in for the term.',
        minimum: 'Ten sessions, one per week. Booked as a whole term.',
        accent: 'blue',
    },
    {
        key: 'season',
        label: '40-week season package',
        price: '$4,680',
        unit: 'with a professional coach · $5,760 leadership',
        detail: 'A weekly session across the whole season — 40 term-time weeks, with Victorian school holidays off — at 10% below the hourly rate. You get first pick of nights and times before anyone else.',
        minimum: 'Forty sessions across the year. Booked as a full season.',
        accent: 'blue',
    },
];

// The rules that apply across every product above. Stated plainly because they
// are the questions every parent asks on the phone.
export const BOOKING_RULES = [
    {
        title: 'We do not sell single sessions',
        body: 'After your assessment, the smallest booking is a block of 3 sessions. Cricket skills do not change in one hour — a block is what makes the coaching worth paying for.',
    },
    {
        title: 'Tuesday or Friday evenings',
        body: 'Private coaching at Mickleham runs on Tuesday and Friday nights. You choose the night that suits your family and keep that slot.',
    },
    {
        title: 'Book 6 or more full hours and the pathway opens up',
        body: 'Players who commit to 6 or more full-hour sessions become eligible for selection in Power League — our own Twenty20 competition — and for a place on the Academy tour to the Rajasthan Royals High Performance Centre in India.',
    },
];

// Launch offer — shown on the pricing section + form footer.
export const LAUNCH_OFFER = {
    headline: 'Launch offer — 10% off small-group sessions',
    detail: 'Book a small group before 28 August 2026 and every player saves a further 10% on the group rates above: two players pay $63 each per hour, three pay $54 each, four pay $45 each. This discount applies to small-group sessions only — one-on-one hours, half-hour sessions and packages stay at their listed price.',
};

// Venue credentials for the hero — every claim here is drawn from our own
// bookings at the centre, not marketing copy.
export const VENUE_FACTS = [
    { title: 'Seven indoor lanes', detail: 'enough to run a full squad session and private lanes side by side' },
    { title: 'Full-length run-ups', detail: 'quicks bowl off their real run, not a shortened one' },
    { title: 'Bowling machines on site', detail: 'repeatable deliveries at a set pace, line and length' },
];

export const DAYS = [
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'friday', label: 'Friday' },
];

// Which night(s) the player can train — Mickleham private coaching runs Tue & Fri.
export const DAY_AVAILABILITY = [
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'friday', label: 'Friday' },
    { value: 'either', label: 'Either — I’m flexible' },
];

export const TIME_SLOTS = [
    { value: '4-5pm', label: '4:00 – 5:00 pm' },
    { value: '5-6pm', label: '5:00 – 6:00 pm' },
    { value: '6-7pm', label: '6:00 – 7:00 pm' },
    { value: '7-8pm', label: '7:00 – 8:00 pm' },
    { value: '8-9pm', label: '8:00 – 9:00 pm' },
    { value: 'flexible', label: 'Flexible — any time that day' },
];
