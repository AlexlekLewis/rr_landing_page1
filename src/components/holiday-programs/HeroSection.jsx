import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            {/* Dark base */}
            <div className="absolute inset-0 bg-rr-dark" />

            {/* Vaibhav — positioned top right */}
            <img
                src="/assets/hero-vs-special.jpg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 h-full w-auto max-w-none object-cover object-top pointer-events-none select-none"
                style={{ maxWidth: '75%' }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark from-30% via-rr-dark/80 via-50% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/40 to-transparent" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-4xl">
                {/* Urgency badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Early Bird $299 — Ends Midnight 8 June</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    SCHOOL HOLIDAYS.<br />
                    <span className="text-rr-pink">THE ROYALS WAY.</span>
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    3 days. 12 hours. Real Royals coaching.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm md:text-lg text-white/90 font-medium mb-8 max-w-xl"
                >
                    The Junior Royals Holiday Camp runs across the July school holidays for boys and girls aged 7–15. Multiple Melbourne locations.
                </motion.p>

                {/* Location pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-3 mb-10"
                >
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                        <span className="text-rr-pink font-bold text-xs">📍</span>
                        <span className="text-white text-xs font-semibold uppercase tracking-wide">Bundoora — 30 June – 2 July</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                        <span className="text-rr-pink font-bold text-xs">📍</span>
                        <span className="text-white text-xs font-semibold uppercase tracking-wide">Hallam — 7 – 9 July</span>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                >
                    Now Open — Early Bird $299
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </motion.button>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
            >
                <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Scroll</span>
                <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
