import React from 'react';
import { motion } from 'framer-motion';

const TechnologyEdge = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Content Side */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        THE <span className="text-rr-blue">DNA PERFORMANCE</span> PROFILE
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium mb-8 leading-relaxed">
                        Say goodbye to vague feedback. Every player in the elite program receives a digital RRAA DNA Profile — a data-driven dashboard tracking their biomechanics, tactical awareness, and physical progression across 3 assessment points.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-rr-pink/10 p-3 rounded-lg text-rr-pink">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rr-dark mb-1">Precision Benchmarking</h3>
                                <p className="text-sm text-rr-charcoal">Track exact bat speed, bowling pace, release angles, and strike rates against elite youth benchmarks.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-rr-blue/10 p-3 rounded-lg text-rr-blue">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rr-dark mb-1">Individual Development Plan</h3>
                                <p className="text-sm text-rr-charcoal">Data drives the coaching. Your child receives a tailored IDP, establishing precise goals for the 12-week block.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="bg-rr-pink/10 p-3 rounded-lg text-rr-pink">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rr-dark mb-1">Parent & Selector Reports</h3>
                                <p className="text-sm text-rr-charcoal">Export comprehensive PDF reports at the end of the program to share with state selectors or premier club coaches.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="relative h-[600px] flex justify-center items-center">
                    {/* Decorative Background Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rr-blue/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rr-pink/5 rounded-full blur-2xl"></div>

                    {/* App Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 w-[300px] h-[600px] bg-rr-dark rounded-[40px] border-[10px] border-rr-dark shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Status Bar Mock */}
                        <div className="h-6 w-full bg-rr-dark flex justify-between items-center px-4">
                            <span className="text-[10px] text-white/50">9:41</span>
                            <div className="flex gap-1.5">
                                <div className="w-4 h-2.5 bg-white/50 rounded-sm"></div>
                                <div className="w-3 h-2.5 bg-white/50 rounded-sm"></div>
                                <div className="w-5 h-2.5 bg-white rounded-sm"></div>
                            </div>
                        </div>

                        {/* App UI Mock */}
                        <div className="flex-1 bg-slate-900 border-t border-white/10 p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-rr hidden sm:block"></div>
                                <div>
                                    <p className="text-white font-bold text-sm">John Doe</p>
                                    <p className="text-rr-pink text-[10px] uppercase font-bold tracking-wider">DNA Performance Profile</p>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-white/5">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-white/70 text-xs">Bat Speed</span>
                                    <span className="text-white font-bold text-xl">112 <span className="text-xs text-white/50 font-normal">km/h</span></span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-rr-pink w-[75%]"></div>
                                </div>
                                <p className="text-[9px] text-rr-blue font-semibold mt-2 text-right">Top 10% for age bracket</p>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-white/5">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-white/70 text-xs">Tactical Rating</span>
                                    <span className="text-white font-bold text-xl">8.5<span className="text-xs text-white/50 font-normal">/10</span></span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-rr-blue w-[85%]"></div>
                                </div>
                                <p className="text-[9px] text-rr-pink font-semibold mt-2 text-right">+1.2 since Assessment 1</p>
                            </div>

                            {/* Radar Chart Mock */}
                            <div className="bg-slate-800 rounded-xl p-4 border border-white/5 aspect-square relative flex items-center justify-center">
                                {/* SVG Hexagons mimicking a radar chart */}
                                <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
                                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="white" strokeWidth="0.5" />
                                    <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" fill="none" stroke="white" strokeWidth="0.5" />
                                    <polygon points="50,45 60,50 60,60 50,65 40,60 40,50" fill="none" stroke="white" strokeWidth="0.5" />
                                    {/* Data Fill */}
                                    <polygon points="50,15 85,30 65,70 50,85 15,65 25,30" fill="rgba(225, 31, 143, 0.4)" stroke="#E11F8F" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TechnologyEdge;
