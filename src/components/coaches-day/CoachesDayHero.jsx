import React from 'react';
import { motion } from 'framer-motion';

const CoachesDayHero = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative bg-rr-dark overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-32 -left-24 w-96 h-96 bg-rr-pink/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-rr-blue/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-28 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-8"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em]">
                        Free Coaches Afternoon · Sunday 26 July
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6"
                >
                    The Coaches<br /><span className="text-rr-pink">Session</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="text-base md:text-lg text-white/75 font-medium max-w-2xl mx-auto leading-relaxed mb-4"
                >
                    An afternoon by coaches, for coaches. Come and spend a few hours with us at our new home in Mickleham, get inside the Royals Way, and swap ideas with other local coaches who love this game as much as you do.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.28 }}
                    className="text-sm text-white/50 font-semibold uppercase tracking-widest mb-10"
                >
                    No cost. No catch. Just cricket.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.36 }}
                    onClick={scrollToForm}
                    data-cta="hero-register-coach"
                    className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3 justify-center"
                >
                    Save My Spot
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </motion.button>
            </div>
        </section>
    );
};

export default CoachesDayHero;
