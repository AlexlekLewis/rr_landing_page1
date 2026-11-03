import React from 'react';
import { motion } from 'framer-motion';
import { CENTRE, ALEX_RECORD, ALEX_ACCREDITATION, ALEX_PHILOSOPHY } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// The step-by-step lives in PCHowItWorks — this section is who Alex is, then it
// hands off to that section. (The Head Coach assessment was removed 3 Nov 2026.)

const PCAlex = () => {
    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 md:gap-14 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm border border-slate-200">
                            <img
                                src="/assets/coaches/alex-lewis.jpg"
                                alt="Alex Lewis — Academy Head Coach, Mickleham"
                                className="absolute inset-0 w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rr-dark/70 to-transparent" />
                            <p className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold uppercase tracking-widest">
                                {CENTRE.name}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Your Head Coach</p>
                        <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-2">
                            Alex Lewis
                        </h2>
                        <p className="text-sm font-bold text-rr-pink uppercase tracking-widest mb-6">
                            Director of Cricket · Academy Head Coach — Mickleham
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Alex matches every player who registers for private coaching at Mickleham
                            with their coach. Register your interest below and our <b className="text-rr-dark">administration
                            team will be in touch in the coming days</b> to organise your first session.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            When they call, they will ask about the player’s game, what they want to
                            work on and which night suits your family — that is what Alex uses to
                            choose the right coach.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-8">
                            Alex has spent more than twenty years coaching juniors through Melbourne’s
                            representative pathway. He runs the academy at a Premier Cricket club, has
                            coached Youth Premier League squads, has trained other coaches for Cricket
                            Victoria, and built and ran his own junior academy for over a decade. His
                            full record is below.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => scrollTo('eoi-form')}
                                className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                            >
                                Register Your Interest
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scrollTo('how-it-works')}
                                className="text-rr-dark hover:text-rr-pink font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-slate-200 hover:border-rr-pink/50 transition-colors"
                            >
                                See how it works
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Philosophy — his own words, and his coaching record. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 pt-14 border-t border-slate-200"
                >
                    <div className="border-l-4 border-rr-pink pl-6 md:pl-8 max-w-3xl mb-16">
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">How He Coaches</p>
                        <p className="text-2xl md:text-3xl font-black text-rr-dark leading-tight tracking-tight mb-5">
                            “{ALEX_PHILOSOPHY.quote}”
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed">
                            {ALEX_PHILOSOPHY.body}
                        </p>
                    </div>

                    {/* Each group is full width with its own even 2-up grid, so the
                        columns can never end ragged when one group has more entries
                        than the other. */}
                    {ALEX_RECORD.map((group, gi) => (
                        <div key={group.heading} className={gi > 0 ? 'mt-14' : ''}>
                            <h3 className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6">
                                {group.heading}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8">
                                {group.items.map((item, i) => {
                                    // Odd number of entries would leave a half-width
                                    // orphan on the last row — run it full width instead.
                                    const orphan = group.items.length % 2 === 1 && i === group.items.length - 1;
                                    return (
                                        <div
                                            key={item.title}
                                            className={`border-t-2 border-slate-200 pt-4 ${orphan ? 'md:col-span-2' : ''}`}
                                        >
                                            <p className="text-[15px] font-black text-rr-dark uppercase tracking-tight leading-snug mb-1.5">
                                                {item.title}
                                            </p>
                                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">
                                                {item.detail}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="mt-12 bg-rr-dark rounded-2xl px-7 py-6">
                        <p className="text-white font-black uppercase tracking-tight text-lg leading-tight mb-1.5">
                            {ALEX_ACCREDITATION.title}
                        </p>
                        <p className="text-white/70 font-medium leading-relaxed">
                            {ALEX_ACCREDITATION.detail}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PCAlex;
