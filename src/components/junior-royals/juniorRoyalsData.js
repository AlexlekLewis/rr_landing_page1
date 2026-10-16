// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — every fact and every line of copy on /junior-royals.
//
// Alex, 5 Oct 2026: Junior Royals stops being a term-only program. TWO WAYS TO PAY:
//   1. MEMBERSHIP — $25 an hour. A yearly fee ($25 × about 40 sessions = $1,000)
//      paid as 52 weekly payments ($19.23), every week of the year, school
//      holidays included, plus a $149 joining fee once (paid again to rejoin
//      after cancelling). Join any time, cancel any time.
//   2. BY THE TERM — $35 a session ("$350 for the term" on a 10-week term); each
//      term is priced by the number of Wednesdays it actually has.
// Also (Alex, 5 Oct 2026):
//   • training on Wednesday nights in school terms only; new time slots on other
//     days open as groups fill
//   • ages 7–12; older players are pointed to Performance Squads
//   • groups by age first, then coaches may move a player to suit ability and
//     enjoyment; no more than six players per lane
//   • DEVELOPMENT MATCHES (Sunday mornings, separate match fee) — the headline:
//     train, play, then back to training on what the match showed, the same
//     cycle as Performance Squads
//   • Mickleham and Cranbourne North; first session Wednesday 28 October
// Language rule (Alex, 5 Oct 2026): a 10-year-old must be able to understand
// that the membership is a YEARLY fee paid as a weekly plan, and that is why
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

// ── Prices — all GST-inclusive (consumer-law.md §1). Worked out, never typed. ──
// Membership: $25 an hour × 40 sessions = $1,000 a year, paid weekly over 52 weeks.
export const MEMBER = {
    joining: 149,          // once; paid again to rejoin after cancelling
    perHour: 25,           // Alex, 5 Oct 2026
    weeksPerYear: 52,
};
export const MEMBER_WEEKLY = Math.round((MEMBER.perHour * SESSIONS_PER_YEAR / MEMBER.weeksPerYear) * 100) / 100; // 19.23
export const MEMBER_YEARLY = Math.round(MEMBER_WEEKLY * MEMBER.weeksPerYear * 100) / 100;                          // 999.96
export const MEMBER_FIRST_YEAR = Math.round((MEMBER_YEARLY + MEMBER.joining) * 100) / 100;                         // 1148.96
export const FIRST_PAYMENT = Math.round((MEMBER.joining + MEMBER_WEEKLY) * 100) / 100;                             // 168.23 — joining fee + first week (PS model)

// By the term: $35 a session; a term costs its number of sessions × $35.
export const TERM_SESSION = 35;                     // Alex, 5 Oct 2026: "$350 for the term" (10 weeks)
export const TERM_EXAMPLE_SESSIONS = 10;
export const termPrice = (sessions) => sessions * TERM_SESSION;
export const TERM_YEAR = termPrice(SESSIONS_PER_YEAR); // 1400 — all four 2027 terms, paid term by term

export const GST_NOTE = 'All prices include GST.';
export const MATCH_FEE_NOTE = 'Development matches have their own match fee.';

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
export const WHERE_TITLE = 'Two centres, every Wednesday';
export const CENTRES_APART = 'The two centres are about 70 km apart, so choose the one you can get to every week.';
// Two centres only (Alex, 5 Oct 2026): Hallam and Williamstown are no longer part of
// the Academy for now, so the page never names them.
export const NEW_SLOTS = "We're starting with Wednesday nights. As groups fill, we'll open new time slots on other days.";

// How a family wants to pay — asked on the interest form so we know the split.
// Values are what the database stores (no list-of-values rule on that column).
export const PAY_CHOICES = [
    { value: 'membership', label: `Membership · ${money(MEMBER.perHour)} an hour` },
    { value: 'term', label: `By the term · ${money(TERM_SESSION)} a session` },
    { value: 'not-sure', label: 'Not sure yet' },
];

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
        { k: 'Members', v: [`${money(MEMBER.perHour)} an hour: ${money(MEMBER.joining)} to join, then ${money(MEMBER_WEEKLY)} a week, all year`] },
        { k: 'Or', v: [`${money(TERM_SESSION)} a session, paid by the term (${money(termPrice(TERM_EXAMPLE_SESSIONS))} for a ${TERM_EXAMPLE_SESSIONS}-week term)`] },
    ],
    priceNote: `All prices include GST. ${MATCH_FEE_NOTE}`,
    noPayment: 'No payment now. No place is held yet.',
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'Prices and membership',
    sticky: `Members ${money(MEMBER.perHour)} an hour incl. GST · starts ${FIRST_SESSION.short}`,
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
        ['Match fee: ', tbc('to be confirmed', 'How much is the match fee? Same for members and term players?'), ', paid for each match. It is not part of the membership or the term price.'],
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

// ── Prices section: two ways to pay ──
export const PRICES = {
    eyebrow: 'Prices',
    title: 'Two ways to pay',
    lead: 'You can become a member, or pay one term at a time. Both get the same Wednesday coaching.',
    member: {
        name: 'Membership',
        headline: money(MEMBER.perHour),
        unit: 'an hour',
        // The membership in words a 10-year-old can follow. One idea per line.
        simple: [
            `Joining costs ${money(MEMBER.joining)}, once.`,
            `The membership is a yearly fee of ${money(MEMBER_YEARLY)}. That's about ${SESSIONS_PER_YEAR} sessions at ${money(MEMBER.perHour)} each.`,
            `We split the yearly fee into weekly payments of ${money(MEMBER_WEEKLY)}, so you pay a little every week instead of all at once.`,
            "Because it's a yearly fee, the weekly payment carries on in the school holidays, when there's no training. That keeps your player's place and your member prices.",
            `You can stop any time. If you stop and want to come back later, you pay the ${money(MEMBER.joining)} joining fee again.`,
        ],
        firstPayment: ['Your first payment is ', money(FIRST_PAYMENT), `: the ${money(MEMBER.joining)} joining fee plus your first week. `, tbc('Confirm', 'Same as Performance Squads: joining fee + first week charged together?')],
        gets: [
            "Your player's place is kept all year, through the school holidays",
            'Member prices on our special masterclasses',
            ['Access to all our future special-guest events, when Royals coaches and guests visit Melbourne ', tbc('(free, or member price?)', 'Are special-guest events free for members, or at a member price?')],
        ],
    },
    term: {
        name: 'By the term',
        headline: money(TERM_SESSION),
        unit: 'a session',
        lines: [
            `You pay for one term at a time, before it starts. Each term costs ${money(TERM_SESSION)} for every Wednesday session in it, so a ${TERM_EXAMPLE_SESSIONS}-week term is ${money(termPrice(TERM_EXAMPLE_SESSIONS))}.`,
            'No joining fee, and nothing to pay in the school holidays.',
            ['Your place is for that term only. To keep going, you book the next term. ', tbc('Confirm', 'Term players: is a place for next term NOT held?')],
        ],
    },
    yearCompare: `If your player trains all year, a membership costs ${money(MEMBER_FIRST_YEAR)} in the first year (including the joining fee) and ${money(MEMBER_YEARLY)} after that. Paying term by term for the same ${SESSIONS_PER_YEAR} sessions costs ${money(TERM_YEAR)}.`,
    notes: [GST_NOTE, MATCH_FEE_NOTE],
};

// Per-hour comparison (Alex, 5 Oct 2026: show members how our price compares per
// hour with other programs in the same space).
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
// REVIEW 5 Jan 2027 — re-check every price above; a stale comparison is misleading
// conduct under the ACL (consumer-law.md §4).
export const PRICE_CONTEXT = {
    title: 'How our prices compare, per hour',
    compare: [
        { what: 'Junior Royals membership', perHour: money(MEMBER.perHour), note: `${money(MEMBER_YEARLY)} a year ÷ ${SESSIONS_PER_YEAR} sessions · joining fee extra · incl. GST`, ours: true },
        { what: 'Junior Royals, paid by the term', perHour: money(TERM_SESSION), note: 'No joining fee · incl. GST', ours: true },
        { what: 'Weekly small-group coaching at other Melbourne cricket academies', perHour: '$35 – $50', note: 'Published prices from 3 academies, groups of 3 to 10 players' },
        { what: 'Private one-on-one junior coaching in Melbourne', perHour: '$80 – $140', note: 'Published prices from 4 academies, one player with one coach' },
    ],
    lanes: `Every Junior Royals session has no more than ${LANE_MAX} players in a lane.`,
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
        q: "What's the difference between membership and paying by the term?",
        a: `Both get the same Wednesday coaching. Members pay ${money(MEMBER.perHour)} an hour: a ${money(MEMBER.joining)} joining fee, then ${money(MEMBER_WEEKLY)} a week all year, and their place is kept through the holidays. Paying by the term costs ${money(TERM_SESSION)} a session, with no joining fee and nothing in the holidays, but you book one term at a time. ${GST_NOTE}`,
    },
    {
        q: 'Why do members pay in the school holidays when there is no training?',
        a: `Because the membership is a yearly fee: ${money(MEMBER_YEARLY)} incl. GST, which is about ${SESSIONS_PER_YEAR} sessions at ${money(MEMBER.perHour)} each. We split it into ${money(MEMBER_WEEKLY)} a week so you don't pay it all at once. Paying through the holidays keeps your player's place in their group and keeps your member prices.`,
    },
    {
        q: 'How much does a full year cost?',
        a: PRICES.yearCompare + ` ${MATCH_FEE_NOTE} ${GST_NOTE}`,
    },
    {
        q: 'Are the development matches included?',
        a: 'No. Each match has its own match fee, paid for that match. We tell you the fee before you enter.',
    },
    {
        q: 'How do I stop the membership?',
        a: [`Email us at info@rramelbourne.com any time. `, tbc('Notice needed and when the last payment is taken', 'How much notice to cancel? Does it stop the next weekly charge?'), ` If you come back later, you pay the ${money(MEMBER.joining)} joining fee again. If payments stop without notice, we hold your player's place for two weeks before offering it to another player. `, tbc('Confirm', 'Two-week grace period copied from Performance Squads')],
    },
    {
        q: 'What if my player misses a Wednesday?',
        a: [tbc('Make-up policy to be confirmed', 'Can a missed session be made up? How? Same for members and term players?')],
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
        q: 'My player was entered for Term 4. Do I need to do anything?',
        a: "You don't need to. We have your details and will email you about the new program. You're welcome to register here as well.",
    },
    {
        q: 'Does my player need a uniform?',
        a: [tbc('Uniform to be confirmed', 'Is a uniform required? What does it cost?')],
    },
];

// Every open question on the mock-up, in one list for the review banner.
export const OPEN_QUESTIONS = [
    `Member weekly payment ${money(MEMBER_WEEKLY)} (= ${money(MEMBER_YEARLY)} a year, $25 an hour). OK, or round it?`,
    'By the term: each term priced at $35 × its sessions (8 sessions = $280, 11 = $385)? Paid up front?',
    'Term players: is their place for next term NOT held?',
    'Which ages train at 6:00pm and which at 7:00pm?',
    'Development matches: first date, how often, venue, match fee',
    'Approve the price comparison (sources are listed in the page code)',
    'Date joining (payment) opens',
    'Head Coach at Cranbourne North',
    `First member payment = $149 + first week (${money(FIRST_PAYMENT)})?`,
    'Notice needed to cancel; two-week grace period (copied from Performance Squads)',
    'Make-up policy for missed sessions',
    'Uniform',
    'Special-guest events: free or member price?',
    'Working With Children Checks; Academy app for Junior Royals',
];
