import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { CENTRE, OFFER, endDateLabel } from './launchConfig';
import { createPublicClient, publicError } from '../booking/public-client';
import { clearDraft, enquiryDraftKey, readAttempt, readDraft, writeAttempt, writeDraft } from '../booking/private-draft';
import { emptyDraft } from '../booking/booking-model';
import Turnstile from '../booking/Turnstile';

const DAYS = [
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'friday', label: 'Friday' },
    { value: 'either', label: 'Either — I’m flexible' },
];
const inputCls = 'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors';
const selectCls = `${inputCls} appearance-none [&>option]:text-rr-dark`;
const labelCls = 'block text-xs font-bold text-white/70 uppercase tracking-widest mb-2';
const Field = ({ label, required = true, children }) => <label className={labelCls}>{label} {required && <span className="text-rr-pink">*</span>}<span className="mt-2 block normal-case">{children}</span></label>;
const EMPTY = { player_name: '', age: '', parent_name: '', email: '', phone: '', preferred_day: '' };

const LaunchForm = () => {
    const [sourcePage] = useState(() => ['/mickleham-launch', '/Mickleham_Launch', '/launch'].includes(globalThis.location?.pathname) ? globalThis.location.pathname : '/mickleham-launch');
    const key = enquiryDraftKey(sourcePage), scope = `enquiry:${sourcePage}`;
    const [form, setForm] = useState(() => { const saved = readDraft(undefined, Date.now(), key); return saved ? { ...EMPTY, player_name: saved.players[0].name, age: saved.players[0].age, parent_name: saved.parent.name, email: saved.parent.email, phone: saved.parent.mobile, preferred_day: DAYS.some(d => saved.note === 'Launch preferred day: ' + d.value) ? saved.note.replace('Launch preferred day: ', '') : '' } : EMPTY; });
    const [submitting, setSubmitting] = useState(false), [submitted, setSubmitted] = useState(false), [error, setError] = useState('');
    const [receipt, setReceipt] = useState(null), [token, setToken] = useState(''), [reset, setReset] = useState(0);
    const [initialAttempt] = useState(() => readAttempt(scope));
    const attempt = useRef(initialAttempt), active = useRef(true);
    useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
    useEffect(() => { if (!submitted) writeDraft({ ...emptyDraft(), players: [{ name: form.player_name, age: form.age }], parent: { name: form.parent_name, email: form.email, mobile: form.phone }, note: 'Launch preferred day: ' + form.preferred_day }, undefined, Date.now(), key); }, [form, key, submitted]);
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
    const ageNum = Number(form.age), isMinor = form.age !== '' && ageNum < 18;
    const validate = () => {
        if (!form.player_name.trim() || form.player_name.length > 120) return 'Please enter the player’s name.';
        if (!/^\d{1,3}$/.test(form.age) || ageNum > 120) return 'Please enter a valid age.';
        if (isMinor && !form.parent_name.trim()) return 'Please add a parent or guardian name for players under 18.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
        if (!/^[+\d ()-]{7,30}$/.test(form.phone) || form.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
        if (!DAYS.some(d => d.value === form.preferred_day)) return 'Please pick a night — Tuesday, Friday, or either.';
        return '';
    };
    const handleSubmit = async e => {
        e.preventDefault(); if (submitting) return;
        const problem = validate(); if (problem) { setError(problem); return; }
        if (new FormData(e.currentTarget).get('company_website')) { setError('Check the form and try again.'); return; }
        if (!token) { setError('Complete the security check before sending.'); return; }
        const intent = { centre: 'mickleham', player_name: form.player_name.trim(), player_age: ageNum, parent_name: form.parent_name.trim() || null, email: form.email.trim().toLowerCase(), mobile: form.phone.trim(), note: `[30-DAY LAUNCH SPECIAL — ${OFFER.price} consultation enquiry] Preferred night: ${DAYS.find(d => d.value === form.preferred_day).label}.`, source_page: sourcePage };
        const payload = JSON.stringify(intent);
        if (attempt.current?.payload !== payload) attempt.current = { nonce: crypto.randomUUID(), payload };
        writeAttempt(scope, attempt.current); setError(''); setSubmitting(true);
        try {
            const saved = await createPublicClient().enquiry(intent, token, attempt.current.nonce);
            if (active.current) { setReceipt(saved); clearDraft(undefined, key); writeAttempt(scope, null); setSubmitted(true); }
        } catch (problem) { if (active.current) { setError(publicError(problem)); setToken(''); setReset(n => n + 1); } }
        finally { if (active.current) setSubmitting(false); }
    };

    if (submitted) {
        return (
            <section className="bg-rr-dark py-20 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
                <div className="relative max-w-2xl mx-auto px-6 text-center">
                    <span className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
                        You’re On The List
                    </h2>
                    <p className="text-white/80 font-medium leading-relaxed mb-4">
                        Thanks {form.player_name.split(' ')[0]}. Your enquiry is with the Academy.
                        We’ll call you <b className="text-white">{receipt.call_by_plain}</b>.
                    </p>
                    <p className="text-white/60 font-medium leading-relaxed">
                        You’re asking about the <b className="text-white">{OFFER.price}</b> consultation offer
                        at {CENTRE.name}. This is an enquiry, not a booking. No payment has been taken.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="register" className="bg-rr-dark py-20 md:py-24 relative overflow-hidden scroll-mt-20">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-xl mx-auto px-6">
                <div className="text-center mb-10">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Claim The Offer</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        Book Your Spot
                    </h2>
                    <p className="text-white/70 font-medium">
                        Takes two minutes. You pay nothing now — we’ll call you to pick a time.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 ph-no-capture" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Player’s Name">
                            <input className={inputCls} value={form.player_name} onChange={set('player_name')} placeholder="e.g. Arjun Sharma" autoComplete="name" />
                        </Field>
                        <Field label="Age">
                            <input className={inputCls} value={form.age} onChange={set('age')} placeholder="e.g. 14" inputMode="numeric" />
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

                    <Field label="Which night works? Tuesday or Friday">
                        <select className={selectCls} value={form.preferred_day} onChange={set('preferred_day')}>
                            <option value="" disabled>Select…</option>
                            {DAYS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>

                    <label className="booking-trap" aria-hidden="true">Company website<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
                    <Turnstile onToken={setToken} reset={reset} />
                    {error && (
                        <Motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-bold text-rr-pink bg-rr-pink/10 border border-rr-pink/30 rounded-xl px-4 py-3"
                        >
                            {error}
                        </Motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || !token}
                        className="w-full group bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-base px-8 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_32px_rgba(229,6,149,0.5)] flex items-center gap-3 justify-center"
                    >
                        {submitting ? 'Sending…' : `Claim My ${OFFER.price} Spot`}
                        {!submitting && (
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>

                    <p className="text-center text-white/40 text-xs font-medium leading-relaxed">
                        You pay nothing now. The {OFFER.price} is for your first session only — the
                        consultation — at {CENTRE.name}, booked before {endDateLabel()}. Regular
                        coaching after that is priced separately, and Alex will talk you through it.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default LaunchForm;
