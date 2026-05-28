// ============================================================
// Vercel Serverless Function — Refresh Unified People Sheet
// POST /api/refresh-unified-people
// ============================================================
// Reads from the unified_people_2026 Postgres VIEW (deduplicated +
// admin/test-filtered) and bulk-overwrites the "All People" tab of the
// "RRA Applications & Inquiries Database 2026" Google Sheet plus the
// "By Program" rollup tab and the "About" metadata tab.
//
// Auth: requires x-webhook-secret header matching SUPABASE_WEBHOOK_SECRET
// (re-using the same env var that protects /api/sync-holiday-row).
//
// Trigger: manually via curl, or cron via Supabase pg_cron, or admin button.
//
// Required env vars:
//   GOOGLE_SERVICE_ACCOUNT_JSON
//   SUPABASE_SERVICE_ROLE_KEY
//   SUPABASE_WEBHOOK_SECRET
// ============================================================

import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const SPREADSHEET_ID = '1zCi9GF-jO77ZI-hP6smxVgbOk_ogOg0iV_lH4CCcsGc';
const TZ = 'Australia/Melbourne';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const getSheetsClient = () => {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON missing');
  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  return google.sheets({ version: 'v4', auth });
};

const getSupabase = () => {
  const url = process.env.SUPABASE_URL
    || process.env.VITE_SUPABASE_URL
    || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
  return createClient(url, key);
};

const fmtMelb = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-AU', {
      timeZone: TZ, year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const fmtDOB = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit',
    });
  } catch { return iso; }
};

const fmtAUD = (cents) => {
  if (!cents || cents === 0) return '';
  return '$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ALL_PEOPLE_HEADERS = [
  'Email', 'Contact Name', 'Phone', 'Suburb', 'Player Name',
  'Player Gender', 'Primary Club', 'DOB', 'Player Age',
  '# Programs', 'Programs (detailed)', 'Total Paid (AUD)',
  'First Touched (Melbourne)', 'Last Touched (Melbourne)',
  'First Touch Source', 'Email Domain',
];

const BY_PROGRAM_HEADERS = [
  'Program', 'Total People', 'Paid', 'Pending / Unpaid', 'Waitlist / Lead', 'Total Revenue (AUD)',
];

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (expected) {
    const got = req.headers['x-webhook-secret'];
    if (got !== expected) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  let sheets, supabase;
  try {
    sheets = getSheetsClient();
    supabase = getSupabase();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  // 1. Read from the unified_people_2026 view
  const { data: people, error: peopleErr } = await supabase
    .from('unified_people_2026')
    .select('*')
    .order('last_touched', { ascending: false });
  if (peopleErr) return res.status(500).json({ error: peopleErr.message });

  // 2. Build All People rows
  const peopleRows = (people || []).map(p => [
    p.email || '',
    p.contact_name || '',
    p.phone || '',
    p.suburb || '',
    p.player_name || '',
    p.player_gender || '',
    p.primary_club || '',
    fmtDOB(p.dob),
    p.player_age ?? '',
    p.programs_count ?? 0,
    p.programs_detail || '',
    fmtAUD(p.total_paid_cents),
    fmtMelb(p.first_touched),
    fmtMelb(p.last_touched),
    p.first_touch_source || '',
    p.email_domain || '',
  ]);

  // 3. Build By Program rollup. Parse "Program Label (Status)" tokens
  //    from each person's programs_detail.
  const programTotals = new Map();
  const programPaidRevenue = new Map();
  for (const p of people || []) {
    const tokens = (p.programs_detail || '').split('\n').filter(Boolean);
    for (const tok of tokens) {
      const match = tok.match(/^(.*?)\s*\((.+?)\)\s*$/);
      if (!match) continue;
      const program = match[1].trim();
      const status = match[2].trim().toLowerCase();
      if (!programTotals.has(program)) {
        programTotals.set(program, { total: 0, paid: 0, pending: 0, waitlist: 0 });
      }
      const t = programTotals.get(program);
      t.total += 1;
      if (status.includes('paid') || status.includes('active') || status.includes('purchased') || status.includes('accepted')) t.paid += 1;
      else if (status.includes('waitlist') || status.includes('lead') || status.includes('interested') || status.includes('enquired') || status.includes('rsvp')) t.waitlist += 1;
      else t.pending += 1;
    }
  }
  // For revenue, we need per-program revenue — easiest: separate query
  const { data: revenueRows } = await supabase.rpc('unified_revenue_by_program').catch(() => ({ data: null }));
  // (Optional RPC — if it doesn't exist, skip per-program revenue)
  const revMap = new Map();
  if (Array.isArray(revenueRows)) {
    for (const r of revenueRows) revMap.set(r.program_label, r.revenue_cents);
  }
  const byProgramRows = Array.from(programTotals.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(([program, t]) => [
      program,
      t.total,
      t.paid,
      t.pending,
      t.waitlist,
      fmtAUD(revMap.get(program) || 0),
    ]);

  // 4. Build About tab
  const totalRevenueCents = (people || []).reduce((s, p) => s + (Number(p.total_paid_cents) || 0), 0);
  const aboutRows = [
    ['Refreshed at (Melbourne)', new Date().toLocaleString('en-AU', { timeZone: TZ })],
    ['Total unique people', String(people?.length || 0)],
    ['Total revenue across all programs (AUD)', fmtAUD(totalRevenueCents)],
    ['Data source', 'public.unified_people_2026 (Postgres VIEW)'],
    ['Source tables unioned',
      'applications, elite_program_applications_2026, official_cohort_2026, elite_2026_waitlist, ' +
      'elite_program_2026, holiday_clinic_registrations, junior_royals_july_holidays_registrations, ' +
      'junior_royals_bundoora, junior_royals_hallam, female_kickstart_2026, program_registrations, ' +
      'crm_leads, general_enquiries, inquiries, upcoming_program_interest, rsvp_responses, ' +
      'shop_orders_training, india_tour_2026_travellers'],
    ['Excluded emails', '@rraclaude.test, @example.*, alex.lewis@, andy.crook@, info@, deploy@, claude@, noreply@, eliteprogram@'],
    ['Trigger endpoint', 'POST /api/refresh-unified-people (with x-webhook-secret header)'],
    ['Sheet ID', SPREADSHEET_ID],
  ];

  // 5. Clear existing data rows (preserve headers) then write new
  try {
    await sheets.spreadsheets.values.batchClear({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { ranges: ['All People!A2:Z', 'By Program!A2:Z', 'About!A2:Z'] },
    });

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: 'All People!A2', majorDimension: 'ROWS', values: peopleRows },
          { range: 'By Program!A2', majorDimension: 'ROWS', values: byProgramRows },
          { range: 'About!A2', majorDimension: 'ROWS', values: aboutRows },
        ],
      },
    });

    return res.status(200).json({
      ok: true,
      people_count: peopleRows.length,
      programs_count: byProgramRows.length,
      total_revenue_aud: fmtAUD(totalRevenueCents),
      sheet_url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    });
  } catch (err) {
    console.error('refresh-unified-people sheet write failed:', err);
    return res.status(500).json({ error: err.message });
  }
}
