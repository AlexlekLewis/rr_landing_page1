import React from 'react';
import { motion } from 'framer-motion';
import { StumpsIcon, SelectionIcon, BatIcon } from '../performance-squads/CricketIcons';
import { fadeUp, SectionHeading } from '../performance-squads/shared';
import { PATHWAY_HEADING, PATHWAY_STEPS } from './openAgeData';

// Three steps, written for this trial. The squads page's "How Each Squad Is
// Built" block is deliberately not carried over — it is written around the
// 10 to 25 squads.
const ICONS = [StumpsIcon, SelectionIcon, BatIcon];

const OpenAgePathway = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading {...PATHWAY_HEADING} />
            <div className="grid sm:grid-cols-3 gap-5">
                {PATHWAY_STEPS.map((step, i) => {
                    const Icon = ICONS[i] || StumpsIcon;
                    return (
                        <motion.div
                            key={step.n}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={i * 0.1}
                            className="bg-white/5 border border-white/10 rounded-2xl p-7"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl font-black text-rr-pink/30 leading-none">{step.n}</span>
                                <Icon className="w-7 h-7 text-rr-pink" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-2">{step.title}</h3>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">{step.body}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default OpenAgePathway;
