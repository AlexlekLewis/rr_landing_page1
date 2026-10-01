// ─────────────────────────────────────────────────────────────
// JUNIOR SESSIONS WITH SIDDHARTHA LAHIRI — /sid-juniors
//
// THE ONE CONFIG FILE. Every fact on this page lives here, or is imported
// from the data file that already holds it. Components only lay it out.
//
// Two sessions, one at each centre, each booked separately:
//   • Cranbourne North — Sunday 4 October 2026, 1:00–2:30pm, Elite Cricket
//     Centre, 30 Medley Drive. Same time and same centre as the open age trial.
//   • Mickleham — Monday 5 October 2026, 4:30–5:30pm, Mickleham Indoor Sports
//     Centre. Straight before the open age trial there.
//
// CONFIRMED by Alex: the Mickleham session (22–24 Sep 2026); the Cranbourne
// North session, ages 8 to 16 and $30 per player at both (29 Sep 2026).
// What each session is, stated no more strongly than this: time on the lanes
// with our coaches, and Sid as guest coach.
//
// Arrival: 30 minutes before the session starts (Alex, 2 Oct 2026). Sid is
// in Melbourne on 4 and 5 October (Alex, 2 Oct 2026). Do not add a kit list,
// a promise that parents can watch, or a Q&A segment. None of those is
// confirmed.
//
// Anything still unconfirmed is marked `// UNCONFIRMED — Alex to confirm`.
//
// The mentions of these sessions on other pages (home banner, What's On,
// Programs menu, open age trial page) read sidJuniorsPromo.js in this folder.
// If a date, time, age or price changes here, change it there too.
// ─────────────────────────────────────────────────────────────

import { getCentre } from '../performance-squads/data';
import { CENTRE as MICKLEHAM_CENTRE } from '../private-coaching/pcOptions';
// Only SID's identity fields are read here (name, title, employer,
// titleLine). Its attendance and separation lines are about the open age
// trial and must never render on this page.
import { SID } from '../open-age-trial/openAgeData';

// ── Players: CONFIRMED (Alex, 29 Sep 2026), both sessions. ──
export const MIN_AGE = 8;
export const MAX_AGE = 16;
export const AGE_RANGE = `${MIN_AGE} to ${MAX_AGE}`;

// ── House ratio for junior sessions ──
// Never more than six juniors per coach, never more than 16 in a session
// (four to a lane). 2 coaches = 12 places, 3 coaches = 16.
export const MIN_COACHES = 2;
export const PLAYERS_PER_COACH_MAX = 6;
export const SESSION_PLACES_CEILING = 16;
export const maxPlacesFor = (coachCount) => Math.min(
    SESSION_PLACES_CEILING,
    (Number.isInteger(coachCount) ? coachCount : 0) * PLAYERS_PER_COACH_MAX,
);

// Venues come from the data files that already hold them.
const SOUTH_EAST = getCentre('south-east-melbourne'); // Elite Cricket Centre, Cranbourne North
const NORTH = getCentre('north-melbourne'); // Mickleham Indoor Sports Centre, Mickleham

// ─────────────────────────────────────────────────────────────
// THE SESSIONS. Every per-session switch lives on its session.
//
//   bookingsOpen  open this session to bookings
//   coachCount    Academy coaches with verified Working with Children Checks
//                 rostered for the whole session. Sid is the guest coach and
//                 does not count. Names are not published.
//   capacity      places, within the house ratio above
//   full          close this session by hand the moment it is full
//   price         $ per player
//   signInTime    when to arrive: 30 minutes before the start (Alex, 2 Oct 2026)
//   paymentLink   null → booking request: no money is taken online and we
//                 email to confirm the place and how to pay. A Stripe Payment
//                 Link here → pay to book for this session. Before pasting
//                 one in, set its after-payment redirect to
//                 https://rramelbourne.com/sid-juniors/success?session=<key>
//                 and keep "Junior Royals", "Royals Academy", "Holiday" and
//                 "Elite" out of the Stripe product name (the Stripe webhook
//                 files unrecognised payments by those words).
//
// A session only takes bookings when bookingsOpen is true, coachCount is at
// least 2 and capacity fits the ratio. Anything short of that shows the
// session as closed and logs a warning.
// ─────────────────────────────────────────────────────────────
export const SESSIONS = [
    {
        key: 'cranbourne-north',
        centreName: SOUTH_EAST.suburb, // Cranbourne North
        venue: SOUTH_EAST.venue, // Elite Cricket Centre
        address: '30 Medley Drive, Cranbourne North', // CONFIRMED (Alex, 29 Sep 2026)
        dayLabel: 'Sunday 4 October',
        shortDay: 'Sun 4 Oct',
        dateLabel: 'Sunday 4 October 2026',
        timeLabel: '1:00–2:30pm',
        timeSpoken: '1:00 to 2:30pm',
        endTime: '2:30pm',
        durationLabel: '90 minutes',
        // The open age trial is in the same centre at the same time.
        alongsideTrial: true,
        lanesNote: null, // lane count not confirmed for this centre
        dbSlug: 'sid-juniors-2026-10-04-cranbourne-north',
        dbName: 'Junior session with Siddhartha Lahiri, Sun 4 Oct 2026, Cranbourne North',

        price: 30, // CONFIRMED (Alex, 29 Sep 2026)
        bookingsOpen: true, // Alex, 29 Sep 2026
        coachCount: 2, // Alex, 29 Sep 2026: two WWC-verified Academy coaches will be rostered per session; names are not published
        capacity: 12, // house ratio for 2 coaches
        full: false,
        signInTime: '12:30pm', // 30 minutes before the 1:00pm start (Alex, 2 Oct 2026)
        paymentLink: null, // UNCONFIRMED — Alex to confirm
    },
    {
        key: 'mickleham',
        centreName: NORTH.suburb, // Mickleham
        venue: NORTH.venue, // Mickleham Indoor Sports Centre
        address: MICKLEHAM_CENTRE.address, // 3 Eclipse Drive, Mickleham VIC 3064
        dayLabel: 'Monday 5 October',
        shortDay: 'Mon 5 Oct',
        dateLabel: 'Monday 5 October 2026',
        timeLabel: '4:30–5:30pm',
        timeSpoken: '4:30 to 5:30pm',
        endTime: '5:30pm',
        durationLabel: 'one hour',
        alongsideTrial: false,
        lanesNote: 'Four long lanes are booked for the hour.', // CONFIRMED (Alex, 22–24 Sep 2026)
        // Kept from the single-session page, with the centre added, so the
        // sessions sit side by side in the table under their own slugs.
        dbSlug: 'sid-juniors-2026-10-05-mickleham',
        dbName: 'Junior session with Siddhartha Lahiri, Mon 5 Oct 2026, Mickleham',

        price: 30, // CONFIRMED (Alex, 29 Sep 2026)
        bookingsOpen: true, // Alex, 29 Sep 2026
        coachCount: 2, // Alex, 29 Sep 2026: two WWC-verified Academy coaches will be rostered per session; names are not published
        capacity: 12, // house ratio for 2 coaches
        full: false,
        signInTime: '4:00pm', // 30 minutes before the 4:30pm start (Alex, 2 Oct 2026)
        paymentLink: null, // UNCONFIRMED — Alex to confirm
    },
];

export const ROUTE = '/sid-juniors';
export const SUCCESS_ROUTE = '/sid-juniors/success';
export const CONTACT_EMAIL = 'info@rramelbourne.com'; // same inbox the match and Spin Club pages use

// Bookings are written to the shared, slug-keyed `match_registrations` table
// (the match pages use it too), one row per booking. The slug says which
// session: `<dbSlug>-request` for a booking request, `<dbSlug>` once that
// session takes payment, so a switch to pay-to-book never mixes the two.
//
//   select * from match_registrations
//   where match_slug like 'sid-juniors-2026-10-0%' order by created_at;
export const DB_TABLE = 'match_registrations';

// ─────────────────────────────────────────────────────────────
// The guard and the derived per-session view. Components read these, never
// the raw switches.
// ─────────────────────────────────────────────────────────────
const gateProblems = (s) => {
    const problems = [];
    if (!Number.isInteger(s.coachCount) || s.coachCount < MIN_COACHES) {
        problems.push(`coachCount is ${s.coachCount}, at least ${MIN_COACHES} needed`);
    }
    if (!Number.isInteger(s.capacity) || s.capacity <= 0) {
        problems.push('capacity is not set');
    } else if (s.capacity > maxPlacesFor(s.coachCount)) {
        problems.push(`capacity ${s.capacity} is more than the ${maxPlacesFor(s.coachCount)} places ${s.coachCount} coaches allow`);
    }
    return problems;
};

const stateOf = (s) => {
    if (s.bookingsOpen !== true || gateProblems(s).length) return 'closed';
    if (s.full === true) return 'full';
    return 'open';
};

SESSIONS.forEach((s) => {
    const problems = gateProblems(s);
    if (s.bookingsOpen === true && problems.length) {
        console.warn(`[sid-juniors] ${s.centreName}: bookingsOpen is true, but bookings stay CLOSED: ${problems.join('; ')}.`);
    }
});

export const SESSION_VIEW = SESSIONS.map((s) => ({
    ...s,
    state: stateOf(s),
    payToBook: Boolean(s.paymentLink),
    requestSlug: `${s.dbSlug}-request`,
    priceLabel: `$${s.price} per player`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.venue}, ${s.address}`)}`,
    arriveLine: s.signInTime
        ? `Please arrive by ${s.signInTime}, 30 minutes before the session starts.`
        : 'Please arrive 30 minutes before the session starts.',
}));

export const getSession = (key) => SESSION_VIEW.find((s) => s.key === key) || null;
export const OPEN_SESSIONS = SESSION_VIEW.filter((s) => s.state === 'open');
export const ANY_PAY_TO_BOOK = SESSION_VIEW.some((s) => s.payToBook);
const ALL_REQUEST_MODE = !ANY_PAY_TO_BOOK;

// 'open' while any session takes bookings; otherwise 'closed' if a session is
// still waiting on its switches, and 'full' only when every session is full.
export const PAGE_STATE = OPEN_SESSIONS.length
    ? 'open'
    : SESSION_VIEW.some((s) => s.state === 'closed') ? 'closed' : 'full';

const samePrice = SESSION_VIEW.every((s) => s.price === SESSION_VIEW[0].price);
export const PRICE_SUMMARY = samePrice
    ? `$${SESSION_VIEW[0].price} per player, per session`
    : SESSION_VIEW.map((s) => `$${s.price} at ${s.centreName}`).join(', ');

const listJoin = (items) => (items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

// ── Sid ──
// EVIDENCE BASE, and the whole of it: his name and title, his employer, the
// photo, that he is in Melbourne on 4 and 5 October, and that he is scheduled at
// both sessions as guest coach. No honours, former clubs, quotes, or claims
// about players he has worked with.
//
// Name and title read the trial page's SID, so the pages cannot drift: full
// name the first time the page names him, "Sid" after.
export const SID_NAME = SID.name; // Siddhartha Lahiri
export const SID_TITLE_LINE = SID.titleLine; // Head of International Player Development and Performance Coach, Rajasthan Royals
// Its own up-to-date photo (Alex, 27 Sep 2026): Sid coaching, which suits a
// junior session where he is guest coach. The trial page shows him watching.
export const SID_PHOTO = '/assets/performance-squads/sid-lahiri-coaching-2026.jpg';
export const SID_PHOTO_ALT = 'Sid Lahiri coaching at a Rajasthan Royals training session';
export const SID_PHOTO_CAPTION = 'Sid Lahiri coaching at a Rajasthan Royals session.';
export const SID_IN_MELBOURNE = 'Sunday 4 and Monday 5 October'; // Alex, 2 Oct 2026

// ── Call to action, by page state ──
// "Book a place" matches the all-families email's button ("BOOK A JUNIOR
// PLACE"). In booking-request mode the form says plainly that it is a request
// and that no place is held until we confirm.
export const CTA = {
    open: 'Book a place',
    closed: 'Places open soon',
    full: 'Sessions are full',
}[PAGE_STATE];

// ── Hero ──
export const HERO = {
    kicker: 'Rajasthan Royals Academy Melbourne',
    headlineTop: 'Junior Sessions',
    // "Sid" on purpose. His full name does not fit the hero column at desktop
    // size and breaks the headline into four lines. The body line under it
    // gives his full name and title.
    headlineBottom: 'With Sid Lahiri',
    // The time is kept on one line when the tagline wraps on a phone.
    taglines: SESSION_VIEW.map((s) => ({ key: s.key, lead: `${s.centreName} · ${s.shortDay}`, time: s.timeLabel })),
    body:
        `Two junior coaching sessions for players aged ${AGE_RANGE}, one at each of our centres. `
        + `Our coaches run them, and ${SID_NAME}, ${SID_TITLE_LINE}, is scheduled to join both `
        + 'as guest coach.',
    secondaryCta: 'Session details',
};

// ── The Sid section ──
export const SID_SECTION = {
    title: 'Sid Lahiri Is Coming To Both Centres',
    paragraphs: [
        `${SID_NAME}, known as Sid, is ${SID.title} at the ${SID.employer}.`,
        `He is in Melbourne on ${SID_IN_MELBOURNE}, and he is scheduled to join both junior `
        + `sessions as guest coach: ${listJoin(SESSION_VIEW.map((s) => `${s.centreName} on ${s.dayLabel}`))}.`,
    ],
};

// ── The session details ──
export const NOT_A_TRIAL = 'This is a coaching session, not a trial. Nobody is assessed, ranked or selected.';

export const SESSION_SECTION = {
    eyebrow: 'The Sessions',
    title: 'One Session At Each Centre',
    sub:
        `Coaching for players aged ${AGE_RANGE}. ${NOT_A_TRIAL} Each session is booked separately, `
        + 'so book the one you can get to.',
    costNote: ALL_REQUEST_MODE
        ? 'Nothing is paid on this page. We email you to confirm the place and how to pay.'
        : 'See the booking form for how each session is paid.',
};

export const STATE_BADGE = {
    open: 'Taking bookings',
    closed: 'Places open soon',
    full: 'Full',
};

// Older players in the same family. The open age trial runs at the same time
// at Cranbourne North and straight after the junior session at Mickleham.
// Link to it, and never restate here who is at the trial. The ages and times
// are the trial page's own (openAgeData MIN_AGE, MAX_AGE, TRIAL_SESSIONS):
// if they move there, move them here.
export const OLDER_PLAYERS = {
    text:
        'Aged 16 to 25? The open age trial runs at Cranbourne North at the same time as the junior '
        + 'session (Sunday, 1:00pm) and at Mickleham straight after it (Monday, 5:30pm). It is a '
        + 'separate trial with its own booking.',
    linkLabel: 'See the open age trial',
    href: '/performance-squads-open-trial',
};

// ── The booking section, by page state ──
export const CLOSED_COPY = {
    eyebrow: 'Booking',
    title: 'Places Open Soon',
    body: 'Places open once our coaches are confirmed. Check back soon, or email',
};

export const FULL_COPY = {
    eyebrow: 'Sessions Full',
    title: 'Both Sessions Are Full',
    body:
        `Every place in the junior sessions with ${SID_NAME} has gone, so we are not taking more `
        + 'bookings.',
};

export const FORM_COPY = {
    eyebrow: ALL_REQUEST_MODE ? 'Booking Request' : 'Book A Place',
    title: 'Book A Place',
    sub: ALL_REQUEST_MODE
        ? "Choose a session and send us the player's details. No payment is taken now and no place "
          + 'is held yet. We will email you to confirm the place and how to pay.'
        : "Choose a session and enter the player's details. How that session is paid is shown "
          + 'under the button.',
};

// Per chosen session: what the button says and what it promises.
export const submitCopyFor = (s) => (s && s.payToBook
    ? {
        submit: `Continue To Payment · $${s.price}`,
        footnote: 'Payments are processed securely by Stripe. The place is not booked until the payment goes through.',
    }
    : {
        submit: 'Send Booking Request',
        footnote: 'No payment is taken now, and no place is held until we email you to confirm it.',
    });

// Health notes. No deletion date is promised: nothing deletes them on a
// schedule.
export const NOTES_FIELD = {
    label: 'Anything the coaches should know?',
    help:
        'For example asthma, allergies, medication your player carries, an injury, or anything that '
        + 'helps them enjoy the session. Only the Academy staff running this session will use it, and '
        + 'only to keep your player safe on the day.',
};

// Photo consent: two separate, optional answers, both unticked to start.
// Neither one stops a booking.
export const PHOTO_CONSENT = {
    intro:
        "We only photograph or film players whose parent or guardian says yes. Saying no makes no "
        + "difference to your player's place. We never publish a player's name with their photo.",
    rra: 'RRA Melbourne may use photos and video of my player from this session on its website, emails and social media.',
    royals: 'The Rajasthan Royals may also use them on their own channels, which reach a worldwide audience.',
    after: "Parents are welcome to photograph their own player, including with Sid. Please don't photograph other players.",
};

// ── FAQ. Short and factual. ──
export const FAQS = [
    {
        q: 'Is Sid really going to be there?',
        a:
            `That is the plan. ${SID_NAME}, ${SID.title} at the ${SID.employer}, is in Melbourne on `
            + `${SID_IN_MELBOURNE} and is scheduled to join both junior sessions as guest coach.`,
    },
    {
        q: 'Is this a trial?',
        a: `No. ${NOT_A_TRIAL}`,
    },
    {
        q: 'What does it cost, and when do I pay?',
        a: ALL_REQUEST_MODE
            ? `${PRICE_SUMMARY}. Nothing is paid on this page. Book a place and we will email you to `
              + 'confirm it and explain how to pay. No place is held until we do.'
            : `${PRICE_SUMMARY}. The booking form shows how each session is paid.`,
    },
    {
        q: 'Who is it for, and when is it?',
        a:
            `Players aged ${AGE_RANGE}. There are two sessions: `
            + `${listJoin(SESSION_VIEW.map((s) => `${s.centreName} on ${s.dayLabel}, ${s.timeSpoken}, at the ${s.venue}`))}. `
            + 'Book the one you can get to.',
    },
];

export const FAQ_HEADING = {
    eyebrow: 'Questions',
    title: 'Frequently Asked',
    sub: `Anything not covered here? Email ${CONTACT_EMAIL} and we will come back to you.`,
};
