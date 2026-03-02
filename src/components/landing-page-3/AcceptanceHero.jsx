import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const AcceptanceHero = ({ acceptStatus, setAcceptStatus }) => {
    const [declineReason, setDeclineReason] = useState('');
    const [futureContact, setFutureContact] = useState(true);
    const [isSubmittingDecline, setIsSubmittingDecline] = useState(false);
    const [declineSubmitted, setDeclineSubmitted] = useState(false);
    const [declineError, setDeclineError] = useState('');

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

    const handleDeclineSubmit = async () => {
        if (!declineReason) {
            setDeclineError('Please select a reason.');
            return;
        }

        setIsSubmittingDecline(true);
        setDeclineError('');

        try {
            // We only have limited info at this point since the main form isn't filled.
            // We create a record with just the decline info.
            const payload = {
                accepted_offer: false,
                decline_reason: declineReason,
                future_contact: futureContact,
            };

            const { error } = await supabase.from('official_cohort_2026').insert(payload);
            if (error) throw error;

            setDeclineSubmitted(true);

            // Optionally fire webhook here as well, but usually declining doesn't need to go to Google Sheets immediately unless requested.
            const webhookUrl = import.meta.env.VITE_LP3_WEBHOOK_URL;
            if (webhookUrl) {
                const formData = new URLSearchParams();
                Object.entries(payload).forEach(([key, value]) => {
                    formData.append(key, String(value));
                });
                fetch(webhookUrl, { method: 'POST', body: formData }).catch(() => { });
            }

        } catch (err) {
            console.error('Submission error:', err);
            setDeclineError('Something went wrong submitting your response. Please try again.');
        } finally {
            setIsSubmittingDecline(false);
        }
    };

    return (
        <section id="lp3-hero" className="relative pt-32 pb-20 px-6 lg:px-8 bg-rr-dark text-white overflow-hidden min-h-[80vh] flex flex-col justify-center">
            {/* Background styling */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/sooryavanchi-arms-raised.jpg"
                    alt="Celebration"
                    className="w-full h-full object-cover object-[center_30%] opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/80 via-transparent to-rr-dark/90"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 max-w-4xl mx-auto w-full text-center"
            >
                <div className="space-y-10 mb-16">
                    <motion.div variants={fadeIn}>
                        <h1 className="text-4xl md:text-6xl font-black tracking-wide leading-[1.1] uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-md mb-8">
                            Elite Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Offer</span>
                        </h1>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex justify-center mb-10">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-24 md:h-32 w-auto object-contain brightness-0 invert"
                        />
                    </motion.div>

                    <motion.div variants={fadeIn} className="space-y-6 text-lg md:text-xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
                        <p>
                            Following our selection process, we are delighted to be able to offer you a position in Melbourne's Rajasthan Royals Elite Program.
                        </p>
                        <p>
                            In accepting this offer you will become a foundation member of this world first Royals program.
                        </p>
                        <p className="font-semibold text-white">
                            Please take the time to work through the below information, secure and accept your place in the Elite Program.
                        </p>
                    </motion.div>
                </div>

                {/* Offer Acceptance Toggle */}
                <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-rr-dark">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-wide">Do you accept the offer to Melbourne's Rajasthan Royals Academy?</h2>

                    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto">
                        <button
                            onClick={() => setAcceptStatus('yes')}
                            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 border-2 ${acceptStatus === 'yes'
                                    ? 'bg-rr-pink border-rr-pink text-white shadow-xl shadow-rr-pink/20 scale-105'
                                    : 'bg-white border-slate-200 text-rr-dark hover:border-rr-pink hover:text-rr-pink'
                                }`}
                        >
                            Yes, I accept
                        </button>
                        <button
                            onClick={() => setAcceptStatus('no')}
                            className={`flex-1 py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 border-2 ${acceptStatus === 'no'
                                    ? 'bg-slate-800 border-slate-800 text-white shadow-xl scale-105'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-800 hover:text-slate-800'
                                }`}
                        >
                            No, I decline
                        </button>
                    </div>

                    {/* Decline Flow Expansion */}
                    <AnimatePresence>
                        {acceptStatus === 'no' && !declineSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 text-left border-t border-slate-100 pt-8"
                            >
                                <div className="max-w-xl mx-auto space-y-6">
                                    <div className="space-y-3">
                                        <label className="block font-bold text-rr-dark text-lg">We are sorry you won't be joining us. Could you let us know why?</label>
                                        <select
                                            value={declineReason}
                                            onChange={(e) => setDeclineReason(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-rr-dark focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink bg-slate-50"
                                            disabled={isSubmittingDecline}
                                        >
                                            <option value="">Select a reason...</option>
                                            <option value="Schedule Conflict">Schedule Conflict</option>
                                            <option value="Financial reasons">Financial reasons</option>
                                            <option value="Travel/Location">Travel / Location</option>
                                            <option value="Accepted another program">Accepted into another program</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="relative flex items-start mt-1 shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={futureContact}
                                                onChange={(e) => setFutureContact(e.target.checked)}
                                                className="sr-only"
                                                disabled={isSubmittingDecline}
                                            />
                                            <div className={`w-6 h-6 border-2 rounded transition-all flex items-center justify-center shadow-sm ${futureContact ? 'bg-rr-dark border-rr-dark' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                                {futureContact && <span className="text-xs text-white font-bold">✓</span>}
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium">
                                            I would like to be notified of further programs and opportunities with the Rajasthan Royals Academy.
                                        </span>
                                    </label>

                                    {declineError && (
                                        <p className="text-red-500 font-medium text-sm">{declineError}</p>
                                    )}

                                    <button
                                        onClick={handleDeclineSubmit}
                                        disabled={isSubmittingDecline}
                                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 mt-4 ${isSubmittingDecline ? 'bg-slate-300' : 'bg-slate-800 hover:bg-black'
                                            }`}
                                    >
                                        {isSubmittingDecline ? 'Submitting...' : 'Submit Response'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {acceptStatus === 'no' && declineSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                            >
                                <h3 className="text-xl font-bold text-rr-dark mb-2">Thank you!</h3>
                                <p className="text-slate-600">Your response has been recorded. We wish you all the best for your upcoming cricket season.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AcceptanceHero;
