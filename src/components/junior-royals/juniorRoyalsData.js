// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — every fact and every line of copy on /junior-royals.
//
// Alex, 5 Oct 2026: Junior Royals stops being a term program. It becomes a
// year-round MEMBERSHIP on the same model as Performance Squads:
//   • $149 joining fee, paid once (and paid again to rejoin after cancelling)
//   • $30 a week, charged EVERY week of the year, school holidays included
//   • training on Wednesday nights in school terms only; new time slots on other
//     days open as groups fill
//   • ages 7–12; older players are pointed to Performance Squads
//   • groups by age first, then coaches may move a player to suit ability and
//     enjoyment; no more than six players per lane
//   • DEVELOPMENT MATCHES (Sunday mornings, separate match fee) — the headline:
//     train, play, then back to training on what the match showed, the same
//     cycle as Performance Squads
//   • Mickleham and Cranbourne North; first session Wednesday 28 October
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
import { MIN_AGE as PS_MIN_AGE, MAX_AGE as PS_MAX_AGE } from '../performance-squads/data';

export const MOCKUP = true;

// A value Alex has not confirmed yet. Rendered highlighted on the mock-up.
export const tbc = (text, why) => ({ tbc: true, text, why });

export const money = (n) => `$${n.toLocaleString('en-AU', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
})}`;

// ── Who ──
export const AGES = { min: 7, max: 12 };           // Alex, 5 Oct 2026
export const AGES_TEXT = `${AGES.min}–${AGES.max}`;
export const PS_ROUTE = '/performance-squads';
export const PS_AGES_TEXT = `${PS_MIN_AGE} to ${PS_MAX_AGE}`; // imported, never retyped
export const OLDER_LINE = {
    lead: `Aged ${AGES.max + 1} or older?`,
    body: `Our Performance Squads are for players aged ${PS_AGES_TEXT}.`,
    link: 'See Performance Squads',
};

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

// Price per hour of coaching, honestly: 52 weekly payments ÷ about 40 sessions.
// ($30 is the WEEKLY payment, not the per-hour price — payments continue in the
// holidays, so a parent who works it out gets $39. Say it before they do.)
export const PER_HOUR = Math.round(YEARLY / SESSIONS_PER_YEAR);  // 39

export const GROUPS = [
    { time: '6:00pm – 7:00pm', who: tbc('Younger players', 'Which ages start at 6:00pm?') },
    { time: '7:00pm – 8:00pm', who: tbc('Older players', 'Which ages start at 7:00pm?') },
];
export const LANE_MAX = 6;                          // Alex, 5 Oct 2026: maximum six per lane
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
export const CENTRES_APART = 'The two centres are about 70 km apart, so choose the one you can get to every week.';
export const WHERE_TITLE = 'Two centres, every Wednesday';
export const NOT_RUNNING = 'There is no Junior Royals at Hallam or Williamstown.';
export const NEW_SLOTS = "We're starting with Wednesday nights. As groups fill, we'll open new time slots on other days.";

// ── Copy ──

export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    why: 'Players improve when they train every week with the same coach, then put it into practice in a match.',
    lead: "Junior Royals now includes development matches. Players use what they've learned at training in a real game, with our Royals coaches guiding them, then take what the match showed them back to training.",
    facts: [
        { k: 'Who', v: [`Players aged ${AGES_TEXT}`], older: true },
        { k: 'Training', v: ['Wednesday nights, one hour, at 6:00pm or 7:00pm, in school terms'] },
        { k: 'Matches', v: ['Development matches on Sunday mornings, with our coaches'] },
        { k: 'Where', v: ['Mickleham and Cranbourne North'] },
        { k: 'Starts', v: [FIRST_SESSION.long] },
        { k: 'Cost', v: [`${money(FEES.joining)} to join, then ${money(FEES.weekly)} a week (incl. GST). Each match has its own match fee.`] },
    ],
    noPayment: 'No payment now. No place is held yet.',
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'How the membership works',
    sticky: `${money(FEES.weekly)} a week incl. GST · starts ${FIRST_SESSION.short}`,
};

// Section 2 — straight after the hero (Alex: "put that up near the top").
export const LOOP = {
    eyebrow: 'Development matches',
    title: 'Training and matches, working together',
    body: [
        "Our development matches are designed to help players learn how the game is played. Players use the skills they're working on at training in a real game, where mistakes are part of learning, with our Royals coaches guiding them through it.",
        "Then they go back to training and work on what the match showed them. It's the same cycle our Performance Squads follow, and it's how players keep getting better.",
    ],
    steps: [
        { n: '1', title: 'Train', body: 'One hour every Wednesday with your group, working on the skills for your age.' },
        { n: '2', title: 'Play', body: 'A development match on a Sunday morning. Players use those skills in a game, with our coaches guiding them.' },
        { n: '3', title: 'Work on it', body: 'Back at training, coaches work with each player on what the match showed.' },
    ],
    details: [
        ['Matches are changed to suit each age group, so younger players play a modified game.'],
        ['First match day: ', tbc('date to be confirmed', 'First Sunday match date? How often?')],
        ['Where: ', tbc('venue to be confirmed', 'Match-day venue?')],
        ['Match fee: ', tbc('to be confirmed', 'How much is the match fee?'), ', paid for each match. It is not part of the weekly membership.'],
    ],
};

export const WHY = {
    eyebrow: 'Why all year',
    title: 'Every week, all year',
    body: [
        'Young cricketers get better by training every week with a coach who knows their game. When coaching stops at the end of each term, players lose that rhythm and spend the first few weeks of the next one getting it back.',
        'So from 28 October, Junior Royals runs right through the school year. Your player keeps the same coach and the same group, and we only stop for the school holidays.',
    ],
};

export const HOW = {
    eyebrow: 'How it runs',
    title: 'One hour, every Wednesday',
    intro: 'Every Wednesday in school terms, your player trains for one hour with their group at the centre you choose.',
    grouping: 'Players are put into groups by age first. Our coaches may then move a player into a different group if it suits their ability and experience better, so every player is challenged and enjoys it.',
    lanes: `No more than ${LANE_MAX} players in each net lane.`,
    // From Andy's Term 3 age-group copy, reworded for the year-round program.
    ageBands: [
        { ages: '7–9', points: ['Building the basic skills of batting, bowling and fielding', 'Games that teach how cricket is played', 'Getting ready to play junior club cricket'] },
        { ages: '10–12', points: ['Skill-focused sessions, including the bowling machine', 'Extra training for players already playing club cricket'] },
    ],
    details: [
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
        { title: `About ${SESSIONS_PER_YEAR} sessions a year`, body: "One hour every Wednesday in school terms, at your centre, in your player's group." },
        { title: 'Development matches', body: 'Sunday-morning matches with our coaches. Each match has its own match fee.' },
        { title: "A place that's kept all year", body: 'Your player keeps their place in their group over the school holidays, as long as the membership is paid.' },
        { title: 'Member prices on masterclasses', body: 'Lower prices on our special masterclasses.' },
        { title: 'Special-guest events', body: ['Access to all our future special-guest events, when Royals coaches and guests visit Melbourne. ', tbc('Free, or member price?', 'Are special-guest events free for members, or at a member price?')] },
    ],
};

// Per-hour price, then how it compares (Alex, 5 Oct 2026: show members how our
// price compares per hour with other programs in the same space).
//
// SOURCES — published prices on each provider's own website, checked 5 Oct 2026.
// Providers are NOT named on the page; the figures are ranges by kind of program.
// None of these pages says whether GST is included; ours is incl. GST.
//   Weekly small-group coaching (groups of 3–10):
//     Ravenhall Indoor Cricket Centre, Youth Development Group, 6 × 60 min $240 ($40/h),
//       12 × 60 min $420 ($35/h) — ravenhallindoorcricketcentre.com.au
//     Elite Cricket Academy, Junior Group Sessions, 6 h/month $235 ($39.17/h),
//       12 h/month $435 ($36.25/h) — elitecricketacademy.com.au/junior-group-sessions
//     Cricket HQ, weekly U12 group, $50 per 60 min — cricket-hq.com.au/coaching/u12-and-u14-to-open-group-training-sessions/
//     Cricket HQ, Autumn GAP U12, 7 × 90 min $385 ($36.67/h) — cricket-hq.com.au/coaching/the-victorian-junior-cricket-academy-autumn-gap-programme/
//   Private 1-on-1 (single hour or smallest pack): Cricket HQ $140/h; Shaun Brown's
//     Cricket Coaching $110/h; P2G Cricket Academy $99/h; Ravenhall $80–$110/h by coach level.
//   Left OUT on purpose (not the same product): holiday camps ($11.67–$30.80/h, long
//     days that include breaks) and Woolworths Cricket Blast (about $10/h, a volunteer-run
//     beginner program for ages 5–7).
//   Our own: Junior Royals Term 3, 2026 — $330 for 8 × 1-hour sessions = $41.25/h.
// REVIEW 5 Jan 2027 — re-check every price above; a stale comparison is misleading
// conduct under the ACL (consumer-law.md §4).
export const PRICE_CONTEXT = {
    title: 'What it costs per hour',
    lines: [
        `The weekly payment is ${money(FEES.weekly)}. Because payments carry on through the school holidays, a full year is ${money(YEARLY)} for about ${SESSIONS_PER_YEAR} one-hour sessions.`,
        `That works out at about ${money(PER_HOUR)} for each hour of coaching, with no more than ${LANE_MAX} players in a lane. In your first year, the ${money(FEES.joining)} joining fee is on top.`,
    ],
    compareTitle: 'How that compares',
    compare: [
        { what: 'Junior Royals membership', perHour: `about ${money(PER_HOUR)}`, note: `${money(YEARLY)} a year ÷ about ${SESSIONS_PER_YEAR} sessions · up to ${LANE_MAX} players a lane · incl. GST`, ours: true },
        { what: 'Weekly small-group coaching at other Melbourne cricket academies', perHour: '$35 – $50', note: 'Published prices from 3 academies, groups of 3 to 10 players' },
        { what: 'Junior Royals as a term program (Term 3, 2026)', perHour: '$41.25', note: '$330 for 8 one-hour sessions' },
        { what: 'Private one-on-one junior coaching in Melbourne', perHour: '$80 – $140', note: 'Published prices from 4 academies, one player with one coach' },
    ],
    sourceNote: "Other academies' prices are as published on their own websites on 5 October 2026. They don't say whether GST is included.",
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
        a: `Because it is a yearly membership. The yearly fee is ${money(YEARLY)} incl. GST, and we split it into ${money(FEES.weekly)} a week so you don't pay it all at once. Paying through the holidays keeps your player's place in their group and keeps your member prices.`,
    },
    {
        q: 'How much does a full year cost?',
        a: `${money(FEES.joining)} to join, once. Then ${money(FEES.weekly)} a week, which is ${money(YEARLY)} over a full year. That covers about ${SESSIONS_PER_YEAR} Wednesday sessions, about ${money(PER_HOUR)} an hour, plus the member benefits. Development matches have their own match fee. ${GST_NOTE}`,
    },
    {
        q: 'Are the development matches included?',
        a: 'Members can play them, but each match has its own match fee, paid for that match. We tell you the fee before you enter.',
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
        q: 'My player is 13 or older. Can they join?',
        a: `Junior Royals is for players aged ${AGES_TEXT}. Older players can join our Performance Squads, which are for players aged ${PS_AGES_TEXT}.`,
        link: { to: PS_ROUTE, label: 'See Performance Squads' },
    },
    {
        q: 'Does my player need to be playing club cricket?',
        a: 'No. Players are grouped by age, and our youngest players start with the basic skills and get ready to play junior club cricket.',
    },
    {
        q: 'Will there be other days and times?',
        a: NEW_SLOTS,
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
    'Which ages train at 6:00pm and which at 7:00pm?',
    'Development matches: first date, how often, venue, match fee',
    'Approve the price comparison (sources are listed in the page code)',
    'Date joining (payment) opens',
    'Head Coach at Cranbourne North',
    'First payment = $149 + first week ($179)?',
    'Notice needed to cancel',
    'Two-week grace period (copied from Performance Squads)',
    'Make-up policy for missed sessions',
    'Uniform',
    'Special-guest events: free or member price?',
    'Working With Children Checks; Academy app for Junior Royals',
];
