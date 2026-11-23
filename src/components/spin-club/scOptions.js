// Every fact about Spin Club lives here, so the page and the form can never
// disagree with each other. Change a price or a time once, here.
//
// 23 Nov 2026: OFF SALE, registrations of interest only (see NEXT_PROGRAM below).

export const PROGRAM = {
    academy: 'Rajasthan Royals Academy Melbourne',
    name: 'Spin Club',
    day: 'Wednesday',
    time: '6:00–7:30pm',
    sessionLength: '1.5 hours',
    ages: '10 to 25',
};

// The first program ran Wednesdays 7 Oct – 25 Nov 2026 (8 nights). Dates for the next one
// are not set yet, so none are shown (23 Nov 2026).

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
            photo: '/assets/coach-callum-stow.jpg',
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
            photo: '/assets/coach-harkirat-bajwa.jpg',
            creds: ['Australia Under-19 World Cup squad', 'Youngest player picked', 'Fitzroy Doncaster'],
            line: 'Harkirat moved to Melbourne from India when he was seven and was bowling in the back yard not long after. At 17 he was the youngest player in Australia\u2019s Under-19 World Cup squad, and the only bottom-age player picked. He is an attacking off spinner who lives on his variations, and he plays his club cricket at Fitzroy Doncaster.',
        },
    },
];

// The headline, set by Alex 9 Oct 2026. "Give it a rip" is the standing tagline.
export const HEADLINE = {
    name: 'Spin Club',
    promise: 'Discover, Develop, Elevate',
    rip: 'Give it a rip!',
};

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

// OFF SALE (Andy, 23 Nov 2026): "remove the $60 a week … turning the entire page into a
// register here for the next program start … take it from sale to a registration process".
// The first block (Wednesdays 7 Oct – 25 Nov 2026, $60 incl. GST a night, Stripe link
// buy.stripe.com/cNi8wPh29ggZgtScE39Zm0V) has finished. The page now takes registrations
// of interest only: no price, no dates, no payment.
//
// BEFORE PUTTING IT BACK ON SALE: add the price and dates here, a payment step, the
// training-shirt step and the governance boxes (CLAUDE.md), and put SCForm.jsx back on
// PAID_SIGNUP_FORMS in src/lib/governance.test.ts.
export const NEXT_PROGRAM = {
    status: 'Registrations of interest open',
    line: 'Our first Spin Club program has finished. Register now and you hear about the next one first: the dates, the price and the places, before they go anywhere else.',
    short: 'Next program: register your interest',
};

export const SQUAD_NOTE = {
    members: 'Already in a Royals Academy Performance Squad? Register here too \u2014 your head coach will sort out your rate when the next program opens.',
    joiners: 'Not in a squad, and want to be?',
    linkLabel: 'See the Performance Squads',
    href: '/performance-squads',
};

// What every night gives you, whichever program you join.
export const INCLUDED = [
    ['An hour and a half on the floor', 'Every Wednesday night, 6:00 to 7:30pm.'],
    ['Two coaches in the room', 'Six players per coach, so you get looked at properly.'],
    ['Your own lane time', 'One lane for every six players, every night.'],
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
