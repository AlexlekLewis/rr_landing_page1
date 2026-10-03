import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { JR_T4 } from './jrTerm4Data';

// Junior Royals — Term 4, 2026. Every fact here comes from jrTerm4Data.js.
// No Term 4 price is set yet (Alex, 3 Oct 2026), so the page takes entries
// only: no price, no payment, and it says so beside the button.
const JRT3Hero = () => {
    const scrollToForm = () =>
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            <div className="absolute inset-0 bg-gradient-to-br from-rr-dark via-rr-dark/95 to-rr-navy/60" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-4xl">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-6"
                >
                    Rajasthan Royals Academy · Melbourne
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    JUNIOR ROYALS<span className="sr-only"> — </span><br />
                    <span className="text-rr-pink">TERM 4, 2026</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    {JR_T4.weeks} Wednesday nights, {JR_T4.datesLong}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-lg text-white/80 font-medium mb-4 max-w-xl"
                >
                    One hour of cricket coaching every Wednesday night, in a small group of players your own age, so your player is ready for their club season.
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
                    <p className="text-white/70 text-sm font-medium mt-4 max-w-xl">{JR_T4.noPaymentLine}</p>
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
