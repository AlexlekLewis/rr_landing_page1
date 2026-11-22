// ============================================================
// Vercel Cron — email every new coaching lead to Andy (Andy, 14 Nov 2026:
// "send any coaching applications to andy.crook@whitewallsport.com").
// Runs every 10 minutes. Picks up rows with notified_at IS NULL from:
//   coaching_opportunities_applications  (/careers form)
//   coaching_enquiries                   (/careers "not ready to apply" form)
//   coaches_day_registrations            (/coaches-day form)
// sends one plain table email per lead via Resend, then stamps notified_at.
// A failed send leaves notified_at NULL, so the next run retries it.
// Env: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL (optional),
//      CRON_SECRET, COACH_ALERT_TO (optional, comma-separated; default below).
// ============================================================
import { createClient } from '@supabase/supabase-js';

const DEFAULT_TO = 'andy.crook@whitewallsport.com';
const FROM_DEFAULT = 'Royals Melbourne Academy <onboarding@resend.dev>';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const list = (v) => (Array.isArray(v) ? v.join(', ') : v);
const melb = (iso) => new Date(iso).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', dateStyle: 'medium', timeStyle: 'short' });

const ROLE_LABELS = {
    'cricket-coach': 'Performance Squad Coach',
    'junior-assistant-coach': 'Junior Royals Coach',
    'cadet-coach': 'Cadet Coach',
    'operations-admin': 'Operations & Admin',
    'media-content': 'Media & Content',
    other: 'Other',
};
const roles = (arr) => (Array.isArray(arr) ? arr.map((r) => ROLE_LABELS[r] || r).join(', ') : '');

const SOURCES = [
    {
        table: 'coaching_opportunities_applications',
        label: 'Coaching application (/careers)',
        name: (r) => r.full_name,
        rows: (r) => [
            ['Name', r.full_name], ['Phone', r.phone], ['Email', r.email], ['Suburb', r.suburb], ['Age', r.age],
            ['Role(s)', roles(r.role_interest)], ['Stream', r.preferred_tier], ['Engagement', list(r.engagement_types)],
            ['WWCC', r.wwc_status], ['Highest playing level', r.highest_playing_level], ['Club', r.current_club],
            ['Accreditation', r.coaching_accreditation], ['Years coaching', r.years_coaching],
            ['Age groups coached', list(r.age_groups_coached)], ['Coaching CV', r.coaching_cv],
            ['Goals', r.goals_ambitions], ['CV link', r.cv_resume_url], ['Heard via', r.referral_source],
            ['UTM', [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(' / ')],
        ],
    },
    {
        table: 'coaching_enquiries',
        label: 'Coaching enquiry: wants more information (/careers)',
        name: (r) => r.full_name,
        rows: (r) => [
            ['Name', r.full_name], ['Phone', r.phone], ['Email', r.email], ['Suburb', r.suburb],
            ['Role interest', r.role_interest || 'Not sure yet'],
            ['UTM', [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(' / ')],
            ['Came from', r.page_referrer],
        ],
    },
    {
        table: 'coaches_day_registrations',
        label: 'Coaches Day registration (/coaches-day)',
        name: (r) => r.coach_name,
        rows: (r) => [
            ['Name', r.coach_name], ['Phone', r.phone], ['Email', r.email], ['Highest level', r.highest_level],
            ['Current coaching role(s)', list(r.coaching_roles)], ['Playing history', r.playing_history],
            ['Loves about coaching', r.love_coaching], ['Hopes to learn', r.hope_to_learn],
            ['UTM', [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(' / ')],
        ],
    },
];

const html = (src, r) => {
    const body = src.rows(r)
        .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;vertical-align:top;white-space:nowrap">${esc(k)}</td>`
            + `<td style="padding:6px 0;color:#111;font-size:14px">${esc(v)}</td></tr>`).join('');
    return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px">
<p style="margin:0 0 4px;font-size:12px;color:#E11F8F;font-weight:700;text-transform:uppercase;letter-spacing:.1em">${esc(src.label)}</p>
<p style="margin:0 0 14px;font-size:13px;color:#666">Received ${esc(melb(r.created_at))}</p>
<table style="border-collapse:collapse">${body}</table>
<p style="margin:16px 0 0;font-size:12px;color:#999">Sent automatically by rramelbourne.com.</p></div>`;
};

async function send({ to, subject, htmlBody }) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || FROM_DEFAULT, to, subject, html: htmlBody }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export default async function handler(req, res) {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) return res.status(401).json({ error: 'unauthorised' });
    if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'RESEND_API_KEY not set' });
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' });

    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', key);
    const to = (process.env.COACH_ALERT_TO || DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean);
    const out = { sent: 0, failed: 0, errors: [] };

    for (const src of SOURCES) {
        const { data, error } = await sb.from(src.table).select('*').is('notified_at', null).order('created_at').limit(25);
        if (error) { out.errors.push(`${src.table}: ${error.message}`); continue; }
        for (const r of data || []) {
            try {
                await send({ to, subject: `New coach lead: ${src.name(r) || 'unnamed'} (${src.label})`, htmlBody: html(src, r) });
                await sb.from(src.table).update({ notified_at: new Date().toISOString() }).eq('id', r.id);
                out.sent += 1;
            } catch (e) {
                out.failed += 1;
                out.errors.push(`${src.table} ${r.id}: ${e.message}`);
            }
        }
    }
    return res.status(out.failed ? 207 : 200).json(out);
}
