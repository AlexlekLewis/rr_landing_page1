import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { SPECIALISMS, YEARS_PLAYED, SESSION_COUNTS, DAYS, TIME_SLOTS, CENTRE } from './pcOptions';

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const inputCls =
    'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors';
const selectCls = `${inputCls} appearance-none [&>option]:text-rr-dark`;
const labelCls = 'block text-xs font-bold text-white/70 uppercase tracking-widest mb-2';

const Field = ({ label, required = true, children }) => (
    <div>
        <label className={labelCls}>
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        {children}
    </div>
);

const EMPTY = {
    player_name: '',
    age: '',
    years_played: '',
    sessions_requested: '',
    specialism: '',
    preferred_day: '',
    preferred_time: '',
    parent_name: '',
    email: '',
    phone: '',
    suburb: '',
};

const PCForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const ageNum = parseInt(form.age, 10);
    const isMinor = !Number.isNaN(ageNum) && ageNum < 18;

    const validate = () => {
        if (!form.player_name.trim()) return 'Please enter the player\'s name.';
        if (Number.isNaN(ageNum) || ageNum < 4 || ageNum > 99) return 'Please enter a valid age.';
        if (!form.years_played) return 'Please select how many years they\'ve played.';
        if (!form.sessions_requested) return 'Please select a session block — the 3-session starter or 6+.';
        if (!form.specialism) return 'Please select the specialist coaching you\'re looking for.';
        if (!form.preferred_day) return 'Please choose a preferred day — Tuesday or Friday.';
        if (!form.preferred_time) return 'Please choose a preferred time.';
        if (isMinor && !form.parent_name.trim()) return 'Please enter a parent/guardian name for players under 18.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
        if (form.phone.replace(/\D/g, '').length < 8) return 'Please enter a valid phone number.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }
        setError('');
        setSubmitting(true);

        const utmParams = getUTMParams();
        const row = {
            centre: CENTRE.slug,
            player_name: form.player_name.trim(),
            age: ageNum,
            years_played: form.years_played,
            sessions_requested: form.sessions_requested,
            specialism: form.specialism,
            preferred_day: form.preferred_day,
            preferred_time: form.preferred_time,
            parent_name: form.parent_name.trim() || null,
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            suburb: form.suburb.trim() || null,
            page_referrer: document.referrer || null,
            ...utmParams,
        };

        const { error: insertError } = await supabase.from('private_coaching_eoi').insert([row]);

        if (insertError) {
            setSubmitting(false);
            setError('Something went wrong submitting your registration. Please try again, or text us via the chat button.');
            return;
        }

        // Secondary CRM insert — never blocks the flow.
        try {
            await supabase.from('applications').insert([{
                first_name: form.player_name.trim().split(' ')[0],
                last_name: form.player_name.trim().split(' ').slice(1).join(' '),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                source: 'private-coaching',
                program_type: 'Private Coaching — Mickleham',
                ...utmParams,
                page_referrer: document.referrer || null,
            }]);
        } catch (_) { /* non-blocking */ }

        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="bg-rr-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
                <div className="relative max-w-2xl mx-auto px-6 text-center">
                    <span className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
                        You're In The Queue
                    </h2>
                    <p className="text-white/80 font-medium leading-relaxed mb-4">
                        Thanks {form.player_name.split(' ')[0]} — your registration is with the{' '}
                        <b className="text-white">Mickleham Head Coach</b>, who personally reviews
                        every expression of interest.
                    </p>
                    <p className="text-white/60 font-medium leading-relaxed">
                        Expect a call to talk through your game. From there you'll be assigned the
                        coach best suited to your development journey — starting with your first
                        consultation session, with your{' '}
                        {form.sessions_requested === '3' ? 'three' : form.sessions_requested === '6' ? 'six' : form.sessions_requested}-session
                        block locked in on your preferred{' '}
                        {form.preferred_day === 'tuesday' ? 'Tuesday' : 'Friday'} time.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-rr-dark py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Expressions of Interest</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        Register Your Interest
                    </h2>
                    <p className="text-white/70 font-medium max-w-xl mx-auto">
                        Tell us about the player and the coaching you're after. The Head Coach will
                        be in contact to assign the right coach for the journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Player's Full Name">
                            <input className={inputCls} value={form.player_name} onChange={set('player_name')} placeholder="e.g. Arjun Sharma" autoComplete="name" />
                        </Field>
                        <Field label="Player's Age">
                            <input className={inputCls} value={form.age} onChange={set('age')} placeholder="e.g. 14" inputMode="numeric" />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Years Played">
                            <select className={selectCls} value={form.years_played} onChange={set('years_played')}>
                                <option value="" disabled>Select…</option>
                                {YEARS_PLAYED.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Session Block — 3-Session Starter or 6+">
                            <select className={selectCls} value={form.sessions_requested} onChange={set('sessions_requested')}>
                                <option value="" disabled>Select…</option>
                                {SESSION_COUNTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label="Specialist Coaching You're Looking For">
                        <select className={selectCls} value={form.specialism} onChange={set('specialism')}>
                            <option value="" disabled>Select…</option>
                            {SPECIALISMS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Preferred Day">
                            <select className={selectCls} value={form.preferred_day} onChange={set('preferred_day')}>
                                <option value="" disabled>Select…</option>
                                {DAYS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Preferred Time">
                            <select className={selectCls} value={form.preferred_time} onChange={set('preferred_time')}>
                                <option value="" disabled>Select…</option>
                                {TIME_SLOTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label="Parent / Guardian Name" required={isMinor}>
                        <input className={inputCls} value={form.parent_name} onChange={set('parent_name')} placeholder={isMinor ? 'Required for players under 18' : 'Optional for adult players'} autoComplete="name" />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Email">
                            <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" autoComplete="email" />
                        </Field>
                        <Field label="Phone">
                            <input className={inputCls} type="tel" value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" autoComplete="tel" />
                        </Field>
                    </div>

                    <Field label="Suburb" required={false}>
                        <input className={inputCls} value={form.suburb} onChange={set('suburb')} placeholder="e.g. Craigieburn" />
                    </Field>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-bold text-rr-pink bg-rr-pink/10 border border-rr-pink/30 rounded-xl px-4 py-3"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full group bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 justify-center"
                    >
                        {submitting ? 'Submitting…' : 'Register Interest'}
                        {!submitting && (
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>

                    <p className="text-center text-white/40 text-xs font-medium leading-relaxed">
                        No payment now. Every journey starts with a $160 first consultation — the{' '}
                        {CENTRE.name} Head Coach will contact you to confirm your coach, times and
                        session block before anything is booked.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default PCForm;
