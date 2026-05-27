import React from 'react';
import { motion } from 'framer-motion';

const MasterHero = () => {
    const scrollToForm = () => {
        document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen w-full flex items-center bg-rr-dark overflow-hidden">

            {/* Background Video / Image Layer */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Background Image Layer - Mobile */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[center_top] md:hidden"
                    style={{
                        backgroundImage: "url('/assets/hero-vs-special.jpg')",
                        backgroundPosition: '95% 0%'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-rr-dark/40" />
                </div>

                {/* Background Image Layer - Desktop */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat hidden md:block"
                    style={{
                        backgroundImage: "url('/assets/hero-vs-special.jpg')",
                        backgroundPosition: "75% 20%"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/75 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-transparent" />
                </div>


            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full container mx-auto px-6 h-full flex flex-col justify-center text-left pt-32">
                <div className="max-w-3xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-200 mb-6 uppercase tracking-tighter leading-none drop-shadow-2xl">
                            READY TO DOMINATE<br />THE T20 GAME?
                        </h1>
                        <p className="text-lg md:text-2xl text-white shadow-black drop-shadow-md font-semibold mb-4 leading-relaxed mt-4">
                            Modern cricket demands more than tradition. We develop explosive skills, sharp thinking and elite habits.
                        </p>
                        <p className="text-sm md:text-lg text-white/50 mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-md">
                            Designed and guided by one of the biggest cricket brands on the planet, the Elite Program draws on decades of global T20 experience. At Rajasthan Royals Academy, Melbourne, the T20 Elite Program delivers a one of a kind performance training environment designed to develop a modern day skill set.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm">
                            <span className="text-base">🔒</span>
                            <span className="text-white/80 text-xs font-bold uppercase tracking-wide">
                                RRA Melbourne participants get an exclusive group Q&A session with a Rajasthan Royals IPL star
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col items-start gap-4 pb-16 md:pb-24"
                    >
                        {/* Deadline badge */}
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                                Autumn Program — Applications Now Closed
                            </span>
                        </div>
                        <button
                            onClick={scrollToForm}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            APPLICATIONS CLOSED — STAY CONNECTED
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white opacity-50 hidden md:block"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </motion.div>

        </section>
    );
};

export default MasterHero;
