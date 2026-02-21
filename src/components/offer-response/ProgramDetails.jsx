import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Map, ArrowRight, ShieldCheck, Calendar, Clock } from 'lucide-react';

// Reusable animated section component
const DetailSection = ({ title, prefix, children, align = 'left', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay }}
        className={`flex flex-col ${align === 'center' ? 'items-center text-center' : ''} mb-32`}
    >
        {prefix && (
            <span className="text-rr-pink font-bold tracking-widest uppercase text-sm mb-4 block">
                {prefix}
            </span>
        )}
        <h3 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-widest leading-tight mb-8">
            {title}
        </h3>
        <div className={`text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-4xl space-y-6 ${align === 'center' ? 'mx-auto' : ''}`}>
            {children}
        </div>
    </motion.div>
);

const ProgramDetails = () => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 border border-slate-100"></div>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-rr-pink/5 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">

                <div className="mb-32 text-center max-w-3xl mx-auto">
                    <p className="text-xl text-slate-500 font-medium leading-relaxed italic bg-emerald-500/20 text-emerald-900 px-4 py-2 rounded-xl border border-emerald-500/30">
                        "So that you can begin to prepare for both the assessment session and the possibility of being offered a place, please find below details of the program including program content, training days & times and the cost of this premium program."
                    </p>
                </div>

                <DetailSection title="[Language TBC]" prefix="[Language TBC]">
                    <p>[Language TBC]</p>
                    <p>[Language TBC]</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {[
                            { title: '[Language TBC]', weeks: '[Language TBC]', sub: '[Language TBC]', text: '[Language TBC]' },
                            { title: '[Language TBC]', weeks: '[Language TBC]', sub: '[Language TBC]', text: '[Language TBC]' },
                            { title: '[Language TBC]', weeks: '[Language TBC]', sub: '[Language TBC]', text: '[Language TBC]' }
                        ].map((phase, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:border-rr-pink/50 transition-colors">
                                <h4 className="text-rr-blue font-black uppercase tracking-wider mb-2">{phase.title}</h4>
                                <span className="text-xs font-bold text-rr-pink bg-rr-pink/10 border border-rr-pink/20 px-3 py-1 rounded-full uppercase tracking-widest">{phase.weeks}</span>
                                <p className="font-bold text-rr-dark mt-6 mb-2">{phase.sub}</p>
                                <p className="text-sm text-slate-600">{phase.text}</p>
                            </div>
                        ))}
                    </div>
                </DetailSection>

                <DetailSection title="[Language TBC]" prefix="[Language TBC]" align="left">
                    <p>[Language TBC]</p>

                    <ul className="space-y-6 mt-8">
                        {[
                            { title: '[Language TBC]', text: "[Language TBC]" },
                            { title: '[Language TBC]', text: "[Language TBC]" },
                            { title: '[Language TBC]', text: "[Language TBC]" },
                            { title: '[Language TBC]', text: "[Language TBC]" }
                        ].map((item, i) => (
                            <li key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                                <ShieldCheck className="w-8 h-8 text-rr-pink shrink-0 mt-1" />
                                <div>
                                    <h5 className="text-xl font-bold text-rr-dark mb-2">{item.title}</h5>
                                    <p className="text-base text-slate-600">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </DetailSection>

                <DetailSection title="[Language TBC]" prefix="[Language TBC]">
                    <p className="font-bold text-2xl text-rr-dark mb-4">[Language TBC]</p>
                    <p>[Language TBC]</p>

                    <div className="bg-gradient-to-br from-rr-blue to-rr-dark rounded-3xl p-8 md:p-12 text-white mt-12 shadow-2xl relative overflow-hidden">
                        <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
                        <h4 className="text-2xl font-black uppercase tracking-widest mb-6">[Language TBC]</h4>
                        <ul className="space-y-4 text-slate-300">
                            {[1, 2, 3, 4, 5].map(i => (
                                <li key={i} className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-rr-pink shrink-0" />
                                    <span>[Language TBC]</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-lg italic font-medium">[Language TBC]</p>
                        </div>
                    </div>
                </DetailSection>

                <DetailSection title="[Language TBC]" prefix="[Language TBC]">
                    <p>[Language TBC]</p>
                    <p className="mt-4 font-bold text-rr-blue">[Language TBC]</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <div>
                            <Map className="w-10 h-10 text-rr-blue mb-4" />
                            <h5 className="text-xl font-black text-rr-dark uppercase mb-2">[Language TBC]</h5>
                            <p className="text-base text-slate-600">[Language TBC]</p>
                        </div>
                        <div>
                            <Target className="w-10 h-10 text-rr-blue mb-4" />
                            <h5 className="text-xl font-black text-rr-dark uppercase mb-2">[Language TBC]</h5>
                            <p className="text-base text-slate-600">[Language TBC]</p>
                        </div>
                    </div>
                </DetailSection>

                {/* THE COMMITMENT & PRICE BLOCK */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 border-4 border-rr-dark p-8 md:p-16 rounded-3xl bg-white shadow-2xl relative"
                >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rr-dark text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-xl">
                        [Language TBC]
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-3xl font-black text-rr-dark uppercase mb-6">[Language TBC]</h3>
                            <p className="text-lg text-slate-600 mb-8">[Language TBC]</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                        <Calendar className="w-6 h-6 text-rr-pink" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-rr-dark">[Language TBC]</p>
                                        <p className="text-sm text-slate-500">[Language TBC]</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-rr-pink" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-rr-dark">[Language TBC]</p>
                                        <p className="text-sm text-slate-500">[Language TBC]</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-rr-blue mt-6 uppercase tracking-wider">
                                [Language TBC]
                            </p>
                        </div>

                        <div className="bg-rr-dark text-white rounded-2xl p-8 text-center h-full flex flex-col justify-center">
                            <h3 className="text-2xl font-black uppercase tracking-wider mb-8 text-rr-pink">[Language TBC]</h3>

                            <div className="text-6xl md:text-7xl font-black mb-4">
                                [Language TBC]
                            </div>
                            <p className="text-xl font-bold uppercase tracking-wider text-slate-300 mb-8">[Language TBC]</p>

                            <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto">
                                [Language TBC]
                            </p>

                            <div className="mt-8 pt-8 border-t border-white/10 text-sm text-slate-400 space-y-2">
                                <p>[Language TBC]</p>
                                <p>[Language TBC]</p>
                                <p>[Language TBC]</p>
                                <p>[Language TBC]</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-32 text-center pb-12">
                    <h3 className="text-3xl font-black text-rr-dark uppercase mb-6">[Language TBC]</h3>
                </div>

            </div>
        </section>
    );
};

export default ProgramDetails;
