import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';
=======
import { supabase } from '../../lib/supabase';

// Provided by CEO
const PAYMENT_LINK = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)

const DEPOSIT_URL = 'https://buy.stripe.com/6oU3cvfY58Ox91q9rR9Zm05';
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
<<<<<<< HEAD
    const [formSaved, setFormSaved] = useState(false);

    /* ── form state ── */
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', email: '', phone: '',
        suburb: '', profileLink: '', club: '', history: '', bio: '', goals: '',
        parent1Name: '', parent1Email: '', parent1Phone: '',
        parent2Name: '', parent2Email: '', parent2Phone: '',
=======

    // Core Form state
    const [formData, setFormData] = useState({
        parentName: '',
        phone: '',
        email: '',
        playerName: '',
        dob: '',
        role: '',
        competition: '',
        competitionHistory: ''
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
    });
    const [cricketGender, setCricketGender] = useState('');
    const [cvFile, setCvFile] = useState(null);

<<<<<<< HEAD
    // Compliance
=======
    // Consents
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

<<<<<<< HEAD
    const age = formData.dob ? calculateAge(formData.dob) : null;
    const isUnder18 = age !== null && age < 18;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formSaved) setFormSaved(false);
    };

    const handleDobChange = (val) => {
        setFormData(prev => ({ ...prev, dob: val }));
        if (formSaved) setFormSaved(false);
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

        const hasConsents = acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia;
        const withinWordLimits = getWordCount(d.bio) <= 150 && getWordCount(d.goals) <= 150;

        return hasCore && hasParent1 && hasClub && hasSuburb && hasGender && hasPlayerContact && hasConsents && withinWordLimits;
    };

    /* ── submit to Supabase (applications table) ── */
    const handleSaveForm = async () => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields and accept all compliance documents before proceeding to payment.');
            document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
=======
    // Zoom Modal State
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [zoomSuccess, setZoomSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return (
            formData.parentName.trim() &&
            formData.phone.trim() &&
            formData.email.trim() &&
            formData.playerName.trim() &&
            formData.dob.trim() &&
            formData.role &&
            formData.competition &&
            formData.competitionHistory.trim() &&
            acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia
        );
    };

    const handleFullApplication = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            setSubmitError('Please complete all required fields and accept all compliance documents.');
            document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
<<<<<<< HEAD
            let cvUrl = null;

            if (cvFile) {
                const fileExt = cvFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('cvs').upload(fileName, cvFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('cvs').getPublicUrl(fileName);
                cvUrl = data.publicUrl;
            }

            const payload = {
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

            const { error } = await supabase.from('applications').insert([payload]);
            if (error) throw error;

            // Flag that purchase came from LP4 so StripeSuccess can redirect
            localStorage.setItem('purchase_source', 'master_lp');

            setFormSaved(true);
            setSubmitError('');
        } catch (err) {
            console.error('Error saving application:', err);
            setSubmitError('Something went wrong saving your details. Please try again.');
=======
            const payload = {
                inquiry_type: 'full_application',
                parent_name: formData.parentName.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim().toLowerCase(),
                player_name: formData.playerName.trim(),
                dob: formData.dob,
                player_role: formData.role,
                competition: formData.competition,
                competition_history: formData.competitionHistory.trim(),
                payment_status: 'pending'
            };

            const { error } = await supabase.from('master_inquiries').insert(payload);

            // We ignore errors on insert if the table isn't created yet just for demo,
            // but ideally we throw.
            if (error) throw error;

            // Redirect to Stripe Payment Link
            window.location.href = PAYMENT_LINK;

        } catch (err) {
            console.error('Submission error:', err);
            setSubmitError('Something went wrong preparing your registration. Please try again or contact support.');
            setIsSubmitting(false);
        }
    };

    const handleZoomRegistration = async (e) => {
        e.preventDefault();

        if (!formData.parentName.trim() || !formData.email.trim() || !formData.playerName.trim()) {
            alert('Please fill out Parent Name, Email, and Player Name to register for Zoom.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                inquiry_type: 'zoom_only',
                parent_name: formData.parentName.trim(),
                email: formData.email.trim().toLowerCase(),
                player_name: formData.playerName.trim(),
                phone: formData.phone.trim(), // Optional
            };

            const { error } = await supabase.from('master_inquiries').insert(payload);
            if (error) throw error;

            setZoomSuccess(true);
        } catch (err) {
            console.error('Zoom reg error:', err);
            alert('Something went wrong. Please try again later.');
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
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
<<<<<<< HEAD
                    <p className="text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
                        Secure your spot in the Season 1 Elite intake. Complete all fields below, then select your preferred payment option to proceed.
                    </p>
                    {/* Deadline banner */}
                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2.5 mt-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-wide sm:tracking-widest">
                            Entry closes 5pm · March 20, 2026 — or when full
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
                                        onChange={(e) => { setCricketGender(e.target.value); if (formSaved) setFormSaved(false); }}
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

                    {/* CV Upload */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            Cricket CV / Resume <span className="text-white/30 normal-case">(Optional — PDF, DOC, DOCX)</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => { if (e.target.files?.[0]) { setCvFile(e.target.files[0]); if (formSaved) setFormSaved(false); } }}
                            className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white/70 hover:file:bg-white/15 file:cursor-pointer file:transition-colors"
                        />
                        {cvFile && <p className="text-[10px] text-white/40">Selected: {cvFile.name}</p>}
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
                        <ComplianceCheckbox checked={acceptTerms} onChange={(v) => { setAcceptTerms(v); if (formSaved) setFormSaved(false); }}>
                            I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                            {isUnder18 && (
                                <strong className="text-rr-pink block mt-1 text-xs">
                                    As the applicant is under 18, this application must be completed by a parent or legal guardian.
                                </strong>
                            )}
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptPlayerCode} onChange={(v) => { setAcceptPlayerCode(v); if (formSaved) setFormSaved(false); }}>
                            I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptParentCode} onChange={(v) => { setAcceptParentCode(v); if (formSaved) setFormSaved(false); }}>
                            I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                        </ComplianceCheckbox>

                        <ComplianceCheckbox checked={acceptSocialMedia} onChange={(v) => { setAcceptSocialMedia(v); if (formSaved) setFormSaved(false); }}>
                            I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                        </ComplianceCheckbox>
                    </div>
                </motion.div>

                {/* ════════════════════════════════════════
                   SAVE & PAYMENT
                   ════════════════════════════════════════ */}

                {/* Save button */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <button
                        onClick={handleSaveForm}
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : formSaved ? (
                            <><Check className="w-4 h-4" /> Application Saved — Choose Payment Below</>
                        ) : (
                            'Save Application & Proceed to Payment'
                        )}
=======
                    <p className="text-slate-300 font-medium">Secure your child's spot in the Season 1 Elite intake.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-rr-dark relative" id="checkout-form">
                    <div className="p-8 md:p-10">
                        {/* Error Message */}
                        <AnimatePresence>
                            {submitError && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm flex items-start gap-3">
                                        <span className="text-xl leading-none">⚠️</span>
                                        <p>{submitError}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleFullApplication} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Parent Full Name *</label>
                                    <input required type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="Jane Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Best Contact Number *</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="0400 000 000" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Email Address *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="jane@example.com" />
                                </div>
                            </div>

                            <hr className="border-slate-200 my-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Player Full Name *</label>
                                    <input required type="text" name="playerName" value={formData.playerName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Date of Birth *</label>
                                    <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Primary Playing Role *</label>
                                    <select required name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue">
                                        <option value="">Select Role...</option>
                                        <option value="batsman">Batter</option>
                                        <option value="bowler-pace">Pace Bowler</option>
                                        <option value="bowler-spin">Spin Bowler</option>
                                        <option value="all-rounder">All-Rounder</option>
                                        <option value="wicket-keeper">Wicket-Keeper</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-slate-200 my-6" />

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Competition played in (Male or Female)? *</label>
                                    <select required name="competition" value={formData.competition} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue">
                                        <option value="">Select Competition...</option>
                                        <option value="male">Male Cricket</option>
                                        <option value="female">Female Cricket</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Competition History *</label>
                                    <p className="text-xs text-slate-500 mb-2 mt-[-4px]">Please list the clubs and teams the player played for this season.</p>
                                    <textarea required name="competitionHistory" value={formData.competitionHistory} onChange={handleInputChange} rows={3} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="e.g. Richmond CC - U16s Boys..."></textarea>
                                </div>
                            </div>

                            <hr className="border-slate-200 my-6" />

                            {/* CONSENTS & COMPLIANCE */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-xl font-bold text-rr-dark mb-4">Compliance & Policies</h3>

                                <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms}>
                                    I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                                </ComplianceCheckbox>

                                <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode}>
                                    I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                                </ComplianceCheckbox>

                                <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode}>
                                    I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                                </ComplianceCheckbox>

                                <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia}>
                                    I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                                </ComplianceCheckbox>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold uppercase tracking-widest px-8 py-5 rounded-lg transition-colors mt-8 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-rr-pink hover:bg-rr-light-pink'}`}>
                                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Final Call to Action block */}
                <div className="mt-16 text-center border-t border-white/10 pt-16">
                    <p className="text-rr-pink font-bold uppercase tracking-widest text-sm mb-4">Want to learn more first?</p>
                    <h3 className="text-2xl font-black text-white uppercase mb-4">
                        ONLINE INFORMATION ZOOM NIGHT
                    </h3>
                    <p className="text-slate-300 mb-8 font-medium">
                        Time and date: <span className="text-white bg-white/10 px-2 py-1 rounded">To Be Confirmed</span>
                    </p>
                    <button onClick={() => setShowZoomModal(true)} className="border-2 border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wide px-8 py-4 rounded-full transition-colors">
                        Register for the Zoom Link
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
                    </button>
                    {!formSaved && !submitError && (
                        <p className="text-center text-white/30 text-[10px] mt-2">
                            Your application will be saved before you are directed to Stripe for payment.
                        </p>
                    )}
                </motion.div>

                {/* Payment buttons — only active after form is saved */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 transition-opacity duration-500 ${formSaved ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
                >
                    {/* Pay in Full */}
                    <a
                        href={formSaved ? FULL_URL : '#'}
                        target={formSaved ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!formSaved) e.preventDefault(); }}
                        className="group relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-rr-pink to-rr-blue p-px rounded-2xl overflow-hidden hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] transition-shadow duration-300"
                    >
                        <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                            <span className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em]">Best Value</span>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">Pay in Full</span>
                            <span className="text-white/50 text-sm font-medium">$2,995 — Includes free training kit</span>
                            <div className="mt-2 flex items-center gap-2 bg-rr-pink/20 px-4 py-2 rounded-full">
                                <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Secure Now</span>
                            </div>
                        </div>
                    </a>

                    {/* Deposit+ */}
                    <a
                        href={formSaved ? DEPOSIT_URL : '#'}
                        target={formSaved ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!formSaved) e.preventDefault(); }}
                        className="group relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-white/20 to-white/5 p-px rounded-2xl overflow-hidden hover:from-rr-blue hover:to-rr-pink hover:shadow-[0_0_32px_rgba(0,112,240,0.3)] transition-all duration-300"
                    >
                        <div className="w-full bg-rr-dark group-hover:bg-rr-dark/80 transition-colors rounded-2xl px-6 py-7 flex flex-col items-center gap-2 text-center">
                            <span className="text-[10px] font-bold text-rr-blue uppercase tracking-[0.25em]">Flexible</span>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">Deposit+</span>
                            <span className="text-white/50 text-sm font-medium">50% now · 50% before first session</span>
                            <div className="mt-2 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Secure Now</span>
                            </div>
                        </div>
                    </a>
                </motion.div>

                {!formSaved && (
                    <p className="text-center text-white/30 text-xs mb-8 font-medium">
                        Complete and save your application above to unlock payment options.
                    </p>
                )}

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
                        RRA Melbourne reserves the right to decline an application to the Elite Program if it is deemed that the applicant would not benefit from the program, or if there are safety concerns for the applicant or other participants. In such cases, the player or customer will receive a full refund of the amount paid, minus any third-party fees and charges applied at the time of transaction.
                    </p>
                </motion.div>

            </div>

            {/* ZOOM MODAL */}
            <AnimatePresence>
                {showZoomModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-rr-dark/80 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setShowZoomModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowZoomModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                ✕
                            </button>

                            {zoomSuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-rr-dark uppercase mb-2">Registered!</h3>
                                    <p className="text-slate-600">Thanks for registering. We will email you the Zoom link and details shortly when they are finalised.</p>
                                    <button onClick={() => { setShowZoomModal(false); setZoomSuccess(false); }} className="mt-6 w-full bg-rr-dark text-white font-bold py-3 rounded-xl hover:bg-rr-charcoal transition-colors">
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Get the Zoom Link</h3>
                                        <p className="text-sm font-medium text-slate-500">Enter your details below to register for the online information session.</p>
                                    </div>

                                    <form onSubmit={handleZoomRegistration} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Parent Name</label>
                                            <input required type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="Jane Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Email Address</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="jane@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Player Name</label>
                                            <input required type="text" name="playerName" value={formData.playerName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="John Doe" />
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className={`w-full mt-4 text-white font-bold tracking-widest uppercase px-6 py-4 rounded-xl transition-colors ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-rr-blue hover:bg-rr-blue/90'}`}>
                                            {isSubmitting ? 'Registering...' : 'Register Now'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

// Reusable compliance checkbox purely for visual consistency
const ComplianceCheckbox = ({ checked, onChange, children }) => (
    <div className="flex items-start gap-4 group">
        <label className="relative flex items-start mt-1 shrink-0 cursor-pointer text-rr-dark">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
            <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm ${checked ? 'bg-rr-pink border-rr-pink' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                {checked && <span className="text-xs text-white font-bold">✓</span>}
            </div>
        </label>
        <span className="text-sm text-slate-600 font-medium leading-relaxed">
            {children}
        </span>
    </div>
);

export default MasterCheckout;
