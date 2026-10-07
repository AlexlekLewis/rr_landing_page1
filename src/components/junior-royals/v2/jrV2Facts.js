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
        feel: 'Soft balls, batting tees (a stand that holds the ball) and lots of hitting. At Wednesday training the coach throws every ball, and players bowl at targets, never at a batter. Fun comes first.',
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
        feel: 'A soft ball, or an Incrediball (a softer rubber cricket ball). At Wednesday training the coach throws every ball, and players start making choices after the ball is bowled. The score rewards a good choice, not only a good hit.',
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
        feel: 'Tennis balls or soft balls, and games with a scoreboard, like a real match. Players start to plan: where to hit, and how to bowl to a field.',
        canDo: [
            'Chase a score with a plan, and finish it',
            'Bowl to a plan, with a slower ball to trick the batter',
        ],
    },
];

// ── The curriculum per stage (blueprint p7–9 "What the player learns", the skill
// ladder p14–15, and "By the end of …, a player can"). Plain words for parents;
// the coach-facing names and Sid's clip numbers stay in the blueprint. Shown in the
// stage pop-up on the page (Alex, 8 Oct: "people are going to really struggle with
// understanding that there's a full curriculum").
export const CURRICULUM = {
    discover: {
        means: 'Learning to love the game and building the base: holding the bat and ball, the stance, a straight swing, a straight bowling arm, catching and throwing. Lots of hitting and lots of games.',
        batting: [
            'Grip, stance and lifting the bat',
            'Step and hit: heel to toe',
            'Swing straight through a gate',
            'First block, to save your stumps',
            'First rock back, to hit a high ball',
            'Run and call: YES, NO or WAIT',
        ],
        bowling: [
            'Hold the ball in your fingers',
            'A straight arm, from standing',
            'Walk in and bowl at the keeper’s gloves',
            'Aim low, at the base of the stumps',
            'Jog in and still bowl straight',
        ],
        fielding: ['Ready position', 'Catch a soft ball', 'Pick up and throw at the stumps'],
        byTheEnd: [
            'Take their grip and stance, and lift the bat, without help',
            'Hit a tee or dropped ball along the ground through a gate, and keep their balance',
            'Bowl at the stumps from a short run with a straight arm',
            'Catch a soft ball with soft hands',
            'Call YES, NO or WAIT, loud and early',
        ],
        next: 'Next, at 9: the full range of front-foot shots, and a run-up.',
        certificate: 'Congratulations, you’ve completed Discover. Next stop: Develop.',
    },
    develop: {
        means: 'The best age for learning skills. The full range of front-foot shots, back-foot defence, first spin and leaving the ball. A run-up, the jump, and bowling a good length. Simple choices, made after the ball is bowled.',
        batting: [
            'Forward defence',
            'On drive and cover drive',
            'Flick off the pads',
            'Back-foot defence and back-foot punch',
            'Block and drive against spin',
            'Leave it or play it',
            'Pick the length: forward or back',
        ],
        bowling: [
            'Base, landing and back leg through',
            'Feel the release',
            'The jump',
            'A run-up to the keeper’s gloves',
            'A straight seam',
            'Bowl to left- and right-handed batters',
            'Land it in a length box',
            'Simple plans: bowl at the stumps, or outside off',
        ],
        fielding: ['High catch, side-on', 'Walk in low', 'Keeping: catch and move sideways'],
        byTheEnd: [
            'Drive or block off the front foot, by choice',
            'Go back and across to a short ball',
            'Bowl from a run-up with an action that repeats',
            'Land it in a length box to right- and left-handed batters',
            'Take a high catch side-on',
        ],
        next: 'Next, at 11: back-foot shots, playing spin, and bowling to a plan.',
        certificate: 'Congratulations, you’ve completed Develop. Next stop: Elevate.',
    },
    elevate: {
        means: 'The skills under pressure. The cut and the pull, using your feet and the crease against spin, range hitting and the sweep. Bowling with pace, the slower ball, bowling to a plan and a field. Chasing and defending a score.',
        batting: [
            'Glance, cut and pull',
            'Choose punch or cut from the line',
            'Drive the turning ball',
            'Use the depth of the crease against spin',
            'Range hitting',
            'The sweep',
            'Rotate the strike and chase with a plan',
        ],
        bowling: [
            'The same run-up, every ball',
            'Length on demand',
            'Pace from a rhythmic run-up; more spin for spinners',
            'The slower ball',
            'Bowl to a field',
            'Set up a batter',
        ],
        fielding: ['Run-outs and relay throws', 'Keeping: stumpings'],
        byTheEnd: [
            'Pick the punch, cut or pull from the length and line',
            'Play spin forward or back',
            'Chase a target with a plan, and finish strong',
            'Bowl to a plan and a field, with a stock ball and a slower ball',
        ],
        next: 'Next, at 13: Performance Squads, by trial. Not every player gets a place.',
        certificate: 'Congratulations, you’ve completed Elevate and Junior Royals. Next stop: Performance Squads trials.',
    },
};

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

// ── Skill badges: PROPOSED, pilot Term 1 2027 (blueprint Part IV, p35–37) ──
// Each 3-week block carries one batting and one bowling badge; fielding adds four a
// year → 12 + 12 + 4 = 28 a year. Year 2 of a stage adds a harder second stripe.
// Certificates are per STAGE (Alex, 8 Oct 2026): "Congratulations, you've completed
// Discover…" — everyone moves up with their age group; never "passed" or "failed".
// Rules: 4 good balls in 6, on two nights; "not yet", never "failed"; no
// leaderboards; nothing for size, pace or attendance; awarded on the night only.
// Only Discover Year 1 badges are written (p36–37); Develop and Elevate are not.
export const BADGES = {
    status: 'proposed',
    pilot: 'Term 1, 2027',
    perYear: { batting: 12, bowling: 12, fielding: 4 },
    check: { good: 4, of: 6, nights: 2 },
    // Discover Year 1 (blueprint p36–37): name + the player's "I can…"
    discover: [
        { name: 'Two Vs', kind: 'bat', can: 'find my grip myself and hit it straight' },
        { name: 'Heel to Toe', kind: 'bat', can: 'hit along the ground and stay balanced' },
        { name: 'Guard the Stumps', kind: 'bat', can: 'block it and save my stumps' },
        { name: 'Call It', kind: 'bat', can: 'call YES, NO or WAIT, loud and early' },
        { name: 'Straight to the Target', kind: 'bowl', can: 'hold it in my fingers and bowl straight' },
        { name: 'Base of the Stump', kind: 'bowl', can: 'aim low and hit the stumps' },
        { name: 'Two the Same', kind: 'bowl', can: 'bowl two the same, in a row' },
        { name: 'Safe Hands', kind: 'field', can: 'catch a soft ball with either hand' },
    ],
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
