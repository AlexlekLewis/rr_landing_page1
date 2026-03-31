import React from 'react';
import { motion } from 'framer-motion';

const groups = [
    {
        name: 'Warriors',
        ages: '7–9 years',
        color: 'from-rr-pink to-rr-blue',
        points: [
            'Build on foundation cricket skills',
            'Incorporate game sense activities',
            'Prepare players to start playing junior cricket',
        ],
        schedule: [
            { day: 'Mondays', time: '6:00pm – 7:00pm', start: '20 Apr' },
            { day: 'Fridays', time: '6:00pm – 7:00pm', start: '24 Apr' },
        ],
        price: '$265',
    },
    {
        name: 'Challengers',
        ages: '10–12 years',
        color: 'from-rr-blue to-rr-pink',
        points: [
            'Skill-focused sessions',
            'Use of bowling machine',
            'Secondary training for those already playing cricket',
        ],
        schedule: [
            { day: 'Mondays', time: '7:00pm – 8:00pm', start: '20 Apr' },
            { day: 'Fridays', time: '7:00pm – 8:00pm', start: '24 Apr' },
        ],
        price: '$290',
    },
];

const LCOverview = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        Term 2 · 2026
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-6"
                    >
                        About the Program
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-rr-charcoal font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        The Little Crickets Club is a small group, term-based coaching program designed for participants to learn foundation cricket skills and build on those skills to prepare them to play cricket in a team.
                        Programs run in Terms 1, 2 &amp; 4, with a limited program in Term 3.
                    </motion.p>
                </div>

                {/* Credential bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-6 mb-16"
                >
                    {[
                        { icon: '✅', label: 'CA Accredited Coaches' },
                        { icon: '🛡️', label: 'Working With Children Check' },
                        { icon: '🏏', label: 'Small Group Coaching' },
                        { icon: '📍', label: 'Bundoora — Cutting Edge Cricket' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-3">
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">{item.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Group cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {groups.map((group, i) => (
                        <motion.div
                            key={group.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-rr-dark rounded-2xl overflow-hidden"
                        >
                            {/* Card header gradient */}
                            <div className={`h-2 bg-gradient-to-r ${group.color}`} />
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Group</p>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">{group.name}</h3>
                                        <p className="text-white/60 font-medium mt-1">{group.ages}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">From</p>
                                        <p className="text-2xl font-black text-rr-pink">{group.price}</p>
                                        <p className="text-white/40 text-xs font-medium">per child</p>
                                    </div>
                                </div>

                                {/* Points */}
                                <ul className="space-y-3 mb-8">
                                    {group.points.map((point, j) => (
                                        <li key={j} className="flex items-center gap-4">
                                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-white/80 font-medium text-sm">{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Schedule */}
                                <div className="border-t border-white/10 pt-6">
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Session Options</p>
                                    <div className="space-y-2">
                                        {group.schedule.map((s, k) => (
                                            <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                                <div>
                                                    <p className="text-white font-bold text-sm">{s.day}</p>
                                                    <p className="text-white/50 text-xs font-medium">{s.time}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-wide">Starts</p>
                                                    <p className="text-white/80 text-xs font-medium">{s.start}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LCOverview;
