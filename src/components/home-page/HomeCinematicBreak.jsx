import React from 'react';
import { motion } from 'framer-motion';

const HomeCinematicBreak = ({ onRegisterClick }) => {
    return (
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/assets/maphaka-bowling.webp')" }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-rr-dark/60" />
            {/* Gradient top + bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-transparent to-slate-50/80" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4">The Royals Way</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
                        PACE. SKILL.<br />
                        <span className="text-rr-pink">PRECISION.</span>
                    </h2>
                    <p className="text-white/70 font-medium text-base md:text-lg max-w-xl mx-auto mb-8">
                        From explosive batting to match-winning bowling — every RRA program is built around the skills that define the modern T20 game.
                    </p>
                    <button
                        onClick={onRegisterClick}
                        data-cta="cinematic-register"
                        className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-2 group"
                    >
                        Find Your Program
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeCinematicBreak;
