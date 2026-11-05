import React from 'react';
import { motion } from 'framer-motion';
import StrengthFigure from './CPFigures';
import { SectionHead, TickList } from './CPShared';

// "Where <coach> is strongest" — the specialist half of the page. Each card can
// be added to the booking; picks travel to /book as `goals` and the first pick's
// `focus` decides the net (Build Plan §5.2).
export default function CPStrengths({ profile, picks, onToggle }) {
    const picked = profile.strengths.filter((s) => picks.includes(s.key));
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead
                    first={`Where ${profile.first} is`}
                    second="strongest"
                    lead={`Every coach has parts of the game they know best. Pick what the player wants to work on, as many as you like. Your picks go into the booking request, so ${profile.first} knows the player’s goals before the first session.`}
                />
                <div className={`grid gap-5 ${profile.strengths.length > 2 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {profile.strengths.map((s, i) => {
                        const on = picks.includes(s.key);
                        return (
                            <motion.article
                                key={s.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                className={`flex flex-col gap-4 rounded-2xl bg-white p-5 sm:p-6 min-w-0 border-2 transition-colors ${on ? 'border-rr-pink' : 'border-slate-200'}`}
                            >
                                <StrengthFigure kind={s.figure} />
                                <div className="flex-1 flex flex-col gap-4">
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
                                </div>
                                <button
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => onToggle(s.key)}
                                    className={`min-h-[48px] rounded-full border-2 border-rr-pink px-5 font-black text-[13px] uppercase tracking-widest transition-colors ${on ? 'bg-rr-pink text-white' : 'bg-white text-rr-pink hover:bg-rr-pink/5'}`}
                                >
                                    {on ? '✓ Added to your booking' : 'Add to my booking'}
                                </button>
                            </motion.article>
                        );
                    })}
                </div>
                <p className="mt-6 min-h-[24px] font-bold text-rr-dark" aria-live="polite">
                    {picked.length > 0 && `Added to your booking: ${picked.map((s) => s.title).join(', ')}. Choose a time below.`}
                </p>
            </div>
        </section>
    );
}
