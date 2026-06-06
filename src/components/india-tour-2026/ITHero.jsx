import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../assets/india-tour-2026/hero-coaching.jpg';

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const ITHero = ({ referralName }) => (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-rr-dark">
        {/* Background image */}
        <img
            src={heroImg}
            alt="Rajasthan Royals Academy players being coached in India"
            className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-rr-dark/30 md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/80 md:to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-[0.25em]">
                        Exclusive Invite to Elite Players
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                >
                    India Tour
                    <span className="block text-rr-pink">2026</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                    className="flex items-center gap-3 mt-5"
                >
                    <span className="h-px w-10 bg-gradient-to-r from-rr-pink to-rr-blue" />
                    <span className="text-lg md:text-2xl font-black text-white uppercase tracking-[0.35em]">
                        September
                    </span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                    className="text-base md:text-xl text-white/80 font-medium leading-relaxed mt-6 max-w-xl"
                >
                    An exclusive Rajasthan Royals Academy Melbourne touring squad — training
                    and playing cricket in India. Places are limited and by invitation.
                    Want more information? Register your interest below.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
                    className="mt-9"
                >
                    <button
                        onClick={scrollToRegister}
                        data-cta="hero-register"
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        Register Your Interest
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </div>
    </section>
);

export default ITHero;
