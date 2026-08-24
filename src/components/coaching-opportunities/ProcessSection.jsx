import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
    {
        number: '01',
        title: 'Apply',
        body: 'Submit your application below. Tell us about your background, your skills, and what you want to achieve.',
    },
    {
        number: '02',
        title: 'Conversation',
        body: 'Shortlisted applicants meet with our leadership team to discuss fit, role, and pathway.',
    },
    {
        number: '03',
        title: 'Onboard & Deliver',
        body: 'Compliance, induction, and a supported start — shadow sessions for coaches, structured handover for every other role.',
    },
];

const ProcessSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        How It Works
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        Three Steps to <span className="text-rr-pink">Joining the Royals.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto origin-center"
                    />
                </div>

                {/* Steps grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-14">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-rr-pink via-rr-blue to-rr-pink opacity-30" />

                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 * i }}
                            className="relative text-center md:text-left"
                        >
                            {/* Number circle */}
                            <div className="relative inline-block mb-5">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-rr-pink flex items-center justify-center shadow-lg shadow-rr-pink/20">
                                    <span className="text-rr-pink font-black text-lg">{step.number}</span>
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-rr-dark uppercase tracking-tight mb-3">{step.title}</h3>
                            <p className="text-rr-charcoal font-medium leading-relaxed text-sm md:text-base max-w-xs md:max-w-none mx-auto md:mx-0">{step.body}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Start Step One
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default ProcessSection;
