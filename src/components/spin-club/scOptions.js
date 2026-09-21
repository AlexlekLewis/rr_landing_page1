// Every fact about Spin Club lives here, so the page and the form can never
// disagree with each other. Change a price or a time once, here.
//
// STILL TO CONFIRM (Alex, 20 Sep 2026): the start date, and how many places
// there are at each centre. Both are deliberately absent from the page rather
// than guessed — see START_DATE below.

export const PROGRAM = {
    academy: 'Rajasthan Royals Academy Melbourne',
    name: 'Spin Club',
    day: 'Wednesday',
    time: '7:00–8:30pm',
    sessionLength: '1.5 hours',
    ages: '10 to 25',
    weeks: 6,
};

// Left null on purpose. When Alex confirms the first Wednesday, put it here as
// e.g. 'Wednesday 7 October' and the hero and details sections will show it.
export const START_DATE = null;

export const CLUBS = [
    {
        key: 'north',
        name: 'Spin Club North',
        region: "Melbourne's north",
        venue: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        coach: {
            name: 'Callum Stow',
            role: 'Royal Spin Coach — Spin Club North',
            spin: 'Left-arm wrist spin',
            line: 'Callum plays for the Melbourne Renegades in the Big Bash League, the San Francisco Unicorns in Major League Cricket, and Victoria.',
        },
    },
    {
        key: 'south',
        name: 'Spin Club South',
        region: "Melbourne's south-east",
        venue: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        coach: {
            name: 'Harkirat Bajwa',
            role: 'Royal Spin Coach — Spin Club South',
            spin: 'Off spin',
            line: 'Harkirat has played for the Australia Under-19s, and plays his club cricket at Fitzroy Doncaster.',
        },
    },
];

// Priced as a 6-week block (Alex, 21 Sep 2026). $450 is the full price; Performance
// Squad members take 20% off, which is $360. The per-night figures are the block
// divided by 6, and the per-hour figures are that divided by the 1.5-hour session.
export const PRICES = [
    {
        key: 'squad',
        label: 'Performance Squad members',
        perSession: '$60',
        perHour: '$40 an hour',
        block: '$360 for the 6 weeks',
        who: 'You are in a Royals Academy Performance Squad this season, which takes 20% off.',
    },
    {
        key: 'open',
        label: 'Everyone else',
        perSession: '$75',
        perHour: '$50 an hour',
        block: '$450 for the 6 weeks',
        who: 'Any spinner aged 10 to 25 who is selected.',
    },
    {
        key: 'single',
        label: 'A single night',
        perSession: '$82.50',
        perHour: '$55 an hour',
        block: 'Pay for one Wednesday at a time',
        who: 'Come for one session when there is a spare place that week.',
    },
];

export const SPIN_TYPES = [
    'Off spin',
    'Leg spin',
    'Left-arm orthodox',
    'Left-arm wrist spin',
    'I bowl some spin, not sure what it is called',
];

export const SQUAD_STATUS = [
    'Yes — I am in a Performance Squad',
    'No',
    'Not sure',
];
