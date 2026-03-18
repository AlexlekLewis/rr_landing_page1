import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
    {
        number: '01',
        headline: "She'll leave a better cricketer than she arrived.",
        body: "Every session is built on technical excellence. Batting, bowling, and fielding coaching that actually moves the needle — not repetition for repetition's sake.",
    },
    {
        number: '02',
        headline: "She'll develop the mindset that separates good from great.",
        body: "Composure under pressure, the ability to reset after a setback, and the mental clarity to perform in the moments that count. This is where champions are made.",
    },
    {
        number: '03',
        headline: "She'll walk onto any field with leadership presence.",
        body: "Communication, decision-making, game awareness, and the courage to step up. These aren't just cricket skills — they're life skills.",
    },
    {
        number: '04',
        headline: "She'll understand the game at a completely different level.",
        body: "Game sense, tactical awareness, reading the match situation, and knowing exactly how to influence what happens next. Cricket IQ, developed.",
    },
    {
        number: '05',
        headline: "She'll build habits that last far beyond 12 weeks.",
        body: "Nutrition, fitness, recovery, and self-directed learning. The program installs the foundations of a high-performance lifestyle — not just a cricket season.",
    },
    {
        number: '06',
        headline: "She'll become someone her teammates rely on.",
        body: "Coachability, accountability, communication, and the ability to lift others around her. The Royals Way is a team culture — and she'll be central to it.",
    },
];

const BenefitsSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">What She Gains</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        TWELVE WEEKS. <span className="text-rr-pink">TRANSFORMATIONAL RESULTS.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        This isn't a participation program. It's a performance environment designed to produce measurable growth — on the field and beyond it.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative bg-slate-50 hover:bg-rr-dark border border-slate-100 hover:border-rr-pink/30 rounded-2xl p-8 transition-all duration-300 group"
                        >
                            {/* Number */}
                            <span className="text-5xl font-black text-slate-200 group-hover:text-rr-pink/10 absolute top-6 right-8 leading-none transition-colors duration-300 select-none">
                                {b.number}
                            </span>

                            {/* Pink accent line */}
                            <div className="w-8 h-1 rounded-full bg-rr-pink mb-6" />

                            {/* Headline */}
                            <h3 className="text-base md:text-lg font-black text-rr-dark group-hover:text-white uppercase tracking-wide leading-snug mb-4 pr-8 transition-colors duration-300">
                                {b.headline}
                            </h3>

                            {/* Body */}
                            <p className="text-rr-charcoal group-hover:text-white/60 text-sm font-medium leading-relaxed transition-colors duration-300">
                                {b.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        Register Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default BenefitsSection;
