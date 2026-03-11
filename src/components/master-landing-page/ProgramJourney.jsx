import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
    {
        index: 0,
        week: 'Week 0 — From April 13th',
        phase: 'Pre-Program',
        title: 'Onboarding',
        tag: 'Foundation',
        accent: 'from-rr-pink to-rr-pink/60',
        summary: 'Commencing April 13th — meet the squad, set your goals, collect your kit.',
        description: 'Onboarding commences April 13th. The setup week where players and parents meet the coaching staff, learn how the program works, and understand exactly what to expect over the next 12 weeks.',
        bullets: [
            'Commences Sunday April 13th',
            'Meet your squad coach and set personal goals',
            'Collect your official Royals training kit',
            'Program induction and expectations briefing',
        ],
    },
    {
        index: 1,
        week: 'Week 1 — From April 21st',
        phase: 'Assessment',
        title: 'Player DNA Profile',
        tag: 'Baseline',
        accent: 'from-rr-pink/80 to-rr-blue/60',
        summary: 'Commencing April 21st — full technical, physical and tactical baseline.',
        description: 'First session commences Tuesday April 21st. We test every player across batting, bowling, fielding, fitness, and movement to build a clear picture of where they are now. This becomes the starting point for their personalised development plan.',
        bullets: [
            'Commences Tuesday April 21st',
            'Full video analysis of batting and bowling technique',
            'Fitness, speed, and agility testing',
            'Results feed directly into your Individual Development Plan',
        ],
    },
    {
        index: 2,
        week: 'Weeks 2–4',
        phase: 'Phase 1',
        title: 'Explore',
        tag: 'Deconstruct',
        accent: 'from-rr-blue/80 to-rr-blue/50',
        summary: 'Break old habits. Build new ones.',
        description: 'Breaking down existing habits and introducing new T20 techniques. Players are encouraged to try new things, experiment with different approaches, and step outside their comfort zone without worrying about getting it wrong.',
        bullets: [
            'Technique deconstruction and rebuild',
            'Exposure to modern T20 shot-making',
            'Low-pressure environment to experiment freely',
        ],
    },
    {
        index: 3,
        week: 'Weeks 5–8',
        phase: 'Phase 2',
        title: 'Challenge',
        tag: 'Pressure',
        accent: 'from-rr-blue to-rr-pink/70',
        summary: 'Apply new skills under real match pressure.',
        description: 'Now we turn up the heat. Players apply their new skills under real pressure — tougher net sessions, game-like situations, and scenarios designed to test whether they can make the right decisions when it matters.',
        bullets: [
            'High-intensity game-simulation sessions',
            'Decision-making under fatigue and pressure',
            'Competitive internal squad scenarios',
        ],
    },
    {
        index: 4,
        week: 'Weeks 9–12 — Finishing July 12th',
        phase: 'Phase 3',
        title: 'Execute',
        tag: 'Deliver',
        accent: 'from-rr-pink/70 to-rr-blue',
        summary: 'Perform consistently. Program concludes July 12th.',
        description: 'Everything comes together. Players are expected to deliver their improved skills consistently in competitive, match-like conditions. The program concludes Saturday July 12th with a final assessment and a detailed report on where to go next.',
        bullets: [
            'Match-standard performance evaluation',
            'Final Player DNA re-assessment',
            'Detailed post-program pathway report',
            'Program concludes Saturday July 12th',
        ],
    },
];

const ProgramJourney = () => {
    const [active, setActive] = useState(0);
    const current = phases[active];

    return (
        <section className="py-24 bg-rr-dark text-white relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink via-rr-blue to-rr-pink" />



            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Structure & Progression</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-5">
                        12 WEEK <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">PROGRAM PLAN OVERVIEW</span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                        This isn't a drop-in clinic. It's a structured 12-week program built to give you the T20 skills, confidence, and coaching you need to push for representative selection and higher honours.
                    </p>
                </motion.div>

                {/* Desktop: Two-column timeline layout */}
                <div className="hidden md:flex md:justify-center">
                <div className="grid md:grid-cols-[280px_1fr] gap-0 items-start w-full max-w-4xl">

                    {/* Left: Timeline nav */}
                    <div className="relative pr-8">
                        {/* Spine line */}
                        <div className="absolute right-8 top-4 bottom-4 w-px bg-white/10" />
                        <div
                            className="absolute right-8 top-4 w-px bg-gradient-to-b from-rr-pink to-rr-blue transition-all duration-500"
                            style={{ height: `${((active + 0.5) / phases.length) * 100}%` }}
                        />

                        <div className="space-y-2">
                            {phases.map((phase) => (
                                <button
                                    key={phase.index}
                                    onClick={() => setActive(phase.index)}
                                    className={`w-full text-left relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group
                                        ${active === phase.index ? 'bg-white/8' : 'hover:bg-white/4'}`}
                                >
                                    {/* Node */}
                                    <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ml-auto order-last
                                        ${active === phase.index
                                            ? 'border-rr-pink bg-rr-pink shadow-[0_0_12px_rgba(229,6,149,0.5)]'
                                            : 'border-white/20 bg-rr-dark group-hover:border-white/40'}`}
                                    >
                                        <span className={`text-[10px] font-black transition-colors ${active === phase.index ? 'text-white' : 'text-white/40'}`}>
                                            {phase.index + 1}
                                        </span>
                                    </div>

                                    <div className="flex-1 text-right">
                                        <p className="text-[10px] font-bold text-rr-pink uppercase tracking-widest">
                                            {phase.week}
                                        </p>
                                        <p className={`text-sm font-black uppercase tracking-wide transition-colors ${active === phase.index ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                                            {phase.title}
                                        </p>
                                        <p className={`text-[11px] font-medium transition-colors ${active === phase.index ? 'text-white/60' : 'text-white/20'}`}>
                                            {phase.summary}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Detail panel */}
                    <div className="pl-8 border-l border-white/10 min-h-[420px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="h-full"
                            >
                                {/* Phase tag */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r ${current.accent} text-white`}>
                                        {current.phase}
                                    </span>
                                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">{current.week}</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3 leading-none">
                                    {current.title}
                                </h3>
                                <div className={`w-12 h-0.5 rounded-full bg-gradient-to-r ${current.accent} mb-6`} />

                                <p className="text-white/70 leading-relaxed text-base mb-8 max-w-lg">
                                    {current.description}
                                </p>

                                <ul className="space-y-3">
                                    {current.bullets.map((b, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                            <span className="text-sm text-white/60 leading-relaxed">{b}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Progress indicator */}
                                <div className="mt-10 flex items-center gap-2">
                                    {phases.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActive(i)}
                                            className={`h-0.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-rr-pink' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                </div>

                {/* Mobile: Vertical stacked cards */}
                <div className="md:hidden space-y-3">
                    {phases.map((phase) => (
                        <motion.div
                            key={phase.index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.4, delay: phase.index * 0.07 }}
                            className="border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActive(active === phase.index ? -1 : phase.index)}
                                className="w-full flex items-center gap-4 p-5 text-left"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black transition-all
                                    ${active === phase.index ? 'bg-rr-pink text-white shadow-[0_0_12px_rgba(229,6,149,0.4)]' : 'border border-white/20 text-white/40'}`}>
                                    {phase.index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-rr-pink uppercase tracking-widest">{phase.week}</p>
                                </div>
                                <span className={`text-white/30 text-lg transition-transform duration-300 ${active === phase.index ? 'rotate-45' : ''}`}>+</span>
                            </button>

                            <AnimatePresence initial={false}>
                                {active === phase.index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 border-t border-white/10 pt-4">
                                            <p className="text-white/60 text-sm leading-relaxed mb-4">{phase.description}</p>
                                            <ul className="space-y-2">
                                                {phase.bullets.map((b, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                                        <span className="text-xs text-white/50 leading-relaxed">{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 pt-14 border-t border-white/10 mt-14">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Entries close March 20 — or when full</span>
                    </div>
                    <a href="#checkout" className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto">
                        Secure Your Place Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default ProgramJourney;
