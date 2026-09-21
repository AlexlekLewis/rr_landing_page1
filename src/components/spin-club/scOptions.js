// Every fact about Spin Club lives here, so the page and the form can never
// disagree with each other. Change a price or a time once, here.
//
// STILL TO CONFIRM (Alex, 21 Sep 2026): the start date, and how many places
// there are at each centre. Both are deliberately absent from the page rather
// than guessed — see START_DATE below.

export const PROGRAM = {
    academy: 'Rajasthan Royals Academy Melbourne',
    name: 'Spin Club',
    day: 'Wednesday',
    time: '7:00–8:30pm',
    sessionLength: '1.5 hours',
    ages: '10 to 25',
    weeks: 8,
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

// Priced by the hour (Alex, 21 Sep 2026): $30 an hour for Performance Squad
// members, $50 for everyone else, $60 for a one-off night. The session is
// 1.5 hours, so the per-night price is the hourly rate x 1.5, and the block
// price is that x 8 weeks.
export const PRICES = [
    {
        key: 'squad',
        label: 'Performance Squad members',
        perSession: '$45',
        perHour: '$30 an hour',
        block: '$360 for the 8 weeks',
        who: 'You are in a Royals Academy Performance Squad this season.',
    },
    {
        key: 'open',
        label: 'Everyone else',
        perSession: '$75',
        perHour: '$50 an hour',
        block: '$600 for the 8 weeks',
        who: 'Any spinner aged 10 to 25 who is offered a place.',
    },
    {
        key: 'single',
        label: 'A single night',
        perSession: '$90',
        perHour: '$60 an hour',
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
