import React from 'react';
import { motion } from 'framer-motion';

const CoachesDayHero = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative bg-rr-dark overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-32 -left-24 w-96 h-96 bg-rr-pink/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-rr-blue/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-28 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6"
                >
                    The Royals Have Moved To Mickleham
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8"
                >
                    An Afternoon<br />For <span className="text-rr-pink">Coaches</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.18 }}
                    className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-white/5 border border-white/15 rounded-full pl-1.5 pr-5 py-1.5 mb-10"
                >
                    <span className="bg-rr-pink text-white text-sm font-black uppercase tracking-widest rounded-full px-4 py-1.5">
                        Free
                    </span>
                    <span className="text-xs md:text-sm font-bold text-white/85 uppercase tracking-widest">
                        For community coaches · junior &amp; senior welcome
                    </span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.26 }}
                    className="text-base md:text-lg text-white/75 font-medium max-w-2xl mx-auto leading-relaxed mb-4"
                >
                    We&rsquo;ve just made Mickleham our new home &mdash; and the first thing we want to do is connect with the coaches in our community.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.32 }}
                    className="text-base md:text-lg text-white/75 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    So consider this an open invitation. Come and spend an afternoon with our coaching team &mdash; meet us, see how we work, and get to know the Royals. Junior coach or senior coach, you&rsquo;re welcome.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    onClick={scrollToForm}
                    data-cta="hero-register-coach"
                    className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3 justify-center"
                >
                    Register My Spot
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </motion.button>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.48 }}
                    className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-widest mt-8"
                >
                    Sunday 26 July 2026 · 1:00&ndash;4:00 PM · The Mickleham Centre
                </motion.p>
            </div>
        </section>
    );
};

export default CoachesDayHero;
