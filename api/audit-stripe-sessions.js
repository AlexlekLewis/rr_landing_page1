// ============================================================
// Vercel Serverless Function — Read-only Stripe audit
// POST /api/audit-stripe-sessions   { days?: number }
// ============================================================
// Walks every Stripe Checkout Session in the window (default 365d)
// and returns a classified row per session — paid AND unpaid, programs
// AND shop AND unknown. Does NOT write to the database.
//
// Used to produce the complete transaction-by-transaction audit
// spreadsheet so we can reconcile counts against Stripe end-to-end.
//
// Auth: caller's Supabase session JWT in `authorization: Bearer ...`,
// verified against dashboard_users.active=true (same as sync endpoint).
//
// Required env vars (already set in Vercel):
//   STRIPE_SECRET_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

let _stripe = null;
const getStripe = () => {
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
};

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

// ============================================================
// Classifier — kept in sync with sync-programs-from-stripe.js
// ============================================================
const PROGRAM_PRICE_IDS = {
  'price_1TIOdNIo52UEA50yjRoWwDVt': { program: 'junior_royals', variant: 'ages_7_9_bundoora',   label: 'Junior Royals — Ages 7-9, Bundoora' },
  'price_1TIOerIo52UEA50ynRv5Mvwg': { program: 'junior_royals', variant: 'ages_10_12_bundoora', label: 'Junior Royals — Ages 10-12, Bundoora' },
  'price_1TIOguIo52UEA50y5DGrBbsP': { program: 'junior_royals', variant: 'ages_13_15_bundoora', label: 'Junior Royals — Ages 13-15, Bundoora' },
  'price_1TMFh5Io52UEA50yrjh0rz92': { program: 'junior_royals', variant: 'term_2_hallam',       label: 'Junior Royals — 2026 Term 2, Hallam' },
  'price_1THybpIo52UEA50yl5fCU1t8': { program: 'junior_royals', variant: 'training_shirt_addon', label: 'Junior Royals — Training Shirt Addon' },
  'price_1TELBmIo52UEA50yebT4senm': { program: 'female_kickstart', variant: 'girls_kickstart', label: 'Female Cricket — Girls Kickstart' },
  'price_1T7OxzIo52UEA50y2f9UvDSr': { program: 'elite',            variant: 'deposit_3_monthly', label: 'Elite Program — $2,995 Payment Plan (Deposit + 3 Monthly)' },
};

const SHOP_PRICE_IDS = new Set([
  'price_1TRJe7Io52UEA50yZ4i5OPwH',
  'price_1TRJinIo52UEA50yaIwEA8Ni',
  'price_1TRJqhIo52UEA50ycGPuIieZ',
  'price_1TRJt4Io52UEA50ydwZmfUKh',
  'price_1TRNozIo52UEA50yEkWYWKAq',
  'price_1TRNwaIo52UEA50yIChLyg1J',
]);

const classifyByDescription = (description = '') => {
  const d = description.toLowerCase();
  if (!d) return null;
  // Internal/test products — surface as 'test' so they're visible in the
  // audit but separate from real "unknown" classification failures.
  if (d.includes('test product')) return { program: 'test', reason: 'test_product' };
  if (
    d.includes('elite program') || d.includes('royals elite') ||
    d.includes('elite training programme') || d.includes('elite training program') ||
    d.includes('elite academy') || d.includes('t20 elite') ||
    d.includes('tailored payment plan') || d.includes('ambassador program') ||
    d.includes('$2995 payment plan') || d.includes('deposit + 3 monthly') ||
    d.includes('deposit + monthly')
  ) return { program: 'elite', reason: 'desc_match_elite' };
  if (d.includes('holiday program') || d.includes('holiday camp') || d.includes('holiday clinic'))
    return { program: 'holiday', reason: 'desc_match_holiday' };
  if (d.includes('girls kickstart') || d.includes('female cricket') || d.includes('girls program'))
    return { program: 'female_kickstart', reason: 'desc_match_female' };
  if (d.includes('junior royals') || d.includes('cutting edge') || d.includes('cricket connect') || d.includes('royals academy'))
    return { program: 'junior_royals', reason: 'desc_match_junior' };
  return null;
};

// ============================================================
// Detect payment-plan installments by description / amount.
// Stripe payment links for the Elite "Flexi 4-Payment Option" charge
// per-instalment, so each session is one installment.
// ============================================================
const detectPaymentType = (description = '') => {
  const d = description.toLowerCase();
  if (d.includes('flexi') && d.includes('payment')) return 'installment_4pay';
  if (d.includes('payment option') || d.includes('payment plan')) return 'installment';
  if (d.includes('tailored payment')) return 'installment_tailored';
  if (d.includes('subsidised')) return 'subsidised';
  return 'one_off';
};

const classifySession = (session, lineItems) => {
  // Shop wins immediately
  if (session?.metadata?.source === 'academy-shop') {
    return { program: 'shop', reason: 'metadata_source_shop' };
  }
  if (lineItems.some(i => SHOP_PRICE_IDS.has(i.price_id))) {
    return { program: 'shop', reason: 'shop_price_id_match' };
  }
  // Stamped program metadata wins next
  if (session?.metadata?.source === 'program' && session?.metadata?.program) {
    return { program: session.metadata.program, reason: 'metadata_source_program' };
  }
  // Known program price IDs
  for (const item of lineItems) {
    if (PROGRAM_PRICE_IDS[item.price_id]) {
      return { program: PROGRAM_PRICE_IDS[item.price_id].program, reason: 'price_id_allowlist' };
    }
  }
  // Fuzzy description fallback
  for (const item of lineItems) {
    const m = classifyByDescription(item.description);
    if (m) return m;
  }
  return { program: 'unknown', reason: 'no_match' };
};

const verifyAdmin = async (req) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('Missing bearer token');
  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) throw new Error('Invalid session');
  const { data: dashUser } = await sb.from('dashboard_users').select('email').eq('email', user.email).eq('active', true).single();
  if (!dashUser) throw new Error('Not authorised');
  return user.email;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const adminEmail = await verifyAdmin(req);
    console.log(`audit-stripe-sessions initiated by ${adminEmail}`);

    const { days = 365 } = req.body || {};
    const stripe = getStripe();
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

    const rows = [];
    let lastId = null;
    let pageCount = 0;

    while (true) {
      const params = { limit: 100, created: { gte: since }, expand: ['data.line_items', 'data.payment_intent', 'data.payment_intent.latest_charge'] };
      if (lastId) params.starting_after = lastId;
      const page = await stripe.checkout.sessions.list(params);
      pageCount++;

      for (const s of page.data) {
        const lineItems = (s.line_items?.data || []).map(i => ({
          description: i.description,
          quantity:    i.quantity,
          unit_price:  i.price?.unit_amount,
          price_id:    i.price?.id,
          total:       i.amount_total,
        }));

        const cls = classifySession(s, lineItems);
        const primaryItem = lineItems[0]?.description || '';
        const charge = s.payment_intent?.latest_charge;
        const card = charge?.payment_method_details?.card;

        rows.push({
          session_id:           s.id,
          created_at:           new Date(s.created * 1000).toISOString(),
          payment_status:       s.payment_status,         // 'paid' | 'unpaid' | 'no_payment_required'
          status:               s.status,                  // 'open' | 'complete' | 'expired'
          customer_email:       s.customer_details?.email || '',
          customer_name:        s.customer_details?.name || '',
          customer_phone:       s.customer_details?.phone || '',
          amount_total_aud:     s.amount_total != null ? (s.amount_total / 100) : null,
          currency:             s.currency || 'aud',
          program:              cls.program,
          classification_reason: cls.reason,
          payment_type:         detectPaymentType(primaryItem),
          line_item_description: lineItems.map(i => i.description).filter(Boolean).join(' | '),
          price_ids:            lineItems.map(i => i.price_id).filter(Boolean).join(' | '),
          card_brand:           card?.brand || '',
          card_last4:           card?.last4 || '',
          card_country:         card?.country || '',
          stripe_metadata_source: s.metadata?.source || '',
          receipt_url:          charge?.receipt_url || '',
        });
      }

      if (!page.has_more) break;
      lastId = page.data[page.data.length - 1].id;
      if (pageCount > 100) break; // safety stop
    }

    // Compute returning-customer flag — a customer is "returning" if they have
    // more than one paid session in the window. Counts only paid to avoid
    // false positives from abandoned/expired carts.
    const paidCountByEmail = new Map();
    for (const r of rows) {
      if (r.payment_status !== 'paid' || !r.customer_email) continue;
      const k = r.customer_email.toLowerCase();
      paidCountByEmail.set(k, (paidCountByEmail.get(k) || 0) + 1);
    }
    for (const r of rows) {
      const k = (r.customer_email || '').toLowerCase();
      const n = k ? (paidCountByEmail.get(k) || 0) : 0;
      r.client_type = n === 0 ? 'no_paid_session'
                    : n === 1 ? 'first_time_customer'
                    : 'returning_customer';
      r.paid_session_count_for_email = n;
    }

    // Summary
    const summary = {
      total_sessions: rows.length,
      by_status: {},
      by_program_paid: {},
      by_payment_type_paid: {},
      by_client_type_paid: {},
    };
    for (const r of rows) {
      summary.by_status[r.payment_status] = (summary.by_status[r.payment_status] || 0) + 1;
      if (r.payment_status === 'paid') {
        summary.by_program_paid[r.program]      = (summary.by_program_paid[r.program] || 0) + 1;
        summary.by_payment_type_paid[r.payment_type] = (summary.by_payment_type_paid[r.payment_type] || 0) + 1;
        summary.by_client_type_paid[r.client_type] = (summary.by_client_type_paid[r.client_type] || 0) + 1;
      }
    }

    return res.status(200).json({
      ok: true,
      window_days: days,
      generated_at: new Date().toISOString(),
      summary,
      rows,
    });
  } catch (err) {
    console.error('audit-stripe-sessions error:', err);
    const isAuthErr = err.message?.includes('authoris') || err.message?.includes('session') || err.message?.includes('token');
    return res.status(isAuthErr ? 401 : 500).json({ error: err.message });
  }
}
