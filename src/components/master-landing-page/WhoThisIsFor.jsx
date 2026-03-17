import React from 'react';
import { motion } from 'framer-motion';

const WhoThisIsFor = () => {
    return (
        <section className="py-24 bg-white border-t-8 border-image-gradient-rr">
            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        IS THIS PROGRAM RIGHT FOR <span className="text-rr-pink">YOUR CHILD?</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal max-w-2xl mx-auto mb-8 font-medium italic">
                        "We don't select on talent alone. We select on commitment. If your child is ready to train with purpose, they belong here regardless of their current level."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                    {/* The YES Column */}
                    <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-2xl font-black text-rr-dark uppercase">THIS PROGRAM IS FOR:</h3>
                        </div>

                        <ul className="space-y-5 relative z-10">
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium">
                                <span className="text-green-500 mt-1 shrink-0">✓</span>
                                Parents who want structured, measurable development for their child rather than subjective feedback.
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium">
                                <span className="text-green-500 mt-1 shrink-0">✓</span>
                                Dedicated young players aged [Age Range] who are serious about playing representative or premier cricket.
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium">
                                <span className="text-green-500 mt-1 shrink-0">✓</span>
                                Kids stuck on a plateau at club level who need advanced biomechanical and tactical intervention.
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium">
                                <span className="text-green-500 mt-1 shrink-0">✓</span>
                                Players hungry to transition from traditional game structures into modern, aggressive T20 formats.
                            </li>
                        </ul>
                    </div>

                    {/* The NO Column */}
                    <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                            <h3 className="text-2xl font-black text-rr-dark uppercase">THIS IS <span className="text-red-500">NOT</span> FOR:</h3>
                        </div>

                        <ul className="space-y-5 relative z-10">
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium opacity-80">
                                <span className="text-red-400 mt-1 shrink-0">✕</span>
                                Players looking for a casual holiday clinic or social cricket experience.
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium opacity-80">
                                <span className="text-red-400 mt-1 shrink-0">✕</span>
                                Families expecting assured selection outcomes (we develop readiness; selection depends on many factors).
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium opacity-80">
                                <span className="text-red-400 mt-1 shrink-0">✕</span>
                                Players unwilling to commit to intense, focus-driven net sessions.
                            </li>
                            <li className="flex items-start gap-3 text-rr-charcoal font-medium opacity-80">
                                <span className="text-red-400 mt-1 shrink-0">✕</span>
                                Parents looking for the cheapest coaching option (this is a premium, data-driven environment).
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhoThisIsFor;
