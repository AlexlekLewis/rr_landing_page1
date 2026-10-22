// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS ARE COMING TO LOWER PLENTY — /lower-plenty-junior-royals-day
//
// THE ONE CONFIG FILE. Every fact and every line of copy on the page, the
// success page and the promo rows (lpJrDayPromo.js) comes from here.
//
// CONFIRMED by Alex, 16 Oct 2026:
//   • Sunday 25 October 2026, 9:00am – 11:00am.
//   • $10 per player (Alex, 16 Oct 2026; was free until then). Paid through the
//     Stripe Payment Link "Junior Royals Carnival Day Entry Fee" (PAYMENT_LINK).
//   • Lower Plenty Cricket Club, on Para Road. Players aged 7 to 12.
//   • For Lower Plenty juniors and juniors from all around Melbourne to spend
//     time with the Rajasthan Royals Academy Melbourne coaches.
//   • 60 places. Registrations close Friday 23 October, 9:00pm.
//   • Public page, at this address.
//
// The ground. Its name is "Lower Plenty Oval South", in Montmorency Park
// (Alex, 16 Oct 2026). Address from the club's website and the Diamond Valley
// Cricket Association venue list: Park Lane, off Para Road, Montmorency VIC
// 3094. The DVCA lists it as the club's main ground. The map pin is that oval
// as mapped on OpenStreetMap ("South Oval"). Montmorency Park has two ovals,
// so the page shows a map with the pin (Alex, 16 Oct 2026).
//
// Also confirmed by Alex, 16 Oct 2026: finish and pick-up on the main oval;
// players bring their bat, gloves and all their playing equipment if they have
// it. (He had asked for FREE EVENT big and bold; that came out when the $10
// fee was set the same day — a paid event can't be called free.)
//
// Power League (Alex, 16 Oct 2026): the morning is followed by Power League
// matches on Lower Plenty's ground AND Montmorency's ground; "stay and watch our
// Power League players play off against each other" is his line. Montmorency
// Cricket Club's ground is also Montmorency Park, Para Road (DVCA venue list),
// so the two grounds are the park's two ovals. Its oval's own name is not
// confirmed, so the page calls it "Montmorency Cricket Club's ground". No start
// time is given: the page says "afterwards". The match day itself is
// /power-league (power-league/plOptions.js).
//
// WORKING ASSUMPTIONS — written as plain fact on the page so it reads as
// final, and listed for Alex in "Lower Plenty Junior Royals Day - Decisions
// (16 Oct 2026).md". Change them here if he says otherwise:
//   ARRIVE_BY, the water/hat/runners part of BRING, PARENTS_STAY,
//   WEATHER_LINE, REFUND_LINE, the middle MORNING step.
//
// The 60-place cap and the 9:00pm close are enforced by the DATABASE
// (lower_plenty_jr_day_limits() in the migration). CAPACITY and CLOSES_AT
// here only drive what the page says. Change both places together.
//
// CANCELLED 23 Oct 2026 (Alex): heavy rain is forecast, so the morning is called off.
// The page shows CANCELLED_COPY (bottom of this file) on the shared FinishedEventPage:
// no form, no payment, noindex. Registrations were closed early, in the database and in
// CLOSES_AT_ISO, and every promo surface dropped the event. To bring the morning back,
// set CANCELLED to false AND move the close time forward in lower_plenty_jr_day_limits()
// (the database refuses sign-ups until then).
//
// REVIEW 26 OCT 2026: the morning would have been Sunday 25 October. Retire the page,
// or keep the cancelled notice up for families who still follow old links.
// ─────────────────────────────────────────────────────────────

export const ROUTE = '/lower-plenty-junior-royals-day';
export const SUCCESS_ROUTE = '/lower-plenty-junior-royals-day/success';
export const PAY_ROUTE = '/lower-plenty-junior-royals-day/pay';
export const FORM_ANCHOR = 'register-pay'; // the id the shared sticky bar watches
export const CONTACT_EMAIL = 'info@rramelbourne.com';

export const DB_TABLE = 'lower_plenty_junior_royals_day_registrations';
export const PLACES_RPC = 'lower_plenty_jr_day_places';

// ── The event ──
// Name and main heading (Alex, 18 Oct 2026): "Junior Royals are coming to Lower Plenty".
// "Junior Royals Carnival" is no longer used anywhere — page, promos, posters. Two
// leftovers only: the Stripe product is still called "Junior Royals Carnival Day Entry
// Fee", and the old short address /carnival still redirects here.
export const EVENT_NAME = 'Junior Royals Are Coming to Lower Plenty';
export const PROGRAM_NAME = EVENT_NAME; // Meta Pixel content_name
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
export const CLOSES = 'Friday 23 October, 9:00pm'; // the deadline first published
// Moved from 9:00pm to 8:30am on Fri 23 Oct 2026 when the morning was cancelled. The
// database close time moved to the same moment (migration 20261023083000).
export const CLOSES_AT_ISO = '2026-10-23T08:30:00+11:00'; // must match the database
// ── Price and payment (Alex, 16 Oct 2026) ──
// $10 per player, GST included (Stripe price is tax-inclusive, automatic tax
// off, so the family pays exactly $10). One payment per player.
export const PRICE = 10;
export const PRICE_LABEL = '$10 incl. GST';
export const PRICE_LINE = `$${PRICE} per player, incl. GST`;
// Stripe Payment Link "Junior Royals Carnival Day Entry Fee", created 16 Oct 2026
// (plink_1UR3QNIo52UEA50yq6GKVkSy). After payment Stripe redirects to
// /lower-plenty-junior-royals-day/success?session_id={CHECKOUT_SESSION_ID}.
// The webhook maps this link to this event and marks the row paid using the
// client_reference_id the form adds (api/stripe-webhook.js).
export const PAYMENT_LINK = 'https://buy.stripe.com/5kQdR99zHd4N0uUdI79Zm0W';
export const payUrlFor = ({ bookingId, email } = {}) => {
    const q = new URLSearchParams();
    if (bookingId) q.set('client_reference_id', bookingId);
    if (email) q.set('prefilled_email', email);
    const qs = q.toString();
    return qs ? `${PAYMENT_LINK}?${qs}` : PAYMENT_LINK;
};
// ACL: change-of-mind refunds can be refused, but never the consumer guarantees;
// if we cancel, the family gets their money back. ASSUMPTION — Alex to confirm.
export const REFUND_LINE =
    `If we cancel the morning (for example because of the weather), we refund the $${PRICE}. `
    + 'If you change your mind, the fee is not refundable. This does not affect your rights '
    + 'under the Australian Consumer Law.';

// ── The ground ──
export const CLUB = 'Lower Plenty Cricket Club';
export const VENUE = {
    club: CLUB,
    oval: 'Lower Plenty Oval South',
    park: 'Montmorency Park',
    ground: 'Lower Plenty Oval South, Montmorency Park',
    street: 'Park Lane, off Para Road',
    suburb: 'Montmorency',
    state: 'VIC',
    postcode: '3094',
    region: "Melbourne's north-east",
    lat: -37.71735,
    lng: 145.11311,
};
export const ADDRESS_LINE = `${VENUE.street}, ${VENUE.suburb} ${VENUE.state} ${VENUE.postcode}`;
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VENUE.lat},${VENUE.lng}`;
// Satellite view with a pin on the oval, so the two ovals in the park can't be mixed up.
export const MAP_EMBED = `https://maps.google.com/maps?q=${VENUE.lat},${VENUE.lng}&t=k&z=17&output=embed`;

export const LOGOS = {
    academy: '/assets/Logo_White_Transparent.png',
    club: '/assets/lower-plenty/lower-plenty-cc-logo.webp',
};
export const HERO_PHOTO = '/assets/little-crickets-hero.jpeg';

// ── Power League matches after the morning (Alex, 16 Oct 2026) ──
export const POWER_LEAGUE = {
    when: 'Afterwards',
    title: 'Stay for the Power League',
    // Alex's words.
    line: 'Stay and watch our Power League players play off against each other.',
    explain:
        'The Power League is T20 cricket between our Performance Squads, the Academy\'s '
        + 'representative squads for players aged 10 to 25.',
    grounds:
        `The matches are on ${VENUE.oval} and on Montmorency Cricket Club's ground, the other `
        + `oval in ${VENUE.park}, a short walk away.`,
    short: "on Lower Plenty's and Montmorency's grounds",
};

// ── What's on the page ──
// Paid and the place is booked once payment goes through → "Secure Your Place",
// price beside it (language.md §5).
export const CTA = 'Secure Your Place';
export const CTA_WITH_PRICE = `Secure Your Place · $${PRICE}`;

export const HERO = {
    kicker: 'Rajasthan Royals Academy · Melbourne',
    withClub: `At ${CLUB}`,
    // Alex's own purpose for the morning (16 Oct 2026), in plain words.
    why:
        `A morning of cricket for ${CLUB} juniors, and juniors from all around Melbourne, `
        + 'with the coaches from Rajasthan Royals Academy Melbourne.',
    // One line under the date, so cost and age are on the first phone screen.
    keyLine: `Players aged ${AGES_SPOKEN} · $${PRICE} incl. GST`,
    // Shown under the why line, so the first screen says what follows.
    then: `Then stay and watch our Power League players play off against each other, ${POWER_LEAGUE.short}.`,
    facts: [
        { label: 'When', value: `${DAY}, ${TIME}` },
        { label: 'Where', value: `${VENUE.oval}, ${VENUE.park}, ${VENUE.suburb}` },
        { label: 'Who', value: `Players aged ${AGES_SPOKEN}, from any club or none` },
        { label: 'Cost', value: `$${PRICE} per player, incl. GST — paid when you register` },
        { label: 'After', value: `Power League T20 matches ${POWER_LEAGUE.short} — stay and watch` },
    ],
    closes: `Registrations close ${CLOSES}, or sooner if all ${CAPACITY} places are taken.`,
    secondaryCta: 'What happens on the day',
};

export const MORNING = {
    eyebrow: 'The Morning',
    title: 'Two Hours With Our Coaches',
    sub:
        `A morning of cricket for players aged ${AGES_SPOKEN}, run by the coaches `
        + 'from Rajasthan Royals Academy Melbourne.',
    steps: [
        {
            time: ARRIVE_BY,
            title: 'Arrive and sign in',
            text: `Come to ${VENUE.oval} in ${VENUE.park}. We sign your player in and you are ready to go.`,
        },
        {
            time: TIME,
            title: 'Cricket with our coaches',
            text: 'Batting, bowling, fielding and games, with players grouped by age.',
        },
        {
            time: '11:00am',
            title: 'Finish and pick-up',
            text: `Pick up your player from the main oval, ${VENUE.oval}.`,
        },
        {
            time: POWER_LEAGUE.when,
            title: POWER_LEAGUE.title,
            text: `${POWER_LEAGUE.line} ${POWER_LEAGUE.grounds}`,
        },
    ],
};

// Kit: Alex, 16 Oct 2026. Water, hat/sunscreen and runners are working assumptions.
export const BRING = [
    'Their bat, gloves and all their playing equipment, if they have it',
    'A water bottle',
    'A hat and sunscreen',
    'Runners (sports shoes)',
];
export const PARENTS_STAY = 'A parent or guardian stays at the ground for the two hours.';
export const WEATHER_LINE =
    `If the weather means we cannot play, we will email and text the parent or guardian by 7:30am on Sunday, and refund the $${PRICE}.`;

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
        `${VENUE.oval}, ${VENUE.park}`,
        ADDRESS_LINE,
    ],
    note:
        `${VENUE.park} in ${VENUE.region} has two ovals. The morning is on ${VENUE.oval}, ${CLUB}'s `
        + 'ground at the Park Lane end of the park: the pin on the map. Turn into Park Lane from Para Road. '
        + "The Power League matches afterwards are on both ovals: this one and Montmorency Cricket Club's ground.",
    mapTitle: `Map: ${VENUE.oval}, ${VENUE.park}, ${VENUE.suburb}`,
    directions: 'Get directions',
};

// ── The form ──
export const FORM_COPY = {
    eyebrow: `Registration · $${PRICE} per player`,
    title: CTA,
    sub:
        `Enter your player's details, then pay $${PRICE} (incl. GST) by card on the next step. `
        + `Your player's place is booked once the payment goes through. There are ${CAPACITY} places. `
        + 'Registering brothers or sisters? Add one player at a time — your details stay filled in.',
    submit: `Continue to payment · $${PRICE}`,
    footnote: `Payments are processed securely by Stripe. The place is booked once the $${PRICE} payment goes through.`,
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
        q: 'How much is it, and when do I pay?',
        a:
            `$${PRICE} per player, including GST. You pay by card straight after you fill in the form, `
            + "and your player's place is booked once the payment goes through.",
    },
    {
        q: 'Can we stay afterwards?',
        a: `Yes. ${POWER_LEAGUE.line} ${POWER_LEAGUE.explain} ${POWER_LEAGUE.grounds}`,
    },
    {
        q: 'Does my player need to play at Lower Plenty?',
        a: `No. Players aged ${AGES_SPOKEN} from any club, or not at a club yet, are welcome.`,
    },
    {
        q: 'What should my player bring?',
        a:
            'Their bat, gloves and all their playing equipment, if they have it. Also a water bottle, '
            + 'a hat, sunscreen and runners (sports shoes).',
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
        a: `Please email ${CONTACT_EMAIL}, so we can give the place to another player. ${REFUND_LINE}`,
    },
    {
        q: 'I registered but didn\'t finish paying. What now?',
        a:
            'Your place is not booked until the payment goes through. Come back to this page on the same '
            + `phone or computer and tap "Pay $${PRICE} now", or email ${CONTACT_EMAIL} and we will send you the payment link.`,
    },
];

export const FAQ_HEADING = {
    eyebrow: 'Questions',
    title: 'Frequently Asked',
    sub: `Anything not covered here? Email ${CONTACT_EMAIL} and we will come back to you.`,
};

// ── Success page ──
export const SUCCESS = {
    eyebrow: EVENT_NAME,
    title: 'Payment Received',
    // {name} is the player's first name, read from this browser's session only.
    lead: (name) => `Thanks — the $${PRICE} payment went through, so ${name ? `${name}'s` : 'your player\'s'} place is booked for ${DAY}, ${TIME}. Stripe emails you a receipt.`,
    next: [
        `Arrive by ${ARRIVE_BY} at ${VENUE.oval}, ${VENUE.park}, ${VENUE.suburb}. Use the map below.`,
        'Bring their bat, gloves and all their playing equipment, if they have it, plus a water bottle, a hat, sunscreen and runners.',
        `Pick-up is at 11:00am on the main oval, ${VENUE.oval}.`,
        `Then stay and watch our Power League players play off against each other, ${POWER_LEAGUE.short}.`,
        WEATHER_LINE,
    ],
    another: 'Register another player',
};

// Session storage keys (this browser only — nothing personal goes in a URL).
export const STORE = {
    done: 'lpjrday_registered', // player's first name, set when the row is saved
    parent: 'lpjrday_parent', // parent details, so "register another player" is quick
    pending: 'lpjrday_pending', // { id, firstName, email } saved but not yet paid
};

// ── Pay page (/pay?booking=<id>) — for a family who registered but didn't finish paying.
export const PAY_PAGE = {
    eyebrow: EVENT_NAME,
    title: 'Finish Paying',
    body:
        `Your registration is saved. Pay $${PRICE} (incl. GST) to book the place for ${DAY}, ${TIME}, `
        + `at ${VENUE.oval}, ${VENUE.park}.`,
    button: `Pay $${PRICE} now`,
    footnote: 'Payments are processed securely by Stripe.',
};

// ── CANCELLED (Alex, 23 Oct 2026) ──
// Heavy rain is forecast for the weekend, so the morning is called off. While this
// is true, LowerPlentyJrDay.jsx shows CANCELLED_COPY on the shared FinishedEventPage
// (no form, no payment), /pay and /success send people there, and the page is noindex.
// Registrations were closed in the database at 8:30am on Fri 23 Oct (see CLOSES_AT_ISO).
// Paid players are refunded in full, in Stripe, by staff (REFUND_LINE promises it).
// The Stripe Payment Link is deactivated separately, in Stripe.
export const CANCELLED = true;

// The morning that was planned, listed on the cancelled page in the shared layout.
export const CANCELLED_SESSIONS = [
    {
        key: 'morning',
        place: EVENT_NAME,
        when: `${DATE_FULL}, ${TIME}`,
        venue: `${VENUE.oval}, ${VENUE.park}, ${VENUE.suburb}`,
    },
];

export const CANCELLED_COPY = {
    kicker: 'Rajasthan Royals Academy · Melbourne',
    title: 'The Lower Plenty Morning Is Cancelled',
    intro:
        `We have cancelled the Junior Royals morning at ${CLUB} on ${DAY}. Heavy rain is forecast, and `
        + 'we do not think the ground will be fit to play on. Please do not come to the ground on Sunday '
        + 'morning. Registrations are closed and nothing can be paid on this page.',
    sessionsTitle: 'The morning that was planned',
    badge: 'Cancelled',
    nextTitle: 'What happens now',
    next: [
        {
            title: 'If you have paid',
            body:
                `We are refunding your $${PRICE} in full. It goes back to the card you paid with, and it can `
                + 'take a few days to show on your statement. You do not need to do anything. '
                + `Questions? Email ${CONTACT_EMAIL}.`,
        },
        {
            title: 'Looking for junior coaching now?',
            body: 'Our current programs are on the home page, with who each one is for and when it runs.',
            cta: { label: 'See what’s on now', to: '/' },
        },
    ],
    navCta: 'WHAT HAPPENS NOW',
};
