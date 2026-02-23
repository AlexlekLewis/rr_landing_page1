import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

const ProgramAtAGlance = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-20 px-6 lg:px-8 relative z-10 bg-black/40 border-t border-white/5">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                }}
                className="max-w-5xl mx-auto"
            >
                <motion.div variants={fadeIn} className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Program at a Glance
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Duration Tile */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-rr-pink/20 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-rr-pink/40 transition-colors duration-500 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-rr-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-rr-pink/10 rounded-full flex items-center justify-center mb-6 border border-rr-pink/30 text-rr-pink">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">12 Weeks</h3>
                            <p className="text-slate-400">Comprehensive holistic development program designed for measurable growth.</p>
                        </div>
                    </motion.div>

                    {/* Schedule Tile */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-rr-blue/20 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-rr-blue/40 transition-colors duration-500 text-center md:col-span-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-rr-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-rr-blue/10 rounded-full flex items-center justify-center mb-6 border border-rr-blue/30 text-rr-blue">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">2 Sessions Per Week</h3>
                            <p className="text-slate-300 font-medium mb-2">1 Weekday Evening & 1 Weekend session</p>
                            <p className="text-slate-400 text-sm max-w-md">We value your time and travel commitments. Sessions are strictly mapped to 2-hour blocks to maximize intensity without overwhelming your schedule.</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default ProgramAtAGlance;
