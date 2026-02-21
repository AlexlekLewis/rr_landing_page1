import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../Button';

const DECISION_OPTIONS = [
    { id: 'yes', label: <span className="bg-emerald-500/20 text-emerald-900 px-1 rounded border border-emerald-500/30">Yes, absolutely I can’t wait</span> },
    { id: 'no', label: <span className="bg-emerald-500/20 text-emerald-900 px-1 rounded border border-emerald-500/30">No, unfortunately I need to decline</span> },
    { id: 'maybe', label: <span className="bg-emerald-500/20 text-emerald-900 px-1 rounded border border-emerald-500/30">I’m not sure at this point</span> },
    { id: 'yes_but_no_assess', label: <span className="bg-emerald-500/20 text-emerald-900 px-1 rounded border border-emerald-500/30">I’m not able to attend the assessment session but I would definitely accept an offer</span> }
];

const RSVPForm = ({ tokenData, onSubmitSuccess }) => {
    const [decision, setDecision] = useState(null);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleOptionSelect = (id) => {
        setDecision(id);
        setError(null);
        // Reset form data when changing main decision to avoid stale data
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!decision) {
            setError('Please select an RSVP option before submitting.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // Developer preview bypass
        if (import.meta.env.DEV && tokenData.id === 'preview-mode') {
            setTimeout(() => {
                onSubmitSuccess({ decision, ...formData });
                setIsSubmitting(false);
            }, 1000);
            return;
        }

        try {
            // 1. Insert detailed response
            const { error: insertError } = await supabase
                .from('offer_responses')
                .insert([{
                    token_id: tokenData.id,
                    decision: decision,
                    ...formData // spread all dynamic conditional fields
                }]);

            if (insertError) throw insertError;

            // 2. Mark token as used/responded
            const newStatus = decision === 'yes' || decision === 'yes_but_no_assess' ? 'attended' : 'declined';

            const { error: updateError } = await supabase
                .from('offer_tokens')
                .update({
                    status: newStatus,
                    responded_at: new Date().toISOString()
                })
                .eq('id', tokenData.id);

            if (updateError) throw updateError;

            // 3. Notify parent component to show confirmation screen
            onSubmitSuccess({ decision, ...formData });

        } catch (err) {
            console.error('Error submitting RSVP:', err);
            setError(err.message || 'An error occurred while saving your response. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Form Rendering Helpers ---

    const renderTextarea = (name, label, placeholder, required = true) => (
        <div className="mb-6">
            <label className="block text-rr-dark font-bold mb-2 uppercase tracking-wide text-sm"><span className="bg-amber-500/20 text-amber-900 px-1 rounded border border-amber-500/30">{label}</span> {required && '*'}</label>
            <textarea
                name={name}
                required={required}
                value={formData[name] || ''}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 text-rr-dark rounded-xl px-4 py-3 focus:outline-none focus:border-rr-pink focus:ring-1 focus:ring-rr-pink transition-colors min-h-[120px]"
                placeholder={placeholder}
            />
        </div>
    );

    const renderConditionalFields = () => {
        switch (decision) {
            case 'yes':
            case 'yes_but_no_assess':
                return (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 mt-8 mb-8">
                            <h4 className="font-black text-xl text-rr-dark uppercase mb-6 border-b border-slate-200 pb-4"><span className="bg-amber-500/20 text-amber-900 px-1 rounded border border-amber-500/30">Thank you! Before you submit, please tell us:</span></h4>
                            {renderTextarea('what_excites', 'What excites you the most about the program?', 'e.g., The coaching, the DNA card, the IPL connection...')}
                            {renderTextarea('what_concerns', 'Is there anything that concerns you about the program?', 'e.g., Nothing right now, or scheduling, intensity, etc.')}
                            {renderTextarea('parent_sentiment', 'As a parent, how are you feeling about your child being involved in the Elite Program?', 'Your honest thoughts help us align with your family goals.')}
                        </div>
                    </motion.div>
                );
            case 'maybe':
                return (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="bg-rr-pink/5 p-6 md:p-8 rounded-2xl border border-rr-pink/20 mt-8 mb-8">
                            <h4 className="font-black text-xl text-rr-dark uppercase mb-6 border-b border-rr-pink/20 pb-4 text-rr-pink">We want to make sure you have all the information you need.</h4>
                            {renderTextarea('hesitation_reason', 'What is causing you to hesitate?', 'Please be as honest as possible so we can help.')}
                            {renderTextarea('decision_help', 'What information or conversation do you need to help you make a decision?', 'e.g. A phone call about schedule, a question about fees.')}
                            {renderTextarea('scheduling_concerns', 'Are there any specific scheduling conflicts or logistical concerns?', 'Let us know if the proposed days/times are the main issue.', false)}
                        </div>
                    </motion.div>
                );
            case 'no':
                return (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="bg-slate-100 p-6 md:p-8 rounded-2xl border border-slate-300 mt-8 mb-8">
                            <h4 className="font-black text-xl text-slate-700 uppercase mb-6 border-b border-slate-300 pb-4">We're sorry you can't join us.</h4>
                            <p className="text-slate-600 mb-6 font-medium">To help us improve our offerings and understand our applicants better, please tell us why you are declining the invitation.</p>

                            {/* Radio Buttons for Primary Reason */}
                            <div className="mb-6">
                                <label className="block text-rr-dark font-bold mb-4 uppercase tracking-wide text-sm">Primary reason for declining *</label>
                                <div className="space-y-3">
                                    {['Schedule Conflict', 'Financial / Cost', 'Location / Travel', 'Joined Another Program', 'Other'].map(reason => (
                                        <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="primary_reason"
                                                value={reason}
                                                required
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-rr-pink border-slate-300 focus:ring-rr-pink"
                                            />
                                            <span className="text-slate-700 font-medium group-hover:text-rr-dark transition-colors">{reason}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {renderTextarea('decline_details', 'Please provide more details about your decision.', 'Any additional context is greatly appreciated.', false)}

                            {formData.primary_reason === 'Financial / Cost' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                                    {renderTextarea('cost_factor', 'If cost was the primary factor, what price point would make this program viable for your family?', 'This is purely for our market research.', false)}
                                </motion.div>
                            )}

                            {formData.primary_reason === 'Joined Another Program' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                                    {renderTextarea('competing_programs', 'What other program did you choose and why?', 'Help us understand what other offerings appealed to you.', false)}
                                </motion.div>
                            )}

                            {/* Radio for Future Interest */}
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <label className="block text-rr-dark font-bold mb-4 uppercase tracking-wide text-sm">Would you like to be considered for future programs? *</label>
                                <div className="flex gap-6">
                                    {['Yes', 'No'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="future_interest" value={opt} required onChange={handleInputChange} className="w-5 h-5 text-rr-pink border-slate-300 focus:ring-rr-pink" />
                                            <span className="text-slate-700 font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {renderTextarea('improvement_suggestions', 'Is there anything we could have done differently to change your decision?', 'Your feedback is invaluable.', false)}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <section id="rsvp-section" className="py-24 bg-slate-50 relative border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wider mb-6">
                        <span className="bg-emerald-500/20 text-emerald-900 px-2 rounded inline-block border border-emerald-500/30">Assessment session acceptance.</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                        <span className="bg-emerald-500/20 text-emerald-900 px-2 rounded inline-block border border-emerald-500/30">As places in the Elite Program foundation intake are strictly limited, we want to ensure we provide as many applicants as possible an opportunity to put their best foot forward.</span>
                    </p>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-bold">
                        <span className="bg-emerald-500/20 text-emerald-900 px-2 rounded inline-block border border-emerald-500/30">So that we can accurately manage the applicants through the selection process, please tick one of the answers below.</span>
                    </p>
                    <p className="text-xl text-rr-dark max-w-2xl mx-auto font-black italic">
                        <span className="bg-emerald-500/20 text-emerald-900 px-2 rounded inline-block border border-emerald-500/30">After the assessment session, if offered a place in the Elite Program, will you accept the offer?</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">

                    {/* Decision Options */}
                    <div className="space-y-4 mb-8">
                        {DECISION_OPTIONS.slice(0, 3).map((option) => (
                            <div
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`
                                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 flex items-center justify-center text-center group overflow-hidden
                                    ${decision === option.id
                                        ? 'border-rr-pink bg-rr-pink/5 shadow-md shadow-rr-pink/10'
                                        : 'border-slate-200 hover:border-rr-pink/50 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {/* Selected Indicator */}
                                {decision === option.id && (
                                    <div className="absolute top-3 right-3">
                                        <CheckCircle2 className="w-6 h-6 text-rr-pink" />
                                    </div>
                                )}

                                <span className={`
                                    font-bold text-lg 
                                    ${decision === option.id ? 'text-rr-dark' : 'text-slate-600 group-hover:text-rr-dark'}
                                `}>
                                    {option.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center mb-6 pt-8 border-t border-slate-200">
                        <p className="text-slate-600 mb-6 italic">
                            <span className="bg-emerald-500/20 text-emerald-900 px-2 rounded inline-block border border-emerald-500/30">If, for reasons beyond your control, you are unable to attend the assessment session on afternoon of Sunday March 1st but would accept an offer to the program, please tick the box below.</span>
                        </p>
                        <div
                            onClick={() => handleOptionSelect('yes_but_no_assess')}
                            className={`
                                relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 flex items-center justify-center text-center group overflow-hidden max-w-2xl mx-auto
                                ${decision === 'yes_but_no_assess'
                                    ? 'border-rr-pink bg-rr-pink/5 shadow-md shadow-rr-pink/10'
                                    : 'border-slate-200 hover:border-rr-pink/50 hover:bg-slate-50'
                                }
                            `}
                        >
                            {decision === 'yes_but_no_assess' && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle2 className="w-6 h-6 text-rr-pink" />
                                </div>
                            )}

                            <span className={`
                                font-bold text-lg 
                                ${decision === 'yes_but_no_assess' ? 'text-rr-dark' : 'text-slate-600 group-hover:text-rr-dark'}
                            `}>
                                <span className="bg-emerald-500/20 text-emerald-900 px-1 rounded border border-emerald-500/30">I’m not able to attend the assessment session but I would definitely accept an offer</span>
                            </span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {renderConditionalFields()}
                    </AnimatePresence>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 text-red-700">
                            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                            <p className="font-medium text-sm">{error}</p>
                        </div>
                    )}

                    <div className="mt-12 flex justify-center">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!decision || isSubmitting}
                            className={`w-full md:w-auto px-12 py-4 text-lg ${(isSubmitting || !decision) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                </span>
                            ) : (
                                'Submit Decision'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default RSVPForm;
