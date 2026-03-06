import React from 'react';
import { motion } from 'framer-motion';

const ValueStack = () => {
    return (
        <section className="py-24 bg-rr-dark text-white relative border-t-4 border-rr-pink">
            {/* Background texture */}
            <div className="absolute inset-0 bg-image-gradient-dark opacity-50 z-0"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16">

                {/* Column: Value Stack & Price */}
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-white uppercase mb-8">THE INVESTMENT</h2>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 relative">
                        {/* Royals global logos for texture */}
                        <div className="opacity-10 absolute top-4 right-4 flex gap-2 w-32 justify-end pointer-events-none">
                            <img src="/assets/rr-logo-blue.png" alt="" className="h-8 object-contain" />
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-white font-medium">12 Weeks Elite T20 Coaching</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                            <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-white font-medium">Full DNA Performance Profile</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                            <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-white font-medium">Individual Development Plan</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                            <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-white font-medium">Official Royals Training Kit</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                            <li className="flex justify-between items-end pb-2">
                                <span className="text-white font-medium">Post-Program Report</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                        </ul>

                        {/* Value comparison block */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.2em] mb-4">What You're Getting</p>
                            <p className="text-white font-black text-sm uppercase tracking-wide mb-3">Premium development, one clear price.</p>
                            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
                                <p>Private specialist cricket coaching in Melbourne typically runs between <span className="text-white font-bold">$90 to $120+ per hour</span> for a single coach.</p>
                                <p>Our Elite Program breaks down to approximately <span className="text-rr-pink font-bold">$55 per hour</span> — including access to our international coaching network, premium facilities, data monitoring, mental performance training, and S&C programming.</p>
                                <p>Our ecosystem is built around developing the skills that matter — helping cricketers of all ages become more proficient in winning the key moments that define modern cricket.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-end gap-4 mb-6">
                            <p className="text-5xl md:text-6xl font-black text-rr-pink tracking-tighter leading-none">$2995</p>
                            <p className="pb-1 text-slate-400 text-sm font-medium uppercase tracking-wider">Total Investment</p>
                        </div>

                        {/* Payment Options */}
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Payment Options</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Pay in Full</p>
                                    <p className="text-white/40 text-xs leading-relaxed">If you pay in full before the closing date of the program, receive an additional training shirt and training pants free of charge.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Afterpay</p>
                                    <p className="text-white/40 text-xs leading-relaxed">Don't want to pay for your car upfront? No worries, we have provided AfterPay as one option to ensure you can invest in the Elite Program.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Deposit+</p>
                                    <p className="text-white/40 text-xs leading-relaxed">Pay a 50% deposit and secure your place in the Elite Program, and pay the remaining 50% prior to the first scheduled program session.</p>
                                </div>
                            </div>
                        </div>

                        {/* Deadline + CTA */}
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                            <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                                <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                                    Entry closes 5pm · March 20 — or when full
                                </span>
                            </div>
                            <a
                                href="#checkout"
                                className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-sm flex items-center gap-3"
                            >
                                Secure Your Place Now
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ValueStack;
