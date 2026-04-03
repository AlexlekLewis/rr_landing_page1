import React from 'react';
import { motion } from 'framer-motion';

const groups = [
    {
        name: 'Ages 7–9',
        color: 'from-rr-pink to-rr-blue',
        points: [
            'Build on foundation cricket skills',
            'Incorporate game sense activities',
            'Prepare players to start playing junior cricket',
        ],
    },
    {
        name: 'Ages 10–12',
        color: 'from-rr-blue to-rr-pink',
        points: [
            'Skill-focused sessions',
            'Use of bowling machine',
            'Secondary training for those already playing cricket',
        ],
    },
    {
        name: 'Ages 13–15',
        color: 'from-rr-pink to-rr-blue',
        points: [
            'High-intensity, skill-focused sessions',
            'Use of bowling machine',
            'Ideal secondary training for competitive players',
        ],
    },
];

const LCOverview = () => {
    return (
        <section id="program-overview" className="py-24 bg-white">
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
                        The Junior Royals is a small group, term-based coaching program for players aged 7–15. Participants build foundation through to more advanced cricket skills and prepare to play cricket in a team and higher levels — delivered by ICC, Royals and CA accredited coaches. Program content also supports participant preparation for the Rajasthan Royals Academy T20 Elite programs.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-rr-charcoal font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        Junior Royals programs run in all school terms.
                    </motion.p>
                </div>

                {/* Group cards */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6 text-center"
                >
                    Age Groups
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {groups.map((group, i) => (
                        <motion.div
                            key={group.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-rr-dark rounded-2xl overflow-hidden"
                        >
                            <div className={`h-2 bg-gradient-to-r ${group.color}`} />
                            <div className="p-6">
                                <div className="mb-5">
                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Group</p>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{group.name}</h3>
                                </div>

                                <ul className="space-y-2">
                                    {group.points.map((point, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <span className="mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-white/80 font-medium text-sm">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Photo strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-2xl aspect-video"
                    >
                        <img src="/assets/little-crickets-hero.jpeg" alt="Junior Royals coach with young players" className="w-full h-full object-cover object-center" />
                        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Ages 7–9 Group</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl aspect-video"
                    >
                        <img src="/assets/little-crickets-drills.jpeg" alt="Junior Royals agility drills session" className="w-full h-full object-cover object-center" />
                        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Skills &amp; Drills</span>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default LCOverview;
