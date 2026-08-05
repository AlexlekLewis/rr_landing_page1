import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';
import { getTiers, TIER_PRICES } from './itCopy';

const SOURCE_TAG = 'india-tour-2026-eoi';
const PROGRAM_LABEL = 'India Tour 2026';

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
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

const RELATIONSHIP_OPTIONS = ['Mother', 'Father', 'Guardian', 'Other'];
const SKILL_OPTIONS = ['Batsman', 'Wicketkeeper', 'Fast bowler', 'Off spinner', 'Leg spinner'];

const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
const helperClass = 'text-xs text-rr-charcoal/60 font-medium mt-1';
const sectionHeading = 'text-base font-black text-rr-dark uppercase tracking-widest mb-5 pb-3 border-b border-slate-100';

const Field = ({ label, name, value, onChange, error, type = 'text', placeholder, required, optional, helper }) => {
    const inputClass = `w-full bg-slate-50 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm placeholder-slate-400`;
    return (
        <div data-error={!!error}>
            <label className={labelClass}>
                {label} {required && <span className="text-rr-pink">*</span>}
                {optional && <span className="normal-case font-medium text-rr-charcoal/50">(optional)</span>}
            </label>
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={inputClass} />
            {helper && <p className={helperClass}>{helper}</p>}
            {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
        </div>
    );
};

const GuardianFields = ({ idx, data, onChange, errors, required }) => {
    const p = `guardian${idx}`;
    const selectClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm appearance-none cursor-pointer';
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Parent / Guardian Name" name={`${p}_name`} value={data[`${p}_name`]} onChange={onChange} error={errors[`${p}_name`]} placeholder="e.g. Jane Smith" required={required} />
                <div>
                    <label className={labelClass}>Relationship {required && <span className="text-rr-pink">*</span>}</label>
                    <select name={`${p}_relationship`} value={data[`${p}_relationship`]} onChange={onChange} className={selectClass}>
                        <option value="">Select…</option>
                        {RELATIONSHIP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email" type="email" name={`${p}_email`} value={data[`${p}_email`]} onChange={onChange} error={errors[`${p}_email`]} placeholder="jane@email.com" required={required} />
                <Field label="Phone" type="tel" name={`${p}_phone`} value={data[`${p}_phone`]} onChange={onChange} error={errors[`${p}_phone`]} placeholder="0412 345 678" required={required} />
            </div>
        </div>
    );
};

const ITForm = ({ copy, referralCode, referralName }) => {
    const fc = copy.form;
    const TIERS = getTiers(copy);
    const TIER_BY_KEY = TIERS.reduce((acc, t) => ({ ...acc, [t.key]: t }), {});
    const [form, setForm] = useState({
        player_type: '',
        player_name: '',
        player_dob: '',
        current_club: '',
        highest_level: '',
        primary_skill: '',
        secondary_skill: '',
        player_email: '',
        player_phone: '',
        guardian1_name: '', guardian1_relationship: '', guardian1_email: '', guardian1_phone: '',
        guardian2_name: '', guardian2_relationship: '', guardian2_email: '', guardian2_phone: '',
    });
    const [showGuardian2, setShowGuardian2] = useState(false);
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const age = calcAge(form.player_dob);
    const isMinor = age !== null && age < 18;
    const isAdult = age !== null && age >= 18;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.player_type) next.player_type = 'Please tell us which one describes your player.';
        if (!form.player_name.trim()) next.player_name = "Player's full name is required.";
        if (!form.player_dob || age === null) next.player_dob = 'Please enter a valid date of birth.';
        if (!form.current_club.trim()) next.current_club = 'Current club is required.';
        if (!form.highest_level.trim()) next.highest_level = 'Highest level played is required.';
        if (!form.primary_skill) next.primary_skill = 'Please select a primary skill.';

        if (isMinor) {
            if (!form.guardian1_name.trim()) next.guardian1_name = 'Parent/guardian name is required.';
            if (!form.guardian1_email.trim() || !/\S+@\S+\.\S+/.test(form.guardian1_email)) next.guardian1_email = 'A valid parent/guardian email is required.';
            if (!form.guardian1_phone.trim()) next.guardian1_phone = 'Parent/guardian phone is required.';
        }
        if (isAdult) {
            if (!form.player_email.trim() || !/\S+@\S+\.\S+/.test(form.player_email)) next.player_email = 'A valid email is required.';
            if (!form.player_phone.trim()) next.player_phone = 'Phone number is required.';
        }
        if (!consent) next.consent = 'Please agree to be contacted.';

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

        try {
            const utm = getUTMParams();
            const payload = {
                player_type: form.player_type || null,
                program_fee_aud: TIER_PRICES[form.player_type] ?? null,
                player_name: form.player_name.trim(),
                player_dob: form.player_dob || null,
                player_age: age,
                current_club: form.current_club.trim(),
                highest_level: form.highest_level.trim(),
                primary_skill: form.primary_skill || null,
                secondary_skill: form.secondary_skill || null,
                player_email: form.player_email.trim() || null,
                player_phone: form.player_phone.trim() || null,
                guardian1_name: form.guardian1_name.trim() || null,
                guardian1_relationship: form.guardian1_relationship || null,
                guardian1_email: form.guardian1_email.trim() || null,
                guardian1_phone: form.guardian1_phone.trim() || null,
                guardian2_name: form.guardian2_name.trim() || null,
                guardian2_relationship: form.guardian2_relationship || null,
                guardian2_email: form.guardian2_email.trim() || null,
                guardian2_phone: form.guardian2_phone.trim() || null,
                is_over_18: isAdult,
                consent_contact: consent,
                referral_code: referralCode || null,
                referral_name: referralName || null,
                source: SOURCE_TAG,
                page_referrer: document.referrer || null,
                ...utm,
            };

            const { error: insertError } = await supabase.from('india_tour_2026_eoi').insert([payload]);
            if (insertError) throw insertError;

            // Secondary, non-blocking insert into the shared applications table.
            try {
                const nameParts = form.player_name.trim().split(' ');
                await supabase.from('applications').insert([{
                    first_name: nameParts[0] || '',
                    last_name: nameParts.slice(1).join(' ') || '',
                    dob: form.player_dob || null,
                    age,
                    club: form.current_club.trim() || null,
                    experience_level: form.highest_level.trim() || null,
                    email: (form.player_email || form.guardian1_email).trim() || null,
                    phone: (form.player_phone || form.guardian1_phone).trim() || null,
                    parent1_name: form.guardian1_name.trim() || null,
                    parent1_email: form.guardian1_email.trim() || null,
                    parent1_phone: form.guardian1_phone.trim() || null,
                    parent2_name: form.guardian2_name.trim() || null,
                    parent2_email: form.guardian2_email.trim() || null,
                    parent2_phone: form.guardian2_phone.trim() || null,
                    source: SOURCE_TAG,
                    program: PROGRAM_LABEL,
                    program_type: SOURCE_TAG,
                    page_referrer: document.referrer || null,
                    ...utm,
                }]);
            } catch (_) { /* non-blocking */ }

            setSubmitted(true);
            window.scrollTo({ top: document.getElementById('register')?.offsetTop || 0, behavior: 'smooth' });
        } catch (err) {
            console.error('India Tour EOI submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or email info@rramelbourne.com.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section className="py-24 bg-rr-dark">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-10 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">You're On The List</h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed">
                            Thanks <strong>{form.player_name.split(' ')[0]}</strong> — your interest in the
                            India Tour 2026 has been registered. Our team will be in touch with more
                            information as the touring squad takes shape.
                        </p>
                        {TIER_BY_KEY[form.player_type] && (
                            <p className="text-rr-charcoal font-medium leading-relaxed mt-4">
                                You told us your player is an{' '}
                                <strong>{TIER_BY_KEY[form.player_type].heading}</strong>, so the program fee
                                we will quote is{' '}
                                <strong>
                                    ${TIER_BY_KEY[form.player_type].price.toLocaleString('en-AU')} including GST
                                </strong>
                                , plus flights. We will confirm that in writing — you have not been charged
                                anything today.
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">{fc.badge}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4"
                    >
{fc.heading} <span className="text-rr-pink">{fc.headingAccent}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 font-medium"
                    >
{fc.lead}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 }}
                    className="bg-white rounded-2xl p-8 md:p-10"
                >
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Which price applies — drives the fee we quote back. */}
                        <div className="mb-8" data-error={!!errors.player_type}>
                            <h3 className={sectionHeading}>{fc.tierHeading}</h3>
                            <p className="text-sm text-rr-charcoal font-medium leading-relaxed -mt-2 mb-5">
{fc.tierLead}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {TIERS.map((t) => {
                                    const selected = form.player_type === t.key;
                                    return (
                                        <button
                                            type="button"
                                            key={t.key}
                                            onClick={() => {
                                                setForm(prev => ({ ...prev, player_type: t.key }));
                                                if (errors.player_type) setErrors(prev => ({ ...prev, player_type: undefined }));
                                            }}
                                            aria-pressed={selected}
                                            className={`text-left rounded-xl border-2 p-5 transition-all ${
                                                selected
                                                    ? 'border-rr-pink bg-rr-pink/5'
                                                    : errors.player_type
                                                        ? 'border-red-300 bg-slate-50 hover:border-rr-pink/60'
                                                        : 'border-slate-200 bg-slate-50 hover:border-rr-pink/60'
                                            }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span
                                                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                        selected ? 'border-rr-pink' : 'border-slate-300'
                                                    }`}
                                                >
                                                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-rr-pink" />}
                                                </span>
                                                <span className="text-sm font-black text-rr-dark uppercase tracking-wide">
                                                    {t.heading}
                                                </span>
                                            </span>
                                            <span className="block text-2xl font-black text-rr-dark mt-3">
                                                ${t.price.toLocaleString('en-AU')}
                                                <span className="text-xs font-bold text-rr-charcoal/70 uppercase tracking-wide ml-2">
                                                    incl GST
                                                </span>
                                            </span>
                                            <span className="block text-xs text-rr-charcoal/70 font-medium mt-1">
{fc.tierFootnote}
                                            </span>
                                            <span className="block text-sm text-rr-charcoal font-medium leading-relaxed mt-3">
                                                {t.who}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.player_type && <p className="text-red-500 text-xs font-medium mt-2">{errors.player_type}</p>}
                        </div>

                        {/* Player details */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Player Details</h3>
                            <div className="space-y-5">
                                <Field label="Player's Full Name" name="player_name" value={form.player_name} onChange={handleChange} error={errors.player_name} placeholder="e.g. Sam Smith" required />

                                <div data-error={!!errors.player_dob}>
                                    <DateOfBirthInput value={form.player_dob} onChange={(v) => { setForm(prev => ({ ...prev, player_dob: v })); if (errors.player_dob) setErrors(prev => ({ ...prev, player_dob: undefined })); }} required />
                                    {age !== null && (
                                        <div className="-mt-3 mb-1 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 bg-rr-pink/10 text-rr-pink text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                                Age: {age}
                                            </span>
                                            <span className="text-xs text-rr-charcoal/60 font-medium">
                                                {isMinor ? 'Under 18 — parent/guardian details required below.' : '18 or over — parent/guardian details optional.'}
                                            </span>
                                        </div>
                                    )}
                                    {errors.player_dob && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_dob}</p>}
                                </div>

                                <Field label="Current Club" name="current_club" value={form.current_club} onChange={handleChange} error={errors.current_club} placeholder="e.g. Northcote CC" required />

                                <Field
                                    label="Highest Level of Cricket Played"
                                    name="highest_level"
                                    value={form.highest_level}
                                    onChange={handleChange}
                                    error={errors.highest_level}
                                    placeholder="e.g. Premier Cricket U16, District representative…"
                                    helper="Tell us the highest level where you've played more than six games."
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div data-error={!!errors.primary_skill}>
                                        <label className={labelClass}>Primary Skill <span className="text-rr-pink">*</span></label>
                                        <select
                                            name="primary_skill"
                                            value={form.primary_skill}
                                            onChange={handleChange}
                                            className={`w-full bg-slate-50 border ${errors.primary_skill ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select…</option>
                                            {SKILL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        {errors.primary_skill && <p className="text-red-500 text-xs font-medium mt-1">{errors.primary_skill}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Secondary Skill <span className="normal-case font-medium text-rr-charcoal/50">(optional)</span></label>
                                        <select
                                            name="secondary_skill"
                                            value={form.secondary_skill}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">Select…</option>
                                            {SKILL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Player contact */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Player Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Player Email" type="email" name="player_email" value={form.player_email} onChange={handleChange} error={errors.player_email} placeholder="player@email.com" required={isAdult} optional={!isAdult} />
                                <Field label="Player Phone" type="tel" name="player_phone" value={form.player_phone} onChange={handleChange} error={errors.player_phone} placeholder="0412 345 678" required={isAdult} optional={!isAdult} />
                            </div>
                        </div>

                        {/* Parent / guardian */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>
                                Parent / Guardian {isMinor ? '' : <span className="normal-case font-medium text-rr-charcoal/50">(optional for over-18s)</span>}
                            </h3>
                            <GuardianFields idx={1} data={form} onChange={handleChange} errors={errors} required={isMinor} />

                            <AnimatePresence initial={false}>
                                {showGuardian2 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 mt-6 border-t border-slate-100">
                                            <p className="text-xs font-black text-rr-charcoal uppercase tracking-widest mb-4">Second Parent / Guardian</p>
                                            <GuardianFields idx={2} data={form} onChange={handleChange} errors={errors} required={false} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!showGuardian2 && (
                                <button type="button" onClick={() => setShowGuardian2(true)} className="mt-4 text-sm font-bold text-rr-pink hover:text-rr-light-pink uppercase tracking-wide inline-flex items-center gap-2">
                                    <span className="text-lg leading-none">+</span> Add a second parent / guardian
                                </button>
                            )}
                        </div>

                        {/* Consent */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <span
                                    onClick={() => setConsent(v => !v)}
                                    className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all ${consent ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}
                                >
                                    {consent && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-rr-charcoal text-sm font-medium leading-relaxed">
                                    I agree to be contacted by Rajasthan Royals Academy Melbourne about the India Tour 2026
                                    and consent to my information being stored in line with the{' '}
                                    <a href="/india-tour-privacy-notice.html" target="_blank" rel="noopener noreferrer" className="text-rr-pink hover:underline font-bold">privacy notice</a>.
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
                            data-cta="submit-eoi"
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    Submit Registration
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default ITForm;
