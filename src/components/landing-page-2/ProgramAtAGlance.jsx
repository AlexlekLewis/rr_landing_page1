import React from 'react';
import { motion } from 'framer-motion';

const ProgramAtAGlance = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-white" id="program-at-a-glance">
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
                    <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Program at a Glance
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Duration Tile */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-100 border-b-4 border-b-rr-pink shadow-xl rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 text-center">
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-2xl font-bold text-rr-dark mb-2">12 Weeks</h3>
                            <p className="text-slate-600 font-medium">Comprehensive holistic development program designed for measurable growth.</p>
                        </div>
                    </motion.div>

                    {/* Schedule Tile */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-100 border-b-4 border-b-rr-blue shadow-xl rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 text-center md:col-span-2">
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-2xl font-bold text-rr-dark mb-2">2 Sessions Per Week</h3>
                            <p className="text-rr-navy font-bold mb-2">1 Weekday Evening & 1 Weekend Session</p>
                            <p className="text-slate-600 font-medium text-sm max-w-md">We value your time and travel commitments. Sessions are strictly mapped to 2-hour blocks to maximize intensity without overwhelming your schedule.</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default ProgramAtAGlance;
