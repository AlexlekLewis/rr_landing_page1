import React from 'react';
import { motion } from 'framer-motion';

const seminars = [
    {
        icon: '👑',
        title: 'Leadership Development',
        desc: 'Building influence, confidence, and decision-making skills on and off the field.',
    },
    {
        icon: '♟️',
        title: 'Cricket Strategy',
        desc: 'Understanding game tactics, situational awareness, and reading the match in real time.',
    },
    {
        icon: '🧘',
        title: 'Mental Game & Mindset',
        desc: 'Techniques to cultivate resilience, composure, and sharp focus under pressure.',
    },
    {
        icon: '🥗',
        title: 'Fitness & Nutrition',
        desc: 'The role of exercise and healthy eating for cricket performance, with insights from a registered dietitian.',
    },
    {
        icon: '📚',
        title: 'Coachability & Self-Improvement',
        desc: 'Maximising learning and output in every session — becoming the player coaches love to coach.',
    },
    {
        icon: '👨‍👩‍👧',
        title: 'Parent Seminar',
        desc: 'Supporting your daughter\'s development at training and during matches — how parents can make the biggest difference.',
    },
];

const OnlineSeminars = () => {
    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Included — Online Seminars</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6"
                    >
                        BEYOND THE <span className="text-rr-pink">TRAINING GROUND</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-white/70 max-w-2xl mx-auto font-medium"
                    >
                        Six exclusive online seminars complement the on-field program — developing the complete athlete, not just the cricketer.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seminars.map((seminar, i) => (
                        <motion.div
                            key={seminar.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative bg-white/5 border border-white/10 hover:border-rr-pink/40 rounded-2xl p-8 transition-all duration-300 group"
                        >
                            {/* Pink accent line */}
                            <div className="w-8 h-1 rounded-full bg-rr-pink mb-5" />

                            <div className="text-3xl mb-4">{seminar.icon}</div>
                            <h3 className="text-base font-black text-white group-hover:text-rr-pink uppercase tracking-wide mb-3 transition-colors duration-300">
                                {seminar.title}
                            </h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">
                                {seminar.desc}
                            </p>

                            {/* Online badge */}
                            <div className="mt-5 inline-flex items-center gap-1.5 bg-rr-blue/20 border border-rr-blue/30 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-medium-blue" />
                                <span className="text-xs font-bold text-rr-medium-blue uppercase tracking-wide">Online</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Aspirational image strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 relative rounded-2xl overflow-hidden h-56 md:h-72"
                >
                    <img
                        src="/assets/fe-celebrate-2.jpeg"
                        alt="Female cricketers celebrating a wicket"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/80 via-rr-dark/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center px-8 md:px-12">
                        <div className="max-w-md">
                            <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-2">The Royals Way</p>
                            <p className="text-white font-black text-xl md:text-2xl uppercase tracking-wide leading-tight">
                                Champions develop off the field<br />
                                <span className="text-rr-pink">before they win on it.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OnlineSeminars;
