import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
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

const GRADE_OPTIONS = [
    'Representative / rep cricket',
    'Club / Premier cricket',
    'School cricket',
    'Local / community cricket',
    'Just starting out',
];
const YEARS_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '5+ years'];
const ROLE_OPTIONS = ['Batter', 'Bowler', 'All-rounder', 'Wicketkeeper'];
const BAT_OPTIONS = ['Right-hand', 'Left-hand'];
const BOWL_OPTIONS = [
    'Right-arm pace', 'Left-arm pace', 'Off-spin', 'Leg-spin',
    'Left-arm orthodox', "Don't bowl / N/A",
];

const ComplianceCheckbox = ({ checked, onChange, error, children }) => (
    <div className="mb-4">
        <label
            onClick={(e) => { if (!e.target.closest('a')) onChange(!checked); }}
            className="flex items-start gap-3 cursor-pointer group"
        >
            <div
                className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}
            >
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

const OpenDayForm = ({ config }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [acceptLiability, setAcceptLiability] = useState(false);

    const [form, setForm] = useState({
        player_name: '', player_dob: '', player_gender: '',
        parent_name: '', parent_email: '', parent_phone: '', suburb: '',
        current_club: '', current_grade: '', years_playing: '',
        primary_role: '', batting_hand: '', bowling_type: '', honours: '',
    });

    const age = ageFromDob(form.player_dob);
    const tooYoung = age !== null && age < 11;

    const validate = () => {
        const e = {};
        if (!form.player_name.trim()) e.player_name = 'Player name is required.';
        if (!form.player_dob) e.player_dob = 'Date of birth is required.';
        else if (tooYoung) e.player_dob = 'The Elite Royals trial is for players aged 11 and over.';
        if (!form.player_gender) e.player_gender = 'Please select an option.';
        if (!form.parent_name.trim()) e.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) e.parent_phone = 'Phone number is required.';
        if (!form.suburb.trim()) e.suburb = 'Suburb is required.';
        if (!form.primary_role) e.primary_role = 'Please select a role.';
        if (!acceptTerms) e.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptSocialMedia) e.acceptSocialMedia = 'You must confirm photo/media consent.';
        if (!acceptLiability) e.acceptLiability = 'You must acknowledge the liability & risk waiver.';
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
                .from(config.table)
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
                    current_grade: form.current_grade || null,
                    years_playing: form.years_playing || null,
                    primary_role: form.primary_role || null,
                    batting_hand: form.batting_hand || null,
                    bowling_type: form.bowling_type || null,
                    honours: form.honours.trim() || null,
                    session: config.sessionValue,
                    accept_terms: acceptTerms,
                    accept_social_media: acceptSocialMedia,
                    accept_liability: acceptLiability,
                    source: config.sourceTag,
                    page_referrer: document.referrer || null,
                    ...utm,
                }]);
            if (insertError) throw insertError;
            // Stash the confirmation details for the dedicated success URL, then
            // navigate there. The success route reads this one-shot stash, fires the
            // Meta Pixel Lead conversion, and clears it.
            const firstName = (form.player_name || '').trim().split(' ')[0] || 'You';
            try {
                sessionStorage.setItem(config.storageKey, JSON.stringify({
                    firstName,
                    email: form.parent_email.trim(),
                }));
            } catch (_) { /* sessionStorage may be unavailable; success page falls back to generic copy */ }
            navigate(config.successRoute);
        } catch (err) {
            console.error(`${config.slug} open day submission error:`, err);
            setErrors({ form: 'Something went wrong. Please try again, or email eliteprogram@rramelbourne.com' });
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section id="register" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Elite Royals · {config.eliteTime} · Ages 11–25</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        Register for the <span className="text-rr-pink">Elite Royals</span> trial
                    </h2>
                    <p className="text-white/70 font-medium max-w-lg mx-auto">
                        This form is <strong className="text-white">only for Elite Royals</strong> — the trial session where the coaches put you through your paces and one player wins a scholarship. Here as a <strong className="text-white">Junior Royal</strong>? You don't need this form — just turn up at <strong className="text-white">{config.juniorTime}</strong> ready to have fun.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                                        {age !== null && !tooYoung && <p className="text-rr-charcoal/60 text-xs font-medium mt-1">Age: {age}</p>}
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
                                {tooYoung && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <p className="text-amber-700 text-sm font-semibold">Under 11? You're a Junior Royal! 🎉</p>
                                        <p className="text-amber-700/90 text-sm font-medium mt-1">The Elite Royals trial is for ages 11+. Younger players are very welcome as <strong>Junior Royals</strong> — just <strong>turn up at {config.juniorTime}</strong> for open play, fun and a hit with the coaches. No booking needed.</p>
                                    </div>
                                )}
                                <div>
                                    <label className={labelClass}>Suburb *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder={config.suburbPlaceholder} />
                                    {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
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

                        {/* Cricket background + skill set */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Cricket &amp; Skill Set</h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Current Club / Association</label>
                                        <input name="current_club" value={form.current_club} onChange={handleChange} className={inputClass('current_club')} placeholder={config.clubPlaceholder} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Current Level</label>
                                        <select name="current_grade" value={form.current_grade} onChange={handleChange} className={inputClass('current_grade')}>
                                            <option value="">Select</option>
                                            {GRADE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Primary Role *</label>
                                        <select name="primary_role" value={form.primary_role} onChange={handleChange} className={inputClass('primary_role')}>
                                            <option value="">Select</option>
                                            {ROLE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        {errors.primary_role && <p className="text-red-500 text-xs font-medium mt-1">{errors.primary_role}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Years Playing</label>
                                        <select name="years_playing" value={form.years_playing} onChange={handleChange} className={inputClass('years_playing')}>
                                            <option value="">Select</option>
                                            {YEARS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Batting Hand</label>
                                        <select name="batting_hand" value={form.batting_hand} onChange={handleChange} className={inputClass('batting_hand')}>
                                            <option value="">Select</option>
                                            {BAT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Bowling Type</label>
                                        <select name="bowling_type" value={form.bowling_type} onChange={handleChange} className={inputClass('bowling_type')}>
                                            <option value="">Select</option>
                                            {BOWL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Representative Honours / Anything else we should know</label>
                                    <textarea name="honours" value={form.honours} onChange={handleChange} rows={2} className={inputClass('honours')} placeholder="e.g. district rep U14, school 1st XI…" />
                                </div>
                            </div>
                        </div>

                        {/* Consent */}
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
                            <ComplianceCheckbox checked={acceptLiability} onChange={setAcceptLiability} error={errors.acceptLiability}>
                                I acknowledge that cricket activities carry inherent risks. I accept responsibility for the player's participation and release Rajasthan Royals Academy Melbourne and its staff from liability for injury, loss or damage, except to the extent caused by their negligence, and I consent to first aid or emergency treatment if required.
                            </ComplianceCheckbox>
                        </div>

                        {errors.form && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || tooYoung}
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
                                    Book My Elite Trial Spot
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                        <p className="text-center text-rr-charcoal/50 text-xs font-medium mt-4">Free to attend · spots are limited</p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default OpenDayForm;
