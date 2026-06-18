import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';

// Cricket skill options. Stored as plain text in the DB, so this list can be
// edited freely without a migration.
const SKILL_OPTIONS = [
    'Batting',
    'Pace Bowling',
    'Spin Bowling',
    'All-Rounder',
    'Wicket-Keeping',
    'Fielding',
];

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
    };
};

// program is passed from the page (defaults to a ?program= query param) so the
// same form/table is reusable across whatever programs get launched.
const ageFromDob = (dob) => {
    if (!dob) return '';
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
    return age >= 0 && age < 120 ? String(age) : '';
};

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

const InductionForm = ({ program = '' }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);

    const [form, setForm] = useState({
        player_name: '',
        parent_name: '',
        email: '',
        phone: '',
        dob: '',
        age: '',
        gender: '',
        suburb: '',
        club: '',
        primary_skill: '',
        secondary_skill: '',
        highest_level: '',
    });

    const validate = () => {
        const e = {};
        if (!form.player_name.trim()) e.player_name = 'Player name is required.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required.';
        if (!form.phone.trim()) e.phone = 'Phone number is required.';
        if (!form.dob) e.dob = 'Date of birth is required.';
        if (!form.suburb.trim()) e.suburb = 'Suburb is required.';
        if (!form.primary_skill) e.primary_skill = 'Please select a primary skill.';
        if (!acceptTerms) e.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleDob = (value) => {
        setForm((prev) => ({ ...prev, dob: value, age: ageFromDob(value) }));
        if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            const utm = getUTMParams();
            const payload = {
                program: program || null,
                player_name: form.player_name.trim(),
                parent_name: form.parent_name.trim() || null,
                email: form.email.trim(),
                phone: form.phone.trim(),
                dob: form.dob || null,
                player_age: form.age ? parseInt(form.age, 10) : null,
                gender: form.gender || null,
                suburb: form.suburb.trim() || null,
                club: form.club.trim() || null,
                primary_skill: form.primary_skill || null,
                secondary_skill: form.secondary_skill || null,
                highest_level: form.highest_level.trim() || null,
                accept_terms: acceptTerms,
                accept_marketing: acceptMarketing,
                source: 'induction',
                page_referrer: document.referrer || null,
                ...utm,
            };

            const { error: insertError } = await supabase
                .from('program_inductions')
                .insert([payload]);

            if (insertError) throw insertError;

            setSubmitted(true);
            window.scrollTo({ top: document.getElementById('registration-form')?.offsetTop - 80 || 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Induction submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or email info@rramelbourne.com.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section id="registration-form" className="py-24 bg-rr-dark">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-12 text-center"
                    >
                        <div className="text-6xl mb-6">🏏</div>
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">
                            YOU'RE IN
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Thanks <strong>{form.player_name.split(' ')[0]}</strong> — your details are locked in. We'll be in touch at <strong>{form.email}</strong> with the next steps.
                        </p>
                        <p className="text-rr-charcoal/70 text-sm font-medium">
                            Questions? Email us at{' '}
                            <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                info@rramelbourne.com
                            </a>
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    const inputClass = (field) =>
        `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;

    const labelClass = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section id="registration-form" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Player Induction</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        REGISTER YOUR <span className="text-rr-pink">DETAILS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        A couple of minutes to get you on the radar. We'll be in touch with everything you need to know.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-8 md:p-10"
                >
                    <form onSubmit={handleSubmit} noValidate>

                        {/* Player Details */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Player Details
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Sam Taylor" />
                                    {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                                </div>

                                <DateOfBirthInput value={form.dob} onChange={handleDob} required />
                                {errors.dob && <p className="text-red-500 text-xs font-medium -mt-4 mb-2">{errors.dob}</p>}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Age</label>
                                        <input name="age" type="number" min="3" max="99" value={form.age} onChange={handleChange} className={inputClass('age')} placeholder="Auto from DOB" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Gender</label>
                                        <select name="gender" value={form.gender} onChange={handleChange} className={inputClass('gender')}>
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other / Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Suburb *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Tarneit" />
                                    {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Current / Most Recent Club</label>
                                    <input name="club" value={form.club} onChange={handleChange} className={inputClass('club')} placeholder="e.g. Werribee Cricket Club" />
                                </div>
                            </div>
                        </div>

                        {/* Cricket Profile */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Cricket Profile
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Primary Skill *</label>
                                        <select name="primary_skill" value={form.primary_skill} onChange={handleChange} className={inputClass('primary_skill')}>
                                            <option value="">Select primary skill</option>
                                            {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.primary_skill && <p className="text-red-500 text-xs font-medium mt-1">{errors.primary_skill}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Secondary Skill</label>
                                        <select name="secondary_skill" value={form.secondary_skill} onChange={handleChange} className={inputClass('secondary_skill')}>
                                            <option value="">Select secondary skill</option>
                                            {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Highest Level of Cricket Played</label>
                                    <textarea name="highest_level" value={form.highest_level} onChange={handleChange} rows={2} className={inputClass('highest_level')} placeholder="e.g. Premier Cricket 2nds, Victorian U16 squad, local U14 division 1..." />
                                    <p className="text-slate-400 text-xs font-medium mt-1">In your own words — grade, rep team, school 1sts, whatever best describes it.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Contact Details
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Parent / Guardian Name</label>
                                    <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass('parent_name')} placeholder="If the player is under 18" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Email *</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="e.g. you@email.com" />
                                        {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone *</label>
                                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="e.g. 0412 345 678" />
                                        {errors.phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I have read and agree to the{' '}
                                <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}
                                and{' '}
                                <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>,
                                and confirm the details above are accurate.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptMarketing} onChange={setAcceptMarketing}>
                                Keep me updated about upcoming Rajasthan Royals Academy Melbourne programs and opportunities. <span className="text-slate-400">(optional)</span>
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
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Complete Induction
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

export default InductionForm;
