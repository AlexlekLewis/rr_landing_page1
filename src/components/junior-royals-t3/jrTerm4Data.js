// Junior Royals — Term 4, 2026: every fact on /junior-royals lives here.
//
// Source: Alex, 3 Oct 2026 (approved review), and the two Term 4 net booking
// orders (RRA-T4-2026-MIC, RRA-T4-2026-CRN): Junior Royals on WEDNESDAYS,
// 6:00pm and 7:00pm groups, at both centres (now 5:00pm and 6:00pm, see below).
//
// UPDATED Alex, 5 Oct 2026: Term 4 STARTS WEDNESDAY 28 OCTOBER (nothing runs
// before it) — 8 Wednesdays, 28 Oct – 16 Dec — and Junior Royals is now ages
// 7 to 12. Players 13 and over are pointed to Performance Squads.
// No Term 4 at Hallam or Williamstown.
//
// PAID FROM 19 OCT 2026 (Alex: "Here is the official payment options for the
// Junior Royals program"). Two Stripe Payment Links, both in live mode, both
// with the training shirt as an adjustable line (a family that already has a
// shirt sets it to 0) and a "Confirm your location" field:
//   UPFRONT  $349 for all 8 weeks ("Save $10 and pay upfront"), plink_1US8PnIo52UEA50y1mEdWz1P;
//            card, Apple Pay, Afterpay, Klarna or Zip (dashboard, 20 Oct 2026).
//   WEEKLY   $44.95 a week, a subscription: first payment the day they book,
//            then every 7 days, "cancelled following the final session of
//            Term 4". plink_1US8NNIo52UEA50y5UuUuuyo; card, Apple Pay or Klarna.
// Both links' confirmation page is Stripe's DEFAULT (20 Oct 2026), so families
// are not sent back to /junior-royals/success until that is changed in Stripe.
// Neither checkout asks for the player, so the page saves the entry first
// (jr_term4_waitlist) and sends the row id to Stripe as client_reference_id;
// api/stripe-webhook.js marks the row paid.
//
// WEEKLY: Alex confirmed both links on 20 Oct 2026 ("these links are fine … make
// sure the copy reflects the 2 payment options"). It still opens on 27 Oct:
// - Alex, 19 Oct 2026: "the stripe link for weekly payments is wrong". It must
//   not go on the page until he confirms or replaces it.
// - It opens on Tuesday 27 October (Alex: "27th"). Before then a weekly plan
//   started now would charge 9 times for 8 sessions. NOTE: that date was set
//   when both centres ran Wednesdays. Mickleham now starts Monday 26 Oct, so
//   re-check the opening date per centre when the corrected link arrives.
//
// NIGHTS (Alex, 19 Oct 2026, final): MICKLEHAM MOVES TO MONDAYS ("I want to
// move Mickleham TO mondays 5-7pm"), 8 Mondays 26 Oct – 14 Dec. CRANBOURNE NORTH
// stays on Wednesdays, 8 Wednesdays 28 Oct – 16 Dec. Both 5:00pm – 7:00pm in two
// one-hour groups by age ("age groups balanced accordingly"). There is no
// Wednesday at Mickleham and no Monday at Cranbourne North.

export const UPFRONT_LINK = 'https://buy.stripe.com/14A14n4fn3ud0uU7jJ9Zm0Y';
export const WEEKLY_LINK = 'https://buy.stripe.com/7sYeVd9zH3udgtSavV9Zm0X';
export const WEEKLY_CONFIRMED = true;                        // Alex, 20 Oct 2026: "these links are fine"
export const WEEKLY_OPENS = new Date('2026-10-27T00:00:00+11:00'); // Tue 27 Oct, Melbourne
export const weeklyOpen = (now = new Date()) => WEEKLY_CONFIRMED && now >= WEEKLY_OPENS;

const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const PRICE = { upfront: 349, weekly: 44.95, shirt: 29.95 };
const WEEKLY_MAX = Math.round(PRICE.weekly * 8 * 100) / 100;          // 359.60

export const PAY_OPTIONS = {
    upfront: {
        key: 'upfront',
        title: 'Pay upfront',
        amount: money(PRICE.upfront),
        per: 'for all 8 weeks',
        detail: `One payment at checkout (card, Apple Pay, Afterpay, Klarna or Zip), ${money(Math.round((WEEKLY_MAX - PRICE.upfront) * 100) / 100)} less than paying weekly.`,
        link: UPFRONT_LINK,
        value: PRICE.upfront,
    },
    weekly: {
        key: 'weekly',
        title: 'Pay weekly',
        amount: money(PRICE.weekly),
        per: 'a week',
        detail: `A weekly direct debit, by card, Apple Pay or Klarna. The first payment is taken when you book, then one each week. The direct debit is cancelled at the end of term (8 weeks is ${money(WEEKLY_MAX)}).`,
        link: WEEKLY_LINK,
        value: PRICE.weekly,
    },
};

export const JR_T4 = {
    term: 'Term 4, 2026',
    weeks: 8,
    // The whole term, both centres: first Mickleham Monday to last Cranbourne Wednesday.
    datesLong: '26 October – 16 December',
    datesShort: '26 Oct – 16 Dec',
    ages: '7–12',
    ageMin: 7,
    ageMax: 12,
    factLine: 'Ages 7–12 · 5:00pm – 7:00pm (5:00pm or 6:00pm group) · 8 weeks · Mondays at Mickleham, Wednesdays at Cranbourne North',
    // Two ways to pay, always both on the page (Alex, 20 Oct 2026). Weekly opens 27 Oct.
    priceLine: `Two ways to pay: ${money(PRICE.upfront)} upfront for all 8 weeks, or ${money(PRICE.weekly)} a week. Prices incl. GST.`,
    priceLineBeforeWeekly: `Two ways to pay: ${money(PRICE.upfront)} upfront for all 8 weeks, or ${money(PRICE.weekly)} a week from Tuesday 27 October. Prices incl. GST.`,
    shirtLine: `Plus the Junior Royals training shirt, ${money(PRICE.shirt)} incl. GST, bought once at checkout. Players wear it at every session; if your player already has one, set the shirt to 0 at checkout.`,
    ctaLabel: 'Secure Your Place',
    stickyLabel: 'Secure Your Place · Term 4 from Mon 26 Oct',
    placeLine: 'Your place is booked once you have paid.',
    // AUTOMATIC RE-ENROLMENT, OPT-OUT (Alex, 20 Oct 2026): "it's an automatic enrolment
    // into the next term (opt out system) … we will be in touch to confirm. Direct debits
    // will be cancelled at the end of the term and restart at the beginning." The 2 weeks'
    // notice is Alex's (8 Oct 2026, NOTICE_WEEKS in the version 2 mock-up).
    renewTitle: 'Next term',
    renewLines: [
        'Enrolment is automatic: your player\'s place carries on into the next term unless you opt out.',
        'We\'ll be in touch before the next term starts to confirm your player\'s place.',
        'Weekly direct debits are cancelled at the end of each term and start again at the beginning of the next term.',
        'To opt out, email info@rramelbourne.com at least 2 weeks before the next term starts.',
    ],
    renewShort: 'Enrolment carries on into the next term automatically unless you opt out; we\'ll be in touch to confirm.',
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
            day: 'monday',
            night: 'Mondays',
            datesLong: '26 October – 14 December',
            datesShort: '26 Oct – 14 Dec',
            firstSessionLong: 'Monday 26 October',
            mapsUrl: 'https://maps.google.com/?q=Mickleham+Indoor+Sports+Centre+VIC',
            image: '/assets/jr-bundoora.png',
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
            // Alex, 19 Oct 2026: Mickleham moves to Mondays, 5:00pm – 7:00pm.
            times: '5:00pm – 7:00pm',
            groups: 'Two one-hour groups on the night, 5:00pm and 6:00pm, by age. We confirm your player\'s group by email.',
        },
        {
            value: 'cranbourne-north',
            region: 'South-East Melbourne',
            venue: 'Elite Cricket Centre',
            suburb: 'Cranbourne North',
            // Street address from PR #102.
            address: '30 Medley Dr, Cranbourne North, VIC 3977',
            day: 'wednesday',
            night: 'Wednesdays',
            datesLong: '28 October – 16 December',
            datesShort: '28 Oct – 16 Dec',
            firstSessionLong: 'Wednesday 28 October',
            mapsUrl: 'https://maps.google.com/?q=Elite+Cricket+Centre+30+Medley+Dr+Cranbourne+North+VIC',
            image: '/assets/jr-bundoora.png', // unchanged from the live card
            gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 60%, #E11F8F 100%)',
            // Alex, 19 Oct 2026: "Cranbourne offering 5pm-7pm age groups balanced accordingly".
            times: '5:00pm – 7:00pm',
            groups: 'Two one-hour groups on the night, 5:00pm and 6:00pm, by age. We confirm your player\'s group by email.',
        },
    ],
};
