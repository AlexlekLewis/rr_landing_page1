import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import {
    SPECIALISMS, YEARS_PLAYED, SESSION_COUNTS, DAYS, TIME_SLOTS, CENTRE,
    BOOKING_TYPES, GROUP_SIZES, SESSION_LENGTHS, UNDER_14_CUTOFF,
    PROGRAM_TYPES, PROGRAM_PRICE_HINTS, qualifiesForPathway,
} from './pcOptions';

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
const hintCls = 'text-[11px] text-white/45 font-medium mt-1.5 leading-relaxed';

const Field = ({ label, required = true, hint, children }) => (
    <div>
        <label className={labelCls}>
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        {children}
        {hint && <p className={hintCls}>{hint}</p>}
    </div>
);

const EMPTY = {
    player_name: '',
    age: '',
    years_played: '',
    booking_type: 'private',
    group_size: '',
    group_names: '',
    program: '',
    sessions_requested: '',
    session_length: '60',
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
    const under14 = !Number.isNaN(ageNum) && ageNum < UNDER_14_CUTOFF;
    const isGroup = form.booking_type === 'group';
    const isPackage = form.program === 'term-10' || form.program === 'season-40';

    // 30-minute sessions: under-14s, private bookings only — everyone else trains full hours.
    const thirtyAllowed = under14 && !isGroup;
    const effectiveLength = thirtyAllowed ? form.session_length : '60';
    const effectiveSessions = isPackage ? (form.program === 'term-10' ? '10' : '40') : form.sessions_requested;
    const qualifies = qualifiesForPathway(effectiveLength, effectiveSessions, isPackage ? form.program : 'none');

    const setAge = (e) => {
        const v = e.target.value;
        const n = parseInt(v, 10);
        setForm((f) => ({
            ...f,
            age: v,
            session_length: !Number.isNaN(n) && n >= UNDER_14_CUTOFF ? '60' : f.session_length,
        }));
    };

    const setBookingType = (e) => {
        const v = e.target.value;
        setForm((f) => ({
            ...f,
            booking_type: v,
            session_length: v === 'group' ? '60' : f.session_length,
            group_size: v === 'group' ? f.group_size : '',
            group_names: v === 'group' ? f.group_names : '',
        }));
    };

    const validate = () => {
        if (!form.player_name.trim()) return 'Please enter the player\'s name.';
        if (Number.isNaN(ageNum) || ageNum < 4 || ageNum > 99) return 'Please enter a valid age.';
        if (!form.years_played) return 'Please select how many years they\'ve played.';
        if (isGroup && !form.group_size) return 'Please select your group size (2–4 players).';
        if (!form.program) return 'Please choose a program — a casual block or a weekly package.';
        if (!isPackage && !form.sessions_requested) return 'Please select a session block — the 3-session starter or 6+.';
        if (effectiveLength === '30' && !thirtyAllowed) return 'Players 14 and over train in full-hour sessions.';
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
            booking_type: form.booking_type,
            group_size: isGroup ? parseInt(form.group_size, 10) : null,
            group_names: isGroup && form.group_names.trim() ? form.group_names.trim() : null,
            package_type: isPackage ? form.program : 'none',
            sessions_requested: effectiveSessions,
            session_length: effectiveLength,
            pathway_eligible: qualifies,
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
        const programLabel = form.program === 'term-10'
            ? '10-week term program'
            : form.program === 'season-40'
                ? '40-week season program (school holidays excluded)'
                : `${effectiveSessions === '3' ? 'three' : effectiveSessions === '6' ? 'six' : effectiveSessions}-session block`;
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
                    <p className="text-white/60 font-medium leading-relaxed mb-4">
                        Expect a call to talk through your game. From there you'll be assigned the
                        coach best suited to your development journey — starting with your first
                        consultation session, with your {programLabel} locked in on your preferred{' '}
                        {form.preferred_day === 'tuesday' ? 'Tuesday' : 'Friday'} time.
                    </p>
                    {qualifies && (
                        <p className="text-white font-semibold leading-relaxed bg-white/5 border border-rr-pink/30 rounded-2xl px-6 py-4">
                            Your program also makes {form.player_name.split(' ')[0]} eligible for{' '}
                            <b>Power League T20 selection</b> and <b>the India Tour to the High
                            Performance Centre</b> — the Head Coach will walk you through both.
                        </p>
                    )}
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
                            <input className={inputCls} value={form.age} onChange={setAge} placeholder="e.g. 14" inputMode="numeric" />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Years Played">
                            <select className={selectCls} value={form.years_played} onChange={set('years_played')}>
                                <option value="" disabled>Select…</option>
                                {YEARS_PLAYED.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Booking Type">
                            <select className={selectCls} value={form.booking_type} onChange={setBookingType}>
                                {BOOKING_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </Field>
                    </div>

                    {isGroup && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Group Size">
                                <select className={selectCls} value={form.group_size} onChange={set('group_size')}>
                                    <option value="" disabled>Select…</option>
                                    {GROUP_SIZES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Other Players' Names" required={false}>
                                <input className={inputCls} value={form.group_names} onChange={set('group_names')} placeholder="Who's training with you?" />
                            </Field>
                        </div>
                    )}

                    <Field
                        label="Program"
                        hint={isPackage ? PROGRAM_PRICE_HINTS[form.program] : undefined}
                    >
                        <select className={selectCls} value={form.program} onChange={set('program')}>
                            <option value="" disabled>Choose your program…</option>
                            {PROGRAM_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {!isPackage && (
                            <Field label="Session Block — 3-Session Starter or 6+">
                                <select className={selectCls} value={form.sessions_requested} onChange={set('sessions_requested')}>
                                    <option value="" disabled>Select…</option>
                                    {SESSION_COUNTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                        )}
                        {!isGroup && (
                            <Field
                                label="Session Length"
                                hint={thirtyAllowed
                                    ? 'Under-14s can opt for focused 30-minute sessions ($70).'
                                    : 'Players 14 and over train in full-hour sessions.'}
                            >
                                <select
                                    className={selectCls}
                                    value={effectiveLength}
                                    onChange={set('session_length')}
                                    disabled={!thirtyAllowed}
                                >
                                    {(thirtyAllowed ? SESSION_LENGTHS : SESSION_LENGTHS.filter((o) => o.value === '60'))
                                        .map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                        )}
                    </div>

                    {(form.program || form.sessions_requested) && (
                        qualifies ? (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3 bg-white/5 border border-rr-pink/40 rounded-2xl px-5 py-4"
                            >
                                <span className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <p className="text-sm text-white font-semibold leading-relaxed">
                                    This program unlocks the Royals pathway — eligible for{' '}
                                    <b>Power League T20 selection</b> and <b>the India Tour to the
                                    High Performance Centre</b>.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.p
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-white/60 font-medium leading-relaxed bg-white/4 border border-white/10 rounded-2xl px-5 py-4"
                            >
                                Booking <b className="text-white">6+ full-hour sessions</b> makes players
                                eligible for <b className="text-white">Power League T20 selection</b> and{' '}
                                <b className="text-white">the India Tour</b> — one step up from this selection.
                            </motion.p>
                        )
                    )}

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
                        program before anything is booked.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default PCForm;
