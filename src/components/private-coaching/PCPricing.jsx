import React from 'react';
import { motion } from 'framer-motion';
import { PRICING } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const PCPricing = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Pricing</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                        Simple, Up-Front Pricing
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        All prices include GST. Nothing is charged until the Head Coach has confirmed
                        your coach, your times and your plan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRICING.map((p, i) => (
                        <motion.div
                            key={p.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.06 * i }}
                            className={`border border-slate-200 border-t-[3px] rounded-2xl p-6 md:p-7 flex flex-col ${p.accent === 'blue' ? 'border-t-rr-blue bg-slate-50/60' : 'border-t-rr-pink'}`}
                        >
                            <p className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-3 ${p.accent === 'blue' ? 'text-rr-pink' : 'text-rr-blue'}`}>{p.label}</p>
                            <p className="text-4xl font-black text-rr-dark tracking-tight mb-1">
                                {p.price}
                                <span className="text-sm font-bold text-rr-charcoal/70 tracking-normal ml-2">{p.unit}</span>
                            </p>
                            <p className="text-sm text-rr-charcoal font-medium leading-relaxed mt-3">{p.detail}</p>
                        </motion.div>
                    ))}

                    {/* The unlock — 6+ full hours opens the pathway */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="p-[2px] rounded-2xl bg-gradient-to-br from-rr-pink via-rr-pink/80 to-rr-blue"
                    >
                        <div className="bg-rr-dark rounded-[14px] p-6 md:p-7 h-full flex flex-col">
                            <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.18em] mb-3">
                                Book 6+ Full Hours
                            </p>
                            <p className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-4">
                                Unlock The<br />Royals Pathway
                            </p>
                            <ul className="space-y-2.5 mb-5">
                                {['Eligible for Power League selection — T20 matches', 'Eligible for the India Tour — High Performance Centre'].map((t) => (
                                    <li key={t} className="flex items-start gap-2.5">
                                        <span className="w-4 h-4 mt-0.5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-white/85 text-sm font-semibold leading-snug">{t}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => scrollTo('eoi-form')}
                                className="mt-auto self-start text-rr-pink text-xs font-bold uppercase tracking-widest hover:text-rr-light-pink transition-colors"
                            >
                                Register Interest →
                            </button>
                        </div>
                    </motion.div>
                </div>

                <p className="text-center text-rr-charcoal/60 text-xs font-medium mt-10">
                    3-session starter blocks run with academy coaches. Leadership programs are 6+
                    sessions. 30-minute sessions are available to under-14s only.
                </p>
            </div>
        </section>
    );
};

export default PCPricing;
