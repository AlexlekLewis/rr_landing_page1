import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Prices are placeholders — update `price` values when confirmed.
const PHASES = [
    {
        num: '01',
        name: 'Pre-Season Power Phase',
        weeks: '8 weeks',
        price: 960,
        rate: '$60 per hour',
        onSale: true,
        description:
            'Build the engine. Eight weeks of foundational power development — strength, technique, and the movement patterns that underpin explosive performance before the season starts.',
        accent: 'from-rr-blue to-rr-medium-blue',
    },
    {
        num: '02',
        name: 'In-Season Power Phase',
        weeks: '10 weeks',
        price: 0, // TBC
        onSale: false,
        description:
            'Apply it under load. Ten weeks of in-season work that keeps power sharp while you compete — maintaining output, refining skills, and translating training into match performance.',
        accent: 'from-rr-pink to-rr-blue',
    },
    {
        num: '03',
        name: 'Power League Phase',
        weeks: '6 weeks',
        price: 0, // TBC
        onSale: false,
        description:
            'Prove it in the middle. Six weeks of competitive, scenario-based cricket where players express their power under pressure in a game environment.',
        accent: 'from-rr-pink to-rr-light-pink',
    },
];

const ALL_IN_PRICE = 0; // TBC — the discounted bundle price

const formatPrice = (n) => (n > 0 ? `$${n.toLocaleString()}` : 'TBC');

const PricingSection = () => {
    const sumSeparate = PHASES.reduce((acc, p) => acc + p.price, 0);
    const saving = sumSeparate > 0 && ALL_IN_PRICE > 0 ? sumSeparate - ALL_IN_PRICE : 0;

    return (
        <section className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,31,143,0.18) 0%, rgba(0,0,0,0) 55%)' }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Three Phases · One Season
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        THE <span className="text-rr-pink">POWER</span> JOURNEY
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        A full season of power development across three phases. Take them one at a time, or commit to the complete journey and save.
                    </p>
                </motion.div>

                {/* Phase cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
                    {PHASES.map((phase, idx) => (
                        <motion.div
                            key={phase.name}
                            className={`relative backdrop-blur-sm rounded-2xl p-8 flex flex-col transition-all duration-300 overflow-hidden ${
                                phase.onSale
                                    ? 'bg-white/[0.07] border-2 border-rr-pink shadow-[0_10px_50px_rgba(225,31,143,0.3)] md:-translate-y-3'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rr-pink/40'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.accent}`} />

                            {phase.onSale && (
                                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-rr-pink rounded-full px-3 py-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">On Sale Now</span>
                                </div>
                            )}

                            <div className="flex items-baseline justify-between mb-4">
                                <span className="text-5xl font-black text-white/10 leading-none">{phase.num}</span>
                                {!phase.onSale && (
                                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest bg-rr-pink/10 border border-rr-pink/30 rounded-full px-3 py-1">
                                        {phase.weeks}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide leading-tight mb-1">
                                {phase.name}
                            </h3>
                            <div className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-4">
                                {phase.weeks}
                            </div>

                            <p className="text-sm text-white/75 font-medium leading-relaxed mb-6 flex-1">
                                {phase.description}
                            </p>

                            <div className="pt-5 border-t border-white/10">
                                <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                                    Phase Price
                                </div>
                                <div className="text-3xl font-black text-white">
                                    {formatPrice(phase.price)}
                                </div>
                                {phase.rate && (
                                    <div className="text-xs font-medium text-white/50 mt-1">{phase.rate}</div>
                                )}
                                {phase.onSale && (
                                    <a
                                        href="#apply"
                                        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                                    >
                                        Apply Now
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* All-in bundle */}
                <motion.div
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink p-8 md:p-10 border border-rr-pink/40"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Best Value</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mb-3">
                                The Complete Power Journey
                            </h3>
                            <p className="text-sm md:text-base text-white/85 font-medium mb-4 max-w-xl">
                                All three phases — 24 weeks of power development across the full season. One commitment, the complete pathway.
                            </p>
                            <ul className="space-y-2">
                                {PHASES.map((p) => (
                                    <li key={p.name} className="flex items-center gap-2 text-sm text-white font-semibold">
                                        <Check className="w-4 h-4 text-white flex-shrink-0" />
                                        {p.name} <span className="text-white/60 font-medium">· {p.weeks}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex-shrink-0 text-left md:text-right">
                            {saving > 0 && (
                                <div className="text-sm text-white/70 font-bold uppercase tracking-wide line-through mb-1">
                                    {formatPrice(sumSeparate)}
                                </div>
                            )}
                            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
                                All-In Price
                            </div>
                            <div className="text-5xl md:text-6xl font-black text-white leading-none mb-3">
                                {formatPrice(ALL_IN_PRICE)}
                            </div>
                            {saving > 0 ? (
                                <div className="inline-block bg-white text-rr-pink text-sm font-black uppercase tracking-widest rounded-full px-4 py-2">
                                    Save {formatPrice(saving)}
                                </div>
                            ) : (
                                <div className="inline-block bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2">
                                    Pricing TBC
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <p className="text-center text-xs md:text-sm text-white/50 mt-8 font-medium uppercase tracking-widest">
                    In-Season &amp; Power League pricing to be confirmed
                </p>
            </div>
        </section>
    );
};

export default PricingSection;
