// ─────────────────────────────────────────────────────────────
// JUNIOR SESSION WITH SID LAHIRI — /sid-juniors
//
// THE ONE CONFIG FILE. Every fact on this page lives here, or is imported
// from the data file that already holds it. Components only lay it out.
//
// CONFIRMED by Alex (WhatsApp, 22–24 September 2026):
//   • Monday 5 October 2026, 4:30–5:30pm, Mickleham Indoor Sports Centre.
//   • Four long lanes are booked for it.
//   • Sid Lahiri, Rajasthan Royals Performance Coach and Head of Global
//     Academies, is in Melbourne 3–6 October.
//   • Alex's words: "Special Junior event with Sid @ Mickleham 4:30–5:30pm".
//
// SAFEGUARDING REVIEW (27 September 2026): BOOKINGS BLOCKED until two named
// Academy coaches with verified Working with Children Checks are rostered —
// Sid does NOT count as one of them — and the number of places is set by the
// coach count. So bookings default to CLOSED, and a guard below keeps them
// closed until the coaches and capacity are filled in and add up. Our
// Mickleham coaches run the session; Sid is the guest coach.
//
// Do not add an arrival time, a kit list beyond what is below, a promise
// that parents can watch, or a Q&A segment. None of those is confirmed.
//
// UNCONFIRMED DEFAULTS all sit in the UNCONFIRMED block, one per line, each
// marked `// UNCONFIRMED — Alex to confirm`.
// ─────────────────────────────────────────────────────────────

import { getCentre } from '../performance-squads/data';
import { CENTRE as MICKLEHAM_CENTRE } from '../private-coaching/pcOptions';
// Only SID's identity fields are used here (name, title, employer, photo).
// Its `attendance` and `separation` lines are about the open age trial and
// must never render on this page.
import { SID } from '../open-age-trial/openAgeData';

// ─────────────────────────────────────────────────────────────
// UNCONFIRMED — every guess on the page, and nothing else.
// ─────────────────────────────────────────────────────────────
export const UNCONFIRMED = {
    minAge: 8, // UNCONFIRMED — Alex to confirm
    maxAge: 14, // UNCONFIRMED — Alex to confirm
    price: 30, // UNCONFIRMED — Alex to confirm ($ per player)

    // ── THE SAFEGUARDING GATE ──
    // Bookings stay closed until ALL of these hold:
    //   bookingsOpen is true, at least TWO coach names are listed, and
    //   capacity is a whole number no bigger than the coaches allow.
    //
    // CAPACITY RULE: four players to a lane, and never more than six juniors
    // per coach. Four lanes are booked, so 16 is the ceiling.
    //   2 coaches = 12 places
    //   3 coaches = 16 places  (the lane ceiling, not 18)
    bookingsOpen: false, // UNCONFIRMED — Alex to confirm
    // Academy coaches with VERIFIED Working with Children Checks who are on
    // the lanes for the whole hour, e.g. ['First Last', 'First Last'].
    // Sid is the guest coach and does NOT count.
    coaches: [], // UNCONFIRMED — Alex to confirm
    capacity: null, // UNCONFIRMED — Alex to confirm (a number, set by the rule above)

    // Close bookings by hand the moment the session is at capacity.
    full: false, // UNCONFIRMED — Alex to confirm

    // Shown only once set, e.g. '4:15pm'. Never invent one.
    signInTime: null, // UNCONFIRMED — Alex to confirm

    // Who a parent contacts about a player's safety. An email address renders
    // as a link; anything else (a name and number) renders as plain text.
    concernsContact: 'info@rramelbourne.com', // UNCONFIRMED — Alex to name a person

    // PAYMENT MODE SWITCH.
    //   null  → BOOKING REQUEST. The form takes details and no money. The
    //           page says plainly that no payment has been taken and no place
    //           is held until we email to confirm the place and how to pay.
    //   'https://buy.stripe.com/…' → PAY TO BOOK. After the details are saved
    //           the form sends the parent to this Stripe Payment Link, in the
    //           same tab, and the Sid line adds the full-refund promise.
    //
    // BEFORE PASTING A LINK IN:
    //   1. In Stripe, set the link's after-payment redirect to
    //      https://rramelbourne.com/sid-juniors/success
    //   2. Name the Stripe product WITHOUT the words "Junior Royals", "Royals
    //      Academy", "Holiday" or "Elite". api/stripe-webhook.js files an
    //      unrecognised payment by those words in the product name, so any of
    //      them would record this payment against the wrong program.
    paymentLink: null, // UNCONFIRMED — Alex to confirm
};

// ─────────────────────────────────────────────────────────────
// The guard and the switches. The page reads these, never the raw values.
// ─────────────────────────────────────────────────────────────
export const LANE_COUNT = 4; // CONFIRMED: four long lanes are booked
export const PLAYERS_PER_LANE = 4;
export const PLAYERS_PER_COACH_MAX = 6;
export const MIN_COACHES = 2;

export const COACHES = (UNCONFIRMED.coaches || [])
    .map((n) => String(n).trim())
    .filter(Boolean);

// The most places the rostered coaches and the lanes allow together.
export const MAX_SAFE_CAPACITY = Math.min(
    LANE_COUNT * PLAYERS_PER_LANE,
    COACHES.length * PLAYERS_PER_COACH_MAX,
);

export const CAPACITY = Number.isInteger(UNCONFIRMED.capacity) && UNCONFIRMED.capacity > 0
    ? UNCONFIRMED.capacity
    : null;

const gateProblems = [];
if (COACHES.length < MIN_COACHES) gateProblems.push(`${COACHES.length} coach(es) listed, at least ${MIN_COACHES} needed`);
if (CAPACITY === null) gateProblems.push('capacity is not set');
else if (CAPACITY > MAX_SAFE_CAPACITY) gateProblems.push(`capacity ${CAPACITY} is more than the ${MAX_SAFE_CAPACITY} places ${COACHES.length} coach(es) and ${LANE_COUNT} lanes allow`);

export const BOOKINGS_OPEN = UNCONFIRMED.bookingsOpen === true && gateProblems.length === 0;

if (UNCONFIRMED.bookingsOpen === true && !BOOKINGS_OPEN) {
    console.warn(`[sid-juniors] bookingsOpen is true, but bookings stay CLOSED: ${gateProblems.join('; ')}.`);
}

export const PAY_TO_BOOK = Boolean(UNCONFIRMED.paymentLink);
export const IS_FULL = UNCONFIRMED.full === true;

// 'closed' → coaches not confirmed yet; 'full' → closed by hand; 'open'.
export const BOOKING_STATE = !BOOKINGS_OPEN ? 'closed' : IS_FULL ? 'full' : 'open';

export const MIN_AGE = UNCONFIRMED.minAge;
export const MAX_AGE = UNCONFIRMED.maxAge;
export const PRICE = UNCONFIRMED.price;
export const PAYMENT_LINK = UNCONFIRMED.paymentLink;
export const SIGN_IN_TIME = UNCONFIRMED.signInTime || null;
export const CONCERNS_CONTACT = UNCONFIRMED.concernsContact;
export const CONCERNS_IS_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(CONCERNS_CONTACT || '').trim());
export const AGE_RANGE = `${MIN_AGE} to ${MAX_AGE}`;
export const PRICE_LABEL = `$${PRICE} per player`;

export const ROUTE = '/sid-juniors';
export const SUCCESS_ROUTE = '/sid-juniors/success';
export const CONTACT_EMAIL = 'info@rramelbourne.com'; // same inbox the match and Spin Club pages use

// ── Where the bookings go ──
// The generic, slug-keyed table the match pages already use. Nothing else
// reads it: no trigger, view, function, cron job, API route, edge function or
// sheet sync, so the health notes stay in the table. The browser may insert
// but never read (anon and authenticated both see 0 rows).
//
// Booking requests and paid bookings get different slugs — the same rule the
// match page uses to keep its emergency list apart from players who paid —
// so after a switch to pay-to-book, Alex can see who still needs a payment
// email.
//
//   select * from match_registrations
//   where match_slug like 'sid-juniors-2026-10-05%' order by created_at;
//
// The match-only columns (safety equipment, filming, volunteering) are not
// asked on this page and stay at their defaults. `club`, `notes` and
// `accept_royals_media` were added for this page (migrations 20260927063602
// and 20260927065608).
export const DB = {
    table: 'match_registrations',
    slug: 'sid-juniors-2026-10-05',
    requestSlug: 'sid-juniors-2026-10-05-request',
    name: 'Junior session with Sid Lahiri, Mon 5 Oct 2026, Mickleham',
};

// ── The session. CONFIRMED (Alex, 22–24 September 2026). ──
// Venue and suburb come from the Performance Squads centre list, and the
// street address from the private coaching page, so no fact is typed twice.
const NORTH = getCentre('north-melbourne');

export const SESSION = {
    dayLabel: 'Monday 5 October',
    dateLabel: 'Monday 5 October 2026',
    timeLabel: '4:30–5:30pm',
    timeSpoken: '4:30 to 5:30pm',
    endTime: '5:30pm',
    venue: NORTH.venue, // Mickleham Indoor Sports Centre
    suburb: NORTH.suburb, // Mickleham
    address: MICKLEHAM_CENTRE.address, // 3 Eclipse Drive, Mickleham VIC 3064
    lanes: 'Four long lanes are booked for the hour.',
};

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SESSION.venue}, ${SESSION.address}`,
)}`;

// ── Sid. ──
// EVIDENCE BASE, and the whole of it: his name and titles, his employer, the
// photo, that he is in Melbourne 3–6 October, and that he is scheduled to be
// at this session as guest coach. No honours, former clubs, quotes, or claims
// about players he has worked with.
//
// "Head of Global Academies" is in Alex's brief (22–24 September 2026) and
// is already public on the home page and the tours page.
export const SID_NAME = SID.name;
export const SID_PHOTO = SID.photo;
export const SID_PHOTO_ALT = SID.photoAlt;
export const SID_PHOTO_CAPTION = SID.photoCaption;
export const SID_TITLE_LINE = `${SID.employer} ${SID.title} and Head of Global Academies`;
export const SID_IN_MELBOURNE = '3 to 6 October';

// THE HEDGE. Families book on the strength of one named person turning up,
// so his attendance is never stated as a certainty. Same words in the hero,
// the Sid section, the form's confirmation and the FAQ. The refund promise
// appears only once there is a payment to refund.
export const SID_CAVEAT = PAY_TO_BOOK
    ? "If Sid can't be there, we'll tell you before the day, and you can cancel for a full refund."
    : "If Sid can't be there, we'll tell you before the day.";

// ── Call to action, by booking state ──
// "Book a place" matches the all-families email's button ("BOOK A JUNIOR
// PLACE"). In booking-request mode the form itself says plainly that it is a
// request and that no place is held until we confirm.
export const CTA = {
    closed: 'Places open soon',
    full: 'This session is full',
    open: 'Book a place',
}[BOOKING_STATE];

// ── Hero ──
export const HERO = {
    kicker: 'Rajasthan Royals Academy Melbourne',
    headlineTop: 'Junior Session',
    headlineBottom: `With ${SID.name}`,
    tagline: `${SESSION.dayLabel} · ${SESSION.timeLabel} · ${SESSION.suburb}`,
    body:
        `An hour on the lanes at the ${SESSION.venue} for players aged ${AGE_RANGE}. Our `
        + `Mickleham coaches run it, and ${SID.name}, ${SID_TITLE_LINE}, is scheduled to join `
        + 'them as guest coach.',
    secondaryCta: 'Session details',
};

// ── The Sid section ──
export const SID_SECTION = {
    title: `${SID.name} Is Coming To ${SESSION.suburb}`,
    paragraphs: [
        // "Oversees the Royals' academies around the world, including ours" is
        // the all-families email's own explanation of the title (Copy source
        // of truth, 28 Sep 2026), so the email and the page say it the same way.
        `${SID.name} is the ${SID_TITLE_LINE}: he oversees the Royals' academies around the `
        + 'world, including ours.',
        `He is in Melbourne from ${SID_IN_MELBOURNE}, and he is scheduled to join this session `
        + 'as guest coach, alongside our Mickleham coaches.',
    ],
};

// ── The session details ──
export const NOT_A_TRIAL = 'This is a coaching session, not a trial. Nobody is assessed, ranked or selected.';

export const SESSION_SECTION = {
    eyebrow: 'The Session',
    title: 'One Hour On The Lanes',
    sub: `An hour of coaching for players aged ${AGE_RANGE}. ${NOT_A_TRIAL}`,
    costNote: PAY_TO_BOOK
        ? 'Paid by card when you book. The place is booked once the payment goes through.'
        : 'Nothing is paid on this page. We email you to confirm the place and how to pay.',
};

// Older players in the same family. Alex's call (26 September 2026): the open
// age trial at Mickleham follows this session. Link to it, and never restate
// here who is at the trial. The age range and time are the trial page's own
// (openAgeData MIN_AGE, MAX_AGE and its Mickleham session) — if they move
// there, move them here.
export const OLDER_PLAYERS = {
    text:
        'Aged 16 to 25? The open age trial at Mickleham starts at 5:30pm, straight after this '
        + 'session. It is a separate trial with its own booking.',
    linkLabel: 'See the open age trial',
    href: '/performance-squads-open-trial',
};

// ── Who's looking after your player (safeguarding review, 27 Sep 2026) ──
const listNames = (names) => (names.length <= 1
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

export const SUPERVISION = {
    eyebrow: 'Safe And Supervised',
    title: "Who's Looking After Your Player",
    points: [
        COACHES.length
            ? `${listNames(COACHES)}, our Mickleham coaches, run the session, with ${SID.name} as guest coach.`
            : `Our Mickleham coaches run the session, with ${SID.name} as guest coach.`,
        'At least two Academy coaches with verified Working with Children Checks are on the lanes '
        + 'for the whole hour, and no adult is ever alone with a player.',
        // "At most", not "up to": the copy rules ban "up to" as a weasel number.
        CAPACITY
            ? `At most ${CAPACITY} players, four to a lane, grouped by age.`
            : 'Four players to a lane, grouped by age.',
    ],
};

export const ON_THE_DAY = [
    // Only once a sign-in time is confirmed.
    ...(SIGN_IN_TIME ? [{ key: 'sign-in', text: `Sign your player in at the lanes from ${SIGN_IN_TIME}.` }] : []),
    {
        key: 'pick-up',
        text:
            `Collect your player from the lanes at ${SESSION.endTime}. We only release players to the `
            + 'parent or guardian named on the booking.',
    },
    { key: 'helmet', text: 'Bring a helmet with a stem guard. Nobody bats against a hard ball without one.' },
    // The junior pages' own kit line (Junior Royals, holiday and open day).
    { key: 'water', text: 'Bring a drink bottle and water.' },
];

// ── The booking section, by state ──
export const CLOSED_COPY = {
    eyebrow: 'Booking',
    title: 'Places Open Soon',
    body: 'Places open once our coaches are confirmed. Check back soon, or email',
};

export const FULL_COPY = {
    eyebrow: 'Session Full',
    title: 'This Session Is Full',
    body:
        `Every place in the junior session with ${SID.name} on ${SESSION.dayLabel} has gone, so `
        + 'we are not taking more bookings.',
};

export const FORM_COPY = PAY_TO_BOOK
    ? {
        eyebrow: 'Book & Pay',
        title: 'Book A Place',
        sub:
            `Enter the player's details, then pay $${PRICE} by card. The place is not booked `
            + 'until the payment goes through.',
        submit: `Continue To Payment · $${PRICE}`,
        footnote:
            'Payments are processed securely by Stripe. The place is not booked until the payment '
            + 'goes through.',
    }
    : {
        eyebrow: 'Booking Request',
        title: 'Book A Place',
        sub:
            "Send us the player's details. No payment is taken now and no place is held yet. "
            + 'We will email you to confirm the place and how to pay.',
        submit: 'Send Booking Request',
        footnote:
            'No payment is taken now, and no place is held until we email you to confirm it.',
    };

// Health notes. No deletion date is promised: nothing in the database
// deletes them on a schedule.
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
            `That is the plan. ${SID.name}, ${SID_TITLE_LINE}, is in Melbourne from `
            + `${SID_IN_MELBOURNE} and is scheduled to join this session as guest coach. ${SID_CAVEAT}`,
    },
    {
        q: 'Is this a trial?',
        a: `No. ${NOT_A_TRIAL}`,
    },
    {
        q: 'What does it cost, and when do I pay?',
        a: PAY_TO_BOOK
            ? `${PRICE_LABEL}, paid by card when you book. The place is booked once the payment `
              + 'goes through.'
            : `${PRICE_LABEL}. Nothing is paid on this page. Book a place and we will email you to `
              + 'confirm it and explain how to pay. No place is held until we do.',
    },
    {
        q: 'Who is it for?',
        a:
            `Players aged ${AGE_RANGE}. The session is one hour on ${SESSION.dayLabel}, `
            + `${SESSION.timeSpoken}, at the ${SESSION.venue}.`,
    },
];

export const FAQ_HEADING = {
    eyebrow: 'Questions',
    title: 'Frequently Asked',
    sub: `Anything not covered here? Email ${CONTACT_EMAIL} and we will come back to you.`,
};
