// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session (Academy Shop)
// POST /api/create-checkout-session
// ============================================================
// Required environment variables (set in Vercel Dashboard):
//   STRIPE_SECRET_KEY         = sk_live_...
//   SUPABASE_SERVICE_ROLE_KEY = service role key (writes the order draft)
//   VITE_APP_URL              = https://rramelbourne.com (or your Vercel URL)
// ============================================================
// The server (not the browser) checks the cart, saves the order draft with every size and the
// pickup venue, then sends the sizes and venue to Stripe too. The webhook marks the draft paid.
// If the draft can't be saved, no checkout is created: a family must never pay for an order
// we can't see. See api/_lib/shopOrder.js for why.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { pickupLabel } from './_lib/pickupVenues.js';
import { validateCart, sizeSummary, stripeLineItems } from './_lib/shopOrder.js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

// Stripe Shipping Rate IDs
const STRIPE_SHIPPING_RATES = {
  standard: 'shr_1TROdrIo52UEA50yMijZecJJ',
  express:  'shr_1TROf8Io52UEA50yeADIIgxr',
};

let _stripe = null;
const getStripe = () => (_stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  _supabase = createClient(url, key);
  return _supabase;
};

/** Unit prices straight from Stripe, so the saved order matches what the family is charged. */
async function stripeUnitPrices(stripe, lines) {
  const ids = [...new Set(lines.map((l) => l.price_id))];
  const prices = await Promise.all(ids.map((id) => stripe.prices.retrieve(id)));
  return Object.fromEntries(prices.map((p) => [p.id, p.unit_amount]));
}

async function insertDraft(supabase, table, row) {
  const { data, error } = await supabase.from(table).insert([row]).select('id').single();
  if (error || !data?.id) throw new Error(`${table} draft failed: ${error?.message || 'no id'}`);
  return data.id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, fulfillment, pickupVenue } = req.body || {};
  const cart = validateCart({ items, fulfillment, pickupVenue });
  if (cart.error) return res.status(400).json({ error: cart.error });
  const { lines, mtoQty } = cart;

  try {
    const stripe = getStripe();
    const supabase = getSupabase();
    const unit = await stripeUnitPrices(stripe, lines);

    const isPickup = fulfillment === 'pickup';
    const venue = isPickup ? pickupVenue : null;

    const draftItems = (subset) => subset.map((l) => ({
      product_id: l.product_id,
      product_name: l.product_name,
      size: l.size,
      quantity: l.quantity,
      unit_price: unit[l.price_id],
      price_id: l.price_id,
    }));
    const draftRow = (subset) => {
      const subtotal = subset.reduce((s, l) => s + unit[l.price_id] * l.quantity, 0);
      return {
        items: draftItems(subset),
        fulfillment_method: fulfillment,
        pickup_venue: venue,
        subtotal,
        shipping_cost: 0,
        total: subtotal,
        payment_status: 'pending',
        source: 'academy-shop',
      };
    };

    // Same split as before: made-to-order items (IPL shirt, jacket) → shop_orders_ipl, the rest → training.
    const mto = lines.filter((l) => l.made_to_order);
    const stock = lines.filter((l) => !l.made_to_order);
    const iplOrderId = mto.length
      ? await insertDraft(supabase, 'shop_orders_ipl', { ...draftRow(mto), supplier_status: 'awaiting_bulk_order' })
      : '';
    const orderId = stock.length
      ? await insertDraft(supabase, 'shop_orders_training', { ...draftRow(stock), fulfillment_status: 'unfulfilled' })
      : '';

    const sizes = sizeSummary(lines);
    const shippingOptions = isPickup
      ? [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'aud' }, display_name: pickupLabel(venue) } }]
      : [{ shipping_rate: STRIPE_SHIPPING_RATES[fulfillment] }];

    const metadata = {
      source: 'academy-shop',
      order_id: orderId,
      ipl_order_id: iplOrderId,
      fulfillment_method: fulfillment,
      pickup_venue: venue || '',
      sizes,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      allow_promotion_codes: true,
      line_items: stripeLineItems(lines, fulfillment, mtoQty),
      shipping_options: shippingOptions,
      billing_address_collection: 'auto',
      shipping_address_collection: isPickup ? undefined : { allowed_countries: ['AU'] },
      phone_number_collection: { enabled: true },
      // Shown under the Pay button, so the family sees the sizes they're paying for.
      custom_text: { submit: { message: `Sizes: ${sizes}`.slice(0, 1200) } },
      metadata,
      success_url: `${BASE_URL}/academy-shop/success?session_id={CHECKOUT_SESSION_ID}&fulfillment=${fulfillment}&venue=${venue || ''}`,
      cancel_url: `${BASE_URL}/academy-shop`,
      payment_intent_data: {
        // The payment's description in Stripe (and on the receipt): what to pick, in which size.
        description: `Academy Shop: ${sizes}`.slice(0, 1000),
        metadata,
      },
    });

    // Link the drafts to the session so a sync or the webhook always finds them.
    await Promise.all([
      orderId && supabase.from('shop_orders_training').update({ stripe_session_id: session.id }).eq('id', orderId),
      iplOrderId && supabase.from('shop_orders_ipl').update({ stripe_session_id: session.id }).eq('id', iplOrderId),
    ].filter(Boolean));

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Academy Shop checkout error:', err);
    return res.status(500).json({ error: 'We could not start checkout. Please try again, or text us and we will sort it out.' });
  }
}
