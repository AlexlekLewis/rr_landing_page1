import React from 'react';
import { motion } from 'framer-motion';

const JourneyCard = ({ label, title, description, bullets, color = 'rr-pink' }) => {
    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 relative group border border-slate-200 hover:shadow-xl transition-all overflow-hidden cursor-pointer">
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>

            <div className="relative z-10">
                <div className="mb-2 group-hover:mb-4 transition-all duration-300">
                    <span className={`text-${color} font-black text-xl block mb-1`}>{label}</span>
                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">{title}</span>
                </div>
                {/* Expandable content - collapsed by default, expands on hover */}
                <div className="max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                    <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                        {description}
                    </p>
                    {bullets && (
                        <ul className="text-sm text-slate-500 space-y-2">
                            {bullets.map((bullet, i) => (
                                <li key={i} className="flex gap-2 items-start">
                                    <span className="text-rr-blue font-bold">✓</span> {bullet}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

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
                        THE 12 WEEK <span className="text-rr-pink">PROGRAM PLAN OVERVIEW</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        This isn't a drop-in clinic. It's a structured 12-week program built to give you the T20 skills, confidence, and coaching needed to push for representative selection and premier cricket.
                    </p>
                </div>

                <div className="space-y-6 md:space-y-8">

                    {/* ROW 1: Week 0 -> Week 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <JourneyCard
                            label="Week 0"
                            title="Onboarding"
                            color="rr-pink"
                            description="The setup week where players and parents meet the coaching staff, learn how the program works, and understand exactly what to expect over the next 12 weeks."
                            bullets={[
                                "Meet your squad coach and set personal goals",
                                "Collect your official Royals training kit"
                            ]}
                        />
                        <JourneyCard
                            label="Week 1"
                            title="Assessment"
                            color="rr-pink"
                            description="We test every player across batting, bowling, fielding, fitness, and movement to build a clear picture of where they are now. This becomes their Player DNA Profile — the starting point for their personalised development plan."
                            bullets={[
                                "Full video analysis of batting and bowling technique",
                                "Fitness, speed, and agility testing",
                                "Results feed directly into your Individual Development Plan"
                            ]}
                        />
                    </div>

                    {/* ROW 2: Phase 1 -> Phase 2 -> Phase 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <JourneyCard
                            label="Phase 1"
                            title="Explore (Wks 2-4)"
                            color="rr-blue"
                            description="Breaking down existing habits and introducing new T20 techniques. Players are encouraged to try new things, experiment with different approaches, and step outside their comfort zone without worrying about getting it wrong."
                        />
                        <JourneyCard
                            label="Phase 2"
                            title="Challenge (Wks 5-8)"
                            color="rr-blue"
                            description="Now we turn up the heat. Players apply their new skills under real pressure — tougher net sessions, game-like situations, and scenarios designed to test whether they can make the right decisions when it matters."
                        />
                        <JourneyCard
                            label="Phase 3"
                            title="Execute (Wks 9-12)"
                            color="rr-blue"
                            description="Everything comes together. Players are expected to deliver their improved skills consistently in competitive, match-like conditions. The program finishes with a final assessment and a detailed report on where to go next."
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};

export default ProgramJourney;
