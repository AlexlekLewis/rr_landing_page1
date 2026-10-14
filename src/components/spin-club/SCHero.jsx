import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM, START_DATE, END_DATE, FOUNDER, HEADLINE } from './scOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Analytics, 9 Oct 2026: two thirds of visitors saw the hero and never scrolled.
// So the headline is now the problem a spinner recognises, not the product name,
// and the price has moved down to the pricing section where the value is explained.
const FACTS = [
    { title: `Ages ${PROGRAM.ages}`, detail: 'Spin bowlers only, at every standard of cricket' },
    { title: `${PROGRAM.weeks} Wednesday nights`, detail: `${PROGRAM.time}, ${START_DATE.replace('Wednesday ', '')} through to ${END_DATE.replace('Wednesday ', '')}` },
    { title: 'Two centres', detail: 'Mickleham in the north, Cranbourne North in the south-east' },
];

const SCHero = () => (
    <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-rr-dark">
        <div className="absolute inset-0">
            <img
                src="/assets/cec-lanes.jpg"
                alt="Indoor lanes at a Rajasthan Royals Academy Melbourne centre"
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-rr-dark/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/75 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/65 md:to-transparent" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 pt-36 md:pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <p className="text-xs md:text-sm font-black text-rr-pink uppercase tracking-[0.3em] mb-5">
                    Rajasthan Royals Academy Melbourne &middot; Spin Club
                </p>

                {/* Name first, then the promise, then the tagline it signs off with. */}
                <h1 className="font-black text-white uppercase tracking-tighter mb-6 max-w-4xl">
                    <span className="block text-5xl md:text-7xl lg:text-8xl leading-[0.88]">
                        {HEADLINE.name}
                    </span>
                    <span className="block text-2xl md:text-4xl lg:text-5xl leading-[1.04] mt-3 text-white/90">
                        {HEADLINE.promise}
                    </span>
                    <span className="block text-3xl md:text-5xl lg:text-6xl leading-[1.0] mt-2 text-rr-pink">
                        and {HEADLINE.rip}
                    </span>
                </h1>

                <p className="text-lg md:text-2xl text-white font-bold leading-snug max-w-2xl mb-6">
                    That is the hardest part of spin, and most spinners work it out alone in the
                    car on the way home. Spin Club is where you work it out with other spinners.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <button
                        onClick={() => scrollTo('apply')}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        Sign up for a night
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollTo('what-it-is')}
                        className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/50 transition-all duration-300"
                    >
                        What a night looks like
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="bg-rr-pink text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-full px-4 py-2">
                        Spinners aged {PROGRAM.ages}
                    </span>
                    <span className="border-2 border-white/35 text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-full px-4 py-2">
                        Places are limited
                    </span>
                    <span className="border-2 border-white/35 text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-full px-4 py-2">
                        Every type of spin
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 max-w-3xl mb-8">
                    {FACTS.map((f) => (
                        <div key={f.title} className="border-t border-white/25 pt-3">
                            <p className="text-white text-sm font-black uppercase tracking-wide leading-tight mb-1.5">
                                {f.title}
                            </p>
                            <p className="text-white/65 text-[13px] font-medium leading-snug">{f.detail}</p>
                        </div>
                    ))}
                </div>

                {/* Who stands behind it — Alex, then the two Royal Spin Coaches. */}
                <p className="text-[13px] md:text-sm text-white/70 font-medium leading-relaxed max-w-2xl">
                    Built and overseen by <strong className="text-white">{FOUNDER.name}</strong>,
                    {' '}{FOUNDER.role} and a {FOUNDER.second}. Coached at Mickleham by{' '}
                    <strong className="text-white">Callum Stow</strong> and at Cranbourne North by{' '}
                    <strong className="text-white">Harkirat Bajwa</strong>.
                </p>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
    </section>
);

export default SCHero;
