// ============================================================
// GET /api/pgp-fullride?token=<token>
// Validates a 100% full-ride scholarship link and returns its fixed centre (slug).
// Single-use: a redeemed or inactive token returns { valid:false }. Server-only
// (service role, RLS-locked table); the token carries no PII, only a centre.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : '';
  if (!token) return res.status(200).json({ valid: false });

  try {
    const { data } = await supabase
      .from('pgp_fullride')
      .select('centre, redeemed_at, active')
      .eq('token', token)
      .maybeSingle();
    if (!data || data.active === false || data.redeemed_at) {
      return res.status(200).json({ valid: false, redeemed: !!data?.redeemed_at });
    }
    return res.status(200).json({ valid: true, centre: data.centre });
  } catch (_) {
    return res.status(200).json({ valid: false });
  }
}
