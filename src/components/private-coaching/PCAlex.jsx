import React from 'react';
import { motion } from 'framer-motion';
import { CENTRE } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const STEPS = [
    { n: '01', text: 'Register your interest below — two minutes, no payment.' },
    { n: '02', text: 'Alex will be in contact personally in the coming days.' },
    { n: '03', text: 'Your $160 consultation locks in your coach, your nights and your plan.' },
];

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
                            interest below and he'll be in contact <b className="text-rr-dark">personally in the
                            coming days</b> to organise your consultation.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-8">
                            That consultation is where everything gets decided — which coach suits your
                            game, which nights work for your family, and what the journey looks like
                            from there.
                        </p>

                        {/* The one number on the page */}
                        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-rr-pink via-rr-pink/80 to-rr-blue mb-8">
                            <div className="bg-rr-dark rounded-[14px] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <p className="text-4xl font-black text-white tracking-tight shrink-0">$160</p>
                                <p className="text-white/85 text-sm font-semibold leading-relaxed">
                                    One-on-one consultation with the Head Coach — your game assessed,
                                    your coach assigned, your nights locked in.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            {STEPS.map((s) => (
                                <div key={s.n} className="flex items-start gap-4">
                                    <span className="text-sm font-black text-rr-pink/60 mt-0.5">{s.n}</span>
                                    <p className="text-rr-charcoal text-sm font-semibold leading-relaxed">{s.text}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scrollTo('eoi-form')}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3"
                        >
                            Register Your Interest
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PCAlex;
