// ---------------------------------------------------------------------------
// India Tour — page copy, in two reading levels. Two upcoming tours, named by
// their windows only: exact dates are not set (Alex, 29 Sep 2026).
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
// THE TOURS AND THE PRICE LIVE HERE ONCE. The hero, the pricing section and the
// form all read them, so nothing can be updated in one place and stale in another.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
    TOUR_MEMBER_MONTHS_WORD,
    TERMS_ROUTE,
    TERMS_MEMBERSHIP_CLAUSE,
} from '../performance-squads/data';

// The two upcoming tours to the Rajasthan Royals High Performance Centre in
// Nagpur (Alex, 29 Sep 2026). Exact dates are NOT set, so each tour is named by
// its window and never by a date. `id` is what the form stores in
// applications.tour_interest: keep the ids stable once families have registered
// against them, because staff filter on them.
export const TOURS = [
    { id: '2026-12-late-dec-jan', window: 'Late December 2026 to early January 2027' },
    { id: '2027-04-april', window: 'April 2027' },
];

// The tour the page promotes first (Alex, 5 Oct 2026).
export const DECEMBER_TOUR_ID = '2026-12-late-dec-jan';

// ROUND 1 for the December tour (Alex, 5 Oct 2026: "30th of October round 1,
// expressions of interest will end"). One instant drives the hero clock, the
// tour cards and the form. +11:00 because Melbourne is on daylight time (AEDT)
// from 4 Oct 2026, so the clock is right wherever the viewer is.
//
// When it passes, the clock swaps to a "Round 1 has closed" notice. The form
// stays open for both tours: Alex called this Round 1, not the end of interest.
// REVIEW 31 Oct 2026: ask Alex whether a Round 2 opens, then update the copy.
export const ROUND_1 = {
    tourId: DECEMBER_TOUR_ID,
    closesAt: '2026-10-30T23:59:00+11:00',
    closesLabel: 'Friday 30 October 2026',
    closesShort: 'Fri 30 Oct',
    closesTime: '11:59pm Melbourne time',
};

// MEMBER PRICING FOR THE DECEMBER TOUR (Alex, 5 Oct 2026). A player who has been
// in any of these three programs gets member pricing on the December tour.
//
// This is an EXCEPTION, not a change to the Terms. Clause 13.5 says tour member
// pricing needs six months of unbroken Performance Squad membership by the day
// the tour starts. Squads started on 5 Oct 2026, so nobody can reach six months
// by late December. Alex chose to keep 13.5 as written and use clause 13.7 (the
// Academy decides eligibility) for the December tour. The April 2027 tour
// follows 13.5 as written.
//
// No member price figure yet (Alex, 5 Oct 2026). The page says who qualifies and
// that both prices come in writing. It never says how much less members pay.
export const MEMBER_PROGRAMS = ['12-week T20 Program', 'Power Game Pre-Season', 'Performance Squads'];
export { TERMS_ROUTE, TERMS_MEMBERSHIP_CLAUSE };

// "12-week T20 Program, Power Game Pre-Season or Performance Squads"
export const memberProgramsOr = () =>
    `${MEMBER_PROGRAMS.slice(0, -1).join(', ')} or ${MEMBER_PROGRAMS[MEMBER_PROGRAMS.length - 1]}`;

// Each tour is about 10 days long (Alex, 29 Sep 2026). The page always says "about".
export const TOUR_LENGTH_DAYS = 10;

// Estimated price per player, per tour (Alex, 29 Sep 2026). It is an ESTIMATE and
// the page always says so: the exact price, and what it includes, are confirmed in
// writing before anyone commits. Don't say what it covers (flights, accommodation,
// meals…) until Alex has confirmed it.
export const PRICE_ESTIMATE_AUD = { min: 7000, max: 8000 };

// What the price covers is not confirmed yet, so the pricing section shows a
// "confirmed with the price" note instead of an inclusions list. The `included`
// and `notIncluded` lists below describe the SEPTEMBER 2026 camp (seven nights,
// six coaching days) and are kept only as the record. When Alex confirms what the
// new tours include, rewrite those lists for the new tours FIRST, then set this true.
export const INCLUSIONS_CONFIRMED = false;

// History: the September 2026 camp (19–26 Sep, now run) cost $2,100 for academy
// players and $2,700 for players new to us, both incl GST, plus flights booked
// through a group link. Those prices must not be shown for the new tours.

// "Which of our programs has the player been in?" (from 5 Oct 2026). The form
// asks so staff can check member pricing for the December tour. Tick any of the
// three member programs, and/or another program, or "new to the Academy" on its
// own. The answer is stored in `bio`, with the older "Player type" label
// (already in a program / new) worked out from it so existing filters still work.
export const PROGRAM_OPTIONS = [
    ...MEMBER_PROGRAMS.map((label) => ({ key: label, label, member: true })),
    { key: 'other', label: 'Another of our programs, such as Junior Royals', member: false },
];
export const NEW_TO_ACADEMY_KEY = 'new';

// Master switch for the page. 'open' takes expressions of interest; 'closed'
// shuts the form, drops the register CTAs and shows the closed notice.
//
// From 27 Sep 2026 the page took interest with no dates at all. From 29 Sep 2026
// it names the two upcoming tours by their windows (see TOURS). There is still no
// deadline and no clock. The September 2026 camp's registrations closed on 12 Aug 2026.
export const TOUR_STATUS = 'open';


// The official camp document, served from /public. The one we have is the
// September 2026 booklet (its PDF title says so), so the time-neutral page does
// not offer it. The hero and itinerary show the download only when this is set.
// When a dateless version exists, set it back to the same shape:
//   { href: '/rra-high-performance-camp-2026.pdf',
//     filename: 'RRA High Performance Camp 2026.pdf', sizeLabel: '26 MB' }
// (26 MB is a lot on mobile data, so keep the size on the page.)
export const CAMP_PDF = null;

// Players the Rajasthan Royals High Performance Centre is documented as having
// developed. Samson / Jaiswal / Jurel / Parag are sourced to Forbes India's
// reporting on the centre; Sooryavanshi and Pretorius come from the camp document.
// Do NOT add a name here without a source — this is public, about real people.
export const PRODUCED_HERE = [
    { name: 'Sanju Samson', note: 'India international · Royals captain' },
    { name: 'Yashasvi Jaiswal', note: 'India Test opener' },
    { name: 'Dhruv Jurel', note: 'India wicketkeeper-batter' },
    { name: 'Riyan Parag', note: 'India international' },
    { name: 'Vaibhav Sooryavanshi', note: 'trains at the centre' },
    { name: 'Luhan-dre Pretorius', note: 'Royals top order' },
];

export const fmtAUD = (n) => `$${Number(n).toLocaleString('en-AU')}`;
// "$7,000–$8,000" — en dash, both sides signed so neither number reads as a total.
export const fmtRangeAUD = (r) => `${fmtAUD(r.min)}–${fmtAUD(r.max)}`;

// --- standard -------------------------------------------------------------

const STANDARD = {
    hero: {
        badge: 'December Tour · Round 1 Open',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy · Melbourne',
        dateline: 'Nagpur, India · Two\u00a0Tours',
        toursLabel: 'The two tours',
        tourLength: `About ${TOUR_LENGTH_DAYS} days`,
        toursNote:
            'Exact dates are not set yet. Register your interest now in one tour or both, and we will ' +
            'write to you when they are.',
        lead:
            `A tour of about ${TOUR_LENGTH_DAYS} days to the Rajasthan Royals' talent factory in Nagpur — ` +
            'the franchise\'s own High Performance Centre, and the place that built the games of Sanju ' +
            'Samson, Yashasvi Jaiswal, Dhruv Jurel and Riyan Parag. It is where Vaibhav Sooryavanshi ' +
            'trains, alongside the coach who is his legal guardian. Our first touring group trained there ' +
            'with the Royals\' own high performance staff in September 2026, and our Melbourne coaches ' +
            'pick each touring squad.',
        priceLabel: 'Estimated price',
        priceUnit: 'per player',
        priceNote:
            `For each tour of about ${TOUR_LENGTH_DAYS} days. This is an estimate, not a final price: ` +
            'before anyone commits, we confirm in writing the exact price and exactly what it includes.',
        seePrice: 'How the price works',
        downloadLabel: 'Download the camp document',
        downloadSub: (size) => `PDF, ${size} — the full programme, coaches and itinerary`,
        cta: 'Register Your Interest',
        round1Tag: `Round 1 closes ${ROUND_1.closesShort}`,
        memberTag: 'Member pricing',
        memberLine:
            `Member pricing on the December tour for players who have been in our ${memberProgramsOr()}.`,
        memberLink: 'Who qualifies',
        countdownLabel: 'December tour · Round 1 closes in',
        countdownUnits: { days: 'Days', hours: 'Hrs', minutes: 'Mins', seconds: 'Secs' },
        countdownNote:
            `Round 1 for the December tour closes on ${ROUND_1.closesLabel} at ${ROUND_1.closesTime}. ` +
            'When it closes, our coaches start picking the December touring squad from everyone in ' +
            'Round 1. The April 2027 tour stays open.',
        ctaAfterCoaches: {
            heading: 'Choose one tour or both',
            body: 'Register your interest in the tour that suits you, or in both. It costs nothing, takes about two minutes and commits you to nothing. Our Melbourne coaches pick each touring squad from everyone who registers.',
        },
        ctaAfterPricing: {
            heading: 'Ready to put your player forward?',
            body: 'Register your interest and, when a tour you picked has dates, we will write to you with the dates, the exact price, what it includes, and whether your player has a place.',
        },
        closedBadge: 'Applications Closed',
        closedHeading: 'Applications for this tour have closed',
        closedBody:
            'This High Performance Centre Camp is now closed to new applications, and our ' +
            'coaches are confirming the touring squad. A new tour will be announced shortly.',
        closedNext: 'New tour announcement coming soon.',
        countdownClosed: 'Round 1 for the December tour has closed.',
        countdownClosedNote:
            'You can still register your interest in the December tour, and we will tell you if a ' +
            'second round opens. Registrations for the April 2027 tour remain open.',
    },

    about: {
        eyebrow: 'Why This Is Rare',
        heading: 'The Royals\'',
        headingAccent: 'Talent Factory',
        lead:
            'Academies run tours. Almost none of them get inside the building an IPL franchise actually ' +
            'uses. Each Rajasthan Royals Academy Melbourne tour goes to the Royals\' High Performance ' +
            `Centre in Nagpur for about ${TOUR_LENGTH_DAYS} days.`,
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
                title: 'The club\'s own coaches',
                body:
                    'The Rajasthan Royals team manager. A former India international and Ranji ' +
                    'Trophy-winning captain. The centre\'s resident fast bowling coach. The Royals\' ' +
                    'performance psychologist. These are the people who coach the club\'s own players, and ' +
                    'they coached our first touring group in September 2026.',
            },
            {
                title: 'How the squad is picked',
                body: 'Anyone can register. Our Melbourne coaches pick each touring squad.',
            },
        ],
    },

    pricing: {
        eyebrow: 'What It Costs',
        heading: `About ${fmtRangeAUD(PRICE_ESTIMATE_AUD)}`,
        headingAccent: 'Per Player',
        intro:
            `That is our estimate for each tour of about ${TOUR_LENGTH_DAYS} days, not a final price. ` +
            'The dates and the final price are not set yet for either tour. Before anyone commits, we ' +
            'confirm in writing the exact price and exactly what it includes.',
        member: {
            eyebrow: 'December Tour',
            heading: 'Member',
            headingAccent: 'Pricing',
            lead:
                `Players who have been in our ${memberProgramsOr()} get member pricing on the December ` +
                'tour. The member price is lower than the standard price.',
            programsLabel: 'Member pricing applies if your player has been in',
            priceNote:
                'The member price is not set yet. When the December dates are confirmed, we write to you ' +
                'with the member price, the standard price and what each includes, before you commit to ' +
                'anything.',
            whyHeading: 'Why December is an exception',
            whyBody:
                'Under our Terms & Conditions, member pricing on a tour normally needs ' +
                `${TOUR_MEMBER_MONTHS_WORD} months of unbroken Performance Squad membership by the day the ` +
                'tour starts. The squads began in October 2026, so no player can reach ' +
                `${TOUR_MEMBER_MONTHS_WORD} months by late December. For the December tour, the Academy is ` +
                'giving member pricing to every player who has been in one of the three programs above.',
            aprilNote:
                `The April 2027 tour follows the usual rule: ${TOUR_MEMBER_MONTHS_WORD} months of unbroken ` +
                'Performance Squad membership by the day it starts.',
            termsLabel: `Read the full rules in ${TERMS_MEMBERSHIP_CLAUSE} of our Terms & Conditions`,
            formHint:
                'The form below asks which of our programs your player has been in, so we can confirm ' +
                'the member price.',
        },

        includesEyebrow: 'What the price includes',
        includesHeading: 'Not Confirmed Yet',
        includesBody:
            'When we confirm the price for a tour, we will set out in writing exactly what it covers, ' +
            'including whether flights are part of it, and anything you would need to pay for yourself. ' +
            'You will have all of it before you decide.',

        pillarsEyebrow: 'Beyond The Boundary',
        pillarsHeading: 'What A Professional',
        pillarsHeadingAccent: 'Set-Up Covers',
        pillarsLead:
            'A professional set-up coaches more than batting. The plan for our first tour, in September ' +
            '2026, covered these four alongside the cricket.',
        pillars: [
            { title: 'Physical', body: 'Strength and conditioning, injury management, and physio-led rehabilitation fundamentals.' },
            { title: 'Mental', body: 'Focus, resilience, and handling match-day pressure under competitive stress.' },
            { title: 'Nutritional', body: 'Professional education on hydration, pre-game fuelling and recovery diets.' },
            { title: 'Tactical', body: 'Video analysis, player evaluation and individual tactical feedback.' },
        ],

        // The day-by-day below is the September 2026 camp's plan, shown as a guide to
        // what a tour at the centre involves. The new tours are longer, so it is
        // labelled as last time's plan, not as theirs.
        itineraryEyebrow: 'September 2026',
        itineraryHeading: 'Our First Tour,',
        itineraryHeadingAccent: 'Day By Day',
        itineraryLead:
            'This was the day-by-day plan for our first tour, in September 2026: six full coaching days ' +
            'between arrival and departure. Mornings built the skill, afternoons applied it, and evenings ' +
            'covered the things that keep a player on the field. The new tours are longer, at about ' +
            `${TOUR_LENGTH_DAYS} days each, so their plans will be different.`,
        itineraryDays: [
            { when: 'Arrival day', title: 'Arrival', body: 'Land in Nagpur, get picked up, and settle in at the centre. Welcome and orientation.' },
            { when: 'Day 1', title: 'Foundation', body: 'Morning: performance testing (speed, agility, coordination) and a skill assessment across batting, bowling and fielding. Afternoon: player evaluation and video analysis, one-on-one with a coach. Evening: physio-led injury management.' },
            { when: 'Day 2', title: 'Nets & Skill', body: 'Morning: technical batting and bowling drills, plus core fielding. Afternoon: extended net sessions against varied bowling. Evening: mental strength session one — focus, confidence and handling pressure.' },
            { when: 'Day 3', title: 'Centre Wicket', body: 'Morning: warm-up, skill reinforcement and match-situation fielding. Afternoon: structured centre-wicket practice in a game-like environment. Evening: nutrition and hydration.' },
            { when: 'Day 4', title: 'Centre Wicket', body: 'A second full day in the middle, building on day three under direct coach guidance.' },
            { when: 'Day 5', title: 'Match Day', body: 'Morning: a practice match on turf wickets. Afternoon: post-match feedback and skill work. Evening: mental strength session two — game pressure and decision-making.' },
            { when: 'Day 6', title: 'Closing & Evaluation', body: 'Morning: a light optional net session. Afternoon: group reflection and each player\'s individual development plan. Evening: closing huddle.' },
            { when: 'Departure day', title: 'Departure', body: 'Farewell and transfer back to Nagpur airport for the flight home.' },
        ],
        includedHeading: 'What your fee covers',
        includedNote: 'Identical for both prices. Once you are in Nagpur, everything below is already paid for.',
        included: [
            {
                title: 'Seven nights inside the Royals HPC',
                body:
                    'Shared air-conditioned rooms inside the Rajasthan Royals High Performance Centre in ' +
                    'Nagpur. You fly in the day before camp starts, train across six full camp days, and ' +
                    'fly home the day after the last one.',
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
                    'Sid Lahiri, Head of International Player Development and Performance Coach at the ' +
                    'Rajasthan Royals, leads the camp. ' +
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
            'Register your interest using the form below, and tick the tour you want, or both. There is nothing to pay today: at this stage we are only collecting enquiries, and registering does not commit you to anything.',
            'When a tour you picked has dates, we write to you with them, along with the exact price, exactly what it includes, and whether your player has a place in the touring squad.',
            'Nothing is booked and nothing is paid until you have all of that in writing and tell us you want the place.',
        ],
    },

    form: {
        badge: 'Expression of Interest',
        heading: 'Register Your',
        headingAccent: 'Interest',
        lead:
            'Tick the tour you want, or both, and add a few quick details. When a tour you picked has ' +
            'dates, we will write to you with everything you need to know.',
        toursHeading: 'Which Tour',
        toursLead: 'Tick one tour or both. Exact dates are not set yet; we will write to you when they are.',
        toursError: 'Please tick at least one tour.',
        round1Note: `Round 1 closes ${ROUND_1.closesLabel}`,
        programsHeading: 'Which Of Our Programs Has Your Player Been In?',
        programsLead:
            `Tick every one that applies. Players who have been in our ${memberProgramsOr()} get member ` +
            'pricing on the December tour.',
        programsMemberTag: 'Member pricing',
        programsNewLabel: 'None yet: new to the Academy',
        programsError: 'Please tick the programs your player has been in, or "new to the Academy".',
    },
};

// --- simple ---------------------------------------------------------------
// Grade 4–5 reading level. Short lines. The value still lands.

const SIMPLE = {
    hero: {
        badge: 'December Tour · Round 1 Open',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy · Melbourne',
        dateline: 'Nagpur, India · Two\u00a0Tours',
        toursLabel: 'The two tours',
        tourLength: `About ${TOUR_LENGTH_DAYS} days`,
        toursNote:
            'The exact dates are not set yet. Put your name down now for one tour or both, and we will ' +
            'tell you when the dates are set.',
        lead:
            `A tour of about ${TOUR_LENGTH_DAYS} days to the Rajasthan Royals' talent factory in Nagpur. ` +
            'This is the centre that built Sanju Samson, Yashasvi Jaiswal, Dhruv Jurel and Riyan Parag — ' +
            'and where Vaibhav Sooryavanshi trains. Royals coaches worked with our first touring group ' +
            'there in September 2026. Our Melbourne coaches pick the team.',
        priceLabel: 'Estimated price',
        priceUnit: 'per player',
        priceNote:
            `For each tour of about ${TOUR_LENGTH_DAYS} days. It is an estimate, not the final price. ` +
            'Before you say yes, we tell you the exact price and what it covers, in writing.',
        seePrice: 'More about the price',
        downloadLabel: 'Download the camp booklet',
        downloadSub: (size) => `PDF, ${size} — everything about the camp in one file`,
        cta: 'Put My Name Down',
        round1Tag: `Round 1 closes ${ROUND_1.closesShort}`,
        memberTag: 'Member price',
        memberLine:
            `Been in our ${memberProgramsOr()}? You get the member price on the December tour.`,
        memberLink: 'Who gets it',
        countdownLabel: 'December tour · Round 1 closes in',
        countdownUnits: { days: 'Days', hours: 'Hrs', minutes: 'Mins', seconds: 'Secs' },
        countdownNote:
            `Round 1 for the December tour closes on ${ROUND_1.closesLabel} at ${ROUND_1.closesTime}. ` +
            'Then our coaches start picking the December team from everyone in Round 1. The April 2027 ' +
            'tour stays open.',
        ctaAfterCoaches: {
            heading: 'One tour or both',
            body: 'Put your name down for the tour you want, or both. It is free and takes about two minutes. You are not paying or promising anything yet.',
        },
        ctaAfterPricing: {
            heading: 'Want a spot?',
            body: 'Put your name down. When a tour you picked has dates, we write back with the dates, the exact price, what it covers, and whether you have a spot.',
        },
        closedBadge: 'Applications Closed',
        closedHeading: 'Sign-ups for this tour are closed',
        closedBody:
            'You can no longer put your name down for this camp. Our coaches are picking the ' +
            'team now. We will announce a new tour soon.',
        closedNext: 'New tour announcement coming soon.',
        countdownClosed: 'Round 1 for the December tour has closed.',
        countdownClosedNote:
            'You can still put your name down for the December tour. We will tell you if a second ' +
            'round opens. Sign-ups for the April 2027 tour are still open.',
    },

    about: {
        eyebrow: 'Why This Is Special',
        heading: 'The Royals\'',
        headingAccent: 'Talent Factory',
        lead:
            'Lots of academies run trips to India. Almost none of them get inside the building an IPL ' +
            'club really uses. Our tours go to the Rajasthan Royals\' own centre in Nagpur, for about ' +
            `${TOUR_LENGTH_DAYS} days each. Put your name down below and we will tell you everything.`,
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
                    'title-winning side. These are the coaches who work with the club\'s players. They ' +
                    'coached our first touring group in September 2026.',
            },
            {
                title: 'How the team is picked',
                body: 'Anyone can put their name down. Our Melbourne coaches pick the team.',
            },
        ],
    },

    pricing: {
        eyebrow: 'What It Costs',
        heading: `About ${fmtRangeAUD(PRICE_ESTIMATE_AUD)}`,
        headingAccent: 'Per Player',
        intro:
            `That is our estimate for each tour of about ${TOUR_LENGTH_DAYS} days. It is not the final ` +
            'price, and the dates are not set yet either. Before you say yes, we tell you the exact ' +
            'price and what it covers, in writing.',
        member: {
            eyebrow: 'December Tour',
            heading: 'Member',
            headingAccent: 'Price',
            lead:
                'Has your player been in one of these three programs? Then they get the member price ' +
                'for the December tour. The member price is lower than the standard price.',
            programsLabel: 'The three programs',
            priceNote:
                'We have not set the member price yet. When the December dates are set, we tell you the ' +
                'member price and the standard price, in writing, before you say yes.',
            whyHeading: 'Why December is different',
            whyBody:
                'Normally, to get the member price on a tour, a player needs to be in a Performance Squad ' +
                `for ${TOUR_MEMBER_MONTHS_WORD} months in a row by the day the tour starts. The squads only ` +
                `started in October 2026, so nobody can have ${TOUR_MEMBER_MONTHS_WORD} months by December. ` +
                'So for the December tour, every player who has been in one of the three programs gets ' +
                'the member price.',
            aprilNote:
                `The April 2027 tour uses the normal rule: ${TOUR_MEMBER_MONTHS_WORD} months in a row in a ` +
                'Performance Squad by the day the tour starts.',
            termsLabel: `The full rules are in ${TERMS_MEMBERSHIP_CLAUSE} of our Terms & Conditions`,
            formHint: 'In the form below, tick the programs your player has been in. That is how we check.',
        },

        includesEyebrow: 'What the price covers',
        includesHeading: 'Not Set Yet',
        includesBody:
            'When we confirm the price for a tour, we tell you exactly what it covers. That includes ' +
            'whether the flights are part of it, and anything you would need to pay for yourself. You ' +
            'get all of it in writing before you decide.',

        pillarsEyebrow: 'More Than Cricket',
        pillarsHeading: 'What A Pro Set-Up',
        pillarsHeadingAccent: 'Works On',
        pillarsLead: 'A pro set-up works on more than your batting. The plan for our first tour, in September 2026, covered these four things.',
        pillars: [
            { title: 'Your body', body: 'Fitness training, and a physio to help prevent and fix niggles.' },
            { title: 'Your head', body: 'How to stay calm, focused and brave when the game gets tight.' },
            { title: 'Your food', body: 'What to eat and drink before you play, and after, so you recover.' },
            { title: 'Your game plan', body: 'Video, an honest assessment, and a plan of what to fix.' },
        ],

        // September 2026's plan, shown as a guide (see the note in STANDARD).
        itineraryEyebrow: 'September 2026',
        itineraryHeading: 'Our First Tour,',
        itineraryHeadingAccent: 'Day By Day',
        itineraryLead:
            'This was the plan for our first tour, in September 2026: six days of cricket between the ' +
            'day the team landed and the day it flew home. The new tours are longer, about ' +
            `${TOUR_LENGTH_DAYS} days each, so their plans will be different.`,
        itineraryDays: [
            { when: 'Arrival day', title: 'Arrive', body: 'Land in Nagpur, get picked up, settle in and meet everyone.' },
            { when: 'Day 1', title: 'Testing', body: 'Morning: speed and agility tests, and the coaches watch everyone bat, bowl and field. Afternoon: video review with a coach. Evening: a physio session on how to avoid injuries.' },
            { when: 'Day 2', title: 'Nets', body: 'Morning: batting and bowling drills, plus catching and throwing. Afternoon: long net sessions against different bowlers. Evening: how to stay focused under pressure.' },
            { when: 'Day 3', title: 'Middle practice', body: 'Morning: warm-up and fielding in match situations. Afternoon: batting in the middle, like a real game. Evening: what to eat and drink.' },
            { when: 'Day 4', title: 'Middle practice', body: 'Another full day batting and bowling in the middle, with coaches watching every ball.' },
            { when: 'Day 5', title: 'Match day', body: 'Morning: a real match on grass. Afternoon: the coaches say what they saw. Evening: handling pressure in a game.' },
            { when: 'Day 6', title: 'Last day', body: 'Morning: an easy net for anyone who wants one. Afternoon: each player gets their own written plan. Evening: the closing huddle.' },
            { when: 'Going home', title: 'Fly home', body: 'Back to Nagpur airport for the flight home.' },
        ],
        includedHeading: 'What you get',
        includedNote: 'The same for both prices. Once you land, all of this is already paid for.',
        included: [
            {
                title: 'A bed for 7 nights',
                body:
                    'You share an air-conditioned room inside the Rajasthan Royals High Performance Centre. ' +
                    'You fly in the day before camp, train for six days, then fly home.',
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
                    'Sid Lahiri is Head of International Player Development and Performance Coach at ' +
                    'the Rajasthan Royals. He works with the Royals academies around the world and led ' +
                    'the camp. Romi ' +
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
            'Fill in the form below. Tick the tour you want, or both. You pay nothing today. Right now we are just taking names.',
            'When a tour you picked has dates, we write to you. We tell you the dates, the exact price, what it covers, and if you have a spot.',
            'Nothing is booked and nothing is paid until you have all of that in writing and say yes.',
        ],
    },

    form: {
        badge: 'Enquiry · No Payment Today',
        heading: 'Put Your Name',
        headingAccent: 'Down',
        lead:
            'Fill this in and tick the tour you want, or both. When a tour you picked has dates, we will ' +
            'get back to you with the price and everything else you need to know. You are not paying or ' +
            'promising anything yet.',
        toursHeading: 'Which Tour',
        toursLead: 'Tick one or both. The dates are not set yet. We will tell you when they are.',
        toursError: 'Please tick at least one tour.',
        round1Note: `Round 1 closes ${ROUND_1.closesLabel}`,
        programsHeading: 'Which Of Our Programs Has The Player Been In?',
        programsLead: 'Tick all that fit. The first three get the member price on the December tour.',
        programsMemberTag: 'Member price',
        programsNewLabel: 'None. The player is new to us.',
        programsError: 'Please tick at least one box.',
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
