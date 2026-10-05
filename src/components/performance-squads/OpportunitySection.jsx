import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GlobalBallIcon } from './CricketIcons';
import { fadeUp, SectionHeading } from './shared';
import { OPPORTUNITIES } from './data';

// The differentiator no club or association can match. Sits high on the page,
// Training-partner proof cards removed 3 Oct 2026 (see note in the JSX).
//
// `lead` is an optional sentence rendered directly above the list. The open age
// trial page uses it to say, where the reader actually meets the claim, that
// these are squad opportunities and not trial outcomes. /performance-squads
// passes nothing and renders exactly what it always has.
const OpportunitySection = ({ lead = null }) => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="The Royals Pathway"
                title="This Isn't Another T20 Comp"
                sub="T20 has torn up the old route to professional cricket, and the exposure opportunities are now greater than ever. The Rajasthan Royals now run a global system — and a Performance Squad place puts you inside it."
            />

            {lead && (
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={0}
                    className="text-white/70 text-[15px] sm:text-base font-medium leading-relaxed max-w-3xl mx-auto text-center mb-8 -mt-2"
                >
                    {lead}
                </motion.p>
            )}

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

            {/* The two "Already Happening" proof cards (Paarl Royals / Barbados
                Royals training partners) are no longer rendered, here or on
                /performance-squads-open-trial which shares this section.
                Andy's rule, 27 Sep 2026: training-partner and franchise claims
                go in the database email and paid ads only. CASE_STUDIES stays
                in ./data.js for those non-public uses. */}

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
