import React from 'react';
import { motion } from 'framer-motion';
import { Network, Globe2, Trophy, Infinity } from 'lucide-react';

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
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-zinc-950 overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-rr-blue/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-rr-pink/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-16 space-y-4">
                    <motion.div variants={fadeIn} className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <Infinity className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">12 Weeks</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed font-light">
                        Completion of the 12-week program is not the end; it is your initiation into the Rajasthan Royals Academy global system. You don't just graduate—you belong.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Masterclasses */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-rr-blue/30 transition-colors duration-500">
                        <div className="w-14 h-14 bg-rr-blue/10 rounded-2xl flex items-center justify-center mb-6 text-rr-blue group-hover:scale-110 transition-transform duration-300">
                            <Network className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Priority Access</h3>
                        <p className="text-slate-400 leading-relaxed">
                            As an Academy alumni, you receive priority access and "first dibs" on all future high-performance masterclasses, specialist clinics, and ad-hoc coaching sessions hosted by visiting Royals staff.
                        </p>
                    </motion.div>

                    {/* Tours */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-rr-pink/30 transition-colors duration-500">
                        <div className="w-14 h-14 bg-rr-pink/10 rounded-2xl flex items-center justify-center mb-6 text-rr-pink group-hover:scale-110 transition-transform duration-300">
                            <Globe2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Global Tours</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Inclusion in the selection pool for future academy tours. This includes potential visits to the Rajasthan Royals High Performance Centre in Nagpur, India, and other franchise locations.
                        </p>
                    </motion.div>

                    {/* Matches */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Match Opportunities</h3>
                        <p className="text-slate-400 leading-relaxed">
                            While the core 12 weeks is training-focused, alumni will form the basis of our competitive squads. We are currently scouting opportunities for an Inter-Academy T20 Tournament in the back half of 2026.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default BeyondTwelveWeeks;
