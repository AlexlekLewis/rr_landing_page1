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

  // Look up the token's row to (a) enforce single-use — a redeemed/inactive link is
  // dead — and (b) return only the NON-identity fields to pre-fill. Name + DOB are
  // deliberately NOT pre-filled: the player confirms those themselves.
  let prefill = null;
  try {
    const { data } = await supabase
      .from('pgp_scholarship_prefill')
      .select('contact_email, centre, redeemed_at, active')
      .eq('token', token)
      .maybeSingle();
    if (data && (data.active === false || data.redeemed_at)) {
      return res.status(200).json({ scholarship: false, redeemed: !!data.redeemed_at });
    }
    if (data) prefill = { contact_email: data.contact_email, centre: data.centre };
  } catch (_) { /* best-effort: discount still applies; the player types their details in */ }

  return res.status(200).json({ scholarship: true, programCents: sch.programCents, prefill });
}
