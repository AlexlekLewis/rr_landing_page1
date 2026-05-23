import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: '🏏',
        title: 'Expert Coaching',
        desc: 'Royals Academy certified coaches delivering structured, fun and development sessions every day.',
    },
    {
        icon: '⚡',
        title: 'Traditional & T20 Skills',
        desc: 'Practice and develop cricket basics and modern skills in a development environment.',
    },
    {
        icon: '👦👧',
        title: 'Boys & Girls',
        desc: 'Separate age groups for male and female cricketers. Safe, inclusive environment.',
    },
    {
        icon: '👕',
        title: 'Training Shirt Included',
        desc: 'Every player receives an official Rajasthan Royals Academy training shirt — $299 all in.',
    },
    {
        icon: '📍',
        title: 'Two Locations',
        desc: 'Bundoora (north) and Hallam (south-east) — choose what works for your family.',
    },
    {
        icon: '⏰',
        title: '4 Hours Daily',
        desc: '9:00 AM – 1:00 PM. Three consecutive days. 12 hours of cricket development.',
    },
];

const ClinicOverview = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        WHAT YOUR PLAYER <span className="text-rr-pink">GETS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Three days inside a genuine development environment. The same coaching philosophy that drives the Rajasthan Royals — adapted for young and developing cricketers.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group bg-slate-50 hover:bg-rr-dark rounded-2xl p-8 transition-all duration-300 border border-slate-100 hover:border-rr-pink/30"
                        >
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="text-lg font-black text-rr-dark group-hover:text-rr-pink uppercase tracking-wide mb-3 transition-colors duration-300">{f.title}</h3>
                            <p className="text-rr-charcoal group-hover:text-white/70 text-sm font-medium leading-relaxed transition-colors duration-300">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        Registration Opening Soon Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default ClinicOverview;
