import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';

// "Not ready to apply?" — the light data capture on /careers (Andy, 20 Nov 2026:
// "still get their details without something full on"). Four boxes and one tick.
// Rows land in public.coaching_enquiries and are emailed to Andy within 10 minutes
// by api/notify-coach-applications.

const ROLES = [
    { value: '', label: 'Not sure yet' },
    { value: 'performance-squad-coach', label: 'Performance Squad Coach' },
    { value: 'junior-royals-coach', label: 'Junior Royals Coach' },
    { value: 'cadet-coach', label: 'Cadet Coach (new to coaching)' },
];

const utm = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source'), utm_medium: p.get('utm_medium'), utm_campaign: p.get('utm_campaign') };
};

const input = (err) =>
    `w-full bg-white border ${err ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-sm`;

const CoachEnquirySection = () => {
    const [form, setForm] = useState({ full_name: '', phone: '', email: '', suburb: '', role_interest: '', company: '' });
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
        if (!form.full_name.trim()) errs.full_name = 'Please add your name.';
        if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 8) errs.phone = 'Please add a phone number.';
        if (!/\S+@\S+\.\S+/.test(form.email.trim())) errs.email = 'Please add a valid email.';
        if (!accept) errs.accept = 'Please tick this so we can contact you.';
        setErrors(errs);
        if (Object.keys(errs).length) return;

        if (isHoneypotTripped(form.company)) { setDone(true); return; }

        setSending(true);
        const { error } = await supabase.from('coaching_enquiries').insert([{
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            suburb: form.suburb.trim() || null,
            role_interest: form.role_interest || null,
            accept_contact: true,
            page_referrer: document.referrer || null,
            ...utm(),
        }]);
        setSending(false);
        if (error) {
            setErrors({ form: 'Something went wrong. Please try again or email andy.crook@rramelbourne.com.' });
            return;
        }
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'Coaching enquiry' });
        setDone(true);
    };

    return (
        <section className="relative py-16 md:py-20 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8"
                >
                    {done ? (
                        <div className="text-center py-4">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Thanks</p>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-3">We&rsquo;ll be in touch</h3>
                            <p className="text-rr-charcoal font-medium">
                                Our coaching team will call or email you within a few days to talk about coaching with us.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Not ready to apply?</p>
                            <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-tight leading-tight mb-2">
                                Get more information first
                            </h3>
                            <p className="text-rr-charcoal font-medium text-sm md:text-base mb-6">
                                Leave your details and we&rsquo;ll call you to talk about coaching with us. No application needed.
                            </p>
                            <form onSubmit={submit} noValidate className="relative space-y-4">
                                <input
                                    type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                                    className="absolute left-[-9999px] top-0 w-px h-px opacity-0"
                                    value={form.company} onChange={set('company')}
                                />
                                <div>
                                    <input aria-label="Your name" placeholder="Your name *" autoComplete="name" value={form.full_name} onChange={set('full_name')} className={input(errors.full_name)} />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input aria-label="Phone" placeholder="Phone *" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={input(errors.phone)} />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <input aria-label="Email" placeholder="Email *" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={input(errors.email)} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input aria-label="Suburb" placeholder="Suburb (optional)" autoComplete="address-level2" value={form.suburb} onChange={set('suburb')} className={input(false)} />
                                    <select aria-label="Role you're interested in" value={form.role_interest} onChange={set('role_interest')} className={input(false)}>
                                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.value ? r.label : 'Role: not sure yet'}</option>)}
                                    </select>
                                </div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={accept} onChange={(e) => { setAccept(e.target.checked); setErrors((x) => ({ ...x, accept: undefined })); }} className="mt-1 w-4 h-4 accent-rr-pink" />
                                    <span className="text-rr-charcoal text-sm">
                                        Yes, Rajasthan Royals Academy Melbourne can contact me about coaching, and store my details in line with the{' '}
                                        <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-pink underline">Privacy Policy</a>.
                                    </span>
                                </label>
                                {errors.accept && <p className="text-red-500 text-xs -mt-2">{errors.accept}</p>}
                                {errors.form && <p className="text-red-600 text-sm">{errors.form}</p>}
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full sm:w-auto bg-rr-dark hover:bg-rr-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-8 py-3.5 rounded-full transition-colors"
                                >
                                    {sending ? 'Sending…' : 'Send Me More Information'}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default CoachEnquirySection;
