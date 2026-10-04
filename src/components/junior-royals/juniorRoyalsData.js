// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — every fact and every line of copy on /junior-royals.
//
// Alex, 5 Oct 2026: Junior Royals stops being a term program. It becomes a
// year-round MEMBERSHIP on the same model as Performance Squads:
//   • $149 joining fee, paid once (and paid again to rejoin after cancelling)
//   • $30 a week, charged EVERY week of the year, school holidays included
//   • training on Wednesday nights in school terms only
//   • Mickleham and Cranbourne North; first session Wednesday 28 October
//   • Sunday-morning Junior Royals match days with a separate match fee
//   • join any time, cancel any time
// Language rule (Alex, 5 Oct 2026): a 10-year-old must be able to understand
// that this is a YEARLY membership fee paid as a weekly plan, and that is why
// payments run all year — to hold the place and keep member prices.
//
// MOCK-UP: while MOCKUP is true the page shows a review banner, highlights every
// tbc() value in yellow and the form saves nothing. Before go-live every tbc()
// must be confirmed and replaced with plain text, and MOCKUP set to false.
// ─────────────────────────────────────────────────────────────

import { DIRECTOR, REGIONAL_COACHES } from '../coaches/coachData';

export const MOCKUP = true;

// A value Alex has not confirmed yet. Rendered highlighted on the mock-up.
export const tbc = (text, why) => ({ tbc: true, text, why });

export const money = (n) => `$${n.toLocaleString('en-AU', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
})}`;

// ── Membership fees — all GST-inclusive (consumer-law.md §1) ──
export const FEES = {
    joining: 149,     // once; paid again to rejoin after cancelling
    weekly: 30,       // every week of the year, school holidays included
    weeksPerYear: 52,
};
export const YEARLY = FEES.weekly * FEES.weeksPerYear;          // 1560 — worked out, never typed
export const FIRST_PAYMENT = FEES.joining + FEES.weekly;        // 179 — joining fee + first week (PS model)
export const GST_NOTE = 'All prices include GST.';

// ── When ──
export const FIRST_SESSION = { long: 'Wednesday 28 October', short: 'Wed 28 Oct', iso: '2026-10-28' };
// Wednesdays inside the Victorian school terms (vic.gov.au term dates, checked 5 Oct 2026).
export const CALENDAR = [
    { label: 'Rest of 2026', dates: 'Wed 28 Oct – Wed 16 Dec', sessions: 8 },
    { label: 'Summer holidays', dates: 'No training · 17 Dec – 2 Feb', sessions: 0, holiday: true },
    { label: 'Term 1, 2027', dates: 'Wed 3 Feb – Wed 24 Mar', sessions: 8 },
    { label: 'Term 2, 2027', dates: 'Wed 14 Apr – Wed 23 Jun', sessions: 11 },
    { label: 'Term 3, 2027', dates: 'Wed 14 Jul – Wed 15 Sep', sessions: 10 },
    { label: 'Term 4, 2027', dates: 'Wed 6 Oct – Wed 15 Dec', sessions: 11 },
];
export const SESSIONS_PER_YEAR = 40; // 2027: 8 + 11 + 10 + 11

export const GROUPS = [
    { time: '6:00pm – 7:00pm', who: tbc('Younger players', 'Which ages train at 6:00pm?') },
    { time: '7:00pm – 8:00pm', who: tbc('Older players', 'Which ages train at 7:00pm?') },
];

export const AGES = tbc('7–15', 'Still ages 7–15? (carried over from the Term 3 page)');
export const PLAYERS_PER_COACH = tbc('[X] players per coach', 'How many players per coach?');
export const JOINING_OPENS = tbc('Monday 19 October', 'What date does joining (payment) open?');

// ── Where ── (addresses as already published on the site)
export const CENTRES = [
    {
        value: 'mickleham',
        region: 'North Melbourne',
        venue: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
        mapsUrl: 'https://maps.google.com/?q=Mickleham+Indoor+Sports+Centre+3+Eclipse+Drive+Mickleham+VIC+3064',
        coach: { ...DIRECTOR, jrRole: 'Head Coach, Mickleham' },
    },
    {
        value: 'cranbourne-north',
        region: 'South-East Melbourne',
        venue: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
        mapsUrl: 'https://maps.google.com/?q=Elite+Cricket+Centre+30+Medley+Drive+Cranbourne+North+VIC+3977',
        coach: { ...REGIONAL_COACHES[0], jrRole: tbc('Head Coach, Cranbourne North', 'Is Alex Thornhill Head Coach at Cranbourne North?') },
    },
];
export const CENTRES_APART = 'The two centres are about 70 km apart, so choose the one you can get to every Wednesday.';
export const NOT_RUNNING = 'There is no Junior Royals at Hallam or Williamstown.';

// ── Copy ──

export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    why: 'Players improve when they train every week with the same coach, all year round.',
    facts: [
        { k: 'Who', v: ['Players aged ', AGES] },
        { k: 'When', v: ['Wednesday nights, one hour, at 6:00pm or 7:00pm, in school terms'] },
        { k: 'Where', v: ['Mickleham and Cranbourne North'] },
        { k: 'Starts', v: [FIRST_SESSION.long] },
        { k: 'Cost', v: [`${money(FEES.joining)} to join, then ${money(FEES.weekly)} a week (incl. GST)`] },
    ],
    noPayment: 'No payment now. No place is held yet.',
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'How the membership works',
    sticky: `${money(FEES.weekly)} a week · starts ${FIRST_SESSION.short}`,
};

export const WHY = {
    eyebrow: 'Why Junior Royals',
    title: 'Every week, all year',
    body: [
        'Young cricketers get better by training every week with a coach who knows their game. When coaching stops at the end of each term, players lose that rhythm and spend the first few weeks of the next one getting it back.',
        'So from 28 October, Junior Royals runs right through the school year. Your player keeps the same coach and the same group, and we only stop for the school holidays.',
    ],
};

export const HOW = {
    eyebrow: 'How it runs',
    title: 'One hour, every Wednesday',
    intro: [
        'Every Wednesday in school terms, your player trains for one hour with their group at the centre you choose. There are two groups each night, and we tell you which one your player is in.',
    ],
    // From Andy's Term 3 age-group copy, reworded for the year-round program.
    ageBands: [
        { ages: '7–9', points: ['Building the basic skills of batting, bowling and fielding', 'Games that teach how cricket is played', 'Getting ready to play junior club cricket'] },
        { ages: '10–12', points: ['Skill-focused sessions, including the bowling machine', 'Extra training for players already playing club cricket'] },
        { ages: '13–15', points: ['Harder, skill-focused sessions, including the bowling machine', 'Extra training for players playing competitive cricket'] },
    ],
    details: [
        ['Group size: ', PLAYERS_PER_COACH],
        ['Every coach holds a current Working With Children Check. ', tbc('Confirm', 'Confirm every Junior Royals coach has a current WWCC')],
        ['Parents can follow attendance and coach feedback in the Rajasthan Royals Academy app. ', tbc('Confirm', 'Is the Academy app being used for Junior Royals?')],
    ],
};

// The membership in words a 10-year-old can follow. One idea per line.
export const MEMBERSHIP = {
    eyebrow: 'The membership',
    title: 'How the membership works',
    lead: 'Junior Royals is a membership. You join once, and your player trains with us every Wednesday of the school year.',
    simple: [
        `Joining costs ${money(FEES.joining)}, once.`,
        `Then it costs ${money(FEES.weekly)} a week, every week of the year.`,
        `That adds up to ${money(YEARLY)} a year. We split it into weekly payments so you don't have to pay it all at once.`,
        "You keep paying in the school holidays, even though there's no training. That keeps your player's place, and your member prices, while we're on a break.",
        `You can stop any time. If you stop and want to come back later, you pay the ${money(FEES.joining)} joining fee again.`,
    ],
    firstPayment: ['When you join, your first payment is ', money(FIRST_PAYMENT), `: the ${money(FEES.joining)} joining fee plus your first week. `, tbc('Confirm', 'Same as Performance Squads: joining fee + first week charged together?')],
    gst: GST_NOTE,
    includesTitle: 'What a member gets',
    includes: [
        { title: `About ${SESSIONS_PER_YEAR} sessions a year`, body: 'One hour every Wednesday in school terms, at your centre, in your player\'s group.' },
        { title: 'A place that\'s kept all year', body: 'Your player keeps their place in their group over the school holidays, as long as the membership is paid.' },
        { title: 'Member prices on masterclasses', body: 'Lower prices on our special masterclasses.' },
        { title: 'Special-guest events', body: ['Access to all our future special-guest events, when Royals coaches and guests visit Melbourne. ', tbc('Free, or member price?', 'Are special-guest events free for members, or at a member price?')] },
        { title: 'Sunday match days', body: 'Members can enter our Junior Royals match days. Each match has its own match fee.' },
    ],
};

export const MATCHES = {
    eyebrow: 'Match days',
    title: 'Sunday morning games',
    body: [
        'On Sunday mornings we will run Junior Royals match days, where our players play games against each other. Some are modified matches, with the rules changed to suit the age group.',
        'Match days are not part of the weekly membership. Each match has its own match fee, and we tell you what it is before you enter.',
    ],
    details: [
        ['First match day: ', tbc('date to be confirmed', 'First Sunday match date?')],
        ['Where: ', tbc('venue to be confirmed', 'Match-day venue?')],
        ['Match fee: ', tbc('to be confirmed', 'How much is the match fee?')],
    ],
};

export const WHERE = {
    eyebrow: 'Where',
    title: 'Two centres, every Wednesday',
};

export const FORM = {
    eyebrow: 'Register your interest',
    title: 'Join the list',
    intro: ['No payment now, and no place is held yet. Joining opens on ', JOINING_OPENS, '. Everyone on this list gets the link to join before we announce it anywhere else.'],
    mockupNote: 'Mock-up: this form is not connected yet. Nothing you type is saved.',
    done: {
        title: "You're on the list",
        body: `We've got your details. No payment has been taken and no place is held yet. We'll email you the link to join before joining opens, and your player's first session would be ${FIRST_SESSION.long}.`,
    },
    contact: 'info@rramelbourne.com',
};

export const FAQS = [
    {
        q: 'Why do we pay in the school holidays when there is no training?',
        a: `Because it is a yearly membership. The yearly fee is ${money(YEARLY)}, and we split it into ${money(FEES.weekly)} a week so you don't pay it all at once. Paying through the holidays keeps your player's place in their group and keeps your member prices.`,
    },
    {
        q: 'How much does a full year cost?',
        a: `${money(FEES.joining)} to join, once. Then ${money(FEES.weekly)} a week, which is ${money(YEARLY)} over a full year. That covers about ${SESSIONS_PER_YEAR} Wednesday sessions plus the member benefits. Sunday match days have their own match fee. ${GST_NOTE}`,
    },
    {
        q: 'How do I stop the membership?',
        a: [`Email us at info@rramelbourne.com any time. `, tbc('Notice needed and when the last payment is taken', 'How much notice to cancel? Does it stop the next weekly charge?'), ` If you come back later, you pay the ${money(FEES.joining)} joining fee again. If payments stop without notice, we hold your player's place for two weeks before offering it to another player. `, tbc('Confirm', 'Two-week grace period copied from Performance Squads')],
    },
    {
        q: 'What if my player misses a Wednesday?',
        a: [tbc('Make-up policy to be confirmed', 'Can a missed session be made up? How?')],
    },
    {
        q: 'Does my player need to be playing club cricket?',
        a: 'No. Players are grouped by age, and our youngest players start with the basic skills and get ready to play junior club cricket.',
    },
    {
        q: 'Can my player train at both centres?',
        a: `${CENTRES_APART} Your player belongs to one centre.`,
    },
    {
        q: 'Is there Junior Royals at Hallam or Williamstown?',
        a: 'No. Junior Royals runs at Mickleham and Cranbourne North.',
    },
    {
        q: 'My player was entered for Term 4. Do I need to do anything?',
        a: "You don't need to. We have your details and will email you about the membership. You're welcome to register here as well.",
    },
    {
        q: 'Does my player need a uniform?',
        a: [tbc('Uniform to be confirmed', 'Is a uniform required? What does it cost?')],
    },
];

// Every open question on the mock-up, in one list for the review banner.
export const OPEN_QUESTIONS = [
    'Ages: still 7–15?',
    'Which ages train at 6:00pm and which at 7:00pm?',
    'Players per coach, and places per group',
    'Date joining (payment) opens',
    'Head Coach at Cranbourne North',
    'First payment = $149 + first week ($179)?',
    'Notice needed to cancel',
    'Two-week grace period (copied from Performance Squads)',
    'Make-up policy for missed sessions',
    'Uniform',
    'Special-guest events: free or member price?',
    'Sunday match days: first date, venue, match fee',
    'Working With Children Checks; Academy app for Junior Royals',
];
