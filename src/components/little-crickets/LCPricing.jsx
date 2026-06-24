import React from 'react';
import { motion } from 'framer-motion';

const scrollToForm = () => {
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
};

const groups = [
    {
        name: 'Ages 7–9',
        ages: 'Ages 7–9',
        price: '$265',
        gradient: 'from-rr-pink to-rr-blue',
        bundoora: ['Mondays · From 27 Apr', 'Fridays · From 1 May'],
    },
    {
        name: 'Ages 10–12',
        ages: 'Ages 10–12',
        price: '$290',
        gradient: 'from-rr-blue to-rr-pink',
        bundoora: ['Mondays · From 27 Apr', 'Fridays · From 1 May'],
    },
    {
        name: 'Ages 13–15',
        ages: 'Ages 13–15',
        price: '$310',
        gradient: 'from-rr-pink to-rr-blue',
        bundoora: [
            'Mondays 6:00pm · From 27 Apr',
            'Mondays 7:00pm · From 27 Apr',
            'Wednesdays 6:00pm · From 29 Apr',
            'Wednesdays 7:00pm · From 29 Apr',
        ],
    },
];

const LCPricing = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        Investment
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-4"
                    >
                        Pricing & Schedule
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-rr-charcoal font-medium max-w-2xl mx-auto"
                    >
                        8 weeks of expert coaching across two Melbourne locations. Bundoora sessions are open now — Hallam schedule coming soon.
                    </motion.p>
                </div>

                {/* Group pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {groups.map((group, i) => (
                        <motion.div
                            key={group.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                        >
                            <div className={`h-1.5 bg-gradient-to-r ${group.gradient}`} />
                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">{group.name}</p>
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-tight mb-1">{group.ages}</h3>
                                <div className="flex items-baseline gap-1 mt-3 mb-5">
                                    <span className="text-3xl font-black text-rr-dark">{group.price}</span>
                                    <span className="text-rr-charcoal font-medium text-sm">/ child</span>
                                </div>

                                {/* Common details */}
                                <div className="space-y-2 mb-5">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-xs font-bold text-rr-dark uppercase tracking-wide">Duration</span>
                                        <span className="text-xs font-medium text-rr-charcoal">8 weeks</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-xs font-bold text-rr-dark uppercase tracking-wide">Uniform</span>
                                        <span className="text-xs font-medium text-rr-charcoal">TBC</span>
                                    </div>
                                </div>

                                {/* Bundoora sessions */}
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">📍 Bundoora</p>
                                    <div className="space-y-1.5">
                                        {group.bundoora.map((s, k) => (
                                            <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                                <p className="text-xs font-semibold text-rr-dark">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hallam TBC */}
                                <div className="mb-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">📍 Hallam</p>
                                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg px-3 py-2 text-center">
                                        <p className="text-xs font-semibold text-slate-400">Schedule TBC</p>
                                    </div>
                                </div>

                                <button
                                    onClick={scrollToForm}
                                    className="mt-auto w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-2 text-sm"
                                >
                                    Register Now
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Hallam notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 max-w-2xl mx-auto"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-lg">📍</div>
                    <div>
                        <p className="font-black text-rr-dark uppercase tracking-tight text-sm">Hallam — Venue TBC</p>
                        <p className="text-rr-charcoal text-sm font-medium mt-0.5">Session times and schedule are being finalised. Register your interest and we'll be in touch once details are confirmed.</p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default LCPricing;
