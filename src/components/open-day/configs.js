// Per-centre configs for the reusable Open Day page (cloned from the Mickleham
// Open Day, which keeps its own dedicated components). Every open day follows the
// same two-part structure: an open "turn up & play" session for everyone (no
// registration), then an Elite Program trial (ages 12+, registration required).

export const WILLIAMSTOWN_OPEN_DAY = {
    slug: 'williamstown',
    route: '/PGP2026/williamstown',
    successRoute: '/PGP2026/williamstown/success',
    table: 'williamstown_open_day_registrations',
    sourceTag: 'williamstown-open-day',
    sessionValue: 'elite-trial-1030-1200',
    storageKey: 'williamstown_open_day_confirmation',

    heroKicker: 'Our home in the West · Williamstown',
    titleTop: 'Williamstown',
    dateLine: 'Friday 10 July',
    timeRange: '9am–12pm',
    heroTurnUpLine: 'Turn up and play from 9am',

    venueName: 'The Netz',
    address: '37 Robbins Cct, Williamstown North VIC 3016',
    whatsOnVenueLine: 'The Netz · 37 Robbins Cct, Williamstown North',

    part1Time: '9:00 – 10:30am',
    part1Window: '9:00–10:30am',
    part2Time: '10:30am – 12:00pm',

    eliteHeading: 'The Elite Program at Williamstown',
    eliteCards: [
        { l: 'Main sessions', v: 'Saturdays', s: '2–6pm · pick a 2-hr block (2–4 or 4–6pm)' },
        { l: 'Program dates', v: '8 Weeks', s: 'Sat 1 Aug – 19 Sep · 2 hours a week' },
        { l: 'The venue', v: 'The Netz', s: '37 Robbins Cct, Williamstown North VIC 3016' },
    ],

    suburbPlaceholder: 'e.g. Newport',
    clubPlaceholder: 'e.g. Williamstown CC',

    pixelName: 'Williamstown Open Day',
    pixelCategory: 'williamstown-open-day-elite-trial',
    docTitle: "You're in — Williamstown Open Day",
    successSessionLine: 'Friday 10 July · 10:30am – 12:00pm',
    successVenueLine: 'The Netz · 37 Robbins Cct, Williamstown North VIC 3016',
};

export const HALLAM_OPEN_DAY = {
    slug: 'hallam',
    route: '/PGP2026/hallam',
    successRoute: '/PGP2026/hallam/success',
    table: 'hallam_open_day_registrations',
    sourceTag: 'hallam-open-day',
    sessionValue: 'elite-trial-1430-1600',
    storageKey: 'hallam_open_day_confirmation',

    heroKicker: 'Our home in the South East · Hallam',
    titleTop: 'Hallam',
    dateLine: 'Friday 10 July',
    timeRange: '1–4pm',
    heroTurnUpLine: 'Turn up and play from 1pm',

    venueName: 'Elite Cricket Centre',
    address: '8-9 Becon Ct, Hallam VIC 3803',
    whatsOnVenueLine: 'Elite Cricket Centre · 8-9 Becon Ct, Hallam',

    part1Time: '1:00 – 2:30pm',
    part1Window: '1:00–2:30pm',
    part2Time: '2:30 – 4:00pm',

    eliteHeading: 'The Elite Program at Hallam',
    eliteCards: [
        { l: 'Main sessions', v: 'Saturdays', s: '2–6pm · pick a 2-hr block (2–4 or 4–6pm)' },
        { l: 'Program dates', v: '8 Weeks', s: 'Sat 1 Aug – 19 Sep · 2 hours a week' },
        { l: 'The venue', v: 'Elite Cricket Centre', s: '8-9 Becon Ct, Hallam VIC 3803' },
    ],

    suburbPlaceholder: 'e.g. Narre Warren',
    clubPlaceholder: 'e.g. Hallam Kalora Park CC',

    pixelName: 'Hallam Open Day',
    pixelCategory: 'hallam-open-day-elite-trial',
    docTitle: "You're in — Hallam Open Day",
    successSessionLine: 'Friday 10 July · 2:30 – 4:00pm',
    successVenueLine: 'Elite Cricket Centre · 8-9 Becon Ct, Hallam VIC 3803',
};
