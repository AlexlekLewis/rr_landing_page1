// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS · MOCK-UP VERSION 2 — PROGRAM FACTS
//
// Source: "Junior Royals — The Program Blueprint", Proposal v1, Alex Lewis,
// 7 Oct 2026 (Parts I–II, IV–V). Version 1 of the mock-up (5 Oct) is the git
// tag `jr-mockup-v1` and the route /junior-royals/v1 on previews.
//
// "PROMISE ONLY WHAT HAPPENS" (blueprint p6): describe only what we deliver every
// week. Until it is true at every centre, do NOT promise weekly app notes, "the
// same coach all year", sessions with IPL staff, or a Working With Children
// Check line we have not verified. Skill badges are a PROPOSAL (pilot Term 1
// 2027) — shown only as planned.
//
// Prices, centres, dates and the term calendar are imported from
// ../juniorRoyalsData.js (one source), never retyped here. Plain JS only — this
// file is also read by Node for the prerendered structured data.
// ─────────────────────────────────────────────────────────────

// ── The three phases (set by age, two years each) ──
export const PHASES = [
    {
        key: 'discover',
        name: 'Discover',
        ages: '7–8',
        min: 7,
        max: 8,
        aim: 'Learn the game',
        // "How it feels" (blueprint p7), in plain words.
        feel: 'Soft balls, tees and lots of hitting. The coach feeds every ball, and players bowl at targets, never at a batter.',
        canDo: [
            'Hit the ball along the ground and stay balanced',
            'Bowl at the stumps with a straight arm',
        ],
    },
    {
        key: 'develop',
        name: 'Develop',
        ages: '9–10',
        min: 9,
        max: 10,
        aim: 'Learn to play',
        feel: 'Soft or incrediball. The coach feeds every ball, and players start making choices after the ball is bowled.',
        canDo: [
            'Choose to hit or block off the front foot',
            'Run in and bowl the same way, ball after ball',
        ],
    },
    {
        key: 'elevate',
        name: 'Elevate',
        ages: '11–12',
        min: 11,
        max: 12,
        aim: 'Learn to compete',
        feel: 'Match-like situations with a scoreboard. This is the step before a Performance Squads trial.',
        canDo: [
            'Chase a score with a plan, and finish it',
            'Bowl to a plan, with a slower ball to trick the batter',
        ],
    },
];

// After Junior Royals (blueprint p10). Performance Squads is BY TRIAL — never promised.
export const AFTER = [
    { name: 'Performance Squads', ages: 'Trial', aim: 'Compete', note: 'Players try out. Not every player gets a place.' },
];

// What a player can do at 12 (blueprint p10).
export const AT_TWELVE = [
    'Bats from a sound base, forward and back, with a plan against spin',
    'Bowls a repeatable action to a plan, with a stock ball and a change of pace',
    'Catches and fields with confidence, runs hard and calls early',
    'Reads a chase or a defence, and is ready to trial for Performance Squads or lead their club side',
];

// ── One session: the same 60 minutes every week, at every level (blueprint p16) ──
export const SESSION = [
    { from: 0, to: 5, name: 'Warm-up game', kind: 'game', note: 'Run, catch and throw.' },
    { from: 5, to: 15, name: 'Batting skill', kind: 'bat', note: "Your coach shows tonight's skill. Everyone has a go." },
    { from: 15, to: 25, name: 'Batting challenge', kind: 'bat', note: 'Harder balls, a choice to make, and a score.' },
    { from: 25, to: 30, name: 'Break', kind: 'break', note: 'Drink, rest, and one question from your coach.' },
    { from: 30, to: 40, name: 'Bowling skill', kind: 'bowl', note: "Your coach shows tonight's skill. Everyone has a go." },
    { from: 40, to: 50, name: 'Bowling challenge', kind: 'bowl', note: 'A target to hit, and a score.' },
    { from: 50, to: 60, name: 'Scored game', kind: 'game', note: 'Bat, bowl and field in a game with a score.' },
];
export const LANE_MAX = 6;

// ── One skill, three weeks (blueprint p17) ──
export const BLOCK = [
    { week: 1, name: 'Learn it', does: 'Your coach shows you, step by step. You copy it.' },
    { week: 2, name: 'Own it', does: 'You do it on your own, again and again, with no reminders.' },
    { week: 3, name: 'Use it', does: 'Mixed-up balls, like a real game. You choose what to do, and you score.' },
];
// One cue per skill, the same words from 7 to 12 (blueprint p5).
export const CUES = [
    { cue: 'Two Vs', means: 'When you hold the bat, the V between each thumb and first finger points down the bat.' },
    { cue: 'Heel to toe', means: 'As you hit, your weight moves forward onto your front foot.' },
    { cue: 'Straight to the target', means: 'Your bowling hand finishes pointing at the stumps.' },
];

// ── One term (blueprint p17). Term 4 2026 has 8 Wednesdays (28 Oct – 16 Dec). ──
export const TERM_8 = [
    { date: 'Wed 28 Oct', label: 'Benchmark Game', note: 'Block 1: learn it', flag: true },
    { date: 'Wed 4 Nov', label: 'Block 1', note: 'own it' },
    { date: 'Wed 11 Nov', label: 'Block 1', note: 'use it' },
    { date: 'Wed 18 Nov', label: 'Block 2', note: 'learn it' },
    { date: 'Wed 25 Nov', label: 'Block 2', note: 'use it' },
    { date: 'Wed 2 Dec', label: 'Block 3', note: 'learn it' },
    { date: 'Wed 9 Dec', label: 'Block 3', note: 'use it' },
    { date: 'Wed 16 Dec', label: 'Festival night', note: 'The Benchmark Game again', flag: true },
];

// ── The Royals Way (blueprint p10–11) ──
export const PILLARS = [
    { name: 'Joy and curiosity', note: 'Fun comes first, especially for the youngest players.' },
    { name: 'Learn by doing', note: 'Try, make a mistake, learn from it, try again.' },
    { name: 'Play bold', note: 'We reward the brave attempt, not only the result.' },
    { name: 'Respect', note: 'Shake hands, accept the umpire’s call, win and lose well.' },
];

// ── Skill badges: PROPOSED, pilot Term 1 2027 (blueprint Part IV) ──
export const BADGES = {
    status: 'proposed',
    pilot: 'Term 1, 2027',
    examples: ['Two Vs', 'Straight to the Target', 'Safe Hands', 'Call It'],
};

// ── Rehearsal nights before the first session (blueprint p32) ──
export const COACH_REHEARSALS = 'Wednesday 14 and Wednesday 21 October';

// ── A year of Wednesdays (2027), for the 52-square strip ──
// Victorian school terms 2027 (vic.gov.au, checked 5 Oct 2026); training is the
// Wednesdays inside them. 2027 has 52 Wednesdays: 40 in term, 12 in the holidays.
export const TERMS_2027 = [
    { name: 'Term 1', from: '2027-02-03', to: '2027-03-24' },
    { name: 'Term 2', from: '2027-04-14', to: '2027-06-23' },
    { name: 'Term 3', from: '2027-07-14', to: '2027-09-15' },
    { name: 'Term 4', from: '2027-10-06', to: '2027-12-15' },
];
export const wednesdays2027 = () => {
    const out = [];
    for (let d = new Date(Date.UTC(2027, 0, 6)); d.getUTCFullYear() === 2027; d = new Date(d.getTime() + 7 * 864e5)) {
        const iso = d.toISOString().slice(0, 10);
        const term = TERMS_2027.find((t) => iso >= t.from && iso <= t.to);
        out.push({ iso, month: d.getUTCMonth(), term: term ? term.name : null });
    }
    return out;
};

// ── The two options (Alex, 8 Oct 2026) ──
// Same program, same coaches, same session plan. The only difference is how many
// players share the lane. Each lane also keeps ONE spot for a player making up a
// missed session, so a lane never goes over `max`. Prices incl. GST, per session.
export const OPTIONS = [
    { key: '4s', name: 'Junior Royals 4s', perLane: 4, max: 5, price: 50 },
    { key: '6s', name: 'Junior Royals 6s', perLane: 6, max: 7, price: 35 },
];
// Paying ahead (Alex, 7 Oct 2026). Applies to both options.
export const DISCOUNTS = { twoTerms: 0.10, year: 0.15 };
export const NOTICE_WEEKS = 2;            // notice before the next term (Alex, 8 Oct 2026)
