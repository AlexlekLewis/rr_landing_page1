// ============================================================
// Vercel Serverless Function — Get Stripe Payment Details
// GET /api/get-stripe-payment?session_id=cs_...
// ============================================================
// Returns enriched Stripe data for the admin shop dashboard:
//   - line items (name, quantity, unit_price, total)
//   - customer details (name, email, phone)
//   - shipping address & cost
//   - payment intent (charge id, card brand/last4, receipt URL, status)
//   - amounts (subtotal, shipping, tax, total)
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY = sk_live_...
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

// Customer payment details: dashboard staff only (same check as /api/sync-from-stripe).
// Until 15 Nov 2026 this answered anyone who had a session id.
async function verifyAdmin(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return false;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK, key);
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user?.email) return false;
  const { data } = await sb.from('dashboard_users').select('email').eq('email', user.email).eq('active', true).maybeSingle();
  return Boolean(data);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!(await verifyAdmin(req))) return res.status(401).json({ error: 'Not authorised' });
  } catch (err) {
    console.error('get-stripe-payment auth failed:', err.message);
    return res.status(500).json({ error: 'Auth check failed' });
  }

  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent', 'payment_intent.latest_charge', 'shipping_cost.shipping_rate'],
    });

    const charge = session.payment_intent?.latest_charge;
    const card = charge?.payment_method_details?.card;

    const lineItems = (session.line_items?.data || []).map(i => ({
      name: i.description,
      quantity: i.quantity,
      unit_price: i.price?.unit_amount,
      currency: i.currency,
      total: i.amount_total,
    }));

    return res.status(200).json({
      session_id: session.id,
      payment_status: session.payment_status,
      created: session.created,
      currency: session.currency,
      amount_subtotal: session.amount_subtotal,
      amount_total: session.amount_total,
      amount_shipping: session.shipping_cost?.amount_total ?? 0,
      shipping_label: session.shipping_cost?.shipping_rate?.display_name || '',
      sizes: session.metadata?.sizes || '',
      customer: {
        name: session.customer_details?.name || '',
        email: session.customer_details?.email || '',
        phone: session.customer_details?.phone || '',
      },
      shipping_address: session.collected_information?.shipping_details?.address || session.shipping_details?.address || null,
      line_items: lineItems,
      payment: charge ? {
        charge_id: charge.id,
        status: charge.status,
        receipt_url: charge.receipt_url,
        card_brand: card?.brand || null,
        card_last4: card?.last4 || null,
        card_country: card?.country || null,
      } : null,
      metadata: session.metadata || {},
    });
  } catch (err) {
    console.error('get-stripe-payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
