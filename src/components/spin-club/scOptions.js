// Every fact about Spin Club lives here, so the page and the form can never
// disagree with each other. Change a price or a time once, here.
//
// STILL TO CONFIRM (Alex, 24 Sep 2026): the start date, and how many places
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
    totalHours: 12, // 8 nights x 1.5 hours
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

// Prices (Alex, 24 Sep 2026). Written the way a family reads them: the price
// for the whole block first, then what that works out at per night.
// Squad members are capped at $25 a night. Everyone else is $67.50 a night
// ($45/hr) and a one-off night is $97.50 ($65/hr).
export const PRICES = [
    {
        key: 'squad',
        question: 'In a Performance Squad?',
        headline: '$200',
        unit: 'for all 8 Wednesday nights',
        perNight: 'That works out at $25 a night.',
        who: 'You already train with us this season, so you pay the lower price.',
        feature: true,
    },
    {
        key: 'open',
        question: 'Not in a squad?',
        headline: '$540',
        unit: 'for all 8 Wednesday nights',
        perNight: 'That works out at $67.50 a night.',
        who: 'Open to any spinner aged 10 to 25 who is offered a place.',
    },
    {
        key: 'single',
        question: 'Just want to try one night?',
        headline: '$97.50',
        unit: 'for a single Wednesday',
        perNight: 'You pay for that night only.',
        who: 'Come once, when there is a spare place that week.',
    },
];

export const INCLUDED = [
    ['12 hours of coaching', '8 nights, an hour and a half each.'],
    ['Two coaches in the room', 'Six players per coach, so you get looked at properly.'],
    ['Your own lane time', 'One lane for every six players, every night.'],
];

export const HOW_PAYING_WORKS = [
    ['Register your interest', 'It costs nothing and holds no place.'],
    ['We pick the group', 'Your Royal Spin Coach chooses. Offers go out in two rounds.'],
    ['You say yes', 'Only then do we send you the payment details.'],
    ['You pay', 'For the 8 nights, or for a single night if that is what you picked.'],
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
