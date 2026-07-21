// ============================================================
// Vercel Serverless Function — Sync paid program registrations
// from Stripe → Supabase (program_registrations table)
// POST /api/sync-programs-from-stripe   { days?: number, session_id?: string }
// ============================================================
// Walks paid Stripe Checkout Sessions and upserts each one whose line
// items match a known program price ID into public.program_registrations.
// Does NOT touch shop_orders_training / shop_orders_ipl — those have a
// separate sync at /api/sync-from-stripe.
//
// Useful for:
//   - Backfilling historical program registrations that pre-date the
//     unified dashboard (the original ask: "go through the whole of
//     the history of our Stripe").
//   - Recovering after a webhook outage.
//
// Auth: caller's Supabase session JWT in `authorization: Bearer ...`.
// Verified against dashboard_users.active=true.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   VITE_SUPABASE_URL  (or SUPABASE_URL — falls back to public project URL)
//   SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { isJrT3Session, classifyJrT3, completeJrT3Registration } from './_lib/jrTerm3.js';

let _stripe = null;
const getStripe = () => {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set in Vercel env vars for this deployment');
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
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars. In Vercel project Settings → Environment Variables, add it for Production (the long eyJ... JWT from Supabase Dashboard → Settings → API → service_role), then redeploy.');
  _supabase = createClient(url, key);
  return _supabase;
};

// ============================================================
// Program price ID allowlist
// ============================================================
// Keys are Stripe Price IDs. Values describe the program/variant the
// session belongs to. Add new program price IDs here as they're created.
//
// Discovery sources used to seed this map:
//   - Existing program registration rows (extracted before shop wipe)
//   - Stripe Payment Link URLs in:
//       src/components/holiday-programs/RegistrationForm.jsx
//       src/components/little-crickets/LCRegistrationForm.jsx
//       src/components/female-cricket-introduction/RegistrationForm.jsx
//       src/components/master-landing-page/MasterCheckout.jsx
//       src/components/landing-page-3/AcceptanceForm.jsx
//   - The Elite Program / Holiday Program price IDs are discovered at
//     sync time when the session line items reveal them. See the
//     `program_metadata_fallback` block below for the fuzzy-match
//     fallback that catches unknown program price IDs whose Product
//     name starts with a known prefix (e.g. "Elite", "Holiday").
// ============================================================
const PROGRAM_PRICE_IDS = {
  // Junior Royals — Bundoora
  'price_1TIOdNIo52UEA50yjRoWwDVt': {
    program: 'junior_royals',
    program_variant: 'ages_7_9_bundoora',
    program_label: 'Junior Royals — Ages 7-9, Bundoora (Cutting Edge Cricket)',
  },
  'price_1TIOerIo52UEA50ynRv5Mvwg': {
    program: 'junior_royals',
    program_variant: 'ages_10_12_bundoora',
    program_label: 'Junior Royals — Ages 10-12, Bundoora (Cutting Edge Cricket)',
  },
  'price_1TIOguIo52UEA50y5DGrBbsP': {
    program: 'junior_royals',
    program_variant: 'ages_13_15_bundoora',
    program_label: 'Junior Royals — Ages 13-15, Bundoora (Cutting Edge Cricket)',
  },

  // Junior Royals — Hallam (Term 2 + future variants)
  'price_1TMFh5Io52UEA50yrjh0rz92': {
    program: 'junior_royals',
    program_variant: 'term_2_hallam',
    program_label: 'Junior Royals — 2026 Term 2, Hallam (Cricket Connect)',
  },

  // Junior Royals add-on — bundled training shirt (still a program line)
  'price_1THybpIo52UEA50yl5fCU1t8': {
    program: 'junior_royals',
    program_variant: 'training_shirt_addon',
    program_label: 'Junior Royals — Training Shirt (Participant ONLY)',
  },

  // Female Cricket Kickstart
  'price_1TELBmIo52UEA50yebT4senm': {
    program: 'female_kickstart',
    program_variant: 'girls_kickstart',
    program_label: 'Female Cricket — Girls Kickstart Program',
  },

  // Elite — explicit price ID for the $2,995 deposit + 3 monthly payments plan
  // (description doesn't include "Elite" so the fuzzy fallback misses it)
  'price_1T7OxzIo52UEA50y2f9UvDSr': {
    program: 'elite',
    program_variant: 'deposit_3_monthly',
    program_label: 'Elite Program — $2,995 Payment Plan (Deposit + 3 Monthly)',
  },
};

// Shop price IDs — kept in sync with sync-from-stripe.js. A session that
// matches any of these is a SHOP order, not a program registration, and
// must be skipped here.
const SHOP_PRICE_IDS = new Set([
  'price_1TRJe7Io52UEA50yZ4i5OPwH', // ipl-replica-shirt
  'price_1TRJinIo52UEA50yaIwEA8Ni', // training-shirt
  'price_1TRJqhIo52UEA50ycGPuIieZ', // training-shorts
  'price_1TRJt4Io52UEA50ydwZmfUKh', // training-pants
  'price_1TRNozIo52UEA50yEkWYWKAq', // pink-cap
  'price_1TRNwaIo52UEA50yIChLyg1J', // fleece-jacket
]);

// ============================================================
// Fuzzy-match fallback for program sessions whose price IDs we
// don't yet have in PROGRAM_PRICE_IDS. Inspects the line item's
// product NAME (description) for keywords. This catches Elite
// Program and Holiday Program registrations that came in through
// Stripe Payment Links the codebase doesn't reveal.
// ============================================================
const classifyByDescription = (description = '') => {
  const d = description.toLowerCase();
  if (!d) return null;

  // Internal/test products — explicitly skip so they don't pollute counts.
  if (d.includes('test product')) return null;

  // Elite Program — flagship 12-week training. Match BEFORE the generic
  // "royals academy" Junior Royals fallback, since the Elite product
  // descriptions also contain "Royals Academy" (e.g. "T20 Elite Academy",
  // "Tailored Payment Plan", "Ambassador Program"). Also catch the
  // "$2995 Payment Plan (Deposit + 3 Monthly Payments)" Elite variant
  // whose description doesn't mention "Elite" at all.
  if (
    d.includes('elite program') ||
    d.includes('royals elite') ||
    d.includes('elite training programme') ||
    d.includes('elite training program') ||
    d.includes('elite academy') ||
    d.includes('t20 elite') ||
    d.includes('tailored payment plan') ||
    d.includes('ambassador program') ||
    d.includes('$2995 payment plan') ||
    d.includes('deposit + 3 monthly') ||
    d.includes('deposit + monthly')
  ) {
    return { program: 'elite', program_variant: null, program_label: description };
  }

  // Holiday Programs / Holiday Camps
  if (d.includes('holiday program') || d.includes('holiday camp') || d.includes('holiday clinic')) {
    return { program: 'holiday', program_variant: null, program_label: description };
  }

  // Female Cricket fallback
  if (d.includes('girls kickstart') || d.includes('female cricket') || d.includes('girls program')) {
    return { program: 'female_kickstart', program_variant: null, program_label: description };
  }

  // Junior Royals fallback (catches unseen variants like new venues)
  if (d.includes('junior royals') || d.includes('cutting edge') || d.includes('cricket connect') || d.includes('royals academy')) {
    return { program: 'junior_royals', program_variant: null, program_label: description };
  }

  return null;
};

// Resolve a session's primary program classification from its line items.
// Returns null if the session is not a program registration.
const classifySession = (session, lineItems) => {
  // Hard-stop: explicit shop metadata wins.
  if (session?.metadata?.source === 'academy-shop') return null;

  // Hard-stop: any shop price ID anywhere in the cart marks it as a shop session.
  if (lineItems.some(i => SHOP_PRICE_IDS.has(i.price_id))) return null;

  // Primary signal: explicit program metadata stamped at checkout creation.
  if (session?.metadata?.source === 'program' && session?.metadata?.program) {
    return {
      program: session.metadata.program,
      program_variant: session.metadata.program_variant || null,
      program_label: session.metadata.program_label || null,
    };
  }

  // Junior Royals Term 3 — must run BEFORE the price allowlist: the T3 Payment
  // Links reuse the Term 2 Hallam price ID (keep in sync with stripe-webhook.js).
  if (isJrT3Session(session, lineItems)) return classifyJrT3(lineItems);

  // Allowlist match — first line item with a known program price ID wins.
  for (const item of lineItems) {
    const match = PROGRAM_PRICE_IDS[item.price_id];
    if (match) return match;
  }

  // Fuzzy fallback — line item description contains a known program keyword.
  for (const item of lineItems) {
    const match = classifyByDescription(item.description);
    if (match) return match;
  }

  // Not a program session.
  return null;
};

const verifyAdmin = async (req) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('Missing bearer token');
  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) throw new Error('Invalid session');
  const { data: dashUser } = await sb
    .from('dashboard_users').select('email').eq('email', user.email).eq('active', true).single();
  if (!dashUser) throw new Error('Not authorised');
  return user.email;
};

const syncOneSession = async (sessionId) => {
  const stripe = getStripe();
  const supabase = getSupabase();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price', 'payment_intent', 'payment_intent.latest_charge'],
  });

  if (session.payment_status !== 'paid') {
    return { session_id: sessionId, skipped: true, reason: 'not_paid' };
  }

  const lineItems = (session.line_items?.data || []).map(i => ({
    name:        i.description,
    description: i.description,
    quantity:    i.quantity,
    unit_price:  i.price?.unit_amount,
    price_id:    i.price?.id,
    total:       i.amount_total,
  }));

  const classification = classifySession(session, lineItems);
  if (!classification) {
    return { session_id: sessionId, skipped: true, reason: 'not_a_program_session' };
  }

  const customerName    = session.customer_details?.name || '';
  const customerEmail   = session.customer_details?.email || '';
  const customerPhone   = session.customer_details?.phone || '';
  const shippingAddress = session.shipping_details?.address
                          || session.customer_details?.address
                          || null;

  const charge = session.payment_intent?.latest_charge;
  const card   = charge?.payment_method_details?.card;

  const payload = {
    program:                  classification.program,
    program_variant:          classification.program_variant,
    program_label:            classification.program_label,
    customer_name:            customerName,
    customer_email:           customerEmail,
    customer_phone:           customerPhone,
    shipping_address:         shippingAddress,
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
    paid_at:                  charge?.created ? new Date(charge.created * 1000).toISOString() : null,
    stripe_metadata:          session.metadata || null,
  };

  const { error } = await supabase
    .from('program_registrations')
    .upsert(payload, { onConflict: 'stripe_session_id' });

  if (error) {
    return { session_id: session.id, error: error.message, program: classification.program };
  }

  // Junior Royals Term 3 — also flip the matching jr_term3_* registration row
  // (same completion path as stripe-webhook.js; idempotent).
  let jrMatch = null;
  if (classification.program === 'junior_royals' && classification.program_variant === 'term_3') {
    try {
      jrMatch = await completeJrT3Registration(supabase, session, lineItems, 'sync-programs-from-stripe');
    } catch (e) {
      console.warn('jr_term3 completion failed (non-blocking):', e.message);
    }
  }

  return {
    session_id: session.id,
    program: classification.program,
    program_variant: classification.program_variant,
    jr_term3: jrMatch,
    upserted: true,
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const adminEmail = await verifyAdmin(req);
    console.log(`sync-programs-from-stripe initiated by ${adminEmail}`);

    const { days = 30, session_id } = req.body || {};

    // Single-session sync — useful for re-pulling a specific Stripe checkout
    if (session_id) {
      const out = await syncOneSession(session_id);
      return res.status(200).json({ ok: true, single: out });
    }

    // Bulk sync: walk paid Checkout Sessions in the last N days
    const stripe = getStripe();
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

    let lastId = null;
    let processed = 0;
    let synced = 0;
    let skipped = 0;
    const errors = [];
    const byProgram = { elite: 0, holiday: 0, female_kickstart: 0, junior_royals: 0 };

    while (true) {
      const params = { limit: 100, created: { gte: since } };
      if (lastId) params.starting_after = lastId;
      const page = await stripe.checkout.sessions.list(params);

      for (const s of page.data) {
        processed++;
        if (s.payment_status !== 'paid') { skipped++; continue; }
        try {
          const out = await syncOneSession(s.id);
          if (out?.skipped) { skipped++; continue; }
          if (out?.error) { errors.push({ session_id: s.id, error: out.error }); continue; }
          if (out?.upserted) {
            synced++;
            if (byProgram[out.program] != null) byProgram[out.program]++;
          }
        } catch (e) {
          errors.push({ session_id: s.id, error: e.message });
        }
      }

      if (!page.has_more) break;
      lastId = page.data[page.data.length - 1].id;
    }

    return res.status(200).json({
      ok: true,
      window_days: days,
      processed,
      synced,
      skipped,
      errors,
      by_program: byProgram,
    });
  } catch (err) {
    console.error('sync-programs-from-stripe error:', err);
    const isAuthErr = err.message?.includes('authoris') || err.message?.includes('session') || err.message?.includes('token');
    return res.status(isAuthErr ? 401 : 500).json({ error: err.message });
  }
}
