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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const { sendOrderConfirmation } = require('./_lib/orderEmail');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stripe Price ID for the IPL replica shirt — used to partition line items
// into IPL-supplier vs training-kit fulfillment paths.
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
  if (draftId) {
    // Try to update the draft row first (preserves the id used in localStorage).
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', draftId)
      .select('id');
    if (error) console.error(`${table} update by id failed:`, error);
    if (data && data.length) return data[0];
    // Draft row missing — fall through to upsert.
  }
  // Upsert by stripe_session_id (unique partial index per migration).
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

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: err.message });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  // Re-fetch the session expanded so we get full payment + card details.
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

  // Partition line items so each table only stores what's relevant to its fulfillment path.
  const { training: trainingItems, ipl: iplItems } = partitionLineItems(lineItems);

  const totalsForSubset = (subset) => {
    const subtotal = sumCents(subset);
    return {
      subtotal: subtotal / 100,
      shipping_cost: 0,                          // Stripe returns the combined shipping; per-bucket allocation not meaningful
      total: (subtotal + (session.shipping_cost?.amount_total || 0)) / 100,
    };
  };

  // Training path
  if (trainingItems.length > 0 || draftTrainingId) {
    await upsertOrder('shop_orders_training', {
      ...stripePayloadShared,
      items: trainingItems,
      ...totalsForSubset(trainingItems),
    }, draftTrainingId);
  }

  // IPL path
  if (iplItems.length > 0 || draftIplId) {
    await upsertOrder('shop_orders_ipl', {
      ...stripePayloadShared,
      items: iplItems,
      ...totalsForSubset(iplItems),
      supplier_status: 'awaiting_bulk_order',
    }, draftIplId);
  }

  // Fire Zapier → Google Sheets (optional, non-blocking)
  const zapierUrl = process.env.ZAPIER_SHOP_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
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

  // Resend confirmation email (non-blocking)
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
};
