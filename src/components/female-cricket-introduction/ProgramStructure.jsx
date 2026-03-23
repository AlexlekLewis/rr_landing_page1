import React, { useState } from 'react';
import { motion } from 'framer-motion';

const weeks = [
    {
        range: 'Weeks 1–2',
        title: 'Introduction to Cricket',
        color: 'from-rr-navy to-rr-blue',
        items: [
            'Equipment overview — what we use and why',
            'Rules and gameplay basics',
            'Safety principles and enjoyment focus',
        ],
    },
    {
        range: 'Weeks 3–4',
        title: 'Batting',
        color: 'from-rr-blue to-rr-medium-blue',
        items: [
            'Grip and stance fundamentals',
            'Movement and basic technique',
            'Skill drills and mini games',
        ],
    },
    {
        range: 'Weeks 5–6',
        title: 'Bowling',
        color: 'from-rr-medium-blue to-rr-pink',
        items: [
            'Bowling action basics',
            'Run-up introduction',
            'Accuracy and release focus',
        ],
    },
    {
        range: 'Week 7',
        title: 'Fielding & Throwing',
        color: 'from-rr-pink to-rr-light-pink',
        items: [
            'Fielding fundamentals',
            'Throwing technique',
            'Movement drills and games',
        ],
    },
    {
        range: 'Week 8',
        title: 'Recap & Mini Game',
        color: 'from-rr-navy via-rr-blue to-rr-pink',
        items: [
            'Full skill recap across all sessions',
            'Game simulation',
            'Participation, teamwork, and celebration',
        ],
    },
];

const ProgramStructure = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-slate-50 border-t-8" style={{ borderImage: 'linear-gradient(90deg, #1226AA, #E11F8F) 1' }}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        YOUR <span className="text-rr-pink">8-WEEK JOURNEY</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        A structured, progressive curriculum that builds skill and confidence from the ground up — week by week, session by session.
                    </motion.p>
                </div>

                {/* Desktop: horizontal timeline */}
                <div className="hidden md:grid grid-cols-5 gap-4 mb-16">
                    {weeks.map((week, i) => (
                        <motion.div
                            key={week.range}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className={`h-2 bg-gradient-to-r ${week.color}`} />
                            <div className="p-6">
                                <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-2">{week.range}</p>
                                <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mb-4 leading-tight">{week.title}</h3>
                                <ul className="space-y-2">
                                    {week.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink mt-1.5 shrink-0" />
                                            <span className="text-rr-charcoal text-xs font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile: accordion */}
                <div className="md:hidden space-y-3 mb-16">
                    {weeks.map((week, i) => (
                        <motion.div
                            key={week.range}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <div>
                                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-1">{week.range}</p>
                                    <h3 className="text-base font-black text-rr-dark uppercase tracking-wide">{week.title}</h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${week.color} flex items-center justify-center shrink-0`}>
                                    <svg
                                        className={`w-4 h-4 text-white transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            {openIndex === i && (
                                <div className="px-5 pb-5">
                                    <div className={`h-0.5 bg-gradient-to-r ${week.color} mb-4 rounded-full`} />
                                    <ul className="space-y-2">
                                        {week.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink mt-1.5 shrink-0" />
                                                <span className="text-rr-charcoal text-sm font-medium leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Outcome box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-rr-dark rounded-2xl p-8 md:p-10 text-center"
                >
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-4">Program Outcome</p>
                    <p className="text-white/90 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
                        Participants will develop a <span className="text-white font-bold">foundational understanding of cricket</span>, improved coordination and confidence, and a clear pathway for continued participation through the RRA Girls Kickstart pathway.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ProgramStructure;
