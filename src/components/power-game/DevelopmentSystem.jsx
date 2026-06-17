import React from 'react';
import { motion } from 'framer-motion';

// "The development system" — the brochure's "how we build it": a structured technical
// progression per discipline, plus the Player Performance Portal. Built in order.
const TRACKS = [
    {
        label: 'Batters · Foundational Shot Range',
        stages: ['Base & Swing Path', 'Front-Foot Range', 'Back-Foot Range', 'Spin Range', 'Innovation Range', 'Format Application'],
    },
    {
        label: 'Bowlers · Technical Development',
        stages: ['Alignment', 'Consistency', 'Accuracy', 'Speed Development', 'Variations', 'Plan Execution'],
    },
];

const DevelopmentSystem = () => (
    <section className="bg-rr-dark py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">How we build it</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-5">
                    The development <span className="text-rr-pink">system</span>
                </h2>
                <p className="max-w-2xl mx-auto text-base md:text-lg text-white/70 font-medium leading-relaxed">
                    A structured technical progression, every session — built in order so the gains hold. The path from a good club player to one selectors can&apos;t ignore.
                </p>
            </motion.div>

            <div className="space-y-4">
                {TRACKS.map((track) => (
                    <motion.div
                        key={track.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-rr-blue to-rr-pink px-4 py-2.5">
                            <span className="text-sm font-black text-white uppercase tracking-wide">{track.label}</span>
                        </div>
                        <div className="p-4 flex flex-wrap items-center gap-2">
                            {track.stages.map((s, i) => (
                                <React.Fragment key={s}>
                                    <span className={`inline-flex items-center text-[11px] font-bold rounded-lg px-2.5 py-1.5 ${i === track.stages.length - 1 ? 'bg-rr-pink/20 border border-rr-pink/40 text-rr-light-pink' : 'bg-white/[0.06] border border-white/10 text-white/85'}`}>
                                        {i + 1} · {s}
                                    </span>
                                    {i < track.stages.length - 1 && <span aria-hidden className="text-rr-light-pink font-black text-xs">→</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mt-4 bg-rr-pink/10 border border-rr-pink/30 rounded-2xl p-6"
            >
                <div className="text-rr-pink font-black uppercase tracking-wide text-sm mb-1.5">Player Performance Portal</div>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Every rep captured — vision, velocity &amp; hitting data — in the Match Centre. Your growth shows in black and white, and so do you, in front of clubs and scouts.
                </p>
            </motion.div>
        </div>
    </section>
);

export default DevelopmentSystem;
