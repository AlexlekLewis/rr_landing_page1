import React from 'react';
import { motion } from 'framer-motion';
import { CENTRE } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Four steps, written so a parent who has never spoken to us knows exactly what
// happens next and what it costs at each stage.
const STEPS = [
    {
        n: '01',
        title: 'Register your interest',
        body: 'Fill in the short form at the bottom of this page — player name, age, contact details and whether Tuesday or Friday suits you. It takes about two minutes and you pay nothing at this stage.',
    },
    {
        n: '02',
        title: 'Our admin team books your time',
        body: 'Someone from the Academy’s administration team contacts you within a few days to organise a time for your first session. They will confirm the night, the start time and what to bring — you do not need to chase anyone.',
    },
    {
        n: '03',
        title: 'The assessment session — $50',
        body: 'Every player starts with a one-hour session with Alex at Mickleham. He watches them bat or bowl, works out what will actually move their game forward, and writes it down as a plan you keep. Right now that session is $50 instead of the usual $160.',
    },
    {
        n: '04',
        title: 'Alex assigns your coach, then your block starts',
        body: 'Off the back of that session Alex matches the player to the coach who best suits how they play and what they need next — you do not pick a name off a list, and you are not simply given whoever is free. From there you book a block of sessions (three at the least) on your night.',
    },
];

const PCHowItWorks = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">How It Works</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                        Four steps, start to first session
                    </h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">
                        Private coaching at {CENTRE.name} runs on Tuesday and Friday evenings. Here is
                        exactly what happens from the moment you register to the moment your player is
                        in a lane.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-14">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            className="border-t-2 border-slate-200 pt-4"
                        >
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-sm font-black text-rr-pink">{s.n}</span>
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-tight leading-tight">
                                    {s.title}
                                </h3>
                            </div>
                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">
                                {s.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* The triage promise — the thing that separates this from booking a net. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="border-l-4 border-rr-pink pl-6 md:pl-8 max-w-3xl"
                >
                    <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-tight leading-tight mb-4">
                        Every player is placed by the Head Coach
                    </h3>
                    <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                        Alex Lewis assesses every single player who comes through private coaching at
                        Mickleham, and he decides which coach they train with. A young batter who needs
                        to learn to score square of the wicket does not need the same coach as a
                        seventeen-year-old quick chasing another yard of pace.
                    </p>
                    <p className="text-rr-charcoal font-medium leading-relaxed">
                        That is the difference between hiring a net and joining a program: the match
                        between player and coach is a coaching decision, made by the Head Coach, and
                        reviewed as the player develops. If the fit is not right, Alex moves them.
                    </p>
                    <button
                        onClick={() => scrollTo('pricing')}
                        className="mt-7 group inline-flex items-center gap-2.5 text-rr-pink hover:text-rr-dark font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                        See what it costs
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default PCHowItWorks;
