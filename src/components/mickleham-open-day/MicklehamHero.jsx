import React from 'react';
import { motion } from 'framer-motion';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const MicklehamHero = () => {
    return (
        <section className="relative overflow-hidden bg-rr-dark pt-28 pb-20 md:pt-36 md:pb-28">
            {/* brand gradient wash + glows */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #001D48 0%, #0b1f6b 42%, #6d1566 100%)' }} />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-rr-pink/25 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-rr-blue/30 rounded-full blur-[130px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="text-xs md:text-sm font-bold text-rr-light-pink uppercase tracking-[0.3em] mb-5"
                >
                    Our new Northern home 🏠 · Mickleham
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                >
                    Mickleham<br /><span className="text-rr-pink">Open Day</span>
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
                    className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mt-6"
                >
                    Sunday 5 July <span className="text-rr-pink">·</span> 9am–12pm
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
                    className="text-base md:text-xl text-white/85 font-medium leading-relaxed max-w-2xl mx-auto mt-6"
                >
                    Everyone's welcome. <strong className="text-white">Turn up and play from 9am</strong> — no sign-up needed.
                    Chasing the <strong className="text-white">Elite Program</strong> and aged 11+? Register for the trial.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                    <button
                        onClick={() => scrollTo('register')}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        Register for the Elite Trial
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollTo('whats-on')}
                        className="text-white/90 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border border-white/25 hover:border-white/50 transition-all duration-300 w-full sm:w-auto"
                    >
                        Just turning up? See the plan
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default MicklehamHero;
