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
        price: '$265',
        bundoora: [
            { day: 'Mondays', time: '6:00pm – 7:00pm', start: '20 Apr' },
            { day: 'Fridays', time: '6:00pm – 7:00pm', start: '24 Apr' },
        ],
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
        price: '$290',
        bundoora: [
            { day: 'Mondays', time: '7:00pm – 8:00pm', start: '20 Apr' },
            { day: 'Fridays', time: '7:00pm – 8:00pm', start: '24 Apr' },
        ],
    },
    {
        name: 'Juniors',
        ages: '13–15 years',
        color: 'from-rr-pink to-rr-blue',
        points: [
            'High-intensity, skill-focused sessions',
            'Use of bowling machine',
            'Ideal secondary training for competitive players',
        ],
        price: '$310',
        bundoora: [
            { day: 'Mondays', time: '6:00pm – 7:00pm', start: '20 Apr' },
            { day: 'Mondays', time: '7:00pm – 8:00pm', start: '20 Apr' },
            { day: 'Wednesdays', time: '6:00pm – 7:00pm', start: '22 Apr' },
            { day: 'Wednesdays', time: '7:00pm – 8:00pm', start: '22 Apr' },
        ],
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
                        The Junior Royals is a small group, term-based coaching program designed for participants to learn foundation cricket skills and build on those skills to prepare them to play cricket in a team.
                        Programs run in Terms 1, 2 &amp; 4, with a limited program in Term 3.
                    </motion.p>
                </div>

                {/* Credential bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {[
                        { icon: '✅', label: 'CA Accredited Coaches' },
                        { icon: '🛡️', label: 'Working With Children Check' },
                        { icon: '🏏', label: 'Small Group Coaching' },
                        { icon: '📍', label: '2 Melbourne Locations' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-3">
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">{item.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Location cards */}
                <div className="mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6 text-center"
                    >
                        Locations
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {[
                            { name: 'Bundoora', venue: 'Cutting Edge Cricket', badge: 'Enrolling Now', badgeColor: 'bg-rr-pink', tbc: false },
                            { name: 'Hallam', venue: 'Cricket Connect', badge: 'Coming Soon', badgeColor: 'bg-slate-400', tbc: true },
                        ].map((loc, i) => (
                            <motion.div
                                key={loc.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-2xl border p-6 flex items-center gap-5 ${loc.tbc ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 shadow-sm'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl ${loc.tbc ? 'bg-slate-100' : 'bg-rr-pink/10'}`}>
                                    📍
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-black text-rr-dark uppercase tracking-tight">{loc.name}</p>
                                        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${loc.badgeColor}`}>{loc.badge}</span>
                                    </div>
                                    <p className="text-sm font-medium text-rr-charcoal">{loc.venue}</p>
                                    {loc.tbc && <p className="text-xs text-slate-400 font-medium mt-0.5">Schedule TBC — details coming soon</p>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Group cards */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6 text-center"
                >
                    Groups
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
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Group</p>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{group.name}</h3>
                                        <p className="text-white/60 font-medium text-sm mt-0.5">{group.ages}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">From</p>
                                        <p className="text-xl font-black text-rr-pink">{group.price}</p>
                                        <p className="text-white/40 text-xs font-medium">per child</p>
                                    </div>
                                </div>

                                <ul className="space-y-2 mb-6">
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

                                <div className="border-t border-white/10 pt-5">
                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">Bundoora Sessions</p>
                                    <div className="space-y-1.5 mb-4">
                                        {group.bundoora.map((s, k) => (
                                            <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                                <p className="text-white/80 text-xs font-semibold">{s.day} · {s.time}</p>
                                                <p className="text-white/40 text-xs">From {s.start}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hallam Sessions</p>
                                    <div className="bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-center">
                                        <p className="text-slate-500 text-xs font-semibold">TBC — Details Coming Soon</p>
                                    </div>
                                </div>
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
                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Warriors Group</span>
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
