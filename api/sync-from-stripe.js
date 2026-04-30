// ============================================================
// Vercel Serverless Function — Sync paid orders from Stripe → Supabase
// POST /api/sync-from-stripe   { days?: number, session_id?: string }
// ============================================================
// Walks through paid Stripe Checkout Sessions and upserts each one
// into shop_orders_training and/or shop_orders_ipl (partitioned by
// line item price). Useful for:
//   - Backfilling historical orders that pre-date this dashboard
//   - Recovering after a webhook secret rotation that dropped events
//   - Any future webhook delivery failure
//
// Auth: requires the caller's Supabase session JWT in the
// `authorization: Bearer <token>` header. Verifies the user is in
// dashboard_users with active=true before doing anything.
//
// Required env vars (Vercel):
//   STRIPE_SECRET_KEY
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy-init so a missing env var returns a clean JSON error instead of
// crashing the function at module load (which yields a "A server error
// has occurred" HTML page that the dashboard can't parse).
let _stripe = null;
const getStripe = () => {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set in Vercel env vars for this deployment');
  _stripe = new Stripe(key);
  return _stripe;
};

// Public Supabase project URL — same one already shipped in the frontend
// JS bundle. Used as a final fallback if no env var is set in Vercel.
// (The service role key, which IS a secret, must still come from env vars.)
const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || process.env.NEXT_PUBLIC_SUPABASE_URL
           || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars. In Vercel project Settings → Environment Variables, add it for Production (it is the long eyJ... JWT from your Supabase Dashboard → Settings → API → service_role), then redeploy.');
  _supabase = createClient(url, key);
  return _supabase;
};

const IPL_PRICE_ID = 'price_1TRJe7Io52UEA50yZ4i5OPwH';

const inferFulfillmentMethod = (label) => {
  const l = (label || '').toLowerCase();
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

const verifyAdmin = async (req) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('Missing bearer token');
  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) throw new Error('Invalid session');
  const { data: dashUser } = await sb
    .from('dashboard_users').select('email').eq('email', user.email).eq('active', true).single();
  if (!dashUser) throw new Error('Not authorised');
  return user.email;
};

const syncOneSession = async (sessionId) => {
  const stripe = getStripe();
  const supabase = getSupabase();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price', 'payment_intent', 'payment_intent.latest_charge'],
  });

  if (session.payment_status !== 'paid') {
    return { session_id: sessionId, skipped: true, reason: 'not_paid' };
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

  const shared = {
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
    paid_at:                  charge?.created ? new Date(charge.created * 1000).toISOString() : null,
    customer_name:            customerName,
    customer_email:           customerEmail,
    customer_phone:           customerPhone,
    shipping_address:         shippingAddress,
    fulfillment_method:       fulfillmentMethod,
    stripe_metadata:          session.metadata || null,
  };

  const { ipl, training } = partitionLineItems(lineItems);
  const totalsFor = (subset) => ({
    subtotal: sumCents(subset) / 100,
    shipping_cost: 0,
    total: (sumCents(subset) + (session.shipping_cost?.amount_total || 0)) / 100,
  });

  const results = { session_id: session.id, training: null, ipl: null };

  if (training.length > 0) {
    const { error } = await supabase
      .from('shop_orders_training')
      .upsert({ ...shared, items: training, ...totalsFor(training) }, { onConflict: 'stripe_session_id' });
    results.training = error ? { error: error.message } : 'upserted';
  }

  if (ipl.length > 0) {
    const { error } = await supabase
      .from('shop_orders_ipl')
      .upsert({ ...shared, items: ipl, ...totalsFor(ipl), supplier_status: 'awaiting_bulk_order' },
              { onConflict: 'stripe_session_id' });
    results.ipl = error ? { error: error.message } : 'upserted';
  }

  return results;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const adminEmail = await verifyAdmin(req);
    console.log(`sync-from-stripe initiated by ${adminEmail}`);

    const { days = 30, session_id } = req.body || {};

    // Single-session sync (e.g. user pasting in a Stripe session id)
    if (session_id) {
      const out = await syncOneSession(session_id);
      return res.status(200).json({ ok: true, single: out });
    }

    // Bulk sync: walk paid sessions in the last N days
    const stripe = getStripe();
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
    let lastId = null;
    let processed = 0;
    let synced = 0;
    let skipped = 0;
    const errors = [];

    while (true) {
      const params = { limit: 100, created: { gte: since } };
      if (lastId) params.starting_after = lastId;
      const page = await stripe.checkout.sessions.list(params);

      for (const s of page.data) {
        processed++;
        if (s.payment_status !== 'paid') { skipped++; continue; }
        try {
          await syncOneSession(s.id);
          synced++;
        } catch (e) {
          errors.push({ session_id: s.id, error: e.message });
        }
      }

      if (!page.has_more) break;
      lastId = page.data[page.data.length - 1].id;
    }

    return res.status(200).json({
      ok: true,
      window_days: days,
      processed, synced, skipped,
      errors,
    });
  } catch (err) {
    console.error('sync-from-stripe error:', err);
    return res.status(err.message?.includes('authoris') || err.message?.includes('session') || err.message?.includes('token') ? 401 : 500)
      .json({ error: err.message });
  }
}
