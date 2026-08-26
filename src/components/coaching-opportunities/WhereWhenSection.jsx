import React from 'react';
import { motion } from 'framer-motion';

// The two questions every applicant asks before they read anything else:
// where would I be working, and when. Answered up front, before the role cards,
// so nobody reads the whole page only to find the commute doesn't work.
const FACTS = [
    {
        label: 'Who can apply',
        heading: 'Anywhere in Melbourne',
        body: 'You do not need to live near a centre to apply. We take applications from right across Melbourne and place people at the centre that works for them.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Where you would work',
        heading: 'Mickleham and Hallam / Cranbourne',
        body: 'These are our two active centres — one in Melbourne’s north, one in the south-east. Sessions run at the centre you are placed at, not across all of them.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        label: 'When you would work',
        heading: 'October to March · Mon, Wed, Fri',
        body: 'That is the Australian cricket season. Coaching sessions run on Mondays, Wednesdays and Fridays. Coaches appointed to a Performance Squad — our representative teams — also coach their matches on weekends.',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
];

const WhereWhenSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative bg-white border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {FACTS.map((fact, i) => (
                        <motion.div
                            key={fact.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-white shrink-0">
                                {fact.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em] mb-1.5">{fact.label}</p>
                                <h3 className="text-base md:text-lg font-black text-rr-dark uppercase tracking-tight leading-tight mb-2">
                                    {fact.heading}
                                </h3>
                                <p className="text-rr-charcoal font-medium leading-relaxed text-sm">{fact.body}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                    className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <p className="text-sm text-rr-charcoal font-medium text-center sm:text-left">
                        Those days and centres work for you? Then the next step is the application form.
                    </p>
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest text-xs px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.35)] inline-flex items-center gap-2.5 shrink-0"
                    >
                        Apply Now
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default WhereWhenSection;
