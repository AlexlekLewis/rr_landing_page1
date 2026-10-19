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

// ── The three stages (Alex, 9 Oct 2026: no age definitions on the page) ──
export const PHASES = [
    {
        key: 'discover',
        name: 'Discover',
        aim: 'Learn the game',
        // "How it feels" (blueprint p7), in plain words.
        feel: 'Soft balls, batting tees (a stand that holds the ball) and lots of hitting. At training the coach feeds every ball to the batter, and players bowl at targets, never at a batter. Fun comes first.',
        canDo: [
            'Hit the ball along the ground and stay balanced',
            'Bowl at the stumps with a straight arm',
        ],
    },
    {
        key: 'develop',
        name: 'Develop',
        aim: 'Learn to play',
        feel: 'A soft ball, or an Incrediball (a softer rubber cricket ball). At training the coach feeds every ball to the batter, and players start making choices after the ball is bowled. The score rewards a good choice, not only a good hit.',
        canDo: [
            'Choose to hit or block off the front foot',
            'Run in and bowl the same way, ball after ball',
        ],
    },
    {
        key: 'elevate',
        name: 'Elevate',
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
        next: 'Next phase, Develop: the full range of front-foot shots, and a run-up.',
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
        next: 'Next phase, Elevate: back-foot shots, playing spin, and bowling to a plan.',
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
        next: 'Alongside Junior Royals: Performance Squads, by invitation only, for players from age 10.',
        certificate: 'Congratulations, you’ve completed Elevate, and all three phases of Junior Royals.',
    },
};

// Alongside Junior Royals (blueprint as updated 9 Oct 2026): Performance Squads is BY
// INVITATION ONLY, with players eligible from age 10. Never promised.
export const AFTER = [
    { name: 'Performance Squads', ages: 'From 10', aim: 'Compete', note: 'Runs alongside Junior Royals. By invitation only, for players from age 10.' },
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

// ── Session times are set by age (Alex, 12 Oct 2026): 6:00pm is for players aged
// 7 to 9, 7:00pm is for players aged 10 to 12. The form works the time out from
// the date of birth (age on the day of the player's first session).
export const TIMES = [
    { value: '6pm', time: '6:00pm', min: 7, max: 9 },
    { value: '7pm', time: '7:00pm', min: 10, max: 12 },
];
export const timeForAge = (age) => TIMES.find((t) => age >= t.min && age <= t.max) || null;

// ── Example badges for each phase (Alex, 12 Oct 2026): "have the badges describe that
// phase … hover over the badge and it pops up some of the coaching points and the core
// lesson learned in that badge for it to be a pass … put the Develop and Elevate sample
// badges in there as well."
// These are the blueprint's own two "climbs" (Part IV §4 and §5): the same skill, one
// step harder in each phase, so nothing here is invented.
//   can   = the badge's "I can …" line, word for word.
//   earn  = the blueprint's "Coach sees" for that badge, in plain words.
//   point = the coaching point for a clip the blueprint lists for it (Appendix A).
//   cue   = that clip's cue.
// Develop and Elevate have only these examples so far: their full lists are not written.
export const SAMPLE_BADGES = {
    discover: [
        { name: 'Rock or Step', kind: 'bat', can: 'step or rock back to suit the ball', earn: 'A full ball or a high ball, in random order. Your player makes the right move with their feet.', point: 'Defend first. Then mix full balls and short balls.', cue: 'Full forward, short back' },
        { name: 'Length Ladder', kind: 'bowl', can: 'hit the stumps from near, middle and far', earn: 'Two balls from each of three marks. Your player hits the stumps, or the gate beside them, from every mark.', point: 'Give young bowlers one clear target: the base of off stump.', cue: 'Base of the stump' },
    ],
    develop: [
        { name: 'Forward or Back', kind: 'bat', can: 'go forward to the full one, back to the short one', earn: 'Balls of different lengths, in random order. Your player goes forward or back to suit each one.', point: 'Back and across to a rising ball, with the weight on the balls of the feet.', cue: 'Back and across' },
        { name: 'Length Box', kind: 'bowl', can: 'land it in the box off my run-up', earn: 'Off a run-up, your player lands the ball in the length box the coach calls.', point: 'Add the run-up without losing the action.', cue: 'Keeper’s gloves' },
    ],
    elevate: [
        { name: 'Pick the Length', kind: 'bat', can: 'pick the length and the shot', earn: 'Your player picks the length, chooses the shot and hits it into the gap.', point: 'Really move the feet back and across. Let the line choose punch or cut.', cue: 'Full forward, short back' },
        { name: 'Length on Demand', kind: 'bowl', can: 'bowl the length the coach calls', earn: 'From a full run-up, your player bowls the length the coach calls.' },
    ],
};

// ── Free come and try day (Alex, 12 Oct 2026): "register for free come and try
// day for the new program", Mickleham only. A family chooses one of two
// days; the time is set by the player's age, younger players first.
//   Monday:    5:00pm (aged 7 to 9), 6:00pm (aged 10 to 12)
//   Wednesday: 6:00pm (aged 7 to 9), 7:00pm (aged 10 to 12)
// ⚠️ To confirm with Alex: he said "choose a Monday or a Tuesday" and then gave the
// second day's times as "on Wednesday". Wednesday is used here. The date is to be
// confirmed, and the pop-up says so.
export const COME_AND_TRY = {
    centre: 'mickleham',
    ages: { min: 7, max: 12 },
    days: [
        { value: 'mon', label: 'Monday', times: [{ value: '5pm', time: '5:00pm', min: 7, max: 9 }, { value: '6pm', time: '6:00pm', min: 10, max: 12 }] },
        { value: 'wed', label: 'Wednesday', times: [{ value: '6pm', time: '6:00pm', min: 7, max: 9 }, { value: '7pm', time: '7:00pm', min: 10, max: 12 }] },
    ],
};
export const tryTime = (dayValue, age) =>
    COME_AND_TRY.days.find((d) => d.value === dayValue)?.times.find((t) => age >= t.min && age <= t.max) ?? null;

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


// ── The Royals Way pillars that shape a Junior Royals session ──
// Names are the Academy's LOCKED wording, quoted exactly (Royals Way – Head Coach
// Reference, Part 1; The Royals Way Coaching Bible, Part II; source check 11 Oct
// 2026). These are four of the Academy's seven pillars. They are the Melbourne
// Academy's own framework: the page says "built on The Royals Way" and never
// presents them as the franchise's official pillars.
export const PILLARS = [
    { name: 'Learn by Doing', note: 'Try it, make a mistake, learn from it, try again.' },
    { name: 'Play Bold', note: 'A brave, smart try is celebrated, even when it fails.' },
    { name: 'Joy, Curiosity & Lifelong Learning', note: 'The game stays fun, and minds stay open.' },
    { name: 'Fairness, Respect & Inclusion', note: 'Every player gets equal turns to bat and bowl.' },
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
    // Every phase has the same 28 (Alex, 12 Oct 2026: "every phase has an X number
    // of badges"). The blueprint awards 28 a year and gives Year 2 of a phase a
    // harder second stripe on the same badges, so a phase has 28 badges.
    perPhase: { batting: 12, bowling: 12, fielding: 4 },
    check: { good: 4, of: 6, nights: 2 },
    // Discover Year 1, ALL 28 badges in block order (blueprint p36–37): name + the
    // player's "I can…". Each has its own artwork: Alex's approved set (13 Oct 2026),
    // one file per badge, mapped in jrV2BadgeArt.js.
    discover: [
        { name: 'Two Vs', kind: 'bat', can: 'find my grip myself and hit it straight' },
        { name: 'Heel to Toe', kind: 'bat', can: 'hit along the ground and stay balanced' },
        { name: 'Through the Gate', kind: 'bat', can: 'swing straight through the gate' },
        { name: 'Bounce and Hit', kind: 'bat', can: 'hit the bouncing ball cleanly' },
        { name: 'Guard the Stumps', kind: 'bat', can: 'block it and save my stumps' },
        { name: 'Hit or Block', kind: 'bat', can: 'hit the full one, block the straight one' },
        { name: 'Rock Back', kind: 'bat', can: 'rock back and hit the high ball' },
        { name: 'Line Up, Hit', kind: 'bat', can: 'hit it to the side it’s bowled' },
        { name: 'Rock or Step', kind: 'bat', can: 'step or rock back to suit the ball' },
        { name: 'Call It', kind: 'bat', can: 'call YES, NO or WAIT, loud and early' },
        { name: 'Gap and Go', kind: 'bat', can: 'hit a gap and make my run' },
        { name: 'Chase Together', kind: 'bat', can: 'chase a score with my partner' },
        { name: 'Straight to the Target', kind: 'bowl', can: 'hold it in my fingers and bowl straight' },
        { name: 'Keeper’s Gloves', kind: 'bowl', can: 'walk in and bowl at the keeper’s gloves' },
        { name: 'Base of the Stump', kind: 'bowl', can: 'aim low and hit the stumps' },
        { name: 'Two the Same', kind: 'bowl', can: 'bowl two the same, in a row' },
        { name: 'Length Ladder', kind: 'bowl', can: 'hit the stumps from near, middle and far' },
        { name: 'Jog and Bowl', kind: 'bowl', can: 'jog in and still bowl straight' },
        { name: 'Seam Up', kind: 'bowl', can: 'bowl it straight with the seam up' },
        { name: 'One Stump', kind: 'bowl', can: 'hit one stump wherever it’s put' },
        { name: 'Beat the Bat', kind: 'bowl', can: 'beat the bat and hit the stumps' },
        { name: 'Tidy Over', kind: 'bowl', can: 'bowl an over of six straight' },
        { name: 'Partner’s Pick', kind: 'bowl', can: 'hit the target my partner picks' },
        { name: 'Last Over', kind: 'bowl', can: 'hit the stumps when it counts' },
        { name: 'Safe Hands', kind: 'field', can: 'catch a soft ball with either hand' },
        { name: 'Stump Hitter', kind: 'field', can: 'pick it up and hit the stumps' },
        { name: 'Back Me Up', kind: 'field', can: 'back up every throw' },
        { name: 'Run-out Ready', kind: 'field', can: 'throw at the stumps for a run-out' },
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

// ── Price (Alex, 9 Oct 2026; Andy, 19 Oct 2026 set it to the Stripe price): ONE
// price, $44.95 a week incl. GST, paid weekly in
// term as a term-based subscription. No group-size options, no bulk/prepay
// discounts. The player is enrolled for the whole term; the place rolls on each
// term until the family cancels. Lane size stays at the 5 Oct cap: 6 players
// (+1 some weeks making up a missed session).
export const PRICE = { perWeek: 44.95, perLane: LANE_MAX, max: LANE_MAX + 1 };
// Training shirt (Alex, 9 Oct 2026): compulsory, at the member price (shop price
// $62.95, src/components/academy-shop/shopConfig.js). No free-shirt offer
// (Andy, 19 Oct 2026: no reference to free shirts anywhere on the page).
export const SHIRT = { memberPrice: 29.95, shopPrice: 62.95 };
// Stripe payment links for Term 4, 2026 (Andy, 19 Oct 2026). Both add the
// training shirt at $29.95 and ask the family to pick their centre.
// weekly: $44.95 a week subscription. term: $349 one-off for the whole term.
export const PAY = {
    term: 'Term 4, 2026',
    weeklyUrl: 'https://buy.stripe.com/7sYeVd9zH3udgtSavV9Zm0X',
    upfrontUrl: 'https://buy.stripe.com/14A14n4fn3ud0uU7jJ9Zm0Y',
    upfront: 349,
};
export const NOTICE_WEEKS = 2;            // notice before the next term (Alex, 8 Oct 2026)
