/* global process */
// ============================================================
// Royals Private Coaching — tell the coach the moment a family books (Andy, 18 Nov 2026:
// "send a message, an email or a text message or a WhatsApp message directly to a coach
// to say that someone has booked a session and to contact them").
//
// For each PAID booking in premium_private_coaching_requests (coach_notified_at IS NULL;
// families pay at booking, Andy 18 Nov 2026, so the coach is only told about paid bookings):
//   • EMAIL the coach (address from private_coaching_coaches), copying the Academy inbox,
//     with one-tap Call / Text / WhatsApp / Email buttons for the family.
//   • TEXT MESSAGE the coach too, once Twilio is set up (TWILIO_ACCOUNT_SID,
//     TWILIO_AUTH_TOKEN, TWILIO_FROM). Until then it is skipped, nothing breaks.
//   • "Match me" bookings, or a coach with no contact on file, go to the Academy inbox.
// Then stamps coach_notified_at. A failed email leaves it NULL so the next run retries.
//
// Two ways in:
//   POST { id }  — the booking form calls this straight after saving, so the coach hears
//                  within seconds. Only acts on that one row, only if it was paid in the
//                  last hour and not yet notified, so it can't be used to spam anyone.
//   GET (cron)   — every 10 minutes (vercel.json), catches anything the POST missed.
//                  Needs Authorization: Bearer CRON_SECRET.
//
// Env: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL (optional),
//      CRON_SECRET, PRIVATE_COACHING_ALERT_CC (optional, comma-separated; default below),
//      TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM (optional, for texts).
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { buildAlert } from './_lib/privateCoachingAlert.js';
import { sendEmail, sendSms, twilioReady, academyInbox } from './_lib/privateCoachingSend.js';

const TABLE = 'premium_private_coaching_requests';

async function notifyOne(sb, r, inbox) {
    let coach = null;
    if (r.coach_slug) {
        const { data } = await sb.from('private_coaching_coaches').select('*').eq('coach_slug', r.coach_slug).eq('active', true).maybeSingle();
        coach = data && (data.email || data.mobile) ? data : null;
    }
    let partner = null;
    if (r.format === '1-2') {
        const { data } = await sb.from('premium_private_coaching_partners').select('id').eq('booking_id', r.id).maybeSingle();
        partner = { done: !!data, link: `${process.env.VITE_APP_URL || 'https://rramelbourne.com'}/private-coaching/partner?b=${r.id}` };
    }
    const alert = buildAlert(r, coach, partner);
    const coachEmail = coach?.notify_email && coach.email ? [coach.email] : [];
    const to = coachEmail.length ? coachEmail : inbox;
    const cc = coachEmail.length ? inbox.filter((x) => !coachEmail.includes(x)) : [];
    await sendEmail({ to, cc, subject: alert.subject, html: alert.html });

    let sms = 'skipped';
    if (coach?.notify_sms && coach.mobile && twilioReady()) {
        try { await sendSms(coach.mobile, alert.sms); sms = 'sent'; } catch (e) { sms = `failed: ${e.message}`; }
    }
    await sb.from(TABLE).update({ coach_notified_at: new Date().toISOString() }).eq('id', r.id);
    return { id: r.id, emailed: to, sms };
}

export default async function handler(req, res) {
    if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'RESEND_API_KEY not set' });
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' });
    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', key);
    const inbox = academyInbox();

    // From the booking form: one fresh row only.
    if (req.method === 'POST') {
        const id = String((req.body && req.body.id) || '');
        if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'bad id' });
        const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data: r } = await sb.from(TABLE).select('*').eq('id', id).eq('payment_status', 'paid').is('coach_notified_at', null).gte('paid_at', since).maybeSingle();
        if (!r) return res.status(200).json({ ok: true, skipped: true });
        try { return res.status(200).json({ ok: true, ...(await notifyOne(sb, r, inbox)) }); } catch (e) { return res.status(502).json({ ok: false, error: e.message }); }
    }

    // Cron: everything still waiting.
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) return res.status(401).json({ error: 'unauthorised' });
    const { data, error } = await sb.from(TABLE).select('*').eq('payment_status', 'paid').is('coach_notified_at', null).order('created_at').limit(25);
    if (error) return res.status(500).json({ error: error.message });
    const out = { sent: [], failed: [] };
    for (const r of data || []) {
        try { out.sent.push(await notifyOne(sb, r, inbox)); } catch (e) { out.failed.push({ id: r.id, error: e.message }); }
    }
    return res.status(out.failed.length ? 207 : 200).json(out);
}
