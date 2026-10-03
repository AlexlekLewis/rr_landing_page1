// Junior Royals — Term 4, 2026: every fact on /junior-royals lives here.
//
// Source: Alex, 3 Oct 2026 (approved review), and the two Term 4 net booking
// orders (RRA-T4-2026-MIC, RRA-T4-2026-CRN): Junior Royals on WEDNESDAYS,
// 6:00pm and 7:00pm groups, 11 weeks, 7 Oct – 16 Dec, at both centres.
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
    weeks: 11,
    datesLong: '7 October – 16 December',
    datesShort: '7 Oct – 16 Dec',
    firstSessionLong: 'Wednesday 7 October',
    night: 'Wednesdays',
    times: '6:00pm – 8:00pm',
    groupTimes: '6:00pm or 7:00pm group',
    ages: '7–15',
    ageMin: 7,
    ageMax: 15,
    factLine: 'Ages 7–15 · Wednesdays 6:00pm – 8:00pm (6:00pm or 7:00pm group) · 11 weeks',
    ctaLabel: 'Register Your Interest',
    stickyLabel: 'Register Your Interest · Term 4 from Wed 7 Oct',
    noPaymentLine: "No payment now. No place is held yet. We'll email you the price and how to book.",
    centresApart: 'The two centres are about 70 km apart, so pick the one you can get to every week.',
    notRunning: "Term 4 isn't running at Hallam or Williamstown.",
    // South-east program moved from Hallam to Cranbourne North (Alex, 30 Sep
    // 2026: "cranbourne north is the centre"). Folded in from PR #102.
    movedFromHallam: 'Our south-east program has moved from Hallam to the Elite Cricket Centre in Cranbourne North.',
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
