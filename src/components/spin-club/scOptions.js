// Every fact about Spin Club lives here, so the page and the form can never
// disagree with each other. Change a price or a time once, here.
//
// STILL TO CONFIRM (Alex, 27 Sep 2026): how many places there are at each
// centre. Deliberately absent from the page rather than guessed.

export const PROGRAM = {
    academy: 'Rajasthan Royals Academy Melbourne',
    name: 'Spin Club',
    day: 'Wednesday',
    time: '6:00–7:30pm',
    sessionLength: '1.5 hours',
    ages: '10 to 25',
    weeks: 8,
    totalHours: 12, // 8 nights x 1.5 hours
};

// Confirmed by Alex, 27 Sep 2026. 7 October 2026 is a Wednesday; eight weekly
// nights from there run to Wednesday 25 November.
export const START_DATE = 'Wednesday 7 October';
export const END_DATE = 'Wednesday 25 November';
export const NIGHTS = [
    '7 October', '14 October', '21 October', '28 October',
    '4 November', '11 November', '18 November', '25 November',
];

// Same eight nights with their dates attached, so the sign-up form can drop the
// ones that have already been played rather than offering a night in the past.
export const NIGHT_DATES = [
    { label: '7 October', iso: '2026-10-07' },
    { label: '14 October', iso: '2026-10-14' },
    { label: '21 October', iso: '2026-10-21' },
    { label: '28 October', iso: '2026-10-28' },
    { label: '4 November', iso: '2026-11-04' },
    { label: '11 November', iso: '2026-11-11' },
    { label: '18 November', iso: '2026-11-18' },
    { label: '25 November', iso: '2026-11-25' },
];

export const upcomingNights = (now = new Date()) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return NIGHT_DATES.filter((n) => {
        const [y, m, d] = n.iso.split('-').map(Number);
        return new Date(y, m - 1, d) >= today;
    });
};

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
            creds: ['Melbourne Renegades, Big Bash', 'Victoria', 'San Francisco Unicorns, MLC'],
            line: 'Callum started at Geelong Cricket Club and Victoria picked him up. He took nine wickets in five games for Victoria at the 2024 Global Super League in Guyana, then took a wicket on debut in the Big Bash and two against the Brisbane Heat in his next match. The Melbourne Renegades have re-signed him every season since, and he spent 2025 with the San Francisco Unicorns in Major League Cricket.',
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
            creds: ['Australia Under-19 World Cup squad', 'Youngest player picked', 'Fitzroy Doncaster'],
            line: 'Harkirat moved to Melbourne from India when he was seven and was bowling in the back yard not long after. At 17 he was the youngest player in Australia\u2019s Under-19 World Cup squad, and the only bottom-age player picked. He is an attacking off spinner who lives on his variations, and he plays his club cricket at Fitzroy Doncaster.',
        },
    },
];

// Alex created Spin Club and oversees both centres. Title per Alex, 9 Oct 2026.
export const FOUNDER = {
    name: 'Alex Lewis',
    role: 'Academy Head Coach',
    second: 'specialist spin bowling coach',
    line: 'Spin Club was built by Alex Lewis, Academy Head Coach and a specialist spin bowling coach, and he oversees both centres.',
};

// The three things every night works on. The sub-points are the ones Alex says
// most clubs never get to, and where a spinner improves fastest.
export const PILLARS = [
    {
        title: 'Technical',
        body: 'Your grip, your action, your release. The work that makes the ball spin hard and land where you meant it to.',
        points: ['A repeatable action under fatigue', 'A stock ball you trust', 'Variations that actually do something'],
    },
    {
        title: 'Tactical',
        body: 'Most spinners are never taught this part. It is where you can get better fastest.',
        points: [
            'Building a plan for a batter before you bowl',
            'Executing it when the game is moving',
            'Setting a field, and knowing why each one is there',
            'How the field changes between T20, one-day and two-day cricket',
        ],
    },
    {
        title: 'Mental',
        body: 'What you do after you get hit. Spin is the one job in cricket where doing it right can still cost you runs.',
        points: ['Staying in the over after a boundary', 'Judging a spell on more than the figures', 'Asking for the ball when it is hard'],
    },
];

// A Royal Spin Coach bowls one type of spin. The centre takes all of them.
// This line exists because "Off spin" under a venue name reads as a restriction.
export const EVERY_SPIN = {
    short: 'Every type of spin, at both centres',
    long: 'Both centres take every type of spin \u2014 off spin, leg spin, left-arm orthodox, left-arm wrist spin, and anyone still working out what it is they bowl. Your Royal Spin Coach bowls one of them. They coach all of them.',
};

// Prices. 9 Oct 2026: the 8-night block prices are WITHDRAWN. Spin Club sells
// one 1.5-hour Wednesday session at a time.
//
// Alex, 9 Oct 2026: "$60 including GST for 1.5 hours." So unlike every earlier
// Spin Club price, this one is GST-INCLUSIVE as stated — $60 is the total
// payable, and the ex-GST figure is $60 / 1.1 = $54.55.
//
// Performance Squad members do not buy from this page at all; their rate is
// arranged through their head coach.
export const GST_NOTE = 'Every price on this page includes GST.';

export const PRICES = [
    {
        key: 'single',
        question: 'One Wednesday night',
        headline: '$60',
        unit: 'for the 1.5-hour session',
        exGst: '$54.55 plus GST',
        perNight: 'You pay for the nights you come to, and nothing else.',
        who: 'Open to any spin bowler aged 10 to 25. Come to one night or come to all of them.',
        feature: true,
    },
];


// Verified against the live checkout on 9 Oct 2026: the product reads
// "Spin Club Session Price" and charges A$60.00, which matches PRICES above.
// Re-check this if the price on the page ever changes — a page and a checkout
// that disagree is the one thing we must never ship.
export const STRIPE_LINK = 'https://buy.stripe.com/cNi8wPh29ggZgtScE39Zm0V';

export const SQUAD_NOTE = {
    members: 'Already in a Royals Academy Performance Squad? Do not pay here \u2014 speak to your head coach directly and they will sort your rate out with you.',
    joiners: 'Not in a squad, and want to be?',
    linkLabel: 'See the Performance Squads',
    href: '/performance-squads',
};

export const INCLUDED = [
    ['12 hours of coaching', '8 nights, an hour and a half each.'],
    ['Two coaches in the room', 'Six players per coach, so you get looked at properly.'],
    ['Your own lane time', 'One lane for every six players, every night.'],
];

export const HOW_PAYING_WORKS = [
    ['Tell us who you are', 'Pick your centre and the Wednesday you want. It takes a minute.'],
    ['Pay for that night', 'The payment button comes up as soon as you have signed up.'],
    ['Turn up and bowl', 'We will have a lane and a coach ready for you.'],
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
