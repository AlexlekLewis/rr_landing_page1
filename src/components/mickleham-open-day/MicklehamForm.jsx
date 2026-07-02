import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const SOURCE_TAG = 'mickleham-open-day';

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
        <label className="flex items-start gap-3 cursor-pointer group">
            <div
                onClick={() => onChange(!checked)}
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

const MicklehamForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

    const [form, setForm] = useState({
        player_name: '', player_dob: '', player_gender: '',
        parent_name: '', parent_email: '', parent_phone: '', suburb: '',
        current_club: '', current_grade: '', years_playing: '',
        primary_role: '', batting_hand: '', bowling_type: '', honours: '',
    });

    const age = ageFromDob(form.player_dob);
    const tooYoung = age !== null && age < 12;

    const validate = () => {
        const e = {};
        if (!form.player_name.trim()) e.player_name = 'Player name is required.';
        if (!form.player_dob) e.player_dob = 'Date of birth is required.';
        else if (tooYoung) e.player_dob = 'The Elite trial is for players turning 12 and over.';
        if (!form.player_gender) e.player_gender = 'Please select an option.';
        if (!form.parent_name.trim()) e.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) e.parent_phone = 'Phone number is required.';
        if (!form.suburb.trim()) e.suburb = 'Suburb is required.';
        if (!form.primary_role) e.primary_role = 'Please select a role.';
        if (!acceptTerms) e.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptSocialMedia) e.acceptSocialMedia = 'You must confirm photo/media consent.';
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
                .from('mickleham_open_day_registrations')
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
                    session: 'elite-trial-1030-1200',
                    accept_terms: acceptTerms,
                    accept_social_media: acceptSocialMedia,
                    source: SOURCE_TAG,
                    page_referrer: document.referrer || null,
                    ...utm,
                }]);
            if (insertError) throw insertError;
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Mickleham open day submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or email eliteprogram@rramelbourne.com' });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        const firstName = (form.player_name || '').trim().split(' ')[0] || 'You';
        const InfoPanel = ({ icon, title, delay, children }) => (
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay }}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm"
            >
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                    </div>
                    <div className="w-full">
                        <p className="text-sm font-bold text-white/90 mb-2">{title}</p>
                        {children}
                    </div>
                </div>
            </motion.div>
        );

        return (
            <section id="register" className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-rr-dark text-white selection:bg-rr-pink selection:text-white">

                {/* Background gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-rr-navy/60 blur-[80px]" />
                </div>

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="relative z-10 min-h-full flex flex-col justify-center max-w-2xl w-full mx-auto text-center px-6 py-16">

                    {/* Logo */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="mb-8">
                        <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-14 md:h-16 mx-auto brightness-0 invert" />
                    </motion.div>

                    {/* Tick medallion */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }} className="flex items-center justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-rr-pink/20 animate-ping scale-110" />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shadow-[0_0_48px_rgba(225,31,143,0.4)]">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }} className="mb-4">
                        <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">Registration Confirmed</p>
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
                            YOU'RE{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">IN.</span>
                        </h2>
                    </motion.div>

                    {/* Divider */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }} className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mx-auto my-8" />

                    {/* Welcome + body */}
                    <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }} className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed mb-6">
                        You're booked into the Elite Trial.
                    </motion.p>
                    <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }} className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto font-medium">
                        Thanks <span className="text-white font-bold">{firstName}</span> — you're registered to trial for the <span className="text-white font-bold">Elite Program</span> (our Power Game Pre-Season) at the Mickleham Open Day. Come ready to show us what you've got.
                    </motion.p>

                    {/* Your session */}
                    <InfoPanel delay={0.55} title="Your Session" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                        <p className="text-sm text-white font-bold mb-1">Sunday 5 July · 10:30am – 12:00pm</p>
                        <p className="text-sm text-white/60 leading-relaxed">Mickleham Indoor Sports Centre · 3 Eclipse Drive, Mickleham VIC 3064</p>
                    </InfoPanel>

                    {/* What to bring */}
                    <InfoPanel delay={0.6} title="What to Bring" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                        <ul className="text-sm text-white/60 leading-relaxed space-y-1">
                            <li>• Please arrive <span className="text-white font-bold">10–15 minutes early</span> in cricket gear</li>
                            <li>• Bring your own bat if you have one</li>
                            <li>• A drink bottle and water</li>
                        </ul>
                    </InfoPanel>

                    {/* What happens next */}
                    <InfoPanel delay={0.65} title="What Happens Next" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                        <p className="text-sm text-white/70 leading-relaxed mb-2">
                            We'll confirm by email at <span className="font-bold text-white">{form.parent_email}</span>, and our team will be in touch before the day with everything you need to know.
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Please check your inbox — including your <span className="font-bold text-white/80">junk, spam and promotions folders</span> — as our confirmation can be filtered.
                        </p>
                    </InfoPanel>

                    {/* Questions */}
                    <InfoPanel delay={0.7} title="Questions?" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                        <p className="text-sm text-white/60 leading-relaxed">
                            Reach our team at{' '}
                            <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-pink font-bold hover:underline">eliteprogram@rramelbourne.com</a>
                        </p>
                    </InfoPanel>

                    {/* CTA */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.75 }} className="mt-10">
                        <a
                            href="/"
                            className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] group"
                        >
                            Back to Home
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Stamp */}
                    <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.85 }} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">
                        HALLA BOL
                    </motion.p>

                </div>
            </section>
        );
    }

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section id="register" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Elite Trial · 10:30am–12:00pm · Ages 12+</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        Register for the <span className="text-rr-pink">Elite Trial</span>
                    </h2>
                    <p className="text-white/70 font-medium max-w-lg mx-auto">
                        Registering here is <strong className="text-white">specifically to trial for the Elite Program</strong> — our Power Game Pre-Season. Here for <strong className="text-white">Junior Royals</strong>? You don't need this form — just turn up between 9:00–10:30am ready to have fun.
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
                                        <p className="text-amber-700 text-sm font-semibold">Under 12? No need to register! 🎉</p>
                                        <p className="text-amber-700/90 text-sm font-medium mt-1">The Elite trial is for ages 12+. Younger players are very welcome to just <strong>turn up between 9:00–10:30am</strong> for open play, fun and a hit with the coaches.</p>
                                    </div>
                                )}
                                <div>
                                    <label className={labelClass}>Suburb *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Craigieburn" />
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
                                        <input name="current_club" value={form.current_club} onChange={handleChange} className={inputClass('current_club')} placeholder="e.g. Craigieburn CC" />
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
                                    <textarea name="honours" value={form.honours} onChange={handleChange} rows={2} className={inputClass('honours')} placeholder="e.g. Hume rep U14, school 1st XI…" />
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

export default MicklehamForm;
