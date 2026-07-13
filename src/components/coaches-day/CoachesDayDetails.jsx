import React from 'react';
import { motion } from 'framer-motion';

const DETAILS = [
    { label: 'When', value: 'Sunday 26 July 2026', sub: '1:00 PM to 4:00 PM' },
    { label: 'Where', value: 'The Mickleham Centre', sub: '3 Eclipse Dr, Mickleham VIC 3064' },
    { label: 'Cost', value: 'Free', sub: 'Junior & senior coaches welcome' },
];

const CoachesDayDetails = () => {
    return (
        <section id="details" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        The Details
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none"
                    >
                        One Afternoon, Open Door
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {DETAILS.map((d, i) => (
                        <motion.div
                            key={d.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 * i }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 text-center"
                        >
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.2em] mb-3">{d.label}</p>
                            <p className="text-rr-dark font-black leading-snug">{d.value}</p>
                            <p className="text-rr-charcoal/70 text-sm font-medium mt-1">{d.sub}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    className="text-center text-rr-charcoal text-base md:text-lg font-medium mt-10 max-w-2xl mx-auto"
                >
                    Come for the whole afternoon, or drop in when you can.
                </motion.p>
            </div>
        </section>
    );
};

export default CoachesDayDetails;
