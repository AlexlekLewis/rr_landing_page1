import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            {/* Mobile background */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat md:hidden"
                style={{ backgroundImage: "url('/assets/female-cricket-hero.png')", backgroundPosition: '90% 10%' }}
            />
            {/* Desktop background */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat hidden md:block"
                style={{ backgroundImage: "url('/assets/female-cricket-hero.png')", backgroundPosition: '90% 10%' }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/65 to-rr-dark/25 md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/75 to-transparent hidden md:block" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-4xl">
                {/* Program tag */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Girls Kickstart Program · Ages 7+ · Limited Spots</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    CRICKET.<br />
                    HER WAY.<br />
                    YOUR WAY.<br />
                    <span className="text-rr-pink">THE ROYALS WAY.</span>
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    Girls Kickstart Program — Introduction to Cricket
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm md:text-lg text-white/90 font-medium mb-8 max-w-xl"
                >
                    An 8-week introductory program for females aged 7 and above. Royals accredited female coaches. Supportive, inclusive environment. Bundoora, Melbourne.
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
                        <span className="text-white text-xs font-semibold uppercase tracking-wide">Bundoora — Thursdays from 7 May, 5–6pm</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                        <span className="text-rr-pink font-bold text-xs">🏏</span>
                        <span className="text-white text-xs font-semibold uppercase tracking-wide">8 Weeks · $349</span>
                    </div>
                    <div className="flex items-center gap-2 bg-rr-pink/20 border border-rr-pink/40 rounded-full px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-rr-pink text-xs font-black uppercase tracking-wide">⭐ Includes Exclusive RRA IPL Invite</span>
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
                    Register Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
