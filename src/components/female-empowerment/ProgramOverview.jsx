import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: '🏏',
        title: 'Advanced Skill Development',
        desc: 'Targeted batting, bowling, and fielding sessions for players already active in the game — designed to sharpen technique and expand tactical range.',
    },
    {
        icon: '🧠',
        title: 'Mental Game & Mindset',
        desc: 'Resilience, focus under pressure, and a growth mindset that transforms how players think, react, and perform in competition.',
    },
    {
        icon: '👑',
        title: 'Leadership Development',
        desc: 'Building on-field and off-field influence — communication, decision-making, teamwork, and the confidence to lead from the front.',
    },
    {
        icon: '📈',
        title: 'Game Sense & Tactics',
        desc: 'Scenario-based drills, strategic field placement, and reflective discussions that develop the ability to read and shape the game.',
    },
    {
        icon: '💪',
        title: 'Health, Fitness & Wellbeing',
        desc: 'Cricket-specific conditioning, nutrition guidance from a dietitian, and strategies for managing pressure and recovery.',
    },
    {
        icon: '🎓',
        title: 'Online Seminars Included',
        desc: 'Exclusive digital sessions on leadership, cricket strategy, mental performance, fitness, nutrition, coachability, and a dedicated parent seminar.',
    },
];

const ProgramOverview = () => {
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
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Female Empowerment & Skill Development</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        WHAT IS THIS <span className="text-rr-pink">PROGRAM?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        A 12-week performance program for junior girls and women already playing cricket. The program builds advanced skills, deepens game understanding, strengthens mental resilience, and develops leadership — transforming players from passive learners into proactive, self-motivated athletes with a genuine growth mindset.
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
                        Register Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default ProgramOverview;
