import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';

// "Not ready to apply?" — a deliberately subtle data capture on /careers (Andy,
// 20–21 Nov 2026: "still get their details without something full on … I don't want
// it to be huge, I want it to be subtle"). One line of text; tapping it opens three
// small boxes and a tick. Rows land in public.coaching_enquiries and are emailed to
// Andy within 10 minutes by api/notify-coach-applications.

const utm = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source'), utm_medium: p.get('utm_medium'), utm_campaign: p.get('utm_campaign') };
};

const field = (err) =>
    `w-full bg-white border ${err ? 'border-red-400' : 'border-slate-200'} rounded-lg px-3 py-2.5 text-rr-dark text-sm focus:outline-none focus:border-rr-pink`;

const CoachEnquirySection = () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ full_name: '', phone: '', email: '', company: '' });
    const [accept, setAccept] = useState(false);
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((x) => ({ ...x, [k]: undefined }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.full_name.trim()) errs.full_name = true;
        if (form.phone.replace(/\D/g, '').length < 8) errs.phone = true;
        if (!/\S+@\S+\.\S+/.test(form.email.trim())) errs.email = true;
        if (!accept) errs.accept = true;
        setErrors(errs);
        if (Object.keys(errs).length) return;

        if (isHoneypotTripped(form.company)) { setDone(true); return; }

        setSending(true);
        const { error } = await supabase.from('coaching_enquiries').insert([{
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            accept_contact: true,
            page_referrer: document.referrer || null,
            ...utm(),
        }]);
        setSending(false);
        if (error) {
            setErrors({ form: true });
            return;
        }
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'Coaching enquiry' });
        setDone(true);
    };

    return (
        <section className="bg-white py-8 md:py-10 border-t border-slate-100">
            <div className="max-w-xl mx-auto px-6 text-center">
                {done ? (
                    <p className="text-sm text-rr-charcoal font-medium">
                        Thanks. Our coaching team will be in touch within a few days.
                    </p>
                ) : !open ? (
                    <p className="text-sm text-rr-charcoal">
                        Not ready to apply?{' '}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="font-semibold text-rr-pink underline underline-offset-4 hover:text-rr-dark"
                        >
                            Leave your number and we&rsquo;ll call you
                        </button>
                    </p>
                ) : (
                    <form onSubmit={submit} noValidate className="relative text-left space-y-3">
                        <p className="text-sm text-rr-charcoal text-center mb-1">
                            Leave your details and we&rsquo;ll call you to talk about coaching. No application needed.
                        </p>
                        <input
                            type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                            className="absolute left-[-9999px] top-0 w-px h-px opacity-0"
                            value={form.company} onChange={set('company')}
                        />
                        <input aria-label="Your name" placeholder="Your name" autoComplete="name" value={form.full_name} onChange={set('full_name')} className={field(errors.full_name)} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input aria-label="Phone" placeholder="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={field(errors.phone)} />
                            <input aria-label="Email" placeholder="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={field(errors.email)} />
                        </div>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox" checked={accept}
                                onChange={(e) => { setAccept(e.target.checked); setErrors((x) => ({ ...x, accept: undefined })); }}
                                className="mt-0.5 w-4 h-4 accent-rr-pink"
                            />
                            <span className={`text-xs ${errors.accept ? 'text-red-500' : 'text-rr-charcoal/80'}`}>
                                Rajasthan Royals Academy Melbourne can contact me about coaching and keep my details in line with the{' '}
                                <a href="/privacy-policy" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.
                            </span>
                        </label>
                        {(errors.full_name || errors.phone || errors.email) && (
                            <p className="text-red-500 text-xs">Please add your name, a phone number and an email.</p>
                        )}
                        {errors.form && (
                            <p className="text-red-600 text-xs">Something went wrong. Please try again or email andy.crook@rramelbourne.com.</p>
                        )}
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={sending}
                                className="bg-rr-dark hover:bg-rr-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded-full transition-colors"
                            >
                                {sending ? 'Sending…' : 'Call Me'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default CoachEnquirySection;
