// ============================================================
// Vercel Serverless Function — Stripe Webhook
// POST /api/stripe-webhook
// ============================================================
// Captures the full Stripe checkout + payment record into Supabase
// on every paid order. Resilient to a failed pre-checkout cart insert:
// if no order_id metadata is set, the webhook will INSERT a fresh row
// in the appropriate table (training vs IPL) by inspecting line items.
//
// Required environment variables in Vercel:
//   STRIPE_SECRET_KEY         = sk_live_...
//   STRIPE_WEBHOOK_SECRET     = whsec_...
//   VITE_SUPABASE_URL         = https://xxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY = eyJ...
//   RESEND_API_KEY            = re_...   (optional, enables auto emails)
//   ZAPIER_SHOP_WEBHOOK_URL   = ...      (optional)
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from './_lib/orderEmail.js';

// Stripe signature verification requires the *raw* request body. Vercel's
// default body parser returns a parsed object, which would always fail
// constructEvent. Disable it for this route.
export const config = {
  api: { bodyParser: false },
};

let _stripe = null;
const getStripe = () => {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key);
  return _stripe;
};

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('Supabase URL not set in Vercel env vars (try SUPABASE_URL or VITE_SUPABASE_URL)');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars');
  _supabase = createClient(url, key);
  return _supabase;
};

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const IPL_PRICE_ID = 'price_1TRJe7Io52UEA50yZ4i5OPwH';

const inferFulfillmentMethod = (shippingLabel) => {
  const l = (shippingLabel || '').toLowerCase();
  if (l.includes('pickup')) return 'pickup';
  if (l.includes('express')) return 'express';
  return 'standard';
};

const partitionLineItems = (lineItems) => {
  const ipl = [], training = [];
  for (const i of lineItems) {
    if (i.price_id === IPL_PRICE_ID) ipl.push(i);
    else training.push(i);
  }
  return { ipl, training };
};

const sumCents = (items) =>
  items.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 0), 0);

// Upsert by stripe_session_id. If a draft row exists (linked via metadata.order_id
// from the cart pre-insert), we update it. Otherwise, we insert a new row.
const upsertOrder = async (table, payload, draftId) => {
  const supabase = getSupabase();
  if (draftId) {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', draftId)
      .select('id');
    if (error) console.error(`${table} update by id failed:`, error);
    if (data && data.length) return data[0];
  }
  const { data, error } = await supabase
    .from(table)
    .upsert(payload, { onConflict: 'stripe_session_id' })
    .select('id');
  if (error) {
    console.error(`${table} upsert failed:`, error);
    return null;
  }
  return data?.[0] || null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  let event;
  let stripe;

  try {
    stripe = getStripe();
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: err.message });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items', 'line_items.data.price', 'payment_intent', 'payment_intent.latest_charge'],
    });
  } catch (err) {
    console.error('Session expansion failed:', err.message);
    return res.status(500).json({ error: 'Session expansion failed' });
  }

  const customerName    = session.customer_details?.name || '';
  const customerEmail   = session.customer_details?.email || '';
  const customerPhone   = session.customer_details?.phone || '';
  const shippingAddress = session.shipping_details?.address || null;
  const shippingLabel   = session.shipping_cost?.shipping_rate_details?.display_name || '';
  const fulfillmentMethod = inferFulfillmentMethod(shippingLabel);

  const lineItems = (session.line_items?.data || []).map(i => ({
    name: i.description,
    product_name: i.description,
    quantity: i.quantity,
    unit_price: i.price?.unit_amount,
    price_id: i.price?.id,
    total: i.amount_total,
  }));

  const charge = session.payment_intent?.latest_charge;
  const card = charge?.payment_method_details?.card;

  const stripePayloadShared = {
    payment_status:           'completed',
    stripe_session_id:        session.id,
    stripe_payment_intent_id: session.payment_intent?.id || null,
    stripe_charge_id:         charge?.id || null,
    card_brand:               card?.brand || null,
    card_last4:               card?.last4 || null,
    card_country:             card?.country || null,
    card_funding:             card?.funding || null,
    receipt_url:              charge?.receipt_url || null,
    amount_subtotal_cents:    session.amount_subtotal ?? null,
    amount_shipping_cents:    session.shipping_cost?.amount_total ?? 0,
    amount_tax_cents:         session.total_details?.amount_tax ?? 0,
    amount_total_cents:       session.amount_total ?? null,
    currency:                 session.currency || 'aud',
    paid_at:                  charge?.created ? new Date(charge.created * 1000).toISOString() : new Date().toISOString(),
    customer_name:            customerName,
    customer_email:           customerEmail,
    customer_phone:           customerPhone,
    shipping_address:         shippingAddress,
    fulfillment_method:       fulfillmentMethod,
    stripe_metadata:          session.metadata || null,
  };

  const draftTrainingId = session.metadata?.order_id || null;
  const draftIplId      = session.metadata?.ipl_order_id || null;

  const { training: trainingItems, ipl: iplItems } = partitionLineItems(lineItems);

  const totalsForSubset = (subset) => {
    const subtotal = sumCents(subset);
    return {
      subtotal: subtotal / 100,
      shipping_cost: 0,
      total: (subtotal + (session.shipping_cost?.amount_total || 0)) / 100,
    };
  };

  if (trainingItems.length > 0 || draftTrainingId) {
    await upsertOrder('shop_orders_training', {
      ...stripePayloadShared,
      items: trainingItems,
      ...totalsForSubset(trainingItems),
    }, draftTrainingId);
  }

  if (iplItems.length > 0 || draftIplId) {
    await upsertOrder('shop_orders_ipl', {
      ...stripePayloadShared,
      items: iplItems,
      ...totalsForSubset(iplItems),
      supplier_status: 'awaiting_bulk_order',
    }, draftIplId);
  }

  const zapierUrl = process.env.ZAPIER_SHOP_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id:       draftTrainingId || draftIplId || '',
          stripe_session: session.id,
          order_date:     new Date().toLocaleDateString('en-AU'),
          order_time:     new Date().toLocaleTimeString('en-AU'),
          customer_name:  customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          delivery_method: fulfillmentMethod === 'pickup'
            ? `Pickup — ${shippingLabel}`
            : fulfillmentMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
          shipping_address: shippingAddress
            ? `${shippingAddress.line1 || ''}, ${shippingAddress.city || ''} ${shippingAddress.postal_code || ''}, ${shippingAddress.country || ''}`.trim()
            : '',
          items: lineItems
            .filter(i => !i.name?.toLowerCase().includes('delivery') && !i.name?.toLowerCase().includes('shipping'))
            .map(i => `${i.name} x${i.quantity}`)
            .join(' | '),
          total_paid: `$${(session.amount_total / 100).toFixed(2)} AUD`,
        }),
      });
    } catch (e) { console.warn('Zapier failed (non-blocking):', e.message); }
  }

  try {
    await sendOrderConfirmation({
      to: customerEmail,
      customerName,
      items: lineItems,
      fulfillmentMethod,
      pickupVenue: session.metadata?.pickup_venue || null,
      shippingAddress,
      totalCents: session.amount_total,
      orderRef: draftTrainingId || draftIplId || session.id,
    });
    console.log('Confirmation email sent via Resend');
  } catch (e) {
    console.warn('Resend email failed (non-blocking):', e.message);
  }

  return res.status(200).json({ received: true });
}
