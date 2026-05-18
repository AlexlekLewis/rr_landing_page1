// ============================================================
// Vercel Serverless Function — Manual Order Confirmation Email
// POST /api/send-confirmation  { order_id, source }
// source: 'training' | 'ipl'
// ============================================================
// Admin-only. Triggered by the "Send confirmation email" button in
// the shop dashboard. Looks up the order in Supabase, then sends the
// same template the auto-webhook uses, via Resend.
// Required env vars in Vercel:
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL (optional)
//   ALLOWED_ORIGINS (optional, comma-separated)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from './_lib/orderEmail.js';
import { verifyAdmin, setCors, sendError } from './_lib/auth.js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
    if (_supabase) return _supabase;
    const url = process.env.SUPABASE_URL
             || process.env.VITE_SUPABASE_URL
             || process.env.NEXT_PUBLIC_SUPABASE_URL
             || SUPABASE_URL_FALLBACK;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    _supabase = createClient(url, key);
    return _supabase;
};

export default async function handler(req, res) {
    setCors(req, res, { allowMethods: 'POST, OPTIONS' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

    // Auth first. Same generic 401 whether the caller is missing a
    // token or has one but isn't an active dashboard user — don't let
    // this endpoint be a probe for who has admin access.
    try {
        await verifyAdmin(req);
    } catch (err) {
        return sendError(res, 401, 'Unauthorised', err);
    }

    const { order_id, source } = req.body || {};
    if (!order_id || typeof order_id !== 'string') {
        return sendError(res, 400, 'Invalid request');
    }
    if (source !== 'training' && source !== 'ipl') {
        return sendError(res, 400, 'Invalid request');
    }

    try {
        const supabase = getSupabase();
        const table = source === 'ipl' ? 'shop_orders_ipl' : 'shop_orders_training';
        const { data: order, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', order_id)
            .single();

        // Collapse not-found vs lookup error into a single generic
        // response so the endpoint can't be used to enumerate order IDs.
        if (error || !order || !order.customer_email) {
            return sendError(res, 404, 'Order not eligible', error);
        }

        await sendOrderConfirmation({
            to: order.customer_email,
            customerName: order.customer_name,
            items: order.items || [],
            fulfillmentMethod: order.fulfillment_method,
            pickupVenue: order.pickup_venue,
            shippingAddress: order.shipping_address,
            totalCents: order.total,
            orderRef: order.id,
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', err);
    }
}
