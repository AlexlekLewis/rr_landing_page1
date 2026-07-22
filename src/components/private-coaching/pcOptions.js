// ============================================================
// pcOptions.js — Private Coaching EOI form options (Mickleham launch).
//
// Set by Alex (22 Jul 2026): every journey starts with a $160 first
// consultation; blocks are a 3-session starter (academy coaches only)
// or 6+ sessions (Leadership programs are 6+ only); Tuesday/Friday;
// specialisms exactly as dictated (all-rounders split by bowling type).
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
