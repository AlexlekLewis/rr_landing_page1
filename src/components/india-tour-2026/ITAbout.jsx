import React from 'react';
import { motion } from 'framer-motion';
import coachingImg from '../../assets/india-tour-2026/coaching-mentoring.jpg';

const ITAbout = ({ copy }) => {
  const c = copy.about;
  const POINTS = c.points;
  return (
    <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Copy */}
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        {c.eyebrow}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5"
                    >
                        {c.heading} <span className="text-rr-pink">{c.headingAccent}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed mb-8"
                    >
                        {c.lead}
                    </motion.p>

                    <div className="space-y-5">
                        {POINTS.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 + i * 0.08 }}
                                className="flex items-start gap-4"
                            >
                                <span className="mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-base font-black text-rr-dark uppercase tracking-wide">{p.title}</h3>
                                    <p className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed mt-1">{p.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img src={coachingImg} alt="A Rajasthan Royals coach mentoring a player" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/40 to-transparent" />
                    </div>
                    <div className="absolute -bottom-5 -left-5 hidden md:block bg-rr-pink text-white rounded-2xl px-6 py-4 shadow-xl">
                        <p className="text-3xl font-black leading-none">SEP</p>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1">2026</p>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default ITAbout;
