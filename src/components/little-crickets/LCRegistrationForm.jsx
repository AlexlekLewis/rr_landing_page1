import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const AGE_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 7); // 7–15

const STRIPE_LINKS = {
    bundoora: {
        'ages-7-9':   'https://buy.stripe.com/6oUdR96nv9SBgtS6fF9Zm0d',
        'ages-10-12': 'https://buy.stripe.com/3cI14neU15CldhGfQf9Zm0c',
        'ages-13-15': 'https://buy.stripe.com/4gM28r27f7Kt1yY5bB9Zm0b',
    },
    hallam: {
        'ages-7-9':   null, // TBC
        'ages-10-12': null, // TBC
        'ages-13-15': null, // TBC
    },
};

const SESSION_OPTIONS = {
    bundoora: {
        'ages-7-9': [
            { value: 'mon-6pm', label: 'Mondays 6:00pm – 7:00pm (from 27 Apr)' },
            { value: 'fri-6pm', label: 'Fridays 6:00pm – 7:00pm (from 1 May)' },
        ],
        'ages-10-12': [
            { value: 'mon-7pm', label: 'Mondays 7:00pm – 8:00pm (from 27 Apr)' },
            { value: 'fri-7pm', label: 'Fridays 7:00pm – 8:00pm (from 1 May)' },
        ],
        'ages-13-15': [
            { value: 'mon-6pm', label: 'Mondays 6:00pm – 7:00pm (from 27 Apr)' },
            { value: 'mon-7pm', label: 'Mondays 7:00pm – 8:00pm (from 27 Apr)' },
            { value: 'wed-6pm', label: 'Wednesdays 6:00pm – 7:00pm (from 29 Apr)' },
            { value: 'wed-7pm', label: 'Wednesdays 7:00pm – 8:00pm (from 29 Apr)' },
        ],
    },
    hallam: {
        'ages-7-9':   [{ value: 'tbc', label: 'TBC — Details Coming Soon' }],
        'ages-10-12': [{ value: 'tbc', label: 'TBC — Details Coming Soon' }],
        'ages-13-15': [{ value: 'tbc', label: 'TBC — Details Coming Soon' }],
    },
};

const SUPABASE_TABLE = {
    bundoora: 'junior_royals_bundoora',
    hallam:   'junior_royals_hallam',
};

const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source:   params.get('utm_source')   || null,
        utm_medium:   params.get('utm_medium')   || null,
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

const LCRegistrationForm = () => {
    const [submitting, setSubmitting] = useState(false);
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
        player_age: '',
        player_gender: '',
        suburb: '',
        location: '',
        group_selection: '',
        time_slot: '',
        requires_shirt: '',
    });

    const availableSessions =
        form.location && form.group_selection
            ? SESSION_OPTIONS[form.location]?.[form.group_selection] || []
            : [];

    const stripeLink =
        form.location && form.group_selection
            ? STRIPE_LINKS[form.location]?.[form.group_selection] || null
            : null;

    const isHallamNoStripe = form.location === 'hallam' && !stripeLink;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'location') {
            setForm(prev => ({ ...prev, location: value, group_selection: '', time_slot: '' }));
        } else if (name === 'group_selection') {
            setForm(prev => ({ ...prev, group_selection: value, time_slot: '' }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.parent_name.trim()) newErrors.parent_name = 'Parent name is required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) newErrors.parent_email = 'Valid email is required.';
        if (!form.parent_phone.trim()) newErrors.parent_phone = 'Phone number is required.';
        if (!form.player_name.trim()) newErrors.player_name = 'Player name is required.';
        if (!form.player_age) newErrors.player_age = 'Player age is required.';
        if (!form.player_gender) newErrors.player_gender = 'Please select a cricket type.';
        if (!form.suburb.trim()) newErrors.suburb = 'Suburb is required.';
        if (!form.location) newErrors.location = 'Please select a location.';
        if (!form.group_selection) newErrors.group_selection = 'Please select a group.';
        if (!form.time_slot) newErrors.time_slot = 'Please select a session time.';
        if (form.requires_shirt === '') newErrors.requires_shirt = 'Please indicate whether you require a training shirt.';
        if (!acceptTerms) newErrors.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptPlayerCode) newErrors.acceptPlayerCode = 'You must agree to the Player Code of Conduct.';
        if (!acceptParentCode) newErrors.acceptParentCode = 'You must agree to the Parent/Guardian Code of Conduct.';
        if (!acceptSocialMedia) newErrors.acceptSocialMedia = 'You must confirm your consent for social media use.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        try {
            const utmParams = getUTMParams();
            const table = SUPABASE_TABLE[form.location];

            const payload = {
                accept_terms: acceptTerms,
                accept_player_code: acceptPlayerCode,
                accept_parent_code: acceptParentCode,
                accept_social_media: acceptSocialMedia,
                parent_name: form.parent_name.trim(),
                parent_email: form.parent_email.trim(),
                parent_phone: form.parent_phone.trim(),
                player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10),
                player_gender: form.player_gender,
                suburb: form.suburb.trim(),
                location: form.location,
                group_selection: form.group_selection,
                time_slot: form.time_slot,
                requires_shirt: form.requires_shirt === 'yes',
                source: `junior-royals-${form.location}`,
                page_referrer: document.referrer || null,
                ...utmParams,
            };

            const { data, error: insertError } = await supabase
                .from(table)
                .insert([payload])
                .select('id')
                .single();

            if (insertError) throw insertError;

            // Secondary insert to applications (non-blocking)
            try {
                await supabase.from('applications').insert([{
                    first_name: form.player_name.trim().split(' ')[0],
                    last_name: form.player_name.trim().split(' ').slice(1).join(' '),
                    email: form.parent_email.trim(),
                    phone: form.parent_phone.trim(),
                    source: `junior-royals-${form.location}`,
                    program_type: 'Junior Royals',
                    ...utmParams,
                    page_referrer: document.referrer || null,
                }]);
            } catch (_) { /* non-blocking */ }

            // Store record ID for success page payment status update
            if (data?.id) {
                localStorage.setItem('jr_record_id', data.id);
                localStorage.setItem('jr_location', form.location);
            }

            // Redirect to Stripe or show holding message for Hallam
            if (stripeLink) {
                window.location.href = stripeLink;
            } else {
                // Hallam — no Stripe yet, show success
                window.location.href = '/junior-royals/success';
            }

        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email andy.crook@rramelbourne.com' });
            setSubmitting(false);
        }
    };

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
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Limited Spots — Term 2, 2026</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        SECURE YOUR <span className="text-rr-pink">PLACE</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Fill in your details below, and to ensure you secure your place, payment for your preferred program is required.
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
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Parent / Guardian Details</h3>
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
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Player Details</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Player Full Name *</label>
                                    <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass('player_name')} placeholder="e.g. Liam Smith" />
                                    {errors.player_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={inputClass('player_age')}>
                                            <option value="">Select age</option>
                                            {AGE_OPTIONS.map(age => (
                                                <option key={age} value={age}>{age} years old</option>
                                            ))}
                                        </select>
                                        {errors.player_age && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_age}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cricket Type *</label>
                                        <select name="player_gender" value={form.player_gender} onChange={handleChange} className={inputClass('player_gender')}>
                                            <option value="">Select</option>
                                            <option value="male">Male Cricket</option>
                                            <option value="female">Female Cricket</option>
                                        </select>
                                        {errors.player_gender && <p className="text-red-500 text-xs font-medium mt-1">{errors.player_gender}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Suburb Travelling From *</label>
                                    <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Bundoora" />
                                    {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Program Selection */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Program Selection</h3>
                            <div className="space-y-5">

                                <div>
                                    <label className={labelClass}>Location *</label>
                                    <select name="location" value={form.location} onChange={handleChange} className={inputClass('location')}>
                                        <option value="">Select a location</option>
                                        <option value="bundoora">Bundoora — Cutting Edge Cricket</option>
                                        <option value="hallam">Hallam — Venue TBC</option>
                                    </select>
                                    {errors.location && <p className="text-red-500 text-xs font-medium mt-1">{errors.location}</p>}
                                    {form.location === 'hallam' && (
                                        <p className="text-amber-600 text-xs font-medium mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                            Hallam session times are still being confirmed. We'll contact you with details once finalised.
                                        </p>
                                    )}
                                </div>

                                {form.location && (
                                    <div>
                                        <label className={labelClass}>Age Group *</label>
                                        <select name="group_selection" value={form.group_selection} onChange={handleChange} className={inputClass('group_selection')}>
                                            <option value="">Select an age group</option>
                                            <option value="ages-7-9">Ages 7–9 ($265)</option>
                                            <option value="ages-10-12">Ages 10–12 ($290)</option>
                                            <option value="ages-13-15">Ages 13–15 ($310)</option>
                                        </select>
                                        {errors.group_selection && <p className="text-red-500 text-xs font-medium mt-1">{errors.group_selection}</p>}
                                    </div>
                                )}

                                {form.location && form.group_selection && (
                                    <div>
                                        <label className={labelClass}>Session Time *</label>
                                        <select name="time_slot" value={form.time_slot} onChange={handleChange} className={inputClass('time_slot')}>
                                            <option value="">Select a time</option>
                                            {availableSessions.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        {errors.time_slot && <p className="text-red-500 text-xs font-medium mt-1">{errors.time_slot}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Compliance */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6">Agreements &amp; Consent</h3>
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode} error={errors.acceptPlayerCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode} error={errors.acceptParentCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                                I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                            </ComplianceCheckbox>
                        </div>

                        {/* Shirt notice + requirement dropdown */}
                        <div className="bg-rr-pink/5 border border-rr-pink/20 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-lg shrink-0">👕</span>
                                <p className="text-rr-charcoal text-sm font-medium leading-relaxed">
                                    <span className="font-black text-rr-dark">Royals training shirt required.</span> A Rajasthan Royals training shirt must be worn at all Junior Royals sessions. Shirts can be purchased as an addition to your registration.
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>Do you require a Rajasthan Royals Academy Training Shirt? *</label>
                                <select name="requires_shirt" value={form.requires_shirt} onChange={handleChange} className={inputClass('requires_shirt')}>
                                    <option value="">Select</option>
                                    <option value="yes">Yes — I need to purchase a shirt</option>
                                    <option value="no">No — I already have one</option>
                                </select>
                                {errors.requires_shirt && <p className="text-red-500 text-xs font-medium mt-1">{errors.requires_shirt}</p>}
                            </div>
                        </div>

                        {errors.form && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                            </div>
                        )}

                        {/* Submit button — label changes based on location */}
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
                                    {isHallamNoStripe ? 'Register Interest — Hallam' : form.location === 'bundoora' ? 'Register & Pay — Bundoora' : form.location === 'hallam' ? 'Register & Pay — Hallam' : 'Register & Pay'}
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

export default LCRegistrationForm;
