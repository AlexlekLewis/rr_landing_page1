// ============================================================
// THE CHECKOUT CATALOGUE — every one-off product a page sells through
// /api/program-checkout.
//
// Why this exists: pages kept going live with a price on them and no way to
// pay (Sid juniors, Oct 2026: 11 bookings, $0 taken). A Stripe Payment Link
// needs someone to create it in the Dashboard AND set its after-payment
// redirect by hand, and either step is easy to forget. A product listed here
// needs neither: the price, the success page and the cancel page are all set
// in code, the checkout is created on the server, and api/stripe-webhook marks
// the booking row paid.
//
// TO SELL A NEW THING: add an entry here, add its success route to
// src/App.jsx, and list the page in src/config/paidPages.js. The payments
// guard (src/__tests__/payments.guard.test.js, run by `npm run build`) fails
// the build if any of those is missing.
//
// Fields:
//   name         what the parent sees on the Stripe checkout and receipt
//   amountCents  price per booking, in cents (AUD). The server's number is the
//                one charged; the page's number is only displayed.
//   table        the table holding the booking row (looked up by id)
//   slugColumn   the column that says which product a row is for
//   slugs        row slugs this product may be paid against (a booking request
//                row and a pay-to-book row)
//   paidSlug     on payment the row's slug is set to this, so paid bookings
//                and unpaid requests never mix
//   successPath  where Stripe sends the parent after paying
//   payPath      the page that restarts payment for an existing booking
//                (also where a cancelled checkout returns)
// ============================================================

export const CHECKOUT_PRODUCTS = {
    'sid-juniors-cranbourne-north': {
        name: 'Junior session with Siddhartha Lahiri, Sun 4 Oct 2026, Cranbourne North',
        amountCents: 3000,
        table: 'match_registrations',
        slugColumn: 'match_slug',
        slugs: ['sid-juniors-2026-10-04-cranbourne-north', 'sid-juniors-2026-10-04-cranbourne-north-request'],
        paidSlug: 'sid-juniors-2026-10-04-cranbourne-north',
        successPath: '/sid-juniors/success?session=cranbourne-north',
        payPath: '/sid-juniors/pay',
    },
    'sid-juniors-mickleham': {
        name: 'Junior session with Siddhartha Lahiri, Mon 5 Oct 2026, Mickleham',
        amountCents: 3000,
        table: 'match_registrations',
        slugColumn: 'match_slug',
        slugs: ['sid-juniors-2026-10-05-mickleham', 'sid-juniors-2026-10-05-mickleham-request'],
        paidSlug: 'sid-juniors-2026-10-05-mickleham',
        successPath: '/sid-juniors/success?session=mickleham',
        payPath: '/sid-juniors/pay',
    },
};

// Tables the webhook is allowed to mark paid. Every product's table must be
// here, and each must have `paid` (boolean) and `paid_at` (timestamptz).
export const PAYABLE_TABLES = new Set(['match_registrations']);

export const getProduct = (key) => (Object.prototype.hasOwnProperty.call(CHECKOUT_PRODUCTS, key)
    ? CHECKOUT_PRODUCTS[key]
    : null);

// The product a stored row belongs to, worked out from its slug. Lets a parent
// pay for a booking made before the page took payment, from the booking id alone.
export const productKeyForSlug = (slug) => Object.keys(CHECKOUT_PRODUCTS)
    .find((k) => CHECKOUT_PRODUCTS[k].slugs.includes(slug)) || null;
