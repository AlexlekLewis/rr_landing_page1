import React from 'react';
import { motion } from 'framer-motion';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Web replica of the official "OPEN TRAINING DAY" poster hero — same hierarchy:
// crest → HALLA BOL → OPEN TRAINING DAY / SPECIAL EVENT → date → venue → address →
// "celebrate the opening…" line, then two clear path buttons so a visitor can act
// straight away (Junior Royal → see turn-up time · Elite Royal → jump to the form).
const OpenDayHero = ({ config }) => {
    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20"
            style={{ background: 'linear-gradient(178deg,#00112f 0%,#071a53 24%,#2a1063 52%,#7c1668 76%,#c11f83 100%)' }}>
            {/* ambient glows */}
            <div className="absolute -top-24 right-0 w-[26rem] h-[26rem] bg-rr-pink/25 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-40 -left-24 w-[24rem] h-[24rem] bg-rr-blue/30 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* Crest + org */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-7"
                >
                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne"
                        className="h-16 md:h-20 brightness-0 invert" />
                </motion.div>

                {/* HALLA BOL tag */}
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl font-black italic text-white/90 tracking-tight mb-4 -rotate-2"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
                >
                    HALLA BOL!
                </motion.p>

                {/* OPEN TRAINING DAY */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]"
                >
                    Open Training Day
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-3xl font-black text-rr-pink uppercase tracking-[0.2em] mt-2"
                >
                    Special Event
                </motion.p>

                {/* Date · Venue · Address */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
                    className="mt-7"
                >
                    <p className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">{config.dateHeadline}</p>
                    <p className="text-lg md:text-2xl font-black text-white uppercase tracking-tight mt-3 leading-tight">{config.venueHeadline}</p>
                    <p className="text-sm md:text-base font-medium text-white/80 mt-2">{config.address}</p>
                </motion.div>

                {/* Celebrate line */}
                <motion.p
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
                    className="text-sm md:text-lg font-black uppercase tracking-wide text-rr-light-pink mt-7 max-w-2xl mx-auto leading-snug"
                >
                    Celebrate the opening of our new Royals Academy centre in Melbourne's {config.region}
                </motion.p>

                {/* Two path buttons — "which one are you?" */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.46 }}
                    className="flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-10 max-w-2xl mx-auto"
                >
                    <button
                        onClick={() => scrollTo('register-junior')}
                        className="group flex-1 bg-white/10 hover:bg-white/15 border border-white/25 hover:border-white/50 rounded-2xl px-6 py-4 transition-all duration-300 text-left"
                    >
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-rr-light-pink mb-1">Junior Royal · {config.juniorTime}</span>
                        <span className="block text-base font-black text-white uppercase tracking-tight leading-tight">Register for Junior Royals →</span>
                        <span className="block text-xs font-medium text-white/70 mt-0.5">{config.juniorHint || 'Now required · ages 5–15'}</span>
                    </button>
                    <button
                        onClick={() => scrollTo('register')}
                        className="group flex-1 bg-rr-pink hover:bg-rr-light-pink rounded-2xl px-6 py-4 transition-all duration-300 text-left hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mb-1">Elite Royal · {config.eliteTime}</span>
                        <span className="block text-base font-black text-white uppercase tracking-tight leading-tight">Register for the trial →</span>
                        <span className="block text-xs font-medium text-white/80 mt-0.5">{config.eliteHint || 'Registration required · ages 11+'}</span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default OpenDayHero;
