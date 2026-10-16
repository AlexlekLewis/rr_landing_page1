// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS CARNIVAL AT LOWER PLENTY — /lower-plenty-junior-royals-day
//
// THE ONE CONFIG FILE. Every fact and every line of copy on the page, the
// success page and the promo rows (lpJrDayPromo.js) comes from here.
//
// CONFIRMED by Alex, 16 Oct 2026:
//   • Free. Sunday 25 October 2026, 9:00am – 11:00am.
//   • Lower Plenty Cricket Club, on Para Road. Players aged 7 to 12.
//   • For Lower Plenty juniors and juniors from all around Melbourne to spend
//     time with the Rajasthan Royals Academy Melbourne coaches.
//   • 60 places. Registrations close Friday 23 October, 9:00pm.
//   • Public page, at this address.
//
// The ground (16 Oct 2026, from the club's own website and the Diamond Valley
// Cricket Association venue list): the club plays at the South Oval,
// Montmorency Park, Park Lane, off Para Road, Montmorency VIC 3094. The map
// pin is the South Oval as mapped on OpenStreetMap.
//
// WORKING ASSUMPTIONS — written as plain fact on the page so it reads as
// final, and listed for Alex in "Lower Plenty Junior Royals Day - Decisions
// (16 Oct 2026).md". Change them here if he says otherwise:
//   ARRIVE_BY, BRING, EQUIPMENT_LINE, PARENTS_STAY, WEATHER_LINE, the
//   MORNING steps.
//
// The 60-place cap and the 9:00pm close are enforced by the DATABASE
// (lower_plenty_jr_day_limits() in the migration). CAPACITY and CLOSES_AT
// here only drive what the page says. Change both places together.
//
// REVIEW 26 OCT 2026: the morning is over. Take it off every promo surface
// (lpJrDayPromo.js lists them) and close or retire the page.
// ─────────────────────────────────────────────────────────────

export const ROUTE = '/lower-plenty-junior-royals-day';
export const SUCCESS_ROUTE = '/lower-plenty-junior-royals-day/success';
export const FORM_ANCHOR = 'register-pay'; // the id the shared sticky bar watches; no payment here
export const CONTACT_EMAIL = 'info@rramelbourne.com';

export const DB_TABLE = 'lower_plenty_junior_royals_day_registrations';
export const PLACES_RPC = 'lower_plenty_jr_day_places';

// ── The event ──
export const EVENT_NAME = 'Junior Royals Carnival';
export const PROGRAM_NAME = 'Junior Royals Carnival at Lower Plenty'; // Meta Pixel content_name
export const MIN_AGE = 7;
export const MAX_AGE = 12;
export const AGES = `${MIN_AGE}–${MAX_AGE}`;
export const AGES_SPOKEN = `${MIN_AGE} to ${MAX_AGE}`;

export const DAY = 'Sunday 25 October';
export const DATE_FULL = 'Sunday 25 October 2026';
export const SHORT_DAY = 'Sun 25 Oct';
export const TIME = '9:00am – 11:00am';
export const ARRIVE_BY = '8:45am'; // ASSUMPTION — 15 minutes to sign in
export const START_ISO = '2026-10-25T09:00:00+11:00';
export const END_ISO = '2026-10-25T11:00:00+11:00';

export const CAPACITY = 60;
export const CLOSES = 'Friday 23 October, 9:00pm';
export const CLOSES_AT_ISO = '2026-10-23T21:00:00+11:00'; // must match the database
export const PRICE_LINE = 'Free';

// ── The ground ──
export const CLUB = 'Lower Plenty Cricket Club';
export const VENUE = {
    club: CLUB,
    ground: 'South Oval, Montmorency Park',
    street: 'Park Lane, off Para Road',
    suburb: 'Montmorency',
    state: 'VIC',
    postcode: '3094',
    region: "Melbourne's north-east",
    lat: -37.71735,
    lng: 145.11311,
};
export const VENUE_ONE_LINE = `${VENUE.club}, ${VENUE.ground}, ${VENUE.suburb}`;
export const ADDRESS_LINE = `${VENUE.street}, ${VENUE.suburb} ${VENUE.state} ${VENUE.postcode}`;
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VENUE.lat},${VENUE.lng}`;

export const LOGOS = {
    academy: '/assets/Logo_White_Transparent.png',
    club: '/assets/lower-plenty/lower-plenty-cc-logo.webp',
};
export const HERO_PHOTO = '/assets/little-crickets-hero.jpeg';

// ── What's on the page ──
export const CTA = 'Register Your Player';

export const HERO = {
    kicker: 'Rajasthan Royals Academy · Melbourne',
    withClub: `At ${CLUB}`,
    // Alex's own purpose for the morning (16 Oct 2026), in plain words.
    why:
        `A free morning of cricket for ${CLUB} juniors, and juniors from all around Melbourne, `
        + 'with the coaches from Rajasthan Royals Academy Melbourne.',
    // One line under the date, so cost and age are on the first phone screen.
    keyLine: `Free · Players aged ${AGES_SPOKEN}`,
    facts: [
        { label: 'When', value: `${DAY}, ${TIME}` },
        { label: 'Where', value: `${CLUB}, ${VENUE.ground}, ${VENUE.suburb}` },
        { label: 'Who', value: `Players aged ${AGES_SPOKEN}, from any club or none` },
        { label: 'Cost', value: `Free. ${CAPACITY} places.` },
    ],
    closes: `Registrations close ${CLOSES}, or sooner if all ${CAPACITY} places are taken.`,
    secondaryCta: 'What happens on the day',
};

export const MORNING = {
    eyebrow: 'The Morning',
    title: 'Two Hours With Our Coaches',
    sub:
        `${EVENT_NAME} is a morning of cricket for players aged ${AGES_SPOKEN}, run by the coaches `
        + 'from Rajasthan Royals Academy Melbourne.',
    steps: [
        {
            time: ARRIVE_BY,
            title: 'Arrive and sign in',
            text: `Come to the ${VENUE.ground}. We sign your player in and you are ready to go.`,
        },
        {
            time: TIME,
            title: 'Cricket with our coaches',
            text: 'Batting, bowling, fielding and games, with players grouped by age.',
        },
        {
            time: '11:00am',
            title: 'Finish and pick-up',
            text: 'We hand each player back to the parent or guardian named on the form.',
        },
    ],
};

export const BRING = ['A water bottle', 'A hat and sunscreen', 'Runners (sports shoes)'];
export const EQUIPMENT_LINE = 'Bats, balls and all equipment are provided. Players can bring their own bat if they have one.';
export const PARENTS_STAY = 'A parent or guardian stays at the ground for the two hours.';
export const WEATHER_LINE =
    'If the weather means we cannot play, we will email and text the parent or guardian by 7:30am on Sunday.';

// The Royals, for a first-time reader. Facts from the verified network list in
// sid-juniors/sidJuniorsData.js (rajasthanroyals.com, 2025–26).
export const WHO_RUNS_IT = {
    eyebrow: 'Who Runs It',
    title: 'Rajasthan Royals Academy Melbourne',
    lines: [
        'The Rajasthan Royals are a team in the Indian Premier League (IPL). Their academies run in '
        + 'Jaipur, Pune, Surrey, New Jersey and here in Melbourne.',
        'Our Melbourne coaches run Junior Royals, our weekly program for players aged 7 to 12, at '
        + 'Mickleham and Cranbourne North. On this morning they come to you, at Lower Plenty.',
    ],
};

export const WHERE = {
    eyebrow: 'Where',
    title: CLUB,
    lines: [
        `${VENUE.ground}`,
        ADDRESS_LINE,
    ],
    note: `${CLUB} plays at the South Oval in Montmorency Park, in ${VENUE.region}. Turn into Park Lane from Para Road.`,
    directions: 'Get directions',
};

// ── The form ──
export const FORM_COPY = {
    eyebrow: 'Free Registration',
    title: CTA,
    sub:
        `It is free, and registering books your player's place. There are ${CAPACITY} places. `
        + 'Registering brothers or sisters? Add one player at a time — your details stay filled in.',
    submit: 'Register My Player',
    footnote: 'Free. Nothing to pay, now or on the day.',
};

export const CLUB_OPTIONS = [
    { value: 'lower-plenty', label: CLUB },
    { value: 'other-club', label: 'Another club' },
    { value: 'no-club', label: 'Not at a club yet' },
];

export const NOTES_FIELD = {
    label: 'Anything the coaches should know?',
    help:
        'For example asthma, allergies, medication your player carries, or an injury. Only the '
        + 'Academy staff running the morning will use it, and only to keep your player safe.',
};

export const PHOTO_CONSENT = {
    intro:
        'We only photograph or film players whose parent or guardian says yes. Saying no makes no '
        + "difference to your player's place. We never publish a player's name with their photo.",
    academy: 'Rajasthan Royals Academy Melbourne may use photos and video of my player from this morning on its website, emails and social media.',
    royals: 'The Rajasthan Royals may also use them on their own channels, which reach a worldwide audience.',
};

export const MARKETING_OPT_IN =
    'Email me about other Junior Royals programs and events. (Optional — you can stop these at any time.)';

export const STATE_COPY = {
    full: {
        title: 'All 60 Places Are Taken',
        body: `Every place for ${DAY} has gone. If a family cancels we will offer the place again here.`,
    },
    closed: {
        title: 'Registrations Have Closed',
        body: `Registrations closed on ${CLOSES}.`,
    },
};

// Messages for the database's own refusals (see the migration).
export const DB_REFUSALS = {
    EVENT_FULL: `Sorry — all ${CAPACITY} places were taken while you were filling in the form. Nothing was saved.`,
    REGISTRATIONS_CLOSED: `Sorry — registrations closed on ${CLOSES}. Nothing was saved.`,
};

// ── FAQ ──
export const FAQS = [
    {
        q: 'Does it cost anything?',
        a: 'No. The morning is free. There is nothing to pay, now or on the day.',
    },
    {
        q: 'Does my player need to play at Lower Plenty?',
        a: `No. Players aged ${AGES_SPOKEN} from any club, or not at a club yet, are welcome.`,
    },
    {
        q: 'Do parents stay?',
        a: PARENTS_STAY,
    },
    {
        q: 'What if it rains?',
        a: WEATHER_LINE,
    },
    {
        q: 'Can I register more than one player?',
        a:
            'Yes. After you register one player, tap "Register another player" — your details stay '
            + `filled in. Each player takes one of the ${CAPACITY} places.`,
    },
    {
        q: 'What if we can no longer come?',
        a: `Please email ${CONTACT_EMAIL}, so we can give the place to another player.`,
    },
];

export const FAQ_HEADING = {
    eyebrow: 'Questions',
    title: 'Frequently Asked',
    sub: `Anything not covered here? Email ${CONTACT_EMAIL} and we will come back to you.`,
};

// ── Success page ──
export const SUCCESS = {
    eyebrow: `${EVENT_NAME} · ${CLUB}`,
    title: "You're Registered",
    // {name} is the player's first name, read from this browser's session only.
    lead: (name) => `${name ? `${name}'s` : 'Your player\'s'} place is booked for ${DAY}, ${TIME}. It is free — there is nothing to pay.`,
    next: [
        `Arrive by ${ARRIVE_BY} at the ${VENUE.ground}, ${VENUE.suburb}.`,
        `Bring ${BRING.slice(0, -1).map((b) => b.toLowerCase()).join(', ')} and ${BRING[BRING.length - 1].toLowerCase()}.`,
        WEATHER_LINE,
    ],
    another: 'Register another player',
};

// Session storage keys (this browser only — nothing personal goes in a URL).
export const STORE = {
    done: 'lpjrday_registered', // player's first name, set after a successful save
    parent: 'lpjrday_parent', // parent details, so "register another player" is quick
};
