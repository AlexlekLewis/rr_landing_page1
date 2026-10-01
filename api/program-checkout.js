// ============================================================
// Vercel Serverless Function — one-off Stripe Checkout for any product in
// api/_lib/checkoutCatalog.js.
// POST /api/program-checkout
//   { registration_id, product? }            → { url }   start payment
//   { registration_id, preview: true }       → { product, name, amountCents, firstName, paid }
//
// The booking row is written by the page first (anon insert); this function
// reads it back with the service role, checks it belongs to the product, and
// creates the Checkout Session. Price, success page and cancel page come from
// the catalogue, never from the browser. `product` may be left out: it is then
// worked out from the row's slug, which is how /…/pay?booking=<id> lets a
// parent pay for a booking made before the page took payment.
//
// api/stripe-webhook marks the row paid on checkout.session.completed
// (metadata.source = 'program-checkout').
//
// Env: STRIPE_SECRET_KEY, SUPABASE_URL or VITE_SUPABASE_URL,
//      SUPABASE_SERVICE_ROLE_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getProduct, productKeyForSlug, PAYABLE_TABLES } from './_lib/checkoutCatalog.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

let _stripe = null;
const getStripe = () => {
    if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return _stripe;
};
let _sb = null;
const getSupabase = () => {
    if (!_sb) {
        _sb = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
        );
    }
    return _sb;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { registration_id, product: requested, preview } = req.body || {};
        if (!isUuid(registration_id)) return res.status(400).json({ error: 'We could not find that booking.' });

        // Which table: from the requested product, or try every payable table.
        const requestedProduct = requested ? getProduct(requested) : null;
        if (requested && !requestedProduct) return res.status(400).json({ error: 'That product is not on sale.' });
        const tables = requestedProduct ? [requestedProduct.table] : [...PAYABLE_TABLES];

        let row = null;
        let table = null;
        for (const t of tables) {
            if (!PAYABLE_TABLES.has(t)) continue;
            const { data, error } = await getSupabase().from(t).select('*').eq('id', registration_id).maybeSingle();
            if (error) throw new Error(`Booking lookup failed: ${error.message}`);
            if (data) { row = data; table = t; break; }
        }
        if (!row) return res.status(404).json({ error: 'We could not find that booking.' });

        const productKey = requested || productKeyForSlug(row.match_slug);
        const product = getProduct(productKey);
        if (!product || product.table !== table || !product.slugs.includes(row[product.slugColumn])) {
            return res.status(400).json({ error: 'This booking cannot be paid online. Please email info@rramelbourne.com.' });
        }

        const firstName = String(row.player_name || '').trim().split(/\s+/)[0] || '';
        if (preview) {
            return res.status(200).json({
                product: productKey,
                name: product.name,
                amountCents: product.amountCents,
                firstName,
                paid: row.paid === true,
            });
        }
        if (row.paid === true) return res.status(409).json({ error: 'This booking has already been paid for.', paid: true });

        const metadata = {
            source: 'program-checkout',
            product: productKey,
            table,
            registration_id,
            player_name: String(row.player_name || '').slice(0, 200),
        };
        const join = product.successPath.includes('?') ? '&' : '?';
        const session = await getStripe().checkout.sessions.create({
            mode: 'payment',
            customer_email: row.email || undefined,
            client_reference_id: registration_id,
            line_items: [{
                price_data: {
                    currency: 'aud',
                    unit_amount: product.amountCents,
                    product_data: {
                        name: product.name,
                        description: row.player_name ? `Player: ${String(row.player_name).slice(0, 120)}` : undefined,
                    },
                },
                quantity: 1,
            }],
            metadata,
            payment_intent_data: { metadata, description: `${product.name}: ${row.player_name || ''}`.slice(0, 500) },
            success_url: `${BASE_URL}${product.successPath}${join}session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}${product.payPath}?booking=${registration_id}&cancelled=1`,
        });

        return res.status(200).json({ url: session.url, id: session.id });
    } catch (e) {
        console.error('program-checkout error:', e);
        return res.status(500).json({ error: 'We could not start the payment. Please try again in a minute.' });
    }
}
