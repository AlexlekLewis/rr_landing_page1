import React from 'react';
import { motion } from 'framer-motion';

const groups = [
    {
        name: 'Minis',
        ages: '5–6 years',
        color: 'from-rr-pink to-rr-blue',
        points: ['Introduction to cricket fundamentals', 'Fun, game-based learning environment', 'Build coordination and movement skills'],
    },
    {
        name: 'Warriors',
        ages: '7–9 years',
        color: 'from-rr-blue to-rr-pink',
        points: ['Build on foundation cricket skills', 'Incorporate game sense activities', 'Prepare players to start playing junior cricket'],
    },
    {
        name: 'Challengers',
        ages: '10–12 years',
        color: 'from-rr-pink to-rr-blue',
        points: ['Skill-focused sessions', 'Use of bowling machine', 'Secondary training for those already playing cricket'],
    },
    {
        name: 'Juniors',
        ages: '13–15 years',
        color: 'from-rr-blue to-rr-pink',
        points: ['High-intensity, skill-focused sessions', 'Use of bowling machine', 'Ideal secondary training for competitive players'],
    },
    {
        name: 'Seniors',
        ages: '16–17 years',
        color: 'from-rr-pink to-rr-blue',
        points: ['Advanced technical development', 'Bowling machine & video analysis', 'Preparation for senior/representative cricket'],
    },
];

const JRT3Overview = () => (
    <section id="program-overview" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Term 3 · 2026</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-6">About the Program</motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="text-lg text-rr-charcoal font-medium max-w-3xl mx-auto leading-relaxed">
                    The Junior Royals is a small group, term-based coaching program for players aged 5–17. Participants build foundation through to more advanced cricket skills and prepare to play cricket in a team and higher levels — delivered by ICC, Royals and CA accredited coaches. Delivered across all terms, Junior Royals program content also supports participant preparation for the Rajasthan Royals Academy T20 Elite programs.
                </motion.p>
            </div>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6 text-center">Age Groups</motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, i) => (
                    <motion.div key={group.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        className="bg-rr-dark rounded-2xl overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${group.color}`} />
                        <div className="p-6">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Group</p>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-0.5">{group.name}</h3>
                            <p className="text-white/60 font-medium text-sm mb-5">{group.ages}</p>
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
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-2xl aspect-video">
                    <img src="/assets/little-crickets-hero.jpeg" alt="Junior Royals coach with young players" className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" />
                    <div className="absolute bottom-4 left-4"><span className="text-xs font-bold text-white/80 uppercase tracking-widest">The Royals Way</span></div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-2xl aspect-video">
                    <img src="/assets/little-crickets-drills.jpeg" alt="Junior Royals drills session" className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" />
                    <div className="absolute bottom-4 left-4"><span className="text-xs font-bold text-white/80 uppercase tracking-widest">Skills &amp; Drills</span></div>
                </motion.div>
            </div>
        </div>
    </section>
);

export default JRT3Overview;
