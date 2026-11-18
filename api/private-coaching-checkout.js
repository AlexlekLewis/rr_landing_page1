/* global process */
// ============================================================
// POST /api/private-coaching-checkout  { id }
// Royals Private Coaching: pay at booking (Andy, 18 Nov 2026).
//
// The booking form saves the row (premium_private_coaching_requests), then calls this with
// its id. Here, on the server:
//   1. re-read the booking and work out the price from TIER_PRICES (never from the browser);
//   2. HOLD the chosen hours for 30 minutes so nobody else can buy them while this family
//      pays; if any hour was just taken, release ours and answer 409 so the family can
//      choose again;
//   3. open a Stripe Checkout Session (sessions + training shirt if ordered), expiring when
//      the hold does, with the booking id as client_reference_id;
//   4. answer { url } and the browser goes to Stripe.
// api/stripe-webhook.js marks the booking paid and the hours booked.
//
// Env: STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, VITE_APP_URL (optional).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { bookingCheckout, toStripeLineItems, successUrl, SOURCE_BOOKING, HOLD_MINUTES } from './_lib/privateCoachingPayment.js';
import { ROUTE } from '../src/components/premium-coaching/premiumCoachingData.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const TABLE = 'premium_private_coaching_requests';

const baseFor = (req) => {
    // Preview deployments send families back to the preview, not the live site.
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host && /\.vercel\.app$/.test(host) ? `https://${host}` : BASE_URL;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const id = String(req.body?.id || '');
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'bad id' });
    if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Payments are not set up.' });

    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: row, error } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error || !row) return res.status(404).json({ error: 'Booking not found.' });
    if (row.payment_status === 'paid') return res.status(409).json({ error: 'This booking is already paid.' });
    if (Date.now() - new Date(row.created_at).getTime() > 60 * 60 * 1000) return res.status(410).json({ error: 'This booking has expired. Please book again.' });

    const pay = bookingCheckout(row);
    if (pay.error) return res.status(400).json({ error: pay.error });

    // Hold the chosen hours (open, or held by a lapsed hold, or already ours).
    const now = new Date();
    const until = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000 + 60 * 1000).toISOString();
    let held = 0;
    for (const s of row.selected_slots) {
        const { data } = await sb.from('private_coaching_availability')
            .update({ status: 'held', held_until: until, held_by: id })
            .eq('coach_slug', row.coach_slug).eq('centre', row.centre).eq('date', s.date).eq('start_time', `${s.start}:00`)
            .or(`status.eq.open,and(status.eq.held,held_until.lt.${now.toISOString()}),held_by.eq.${id}`)
            .select('id');
        held += data?.length || 0;
    }
    if (held !== row.selected_slots.length) {
        await sb.from('private_coaching_availability').update({ status: 'open', held_until: null, held_by: null }).eq('held_by', id).eq('status', 'held');
        return res.status(409).json({ error: 'Sorry, one of those times was just booked by someone else. Please choose again.' });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const base = baseFor(req);
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: toStripeLineItems(pay.items),
            client_reference_id: id,
            customer_email: row.email,
            metadata: { source: SOURCE_BOOKING, booking_id: id, coach: row.coach_slug, centre: row.centre, sessions: String(row.package_sessions) },
            expires_at: Math.floor(now.getTime() / 1000) + HOLD_MINUTES * 60,
            success_url: successUrl(base, id),
            cancel_url: `${base}${ROUTE}?cancelled=1#request`,
        });
        await sb.from(TABLE).update({ payment_status: 'sent_to_stripe', stripe_session_id: session.id }).eq('id', id);
        return res.status(200).json({ url: session.url });
    } catch (e) {
        await sb.from('private_coaching_availability').update({ status: 'open', held_until: null, held_by: null }).eq('held_by', id).eq('status', 'held');
        return res.status(502).json({ error: `Payment could not start: ${e.message}` });
    }
}
