import React from 'react';
import { motion } from 'framer-motion';

const pathways = [
    {
        title: 'Nagpur High Performance Camp',
        desc: 'Opportunities to attend the Rajasthan Royals High Performance Camp in Nagpur, India — training inside the Royals system at the highest level.',
    },
    {
        title: 'Royals T20 Franchise Training Partner',
        desc: 'Selection opportunities as a training partner for one of three Royals T20 franchises around the world.',
    },
    {
        title: 'Power League',
        desc: 'Opportunities to play in the Power League — competitive T20 cricket inside the Royals environment.',
    },
];

const RoyalsPathway = () => (
    <section className="py-24 bg-rr-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-rr-pink text-xs font-black uppercase tracking-[0.3em] mb-5"
                >
                    Be Part of the Royals System
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                >
                    Your Pathway to <span className="text-rr-pink">Opportunity</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-white/60 font-medium text-lg max-w-2xl mx-auto leading-relaxed"
                >
                    The Junior Royals Holiday Program puts your player inside the Royals system — with genuine pathways beyond the program itself.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pathways.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mb-5">
                            <span className="text-white font-black text-sm">{i + 1}</span>
                        </div>
                        <h3 className="text-white font-black text-lg uppercase tracking-wide leading-tight mb-3">{p.title}</h3>
                        <p className="text-white/55 text-sm font-medium leading-relaxed">{p.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default RoyalsPathway;
