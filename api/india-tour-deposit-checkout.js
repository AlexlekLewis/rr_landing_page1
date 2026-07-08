// ============================================================
// Vercel Serverless Function — India Tour Sept 2026 DEPOSIT checkout.
// POST /api/india-tour-deposit-checkout
//
// Creates a Stripe Checkout Session for the $2,200 AUD deposit
// ($2,000 + $200 GST) and records the submission in
// public.india_tour_2026_deposits (service role — never exposed to client).
//
// The page is a private, key-gated link; this endpoint re-checks the key
// server-side so bots can't spam the deposits table. Pricing is
// server-authoritative — the amount is fixed here, never trusted from the client.
//
// One persistent Stripe product ("RRA India Tour — September 2026 · Deposit")
// is created lazily on first checkout and reused for every deposit.
//
// Required env (already set in Vercel): STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY,
// VITE_SUPABASE_URL, VITE_APP_URL. Optional: INDIA_TOUR_DEPOSIT_KEY.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';

const DEPOSIT_CENTS = 220000; // AUD $2,200 = $2,000 deposit + $200 GST (10%)
const GST_CENTS = 20000;      // $200
const ACCESS_KEY = process.env.INDIA_TOUR_DEPOSIT_KEY || 'INDIA2026';

const PRODUCT_APP_KEY = 'rra_india_tour_2026_deposit';
const PRODUCT_NAME = 'RRA India Tour — September 2026 · Deposit';
const PRODUCT_DESC =
  'Deposit to secure a place on the Rajasthan Royals Academy Melbourne India Tour (September 2026). ' +
  'AUD $2,000 + $200 GST (10%). Applied to your total tour cost.';

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  _supabase = createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
  return _supabase;
};

// Reuse a single catalog product across all deposits. Created on first call.
let _productIdCache = null;
async function getDepositProductId() {
  if (_productIdCache) return _productIdCache;
  try {
    const found = await stripe.products.search({
      query: `active:'true' AND metadata['app_key']:'${PRODUCT_APP_KEY}'`,
      limit: 1,
    });
    if (found?.data?.[0]) {
      _productIdCache = found.data[0].id;
      return _productIdCache;
    }
  } catch (_) {
    // Search index can lag right after creation — fall through and create.
  }
  const p = await stripe.products.create({
    name: PRODUCT_NAME,
    description: PRODUCT_DESC,
    metadata: { app_key: PRODUCT_APP_KEY },
  });
  _productIdCache = p.id;
  return _productIdCache;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const b = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};

    // Honeypot — bots fill this; humans never see it. Pretend success.
    if (b.hp_website && String(b.hp_website).trim()) return res.status(200).json({ ok: true, hp: true });

    // Private-link gate (also enforced client-side). Keeps randoms/bots out of the table.
    if (String(b.key || '') !== ACCESS_KEY) {
      return res.status(403).json({ error: 'This deposit link is private. Please use the personal link shared with you.' });
    }

    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Checkout is not configured.' });

    const registrantName = String(b.registrant_name || '').trim();
    const email = String(b.email || '').trim();
    const playerName = String(b.player_name || '').trim();
    if (!registrantName || !email || !email.includes('@') || !playerName) {
      return res.status(400).json({ error: 'Please provide your name, a valid email, and the player name.' });
    }
    if (!b.consent_terms) return res.status(403).json({ error: 'Please agree to the deposit terms to continue.' });

    // Capture the submission first (best-effort — never block a sale on a DB hiccup).
    let depositId = null;
    const supabase = getSupabase();
    if (supabase) {
      const row = {
        status: 'pending_payment',
        source: 'india-tour-deposit',
        key_used: ACCESS_KEY,
        registrant_name: registrantName,
        email,
        mobile: String(b.mobile || '').trim() || null,
        player_name: playerName,
        player_dob: b.player_dob || null,
        player_age: Number.isFinite(+b.player_age) ? +b.player_age : null,
        current_club: String(b.current_club || '').trim() || null,
        traveller_count: Number.isFinite(+b.traveller_count) ? +b.traveller_count : null,
        accompanying: String(b.accompanying || '').trim() || null,
        notes: String(b.notes || '').trim() || null,
        consent_terms: true,
        consent_terms_at: new Date().toISOString(),
        currency: 'aud',
        amount_cents: DEPOSIT_CENTS,
        gst_cents: GST_CENTS,
        page_referrer: String(b.page_referrer || '').slice(0, 500) || null,
        utm_source: b.utm_source || null,
        utm_medium: b.utm_medium || null,
        utm_campaign: b.utm_campaign || null,
      };
      const { data, error } = await supabase
        .from('india_tour_2026_deposits')
        .insert(row)
        .select('id')
        .single();
      if (error) console.error('deposit insert error:', error.message);
      else depositId = data.id;
    }

    const productId = await getDepositProductId();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      client_reference_id: depositId || undefined,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product: productId,
            unit_amount: DEPOSIT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        source: 'india-tour-deposit',
        deposit_id: depositId || '',
        registrant_name: registrantName.slice(0, 200),
        player_name: playerName.slice(0, 200),
        traveller_count: String(b.traveller_count || ''),
        gst_cents: String(GST_CENTS),
      },
      payment_intent_data: {
        description: `India Tour Sept 2026 deposit — ${playerName}`.slice(0, 200),
        metadata: { source: 'india-tour-deposit', deposit_id: depositId || '', player_name: playerName.slice(0, 200) },
      },
      success_url: `${BASE_URL}/india-tour-2026/deposit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/india-tour-2026/deposit?key=${encodeURIComponent(ACCESS_KEY)}&cancelled=1`,
    });

    if (supabase && depositId) {
      await supabase
        .from('india_tour_2026_deposits')
        .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
        .eq('id', depositId);
    }

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('india-tour-deposit-checkout error:', e);
    return res.status(500).json({ error: e.message || 'Checkout failed' });
  }
}
