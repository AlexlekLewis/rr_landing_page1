import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';

const FLEXIPAY_URL = 'https://buy.stripe.com/fZu8wPbHP9SB2D2bzZ9Zm06';
const FULL_URL    = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';

/* ─── Female cap ─── */
const FEMALE_CAP = 17;

/* ─── Onboarding session options (matches success page) ─── */
const SESSION_OPTIONS = {
    weekday: {
        Tuesday: [
            { id: 'wd_tue_5pm', time: '5:00 - 7:00pm', days: 'Tuesday', dayGroup: 'Weekday' },
            { id: 'wd_tue_7pm', time: '7:00 - 9:00pm', days: 'Tuesday', dayGroup: 'Weekday' }
        ],
        Thursday: [
            { id: 'wd_thu_5pm', time: '5:00 - 7:00pm', days: 'Thursday', dayGroup: 'Weekday' },
            { id: 'wd_thu_7pm', time: '7:00 - 9:00pm', days: 'Thursday', dayGroup: 'Weekday' }
        ]
    },
    weekend: {
        Saturday: [
            { id: 'we_sat_8am', time: '8:00 - 10:00am', days: 'Saturday', dayGroup: 'Weekend' },
            { id: 'we_sat_2pm', time: '2:00 - 4:00pm', days: 'Saturday', dayGroup: 'Weekend' },
            { id: 'we_sat_4pm', time: '4:00 - 6:00pm', days: 'Saturday', dayGroup: 'Weekend' }
        ],
        Sunday: [
            { id: 'we_sun_8am', time: '8:00 - 10:00am', days: 'Sunday', dayGroup: 'Weekend' },
            { id: 'we_sun_2pm', time: '2:00 - 4:00pm', days: 'Sunday', dayGroup: 'Weekend' },
            { id: 'we_sun_4pm', time: '4:00 - 6:00pm', days: 'Sunday', dayGroup: 'Weekend' }
        ]
    }
};

const SIZE_OPTIONS = [
    'Mens Extra Extra Small (XXS)',
    'Mens Extra Small (XS)',
    'Mens Small (S)',
    'Mens Medium (M)',
    'Mens Large (L)',
    'Mens Extra Large (XL)',
];

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
/* ─── Onboarding sub-components (for waitlist modal) ─── */
const SessionCheckbox = ({ time, checked, onChange }) => (
    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all w-full ${checked ? 'border-rr-pink bg-rr-pink/10 shadow-md shadow-rr-pink/10' : 'border-white/15 hover:border-white/30 bg-white/5'}`}>
        <span className={`font-bold text-sm ${checked ? 'text-white' : 'text-white/60'}`}>{time}</span>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-rr-pink bg-rr-pink text-white' : 'border-white/30 bg-white/5'}`}>
            {checked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
);

const MasterCheckout = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const paymentRef = useRef(null);

    /* ── Female cap state ── */
    const [femaleCount, setFemaleCount] = useState(0);
    const [femaleFull, setFemaleFull] = useState(false);

    /* ── Waitlist modal state ── */
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [waitlistOnboardingComplete, setWaitlistOnboardingComplete] = useState(false);
    const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
    const [waitlistError, setWaitlistError] = useState('');

    /* ── Waitlist onboarding form fields (mirrors success page) ── */
    const [wlPlayerName, setWlPlayerName] = useState('');
    const [wlParentName, setWlParentName] = useState('');
    const [wlEmail, setWlEmail] = useState('');
    const [wlGender, setWlGender] = useState('');
    const [wlSuburb, setWlSuburb] = useState('');
    const [wlShirtName, setWlShirtName] = useState('');
    const [wlSizeTshirt, setWlSizeTshirt] = useState('');
    const [wlSizeShort, setWlSizeShort] = useState('');
    const [wlSizePants, setWlSizePants] = useState('');
    const [wlGroupChatConsent, setWlGroupChatConsent] = useState(null);
    const [wlPhoneNumbers, setWlPhoneNumbers] = useState([{ id: 1, value: '' }]);
    const [wlPreferredComms, setWlPreferredComms] = useState('');
    const [wlSelectedSessions, setWlSelectedSessions] = useState([]);

    /* ── Check female count on mount ── */
    useEffect(() => {
        const checkFemaleCount = async () => {
            try {
                const { count, error } = await supabase
                    .from('official_cohort_2026')
                    .select('*', { count: 'exact', head: true })
                    .eq('cricket_type', 'Female Cricket');
                if (!error && count !== null) {
                    setFemaleCount(count);
                    setFemaleFull(count >= FEMALE_CAP);
                }
            } catch (err) {
                console.error('Error checking female count:', err);
            }
        };
        checkFemaleCount();
    }, []);

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

            const utmParams = new URLSearchParams(window.location.search);

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
                utm_source: utmParams.get('utm_source') || null,
                utm_medium: utmParams.get('utm_medium') || null,
                utm_campaign: utmParams.get('utm_campaign') || null,
                page_referrer: document.referrer || null,
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
                utm_source: utmParams.get('utm_source') || null,
                utm_medium: utmParams.get('utm_medium') || null,
                utm_campaign: utmParams.get('utm_campaign') || null,
                page_referrer: document.referrer || null,
            };

            // If female and cap reached → waitlist flow (no Stripe)
            if (cricketGender === 'Female Cricket' && femaleFull) {
                cohortPayload.payment_status = 'waitlist';
                cohortPayload.payment_plan_selected = 'waitlist';
            }

            const { error: cohortError } = await supabase.from('official_cohort_2026').insert([cohortPayload]);
            if (cohortError) throw cohortError;

            // Store cohort record ID so onboarding can UPDATE the same row
            localStorage.setItem('master_cohort_id', cohortId);
            localStorage.setItem('payment_option_selected', option);

            // Branch: waitlist modal vs Stripe redirect
            if (cricketGender === 'Female Cricket' && femaleFull) {
                // Pre-fill what we know into the waitlist onboarding form
                setWlPlayerName(`${formData.firstName.trim()} ${formData.lastName.trim()}`);
                setWlParentName(formData.parent1Name.trim());
                setWlEmail(formData.parent1Email.trim());
                setWlSuburb(formData.suburb.trim());
                setShowWaitlistModal(true);
            } else {
                // Normal flow — redirect to Stripe
                window.location.href = stripeUrl;
            }
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
                    {/* Registration open — no capacity restriction */}
                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2.5 mt-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-wide sm:tracking-widest">
                            Now Accepting Applications — Season 1, 2026
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

                {/* Female program block removed — Elite Program form is open for all genders.
                   Female-specific waitlist lives on its own page: /female-cricket-kickstart */}

                {/* ════════════════════════════════════════
                   CONFIRM & PAY
                   ════════════════════════════════════════ */}

                {/* Payment section — open to all genders */}
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

            {/* ════════════════════════════════════════
               WAITLIST ONBOARDING MODAL
               ════════════════════════════════════════ */}
            <AnimatePresence>
                {showWaitlistModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={(e) => { if (e.target === e.currentTarget && waitlistOnboardingComplete) setShowWaitlistModal(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-rr-dark border border-white/15 shadow-2xl"
                        >
                            {/* Close button (only after completion) */}
                            {waitlistOnboardingComplete && (
                                <button
                                    onClick={() => setShowWaitlistModal(false)}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}

                            <div className="p-6 md:p-8">
                                {waitlistOnboardingComplete ? (
                                    /* ── Confirmation screen ── */
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                                            Thank You for Registering
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto mb-4">
                                            Your application and preferences have been received. Our female program spots are currently full, but we have you on our priority waitlist.
                                        </p>
                                        <div className="bg-rr-pink/10 border border-rr-pink/30 rounded-xl p-4 max-w-md mx-auto mb-6">
                                            <p className="text-rr-pink text-sm font-bold">
                                                We will be in touch directly should a spot become available.
                                            </p>
                                        </div>
                                        <p className="text-white/40 text-xs">
                                            If you have any questions, please contact{' '}
                                            <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-blue hover:text-white underline">
                                                eliteprogram@rramelbourne.com
                                            </a>
                                        </p>
                                    </div>
                                ) : (
                                    /* ── Onboarding form ── */
                                    <>
                                        <div className="text-center mb-6">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                                Application Received
                                            </h3>
                                            <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto">
                                                We're currently at capacity for our female program, but we'd love to collect your session and apparel preferences so we're ready to onboard you if a spot opens up.
                                            </p>
                                        </div>

                                        {/* Error */}
                                        {waitlistError && (
                                            <div className="mb-4 p-3 bg-red-500/15 border border-red-400/30 text-red-300 rounded-xl text-sm flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <p>{waitlistError}</p>
                                            </div>
                                        )}

                                        {/* Core details */}
                                        <div className="space-y-4 mb-6">
                                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Your Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InputField label="Player Name" value={wlPlayerName} onChange={(e) => setWlPlayerName(e.target.value)} required />
                                                <InputField label="Parent/Guardian Name" value={wlParentName} onChange={(e) => setWlParentName(e.target.value)} required />
                                            </div>
                                            <InputField label="Email" type="email" value={wlEmail} onChange={(e) => setWlEmail(e.target.value)} required />
                                        </div>

                                        {/* Administration */}
                                        <div className="space-y-4 mb-6">
                                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Administration</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Gender <span className="text-rr-pink">*</span></label>
                                                    <select value={wlGender} onChange={(e) => setWlGender(e.target.value)} className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rr-pink/60 transition-colors">
                                                        <option value="">Select...</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Non-binary">Non-binary</option>
                                                        <option value="Prefer not to say">Prefer not to say</option>
                                                    </select>
                                                </div>
                                                <InputField label="Suburb" value={wlSuburb} onChange={(e) => setWlSuburb(e.target.value)} required />
                                            </div>
                                            <InputField label="Name on Shirt" value={wlShirtName} onChange={(e) => setWlShirtName(e.target.value)} required placeholder="e.g. LEWIS" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { label: 'T-Shirt Size', val: wlSizeTshirt, set: setWlSizeTshirt },
                                                    { label: 'Short Size', val: wlSizeShort, set: setWlSizeShort },
                                                    { label: 'Pants Size', val: wlSizePants, set: setWlSizePants },
                                                ].map(({ label, val, set }) => (
                                                    <div key={label} className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{label} <span className="text-rr-pink">*</span></label>
                                                        <select value={val} onChange={(e) => set(e.target.value)} className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rr-pink/60 transition-colors">
                                                            <option value="">Select size...</option>
                                                            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Session preferences */}
                                        <div className="space-y-4 mb-6">
                                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Session Preferences</h4>
                                            <p className="text-xs text-white/40">Select at least 3 sessions (minimum 1 weekday and 1 weekend).</p>

                                            {Object.entries(SESSION_OPTIONS).map(([groupKey, days]) => (
                                                <div key={groupKey}>
                                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-wider mb-2">{groupKey === 'weekday' ? 'Weekday Sessions' : 'Weekend Sessions'}</p>
                                                    {Object.entries(days).map(([day, sessions]) => (
                                                        <div key={day} className="mb-3">
                                                            <p className="text-xs text-white/50 font-bold mb-2">{day}</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {sessions.map(s => (
                                                                    <SessionCheckbox
                                                                        key={s.id}
                                                                        time={s.time}
                                                                        checked={wlSelectedSessions.includes(s.id)}
                                                                        onChange={() => setWlSelectedSessions(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Comms */}
                                        <div className="space-y-4 mb-6">
                                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Communication</h4>
                                            <div>
                                                <p className="text-sm text-white/60 mb-3">Would you like to join the parent/guardian group chat?</p>
                                                <div className="flex gap-4">
                                                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                                                        <label key={label} className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" name="wlGroupChat" checked={wlGroupChatConsent === val} onChange={() => setWlGroupChatConsent(val)} className="w-4 h-4 accent-rr-pink" />
                                                            <span className="text-sm text-white/60">{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {wlGroupChatConsent === true && (
                                                <div>
                                                    <p className="text-xs text-white/40 mb-2">Phone number(s) for group chat:</p>
                                                    {wlPhoneNumbers.map((p, idx) => (
                                                        <div key={p.id} className="mb-2">
                                                            <InputField
                                                                label={`Phone ${idx + 1}`}
                                                                type="tel"
                                                                value={p.value}
                                                                onChange={(e) => setWlPhoneNumbers(prev => prev.map(x => x.id === p.id ? { ...x, value: e.target.value } : x))}
                                                                required
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setWlPhoneNumbers(prev => [...prev, { id: Date.now(), value: '' }])}
                                                        className="text-xs text-rr-pink hover:text-white transition-colors font-bold"
                                                    >
                                                        + Add another number
                                                    </button>
                                                </div>
                                            )}

                                            {wlGroupChatConsent === false && (
                                                <div>
                                                    <InputField
                                                        label="Preferred communication method"
                                                        value={wlPreferredComms}
                                                        onChange={(e) => setWlPreferredComms(e.target.value)}
                                                        placeholder="e.g. Email, SMS, etc."
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            onClick={async () => {
                                                // Validate
                                                const hasCore = wlPlayerName.trim() && wlParentName.trim() && wlEmail.trim() && wlEmail.includes('@');
                                                const hasAdmin = wlGender && wlSuburb.trim() && wlShirtName.trim() && wlSizeTshirt && wlSizeShort && wlSizePants;
                                                const hasComms = wlGroupChatConsent === true
                                                    ? wlPhoneNumbers.some(p => p.value.trim())
                                                    : (wlGroupChatConsent === false ? wlPreferredComms.trim() : false);
                                                const hasMinSessions = wlSelectedSessions.length >= 3;
                                                const hasWeekday = wlSelectedSessions.some(id => id.startsWith('wd'));
                                                const hasWeekend = wlSelectedSessions.some(id => id.startsWith('we'));

                                                if (!hasCore || !hasAdmin || !hasComms || !hasMinSessions || !hasWeekday || !hasWeekend) {
                                                    setWaitlistError('Please complete all required fields, select at least 3 sessions (min 1 weekday + 1 weekend).');
                                                    return;
                                                }

                                                setWaitlistSubmitting(true);
                                                setWaitlistError('');

                                                try {
                                                    const cohortId = localStorage.getItem('master_cohort_id');
                                                    const validPhones = wlPhoneNumbers.filter(p => p.value.trim()).map(p => p.value.trim());

                                                    const onboardingData = {
                                                        accepted_offer: true,
                                                        parent_name: wlParentName.trim(),
                                                        email: wlEmail.trim().toLowerCase(),
                                                        phone: validPhones[0] || '',
                                                        gender: wlGender,
                                                        suburb: wlSuburb.trim(),
                                                        shirt_name: wlShirtName.trim(),
                                                        size_tshirt: wlSizeTshirt,
                                                        size_short: wlSizeShort,
                                                        size_pants: wlSizePants,
                                                        player_role: '',
                                                        selected_sessions: wlSelectedSessions.map(id => {
                                                            const allOpts = [
                                                                ...SESSION_OPTIONS.weekday.Tuesday,
                                                                ...SESSION_OPTIONS.weekday.Thursday,
                                                                ...SESSION_OPTIONS.weekend.Saturday,
                                                                ...SESSION_OPTIONS.weekend.Sunday
                                                            ];
                                                            const opt = allOpts.find(o => o.id === id);
                                                            return opt ? `[${opt.dayGroup}] ${opt.days}: ${opt.time}` : id;
                                                        }).join(' | '),
                                                        group_chat_consent: wlGroupChatConsent,
                                                        phone_numbers: validPhones,
                                                        preferred_comms: wlPreferredComms,
                                                        payment_status: 'waitlist',
                                                        created_at_melb: new Date().toLocaleString('en-AU', {
                                                            timeZone: 'Australia/Melbourne',
                                                            hour12: true,
                                                            year: 'numeric', month: '2-digit', day: '2-digit',
                                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                        })
                                                    };

                                                    if (cohortId) {
                                                        const { error } = await supabase
                                                            .from('official_cohort_2026')
                                                            .update(onboardingData)
                                                            .eq('id', cohortId);
                                                        if (error) throw error;
                                                    }

                                                    setWaitlistOnboardingComplete(true);
                                                } catch (err) {
                                                    console.error('Waitlist onboarding error:', err);
                                                    setWaitlistError('Something went wrong. Please try again.');
                                                } finally {
                                                    setWaitlistSubmitting(false);
                                                }
                                            }}
                                            disabled={waitlistSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-rr-pink to-rr-blue text-white font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {waitlistSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Preferences'
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default MasterCheckout;
