import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GlobalBallIcon } from './CricketIcons';
import { fadeUp, SectionHeading } from './shared';
import { OPPORTUNITIES, CASE_STUDIES } from './data';

// The differentiator no club or association can match. Sits high on the page,
// with proof underneath — the Royals Group placements are the whole argument
// that this isn't just another T20 competition.
const OpportunitySection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="The Royals Pathway"
                title="This Isn't Another T20 Comp"
                sub="T20 has torn up the old route to the top. The Rajasthan Royals now run a global system — Jaipur, Paarl, Barbados — and a Performance Squad place puts you inside it."
            />

            {/* Opportunity list */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <GlobalBallIcon className="w-7 h-7 text-rr-pink shrink-0" />
                    <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight">
                        What A Squad Place Opens Up
                    </h3>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {OPPORTUNITIES.map((o) => (
                        <li key={o} className="flex items-start gap-3">
                            <ArrowUpRight className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-white/80 text-[15px] font-medium leading-relaxed">{o}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Proof */}
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {CASE_STUDIES.map((c, i) => (
                    <motion.div
                        key={c.title}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={i * 0.1}
                        className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col"
                    >
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink bg-rr-pink/10 rounded-full px-3 py-1.5 self-start mb-5">
                            Already Happening
                        </span>
                        <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-4xl sm:text-5xl font-black text-rr-light-pink leading-none">
                                {c.stat}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-wider text-white/50">
                                {c.statLabel}
                            </span>
                        </div>
                        <h4 className="text-lg font-black uppercase mb-2">{c.title}</h4>
                        <p className="text-white/65 text-sm font-medium leading-relaxed">{c.body}</p>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="text-center text-white/70 text-[15px] sm:text-base font-medium max-w-3xl mx-auto leading-relaxed"
            >
                These are the non-traditional routes that T20 has opened up — and the Royals
                system is one of the few genuinely built to move players along them.{' '}
                <span className="text-white font-bold">
                    Getting noticed no longer depends on one selection panel.
                </span>
            </motion.p>
        </div>
    </section>
);

export default OpportunitySection;
