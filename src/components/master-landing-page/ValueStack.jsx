import React from 'react';
import { motion } from 'framer-motion';

const ValueStack = () => {
    return (
        <section className="py-24 bg-rr-dark text-white relative border-t-4 border-rr-pink">
            {/* Background texture */}
            <div className="absolute inset-0 bg-image-gradient-dark opacity-50 z-0"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16">

                {/* Column 1: The Pathway Forward */}
                <div className="flex-1 lg:pr-8 lg:border-r border-white/10">
                    <h2 className="text-3xl font-black text-white uppercase mb-8">BEYOND 12 WEEKS</h2>

                    {/* Visual Pathway Map */}
                    <div className="flex items-center gap-2 mb-10 text-sm md:text-base font-bold text-slate-300">
                        <span className="bg-rr-pink text-white px-3 py-1 rounded">RRAA</span>
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                        <span>Club Mastery</span>
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                        <span className="text-rr-blue">Pathways & Premier</span>
                    </div>

                    <ul className="space-y-6">
                        <li className="flex gap-4 items-start">
                            <div className="bg-white/10 p-2 rounded text-rr-blue shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Post-Program Pathway Report</h4>
                                <p className="text-sm text-slate-400">Comprehensive PDF detailing their technical and tactical progression, engineered to be shared with selectors and club coaches.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-white/10 p-2 rounded text-rr-blue shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">"What Next" Consultation</h4>
                                <p className="text-sm text-slate-400">Personalised sit-down at the conclusion of the program providing actionable steps for the next 12 months of their development.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-white/10 p-2 rounded text-rr-blue shrink-0 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">The Royals Network</h4>
                                <p className="text-sm text-slate-400">Direct integration into the Rajasthan Royals international development database.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Column 2: Value Stack & Price */}
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-white uppercase mb-8">THE INVESTMENT</h2>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 relative">
                        {/* Royals global logos for texture */}
                        <div className="opacity-10 absolute top-4 right-4 flex gap-2 w-32 justify-end pointer-events-none grayscale">
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

                        <div className="mt-8 flex flex-col gap-2 mb-4">
                            <div className="flex items-end gap-6">
                                <p className="text-6xl font-black text-rr-pink tracking-tighter leading-none">$2995</p>
                                <p className="pb-2 text-slate-400 text-sm font-medium uppercase tracking-wider">Total Investment</p>
                            </div>
                            <p className="text-sm font-bold text-rr-blue mt-2">
                                * Flexible payment plans available upon successful application.
                            </p>
                        </div>

                        <div className="bg-rr-pink/10 border border-rr-pink/30 rounded-xl p-4 mt-6">
                            <h4 className="flex items-center gap-2 font-bold text-rr-light-pink mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                The RRAA Guarantee
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                We offer this because we know the quality of what we deliver. If after the first two sessions you don't believe this program is the right environment for your child's development, we'll refund your investment in full — no questions asked.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ValueStack;
