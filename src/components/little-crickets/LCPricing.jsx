import React from 'react';
import { motion } from 'framer-motion';

const scrollToForm = () => {
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
};

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
                        className="text-rr-charcoal font-medium max-w-xl mx-auto"
                    >
                        8 weeks of expert coaching at Bundoora's Cutting Edge Cricket facility. Choose the day that suits your schedule.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Warriors */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="h-1.5 bg-gradient-to-r from-rr-pink to-rr-blue" />
                        <div className="p-8">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Warriors</p>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-1">Ages 7–9</h3>
                            <div className="flex items-baseline gap-1 mt-4 mb-6">
                                <span className="text-4xl font-black text-rr-dark">$265</span>
                                <span className="text-rr-charcoal font-medium">/ child</span>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Duration</span>
                                    <span className="text-sm font-medium text-rr-charcoal">8 weeks</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Monday Option</span>
                                    <span className="text-sm font-medium text-rr-charcoal">6:00pm – 7:00pm<br /><span className="text-xs text-slate-400">Starting 20 Apr</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Friday Option</span>
                                    <span className="text-sm font-medium text-rr-charcoal">6:00pm – 7:00pm<br /><span className="text-xs text-slate-400">Starting 24 Apr</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Venue</span>
                                    <span className="text-sm font-medium text-rr-charcoal text-right">Cutting Edge Cricket<br /><span className="text-xs text-slate-400">Bundoora</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Uniform</span>
                                    <span className="text-sm font-medium text-rr-charcoal">TBC</span>
                                </div>
                            </div>
                            <button
                                onClick={scrollToForm}
                                className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-2"
                            >
                                Register Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* Challengers */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="h-1.5 bg-gradient-to-r from-rr-blue to-rr-pink" />
                        <div className="p-8">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-1">Challengers</p>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-1">Ages 10–12</h3>
                            <div className="flex items-baseline gap-1 mt-4 mb-6">
                                <span className="text-4xl font-black text-rr-dark">$290</span>
                                <span className="text-rr-charcoal font-medium">/ child</span>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Duration</span>
                                    <span className="text-sm font-medium text-rr-charcoal">8 weeks</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Monday Option</span>
                                    <span className="text-sm font-medium text-rr-charcoal">7:00pm – 8:00pm<br /><span className="text-xs text-slate-400">Starting 20 Apr</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Friday Option</span>
                                    <span className="text-sm font-medium text-rr-charcoal">7:00pm – 8:00pm<br /><span className="text-xs text-slate-400">Starting 24 Apr</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Venue</span>
                                    <span className="text-sm font-medium text-rr-charcoal text-right">Cutting Edge Cricket<br /><span className="text-xs text-slate-400">Bundoora</span></span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm font-bold text-rr-dark uppercase tracking-wide">Uniform</span>
                                    <span className="text-sm font-medium text-rr-charcoal">TBC</span>
                                </div>
                            </div>
                            <button
                                onClick={scrollToForm}
                                className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-2"
                            >
                                Register Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LCPricing;
