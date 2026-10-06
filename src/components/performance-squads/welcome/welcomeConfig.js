// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUAD WELCOME — CONFIG
//
// ONE generic page for every selected player, whatever their centre:
//   /performance-squads/welcome
// The player tells us their region in the confirm form, so the page itself
// never names a centre.
//
// SOURCE OF TRUTH for benefits, pricing and membership wording:
//   v8 Performance Squads Membership Overview (Season 2026/27). Don't add
//   claims here that the overview doesn't make.
//
// A value left as null is a detail that isn't confirmed yet. The page shows
// it as "to be confirmed", puts a DRAFT banner across the top listing what is
// missing, and the form saves nothing while the page is a draft. Fill every
// null and the banner goes away.
// ─────────────────────────────────────────────────────────────

import { MEMBER_PRICING_RULE, TERMS_MEMBERSHIP_CLAUSE, MEMBERSHIP } from '../data';

export const WELCOME = {
    // ── Still to come ──
    // Every selected player has this long from the moment they are notified to
    // confirm their place: register on this page, then complete the Joining Fee payment.
    confirmWindow: '72 hours',
    // Stripe Payment Link — Joining Fee PLUS the first $29.95 Squad Fee instalment.
    paymentLink: 'https://buy.stripe.com/8x23cvcLTc0J4LaeMb9Zm0L',

    // Kit is ordered on this page at PARTICIPANT prices (api/_lib/uniformPricing.js,
    // the same prices Power Game charges), NOT the Academy Shop's retail prices.
    // Orders land in the performance_squad_kit_orders table.
    kit: {
        // Every player must have, as a minimum:
        required: [
            'A training shirt',
            'A pair of training pants (recommended) and/or training shorts',
            'A cap',
        ],
    },

    contactEmail: 'alex.lewis@rramelbourne.com',

    // ── Pricing notes ── The AMOUNTS are not here: they come from Stripe via
    // /api/performance-squad-prices (see usePrices.js), so the page always shows
    // exactly what checkout charges. Only the wording lives in config.
    // Wording = Alex's 2 October 2026 framing, the same as the MembershipSection on
    // /performance-squads: a YEARLY membership, broken down for the family's
    // convenience into a weekly payment. Cancel any time, but rejoining means
    // paying the Joining Fee again.
    pricing: {
        weeksPerYear: MEMBERSHIP.weeksPerYear,
        joiningFee: { unit: 'one-off', note: 'Paid once, when you accept your squad place. Non-refundable.' },
        membership: { unit: 'a week' },
        matchFees: { amount: 'Per match', note: 'Set for each match, depending on whether it is played on turf or synthetic.' },
        // The match-fee line lives on its own card above, so it isn't repeated here.
        conditions: [
            'If payments stop without notice, there is a two-week grace period before your squad place is released.',
            'You must stay financial to receive member benefits and to be selected for matches.',
        ],
    },

    // ── Membership benefits (Membership Overview, 01–06) ──
    benefits: [
        { title: 'Weekly squad training', body: 'Weekly squad training with the Head Coach and a dedicated squad coach. Monday nights, every week from 5 October to 14 December — the courts are booked at both centres.' },
        { title: '5–10 T20 match days', body: 'Circa. average 1 a month from September to April (Season). Performance dependant.' },
        { title: 'Royals and guest coaches', body: 'Other Royals and guest coaches and players will join from time to time (online and in person).' },
        { title: 'Royals High Performance Centre camps', body: 'Invitation to attend multiple Rajasthan Royals operated camps at the Royals High Performance Centre in Nagpur.' },
        { title: 'Train with Royals Franchise teams', body: 'Select players receive the opportunity to train with Royals Franchise teams.' },
        { title: 'Global Royals Inter-Academy matches', body: 'Opportunity to play in Global Royals Inter-Academy matches and tournaments.' },
    ],

    squadDna: {
        ages: '10 – 25',
        body: 'Squads and teams are selected on a mixture of age, ability, physical maturity, experience, performance and other key criteria.',
        highlight: 'Age is not a limiting factor.',
    },

    selection: {
        body: 'Squad players are eligible for selection in Royals Academy matches — Power League and External Showcase.',
        note: "Selection is at the coaching staff's discretion. Not every player plays every game.",
    },

    // Year-round membership: what staying financial unlocks.
    memberPricing: {
        lead: 'Financial members receive special member pricing on our programs.',
        body: 'Members can choose to continue membership all year round. This holds your squad place, maintains member pricing and accumulates fees against other Academy programs, including:',
        programs: [
            { name: '12-week T20 Program', when: 'Flagship · April – July' },
            { name: 'Pre-Season Program', when: 'Dates to be confirmed' },
            { name: 'High Performance Centre Tour', when: 'September' },
            { name: 'Royals apparel and Partner Offers', when: 'Year round' },
        ],
        // The two-tier rule (programs while active; tours after six months) is
        // Alex's, 2 October 2026, on top of the v8 overview. Terms clause 13.
        note: `Full pricing on request. ${MEMBER_PRICING_RULE} See ${TERMS_MEMBERSHIP_CLAUSE} of our Terms & Conditions.`,
    },

    // ── Training and events (NOT match days — those are the fixture list) ──
    season: {
        // NOT the same time at both centres. Straight off the Term 4 net booking
        // orders issued to the venues on 23 Sep 2026 (RRA-T4-2026-MIC and
        // RRA-T4-2026-CRN): Mickleham squad training is 7:00–8:30 PM, because the
        // open age trial has the floor there 5:30–7:00 PM on opening night.
        // Cranbourne North takes the whole centre 6:00–9:00 PM.
        // The \u00a0 (non-breaking space) keeps "PM" on the same line as the time
        // on a narrow phone. timeNote shows on its own line underneath.
        // Squad training began Monday 5 October 2026, so the row reads "every
        // Monday" rather than a first date that has already been played.
        firstTraining: {
            year: 2026,
            date: 'Every Monday night',
            time: 'Mickleham 7:00–8:30\u00a0PM · Cranbourne North 6:00–9:00\u00a0PM',
            timeNote: 'Every Monday to 14 December. Times are subject to change and we will let you know if they do.',
        },
    },

    // ── Power League fixture list ── Alex, 3 October 2026: five match days, two
    // games each. Rules behind them: no Premier finals, a 24 Dec – 5 Jan blackout,
    // and nothing in the first three weeks of January (carnival season). The
    // last two are a two-day carnival in the final week of the school holidays;
    // Australia Day (Tue 26 Jan) falls between them. The juniors-only game at
    // Lower Plenty on Sun 11 Oct is not one of the five and is not listed here.
    fixtures: [
        { year: 2026, date: 'Sunday 25 October', first: true, venueAndTime: null },
        { year: 2026, date: 'Sunday 15 November' },
        { year: 2026, date: 'Sunday 13 December' },
        { year: 2027, date: 'Monday 25 January', note: 'Two-day carnival, day 1 · school holidays' },
        { year: 2027, date: 'Wednesday 27 January', note: 'Two-day carnival, day 2 · last day of the school holidays' },
    ],
    moreFixtures: 'More Power League and Showcase Match dates will be added. We will let you know as they are confirmed.',

    // The offer-only September games (28 and 29 September 2026, North Balwyn)
    // have been played. null switches the section off.
    septemberGames: null,

    // Shown on the success page and in the confirm step.
    afterConfirm: [
        'We will be in touch with your squad, your training night and everything else you need before the season starts.',
        'Training apparel is collected at squad training sessions — nothing is posted.',
    ],

    letter: {
        from: 'Alex Lewis',
        title: 'Head Coach and Director of Cricket',
        paragraphs: [
            'Our Royals Academy family in Melbourne has grown to more than 500 players across all our programs in 7 months. We had a huge response to the Performance Squad trials, and you are one of the players we selected.',
            'I have worked in cricket academy programs for more than 20 years. At the Royals, we believe this program is the most important part of how a player gets better.',
            'Playing as well in a match as you do in the nets is one of the hardest things in cricket. This program helps you build the skills to do it.',
            'Every session and every match is a chance to learn. We want you to be brave, try new things and back yourself. At the Royals, we say "Courage over comfort." It means being brave, even when something feels hard.',
        ],
    },
};

// The region a player was selected in. Saved to centre_slug / venue_name so a
// confirmation is identifiable at a glance. Same slugs the trial tables use.
export const REGIONS = [
    { slug: 'north-melbourne', name: 'North Melbourne', venue: 'Mickleham Indoor Sports Centre' },
    { slug: 'south-east-melbourne', name: 'South-East Melbourne', venue: 'Elite Cricket Centre, Cranbourne North' },
];

export const PLAYER_IMAGE = '/assets/performance-squads/selected-player-fist-pump.png';
// Royals war cry wordmark, white on transparent (from the RRA standee artwork).
export const HALLA_BOL = '/assets/performance-squads/halla-bol-white.png';

// What would stop the page working for a real family. Anything else that is not
// yet known (a venue, a time) simply shows as a "to be confirmed" chip.
// While this returns anything, the confirm form walks through without saving.
export const getMissingDetails = (c) => {
    const missing = [];
    if (!c.paymentLink) missing.push('Joining Fee payment link');
    return missing;
};
