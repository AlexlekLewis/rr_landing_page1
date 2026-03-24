import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';

const FLEXIPAY_URL = 'https://buy.stripe.com/fZu8wPbHP9SB2D2bzZ9Zm06';
const FULL_URL    = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';

/* ─── helpers ─── */
const calculateAge = (dobString) => {
    const [year, month, day] = dobString.split('-').map(Number);
    if (!year || !month || !day) return null;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? age : null;
};

/* ─── reusable sub-components ─── */
const InputField = ({ label, type = 'text', placeholder, name, value, onChange, required = false, disabled = false, className = '' }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, limit = 150 }) => {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    const isOverLimit = wordCount > limit;
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                {label}
                <span className={`float-right text-[10px] normal-case ${isOverLimit ? 'text-red-400 font-bold' : 'text-white/30'}`}>
                    {wordCount}/{limit} words
                </span>
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:bg-white/8 transition-colors resize-none ${isOverLimit ? 'border-red-400/60 focus:border-red-400' : 'border-white/15 focus:border-rr-pink/60'}`}
            />
            {isOverLimit && <p className="text-red-400 text-[10px]">Please keep your response under {limit} words.</p>}
        </div>
    );
};

const ComplianceCheckbox = ({ checked, onChange, children }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm shrink-0 mt-0.5 ${checked ? 'bg-rr-pink border-rr-pink' : 'bg-white/5 border-white/30 group-hover:border-white/50'}`}>
            {checked && <span className="text-xs text-white font-bold">✓</span>}
        </div>
        <span className="text-sm text-white/60 leading-relaxed font-medium group-hover:text-white/80 transition-colors">{children}</span>
    </label>
);

/* ═══════════════════════════════════════════════
   MASTER CHECKOUT
   ═══════════════════════════════════════════════ */
const MasterCheckout = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const paymentRef = useRef(null);

    /* ── form state ── */
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', email: '', phone: '',
        suburb: '', profileLink: '', club: '', history: '', bio: '', goals: '',
        parent1Name: '', parent1Email: '', parent1Phone: '',
        parent2Name: '', parent2Email: '', parent2Phone: '',
    });
    const [cricketGender, setCricketGender] = useState('');
    const [cvFile, setCvFile] = useState(null);

    // Compliance
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [acceptPlayingStandard, setAcceptPlayingStandard] = useState(false);

    const age = formData.dob ? calculateAge(formData.dob) : null;
    const isUnder18 = age !== null && age < 18;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDobChange = (val) => {
        setFormData(prev => ({ ...prev, dob: val }));
    };

    /* ── validation ── */
    const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

    const isFormValid = () => {
        const d = formData;
        const hasCore = d.firstName.trim() && d.lastName.trim() && d.dob;
        const hasParent1 = d.parent1Name.trim() && d.parent1Email.trim() && d.parent1Phone.trim();
        const hasClub = d.club.trim();
        const hasSuburb = d.suburb.trim();
        const hasGender = !!cricketGender;

        // Over-18 players must supply their own email + phone
        const hasPlayerContact = isUnder18 ? true : (d.email.trim() && d.phone.trim());

        const hasConsents = acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia && acceptPlayingStandard;
        const withinWordLimits = getWordCount(d.bio) <= 150 && getWordCount(d.goals) <= 150;

        return hasCore && hasParent1 && hasClub && hasSuburb && hasGender && hasPlayerContact && hasConsents && withinWordLimits;
    };

    /* ── validate, save to Supabase, then redirect to Stripe ── */
    const handlePaymentSelect = async (option, stripeUrl) => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields and accept all compliance documents before selecting a payment option.');
            document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            let cvUrl = null;

            if (cvFile) {
                const fileExt = cvFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('cvs').upload(fileName, cvFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('cvs').getPublicUrl(fileName);
                cvUrl = data.publicUrl;
            }

            const cohortId = crypto.randomUUID();

            // 1. Basic lead log to applications (lightweight)
            const applicationsPayload = {
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                age: age,
                dob: formData.dob || null,
                email: isUnder18 ? '' : formData.email.trim(),
                phone: isUnder18 ? '' : formData.phone.trim(),
                suburb: formData.suburb.trim(),
                profile_link: formData.profileLink.trim(),
                club: formData.club.trim(),
                history: formData.history.trim(),
                bio: formData.bio.trim(),
                goals: formData.goals.trim(),
                cv_url: cvUrl,
                parent1_name: formData.parent1Name.trim(),
                parent1_email: formData.parent1Email.trim(),
                parent1_phone: formData.parent1Phone.trim(),
                parent2_name: formData.parent2Name.trim(),
                parent2_email: formData.parent2Email.trim(),
                parent2_phone: formData.parent2Phone.trim(),
                cricket_type: cricketGender,
                source: 'master_landing_page',
            };

            const { error: appError } = await supabase.from('applications').insert([applicationsPayload]);
            if (appError) throw appError;

            // 2. Full record to official_cohort_2026 (master table for LP4)
            const cohortPayload = {
                id: cohortId,
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                player_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                age: age,
                dob: formData.dob || null,
                player_email: isUnder18 ? '' : formData.email.trim(),
                player_phone: isUnder18 ? '' : formData.phone.trim(),
                suburb: formData.suburb.trim(),
                profile_link: formData.profileLink.trim(),
                club: formData.club.trim(),
                history: formData.history.trim(),
                bio: formData.bio.trim(),
                goals: formData.goals.trim(),
                cv_url: cvUrl,
                cricket_type: cricketGender,
                parent1_name: formData.parent1Name.trim(),
                parent1_email: formData.parent1Email.trim(),
                parent1_phone: formData.parent1Phone.trim(),
                parent2_name: formData.parent2Name.trim(),
                parent2_email: formData.parent2Email.trim(),
                parent2_phone: formData.parent2Phone.trim(),
                accept_terms: acceptTerms,
                accept_player_code: acceptPlayerCode,
                accept_parent_code: acceptParentCode,
                accept_social_media: acceptSocialMedia,
                accept_playing_standard: acceptPlayingStandard,
                source: 'master_landing_page',
                payment_plan_selected: option,
                payment_status: 'pending',
            };

            const { error: cohortError } = await supabase.from('official_cohort_2026').insert([cohortPayload]);
            if (cohortError) throw cohortError;

            // Store cohort record ID so success page can UPDATE the same row
            localStorage.setItem('master_cohort_id', cohortId);
            localStorage.setItem('payment_option_selected', option);

            // Redirect to Stripe in the same tab for a seamless experience
            window.location.href = stripeUrl;
        } catch (err) {
            console.error('Error saving application:', err);
            setSubmitError('Something went wrong saving your details. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden" id="checkout">

            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rr-pink/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rr-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* ────── Header ────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <img src="/assets/Crest.png" alt="Royal Crest" className="h-16 mx-auto mb-6 brightness-0 invert opacity-80" />
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Secure Your Place</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Application</span>
                    </h2>
                    <p className="text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
                        Secure your spot in the Season 1 Elite intake. Complete all fields below, then select your preferred payment option to proceed.
                    </p>
                    {/* Deadline banner */}
                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2.5 mt-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-wide sm:tracking-widest">
                            Nearly Full — Less than 10 places remain
                        </span>
                    </div>
                </motion.div>

                {/* ────── Please Note — Eligibility ────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-rr-blue/10 border border-rr-blue/30 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-rr-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">Please Note — Program Eligibility</h4>
                            <p className="text-sm text-white/60 leading-relaxed">
                                The Rajasthan Royals Academy Elite Program is designed for cricketers <span className="text-white font-bold">11 years of age or older</span> who possess a demonstrated skill set and competitive playing experience. This is a high-performance environment, not a learn-to-play program.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ────── Error banner ────── */}
                <AnimatePresence>
                    {submitError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                            <div className="p-4 bg-red-500/15 border border-red-400/30 text-red-300 rounded-2xl font-medium text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{submitError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ════════════════════════════════════════
                   PLAYER DETAILS
                   ════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6"
                >
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Player Details</h4>
                    <p className="text-xs text-white/40 mb-6">All fields marked with * are required.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="Player First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        <InputField label="Player Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>

                    {/* DOB */}
                    <div className="mt-5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">
                            Date of Birth <span className="text-rr-pink">*</span>
                        </label>
                        <DateOfBirthInput value={formData.dob} onChange={handleDobChange} required />
                    </div>

                    {age !== null && (
                        <p className="text-xs text-white/40 -mt-2 mb-2">Age: <span className="text-white/70 font-bold">{age}</span></p>
                    )}

                    {/* Male / Female Cricket */}
                    <div className="mt-5 mb-5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-3">
                            Do you play Male or Female Cricket? <span className="text-rr-pink">*</span>
                        </label>
                        <div className="flex gap-4">
                            {['Male Cricket', 'Female Cricket'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio" name="cricketGender" value={opt}
                                        checked={cricketGender === opt}
                                        onChange={(e) => { setCricketGender(e.target.value); }}
                                        className="w-4 h-4 accent-rr-pink"
                                    />
                                    <span className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Player contact — over 18 only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label={`Player Email${isUnder18 ? ' (Not collected for Under 18s)' : ''}`}
                            type="email" name="email"
                            value={isUnder18 ? '' : formData.email}
                            onChange={handleChange}
                            required={!isUnder18}
                            disabled={isUnder18}
                            placeholder={isUnder18 ? 'Disabled for Under 18s' : ''}
                        />
                        <InputField
                            label={`Player Phone${isUnder18 ? ' (Not collected for Under 18s)' : ''}`}
                            type="tel" name="phone"
                            value={isUnder18 ? '' : formData.phone}
                            onChange={handleChange}
                            required={!isUnder18}
                            disabled={isUnder18}
                            placeholder={isUnder18 ? 'Disabled for Under 18s' : ''}
                        />
                    </div>
                    {isUnder18 && (
                        <p className="text-[10px] text-white/30 mt-2 italic">Player email and phone number are required for applicants aged 18 and over only.</p>
                    )}

                    <div className="mt-5">
                        <InputField label="Primary Residential Suburb" name="suburb" value={formData.suburb} onChange={handleChange} required />
                    </div>
                </motion.div>

                {/* ════════════════════════════════════════
                   PARENT / GUARDIAN DETAILS
                   ════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.14 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6"
                >
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Parent / Guardian Details</h4>
                    <p className="text-xs text-white/40 mb-6">At least one parent/guardian is required.</p>

                    <p className="text-xs font-bold text-rr-pink uppercase tracking-wider mb-3">Parent / Guardian 1</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <InputField label="Name" name="parent1Name" value={formData.parent1Name} onChange={handleChange} required />
                        <InputField label="Email" type="email" name="parent1Email" value={formData.parent1Email} onChange={handleChange} required />
                        <InputField label="Phone" type="tel" name="parent1Phone" value={formData.parent1Phone} onChange={handleChange} required />
                    </div>

                    <div className="border-t border-white/10 pt-5">
                        <p className="text-xs font-bold text-rr-blue uppercase tracking-wider mb-3">Parent / Guardian 2 <span className="text-white/30 normal-case">(Optional)</span></p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <InputField label="Name" name="parent2Name" value={formData.parent2Name} onChange={handleChange} />
                            <InputField label="Email" type="email" name="parent2Email" value={formData.parent2Email} onChange={handleChange} />
                            <InputField label="Phone" type="tel" name="parent2Phone" value={formData.parent2Phone} onChange={handleChange} />
                        </div>
                    </div>
                </motion.div>

                {/* ════════════════════════════════════════
                   CRICKET PROFILE
                   ════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-6"
                >
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Cricket Profile</h4>
                    <p className="text-xs text-white/40 mb-6">Tell us about the player's cricket background.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <InputField label="Play Cricket Profile Link" name="profileLink" value={formData.profileLink} onChange={handleChange} placeholder="https://..." />
                        <InputField label="Current Club(s)" name="club" value={formData.club} onChange={handleChange} required />
                    </div>

                    <div className="mb-5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">Representative History</label>
                        <textarea
                            name="history" value={formData.history} onChange={handleChange}
                            placeholder="List your representative achievements..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/8 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <TextAreaField label="Written Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." limit={150} />
                        <TextAreaField label="Career Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="Where do you want to be in 5 years?" limit={150} />
                    </div>
                </motion.div>

                {/* ════════════════════════════════════════
                   COMPLIANCE & POLICIES
                   ════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
                >
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-6">Compliance & Policies</h4>

                    <div className="space-y-5">
                        <ComplianceCheckbox checked={acceptPlayingStandard} onChange={(v) => { setAcceptPlayingStandard(v); }}>
                            I understand the minimum playing standard for this program is VMCU / Country representative cricket or higher.
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptTerms} onChange={(v) => { setAcceptTerms(v); }}>
                            I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                            {isUnder18 && (
                                <strong className="text-rr-pink block mt-1 text-xs">
                                    As the applicant is under 18, this application must be completed by a parent or legal guardian.
                                </strong>
                            )}
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptPlayerCode} onChange={(v) => { setAcceptPlayerCode(v); }}>
                            I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptParentCode} onChange={(v) => { setAcceptParentCode(v); }}>
                            I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptSocialMedia} onChange={(v) => { setAcceptSocialMedia(v); }}>
                            I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                        </ComplianceCheckbox>
                    </div>
                </motion.div>

                {/* ════════════════════════════════════════
                   FEMALE PROGRAM FULL — WAITLIST
                   ════════════════════════════════════════ */}

                {cricketGender === 'Female Cricket' && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <div className="bg-white/5 border border-rr-pink/30 rounded-2xl p-8 md:p-10 text-center">
                            <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/30 rounded-full px-5 py-2 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                                <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Female Program — Now Full</span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                                All Female Places Have Been Filled
                            </h3>

                            <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto mb-6">
                                The female intake for Season 1 of the T20 Elite Program is now at capacity. If you would like to be considered should a place become available, or for future programs, please get in touch with us directly.
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-lg mx-auto mb-6">
                                <p className="text-white/80 text-sm font-semibold mb-3">To join the waitlist, email:</p>
                                <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-pink hover:text-rr-light-pink font-black text-lg transition-colors">
                                    eliteprogram@rramelbourne.com
                                </a>
                                <div className="mt-4 text-left max-w-xs mx-auto space-y-2">
                                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Please include:</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0">
                                            <span className="text-rr-pink text-[8px] font-black">1</span>
                                        </span>
                                        <span className="text-white/60 text-sm font-medium">Player's full name</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0">
                                            <span className="text-rr-pink text-[8px] font-black">2</span>
                                        </span>
                                        <span className="text-white/60 text-sm font-medium">Player's age</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0">
                                            <span className="text-rr-pink text-[8px] font-black">3</span>
                                        </span>
                                        <span className="text-white/60 text-sm font-medium">Link to Play-Cricket profile</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/30 text-xs font-medium">
                                We will review all waitlist enquiries and respond as soon as possible.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ════════════════════════════════════════
                   CONFIRM & PAY
                   ════════════════════════════════════════ */}

                {cricketGender !== 'Female Cricket' && (<>
                {/* Instructional header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-8 bg-rr-pink/40" />
                        <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.25em] text-center">
                            Final Step — Confirm & Pay
                        </p>
                        <span className="h-px w-8 bg-rr-pink/40" />
                    </div>
                    <p className="text-center text-white/50 text-sm font-medium max-w-lg mx-auto leading-relaxed">
                        Select your preferred payment option below to submit your application and secure your place. Your details will be saved automatically.
                    </p>
                    <style>{`
                        @keyframes pulseGlow {
                            0%, 100% { box-shadow: 0 0 20px rgba(229,6,149,0.3); }
                            50% { box-shadow: 0 0 50px rgba(229,6,149,0.6), 0 0 80px rgba(229,6,149,0.2); }
                        }
                        @keyframes shimmerBorder {
                            0%   { background-position: 0% 50%; }
                            50%  { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        .shimmer-border {
                            background: linear-gradient(270deg, #e50695, #6366f1, #0070f0, #e50695);
                            background-size: 300% 300%;
                            animation: shimmerBorder 3s ease infinite;
                        }
                        .shimmer-border-bright {
                            background: linear-gradient(270deg, #ff0fa8, #a855f7, #e50695, #ff0fa8);
                            background-size: 300% 300%;
                            animation: shimmerBorder 2.5s ease infinite;
                            filter: brightness(1.25) saturate(1.3);
                            box-shadow: 0 0 18px rgba(229,6,149,0.35);
                        }
                    `}</style>
                </motion.div>

                {/* Payment option cards — always visible, clicking triggers save + redirect */}
                <div ref={paymentRef} className="scroll-mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                >
                    {/* Flexi Pay — Featured */}
                    <button
                        onClick={() => handlePaymentSelect('Flexi Pay', FLEXIPAY_URL)}
                        disabled={isSubmitting}
                        className="group relative flex flex-col items-center justify-center gap-1 p-px rounded-2xl overflow-hidden hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] transition-shadow duration-300 cursor-pointer shimmer-border-bright disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                        <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                            <span className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em]">Most Popular</span>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">Flexi Pay</span>
                            <span className="text-white/50 text-sm font-medium">4 payments of $749</span>
                            <div className="mt-2 flex items-center gap-2 bg-rr-pink/20 px-4 py-2 rounded-full">
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 text-rr-pink animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    {isSubmitting ? 'Submitting...' : 'Submit & Pay $749'}
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Pay in Full */}
                    <button
                        onClick={() => handlePaymentSelect('Paid in Full', FULL_URL)}
                        disabled={isSubmitting}
                        className="group relative flex flex-col items-center justify-center gap-1 p-px rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shimmer-border hover:shadow-[0_0_32px_rgba(0,112,240,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                        <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                            <span className="text-[10px] font-bold text-rr-blue uppercase tracking-[0.25em]">Best Value</span>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">Pay in Full</span>
                            <span className="text-white/50 text-sm font-medium">$2,995 — Includes free training kit</span>
                            <div className="mt-2 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                                    {isSubmitting ? 'Submitting...' : 'Submit & Pay'}
                                </span>
                            </div>
                        </div>
                    </button>
                </motion.div>
                </div>

                {/* Afterpay note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="text-center text-white/40 text-xs font-medium mb-8"
                >
                    Afterpay also available at checkout. Questions or issues with payments or for tailored payment options?{' '}
                    <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-blue hover:text-white transition-colors underline underline-offset-2">Contact us.</a>
                </motion.p>
                </>)}

                {/* Onboarding confirmation */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-start gap-4"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">What Happens After Payment?</h4>
                        <p className="text-sm text-white/55 leading-relaxed">
                            Once payment has been made, you will be directed to our onboarding form to complete the onboarding process. This ensures we have everything we need to personalise your program from day one.
                        </p>
                    </div>
                </motion.div>

                {/* FAQ link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="text-center mb-10"
                >
                    <p className="text-white/40 text-sm">
                        Have questions before you apply?{' '}
                        <a href="#faq" className="text-rr-pink font-bold hover:text-white transition-colors underline underline-offset-2">
                            View our Frequently Asked Questions ↓
                        </a>
                    </p>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="border border-white/10 rounded-2xl p-6"
                >
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Important Disclaimer</h4>
                    <p className="text-xs text-white/35 leading-relaxed">
                        RRA Melbourne reserves the right to decline an application to the Elite Program if it is deemed that the applicant would not benefit from the program, or if there are safety concerns for the applicant or other participants. In such cases, the player or customer will receive a full reimbursement of the amount paid, minus any third-party fees and charges applied at the time of transaction.
                    </p>
                </motion.div>

            </div>
        </section>
    );
};

export default MasterCheckout;
