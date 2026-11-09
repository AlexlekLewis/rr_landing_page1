import React from 'react';
import { motion } from 'framer-motion';
import StrengthFigure from './CPFigures';
import { SectionHead, TickList } from './CPShared';

// "Where <coach> is strongest": the coach's skill set. The cards only describe.
// There's nothing to pick here (Alex, 9 Nov 2026: don't complicate the offering);
// the family tells the coach the player's goals at the first session, and can add
// a note on /book.
export default function CPStrengths({ profile }) {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead
                    first={`Where ${profile.first} is`}
                    second="strongest"
                    lead={`Every coach has parts of the game they know best. These are ${profile.first}’s. At the first session, ${profile.first} talks through what the player wants to work on and builds the plan from there.`}
                />
                <div className={`grid gap-5 ${profile.strengths.length > 2 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {profile.strengths.map((s, i) => (
                        <motion.article
                            key={s.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className="flex flex-col gap-4 rounded-2xl bg-white p-5 sm:p-6 min-w-0 border-2 border-slate-200"
                        >
                            <StrengthFigure kind={s.figure} />
                            <h3 className="text-xl font-black uppercase tracking-wide text-rr-dark">{s.title}</h3>
                            <p className="font-medium text-rr-charcoal">{s.description}</p>
                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rr-pink mb-1.5">Good for</p>
                                <p className="font-medium text-rr-charcoal">{s.goodFor}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rr-pink mb-1.5">In the session</p>
                                <TickList items={s.inSession} className="text-[15px] font-medium text-rr-charcoal" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
