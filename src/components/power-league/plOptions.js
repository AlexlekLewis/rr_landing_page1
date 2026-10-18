// Every fact about the Power League nomination day lives here.
//
// Sources: the Performance Squads briefing (28 Sep 2026) for how Power League
// works, and Alex, 16 Oct and 19 Oct 2026, for this match day. 25 October 2026
// is a Sunday, which matches the standing "Power League runs on Sundays".
//
// Alex, 19 Oct 2026: an open invite for players 10 to 25, a 24-hour window to
// nominate, picked players told within the next 24 hours, one game on the
// Sunday fixtured for a 12pm or 3pm start depending on the fixture and the side,
// $35 per player for the game. Alex, later 19 Oct: the day runs 12pm to 7pm; make
// it clear they play WITH our Performance Squad players; it is a filmed event. The form asks for the weekend club, the highest
// level played on a weekend, name, date of birth and the usual consents.
//
// DATED CONTENT — REVIEW 26 Oct 2026: retire or repoint the page after the match.
// The form closes itself at `closesAt`; nothing else on the page changes date.

export const MATCH = {
    date: 'Sunday 25 October',
    time: '12pm to 7pm',
    starts: 'Games start at 12pm or 3pm',
    timeDetail: 'The match day runs from 12pm to 7pm. Each player plays one game, starting at 12pm or 3pm depending on the fixture and the side they are picked for. We tell you the start time when we tell you they are picked.',
    venues: ['Lower Plenty Cricket Club', 'Montmorency Cricket Club'],
    where: 'Montmorency Park, Montmorency',
    whereDetail: 'Lower Plenty and Montmorency cricket clubs’ grounds, both in Montmorency Park, north-east Melbourne',
    matches: 'One T20 game per player',
    fee: '$35 incl. GST',
    feeUnit: 'per player, for the game',
    ages: '10 to 25',
    ageOn: '2026-10-25',
    closes: 'Tuesday 20 October, 9pm',
    // 9pm Melbourne time (AEDT, UTC+11). The form stops taking nominations here.
    closesAt: '2026-10-20T21:00:00+11:00',
    notifyBy: 'Wednesday 21 October, 9pm',
};

export const nominationsClosed = (now = Date.now()) => now >= Date.parse(MATCH.closesAt);

// Age on match day, from a YYYY-MM-DD date of birth. Null if the date is not real.
export const ageOnMatchDay = (dob) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
    const [y, m, d] = dob.split('-').map(Number);
    const born = new Date(Date.UTC(y, m - 1, d));
    if (born.getUTCMonth() !== m - 1 || born.getUTCDate() !== d) return null;
    const [ay, am, ad] = MATCH.ageOn.split('-').map(Number);
    let age = ay - y;
    if (am < m || (am === m && ad < d)) age -= 1;
    return age;
};

// What happens after a nomination, in order. Shown on the page and echoed on
// the confirmation screen, so a family knows exactly when to expect a reply.
export const STEPS = [
    [`Nominate by ${MATCH.closes}`,
     'Fill in the form below. It takes about three minutes, and it closes at 9pm on Tuesday.'],
    [`Hear by ${MATCH.notifyBy}`,
     'We contact picked players by email or phone with their side, the ground and the start time. If you have not heard from us by then, the player has not been picked for this game.'],
    [`Pay ${MATCH.fee} for the game`,
     'Our message includes a link to pay. Paying confirms the player in the side. Nothing is paid before then.'],
    [`Play on ${MATCH.date}`,
     'The day runs 12pm to 7pm at Montmorency Park. Each player plays one T20 game with our Performance Squad players, starting at 12pm or 3pm. The game is filmed. We send what to bring and what to wear with the pick.'],
];

// From the Performance Squads briefing, 28 Sep 2026 (the first three), and
// Alex, 19 Oct 2026, for how this open game is picked.
export const WHAT_IS = [
    ['Matches, not trials',
     'Power League is the Performance Squads’ match program. It is T20 played to develop players, not to rank them — a place to take something you have been working on into a real game without being judged for it.'],
    ['Teams from inside the Academy, on purpose',
     'Sides play each other again and again. Repeat matchups force batters and bowlers to solve one another across games, and let the coaches curate who faces whom.'],
    ['Selection is developmental',
     'You might be given a dominant role or a supporting one. You might bat at four or five instead of opening, to get time against spin. The role is chosen for what it will teach you.'],
    ['How the sides for this game are picked',
     'Our coaches place nominated players into sides with our Performance Squad players, by age, role and the level they play on a weekend, so the players in each game are at a similar level. That is why the form asks for the club and the highest level played.'],
];

// The value offering, from rramelbourne.com/performance-squads.
export const SQUAD_GIVES = [
    ['Weekly squad training', 'Every week at your centre with your Head Coach and a dedicated squad coach.'],
    ['5 to 10 T20 match days', 'About one a month, September to April, in the Power League and showcase matches.'],
    ['Royals and guest coaches', 'Other Royals coaches and players join through the year, online and in person.'],
    ['Camps in Nagpur', 'Invitations to Royals-run camps at the Rajasthan Royals High Performance Centre.'],
    ['Train with Royals teams', 'Select players get the chance to train with Royals franchise teams.'],
    ['Global Royals fixtures', 'The chance to play in Global Royals Inter-Academy matches and tournaments.'],
];

export const PATHWAY = ['Paarl Royals, SA20', 'Barbados Royals', 'Royals HPC, Nagpur'];

export const WHO_FOR = [
    ['In the pathway, aiming at T20', 'Players in the junior age groups now, working towards a career in T20 cricket.'],
    ['Past the age groups, still chasing it', 'Players who have come through the juniors and are still seeking outstanding opportunities.'],
    ['Rebuilding a trajectory', 'Players who dropped out of the pathway through injury or other reasons, looking to reignite it.'],
    ['Built for the short format', 'Players whose skillset suits T20, whatever a selection panel has decided so far.'],
];

export const CENTRES = [
    { region: 'North Melbourne', venue: 'Mickleham Indoor Sports Centre', coach: 'Alex Lewis' },
    { region: 'South-East Melbourne', venue: 'Elite Cricket Centre, Cranbourne North', coach: 'Alex Thornhill' },
];

export const ROLES = [
    'Batter',
    'Top-order batter',
    'Wicketkeeper-batter',
    'Pace bowler',
    'Spin bowler',
    'Bowling all-rounder',
    'Batting all-rounder',
];

// Highest level played on a weekend. Plain Melbourne cricket terms, lowest to
// highest, so the coaches can sort the sheet by it. Saved to
// applications.experience_level as the label shown here.
export const LEVELS = [
    'Junior club cricket (Under 10 to Under 18)',
    'Junior representative cricket (association, regional or Premier Cricket junior teams)',
    'Senior club cricket, 3rd XI or below',
    'Senior club cricket, 1st or 2nd XI',
    'Premier Cricket, 3rd or 4th XI',
    'Premier Cricket, 1st or 2nd XI',
    'Victorian state pathway squad (Under 15 to Under 19)',
    'Not playing weekend cricket at the moment',
];
