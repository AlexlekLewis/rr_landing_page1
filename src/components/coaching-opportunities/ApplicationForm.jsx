import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const SOURCE_TAG = 'careers';

const ROLE_INTEREST_OPTIONS = [
    { value: 'cricket-coach', label: 'Cricket Coach' },
    { value: 'junior-assistant-coach', label: 'Junior / Assistant Coach' },
    { value: 'operations-admin', label: 'Operations & Admin' },
    { value: 'media-content', label: 'Media & Content' },
    { value: 'other', label: 'Other / Pitch Us' },
];

const ENGAGEMENT_TYPE_OPTIONS = [
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'work-experience', label: 'Work Experience' },
    { value: 'casual', label: 'Casual' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'full-time', label: 'Full-Time' },
];

const COACHING_ROLES = ['cricket-coach', 'junior-assistant-coach'];

const EMPLOYMENT_OPTIONS = [
    { value: 'full-time', label: 'Employed full-time' },
    { value: 'part-time', label: 'Employed part-time' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'student', label: 'Student' },
    { value: 'looking', label: 'Looking for work' },
];

const WWC_OPTIONS = [
    { value: 'current', label: 'Yes — current' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'no', label: 'No — not yet applied' },
];

const REFERRAL_OPTIONS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'word-of-mouth', label: 'Word of mouth' },
    { value: 'royals-network', label: 'Royals network' },
    { value: 'other', label: 'Other' },
];

const TIER_OPTIONS = [
    { value: 'elite', label: 'Elite Program' },
    { value: 'junior-royals', label: 'Junior Royals' },
    { value: 'either', label: 'Either — happy to be placed' },
];

const PLAYING_LEVEL_OPTIONS = [
    { value: 'junior-club', label: 'Junior club' },
    { value: 'senior-club', label: 'Senior club' },
    { value: 'premier-sub-district', label: 'Premier or Sub-District' },
    { value: 'state-2nd-xi', label: 'State 2nd XI' },
    { value: 'first-class', label: 'First-class' },
    { value: 'international', label: 'International' },
];

const DISCIPLINE_OPTIONS = [
    { value: 'batting', label: 'Batting' },
    { value: 'pace-bowling', label: 'Pace bowling' },
    { value: 'spin-bowling', label: 'Spin bowling' },
    { value: 'all-rounder', label: 'All-rounder' },
    { value: 'wicketkeeper', label: 'Wicketkeeper' },
];

const ACCREDITATION_OPTIONS = [
    { value: 'none', label: 'None yet' },
    { value: 'foundation', label: 'Cricket Australia Foundation' },
    { value: 'level-1', label: 'Level 1 Community' },
    { value: 'level-2', label: 'Level 2 Representative' },
    { value: 'level-3', label: 'Level 3 High Performance' },
];

const AGE_GROUP_OPTIONS = [
    { value: 'u10', label: 'Under 10s' },
    { value: 'u12', label: 'Under 12s' },
    { value: 'u14', label: 'Under 14s' },
    { value: 'u16', label: 'Under 16s' },
    { value: 'u18', label: 'Under 18s' },
    { value: 'adults', label: 'Adults' },
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

const ApplicationForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptAccuracy, setAcceptAccuracy] = useState(false);
    const [acceptContact, setAcceptContact] = useState(false);

    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        suburb: '',
        age: '',
        employment_status: '',
        linkedin_url: '',
        wwc_status: '',
        referral_source: '',
        preferred_tier: '',
        highest_playing_level: '',
        years_playing: '',
        current_club: '',
        specialist_discipline: '',
        cricket_cv: '',
        coaching_accreditation: '',
        years_coaching: '',
        coaching_cv: '',
        goals_ambitions: '',
        cv_resume_url: '',
    });

    const [ageGroups, setAgeGroups] = useState([]);
    const [roleInterest, setRoleInterest] = useState([]);
    const [engagementTypes, setEngagementTypes] = useState([]);

    const isCoachingApplicant = roleInterest.some(r => COACHING_ROLES.includes(r));

    const toggleAgeGroup = (val) => {
        setAgeGroups(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    const toggleRoleInterest = (val) => {
        setRoleInterest(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
        setErrors(prev => ({ ...prev, roleInterest: undefined }));
    };

    const toggleEngagementType = (val) => {
        setEngagementTypes(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
        setErrors(prev => ({ ...prev, engagementTypes: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.full_name.trim()) newErrors.full_name = 'Full name is required.';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required.';
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
        if (!form.suburb.trim()) newErrors.suburb = 'Suburb is required.';
        if (!form.age || isNaN(Number(form.age))) newErrors.age = 'Age is required.';
        if (!form.employment_status) newErrors.employment_status = 'Please select your employment status.';
        if (!form.wwc_status) newErrors.wwc_status = 'Please select your WWC status.';
        if (!roleInterest.length) newErrors.roleInterest = 'Please select at least one area of interest.';
        if (!engagementTypes.length) newErrors.engagementTypes = 'Please select at least one engagement type.';
        if (isCoachingApplicant && !form.preferred_tier) newErrors.preferred_tier = 'Please select your preferred coaching stream.';
        if (!acceptAccuracy) newErrors.acceptAccuracy = 'Please confirm the information is accurate.';
        if (!acceptContact) newErrors.acceptContact = 'Please agree to be contacted.';
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
        if (!validate()) {
            // Scroll to first error
            setTimeout(() => {
                const firstError = document.querySelector('[data-error="true"]');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }
        setSubmitting(true);

        try {
            const utmParams = getUTMParams();

            const payload = {
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                suburb: form.suburb.trim(),
                age: form.age ? parseInt(form.age, 10) : null,
                employment_status: form.employment_status,
                linkedin_url: form.linkedin_url.trim() || null,
                wwc_status: form.wwc_status,
                referral_source: form.referral_source || null,
                role_interest: roleInterest,
                engagement_types: engagementTypes,
                preferred_tier: isCoachingApplicant ? form.preferred_tier : null,
                highest_playing_level: form.highest_playing_level || null,
                years_playing: form.years_playing ? parseInt(form.years_playing, 10) : null,
                current_club: form.current_club.trim() || null,
                specialist_discipline: form.specialist_discipline || null,
                cricket_cv: form.cricket_cv.trim() || null,
                coaching_accreditation: form.coaching_accreditation || null,
                years_coaching: form.years_coaching ? parseInt(form.years_coaching, 10) : null,
                age_groups_coached: ageGroups.length ? ageGroups : null,
                coaching_cv: form.coaching_cv.trim() || null,
                goals_ambitions: form.goals_ambitions.trim() || null,
                cv_resume_url: form.cv_resume_url.trim() || null,
                accept_accuracy: acceptAccuracy,
                accept_contact: acceptContact,
                source: SOURCE_TAG,
                page_referrer: document.referrer || null,
                ...utmParams,
            };

            const { error: insertError } = await supabase
                .from('coaching_opportunities_applications')
                .insert([payload]);

            if (insertError) throw insertError;

            // Secondary insert into applications table (non-blocking)
            try {
                const nameParts = form.full_name.trim().split(' ');
                await supabase.from('applications').insert([{
                    first_name: nameParts[0] || '',
                    last_name: nameParts.slice(1).join(' ') || '',
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    source: SOURCE_TAG,
                    program: 'Careers',
                    program_type: 'careers',
                    suburb: form.suburb.trim(),
                    page_referrer: document.referrer || null,
                    ...utmParams,
                }]);
            } catch (_) { /* non-blocking */ }

            setSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email andy.crook@rramelbourne.com.' });
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
                        <h2 className="text-3xl font-black text-rr-dark uppercase tracking-wide mb-4">
                            APPLICATION RECEIVED
                        </h2>
                        <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Thanks <strong>{form.full_name.split(' ')[0]}</strong> — your application has been received. Our leadership team personally reviews every application and will be in touch within 5 business days at <strong>{form.email}</strong>.
                        </p>
                        <p className="text-rr-charcoal/70 text-sm font-medium">
                            Questions in the meantime? Email{' '}
                            <a href="mailto:andy.crook@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                andy.crook@rramelbourne.com
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
    const helperClass = 'text-xs text-rr-charcoal/60 font-medium mt-1';
    const sectionHeading = 'text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100';

    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Apply Now</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4"
                    >
                        REGISTER YOUR <span className="text-rr-pink">INTEREST</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium"
                    >
                        Tell us about yourself. Our leadership team personally reviews every application.
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
                        {/* Personal & Contact */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Personal & Contact</h3>
                            <div className="space-y-5">
                                <div data-error={!!errors.full_name}>
                                    <label className={labelClass}>Full Name *</label>
                                    <input name="full_name" value={form.full_name} onChange={handleChange} className={inputClass('full_name')} placeholder="e.g. Sam Patel" />
                                    {errors.full_name && <p className="text-red-500 text-xs font-medium mt-1">{errors.full_name}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div data-error={!!errors.email}>
                                        <label className={labelClass}>Email *</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="you@email.com" />
                                        {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                                    </div>
                                    <div data-error={!!errors.phone}>
                                        <label className={labelClass}>Phone *</label>
                                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="0412 345 678" />
                                        {errors.phone && <p className="text-red-500 text-xs font-medium mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div data-error={!!errors.suburb}>
                                        <label className={labelClass}>Suburb *</label>
                                        <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass('suburb')} placeholder="e.g. Bundoora" />
                                        {errors.suburb && <p className="text-red-500 text-xs font-medium mt-1">{errors.suburb}</p>}
                                    </div>
                                    <div data-error={!!errors.age}>
                                        <label className={labelClass}>Age *</label>
                                        <input name="age" type="number" min="16" max="99" value={form.age} onChange={handleChange} className={inputClass('age')} placeholder="e.g. 28" />
                                        {errors.age && <p className="text-red-500 text-xs font-medium mt-1">{errors.age}</p>}
                                    </div>
                                </div>
                                <div data-error={!!errors.employment_status}>
                                    <label className={labelClass}>Current Employment Status *</label>
                                    <select name="employment_status" value={form.employment_status} onChange={handleChange} className={inputClass('employment_status')}>
                                        <option value="">Select an option</option>
                                        {EMPLOYMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    {errors.employment_status && <p className="text-red-500 text-xs font-medium mt-1">{errors.employment_status}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>LinkedIn Profile URL <span className="normal-case font-medium text-rr-charcoal">(optional)</span></label>
                                    <input name="linkedin_url" value={form.linkedin_url} onChange={handleChange} className={inputClass('linkedin_url')} placeholder="https://linkedin.com/in/yourname" />
                                </div>
                                <div data-error={!!errors.wwc_status}>
                                    <label className={labelClass}>Working With Children Check (VIC) Status *</label>
                                    <select name="wwc_status" value={form.wwc_status} onChange={handleChange} className={inputClass('wwc_status')}>
                                        <option value="">Select an option</option>
                                        {WWC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    {errors.wwc_status && <p className="text-red-500 text-xs font-medium mt-1">{errors.wwc_status}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>How did you hear about this opportunity?</label>
                                    <select name="referral_source" value={form.referral_source} onChange={handleChange} className={inputClass('referral_source')}>
                                        <option value="">Select an option</option>
                                        {REFERRAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Role & Availability */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Role & Availability</h3>
                            <div className="space-y-6">
                                <div data-error={!!errors.roleInterest}>
                                    <label className={labelClass}>Which area interests you? * <span className="normal-case font-medium text-rr-charcoal">(select all that apply)</span></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {ROLE_INTEREST_OPTIONS.map(o => {
                                            const checked = roleInterest.includes(o.value);
                                            return (
                                                <button
                                                    type="button"
                                                    key={o.value}
                                                    onClick={() => toggleRoleInterest(o.value)}
                                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${checked ? 'bg-rr-pink text-white border-2 border-rr-pink' : 'bg-slate-50 text-rr-charcoal border-2 border-slate-200 hover:border-rr-pink/50'}`}
                                                >
                                                    {o.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.roleInterest && <p className="text-red-500 text-xs font-medium mt-2">{errors.roleInterest}</p>}
                                </div>
                                <div data-error={!!errors.engagementTypes}>
                                    <label className={labelClass}>What kind of engagement are you looking for? * <span className="normal-case font-medium text-rr-charcoal">(select all that apply)</span></label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {ENGAGEMENT_TYPE_OPTIONS.map(o => {
                                            const checked = engagementTypes.includes(o.value);
                                            return (
                                                <button
                                                    type="button"
                                                    key={o.value}
                                                    onClick={() => toggleEngagementType(o.value)}
                                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${checked ? 'bg-rr-pink text-white border-2 border-rr-pink' : 'bg-slate-50 text-rr-charcoal border-2 border-slate-200 hover:border-rr-pink/50'}`}
                                                >
                                                    {o.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.engagementTypes && <p className="text-red-500 text-xs font-medium mt-2">{errors.engagementTypes}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Preferred Tier — coaching applicants only */}
                        {isCoachingApplicant && (
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Preferred Coaching Stream</h3>
                            <div data-error={!!errors.preferred_tier}>
                                <label className={labelClass}>Which stream are you most interested in? *</label>
                                <select name="preferred_tier" value={form.preferred_tier} onChange={handleChange} className={inputClass('preferred_tier')}>
                                    <option value="">Select an option</option>
                                    {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <p className={helperClass}>This is a preference, not binding. Final placement is decided in conversation.</p>
                                {errors.preferred_tier && <p className="text-red-500 text-xs font-medium mt-1">{errors.preferred_tier}</p>}
                            </div>
                        </div>
                        )}

                        {/* Cricket CV — coaching applicants only */}
                        {isCoachingApplicant && (
                        <div className="mb-8">
                            <h3 className={sectionHeading}>Cricket CV</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Highest Playing Level</label>
                                    <select name="highest_playing_level" value={form.highest_playing_level} onChange={handleChange} className={inputClass('highest_playing_level')}>
                                        <option value="">Select an option</option>
                                        {PLAYING_LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelClass}>Years of Playing Experience</label>
                                        <input name="years_playing" type="number" min="0" max="60" value={form.years_playing} onChange={handleChange} className={inputClass('years_playing')} placeholder="e.g. 12" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Current / Most Recent Club</label>
                                        <input name="current_club" value={form.current_club} onChange={handleChange} className={inputClass('current_club')} placeholder="e.g. Northcote CC" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Specialist Discipline</label>
                                    <select name="specialist_discipline" value={form.specialist_discipline} onChange={handleChange} className={inputClass('specialist_discipline')}>
                                        <option value="">Select an option</option>
                                        {DISCIPLINE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Brief Cricket CV / Playing Highlights</label>
                                    <textarea name="cricket_cv" value={form.cricket_cv} onChange={handleChange} maxLength={1000} rows={4} className={inputClass('cricket_cv')} placeholder="Tell us about your playing background — clubs, levels, highlights, key moments." />
                                    <p className={helperClass}>{form.cricket_cv.length}/1000</p>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Experience & Ambitions */}
                        <div className="mb-8">
                            <h3 className={sectionHeading}>{isCoachingApplicant ? 'Coaching CV & Ambitions' : 'Experience & Ambitions'}</h3>
                            <div className="space-y-5">
                                {isCoachingApplicant && (<>
                                <div>
                                    <label className={labelClass}>Highest Coaching Accreditation</label>
                                    <select name="coaching_accreditation" value={form.coaching_accreditation} onChange={handleChange} className={inputClass('coaching_accreditation')}>
                                        <option value="">Select an option</option>
                                        {ACCREDITATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Years of Coaching Experience</label>
                                    <input name="years_coaching" type="number" min="0" max="60" value={form.years_coaching} onChange={handleChange} className={inputClass('years_coaching')} placeholder="e.g. 5" />
                                </div>
                                <div>
                                    <label className={labelClass}>Age Groups Previously Coached</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {AGE_GROUP_OPTIONS.map(o => {
                                            const checked = ageGroups.includes(o.value);
                                            return (
                                                <button
                                                    type="button"
                                                    key={o.value}
                                                    onClick={() => toggleAgeGroup(o.value)}
                                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${checked ? 'bg-rr-pink text-white border-2 border-rr-pink' : 'bg-slate-50 text-rr-charcoal border-2 border-slate-200 hover:border-rr-pink/50'}`}
                                                >
                                                    {o.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Brief Coaching CV / Experience Summary</label>
                                    <textarea name="coaching_cv" value={form.coaching_cv} onChange={handleChange} maxLength={1500} rows={5} className={inputClass('coaching_cv')} placeholder="Walk us through your coaching journey — programs, age groups, roles, achievements." />
                                    <p className={helperClass}>{form.coaching_cv.length}/1500</p>
                                </div>
                                </>)}
                                {!isCoachingApplicant && (
                                <div>
                                    <label className={labelClass}>Relevant Experience & Skills</label>
                                    <textarea name="coaching_cv" value={form.coaching_cv} onChange={handleChange} maxLength={1500} rows={5} className={inputClass('coaching_cv')} placeholder="Tell us about your relevant experience — study, work, volunteering, projects, or skills you'd bring to the academy." />
                                    <p className={helperClass}>{form.coaching_cv.length}/1500</p>
                                </div>
                                )}
                                <div>
                                    <label className={labelClass}>{isCoachingApplicant ? 'Goals & Ambitions as a Coach' : 'Goals & Ambitions'}</label>
                                    <textarea name="goals_ambitions" value={form.goals_ambitions} onChange={handleChange} maxLength={1500} rows={5} className={inputClass('goals_ambitions')} placeholder="Why RRA Melbourne? What do you want to develop? Where do you want to be in 3 years?" />
                                    <p className={helperClass}>{form.goals_ambitions.length}/1500</p>
                                </div>
                                <div>
                                    <label className={labelClass}>CV / Resume Link <span className="normal-case font-medium text-rr-charcoal">(Google Drive, Dropbox, or LinkedIn)</span></label>
                                    <input name="cv_resume_url" value={form.cv_resume_url} onChange={handleChange} className={inputClass('cv_resume_url')} placeholder="https://..." />
                                    <p className={helperClass}>Make sure the link is set to public or 'anyone with the link can view'.</p>
                                </div>
                            </div>
                        </div>

                        {/* Compliance */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6">Confirmations</h3>
                            <ComplianceCheckbox checked={acceptAccuracy} onChange={setAcceptAccuracy} error={errors.acceptAccuracy}>
                                I confirm the information I've provided is accurate and complete to the best of my knowledge.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptContact} onChange={setAcceptContact} error={errors.acceptContact}>
                                I agree to be contacted by RRA Melbourne regarding this application and consent to RRA Melbourne storing my information in line with the{' '}
                                <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
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
                                    Submit Application
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

export default ApplicationForm;
