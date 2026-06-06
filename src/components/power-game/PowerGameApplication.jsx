import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';

/* ─── helpers ─── */
const calculateAge = (dobString) => {
    if (!dobString) return null;
    const [year, month, day] = dobString.split('-').map(Number);
    if (!year || !month || !day) return null;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? age : null;
};

const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

/* ─── reusable fields ─── */
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
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rr-pink/60 focus:bg-white/[0.08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:bg-white/[0.08] transition-colors resize-none ${isOverLimit ? 'border-red-400/60 focus:border-red-400' : 'border-white/15 focus:border-rr-pink/60'}`}
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

const PowerGameApplication = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', email: '', phone: '',
        suburb: '', profileLink: '', club: '', bio: '', goals: '',
        parent1Name: '', parent1Email: '', parent1Phone: '',
        parent2Name: '', parent2Email: '', parent2Phone: '',
    });
    const [cricketGender, setCricketGender] = useState('');
    const [cvFile, setCvFile] = useState(null);

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [acceptPlayingStandard, setAcceptPlayingStandard] = useState(false);

    const age = formData.dob ? calculateAge(formData.dob) : null;
    const isUnder18 = age !== null && age < 18;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleDobChange = (val) => setFormData((prev) => ({ ...prev, dob: val }));

    const isFormValid = () => {
        const d = formData;
        const hasCore = d.firstName.trim() && d.lastName.trim() && d.dob;
        const hasParent1 = d.parent1Name.trim() && d.parent1Email.trim() && d.parent1Phone.trim();
        const hasClub = d.club.trim();
        const hasSuburb = d.suburb.trim();
        const hasGender = !!cricketGender;
        const hasPlayerContact = isUnder18 ? true : (d.email.trim() && d.phone.trim());
        const hasConsents = acceptTerms && acceptPlayerCode && acceptParentCode && acceptSocialMedia && acceptPlayingStandard;
        const withinWordLimits = getWordCount(d.bio) <= 150 && getWordCount(d.goals) <= 150;
        return hasCore && hasParent1 && hasClub && hasSuburb && hasGender && hasPlayerContact && hasConsents && withinWordLimits;
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            setSubmitError('Please complete all required fields and accept all compliance documents before submitting.');
            document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
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

            const utmParams = new URLSearchParams(window.location.search);

            const applicationsPayload = {
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                age,
                dob: formData.dob || null,
                email: isUnder18 ? '' : formData.email.trim(),
                phone: isUnder18 ? '' : formData.phone.trim(),
                suburb: formData.suburb.trim(),
                profile_link: formData.profileLink.trim(),
                club: formData.club.trim(),
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
                source: 'power-game-program',
                utm_source: utmParams.get('utm_source') || null,
                utm_medium: utmParams.get('utm_medium') || null,
                utm_campaign: utmParams.get('utm_campaign') || null,
                page_referrer: document.referrer || null,
            };

            const { error: appError } = await supabase.from('applications').insert([applicationsPayload]);
            if (appError) throw appError;

            // 2. Dedicated Power Game table — drives the Google Sheet sync.
            //    Independent try/catch so a failure here doesn't block the
            //    dashboard insert above (dual-write pattern).
            try {
                const pgPayload = {
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    player_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                    dob: formData.dob || null,
                    age,
                    cricket_type: cricketGender,
                    email: isUnder18 ? '' : formData.email.trim(),
                    phone: isUnder18 ? '' : formData.phone.trim(),
                    suburb: formData.suburb.trim(),
                    profile_link: formData.profileLink.trim(),
                    club: formData.club.trim(),
                    bio: formData.bio.trim(),
                    goals: formData.goals.trim(),
                    cv_url: cvUrl,
                    parent1_name: formData.parent1Name.trim(),
                    parent1_email: formData.parent1Email.trim(),
                    parent1_phone: formData.parent1Phone.trim(),
                    parent2_name: formData.parent2Name.trim(),
                    parent2_email: formData.parent2Email.trim(),
                    parent2_phone: formData.parent2Phone.trim(),
                    phase: 'Preseason',
                    accept_terms: acceptTerms,
                    accept_player_code: acceptPlayerCode,
                    accept_parent_code: acceptParentCode,
                    accept_social_media: acceptSocialMedia,
                    accept_playing_standard: acceptPlayingStandard,
                    status: 'pending',
                    source: 'power-game-program',
                    utm_source: utmParams.get('utm_source') || null,
                    utm_medium: utmParams.get('utm_medium') || null,
                    utm_campaign: utmParams.get('utm_campaign') || null,
                    page_referrer: document.referrer || null,
                };
                const { error: pgError } = await supabase.from('power_game_applications').insert([pgPayload]);
                if (pgError) console.error('power_game_applications insert failed:', pgError);
            } catch (pgErr) {
                console.error('power_game_applications insert threw:', pgErr);
            }

            setSubmitted(true);
            window.scrollTo({ top: document.getElementById('apply')?.offsetTop - 80, behavior: 'smooth' });
        } catch (err) {
            console.error('Power Game application error:', err);
            setSubmitError('Something went wrong submitting your application. Please try again or contact us.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── success state ── */
    if (submitted) {
        return (
            <section id="apply" className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-rr-pink/15 border border-rr-pink/40 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-rr-pink" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide mb-4">
                            Application <span className="text-rr-pink">Received</span>
                        </h2>
                        <p className="text-white/70 font-medium leading-relaxed">
                            Thank you. Your application for the Power Game Program has been submitted. Our team will review it against the program's minimum standard and be in touch shortly with next steps.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="apply" className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,31,143,0.15) 0%, rgba(0,0,0,0) 55%)' }}
            />

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Preseason</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        Apply <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Now</span>
                    </h2>
                    <p className="text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
                        Places are subject to meeting the program's minimum standard. Complete your application below.
                    </p>
                </motion.div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-10 space-y-12">
                    {/* ── Player Details ── */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Player Details</h4>
                        <p className="text-xs text-white/40 mb-6">All fields marked with * are required.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Player First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            <InputField label="Player Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">
                                Date of Birth <span className="text-rr-pink">*</span>
                            </label>
                            <DateOfBirthInput value={formData.dob} onChange={handleDobChange} required />
                            {age !== null && (
                                <p className="text-xs text-white/40 mt-2">Age: <span className="text-white/70 font-bold">{age}</span></p>
                            )}
                        </div>

                        {/* Male / Female cricket */}
                        <div className="mt-5">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-3">
                                Do you play Male or Female Cricket? <span className="text-rr-pink">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Male Cricket', 'Female Cricket'].map((opt) => {
                                    const active = cricketGender === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setCricketGender(opt)}
                                            className={`px-4 py-3 rounded-xl border text-sm font-bold uppercase tracking-wide transition-all ${
                                                active
                                                    ? 'bg-rr-pink border-rr-pink text-white'
                                                    : 'bg-white/5 border-white/15 text-white/60 hover:border-white/40'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                            <InputField
                                label={`Player Email${isUnder18 ? ' (Not collected for Under 18s)' : ''}`}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required={!isUnder18}
                                disabled={isUnder18}
                            />
                            <InputField
                                label={`Player Phone${isUnder18 ? ' (Not collected for Under 18s)' : ''}`}
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required={!isUnder18}
                                disabled={isUnder18}
                            />
                        </div>

                        <div className="mt-4">
                            <InputField label="Primary Residential Suburb" name="suburb" value={formData.suburb} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* ── Parent / Guardian ── */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Parent / Guardian Details</h4>
                        <p className="text-xs text-white/40 mb-6">Required for the primary parent / guardian.</p>

                        <p className="text-xs font-bold text-rr-pink uppercase tracking-wider mb-3">Parent / Guardian 1</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField label="Name" name="parent1Name" value={formData.parent1Name} onChange={handleChange} required />
                            <InputField label="Email" type="email" name="parent1Email" value={formData.parent1Email} onChange={handleChange} required />
                            <InputField label="Phone" type="tel" name="parent1Phone" value={formData.parent1Phone} onChange={handleChange} required />
                        </div>

                        <p className="text-xs font-bold text-rr-blue uppercase tracking-wider mb-3 mt-6">
                            Parent / Guardian 2 <span className="text-white/30 normal-case">(Optional)</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField label="Name" name="parent2Name" value={formData.parent2Name} onChange={handleChange} />
                            <InputField label="Email" type="email" name="parent2Email" value={formData.parent2Email} onChange={handleChange} />
                            <InputField label="Phone" type="tel" name="parent2Phone" value={formData.parent2Phone} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ── Cricket Profile ── */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-1">Cricket Profile</h4>
                        <p className="text-xs text-white/40 mb-6">Help us understand your cricket background.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Play Cricket Profile Link" name="profileLink" value={formData.profileLink} onChange={handleChange} placeholder="https://..." />
                            <InputField label="Current Club(s)" name="club" value={formData.club} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <TextAreaField label="Written Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." limit={150} />
                            <TextAreaField label="Career Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="Where do you want to be in 5 years?" limit={150} />
                        </div>

                        {/* CV upload */}
                        <div className="mt-5">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1.5">
                                Cricket CV <span className="text-white/30 normal-case">(Optional — PDF, DOC)</span>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-rr-pink/15 file:text-rr-pink hover:file:bg-rr-pink/25 file:cursor-pointer cursor-pointer"
                            />
                            {cvFile && <p className="text-xs text-white/50 mt-2">Selected: {cvFile.name}</p>}
                        </div>
                    </div>

                    {/* ── Compliance ── */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide mb-6">Compliance &amp; Policies</h4>
                        <div className="space-y-5">
                            <ComplianceCheckbox checked={acceptPlayingStandard} onChange={setAcceptPlayingStandard}>
                                I understand places on the Power Game Program are subject to meeting the program's minimum playing standard.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms}>
                                I have read and agree to the <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
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
                    </div>

                    {/* Submit */}
                    <div>
                        {submitError && (
                            <p className="text-red-400 text-sm font-medium mb-4 text-center">{submitError}</p>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                        <p className="text-[11px] text-white/40 text-center mt-4">
                            Questions? <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-blue hover:text-white transition-colors underline underline-offset-2">Contact us.</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PowerGameApplication;
