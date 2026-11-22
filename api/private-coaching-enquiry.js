/* global process */
// ============================================================
// Royals Private Coaching: "Book Now" on a coach's page (Andy, 22 Nov 2026, coach-led flow).
//
// POST { coach, parent_name, player_name?, email, phone, suburb, website (honeypot), utm_* }
//   → saves the enquiry (private_coaching_enquiries, service role only),
//   → emails the coach straight away (and texts them, once Twilio is set up), copying the
//     Academy inbox, with one-tap Call / Text / WhatsApp buttons and their coach page link,
//   → returns the coach's contact details so the page can show them to the family.
// The coach's contact details never sit in the page code: they come from
// private_coaching_coaches, and only after an enquiry is saved.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { COACHES } from '../src/components/premium-coaching/premiumCoachingData.js';
import { auMobileDigits } from './_lib/privateCoachingAlert.js';
import { sendEmail, sendSms, twilioReady, academyInbox } from './_lib/privateCoachingSend.js';

const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const baseFor = (req) => {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host && /\.vercel\.app$/.test(host) ? `https://${host}` : BASE_URL;
};
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clean = (v, n = 120) => String(v ?? '').trim().slice(0, n);
const first = (n) => String(n || '').trim().split(' ')[0];

export const validateEnquiry = (b) => {
    const e = {};
    if (!COACHES.some((c) => c.slug === b.coach)) e.coach = 'Unknown coach.';
    if (clean(b.parent_name).length < 2) e.parent_name = 'Please enter your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.email, 200))) e.email = 'Please enter a valid email address.';
    if (String(b.phone || '').replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number.';
    if (clean(b.suburb).length < 2) e.suburb = 'Please enter your suburb.';
    return e;
};

export const enquiryAlert = (q, coach, coachName, hubUrl) => {
    const player = q.player_name || q.parent_name;
    const tel = String(q.phone).replace(/[^\d+]/g, '');
    const wa = auMobileDigits(q.phone);
    const btn = (href, label, bg) => `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:${bg};color:#fff;font-weight:700;font-size:14px;text-decoration:none">${label}</a>`;
    const rows = [['Parent / contact', q.parent_name], ['Player', q.player_name || 'Same person'], ['Mobile', q.phone], ['Email', q.email], ['Suburb', q.suburb]];
    const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;color:#111">
<p style="margin:0 0 4px;font-size:12px;color:#E11F8F;font-weight:700;text-transform:uppercase;letter-spacing:.1em">Royals Private Coaching: new enquiry</p>
<p style="margin:0 0 6px;font-size:16px">Hi ${esc(first(coachName))},</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.5">${esc(q.parent_name)} wants private coaching with you${q.player_name ? ` for ${esc(q.player_name)}` : ''}. They have your number too, so they may call first. Please get in touch today, agree the times, and book the lane with the centre.</p>
<div style="margin:0 0 16px">${btn(`tel:${tel}`, `Call ${esc(first(q.parent_name))}`, '#111921')}${btn(`sms:${tel}`, 'Text', '#1226AA')}${wa ? btn(`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${first(q.parent_name)}, it's ${coachName} from the Rajasthan Royals Academy about private coaching for ${first(player)}.`)}`, 'WhatsApp', '#1A9E52') : ''}${btn(`mailto:${q.email}`, 'Email', '#E11F8F')}</div>
<table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px">${esc(k)}</td><td style="padding:6px 0;font-size:14px">${esc(v)}</td></tr>`).join('')}</table>
${hubUrl ? `<p style="margin:18px 0 6px;font-size:15px;line-height:1.5"><b>Once you've agreed the times:</b> open your coach page, record the session${'s'} and send the family their pay link. You'll get an email when they've paid.</p>${btn(hubUrl, 'Open my coach page', '#E11F8F')}` : ''}
<p style="margin:16px 0 0;font-size:12px;color:#666">Sent automatically by rramelbourne.com.</p></div>`;
    const sms = `Royals Private Coaching: new enquiry from ${q.parent_name}${q.player_name ? ` for ${q.player_name}` : ''} (${q.suburb}). Call them: ${q.phone}. Details and your coach page link in your email.`;
    return { subject: `New private coaching enquiry: ${q.parent_name}, ${q.suburb}`, html, sms };
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const b = req.body || {};
    if (b.website) return res.status(200).json({ ok: true, contact: null }); // honeypot
    const errors = validateEnquiry(b);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Please check your details.', errors });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(503).json({ error: 'Not set up yet.' });
    const sb = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

    const coachInfo = COACHES.find((c) => c.slug === b.coach);
    const q = {
        coach_slug: b.coach, parent_name: clean(b.parent_name), player_name: clean(b.player_name) || null,
        email: clean(b.email, 200).toLowerCase(), phone: clean(b.phone, 40), suburb: clean(b.suburb),
        utm_source: clean(b.utm_source) || null, utm_medium: clean(b.utm_medium) || null,
        utm_campaign: clean(b.utm_campaign) || null, utm_content: clean(b.utm_content) || null,
        page_referrer: clean(b.page_referrer, 300) || null,
    };
    const { data: saved, error } = await sb.from('private_coaching_enquiries').insert([q]).select('id').single();
    if (error) return res.status(500).json({ error: 'Could not save your details. Please try again.' });

    const { data: coach } = await sb.from('private_coaching_coaches').select('*').eq('coach_slug', b.coach).eq('active', true).maybeSingle();
    const { data: payee } = await sb.from('private_coaching_payees').select('checkin_token').eq('slug', b.coach).maybeSingle();
    const hubUrl = payee?.checkin_token ? `${baseFor(req)}/private-coaching-${b.coach}/coach?t=${payee.checkin_token}` : null;

    // Tell the coach now. A failure here never stops the family seeing the contact details.
    const alert = enquiryAlert(q, coach, coach?.name || coachInfo.name, hubUrl);
    const inbox = academyInbox();
    const coachEmail = coach?.notify_email !== false && coach?.email ? [coach.email] : [];
    let notified = false;
    try {
        await sendEmail({ to: coachEmail.length ? coachEmail : inbox, cc: coachEmail.length ? inbox.filter((x) => !coachEmail.includes(x)) : [], subject: alert.subject, html: alert.html, replyTo: q.email });
        notified = true;
    } catch (e) { console.error('enquiry email failed', e.message); }
    if (coach?.notify_sms !== false && coach?.mobile && twilioReady()) {
        try { await sendSms(coach.mobile, alert.sms); notified = true; } catch (e) { console.error('enquiry sms failed', e.message); }
    }
    if (notified) await sb.from('private_coaching_enquiries').update({ coach_notified_at: new Date().toISOString() }).eq('id', saved.id);

    return res.status(200).json({
        ok: true,
        contact: coach && (coach.mobile || coach.email) ? { name: coach.name || coachInfo.name, mobile: coach.mobile || null, email: coach.email || null } : null,
    });
}
