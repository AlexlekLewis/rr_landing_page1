// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS · MOCK-UP VERSION 2 — EVERY LINE OF COPY
//
// Rebuilt 9 Oct 2026 from Alex's review:
//   Hero → The Royals Way Progress Tracking and Development System → How your
//   player learns (how they learn · a night · 3-week blocks · what they learn)
//   → Coaches at each centre → Price → Form → FAQ.
// Tone (Alex): what parents want to see, and what their player will learn and
// experience. Plain English (copy-esl.md), facts not adjectives (CLAUDE.md §2):
// the page never calls the program "unique" or "second to none"; it shows what
// happens instead, so a parent can check every line.
// No stage ages on the page (Alex, 9 Oct). No "8 weeks" note. One price.
// A third centre, Ravenhall (Melbourne's west), is "coming soon" (Alex, 9 Oct).
// The form asks for 2 or more weekdays; we tell each family their day.
//
// Facts come from ./jrV2Facts.js and ../juniorRoyalsData.js — never retyped.
// Anything not yet decided is tbc() and shows in yellow on the mock-up.
// ─────────────────────────────────────────────────────────────

import { SID } from '../../open-age-trial/openAgeData';
import { tbc, money, AGES_TEXT, FIRST_SESSION, CALENDAR, SESSIONS_PER_YEAR, GST_NOTE, JOINING_OPENS, CENTRES, PS_ROUTE } from '../juniorRoyalsData';
import { PRICE, SHIRT, NOTICE_WEEKS, BADGES } from './jrV2Facts';

const r2 = (n) => Math.round(n * 100) / 100;
export const WEEKLY = money(PRICE.perWeek);                                   // "$49.95"
export const termTotal = (sessions) => r2(PRICE.perWeek * sessions);
export const yearTotal = () => r2(PRICE.perWeek * SESSIONS_PER_YEAR);
export const TERMS = CALENDAR.filter((c) => !c.holiday)
    .map((c) => ({ ...c, label: c.label === 'Rest of 2026' ? 'Term 4, 2026' : c.label }));

// ── Centres: the two running now, plus Ravenhall coming soon (Alex, 9 Oct 2026).
// Ravenhall has no sessions or coaches yet: it is shown as "coming soon" and
// families can register interest for it. Never named Williamstown/Hallam.
export const RAVENHALL = {
    value: 'ravenhall',
    comingSoon: true,
    venue: tbc('Ravenhall', 'Exact venue name for the Ravenhall centre?'),
    venueText: 'Ravenhall',
    suburb: 'Ravenhall',
    address: '5/65 Eucumbene Drive, Ravenhall VIC 3023',
    mapsUrl: 'https://maps.google.com/?q=5%2F65+Eucumbene+Drive+Ravenhall+VIC+3023',
};
export const V2_CENTRES = [...CENTRES, RAVENHALL];
export const REGION_LABEL = { mickleham: "Melbourne's north", 'cranbourne-north': 'South-East Melbourne', ravenhall: "Melbourne's west" };
export const NEARBY = {
    mickleham: 'The nearer centre if you live in or around Mickleham, Craigieburn, Kalkallo, Donnybrook, Greenvale or Roxburgh Park.',
    'cranbourne-north': 'The nearer centre if you live in or around Cranbourne, Narre Warren, Berwick, Clyde or elsewhere in Casey.',
    ravenhall: 'The nearer centre if you live in or around Ravenhall, Caroline Springs, Deer Park, Truganina or Tarneit.',
};
export const CENTRE_NAMES = 'Mickleham or Cranbourne North (Ravenhall coming soon)';

// Cancellation fee for stopping partway through a term (Alex, 9 Oct: "we need a
// price here" — and it goes in the Terms). PROPOSED, not decided.
export const CANCEL_FEE = tbc(`${money(PRICE.perWeek * 2)} (2 weeks’ fees)`,
    'Cancellation fee for stopping mid-term: proposed 2 weeks’ fees. Must be a reasonable estimate of our loss (unfair contract terms law); lawyer to check; add to the T&Cs.');

// Photos (Andy, WhatsApp, 9 Oct 2026), shown like the rest of the site: rounded
// tiles with a short label, no fades. ⚠️ Written parent consent for each player
// shown before launch (safeguarding). Alt text describes the scene, never a name.
export const PHOTOS = {
    progress: { src: '/assets/jr-photo-kneel-feed.jpg', alt: 'A Royals Academy coach kneels to feed a ball to a young batter in the nets', label: 'Every turn counts' },
    how: { src: '/assets/jr-photo-coach-group.jpg', alt: 'A Royals Academy coach shows a batting skill to a small group of young players', label: 'Your coach shows the skill' },
    night: { src: '/assets/jr-photo-tee.jpg', alt: 'A young batter hits a ball off a batting tee while a coach watches', label: 'Batting skill' },
    blocks: [
        { src: '/assets/jr-photo-partners.jpg', alt: 'Two young players practise a batting drill between cones', label: 'Own it' },
        { src: '/assets/jr-photo-defence.jpg', alt: 'A young batter plays a forward defence in a partner drill', label: 'Use it' },
    ],
    coaches: { src: '/assets/jr-photo-feed.jpg', alt: 'A Royals Academy coach feeds balls to a young batter', label: 'Our coaches' },
};

// ── 1. Hero (first screen on a phone) ──
export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    titleSub: `Cricket coaching for ages ${AGES_TEXT}`,
    why: tbc('Your player learns one skill at a time, and you can see every skill they’ve mastered.', 'The one-line Why for the hero — OK?'),
    facts: [
        { icon: 'users', k: 'Ages', v: `Ages ${AGES_TEXT}`, older: true },
        { icon: 'clock', k: 'When', v: `One hour a week on a weekday evening in school terms, at 6:00pm or 7:00pm. First sessions ${FIRST_SESSION.long}.` },
        { icon: 'pin', k: 'Where', v: CENTRE_NAMES },
        { icon: 'group', k: 'Groups', v: `Small groups: up to ${PRICE.perLane} players in a lane, with their own coach` },
    ],
    price: WEEKLY,
    per: 'a week',
    priceNote: `${GST_NOTE} Paid weekly in term. Nothing to pay in the school holidays.`,
    shirt: `Plus the Junior Royals training shirt, ${money(SHIRT.memberPrice)} once (compulsory). Free for the first ${SHIRT.freeForFirst} players to enrol.`,
    noPayment: 'No payment now. No place is held yet.',
    returning: "Already sent us your details on our Term 4 form? We have them, and we'll email you when enrolment opens.",
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'See how progress is tracked',
    sticky: `Ages ${AGES_TEXT} · starts ${FIRST_SESSION.short}`,
    under: 'No payment now. No place is held yet.',
};

// ── 2. The Royals Way Progress Tracking and Development System (Alex, 9 Oct:
// the first section after the hero). Blueprint Part IV: a proposal, pilot
// Term 1 2027 — so the start date stays yellow until Alex confirms it.
export const PROGRESS = {
    eyebrow: 'Progress you can see',
    title: 'The Royals Way Progress Tracking and Development System',
    lead: 'Every skill your player learns is checked by their coach in a real turn with a score, recorded as a skill badge, and shown on a progress card that comes home at the end of every term.',
    starts: tbc('Skill badges and progress cards start in Term 1, 2027.', 'Blueprint Part IV is a proposal: go ahead from Term 1, 2027? The coaching group settles the standard first.'),
    parts: [
        { icon: 'badge', title: 'Skill badges', body: `When your player can do a skill on their own in a scored turn (${BADGES.check.good} good balls out of ${BADGES.check.of}, in ${BADGES.check.nights} different sessions), they earn its badge.` },
        { icon: 'score', title: 'The Benchmark Game', body: 'The same short game is scored in the first and last session of every term. Your player tries to beat their own score. Scores go on their own card, never on a board.' },
        { icon: 'card', title: 'A progress card every term', body: 'You see which badges your player has earned, and which skills they are working on next.' },
        { icon: 'cert', title: 'A certificate for every stage', body: 'At the end of each stage your player gets a certificate, and moves on to the next stage.' },
    ],
    perYear: `Each year there are ${BADGES.perYear.batting} batting badges, ${BADGES.perYear.bowling} bowling badges and ${BADGES.perYear.fielding} fielding badges to earn: one batting and one bowling badge for every 3-week skill block.`,
    rules: [
        '“Not yet”, never “failed”. A badge stays open until it’s earned, and stays earned once it is.',
        'No leaderboards. Badges are for skills only: never for size, speed or turning up.',
    ],
    sampleTitle: 'Some of the first badges, in Discover',
    iCan: 'I can',
    certTitle: 'A certificate for every stage',
};

// ── 3. How your player learns (one section, four parts) ──
export const LEARN = {
    eyebrow: 'How your player learns',
    title: 'What your player will learn and experience',
    parts: [
        { id: 'learn-how', n: '1', title: 'How they learn' },
        { id: 'learn-night', n: '2', title: 'What a night looks like' },
        { id: 'learn-blocks', n: '3', title: 'Developing in 3-week skill blocks' },
        { id: 'learn-what', n: '4', title: 'What your player learns' },
    ],
    how: {
        points: [
            `Small groups: up to ${PRICE.perLane} players in a lane, and every lane has its own Royals Academy coach.`,
            'One batting skill and one bowling skill at a time, so your player isn’t trying to learn everything at once.',
            'Every skill has a cue: two or three words your coach says, so your player remembers what to do.',
            'Every player bats and bowls every week, and every session ends with a game with a score.',
        ],
        pillarsTitle: 'The Royals Way, in every session',
        matches: [
            'Matches: some Junior Royals players may be invited to play Power League matches, which are part of our Performance Squads program. ',
            tbc('Which players, from what age, and the match fee: to be confirmed.', 'Power League for Junior Royals: who is invited, from what age (Power League is 10–25), and the match fee?'),
        ],
    },
    night: {
        intro: 'One hour, once a week. Every session follows the same plan, so your player always knows what’s next.',
        bigNumbers: [
            { n: '20', unit: 'min', label: 'batting', kind: 'bat' },
            { n: '20', unit: 'min', label: 'bowling', kind: 'bowl' },
            { n: '10', unit: 'min', label: 'scored game', kind: 'game' },
        ],
        guide: 'Plus a 5-minute warm-up game and a 5-minute drink break: 60 minutes in all. The minutes are a guide.',
        lane: `A lane is one practice net: a long pitch with netting all round. Your player’s group has its own lane and its own coach, with up to ${PRICE.perLane} players.`,
    },
    blocks: {
        intro: 'Each skill gets 3 weeks, so it has time to stick: learn it, own it, use it. There are 3 skill blocks in every term, and each one builds on the last.',
        cuesTitle: 'Every skill has one cue: two or three words your coach says to help your player remember it.',
    },
    what: {
        intro: 'Junior Royals has three stages: Discover, Develop and Elevate. Each stage has its own list of batting, bowling and fielding topics. Tap a stage to see everything it covers.',
        placement: tbc('Your coach places your player in the stage that suits them.', 'How are players placed in a stage now the stage ages are off the page: by age (as in the blueprint) or by the coach?'),
    },
};

// The stage cards and pop-ups (JRV2Pathway.jsx).
export const PATH = {
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
        feel: 'What it feels like',
        badges: 'Skill badges in this stage',
        badgesNotWritten: tbc('This stage’s badges are being written by our coaching group.', 'Develop and Elevate badges are not written yet (blueprint Part IV covers Discover Year 1 only).'),
        close: 'Close',
    },
    older: { lead: 'Aged 13 or older?', body: 'Players can trial for our Performance Squads.', link: { to: PS_ROUTE, label: 'See Performance Squads' } },
};

// ── 4. Coaches at each centre ──
export const COACHES = {
    eyebrow: 'Coaches and centres',
    title: 'Your coaches at each centre',
    intro: 'Every lane has its own Royals Academy coach. These are the coaches at each centre.',
    more: tbc('More coaches to be added.', 'Alex to send the Junior Royals coaches at each centre (name and role).'),
    times: '6:00pm and 7:00pm sessions on weekday evenings',
    comingSoon: 'Coming soon',
    comingSoonNote: 'Junior Royals is coming to Melbourne’s west. Register your interest and choose Ravenhall, and you’ll hear first when it opens.',
    apart: 'The centres are a long way apart, so choose the one you can get to every week.',
    course: [
        'What our coaches teach follows the Rajasthan Royals’ coaching course, presented by ',
        `${SID.name}, ${SID.titleLine}. `,
        tbc('Confirm wording', 'Can the page name the Royals Coaching Hub and Sid this way?'),
    ],
    notMeet: 'Weekly sessions are run by our coaches in Melbourne, not by Sid or by Rajasthan Royals players or staff from India.',
};

// ── 5. Price (Alex, 9 Oct 2026) ──
export const PRICES = {
    eyebrow: 'Price',
    title: 'One price, paid weekly in term',
    price: WEEKLY,
    per: 'a week',
    perNote: `One session a week. ${GST_NOTE}`,
    includes: [
        'One hour of coaching every week in school terms',
        `A small group: up to ${PRICE.perLane} players in a lane, with their own coach`,
        'Skill badges, the Benchmark Game and a progress card every term',
        'A certificate at the end of every stage',
    ],
    shirtTitle: 'The training shirt',
    shirt: `The Junior Royals training shirt is part of the kit, and players wear it at every session. It costs ${money(SHIRT.memberPrice)} at the member price (${money(SHIRT.shopPrice)} in our shop), paid once.`,
    shirtOffer: [
        `Relaunch offer: the first ${SHIRT.freeForFirst} players to enrol get their shirt free, subject to stock in their size. `,
        tbc('We’ll show how many free shirts are left.', 'Who keeps the free-shirt count current? A count that goes stale is misleading (CLAUDE.md §2.2).'),
    ],
    howTitle: 'How enrolment works',
    how: [
        ['Enrol before the term starts. New players start at the beginning of a term, so groups stay together. ', tbc('Enrolments close the Friday before term.', 'Enrolment closing day? Proposed: the Friday before term.')],
        [`It’s a term-by-term subscription. Your first weekly payment of ${WEEKLY} is taken in week 1 of each term, then once a week until that term ends.`],
        ['Your player’s place carries on to the next term automatically, so they keep their place in their group without enrolling again.'],
        ['Nothing to pay in the school holidays.'],
        [`To stop, email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts. There’s no fee for that.`],
        ['Stopping partway through a term: a cancellation fee of ', CANCEL_FEE, ' applies, because nobody new can join that group until the next term. This doesn’t affect your rights under the Australian Consumer Law.'],
    ],
    makeup: ['Missed a session? Each lane keeps one spot for a player making up a missed session. ', tbc('Your player can make up a missed session in another group at the same stage and the same centre, when that group has a spot. Make-ups aren’t available in the first or last session of term.', 'Make-up rules: same stage + same centre only, none on Benchmark/festival nights (safeguarding). How many a term? How booked?')],
    cover: tbc('Each lane always has its own coach. If a coach is away and we can’t replace them, we cancel that group’s session and credit it. We don’t merge lanes.', 'Approve the cover rule (cancel + credit, never merge lanes)?'),
    yearTitle: `2027: ${SESSIONS_PER_YEAR} weeks of sessions and ${52 - SESSIONS_PER_YEAR} school-holiday weeks`,
    yearNote: 'You only pay for weeks with a session.',
    calendarTitle: 'Every term and what it costs',
    calendarNote: `${WEEKLY} a week, paid weekly in term. ${GST_NOTE}`,
};

// Per-hour comparison. Market figures: published prices checked 5 Oct 2026 (sources in
// ../juniorRoyalsData.js, PRICE_CONTEXT; REVIEW 5 Jan 2027).
export const COMPARE = {
    title: 'How we compare, per hour',
    head: ['Program', 'Group size', 'Price per hour'],
    rows: [
        { what: 'Junior Royals', players: `Up to ${PRICE.perLane} players`, price: WEEKLY, ours: true },
        { what: 'Group coaching at other Melbourne academies', players: '3 to 10 players', price: '$35 – $50' },
        { what: 'One-on-one coaching', players: '1 player', price: '$80 – $140' },
    ],
    source: "Other academies' prices and group sizes are as published on their own websites on 5 October 2026. They don't say whether GST is included.",
    toConfirm: tbc('Comparison to be approved before publishing.', 'Approve the comparison table? (Re-check every price by 5 Jan 2027.)'),
};

// ── 6. Register your interest ──
// Days (Alex, 9 Oct 2026): families pick 2 or more weekdays they could do; we
// tell them which day their player's group is on.
export const DAYS = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
];
export const MIN_DAYS = 2;

export const FORM = {
    eyebrow: 'Register your interest',
    title: 'Hear first when enrolment opens',
    intro: ['No payment now, and no place is held yet. Enrolment (choosing a place and paying) opens on ', JOINING_OPENS, '. Everyone on this list gets the enrolment link before we announce it anywhere else.'],
    mockupNote: 'Mock-up: this form is not connected yet. Nothing you type is saved.',
    why: {
        dob: 'So we know your player is 7 to 12.',
        days: `Tick every weekday your player could train. Please choose at least ${MIN_DAYS}. We'll tell you which day your player's group is on before enrolment opens.`,
        time: 'So we can plan the 6:00pm and 7:00pm sessions.',
    },
    daysError: `Please choose at least ${MIN_DAYS} days.`,
    timeChoices: [
        { value: '6pm', label: '6:00pm' },
        { value: '7pm', label: '7:00pm' },
        { value: 'either', label: 'Either' },
    ],
    done: {
        title: "You're on the list",
        body: "We've got your details. No payment has been taken and no place is held yet. We'll email you your player's day and the enrolment link before enrolment opens.",
    },
    contact: 'info@rramelbourne.com',
    privacy: ['We use these details only to plan Junior Royals groups and to contact you about Junior Royals. We don’t share them outside the Academy, except with the services that store them for us. ', tbc('If your player doesn’t enrol, we delete them by 30 June 2027.', 'Retention date for interest-only records?'), ' To see or delete your details, email info@rramelbourne.com.'],
};

// ── 7. FAQ ──
export const FAQS = [
    {
        q: 'What will my player learn?',
        a: 'Batting, bowling and fielding, one skill at a time. Junior Royals has three stages (Discover, Develop and Elevate), and each has its own list of topics. Tap a stage in “What your player learns” to see every topic.',
    },
    {
        q: 'How will I know my player is improving?',
        a: ['Your player earns a skill badge each time their coach sees them do a skill on their own in a scored turn. You get a progress card at the end of every term, and a certificate at the end of every stage. ', PROGRESS.starts],
    },
    {
        q: 'Which day will my player train?',
        a: `On the form, tick every weekday your player could train (at least ${MIN_DAYS}). We put groups together from those answers, and email you your player's day before enrolment opens. Your player then trains on that day every week of term.`,
    },
    {
        q: 'My player has never played. Can they enrol?',
        a: ['Yes. Every stage starts with the basics: grip, stance and a straight bowling arm. Players new to cricket use soft balls and batting tees. ', tbc('Confirm', 'Blueprint decision 1 (14 Oct): does 28 Oct start at the basics for every stage?')],
    },
    {
        q: 'My player already plays club cricket. Is it too easy?',
        a: ['No. Every drill has a harder version for players who are ready, and in Elevate players work on the cut, the pull, spin, and bowling to a plan. ', LEARN.what.placement],
    },
    {
        q: 'Is it safe?',
        a: ['Groups are small, with up to 6 players in a lane and their own coach. At training, in Discover and Develop the coach throws every ball the batter faces, and in Discover players bowl at targets, never at a batter. Elevate uses tennis balls or soft balls. Power League matches are real games, so players bowl to each other there. ', tbc('Players wear a helmet when batting or keeping wicket in Develop, Elevate and every match. Bring your own if you have one; we lend helmets at every centre.', 'Helmets: count the lending helmets at each centre before this line goes live.'), ' ', tbc('Before enrolment opens, we’ll publish here how we check every coach and how players are signed in and out.', 'SAFEGUARDING VETO until true: every coach on the WWC register + connected in WWC Connect (law from 19 Oct 2026), 2 checked adults (18+) every session, sign-in/out, Child Safety Policy page, named Safeguarding Lead with phone.')],
    },
    {
        q: 'How do drop-off and pick-up work?',
        a: [tbc('Please bring your player into the centre and sign them in with their coach, and sign them out at the end. We only hand players over to you or an adult you name on the enrolment form. If your player is new to cricket, please stay in the centre during the session, so you’re close by if they need the toilet or a hand.', 'Sign-in/out system + authorised collectors on the enrolment form (safeguarding). Coaches never take a player to the toilet alone.')],
    },
    {
        q: 'How do payments work?',
        a: `${WEEKLY} a week, paid weekly in term. It’s a term-by-term subscription: the first payment is taken in week 1 of each term, then once a week until that term ends. Your player’s place carries on to the next term automatically. Nothing is charged in the school holidays. ${GST_NOTE}`,
    },
    {
        q: 'Do we have to buy the training shirt?',
        a: `Yes. Players wear the Junior Royals training shirt at every session. It’s ${money(SHIRT.memberPrice)} at the member price, paid once, and the first ${SHIRT.freeForFirst} players to enrol get it free (subject to stock in their size).`,
    },
    {
        q: 'Can we stop?',
        a: [`Yes. Email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts, and your player’s place ends when the current term ends, with no fee. If you stop partway through a term, a cancellation fee of `, CANCEL_FEE, ' applies.'],
    },
    {
        q: 'Can my player start partway through a term?',
        a: 'No. New players start at the beginning of a term, so groups stay together. If you register now, you hear first when enrolment opens.',
    },
    {
        q: 'What if my player misses a session?',
        a: PRICES.makeup,
    },
    {
        q: 'Are there matches?',
        a: LEARN.how.matches,
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
        q: 'When does Ravenhall open?',
        a: ['Junior Royals is coming to Ravenhall, in Melbourne’s west. ', tbc('Opening date to be announced.', 'Ravenhall: opening term, days and coaches?'), ' Register your interest and choose Ravenhall, and you’ll hear first.'],
    },
    {
        q: 'Can we use more than one centre?',
        a: 'No. Your player trains at one centre. The centres are a long way apart, so choose the one you can get to every week.',
    },
];

// Every open decision, for the review banner. Each also shows in yellow where it's used.
export const OPEN_QUESTIONS_V2 = [
    'The one-line Why in the hero',
    'Progress system: skill badges + progress cards from Term 1, 2027 (blueprint Part IV) — go ahead?',
    'Cancellation fee for stopping mid-term (proposed 2 weeks’ fees) — lawyer to check; add to the T&Cs',
    'Free-shirt offer: who keeps the “shirts left” count current?',
    'Junior Royals coaches at each centre (names and roles)',
    'Ravenhall: exact venue name, opening term, days and coaches',
    'Day allocation: when do families hear their day, and is Wednesday 28 Oct still the first session at both centres?',
    'Stage placement now the ages are off the page: by age or by the coach?',
    'Power League matches for Junior Royals: who, from what age, match fee',
    'Which stages train at 6:00pm and which at 7:00pm?',
    'Enrolment closing day (proposed: the Friday before term)',
    'Make-up policy: how many, how booked',
    'Enrolment-opens date',
    'Naming the Royals Coaching Hub and Sid on the page',
    'The per-hour comparison table',
    'Cover rule: cancel + credit, never merge lanes',
    'Head Coach at Cranbourne North',
    'Blueprint decision 1: does 28 Oct start at the basics for every stage?',
    'Performance Squads’ own page takes ages 10–25; this page points 13+ there. Align? What happens after a “no” at the trial?',
    'SAFEGUARDING: WWC register + WWC Connect for every coach, 2 checked adults, sign-in/out, policy page, named lead (veto until true)',
    'Helmets to lend at each centre (count them)',
    'Photos of players: written parent consent for web, social previews and paid ads',
    'Interest-only records: delete by 30 June 2027?',
    'GST registration confirmed (every “incl. GST” price depends on it)',
];
