// ============================================================
// Vercel Serverless Function — public Power Game availability (counts only).
// GET /api/pgp-availability  →  { ok, counts: { "<normalised venue|day|time>": paidCount } }
// ============================================================
// Returns ONLY aggregate paid counts per session (no names, no PII), so the
// Locations picker can show truthful "Only X left" when a session is genuinely
// low. Read with service_role (anon can't SELECT the table), edge-cached 60s,
// and fail-open ({} counts) so it can never block the page.
// Env: SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

let _sb = null;
const getSb = () => {
  if (_sb) return _sb;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _sb = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _sb;
};

export default async function handler(req, res) {
  try {
    const sb = getSb();
    const { data, error } = await sb
      .from('power_game_applications')
      .select('venue, session_day, session_time')
      .or('payment_status.eq.completed,status.eq.paid');
    if (error) throw error;
    const counts = {};
    for (const r of data || []) {
      const key = norm(`${r.venue}|${r.session_day}|${r.session_time}`);
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, counts });
  } catch (e) {
    // Fail open — the page must never break because availability couldn't load.
    return res.status(200).json({ ok: false, counts: {} });
  }
}
