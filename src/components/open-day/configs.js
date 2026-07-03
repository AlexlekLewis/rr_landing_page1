// Per-centre configs for the reusable Open Day page. The page is a web replica of
// the official "OPEN TRAINING DAY" poster: same hierarchy, same JUNIOR ROYALS vs
// ELITE ROYALS split, same copy — only date / venue / times / region change.
//
// Every open day is two sessions back-to-back. Registration is now REQUIRED for
// BOTH (Junior Royals added "due to popular demand"):
//   1. JUNIOR ROYALS  — come-and-try, all skill levels, register (Ages 5–15).
//   2. ELITE ROYALS   — trial session, scholarship on offer, register (Ages 11–25).

export const WILLIAMSTOWN_OPEN_DAY = {
    slug: 'williamstown',
    route: '/PGP2026/williamstown',
    successRoute: '/PGP2026/williamstown/success',
    table: 'williamstown_open_day_registrations',
    sourceTag: 'williamstown-open-day',
    sessionValue: 'elite-trial-1030-1200',
    storageKey: 'williamstown_open_day_confirmation',

    // ── Poster headline block ──
    dateHeadline: 'Friday, July 10',
    venueHeadline: 'The Netz, Williamstown North',
    address: '37 Robbins Cct, Williamstown North VIC 3016',
    region: 'WEST',              // "…Academy centre in Melbourne's WEST"

    // ── Session times ──
    juniorTime: '9:00 – 10:30am',
    eliteTime: '10:30am – 12:00pm',

    // ── Form placeholders ──
    suburbPlaceholder: 'e.g. Newport',
    clubPlaceholder: 'e.g. Williamstown CC',

    // ── Success page / Meta Pixel (Elite) ──
    pixelName: 'Williamstown Open Day',
    pixelCategory: 'williamstown-open-day-elite-trial',
    docTitle: "You're in — Williamstown Open Day",
    successSessionLine: 'Friday 10 July · 10:30am – 12:00pm',
    successVenueLine: 'The Netz · 37 Robbins Cct, Williamstown North VIC 3016',

    // ── Junior Royals registration (now required, due to popular demand) ──
    junior: {
        table: 'williamstown_junior_registrations',
        sourceTag: 'williamstown-junior-royals',
        pixelName: 'Williamstown Junior Royals',
        pixelCategory: 'williamstown-junior-royals',
        time: '9:00 – 10:30am',
        suburbPlaceholder: 'e.g. Newport',
        mode: 'required',
    },
    announcement: {
        text: 'Due to popular demand, you now need to register for the Junior Royals open day.',
        cta: 'Register',
        ctaTarget: 'register-junior',
    },
};

export const HALLAM_OPEN_DAY = {
    slug: 'hallam',
    route: '/PGP2026/hallam',
    successRoute: '/PGP2026/hallam/success',
    table: 'hallam_open_day_registrations',
    sourceTag: 'hallam-open-day',
    sessionValue: 'elite-trial-1430-1600',
    storageKey: 'hallam_open_day_confirmation',

    dateHeadline: 'Friday, July 10',
    venueHeadline: 'Elite Cricket Centre, Hallam',
    address: '8-9 Becon Ct, Hallam VIC 3803',
    region: 'SOUTH EAST',

    juniorTime: '1:00 – 2:30pm',
    eliteTime: '2:30 – 4:00pm',

    suburbPlaceholder: 'e.g. Narre Warren',
    clubPlaceholder: 'e.g. Hallam Kalora Park CC',

    pixelName: 'Hallam Open Day',
    pixelCategory: 'hallam-open-day-elite-trial',
    docTitle: "You're in — Hallam Open Day",
    successSessionLine: 'Friday 10 July · 2:30 – 4:00pm',
    successVenueLine: 'Elite Cricket Centre · 8-9 Becon Ct, Hallam VIC 3803',

    junior: {
        table: 'hallam_junior_registrations',
        sourceTag: 'hallam-junior-royals',
        pixelName: 'Hallam Junior Royals',
        pixelCategory: 'hallam-junior-royals',
        time: '1:00 – 2:30pm',
        suburbPlaceholder: 'e.g. Narre Warren',
        mode: 'required',
    },
    announcement: {
        text: 'Due to popular demand, you now need to register for the Junior Royals open day.',
        cta: 'Register',
        ctaTarget: 'register-junior',
    },
};

// Shared session definitions — identical across centres (straight from the poster).
export const JUNIOR_ROYALS = {
    ages: 'Ages 5–15',
    tagline: 'Come & try',
    blurb: 'Come and have a go. All skill levels, boys and girls — meet the coaches and show us your skills.',
    points: [
        'All skill levels welcome',
        'Boys and girls',
        'FREE — come and try',
        'Meet the Head Coach',
        'Bring your equipment',
        'Show us your skills',
        'Skills assessed on the day',
    ],
};

export const ELITE_ROYALS = {
    ages: 'Ages 11–25',
    tagline: 'Trial session',
    blurb: 'Serious about your cricket? Get put through your paces by the Head Coach — one player wins a scholarship.',
    points: [
        'Advanced skill level',
        'Male and female',
        'Come and be tested',
        'Impress the coaches',
        'Bring your equipment & bring your game',
        'Head Coach Alex Lewis awards a scholarship to 1 player',
    ],
};
