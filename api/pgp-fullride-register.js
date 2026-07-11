// ============================================================
// POST /api/pgp-fullride-register
//   { application, email, playerName, squadId, uniformItems, fullRideToken }
//
// 100% full-ride scholarship — NO payment. Validates the single-use token
// (server-authoritative centre), writes a $0 CONFIRMED power_game_applications row
// (source pgp2026-fullride) so the player lands in the Google Sheet like everyone
// else, stamps the token redeemed (single-use), and sends a confirmation email.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { buildPaidRow } from './_lib/pgpCheckout.js';
import { sendPgpConfirmation } from './_lib/pgpEmail.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Centre slug → venue name (server-authoritative; the row's venue comes from the token).
const CENTRE_NAME = {
  mickleham: 'Mickleham Indoor Sports Centre',
  williamstown: 'The Netz',
  hallam: 'Elite Cricket Centre',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { application, fullRideToken } = req.body || {};
    if (!application || typeof application !== 'object') {
      return res.status(400).json({ error: 'Missing application payload' });
    }
    const token = typeof fullRideToken === 'string' ? fullRideToken.trim() : '';
    if (!token) return res.status(400).json({ error: 'Missing full-ride link token.' });

    // Consents gate — same contract as the paid checkout; fail closed.
    const a = application;
    const consentsAccepted =
      a.accept_terms && a.accept_player_code && a.accept_parent_code &&
      a.accept_social_media && a.accept_playing_standard && a.accept_ability_standard;
    if (!consentsAccepted) {
      return res.status(403).json({ error: 'All compliance agreements must be accepted.' });
    }

    // Validate the token: must exist, be active, and not already used (single-use).
    const { data: fr, error: frErr } = await supabase
      .from('pgp_fullride')
      .select('centre, redeemed_at, active')
      .eq('token', token)
      .maybeSingle();
    if (frErr) return res.status(503).json({ error: 'Couldn’t verify your link — please try again.' });
    if (!fr || fr.active === false) return res.status(404).json({ error: 'This full-ride link is not valid.' });
    if (fr.redeemed_at) return res.status(409).json({ error: 'This full-ride place has already been claimed.' });

    // Build the $0 CONFIRMED row. Venue comes from the token (authoritative), amount is 0.
    const syntheticSession = { id: `fullride-${token}`, amount_total: 0, currency: 'aud' };
    const row = buildPaidRow(application, syntheticSession);
    row.venue = CENTRE_NAME[fr.centre] || row.venue;
    row.amount_paid_cents = 0;
    row.uniform_total_cents = 0;

    // Idempotent on stripe_session_id (= fullride-<token>); a single-use token → one row.
    const { data: inserted, error: insErr } = await supabase
      .from('power_game_applications')
      .upsert(row, { onConflict: 'stripe_session_id', ignoreDuplicates: true })
      .select('id, email, player_name, venue, session_day, session_time, age_group')
      .maybeSingle();
    if (insErr) return res.status(500).json({ error: 'Could not save your registration — please try again.' });

    // Single-use: stamp the token consumed (idempotent).
    await supabase
      .from('pgp_fullride')
      .update({ redeemed_at: new Date().toISOString() })
      .eq('token', token)
      .is('redeemed_at', null);

    // Confirmation email (best-effort; amount omitted since it's a full scholarship).
    const r = inserted || row;
    const recipient = r?.email || r?.parent1_email; // under-18s carry the email on the parent field
    try {
      if (recipient) {
        await sendPgpConfirmation({
          to: recipient, playerName: r.player_name, centreName: r.venue,
          sessionDay: r.session_day, sessionTime: r.session_time, ageGroup: r.age_group,
          amountCents: null, ref: `FR-${token.slice(-6).toUpperCase()}`,
        });
      }
    } catch (e) { console.error('fullride: confirmation email failed (non-fatal):', e.message); }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('pgp-fullride-register error:', e);
    return res.status(500).json({ error: e.message });
  }
}
