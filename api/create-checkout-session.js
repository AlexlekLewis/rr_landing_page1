// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session
// POST /api/create-checkout-session
// ============================================================
// Required environment variables (set in Vercel Dashboard):
//   STRIPE_SECRET_KEY = sk_live_...
//   VITE_APP_URL      = https://rramelbourne.com (or your Vercel URL)
// ============================================================

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map product IDs to live Stripe Price IDs
const PRICE_MAP = {
  'ipl-replica-shirt': 'price_1TRJe7Io52UEA50yZ4i5OPwH',
  'training-shirt':    'price_1TRJinIo52UEA50yaIwEA8Ni',
  'training-shorts':   'price_1TRJqhIo52UEA50ycGPuIieZ',
  'training-pants':    'price_1TRJt4Io52UEA50ydwZmfUKh',
  'pink-cap':          'price_1TRNozIo52UEA50yEkWYWKAq',
  'fleece-jacket':     'price_1TRNwaIo52UEA50yIChLyg1J',
};

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, fulfillment, orderId, iplOrderId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Build Stripe line items from cart
    const lineItems = items.map(item => {
      const priceId = PRICE_MAP[item.product_id];
      if (!priceId) throw new Error(`Unknown product: ${item.product_id}`);
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });

    // Stripe Shipping Rate IDs
    const STRIPE_SHIPPING_RATES = {
      standard: 'shr_1TROdrIo52UEA50yMijZecJJ',
      express:  'shr_1TROf8Io52UEA50yeADIIgxr',
    };

    const { pickupVenue, mtoSurcharge, mtoQty } = req.body;
    let shippingOptions;
    if (fulfillment === 'pickup') {
      const venueLabel = pickupVenue === 'bundoora'
        ? 'Academy Pickup — Cutting Edge Cricket, Bundoora (Tue & Thu, 5:00pm–9:00pm)'
        : pickupVenue === 'hallam'
          ? 'Academy Pickup — Cricket Connect, Hallam (Mon, 5:30pm–8:30pm)'
          : 'Academy Pickup';
      shippingOptions = [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'aud' },
          display_name: venueLabel,
        },
      }];
    } else {
      // Standard or Express — use real Stripe Shipping Rate IDs
      shippingOptions = [{ shipping_rate: STRIPE_SHIPPING_RATES[fulfillment] }];
    }

    // Collect shipping address for standard/express only
    

    // Add MTO per-item surcharge as line item when shipping (not pickup)
    if (fulfillment !== 'pickup' && mtoSurcharge && mtoSurcharge > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          unit_amount: 1200,
          product_data: {
            name: 'Made-to-Order Delivery Surcharge',
            description: `Separate international delivery for ${mtoQty} made-to-order item${mtoQty > 1 ? 's' : ''}`,
          },
        },
        quantity: mtoQty,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_options: shippingOptions,
      // Collect customer details
      billing_address_collection: 'auto',
      shipping_address_collection: fulfillment !== 'pickup'
        ? { allowed_countries: ['AU'] }
        : undefined,
      phone_number_collection: { enabled: true },
      // Pass order IDs through to success page via metadata. The `source` tag
      // is the primary signal used by the webhook + sync endpoints to
      // distinguish shop orders from program registrations.
      metadata: {
        source: 'academy-shop',
        order_id: orderId || '',
        ipl_order_id: iplOrderId || '',
        fulfillment_method: fulfillment,
      },
      // Redirect URLs
      success_url: `${BASE_URL}/academy-shop/success?session_id={CHECKOUT_SESSION_ID}&fulfillment=${fulfillment}&venue=${pickupVenue || ''}`,
      cancel_url: `${BASE_URL}/academy-shop`,
      // Payment settings
      payment_intent_data: {
        metadata: {
          order_id: orderId || '',
          ipl_order_id: iplOrderId || '',
        },
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe Checkout Session error:', err);
    return res.status(500).json({ error: err.message });
  }
}
