// ============================================================
// Vercel Serverless Function — Get Stripe Payment Details
// GET /api/get-stripe-payment?session_id=cs_...
// ============================================================
// ADMIN-ONLY. Returns enriched Stripe data (customer email/phone,
// card brand/last4, address) for a Checkout Session — used by the
// admin shop dashboard to enrich displayed orders. Without auth,
// anyone could enumerate session IDs and exfiltrate PII.
//
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY        = sk_live_...
//   SUPABASE_SERVICE_ROLE_KEY (for verifyAdmin)
// ============================================================

import Stripe from 'stripe';
import { verifyAdmin } from './_lib/verifyAdmin.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await verifyAdmin(req);
  } catch (err) {
    const isAuth = err.code === 'AUTH';
    return res.status(isAuth ? 401 : 500).json({ error: err.message });
  }

  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent', 'payment_intent.latest_charge'],
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
      shipping_label: session.shipping_cost?.shipping_rate_details?.display_name || '',
      customer: {
        name: session.customer_details?.name || '',
        email: session.customer_details?.email || '',
        phone: session.customer_details?.phone || '',
      },
      shipping_address: session.shipping_details?.address || null,
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
