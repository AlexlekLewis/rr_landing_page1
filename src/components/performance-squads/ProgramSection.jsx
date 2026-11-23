import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { fadeUp, SectionHeading } from './shared';
import { MEMBER_INCLUDES, TRIAL_PRICE, MEMBERSHIP, money } from './data';

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS + WHAT YOU GET — /performance-squads only.
//
// Andy, 22 Nov 2026: the page was far too long; distil what we deliver. This
// one section replaces five that used to sit on the page one after another
// (The Program, Who This Is For, The Pathway, Your Coaches, The Power League).
// Their detail lives in the FAQ now, one tap away.
//
// The six points are the welcome page's own list (MEMBER_INCLUDES in ./data.js),
// so this page and the page a family pays on can never promise different things.
// ─────────────────────────────────────────────────────────────

const STEPS = [
    { n: '1', title: 'Trial', body: `Book a trial at your centre (${money(TRIAL_PRICE)} incl. GST per session). Our coaches assess batting, bowling, fielding and attitude.` },
    { n: '2', title: 'Get selected', body: 'You are told where you stand either way. Selected players are offered a squad place.' },
    { n: '3', title: 'Train and play', body: `Join with a ${money(MEMBERSHIP.joiningFee)} joining fee, then ${money(MEMBERSHIP.weeklyFee)} a week (incl. GST). Train every week and play matches from September to April.` },
];

const ProgramSection = () => (
    <section className="py-14 sm:py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="How It Works"
                title="Trial. Get Selected. Play."
                sub="For players serious about T20 cricket: in the pathway now, past the age groups, coming back from injury, or built for the short format. Squads are grouped by playing standard, not one age bracket."
            />

            <ol className="grid sm:grid-cols-3 gap-3 mb-10">
                {STEPS.map((s, i) => (
                    <motion.li key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
                        <span className="w-9 h-9 rounded-full bg-rr-pink text-white font-black flex items-center justify-center shrink-0">{s.n}</span>
                        <div>
                            <h3 className="text-base font-black uppercase mb-1">{s.title}</h3>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">{s.body}</p>
                        </div>
                    </motion.li>
                ))}
            </ol>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-6 sm:p-9">
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-6">What every squad member gets</h3>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    {MEMBER_INCLUDES.map((item) => (
                        <li key={item.title} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" strokeWidth={3} />
                            <div>
                                <p className="text-white text-[15px] font-black leading-snug">{item.title}</p>
                                <p className="text-white/60 text-sm font-medium leading-relaxed">{item.body}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    </section>
);

export default ProgramSection;
