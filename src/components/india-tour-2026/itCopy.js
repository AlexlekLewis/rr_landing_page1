// ---------------------------------------------------------------------------
// India Tour 2026 — page copy, in two reading levels.
//
//   standard : the club voice. Full sentences, adult reader.
//   simple   : written so a 10-year-old can read it and a busy parent can scan
//              it in about twenty seconds. Short sentences, one idea each,
//              common words, the point first. Same facts, same value — only
//              the language changes. Nothing is dumbed down or dropped.
//
// Switch with ?read=simple / ?read=standard on the URL. When either is present
// a small toggle appears so the two can be compared side by side; the public
// URL with no parameter always gets `standard`.
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

// Indicative return airfare per player, AUD (e.g. 1450). Null → the page says
// we will confirm it, rather than quoting a number nobody has agreed to.
export const FLIGHT_ESTIMATE_AUD = null;
// Deposit that confirms a place, AUD incl GST (e.g. 500).
export const DEPOSIT_AUD = null;

export const fmtAUD = (n) => `$${Number(n).toLocaleString('en-AU')}`;

// --- standard -------------------------------------------------------------

const STANDARD = {
    hero: {
        badge: 'Registrations Open · Limited Places',
        dateline: '19–26 September · Nagpur',
        lead:
            'A Rajasthan Royals Academy Melbourne squad, living and training for eight days at the ' +
            'Rajasthan Royals High Performance Centre in Nagpur — six full days of coaching and a ' +
            'practice match. Open to register, but places on the touring squad are limited and ' +
            'confirmed by our coaches.',
        costLabel: 'What it costs — per player',
        flights:
            'We book the whole squad on the same flights and send you a group booking link to pay for ' +
            'your own player\'s seat.',
        flightsLead: 'Flights are not included in either price.',
        seeIncluded: "See exactly what's included",
        cta: 'Register Your Interest',
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
                title: 'Train & Play in India',
                body:
                    'Turf nets, centre-wicket practice and a match on grass, at the Royals\' own high ' +
                    'performance centre in Nagpur.',
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
            'That is the total program fee — there is no tax or booking fee added on top. Flights are ' +
            'separate and are explained below.',
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
        flightsBody2Known: (n) =>
            `Budget roughly ${fmtAUD(n)} per player for the return airfare Melbourne–Nagpur. We will ` +
            'confirm the exact figure when the group booking link goes out.',
        flightsBody3:
            'So your total outlay for the tour is the program fee above plus the airfare, and then the ' +
            'few personal items listed under "what it does not cover". There is nothing else coming from us.',

        includedHeading: 'What your fee covers',
        includedNote: 'Identical for both prices. Once you are in Nagpur, everything below is already paid for.',
        included: [
            {
                title: 'Seven nights at the Royals HPC',
                body:
                    'Shared air-conditioned rooms inside the Rajasthan Royals High Performance Centre in ' +
                    'Nagpur. You arrive Saturday 19 September and fly home Saturday 26 September 2026.',
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
                title: 'The Royals coaching panel',
                body:
                    'Batting and leadership with Faiz Fazal — a former India international and Ranji ' +
                    'Trophy-winning captain — and with Romi Bhinder, the Rajasthan Royals team manager. ' +
                    'Bowling with Somi Bhinder, the HPC ground curator and a former bowler and coach.',
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

        howHeading: 'How paying works',
        steps: (deposit) => [
            'Register your interest using the form below. It costs nothing and does not commit you to the tour.',
            'We come back to you in writing with your confirmed price, the payment dates, and the group flight booking link.',
            deposit
                ? `A ${fmtAUD(deposit)} deposit confirms your player's place in the touring squad, and comes off the program fee — it is not an extra charge.`
                : "A deposit confirms your player's place in the touring squad. It comes off the program fee — it is not an extra charge — and we will tell you the amount and the due date in that same email.",
            'The balance of the program fee is due before departure, on the dates set out in your confirmation.',
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
        dateline: '19–26 September · Nagpur, India',
        lead:
            'Eight days in India. You train at the Rajasthan Royals cricket centre, the same place their ' +
            'pros use. Six days of coaching. One real match. You come home with a plan to get better. ' +
            'Anyone can sign up, but there are only a few spots and our coaches pick the team.',
        costLabel: 'What it costs',
        flights: 'We book the whole team on the same plane. Then we send you a link to pay for your seat.',
        flightsLead: 'Flights cost extra.',
        seeIncluded: 'See what you get',
        cta: 'Sign Up Your Interest',
    },

    about: {
        eyebrow: 'What This Is',
        heading: 'Eight Days',
        headingAccent: 'In India',
        lead:
            'This September, a team from our academy flies to India. You live at a real cricket centre. ' +
            'You train there every day. You play a match on grass. Sign up below and we will tell you ' +
            'everything.',
        points: [
            {
                title: 'Train where the pros train',
                body: 'Real grass pitches. Real nets. A gym and a pool. All in one place.',
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
            'If you do, you pay less. That is because you already pay us during the year.',
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
        priceNote: 'This is the full price. Nothing is added on top. Flights cost extra — see below.',
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
        flightsBody2Known: (n) =>
            `Plan for about ${fmtAUD(n)} for the return flight. We will confirm the exact price when we ` +
            'send the link.',
        flightsBody3:
            'So you pay two things: the price above, and the flight. Plus a few small things on the list ' +
            'below. That is all.',

        includedHeading: 'What you get',
        includedNote: 'The same for both prices. Once you land, all of this is already paid for.',
        included: [
            {
                title: 'A bed for 7 nights',
                body:
                    'You share an air-conditioned room at the cricket centre. You fly in Saturday 19 ' +
                    'September and fly home Saturday 26 September.',
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
                    'Faiz Fazal played for India and captained a title-winning team. He coaches batting. ' +
                    'Romi Bhinder is the Rajasthan Royals team manager. Somi Bhinder coaches bowling.',
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
            'Any shots or doctor costs',
            'Spending money and gifts',
            'Extra washing past the six items',
        ],

        howHeading: 'How you pay',
        steps: (deposit) => [
            'Fill in the form below. It is free. It does not lock you in.',
            'We write back with your price, the dates you pay, and the flight link.',
            deposit
                ? `You pay ${fmtAUD(deposit)} to hold your spot. It comes off the price — it is not extra.`
                : 'You pay a deposit to hold your spot. It comes off the price — it is not extra. We will tell you how much and when.',
            'You pay the rest before you fly. We give you the dates.',
        ],
    },

    form: {
        badge: 'Sign Up',
        heading: 'Sign Up Your',
        headingAccent: 'Interest',
        lead: 'Fill this in and we will be in touch with everything you need to know.',
        tierHeading: 'Which Price Is Yours',
        tierLead: 'Pick the one that is you. This sets your price. We will check it and confirm it.',
        tierFootnote: 'plus the flight, booked through our group link',
    },
};

export const COPY = { standard: STANDARD, simple: SIMPLE };

export const getCopy = (simple) => (simple ? SIMPLE : STANDARD);

/**
 * Reading-level mode from the URL.
 *   ?read=simple   → simple copy
 *   ?read=standard → standard copy
 *   (absent)       → standard, and no toggle is shown to the public
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

    return { simple: mode === 'simple', showToggle: mode !== null, setMode: apply };
};

/** Tier list for rendering, merging the shared prices with the chosen variant. */
export const getTiers = (copy) =>
    TIER_KEYS.map((key) => ({ key, price: TIER_PRICES[key], ...copy.pricing.tiers[key] }));
