import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const LEVEL_OPTIONS = [
    'Junior / local club',
    'Senior club (sub-district / turf)',
    'District / Premier Cricket',
    'State / representative',
    'First class / professional',
    'Other',
];

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
    };
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

const CoachesDayForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [form, setForm] = useState({
        coach_name: '',
        email: '',
        phone: '',
        playing_history: '',
        highest_level: '',
        coaching_roles: '',
        love_coaching: '',
        hope_to_learn: '',
    });

    const validate = () => {
        const e = {};
        if (!form.coach_name.trim()) e.coach_name = 'Please tell us your name.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required.';
        if (!form.phone.trim()) e.phone = 'A phone number is required.';
        if (!form.coaching_roles.trim()) e.coaching_roles = 'Let us know where you currently coach.';
        if (!acceptTerms) e.acceptTerms = 'Please agree so we can hold your spot.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            const utm = getUTMParams();
            const payload = {
                coach_name: form.coach_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                playing_history: form.playing_history.trim() || null,
                highest_level: form.highest_level || null,
                coaching_roles: form.coaching_roles.trim() || null,
                love_coaching: form.love_coaching.trim() || null,
                hope_to_learn: form.hope_to_learn.trim() || null,
                accept_terms: acceptTerms,
                source: 'coaches-day',
                page_referrer: document.referrer || null,
                ...utm,
            };

            const { error: insertError } = await supabase
                .from('coaches_day_registrations')
                .insert([payload]);

            if (insertError) throw insertError;

            setSubmitted(true);
            window.scrollTo({ top: (document.getElementById('registration-form')?.offsetTop || 80) - 80, behavior: 'smooth' });
        } catch (err) {
            console.error('Coaches Day submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or email coaches@rramelbourne.com.' });
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
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">
                            You Are In
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Thanks <strong>{form.coach_name.split(' ')[0]}</strong>, your spot is held. I am genuinely looking forward to spending the afternoon with you on <strong>Sunday 26 July</strong>. We will send everything you need to <strong>{form.email}</strong> before the day.
                        </p>
                        <p className="text-rr-charcoal/70 text-sm font-medium">
                            Anything in the meantime, email{' '}
                            <a href="mailto:coaches@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                coaches@rramelbourne.com
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
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Save Your Spot</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        Come And <span className="text-rr-pink">Join Us</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Tell us a little about yourself and your coaching. It helps us shape the afternoon around the people in the room.
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

                        {/* About you */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                About You
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input name="coach_name" value={form.coach_name} onChange={handleChange} className={inputClass('coach_name')} placeholder="e.g. Alex Lewis" />
                                    {errors.coach_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.coach_name}</p>}
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

                        {/* Your cricket */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Your Cricket
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>A Little About Your Playing History</label>
                                    <textarea name="playing_history" value={form.playing_history} onChange={handleChange} rows={2} className={inputClass('playing_history')} placeholder="Where you played, the clubs you turned out for, anything you are proud of." />
                                </div>
                                <div>
                                    <label className={labelClass}>Highest Level You Played</label>
                                    <select name="highest_level" value={form.highest_level} onChange={handleChange} className={inputClass('highest_level')}>
                                        <option value="">Select the closest fit</option>
                                        {LEVEL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Where Do You Currently Coach? *</label>
                                    <textarea name="coaching_roles" value={form.coaching_roles} onChange={handleChange} rows={2} className={inputClass('coaching_roles')} placeholder="e.g. Under 14s at my local club, school first XI, private one on one." />
                                    {errors.coaching_roles && <p className="text-red-500 text-xs font-medium mt-1">{errors.coaching_roles}</p>}
                                </div>
                            </div>
                        </div>

                        {/* The good stuff */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                In Your Words
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>What Do You Love About Coaching?</label>
                                    <textarea name="love_coaching" value={form.love_coaching} onChange={handleChange} rows={2} className={inputClass('love_coaching')} placeholder="The bit that keeps you coming back." />
                                </div>
                                <div>
                                    <label className={labelClass}>What Do You Hope To Take From The Day?</label>
                                    <textarea name="hope_to_learn" value={form.hope_to_learn} onChange={handleChange} rows={2} className={inputClass('hope_to_learn')} placeholder="Tell us what would make the afternoon worth your while." />
                                </div>
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I am happy to attend and for the Rajasthan Royals Academy Melbourne to contact me about this event. See our{' '}
                                <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}
                                and{' '}
                                <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
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
                                    Saving Your Spot...
                                </>
                            ) : (
                                <>
                                    Save My Spot
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

export default CoachesDayForm;
