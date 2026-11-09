import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { JR_T4, JR_PHOTOS } from './jrTerm4Data';

// Junior Royals. Every fact here comes from jrTerm4Data.js.
// Join any week, weekly price only (8 Nov 2026): the price sits beside the button, with the shirt.
const JRT3Hero = () => {
    const scrollToForm = () =>
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            {/* A real session behind the words (8 Nov 2026), darkened so the text stays readable. */}
            <img src={JR_PHOTOS.hero.src} srcSet={`${JR_PHOTOS.hero.srcSm} 480w, ${JR_PHOTOS.hero.src} 900w`} sizes="100vw"
                alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover object-[center_40%] opacity-50 lg:opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/90 via-rr-dark/75 to-rr-dark/95 lg:bg-gradient-to-br lg:from-rr-dark lg:via-rr-dark/85 lg:to-rr-navy/70" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-6xl lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:items-center">
                <div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-6"
                >
                    {JR_T4.heroEyebrow}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    {JR_T4.heroTitle}<span className="sr-only"> — </span><br />
                    <span className="text-rr-pink">{JR_T4.heroTitleAccent}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    {JR_T4.heroSub}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-lg text-white/80 font-medium mb-4 max-w-xl"
                >
                    {JR_T4.heroLead}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-sm md:text-base text-white font-semibold mb-6 max-w-xl"
                >
                    {JR_T4.factLine}
                </motion.p>

                {/* Venue pills — the two Term 4 centres, each with its suburb */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3 mb-8"
                >
                    {JR_T4.centres.map((c) => (
                        <div key={c.value} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                            <span className="text-rr-pink font-bold text-xs">📍</span>
                            <span className="text-white text-xs font-semibold uppercase tracking-wide">{c.venue}, {c.suburb}</span>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        {JR_T4.ctaLabel}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <p className="text-white text-sm md:text-base font-black mt-4 max-w-xl">{JR_T4.priceLine}</p>
                    <p className="text-white/70 text-sm font-medium mt-1 max-w-xl">{JR_T4.joinLine}</p>
                    <p className="text-white/70 text-sm font-medium mt-1 max-w-xl">{JR_T4.shirtLine}</p>
                </motion.div>
                </div>

                {/* Desktop: two framed photos from real sessions. */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
                    className="hidden lg:block relative h-[560px]">
                    <img src={JR_PHOTOS.heroFeature.src} alt={JR_PHOTOS.heroFeature.alt}
                        className="absolute right-0 top-0 w-[78%] h-[480px] object-cover rounded-3xl border-4 border-white/10" />
                    <img src={JR_PHOTOS.heroInset.src} alt={JR_PHOTOS.heroInset.alt}
                        className="absolute left-0 bottom-0 w-[48%] h-[300px] object-cover rounded-3xl border-4 border-rr-dark" />
                    <span className="absolute right-4 bottom-24 bg-rr-pink text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">Ages 7–12 · Melbourne</span>
                </motion.div>
            </div>

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

export default JRT3Hero;
