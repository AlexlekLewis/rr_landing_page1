// Shared auth + CORS helpers for the Vercel serverless functions.
//
// verifyAdmin(req) — throws if the request isn't a signed-in
// dashboard_users row (active=true). Pattern duplicated in
// api/sync-from-stripe.js, sync-programs-from-stripe.js and
// audit-stripe-sessions.js; new endpoints should import from here.
//
// setCors(req, res) — writes CORS headers only for origins in the
// configured allowlist. ALLOWED_ORIGINS env var is a comma-separated
// list; defaults to the production domain.

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
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    _supabase = createClient(url, key);
    return _supabase;
};

export async function verifyAdmin(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) throw new Error('unauthenticated');
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(token);
    if (error || !user || !user.email) throw new Error('unauthenticated');
    const { data: dashUser } = await sb
        .from('dashboard_users')
        .select('email')
        .eq('email', user.email.toLowerCase())
        .eq('active', true)
        .single();
    if (!dashUser) throw new Error('forbidden');
    return user.email;
}

const parseList = (s) =>
    (s || '').split(',').map(x => x.trim()).filter(Boolean);

// Defaults are the live and common dev origins. Override with an
// ALLOWED_ORIGINS env var to add Vercel previews or staging hosts.
const DEFAULT_ALLOWED_ORIGINS = [
    'https://rramelbourne.com',
    'https://www.rramelbourne.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

export function setCors(req, res, { allowMethods = 'POST, GET, OPTIONS' } = {}) {
    const configured = parseList(process.env.ALLOWED_ORIGINS);
    const allowlist = configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
    const origin = req.headers.origin || '';
    if (origin && allowlist.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', allowMethods);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Sends a generic error response and logs the underlying detail
// server-side. Use this everywhere instead of returning err.message —
// raw Stripe / Supabase / Postgres errors often disclose RLS policy
// names, internal IDs, and schema details that aid an attacker.
export function sendError(res, status, publicMessage, internalErr) {
    if (internalErr) {
        const detail = internalErr instanceof Error ? internalErr.stack || internalErr.message : internalErr;
        console.error(`[${status}] ${publicMessage}:`, detail);
    }
    return res.status(status).json({ error: publicMessage });
}
