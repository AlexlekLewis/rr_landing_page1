// ============================================================
// Vercel Serverless Function — Stripe Checkout for Performance Squad training kit.
// POST /api/performance-squad-kit-checkout
//   { player, items: [{ key, size }], fulfillment, pickupVenue }
//
// Selected players order kit from the welcome page at PARTICIPANT prices, which
// are the same server-owned prices Power Game charges (api/_lib/uniformPricing.js).
// The browser sends only garment keys and sizes — never an amount — so a tampered
// request can't change what is charged.
//
// A pending row is written to performance_squad_kit_orders up front (so an
// abandoned checkout is still visible), then flipped to paid by api/stripe-webhook
// on checkout.session.completed. These orders are deliberately kept OUT of
// shop_orders_training: that table holds retail-priced Academy Shop orders.
//
// Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buildUniformLineItems, UNIFORM_CATALOG } from './_lib/uniformPricing.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

// Keyed by region slug — the same slugs the welcome form's region dropdown uses.
const PICKUP_VENUES = {
    'north-melbourne': 'Mickleham Indoor Sports Centre',
    'south-east-melbourne': 'Elite Cricket Centre, Cranbourne North',
};

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { player = {}, items, pickupVenue } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No kit items selected' });
        }

        // Server decides the price for every garment. Unknown keys and sized
        // garments with no size are dropped by buildUniformLineItems.
        const uniform = buildUniformLineItems(items);
        if (uniform.lineItems.length === 0) {
            return res.status(400).json({ error: 'No valid kit items selected' });
        }

        const orderItems = items
            .filter((i) => UNIFORM_CATALOG[i?.key])
            .map((i) => ({
                key: i.key,
                label: UNIFORM_CATALOG[i.key].label,
                size: UNIFORM_CATALOG[i.key].oneSize ? 'One size' : str(i.size, 40),
                price_cents: UNIFORM_CATALOG[i.key].priceCents,
            }))
            .filter((i) => i.size);

        // Pick up only — kit is collected at squad training, never posted.
        const method = 'pickup';
        const venue = str(pickupVenue, 60);

        // Pending row first, so the order exists even if payment is abandoned.
        const { data: order, error } = await supabase
            .from('performance_squad_kit_orders')
            .insert({
                player_first_name: str(player.first_name, 80),
                player_last_name: str(player.last_name, 80),
                parent_name: str(player.parent_name, 120),
                email: str(player.email, 160),
                mobile: str(player.mobile, 40),
                centre_slug: str(player.centre_slug, 60),
                venue_name: str(player.venue_name, 120),
                items: orderItems,
                items_summary: uniform.summary,
                subtotal_cents: uniform.totalCents,
                total_cents: uniform.totalCents,
                fulfillment: method,
                pickup_venue: venue,
                status: 'pending',
            })
            .select('id')
            .single();

        if (error) throw new Error(`Could not save kit order: ${error.message}`);

        const shippingOptions = [{
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: 'aud' },
                display_name: `Collect at squad training — ${PICKUP_VENUES[venue] || 'your home centre'}`,
            },
        }];

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: str(player.email, 160) || undefined,
            line_items: uniform.lineItems,
            shipping_options: shippingOptions,
            client_reference_id: order.id,
            metadata: {
                source: 'performance-squad-kit',
                kit_order_id: order.id,
                player_name: `${str(player.first_name, 80)} ${str(player.last_name, 80)}`.trim(),
                centre_slug: str(player.centre_slug, 60),
                items_summary: uniform.summary.slice(0, 480),
            },
            success_url: `${BASE_URL}/performance-squads/welcome/success?kit=ordered&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/performance-squads/welcome?kit=cancelled#kit`,
        });

        await supabase
            .from('performance_squad_kit_orders')
            .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
            .eq('id', order.id);

        return res.status(200).json({ url: session.url, id: session.id, orderId: order.id });
    } catch (e) {
        console.error('performance-squad-kit-checkout error:', e);
        return res.status(500).json({ error: e.message });
    }
}
