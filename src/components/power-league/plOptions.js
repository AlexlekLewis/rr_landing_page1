// Every fact about the Power League nomination day lives here.
//
// Sources: the Performance Squads briefing (28 Sep 2026) for how Power League
// works, and Alex, 16 Oct 2026, for this match day. 25 October 2026 is a Sunday,
// which matches the standing "Power League runs on Sundays".
//
// STILL TO CONFIRM (Alex, 16 Oct): the start time, the age band, and which
// ground hosts which match. The page says "to be confirmed" rather than guessing.

export const MATCH = {
    date: 'Sunday 25 October',
    time: 'Start time to be confirmed',
    venues: ['Lower Plenty Cricket Club', 'Montmorency Cricket Club'],
    matches: 'One match, possibly two',
    fee: '$35',
    feeUnit: 'per player, per game',
    ages: 'Open to players 10 to 25 — tell us the age and we will place them',
    closes: 'Tuesday 20 October',
    picked: 'Teams are picked on Tuesday night and everyone hears either way.',
};

// From the Performance Squads briefing, 28 Sep 2026.
export const WHAT_IS = [
    ['Matches, not trials',
     'Power League is the Performance Squads’ match program. It is T20 played to develop players, not to rank them — a place to take something you have been working on into a real game without being judged for it.'],
    ['Teams from inside the Academy, on purpose',
     'Sides play each other again and again. Repeat matchups force batters and bowlers to solve one another across games, and let the coaches curate who faces whom.'],
    ['Selection is developmental',
     'You might be given a dominant role or a supporting one. You might bat at four or five instead of opening, to get time against spin. The role is chosen for what it will teach you.'],
    ['You will get a game',
     'Every player in the program is guaranteed a match. Nominate and you are in the mix for this one.'],
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
