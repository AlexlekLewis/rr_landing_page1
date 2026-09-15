// ============================================================
// Performance Squad program prices — read from Stripe, never hard-coded.
//
// The Joining Fee (one-off) and Squad Fee (weekly) are the two prices on the
// Joining Fee Payment Link. Whoever edits that link in the Stripe Dashboard
// changes both what the site displays and what checkout charges.
// Cached per serverless instance.
// ============================================================
import Stripe from 'stripe';

// Must match welcomeConfig.paymentLink.
export const PAYMENT_LINK_URL = 'https://buy.stripe.com/8x23cvcLTc0J4LaeMb9Zm0L';

let cache = null;
let cachedAt = 0;
const TTL_MS = 10 * 60 * 1000;

export async function getProgramPrices(stripe = new Stripe(process.env.STRIPE_SECRET_KEY)) {
    if (cache && Date.now() - cachedAt < TTL_MS) return cache;

    let link = null;
    for await (const pl of stripe.paymentLinks.list({ limit: 100 })) {
        if (pl.url === PAYMENT_LINK_URL) { link = pl; break; }
    }
    if (!link) throw new Error('Joining Fee payment link not found in Stripe');

    const items = await stripe.paymentLinks.listLineItems(link.id, { limit: 10, expand: ['data.price'] });
    let joining = null;
    let squad = null;
    for (const li of items.data) {
        if (li.price?.recurring) squad = li.price;
        else joining = li.price;
    }
    if (!joining || !squad) throw new Error('Payment link is missing the joining fee or the weekly squad fee');

    cache = {
        joiningFee: { priceId: joining.id, cents: joining.unit_amount, currency: joining.currency },
        squadFee: {
            priceId: squad.id,
            cents: squad.unit_amount,
            currency: squad.currency,
            interval: squad.recurring.interval,            // 'week'
            intervalCount: squad.recurring.interval_count, // 1
        },
    };
    cachedAt = Date.now();
    return cache;
}
