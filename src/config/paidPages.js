// ─────────────────────────────────────────────────────────────
// EVERY PAGE THAT SELLS SOMETHING, and how it takes the money.
//
// Rule (Alex, 2 Oct 2026): a page with a price on it must be able to take the
// payment and must land the parent on a success page afterwards. Sid juniors
// went live with a $30 price and no way to pay; the open trial's success page
// still described a trial from August.
//
// src/config/payments.guard.test.ts checks every entry below, and
// `npm run build` runs it first, so a page that breaks the rule fails the
// deploy instead of going live.
//
// How a new paid page gets its payment, in order of preference:
//   1. 'checkout' — add a product to api/_lib/checkoutCatalog.js, save the
//      booking row with an id from newBookingId(), then call startCheckout()
//      (src/lib/startCheckout.js). Price, success page and webhook are all
//      wired in code; nothing to set up in the Stripe Dashboard.
//   2. 'paymentLinks' — a Stripe Payment Link per price. Only if Checkout
//      cannot work. Its after-payment redirect must be set to the success
//      route by hand in the Stripe Dashboard: the guard cannot see that, so
//      test it with a real payment.
//
// Fields: route, successRoute, payWith ('checkout' | 'paymentLinks'), and
// products (checkout keys) for 'checkout'.
// ─────────────────────────────────────────────────────────────

export const PAID_PAGES = [
    {
        route: '/sid-juniors',
        successRoute: '/sid-juniors/success',
        payRoute: '/sid-juniors/pay',
        payWith: 'checkout',
        products: ['sid-juniors-cranbourne-north', 'sid-juniors-mickleham'],
    },
    {
        route: '/performance-squads-open-trial',
        // Set as the after-payment redirect on each trial Payment Link in
        // performance-squads/data.js PAYMENT_LINKS, with ?centre=<slug>.
        successRoute: '/performance-squads/success',
        payWith: 'paymentLinks',
    },
];
