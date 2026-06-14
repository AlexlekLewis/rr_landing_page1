// ============================================================
// Vercel Serverless Function — Stripe Webhook
// POST /api/stripe-webhook
// ============================================================
// Captures the full Stripe checkout + payment record into Supabase
// on every paid order. Resilient to a failed pre-checkout cart insert:
// if no order_id metadata is set, the webhook will INSERT a fresh row
// in the appropriate table (training vs IPL) by inspecting line items.
//
// Required environment variables in Vercel:
//   STRIPE_SECRET_KEY         = sk_live_...
//   STRIPE_WEBHOOK_SECRET     = whsec_...
//   VITE_SUPABASE_URL         = https://xxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY = eyJ...
//   RESEND_API_KEY            = re_...   (optional, enables auto emails)
//   ZAPIER_SHOP_WEBHOOK_URL   = ...      (optional)
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from './_lib/orderEmail.js';
import { unpackApplication, buildPaidRow } from './_lib/pgpCheckout.js';
import { sendPgpConfirmation } from './_lib/pgpEmail.js';

// Stripe signature verification requires the *raw* request body. Vercel's
// default body parser returns a parsed object, which would always fail
// constructEvent. Disable it for this route.
export const config = {
  api: { bodyParser: false },
};

let _stripe = null;
const getStripe = () => {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key);
  return _stripe;
};

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || process.env.NEXT_PUBLIC_SUPABASE_URL
           || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars');
  _supabase = createClient(url, key);
  return _supabase;
};

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const IPL_PRICE_ID = 'price_1TRJe7Io52UEA50yZ4i5OPwH';

// Academy Shop product Stripe Price IDs. Sessions that don't include any of
// these (or aren't stamped with metadata.source = 'academy-shop') are program
// registrations and must NOT be persisted to shop_orders_* tables.
const SHOP_PRICE_IDS = new Set([
  'price_1TRJe7Io52UEA50yZ4i5OPwH', // ipl-replica-shirt
  'price_1TRJinIo52UEA50yaIwEA8Ni', // training-shirt
  'price_1TRJqhIo52UEA50ycGPuIieZ', // training-shorts
  'price_1TRJt4Io52UEA50ydwZmfUKh', // training-pants
  'price_1TRNozIo52UEA50yEkWYWKAq', // pink-cap
  'price_1TRNwaIo52UEA50yIChLyg1J', // fleece-jacket
]);

const isShopSession = (session, lineItems) => {
  if (session?.metadata?.source === 'academy-shop') return true;
  return lineItems.some(i => SHOP_PRICE_IDS.has(i.price_id));
};

// ============================================================
// Program Registration routing — sessions that aren't shop orders
// but ARE recognised programs land in program_registrations.
// Keep PROGRAM_PRICE_IDS in sync with api/sync-programs-from-stripe.js.
// ============================================================
const PROGRAM_PRICE_IDS = {
  'price_1TIOdNIo52UEA50yjRoWwDVt': { program: 'junior_royals', program_variant: 'ages_7_9_bundoora',     program_label: 'Junior Royals — Ages 7-9, Bundoora (Cutting Edge Cricket)' },
  'price_1TIOerIo52UEA50ynRv5Mvwg': { program: 'junior_royals', program_variant: 'ages_10_12_bundoora',   program_label: 'Junior Royals — Ages 10-12, Bundoora (Cutting Edge Cricket)' },
  'price_1TIOguIo52UEA50y5DGrBbsP': { program: 'junior_royals', program_variant: 'ages_13_15_bundoora',   program_label: 'Junior Royals — Ages 13-15, Bundoora (Cutting Edge Cricket)' },
  'price_1TMFh5Io52UEA50yrjh0rz92': { program: 'junior_royals', program_variant: 'term_2_hallam',         program_label: 'Junior Royals — 2026 Term 2, Hallam (Cricket Connect)' },
  'price_1THybpIo52UEA50yl5fCU1t8': { program: 'junior_royals', program_variant: 'training_shirt_addon', program_label: 'Junior Royals — Training Shirt (Participant ONLY)' },
  'price_1TELBmIo52UEA50yebT4senm': { program: 'female_kickstart', program_variant: 'girls_kickstart',    program_label: 'Female Cricket — Girls Kickstart Program' },
  'price_1T7OxzIo52UEA50y2f9UvDSr': { program: 'elite',            program_variant: 'deposit_3_monthly', program_label: 'Elite Program — $2,995 Payment Plan (Deposit + 3 Monthly)' },
};

const classifyByDescription = (description = '') => {
  const d = description.toLowerCase();
  if (!d) return null;
  // Internal/test products — explicitly skip so they don't pollute counts.
  if (d.includes('test product')) return null;
  // Elite check runs first — Elite product descriptions also contain
  // "Royals Academy", which would otherwise fall through to junior_royals.
  if (
    d.includes('elite program') || d.includes('royals elite') ||
    d.includes('elite training programme') || d.includes('elite training program') ||
    d.includes('elite academy') || d.includes('t20 elite') ||
    d.includes('tailored payment plan') || d.includes('ambassador program') ||
    d.includes('$2995 payment plan') || d.includes('deposit + 3 monthly') ||
    d.includes('deposit + monthly')
  )
    return { program: 'elite', program_variant: null, program_label: description };
  if (d.includes('holiday program') || d.includes('holiday camp') || d.includes('holiday clinic'))
    return { program: 'holiday', program_variant: null, program_label: description };
  if (d.includes('girls kickstart') || d.includes('female cricket') || d.includes('girls program'))
    return { program: 'female_kickstart', program_variant: null, program_label: description };
  if (d.includes('junior royals') || d.includes('cutting edge') || d.includes('cricket connect') || d.includes('royals academy'))
    return { program: 'junior_royals', program_variant: null, program_label: description };
  return null;
};

const classifyAsProgram = (session, lineItems) => {
  if (session?.metadata?.source === 'academy-shop') return null;
  if (lineItems.some(i => SHOP_PRICE_IDS.has(i.price_id))) return null;
  if (session?.metadata?.source === 'program' && session?.metadata?.program) {
    return {
      program: session.metadata.program,
      program_variant: session.metadata.program_variant || null,
      program_label: session.metadata.program_label || null,
    };
  }
  for (const item of lineItems) {
    const match = PROGRAM_PRICE_IDS[item.price_id];
    if (match) return match;
  }
  for (const item of lineItems) {
    const match = classifyByDescription(item.description);
    if (match) return match;
  }
  return null;
};

const inferFulfillmentMethod = (shippingLabel) => {
  const l = (shippingLabel || '').toLowerCase();
  if (l.includes('pickup')) return 'pickup';
  if (l.includes('express')) return 'express';
  return 'standard';
};

const partitionLineItems = (lineItems) => {
  const ipl = [], training = [];
  for (const i of lineItems) {
    if (i.price_id === IPL_PRICE_ID) ipl.push(i);
    else training.push(i);
  }
  return { ipl, training };
};

const sumCents = (items) =>
  items.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 0), 0);

// Upsert by stripe_session_id. If a draft row exists (linked via metadata.order_id
// from the cart pre-insert), we update it. Otherwise, we insert a new row.
const upsertOrder = async (table, payload, draftId) => {
  const supabase = getSupabase();
  if (draftId) {
    // Exclude 'items' from update — preserve original cart items which contain size info
    const { items: _items, subtotal: _sub, total: _tot, ...updatePayload } = payload;
    const { data, error } = await supabase
      .from(table)
      .update(updatePayload)
      .eq('id', draftId)
      .select('id');
    if (error) console.error(`${table} update by id failed:`, error);
    if (data && data.length) return data[0];
  }
  const { data, error } = await supabase
    .from(table)
    .upsert(payload, { onConflict: 'stripe_session_id' })
    .select('id');
  if (error) {
    console.error(`${table} upsert failed:`, error);
    return null;
  }
  return data?.[0] || null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  let event;
  let stripe;

  try {
    stripe = getStripe();
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: err.message });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items', 'line_items.data.price', 'payment_intent', 'payment_intent.latest_charge'],
    });
  } catch (err) {
    console.error('Session expansion failed:', err.message);
    return res.status(500).json({ error: 'Session expansion failed' });
  }

  const customerName    = session.customer_details?.name || '';
  const customerEmail   = session.customer_details?.email || '';
  const customerPhone   = session.customer_details?.phone || '';
  const shippingAddress = session.shipping_details?.address || null;
  const shippingLabel   = session.shipping_cost?.shipping_rate_details?.display_name || '';
  const fulfillmentMethod = inferFulfillmentMethod(shippingLabel);

  const lineItems = (session.line_items?.data || []).map(i => ({
    name: i.description,
    product_name: i.description,
    quantity: i.quantity,
    unit_price: i.price?.unit_amount,
    price_id: i.price?.id,
    total: i.amount_total,
  }));

  const charge = session.payment_intent?.latest_charge;
  const card = charge?.payment_method_details?.card;

  // ── Power Game (create-on-payment) ─────────────────────────────────────────
  // No power_game_applications row is written until payment is confirmed. The
  // funnel packs the FULL application into the Stripe session metadata; here we
  // CREATE the paid row (idempotent on stripe_session_id) and send the one
  // confirmation email. A legacy pre-created row (linked by client_reference_id /
  // metadata.application_id) is still flipped to paid for back-compat. Only a real
  // PG session is claimed — shop/program/holiday sessions (whose UUIDs don't match
  // and which carry no packed payload) fall through to the routing below.
  {
    const supabase = getSupabase();
    const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    const paidAt = charge?.created ? new Date(charge.created * 1000).toISOString() : new Date().toISOString();
    const pgCols = 'id, email, player_name, venue, session_day, session_time, age_group, amount_paid_cents, stripe_session_id';
    const application = unpackApplication(session.metadata);

    const finalisePg = async (row) => {
      if (row) {
        await supabase.from('power_game_payment_confirmations').upsert({
          stripe_session_id: session.id,
          application_id:     row.id,
          amount_cents:       session.amount_total ?? null,
          currency:           session.currency || 'aud',
          payment_status:     session.payment_status || 'paid',
          player_name:        session.metadata?.player_name || customerName || null,
        }, { onConflict: 'stripe_session_id' });
        try {
          if (row.email) await sendPgpConfirmation({
            to: row.email, playerName: row.player_name, centreName: row.venue,
            sessionDay: row.session_day, sessionTime: row.session_time, ageGroup: row.age_group,
            amountCents: session.amount_total ?? row.amount_paid_cents ?? null,
            ref: String(session.id).slice(-8).toUpperCase(),
          });
        } catch (e) { console.warn('PGP confirmation email failed (non-blocking):', e.message); }
      }
    };

    if (application) {
      // New flow — a packed payload only ever exists for Power Game → definitively PG.
      const row = buildPaidRow(application, session);
      row.paid_at = paidAt;
      const { data, error } = await supabase
        .from('power_game_applications')
        .upsert(row, { onConflict: 'stripe_session_id', ignoreDuplicates: true })
        .select(pgCols);
      if (error) console.error('power_game create-on-payment failed:', error.message);
      else if (data && data.length) await finalisePg(data[0]); // [] = another path already created it
      console.log(`power_game create-on-payment (session=${session.id})`);
      return res.status(200).json({ received: true, routed_to: 'power_game_applications', id: data?.[0]?.id || null });
    }

    // Legacy flow — only a MATCHED update counts as PG (a bare UUID may belong to
    // holiday/another table, which must keep falling through to its own routing).
    const pgId = session.client_reference_id || session.metadata?.application_id || null;
    if (isUuid(pgId)) {
      const { data: pgRows, error: pgErr } = await supabase
        .from('power_game_applications')
        .update({
          payment_status:    'completed',
          status:            'paid',
          amount_paid_cents: session.amount_total ?? null,
          paid_at:           paidAt,
          stripe_session_id: session.id,
        })
        .eq('id', pgId)
        .neq('payment_status', 'completed')
        .select(pgCols);
      if (pgErr) {
        console.error('power_game_applications reconcile failed:', pgErr.message);
      } else if (pgRows && pgRows.length) {
        await finalisePg(pgRows[0]);
        console.log(`power_game payment reconciled (id=${pgId}, session=${session.id})`);
        return res.status(200).json({ received: true, routed_to: 'power_game_applications', id: pgId });
      }
    }
  }

  // Route between shop orders and program registrations. The two systems are
  // isolated — a session lands in exactly one of: shop_orders_*, program_registrations,
  // or is ignored entirely.
  if (!isShopSession(session, lineItems)) {
    const programClass = classifyAsProgram(session, lineItems);
    if (!programClass) {
      return res.status(200).json({ received: true, ignored: 'unknown_session_kind' });
    }

    const programPayload = {
      program:                  programClass.program,
      program_variant:          programClass.program_variant,
      program_label:            programClass.program_label,
      customer_name:            customerName,
      customer_email:           customerEmail,
      customer_phone:           customerPhone,
      shipping_address:         shippingAddress || session.customer_details?.address || null,
      items:                    lineItems,
      amount_subtotal_cents:    session.amount_subtotal ?? null,
      amount_shipping_cents:    session.shipping_cost?.amount_total ?? 0,
      amount_tax_cents:         session.total_details?.amount_tax ?? 0,
      amount_total_cents:       session.amount_total ?? null,
      currency:                 session.currency || 'aud',
      payment_status:           'completed',
      stripe_session_id:        session.id,
      stripe_payment_intent_id: session.payment_intent?.id || null,
      stripe_charge_id:         charge?.id || null,
      card_brand:               card?.brand || null,
      card_last4:               card?.last4 || null,
      card_country:             card?.country || null,
      card_funding:             card?.funding || null,
      receipt_url:              charge?.receipt_url || null,
      paid_at:                  charge?.created ? new Date(charge.created * 1000).toISOString() : new Date().toISOString(),
      stripe_metadata:          session.metadata || null,
    };

    const supabase = getSupabase();
    const { error: progErr } = await supabase
      .from('program_registrations')
      .upsert(programPayload, { onConflict: 'stripe_session_id' });
    if (progErr) {
      console.error('program_registrations upsert failed:', progErr);
      return res.status(500).json({ error: progErr.message });
    }

    // -----------------------------------------------------------
    // Holiday-program ALSO writes back to the form-submitted row so
    // a single holiday_clinic_* row reflects the full lifecycle
    // (form submit → Stripe paid). Source-of-truth join is the
    // client_reference_id passed to Stripe Checkout, which carries
    // the UUID of the registration row.
    // Tables linked this way must expose payment_status, stripe_session_id,
    // stripe_payment_intent_id, amount_paid_cents, paid_at, receipt_url.
    // -----------------------------------------------------------
    if (programClass.program === 'holiday') {
      const refId = session.client_reference_id || null;
      const HOLIDAY_TABLES = [
        'junior_royals_july_holidays_registrations',
        'holiday_clinic_registrations',
      ];
      const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
      if (isUuid(refId)) {
        const updatePayload = {
          payment_status:           'completed',
          stripe_session_id:        session.id,
          stripe_payment_intent_id: session.payment_intent?.id || null,
          amount_paid_cents:        session.amount_total ?? null,
          paid_at:                  charge?.created
                                      ? new Date(charge.created * 1000).toISOString()
                                      : new Date().toISOString(),
          receipt_url:              charge?.receipt_url || null,
        };
        for (const table of HOLIDAY_TABLES) {
          const { data, error } = await supabase
            .from(table)
            .update(updatePayload)
            .eq('id', refId)
            .select('id');
          if (error) {
            console.warn(`holiday-back-fill skipped for ${table}:`, error.message);
            continue;
          }
          if (data && data.length) {
            console.log(`holiday payment back-filled to ${table} (id=${refId})`);
            break; // a UUID belongs to at most one table
          }
        }
      } else {
        console.warn('holiday session missing client_reference_id — back-fill skipped', { session_id: session.id });
      }
    }

    return res.status(200).json({
      received: true,
      routed_to: 'program_registrations',
      program: programClass.program,
      program_variant: programClass.program_variant,
    });
  }

  const stripePayloadShared = {
    payment_status:           'completed',
    stripe_session_id:        session.id,
    stripe_payment_intent_id: session.payment_intent?.id || null,
    stripe_charge_id:         charge?.id || null,
    card_brand:               card?.brand || null,
    card_last4:               card?.last4 || null,
    card_country:             card?.country || null,
    card_funding:             card?.funding || null,
    receipt_url:              charge?.receipt_url || null,
    amount_subtotal_cents:    session.amount_subtotal ?? null,
    amount_shipping_cents:    session.shipping_cost?.amount_total ?? 0,
    amount_tax_cents:         session.total_details?.amount_tax ?? 0,
    amount_total_cents:       session.amount_total ?? null,
    currency:                 session.currency || 'aud',
    paid_at:                  charge?.created ? new Date(charge.created * 1000).toISOString() : new Date().toISOString(),
    customer_name:            customerName,
    customer_email:           customerEmail,
    customer_phone:           customerPhone,
    shipping_address:         shippingAddress,
    fulfillment_method:       fulfillmentMethod,
    stripe_metadata:          session.metadata || null,
  };

  const draftTrainingId = session.metadata?.order_id || null;
  const draftIplId      = session.metadata?.ipl_order_id || null;

  const { training: trainingItems, ipl: iplItems } = partitionLineItems(lineItems);

  // The shop_orders_* subtotal/shipping_cost/total columns are INTEGER
  // (cents). DO NOT divide by 100 here — PostgREST will reject decimals
  // like 38.5 with: invalid input syntax for type integer.
  const totalsForSubset = (subset) => {
    const subtotal = sumCents(subset);
    return {
      subtotal,
      shipping_cost: 0,
      total: subtotal + (session.shipping_cost?.amount_total || 0),
    };
  };

  if (trainingItems.length > 0 || draftTrainingId) {
    await upsertOrder('shop_orders_training', {
      ...stripePayloadShared,
      items: trainingItems,
      ...totalsForSubset(trainingItems),
    }, draftTrainingId);
  }

  if (iplItems.length > 0 || draftIplId) {
    await upsertOrder('shop_orders_ipl', {
      ...stripePayloadShared,
      items: iplItems,
      ...totalsForSubset(iplItems),
      supplier_status: 'awaiting_bulk_order',
    }, draftIplId);
  }

  // Fetch original items from Supabase to get size info for Zapier
  let originalItems = [];
  try {
    const supabase = getSupabase();
    const orderId = draftTrainingId || draftIplId;
    const table = draftTrainingId ? 'shop_orders_training' : 'shop_orders_ipl';
    if (orderId) {
      const { data } = await supabase.from(table).select('items').eq('id', orderId).single();
      if (data?.items) originalItems = data.items;
    }
  } catch (e) { console.warn('Could not fetch original items:', e.message); }

  const zapierUrl = process.env.ZAPIER_SHOP_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id:       draftTrainingId || draftIplId || '',
          stripe_session: session.id,
          order_date:     new Date().toLocaleDateString('en-AU'),
          order_time:     new Date().toLocaleTimeString('en-AU'),
          customer_name:  customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          delivery_method: fulfillmentMethod === 'pickup'
            ? `Pickup — ${shippingLabel}`
            : fulfillmentMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
          shipping_address: shippingAddress
            ? `${shippingAddress.line1 || ''}, ${shippingAddress.city || ''} ${shippingAddress.postal_code || ''}, ${shippingAddress.country || ''}`.trim()
            : '',
          items: (originalItems.length > 0 ? originalItems : lineItems)
            .filter(i => !i.name?.toLowerCase().includes('delivery') && !i.name?.toLowerCase().includes('shipping'))
            .map(i => originalItems.length > 0
              ? `${i.product_name || i.name} x${i.quantity} (${i.size || 'N/A'})`
              : `${i.name} x${i.quantity}`)
            .join(' | '),
          total_paid: `$${(session.amount_total / 100).toFixed(2)} AUD`,
        }),
      });
    } catch (e) { console.warn('Zapier failed (non-blocking):', e.message); }
  }

  try {
    await sendOrderConfirmation({
      to: customerEmail,
      customerName,
      items: lineItems,
      fulfillmentMethod,
      pickupVenue: session.metadata?.pickup_venue || null,
      shippingAddress,
      totalCents: session.amount_total,
      orderRef: draftTrainingId || draftIplId || session.id,
    });
    console.log('Confirmation email sent via Resend');
  } catch (e) {
    console.warn('Resend email failed (non-blocking):', e.message);
  }

  return res.status(200).json({ received: true });
}
