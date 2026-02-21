import React from 'react';
import { motion } from 'framer-motion';

const InvitationHero = ({ applicantName }) => {
    return (
        <section className="relative pt-24 pb-32 overflow-hidden bg-rr-dark">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-rr-pink/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-rr-blue/20 to-transparent"></div>

                {/* Optional subtle particle effect or mesh gradient could go here */}
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-rr-pink/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-rr-blue/20 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 inline-block"
                >
                    <span className="text-rr-pink font-bold tracking-widest uppercase text-sm md:text-base border border-rr-pink/30 px-4 py-1.5 rounded-full bg-rr-pink/10 bg-amber-500/30 text-amber-200">
                        Elite Program Assessment
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-black text-white uppercase tracking-wider mb-8 leading-tight drop-shadow-lg"
                >
                    <span className="block mb-2 bg-emerald-500/30 text-white px-2 rounded inline-block">IT'S TIME TO SHINE</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto space-y-6"
                >
                    <p className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">
                        Thank you for your application to Melbourne's Rajasthan Royals Academy Elite Program.
                    </p>
                    <p className="text-white font-bold text-xl md:text-2xl mt-8 mb-4 border-l-4 border-rr-pink pl-6 text-left">
                        <span className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">We are delighted to now invite you to an assessment session on <span className="text-rr-pink">Sunday March 1 at XXpm</span> at Cutting Edge Cricket in Bundoora. This sessions forms a key part of the final offers that will be made to successful applicants.</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto text-left backdrop-blur-sm"
                >
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        <span className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">The session will be led by <strong className="text-white">Siddhartha Lahiri</strong>, the Rajasthan Royals Head of International Talent Development, as well as Assistant and Performance Coach for Rajasthan, Paarl and Barbados Royals.</span>
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        <span className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">Alongside Siddhartha, our Melbourne coaching and leadership team will also be present and working through the final selection process with Siddhartha.</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    className="mt-16 pt-16 border-t border-white/10 text-left max-w-4xl mx-auto"
                >
                    <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-6">
                        <span className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">What happens next?</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                        <p>
                            <span className="bg-emerald-500/30 text-emerald-200 px-2 rounded inline-block">As you have been invited to attend the assessment session, you are one step closer to the Elite Program as the Rajasthan Royals Academy team are considering you as a candidate with strong possibility of being offered a place.</span>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 flex flex-col items-center justify-center animate-bounce cursor-pointer"
                    onClick={() => document.getElementById('video-section').scrollIntoView({ behavior: 'smooth' })}
                >
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">What Happens Next</p>
                    <svg className="w-6 h-6 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
};

export default InvitationHero;
