import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';


const AssessmentRSVP = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptComms, setAcceptComms] = useState(false);
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Identity fields (collected in popup)
    const [playerName, setPlayerName] = useState('');
    const [parentName, setParentName] = useState('');
    const [email, setEmail] = useState('');

    // Option 1 sub-question state
    const [selectedTime, setSelectedTime] = useState('');
    const [excitedReason, setExcitedReason] = useState('');

    // Option 3 sub-question state
    const [consideringReasons, setConsideringReasons] = useState([]);
    const [consideringOther, setConsideringOther] = useState('');

    // Option 4 sub-question state
    const [declineReasons, setDeclineReasons] = useState([]);
    const [declineOther, setDeclineOther] = useState('');

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const toggleCheckbox = (list, setList, value) => {
        setList(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const isFormValid = () => {
        if (!acceptTerms || !acceptComms || !selectedOption) return false;
        if (selectedOption === 1 && (!selectedTime || !excitedReason)) return false;
        if (selectedOption === 3 && consideringReasons.length === 0) return false;
        if (selectedOption === 3 && consideringReasons.includes('Other') && !consideringOther) return false;
        if (selectedOption === 4 && declineReasons.length === 0) return false;
        if (selectedOption === 4 && declineReasons.includes('Other') && !declineOther) return false;
        return true;
    };

    const isIdentityValid = () => {
        return playerName.trim() && parentName.trim() && email.trim() && email.includes('@');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Open the identity modal instead of submitting directly
        setShowIdentityModal(true);
        setSubmitError('');
    };

    const handleFinalSubmit = async () => {
        if (!isIdentityValid()) return;
        setIsSubmitting(true);
        setSubmitError('');

        const optionLabels = {
            1: "Yes, we would welcome an offer and are available to attend the assessment on Sunday",
            2: "Yes, we would welcome an offer, however we are unable to attend on Sunday",
            3: "I'm still considering whether this program is the right fit",
            4: "No, we are not ready for this opportunity at this time"
        };

        try {
            const payload = {
                player_name: playerName.trim(),
                parent_name: parentName.trim(),
                email: email.trim().toLowerCase(),
                selected_option: selectedOption,
                option_label: optionLabels[selectedOption],
                selected_time: selectedOption === 1 ? selectedTime : null,
                excited_reason: selectedOption === 1 ? excitedReason : null,
                considering_reasons: selectedOption === 3 ? consideringReasons : null,
                considering_other: selectedOption === 3 && consideringReasons.includes('Other') ? consideringOther : null,
                decline_reasons: selectedOption === 4 ? declineReasons : null,
                decline_other: selectedOption === 4 && declineReasons.includes('Other') ? declineOther : null,
                accepted_terms: acceptTerms,
                accepted_comms: acceptComms,
            };

            // Insert into Supabase
            const { error } = await supabase.from('rsvp_responses').insert(payload);
            if (error) throw error;

            // Fire webhook to Zapier (for Google Sheets routing) — fire and forget
            // Uses URL-encoded form data to avoid CORS preflight (Zapier doesn't support OPTIONS)
            const webhookUrl = import.meta.env.VITE_RSVP_WEBHOOK_URL;
            if (webhookUrl) {
                const formData = new URLSearchParams();
                Object.entries(payload).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, Array.isArray(value) ? value.join(', ') : String(value));
                    }
                });
                fetch(webhookUrl, {
                    method: 'POST',
                    body: formData,
                }).catch(err => console.warn('Zapier webhook warning:', err));
            }

            setIsSubmitting(false);
            setShowIdentityModal(false);
            setIsSubmitted(true);
        } catch (err) {
            console.error('RSVP submission error:', err);
            setSubmitError('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    const options = [
        {
            id: 1,
            label: "Yes, we would welcome an offer and are available to attend the assessment on Sunday",
            color: 'rr-pink'
        },
        {
            id: 2,
            label: "Yes, we would welcome an offer, however we are unable to attend on Sunday",
            color: 'rr-blue'
        },
        {
            id: 3,
            label: "I'm still considering whether this program is the right fit",
            color: 'amber-500'
        },
        {
            id: 4,
            label: "No, we are not ready for this opportunity at this time",
            color: 'slate-500'
        }
    ];

    const timeSlots = ['1:30 PM', '2:30 PM', '3:30 PM'];

    const consideringOptions = [
        "More detail on session content & structure",
        "Understanding the coaching methodology",
        "Clarity on scheduling & time commitment",
        "More information on the pathway opportunities",
        "Need to discuss with family",
        "Other"
    ];

    const declineOptions = [
        "Distance / Travel Requirements",
        "Schedule Conflicts (Days / Times)",
        "Committed to another program or squad",
        "Program Cost / Personal Finances",
        "I don't feel the program aligns with my current goals",
        "Other"
    ];

    if (isSubmitted) {
        return (
            <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-slate-200" id="rsvp">
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto text-center space-y-6 bg-white border border-slate-200 shadow-xl rounded-3xl p-12">
                    <div className="w-20 h-20 bg-rr-pink/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-rr-pink font-bold">✓</span>
                    </div>
                    {selectedOption === 1 ? (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Response Received</h2>
                            <p className="text-slate-600 text-lg">Thank you for confirming your availability. We look forward to seeing you at the assessment session. Parents or guardians of players under 18 will receive a confirmation message by Friday February 27 with your assigned session time.</p>
                        </>
                    ) : selectedOption === 2 ? (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Response Received</h2>
                            <p className="text-slate-600 text-lg">Thank you for letting us know. We understand scheduling can be challenging. Our team will be in touch via email to discuss alternative arrangements should an offer be extended.</p>
                        </>
                    ) : selectedOption === 3 ? (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Response Received</h2>
                            <p className="text-slate-600 text-lg">Thank you for your honesty. We understand this is an important decision. We will be in touch via email by Friday February 27 with additional information to help you decide.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Feedback Received</h2>
                            <p className="text-slate-600 text-lg">Thank you for letting us know and providing your feedback. We wish you the very best for the season ahead and hope to cross paths in the future.</p>
                        </>
                    )}
                </motion.div>
            </section>
        );
    }

    return (
        <>
            <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-slate-200" id="rsvp">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeIn} className="space-y-4 mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-rr-dark tracking-tight">Secure Your Spot</h2>
                        <p className="text-rr-pink font-bold text-base md:text-lg">
                            Spots for the Sunday assessment session are capped.
                        </p>
                        <p className="text-slate-600 font-medium text-lg max-w-2xl">
                            Please select the option that best reflects your current position and provide any relevant information.
                        </p>
                    </motion.div>

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        {/* Primary Options */}
                        <motion.div variants={fadeIn} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {options.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`
                                            relative flex items-start p-5 cursor-pointer rounded-2xl border transition-all duration-300
                                            ${selectedOption === option.id
                                                ? 'bg-rr-pink/10 border-rr-pink shadow-md'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="primary_option"
                                            value={option.id}
                                            checked={selectedOption === option.id}
                                            onChange={() => handleOptionChange(option.id)}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors bg-white
                                            ${selectedOption === option.id ? 'border-rr-pink' : 'border-slate-300'}
                                        `}>
                                            {selectedOption === option.id && (
                                                <div className="w-3 h-3 bg-rr-pink rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <span className={`text-base font-bold leading-snug block ${selectedOption === option.id ? 'text-rr-dark' : 'text-slate-600'}`}>
                                                {option.label}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </motion.div>

                        {/* ---- Option 1 Sub-Questions ---- */}
                        {selectedOption === 1 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-6 md:p-8 bg-rr-blue/5 border border-rr-blue/20 rounded-2xl space-y-6"
                            >
                                {/* Time Slot Picker */}
                                <div className="space-y-3">
                                    <label className="block text-rr-dark font-bold">Please choose a preferred time slot *</label>
                                    <div className="flex flex-wrap gap-3">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setSelectedTime(time)}
                                                className={`
                                                    px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 border
                                                    ${selectedTime === time
                                                        ? 'bg-rr-pink text-white border-rr-pink shadow-md'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-rr-pink hover:text-rr-dark'
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Excitement Question */}
                                <div className="space-y-2">
                                    <label className="block text-rr-dark font-bold">What element of the program are you most excited about? *</label>
                                    <textarea
                                        value={excitedReason}
                                        onChange={(e) => setExcitedReason(e.target.value)}
                                        placeholder="(e.g. Masterclasses, DNA Profile, Specialist Coaching, Pathway Opportunities...)"
                                        className="w-full bg-white shadow-inner border border-slate-200 rounded-xl p-4 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue min-h-[100px] resize-y"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ---- Option 3 Sub-Questions ---- */}
                        {selectedOption === 3 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-6 md:p-8 bg-amber-50 border border-amber-200 rounded-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <p className="text-rr-dark font-bold">We'd love to help you make the right decision.</p>
                                    <p className="text-slate-600 text-sm font-medium">What information or clarity would help you decide? Select all that apply.</p>
                                </div>

                                <div className="space-y-3">
                                    {consideringOptions.map((reason) => (
                                        <label key={reason} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex bg-white items-center justify-center shrink-0 transition-colors ${consideringReasons.includes(reason) ? 'border-amber-500 bg-amber-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                                {consideringReasons.includes(reason) && <span className="text-xs text-white font-bold">✓</span>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={consideringReasons.includes(reason)}
                                                onChange={() => toggleCheckbox(consideringReasons, setConsideringReasons, reason)}
                                                className="sr-only"
                                            />
                                            <span className={`text-base font-medium transition-colors ${consideringReasons.includes(reason) ? 'text-rr-dark font-bold' : 'text-slate-600 group-hover:text-rr-dark'}`}>
                                                {reason}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {consideringReasons.includes('Other') && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                                        <textarea
                                            value={consideringOther}
                                            onChange={(e) => setConsideringOther(e.target.value)}
                                            placeholder="Please tell us what would help you decide..."
                                            className="w-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[100px] resize-y"
                                            required
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* ---- Option 4 Sub-Questions ---- */}
                        {selectedOption === 4 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-6 md:p-8 bg-rr-pink/5 border border-rr-pink/20 rounded-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <p className="text-rr-dark font-bold">We understand, and we appreciate you letting us know.</p>
                                    <p className="text-slate-600 text-sm font-medium">To help us build better programs, could you share what factored into your decision? Select all that apply.</p>
                                </div>

                                <div className="space-y-3">
                                    {declineOptions.map((reason) => (
                                        <label key={reason} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex bg-white items-center justify-center shrink-0 transition-colors ${declineReasons.includes(reason) ? 'border-rr-pink bg-rr-pink' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                                {declineReasons.includes(reason) && <span className="text-xs text-white font-bold">✓</span>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={declineReasons.includes(reason)}
                                                onChange={() => toggleCheckbox(declineReasons, setDeclineReasons, reason)}
                                                className="sr-only"
                                            />
                                            <span className={`text-base font-medium transition-colors ${declineReasons.includes(reason) ? 'text-rr-dark font-bold' : 'text-slate-600 group-hover:text-rr-dark'}`}>
                                                {reason}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {declineReasons.includes('Other') && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                                        <textarea
                                            value={declineOther}
                                            onChange={(e) => setDeclineOther(e.target.value)}
                                            placeholder="Please let us know what influenced your decision..."
                                            className="w-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink min-h-[100px] resize-y"
                                            required
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Consent Checkbox 1 — Terms & Privacy */}
                        <motion.div variants={fadeIn} className="pt-8 border-t border-slate-200 space-y-4">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative flex items-start mt-1">
                                    <input
                                        type="checkbox"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm ${acceptTerms ? 'bg-rr-pink border-rr-pink' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                        {acceptTerms && <span className="text-xs text-white font-bold">✓</span>}
                                    </div>
                                </div>
                                <span className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                                    I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm my selection and that all information provided is accurate. If the participant is under 18, this form must be completed by a parent or legal guardian.
                                </span>
                            </label>

                            {/* Consent Checkbox 2 — Age & Communications */}
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative flex items-start mt-1">
                                    <input
                                        type="checkbox"
                                        checked={acceptComms}
                                        onChange={(e) => setAcceptComms(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm ${acceptComms ? 'bg-rr-pink border-rr-pink' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                        {acceptComms && <span className="text-xs text-white font-bold">✓</span>}
                                    </div>
                                </div>
                                <span className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                                    I confirm that I am over 18 years of age, or that this form is being submitted by a parent or legal guardian on behalf of a minor. I am happy to receive newsletters, program updates, and other information from Rajasthan Royals Academy Melbourne in the future.
                                </span>
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={fadeIn} className="pt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className={`
                                    px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300
                                    ${!isFormValid()
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-xl hover:shadow-rr-pink/20 hover:scale-[1.02]'
                                    }
                                `}
                            >
                                Submit Response
                                <span className="text-lg">→</span>
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </section>

            {/* ---- Identity Modal Popup ---- */}
            <AnimatePresence>
                {showIdentityModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setShowIdentityModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 space-y-6 border border-slate-100"
                        >
                            {/* Close button */}
                            {!isSubmitting && (
                                <button
                                    onClick={() => setShowIdentityModal(false)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    ✕
                                </button>
                            )}

                            {/* Header */}
                            <div className="space-y-2">
                                <div className="w-14 h-14 bg-rr-pink/10 rounded-2xl flex items-center justify-center mb-4">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <h3 className="text-2xl font-bold text-rr-dark">Confirm Your Details</h3>
                                <p className="text-slate-500 text-sm font-medium">
                                    Please provide the following information to complete your RSVP.
                                </p>
                            </div>

                            {/* Identity Fields */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-rr-dark">Player Name *</label>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        placeholder="Full name of the player"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink bg-white shadow-sm"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-rr-dark">Parent / Guardian Name *</label>
                                    <input
                                        type="text"
                                        value={parentName}
                                        onChange={(e) => setParentName(e.target.value)}
                                        placeholder="Full name of parent or guardian"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink bg-white shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-rr-dark">Email Address *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="best@email.com"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink bg-white shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {submitError && (
                                <p className="text-red-500 text-sm font-medium bg-red-50 rounded-lg px-4 py-2">{submitError}</p>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleFinalSubmit}
                                disabled={!isIdentityValid() || isSubmitting}
                                className={`
                                    w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
                                    ${!isIdentityValid() || isSubmitting
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-rr-dark text-white hover:shadow-xl hover:scale-[1.01]'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : 'Confirm & Submit'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AssessmentRSVP;
