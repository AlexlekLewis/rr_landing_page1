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
            // What he bowls himself. NOT what the centre takes — every type of
            // spin is welcome at both centres. See EVERY_SPIN below.
            spin: 'Left-arm wrist spin',
            line: 'Callum came out of Geelong Cricket Club and through Cricket Victoria\u2019s rookie program. He took nine wickets in five games for Victoria at the 2024 Global Super League in Guyana, then took a wicket on debut in the Big Bash and two against the Brisbane Heat in his next match. The Melbourne Renegades have re-signed him every season since, and he spent 2025 with the San Francisco Unicorns in Major League Cricket.',
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
            line: 'Harkirat moved to Melbourne from India when he was seven and was bowling in the back yard not long after. At 17 he was the youngest player in Australia\u2019s Under-19 World Cup squad, and the only bottom-age player picked. He is an attacking off spinner who lives on his variations, and he plays his club cricket at Fitzroy Doncaster.',
        },
    },
];

// Prices (Alex, 24 Sep 2026). Written the way a family reads them: the price
// for the whole block first, then what that works out at per night.
// Squad members are capped at $25 a night. Everyone else is $67.50 a night
// ($45/hr) and a one-off night is $97.50 ($65/hr).
// A Royal Spin Coach bowls one type of spin. The centre takes all of them.
// This line exists because "Off spin" under a venue name reads as a restriction.
export const EVERY_SPIN = {
    short: 'Every type of spin, at both centres',
    long: 'Both centres take every type of spin — off spin, leg spin, left-arm orthodox, left-arm wrist spin, and anyone still working out what it is they bowl. Your Royal Spin Coach bowls one of them. They coach all of them.',
};

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
