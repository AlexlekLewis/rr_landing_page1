import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: 'cricket',
        title: 'Expert Coaching',
        desc: 'Royals Academy certified coaches delivering structured, fun and development sessions every day.',
    },
    {
        icon: 'bolt',
        title: 'Traditional & T20 Skills',
        desc: 'Practice and develop cricket basics and modern skills in a development environment.',
    },
    {
        icon: 'users',
        title: 'Boys & Girls',
        desc: 'Separate age groups for male and female cricketers. Safe, inclusive environment.',
    },

    {
        icon: 'pin',
        title: 'Three Melbourne Centres',
        desc: 'Centres across Melbourne — north, south-east and west. Pick whichever you can get to.',
    },
    {
        icon: 'clock',
        title: 'Three Days, 12 Hours',
        desc: 'Four hours a day across three consecutive days. The exact days and start times are confirmed by email once we set them.',
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
                        WHAT YOUR CHILD <span className="text-rr-pink">RECEIVES</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        The perfect preparation for the 2026/27 season. Important skill development with game scenario based cricket to ensure your player is ready for ball 1. Make this your best season yet.
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
                            <div className="w-10 h-10 mb-4 text-rr-pink">
                                {f.icon === 'cricket' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l12-12M7.5 7.5l9 9M15 3l6 6-3 3-6-6 3-3zM3 21l3-3"/></svg>}
                                {f.icon === 'bolt' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
                                {f.icon === 'users' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
                                {f.icon === 'pin' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                                {f.icon === 'clock' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
                            </div>
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
                        Register Your Interest
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
