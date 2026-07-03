import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Reusable Junior Royals registration form, shared by every open-day centre
// (Williamstown, Hallam, Mickleham). Registration is now required "due to popular
// demand" — except Mickleham, which has already been promoted as turn-up-and-play,
// so it uses mode='flexible' ("register now, or on the day").
//
// Driven by a small cfg prop:
//   { table, sourceTag, pixelName, pixelCategory, time, suburbPlaceholder, mode }
//     mode: 'required'  → W/H · you now need to register
//           'flexible'  → Mickleham · register now or on the day
//
// Captures four compliances: T&Cs+Privacy, photo/media, medical & liability
// (all three mandatory) and an optional marketing opt-in. Shows an inline
// confirmation on success and fires a Meta Pixel Lead (distinct content_name).

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const ageFromDob = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return null;
    const t = new Date();
    let age = t.getFullYear() - d.getFullYear();
    const m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
    return age;
};

const ComplianceCheckbox = ({ checked, onChange, error, children }) => (
    <div className="mb-3.5">
        <label
            onClick={(e) => { if (!e.target.closest('a')) onChange(!checked); }}
            className="flex items-start gap-3 cursor-pointer group"
        >
            <div className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}>
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className="text-rr-charcoal text-sm font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-8">{error}</p>}
    </div>
);

const JuniorRegisterForm = ({ cfg }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [acceptMedical, setAcceptMedical] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);

    const [form, setForm] = useState({
        player_name: '', player_dob: '', player_gender: '',
        parent_name: '', parent_email: '', parent_phone: '', suburb: '', current_club: '',
    });

    const age = ageFromDob(form.player_dob);

    const validate = () => {
        const e = {};
        if (!form.player_name.trim()) e.player_name = 'Player name is required.';
        if (!form.player_dob) e.player_dob = 'Date of birth is required.';
        if (!form.player_gender) e.player_gender = 'Please select an option.';
        if (!form.parent_name.trim()) e.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) e.parent_phone = 'Phone number is required.';
        if (!form.suburb.trim()) e.suburb = 'Suburb is required.';
        if (!acceptTerms) e.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptSocialMedia) e.acceptSocialMedia = 'You must confirm photo/media consent.';
        if (!acceptMedical) e.acceptMedical = 'You must confirm the medical & liability declaration.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const utm = getUTMParams();
            const { error: insertError } = await supabase
                .from(cfg.table)
                .insert([{
                    player_name: form.player_name.trim(),
                    player_dob: form.player_dob || null,
                    player_age: age,
                    player_gender: form.player_gender,
                    parent_name: form.parent_name.trim(),
                    parent_email: form.parent_email.trim(),
                    parent_phone: form.parent_phone.trim(),
                    suburb: form.suburb.trim(),
                    current_club: form.current_club.trim() || null,
                    session: 'junior-royals',
                    accept_terms: acceptTerms,
                    accept_social_media: acceptSocialMedia,
                    accept_medical: acceptMedical,
                    accept_marketing: acceptMarketing,
                    source: cfg.sourceTag,
                    page_referrer: document.referrer || null,
                    ...utm,
                }]);
            if (insertError) throw insertError;
            // Stash the confirmation for the dedicated success URL, then navigate.
            // The success page reads this one-shot stash and fires the Meta Lead pixel
            // (so the junior sign-up has its own thank-you URL, like the Elite flow).
            const firstName = (form.player_name || '').trim().split(' ')[0] || 'You';
            try {
                sessionStorage.setItem(cfg.storageKey, JSON.stringify({ firstName, email: form.parent_email.trim() }));
            } catch (_) { /* success page falls back to generic copy */ }
            navigate(cfg.successRoute);
        } catch (err) {
            console.error(`${cfg.sourceTag} submission error:`, err);
            setErrors({ form: 'Something went wrong. Please try again, or email eliteprogram@rramelbourne.com' });
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-blue transition-colors duration-200 text-sm`;
    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    const flexible = cfg.mode === 'flexible';

    return (
        <section id="register-junior" className="py-24" style={{ background: 'linear-gradient(180deg,#0a1230 0%,#0a1f6b 100%)' }}>
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#9DB6FF' }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9DB6FF' }}>Junior Royals · {cfg.time} · Ages 5–15</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        Register for <span style={{ color: '#9DB6FF' }}>Junior Royals</span>
                    </h2>
                    <p className="text-white/70 font-medium max-w-lg mx-auto">
                        {flexible ? (
                            <>Save time and <strong className="text-white">register now</strong> — or just <strong className="text-white">register on the day</strong>. Either way, come and have a go, all skill levels welcome.</>
                        ) : (
                            <><strong className="text-white">Due to popular demand, you now need to register</strong> for the Junior Royals open training. Secure your child's spot below — all skill levels welcome.</>
                        )}
                    </p>
                </div>

                <motion.div
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 md:p-10"
                    >
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Player */}
                            <div className="mb-8">
                                <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Player Details</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Player Full Name *</label>
                                        <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Sam Smith" />
                                        {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClass}>Date of Birth *</label>
                                            <input name="player_dob" type="date" value={form.player_dob} onChange={handleChange} className={inputClass('player_dob')} />
                                            {errors.player_dob && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_dob}</p>}
                                            {age !== null && <p className="text-rr-charcoal/60 text-xs font-medium mt-1">Age: {age}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Gender *</label>
                                            <select name="player_gender" value={form.player_gender} onChange={handleChange} className={inputClass('player_gender')}>
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other / prefer not to say</option>
                                            </select>
                                            {errors.player_gender && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_gender}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClass}>Suburb *</label>
                                            <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder={cfg.suburbPlaceholder} />
                                            {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Current Club <span className="text-rr-charcoal/40 normal-case font-medium">(optional)</span></label>
                                            <input name="current_club" value={form.current_club} onChange={handleChange} className={inputClass('current_club')} placeholder="If they play already" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Parent / Guardian */}
                            <div className="mb-8">
                                <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Parent / Guardian</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className={labelClass}>Full Name *</label>
                                        <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass('parent_name')} placeholder="e.g. Jane Smith" />
                                        {errors.parent_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelClass}>Email *</label>
                                            <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass('parent_email')} placeholder="jane@email.com" />
                                            {errors.parent_email && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_email}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Mobile *</label>
                                            <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={inputClass('parent_phone')} placeholder="0412 345 678" />
                                            {errors.parent_phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compliances */}
                            <div className="mb-8 pt-6 border-t border-slate-100">
                                <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6">Agreements &amp; Consent</h3>
                                <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                    I have read and agree to the{' '}
                                    <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}and{' '}
                                    <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>, and confirm all information is accurate.
                                </ComplianceCheckbox>
                                <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                                    I consent to photos/videos featuring the player being used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                                </ComplianceCheckbox>
                                <ComplianceCheckbox checked={acceptMedical} onChange={setAcceptMedical} error={errors.acceptMedical}>
                                    I confirm the player is fit to take part, and I consent to first aid / emergency medical treatment if needed. I understand participation is at my own risk.
                                </ComplianceCheckbox>
                                <ComplianceCheckbox checked={acceptMarketing} onChange={setAcceptMarketing}>
                                    <span className="text-rr-charcoal/70">(Optional)</span> Keep me updated about RRA Melbourne programs, sessions and offers by email or SMS.
                                </ComplianceCheckbox>
                            </div>

                            {errors.form && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-rr-blue hover:bg-rr-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
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
                                        Register for Junior Royals
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-rr-charcoal/50 text-xs font-medium mt-4">Free to attend · all skill levels welcome</p>
                        </form>
                </motion.div>
            </div>
        </section>
    );
};

export default JuniorRegisterForm;
