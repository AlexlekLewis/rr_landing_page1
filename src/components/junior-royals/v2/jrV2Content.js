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

import { tbc, money, AGES_TEXT, FIRST_SESSION, CALENDAR, SESSIONS_PER_YEAR, GST_NOTE, JOINING_OPENS, CENTRES, PS_ROUTE } from '../juniorRoyalsData';
import { PRICE, SHIRT, NOTICE_WEEKS, BADGES, CURRICULUM, TIMES, BLOCK } from './jrV2Facts';

const r2 = (n) => Math.round(n * 100) / 100;
// Every batting, bowling and fielding topic across the three stages (47).
export const TOPIC_TOTAL = Object.values(CURRICULUM).reduce((n, c) => n + c.batting.length + c.bowling.length + c.fielding.length, 0);
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

// How enrolment and payment work, in Alex's words (12 Oct 2026): "enrol once, pay
// every term, on a subscription". A family enrols ONCE; it is never "enrol for a
// term". "Weekly" is in the line because the price is a weekly price.
export const SUBSCRIPTION_LINE = 'Enrol once, pay weekly every term, on a subscription.';
// Alex, 12 Oct 2026: "Make sure it's clear in the terms and conditions or even in
// the FAQ section that re-enrolments are automatic. First payment comes out the
// day of the first session of the term." The same two sentences are used in the
// enrolment steps and the FAQ, and the Terms checklist (docs/) says the same.
export const FIRST_PAYMENT_LINE = `The first payment of ${WEEKLY} is taken on the day of your player’s first session of each term. After that, one payment is taken each week until that term ends.`;
export const AUTO_RENEW_LINE = 'Re-enrolment is automatic. Your player’s place continues into the next term, and payments start again on the day of the first session of that term, unless you tell us to stop.';
export const STOP_LINE = `To stop, email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts. There’s no fee for that.`;

// Session time by age, in one line each ("6:00pm: players aged 7 to 9").
export const TIME_LINES = TIMES.map((t) => `${t.time}: players aged ${t.min} to ${t.max}`);
export const TIMES_SENTENCE = `Players aged ${TIMES[0].min} to ${TIMES[0].max} train at ${TIMES[0].time}, and players aged ${TIMES[1].min} to ${TIMES[1].max} train at ${TIMES[1].time}.`;

// ── 1. Hero (first screen on a phone) ──
// Alex, 12 Oct 2026: "The hero section is too crowded … go straight into who's it
// for, what time is it, where are the locations, group sizing", and say plainly
// that 6:00pm is for ages 7 to 9 and 7:00pm for ages 10 to 12. So: no "why" line,
// no second button, no side links. Who it is for is the line under the title.
export const HERO = {
    eyebrow: 'Rajasthan Royals Academy · Melbourne',
    title: 'Junior Royals',
    titleSub: 'Cricket coaching for players aged 7 to 12',
    facts: [
        { icon: 'clock', k: 'When', v: `One hour a week, on a weekday evening in school terms. First sessions ${FIRST_SESSION.long}.`, lines: TIME_LINES },
        { icon: 'pin', k: 'Where', v: CENTRE_NAMES },
        { icon: 'group', k: 'Groups', v: `Up to ${PRICE.perLane} players in each group, with their own coach` },
    ],
    price: WEEKLY,
    per: 'a week',
    priceNote: `${GST_NOTE} ${SUBSCRIPTION_LINE}`,
    shirt: `Plus the training shirt, ${money(SHIRT.memberPrice)} once (compulsory). Free for the first ${SHIRT.freeForFirst} players to enrol.`,
    noPayment: 'No payment now. No place is held yet.',
};

// The portal's public name and the start-date note, used by the value and progress sections.
export const PORTAL_NAME = 'Player Performance Portal';   // the name the Power Game pages already use
const WHEN = tbc('From Term 1, 2027.', 'Skill badges and portal access for Junior Royals: start date to confirm (blueprint Part IV is a proposal; is the Junior Royals part of the portal built?).');

// ── The value, in plain words (Alex, 11 Oct 2026: "clearly communicate what the
// value is … for the player and the parent", with the Royals Way folded in).
// 12 Oct audit (Alex: "don't make up your own language if you haven't got it"):
// the lead and the Royals Way block are now quoted from documents that already
// exist; the source of each line is noted beside it. Nothing here says why the
// Royals system is better than another academy: nothing is written on that yet.
export const VALUE = {
    eyebrow: 'Play the Royals Way',
    title: 'What your player gets, and what you get',
    // Blueprint Part I, "In one paragraph, for families", word for word.
    lead: tbc('Junior Royals is cricket coaching the Royals Way for players aged 7 to 12. Every week of the school term, your player bats and bowls with a Royals Academy coach in a small group. Every skill gets three weeks: we learn it, we own it, then we use it in a game.',
        'Blueprint "In one paragraph, for families" (its decision 10 asks you to approve it), minus its last sentence about the first-night and last-night game (the Benchmark Game). Note: Term 4, 2026 is a shorter term, and the blueprint gives two of its three skills 2 weeks, not 3.'),
    royals: {
        title: 'The Royals and the Royals Way',
        items: [
            // Sid profile §3 (verified 2 Oct 2026), word for word.
            { q: 'Who are the Royals?', a: 'The Royals run a global cricket organisation, with the Rajasthan Royals in India’s IPL, the Paarl Royals in South Africa’s SA20, and a network of Rajasthan Royals academies around the world, including ours in Melbourne.' },
            // Blueprint Part I §1, word for word.
            { q: 'What is the Royals Way?', a: 'We teach the whole game: batting, bowling, fielding and how to play. We teach it the Royals Way: through games, with one clear skill to learn, one coaching point to hold on to, and a score to beat.' },
            // Blueprint Part I §1, word for word; "(the Royals’ coaching videos)" explains the Hub and is to confirm.
            { q: 'Where do the skills come from?', a: ['The skills follow the path the Royals’ own coaches teach on the Royals Coaching Hub ', tbc('(the Royals’ coaching videos)', 'Is "the Royals’ coaching videos" a fair plain description of the Royals Coaching Hub?'), ', from the very first grip to the shots and plans of a player ready to compete.'] },
            // Blueprint Part I §3 and §2, word for word.
            { q: 'Where does it lead?', a: 'Junior Royals is the first six years of the Royals Player Pathway: one arc from a seven-year-old’s first session to Performance Squads and beyond. Performance Squads runs alongside: it is by invitation only, and players are eligible from age 10. An invitation is never promised.' },
        ],
    },
    player: {
        title: 'For your player',
        points: [
            { icon: 'bat', head: 'They bat and bowl every week', body: 'Every player gets the same number of turns.' },
            { icon: 'one', head: 'One skill at a time', body: 'One batting skill and one bowling skill for 3 weeks, so there is time to learn them properly.' },
            { icon: 'cue', head: 'A few words to remember', body: 'Every skill has a cue: 2 or 3 words, like “Heel to toe”, that help them remember it.' },
            { icon: 'game', head: 'A game with a score, every session', body: 'The hour always ends with a game, so skills get used, not just practised.' },
            { icon: 'joy', head: 'Brave tries count', body: 'Players are asked to try. If it doesn’t work, the coach asks what happened, and they try again.' },
            { icon: 'badge', head: 'A badge for every skill', body: `Each skill they learn earns a digital badge, kept in their ${PORTAL_NAME}.` },
        ],
    },
    parent: {
        title: 'For you',
        points: [
            { icon: 'group', head: 'A small group with its own coach', body: `No more than ${PRICE.perLane} players in a lane.` },
            { icon: 'plan', head: 'The same plan every week', body: 'Sixty minutes: batting, bowling, then a scored game.' },
            { icon: 'safe', head: 'Safety rules for each stage', body: 'In Discover, players bowl at targets, never at a batter, and the coach feeds every ball to the batter.' },
            { icon: 'card', head: 'Progress you can see', body: [`Every badge your player earns is recorded in the ${PORTAL_NAME}, in “I can …” words. `, WHEN] },
            { icon: 'same', head: 'Every coach works from the same written plan', body: 'A goal, the coaching points, the questions to ask and the drills, for every session.' },
            { icon: 'place', head: 'Your player keeps their place', body: 'The same day and time each week, and their place continues every term until you stop it.' },
        ],
    },
};

export const CTA = {
    primary: 'Register Your Interest',
    secondary: 'See how progress is tracked',
    sticky: `Ages ${AGES_TEXT} · starts ${FIRST_SESSION.short}`,
    under: 'No payment now. No place is held yet.',
};

// ── 2. The Royals Way Progress Tracking and Development System (Alex, 9 Oct:
// the first section after the hero).
// Rebuilt 12 Oct 2026 (Alex): "We need to be clearer about the badges and the
// learning process around the badges and the reasons why it's important to be
// able to track a player's development over time. We need to talk about access
// to the player performance portal for Junior Royals. This is the environment
// where they'll receive their digital badges and digital certificates when
// they've completed each phase or skill. Also keeps record of their journey with
// the Royals."
// ("Journey" is on the banned list in CLAUDE.md §2.1, so the page says "a record
// of your player's time with the Royals: every badge and every certificate".)
// The Benchmark Game and the printed progress card are OFF the page: Alex did not
// recognise the Benchmark Game ("I feel like you made that up"). Both come from
// the Program Blueprint (Proposal v1), not from a decision; see the decisions note.
export const PROGRESS = {
    eyebrow: 'Progress you can see',
    title: 'The Royals Way Progress Tracking and Development System',
    lead: `Your player earns a digital skill badge for every skill they learn, and a digital certificate for every stage they complete. Both are kept in the ${PORTAL_NAME}, which keeps a record of your player’s time with the Royals.`,
    // Alex, 12 Oct 2026: "put some language in the badges about a sense of
    // accomplishment and a player's ability to feel self-confident as they develop
    // and grow their game." His words, kept close.
    feel: 'Every badge gives your player a sense of accomplishment, and helps them feel self-confident as they develop and grow their game.',
    starts: tbc('Skill badges and portal access start in Term 1, 2027.', 'Start date for badges and portal access: Term 1, 2027 is the blueprint’s proposal. Confirm, or start in Term 4, 2026.'),
    // The learning process around a badge: the 3-week block (jrV2Facts BLOCK), the
    // coach's check (BADGES.check) and the badge arriving in the portal.
    stepsTitle: 'How your player earns a badge',
    steps: [
        { name: BLOCK[0].name, when: `Week ${BLOCK[0].week}`, does: 'Your coach shows the skill, step by step. Your player copies it.' },
        { name: BLOCK[1].name, when: `Week ${BLOCK[1].week}`, does: 'Your player does it without help, again and again.' },
        { name: BLOCK[2].name, when: `Week ${BLOCK[2].week}`, does: 'Mixed-up balls, like a real game. Your player chooses what to do.' },
        { name: 'The coach checks it', when: 'The check', does: `Your player shows the skill without help: ${BADGES.check.good} good balls out of ${BADGES.check.of}, in ${BADGES.check.nights} different sessions.` },
        { name: 'The badge is earned', when: 'The badge', does: `The digital badge appears in your player’s ${PORTAL_NAME}.` },
    ],
    // Why track. The first line is Alex's (12 Oct). Of the rest, lines 1, 2 and 4 are the blueprint's (Part IV: "Over a year the
    // badges show exactly what each player can do, built from the same coaching
    // points we teach"; "One good night is performance, not learning"; "A climb,
    // not a rank. No leaderboards; nothing for size, pace or attendance"). Line 3
    // is from its portal view ("earned badges and Working on it"). Line 5 is Alex's.
    whyTitle: 'Why we track every player’s development',
    why: [
        { head: 'A sense of accomplishment', body: 'Each badge is something your player has earned, so they feel self-confident as they develop and grow their game.' },
        { head: 'You see exactly what your player can do', body: 'Over a year, the badges show exactly what each player can do. They are built from the same coaching points we teach.' },
        { head: 'A badge means the skill is learned', body: `One good session is not enough. Your player shows the skill in ${BADGES.check.nights} different sessions before the badge is earned.` },
        { head: 'Everyone knows what comes next', body: 'Your player and their coach always know which skills are earned and which they are working on.' },
        { head: 'A climb, not a rank', body: 'Players are not ranked against each other. Badges are for skills only: never for size, speed or attendance.' },
        { head: 'One record, from the first session on', body: `The ${PORTAL_NAME} keeps every badge and every certificate your player earns, for all their time with the Royals.` },
    ],
    portalTitle: `The ${PORTAL_NAME}`,
    portal: {
        lead: `Every Junior Royals player gets access to the ${PORTAL_NAME}.`,
        points: [
            'It is where your player receives their digital badges, each time they earn one.',
            'It is where your player receives a digital certificate when they complete a stage.',
            'It keeps a record of your player’s time with the Royals: every badge and every certificate.',
        ],
    },
    perYear: `There are ${BADGES.perYear.batting + BADGES.perYear.bowling + BADGES.perYear.fielding} badges to earn each year: ${BADGES.perYear.batting} for batting, ${BADGES.perYear.bowling} for bowling and ${BADGES.perYear.fielding} for fielding. Every 3 weeks there is one new batting badge and one new bowling badge.`,
    rules: [
        '“Not yet”, never “failed”. A player can keep trying for a badge until they earn it. Once it is earned, they keep it.',
    ],
    stagesIntro: 'Junior Royals has three stages: Discover, Develop and Elevate. Discover is the first.',
    sampleTitle: `The ${BADGES.discover.length} badges in Discover`,
    badgeHint: 'Tap or click a badge to see what it means.',
    iCan: 'I can',
    certTitle: 'A digital certificate for every stage',
};

// ── 3. How your player learns (one section, four parts) ──
export const LEARN = {
    eyebrow: 'How your player learns',
    title: 'What your player will learn and experience',
    lead: 'Four things every parent asks. Open each one to see it.',
    parts: [
        { id: 'learn-how', n: '1', title: 'How they learn', summary: 'Small groups, one skill at a time, and a game with a score every session.' },
        { id: 'learn-night', n: '2', title: 'What a night looks like', summary: 'One hour: 20 minutes of batting, 20 of bowling, then a scored game.' },
        { id: 'learn-blocks', n: '3', title: '3-week skill blocks', summary: 'Three weeks on every skill: learn it, own it, use it.' },
        { id: 'learn-what', n: '4', title: 'What your player learns', summary: `Three stages and ${TOPIC_TOTAL} topics, from holding the bat to bowling to a plan.` },
    ],
    how: {
        points: [
            `Small groups: up to ${PRICE.perLane} players in a lane, and every lane has its own Royals Academy coach.`,
            'One batting skill and one bowling skill at a time, so your player isn’t trying to learn everything at once.',
            'Every skill has a cue: 2 or 3 words your coach says, so your player remembers what to do.',
            'Every player bats and bowls every week, and every session ends with a game with a score.',
        ],
        pillarsTitle: 'Built on The Royals Way',
        pillarsLead: 'Four of the Royals Way pillars shape every Junior Royals session:',
        matches: 'Matches: some Junior Royals players may be invited to play Power League matches (matches between our Performance Squads).',
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
        intro: 'Each skill gets 3 weeks, so there is time to learn it properly: learn it, own it, use it. Each skill block builds on the one before.',
        cuesTitle: 'Every skill has one cue: 2 or 3 words your coach says to help your player remember it.',
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
    older: { lead: 'Aged 13 or older?', body: 'See our Performance Squads.', link: { to: PS_ROUTE, label: 'See Performance Squads' } },
};

// ── 4. Coaches at each centre ──
export const COACHES = {
    eyebrow: 'Coaches and centres',
    title: 'Your coaches at each centre',
    intro: 'Every lane has its own Royals Academy coach. These are the coaches at each centre.',
    times: `Weekday evenings. ${TIME_LINES.join('. ')}.`,
    comingSoon: 'Coming soon',
    comingSoonNote: 'Junior Royals is coming to Melbourne’s west. Register your interest and choose Ravenhall, and we’ll tell you first when it opens.',
    apart: 'The centres are far apart, so choose the one you can get to every week.',
    // Blueprint Part I §1, word for word (the earlier "presented by Sid" line was
    // unapproved, and other coaches present parts of the Hub).
    course: 'The skills our coaches teach follow the path the Royals’ own coaches teach on the Royals Coaching Hub.',
    notMeet: 'Weekly sessions are run by our coaches in Melbourne, not by Rajasthan Royals players or staff from India.',
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
        [`Digital skill badges and access to the ${PORTAL_NAME} `, tbc('(from Term 1, 2027)', 'Skill badges and portal access: start date to confirm.')],
        'A digital certificate at the end of every stage',
    ],
    shirtTitle: 'The training shirt',
    shirt: `The Junior Royals training shirt is part of the kit, and players wear it at every session. It costs ${money(SHIRT.memberPrice)} at the member price (${money(SHIRT.shopPrice)} in our shop), paid once.`,
    shirtOffer: `Relaunch offer: the first ${SHIRT.freeForFirst} players to enrol get their shirt free, if we have their size.`,
    howTitle: 'How enrolment works',
    how: [
        ['Enrol before the term starts. New players start at the beginning of a term, so groups stay together. ', tbc('Enrolments close the Friday before term.', 'Enrolment closing day? Proposed: the Friday before term.')],
        [`${SUBSCRIPTION_LINE} ${FIRST_PAYMENT_LINE}`],
        [`${AUTO_RENEW_LINE} Your player keeps their place in their group, and you don’t need to enrol again.`],
        ['Nothing to pay in the school holidays.'],
        [STOP_LINE],
        ['Stopping in the middle of a term: a cancellation fee of ', CANCEL_FEE, ' applies, because nobody new can join that group until the next term. This doesn’t affect your rights under the Australian Consumer Law.'],
    ],
    makeup: ['Missed a session? Each group keeps one spot for a player who missed a session. ', tbc('Your player can do it with another group at the same stage and the same centre, when that group has a spot. This isn’t available in the first or last session of term.', 'Make-up rules: same stage + same centre only, none on Benchmark/festival nights (safeguarding). How many a term? How booked?')],
    cover: tbc('Each group always has its own coach. If a coach is away and we can’t replace them, we cancel that group’s session and credit you for it. We don’t join two groups together.', 'Approve the cover rule (cancel + credit, never merge lanes)?'),
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
    // Registering interest, hearing your day and enrolling are three different steps
    // (cold-read audit, 12 Oct 2026): set them side by side above the form.
    steps: [
        { n: '1', when: 'Today', does: 'Register your interest. No payment now, and no place is held yet.' },
        { n: '2', when: 'Then', does: 'We email you the day your player’s group trains. The time is set by age.' },
        { n: '3', when: ['From ', JOINING_OPENS], does: 'Enrolment opens. You confirm your player’s place and arrange payment. Everyone on this list gets the enrolment link before we announce it anywhere else.' },
    ],
    returning: "Already sent us your details on our Term 4 form? We have them, and we'll email you when enrolment opens.",
    mockupNote: 'Mock-up: this form is not connected yet. Nothing you type is saved.',
    timeByAge: `The session time is set by age. ${TIMES_SENTENCE}`,
    yourTime: (time) => `Your player trains at ${time}.`,
    why: {
        dob: 'So we know your player’s age group and session time.',
        days: `Tick every weekday your player could train. Please choose at least ${MIN_DAYS}. We'll tell you which day your player's group is on before enrolment opens.`,
    },
    daysError: `Please choose at least ${MIN_DAYS} days.`,
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
        a: [`Your player earns a digital skill badge each time they show a skill without help: ${BADGES.check.good} good balls out of ${BADGES.check.of}, in ${BADGES.check.nights} different sessions. At the end of every stage they receive a digital certificate. Both are kept in the ${PORTAL_NAME}. `, PROGRESS.starts],
    },
    {
        q: `What is the ${PORTAL_NAME}?`,
        a: [`${PROGRESS.portal.lead} ${PROGRESS.portal.points.join(' ')} `, PROGRESS.starts],
    },
    {
        q: 'Which day and time will my player train?',
        a: `The time is set by age. ${TIMES_SENTENCE} For the day: on the form, tick every weekday your player could train (at least ${MIN_DAYS}). We put groups together from those answers, and email you your player's day before enrolment opens. Your player then trains on that day every week of term.`,
    },
    {
        q: 'My player has never played. Can they enrol?',
        a: ['Yes. Every stage starts with the basics: grip, stance and a straight bowling arm. Players new to cricket use soft balls and batting tees.'],
    },
    {
        q: 'My player already plays club cricket. Is it too easy?',
        a: ['No. Every drill has a harder version for players who are ready. In Elevate, players work on the cut, the pull, spin, and bowling to a plan. ', LEARN.what.placement],
    },
    {
        q: 'Is it safe?',
        a: ['Groups are small, with up to 6 players in a lane and their own coach. At training, in Discover and Develop the coach feeds every ball to the batter. In Discover, players bowl at targets, never at a batter. Elevate uses tennis balls or soft balls. Power League matches are real games, so players bowl to each other there. ', tbc('Players wear a helmet when batting or keeping wicket in Develop, Elevate and every match. Bring your own if you have one; we lend helmets at every centre.', 'Helmets: count the lending helmets at each centre before this line goes live.'), ' ', tbc('Before enrolment opens, we’ll publish here how we check every coach and how players are signed in and out.', 'SAFEGUARDING VETO until true: every coach on the WWC register + connected in WWC Connect (law from 19 Oct 2026), 2 checked adults (18+) every session, sign-in/out, Child Safety Policy page, named Safeguarding Lead with phone.')],
    },
    {
        q: 'How do drop-off and pick-up work?',
        a: [tbc('Please bring your player into the centre and sign them in with their coach, and sign them out at the end. We only hand players over to you or an adult you name on the enrolment form. If your player is new to cricket, please stay in the centre during the session. Then you are near if they need the toilet or need help.', 'Sign-in/out system + authorised collectors on the enrolment form (safeguarding). Coaches never take a player to the toilet alone.')],
    },
    {
        q: 'How do payments work?',
        a: `${WEEKLY} a week. ${SUBSCRIPTION_LINE} ${FIRST_PAYMENT_LINE} Nothing is charged in the school holidays. ${GST_NOTE}`,
    },
    {
        q: 'Do we need to enrol again each term?',
        a: `No. ${AUTO_RENEW_LINE} ${STOP_LINE}`,
    },
    {
        q: 'Do we have to buy the training shirt?',
        a: `Yes. Players wear the Junior Royals training shirt at every session. It’s ${money(SHIRT.memberPrice)} at the member price, paid once, and the first ${SHIRT.freeForFirst} players to enrol get it free, if we have their size.`,
    },
    {
        q: 'Can we stop?',
        a: [`Yes. Email info@rramelbourne.com at least ${NOTICE_WEEKS} weeks before the next term starts. Your player’s place then ends when the current term ends, with no fee. If you stop in the middle of a term, a cancellation fee of `, CANCEL_FEE, ' applies.'],
    },
    {
        q: 'Can my player start partway through a term?',
        a: 'No. New players start at the beginning of a term, so groups stay together. If you register now, we tell you first when enrolment opens.',
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
        a: 'Not at weekly sessions. Our Royals Academy coaches in Melbourne run every Junior Royals session. The skills they teach follow the path the Royals’ own coaches teach on the Royals Coaching Hub.',
    },
    {
        q: 'Does Junior Royals lead to Performance Squads?',
        a: 'Performance Squads runs alongside Junior Royals. It is by invitation only, and players are eligible from age 10. An invitation is never promised.',
        link: { to: PS_ROUTE, label: 'See Performance Squads' },
    },
    {
        q: 'When does Ravenhall open?',
        a: ['Junior Royals is coming to Ravenhall, in Melbourne’s west. ', tbc('Opening date to be announced.', 'Ravenhall: opening term, days and coaches?'), ' Register your interest and choose Ravenhall, and we’ll tell you first.'],
    },
    {
        q: 'Can we use more than one centre?',
        a: 'No. Your player trains at one centre. The centres are far apart, so choose the one you can get to every week.',
    },
];

// Every open decision, for the review banner. Each also shows in yellow where it's used.
export const OPEN_QUESTIONS_V2 = [
    'The one-line Why in the hero',
    'Progress system: skill badges + Player Performance Portal access from Term 1, 2027 — go ahead? Benchmark Game and printed progress card are off the page (Alex, 12 Oct): keep either?',
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
    'Performance Squads: “by invitation only, from age 10” (blueprint, 9 Oct) — confirm this is how the page should say it',
    'The one-sentence “why” for Junior Royals (draft in the value section)',
    '“Built on The Royals Way”: the pillars are the Academy’s framework; confirm we may not call them the franchise’s official pillars',
    'SAFEGUARDING: WWC register + WWC Connect for every coach, 2 checked adults, sign-in/out, policy page, named lead (veto until true)',
    'Helmets to lend at each centre (count them)',
    'Photos of players: written parent consent for web, social previews and paid ads',
    'Interest-only records: delete by 30 June 2027?',
    'GST registration confirmed (every “incl. GST” price depends on it)',
];
