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

export const fmtAUD = (n) => `$${Number(n).toLocaleString('en-AU')}`;
// "$1,500–$2,000" — en dash, both sides signed so neither number reads as a total.
export const fmtRangeAUD = (r) => `${fmtAUD(r.min)}–${fmtAUD(r.max)}`;

// --- standard -------------------------------------------------------------

const STANDARD = {
    hero: {
        badge: 'Registrations Open · Limited Places',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy Melbourne',
        dateline: '19–26 September 2026 · Nagpur, India',
        lead:
            'A Rajasthan Royals Academy Melbourne squad, living and training at the Rajasthan Royals ' +
            'High Performance Centre in Nagpur — six full days of coaching and a practice match, at the ' +
            'centre where the Royals develop players like Vaibhav Sooryavanshi. Open to register, but ' +
            'places on the touring squad are limited and confirmed by our coaches.',
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
        countdownClosed: 'Registrations for the India Tour 2026 have now closed.',
        countdownClosedNote:
            'If you still want to be considered, email info@rramelbourne.com and we will tell you ' +
            'whether any places are left.',
    },

    about: {
        eyebrow: 'The Opportunity',
        heading: 'A Cricket Journey',
        headingAccent: 'Like No Other',
        lead:
            'This September a Rajasthan Royals Academy Melbourne squad tours India to train, compete ' +
            'and grow. Eight days inside a professional high-performance centre, coached by people who ' +
            'develop players for the next level. Register your interest and our team will be in touch ' +
            'with everything you need to know.',
        points: [
            {
                title: 'Where the Royals build players',
                body:
                    'Turf nets, centre-wicket practice and a match on grass at the Royals\' own high ' +
                    'performance centre in Nagpur — the centre behind the games of Vaibhav Sooryavanshi ' +
                    'and Luhan-dre Pretorius.',
            },
            {
                title: 'Coached the Royals Way',
                body:
                    'You work directly with Rajasthan Royals Academy coaches and specialists who develop ' +
                    'players for the next level.',
            },
            {
                title: 'A Limited Touring Squad',
                body:
                    'Anyone can register, but places are capped and the squad is confirmed by our ' +
                    'coaches. Registering early gives you the best chance.',
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
        introTail: '— same accommodation, same coaches, same sessions, same analysis. Nobody gets a lesser version.',
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
        badge: 'Open Now · Only A Few Spots',
        h1: 'High Performance',
        h1Accent: 'Centre Camp',
        kicker: 'Rajasthan Royals Academy Melbourne',
        dateline: '19–26 September 2026 · Nagpur, India',
        lead:
            'Six days of coaching in India. You live and train at the Rajasthan Royals cricket centre in ' +
            'Nagpur — the same place their stars train, including Vaibhav Sooryavanshi. You play one real ' +
            'match. You come home with a plan to get better. Anyone can sign up, but there are only a few ' +
            'spots and our coaches pick the team.',
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
        countdownClosed: 'Sign-ups are now closed.',
        countdownClosedNote:
            'You can still email info@rramelbourne.com to ask if there are any spots left.',
    },

    about: {
        eyebrow: 'What This Is',
        heading: 'Eight Days',
        headingAccent: 'In India',
        lead:
            'This September, a team from our academy flies to India. You live at the Rajasthan Royals ' +
            'cricket centre in Nagpur. You train there every day. You play a match on grass. Put your ' +
            'name down below and we will tell you everything.',
        points: [
            {
                title: 'Train where the pros train',
                body:
                    'Real grass pitches. Real nets. A gym and a pool. This is the centre where the Royals ' +
                    'built Vaibhav Sooryavanshi and Luhan-dre Pretorius.',
            },
            {
                title: 'Coaches who have played for India',
                body: 'They watch you bat and bowl. Then they tell you how to get better.',
            },
            {
                title: 'Only a few spots',
                body: 'Anyone can sign up. Our coaches pick the team. Sign up early to get the best chance.',
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
        introTail: '— same rooms, same coaches, same training. Nobody misses out on anything.',
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

        includedHeading: 'What you get',
        includedNote: 'The same for both prices. Once you land, all of this is already paid for.',
        included: [
            {
                title: 'A bed for 7 nights',
                body:
                    'You share an air-conditioned room at the cricket centre. You fly in on Saturday 19 ' +
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
