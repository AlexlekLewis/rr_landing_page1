import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            {/* Mobile background */}
            <div
                className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat md:hidden"
                style={{ backgroundImage: "url('/assets/lahiri-coaching.jpg')" }}
            />
            {/* Desktop background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
                style={{ backgroundImage: "url('/assets/lahiri-coaching.jpg')" }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-rr-dark/30 md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/80 to-rr-dark/20 hidden md:block" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-5xl">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">We're Hiring</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6"
                >
                    JOIN AUSTRALIA'S<br />
                    <span className="text-rr-pink">MOST PROGRESSIVE</span><br />
                    CRICKET ACADEMY
                </motion.h1>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="w-16 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-6 origin-left"
                />

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-base md:text-xl text-white/85 font-medium leading-relaxed max-w-3xl mb-6"
                >
                    Rajasthan Royals Academy Melbourne is building a team aligned to the standards of a global high-performance program — coaches, operations, media, and more. We're looking for people who lead with curiosity, deliver with rigour, and put the player first.
                </motion.p>

                {/* Engagement type chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="flex flex-wrap gap-2 md:gap-3 mb-10"
                >
                    {['Volunteer', 'Casual', 'Work Experience', 'Part-Time', 'Full-Time'].map((type) => (
                        <span
                            key={type}
                            className="bg-white/5 border border-white/20 text-white/90 text-[11px] md:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            {type}
                        </span>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 justify-center"
                    >
                        Apply Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollToAbout}
                        className="group bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 flex items-center gap-3 justify-center"
                    >
                        Learn More
                    </button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                onClick={scrollToAbout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-white transition-colors"
                aria-label="Scroll down"
            >
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </section>
    );
};

export default HeroSection;
