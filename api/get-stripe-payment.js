// ============================================================
// Vercel Serverless Function — Get Stripe Payment Details
// GET /api/get-stripe-payment?session_id=cs_...
// ============================================================
// Admin-only. Returns enriched Stripe data for the shop dashboard
// (line items, customer details, shipping address, card brand/last4,
// receipt URL). Stripe Checkout Session IDs leak via referrers and
// browser history, so this endpoint must verify the caller is an
// active dashboard user before returning the PII.
// Required env vars in Vercel:
//   STRIPE_SECRET_KEY
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ALLOWED_ORIGINS (optional, comma-separated)
// ============================================================

import Stripe from 'stripe';
import { verifyAdmin, setCors, sendError } from './_lib/auth.js';

let _stripe = null;
const getStripe = () => {
    if (_stripe) return _stripe;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key);
    return _stripe;
};

export default async function handler(req, res) {
    setCors(req, res, { allowMethods: 'GET, OPTIONS' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed');

    try {
        await verifyAdmin(req);
    } catch (err) {
        return sendError(res, 401, 'Unauthorised', err);
    }

    const { session_id } = req.query;
    if (!session_id || typeof session_id !== 'string' || !/^cs_[A-Za-z0-9_]+$/.test(session_id)) {
        return sendError(res, 400, 'Invalid request');
    }

    try {
        const stripe = getStripe();
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
        return sendError(res, 500, 'Internal server error', err);
    }
}
