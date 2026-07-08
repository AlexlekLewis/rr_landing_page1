import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DateOfBirthInput from '../DateOfBirthInput';

const DEPOSIT_LABEL = '$2,200';       // AUD total
const DEPOSIT_SUBLABEL = '$2,000 deposit + $200 GST';

const getUTM = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const calcAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
const inputBase =
    'w-full bg-slate-50 border rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm placeholder-slate-400';

const Field = ({ label, name, value, onChange, error, type = 'text', placeholder, required, optional, helper }) => (
    <div data-error={!!error}>
        <label className={labelClass}>
            {label} {required && <span className="text-rr-pink">*</span>}
            {optional && <span className="normal-case font-medium text-rr-charcoal/50"> (optional)</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputBase} ${error ? 'border-red-400' : 'border-slate-200'}`}
        />
        {helper && <p className="text-xs text-rr-charcoal/60 font-medium mt-1">{helper}</p>}
        {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
);

const TRAVELLER_OPTIONS = [
    { value: 1, label: 'Just the player' },
    { value: 2, label: 'Player + 1' },
    { value: 3, label: 'Player + 2' },
    { value: 4, label: 'Player + 3 or more' },
];

const DepositForm = ({ accessKey }) => {
    const [form, setForm] = useState({
        registrant_name: '',
        email: '',
        mobile: '',
        player_name: '',
        player_dob: '',
        current_club: '',
        traveller_count: 1,
        accompanying: '',
        notes: '',
    });
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const age = calcAge(form.player_dob);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.registrant_name.trim()) next.registrant_name = 'Your name is required.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) next.email = 'A valid email is required.';
        if (!form.mobile.trim()) next.mobile = 'A contact number is required.';
        if (!form.player_name.trim()) next.player_name = "The player's full name is required.";
        if (!consent) next.consent = 'Please agree to the deposit terms to continue.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setTimeout(() => {
                const el = document.querySelector('[data-error="true"]');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 80);
            return;
        }
        setSubmitting(true);
        setErrors((p) => ({ ...p, form: undefined }));

        try {
            const payload = {
                key: accessKey,
                registrant_name: form.registrant_name.trim(),
                email: form.email.trim(),
                mobile: form.mobile.trim(),
                player_name: form.player_name.trim(),
                player_dob: form.player_dob || null,
                player_age: age,
                current_club: form.current_club.trim() || null,
                traveller_count: Number(form.traveller_count) || 1,
                accompanying: form.accompanying.trim() || null,
                notes: form.notes.trim() || null,
                consent_terms: true,
                page_referrer: document.referrer || null,
                ...getUTM(),
            };

            const r = await fetch('/api/india-tour-deposit-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const d = await r.json();
            if (!r.ok || !d.url) throw new Error(d.error || 'Could not start checkout.');
            window.location.href = d.url; // → Stripe Checkout
        } catch (err) {
            console.error('India Tour deposit checkout error:', err);
            setErrors((p) => ({
                ...p,
                form: err.message || 'Something went wrong starting your payment. Please try again, or email info@rramelbourne.com.',
            }));
            setSubmitting(false);
        }
    };

    return (
        <section id="register" className="py-20 md:py-28 bg-rr-dark">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Secure Your Place</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        Pay Your <span className="text-rr-pink">Deposit</span>
                    </h2>
                    <p className="text-white/70 font-medium">
                        A few details, then you'll be taken to our secure Stripe checkout.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-8 md:p-10"
                >
                    {/* Amount summary */}
                    <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 mb-8">
                        <div>
                            <p className="text-xs font-black text-rr-dark uppercase tracking-widest">Deposit due today</p>
                            <p className="text-xs text-rr-charcoal/70 font-medium mt-0.5">{DEPOSIT_SUBLABEL} · AUD</p>
                        </div>
                        <div className="text-3xl font-black text-rr-dark">{DEPOSIT_LABEL}</div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Honeypot */}
                        <input
                            type="text"
                            name="hp_website"
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                            aria-hidden="true"
                            onChange={handleChange}
                        />

                        {/* Your details */}
                        <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-5 pb-3 border-b border-slate-100">
                            Your Details
                        </h3>
                        <div className="space-y-5 mb-8">
                            <Field label="Your Full Name" name="registrant_name" value={form.registrant_name} onChange={handleChange} error={errors.registrant_name} placeholder="e.g. Jane Smith" required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="jane@email.com" required />
                                <Field label="Mobile" type="tel" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile} placeholder="0412 345 678" required />
                            </div>
                        </div>

                        {/* Player / traveller */}
                        <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-5 pb-3 border-b border-slate-100">
                            Player &amp; Travellers
                        </h3>
                        <div className="space-y-5 mb-8">
                            <Field label="Player's Full Name" name="player_name" value={form.player_name} onChange={handleChange} error={errors.player_name} placeholder="e.g. Sam Smith" required />

                            <div>
                                <DateOfBirthInput
                                    value={form.player_dob}
                                    onChange={(v) => setForm((prev) => ({ ...prev, player_dob: v }))}
                                />
                                {age !== null && (
                                    <span className="inline-flex items-center gap-1.5 bg-rr-pink/10 text-rr-pink text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full -mt-2">
                                        Age: {age}
                                    </span>
                                )}
                            </div>

                            <Field label="Current Club" name="current_club" value={form.current_club} onChange={handleChange} placeholder="e.g. Northcote CC" optional />

                            <div>
                                <label className={labelClass}>How many travelling?</label>
                                <select
                                    name="traveller_count"
                                    value={form.traveller_count}
                                    onChange={handleChange}
                                    className={`${inputBase} border-slate-200 appearance-none cursor-pointer`}
                                >
                                    {TRAVELLER_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            {Number(form.traveller_count) > 1 && (
                                <div>
                                    <label className={labelClass}>
                                        Accompanying Traveller Name(s)
                                        <span className="normal-case font-medium text-rr-charcoal/50"> (optional)</span>
                                    </label>
                                    <textarea
                                        name="accompanying"
                                        value={form.accompanying}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="e.g. parent / guardian names travelling with the player"
                                        className={`${inputBase} border-slate-200 resize-none`}
                                    />
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>
                                    Notes or Questions
                                    <span className="normal-case font-medium text-rr-charcoal/50"> (optional)</span>
                                </label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Anything we should know?"
                                    className={`${inputBase} border-slate-200 resize-none`}
                                />
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="mb-6 pt-6 border-t border-slate-100" data-error={!!errors.consent}>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <span
                                    onClick={() => setConsent((v) => !v)}
                                    className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all ${consent ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}
                                >
                                    {consent && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-rr-charcoal text-sm font-medium leading-relaxed">
                                    I understand this <strong>$2,000 (+GST)</strong> deposit secures a place on the
                                    Rajasthan Royals Academy Melbourne India Tour 2026 and is applied to the total tour cost,
                                    and I agree to be contacted about this booking.
                                </span>
                            </label>
                            {errors.consent && <p className="text-red-500 text-xs font-medium mt-1 ml-8">{errors.consent}</p>}
                        </div>

                        {errors.form && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            data-cta="pay-deposit"
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Taking you to checkout…
                                </>
                            ) : (
                                <>
                                    Pay {DEPOSIT_LABEL} Deposit
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-rr-charcoal/50 font-medium mt-4">
                            Secure payment by Stripe · Card details are never stored by RRA Melbourne.
                            Full tour terms and the balance schedule are provided with your booking confirmation.
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default DepositForm;
