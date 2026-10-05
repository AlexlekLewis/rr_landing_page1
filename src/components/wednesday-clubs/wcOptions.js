// Batting Club and Keeping Club — the two Wednesday-night clubs that sit either
// side of Spin Club North at Mickleham. Same philosophy as Spin Club: player-led,
// small groups, every place offered by the coach, nothing to pay until you say yes.
// Every fact about both clubs lives here, so the pages and the forms can never
// disagree with each other. Change a price or a time once, here.
//
// SET 3 OCT 2026 FROM ALEX'S BRIEF ("Batting Club runs just before Spin Club;
// wicketkeeping runs at the same time as Spin Club"). Defaulted, for Alex to confirm:
//   - Mickleham only. Both coaches log their hours there, and Spin Club North is there.
//   - Batting Club 5:30–7:00pm, so it finishes as Spin Club (7:00–8:30pm) starts.
//   - Ages 10 to 25, 8 Wednesdays and the Spin Club prices.
//   - No start date. Until START_DATE is set the hero says "Registering interest now"
//     and the dates strip is hidden.
//
// COACH FACTS (Alex, 3 Oct 2026): both are pathway players who play First XI
// Premier Cricket, both have two years of coaching in development cricket, and both
// are active in their club's Dowling Shield program. Ikroop is a batting leg-spinner
// at Essendon; Rittin is a wicketkeeper-batter at Melbourne and is in the state
// under-age system now.
// Checked: Ikroop in Cricket Victoria's Vic Metro Under-19 emerging squads (2021-22,
// 2022-23) and bowling leg spin in Essendon's First XI match reports. Rittin has no
// public record to check against. The portal spells his name "Ritin"; the website
// and his headshot file say "Rittin". Confirm the spelling with him before print.

import { PROGRAM as SPIN_CLUB } from '../spin-club/scOptions';

export const VENUE = {
    name: 'Mickleham Indoor Sports Centre',
    suburb: 'Mickleham',
    region: "Melbourne's north",
};

const COACHES = {
    ikroop: {
        name: 'Ikroop Dhanoa',
        photo: '/assets/coaches/ikroop-dhanoa.jpg',
        plays: 'Batting leg-spinner · First XI, Essendon',
        line: 'Ikroop is a batting leg-spinner who plays First XI Premier Cricket for Essendon. He came through Cricket Victoria’s pathway and was picked in the Vic Metro Under-19 emerging squad two seasons running. He has two years of coaching in development cricket, is active in Essendon’s Dowling Shield program, and coaches 360 batting in our Power Game program: scoring all the way round the ground, with a plan for every bowler.',
    },
    rittin: {
        name: 'Rittin Raman',
        photo: '/assets/coaches/rittin-raman.jpg',
        plays: 'Wicketkeeper-batter · First XI, Melbourne',
        line: 'Rittin is a wicketkeeper-batter who plays First XI Premier Cricket for Melbourne, and he is in Cricket Victoria’s pathway now as a state under-age representative. He has two years of coaching in development cricket, is active in Melbourne’s Dowling Shield program, and coaches wicketkeeping in our Power Game program. He is still climbing the pathway himself, so the work he sets is the work he is doing.',
    },
};

// Same block length and prices as Spin Club, so a family doing two Wednesday
// clubs sees one set of numbers. Spin Club's figures and the GST reasoning are in
// ../spin-club/scOptions.js.
const WEEKS = 8;
const AGES = SPIN_CLUB.ages; // '10 to 25'

const pricesFor = (who) => [
    {
        key: 'squad',
        question: 'In a Performance Squad?',
        headline: '$220',
        unit: `for all ${WEEKS} Wednesday nights`,
        exGst: '$200 plus GST',
        nightly: '$27.50',
        perNight: 'That works out at $27.50 a night.',
        who: 'You already train with us this season, so you pay the lower price.',
        feature: true,
    },
    {
        key: 'open',
        question: 'Not in a squad?',
        headline: '$594',
        unit: `for all ${WEEKS} Wednesday nights`,
        exGst: '$540 plus GST',
        nightly: '$74.25',
        perNight: 'That works out at $74.25 a night.',
        who: `Open to any ${who} aged ${AGES} who is offered a place.`,
    },
    {
        key: 'single',
        question: 'Just want to try one night?',
        headline: '$107.25',
        unit: 'for a single Wednesday',
        exGst: '$97.50 plus GST',
        perNight: 'You pay for that night only.',
        who: 'Come once, when there is a spare place that week.',
    },
];

export const GST_NOTE = 'Every price on this page includes GST.';

export const SQUAD_STATUS = [
    'Yes — I am in a Performance Squad',
    'No',
    'Not sure',
];

export const BATTING_CLUB = {
    key: 'batting',
    route: '/batting-club',
    name: 'Batting Club',
    tagline: 'Take them on',
    player: 'batter',
    players: 'batters',
    coachTitle: 'Royal Batting Coach',
    ages: AGES,
    day: 'Wednesday',
    time: '5:30–7:00pm',
    sessionLength: '1.5 hours',
    weeks: WEEKS,
    hours: 12,
    startDate: null,
    nights: [],
    coaches: [COACHES.ikroop, COACHES.rittin],
    mentors: 'Ikroop Dhanoa and Rittin Raman',
    neighbour: 'Finishes at 7:00pm, just as Spin Club starts',

    hero: {
        lead: 'A group of batters, working the game out together.',
        body: [
            'A net gives you fifty balls and no consequences. A Saturday gives you one, and if it is the wrong one your day is over. Most batters are left to work out the gap between the two on their own. Batting Club is where you work it out with other batters.',
            'It is player-led. The batters bring the problems and drive the night, mentored by Ikroop Dhanoa and Rittin Raman, under Alex Lewis. The group is small, and every place is offered by the coach.',
        ],
        facts: [
            { title: `Ages ${AGES}`, detail: 'Batters at every standard of cricket' },
            { title: `${WEEKS} Wednesday nights`, detail: '5:30–7:00pm, straight before Spin Club' },
            { title: 'Mickleham', detail: 'Mickleham Indoor Sports Centre, in Melbourne’s north' },
        ],
    },

    why: {
        kicker: 'Why Batting Club exists',
        headline: ['The hardest part of batting', 'is that one ball can end your day'],
        body: [
            'You can hit it beautifully all week and get out first ball on Saturday. You can scratch around for forty and win the game. Most batters are left to sort that out on their own, in the car on the way home.',
            'Batting Club puts those problems in one room. Batters bring the innings they just had, and the group shares it, works on it and solves it together. That is the whole idea: a group of batters who explore the game with each other, rather than alone.',
            'It is deliberately player-led. The batters set what the night is about and the coaches support it, with Ikroop Dhanoa and Rittin Raman mentoring the group rather than feeding balls at it.',
        ],
        close: 'We want to change how batters prepare for games, and how we develop them, with a real balance between the technical work, the mental side and the tactical understanding.',
        aside: {
            title: 'Straight before Spin Club',
            body: 'Batting Club finishes at 7:00pm, just as Spin Club starts in the same centre. If you bat and bowl spin, you can do both on the same night.',
        },
    },

    pillars: [
        {
            title: 'Technical',
            body: 'Your set-up, your base and your hands. The work that lets you score all the way round the ground, against pace and against spin.',
        },
        {
            title: 'Mental',
            body: 'Starting an innings, getting through a tough spell, and getting out and coming back. Batting is the one job in cricket where one mistake ends it, so we train how you handle that.',
        },
        {
            title: 'Tactical',
            body: 'Reading the field, picking which bowler to take on, and batting to the game in front of you rather than the one you wanted.',
        },
    ],

    night: [
        ['Talk', 'Your last innings: how you scored, and how you got out.'],
        ['The skill', 'One thing about your set-up, your movement or your shots, worked on properly.'],
        ['The challenge', 'A game situation to beat, like runs off an over or a field to score through, with a coach taking one batter aside at a time.'],
        ['The game', 'Batting against real bowling, with runs that count and outs that end your turn.'],
    ],

    coachesSection: {
        kicker: 'Your two coaches',
        headline: 'Mentored by Ikroop and Rittin',
        intro: 'Ikroop and Rittin are both First XI Premier cricketers who came through Cricket Victoria’s pathway, or are in it now. They mentor the group and pick it, and they share the room, six batters each, so every batter gets looked at properly.',
    },

    prices: pricesFor('batter'),
    included: [
        ['12 hours of coaching', '8 nights, an hour and a half each.'],
        ['Two coaches in the room', 'Six batters per coach, so you get looked at properly.'],
        ['Your own lane time', 'One lane for every six batters, every night.'],
    ],

    form: {
        headline: 'Tell us about your batting',
        roleLabel: 'Where do you bat?',
        roleOptions: [
            'Opener',
            'Top order (3 or 4)',
            'Middle order',
            'Lower order',
            'Not sure yet',
        ],
        rolePrompt: 'Please tell us where you bat.',
        notesPlaceholder: 'How you usually get out, what you want to get better at, or a night you cannot make.',
        intentWhy: 'We ask because places are limited, and a place held by someone who won’t use it is a place another batter missed out on.',
    },

};

export const KEEPING_CLUB = {
    key: 'keeping',
    route: '/keeping-club',
    name: 'Keeping Club',
    tagline: 'In every ball',
    player: 'keeper',
    players: 'keepers',
    coachTitle: 'Royal Keeping Coach',
    ages: AGES,
    day: 'Wednesday',
    time: SPIN_CLUB.time, // the same 7:00–8:30pm as Spin Club, on purpose
    sessionLength: '1.5 hours',
    weeks: WEEKS,
    hours: 12,
    startDate: null,
    nights: [],
    coaches: [COACHES.rittin],
    mentors: 'Rittin Raman',
    neighbour: 'Runs alongside Spin Club, in the same centre',

    hero: {
        lead: 'A group of keepers, working the game out together.',
        body: [
            'The keeper is the only player on the field who is in every ball. It is also the job that gets the least coaching. Keeping Club is where keepers work on their game with other keepers.',
            'It is player-led. The keepers bring the problems and drive the night, mentored by Rittin Raman, under Alex Lewis. It runs at the same time as Spin Club, so there are spinners to keep to. The group is small, and every place is offered by the coach.',
        ],
        facts: [
            { title: `Ages ${AGES}`, detail: 'Wicketkeepers at every standard of cricket' },
            { title: `${WEEKS} Wednesday nights`, detail: `${SPIN_CLUB.time}, alongside Spin Club` },
            { title: 'Mickleham', detail: 'Mickleham Indoor Sports Centre, in Melbourne’s north' },
        ],
    },

    why: {
        kicker: 'Why Keeping Club exists',
        headline: ['The keeper is in every ball,', 'so keepers get a night of their own'],
        body: [
            'Every ball of every game ends in the keeper’s gloves or goes past them. Yet at most training nights the keeper pads up to bat, or stands in a net with nobody to keep to. Most keepers are left to work their game out on their own.',
            'Keeping Club gives keepers their own night and their own group. Keepers bring the game they just had, and the group shares it, works on it and solves it together.',
            'It is deliberately player-led. The keepers set what the night is about, with Rittin Raman mentoring the group rather than running drills at it.',
        ],
        close: 'We want to change how keepers prepare for games, and how we develop them, with a real balance between the technical work, the mental side and the tactical understanding.',
        aside: {
            title: 'Alongside Spin Club',
            body: 'Keeping Club runs at the same time as Spin Club, in the same centre. Keepers get spinners to keep to, and spinners get a keeper behind the stumps. That is how it is on a Saturday.',
        },
    },

    pillars: [
        {
            title: 'Technical',
            body: 'Your stance, your footwork and your hands. Taking the ball cleanly standing back to pace, and standing up to the stumps for spin.',
        },
        {
            title: 'Mental',
            body: 'Staying switched on for every ball of a long day, and moving on from the one you dropped. We train how you handle both.',
        },
        {
            title: 'Tactical',
            body: 'Reading the spinner from behind the stumps, working the batter out with your bowler, and being the voice your captain listens to.',
        },
    ],

    night: [
        ['Talk', 'Your last game: the takes, the misses, and what you saw from behind the stumps.'],
        ['The skill', 'Footwork and glove work, worked on properly.'],
        ['The challenge', 'Keeping to spinners, standing up to the stumps, with your Royal Keeping Coach working with one keeper at a time.'],
        ['The game', 'Keeping in live play, where byes, catches and stumpings count.'],
    ],

    coachesSection: {
        kicker: 'Your coach',
        headline: 'Mentored by Rittin',
        intro: 'Rittin is a specialist wicketkeeper-batter who plays First XI Premier Cricket and is in Cricket Victoria’s pathway now. He mentors the group and picks it. Keeping Club shares the centre with Spin Club, so there are always other Academy coaches on the floor.',
    },

    prices: pricesFor('wicketkeeper'),
    included: [
        ['12 hours of coaching', '8 nights, an hour and a half each.'],
        ['A specialist keeping coach', 'Rittin works with one keeper at a time inside a small group.'],
        ['Spinners to keep to', 'It runs alongside Spin Club, so you keep to real spin bowling.'],
    ],

    form: {
        headline: 'Tell us about your keeping',
        roleLabel: 'How much do you keep?',
        roleOptions: [
            'I keep every week',
            'I keep some games',
            'I want to start keeping',
        ],
        rolePrompt: 'Please tell us how much you keep.',
        notesPlaceholder: 'What you find hardest behind the stumps, what you want to get better at, or a night you cannot make.',
        intentWhy: 'We ask because places are limited, and a place held by someone who won’t use it is a place another keeper missed out on.',
    },

};

export const HOW_PAYING_WORKS = [
    ['Register your interest', 'It costs nothing and holds no place.'],
    ['We pick the group', 'Your coach chooses. Offers go out in two rounds.'],
    ['You say yes', 'Only then do we send you the payment details.'],
    ['You pay', 'For the 8 nights, or for a single night if that is what you picked.'],
];
