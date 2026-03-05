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
                        This isn't a drop-in clinic. It's a structured 12-week program built to give your child the skills, confidence, and coaching they need to push for representative selection and premier cricket.
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
                                    The setup week where players and parents meet the coaching staff, learn how the program works, and understand exactly what to expect over the next 12 weeks.
                                </p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Meet your squad coach and set personal goals</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Collect your official Royals training kit</li>
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
                                    We test every player across batting, bowling, fielding, fitness, and movement to build a clear picture of where they are now. This becomes their Player DNA Profile — the starting point for their personalised development plan.
                                </p>
                                <ul className="text-sm text-slate-500 space-y-2">
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Full video analysis of batting and bowling technique</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Fitness, speed, and agility testing</li>
                                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Results feed directly into your child's Individual Development Plan</li>
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
                                    Breaking down existing habits and introducing new T20 techniques. Players are encouraged to try new things, experiment with different approaches, and step outside their comfort zone without worrying about getting it wrong.
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
                                    Now we turn up the heat. Players apply their new skills under real pressure — tougher net sessions, game-like situations, and scenarios designed to test whether they can make the right decisions when it matters.
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
                                    Everything comes together. Players are expected to deliver their improved skills consistently in competitive, match-like conditions. The program finishes with a final assessment and a detailed report on where to go next.
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
