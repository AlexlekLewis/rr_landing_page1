/* global process, Buffer */
// Royals Private Coaching: email (Resend) and text message (Twilio) senders, shared by
// the booking alert, the enquiry alert and the paid alert.
import { auMobileDigits } from './privateCoachingAlert.js';

const FROM_DEFAULT = 'Royals Melbourne Academy <onboarding@resend.dev>';

export const academyInbox = () => (process.env.PRIVATE_COACHING_ALERT_CC || 'andy.crook@whitewallsport.com')
    .split(',').map((s) => s.trim()).filter(Boolean);

export async function sendEmail({ to, cc = [], subject, html, replyTo }) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || FROM_DEFAULT, to, cc: cc.length ? cc : undefined, subject, html, reply_to: replyTo || undefined }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export const twilioReady = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM);

export async function sendSms(toMobile, body) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: `+${auMobileDigits(toMobile)}`, From: process.env.TWILIO_FROM, Body: body }),
    });
    if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
}
