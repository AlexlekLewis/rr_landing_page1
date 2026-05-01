// ============================================================
// Shared admin auth check for /api/* endpoints.
// ============================================================
// Reads the caller's Supabase session JWT from Authorization header,
// verifies the user exists in dashboard_users with active=true.
// Throws on any failure — caller is expected to wrap in try/catch
// and return 401 (auth failures) or 500 (everything else).
//
// Usage:
//   import { verifyAdmin } from './_lib/verifyAdmin.js';
//
//   try {
//     const adminEmail = await verifyAdmin(req);
//     // ... do admin work ...
//   } catch (err) {
//     const isAuthErr = err.code === 'AUTH';
//     return res.status(isAuthErr ? 401 : 500).json({ error: err.message });
//   }
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || process.env.NEXT_PUBLIC_SUPABASE_URL
           || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars for this deployment');
  _supabase = createClient(url, key);
  return _supabase;
};

const authError = (msg) => {
  const e = new Error(msg);
  e.code = 'AUTH';
  return e;
};

export const verifyAdmin = async (req) => {
  const auth = req.headers?.authorization || req.headers?.Authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw authError('Missing bearer token');

  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) throw authError('Invalid session');

  const { data: dashUser, error: dashErr } = await sb
    .from('dashboard_users')
    .select('email, role, active')
    .eq('email', user.email)
    .eq('active', true)
    .single();
  if (dashErr || !dashUser) throw authError('Not authorised');

  return { email: user.email, role: dashUser.role };
};
