// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session
// POST /api/create-checkout-session
// ============================================================
// Called by the anonymous browser (cart checkout), so this cannot
// have admin auth — instead we enforce a CORS allowlist + strict
// body schema validation so the endpoint can only mint Checkout
// Sessions for known products with sane quantities.
//
// Required environment variables (set in Vercel Dashboard):
//   STRIPE_SECRET_KEY  = sk_live_...
//   VITE_APP_URL       = https://rramelbourne.com (or your Vercel URL)
//   ALLOWED_ORIGINS    (optional, comma-separated)
// ============================================================

import Stripe from 'stripe';
import { setCors, sendError } from './_lib/auth.js';

let _stripe = null;
const getStripe = () => {
    if (_stripe) return _stripe;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key);
    return _stripe;
};

const PRICE_MAP = {
    'ipl-replica-shirt': 'price_1TRJe7Io52UEA50yZ4i5OPwH',
    'training-shirt':    'price_1TRJinIo52UEA50yaIwEA8Ni',
    'training-shorts':   'price_1TRJqhIo52UEA50ycGPuIieZ',
    'training-pants':    'price_1TRJt4Io52UEA50ydwZmfUKh',
    'pink-cap':          'price_1TRNozIo52UEA50yEkWYWKAq',
    'fleece-jacket':     'price_1TRNwaIo52UEA50yIChLyg1J',
};

const STRIPE_SHIPPING_RATES = {
    standard: 'shr_1TROdrIo52UEA50yMijZecJJ',
    express:  'shr_1TROf8Io52UEA50yeADIIgxr',
};

const FULFILLMENT_OPTIONS  = new Set(['pickup', 'standard', 'express']);
const PICKUP_VENUES        = new Set(['bundoora', 'hallam']);
const MAX_ITEMS            = 20;
const MAX_QUANTITY_PER_ITEM = 10;
const MAX_MTO_QTY          = 20;
const VALID_MTO_SURCHARGE  = new Set([0, 1200]);
const STRIPE_ID_PATTERN    = /^[A-Za-z0-9_-]{1,128}$/;

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

// Validate the request body. Returns { ok: true, body } on success,
// { ok: false, message } on failure. Browser-controlled fields are
// the entire blast radius for this endpoint — anything that gets
// into the Stripe session metadata or the success_url template
// must come back as a known-good value.
function validateBody(raw) {
    if (!raw || typeof raw !== 'object') return { ok: false, message: 'Invalid body' };
    const { items, fulfillment, pickupVenue, mtoSurcharge, mtoQty, orderId, iplOrderId } = raw;

    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
        return { ok: false, message: 'items must be a non-empty array' };
    }
    const cleanItems = [];
    for (const i of items) {
        if (!i || typeof i !== 'object') return { ok: false, message: 'invalid item' };
        if (typeof i.product_id !== 'string' || !PRICE_MAP[i.product_id]) {
            return { ok: false, message: 'unknown product' };
        }
        const qty = Number(i.quantity);
        if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY_PER_ITEM) {
            return { ok: false, message: 'invalid quantity' };
        }
        cleanItems.push({ product_id: i.product_id, quantity: qty });
    }

    if (!FULFILLMENT_OPTIONS.has(fulfillment)) {
        return { ok: false, message: 'invalid fulfillment' };
    }
    let cleanVenue = null;
    if (fulfillment === 'pickup') {
        if (!PICKUP_VENUES.has(pickupVenue)) {
            return { ok: false, message: 'invalid pickup venue' };
        }
        cleanVenue = pickupVenue;
    }

    const surcharge = Number(mtoSurcharge ?? 0);
    if (!Number.isInteger(surcharge) || !VALID_MTO_SURCHARGE.has(surcharge)) {
        return { ok: false, message: 'invalid mtoSurcharge' };
    }
    const mtoQuantity = Number(mtoQty ?? 0);
    if (!Number.isInteger(mtoQuantity) || mtoQuantity < 0 || mtoQuantity > MAX_MTO_QTY) {
        return { ok: false, message: 'invalid mtoQty' };
    }

    const cleanOrderId    = (orderId    && STRIPE_ID_PATTERN.test(orderId))    ? orderId    : '';
    const cleanIplOrderId = (iplOrderId && STRIPE_ID_PATTERN.test(iplOrderId)) ? iplOrderId : '';

    return {
        ok: true,
        body: {
            items: cleanItems,
            fulfillment,
            pickupVenue: cleanVenue,
            mtoSurcharge: surcharge,
            mtoQty: mtoQuantity,
            orderId: cleanOrderId,
            iplOrderId: cleanIplOrderId,
        },
    };
}

export default async function handler(req, res) {
    setCors(req, res, { allowMethods: 'POST, OPTIONS' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

    const validated = validateBody(req.body);
    if (!validated.ok) return sendError(res, 400, validated.message);
    const { items, fulfillment, pickupVenue, mtoSurcharge, mtoQty, orderId, iplOrderId } = validated.body;

    try {
        const stripe = getStripe();

        const lineItems = items.map(item => ({
            price:    PRICE_MAP[item.product_id],
            quantity: item.quantity,
        }));

        let shippingOptions;
        if (fulfillment === 'pickup') {
            const venueLabel = pickupVenue === 'bundoora'
                ? 'Pickup — Cutting Edge Cricket, Unit 7/19 Enterprise Dr, Bundoora 3083'
                : 'Pickup — Cricket Connect, 22 Technology CCT, Hallam 3803';
            shippingOptions = [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'aud' },
                    display_name: venueLabel,
                },
            }];
        } else {
            shippingOptions = [{ shipping_rate: STRIPE_SHIPPING_RATES[fulfillment] }];
        }

        if (fulfillment !== 'pickup' && mtoSurcharge > 0 && mtoQty > 0) {
            lineItems.push({
                price_data: {
                    currency: 'aud',
                    unit_amount: mtoSurcharge,
                    product_data: {
                        name: 'Made-to-Order Delivery Surcharge',
                        description: `Separate international delivery for ${mtoQty} made-to-order item${mtoQty > 1 ? 's' : ''}`,
                    },
                },
                quantity: mtoQty,
            });
        }

        // success_url is templated with cart values — URL-encode them
        // even though the validator already restricts the inputs to
        // a known small set. Belt-and-braces.
        const successUrl =
            `${BASE_URL}/academy-shop/success` +
            `?session_id={CHECKOUT_SESSION_ID}` +
            `&fulfillment=${encodeURIComponent(fulfillment)}` +
            `&venue=${encodeURIComponent(pickupVenue || '')}`;

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            allow_promotion_codes: true,
            line_items: lineItems,
            shipping_options: shippingOptions,
            billing_address_collection: 'auto',
            shipping_address_collection: fulfillment !== 'pickup'
                ? { allowed_countries: ['AU'] }
                : undefined,
            phone_number_collection: { enabled: true },
            metadata: {
                source: 'academy-shop',
                order_id: orderId,
                ipl_order_id: iplOrderId,
                fulfillment_method: fulfillment,
            },
            success_url: successUrl,
            cancel_url: `${BASE_URL}/academy-shop`,
            payment_intent_data: {
                metadata: {
                    order_id: orderId,
                    ipl_order_id: iplOrderId,
                },
            },
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', err);
    }
}
