// ============================================================
// pcOptions.js — Private Coaching product + EOI form options (Mickleham).
//
// Pricing per Alex 22 Jul 2026 (customer-facing, inc GST) — 1:1 priced
// HIGH deliberately to push players toward groups:
// $160 first consultation (session 1 for everyone) · 1-on-1 $140/hr
// academy coach, $160/hr Leadership (6+ blocks only) · 30-min $70
// (UNDER-14s ONLY — half the 1:1 rate) · groups $70pp (2) / $60pp (3)
// / $50pp (4). Blocks: 3-session starter $420 (academy coaches only)
// or 6+. Weekly packages carry a 10% DISCOUNT: 10-wk term
// $1,260/$1,440, 40-wk season $5,040/$5,760. Booking 6+ FULL HOURS
// makes the player eligible for Power League T20 selection + the
// India Tour to the HPC.
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
    { value: '3', label: '3 sessions — starter block (academy coach)' },
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
    'term-10': '10 weekly sessions with 10% off — $1,260 with an academy coach · $1,440 Leadership ($630 for the under-14 30-min option)',
    'season-40': '40 term-time weeks with 10% off — $5,040 with an academy coach · $5,760 Leadership. Locked weekly slot, first pick of times.',
};

// 6+ full hours unlock the pathway (Power League + India Tour) — casual blocks
// of 6+ full-hour sessions, or either weekly package at full-hour length.
export const ELIGIBLE_COUNTS = ['6', '8', '10', '12+'];
export const qualifiesForPathway = (sessionLength, sessionsRequested, packageType = 'none') =>
    sessionLength === '60' &&
    (['term-10', 'season-40'].includes(packageType) || ELIGIBLE_COUNTS.includes(sessionsRequested));

// Customer-facing price card (inc GST) — rendered on the page, used in copy.
export const PRICING = [
    {
        key: 'consult',
        label: 'First Consultation',
        price: '$160',
        unit: 'session 1 · everyone',
        detail: 'Every journey starts here — a full one-on-one assessment with your development plan and coach assignment coming out of it.',
    },
    {
        key: 'academy',
        label: '1-on-1 · Academy Coach',
        price: '$140',
        unit: '/ hour',
        detail: 'Your assigned coach, a dedicated lane. Start with the 3-session block ($420) or go straight to 6+.',
    },
    {
        key: 'leadership',
        label: '1-on-1 · Leadership',
        price: '$160',
        unit: '/ hour',
        detail: 'Train under the Head Coach tier. Leadership programs run as 6+ session blocks only.',
    },
    {
        key: 'group',
        label: 'Train With A Mate — Pay Half',
        price: '$70',
        unit: '/ player / hr (2 players)',
        detail: 'Same coach, same lane, half the 1:1 price each. 3 players $60 each · 4 players $50 each per hour.',
    },
    {
        key: 'junior30',
        label: 'Junior 30-Minute',
        price: '$70',
        unit: '/ 30 min · under-14s',
        detail: 'Parents of under-14s can opt for focused half-hour sessions. Players 14 and over train full hours.',
    },
    {
        key: 'term',
        label: '10-Week Term Package · 10% Off',
        price: '$1,260',
        unit: 'academy · $1,440 leadership',
        detail: 'One session every week for a school term — 10% off, effectively your tenth session free. Locked weekly slot, pathway unlocked.',
        accent: 'blue',
    },
    {
        key: 'season',
        label: '40-Week Season Package · 10% Off',
        price: '$5,040',
        unit: 'academy · $5,760 leadership',
        detail: 'The full year, every term-time week — school holidays excluded, 10% off all year. Locked slot, first pick of times, pathway unlocked.',
        accent: 'blue',
    },
];

export const DAYS = [
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'friday', label: 'Friday' },
];

export const TIME_SLOTS = [
    { value: '4-5pm', label: '4:00 – 5:00 pm' },
    { value: '5-6pm', label: '5:00 – 6:00 pm' },
    { value: '6-7pm', label: '6:00 – 7:00 pm' },
    { value: '7-8pm', label: '7:00 – 8:00 pm' },
    { value: '8-9pm', label: '8:00 – 9:00 pm' },
    { value: 'flexible', label: 'Flexible — any time that day' },
];
