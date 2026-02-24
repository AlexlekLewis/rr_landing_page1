import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const AssessmentRSVP = () => {
    const [selectedRSVP, setSelectedRSVP] = useState(null);
    const [unableToAttend, setUnableToAttend] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasConsented, setHasConsented] = useState(false);

    // Detailed feedback state
    const [excitedReason, setExcitedReason] = useState('');
    const [declineReason, setDeclineReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

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

    const handleRSVPChange = (value) => {
        setSelectedRSVP(value);
        if (value) {
            setUnableToAttend(false);
        }
    };

    const handleUnableChange = () => {
        setUnableToAttend(!unableToAttend);
        if (!unableToAttend) {
            setSelectedRSVP(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-slate-200" id="rsvp">
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto text-center space-y-6 bg-white border border-slate-200 shadow-xl rounded-3xl p-12">
                    <div className="w-20 h-20 bg-rr-pink/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-rr-pink" />
                    </div>
                    {selectedRSVP === 'yes' ? (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Application Updated</h2>
                            <p className="text-slate-600 text-lg">We look forward to seeing you at the assessment session. If under 18, parents or guardians will receive a message by Friday February 27 providing the timing of the assessment session.</p>
                        </>
                    ) : selectedRSVP === 'considering' || unableToAttend ? (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Application Updated</h2>
                            <p className="text-slate-600 text-lg">Thank you for letting us know that you are still considering if this is the right option. We will be in touch via email by Friday February 27 to confirm assessment session time allocation and format of the session.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-rr-dark">Feedback Received</h2>
                            <p className="text-slate-600 text-lg">Thank you for letting us know and providing your feedback. We wish you the best for the season ahead.</p>
                        </>
                    )}
                </motion.div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-slate-200" id="rsvp">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
            >
                <motion.div variants={fadeIn} className="space-y-6 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-rr-dark tracking-tight">Secure Your Spot</h2>
                    <p className="text-slate-600 font-medium text-lg max-w-2xl">
                        Please tick one of the answers below and provide any relevant information.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Primary Decisions */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        <h3 className="text-xl font-bold text-rr-dark mb-6">
                            Pending a final offer, are you intending to join the Elite Program?
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'yes', label: "Yes, I am excited to trial for a place" },
                                { id: 'considering', label: "I'm still considering, but would like to attend" },
                                { id: 'no', label: "No, unfortunately I need to decline" }
                            ].map((option) => (
                                <label
                                    key={option.id}
                                    className={`
                                        relative flex items-center p-5 cursor-pointer rounded-2xl border transition-all duration-300
                                        ${selectedRSVP === option.id
                                            ? 'bg-rr-pink/10 border-rr-pink shadow-md'
                                            : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                                        }
                                        ${unableToAttend && 'opacity-50 pointer-events-none'}
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name="primary_rsvp"
                                        value={option.id}
                                        checked={selectedRSVP === option.id}
                                        onChange={() => handleRSVPChange(option.id)}
                                        className="sr-only"
                                    />
                                    <div className={`
                                        w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors bg-white
                                        ${selectedRSVP === option.id ? 'border-rr-pink' : 'border-slate-300'}
                                    `}>
                                        {selectedRSVP === option.id && (
                                            <div className="w-3 h-3 bg-rr-pink rounded-full" />
                                        )}
                                    </div>
                                    <span className={`text-base font-bold leading-snug ${selectedRSVP === option.id ? 'text-rr-dark' : 'text-slate-600'}`}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Yes Feedback Form */}
                        {selectedRSVP === 'yes' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 p-6 md:p-8 bg-rr-blue/5 border border-rr-blue/20 rounded-2xl space-y-4"
                            >
                                <label className="block text-rr-dark font-bold mb-2">We're thrilled! What part of the program are you most excited about?</label>
                                <textarea
                                    value={excitedReason}
                                    onChange={(e) => setExcitedReason(e.target.value)}
                                    placeholder="(e.g. Masterclasses, DNA Profile, Specialist Coaching...)"
                                    className="w-full bg-white shadow-inner border border-slate-200 rounded-xl p-4 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue min-h-[100px] resize-y"
                                    required
                                />
                            </motion.div>
                        )}

                        {/* No Feedback Form */}
                        {selectedRSVP === 'no' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 p-6 md:p-8 bg-rr-pink/5 border border-rr-pink/20 rounded-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <p className="text-rr-dark font-bold">We are sorry you won't be joining the foundation intake.</p>
                                    <p className="text-slate-600 text-sm font-medium">To help us improve, could you please select the primary reason why?</p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        "Distance / Travel Requirements",
                                        "Schedule Conflicts (Days/Times)",
                                        "Committed to another program/squad",
                                        "Don't see enough value in the program",
                                        "Program Cost / Personal Finances",
                                        "Other"
                                    ].map((reason) => (
                                        <label key={reason} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex bg-white items-center justify-center shrink-0 transition-colors ${declineReason === reason ? 'border-rr-pink' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                                {declineReason === reason && <div className="w-2.5 h-2.5 rounded-full bg-rr-pink" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="decline_reason"
                                                value={reason}
                                                checked={declineReason === reason}
                                                onChange={(e) => setDeclineReason(e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className={`text-base font-medium transition-colors ${declineReason === reason ? 'text-rr-dark font-bold' : 'text-slate-600 group-hover:text-rr-dark'}`}>
                                                {reason}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {declineReason === 'Other' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                                        <textarea
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                            placeholder="Please let us know why..."
                                            className="w-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-rr-dark placeholder:text-slate-400 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink min-h-[100px] resize-y"
                                            required
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Cannot Attend Exception */}
                    <motion.div variants={fadeIn} className="space-y-6 pt-8 border-t border-slate-200">
                        <p className="text-lg text-slate-600 font-medium">
                            If, for reasons beyond your control, you are <span className="text-rr-dark font-bold">unable to attend</span> the assessment session on Sunday March 1st but <span className="text-rr-dark font-bold">would accept an offer</span> to the program, please outline your interest below.
                        </p>

                        <label
                            className={`
                                relative flex items-start p-6 cursor-pointer rounded-2xl border transition-all duration-300 shadow-sm
                                ${unableToAttend
                                    ? 'bg-rr-blue/10 border-rr-blue shadow-md'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                                }
                                ${selectedRSVP && 'opacity-50 pointer-events-none'}
                            `}
                        >
                            <input
                                type="checkbox"
                                checked={unableToAttend}
                                onChange={handleUnableChange}
                                className="sr-only"
                            />
                            <div className={`
                                w-6 h-6 rounded border-2 flex items-center justify-center mr-4 shrink-0 transition-colors mt-0.5 bg-white
                                ${unableToAttend ? 'border-rr-blue bg-rr-blue' : 'border-slate-300'}
                            `}>
                                {unableToAttend && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <span className={`text-lg font-bold leading-relaxed ${unableToAttend ? 'text-rr-dark' : 'text-slate-600'}`}>
                                I cannot attend the assessment, but I am still extremely interested in joining the foundation intake.
                            </span>
                        </label>
                    </motion.div>

                    {/* Consent Checkbox */}
                    <motion.div variants={fadeIn} className="pt-8 border-t border-slate-200">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-start mt-1">
                                <input
                                    type="checkbox"
                                    checked={hasConsented}
                                    onChange={(e) => setHasConsented(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-slate-300 rounded peer-checked:bg-rr-pink peer-checked:border-rr-pink transition-all flex items-center justify-center bg-white shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <span className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                                I confirm my RSVP selection. By submitting, I acknowledge that if the participant is under 18, this form must be completed by a parent or legal guardian. I voluntarily agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and understand the <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>.
                            </span>
                        </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={fadeIn} className="pt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={!hasConsented || (!selectedRSVP && !unableToAttend) || isSubmitting || (selectedRSVP === 'yes' && !excitedReason) || (selectedRSVP === 'no' && !declineReason) || (selectedRSVP === 'no' && declineReason === 'Other' && !otherReason)}
                            className={`
                                px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300
                                ${(!hasConsented || (!selectedRSVP && !unableToAttend) || (selectedRSVP === 'yes' && !excitedReason) || (selectedRSVP === 'no' && !declineReason) || (selectedRSVP === 'no' && declineReason === 'Other' && !otherReason))
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed hidden'
                                    : 'bg-rr-dark text-white hover:shadow-xl hover:scale-[1.02]'
                                }
                            `}
                        >
                            {isSubmitting ? 'Recording Decision...' : 'Submit Decision'}
                            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </section>
    );
};

export default AssessmentRSVP;
