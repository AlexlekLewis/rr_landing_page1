import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LandingPage2 = () => {
    const [selectedRSVP, setSelectedRSVP] = useState(null);
    const [unableToAttend, setUnableToAttend] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const handleRSVPChange = (value) => {
        setSelectedRSVP(value);
        if (value) {
            setUnableToAttend(false); // Can't be both
        }
    };

    const handleUnableChange = () => {
        setUnableToAttend(!unableToAttend);
        if (!unableToAttend) {
            setSelectedRSVP(null); // Can't be both
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

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar />

            <main className="flex-1 overflow-hidden relative">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rr-pink/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rr-blue/10 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                        >
                            IT'S TIME TO SHINE
                        </motion.h1>

                        <motion.div variants={fadeIn} className="space-y-6 text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                            <p>
                                Thank you for your application to Melbourne's Rajasthan Royals Academy Elite Program.
                            </p>
                            <p>
                                We are delighted to now invite you to an assessment session on Sunday March 1 at XXpm at <span className="text-white font-medium">Cutting Edge Cricket</span> in Bundoora. This sessions forms a key part of the final offers that will be made to successful applicants.
                            </p>
                            <p>
                                The session will be led by <span className="text-rr-pink font-semibold">Siddhartha Lahiri</span>, the Rajasthan Royals Head of International Talent Development, as well as Assistant and Performance Coach for Rajasthan, Paarl and Barbados Royals.
                            </p>
                            <p>
                                Alongside Siddhartha, our Melbourne coaching and leadership team will also be present and working through the final selection process with Siddhartha.
                            </p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- NEXT STEPS SECTION --- */}
                <section className="py-20 px-6 lg:px-8 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-black/30">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-white mb-8">
                            What happens next?
                        </motion.h2>

                        <motion.div variants={fadeIn} className="bg-white/5 border border-rr-pink/20 rounded-2xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden group hover:border-rr-pink/40 transition-colors duration-500">
                            {/* Subtle internal glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rr-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 space-y-6 text-lg text-slate-300 leading-relaxed">
                                <p>
                                    As you have been invited to attend the assessment session, you are one step closer to the Elite Program as the Rajasthan Royals Academy team are considering you as a candidate with strong possibility of being offered a place.
                                </p>
                                <p>
                                    So that you can begin to prepare for both the assessment session and the possibility of being offered a place, please find below details of the program including program content, training days & times and the cost of this premium program.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* --- PROGRAM DETAILS PLACEHOLDER --- */}
                <section className="py-20 px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="border border-dashed border-rr-blue/40 rounded-3xl p-16 flex flex-col items-center justify-center bg-rr-blue/5 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-rr-blue rounded-full blur-sm" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-rr-blue rounded-full blur-sm" />

                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase opacity-80 mb-4">
                                INSERT DETAILS OF PROGRAM
                            </h2>
                            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rr-blue to-rr-pink tracking-widest uppercase opacity-80">
                                INSERT DETAILS OF PROGRAM
                            </h2>
                        </div>
                    </motion.div>
                </section>

                {/* --- RSVP / FORMS SECTION --- */}
                <section className="py-20 px-6 lg:px-8 relative z-10 bg-black/40 border-t border-white/5">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        {isSubmitted ? (
                            <motion.div variants={fadeIn} className="text-center space-y-6 bg-white/5 border border-rr-pink/30 rounded-3xl p-12 backdrop-blur-md">
                                <div className="w-20 h-20 bg-rr-pink/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rr-pink/50">
                                    <CheckCircle2 className="w-10 h-10 text-rr-pink" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Decision Recorded</h2>
                                <p className="text-slate-300 text-lg">Thank you. Your response has been securely logged with our assessment team.</p>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div variants={fadeIn} className="space-y-6 mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white">Assessment session acceptance.</h2>
                                    <div className="text-lg text-slate-300 space-y-4">
                                        <p>
                                            As places in the Elite Program foundation intake are strictly limited, we want to ensure we provide as many applicants as possible an opportunity to put their best foot forward.
                                        </p>
                                        <p>
                                            So that we can accurately manage the applicants through the selection process, please tick one of the answers below.
                                        </p>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleSubmit} className="space-y-12">
                                    {/* Primary Offer Response */}
                                    <motion.div variants={fadeIn} className="space-y-6">
                                        <h3 className="text-xl font-medium text-white">
                                            After the assessment session, if offered a place in the Elite Program, will you accept the offer?
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'yes', label: "Yes, absolutely I can't wait" },
                                                { id: 'no', label: "No, unfortunately I need to decline" },
                                                { id: 'maybe', label: "I'm not sure at this point" }
                                            ].map((option) => (
                                                <label
                                                    key={option.id}
                                                    className={`
                                                        relative flex items-center p-5 cursor-pointer rounded-xl border transition-all duration-300
                                                        ${selectedRSVP === option.id
                                                            ? 'bg-rr-pink/10 border-rr-pink shadow-[0_0_15px_rgba(229,6,149,0.2)]'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
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
                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors
                                                        ${selectedRSVP === option.id ? 'border-rr-pink' : 'border-slate-500'}
                                                    `}>
                                                        {selectedRSVP === option.id && (
                                                            <div className="w-2.5 h-2.5 bg-rr-pink rounded-full" />
                                                        )}
                                                    </div>
                                                    <span className={`font-medium ${selectedRSVP === option.id ? 'text-white' : 'text-slate-300'}`}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Alternative Option */}
                                    <motion.div variants={fadeIn} className="space-y-6 pt-8 border-t border-white/10">
                                        <p className="text-lg text-slate-300">
                                            If, for reasons beyond your control, you are unable to attend the assessment session on afternoon of Sunday March 1st but would accept an offer to the program, please tick the box below.
                                        </p>

                                        <label
                                            className={`
                                                relative flex items-start p-6 cursor-pointer rounded-2xl border transition-all duration-300
                                                ${unableToAttend
                                                    ? 'bg-rr-blue/10 border-rr-blue shadow-[0_0_15px_rgba(18,38,170,0.2)]'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
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
                                                w-6 h-6 rounded border-2 flex items-center justify-center mr-4 shrink-0 transition-colors mt-0.5
                                                ${unableToAttend ? 'border-rr-blue bg-rr-blue' : 'border-slate-500 bg-transparent'}
                                            `}>
                                                {unableToAttend && <CheckCircle2 className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className={`text-lg font-medium leading-relaxed ${unableToAttend ? 'text-white' : 'text-slate-300'}`}>
                                                I'm not able to attend the assessment session but I would definitely accept an offer
                                            </span>
                                        </label>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div variants={fadeIn} className="pt-8 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!selectedRSVP && !unableToAttend || isSubmitting}
                                            className={`
                                                px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300
                                                ${(!selectedRSVP && !unableToAttend)
                                                    ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] hover:scale-[1.02]'
                                                }
                                            `}
                                        >
                                            {isSubmitting ? 'Recording Decision...' : 'Submit Decision'}
                                            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                                        </button>
                                    </motion.div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage2;
