import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabase';
import DateOfBirthInput from './DateOfBirthInput';

const StatusModal = ({ type, isOpen, onClose }) => {
    const isSuccess = type === 'success';
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl text-center"
                    >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isSuccess ? (
                                <Check className="w-10 h-10 text-green-600" />
                            ) : (
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-rr-dark mb-3">
                            {isSuccess ? 'RECEIVED!' : 'OOPS!'}
                        </h3>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            {isSuccess
                                ? "Your application has been successfully received. We are currently assessing applications daily and as such invitations to our assessment session on Sunday March 1st will be extended by latest February 25th for those being considered for an Elite Program offer."
                                : "Something went wrong submitting your application. Please check your internet connection and try again."}
                        </p>
                        <Button onClick={onClose} className="w-full">
                            {isSuccess ? 'AWESOME' : 'TRY AGAIN'}
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const InputField = ({ label, type = "text", placeholder, name, value, onChange, required = false }) => (
    <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            {label} {required && <span className="text-rr-pink">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400"
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, limit = 150 }) => {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    const isOverLimit = wordCount > limit;

    return (
        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                {label}
                <span className={`float-right text-xs normal-case ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {wordCount}/{limit} words
                </span>
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all text-rr-dark placeholder-slate-400 h-32 ${isOverLimit
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-rr-pink focus:ring-rr-pink/20'
                    }`}
                placeholder={placeholder}
            />
            {isOverLimit && <p className="text-red-500 text-xs mt-1">Please keep your response under {limit} words.</p>}
        </div>
    );
};

const calculateAge = (dobString) => {
    const [year, month, day] = dobString.split('-').map(Number);
    if (!year || !month || !day) return null;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? age : null;
};

const Apply = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        dob: '',
        email: '',
        phone: '',
        suburb: '',
        profileLink: '',
        club: '',
        history: '',
        bio: '',
        goals: '',
        parent1Name: '',
        parent1Email: '',
        parent1Phone: '',
        parent2Name: '',
        parent2Email: '',
        parent2Phone: ''
    });
    const [cvFile, setCvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptComms, setAcceptComms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        setStatus(null);

        // Validation for word limits
        const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
        if (getWordCount(formData.bio) > 150 || getWordCount(formData.goals) > 150) {
            alert("Please ensure your Bio and Career Goals are under 150 words.");
            setLoading(false);
            return;
        }

        // Validate player contact details if over 18
        const isUnder18 = formData.age && parseInt(formData.age) < 18;
        if (!isUnder18) {
            if (!formData.email || !formData.phone) {
                alert("Please provide your email and phone number (Required for applicants 18+).");
                setLoading(false);
                return;
            }
        } else {
            // Ensure under 18s don't submit their own email/phone
            formData.email = '';
            formData.phone = '';
        }

        try {
            let cvUrl = null;

            if (cvFile) {
                const fileExt = cvFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('cvs')
                    .upload(fileName, cvFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('cvs').getPublicUrl(fileName);
                cvUrl = data.publicUrl;
            }

            // Enhanced data object with file URL
            const finalSubmissionData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                age: formData.age ? parseInt(formData.age) : null,
                dob: formData.dob || null,
                email: formData.email,
                phone: formData.phone,
                suburb: formData.suburb,
                profile_link: formData.profileLink,
                club: formData.club,
                history: formData.history,
                bio: formData.bio,
                goals: formData.goals,
                cv_url: cvUrl,
                parent1_name: formData.parent1Name,
                parent1_email: formData.parent1Email,
                parent1_phone: formData.parent1Phone,
                parent2_name: formData.parent2Name,
                parent2_email: formData.parent2Email,
                parent2_phone: formData.parent2Phone
            };

            const { error: insertError } = await supabase
                .from('applications')
                .insert([finalSubmissionData]);

            if (insertError) throw insertError;

            setStatus('success');
            setFormData({
                firstName: '', lastName: '', age: '', dob: '', email: '', phone: '', suburb: '',
                profileLink: '', club: '', history: '', bio: '', goals: '',
                parent1Name: '', parent1Email: '', parent1Phone: '',
                parent2Name: '', parent2Email: '', parent2Phone: ''
            });
            setCvFile(null);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert(`Application Error: ${error.message || 'Please check your connection.'}`);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 relative" id="apply-form">
            <div className="container mx-auto px-6 max-w-2xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue mb-6">
                        START YOUR JOURNEY
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">
                        Ready to take your next step? Fill out the form below to apply for the Rajasthan Royals Academy Melbourne Elite Program.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                    <StatusModal
                        type={status}
                        isOpen={status === 'success' || status === 'error'}
                        onClose={() => setStatus(null)}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <DateOfBirthInput
                            value={formData.dob}
                            onChange={(val) => {
                                const age = val ? calculateAge(val) : '';
                                setFormData(prev => ({ ...prev, dob: val, age: age !== null ? String(age) : '' }));
                            }}
                            required
                        />
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Age <span className="text-rr-pink">*</span>
                            </label>
                            <div className={`w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-rr-dark font-medium ${formData.age ? '' : 'text-slate-400 italic'
                                }`}>
                                {formData.age ? `${formData.age} years old` : 'Calculated from DOB'}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Player Email {formData.age && parseInt(formData.age) < 18 ? <span className="text-red-500 font-normal lowercase">(Not collected for Under 18s)</span> : <span className="text-rr-pink">*</span>}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.age && parseInt(formData.age) < 18 ? '' : formData.email}
                                onChange={handleChange}
                                disabled={formData.age && parseInt(formData.age) < 18}
                                required={!formData.age || parseInt(formData.age) >= 18}
                                placeholder={formData.age && parseInt(formData.age) < 18 ? "Disabled for Under 18s" : ""}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400 disabled:opacity-50 disabled:bg-slate-200 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Player Phone Number {formData.age && parseInt(formData.age) < 18 ? <span className="text-red-500 font-normal lowercase">(Not collected for Under 18s)</span> : <span className="text-rr-pink">*</span>}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.age && parseInt(formData.age) < 18 ? '' : formData.phone}
                                onChange={handleChange}
                                disabled={formData.age && parseInt(formData.age) < 18}
                                required={!formData.age || parseInt(formData.age) >= 18}
                                placeholder={formData.age && parseInt(formData.age) < 18 ? "Disabled for Under 18s" : ""}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400 disabled:opacity-50 disabled:bg-slate-200 disabled:cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-slate-400 -mt-4 mb-6 italic">* Player email and phone number are required for applicants aged 18 and over only.</p>
                    </div>

                    <InputField label="Primary Residential Suburb" name="suburb" value={formData.suburb} onChange={handleChange} required />

                    <div className="my-8 border-t border-slate-100 pt-8">
                        <h3 className="text-xl font-black text-rr-dark mb-6">PARENT / GUARDIAN DETAILS</h3>

                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-rr-pink mb-4 uppercase tracking-wider">Parent / Guardian 1</h4>
                            <div className="grid md:grid-cols-3 gap-6">
                                <InputField label="Name" name="parent1Name" value={formData.parent1Name} onChange={handleChange} required />
                                <InputField label="Email" name="parent1Email" value={formData.parent1Email} onChange={handleChange} required />
                                <InputField label="Phone" name="parent1Phone" value={formData.parent1Phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-rr-pink mb-4 uppercase tracking-wider">Parent / Guardian 2</h4>
                            <div className="grid md:grid-cols-3 gap-6">
                                <InputField label="Name" name="parent2Name" value={formData.parent2Name} onChange={handleChange} />
                                <InputField label="Email" name="parent2Email" value={formData.parent2Email} onChange={handleChange} />
                                <InputField label="Phone" name="parent2Phone" value={formData.parent2Phone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <InputField label="Play Cricket Profile Link" name="profileLink" value={formData.profileLink} onChange={handleChange} />
                    <InputField label="Current Club(s)" name="club" value={formData.club} onChange={handleChange} required />

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Representative History</label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-all text-rr-dark placeholder-slate-400 h-32"
                            placeholder="List your representative achievements..."
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <TextAreaField
                            label="Written Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            limit={150}
                        />
                        <TextAreaField
                            label="Career Goals"
                            name="goals"
                            value={formData.goals}
                            onChange={handleChange}
                            placeholder="Where do you want to be in 5 years?"
                            limit={150}
                        />
                    </div>

                    <div className="mb-4 pt-6 border-t border-slate-100">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-start mt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-slate-300 rounded peer-checked:bg-rr-pink peer-checked:border-rr-pink transition-all flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <span className="text-sm text-slate-600 leading-relaxed font-medium">
                                I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-blue hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-blue hover:underline">Privacy Policy</a>. I confirm that all information provided is accurate.
                                {formData.age && parseInt(formData.age) < 18 && (
                                    <strong className="text-rr-pink block mt-1">
                                        As the applicant is under 18, this application must be completed by a parent or legal guardian.
                                    </strong>
                                )}
                            </span>
                        </label>
                    </div>

                    <div className="mb-8">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-start mt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptComms}
                                    onChange={(e) => setAcceptComms(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-slate-300 rounded peer-checked:bg-rr-pink peer-checked:border-rr-pink transition-all flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <span className="text-sm text-slate-600 leading-relaxed font-medium">
                                I confirm that I am over 18 years of age, or that this form is being submitted by a parent or legal guardian on behalf of a minor. I am happy to receive newsletters, program updates, and other information from Rajasthan Royals Academy Melbourne in the future.
                            </span>
                        </label>
                    </div>

                    <Button className="w-full py-4 text-xl" disabled={loading || !acceptTerms || !acceptComms}>
                        {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default Apply;
