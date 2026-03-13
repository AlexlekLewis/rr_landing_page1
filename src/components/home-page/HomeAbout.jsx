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
                            <span className="text-rr-pink">NOW IN MELBOURNE</span>
                        </h2>

                        <p className="text-lg text-rr-charcoal font-medium mb-6 leading-relaxed">
                            Rajasthan Royals Academy Melbourne is the official cricket development arm of the Rajasthan Royals IPL franchise — bringing the same world-class coaching methodology and philosophy on the game that has shaped some of cricket's best players and most explosive T20 talents.
                        </p>

                        <p className="text-base text-rr-charcoal/80 font-medium mb-8 leading-relaxed">
                            We believe every cricketer — regardless of age or current skill level — deserves access to an environment such as the one the Royals Academy provides. Our programs are built from the basics of cricket and expand into techniques of the modern game, guided by Royals qualified coaches who live and breathe the Royals Way.
                        </p>


                    </motion.div>

                    {/* Image + Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Action image — Vaibhav Suryavanshi */}
                        <div className="relative rounded-2xl overflow-hidden aspect-video">
                            <img
                                src="/assets/vaibhav-debut-six.jpg"
                                alt="Vaibhav Suryavanshi — Rajasthan Royals"
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">The Royals Way — Built to Win</span>
                            </div>
                        </div>

                        {/* 2008 IPL win panel */}
                        <div className="relative rounded-2xl overflow-hidden h-28">
                            <img
                                src="/assets/royals-2008-win.webp"
                                alt="Rajasthan Royals — 2008 IPL Champions"
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/80 via-rr-dark/50 to-transparent" />
                            <div className="absolute inset-0 flex items-center px-5 gap-4">
                                <div>
                                    <p className="text-white font-black uppercase tracking-wide text-sm">2008 IPL Champions</p>
                                    <p className="text-white/60 text-xs font-medium mt-0.5">The winning T20 mindset — now in Melbourne</p>
                                </div>
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
