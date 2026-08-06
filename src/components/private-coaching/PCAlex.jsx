import React from 'react';
import { motion } from 'framer-motion';
import { CENTRE, ALEX_RECORD, ALEX_ACCREDITATION, ALEX_PHILOSOPHY } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// The step-by-step lives in PCHowItWorks — this section is who Alex is and what
// the assessment costs, then it hands off to that section.

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
                            Every private coaching journey at Mickleham starts with Alex. Register your
                            interest below and our <b className="text-rr-dark">administration team will be in
                            touch in the coming days</b> to organise a time for your first session with him.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            That session is where everything gets decided — which coach suits your
                            game, which nights work for your family, and what the journey looks like
                            from there.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-8">
                            Alex has spent more than twenty years coaching juniors through Melbourne’s
                            representative pathway. He runs the academy at a Premier Cricket club, has
                            coached Youth Premier League squads, has trained other coaches for Cricket
                            Victoria, and built and ran his own junior academy for over a decade. His
                            full record is below.
                        </p>

                        {/* The one number on the page */}
                        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-rr-pink via-rr-pink/80 to-rr-blue mb-8">
                            <div className="bg-rr-dark rounded-[14px] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
                                <div className="shrink-0">
                                    <span className="inline-block bg-rr-pink text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">Launch Offer</span>
                                    <div className="flex items-end gap-2.5">
                                        <p className="text-4xl font-black text-white tracking-tight leading-none">$50</p>
                                        <p className="text-xl font-bold text-white/40 line-through leading-none mb-0.5">$160</p>
                                    </div>
                                </div>
                                <p className="text-white/85 text-sm font-semibold leading-relaxed">
                                    Your first session, one-on-one with the Head Coach — the player
                                    assessed, their coach assigned, their nights locked in.
                                </p>
                            </div>
                        </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                        {ALEX_RECORD.map((group) => (
                            <div key={group.heading}>
                                <h3 className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6">
                                    {group.heading}
                                </h3>
                                <div className="space-y-6">
                                    {group.items.map((item) => (
                                        <div key={item.title} className="border-t-2 border-slate-200 pt-4">
                                            <p className="text-[15px] font-black text-rr-dark uppercase tracking-tight leading-snug mb-1.5">
                                                {item.title}
                                            </p>
                                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">
                                                {item.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

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
