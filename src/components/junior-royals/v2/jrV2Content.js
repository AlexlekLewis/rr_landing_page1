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
// The two options are "Groups of 4" and "Groups of 6" (Alex, 8 Oct 2026), $49.95 and
// $34.95 a session. Never "4s"/"6s" on the page, never "premium"/"economy".
//
// Facts come from ./jrV2Facts.js and ../juniorRoyalsData.js — never retyped.
// Anything not yet decided is tbc() and shows in yellow on the mock-up.
// ─────────────────────────────────────────────────────────────

import { SID } from '../../open-age-trial/openAgeData';
import { tbc, money, AGES_TEXT, FIRST_SESSION, CALENDAR, SESSIONS_PER_YEAR, GST_NOTE, JOINING_OPENS, CENTRES_APART, PS_ROUTE } from '../juniorRoyalsData';
import { OPTIONS, DISCOUNTS, NOTICE_WEEKS, BADGES } from './jrV2Facts';

const r2 = (n) => Math.round(n * 100) / 100;
export const opt = (key) => OPTIONS.find((o) => o.key === key);
// Discounted prices are rounded DOWN to the nearest 5 cents ($34.95 → $31.45 and $29.70), so
// every total is price × sessions and the saving is never less than the 10% or 15% we advertise.
export const priceAhead = (price, d) => Math.floor(price * (1 - d) * 20 + 1e-9) / 20;
export const TERM4_SESSIONS = CALENDAR[0].sessions;                       // 8
export const termTotal = (key, sessions) => r2(opt(key).price * sessions);
export const yearTotal = (key, d = 0) => r2(priceAhead(opt(key).price, d) * SESSIONS_PER_YEAR);   // per-session price × sessions, always

// One wording for the 8-week-term exception, used everywhere it appears (Alex, 8 Oct:
// "there's got to be continuity"). The rule is the 3-week block; this is the only exception.
export const SHORT_TERM_NOTE = 'Terms with 8 Wednesdays (Term 4, 2026 and Term 1, 2027) have shorter blocks 2 and 3: 2 weeks each, learn it, then use it.';

// What each group size gives a player (Alex, 8 Oct: lead with value, not ratios).
// Facts only: 4 vs 6 players in a lane; same coach, plan and skills. Never present
// 4s as the "better" or "higher" group, and never move players between them by ability.
export const GROUP_UPSIDE = {
    '4s': [
        'More turns: your player is back up to bat or bowl sooner',
        'More of the coach’s attention on every ball',
        'A smaller group, for players who want extra practice on each skill',
    ],
    '6s': [
        'More players to play with: more partner challenges, and a scored game with two teams of 3',
        'Learn alongside more teammates, and from watching each other',
        'The lower price',
    ],
};

// Display names for the two centres' regions. "North Melbourne" is an inner
// suburb (3051), so Mickleham is "Melbourne's north" (SEO brief, 7 Oct 2026).
export const REGION_LABEL = { mickleham: "Melbourne's north", 'cranbourne-north': 'South-East Melbourne' };
export const NEARBY = {
    mickleham: 'The nearer centre if you live in or around Mickleham, Craigieburn, Kalkallo, Donnybrook, Greenvale or Roxburgh Park.',
    'cranbourne-north': 'The nearer centre if you live in or around Cranbourne, Narre Warren, Berwick, Clyde or elsewhere in Casey.',
};

// Section photos (Alex, 8 Oct: real Junior Royals photos with soft fades into the
// next section). All already used on the live Junior Royals / Little Crickets pages.
// ⚠️ Before launch: written parent consent for every player shown (safeguarding).
// Alt text describes the scene, never names or identifies a player.
export const PHOTOS = {
    why: { src: '/assets/little-crickets-hero.jpeg', alt: 'A Royals Academy coach kneels with a group of young players during a net session', position: 'center 40%' },
    how: { src: '/assets/little-crickets-drills.jpeg', alt: 'Young players run a bowling drill between cones while their coach watches', position: 'center 55%' },
    skills: { src: '/assets/junior-royals-card.jpg', alt: 'A Royals Academy coach shows a junior batter a skill in the nets', position: 'center 35%' },
    // Not used: holiday-program-group.jpg shows faces AND readable first-name stickers,
    // and isn't on the live site yet. Only with written consent and the names blurred.
    where: { src: '/assets/jr-lanes-1600.jpg', alt: 'Indoor practice lanes, each with its own net and stumps', position: 'center 60%' },
};

// ── 1. Hero (first screen on a phone) ──
export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    titleSub: 'Cricket coaching for ages 7–12',
    why: tbc('Players get better when they practise one skill for 3 weeks, then try it in a game.', 'The one-line Why for the hero — OK?'),
    facts: [
        { icon: 'users', k: 'Ages', v: `Ages ${AGES_TEXT}`, older: true },
        { icon: 'clock', k: 'When', v: `One hour on Wednesdays in school terms: 6:00–7:00pm or 7:00–8:00pm. Starts ${FIRST_SESSION.long}.` },
        { icon: 'pin', k: 'Where', v: 'Mickleham or Cranbourne North' },
    ],
    options: OPTIONS.map((o) => ({
        key: o.key,
        name: o.name,
        upside: { '4s': 'More turns', '6s': 'More teammates' }[o.key],   // short form of GROUP_UPSIDE for the hero
        price: money(o.price),
        per: 'a session',
        term4: `Term 4, 2026 (${TERM4_SESSIONS} sessions): ${money(termTotal(o.key, TERM4_SESSIONS))}`,
    })),
    priceNote: `${GST_NOTE} Nothing to pay in the school holidays. Development matches cost extra.`,
    noPayment: 'No payment now. No place is held yet.',
    returning: "Already sent us your details on our Term 4 form? We have them, and we'll email you when enrolment opens. You'll choose Groups of 4 or Groups of 6 then.",
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
        { n: '2', when: 'Match day (a Sunday)', title: 'Play', body: 'A development match: a real game, with our coaches helping during it. Matches cost extra.' },
        { n: '3', when: 'The next Wednesday', title: 'Train again', body: 'Your coach asks what happened in the match, and you keep working on it.' },
    ],
    gloss: 'A development match is a real game made for learning. Coaches help during the game, and trying things matters more than the result.',
    notSet: [
        tbc('How often matches run, the dates, the venue and the match fee: to be announced.', 'Development matches: how often, first date, venue and fee? Optional or expected?'),
        ' Everyone who registers interest hears first. The match fee is separate from training. ',
        tbc('Matches follow Cricket Australia’s junior match rules for each age, with shorter pitches and lighter balls for younger players. Nobody fields close to the bat: no slip, gully or short leg at any age. Matches are called off in extreme heat.', 'Match safety: CA junior rules + no close fielders + heat policy (safeguarding). Venue, toilets, 2 checked adults, sign-in/out.'),
    ],
};

// ── 3. Common worries, and what we do (the problems we solve) ──
export const WORRIES = {
    eyebrow: 'Why Junior Royals',
    title: 'Common worries, and what we do',
    items: [
        { worry: 'Is my player getting better?', answer: 'In every 3-week block, your player learns one batting skill and one bowling skill. In the last session of term they replay the game from the first session and try to beat their own score. It’s a fun challenge, not a test: one session’s score can go up or down.' },
        { worry: 'Will they stand in a queue?', answer: ['Each lane has its own coach and only 4 or 6 players, and every player bats and bowls every week. ', tbc('Each player faces about __ balls and bowls about __ balls a session.', 'How many balls does each player face and bowl in a session? Parents will ask.')] },
        { worry: 'Will they remember what they learn?', answer: 'One batting skill and one bowling skill at a time, in a 3-week block: learn it, own it, use it. Then the next block builds on it.' },
        { worry: 'Where does it lead?', answer: 'Three stages, set by age, from 7 to 12, each with its own list of batting, bowling and fielding topics. When Junior Royals ends, players can trial for our Performance Squads.' },
        { worry: 'Is it safe for a 7-year-old?', answer: 'At Wednesday training, players aged 7 and 8 use soft balls and batting tees (a stand that holds the ball), the coach throws every ball they bat against, and they bowl at targets, never at a batter.' },
        { worry: 'Is the Royals name just a logo?', answer: ['Our coaches teach the drills and cues from the Rajasthan Royals’ coaching course. ', tbc('Confirm', 'Can the page name the Royals Coaching Hub? Which coaches have completed the course?')] },
    ],
};

// ── 4. One night at Junior Royals ──
export const HOUR = {
    eyebrow: 'One session',
    title: 'One session at Junior Royals',
    intro: 'Every session follows the same plan, except festival night on the last Wednesday of term. Every player bats and bowls.',
    bigNumbers: [
        { n: '20', unit: 'min', label: 'batting', kind: 'bat' },
        { n: '20', unit: 'min', label: 'bowling', kind: 'bowl' },
        { n: '10', unit: 'min', label: 'scored game', kind: 'game' },
    ],
    guide: 'Plus a 5-minute warm-up game and a 5-minute drink break: 60 minutes in all. The order is the same every week; the minutes are a guide.',
    lane: 'A lane is one practice net: a long pitch with netting all round. Your group has its own lane and a Royals Academy coach.',
    perLane: 'Groups of 4 have 4 players in a lane. Groups of 6 have 6.',
};

// ── 5. How a skill sticks ──
export const SKILL = {
    eyebrow: '3 weeks on each skill',
    title: 'How you learn a skill',
    intro: 'You learn one batting skill and one bowling skill at a time, in a 3-week block: learn it, own it, use it. There are 3 blocks in every term.',
    cuesTitle: 'Every skill has one cue: two or three words your coach says to help you remember it. The same words for every player aged 7–12.',
    shortTermNote: SHORT_TERM_NOTE,
};

// ── 6. One term ──
export const TERM = {
    eyebrow: 'One term · Term 4, 2026',
    title: 'Same game, first session and last session',
    benchmark: 'Benchmark Game: a short game in the first session, where each player gets their own score. In the last session they play it again, the same way, and try to beat it. It’s for fun, not a test, and a lower score in one session is normal. Scores go on your player’s own card, never on a board.',
    festival: 'Festival night: the last session of term. Players show what they’ve learned in fun challenges, and play the Benchmark Game again.',
    scoreFirst: 'First session',
    scoreLast: 'Last session',
    scoreNote: 'Your player tries to beat their own score. We never rank players against each other.',
    familiesWatch: tbc('Families are welcome to watch festival night.', 'Can families watch festival night at both centres?'),
    photos: 'Taking photos? Please photograph or film only your own player, and don’t post other players online without their family’s OK.',
};

// ── 7. The pathway: ages 7 to 12 (Alex, 8 Oct 2026: "people are going to really
// struggle with understanding that there's a full curriculum … with accomplishment
// badges … for the tracking and the development of the player"). The full topic
// list for each stage opens in a pop-up (tap on phones, click on computers), so
// the page stays short and the detail is one tap away (copy-esl.md §2).
export const PATH = {
    eyebrow: 'The pathway · ages 7–12',
    title: 'What your player learns, from 7 to 12',
    intro: 'Junior Royals runs for 6 years, in three stages of 2 years each. Every stage has its own list of batting, bowling and fielding topics. Every 3-week block teaches one batting skill and one bowling skill from that list, so each term builds on the last.',
    gloss: 'Your player’s age decides their stage. Players move up a stage with their age group. Everyone works on the same skills at their own pace, with no pass or fail.',
    ageCutoff: tbc('Your player’s age on 1 January sets their stage for the year.', 'Which date decides a player’s stage?'),
    beginners: tbc('A beginner aged 11 trains with other 11- and 12-year-olds, and the coach starts them at the basics.', 'Confirm how older beginners are handled (ties to blueprint decision 1).'),
    tapHint: 'Tap a stage to see everything it covers.',
    stageLabel: (i) => `Stage ${i + 1} of 3`,
    topics: (n) => `${n} topics`,
    open: (name) => `See everything in ${name}`,
    certificate: (name) => `Ends with the ${name} certificate`,
    modal: {
        means: 'What it means',
        batting: 'Batting',
        bowling: 'Bowling',
        fielding: 'Fielding',
        byTheEnd: (name) => `What we work towards in ${name}:`,
        feel: 'How it feels',
        badges: 'Skill badges in this stage',
        badgesNotWritten: tbc('This stage’s badges are being written by our coaching group.', 'Develop and Elevate badges are not written yet (blueprint Part IV covers Discover Year 1 only).'),
        close: 'Close',
    },
    older: { lead: 'Aged 13 or older?', body: 'Players can trial for our Performance Squads.', link: { to: PS_ROUTE, label: 'See Performance Squads' } },
};

// Skill badges (blueprint Part IV, a proposal; pilot Term 1 2027). Never a rank:
// "not yet", never "failed"; nothing for size, speed or attendance.
export const BADGE_COPY = {
    eyebrow: 'Skill badges',
    title: 'Progress your player can see',
    starts: tbc('Skill badges start in Term 1, 2027.', 'Blueprint Part IV is a proposal: go ahead from Term 1, 2027? The coaching group settles the standard first.'),
    what: 'A skill badge shows your player can do one skill on their own, in a real turn with a score, not only in practice.',
    steps: [
        { n: '1', title: 'The coach checks', body: `In a normal scored turn, the coach looks for ${BADGES.check.good} good balls out of ${BADGES.check.of}.` },
        { n: '2', title: 'In two sessions', body: `Do it in ${BADGES.check.nights} different sessions, and the badge is earned.` },
        { n: '3', title: 'On the progress card', body: 'Your player’s badges go on their progress card, which comes home at the end of each term.' },
    ],
    perYear: `Each year: ${BADGES.perYear.batting} batting badges, ${BADGES.perYear.bowling} bowling badges and ${BADGES.perYear.fielding} fielding badges to earn, one batting and one bowling badge for each block. In the second year of a stage, each badge gets a harder second stripe.`,
    rules: [
        '“Not yet”, never “failed”. A badge stays open until it’s earned, and stays earned once it is.',
        'No leaderboards. Badges are for skills only: never for size, speed or turning up.',
    ],
    certificateTitle: 'A certificate for every stage',
    certificate: 'At the end of each stage, your player gets a certificate to celebrate it, and moves up with their age group:',
    sampleTitle: 'Some of the first badges, in Discover (ages 7–8)',
    iCan: 'I can',
};

// ── 8. Prices (id="prices") ──
export const PRICES = {
    eyebrow: 'Prices',
    title: 'Two group sizes, one program',
    lead: 'Both options have the same coaching team, the same session plan and the same skills. The difference is the group size, and what each size gives your player.',
    options: OPTIONS.map((o) => ({
        key: o.key,
        name: o.name,
        max: `Never more than ${o.max} in a lane: ${o.perLane} players, plus 1 player some weeks who is making up a missed session`,
        upside: GROUP_UPSIDE[o.key],
        price: money(o.price),
        term4: `Term 4, 2026: ${TERM4_SESSIONS} sessions = ${money(termTotal(o.key, TERM4_SESSIONS))}`,
        ahead: [
            { label: 'Pay 2 terms ahead', price: `${money(priceAhead(o.price, DISCOUNTS.twoTerms))} a session` },
            { label: 'Pay 4 terms (a year) ahead', price: `${money(priceAhead(o.price, DISCOUNTS.year))} a session` },
            { label: 'For example, all of 2027 paid ahead', price: `${SESSIONS_PER_YEAR} sessions = ${money(yearTotal(o.key, DISCOUNTS.year))}` },
        ],
    })),
    // The step up, in facts: price difference and the extra turns (6 → 4 players = 1.5× the turns).
    stepUp: (() => {
        const lo = opt('6s').price, hi = opt('4s').price;
        const pct = Math.round(((hi - lo) / lo) * 100);
        const turns = Math.round((opt('6s').perLane / opt('4s').perLane - 1) * 100);
        void pct; // 43%: for the business case (model, "Profit by price" §5), not the page
        return `Step up to Groups of 4: ${turns}% more turns to bat and bowl, for ${money(r2(hi - lo))} more a session.`;
    })(),
    howTitle: 'How enrolment works',
    how: [
        ['Enrol before the term starts. New players start at the beginning of a term, not partway through, so groups stay together. ', tbc('Enrolments close the Friday before term.', 'Enrolment closing day? Proposed: the Friday before term.')],
        ['Your place carries on to the next term, and we charge you for it when that term starts. This repeats every term until you tell us to stop. You don’t need to enrol again. ', tbc('If you tell us less than 2 weeks before a term starts, that term is charged.', 'Late notice: is the next term charged? The page must say.')],
        ['Pay for the term before it starts, or pay weekly during the term. The price is the same. If you pay weekly, your player is still enrolled for the whole term.'],
        [`Pay 2 terms ahead and save ${Math.round(DISCOUNTS.twoTerms * 100)}%. Pay 4 terms (a year) ahead and save ${Math.round(DISCOUNTS.year * 100)}%.`],
        [`To stop, email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts.`],
        ['Nothing to pay in the school holidays.'],
    ],
    cover: tbc('Each lane always has its own coach. If a coach is away and we can’t replace them, we cancel that group’s session and credit it. We don’t merge lanes.', 'Approve the cover rule (cancel + credit, never merge lanes)?'),
    fourAvailability: tbc('A Groups of 4 lane runs at a centre and time once at least 3 families choose it. If it doesn’t run, we’ll offer you a place in Groups of 6.', 'Minimum families to open a Groups of 4 lane (3?), and what happens if it doesn’t run?'),
    makeup: ['Each lane keeps one spot for a player making up a missed session. ', tbc('Your player can make up a missed session in another group at the same stage and the same centre, when that group has a spot. Make-ups aren’t available in the first or last session of term.', 'Make-up rules: same stage + same centre only, none on Benchmark/festival nights (safeguarding). How many a term? How booked?')],
    leaving: tbc('Paid ahead and need to stop? The terms you used are charged at the full price, and the rest is refunded.', 'Proposed rule so the discount can’t be gamed — approve? Lawyer to check the Terms.'),
    currentTerm: tbc('If you stop partway through a term, that term isn’t refunded, unless we cancel sessions. This doesn’t affect your rights under the Australian Consumer Law.', 'Lawyer to check before payment opens.'),
    yearTitle: `2027: ${SESSIONS_PER_YEAR} sessions and ${52 - SESSIONS_PER_YEAR} school-holiday weeks`,
    yearNote: 'You only pay for weeks with a session.',
    calendarTitle: 'Every term and its price',
    gst: GST_NOTE,
    matchFee: 'Development matches cost extra.',
};

// Per-hour comparison. Market figures: published prices checked 5 Oct 2026 (sources in
// ../juniorRoyalsData.js, PRICE_CONTEXT; REVIEW 5 Jan 2027). Coach time = 60 ÷ players.
export const COMPARE = {
    title: 'How we compare, per hour',
    head: ['Program', 'Group size', 'Price per hour'],
    rows: [
        { what: 'Groups of 4', players: '4 players', price: money(opt('4s').price), ours: true },
        { what: 'Groups of 6', players: '6 players', price: money(opt('6s').price), ours: true },
        { what: 'Group coaching at other Melbourne academies', players: '3 to 10 players', price: '$35 – $50' },
        { what: 'One-on-one coaching', players: '1 player', price: '$80 – $140' },
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
    notMeet: 'Weekly sessions are run by our coaches in Melbourne, not by Sid or by Rajasthan Royals players or staff from India.',
    pillarsTitle: 'The Royals Way, in every session',
};

// ── 10. Where ──
export const WHERE = {
    eyebrow: 'Where',
    title: 'Two centres, every Wednesday in term',
    apart: CENTRES_APART,
    times: 'Wednesdays from Wed 28 Oct · 6:00pm and 7:00pm sessions',
    newSlots: 'We’re starting with Wednesdays. As groups fill, we’ll open new time slots on other days.',
};

// ── 11. Register your interest ──
export const FORM = {
    eyebrow: 'Register your interest',
    title: 'Hear first when enrolment opens',
    intro: ['No payment now, and no place is held yet. Enrolment (choosing a place and paying) opens on ', JOINING_OPENS, '. Everyone on this list gets the enrolment link before we announce it anywhere else. Your answers help us book the right number of lanes.'],
    mockupNote: 'Mock-up: this form is not connected yet. Nothing you type is saved.',
    why: {
        dob: 'So we put your player in the right stage.',
        option: 'So we know how many lanes of each size to book.',
        time: 'So we can plan the 6:00pm and 7:00pm sessions.',
        pay: 'You can change your mind later. It helps us plan.',
    },
    optionChoices: [
        { value: '4s', label: 'Groups of 4', sub: `${money(opt('4s').price)} a session · more turns` },
        { value: '6s', label: 'Groups of 6', sub: `${money(opt('6s').price)} a session · more teammates` },
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
        { value: 'year', label: '4 terms (a year) ahead (save 15%)' },
        { value: 'not-sure', label: 'Not sure yet' },
    ],
    done: {
        title: "You're on the list",
        body: `We've got your details. No payment has been taken and no place is held yet. We'll email you the enrolment link before enrolment opens. If you enrol, your player's first session would be ${FIRST_SESSION.long}.`,
    },
    contact: 'info@rramelbourne.com',
    privacy: ['We use these details only to plan Junior Royals groups and to contact you about Junior Royals. We don’t share them outside the Academy, except with the services that store them for us. ', tbc('If your player doesn’t enrol, we delete them by 30 June 2027.', 'Retention date for interest-only records?'), ' To see or delete your details, email info@rramelbourne.com.'],
};

// ── 12. FAQ ──
export const FAQS = [
    {
        q: 'What is the difference between Groups of 4 and Groups of 6?',
        a: `The group size. Groups of 4 (${money(opt('4s').price)} a session): more turns, so your player is back up to bat or bowl sooner, and more of the coach’s attention on every ball. Groups of 6 (${money(opt('6s').price)} a session): more players to play with, so more partner challenges and a scored game with two teams of 3. Both have the same coaching team, the same session plan and the same skills. ${GST_NOTE} Development matches cost extra.`,
    },
    {
        q: 'My player has never played. Can they enrol?',
        a: ['Yes. On 28 October, every stage starts with the basics: grip, stance and a straight bowling arm. Our youngest players use soft balls and tees. ', tbc('Confirm', 'Blueprint decision 1 (14 Oct): does 28 Oct start at the basics for every stage?')],
    },
    {
        q: 'My player already plays club cricket. Is it too easy?',
        a: 'Players are grouped by age, and every drill has a harder version for players who are ready. Players aged 11 and 12 work on the cut, the pull, spin, and bowling to a plan.',
    },
    {
        q: 'Is it safe?',
        a: ['Groups are small: 4 or 6 players in a lane, each with its own coach. At Wednesday training, players aged 7 to 10 bat only against balls their coach throws. Players aged 7 and 8 bowl at targets, never at a batter. Players aged 11 and 12 use tennis balls or soft balls. Development matches are real games, so players bowl to each other there. ', tbc('From age 9, and in every match at any age, players wear a helmet when batting or keeping wicket. Bring your own if you have one; we lend helmets at both centres.', 'Helmets: count the lending helmets at both centres before this line goes live.'), ' ', tbc('Before enrolment opens, we’ll publish here how we check every coach and how players are signed in and out.', 'SAFEGUARDING VETO until true: every coach on the WWC register + connected in WWC Connect (law from 19 Oct 2026), 2 checked adults (18+) every session, sign-in/out, Child Safety Policy page, named Safeguarding Lead with phone.')],
    },
    {
        q: 'How do drop-off and pick-up work?',
        a: [tbc('Please bring your player into the centre and sign them in with their coach, and sign them out at the end. We only hand players over to you or an adult you name on the enrolment form. Players aged 7 and 8: please stay in the centre during the session, so you’re close by if they need the toilet or a hand.', 'Sign-in/out system + authorised collectors on the enrolment form (safeguarding). Coaches never take a player to the toilet alone.')],
    },
    {
        q: 'How do payments work?',
        a: `Your place carries on each term, and we charge you when each term starts, until you tell us to stop. Pay for the term before it starts, or weekly during it; the price is the same. Pay 2 terms ahead to save ${Math.round(DISCOUNTS.twoTerms * 100)}%, or 4 terms (a year) ahead to save ${Math.round(DISCOUNTS.year * 100)}%. Nothing is charged in the school holidays.`,
    },
    {
        q: 'Can we stop?',
        a: [`Yes. Email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts, and your place ends at the end of the current term. `, tbc('If you paid ahead, the terms you used are charged at the full price and the rest is refunded.', 'Proposed rule — approve?')],
    },
    {
        q: 'Can my player start partway through a term?',
        a: 'No. New players start at the beginning of a term, so groups stay together. If you register now, you hear first when enrolment opens.',
    },
    {
        q: 'What if my player misses a session?',
        a: ['Each lane keeps one spot for a player making up a missed session. ', tbc('Your player can make it up in another group at the same stage and the same centre, when that group has a spot. Make-ups aren’t available in the first or last session of term.', 'Make-up rules — see the Prices section.')],
    },
    {
        q: 'Are matches included?',
        a: 'No. Each match has its own fee, paid for that match. We tell you the fee before you enter.',
    },
    {
        q: 'Will my player meet Sid or Rajasthan Royals players?',
        a: `Not at weekly sessions. Our Royals Academy coaches in Melbourne run every Junior Royals session. What comes from ${SID.name} is the coaching course our coaches teach from.`,
    },
    {
        q: 'Does Junior Royals lead to Performance Squads?',
        a: 'When Junior Royals ends at 12, players can trial for our Performance Squads. A squad place is decided at the trial, and not every player gets one.',
        link: { to: PS_ROUTE, label: 'See Performance Squads' },
    },
    {
        q: 'Which time will my player train?',
        a: [tbc('The time (6:00pm or 7:00pm) depends on your player’s stage.', 'Which stages train at 6:00pm and which at 7:00pm?')],
    },
    {
        q: 'Can we use both centres?',
        a: `No. Your player trains at one centre. ${CENTRES_APART}`,
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
    'Enrolment-opens date',
    'Naming the Royals Coaching Hub and Sid on the page',
    'The per-hour comparison table',
    'Families watching festival night',
    'Safety floor: two checked adults, WWCC verified, sign-in/out',
    'Head Coach at Cranbourne North; uniform',
    'Blueprint decision 1: does 28 Oct start at the basics for every stage?',
    'Balls faced and bowled by each player in a session (for the queue answer)',
    'Groups of 4: minimum families to open a lane, and what happens if it doesn’t run',
    'Late notice to stop: is the next term charged?',
    'Skill badges from Term 1, 2027 (blueprint Part IV): go ahead?',
    'Older beginners (11–12): how they start',
    'Performance Squads’ own page takes ages 10–25; this page points 13+ there. Align? What happens after a “no” at the trial?',
    'SAFEGUARDING: WWC register + WWC Connect for every coach, 2 checked adults, sign-in/out, policy page, named lead (veto until true)',
    'Helmets to lend at both centres (count them)',
    'Cover rule: cancel + credit, never merge lanes',
    'Photos of players: written parent consent for web, social previews and paid ads',
    'Terms with 11 Wednesdays (Term 2 and Term 4, 2027): what happens in the extra week?',
];
