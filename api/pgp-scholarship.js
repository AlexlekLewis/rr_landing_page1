// ============================================================
// GET /api/pgp-scholarship?token=<token>
// For a unique scholarship link, returns the discounted program price + the
// player's saved details to PRE-FILL the form ("confirm your details").
//
// Price comes from the server-owned SCHOLARSHIPS map; the PII pre-fill comes from
// the RLS-locked pgp_scholarship_prefill table, read with the service role. The
// token is opaque/random, so PII can't be enumerated, and it is never returned
// for an unknown/inactive token. Nothing is cached (no-store) since it's PII.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { scholarshipForToken } from './_lib/uniformPricing.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : '';
  const sch = scholarshipForToken(token); // price authority (also validates the token)
  if (!sch) return res.status(200).json({ scholarship: false });

  // Pre-fill is best-effort: if the lookup fails, the discount still applies and the
  // player just types their details in as before.
  let prefill = null;
  try {
    const { data } = await supabase
      .from('pgp_scholarship_prefill')
      .select('player_name, player_dob, contact_email, centre')
      .eq('token', token)
      .eq('active', true)
      .maybeSingle();
    if (data) prefill = data;
  } catch (_) { /* no-op */ }

  return res.status(200).json({ scholarship: true, programCents: sch.programCents, prefill });
}
