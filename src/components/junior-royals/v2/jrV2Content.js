// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS · MOCK-UP VERSION 2 — EVERY LINE OF COPY
//
// Built 7–8 Oct 2026 with the rr-page-generator skill from Alex's Program Blueprint
// (Proposal v1, 7 Oct), a marketing/parent brief, an SEO brief and an experience-
// design brief. Plain English (copy-esl.md): short sentences, everyday words,
// numerals, one word per thing ("session", "player", "centre", "lane").
//
// PRICING (Alex, 7–8 Oct 2026): two options — Junior Royals 4s ($50 a session,
// 4 players in a lane) and Junior Royals 6s ($35, 6 in a lane); rolling term
// enrolment (the place rolls on, charged each term; no joining mid-term); pay the
// term up front or weekly during it; 10% off paying 2 terms ahead, 15% off the
// year; 2 weeks' notice before the next term. Nothing is charged in the holidays.
//
// The names "4s" and "6s" ALWAYS appear with their meaning ("4 players in a lane"):
// on their own, "4s" can read as an age group.
//
// Facts come from ./jrV2Facts.js and ../juniorRoyalsData.js — never retyped.
// Anything not yet decided is tbc() and shows in yellow on the mock-up.
// ─────────────────────────────────────────────────────────────

import { SID } from '../../open-age-trial/openAgeData';
import { tbc, money, AGES_TEXT, FIRST_SESSION, CALENDAR, SESSIONS_PER_YEAR, GST_NOTE, JOINING_OPENS, CENTRES_APART, NEW_SLOTS, PS_ROUTE } from '../juniorRoyalsData';
import { OPTIONS, DISCOUNTS, NOTICE_WEEKS } from './jrV2Facts';

const r2 = (n) => Math.round(n * 100) / 100;
export const opt = (key) => OPTIONS.find((o) => o.key === key);
export const priceAhead = (price, d) => r2(price * (1 - d));
export const TERM4_SESSIONS = CALENDAR[0].sessions;                       // 8
export const termTotal = (key, sessions) => r2(opt(key).price * sessions);
export const yearTotal = (key, d = 0) => r2(opt(key).price * (1 - d) * SESSIONS_PER_YEAR);
export const coachMinutes = (perLane) => Math.round((60 / perLane) * 10) / 10;   // 15 for 4s, 10 for 6s

// Display names for the two centres' regions. "North Melbourne" is an inner
// suburb (3051), so Mickleham is "Melbourne's north" (SEO brief, 7 Oct 2026).
export const REGION_LABEL = { mickleham: "Melbourne's north", 'cranbourne-north': 'South-East Melbourne' };
export const NEARBY = {
    mickleham: 'The nearer centre if you live in or around Mickleham, Craigieburn, Kalkallo, Donnybrook, Greenvale or Roxburgh Park.',
    'cranbourne-north': 'The nearer centre if you live in or around Cranbourne, Narre Warren, Berwick, Clyde or elsewhere in Casey.',
};

// ── 1. Hero (first screen on a phone) ──
export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    titleSub: 'Cricket coaching for ages 7 to 12',
    why: tbc('Players get better when they practise one skill for a few weeks, then use it in a real game.', 'The one-line Why for the hero — OK?'),
    facts: [
        { icon: 'users', k: 'Ages', v: `Ages ${AGES_TEXT}`, older: true },
        { icon: 'clock', k: 'When', v: `Wednesdays, 6:00pm or 7:00pm, in school terms. Starts ${FIRST_SESSION.long}.` },
        { icon: 'pin', k: 'Where', v: 'Mickleham or Cranbourne North' },
    ],
    options: OPTIONS.map((o) => ({
        key: o.key,
        name: o.name,
        what: `${o.perLane} players in a lane`,
        price: money(o.price),
        per: 'a session',
        term4: `Term 4 (${TERM4_SESSIONS} sessions): ${money(termTotal(o.key, TERM4_SESSIONS))}`,
    })),
    priceNote: `${GST_NOTE} Nothing to pay in the school holidays.`,
    noPayment: 'No payment now. No place is held yet.',
    returning: "Already entered for Term 4? You don't need to do anything. We'll email you.",
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'See the prices',
    sticky: `Ages ${AGES_TEXT} · starts ${FIRST_SESSION.short}`,
};

// ── 2. Train, play, train again (Alex: development matches near the top) ──
export const LOOP = {
    eyebrow: 'Development matches',
    title: 'Train, play, train again',
    steps: [
        { n: '1', when: 'Wednesday', title: 'Train', body: 'One hour with your group. Bat, bowl and play a scored game.' },
        { n: '2', when: 'Sunday', title: 'Play', body: 'A development match: a real game, with our coaches helping during it.' },
        { n: '3', when: 'Next Wednesday', title: 'Train again', body: 'Your coach asks what happened in the match. You keep working on it.' },
    ],
    gloss: 'A development match is a real game made for learning. Coaches help during the game, and trying things matters more than the result.',
    notSet: [
        tbc('Match dates, venue and match fee: to be announced.', 'Development matches: how often, first date, venue and fee?'),
        ' Everyone who registers interest hears first. Matches have their own fee, separate from training.',
    ],
};

// ── 3. Common worries, and what we do (the problems we solve) ──
export const WORRIES = {
    eyebrow: 'Why Junior Royals',
    title: 'Common worries, and what we do',
    items: [
        { worry: 'Is my player getting better?', answer: 'We play the same scored game on the first and last night of term. Your player can see both scores.' },
        { worry: 'Will they stand in a queue?', answer: 'Every player bats and bowls every week, with 4 or 6 players in a lane.' },
        { worry: 'Does any of it stick?', answer: 'One batting skill and one bowling skill at a time, for 3 weeks each.' },
        { worry: 'Where does it lead?', answer: 'Three stages, set by age. After that, players can trial for our Performance Squads.' },
        { worry: 'Is it safe for a 7-year-old?', answer: 'Soft balls. The coach feeds every ball. Our youngest players bowl at targets, never at a batter.' },
        { worry: 'Is the Royals name just a logo?', answer: ['Our coaches teach from the Rajasthan Royals’ own coaching course. ', tbc('Confirm', 'Can the page name the Royals Coaching Hub?')] },
    ],
};

// ── 4. One night at Junior Royals ──
export const HOUR = {
    eyebrow: 'One session',
    title: 'One night at Junior Royals',
    intro: 'Every Wednesday has the same plan. Every player bats and bowls.',
    bigNumbers: [
        { n: '20', unit: 'min', label: 'batting', kind: 'bat' },
        { n: '20', unit: 'min', label: 'bowling', kind: 'bowl' },
        { n: '10', unit: 'min', label: 'scored game', kind: 'game' },
    ],
    guide: 'The order is the same every week. The minutes are a guide.',
    lane: 'A lane is one practice net: a long pitch with netting all round. Your group has its own lane and a Royals Academy coach.',
    perLane: `Junior Royals 4s have 4 players in a lane. Junior Royals 6s have 6.`,
};

// ── 5. How a skill sticks ──
export const SKILL = {
    eyebrow: 'Three weeks on each skill',
    title: 'How a skill sticks',
    intro: 'Your player learns one batting skill and one bowling skill at a time. Each pair of skills is called a block, and a block lasts 3 Wednesdays.',
    cuesTitle: 'Every skill has one cue: two or three words your coach says to help you remember it. The same words from age 7 to 12.',
    shortTermNote: 'In an 8-week term, like Term 4, the second and third skills get 2 weeks: learn it, then use it.',
};

// ── 6. One term ──
export const TERM = {
    eyebrow: 'One term · Term 4, 2026',
    title: 'Same game, first night and last night',
    benchmark: 'Benchmark Game: a short game we score on the first night. On the last night we play it again, the same way, so your player can see how far they’ve come. It’s for fun, not a test.',
    festival: 'Festival night: the last night of term. Players show what they’ve learned in fun challenges, and play the Benchmark Game again.',
    scoreFirst: 'First night',
    scoreLast: 'Last night',
    scoreNote: 'Your player tries to beat their own score. We never rank players against each other.',
    familiesWatch: tbc('Families are welcome to watch festival night.', 'Can families watch festival night at both centres?'),
};

// ── 7. Where Junior Royals leads ──
export const PATH = {
    eyebrow: 'The path',
    title: 'Where Junior Royals leads',
    goalLead: 'Goal by the end:',
    gloss: 'Each stage lasts 2 years. Groups are set by age.',
    ageCutoff: ['Which stage? ', tbc('Your player’s age on 1 January sets their stage for the year.', 'Which date decides a player’s stage?')],
    older: { lead: 'Aged 13 or older?', body: 'Players can trial for our Performance Squads.', link: { to: PS_ROUTE, label: 'See Performance Squads' } },
};

// ── 8. Prices (id="prices") ──
export const PRICES = {
    eyebrow: 'Prices',
    title: 'Two group sizes, one program',
    lead: 'Both options have the same coaching team, session plan and matches. The difference is how many players share the lane.',
    options: OPTIONS.map((o) => ({
        key: o.key,
        name: o.name,
        what: `${o.perLane} players in a lane`,
        max: `Never more than ${o.max} in a lane: ${o.perLane} players, plus 1 player some weeks who is making up a missed session`,
        coachTime: `About ${coachMinutes(o.perLane)} minutes of coach time each, every hour`,
        price: money(o.price),
        term4: `Term 4: ${TERM4_SESSIONS} sessions = ${money(termTotal(o.key, TERM4_SESSIONS))}`,
        ahead: [
            { label: 'Pay 2 terms ahead', price: `${money(priceAhead(o.price, DISCOUNTS.twoTerms))} a session` },
            { label: 'Pay the year ahead', price: `${money(priceAhead(o.price, DISCOUNTS.year))} a session` },
        ],
    })),
    howTitle: 'How enrolment works',
    how: [
        ['Enrol before the term starts. We don’t add new players during a term, so groups stay together. ', tbc('Enrolments close the Friday before term.', 'Enrolment closing day? Proposed: the Friday before term.')],
        ['Your place rolls on to the next term. You don’t need to enrol again.'],
        ['Pay for the term before it starts, or pay weekly during the term. The price is the same.'],
        [`Pay 2 terms ahead and save ${Math.round(DISCOUNTS.twoTerms * 100)}%. Pay the year ahead and save ${Math.round(DISCOUNTS.year * 100)}%.`],
        [`To stop, tell us at least ${NOTICE_WEEKS} weeks before the next term starts.`],
        ['Nothing to pay in the school holidays.'],
    ],
    makeup: ['Each lane keeps one spot for a player making up a missed session. ', tbc('How make-ups are booked: to be confirmed.', 'Make-up policy: how many a term, same centre only, how to book?')],
    leaving: tbc('Paid ahead and need to stop? The terms you used are charged at the full price, and the rest is refunded.', 'Proposed rule so the discount can’t be gamed — approve? Lawyer to check the Terms.'),
    currentTerm: tbc('If you stop partway through a term, that term isn’t refunded, unless we cancel sessions. This doesn’t affect your rights under the Australian Consumer Law.', 'Lawyer to check before payment opens.'),
    yearTitle: `A year: ${SESSIONS_PER_YEAR} training weeks and ${52 - SESSIONS_PER_YEAR} holiday weeks`,
    yearNote: 'You only pay for training weeks.',
    calendarTitle: 'Every term and its price',
    gst: GST_NOTE,
    matchFee: 'Matches have their own fee.',
};

// Per-hour comparison. Market figures: published prices checked 5 Oct 2026 (sources in
// ../juniorRoyalsData.js, PRICE_CONTEXT; REVIEW 5 Jan 2027). Coach time = 60 ÷ players.
export const COMPARE = {
    title: 'How we compare, per hour',
    head: ['Program', 'Players per coach', 'Coach time each', 'Price per hour'],
    rows: [
        { what: 'Junior Royals 4s', players: '4', time: '15 min', price: money(opt('4s').price), ours: true },
        { what: 'Junior Royals 6s', players: '6', time: '10 min', price: money(opt('6s').price), ours: true },
        { what: 'Group coaching at other Melbourne academies', players: '6 to 10', time: '6 to 10 min', price: '$35 – $50' },
        { what: 'Private one-on-one coaching', players: '1', time: '60 min', price: '$80 – $140' },
    ],
    source: "Other academies' prices and group sizes are as published on their own websites on 5 October 2026. They don't say whether GST is included.",
    toConfirm: tbc('Comparison to be approved before publishing.', 'Approve the comparison table? (Re-check every price by 5 Jan 2027.)'),
};

// ── 9. Coaches ──
export const COACHES = {
    eyebrow: 'Coaches',
    title: 'Royals Academy coaches in Melbourne',
    course: [
        'What our coaches teach follows the Rajasthan Royals’ coaching course, presented by ',
        `${SID.name}, ${SID.titleLine}. `,
        tbc('Confirm wording', 'Can the page name the Royals Coaching Hub and Sid this way?'),
    ],
    notMeet: 'Players don’t train with Sid or with IPL staff. Our coaches in Melbourne run every session.',
    pillarsTitle: 'The Royals Way, in every session',
};

// ── 10. Where ──
export const WHERE = {
    eyebrow: 'Where',
    title: 'Two centres, every Wednesday in term',
    apart: CENTRES_APART,
    newSlots: NEW_SLOTS,
};

// ── 11. Register your interest ──
export const FORM = {
    eyebrow: 'Register your interest',
    title: 'Join the list',
    intro: ['No payment now, and no place is held yet. Joining opens on ', JOINING_OPENS, '. Everyone on this list hears first. Your answers help us book the right number of lanes.'],
    mockupNote: 'Mock-up: this form is not connected yet. Nothing you type is saved.',
    why: {
        dob: 'So we put your player in the right stage.',
        option: 'So we know how many lanes of each size to book.',
        time: 'So we can plan the 6:00pm and 7:00pm groups.',
        pay: 'Not binding. It helps us plan.',
    },
    optionChoices: [
        { value: '4s', label: 'Junior Royals 4s', sub: `4 in a lane · ${money(opt('4s').price)} a session` },
        { value: '6s', label: 'Junior Royals 6s', sub: `6 in a lane · ${money(opt('6s').price)} a session` },
        { value: 'either', label: 'Either', sub: 'Not sure yet' },
    ],
    timeChoices: [
        { value: '6pm', label: '6:00pm' },
        { value: '7pm', label: '7:00pm' },
        { value: 'either', label: 'Either' },
    ],
    payChoices: [
        { value: 'term', label: 'The term, up front' },
        { value: 'weekly', label: 'Weekly, during the term' },
        { value: '2-terms', label: '2 terms ahead (save 10%)' },
        { value: 'year', label: 'The year ahead (save 15%)' },
        { value: 'not-sure', label: 'Not sure yet' },
    ],
    done: {
        title: "You're on the list",
        body: `We've got your details. No payment has been taken and no place is held yet. We'll email you before joining opens. The first session is ${FIRST_SESSION.long}.`,
    },
    contact: 'info@rramelbourne.com',
};

// ── 12. FAQ ──
export const FAQS = [
    {
        q: 'What is the difference between Junior Royals 4s and 6s?',
        a: `Only the group size. Junior Royals 4s have 4 players in a lane, at ${money(opt('4s').price)} a session. Junior Royals 6s have 6 players in a lane, at ${money(opt('6s').price)} a session. Both have the same coaching team, session plan and matches. ${GST_NOTE}`,
    },
    {
        q: 'My player has never played. Can they join?',
        a: ['Yes. On 28 October, every stage starts with the basics: grip, stance and a straight bowling arm. Our youngest players use soft balls and tees. ', tbc('Confirm', 'Blueprint decision 1 (14 Oct): does 28 Oct start at the basics for every stage?')],
    },
    {
        q: 'My player already plays club cricket. Is it too easy?',
        a: 'Players are grouped by age, and every drill has a harder version for players who are ready. Players aged 11 and 12 work on the cut, the pull, spin, and bowling to a plan.',
    },
    {
        q: 'Is it safe?',
        a: ['Groups are small: 4 or 6 players in a lane. For players aged 7 to 10, the coach feeds every ball in batting. Players aged 7 and 8 bowl at targets, never at a batter. ', tbc('Supervision and Working With Children Checks: to be confirmed before enrolment opens.', 'Two checked adults per session, WWCC verified, sign-in and sign-out (blueprint step 6).')],
    },
    {
        q: 'How do payments work?',
        a: `Your place rolls on each term. Pay for the term before it starts, or weekly during it; the price is the same. Pay 2 terms ahead to save ${Math.round(DISCOUNTS.twoTerms * 100)}%, or the year ahead to save ${Math.round(DISCOUNTS.year * 100)}%. Nothing is charged in the school holidays.`,
    },
    {
        q: 'Can we stop?',
        a: [`Yes. Tell us at least ${NOTICE_WEEKS} weeks before the next term starts, and your place ends at the end of the current term. `, tbc('If you paid ahead, the terms you used are charged at the full price and the rest is refunded.', 'Proposed rule — approve?')],
    },
    {
        q: 'Can my player join partway through a term?',
        a: 'No. Players join at the start of a term, so groups stay together. If you register now, you hear first when joining opens.',
    },
    {
        q: 'What if my player misses a Wednesday?',
        a: ['Each lane keeps one spot for a player making up a missed session. ', tbc('How make-ups work: to be confirmed.', 'Make-up policy details?')],
    },
    {
        q: 'Are matches included?',
        a: 'No. Each match has its own fee, paid for that match. We tell you the fee before you enter.',
    },
    {
        q: 'Will my player meet Sid or IPL players?',
        a: `No. Our Royals Academy coaches in Melbourne run every session. What comes from ${SID.name} is the coaching course our coaches teach from.`,
    },
    {
        q: 'Does Junior Royals lead to Performance Squads?',
        a: 'When Junior Royals ends at 12, players can trial for our Performance Squads. Selection is decided at the trial and is never guaranteed.',
        link: { to: PS_ROUTE, label: 'See Performance Squads' },
    },
    {
        q: 'Which time, and can we use both centres?',
        a: [tbc('The time (6:00pm or 7:00pm) depends on your player’s stage.', 'Which stages train at 6:00pm and which at 7:00pm?'), ` ${CENTRES_APART}`],
    },
];

// Every open decision, for the review banner. Each also shows in yellow where it's used.
export const OPEN_QUESTIONS_V2 = [
    'The one-line Why in the hero',
    'Development matches: how often, first date, venue, fee',
    'Which stages train at 6:00pm and which at 7:00pm?',
    'Which date sets a player’s stage (age cut-off)?',
    'Enrolment closing day (proposed: the Friday before term)',
    'Leaving early after paying ahead: approve the proposed rule (lawyer to check)',
    'Make-up policy: how many, how booked',
    'Joining-opens date',
    'Naming the Royals Coaching Hub and Sid on the page',
    'The per-hour comparison table',
    'Families watching festival night',
    'Safety floor: two checked adults, WWCC verified, sign-in/out',
    'Head Coach at Cranbourne North; uniform',
    'Blueprint decision 1: does 28 Oct start at the basics for every stage?',
];
