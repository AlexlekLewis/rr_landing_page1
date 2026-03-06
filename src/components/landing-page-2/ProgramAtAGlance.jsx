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
                        Elite Program at a Glance
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Duration Tile */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-100 border-b-4 border-b-rr-pink shadow-xl rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 text-center">
                        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-5">
                            <h3 className="text-2xl font-bold text-rr-dark">12 Weeks</h3>
                            <p className="text-slate-600 font-medium">A comprehensive holistic development program spanning a 12-week period, designed exclusively for measurable growth in your complete T20 skill set.</p>
                            <div className="w-full border-t border-slate-100 pt-5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">First Scheduled Group Session</p>
                                <p className="text-lg font-black text-rr-pink uppercase tracking-wide">Tuesday</p>
                                <p className="text-2xl font-black text-rr-dark leading-tight">April 21st</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Schedule Tile */}
                    <motion.div variants={fadeIn} className="bg-white border border-slate-100 border-b-4 border-b-rr-blue shadow-xl rounded-2xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 md:col-span-2">
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-2xl font-bold text-rr-dark mb-2">2 Sessions Per Week</h3>
                            <p className="text-rr-navy font-bold mb-3">1 Weekday Evening + 1 Weekend Session</p>
                            <p className="text-slate-600 font-medium text-sm max-w-lg mb-5 text-center">Each player is allocated one 2-hour weekday session and one 2-hour weekend session per week.</p>

                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4 w-full max-w-lg mb-6 text-center">
                                {/* Weekday Block */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Weekday Session</p>
                                    <p className="font-bold text-rr-dark text-sm mb-2">Tuesday & Thursday</p>
                                    <div className="space-y-1">
                                        <p className="text-slate-500 text-xs">5:00 – 7:00pm</p>
                                        <p className="text-slate-500 text-xs">7:00 – 9:00pm</p>
                                    </div>
                                    <p className="text-slate-400 text-[10px] mt-2 italic">Allocated one slot</p>
                                </div>
                                {/* Weekend Block */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Weekend Session</p>
                                    <p className="font-bold text-rr-dark text-sm mb-2">Saturday & Sunday</p>
                                    <div className="space-y-1">
                                        <p className="text-slate-500 text-xs">8:00 – 10:00am</p>
                                        <p className="text-slate-500 text-xs">2:00 – 4:00pm</p>
                                        <p className="text-slate-500 text-xs">4:00 – 6:00pm</p>
                                    </div>
                                    <p className="text-slate-400 text-[10px] mt-2 italic">Allocated one slot</p>
                                </div>
                            </div>

                            <p className="text-sm font-bold text-rr-blue mt-2 uppercase tracking-wider bg-rr-blue/10 px-4 py-2 rounded-lg">48+ hours of coaching across 12 weeks</p>
                        </div>
                    </motion.div>
                </div>

                {/* Location Tile — full width */}
                <motion.div variants={fadeIn} className="mt-6 bg-white border border-slate-100 border-b-4 border-b-rr-pink shadow-xl rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-rr-pink/10 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Primary Training Location</p>
                            <h3 className="text-lg md:text-xl font-black text-rr-dark leading-tight">Cutting Edge Indoor Cricket Centre, Bundoora</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">Just off the Ring Road — conveniently located for players across Melbourne's north and east.</p>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default ProgramAtAGlance;
