// ============================================================
// Vercel Serverless Function — Elite Program Feedback + Win-back survey
//
//   POST /api/program-feedback   -> public: submit a completed survey response
//
// The public write goes through this function (service-role) because anon access to
// public.program_feedback is fully disabled by RLS — the rows hold respondent names,
// emails and candid churn reasons, so nothing is readable with the public anon key.
// Admins read responses in /rramadmin_26/feedback via the authenticated Supabase session.
//
// After a successful insert we ALSO best-effort mirror the row into a Google Sheet using
// the existing service account (same GOOGLE_SERVICE_ACCOUNT_JSON used by the holiday sync).
// The mirror is fire-and-forget: if it fails, the submission still succeeds — Supabase +
// the admin dashboard are the source of truth. Set SHEET_ID below to switch the mirror on.
//
// Required env vars in Vercel:
//   VITE_SUPABASE_URL  (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY
//   GOOGLE_SERVICE_ACCOUNT_JSON   (only needed for the optional Sheet mirror)
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

// Google Sheet mirror target. Leave '' to disable the mirror entirely (DB-only). Once the
// "Elite Program Feedback 2026" sheet exists and is shared with the service account, paste
// its spreadsheet id here (the long token in the sheet URL) and the tab name below.
const SHEET_ID  = '';
const SHEET_TAB = 'Responses';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
};

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const clip = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : v);

// 1–5 (or a custom range) or null. Anything out of range becomes null rather than a 400 —
// most survey questions are optional, we don't want a stray value to reject the whole thing.
const rating = (v, lo = 1, hi = 5) => {
  const n = Number.parseInt(v, 10);
  return Number.isInteger(n) && n >= lo && n <= hi ? n : null;
};

// Whitelist a value against a set of allowed enum strings, else null.
const oneOf = (v, allowed) => (allowed.includes(v) ? v : null);

// Clean a string[] to at most `max` trimmed, capped, de-duped entries.
const strArray = (v, max = 25, len = 120) => {
  if (!Array.isArray(v)) return null;
  const out = [];
  for (const item of v) {
    const s = clip(item, len);
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= max) break;
  }
  return out.length ? out : null;
};

const hashIp = (req) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
  if (!ip) return null;
  return createHash('sha256').update(ip + '|rra-feedback').digest('hex').slice(0, 32);
};

// ── Optional Google Sheet mirror (server-side, service account) ──────────────
const fmtMelb = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso || ''; }
};

// Order MUST match the header row installed on the sheet. Append-only (one row per response).
const SHEET_HEADERS = [
  'Submitted (Melb)', 'Program', 'Respondent', 'Role', 'Email', 'Player', 'Centre',
  'Overall', 'Improvement', 'Enjoyment',
  'Explore', 'Explore note', 'Challenge', 'Challenge note', 'Execute', 'Execute note',
  'Match Centre', 'Match Centre note', 'Match Centre unique', 'Scouting reports', 'App in own time',
  'Format fit', 'Times', 'Times better', 'Location', 'Value',
  'Coaching', 'Jarryd Rogers', 'BowlStrong', 'Callum Stow', 'Harkirat Bajwa', 'Zac Parr',
  'NeuroVision & fitness', 'Guest speakers', 'Communication', 'Pathway clarity',
  'Recommend (NPS)', 'Continue next?', 'Stay reasons', 'Barriers', 'What would change mind',
  'Loves most', 'Would change', 'Anything else', 'Consent', 'Lead source', 'Record ID',
];

const leadSource = (r) => {
  const s = (r.utm_source || '').toLowerCase(), m = (r.utm_medium || '').toLowerCase(), ref = (r.page_referrer || '').toLowerCase();
  const paid = /(cpc|ppc|paid)/.test(m);
  if (s) {
    if (/(facebook|fb|instagram|ig|meta)/.test(s)) return (paid ? 'Paid Social' : 'Social') + ' — FB/IG';
    if (/google/.test(s)) return paid ? 'Google Ads' : 'Google';
    if (/(email|newsletter|klaviyo|mailchimp|outlook)/.test(s) || m === 'email') return 'Email';
    if (/(sms|whatsapp|text)/.test(s)) return 'SMS / WhatsApp';
    return r.utm_source + (m ? ' / ' + m : '');
  }
  if (ref) {
    if (/(facebook|instagram|fbclid)/.test(ref)) return 'Social — FB/IG';
    if (/(mail\.google|gmail|outlook)/.test(ref)) return 'Email';
    if (/google\./.test(ref)) return 'Google — organic';
    if (/(rramelbourne\.com|localhost)/.test(ref)) return 'Direct / internal';
    return 'Referral';
  }
  return 'Direct / unknown';
};

const sheetRow = (r) => ([
  fmtMelb(r.created_at), r.program || '', r.respondent_name || '', r.respondent_role || '',
  r.respondent_email || '', r.player_name || '', r.centre || '',
  r.rating_overall ?? '', r.improvement ?? '', r.enjoyment ?? '',
  r.explore_rating ?? '', r.explore_comment || '', r.challenge_rating ?? '', r.challenge_comment || '',
  r.execute_rating ?? '', r.execute_comment || '',
  r.matchcentre_rating ?? '', r.matchcentre_comment || '', r.matchcentre_unique ?? '', r.scouting_reports_use || '', r.matchcentre_own_time || '',
  r.format_fit || '', r.times_rating ?? '', r.times_better || '', r.location_rating ?? '', r.value_rating ?? '',
  r.coaching_rating ?? '', r.specialist_jarryd ?? '', r.specialist_bowlstrong ?? '', r.specialist_callum ?? '',
  r.specialist_bajwa ?? '', r.specialist_zach ?? '',
  r.neuro_fitness_rating ?? '', r.guests_rating ?? '', r.communication_rating ?? '', r.pathway_clarity ?? '',
  r.nps ?? '', r.continue_next || '',
  Array.isArray(r.stay_reasons) ? r.stay_reasons.join(', ') + (r.stay_reason_other ? '; ' + r.stay_reason_other : '') : (r.stay_reason_other || ''),
  Array.isArray(r.barriers) ? r.barriers.join(', ') + (r.barrier_other ? '; ' + r.barrier_other : '') : (r.barrier_other || ''),
  r.change_mind || '', r.love_most || '', r.would_change || '', r.anything_else || '',
  r.consent_contact ? 'Yes' : 'No', leadSource(r), r.id || '',
]);

// Best-effort append. Never throws to the caller — logs and returns.
const mirrorToSheet = async (row) => {
  if (!SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return;
  try {
    const { google } = await import('googleapis');
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version: 'v4', auth });

    // Ensure the header row exists (idempotent: only writes it when A1 is empty).
    const head = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${SHEET_TAB}!A1:A1` });
    if (!head.data.values || !head.data.values.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID, range: `${SHEET_TAB}!A1`, valueInputOption: 'RAW',
        requestBody: { values: [SHEET_HEADERS] },
      });
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID, range: `${SHEET_TAB}!A1`, valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS', requestBody: { values: [sheetRow(row)] },
    });
  } catch (e) {
    console.error('[program-feedback] Sheet mirror failed (non-fatal):', e.message);
  }
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Honeypot — bots fill this hidden field; humans never do. Pretend success.
  if (body.hp_website && String(body.hp_website).trim().length > 0) {
    return res.status(201).json({ ok: true, hp: true });
  }

  // Identity is required for this survey (we need to know who to follow up with).
  const respondent_name = clip(body.respondent_name, 80);
  const respondent_email = clip(body.respondent_email, 120);
  const player_name = clip(body.player_name, 80);

  if (!respondent_name) return res.status(400).json({ error: 'Please add your name.' });
  if (!respondent_email || !respondent_email.includes('@')) {
    return res.status(400).json({ error: 'Please add a valid email so we can follow up.' });
  }
  if (!player_name) return res.status(400).json({ error: "Please add the player's name." });

  const row = {
    program: clip(body.program, 80) || 'Elite Program 2026',
    respondent_name,
    respondent_email,
    player_name,
    respondent_role: oneOf(body.respondent_role, ['Parent', 'Player', 'Both']),
    centre: clip(body.centre, 60) || null,

    rating_overall: rating(body.rating_overall),
    improvement: rating(body.improvement),
    enjoyment: rating(body.enjoyment),

    explore_rating: rating(body.explore_rating),
    explore_comment: clip(body.explore_comment, 1000) || null,
    challenge_rating: rating(body.challenge_rating),
    challenge_comment: clip(body.challenge_comment, 1000) || null,
    execute_rating: rating(body.execute_rating),
    execute_comment: clip(body.execute_comment, 1000) || null,

    matchcentre_rating: rating(body.matchcentre_rating),
    matchcentre_unique: rating(body.matchcentre_unique),
    matchcentre_comment: clip(body.matchcentre_comment, 1000) || null,
    scouting_reports_use: oneOf(body.scouting_reports_use, ['yes', 'sometimes', 'no']),
    matchcentre_own_time: oneOf(body.matchcentre_own_time, ['yes', 'maybe', 'no']),

    format_fit: oneOf(body.format_fit, ['too_much', 'just_right', 'not_enough']),
    times_rating: rating(body.times_rating),
    times_better: clip(body.times_better, 500) || null,
    location_rating: rating(body.location_rating),
    value_rating: rating(body.value_rating),

    coaching_rating: rating(body.coaching_rating),
    specialist_jarryd: rating(body.specialist_jarryd),
    specialist_bowlstrong: rating(body.specialist_bowlstrong),
    specialist_callum: rating(body.specialist_callum),
    specialist_bajwa: rating(body.specialist_bajwa),
    specialist_zach: rating(body.specialist_zach),
    neuro_fitness_rating: rating(body.neuro_fitness_rating),
    guests_rating: rating(body.guests_rating),
    communication_rating: rating(body.communication_rating),
    pathway_clarity: rating(body.pathway_clarity),

    nps: rating(body.nps, 0, 10),
    continue_next: oneOf(body.continue_next, ['signed_up', 'intend', 'unsure', 'no']),
    stay_reasons: strArray(body.stay_reasons),
    stay_reason_other: clip(body.stay_reason_other, 500) || null,
    barriers: strArray(body.barriers),
    barrier_other: clip(body.barrier_other, 500) || null,
    change_mind: clip(body.change_mind, 1000) || null,

    love_most: clip(body.love_most, 1000) || null,
    would_change: clip(body.would_change, 1000) || null,
    anything_else: clip(body.anything_else, 1000) || null,

    consent_contact: body.consent_contact === true || body.consent_contact === 'true',
    ip_hash: hashIp(req),
    source: 'web',
    utm_source: clip(body.utm_source, 80) || null,
    utm_medium: clip(body.utm_medium, 80) || null,
    utm_campaign: clip(body.utm_campaign, 80) || null,
    page_referrer: clip(body.page_referrer, 300) || null,
  };

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('program_feedback')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      console.error('program_feedback insert error', error);
      return res.status(500).json({ error: 'Could not save your response. Please try again.' });
    }

    // Fire-and-forget Sheet mirror — don't make the family wait on it, don't fail if it errors.
    await mirrorToSheet(data);

    return res.status(201).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('program-feedback POST handler error', e);
    return res.status(500).json({ error: e.message || 'Unknown error' });
  }
}
