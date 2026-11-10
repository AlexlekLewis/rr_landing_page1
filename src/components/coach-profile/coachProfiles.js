// ============================================================
// coachProfiles.js — content for the per-coach pages at /coaches/<slug>.
//
// Launch set (Alex, 3 Nov 2026): Ikroop Dhanoa, Alex Thornhill, Ritin Raman,
// Mihiraj Jayasekara. Every coach is a DEVELOPMENT COACH FIRST (the shared
// FIVE_AREAS block), then their own strengths.
//
// What lives here: words and photos only. Prices, free times, which centres a
// coach can be booked at, and whether they're bookable at all come from the
// booking system at run time (bookingClient.js). Never put a price here.
//
// Each strength carries a `focus` from the booking catalog (batting, pace, spin,
// keeping, allround). It decides the net the session needs (Build Plan §5.2),
// so it's what we pass to /book when the family picks that strength.
//
// DRAFT TEXT: strengths and intros are drafted from each coach's published bio.
// Each coach confirms their own page before it goes live (Build Plan §17.3).
// ============================================================

export const CENTRES = {
    mickleham: {
        slug: 'mickleham',
        name: 'Mickleham Indoor Sports Centre',
        short: 'Mickleham',
        address: '3 Eclipse Drive, Mickleham VIC 3064',
        region: 'Melbourne’s north',
    },
    'cranbourne-north': {
        slug: 'cranbourne-north',
        name: 'Elite Cricket Centre, Cranbourne North',
        short: 'Cranbourne North',
        address: '30 Medley Drive, Cranbourne North VIC 3977',
        region: 'South-East Melbourne',
    },
};

// The general half of every coach page (Alex, 2 Nov 2026). Same on every page.
// Not called "pillars": the Royals Way reference doc's seven pillars are values.
export const FIVE_AREAS = [
    {
        title: 'Technical',
        body: 'How the player bats, bowls, fields and keeps. Getting the basics right, then building a technique that holds up in a match.',
    },
    {
        title: 'Tactical',
        body: 'Reading the game. Knowing the match situation, the field and the opposition, and choosing the right option ball by ball.',
    },
    {
        title: 'Mental',
        body: 'Confidence, focus and routines. Backing your own game, staying calm under pressure and bouncing back after a bad day.',
    },
    {
        title: 'Career advice',
        body: 'Help with the player’s cricket decisions, such as which club and grade to play, when to try out for teams, and how to fit cricket around school.',
    },
    {
        title: 'The pathway',
        body: 'How the junior pathway works in Victoria, from club cricket to representative teams and Premier Cricket, and where the player is on it now. We’ll tell you honestly what the next step takes. Nobody can promise a selection, and we don’t.',
    },
];

const PREMIER_GLOSS = 'Victorian Premier Cricket, the top grade of club cricket in Victoria';

export const COACH_PROFILES = {
    'ikroop-dhanoa': {
        slug: 'ikroop-dhanoa',
        name: 'Ikroop Dhanoa',
        first: 'Ikroop',
        photo: '/assets/coaches/ikroop-dhanoa.jpg',
        photoPosition: '50% 22%',
        homeCentre: 'mickleham',
        roleStrengths: 'Leg spin, batting and T20 cricket',
        intro: `Ikroop coaches young cricketers to enjoy the game and get better at it. He bats in the First XI at Essendon in ${PREMIER_GLOSS}, and came through Victoria’s junior pathway to Under-19, so he knows what each next step takes.`,
        card: { strengths: 'Leg spin · batting · T20', cred: 'First XI batter at Essendon in Victorian Premier Cricket.' },
        strengths: [
            {
                key: 'leg-spin',
                title: 'Leg spin',
                focus: 'spin',
                figure: 'spin',
                description: 'Ikroop bowls leg spin in Premier Cricket and has every variation: the leg break, slider, top-spinner and wrong’un. He coaches the grip and action first, then how to change pace and length to control a batter, and when to bowl each variation.',
                goodFor: 'Spin bowlers at any level, and players who want to start bowling spin.',
                inSession: ['Grip, wrist and a repeatable action', 'Changing pace and length to control a batter', 'The variations, learned one at a time'],
            },
            {
                key: 'batting',
                title: 'Batting',
                focus: 'batting',
                figure: 'wagon',
                description: 'Ikroop is a First XI batter, and batting is what he knows best. He coaches all of it: a sound technique, scoring all the way around the ground, and hitting with power when the game needs it.',
                goodFor: 'Batters at any level, from a first season of club cricket to senior cricket.',
                inSession: ['Set-up, balance and watching the ball', 'Finding scoring areas against a real field', 'Power hitting, built up safely'],
            },
            {
                key: 't20-cricket',
                title: 'T20 cricket',
                focus: 'batting',
                figure: 'overs',
                description: 'Knowing what to do in each part of a T20 game: the six powerplay overs, the middle overs and the last five. Ikroop plays T20 at Premier level and coaches players to read the field, pick their moment and keep the scoreboard moving.',
                goodFor: 'Players aged 12 and over who play T20 matches.',
                inSession: ['A plan for the powerplay, middle and death overs', 'Reading the field before each ball', 'Rotating the strike when the boundaries dry up'],
            },
            {
                key: 'all-round-development',
                title: 'All-round development',
                focus: 'allround',
                figure: 'field',
                description: 'For younger players, and anyone not sure yet what to work on. Ikroop coaches Junior Royals, the Academy’s program for players aged 7 to 12, and works across batting, bowling and fielding to find what will help the player most.',
                goodFor: 'Players aged 7 to 12, and players in their first few seasons.',
                inSession: ['Batting, bowling and fielding, in games and challenges', 'Plenty of turns and very little waiting', 'Skills the player can take to club training'],
            },
        ],
        record: [
            {
                heading: 'As a player',
                items: [
                    { title: 'First XI batter, Essendon Cricket Club', detail: `Essendon plays in ${PREMIER_GLOSS}.` },
                    { title: 'Victorian pathway player up to Under-19', detail: 'Picked in Victoria’s junior pathway squads through the age groups to Under-19 level.' },
                ],
            },
            {
                heading: 'At the Academy',
                items: [
                    { title: 'Junior Royals coach, Mickleham', detail: 'The Academy’s weekly program for players aged 7 to 12.' },
                    { title: 'Power Game Pre-Season, 360° batting coach', detail: 'The Academy’s pre-season program for players aged 12 to 26.' },
                    { title: 'Performance Squad coach, Mickleham', detail: 'The Academy’s T20 squad, which trains each week and plays matches.' },
                ],
            },
        ],
        seo: {
            title: 'Ikroop Dhanoa · Cricket Coach, Mickleham, Melbourne',
            description: 'Private and small-group cricket coaching with Ikroop Dhanoa, an Essendon First XI batter, at the Rajasthan Royals Academy in Mickleham, Melbourne.',
        },
    },

    'alex-thornhill': {
        slug: 'alex-thornhill',
        name: 'Alex Thornhill',
        first: 'Alex',
        photo: '/assets/coaches/alex-thornhill.jpg',
        photoPosition: '50% 25%',
        homeCentre: 'cranbourne-north',
        roleStrengths: 'Batting',
        intro: 'Alex coaches young cricketers to enjoy the game and get better at it. He runs the Academy’s Cranbourne North centre and manages South-East Melbourne. A batting specialist, he has coached in the English county system and at Fitzroy Doncaster in Victorian Premier Cricket, and leads the cricket program at Xavier College.',
        card: { strengths: 'Batting', cred: 'Cranbourne North · South-East Manager. Has coached in the English county system.' },
        strengths: [
            {
                key: 'batting-technique',
                title: 'Batting technique',
                focus: 'batting',
                figure: 'wagon',
                description: 'The foundations every batter builds on: grip, stance, balance, watching the ball and playing straight. Alex is a batting specialist and gets the technique right first, so the player can score freely later.',
                goodFor: 'Batters at any level, and especially players in their first few seasons.',
                inSession: ['Grip, stance and balance', 'Playing straight, then scoring square', 'Footwork against pace and spin'],
            },
            {
                key: 'building-an-innings',
                title: 'Building an innings',
                focus: 'batting',
                figure: 'worm',
                description: 'Batting for longer: rotating the strike, choosing which balls to score from, and lifting the scoring rate at the right time. These are the skills that turn a start into a big score in club and school cricket.',
                goodFor: 'Batters aged 12 and over who get starts but get out.',
                inSession: ['Rotating the strike with singles', 'Picking the balls to score from', 'Batting to a target'],
            },
            {
                key: 'school-cricket',
                title: 'School cricket',
                focus: 'batting',
                figure: 'order',
                description: 'Alex leads the cricket program at Xavier College, so he knows school cricket well: what school coaches look for, and how players fit it around club cricket.',
                goodFor: 'Players at school, from junior teams to the First XI.',
                inSession: ['Skills for school and club matches', 'Preparing for the season', 'Fitting school and club cricket together'],
            },
        ],
        record: [
            {
                heading: 'At the Academy',
                items: [
                    { title: 'Cranbourne North · South-East Manager', detail: 'Runs the Academy’s Cranbourne North centre and its South-East Melbourne region.' },
                    { title: 'Elite Program coach', detail: 'Coaches in the Academy’s Elite Program for its most advanced players.' },
                ],
            },
            {
                heading: 'Outside the Academy',
                items: [
                    { title: 'Cricket program lead, Xavier College', detail: 'Leads the school’s cricket program.' },
                    { title: 'Coach, Fitzroy Doncaster Academy', detail: `Fitzroy Doncaster plays in ${PREMIER_GLOSS}.` },
                    { title: 'Coach in the English county system', detail: 'Coached in county cricket in England before moving to Melbourne.' },
                ],
            },
        ],
        seo: {
            title: 'Alex Thornhill · Cricket Coach, Cranbourne North, Melbourne',
            description: 'Private and small-group batting coaching with Alex Thornhill at the Rajasthan Royals Academy in Cranbourne North, South-East Melbourne.',
        },
    },

    'ritin-raman': {
        slug: 'ritin-raman',
        name: 'Ritin Raman',
        first: 'Ritin',
        // File keeps its old spelling; the name was corrected 3 Nov 2026.
        photo: '/assets/coaches/rittin-raman.jpg',
        photoPosition: '50% 22%',
        homeCentre: 'mickleham',
        roleStrengths: 'Wicketkeeping and top-order batting',
        intro: `Ritin coaches young cricketers to enjoy the game and get better at it. He is a top-order batter and wicketkeeper in the First XI at Melbourne Cricket Club, in ${PREMIER_GLOSS}, and has represented Victoria in the junior pathway.`,
        card: { strengths: 'Wicketkeeping · top-order batting', cred: 'Top-order batter and wicketkeeper in the First XI at Melbourne Cricket Club.' },
        strengths: [
            {
                key: 'wicketkeeping',
                title: 'Wicketkeeping',
                focus: 'keeping',
                figure: 'keeping',
                description: 'Ritin keeps wicket in Premier Cricket and coaches the whole job: footwork, catching cleanly, standing up to spin and back to pace, and taking the ball down the leg side.',
                goodFor: 'Keepers at any level, and players who want to try the gloves.',
                inSession: ['Stance, footwork and staying low', 'Standing up to spin and back to pace', 'Catching drills that build soft hands'],
            },
            {
                key: 'top-order-batting',
                title: 'Top-order batting',
                focus: 'batting',
                figure: 'order',
                description: 'Batting in the top three, where the new ball does the most. Ritin coaches how to start an innings: leaving well, playing late, and scoring in the powerplay without giving the bowler a chance.',
                goodFor: 'Batters who open or bat in the top order, or want to.',
                inSession: ['Playing the new ball and leaving well', 'Getting off the mark early', 'Scoring in the powerplay'],
            },
            {
                key: 'all-round-development',
                title: 'All-round development',
                focus: 'allround',
                figure: 'field',
                description: 'Ritin coaches Junior Royals, the Academy’s program for players aged 7 to 12. For younger players he works across batting, keeping and fielding to build the basics and keep the game fun.',
                goodFor: 'Players aged 7 to 12, and players in their first few seasons.',
                inSession: ['Batting, keeping and fielding, in games and challenges', 'Plenty of turns and very little waiting', 'Skills the player can take to club training'],
            },
        ],
        record: [
            {
                heading: 'As a player',
                items: [
                    { title: 'Top-order batter and wicketkeeper, Melbourne Cricket Club First XI', detail: `Melbourne Cricket Club plays in ${PREMIER_GLOSS}.` },
                    { title: 'State-level representative', detail: 'Has represented Victoria in the junior pathway.' },
                ],
            },
            {
                heading: 'At the Academy',
                items: [
                    { title: 'Junior Royals coach, Mickleham', detail: 'The Academy’s weekly program for players aged 7 to 12.' },
                    { title: 'Power Game Pre-Season, wicketkeeping coach', detail: 'The Academy’s pre-season program for players aged 12 to 26.' },
                ],
            },
        ],
        seo: {
            title: 'Ritin Raman · Wicketkeeping Coach, Mickleham, Melbourne',
            description: 'Private and small-group wicketkeeping and batting coaching with Ritin Raman, a Melbourne Cricket Club First XI keeper, at the Royals Academy, Mickleham.',
        },
    },

    'mihiraj-jayasekara': {
        slug: 'mihiraj-jayasekara',
        name: 'Mihiraj Jayasekara',
        first: 'Mihiraj',
        // Royals-kit headshot he sent on 29 Oct 2026, cut out and placed on the
        // Halla Bol media wall to match the other coaches (3 Nov 2026).
        photo: '/assets/coaches/mihiraj-jayasekara.jpg',
        initials: 'MJ',
        photoPosition: '50% 22%',
        homeCentre: 'mickleham',
        roleStrengths: 'Batting, one-on-one and in small groups',
        intro: 'Mihiraj coaches young cricketers to enjoy the game and get better at it. He has coached cricket for more than 25 years, in Sri Lanka, the UAE, India and now Melbourne, and is a batting coach first. He coached batting to the First XIs of two of Colombo’s leading cricket schools, then ran academies in the UAE and India.',
        quote: 'I have a very encouraging, firm and positive style of leadership, which helps get the best out of my players.',
        card: { strengths: 'Batting · small groups', cred: 'More than 25 years coaching batting in Sri Lanka, the UAE, India and Melbourne.' },
        strengths: [
            {
                key: 'batting-technique',
                title: 'Batting technique',
                focus: 'batting',
                figure: 'wagon',
                description: 'Mihiraj is a batting coach first. He builds a technique that holds up in a match: a balanced set-up, watching the ball, playing straight, and then adding shots around the ground.',
                goodFor: 'Batters at any level, from a first season to senior club cricket.',
                inSession: ['Set-up, balance and playing straight', 'Footwork against pace and spin', 'Adding scoring shots, one at a time'],
            },
            {
                key: 'small-group-batting',
                title: 'Small-group batting',
                focus: 'batting',
                figure: 'group',
                description: 'Batting in a group of 2 to 4 players, so each player gets plenty of balls and learns from watching the others. It costs less per player than one-on-one.',
                goodFor: 'Friends or teammates who want to train together.',
                inSession: ['Each player bats in turn on the same skill', 'Feedback for each player, every round', 'A batting game to finish'],
            },
            {
                key: 'club-batting',
                title: 'Batting for club cricket',
                focus: 'batting',
                figure: 'worm',
                description: 'Mihiraj coaches batting for the senior and developing players at Strathmore Cricket Club, and captains its Third XI. He coaches what club cricket asks of a batter: building an innings and batting to the match situation.',
                goodFor: 'Batters aged 14 and over who play junior or senior club cricket.',
                inSession: ['Building an innings', 'Batting to the match situation', 'Playing spin'],
            },
        ],
        record: [
            {
                heading: 'In Melbourne',
                items: [
                    { title: 'Batting coach, Third XI captain and curator, Strathmore Cricket Club', detail: 'In his first season at Strathmore (2026–27) he coaches batting for the club’s senior and developing players, captains the Third XI, and prepares its turf pitches.' },
                    { title: 'Coach and player, Knox, Plenty Valley and Greenvale', detail: 'Before Strathmore he coached and played at Knox (2023–24), Plenty Valley (2024–25) and Greenvale (2025–26), where he also captained the Third XI.' },
                ],
            },
            {
                heading: 'Before Melbourne',
                items: [
                    { title: 'Head coach, Desert Cubs Cricket Academy, UAE', detail: 'Head coach from 2021 to 2023, running the academy’s coaching staff and its batting programs, after two earlier years there (2015–17) as centre-in-charge and batting coach.' },
                    { title: 'Head coach, Sheen Sports Academy, Bangalore, India', detail: 'Ran the academy from 2018 to 2021, coaching developing and elite players and working with first-class cricketers on their batting.' },
                    { title: 'First XI batting coach at two Colombo cricket schools', detail: 'At St. Joseph’s College, Colombo (2003–09) and S. Thomas’ College, Mount Lavinia (2013–15). In Sri Lanka, school cricket is the main pathway into the national team.' },
                ],
            },
        ],
        seo: {
            title: 'Mihiraj Jayasekara · Batting Coach, Mickleham, Melbourne',
            description: 'Private and small-group batting coaching with Mihiraj Jayasekara, a batting coach of 25 years, at the Rajasthan Royals Academy in Mickleham, Melbourne.',
        },
    },
};

// Order used for the "Other Academy coaches" strip and the /coaches section.
export const COACH_ORDER = ['ikroop-dhanoa', 'alex-thornhill', 'ritin-raman', 'mihiraj-jayasekara'];

// Booking goal keys come from these published strengths; page copy is not an eligibility grant.
export const COACH_GOALS = Object.freeze(Object.fromEntries(COACH_ORDER.map(slug =>
    [slug, Object.freeze(COACH_PROFILES[slug].strengths.map(strength => strength.key))])));
export const COACH_GOAL_LABELS = Object.freeze(Object.fromEntries(COACH_ORDER.flatMap(slug =>
    COACH_PROFILES[slug].strengths.map(strength => [strength.key, strength.title]))));
