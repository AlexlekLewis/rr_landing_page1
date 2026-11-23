// ─────────────────────────────────────────────────────────────
// FIXTURES (Andy, 23 Nov 2026: "build out a fixtures section ... so we can post upcoming
// fixtures so people can see them". DRAFT: not live yet).
//
// One entry per match. Upcoming matches show on the home page and at /fixtures; once a
// match has a result, it moves to Results.
//   id           unique, lowercase-with-hyphens
//   startsAt     ISO date-time with the Melbourne offset, e.g. '2026-12-06T10:00:00+11:00'
//   competition  'Power League', 'Performance Squads', 'Showcase match', ...
//   grade        'Senior', 'Junior', 'Under 14', ... (optional)
//   home, away   team ids from TEAMS below
//   venue        ground name; suburb  the suburb (always shown, so families can find it)
//   mapUrl       optional Google Maps link
//   result       optional, once played: the result line, e.g. 'North Melbourne won by 24 runs'
//   link         optional { label, href }: e.g. register to play, watch live, the story
//   sample       true = an invented example for the draft. NEVER publish with sample rows.
//
// Rules: never name a junior player; only real fixtures from Alex or Andy.
// ─────────────────────────────────────────────────────────────

export const TEAMS = {
    nm: { name: 'RRA North Melbourne', short: 'NM', colour: '#1226AA' },
    sem: { name: 'RRA South-East Melbourne', short: 'SEM', colour: '#E50695' },
};

export const FIXTURES = [
    // REAL: Power League second weekend (Power Cricket league data, Alex Lewis 11 Nov 2026).
    { id: 'pl-2026-11-15-senior', startsAt: '2026-11-15T14:00:00+11:00', competition: 'Power League', grade: 'Senior', home: 'nm', away: 'sem', venue: 'Montmorency Park, South Oval', suburb: 'Montmorency', mapUrl: 'https://maps.google.com/?q=Montmorency+Park+Montmorency+VIC', result: null, link: { label: 'Read the preview', href: '/news/alex-lewis-power-league-round-two' } },
    { id: 'pl-2026-11-15-junior', startsAt: '2026-11-15T14:00:00+11:00', competition: 'Power League', grade: 'Junior', home: 'nm', away: 'sem', venue: 'Montmorency Park, North Oval', suburb: 'Montmorency', mapUrl: 'https://maps.google.com/?q=Montmorency+Park+Montmorency+VIC', result: null },

    // SAMPLE ROWS for the draft only: invented to show the layout. Replace with real fixtures.
    { sample: true, id: 'sample-1', startsAt: '2026-11-29T10:00:00+11:00', competition: 'Power League', grade: 'Senior', home: 'sem', away: 'nm', venue: 'Elite Cricket Centre', suburb: 'Cranbourne North', link: { label: 'Match details', href: '/performance-squads' } },
    { sample: true, id: 'sample-2', startsAt: '2026-11-29T13:30:00+11:00', competition: 'Power League', grade: 'Junior', home: 'sem', away: 'nm', venue: 'Elite Cricket Centre', suburb: 'Cranbourne North' },
    { sample: true, id: 'sample-3', startsAt: '2026-12-06T10:00:00+11:00', competition: 'Performance Squads', grade: 'Under 15', home: 'nm', away: 'sem', venue: 'Mickleham Indoor Sports Centre', suburb: 'Mickleham' },
    { sample: true, id: 'sample-4', startsAt: '2026-12-13T14:00:00+11:00', competition: 'Showcase match', grade: 'Senior', home: 'nm', away: 'sem', venue: 'Montmorency Park, South Oval', suburb: 'Montmorency', link: { label: 'Register to play', href: '/match-registration' } },
];

const MEL = 'Australia/Melbourne';
const fmt = (iso, opts) => new Intl.DateTimeFormat('en-AU', { timeZone: MEL, ...opts }).format(new Date(iso));
export const dayLabel = (iso) => fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
export const shortDay = (iso) => ({ dow: fmt(iso, { weekday: 'short' }), day: fmt(iso, { day: 'numeric' }), month: fmt(iso, { month: 'short' }) });
export const timeLabel = (iso) => fmt(iso, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '').toLowerCase();

// A match counts as played 4 hours after it starts.
const isPast = (f, now) => new Date(f.startsAt).getTime() + 4 * 3600e3 < now;
export const upcoming = (now = Date.now()) => FIXTURES.filter((f) => !isPast(f, now)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
export const results = (now = Date.now()) => FIXTURES.filter((f) => isPast(f, now)).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
export const HAS_SAMPLES = FIXTURES.some((f) => f.sample);
