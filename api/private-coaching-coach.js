/* global process */
// ============================================================
// Royals Private Coaching: the coach's own page (Andy, 22 Nov 2026, coach-led flow).
// The coach opens /private-coaching-<coach>/coach?t=<their secret token> (sent in every
// enquiry email). Token = private_coaching_payees.checkin_token.
//
// GET  ?t=…                     → the coach's enquiries, bookings and sessions.
// POST { t, action: 'create_booking', … } → records the sessions agreed with a family and
//                                 returns the pay link to send them.
// POST { t, action: 'mark', session_id, status: 'attended' | 'no_show', date? }
//                               → after a session. "attended" releases the payouts
//                                 (coach + venue) via Stripe Connect; "no_show" releases
//                                 nothing and is left for the Academy to decide.
// POST { t, action: 'enquiry_status', id, status } → contacted / closed.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { COACHES, PACKAGES, FORMAT_LABELS, coachPrice, CENTRES } from '../src/components/premium-coaching/premiumCoachingData.js';
import { releasePayouts } from './_lib/privateCoachingPayouts.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const baseFor = (req) => {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host && /\.vercel\.app$/.test(host) ? `https://${host}` : BASE_URL;
};
const TABLE = 'premium_private_coaching_requests';
const PAY_DAYS = 14;
const clean = (v, n = 120) => String(v ?? '').trim().slice(0, n);
export const payUrl = (base, id) => `${base}/private-coaching/pay?b=${id}`;

// Coach's form → booking row, or { error }.
export const coachBookingRow = (coach, b) => {
    if (!coach.centres.includes(b.centre)) return { error: 'Choose one of your centres.' };
    if (!FORMAT_LABELS[b.format]) return { error: 'Choose 1-to-1 or training partner session.' };
    const sessions = Number(b.sessions);
    if (!PACKAGES.some((p) => p.sessions === sessions)) return { error: 'Choose 1, 3 or 5 sessions.' };
    const per = coachPrice(coach, b.format, sessions);
    if (per == null) return { error: 'You have no price set for this yet. Please ask the Academy.' };
    if (clean(b.player_first_name).length < 1) return { error: 'Enter the player’s first name.' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.email, 200))) return { error: 'Enter the family’s email.' };
    if (String(b.phone || '').replace(/\D/g, '').length < 8) return { error: 'Enter the family’s mobile.' };
    const split = b.format === '1-2' && !!b.split;
    if (b.format === '1-2' && !split && !clean(b.partner)) return { error: 'Enter the training partner’s name.' };
    if (split) {
        if (!clean(b.partner_first_name)) return { error: 'Enter the training partner’s first name.' };
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.partner_email, 200))) return { error: 'Enter the training partner family’s email.' };
        if (String(b.partner_phone || '').replace(/\D/g, '').length < 8) return { error: 'Enter the training partner family’s mobile.' };
    }
    const times = (Array.isArray(b.times) ? b.times : []).filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t?.date || '') && /^\d{2}:\d{2}/.test(t?.start || ''))
        .slice(0, sessions).map((t) => ({ date: t.date, start: t.start.slice(0, 5), centre: b.centre }));
    const note = clean(b.times_note, 400);
    if (!times.length && !note) return { error: 'Add the agreed dates and times (or a note of them).' };
    const allTimes = times.length === sessions;
    return {
        row: {
            centre: b.centre, format: b.format, coach_slug: coach.slug, coach_tier: coach.tier,
            other_players: b.format === '1-2' ? (split ? `${clean(b.partner_first_name)} ${clean(b.partner_last_name)}`.trim() : clean(b.partner)) : null,
            pay_share: split ? 2 : 1,
            package_sessions: sessions, price_per_session: split ? per / 2 : per, package_total: (split ? per / 2 : per) * sessions,
            selected_slots: allTimes ? times : [],
            availability: allTimes ? (note || null) : [times.map((t) => `${t.date} ${t.start}`).join(', '), note].filter(Boolean).join('. '),
            payment_status: 'request', status: 'new', focus: 'not-sure',
            player_first_name: clean(b.player_first_name), player_last_name: clean(b.player_last_name) || '',
            parent_name: clean(b.parent_name) || null, email: clean(b.email, 200).toLowerCase(), phone: clean(b.phone, 40),
            notes: clean(b.notes, 1000) || null, source: 'premium-private-coaching|coach',
            created_by: 'coach', enquiry_id: /^[0-9a-f-]{36}$/i.test(b.enquiry_id || '') ? b.enquiry_id : null,
            pay_expires_at: new Date(Date.now() + PAY_DAYS * 864e5).toISOString(),
        },
        // Each family pays half: the partner family's own row (linked to the first after insert).
        partnerRow: split ? {
            player_first_name: clean(b.partner_first_name), player_last_name: clean(b.partner_last_name) || '',
            parent_name: clean(b.partner_parent_name) || null, email: clean(b.partner_email, 200).toLowerCase(), phone: clean(b.partner_phone, 40),
            other_players: `${clean(b.player_first_name)} ${clean(b.player_last_name)}`.trim(), enquiry_id: null, notes: null,
        } : null,
    };
};

export default async function handler(req, res) {
    const t = String((req.method === 'GET' ? req.query?.t : req.body?.t) || '');
    if (!/^[0-9a-f]{20,}$/i.test(t)) return res.status(401).json({ error: 'This link isn’t right. Please use the link in your email.' });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Not set up yet.' });
    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: payee } = await sb.from('private_coaching_payees').select('*').eq('checkin_token', t).eq('kind', 'coach').eq('active', true).maybeSingle();
    const coach = payee && COACHES.find((c) => c.slug === payee.slug);
    if (!coach) return res.status(401).json({ error: 'This link isn’t right. Please use the link in your email.' });
    const base = baseFor(req);

    if (req.method === 'GET') {
        const since = new Date(Date.now() - 120 * 864e5).toISOString();
        const [{ data: enquiries }, { data: bookings }] = await Promise.all([
            sb.from('private_coaching_enquiries').select('id, created_at, parent_name, player_name, email, phone, suburb, status, format_pref').eq('coach_slug', coach.slug).gte('created_at', since).order('created_at', { ascending: false }),
            sb.from(TABLE).select('id, created_at, created_by, pay_share, linked_booking_id, centre, format, package_sessions, price_per_session, package_total, selected_slots, availability, payment_status, paid_at, player_first_name, player_last_name, parent_name, email, phone, other_players, pay_expires_at, accept_terms').eq('coach_slug', coach.slug).gte('created_at', since).in('payment_status', ['request', 'sent_to_stripe', 'paid']).order('created_at', { ascending: false }),
        ]);
        const list = (bookings || []).filter((b) => b.created_by === 'coach' || b.payment_status === 'paid');
        const ids = list.map((b) => b.id);
        const { data: sessions } = ids.length ? await sb.from('private_coaching_sessions').select('id, booking_id, seq, session_date, start_time, status, marked_at').in('booking_id', ids).order('seq') : { data: [] };
        return res.status(200).json({
            partnerFormUrl: `${base}/private-coaching/partner?b=`,
            coach: { slug: coach.slug, name: coach.name, centres: coach.centres, stripeConnected: !!payee.stripe_account_id },
            enquiries: enquiries || [],
            bookings: list.map((b) => ({ ...b, pay_url: payUrl(base, b.id), sessions: (sessions || []).filter((s) => s.booking_id === b.id) })),
            centres: CENTRES.filter((c) => coach.centres.includes(c.slug)).map((c) => ({ slug: c.slug, suburb: c.suburb })),
        });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const b = req.body || {};

    if (b.action === 'create_booking') {
        const out = coachBookingRow(coach, b);
        if (out.error) return res.status(400).json({ error: out.error });
        const { data, error } = await sb.from(TABLE).insert([out.row]).select('id').single();
        if (error) return res.status(500).json({ error: `Could not save: ${error.message}` });
        let partner = null;
        if (out.partnerRow) {
            const { data: p2, error: e2 } = await sb.from(TABLE).insert([{ ...out.row, ...out.partnerRow, linked_booking_id: data.id }]).select('id').single();
            if (e2) return res.status(500).json({ error: `Could not save the training partner: ${e2.message}` });
            partner = { id: p2.id, pay_url: payUrl(base, p2.id) };
        }
        if (out.row.enquiry_id) await sb.from('private_coaching_enquiries').update({ status: 'booked' }).eq('id', out.row.enquiry_id).eq('coach_slug', coach.slug);
        return res.status(200).json({ ok: true, id: data.id, pay_url: payUrl(base, data.id), total: out.row.package_total, partner });
    }

    if (b.action === 'enquiry_status') {
        if (!['new', 'contacted', 'closed'].includes(b.status)) return res.status(400).json({ error: 'bad status' });
        await sb.from('private_coaching_enquiries').update({ status: b.status }).eq('id', b.id).eq('coach_slug', coach.slug);
        return res.status(200).json({ ok: true });
    }

    if (b.action === 'mark') {
        if (!['attended', 'no_show'].includes(b.status)) return res.status(400).json({ error: 'bad status' });
        const { data: s } = await sb.from('private_coaching_sessions').select('id, booking_id, status, session_date, coach_slug').eq('id', b.session_id).maybeSingle();
        if (!s || s.coach_slug !== coach.slug) return res.status(404).json({ error: 'Session not found.' });
        if (s.status !== 'scheduled') return res.status(409).json({ error: 'This session is already marked.' });
        const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date || '') ? b.date : (s.session_date || new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' }));
        await sb.from('private_coaching_sessions').update({ status: b.status, marked_at: new Date().toISOString(), session_date: date }).eq('id', s.id).eq('status', 'scheduled');
        let payouts = null;
        if (b.status === 'attended') {
            const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
            try { payouts = await releasePayouts(sb, stripe, s.id); } catch (e) { payouts = { error: e.message }; }
        }
        return res.status(200).json({ ok: true, payouts });
    }
    return res.status(400).json({ error: 'Unknown action.' });
}
