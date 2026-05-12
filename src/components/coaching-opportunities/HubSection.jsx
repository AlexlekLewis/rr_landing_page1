import React from 'react';
import { motion } from 'framer-motion';

const HUB_FEATURES = [
    'Pro Coaching Foundation — Basic and Advanced',
    'Modules across batting, fast bowling, spin bowling, fielding, and wicketkeeping',
    'Taught by IPL-experienced coaches: Sid Lahiri, Shane Burger, Michael Italiano, Dishant Yagnik, Richard Das Neves',
    'Step-by-step learning with practical drills and coaching insights',
];

const HubSection = () => {
    return (
        <section className="relative py-24 md:py-32 bg-rr-dark overflow-hidden">
            {/* Ambient effects */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rr-pink/8 rounded-full blur-[150px] pointer-events-none" />

            {/* Top divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink/40 to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                        >
                            Coach Education
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6"
                        >
                            Your Development,<br />
                            <span className="text-rr-pink">Built by the Royals.</span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-6 origin-left"
                        />
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-base md:text-lg text-white/75 font-medium leading-relaxed mb-8"
                        >
                            Every RRA Melbourne coach receives complimentary access to the Royals Coaching Hub — the global Royals education platform. The expectation is simple: every coach completes every module. It's how we keep our delivery aligned, sharp, and at the standard our players deserve.
                        </motion.p>

                        <motion.a
                            href="https://www.royalscoachinghub.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="group inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                        >
                            Explore the Hub
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </motion.a>
                    </div>

                    {/* Right: Feature card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative"
                    >
                        {/* Outer gradient border */}
                        <div className="p-[2px] bg-gradient-to-br from-rr-pink via-rr-pink/40 to-rr-blue rounded-2xl">
                            <div className="bg-rr-dark rounded-[14px] p-7 md:p-9">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Inside the Hub</p>
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">What You'll Access</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {HUB_FEATURES.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + 0.08 * i }}
                                            className="flex items-start gap-4"
                                        >
                                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-white/85 font-medium text-sm md:text-base leading-relaxed">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Decorative glow */}
                        <div className="absolute -inset-4 bg-rr-pink/10 blur-3xl -z-10 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HubSection;
