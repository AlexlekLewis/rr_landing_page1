// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session
// for the Power Game Program selection.
// POST /api/create-pgp-checkout
// ============================================================
// Required environment variables (set in Vercel Dashboard):
//   STRIPE_SECRET_KEY = sk_live_...
//   VITE_APP_URL      = https://rramelbourne.com (or Vercel URL)
//   PGP_STRIPE_PRICE_ID = price_...  (the Power Game program price)
// ============================================================

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const PRICE_ID = process.env.PGP_STRIPE_PRICE_ID || '';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!PRICE_ID) {
        return res.status(503).json({ error: 'Checkout not configured yet — pricing is being finalised.' });
    }

    try {
        const { venueId, venue, ageGroup, day, time } = req.body || {};
        if (!venueId || !ageGroup) {
            return res.status(400).json({ error: 'Missing selection details.' });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            allow_promotion_codes: true,
            line_items: [{ price: PRICE_ID, quantity: 1 }],
            billing_address_collection: 'auto',
            phone_number_collection: { enabled: true },
            custom_fields: [
                { key: 'player_name', label: { type: 'custom', custom: 'Player full name' }, type: 'text' },
                { key: 'player_dob', label: { type: 'custom', custom: 'Player date of birth (DD/MM/YYYY)' }, type: 'text' },
            ],
            metadata: {
                source: 'power-game-program',
                venue_id: venueId,
                venue: venue || '',
                age_group: ageGroup || '',
                session_day: day || '',
                session_time: time || '',
            },
            success_url: `${BASE_URL}/PGP2026?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/PGP2026?checkout=cancelled`,
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('PGP Checkout Session error:', err);
        return res.status(500).json({ error: err.message });
    }
}
