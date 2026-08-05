import React from 'react';
import { motion } from 'framer-motion';
import aspirationImg from '../../assets/india-tour-2026/aspiration-centurion.jpg';

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const ITAspiration = () => (
    <section className="relative overflow-hidden bg-rr-navy">
        <img
            src={aspirationImg}
            alt="A young Rajasthan Royals batter celebrating a century"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rr-navy via-rr-navy/85 to-rr-navy/50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-28">
            <div className="max-w-2xl">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                >
                    The Pathway
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none"
                >
                    Where Talent <span className="text-rr-pink">Goes Further</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-white/75 font-medium leading-relaxed mt-6"
                >
                    The Royals develop players from the academy to the biggest stages in world
                    cricket. A tour of India is a rare chance to test your game in its heartland —
                    and to be seen.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    onClick={scrollToRegister}
                    data-cta="aspiration-register"
                    className="group mt-9 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                >
                    Register Your Interest
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </motion.button>
            </div>
        </div>
    </section>
);

export default ITAspiration;
