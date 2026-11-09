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
// Page order (Alex, 9 Nov 2026): sell the coach as a person and a coach first,
// then the offering, which is the same for every coach: one-on-one, or a small
// group of 2 to 4 players.
//
// Fields per coach:
//   heroLine   one sentence under the name in the hero (the coach's main credential)
//   intro      one paragraph. "About <first>" shows it when there's no `about` yet
//   about      OPTIONAL. Fills "About <first>", directly under the hero:
//                about: {
//                  player: ['paragraph', …],  // their cricket: role, skills, how they play and think about the game
//                  coach:  ['paragraph', …],  // how they coach, who they work with
//                  facts:  [{ label: 'Plays', value: 'First XI, Essendon (Victorian Premier Cricket)' }, …], // 3–5, shown beside the text
//                }
//              Any of the three can be left out. Plain text only (no HTML).
//   strengths  "Where <first> is strongest": 2 to 4 cards that describe the coach's skill set
//   record     "<first>'s cricket": playing and Academy record, shown at the end of About
//
// Each strength carries a `focus` from the booking catalog (batting, pace, spin,
// keeping, allround). The FIRST strength's focus goes to /book as `focus`,
// which decides the net the session needs (Build Plan §5.2). Order the
// strengths with the coach's main one first.
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
        // Text from Alex's answers (9 Nov 2026) and Ikroop's PlayCricket record.
        // Source notes: Master Landing Page/Coach Profiles/Ikroop Dhanoa - profile draft (9 Nov 2026).md
        heroLine: 'Leg-spinning all-rounder in Essendon’s First XI, captain of our Northern First XI and our Junior Royals development specialist.',
        intro: 'Ikroop coaches every level, from beginners aged 7 to players in the pathway, and specialises in spin bowling, batting and T20 cricket.',
        about: {
            player: [
                `Ikroop is a leg-spinning all-rounder in Essendon’s First XI in ${PREMIER_GLOSS}. He has played First XI cricket since December 2020, when he made his debut for Fitzroy Doncaster while still in the Ivanhoe Grammar First XI. He represented Victoria at the Under-15 and Under-19 National Championships.`,
                'He is an attacking white-ball leg spinner, and T20 is his favourite format. He controls batters by changing his pace and length, and he has every variation: the leg break, the slider, the top-spinner and the wrong’un (or googly, the ball that spins the opposite way), which is his wicket-taking ball.',
                'In one-day and T20 cricket, captains use him to slow the scoring and to win matches. In two-day cricket he holds an end with his leg break while bowling to attacking fields, building pressure over a long spell.',
                'With the bat he is busy and attacking. He looks for boundaries, scores in places bowlers don’t expect, and counterpunches when a bowler attacks him. His defence is strong too, so in two-day cricket he can bat for long periods when the team needs it. He made 75 for Essendon’s First XI last season.',
            ],
            coach: [
                'Ikroop is friendly and easy to talk to. He enjoys helping young players improve, and he makes sure they feel comfortable in his sessions. He coaches every level, from beginners aged 7 to players in the pathway at Under-18 and beyond. His specialties are batting and spin bowling, and he has a real passion for T20 cricket and power hitting.',
                'Inside the Royals he does four jobs. He captains the Academy’s Northern First XI, our First XI team in Melbourne’s north. He coaches in the Performance Squad, the Academy’s T20 squad program, and in the Academy’s Elite program. And he is the development specialist for Junior Royals, the Academy’s program for players aged 7–12.',
                'Outside the Academy he gives back to junior cricket. He is one of the coaches of Essendon’s Under-16 Dowling Shield squad, the Premier Cricket clubs’ junior pathway competition, and has helped with Plenty Valley’s JG Craig Shield program, an Under-15 competition. Having played Under-19 cricket for Victoria himself, he can tell a player and their family what each step of the pathway involves.',
                'He holds a Level 1 coaching accreditation, he is a Royals Level 1 coach (the Academy’s own coaching accreditation), and he has a Working With Children Check.',
            ],
            facts: [
                { label: 'Plays', value: 'First XI, Essendon (Victorian Premier Cricket)' },
                { label: 'Bowls', value: 'Leg spin, with every variation' },
                { label: 'Represented', value: 'Victoria, Under-15 and Under-19' },
                { label: 'At the Academy', value: 'Captain, Northern First XI · Junior Royals development specialist' },
                { label: 'Coaches', value: 'Beginners aged 7 to Under-18 and beyond' },
                { label: 'Accredited', value: 'Level 1 coach · Royals Level 1 · Working With Children Check' },
            ],
        },
        card: { strengths: 'Leg spin · batting · T20', cred: 'Leg-spinning all-rounder in Essendon’s First XI.' },
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
                description: 'Ikroop is a busy, attacking batter with a strong defence. He coaches defence and balance first, then scoring all the way around the ground and hitting with power, so players can attack without giving their wicket away.',
                goodFor: 'Batters at any level, from a first season of club cricket to senior cricket.',
                inSession: ['Defence, balance and watching the ball', 'Scoring in every direction', 'Power hitting, built up safely'],
            },
            {
                key: 't20-cricket',
                title: 'T20 cricket and power hitting',
                focus: 'batting',
                figure: 'overs',
                description: 'T20 (20-over) cricket is Ikroop’s favourite format. He coaches what to do in each part of a T20 game, with bat and ball: the six powerplay overs, the middle overs and the last five.',
                goodFor: 'Players aged 12 and over who play T20 matches.',
                inSession: ['A plan for each phase of the innings', 'Power hitting and finding the boundary', 'Bowling to a field to slow the scoring'],
            },
            {
                key: 'all-round-development',
                title: 'Beginners and all-round development',
                focus: 'allround',
                figure: 'field',
                description: 'For beginners from age 7, and anyone not sure yet what to work on. Ikroop coaches Junior Royals, the Academy’s program for players aged 7–12, and works across batting, bowling and fielding.',
                goodFor: 'Players aged 7–12, and players in their first few seasons.',
                inSession: ['Batting, bowling and fielding, in games and challenges', 'Plenty of turns and very little waiting', 'Skills the player can take to club training'],
            },
        ],
        record: [
            {
                heading: 'As a player',
                items: [
                    { title: 'First XI, Essendon Cricket Club (2025 to now)', detail: `Essendon plays in ${PREMIER_GLOSS}.` },
                    { title: 'First XI, Fitzroy Doncaster Cricket Club (2020–2025)', detail: 'Debut in December 2020, while still at school.' },
                    { title: 'Victoria, Under-15 and Under-19 National Championships', detail: 'The tournaments where each state’s best junior players play each other. Under-15 in 2018–19, and Under-19 in 2021–22 and 2022–23.' },
                    { title: 'Cricket Victoria Emerging Players Program', detail: 'Under-17 and Under-19: Cricket Victoria’s development squads for the state’s best young players.' },
                    { title: 'Melbourne Renegades Champions League, 2023', detail: '9 wickets in 5 T20 games.' },
                ],
            },
            {
                heading: 'As a coach',
                items: [
                    { title: 'Coach, Essendon Under-16 Dowling Shield squad', detail: 'The Premier Cricket clubs’ Under-16 pathway competition.' },
                    { title: 'Plenty Valley JG Craig Shield program', detail: 'The Under-15 competition for sub-district clubs.' },
                    { title: 'Captain, Academy Northern First XI', detail: 'The Academy’s First XI team in Melbourne’s north.' },
                    { title: 'Junior Royals development specialist', detail: 'The Academy’s program for players aged 7–12, at Mickleham.' },
                    { title: 'Coach, Performance Squad and Elite program', detail: 'The Academy’s T20 squad program, and its program for its most advanced players.' },
                    { title: 'Accreditation', detail: 'Level 1 coach, Royals Level 1 coach, and a Working With Children Check.' },
                ],
            },
        ],
        seo: {
            title: 'Ikroop Dhanoa · Cricket Coach, Mickleham, Melbourne',
            description: 'One-on-one and small private group coaching with Ikroop Dhanoa, a leg-spinning all-rounder in Essendon’s First XI, at the Royals Academy, Mickleham, Melbourne.',
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
        heroLine: 'Alex runs the Academy’s Cranbourne North centre. He is a batting specialist who has coached in the English county system.',
        intro: 'Alex coaches young cricketers to enjoy the game and get better at it. He runs the Academy’s Cranbourne North centre and manages South-East Melbourne. A batting specialist, he has coached in the English county system and at Fitzroy Doncaster in Victorian Premier Cricket. He also leads the cricket program at Xavier College.',
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
            description: 'One-on-one and small private group batting coaching with Alex Thornhill at the Rajasthan Royals Academy in Cranbourne North, South-East Melbourne.',
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
        heroLine: `Ritin is a top-order batter and wicketkeeper in the First XI at Melbourne Cricket Club, in ${PREMIER_GLOSS}.`,
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
                description: 'Ritin coaches Junior Royals, the Academy’s program for players aged 7–12. For younger players he works across batting, keeping and fielding to build the basics and keep the game fun.',
                goodFor: 'Players aged 7–12, and players in their first few seasons.',
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
                    { title: 'Junior Royals coach, Mickleham', detail: 'The Academy’s weekly program for players aged 7–12.' },
                    { title: 'Power Game Pre-Season, wicketkeeping coach', detail: 'The Academy’s pre-season program for players aged 12–26.' },
                ],
            },
        ],
        seo: {
            title: 'Ritin Raman · Wicketkeeping Coach, Mickleham, Melbourne',
            description: 'One-on-one and small private group keeping and batting coaching with Ritin Raman, Melbourne Cricket Club First XI keeper, at the Royals Academy, Mickleham.',
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
        roleStrengths: 'Batting, one-on-one and in small private groups',
        heroLine: 'Mihiraj has coached batting for more than 25 years, in Sri Lanka, the UAE, India and now Melbourne.',
        intro: 'Mihiraj coaches young cricketers to enjoy the game and get better at it. He has coached cricket for more than 25 years, in Sri Lanka, the UAE, India and now Melbourne, and is a batting coach first. He coached batting to the First XIs of two of Colombo’s leading cricket schools, then ran academies in the UAE and India.',
        quote: 'I have a very encouraging, firm and positive style of leadership, which helps get the best out of my players.',
        card: { strengths: 'Batting · small private groups', cred: 'More than 25 years coaching batting in Sri Lanka, the UAE, India and Melbourne.' },
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
                title: 'Small private group batting',
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
                    { title: 'Head coach, Sheen Sports Academy, Bangalore, India', detail: 'Ran the academy from 2018 to 2021, coaching developing players and working with first-class cricketers on their batting.' },
                    { title: 'First XI batting coach at two Colombo cricket schools', detail: 'At St. Joseph’s College, Colombo (2003–09) and S. Thomas’ College, Mount Lavinia (2013–15). In Sri Lanka, school cricket is the main pathway into the national team.' },
                ],
            },
        ],
        seo: {
            title: 'Mihiraj Jayasekara · Batting Coach, Mickleham, Melbourne',
            description: 'One-on-one and small private group batting coaching with Mihiraj Jayasekara, a batting coach for 25 years, at the Royals Academy in Mickleham, Melbourne.',
        },
    },
};

// Order used for the "Other Academy coaches" strip and the /coaches section.
export const COACH_ORDER = ['ikroop-dhanoa', 'alex-thornhill', 'ritin-raman', 'mihiraj-jayasekara'];
