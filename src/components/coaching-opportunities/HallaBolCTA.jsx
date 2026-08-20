import React from 'react';
import { motion } from 'framer-motion';

const HallaBolCTA = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative bg-rr-dark overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-0">

                {/* Left: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex-1 text-center md:text-left z-10 pb-0 md:pb-10"
                >
                    <p className="text-rr-pink text-xs font-black uppercase tracking-[0.3em] mb-5">
                        Official Rajasthan Royals Academy
                    </p>

                    {/* HALLA BOL — all one consistent stroke style */}
                    <div className="leading-none mb-6">
                        <p className="text-7xl md:text-9xl font-black text-white uppercase leading-none tracking-tight">
                            HALLA
                        </p>
                        <p className="text-7xl md:text-9xl font-black uppercase leading-none tracking-tight text-transparent"
                            style={{ WebkitTextStroke: '3px #E11F8F' }}>
                            BOL!
                        </p>
                    </div>

                    <p className="text-white/60 text-base md:text-lg font-semibold leading-relaxed max-w-sm mx-auto md:mx-0 mb-8">
                        Build your career inside one of world cricket's most iconic brands.
                    </p>

                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Apply Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>

                {/* Right: Players — larger, anchored to bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="flex-1 flex justify-center md:justify-end relative md:-mb-0"
                >
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-rr-pink/8 blur-3xl rounded-full pointer-events-none" />
                    <img
                        src="/assets/halla-bol-players.png"
                        alt="Rajasthan Royals IPL Players — Halla Bol!"
                        className="relative z-10 w-full max-w-full md:max-w-full object-contain scale-[1.3] origin-bottom translate-y-16 translate-x-3 md:translate-x-0 md:translate-y-24"
                    />
                </motion.div>

            </div>
        </section>
    );
};

export default HallaBolCTA;
