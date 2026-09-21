import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM, START_DATE } from './scOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const FACTS = [
    { title: 'Wednesday nights', detail: `${PROGRAM.time}, every week of the ${PROGRAM.weeks}-week block` },
    { title: 'Two centres', detail: 'Mickleham in the north, Cranbourne North in the south-east' },
    { title: 'Spinners only', detail: `Ages ${PROGRAM.ages}, every standard of cricket` },
];

const SCHero = () => (
    <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-rr-dark">
        <div className="absolute inset-0">
            <img
                src="/assets/cec-lanes.jpg"
                alt="Indoor lanes at a Rajasthan Royals Academy Melbourne centre"
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-rr-dark/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/60 md:to-transparent" />
            <img
                src="/assets/rr-lion-white.png"
                alt=""
                aria-hidden="true"
                className="absolute -right-24 -bottom-24 w-[520px] max-w-none opacity-[0.08] pointer-events-none select-none"
            />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 pt-40 md:pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                        {START_DATE ? `Starts ${START_DATE}` : 'Now taking applications'}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                    Spin<br />Club
                </h1>

                <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-2xl mb-4">
                    A Wednesday night club where Melbourne&rsquo;s spinners train together, run by
                    the Rajasthan Royals Academy Melbourne. Two centres, two Royal Spin Coaches who
                    bowl spin for a living, and a small group who all bowl what you bowl.
                </p>

                <p className="text-base md:text-lg text-white font-semibold leading-relaxed max-w-2xl mb-10">
                    Register your interest, and the Royal Spin Coach picks the group. Offers go out
                    in two rounds, so you hear from us either way.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 max-w-3xl mb-10">
                    {FACTS.map((f) => (
                        <div key={f.title} className="border-t border-white/25 pt-3">
                            <p className="text-white text-sm font-black uppercase tracking-wide leading-tight mb-1.5">
                                {f.title}
                            </p>
                            <p className="text-white/65 text-[13px] font-medium leading-snug">{f.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => scrollTo('apply')}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        Apply for a place
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollTo('clubs')}
                        className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/50 transition-all duration-300"
                    >
                        Meet the coaches
                    </button>
                </div>
            </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
    </section>
);

export default SCHero;
