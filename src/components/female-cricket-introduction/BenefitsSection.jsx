import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
    {
        number: '01',
        headline: "She'll walk in nervous. She'll walk out confident.",
        body: "Every session is designed to build confidence from the very first ball. No prior experience needed — just a willingness to give it a go.",
    },
    {
        number: '02',
        headline: "She'll learn cricket the right way, from day one.",
        body: "Qualified female coaches teach proper technique across batting, bowling, and fielding — so she builds real skills, not bad habits.",
    },
    {
        number: '03',
        headline: "This isn't just sport. It's somewhere she belongs.",
        body: "A female-only environment where every participant is encouraged, included, and celebrated. No pressure. No comparison. Just cricket.",
    },
    {
        number: '04',
        headline: "You'll always know exactly how she's going.",
        body: "After every session, her coach provides a personal update — what she worked on, what she's improving, and how to keep the momentum going at home.",
    },
    {
        number: '05',
        headline: "Eight weeks that could change what she thinks she's capable of.",
        body: "The program doesn't just teach cricket — it builds coordination, focus, and a growth mindset that carries well beyond the pitch.",
    },
    {
        number: '06',
        headline: "A clear next step, not just an endpoint.",
        body: "Cricket Her Way is the beginning of a pathway. Participants finish the program with the skills, confidence, and a clear route to continue developing within the RRA female program.",
    },
];

const BenefitsSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-6xl mx-auto px-6">

                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Why Cricket Her Way</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6"
                    >
                        WHAT SHE <span className="text-rr-pink">GAINS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/70 max-w-2xl mx-auto font-medium"
                    >
                        Eight weeks that deliver more than cricket skills. Here's what your daughter will walk away with.
                    </motion.p>
                </div>

                {/* Benefit cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative bg-white/5 border border-white/10 hover:border-rr-pink/40 rounded-2xl p-8 transition-all duration-300 group"
                        >
                            {/* Number */}
                            <span className="text-5xl font-black text-white/5 group-hover:text-rr-pink/10 absolute top-6 right-8 leading-none transition-colors duration-300 select-none">
                                {b.number}
                            </span>

                            {/* Pink accent line */}
                            <div className="w-8 h-1 rounded-full bg-rr-pink mb-6" />

                            {/* Headline */}
                            <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wide leading-snug mb-4 pr-8">
                                {b.headline}
                            </h3>

                            {/* Body */}
                            <p className="text-white/60 text-sm font-medium leading-relaxed">
                                {b.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
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
