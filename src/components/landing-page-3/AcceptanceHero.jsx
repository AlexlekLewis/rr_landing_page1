import React from 'react';
import { motion } from 'framer-motion';

const AcceptanceHero = ({ acceptStatus, setAcceptStatus }) => {
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

                    <motion.div variants={fadeIn} className="space-y-6 text-lg md:text-xl text-slate-200 leading-relaxed font-light max-w-4xl mx-auto">
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl mb-12">
                            <p className="mb-6">
                                Following our selection process, we are delighted to be able to offer you a position in the inaugural Rajasthan Royals Academy Melbourne Elite Program.
                            </p>
                            <p className="font-semibold text-white text-xl md:text-2xl italic">
                                In accepting this offer you will become a foundation member of this world first Royals program!
                            </p>
                        </div>

                        {/* FOMO / Value Reaffirmation Section */}
                        <div className="text-left mb-12">
                            <h3 className="text-2xl font-black uppercase tracking-widest text-rr-pink mb-8 text-center">Securing Your Place Means:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Value Item 1 */}
                                <div className="bg-rr-dark/50 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rr-pink/20 rounded-xl flex items-center justify-center shrink-0 border border-rr-pink/30">
                                        <svg className="w-6 h-6 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider">World-Class Coaching</h4>
                                        <p className="text-sm text-slate-300">Access to IPL-standard methodologies, tactical development, and specialized guidance.</p>
                                    </div>
                                </div>
                                {/* Value Item 2 */}
                                <div className="bg-rr-dark/50 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rr-blue/20 rounded-xl flex items-center justify-center shrink-0 border border-rr-blue/30">
                                        <svg className="w-6 h-6 text-rr-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider">DNA Profiling</h4>
                                        <p className="text-sm text-slate-300">A dedicated player portal tracking your bespoke data, analytics, and growth trajectory.</p>
                                    </div>
                                </div>
                                {/* Value Item 3 */}
                                <div className="bg-rr-dark/50 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rr-pink/20 rounded-xl flex items-center justify-center shrink-0 border border-rr-pink/30">
                                        <svg className="w-6 h-6 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider">Global Pathways</h4>
                                        <p className="text-sm text-slate-300">Direct visibility to the Royals global network and exclusive international opportunities.</p>
                                    </div>
                                </div>
                                {/* Value Item 4 */}
                                <div className="bg-rr-dark/50 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rr-blue/20 rounded-xl flex items-center justify-center shrink-0 border border-rr-blue/30">
                                        <svg className="w-6 h-6 text-rr-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider">Exclusive Community</h4>
                                        <p className="text-sm text-slate-300">Train alongside the best emerging talent in Victoria in a strictly limited cohort.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="font-semibold text-white mt-8 mb-4">
                            Please take the time to work through the below information to confirm and accept your place in the Elite Program.
                        </p>
                    </motion.div>
                </div>

                {/* Offer Acceptance Toggle - No Decline */}
                <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-rr-dark max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-wide">Do you accept the offer to the Rajasthan Royals Academy Melbourne Elite Program?</h2>

                    <button
                        onClick={() => setAcceptStatus('yes')}
                        className={`w-full py-6 px-10 rounded-2xl font-black tracking-wide uppercase text-xl md:text-2xl transition-all duration-300 border-2 ${acceptStatus === 'yes'
                            ? 'bg-rr-pink border-rr-pink text-white shadow-xl shadow-rr-pink/20 scale-105'
                            : 'bg-gradient-to-r from-rr-pink to-rr-blue border-transparent text-white hover:shadow-xl hover:shadow-rr-pink/20 hover:scale-105'
                            }`}
                    >
                        {acceptStatus === 'yes' ? 'OFFER ACCEPTED ✓' : 'YES, I ACCEPT'}
                    </button>

                    {/* Add celebration text when accepted */}
                    {acceptStatus === 'yes' && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-rr-pink font-bold text-lg"
                        >
                            Scroll down to complete your Elite Program Administration details.
                        </motion.p>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AcceptanceHero;
