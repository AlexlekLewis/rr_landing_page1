import React from 'react';
import { motion } from 'framer-motion';

const DEVELOPMENT = [
    {
        title: 'Structured Onboarding',
        body: 'Series of meetings with Head of Programming and Head Coach covering program vision, season structure, philosophy, and delivery standards.',
    },
    {
        title: 'Shadow & Co-Deliver',
        body: 'Minimum 2 shadow sessions plus 1 co-delivered session before you lead solo.',
    },
    {
        title: 'Termly Reviews',
        body: 'Session feedback, observation, and one-to-one development conversations every term.',
    },
    {
        title: 'Annual Recertification',
        body: 'Stay current. Working With Children Check and Royals Coaching Hub modules refreshed annually.',
    },
];

const DevelopmentSection = () => {
    return (
        <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-3xl mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Coach Development
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        We Invest <span className="text-rr-pink">In You.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue origin-left"
                    />
                </div>

                {/* 4-card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {DEVELOPMENT.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="relative bg-white rounded-2xl p-7 md:p-8 border border-slate-200 hover:shadow-lg hover:border-rr-pink/30 transition-all duration-300"
                        >
                            {/* Number badge */}
                            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-rr-pink text-white flex items-center justify-center font-black text-sm shadow-lg">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-rr-dark uppercase tracking-tight mb-3 mt-2">{item.title}</h3>
                            <p className="text-rr-charcoal font-medium leading-relaxed text-sm md:text-base">{item.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DevelopmentSection;
