import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

// HOW TO BECOME A ROYALS ACADEMY COACH: three steps, then what you need.
const STEPS = [
    { n: '01', title: 'Apply', body: 'Fill in the coaching application below. Tell us about your cricket and your coaching.' },
    { n: '02', title: 'Talk to us', body: 'If you are shortlisted, you meet our coaching leadership to talk about the right role for you.' },
    { n: '03', title: 'Start coaching', body: 'We help with your Working With Children Check and onboarding. New coaches work 10 paid hours beside a Lead Coach first.' },
];

const NEEDS = [
    { role: 'Everyone', text: 'A Working With Children Check (VIC, Employee) and the Royals Coaching Hub course for your role. We pay for the course.' },
    { role: 'Performance Squad Coach', text: 'Premier Cricket or senior representative playing background, and 2+ years as a head coach at school, club or representative level.' },
    { role: 'Junior Royals and Cadet Coach', text: 'Cricket experience helps but is not required. You can hold a group’s attention and you put the player first.' },
];

const HowToJoinSection = () => {
    const scrollToForm = () => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative py-20 md:py-28 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeader eyebrow="How to Join" title="Become a Royals" accent="Academy Coach." />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 * i }}
                            className="rounded-2xl bg-white border border-slate-200 p-6 md:p-7"
                        >
                            <span className="inline-flex w-11 h-11 rounded-full border-2 border-rr-pink items-center justify-center text-rr-pink font-black mb-4">{s.n}</span>
                            <h3 className="text-xl font-black text-rr-dark uppercase tracking-tight mb-2">{s.title}</h3>
                            <p className="text-rr-charcoal font-medium leading-relaxed text-sm md:text-base">{s.body}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8">
                    <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-5">What you need</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                        {NEEDS.map((n) => (
                            <div key={n.role} className="border-l-2 border-rr-pink pl-4">
                                <dt className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.2em] mb-1.5">{n.role}</dt>
                                <dd className="text-rr-charcoal font-medium leading-relaxed text-sm">{n.text}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="text-xs text-rr-charcoal/70 font-medium mt-6">
                        Don’t tick every box but believe in how we coach? Apply anyway. We read every application.
                    </p>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-colors inline-flex items-center gap-3"
                    >
                        Apply to Coach
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowToJoinSection;
