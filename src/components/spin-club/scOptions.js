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
};

// ── WEEKLY SUBSCRIPTION (Alex, 27 Nov 2026) ─────────────────────────────────
// The first block (8 Wednesdays, 7 Oct – 25 Nov 2026) is finished. From here
// Spin Club runs every Wednesday as a weekly subscription that holds your spot,
// paused over the Christmas break.
//
// Dates confirmed by Alex, 27 Nov 2026: three Wednesdays before
// Christmas, the break, then back on 27 January. scOptions.test.ts checks every
// date is a Wednesday (the first draft's 3/10/17 Dec were Thursdays). Change
// them here and nowhere else — the hero, dates strip, form and break line all
// read this.
export const NIGHT_DATES = [
    { label: '2 December', iso: '2026-12-02' },
    { label: '9 December', iso: '2026-12-09' },
    { label: '16 December', iso: '2026-12-16' },
    { label: '27 January', iso: '2027-01-27' },
    { label: '3 February', iso: '2027-02-03' },
    { label: '10 February', iso: '2027-02-10' },
    { label: '17 February', iso: '2027-02-17' },
    { label: '24 February', iso: '2027-02-24' },
    { label: '3 March', iso: '2027-03-03' },
    { label: '10 March', iso: '2027-03-10' },
    { label: '17 March', iso: '2027-03-17' },
    { label: '24 March', iso: '2027-03-24' },
];
export const NIGHTS = NIGHT_DATES.map((n) => n.label);
export const START_DATE = `Wednesday ${NIGHT_DATES[0].label}`;
export const CHRISTMAS_BREAK = {
    lastNight: 'Wednesday 16 December',
    backOn: 'Wednesday 27 January',
    line: 'Paused over the Christmas break \u2014 after Wednesday 16 December, nothing is charged until Wednesday 27 January.',
};

// Upcoming nights only, so the form never offers a Wednesday that has passed.
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

// Price (Alex, 27 Nov 2026): "$60 per night" for everyone, as a weekly
// subscription. GST-INCLUSIVE — $60 is the total payable; ex-GST $54.55.
// Performance Squad members pay the same; there is no separate squad rate.
export const GST_NOTE = 'Every price on this page includes GST.';

export const PRICES = [
    {
        key: 'weekly',
        question: 'Weekly subscription',
        headline: '$60',
        unit: 'a week, for the 1.5-hour Wednesday session',
        exGst: '$54.55 plus GST',
        perNight: 'Your spot is held every Wednesday, for as long as you want it.',
        who: 'Open to any spin bowler aged 10 to 25.',
        feature: true,
    },
];

// The terms a parent needs before they subscribe. Every line is also in the
// form's tick-box, so nobody can say they were not told.
// "Email info@ to stop" confirmed by Alex, 27 Nov 2026.
export const SUBSCRIPTION_TERMS = [
    ['$60 every week', 'Charged on Wednesdays. It holds your spot, so it is charged whether or not you make it that night.'],
    ['Paused over Christmas', 'After Wednesday 16 December, nothing is charged until Wednesday 27 January.'],
    ['Stop any time', 'Email info@rramelbourne.com before a Wednesday and that week is not charged.'],
];

// The weekly subscription link (Alex's Stripe, 27 Nov 2026): product "Spin
// Club — Weekly Subscription", A$60.00 a week, GST included, asks for the
// player's name and the centre. The form appends client_reference_id (its own
// applications.id) and prefilled_email, so the webhook files the payment
// against this exact sign-up. Re-check the product if the price ever changes.
export const STRIPE_SUBSCRIPTION_LINK = 'https://buy.stripe.com/cNibJ1eU14yh91q47x9Zm12';

export const subscriptionCheckoutUrl = (applicationId, email) => {
    const url = new URL(STRIPE_SUBSCRIPTION_LINK);
    if (applicationId) url.searchParams.set('client_reference_id', applicationId);
    if (email) url.searchParams.set('prefilled_email', email);
    return url.toString();
};

export const SQUAD_NOTE = {
    joiners: 'Not in a Performance Squad, and want to be?',
    linkLabel: 'See the Performance Squads',
    href: '/performance-squads',
};

export const INCLUDED = [
    ['1.5 hours, every Wednesday', 'The same night and the same time, every week.'],
    ['A Royal Spin Coach', 'Callum Stow at Mickleham, Harkirat Bajwa at Cranbourne North.'],
    ['Small groups', 'One lane for every three bowlers, so you bowl most of the night.'],
];

export const HOW_PAYING_WORKS = [
    ['Tell us who you are', 'Pick your centre and your first Wednesday. It takes a minute.'],
    ['Start your subscription', '$60 a week, charged on Wednesdays. The payment button comes up as soon as you have signed up.'],
    ['Turn up and bowl', 'Your spot is held every week. We will have a lane and a coach ready for you.'],
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
