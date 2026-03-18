import React, { useState } from 'react';
import { motion } from 'framer-motion';

const pillars = [
    {
        label: 'Batting',
        color: 'from-rr-navy to-rr-blue',
        icon: '🏏',
        items: [
            'Observe fielders: pickup and throw technique while waiting to bat',
            'Set innings goals — long steady innings vs. aggressive quick scoring',
            'Strategies for getting off strike when struggling',
            'Influence the bowler: make them deliver to you',
            'Playing aggressively while maintaining control',
            'Hitting into gaps effectively',
            'Understanding and executing strike rotation',
        ],
    },
    {
        label: 'Bowling',
        color: 'from-rr-blue to-rr-medium-blue',
        icon: '⚡',
        items: [
            'Analyse each batter — strengths, weaknesses, and shot preferences',
            'Plan dismissals: how to bowl effectively against different batters',
            'When and why to use slower balls',
            'Field placement: position your field and bowl to it',
            'Post-delivery positioning: where to be after bowling',
            'Targeting areas to induce specific shots',
        ],
    },
    {
        label: 'Fielding',
        color: 'from-rr-medium-blue to-rr-pink',
        icon: '🎯',
        items: [
            'Correct technique for fielding and throwing',
            'Knowledge of all fielding positions',
            'Walking in with the bowler: purpose and timing',
            'Positioning when backing up other fielders or stumps',
            'Handling relay throws',
            'Decision-making: when to throw full vs. bounce',
            'Reading the batter while fielding',
            'Supporting the team: backing up every ball, calls from keeper and bowler',
        ],
    },
    {
        label: 'Mental Strength',
        color: 'from-rr-pink to-rr-light-pink',
        icon: '🧠',
        items: [
            'Walking out to bat with confidence and composure',
            'Establishing routines at the crease',
            'Managing overthinking and staying present',
            'Owning the pitch: focus between deliveries',
            'Visualising the field and identifying gaps',
            'Recovering when struggling — singles and regaining rhythm',
            'Bowling: maintaining composure after wides or no-balls',
            'Projecting confidence through body language',
        ],
    },
    {
        label: 'Leadership',
        color: 'from-rr-navy via-rr-blue to-rr-pink',
        icon: '👑',
        items: [
            'Understanding the meaning of leadership in cricket',
            'Courage and confidence to lead on-field and off-field',
            'Building tactical knowledge and game awareness',
            'Enhancing teamwork and fair play',
            'Listening effectively and responding constructively to feedback',
            'Communicating assertively and encouraging teammates',
            'Handling difficult conversations while maintaining values',
        ],
    },
    {
        label: 'Health & Fitness',
        color: 'from-rr-blue to-rr-navy',
        icon: '💪',
        items: [
            'Focus on nutrition, rest, and mental preparation',
            'Cricket-specific fitness routines to enhance performance',
            'Building consistency in training and conditioning',
            'Strategies for managing pressure and recovery',
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
                        YOUR <span className="text-rr-pink">12-WEEK CURRICULUM</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Six performance pillars. Twelve weeks of structured, progressive development built for players who are already in the game and ready to elevate it.
                    </motion.p>

                    {/* Action photo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="mt-10 relative rounded-2xl overflow-hidden h-48 md:h-56 max-w-3xl mx-auto"
                    >
                        <img
                            src="/assets/fe-batting-sweep.jpeg"
                            alt="Female cricketer playing a sweep shot"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/50 to-transparent" />
                    </motion.div>
                </div>

                {/* Desktop: grid of cards */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className={`h-2 bg-gradient-to-r ${pillar.color}`} />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{pillar.icon}</span>
                                    <p className="text-sm font-black text-rr-dark uppercase tracking-wide">{pillar.label}</p>
                                </div>
                                <ul className="space-y-2">
                                    {pillar.items.map((item, j) => (
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
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.label}
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
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{pillar.icon}</span>
                                    <h3 className="text-base font-black text-rr-dark uppercase tracking-wide">{pillar.label}</h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center shrink-0`}>
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
                                    <div className={`h-0.5 bg-gradient-to-r ${pillar.color} mb-4 rounded-full`} />
                                    <ul className="space-y-2">
                                        {pillar.items.map((item, j) => (
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
                        Participants will leave with <span className="text-white font-bold">elevated technical skills, a sharper tactical mind, genuine leadership capability</span>, and the mental resilience to perform when it matters most.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ProgramStructure;
