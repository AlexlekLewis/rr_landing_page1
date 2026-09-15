// ============================================================
// Vercel Serverless Function — ONE Stripe Checkout for a selected Performance
// Squad player: Joining Fee + weekly Squad Fee subscription + any training kit.
// POST /api/performance-squad-checkout
//   { registration_id, player, has_own_kit, items: [{ key, size }], pickupVenue }
//
// Joining Fee and Squad Fee are the two prices on the Joining Fee Payment Link
// (welcomeConfig.paymentLink). They're looked up from Stripe at runtime and
// cached, so whoever edits that link in the Dashboard changes what's charged
// here too — no second copy of the pricing to keep in sync. Kit is priced
// server-side from api/_lib/uniformPricing.js (participant prices) and added
// as one-time items on the first invoice.
//
// The session runs in subscription mode: the first payment collects the
// Joining Fee, the first weekly instalment and the kit; the subscription then
// bills $29.95 a week. api/stripe-webhook marks the registration paid and the
// kit order paid on checkout.session.completed.
//
// Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { UNIFORM_CATALOG } from './_lib/uniformPricing.js';
import { getProgramPrices } from './_lib/performanceSquadPrices.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

const PICKUP_VENUES = {
    'north-melbourne': 'Mickleham Indoor Sports Centre',
    'south-east-melbourne': 'Elite Cricket Centre, Cranbourne North',
};

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const MAX_QTY = 5;

// [{ key, size, quantity }] → Stripe one-time line items at PARTICIPANT prices.
// Unlike uniformPricing.buildUniformLineItems (which Power Game relies on to
// allow one of each), a family here can order several of an item — two shirts,
// say — in one size or several. Unknown keys and sized items without a size are
// dropped; quantity is clamped to 1–MAX_QTY.
function buildKitLineItems(items) {
    const lineItems = [];
    const orderItems = [];
    const summaryParts = [];
    let totalCents = 0;
    for (const it of Array.isArray(items) ? items : []) {
        const key = it && typeof it.key === 'string' ? it.key : '';
        const cat = UNIFORM_CATALOG[key];
        if (!cat) continue;
        const size = cat.oneSize ? 'One size' : str(it.size, 40);
        if (!size) continue;
        const quantity = Math.min(MAX_QTY, Math.max(1, parseInt(it.quantity, 10) || 1));
        lineItems.push({
            price_data: {
                currency: 'aud',
                product_data: { name: cat.label, description: `Size: ${size}` },
                unit_amount: cat.priceCents,
            },
            quantity,
        });
        orderItems.push({ key, label: cat.label, size, quantity, price_cents: cat.priceCents });
        summaryParts.push(`${quantity > 1 ? `${quantity} × ` : ''}${cat.label} (${size})`);
        totalCents += cat.priceCents * quantity;
    }
    return { lineItems, orderItems, totalCents, summary: summaryParts.join(', ') };
}
const isUuid = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v || '');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { registration_id, player = {}, has_own_kit, items = [], pickupVenue } = req.body || {};
        if (!isUuid(registration_id)) return res.status(400).json({ error: 'Please confirm your details first' });

        const email = str(player.email, 160);
        const playerName = `${str(player.first_name, 80)} ${str(player.last_name, 80)}`.trim();

        // The registration must exist — it's what the payment is recorded against.
        const { data: reg, error: regErr } = await supabase
            .from('performance_squads_registrations')
            .select('id, email, status, paid_at')
            .eq('id', registration_id)
            .single();
        if (regErr || !reg) return res.status(400).json({ error: 'We could not find your confirmation. Please complete Step 1 again.' });
        if (reg.paid_at) return res.status(400).json({ error: 'This confirmation has already been paid for.' });

        // ── Kit ──
        const ownKit = has_own_kit === true;
        const uniform = ownKit ? { lineItems: [], orderItems: [], totalCents: 0, summary: '' } : buildKitLineItems(items);
        if (!ownKit && uniform.lineItems.length === 0) {
            return res.status(400).json({ error: 'Choose your training kit, or tick that you already have what you need' });
        }

        let kitOrderId = null;
        if (uniform.lineItems.length) {
            const orderItems = uniform.orderItems;
            const venue = str(pickupVenue, 60) || str(player.centre_slug, 60);
            const { data: order, error } = await supabase
                .from('performance_squad_kit_orders')
                .insert({
                    registration_id,
                    player_first_name: str(player.first_name, 80),
                    player_last_name: str(player.last_name, 80),
                    parent_name: str(player.parent_name, 120),
                    email,
                    mobile: str(player.mobile, 40),
                    centre_slug: str(player.centre_slug, 60),
                    venue_name: str(player.venue_name, 120),
                    items: orderItems,
                    items_summary: uniform.summary,
                    subtotal_cents: uniform.totalCents,
                    total_cents: uniform.totalCents,
                    fulfillment: 'pickup',
                    pickup_venue: venue,
                    status: 'pending',
                })
                .select('id')
                .single();
            if (error) throw new Error(`Could not save kit order: ${error.message}`);
            kitOrderId = order.id;
        }

        // ── Program prices ──
        const prices = await getProgramPrices(stripe);

        const lineItems = [
            { price: prices.squadFee.priceId, quantity: 1 },     // weekly, billed from today
            { price: prices.joiningFee.priceId, quantity: 1 },   // one-off, first invoice only
            ...uniform.lineItems,                        // one-off kit, first invoice only
        ];

        const metadata = {
            source: 'performance-squad-join',
            registration_id,
            kit_order_id: kitOrderId || '',
            has_own_kit: ownKit ? 'yes' : 'no',
            player_name: playerName,
            centre_slug: str(player.centre_slug, 60),
            kit_summary: uniform.summary.slice(0, 480),
        };

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: email || undefined,
            line_items: lineItems,
            subscription_data: {
                description: `Rajasthan Royals Academy Performance Squad — ${playerName}`,
                metadata,
            },
            client_reference_id: registration_id,
            metadata,
            allow_promotion_codes: false,
            success_url: `${BASE_URL}/performance-squads/welcome/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/performance-squads/welcome?checkout=cancelled#checkout`,
            custom_text: uniform.lineItems.length
                ? { submit: { message: `Your kit (${uniform.summary}) will be ready to collect at squad training.` } }
                : undefined,
        });

        await supabase
            .from('performance_squads_registrations')
            .update({ stripe_session_id: session.id, has_own_kit: ownKit })
            .eq('id', registration_id);
        if (kitOrderId) {
            await supabase
                .from('performance_squad_kit_orders')
                .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
                .eq('id', kitOrderId);
        }

        return res.status(200).json({ url: session.url, id: session.id });
    } catch (e) {
        console.error('performance-squad-checkout error:', e);
        return res.status(500).json({ error: e.message });
    }
}
