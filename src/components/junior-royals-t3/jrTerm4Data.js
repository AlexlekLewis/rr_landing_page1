// Junior Royals — Term 4, 2026: every fact on /junior-royals lives here.
//
// Source: Alex, 3 Oct 2026 (approved review), and the two Term 4 net booking
// orders (RRA-T4-2026-MIC, RRA-T4-2026-CRN): Junior Royals on WEDNESDAYS,
// 6:00pm and 7:00pm groups, at both centres.
//
// UPDATED Alex, 5 Oct 2026: Term 4 STARTS WEDNESDAY 28 OCTOBER (nothing runs
// before it) — 8 Wednesdays, 28 Oct – 16 Dec — and Junior Royals is now ages
// 7 to 12. Players 13 and over are pointed to Performance Squads.
// No Monday sessions. No Term 4 at Hallam or Williamstown.
//
// NO TERM 4 PRICE IS SET. Until it is, the page takes entries only (no price,
// no "$", no payment). When a price is set, the page needs a real checkout
// (see the shared Checkout, PR #104) — do not bring back the old Term 3
// Stripe links.
//
// REVIEW 16 Dec 2026 — the last session. Everything below is out of date
// after that.

export const JR_T4 = {
    term: 'Term 4, 2026',
    weeks: 8,
    datesLong: '28 October – 16 December',
    datesShort: '28 Oct – 16 Dec',
    firstSessionLong: 'Wednesday 28 October',
    night: 'Wednesdays',
    times: '6:00pm – 8:00pm',
    groupTimes: '6:00pm or 7:00pm group',
    ages: '7–12',
    ageMin: 7,
    ageMax: 12,
    factLine: 'Ages 7–12 · Wednesdays 6:00pm – 8:00pm (6:00pm or 7:00pm group) · 8 weeks',
    ctaLabel: 'Register Your Interest',
    stickyLabel: 'Register Your Interest · Term 4 from Wed 28 Oct',
    noPaymentLine: "No payment now. No place is held yet. We'll email you the price and how to book.",
    centresApart: 'The two centres are about 70 km apart, so pick the one you can get to every week.',
    // TWO CENTRES ONLY (Alex, 5 Oct 2026): "Hallam and Williamstown no longer exist
    // as part of the organisation for the moment." Don't name them on the page.
    twoCentres: 'Junior Royals runs at two centres: Mickleham Indoor Sports Centre in North Melbourne, and the Elite Cricket Centre in Cranbourne North, South-East Melbourne.',
    // Players older than 12 go to Performance Squads (Alex, 5 Oct 2026).
    olderLead: 'Aged 13 or older?',
    olderLinkLabel: 'See Performance Squads',
    olderRoute: '/performance-squads',
    centres: [
        {
            value: 'mickleham',
            region: 'North Melbourne',
            venue: 'Mickleham Indoor Sports Centre',
            suburb: 'Mickleham',
            address: 'Mickleham, VIC',
            mapsUrl: 'https://maps.google.com/?q=Mickleham+Indoor+Sports+Centre+VIC',
            image: '/assets/jr-bundoora.png',
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        },
        {
            value: 'cranbourne-north',
            region: 'South-East Melbourne',
            venue: 'Elite Cricket Centre',
            suburb: 'Cranbourne North',
            // Street address from PR #102.
            address: '30 Medley Dr, Cranbourne North, VIC 3977',
            mapsUrl: 'https://maps.google.com/?q=Elite+Cricket+Centre+30+Medley+Dr+Cranbourne+North+VIC',
            image: '/assets/jr-bundoora.png', // unchanged from the live card
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 60%, #E11F8F 100%)',
        },
    ],
};
