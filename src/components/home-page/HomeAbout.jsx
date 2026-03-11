import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: '500+', label: 'Players Trained' },
    { value: '2', label: 'Active Programs' },
    { value: '3+', label: 'Expert Coaches' },
    { value: '2024', label: 'Est. Melbourne' },
];

const HomeAbout = () => {
    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Who We Are</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6 leading-tight">
                            THE ROYALS WAY<br />
                            <span className="text-rr-pink">COMES TO MELBOURNE</span>
                        </h2>

                        <p className="text-lg text-rr-charcoal font-medium mb-6 leading-relaxed">
                            Rajasthan Royals Academy Melbourne is the official cricket development arm of the Rajasthan Royals IPL franchise — bringing the same world-class coaching methodology, technology, and performance philosophy that has shaped some of cricket's most explosive T20 talents.
                        </p>

                        <p className="text-base text-rr-charcoal/80 font-medium mb-8 leading-relaxed">
                            We believe every cricketer — regardless of age or current skill level — deserves access to an elite performance environment. Our programs are built around data, biomechanics, and the modern game, guided by coaches who live and breathe the Royals Way.
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-rr-charcoal uppercase tracking-widest">Finding a way to win from anywhere</span>
                            <span className="text-rr-pink font-black italic text-sm">WIN</span>
                        </div>
                    </motion.div>

                    {/* Image + Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Facility image */}
                        <div className="relative rounded-2xl overflow-hidden aspect-video">
                            <img
                                src="/assets/cec-lanes.jpg"
                                alt="Cutting Edge Cricket facility — RRA training base"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Cutting Edge Cricket, Bundoora</span>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-4 gap-3">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100"
                                >
                                    <div className="text-2xl font-black text-rr-pink">{stat.value}</div>
                                    <div className="text-xs font-bold text-rr-charcoal uppercase tracking-wide mt-1 leading-tight">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeAbout;
