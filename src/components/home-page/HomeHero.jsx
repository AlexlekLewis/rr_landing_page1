import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HomeHero = ({ onRegisterClick }) => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            {/* Mobile background */}
            <div
                className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat md:hidden"
                style={{ backgroundImage: "url('/assets/hero-jaiswal.webp')" }}
            />
            {/* Desktop background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
                style={{ backgroundImage: "url('/assets/hero-jaiswal.webp')" }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/20 md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/70 to-transparent hidden md:block" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-3xl">
                {/* Urgency badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">2026 Programs Now Open</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    PLAY THE<br />
                    <span className="text-rr-pink">ROYALS WAY.</span>
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    Melbourne's official Rajasthan Royals cricket academy.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm md:text-lg text-white/80 font-medium mb-10 max-w-xl"
                >
                    Elite coaching. World-class methodology. The same performance environment that shaped IPL stars — now available to cricketers across Melbourne.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={onRegisterClick}
                        data-cta="hero-register"
                        className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-2 group justify-center"
                    >
                        Register Now
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <a
                        href="#programs"
                        className="border border-white/30 hover:border-white text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 text-center"
                    >
                        Explore Programs
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Scroll</span>
                <ChevronDown className="w-4 h-4 text-white/50 animate-bounce" />
            </motion.div>
        </section>
    );
};

export default HomeHero;
