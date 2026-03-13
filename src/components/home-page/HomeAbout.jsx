import React from 'react';
import { motion } from 'framer-motion';

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

                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Vaibhav Suryavanshi — tall image */}
                        <div className="relative rounded-2xl overflow-hidden" style={{ height: '380px' }}>
                            <img
                                src="/assets/vaibhav-100-celebration.jpg"
                                alt="Vaibhav Suryavanshi — Rajasthan Royals"
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-black uppercase tracking-wide text-sm">Vaibhav Suryavanshi</p>
                                <p className="text-rr-pink text-xs font-bold uppercase tracking-widest mt-0.5">Discovered by the Royals</p>
                            </div>
                        </div>

                        {/* 2008 IPL win — taller panel */}
                        <div className="relative rounded-2xl overflow-hidden" style={{ height: '180px' }}>
                            <img
                                src="/assets/royals-2008-win.webp"
                                alt="Rajasthan Royals — 2008 IPL Champions"
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/75 via-rr-dark/40 to-transparent" />
                            <div className="absolute inset-0 flex items-center px-5">
                                <div>
                                    <p className="text-white font-black uppercase tracking-wide text-sm">2008 IPL Champions</p>
                                    <p className="text-white/60 text-xs font-medium mt-0.5">The winning T20 mindset — now in Melbourne</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeAbout;
