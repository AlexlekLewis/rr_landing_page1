import React from 'react';
import { motion } from 'framer-motion';

const VideoSection = () => {
    return (
        <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
            <div className="relative max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Leadership
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        Hear From Our <span className="text-rr-pink">Leadership.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-8 origin-center"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed max-w-3xl mx-auto"
                    >
                        A conversation between our Head Coach Alex Lewis and Director of Cricket Andy Crook on what being part of RRA Melbourne really involves — the philosophy, the standards, and the opportunity.
                    </motion.p>
                </div>

                {/* Video placeholder — TODO: Replace with actual video embed */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative aspect-video w-full rounded-2xl overflow-hidden bg-rr-dark border border-slate-200 shadow-2xl group cursor-pointer"
                >
                    {/* Background image as placeholder */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
                        style={{ backgroundImage: "url('/assets/coaches/alex-lewis.jpg')" }}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rr-dark/80 via-rr-dark/60 to-rr-blue/40" />

                    {/* Play button + label */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-rr-pink/90 group-hover:bg-rr-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xl shadow-rr-pink/40">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Video Coming Soon</p>
                        <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white mt-1">Interview · Alex Lewis × Andy Crook</p>
                    </div>

                    {/* Subtle border accent */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;
