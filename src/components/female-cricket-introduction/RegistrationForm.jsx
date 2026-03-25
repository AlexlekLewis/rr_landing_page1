import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const SOURCE_TAG = 'girls-kickstart';

const AGE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 7); // 7–18

const EXPERIENCE_OPTIONS = [
    { value: 'none', label: 'No experience — brand new to cricket' },
    { value: 'minimal', label: 'Minimal — played once or twice' },
    { value: 'some', label: 'Some — played at school or informally' },
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

const RegistrationForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

    const [form, setForm] = useState({
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        player_name: '',
        player_dob: '',
        player_age: '',
        suburb: '',
        location: '',
        experience: '',
    });

    const validate = () => {
        const newErrors = {};
        if (!form.parent_name.trim()) newErrors.parent_name = 'Parent/guardian name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) newErrors.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) newErrors.parent_phone = 'Phone number is required.';
        if (!form.player_name.trim()) newErrors.player_name = 'Player name is required.';
        if (!form.player_dob) newErrors.player_dob = 'Date of birth is required.';
        if (!form.suburb.trim()) newErrors.suburb = 'Suburb is required.';
        if (!form.location) newErrors.location = 'Please select a location.';
        if (!form.experience) newErrors.experience = 'Please select a cricket experience level.';
        if (!acceptTerms) newErrors.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptPlayerCode) newErrors.acceptPlayerCode = 'You must agree to the Player Code of Conduct.';
        if (!acceptParentCode) newErrors.acceptParentCode = 'You must agree to the Parent/Guardian Code of Conduct.';
        if (!acceptSocialMedia) newErrors.acceptSocialMedia = 'You must confirm your consent for social media use.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            const utmParams = getUTMParams();

            const payload = {
                // Source tag — critical for filtering in /rramadmin_26/ dashboard
                source: SOURCE_TAG,
                program: 'Girls Kickstart Program — Introduction to Cricket',

                // Parent / Guardian (mapped to applications table columns)
                parent1_name: form.parent_name.trim(),
                parent1_email: form.parent_email.trim(),
                parent1_phone: form.parent_phone.trim(),

                // Player (mapped to applications table columns)
                first_name: form.player_name.trim(),
                dob: form.player_dob || null,
                suburb: form.suburb.trim(),

                // Program-specific
                location: form.location,
                experience_level: form.experience,
                player_gender: 'female',
                program_type: 'female-intro',

                // Compliance
                accept_terms: acceptTerms,
                accept_player_code: acceptPlayerCode,
                accept_parent_code: acceptParentCode,
                accept_social_media: acceptSocialMedia,

                // Analytics
                page_referrer: document.referrer || null,
                ...utmParams,
            };

            const { error: insertError } = await supabase
                .from('applications')
                .insert([payload]);

            if (insertError) throw insertError;

            // Send to Zapier webhook (flows to Google Sheet) — fire-and-forget
            // Uses URLSearchParams to avoid CORS preflight (no OPTIONS request)
            const webhookData = new URLSearchParams({
                parent_name: payload.parent1_name,
                parent_email: payload.parent1_email,
                parent_phone: payload.parent1_phone,
                player_name: payload.first_name,
                player_dob: payload.dob || '',
                suburb: payload.suburb,
                location: payload.location,
                experience_level: payload.experience_level,
                program: payload.program,
                source: payload.source,
                submitted_at: new Date().toISOString(),
            });
            fetch('https://hooks.zapier.com/hooks/catch/23705820/upvtk83/', {
                method: 'POST',
                body: webhookData,
            }).catch(() => {});

            // Redirect to Stripe checkout — only fires after successful data save
            window.location.href = 'https://buy.stripe.com/aFa28r5jr2q92D26fF9Zm09';
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email femalecricket@rramelbourne.com' });
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
                            YOU'RE REGISTERED!
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Thank you for registering for the <strong>Girls Kickstart Program</strong>. We'll be in touch at <strong>{form.parent_email}</strong> with program dates, times, and everything you need to know before the first session.
                        </p>
                        <p className="text-rr-charcoal/70 text-sm font-medium">
                            Questions? Email us at{' '}
                            <a href="mailto:femalecricket@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                femalecricket@rramelbourne.com
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
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Girls Kickstart Program · Limited Spots</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        REGISTER YOUR <span className="text-rr-pink">DAUGHTER</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Fill in your details below. We'll confirm session dates and payment once the program schedule is finalised.
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

                        {/* Parent / Guardian */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Parent / Guardian Details
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass('parent_name')} placeholder="e.g. Jane Smith" />
                                    {errors.parent_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address *</label>
                                    <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass('parent_email')} placeholder="e.g. jane@email.com" />
                                    {errors.parent_email && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_email}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number *</label>
                                    <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={inputClass('parent_phone')} placeholder="e.g. 0412 345 678" />
                                    {errors.parent_phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.parent_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Player Details */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Player Details
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Player Full Name *</label>
                                    <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Sophie Smith" />
                                    {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Date of Birth *</label>
                                    <input name="player_dob" type="date" value={form.player_dob} onChange={handleChange} className={inputClass('player_dob')} />
                                    {errors.player_dob && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_dob}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Suburb Travelling From *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Doncaster East" />
                                    {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Cricket Experience *</label>
                                    <select name="experience" value={form.experience} onChange={handleChange} className={inputClass('experience')}>
                                        <option value="">Select experience level</option>
                                        {EXPERIENCE_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                    {errors.experience && <p className="text-red-500 text-xs font-medium mt-1">{errors.experience}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Location Selection */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                                Location Preference
                            </h3>
                            <div>
                                <label className={labelClass}>Preferred Location *</label>
                                <select name="location" value={form.location} onChange={handleChange} className={inputClass('location')}>
                                    <option value="">Select a location</option>
                                    <option value="bundoora">Bundoora Indoor Sports Centre — Northern Melbourne</option>
                                    <option value="hallam">Hallam — South-Eastern Melbourne</option>
                                </select>
                                {errors.location && <p className="text-red-500 text-xs font-medium mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        {/* Compliance */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6">
                                Agreements &amp; Consent
                            </h3>
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I have read and agree to the{' '}
                                <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a>{' '}
                                and{' '}
                                <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
                                I confirm all information provided is accurate.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode} error={errors.acceptPlayerCode}>
                                I have read, understood, and agree to the{' '}
                                <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode} error={errors.acceptParentCode}>
                                I have read, understood, and agree to the{' '}
                                <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                                I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                            </ComplianceCheckbox>
                        </div>

                        {/* Form-level error */}
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
                                    Proceed to Checkout
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

export default RegistrationForm;
