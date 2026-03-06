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
                                <span className="text-white font-medium">Post-Program Pathway Report</span>
                                <span className="text-slate-400 text-sm">Included</span>
                            </li>
                        </ul>

                        <div className="mt-8 flex flex-col gap-2 mb-6">
                            <div className="flex items-end gap-6">
                                <p className="text-6xl font-black text-rr-pink tracking-tighter leading-none">$2995</p>
                                <p className="pb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">Total Investment</p>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Payment Options</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Pay in Full</p>
                                    <p className="text-white/40 text-xs leading-relaxed">Single upfront payment. Includes a complimentary training shirt and pants.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Afterpay</p>
                                    <p className="text-white/40 text-xs leading-relaxed">Split into four fortnightly instalments. No interest, no fees.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-rr-pink/30 transition-colors duration-300">
                                    <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Staged Plan</p>
                                    <p className="text-white/40 text-xs leading-relaxed">Internal payment plan to spread the cost. Available upon application.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ValueStack;
