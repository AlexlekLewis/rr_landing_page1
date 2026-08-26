import React from 'react';
import { motion } from 'framer-motion';

const DEVELOPMENT = [
    {
        title: 'Structured Onboarding',
        body: 'A series of meetings with our Head of Programming and Head Coach before you start — what the program is for, how the season is built, how we coach, and the standard your sessions are held to.',
    },
    {
        title: 'Monthly Welfare Catch-Ups',
        body: 'A one-to-one Zoom call with us every month, for every coach. It is about how you are going, not just how the sessions are going — workload, what is working, what is not, and anything you need from us.',
    },
    {
        title: 'Quarterly Development Workshops',
        body: 'Four times a year the whole coaching group comes together to work on coaching itself — new material, shared problems, and time with the coaches who set our standards.',
    },
    {
        title: 'Termly Reviews',
        body: 'Once a term someone watches you coach and then sits down with you: what they saw, what to build on, and what you are working towards next.',
    },
    {
        title: 'Coach Overseas on Tour',
        body: 'In September 2026 we take our first group of players to the Rajasthan Royals’ High Performance Centre in Nagpur, India. Coaching places on future tours are selected on performance — a real opportunity, not a promise, and we won’t pretend otherwise.',
    },
    {
        title: 'Annual Recertification',
        body: 'Every year we refresh your Working With Children Check and the Royals Coaching Hub modules your role needs, so nothing lapses without you noticing.',
    },
];

const DevelopmentSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-3xl mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Your Development
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        What We <span className="text-rr-pink">Offer.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-8 origin-left"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                    >
                        However you start — work experience, volunteering, or a casual role — there's a supported route towards part-time and full-time positions for people who deliver.
                    </motion.p>
                </div>

                {/* Pathway strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-2 md:gap-3 mb-12"
                >
                    {['Work Experience', 'Volunteer', 'Casual', 'Part-Time', 'Full-Time'].map((stage, i, arr) => (
                        <React.Fragment key={stage}>
                            <span className="bg-white border border-slate-200 text-rr-dark text-[11px] md:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                                {stage}
                            </span>
                            {i < arr.length - 1 && (
                                <svg className="w-4 h-4 text-rr-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* Development commitments */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                    {DEVELOPMENT.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="relative bg-white rounded-2xl p-7 md:p-8 border border-slate-200 hover:shadow-lg hover:border-rr-pink/30 transition-all duration-300"
                        >
                            {/* Number badge */}
                            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-rr-pink text-white flex items-center justify-center font-black text-sm shadow-lg">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-rr-dark uppercase tracking-tight mb-3 mt-2">{item.title}</h3>
                            <p className="text-rr-charcoal font-medium leading-relaxed text-sm md:text-base">{item.body}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Section CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-14 text-center"
                >
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Apply To Coach With Us
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default DevelopmentSection;
