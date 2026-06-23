// ============================================================
// Vercel Serverless Function — reconcile Power Game LEADS (incomplete) from Stripe.
// GET (Vercel Cron, hourly) or POST (admin manual run).
// ============================================================
// Stripe is the source of truth. We walk every Power Game Checkout Session and write
// the ones that DID NOT complete payment (started checkout, abandoned/expired) to the
// "Leads (incomplete)" tab of the Power Game workbook. Paid sessions are EXCLUDED here
// — paid players land in the "Paid players" tab in real time via the create-on-payment
// sync (api/sync-power-game-row). A person who has any PAID session is never a lead.
//
// The tab is REBUILT each run, so a lead who later pays simply drops off the list. No
// DB rows are written for leads (no bot/abandon pollution of power_game_applications).
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a dashboard
// admin can also POST with their Supabase JWT to run it on demand.
// Env: STRIPE_SECRET_KEY, SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, POWER_GAME_SHEET_ID, POWER_GAME_LEADS_TAB, CRON_SECRET.
// ============================================================
import Stripe from 'stripe';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { unpackApplication } from './_lib/pgpCheckout.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

let _stripe = null;
const getStripe = () => (_stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  _auth = new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: SCOPES });
  return _auth;
};

const LEADS_HEADERS = [
  'Lead Started (Melbourne)', 'Stripe Status', 'Player Name', 'Age', 'Player Email', 'Player Phone',
  'Parent Email', 'Parent Phone', 'Suburb', 'Centre', 'Session Day', 'Session Time',
  'Cricket Level', 'Current Club(s)', 'Would-be Fee (AUD)', 'Session Ref',
];

const fmtMelb = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const fullName = (a) => a.player_name || [a.first_name, a.last_name].filter(Boolean).join(' ') || '';

const leadRow = (s, a) => ([
  fmtMelb(new Date(s.created * 1000).toISOString()),
  s.status === 'expired' ? 'Abandoned (expired)' : 'Started, not paid',
  fullName(a),
  a.age ?? '',
  a.email || s.customer_details?.email || '',
  a.phone || s.customer_details?.phone || '',
  a.parent1_email || '',
  a.parent1_phone || '',
  a.suburb || '',
  a.venue || s.metadata?.venue || '',
  a.session_day || s.metadata?.session_day || '',
  a.session_time || s.metadata?.session_time || '',
  a.current_level || '',
  a.current_club || a.club || '',
  s.amount_total != null ? `$${(s.amount_total / 100).toFixed(2)}` : '',
  String(s.id).slice(-8).toUpperCase(),
]);

// Authorise: a Vercel Cron call (shared CRON_SECRET) or an active dashboard admin (JWT).
async function authorise(req) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (token && process.env.CRON_SECRET && token === process.env.CRON_SECRET) return 'cron';
  if (!token) throw new Error('unauthorized');
  const sb = getSupabase();
  const { data: { user } = {}, error } = await sb.auth.getUser(token);
  if (error || !user?.email) throw new Error('unauthorized');
  const { data: admin } = await sb.from('dashboard_users').select('email').eq('email', user.email).eq('active', true).maybeSingle();
  if (!admin) throw new Error('forbidden');
  return user.email;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await authorise(req);
  } catch (e) {
    return res.status(e.message === 'forbidden' ? 403 : 401).json({ error: e.message });
  }

  const spreadsheetId = process.env.POWER_GAME_SHEET_ID;
  const tabName = process.env.POWER_GAME_LEADS_TAB || 'Leads (incomplete)';
  if (!spreadsheetId) return res.status(503).json({ error: 'POWER_GAME_SHEET_ID not configured' });

  try {
    const stripe = getStripe();
    const days = Math.min(Number(req.body?.days) || 180, 365);
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

    // Walk every Stripe Checkout Session in the window; keep Power Game ones.
    const paidEmails = new Set();
    const incomplete = []; // { s, app, email, created }
    let startingAfter = null;
    for (let guard = 0; guard < 100; guard++) {
      const params = { limit: 100, created: { gte: since } };
      if (startingAfter) params.starting_after = startingAfter;
      const page = await stripe.checkout.sessions.list(params);
      for (const s of page.data) {
        if (s?.metadata?.source !== 'power-game') continue;
        const email = (s.customer_details?.email || s.metadata?.email || '').toLowerCase();
        if (s.payment_status === 'paid') { if (email) paidEmails.add(email); continue; }
        const app = unpackApplication(s.metadata) || {};
        incomplete.push({ s, app, email, created: s.created });
      }
      if (!page.has_more) break;
      startingAfter = page.data[page.data.length - 1]?.id;
    }

    // Drop anyone who also has a PAID session, and de-dupe to the most recent attempt per email.
    const byEmail = new Map();
    for (const lead of incomplete) {
      if (lead.email && paidEmails.has(lead.email)) continue;
      const key = lead.email || lead.s.id; // no-email sessions stay distinct
      const prev = byEmail.get(key);
      if (!prev || lead.created > prev.created) byEmail.set(key, lead);
    }
    const leads = [...byEmail.values()].sort((a, b) => b.created - a.created);
    const rows = leads.map(({ s, app }) => leadRow(s, app));

    // Rebuild the tab: header + current incomplete leads (self-healing — paid leads drop off).
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `${tabName}!A1`, valueInputOption: 'USER_ENTERED',
      requestBody: { values: [LEADS_HEADERS] },
    });
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${tabName}!A2:Z100000` });
    if (rows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId, range: `${tabName}!A2`, valueInputOption: 'USER_ENTERED',
        requestBody: { values: rows },
      });
    }

    return res.status(200).json({ ok: true, leads: rows.length, paidExcluded: paidEmails.size });
  } catch (err) {
    console.error('sync-pgp-leads error:', err);
    return res.status(500).json({ error: err.message });
  }
}
