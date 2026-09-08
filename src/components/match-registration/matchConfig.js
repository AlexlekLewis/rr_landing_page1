// ─────────────────────────────────────────────────────────────
// MATCH REGISTRATION — CONFIG
//
// This page is deliberately generic so it can be reused for every
// future match block. To run the next one:
//   1. Update ACTIVE_MATCH below (name, dates, venue, price, Stripe link)
//   2. Point the Stripe Payment Link's after_completion redirect at
//      /match-registration/success
//   3. Nothing else changes — no new page, no new table.
//
// Registrations land in Supabase `match_registrations`, tagged with
// match_slug so each block's players stay separate.
// ─────────────────────────────────────────────────────────────

export const ACTIVE_MATCH = {
    slug: 'power-league-sept-2026',
    eyebrow: 'Royals Academy',
    name: 'Power League Matches',
    datesLabel: 'Monday 28 & Tuesday 29 September',

    venue: {
        name: 'North Balwyn Cricket Club, Macleay Park',
        address: '101 Belmore Rd, Balwyn North 3104',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=101+Belmore+Rd,+Balwyn+North+VIC+3104',
    },

    times: 'First matches 8:30am, finishing around 6:00pm. More details provided closer to the time.',
    format: 'T20 across two ovals — 4 games per player over the two days. Teams announced in the next week.',

    price: 196,
    priceLabel: '$196 for both days',
    priceNote: 'Covers both days.',

    // Stripe Payment Link. Opens in the SAME tab on purpose — see the note
    // in PaymentModal.jsx about the Instagram in-app browser blocking new tabs.
    paymentLink: 'https://buy.stripe.com/8x2aEX8vDaWFdhG8nN9Zm0G',

    deadlineLabel: 'Tuesday 15 September',
    deadlineNote: 'First come, first served. Places are limited.',

    wear: [
        'Royals training top',
        'White cricket trousers',
        'White pads',
        'Helmet and stem guard — both mandatory. No stem guard, no batting.',
        'Pink Royals hat ONLY. Royals caps will be available to purchase on the day.',
    ],

    bring: [
        'Standard playing equipment',
        'Plenty of water and sunscreen',
        'BYO food and drink — it\'s a long day and there\'s no canteen at this stage',
        'Pink or white balls depending on the age group',
    ],

    streaming: {
        partner: 'FrogBox',
        blurb:
            'We\'re thrilled to say FrogBox is coming on board as a partner, producing and streaming the matches — so family who can\'t make it to the ground can still watch.',
    },

    volunteers: {
        blurb:
            'We need volunteers across the two days — especially digital scorers, and a couple of people to help FrogBox with the streaming. No experience needed, we\'ll show you everything.',
        roles: [
            { value: 'digital-scoring', label: 'Digital scoring' },
            { value: 'frogbox-streaming', label: 'Helping FrogBox with the streaming' },
            { value: 'general', label: 'General help — put me anywhere' },
        ],
    },

    contactEmail: 'info@rramelbourne.com',
};

export const MIN_AGE = 6;
export const MAX_AGE = 21;
