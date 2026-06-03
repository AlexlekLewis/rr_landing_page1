import React from 'react';
import { motion } from 'framer-motion';

// Brief coaching + venue section for the India Tour.
// Lahiri's bio + the Nagpur HPC detail are from the Rajasthan Royals / RRA copy.
// Ronnie Binder's line is intentionally brief pending his confirmed bio.
const COACHES = [
    {
        name: 'Siddhartha Lahiri',
        role: 'Head of International Player Development',
        bio: "Leads talent identification and player development across the Royals' global network of franchises and academies, and oversees the Rajasthan Royals Academy Melbourne.",
    },
    {
        name: 'Ronnie Binder',
        role: 'Rajasthan Royals Academy Coach',
        bio: 'Part of the touring coaching staff, guiding players through their development on the India experience.',
    },
];

const ITCoaching = () => (
    <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                >
                    Coaching & High Performance
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none"
                >
                    Master Coaches & The <span className="text-rr-pink">Nagpur HPC</span>
                </motion.h2>
                <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto my-5" />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                >
                    On tour, players train the Royals way under Academy coaches and gain access to the
                    Rajasthan Royals High-Performance Centre in Nagpur, India — turf wickets, indoor nets,
                    a gym, pool and residential facilities, in the home of the Royals.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {COACHES.map((c, i) => (
                    <motion.div
                        key={c.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8"
                    >
                        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">{c.name}</h3>
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mt-1 mb-3">{c.role}</p>
                        <p className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed">{c.bio}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default ITCoaching;
