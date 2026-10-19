// Junior Royals — Term 4, 2026: every fact on /junior-royals lives here.
//
// Source: Alex, 3 Oct 2026 (approved review), and the two Term 4 net booking
// orders (RRA-T4-2026-MIC, RRA-T4-2026-CRN): Junior Royals on WEDNESDAYS,
// 6:00pm and 7:00pm groups, at both centres.
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
//   UPFRONT  $349 for all 8 weeks ("Save $10 and pay upfront"), card or Zip.
//   WEEKLY   $44.95 a week, a subscription: first payment the day they book,
//            then every 7 days, "cancelled following the final session of
//            Term 4". Card or Klarna.
// Neither checkout asks for the player, so the page saves the entry first
// (jr_term4_waitlist) and sends the row id to Stripe as client_reference_id;
// api/stripe-webhook.js marks the row paid.
//
// WEEKLY IS OFF until two things are true (WEEKLY_CONFIRMED and the date):
// - Alex, 19 Oct 2026: "the stripe link for weekly payments is wrong". It must
//   not go on the page until he confirms or replaces it.
// - It opens on Tuesday 27 October (Alex: "27th"). Before then a weekly plan
//   started now would charge 9 times for 8 sessions.
//
// Wednesday only, at both centres. Cranbourne North runs 5:00pm – 7:00pm
// ("age groups balanced accordingly"), Mickleham 6:00pm – 8:00pm. Mondays
// 5:00pm – 7:00pm at Mickleham ONLY are an enquiry (no payment); not offered at
// Cranbourne North.

export const UPFRONT_LINK = 'https://buy.stripe.com/14A14n4fn3ud0uU7jJ9Zm0Y';
export const WEEKLY_LINK = 'https://buy.stripe.com/7sYeVd9zH3udgtSavV9Zm0X';
export const WEEKLY_CONFIRMED = false;                       // Alex: the weekly link is wrong
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
        detail: `One payment by card or Zip, ${money(Math.round((WEEKLY_MAX - PRICE.upfront) * 100) / 100)} less than paying weekly.`,
        link: UPFRONT_LINK,
        value: PRICE.upfront,
    },
    weekly: {
        key: 'weekly',
        title: 'Pay weekly',
        amount: money(PRICE.weekly),
        per: 'a week',
        detail: `By card or Klarna. The first payment is taken when you book, then one every 7 days, and they stop after the last session on 16 December: at most 8 payments, ${money(WEEKLY_MAX)} in total.`,
        link: WEEKLY_LINK,
        value: PRICE.weekly,
    },
};

export const JR_T4 = {
    term: 'Term 4, 2026',
    weeks: 8,
    datesLong: '28 October – 16 December',
    datesShort: '28 Oct – 16 Dec',
    firstSessionLong: 'Wednesday 28 October',
    night: 'Wednesdays',
    ages: '7–12',
    ageMin: 7,
    ageMax: 12,
    factLine: 'Ages 7–12 · Wednesdays · 8 weeks · Mickleham 6:00pm – 8:00pm · Cranbourne North 5:00pm – 7:00pm',
    priceLine: `${money(PRICE.upfront)} for all 8 weeks incl. GST, or ${money(PRICE.weekly)} a week incl. GST.`,
    priceLineUpfrontOnly: `${money(PRICE.upfront)} for all 8 weeks incl. GST.`,
    shirtLine: `Plus the Junior Royals training shirt, ${money(PRICE.shirt)} incl. GST, bought once at checkout. Players wear it at every session; if your player already has one, set the shirt to 0 at checkout.`,
    ctaLabel: 'Secure Your Place',
    stickyLabel: 'Secure Your Place · Term 4 from Wed 28 Oct',
    placeLine: 'Your place is booked once you have paid.',
    centresApart: 'The two centres are about 70 km apart, so pick the one you can get to every week.',
    // TWO CENTRES ONLY (Alex, 5 Oct 2026): "Hallam and Williamstown no longer exist
    // as part of the organisation for the moment." Don't name them on the page.
    twoCentres: 'Junior Royals runs at two centres: Mickleham Indoor Sports Centre in North Melbourne, and the Elite Cricket Centre in Cranbourne North, South-East Melbourne.',
    // Players older than 12 go to Performance Squads (Alex, 5 Oct 2026).
    olderLead: 'Aged 13 or older?',
    olderLinkLabel: 'See Performance Squads',
    olderRoute: '/performance-squads',
    // Mondays at Mickleham: an enquiry only (Alex, 19 Oct 2026).
    monday: {
        title: 'Mondays at Mickleham',
        times: '5:00pm – 7:00pm',
        lead: 'Want Monday nights instead? We take enquiries for Mondays, 5:00pm – 7:00pm, at Mickleham only.',
        formNote: 'No payment now and no place is held. We will contact you about Monday places at Mickleham.',
        done: "We've got your enquiry about Mondays at Mickleham. No payment has been taken and no place is held. We'll contact you about Monday places.",
        button: 'Enquire About Mondays',
    },
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
            times: '6:00pm – 8:00pm',
            groups: 'Two one-hour groups on the night, 6:00pm and 7:00pm, by age. We confirm your player\'s group by email.',
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
            // Alex, 19 Oct 2026: "Cranbourne offering 5pm-7pm age groups balanced accordingly".
            times: '5:00pm – 7:00pm',
            groups: 'Two one-hour groups on the night, 5:00pm and 6:00pm, by age. We confirm your player\'s group by email.',
        },
    ],
};
