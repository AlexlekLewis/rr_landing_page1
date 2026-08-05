// ---------------------------------------------------------------------------
// India Tour 2026 — page copy, in two reading levels.
//
//   simple   : *** THE LIVE COPY — Alex picked this one, 5 Aug 2026. ***
//              Written so a 10-year-old can read it and a busy parent can scan
//              it in about twenty seconds. Short sentences, one idea each,
//              common words, the point first. Same facts, same value — only
//              the language changes. Nothing is dumbed down or dropped.
//   standard : the club voice. Full sentences, adult reader. Kept for
//              comparison and in case we want it back.
//
// The public URL with no parameter gets `simple`. ?read=standard shows the club
// voice; ?read=simple forces simple. When either parameter is present a small
// toggle appears so the two can still be compared side by side.
//
// PRICES LIVE HERE ONCE. Both variants and the form read them, so a price can
// never be updated in one place and stale in another.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';

export const TIER_KEYS = ['royals_program', 'external'];

export const TIER_PRICES = {
    royals_program: 2100,
    external: 2700,
};

// Rough return airfare per player, as a RANGE (Alex, 5 Aug 2026: "between
// fifteen hundred and two thousand"). Set to null to go back to the page saying
// it will be confirmed later. It is always presented as an estimate, never as a
// quote — the real figure lands with the group booking link.
export const FLIGHT_ESTIMATE_AUD = { min: 1500, max: 2000 };

// NOTE: there is deliberately no deposit here. Players pay their high
// performance costs ($2,100 / $2,700) IN FULL UP FRONT once a place is
// confirmed. Flights are paid separately via the group booking link when that
// is sorted. Do not reintroduce deposit language on this page.

// Registrations close seven days after going live (Alex, 5 Aug 2026: "we're gonna
// close it in seven days"). Melbourne time, end of day. CHANGE THIS ONE LINE to
// move or extend the deadline — the hero clock, the form and the closed state all
// read from it.
export const REGISTRATIONS_CLOSE_AT = '2026-08-12T23:59:00+10:00';

// The official camp document, served from /public. Size is stated on the page —
// it is a 26 MB export, which is a lot on mobile data, so nobody should be
// ambushed by it. (A lighter Canva export would fix that at source.)
export const CAMP_PDF = {
    href: '/rra-high-performance-camp-2026.pdf',
    filename: 'RRA High Performance Camp 2026.pdf',
    sizeLabel: '26 MB',
};

// Players the Rajasthan Royals High Performance Centre is documented as having
// developed. Samson / Jaiswal / Jurel / Parag are sourced to Forbes India's
// reporting on the centre; Sooryavanshi and Pretorius come from the camp document.
// Do NOT add a name here without a source — this is public, about real people.
export const PRODUCED_HERE = [
    { name: 'Sanju Samson', note: 'India international · Royals captain' },
    { name: 'Yashasvi Jaiswal', note: 'India Test opener' },
    { name: 'Dhruv Jurel', note: 'India wicketkeeper-batter' },
    { name: 'Riyan Parag', note: 'India international' },
    { name: 'Vaibhav Sooryavanshi', note: 'trains at the centre today' },
    { name: 'Luhan-dre Pretorius', note: 'Royals top order' },
];

export const fmtAUD = (n) => `$${Number(n).toLocaleString('en-AU')}`;
// "$1,500–$2,000" — en dash, both sides signed so neither number reads as a total.
export const fmtRangeAUD = (r) => `${fmtAUD(r.min)}–${fmtAUD(r.max)}`;

// --- standard -------------------------------------------------------------

const STANDARD = {
    hero: {
        badge: 'The First Australian Squad · Limited Places',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy',
        dateline: '19–26 September 2026 · Nagpur, India',
        lead:
            'Six days inside the Rajasthan Royals\' talent factory in Nagpur — the franchise\'s own High ' +
            'Performance Centre, and the place that built the games of Sanju Samson, Yashasvi Jaiswal, ' +
            'Dhruv Jurel and Riyan Parag. It is where Vaibhav Sooryavanshi trains today, alongside the ' +
            'coach who is his legal guardian. Every session is taken by the Royals\' own high performance ' +
            'staff. No Australian squad has trained here before, and places are capped.',
        costLabel: 'What it costs — per player',
        flights:
            'We book the whole squad on the same flights and send you a group booking link to pay for ' +
            'your own player\'s seat.',
        flightsLead: 'Flights are not included in either price.',
        // Rendered only when FLIGHT_ESTIMATE_AUD is set.
        flightsEstimate: (r) => `Allow roughly ${fmtRangeAUD(r)} per player on top for the return airfare.`,
        seeIncluded: "See exactly what's included",
        downloadLabel: 'Download the camp document',
        downloadSub: (size) => `PDF, ${size} — the full programme, coaches and itinerary`,
        cta: 'Register Your Interest',
        countdownLabel: 'Registrations close in',
        countdownUnits: { days: 'Days', hours: 'Hrs', minutes: 'Mins', seconds: 'Secs' },
        countdownNote:
            'Once the clock runs out we close the list and our coaches pick the touring squad from ' +
            'everyone who registered.',
        ctaAfterCoaches: {
            heading: 'Six days with these coaches',
            body: 'Places are limited and the squad is confirmed by our coaches. Registering costs nothing and takes about two minutes.',
        },
        ctaAfterPricing: {
            heading: 'Ready to put your player forward?',
            body: 'Register your interest and we will come back to you in writing with your price, your place, and the flight booking link.',
        },
        countdownClosed: 'Registrations for the India Tour 2026 have now closed.',
        countdownClosedNote:
            'If you still want to be considered, email info@rramelbourne.com and we will tell you ' +
            'whether any places are left.',
    },

    about: {
        eyebrow: 'Why This Is Rare',
        heading: 'The Royals\'',
        headingAccent: 'Talent Factory',
        lead:
            'Academies run tours. Almost none of them get inside the building an IPL franchise actually ' +
            'uses. This September a Rajasthan Royals Academy Melbourne squad spends seven nights at the ' +
            'Royals\' High Performance Centre in Nagpur — six full coaching days, taken by the club\'s own ' +
            'high performance staff. It is the first time an Australian group has been brought in.',
        producedHereLabel: 'Built at this centre',
        points: [
            {
                title: 'A factory with a record',
                body:
                    'This is the Royals\' own centre, used by their contracted players — not a facility ' +
                    'booked for the week. Sanju Samson, Yashasvi Jaiswal, Dhruv Jurel and Riyan Parag all ' +
                    'rebuilt their games here before playing for India.',
            },
            {
                title: 'The club\'s coaches, not ours',
                body:
                    'The Rajasthan Royals team manager. A former India international and Ranji ' +
                    'Trophy-winning captain. The centre\'s resident fast bowling coach. The Royals\' ' +
                    'performance psychologist. These are the people who coach the club\'s own players.',
            },
            {
                title: 'A first, and a small one',
                body:
                    'No Australian squad has done this before, and the group is deliberately small so ' +
                    'every player gets seen. Anyone can register; our coaches confirm the squad. ' +
                    'Registering early gives you the best chance.',
            },
        ],
    },

    pricing: {
        eyebrow: 'What It Costs',
        heading: 'Two Prices —',
        headingAccent: "Here's Yours",
        intro:
            'There are two prices for this tour, and which one applies to you depends on one thing ' +
            'only: whether your player already trains in a Rajasthan Royals Academy Melbourne program. ' +
            'Players already with us pay the lower of the two, because they pay into the academy across ' +
            'the year.',
        introEmphasis: 'Both groups do exactly the same camp',
        introTail:
            '— same accommodation, same IPL coaching staff, same sessions, same analysis. Nobody gets a ' +
            'lesser version. What you are buying is not a camp fee; it is six days of access to a place ' +
            'and a group of coaches that are otherwise closed.',
        notSure:
            'Not sure which one you are? Tell us in the form below and we will confirm your price in ' +
            'writing before you pay anything.',
        tiers: {
            royals_program: {
                eyebrow: 'For players already with us',
                heading: 'RRA Program Player',
                heroWho: 'If your player already trains in one of our programs',
                who:
                    'Your player is currently training in a Rajasthan Royals Academy Melbourne program — ' +
                    'Junior Royals, the Academy Elite Program, or Power Pre-Season.',
            },
            external: {
                eyebrow: 'For players joining us for the tour',
                heading: 'New To The Academy',
                heroWho: 'If your player is new to the academy',
                who:
                    'Your player does not currently train in one of our programs. They join the touring ' +
                    'squad for the camp and train alongside our program players.',
            },
        },
        priceNote:
            'That is the total program fee — there is no tax or booking fee added on top. It is paid in ' +
            'full, up front, once your player\'s place is confirmed. Flights are separate and are ' +
            'explained below.',
        perPlayer: 'per player, including GST',
        thisIsYou: 'This is you if…',

        flightsEyebrow: 'On Top Of The Program Fee',
        flightsHeading: 'Flights To India',
        flightsBody1:
            'We want the whole squad on the same flights, arriving and leaving together, so we book the ' +
            'group ourselves and then send you a group booking link. You use that link to pay for your ' +
            'own player\'s seat directly — the money does not come to us, and you are not left hunting ' +
            'for flights on your own.',
        flightsBody2Unknown:
            'We will confirm the exact return airfare, per player, at the same time as we send the group ' +
            'booking link — so you will have the real number in front of you before you commit to it.',
        flightsBody2Known: (r) =>
            `As a guide, budget ${fmtRangeAUD(r)} per player for the return airfare between Melbourne ` +
            'and Nagpur. That is an estimate, not a quote — airfares move, and we confirm the exact ' +
            'figure when the group booking link goes out.',
        flightsBody3:
            'So your total outlay for the tour is the program fee above plus the airfare, and then the ' +
            'few personal items listed under "what it does not cover". There is nothing else coming from us.',


        pillarsEyebrow: 'Beyond The Boundary',
        pillarsHeading: 'The Pro-Athlete',
        pillarsHeadingAccent: 'Support System',
        pillarsLead:
            'A professional set-up does not just coach your batting. Four things are worked on at the ' +
            'centre, every day, alongside the cricket.',
        pillars: [
            { title: 'Physical', body: 'Strength and conditioning, injury management, and physio-led rehabilitation fundamentals.' },
            { title: 'Mental', body: 'Focus, resilience, and handling match-day pressure under competitive stress.' },
            { title: 'Nutritional', body: 'Professional education on hydration, pre-game fuelling and recovery diets.' },
            { title: 'Tactical', body: 'Video analysis, player evaluation and individual tactical feedback.' },
        ],

        itineraryEyebrow: 'Day By Day',
        itineraryHeading: 'What The Week',
        itineraryHeadingAccent: 'Actually Looks Like',
        itineraryLead:
            'Six full coaching days between arrival and departure. Mornings build the skill, afternoons ' +
            'apply it, and the evenings cover the things that keep a player on the field.',
        itineraryDays: [
            { when: 'Sat 19 Sep', title: 'Arrival', body: 'You land in Nagpur, get picked up, and settle in at the centre. Welcome and orientation.' },
            { when: 'Sun 20 Sep', title: 'Day 1 — Foundation', body: 'Morning: performance testing (speed, agility, coordination) and a skill assessment across batting, bowling and fielding. Afternoon: player evaluation and video analysis, one-on-one with a coach. Evening: physio-led injury management.' },
            { when: 'Mon 21 Sep', title: 'Day 2 — Nets & Skill', body: 'Morning: technical batting and bowling drills, plus core fielding. Afternoon: extended net sessions against varied bowling. Evening: mental strength session one — focus, confidence and handling pressure.' },
            { when: 'Tue 22 Sep', title: 'Day 3 — Centre Wicket', body: 'Morning: warm-up, skill reinforcement and match-situation fielding. Afternoon: structured centre-wicket practice in a game-like environment. Evening: nutrition and hydration.' },
            { when: 'Wed 23 Sep', title: 'Day 4 — Centre Wicket', body: 'A second full day in the middle, building on day three under direct coach guidance.' },
            { when: 'Thu 24 Sep', title: 'Day 5 — Match Day', body: 'Morning: a practice match on turf wickets. Afternoon: post-match feedback and skill work. Evening: mental strength session two — game pressure and decision-making.' },
            { when: 'Fri 25 Sep', title: 'Day 6 — Closing & Evaluation', body: 'Morning: a light optional net session. Afternoon: group reflection and your individual development plan. Evening: closing huddle.' },
            { when: 'Sat 26 Sep', title: 'Departure', body: 'Farewell and transfer back to Nagpur airport for the flight home.' },
        ],
        includedHeading: 'What your fee covers',
        includedNote: 'Identical for both prices. Once you are in Nagpur, everything below is already paid for.',
        included: [
            {
                title: 'Seven nights inside the Royals HPC',
                body:
                    'Shared air-conditioned rooms inside the Rajasthan Royals High Performance Centre in ' +
                    'Nagpur. You fly in on Saturday 19 September, train across six full camp days from the ' +
                    '20th to the 25th, and fly home on Saturday 26 September 2026.',
            },
            {
                title: 'All meals, every day',
                body:
                    'Breakfast, lunch, evening refreshments and dinner, plus drinking water and sports ' +
                    'drinks. You do not need to budget for food while you are there.',
            },
            {
                title: 'Six full days of coaching',
                body:
                    'Turf nets, centre-wicket practice, a practice match on turf, and full use of the ' +
                    'training grounds, gym and indoor facilities.',
            },
            {
                title: 'The resident Royals coaching team',
                body:
                    'Sid Lahiri, Head of Global Academies and a Royals performance coach, leads the camp. ' +
                    'Batting and leadership with Romi Bhinder — the Rajasthan Royals team manager, who ' +
                    'lives at the centre and trains the Royals players there all year round — and with ' +
                    'Faiz Fazal, a former India international and Ranji Trophy-winning captain. Fast ' +
                    'bowling with Somi Bhinder, the centre\'s resident fast-bowling coach. Mental ' +
                    'performance with Dr Neeta Adhau.',
            },
            {
                title: 'Individual video analysis and a written plan',
                body:
                    'Your player is filmed, assessed, and sat down one-on-one with a coach for feedback. ' +
                    'They come home with their own written development plan setting out what to work on next.',
            },
            {
                title: 'The full pro support team',
                body:
                    'Strength and conditioning with Raccalerate (Chennai), physio-led injury management, ' +
                    'two mental performance sessions with Dr Neeta Adhau, and nutrition and hydration ' +
                    'education.',
            },
            {
                title: 'Recovery and downtime',
                body: 'Use of the recovery facilities and pool, and the indoor recreation rooms between sessions.',
            },
            {
                title: 'All transport once you land',
                body:
                    'Nagpur airport pick-up and drop-off, and the daily shuttle between the accommodation ' +
                    'and the grounds. Six items of laundry per player are included too.',
            },
        ],

        notIncludedHeading: 'What it does not cover',
        notIncludedNote: 'So there are no surprises later, here is everything you pay for separately.',
        notIncluded: [
            'Flights — see the flights section above; we book these together as a squad',
            'Passport and Indian visa — every traveller needs both, and you pay for your own',
            'Travel insurance — you must have this in place before departure',
            'Vaccinations or any medical costs',
            'Personal spending money and souvenirs',
            'Extra laundry beyond the six items included',
        ],

        howHeading: 'What happens next',
        steps: [
            'Register your interest using the form below. There is nothing to pay today — at this stage we are only collecting enquiries, and registering does not commit you to the tour.',
            'We come back to you in writing to confirm which of the two prices applies to your player, and whether they have a place in the touring squad.',
            'Once the place is confirmed, the program fee is paid in full, up front. That single payment covers everything at the high performance centre listed above.',
            'Flights are handled separately. As soon as the squad flights are locked in we send you the group booking link, and you pay for your own player\'s seat then.',
        ],
    },

    form: {
        badge: 'Expression of Interest',
        heading: 'Register Your',
        headingAccent: 'Interest',
        lead: "A few quick details and we'll be in touch with everything you need to know.",
        tierHeading: 'Which Price Applies',
        tierLead:
            'Pick the one that describes your player. This is what sets your program fee — we will ' +
            'confirm it in writing before you pay anything.',
        tierFootnote: 'plus flights, booked through our group link',
    },
};

// --- simple ---------------------------------------------------------------
// Grade 4–5 reading level. Short lines. The value still lands.

const SIMPLE = {
    hero: {
        badge: 'The First Aussie Squad · Only A Few Spots',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy',
        dateline: '19–26 September 2026 · Nagpur, India',
        lead:
            'Six days inside the Rajasthan Royals\' talent factory in Nagpur. This is the centre that ' +
            'built Sanju Samson, Yashasvi Jaiswal, Dhruv Jurel and Riyan Parag — and where Vaibhav ' +
            'Sooryavanshi trains today. The Royals\' own coaches take every session, not ours. No team ' +
            'from Australia has ever trained here. Only a few spots, and our coaches pick the team.',
        costLabel: 'What it costs',
        flights: 'We book the whole team on the same plane. Then we send you a link to pay for your seat.',
        flightsLead: 'Flights cost extra.',
        flightsEstimate: (r) => `Plan for about ${fmtRangeAUD(r)} more for the return flight.`,
        seeIncluded: 'See what you get',
        downloadLabel: 'Download the camp booklet',
        downloadSub: (size) => `PDF, ${size} — everything about the camp in one file`,
        cta: 'Put My Name Down',
        countdownLabel: 'Sign-ups close in',
        countdownUnits: { days: 'Days', hours: 'Hrs', minutes: 'Mins', seconds: 'Secs' },
        countdownNote:
            'When the clock hits zero we shut the list. Then our coaches pick the team from everyone ' +
            'who signed up.',
        ctaAfterCoaches: {
            heading: 'Six days with these coaches',
            body: 'There are only a few spots and the coaches pick the team. Signing up is free and takes about two minutes.',
        },
        ctaAfterPricing: {
            heading: 'Want a spot?',
            body: 'Put your name down and we will write back with your price, whether you have a spot, and the flight link.',
        },
        countdownClosed: 'Sign-ups are now closed.',
        countdownClosedNote:
            'You can still email info@rramelbourne.com to ask if there are any spots left.',
    },

    about: {
        eyebrow: 'Why This Is Special',
        heading: 'The Royals\'',
        headingAccent: 'Talent Factory',
        lead:
            'Lots of academies run trips to India. Almost none of them get inside the building an IPL ' +
            'club really uses. You stay seven nights at the Rajasthan Royals\' own centre in Nagpur. Six ' +
            'of those days are full training days, taken by the club\'s own coaches. No team from ' +
            'Australia has ever been in. Put your name down below and we will tell you everything.',
        producedHereLabel: 'Built at this centre',
        points: [
            {
                title: 'This place makes India players',
                body:
                    'Sanju Samson, Yashasvi Jaiswal, Dhruv Jurel and Riyan Parag all trained here before ' +
                    'they played for India. It is the Royals\' own centre, not a ground we hired.',
            },
            {
                title: 'The club\'s own coaches',
                body:
                    'The Rajasthan Royals team manager. A man who played for India and captained a ' +
                    'title-winning side. These are the coaches who work with the club\'s players — and ' +
                    'for six days, with you.',
            },
            {
                title: 'A first — and a small group',
                body:
                    'No Australian team has ever done this. The group is kept small so every player gets ' +
                    'seen. Anyone can sign up; our coaches pick the team. Sign up early.',
            },
        ],
    },

    pricing: {
        eyebrow: 'What It Costs',
        heading: 'Two Prices.',
        headingAccent: "Here's Yours.",
        intro:
            'There are two prices. Which one you pay depends on one thing: do you already train with us? ' +
            'If you do, you pay less, because you already pay for our programs during the year.',
        introEmphasis: 'Both groups get the same camp',
        introTail:
            '— same rooms, same coaches, same training. Nobody misses out. And what you are paying for is ' +
            'not really a camp. It is six days somewhere almost nobody gets to go.',
        notSure: 'Not sure which one you are? Just tell us in the form. We will check it for you.',
        tiers: {
            royals_program: {
                eyebrow: 'You already train with us',
                heading: 'Already With Us',
                heroWho: 'If you already train with us',
                who: 'You are in one of our programs now: Junior Royals, Elite, or Power Pre-Season.',
            },
            external: {
                eyebrow: 'You are new to us',
                heading: 'New To Us',
                heroWho: 'If you are new to us',
                who: 'You do not train with us yet. You join the team for this trip and train with our players.',
            },
        },
        priceNote:
            'This is the whole price. Nothing is added on top. You pay it all at once, up front, when ' +
            'you get a spot. The flight costs extra — see below.',
        perPlayer: 'per player, GST included',
        thisIsYou: 'This is you if…',

        flightsEyebrow: 'Extra Cost',
        flightsHeading: 'Getting There',
        flightsBody1:
            'We want the whole team on the same plane, there and back. So we book the group. Then we send ' +
            'you a link. You use the link to pay for your own seat. That money goes to the airline, not ' +
            'to us. You do not have to find flights yourself.',
        flightsBody2Unknown:
            'We will tell you the exact price of the flight when we send you the link. You will see the ' +
            'real number before you say yes.',
        flightsBody2Known: (r) =>
            `Plan for about ${fmtRangeAUD(r)} for the return flight. That is a guess, not a final price ` +
            '— flights go up and down. We will tell you the real price when we send you the link.',
        flightsBody3:
            'So you pay two things: the price above, and the flight. Plus a few small things on the list ' +
            'below. That is all.',


        pillarsEyebrow: 'More Than Cricket',
        pillarsHeading: 'The Team',
        pillarsHeadingAccent: 'Around You',
        pillarsLead: 'A real pro set-up works on four things, not just your batting. You get all four.',
        pillars: [
            { title: 'Your body', body: 'Fitness training. A physio to keep you safe and fix niggles.' },
            { title: 'Your head', body: 'How to stay calm, focused and brave when the game gets tight.' },
            { title: 'Your food', body: 'What to eat and drink before you play, and after, so you recover.' },
            { title: 'Your game plan', body: 'Video of you, an honest assessment, and a plan of what to fix.' },
        ],

        itineraryEyebrow: 'Day By Day',
        itineraryHeading: 'What You Do',
        itineraryHeadingAccent: 'Each Day',
        itineraryLead: 'Six full days of cricket between the day you land and the day you fly home.',
        itineraryDays: [
            { when: 'Sat 19 Sep', title: 'You arrive', body: 'You land in Nagpur. We pick you up. You settle in and meet everyone.' },
            { when: 'Sun 20 Sep', title: 'Day 1 — Testing', body: 'Morning: we test how fast and agile you are, and watch you bat, bowl and field. Afternoon: you watch video of yourself with a coach. Evening: a physio shows you how to avoid injuries.' },
            { when: 'Mon 21 Sep', title: 'Day 2 — Nets', body: 'Morning: batting and bowling drills, plus catching and throwing. Afternoon: long net sessions against different bowlers. Evening: how to stay focused under pressure.' },
            { when: 'Tue 22 Sep', title: 'Day 3 — Middle practice', body: 'Morning: warm-up and fielding in match situations. Afternoon: batting in the middle, like a real game. Evening: what to eat and drink.' },
            { when: 'Wed 23 Sep', title: 'Day 4 — Middle practice', body: 'Another full day batting and bowling in the middle, with coaches watching every ball.' },
            { when: 'Thu 24 Sep', title: 'Day 5 — Match day', body: 'Morning: you play a real match on grass. Afternoon: the coaches tell you what they saw. Evening: handling pressure in a game.' },
            { when: 'Fri 25 Sep', title: 'Day 6 — Last day', body: 'Morning: an easy net if you want one. Afternoon: you get your own written plan. Evening: the closing huddle.' },
            { when: 'Sat 26 Sep', title: 'You fly home', body: 'We take you back to Nagpur airport for your flight.' },
        ],
        includedHeading: 'What you get',
        includedNote: 'The same for both prices. Once you land, all of this is already paid for.',
        included: [
            {
                title: 'A bed for 7 nights',
                body:
                    'You share an air-conditioned room inside the Rajasthan Royals High Performance Centre. You fly in on Saturday 19 ' +
                    'September, train for six days from the 20th to the 25th, and fly home on Saturday ' +
                    '26 September.',
            },
            {
                title: 'All your food',
                body: 'Breakfast, lunch, dinner and snacks. Water and sports drinks too. You bring no food money.',
            },
            {
                title: '6 days of coaching',
                body: 'Nets, practice in the middle, and one real match on grass. Plus the gym and indoor courts.',
            },
            {
                title: 'Top coaches',
                body:
                    'Sid Lahiri runs the Royals academies around the world. He leads the camp. Romi ' +
                    'Bhinder is the Rajasthan Royals team manager — he lives at the centre and coaches ' +
                    'their players all year. Faiz Fazal played for India and captained a title-winning ' +
                    'team. Somi Bhinder coaches fast bowling. Dr Neeta Adhau helps you with the mental side.',
            },
            {
                title: 'A video of you and a plan',
                body:
                    'We film you. A coach sits down with you and goes through it. You take home a written ' +
                    'plan of what to work on.',
            },
            {
                title: 'A fitness and health team',
                body:
                    'Fitness coaches. A physio to keep you safe. Two sessions on staying calm under ' +
                    'pressure. And lessons on what to eat and drink.',
            },
            { title: 'Time to rest', body: 'A pool, recovery rooms, and indoor games between sessions.' },
            {
                title: 'All your travel there',
                body:
                    'We pick you up from the airport and drop you back. A bus takes you to the ground each ' +
                    'day. Six items of washing are done for you.',
            },
        ],

        notIncludedHeading: 'What you pay for yourself',
        notIncludedNote: 'So nothing surprises you later, here is the short list.',
        notIncluded: [
            'The flight — see above; we book the group together',
            'A passport and an India visa — everyone needs both',
            'Travel insurance — you must have this before you fly',
            'Any vaccinations or doctor costs',
            'Spending money and gifts',
            'Extra washing past the six items',
        ],

        howHeading: 'What happens next',
        steps: [
            'Fill in the form below. You pay nothing today. Right now we are just taking names.',
            'We write back and tell you your price, and if you have a spot.',
            'When you get a spot, you pay the full price up front. That one payment covers everything at the camp.',
            'The flight is separate. When we have booked the team flights, we send you a link. You pay for your seat then.',
        ],
    },

    form: {
        badge: 'Enquiry · No Payment Today',
        heading: 'Put Your Name',
        headingAccent: 'Down',
        lead:
            'Fill this in and we will get back to you with your price and everything else you need to ' +
            'know. You are not paying or promising anything yet.',
        tierHeading: 'Which Price Is Yours',
        tierLead: 'Pick the one that is you. This sets your price. We will check it and confirm it.',
        tierFootnote: 'plus the flight, booked through our group link',
    },
};

export const COPY = { standard: STANDARD, simple: SIMPLE };

export const getCopy = (simple) => (simple ? SIMPLE : STANDARD);

/**
 * Reading-level mode from the URL.
 *   (absent)       → SIMPLE (the live copy), and no toggle is shown to the public
 *   ?read=simple   → simple copy, with the review toggle
 *   ?read=standard → club-voice copy, with the review toggle
 * Returns { simple, showToggle, setMode }.
 */
export const useReadingMode = () => {
    const readParam = () => {
        if (typeof window === 'undefined') return null;
        const v = new URLSearchParams(window.location.search).get('read');
        return v ? v.toLowerCase() : null;
    };

    const [mode, setMode] = useState(readParam);

    useEffect(() => {
        const onPop = () => setMode(readParam());
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const apply = (next) => {
        const url = new URL(window.location.href);
        url.searchParams.set('read', next);
        window.history.replaceState({}, '', url);
        setMode(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Simple is the default: only an explicit ?read=standard opts into the club voice.
    return { simple: mode !== 'standard', showToggle: mode !== null, setMode: apply };
};

/** Tier list for rendering, merging the shared prices with the chosen variant. */
export const getTiers = (copy) =>
    TIER_KEYS.map((key) => ({ key, price: TIER_PRICES[key], ...copy.pricing.tiers[key] }));
