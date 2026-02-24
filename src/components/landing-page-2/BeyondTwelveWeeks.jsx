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
                {/* Action Image — LP1 Style */}
                <motion.div variants={fadeIn} className="relative w-full aspect-video rounded-2xl overflow-hidden mb-16 shadow-xl border border-slate-200 group">
                    <img
                        src="/assets/lp2/kwena-catch.png"
                        alt="Kwena Maphaka — Athletic Fielding"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>

                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">12 Weeks</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mt-6 leading-relaxed font-medium">
                        Completing the 12-week program marks the beginning of your connection to the Rajasthan Royals ecosystem and Global Academy network — a pathway that continues to grow with you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Masterclasses */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Priority Access</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            As an Academy alumni, you receive priority access and "first dibs" on all future high-performance masterclasses, specialist clinics, and sessions hosted by Rajasthan Royals Academy Melbourne.
                        </p>
                    </motion.div>

                    {/* Tours */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Global Tours</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Inclusion in the selection pool for future academy tours. This includes potential visits to the Rajasthan Royals High Performance Centre in Nagpur, India, and other franchise locations.
                        </p>
                    </motion.div>

                    {/* Matches */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink rounded-t-3xl" />
                        <h3 className="text-xl font-bold text-rr-dark mb-3">Match Opportunities</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            While the core 12 weeks is training-focused, alumni will form the basis of our competitive squads.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default BeyondTwelveWeeks;
