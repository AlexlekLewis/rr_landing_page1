import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Check } from 'lucide-react';

const PROGRAMS = [
    {
        door: 'Door One · The Intensive',
        name: 'The Elite Program',
        duration: '12 weeks · the foundation',
        headline: 'The Royals Way, condensed.',
        description:
            "Twelve weeks of high-density learning. Your player meets the T20 game, learns the methodology, surfaces their archetype as a batter, bowler or keeper. The crash-course that builds conviction — and the natural entry point if you're new to the academy.",
        tags: ['Methodology entry', 'Discover your archetype', 'Open to all'],
        featured: false,
    },
    {
        door: 'Door Two · The Season',
        name: 'Power Game — Performance Squads',
        duration: '8 months · the journey',
        headline: 'The Royals Way, lived.',
        description:
            'A season-long investment from late July through finals. Your player applies the methodology under real-match conditions, develops at their own speed inside their actual season, and builds performance for today and the seasons beyond. Built for committed cricketers.',
        tags: ['Season-long investment', 'Real-match integration', 'For committed players'],
        featured: true,
    },
];

const ProgramFamily = () => {
    return (
        <section className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,31,143,0.16) 0%, rgba(0,0,0,0) 55%)' }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            The Program Family
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        TWO PROGRAMS.<br className="hidden md:block" /> ONE <span className="text-rr-pink">PHILOSOPHY</span>.
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        RRA Melbourne offers two programs under one elite system. The 12-week Elite Program is the entry — the intensive that teaches the Royals Way and helps your player discover who they are as a cricketer. Power Game — Performance Squads is the season-long commitment — built for players who want development security over a full season, not a fresh booking every week.
                    </p>
                </motion.div>

                {/* Two doors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {PROGRAMS.map((p, idx) => (
                        <motion.div
                            key={p.name}
                            className={`relative rounded-2xl p-8 md:p-10 flex flex-col overflow-hidden transition-all duration-300 ${
                                p.featured
                                    ? 'bg-white/[0.07] border-2 border-rr-pink shadow-[0_10px_50px_rgba(225,31,143,0.25)]'
                                    : 'bg-white/5 border border-white/10'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                        >
                            <div className="w-12 h-12 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center mb-6">
                                <DoorOpen className="w-6 h-6 text-rr-pink" />
                            </div>

                            <div className="text-[10px] font-black text-rr-pink uppercase tracking-widest mb-3">
                                {p.door}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mb-2">
                                {p.name}
                            </h3>
                            <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-6">
                                {p.duration}
                            </div>

                            <div className="text-lg md:text-xl font-black text-white mb-3">
                                {p.headline}
                            </div>
                            <p className="text-sm text-white/75 font-medium leading-relaxed mb-6 flex-1">
                                {p.description}
                            </p>

                            <ul className="space-y-2">
                                {p.tags.map((tag) => (
                                    <li key={tag} className="flex items-center gap-2 text-sm text-white font-semibold">
                                        <Check className="w-4 h-4 text-rr-pink flex-shrink-0" />
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Closing line */}
                <motion.p
                    className="text-center text-sm md:text-base text-white/70 font-bold uppercase tracking-widest mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Same Royals Way. Same elite system. Same coaches. <span className="text-rr-pink">Different commitment.</span>
                </motion.p>
            </div>
        </section>
    );
};

export default ProgramFamily;
