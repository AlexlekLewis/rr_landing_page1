import React from 'react';
import { motion } from 'framer-motion';

const BeyondTwelveWeeks = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 overflow-hidden">

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                {/* Hero Action Banner */}
                <motion.div variants={fadeIn} className="relative w-full h-48 md:h-72 rounded-2xl overflow-hidden mb-16 shadow-xl border border-slate-200">
                    <img
                        src="/assets/lp2/action/riyan-parag-captain-announcement.jpg"
                        alt="Riyan Parag — Rajasthan Royals Captain"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-pink/15 to-rr-blue/15 mix-blend-overlay" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-xs font-bold text-white/80 tracking-widest uppercase">The Royals Ecosystem • Your Lifetime Connection</p>
                    </div>
                </motion.div>

                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">12 Weeks</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mt-6 leading-relaxed font-medium">
                        Completion of the 12-week program is not the end; it is your initiation into the Rajasthan Royals ecosystem and Global Academy network. You don't just graduate—you belong.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Masterclasses */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-rr-blue rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Priority Access</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            As an Academy alumni, you receive priority access and "first dibs" on all future high-performance masterclasses, specialist clinics, and ad-hoc coaching sessions hosted by Rajasthan Royals Academy Melbourne coaches.
                        </p>
                    </motion.div>

                    {/* Tours */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rose-500 rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Global Tours</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Inclusion in the selection pool for future academy tours. This includes potential visits to the Rajasthan Royals High Performance Centre in Nagpur, India, and other franchise locations.
                        </p>
                    </motion.div>

                    {/* Matches */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600 rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Match Opportunities</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            While the core 12 weeks is training-focused, alumni will form the basis of our competitive squads. We are currently scouting opportunities for an Inter-Academy T20 Tournament in the back half of 2026.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default BeyondTwelveWeeks;
