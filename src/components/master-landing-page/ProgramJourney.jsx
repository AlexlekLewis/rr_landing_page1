import React from 'react';
import { motion } from 'framer-motion';

const ProgramJourney = () => {
    return (
        <section className="py-24 bg-rr-dark text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-1 bg-image-gradient-rr"></div>
            <div className="absolute -left-40 top-40 opacity-5 pointer-events-none">
                <img src="/assets/rr-lion-white.png" alt="" className="w-96" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        THE 12-WEEK <span className="text-rr-pink">PROFESSIONAL JOURNEY</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        This isn't a drop-in clinic. It is a fully sequenced, data-driven development program designed to prepare players for representative selection and premier cricket.
                    </p>
                </div>

                <div className="space-y-6 md:space-y-8">

                    {/* ROW 1: Week 0 -> Week 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Week 0 - Onboarding */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Dotted Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>

                            <div className="relative z-10">
                                <div className="mb-4">
                                    <span className="text-rr-pink font-black text-xl block mb-1">Week 0</span>
                                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">Onboarding</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                                    The crucial setup week where players and parents are introduced to the academy standards, the DNA Profiling system, and the coaching staff.
                                </p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Goal setting & baseline expectations</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Apparel sizing and distribution</li>
                                </ul>
                            </div>
                        </div>

                        {/* Week 1 - Assessment */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Dotted Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>

                            <div className="relative z-10">
                                <div className="mb-4">
                                    <span className="text-rr-pink font-black text-xl block mb-1">Week 1</span>
                                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">Assessment</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                                    A rigorous testing environment establishing your baseline DNA Profile. We gather objective data across biomechanics, cardiovascular fitness, and technical execution to build your Individual Development Plan (IDP).
                                </p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Biomechanical and 360-degree video analysis</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Fitness, speed, and agility benchmarking</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Data capture mapping directly to IDPs</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: Phase 1 -> Phase 2 -> Phase 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Phase 1 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Dotted Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                            <div className="relative z-10">
                                <div className="mb-4">
                                    <span className="text-rr-blue font-black text-xl block mb-1">Phase 1</span>
                                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">Explore (Wks 2-4)</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    Deconstructing current techniques and introducing advanced T20 concepts. Players are encouraged to step out of their comfort zones and experiment with new biomechanics without fear of failure.
                                </p>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Dotted Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                            <div className="relative z-10">
                                <div className="mb-4">
                                    <span className="text-rr-blue font-black text-xl block mb-1">Phase 2</span>
                                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">Challenge (Wks 5-8)</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    Applying new skills under elevated pressure. We increase the intensity of net sessions, introducing constraints and match-scenario simulations to test decision-making under genuine stress.
                                </p>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Dotted Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
                            <div className="relative z-10">
                                <div className="mb-4">
                                    <span className="text-rr-blue font-black text-xl block mb-1">Phase 3</span>
                                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">Execute (Wks 9-12)</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    Full contextual immersion. Players are expected to consistently execute their refined skills within high-stakes, competitive scenarios, culminating in their final assessment and post-program pathway report.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default ProgramJourney;
