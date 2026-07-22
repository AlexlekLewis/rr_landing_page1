import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CENTRE } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Venue-first hero: the Mickleham ISC exterior when the photo is supplied
// (drop it at /assets/private-coaching/mickleham-exterior.jpg), falling back
// to the Academy lanes until then. Royals lion watermark overlays either.
const EXTERIOR_SRC = '/assets/private-coaching/mickleham-exterior.jpg';
const FALLBACK_SRC = '/assets/cec-lanes.jpg';

const PCHero = () => {
    const [heroSrc, setHeroSrc] = useState(EXTERIOR_SRC);

    return (
        <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-rr-dark">
            <div className="absolute inset-0">
                <img
                    src={heroSrc}
                    onError={() => heroSrc !== FALLBACK_SRC && setHeroSrc(FALLBACK_SRC)}
                    alt={`${CENTRE.name} — home of Royals Academy private coaching`}
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-rr-dark/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/60 md:to-transparent" />
                {/* Royals watermark over the venue shot */}
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
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                                Now Open — {CENTRE.name}
                            </span>
                        </div>
                        {/* Venue co-brand lockup */}
                        <img
                            src="/assets/powergame/partners/mickleham-isc.png"
                            alt="Mickleham Indoor Sports Centre"
                            className="h-8 w-auto brightness-0 invert opacity-80"
                        />
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        Private<br />Coaching
                    </h1>
                    <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-2xl mb-10">
                        One coach. One player. A development journey built around your game — a
                        first consultation, then a three or six-session block — planned and
                        overseen by the centre's Head Coach at {CENTRE.name}.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => scrollTo('eoi-form')}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            Register Your Interest
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('pricing')}
                            className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/60 transition-colors w-full sm:w-auto"
                        >
                            See Pricing
                        </button>
                    </div>

                    {/* The value stack — 6+ full hours opens the Royals pathway */}
                    <div className="mt-10 pt-6 border-t border-white/15 max-w-2xl">
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.25em] mb-3">
                            Book 6+ full hours and you're eligible for
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8">
                            {['Power League selection — T20 matches', 'The India Tour — High Performance Centre'].map((t) => (
                                <span key={t} className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span className="text-white font-bold text-sm">{t}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        </section>
    );
};

export default PCHero;
