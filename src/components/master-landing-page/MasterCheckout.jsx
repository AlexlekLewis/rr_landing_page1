import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DEPOSIT_URL = 'https://buy.stripe.com/6oU3cvfY58Ox91q9rR9Zm05';
const FULL_URL    = 'https://buy.stripe.com/bJe14nbHP3ud91q8nN9Zm00';

/* ───── helpers ───── */
const calculateAge = (dobString) => {
    const [year, month, day] = dobString.split('-').map(Number);
    if (!year || !month || !day) return null;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? age : null;
};

const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

/* ───── sub-components (dark theme) ───── */
const DarkInput = ({ label, required, children, className = '' }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        {children}
    </div>
);

const inputClass = 'bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/[0.08] transition-colors';
const selectClass = 'bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-rr-pink/60 transition-colors appearance-none';
const textareaClass = 'bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/[0.08] transition-colors h-32 resize-none';

const ComplianceCheckbox = ({ checked, onChange, children }) => (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shrink-0 mt-0.5 ${checked ? 'bg-rr-pink border-rr-pink' : 'bg-white/5 border-white/30 group-hover:border-white/50'}`}>
            {checked && <span className="text-xs text-white font-bold">✓</span>}
        </div>
        <span className="text-sm text-white/60 leading-relaxed">{children}</span>
    </label>
);

/* ───── DOB dropdowns (dark theme) ───── */
const DarkDateOfBirth = ({ value, onChange }) => {
    const getInitialParts = () => {
        if (!value) return { day: '', month: '', year: '' };
        const parts = value.split('-');
        return { year: parts[0] || '', month: parts[1] || '', day: parts[2] || '' };
    };
    const [dateParts, setDateParts] = React.useState(getInitialParts());

    React.useEffect(() => {
        const p = getInitialParts();
        if (p.year !== dateParts.year || p.month !== dateParts.month || p.day !== dateParts.day) setDateParts(p);
    }, [value]);

    const handleChange = (part, v) => {
        const np = { ...dateParts, [part]: v };
        setDateParts(np);
        if (np.day && np.month && np.year) onChange(`${np.year}-${np.month}-${np.day}`);
        else if (!np.day && !np.month && !np.year) onChange('');
    };

    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const months = [
        { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
        { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
        { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
        { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

    return (
        <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                Date of Birth <span className="text-rr-pink">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
                <select value={dateParts.day} onChange={(e) => handleChange('day', e.target.value)} className={selectClass}>
                    <option value="" className="bg-rr-dark">Day</option>
                    {days.map(d => <option key={d} value={d} className="bg-rr-dark">{d}</option>)}
                </select>
                <select value={dateParts.month} onChange={(e) => handleChange('month', e.target.value)} className={selectClass}>
                    <option value="" className="bg-rr-dark">Month</option>
                    {months.map(m => <option key={m.value} value={m.value} className="bg-rr-dark">{m.label}</option>)}
                </select>
                <select value={dateParts.year} onChange={(e) => handleChange('year', e.target.value)} className={selectClass}>
                    <option value="" className="bg-rr-dark">Year</option>
                    {years.map(y => <option key={y} value={y} className="bg-rr-dark">{y}</option>)}
                </select>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════
   MASTER CHECKOUT — REGISTRATION + SECURE MY SPOT
   ═══════════════════════════════════════════════════════════ */
const MasterCheckout = () => {
    /* ── state ── */
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Player details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [suburb, setSuburb] = useState('');
    const [profileLink, setProfileLink] = useState('');
    const [club, setClub] = useState('');
    const [history, setHistory] = useState('');
    const [bio, setBio] = useState('');
    const [goals, setGoals] = useState('');
    const [cricketType, setCricketType] = useState('');

    // Parent / guardian
    const [parent1Name, setParent1Name] = useState('');
    const [parent1Email, setParent1Email] = useState('');
    const [parent1Phone, setParent1Phone] = useState('');
    const [parent2Name, setParent2Name] = useState('');
    const [parent2Email, setParent2Email] = useState('');
    const [parent2Phone, setParent2Phone] = useState('');

    // CV
    const [cvFile, setCvFile] = useState(null);

    // Compliance
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);

    /* ── derived ── */
    const age = dob ? calculateAge(dob) : null;
    const isUnder18 = age !== null && age < 18;

    /* ── validation ── */
    const isFormValid = () => {
        // Core player
        if (!firstName.trim() || !lastName.trim() || !dob || age === null) return false;
        if (!cricketType) return false;
        if (!suburb.trim() || !club.trim()) return false;

        // Player contact (18+ only)
        if (!isUnder18) {
            if (!email.trim() || !email.includes('@') || !phone.trim()) return false;
        }

        // Word limits
        if (getWordCount(bio) > 150 || getWordCount(goals) > 150) return false;

        // Parent 1 required
        if (!parent1Name.trim() || !parent1Email.trim() || !parent1Phone.trim()) return false;

        // Compliance — all four required
        if (!acceptTerms || !acceptPlayerCode || !acceptParentCode || !acceptSocialMedia) return false;

        return true;
    };

    const valid = isFormValid();

    /* ── submit ── */
    const handleSubmit = async () => {
        if (!valid || loading) return;
        setLoading(true);
        setSubmitError('');

        try {
            // CV upload
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
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                age: age,
                dob: dob || null,
                email: isUnder18 ? '' : email.trim(),
                phone: isUnder18 ? '' : phone.trim(),
                suburb: suburb.trim(),
                profile_link: profileLink.trim(),
                club: club.trim(),
                history: history.trim(),
                bio: bio.trim(),
                goals: goals.trim(),
                cv_url: cvUrl,
                cricket_type: cricketType,
                parent1_name: parent1Name.trim(),
                parent1_email: parent1Email.trim(),
                parent1_phone: parent1Phone.trim(),
                parent2_name: parent2Name.trim(),
                parent2_email: parent2Email.trim(),
                parent2_phone: parent2Phone.trim(),
                source: 'master_landing_page'
            };

            const { error } = await supabase.from('applications').insert([payload]);
            if (error) throw error;

            setSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitError('Something went wrong submitting your details. Please try again or contact us.');
        } finally {
            setLoading(false);
        }
    };

    /* ═══════ RENDER ═══════ */
    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden" id="checkout">

            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rr-pink/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rr-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* Header */}
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
                        Secure your spot in the Season 1 Elite intake. Complete your registration below, then select your preferred payment option to proceed.
                    </p>
                    {/* Deadline banner */}
                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2.5 mt-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-wide sm:tracking-widest">
                            Entry closes 5pm · March 20, 2026 — or when full
                        </span>
                    </div>
                </motion.div>

                {/* Please Note box */}
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

                {/* ═══ ERROR MESSAGE ═══ */}
                <AnimatePresence>
                    {submitError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                            <div className="p-4 bg-red-500/20 border border-red-400/40 text-red-300 rounded-xl font-medium text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{submitError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ REGISTRATION FORM ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
                >
                    {/* Section: Player Details */}
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Player Details</h4>
                    <p className="text-xs text-white/40 mb-6">Please complete all fields before proceeding to payment.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DarkInput label="Player First Name" required>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className={inputClass} />
                        </DarkInput>
                        <DarkInput label="Player Last Name" required>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className={inputClass} />
                        </DarkInput>

                        <DarkDateOfBirth value={dob} onChange={setDob} />

                        {age !== null && (
                            <div className="md:col-span-2">
                                <span className="text-xs text-white/40">Age: <span className="text-white font-bold">{age}</span></span>
                            </div>
                        )}
                    </div>

                    {/* Male / Female Cricket */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
                            Do you play Male or Female Cricket? <span className="text-rr-pink">*</span>
                        </label>
                        <div className="flex gap-4">
                            {['Male Cricket', 'Female Cricket'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="cricketType" value={opt} checked={cricketType === opt} onChange={(e) => setCricketType(e.target.value)} className="w-4 h-4 accent-rr-pink" />
                                    <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Player contact — 18+ only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DarkInput label={`Player Email${isUnder18 ? ' (not collected for Under 18s)' : ''}`} required={!isUnder18}>
                            <input
                                type="email"
                                value={isUnder18 ? '' : email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isUnder18}
                                placeholder={isUnder18 ? 'Disabled for Under 18s' : 'john@example.com'}
                                className={`${inputClass} ${isUnder18 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            />
                        </DarkInput>
                        <DarkInput label={`Player Phone${isUnder18 ? ' (not collected for Under 18s)' : ''}`} required={!isUnder18}>
                            <input
                                type="tel"
                                value={isUnder18 ? '' : phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isUnder18}
                                placeholder={isUnder18 ? 'Disabled for Under 18s' : '0400 000 000'}
                                className={`${inputClass} ${isUnder18 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            />
                        </DarkInput>
                    </div>
                    {isUnder18 && (
                        <p className="text-xs text-white/30 italic mb-6">Player email and phone number are required for applicants aged 18 and over only.</p>
                    )}

                    <DarkInput label="Primary Residential Suburb" required className="mb-6">
                        <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Richmond" className={inputClass} />
                    </DarkInput>

                    <div className="md:col-span-2 border-t border-white/10 my-6" />

                    {/* Parent / Guardian */}
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-4">Parent / Guardian Details</h4>

                    <p className="text-xs font-bold text-rr-pink uppercase tracking-wider mb-3">Parent / Guardian 1 <span className="text-white/50">(Required)</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <DarkInput label="Name" required>
                            <input type="text" value={parent1Name} onChange={(e) => setParent1Name(e.target.value)} className={inputClass} />
                        </DarkInput>
                        <DarkInput label="Email" required>
                            <input type="email" value={parent1Email} onChange={(e) => setParent1Email(e.target.value)} className={inputClass} />
                        </DarkInput>
                        <DarkInput label="Phone" required>
                            <input type="tel" value={parent1Phone} onChange={(e) => setParent1Phone(e.target.value)} className={inputClass} />
                        </DarkInput>
                    </div>

                    <p className="text-xs font-bold text-rr-pink uppercase tracking-wider mb-3">Parent / Guardian 2 <span className="text-white/30">(Optional)</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <DarkInput label="Name">
                            <input type="text" value={parent2Name} onChange={(e) => setParent2Name(e.target.value)} className={inputClass} />
                        </DarkInput>
                        <DarkInput label="Email">
                            <input type="email" value={parent2Email} onChange={(e) => setParent2Email(e.target.value)} className={inputClass} />
                        </DarkInput>
                        <DarkInput label="Phone">
                            <input type="tel" value={parent2Phone} onChange={(e) => setParent2Phone(e.target.value)} className={inputClass} />
                        </DarkInput>
                    </div>

                    <div className="md:col-span-2 border-t border-white/10 my-6" />

                    {/* Cricket background */}
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-4">Cricket Background</h4>

                    <DarkInput label="Play Cricket Profile Link" className="mb-4">
                        <input type="text" value={profileLink} onChange={(e) => setProfileLink(e.target.value)} placeholder="https://www.playcricket.com.au/..." className={inputClass} />
                    </DarkInput>

                    <DarkInput label="Current Club(s)" required className="mb-4">
                        <input type="text" value={club} onChange={(e) => setClub(e.target.value)} placeholder="e.g. Melbourne Cricket Club" className={inputClass} />
                    </DarkInput>

                    <DarkInput label="Representative History" className="mb-4">
                        <textarea value={history} onChange={(e) => setHistory(e.target.value)} placeholder="List your representative achievements..." className={textareaClass} />
                    </DarkInput>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DarkInput label={`Written Bio (${getWordCount(bio)}/150 words)`}>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className={`${textareaClass} ${getWordCount(bio) > 150 ? 'border-red-400/60' : ''}`} />
                            {getWordCount(bio) > 150 && <p className="text-red-400 text-xs mt-1">Please keep under 150 words.</p>}
                        </DarkInput>
                        <DarkInput label={`Career Goals (${getWordCount(goals)}/150 words)`}>
                            <textarea value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Where do you want to be in 5 years?" className={`${textareaClass} ${getWordCount(goals) > 150 ? 'border-red-400/60' : ''}`} />
                            {getWordCount(goals) > 150 && <p className="text-red-400 text-xs mt-1">Please keep under 150 words.</p>}
                        </DarkInput>
                    </div>

                    {/* CV Upload */}
                    <DarkInput label="Upload CV / Cricketing Resume (optional)" className="mb-2">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => e.target.files?.[0] && setCvFile(e.target.files[0])}
                            className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-white/10 file:text-white/70 hover:file:bg-white/20 file:cursor-pointer file:transition-colors"
                        />
                        {cvFile && <p className="text-xs text-rr-blue mt-1">Selected: {cvFile.name}</p>}
                    </DarkInput>
                </motion.div>

                {/* ═══ COMPLIANCE CHECKBOXES ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
                >
                    <h4 className="text-sm font-black text-white uppercase tracking-wide mb-4">Compliance & Policies</h4>

                    <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms}>
                        I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                        {isUnder18 && (
                            <span className="block text-rr-pink font-bold mt-1 text-xs">
                                As the applicant is under 18, this application must be completed by a parent or legal guardian.
                            </span>
                        )}
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
                </motion.div>

                {/* ═══ SAVE & PAY ═══ */}
                {!submitted ? (
                    <>
                        {/* Save registration button */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                            className="mb-6"
                        >
                            <button
                                onClick={handleSubmit}
                                disabled={!valid || loading}
                                className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${valid && !loading
                                    ? 'bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-[0_0_32px_rgba(229,6,149,0.4)] cursor-pointer'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Registration & Proceed to Payment'
                                )}
                            </button>
                            {!valid && (
                                <p className="text-center text-xs text-white/30 mt-2">Please complete all required fields and accept all compliance documents to proceed.</p>
                            )}
                        </motion.div>
                    </>
                ) : (
                    <>
                        {/* Success state — show Stripe buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-green-500/10 border border-green-400/30 rounded-2xl p-6 mb-8 flex items-start gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Registration Saved!</h4>
                                <p className="text-sm text-white/55 leading-relaxed">
                                    Your details have been submitted successfully. Now select your preferred payment option below to secure your place.
                                </p>
                            </div>
                        </motion.div>

                        {/* Payment buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                        >
                            {/* Pay in Full */}
                            <a
                                href={FULL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
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
                                href={DEPOSIT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
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
                    </>
                )}

                {/* Afterpay note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="text-center text-white/40 text-xs font-medium mb-8"
                >
                    Afterpay also available at checkout. Questions about payments or other payment options?{' '}
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
        </section>
    );
};

export default MasterCheckout;
