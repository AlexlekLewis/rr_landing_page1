// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session for a Power Game spot.
// POST /api/power-game-checkout  { application, email, playerName, squadId, uniformTotalCents, uniformSelection }
//
// CREATE-ON-PAYMENT: the application row is NOT written to the database here. The
// full application payload travels in the Stripe session metadata (packed); the
// power_game_applications row is created only once payment is confirmed, by
// api/power-game-webhook (with api/power-game-verify-session as the success-page
// backstop). So an unpaid applicant never locks a spot in the DB or the Google Sheet.
// Env: STRIPE_SECRET_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { packApplication } from './_lib/pgpCheckout.js';
import { buildUniformLineItems, freeKeysForOffer, scholarshipForToken } from './_lib/uniformPricing.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const BLOCK_FEE_CENTS = 98900; // $989 — 8-week phase

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { application, email, playerName, squadId, uniformItems, uniformTotalCents, uniformSelection, giftOffer, allowPromo, scholarshipToken } = req.body || {};
    // Early-bird gift offer (shared link). Server owns which garments are free —
    // the client only names an offer id, validated here against GIFT_OFFERS.
    const gift = freeKeysForOffer(giftOffer);
    // Scholarship link (?s=<token>). The SERVER owns the discounted program price —
    // an unknown/absent token just falls through to the full fee. Kit is unaffected
    // (still charged at full price below), so the discount lands on the program only.
    const scholarship = scholarshipForToken(scholarshipToken);
    const programCents = scholarship ? scholarship.programCents : BLOCK_FEE_CENTS;
    // Single-use: a scholarship link already used to complete a payment is dead.
    // (Primary gate is the page/endpoint hiding the discount; this is the backstop.)
    if (scholarship) {
      try {
        const { data: sch } = await supabase
          .from('pgp_scholarship_prefill')
          .select('redeemed_at')
          .eq('token', scholarship.token)
          .maybeSingle();
        if (sch?.redeemed_at) {
          return res.status(409).json({ error: 'This scholarship link has already been used — please contact us if you need a hand.' });
        }
      } catch (_) { /* fail-open: success-page + webhook still enforce single-use */ }
    }
    if (!application || typeof application !== 'object') {
      return res.status(400).json({ error: 'Missing application payload' });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Checkout is not configured.' });
    }

    // Consents are the gate. The application payload is the source of truth (the UI
    // also gates this); fail closed if any required consent is missing.
    const a = application;
    const consentsAccepted =
      a.accept_terms && a.accept_player_code && a.accept_parent_code &&
      a.accept_social_media && a.accept_playing_standard && a.accept_ability_standard;
    if (!consentsAccepted) {
      return res.status(403).json({ error: 'All compliance agreements must be accepted before payment.' });
    }

    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: scholarship
              ? 'The Power Game Program — 8-week Power Pre-Season (Scholarship place)'
              : 'The Power Game Program — 8-week Power Pre-Season (Phase 1)',
          },
          unit_amount: programCents,
        },
        quantity: 1,
      },
    ];

    // Uniform/kit. Preferred path: the browser sends an array of { key, size } picks
    // and we build one Stripe line item PER garment at SERVER-decided prices (a
    // tampered request can't change what's charged). Legacy fallback: a single
    // client-sent uniformTotalCents (the original funnel path — left untouched).
    const uniform = buildUniformLineItems(uniformItems, gift.keys);
    let kitCents = 0;
    let kitSummary = '';
    if (uniform.lineItems.length > 0) {
      lineItems.push(...uniform.lineItems);
      kitCents = uniform.totalCents;
      kitSummary = uniform.summary;
    } else {
      const legacyCents = Number(uniformTotalCents) || 0;
      if (legacyCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Royals Academy Kit',
              description: (uniformSelection || '').slice(0, 250) || undefined,
            },
            unit_amount: legacyCents,
          },
          quantity: 1,
        });
        kitCents = legacyCents;
        kitSummary = uniformSelection || '';
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: lineItems,
      // Promo/coupon box on Stripe's hosted checkout. Only enabled for the private
      // link-only flows (confirm / accepted / returning), which send allowPromo:true.
      // The public funnel omits it, so its checkout shows no code field. NOTE: a
      // percent coupon discounts the WHOLE order — fine here because on a gift link
      // (e.g. ?gift=mickleham) the kit is already $0, so it only reduces the $989.
      allow_promotion_codes: allowPromo === true,
      metadata: {
        source: 'power-game',
        player_name: (playerName || a.player_name || '').slice(0, 200),
        squad_id: squadId || '',
        uniform_selection: (kitSummary || a.uniform_selection || '').slice(0, 480),
        uniform_total_cents: String(kitCents),
        gift_offer: gift.id || '',
        free_kit: (uniform.giftSummary || '').slice(0, 240),
        scholarship_token: scholarship ? scholarship.token : '',
        program_cents: String(programCents),
        // Full application payload, packed across app_0..app_{n-1} (+ app_n count).
        ...packApplication(a),
      },
      success_url: `${BASE_URL}/PGP2026/apply/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/PGP2026/apply?cancelled=1`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('power-game-checkout error:', e);
    return res.status(500).json({ error: e.message });
  }
}
