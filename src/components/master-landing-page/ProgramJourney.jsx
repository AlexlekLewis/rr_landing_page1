import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const phases = [
    {
        label: 'Week 0',
        labelColor: 'text-rr-pink',
        title: 'Onboarding',
        body: (
            <>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                    The setup week where players and parents meet the coaching staff, learn how the program works, and understand exactly what to expect over the next 12 weeks.
                </p>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Meet your squad coach and set personal goals</li>
                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Collect your official Royals training kit</li>
                </ul>
            </>
        ),
    },
    {
        label: 'Week 1',
        labelColor: 'text-rr-pink',
        title: 'Assessment',
        body: (
            <>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                    We test every player across batting, bowling, fielding, fitness, and movement to build a clear picture of where they are now. This becomes their Player DNA Profile — the starting point for their personalised development plan.
                </p>
                <ul className="text-sm text-slate-500 space-y-2">
                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Full video analysis of batting and bowling technique</li>
                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Fitness, speed, and agility testing</li>
                    <li className="flex gap-2 items-start"><span className="text-rr-blue font-bold">✓</span> Results feed directly into your Individual Development Plan</li>
                </ul>
            </>
        ),
    },
    {
        label: 'Phase 1',
        labelColor: 'text-rr-blue',
        title: 'Explore (Wks 2–4)',
        body: (
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Breaking down existing habits and introducing new T20 techniques. Players are encouraged to try new things, experiment with different approaches, and step outside their comfort zone without worrying about getting it wrong.
            </p>
        ),
    },
    {
        label: 'Phase 2',
        labelColor: 'text-rr-blue',
        title: 'Challenge (Wks 5–8)',
        body: (
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Now we turn up the heat. Players apply their new skills under real pressure — tougher net sessions, game-like situations, and scenarios designed to test whether they can make the right decisions when it matters.
            </p>
        ),
    },
    {
        label: 'Phase 3',
        labelColor: 'text-rr-blue',
        title: 'Execute (Wks 9–12)',
        body: (
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Everything comes together. Players are expected to deliver their improved skills consistently in competitive, match-like conditions. The program finishes with a final assessment and a detailed report on where to go next.
            </p>
        ),
    },
];

const PhaseCard = ({ phase }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl relative border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
            <button
                className="relative z-10 w-full flex items-center justify-between p-6 md:p-8 text-left"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <div>
                    <span className={`${phase.labelColor} font-black text-xl block mb-0.5`}>{phase.label}</span>
                    <span className="text-rr-navy font-bold uppercase tracking-wider text-sm">{phase.title}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="relative z-10 px-6 pb-6 md:px-8 md:pb-8">
                            {phase.body}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
                        12 WEEK <span className="text-rr-pink">PROGRAM PLAN OVERVIEW</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        This isn't a drop-in clinic. It's a structured 12-week program built to give you the T20 skills, confidence, and coaching you need to push for representative selection and premier cricket.
                    </p>
                </div>

                <div className="space-y-4">
                    {phases.map((phase, i) => (
                        <PhaseCard key={i} phase={phase} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramJourney;
