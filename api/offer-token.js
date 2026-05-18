// ============================================================
// Vercel Serverless Function — Offer Token operations
// POST /api/offer-token  { action: 'issue' | 'lookup' | 'respond', ... }
// ============================================================
// Replaces the direct anon-key access to offer_tokens / offer_responses
// that previously allowed any visitor to mint a valid program-
// acceptance token (test-token.js was a working proof) and to flip
// the status of any token by row id (RSVPForm anon UPDATE).
//
// Routing:
//   action: 'issue'   — admin only. Creates a new offer_tokens row
//                       and returns the token string.
//   action: 'lookup'  — takes a token STRING. Returns the minimal
//                       fields the public landing page needs
//                       (applicant_name, status, expires_at,
//                       program_slug). No row IDs are returned.
//   action: 'respond' — takes a token STRING plus a whitelisted set
//                       of response fields. Inserts offer_responses
//                       and flips offer_tokens.status atomically
//                       (well — two service-role writes; close enough
//                       for this workload).
//
// Why a server endpoint instead of an RLS-only fix:
//   * The token STRING is the credential, but the anon key can read
//     any row by row id, so an RLS rule "USING (token = X)" still
//     leaks PII to any caller that can guess a row id.
//   * Whitelisting the writable columns on the server kills the
//     mass-assignment risk where the browser sent ...formData with
//     extra columns the table happened to have.
//
// Required env vars in Vercel:
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ALLOWED_ORIGINS (optional, comma-separated)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, setCors, sendError } from './_lib/auth.js';

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

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Whitelisted response columns. Matches the keys RSVPForm.jsx writes
// in its conditional-field renderers — anything not in this set is
// silently dropped, killing the mass-assignment surface.
const ALLOWED_RESPONSE_FIELDS = [
    'what_excites', 'what_concerns', 'parent_sentiment',
    'hesitation_reason', 'decision_help', 'scheduling_concerns',
    'primary_reason', 'decline_details', 'cost_factor',
    'competing_programs', 'future_interest', 'improvement_suggestions',
];
const ALLOWED_DECISIONS = new Set(['yes', 'no', 'maybe', 'yes_but_no_assess']);
const MAX_FIELD_LEN = 2000;

const sanitiseField = (v) => {
    if (v == null) return null;
    const s = String(v);
    return s.length > MAX_FIELD_LEN ? s.slice(0, MAX_FIELD_LEN) : s;
};

async function handleIssue(req, res) {
    try {
        await verifyAdmin(req);
    } catch (err) {
        return sendError(res, 401, 'Unauthorised', err);
    }
    const { applicant_name, applicant_email, expires_at, program_slug } = req.body || {};
    if (typeof applicant_name !== 'string' || applicant_name.length < 1 || applicant_name.length > 200) {
        return sendError(res, 400, 'invalid applicant_name');
    }
    if (typeof applicant_email !== 'string' || !EMAIL_RE.test(applicant_email)) {
        return sendError(res, 400, 'invalid applicant_email');
    }
    let expiresAt = null;
    if (expires_at) {
        const t = Date.parse(expires_at);
        if (Number.isNaN(t)) return sendError(res, 400, 'invalid expires_at');
        expiresAt = new Date(t).toISOString();
    }

    const token = crypto.randomUUID();
    try {
        const sb = getSupabase();
        const { error } = await sb.from('offer_tokens').insert([{
            token,
            applicant_name,
            applicant_email,
            status: 'pending',
            expires_at: expiresAt,
            program_slug: typeof program_slug === 'string' ? program_slug : null,
        }]);
        if (error) return sendError(res, 500, 'Internal server error', error);
        return res.status(200).json({ ok: true, token });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', err);
    }
}

// Loads the token row and validates it for public use. Returns
// { row } on success, { error: <publicMessage>, status } on failure.
async function loadValidToken(token) {
    if (typeof token !== 'string' || !UUID_RE.test(token)) {
        return { error: 'Invalid invitation', status: 400 };
    }
    const sb = getSupabase();
    const { data, error } = await sb
        .from('offer_tokens')
        .select('id, token, applicant_name, status, expires_at, program_slug')
        .eq('token', token)
        .single();
    if (error || !data) {
        // Generic message — don't leak whether the token exists or
        // is expired vs malformed.
        return { error: 'Invitation not found', status: 404 };
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { error: 'Invitation expired', status: 410, status_value: data.status };
    }
    return { row: data };
}

async function handleLookup(req, res) {
    const { token } = req.body || {};
    const result = await loadValidToken(token);
    if (result.error) return sendError(res, result.status, result.error);
    const { row } = result;
    return res.status(200).json({
        applicant_name: row.applicant_name,
        status: row.status,
        expires_at: row.expires_at,
        program_slug: row.program_slug,
    });
}

async function handleRespond(req, res) {
    const { token, decision, fields } = req.body || {};
    const result = await loadValidToken(token);
    if (result.error) return sendError(res, result.status, result.error);
    const { row } = result;

    if (!ALLOWED_DECISIONS.has(decision)) {
        return sendError(res, 400, 'invalid decision');
    }
    if (row.status !== 'pending') {
        return sendError(res, 409, 'Invitation already responded');
    }

    // Whitelist + sanitise the response fields. Anything else the
    // caller sends is silently dropped.
    const cleanFields = {};
    if (fields && typeof fields === 'object') {
        for (const key of ALLOWED_RESPONSE_FIELDS) {
            if (key in fields) cleanFields[key] = sanitiseField(fields[key]);
        }
    }

    const sb = getSupabase();
    const { error: insertErr } = await sb.from('offer_responses').insert([{
        token_id: row.id,
        decision,
        ...cleanFields,
    }]);
    if (insertErr) return sendError(res, 500, 'Internal server error', insertErr);

    const newStatus = (decision === 'yes' || decision === 'yes_but_no_assess') ? 'attended' : 'declined';
    const { error: updateErr } = await sb
        .from('offer_tokens')
        .update({ status: newStatus, responded_at: new Date().toISOString() })
        .eq('id', row.id)
        .eq('status', 'pending'); // belt-and-braces against double-submit
    if (updateErr) return sendError(res, 500, 'Internal server error', updateErr);

    return res.status(200).json({ ok: true, decision, status: newStatus });
}

export default async function handler(req, res) {
    setCors(req, res, { allowMethods: 'POST, OPTIONS' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

    const action = req.body?.action;
    if (action === 'issue')   return handleIssue(req, res);
    if (action === 'lookup')  return handleLookup(req, res);
    if (action === 'respond') return handleRespond(req, res);
    return sendError(res, 400, 'invalid action');
}
