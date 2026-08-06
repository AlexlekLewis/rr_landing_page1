import React from 'react';
import { motion } from 'framer-motion';
import { PRICING, BOOKING_RULES, LAUNCH_OFFER } from './pcOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const PCPricing = () => {
    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">What We Offer &amp; What It Costs</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                        Every option, every price
                    </h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">
                        All prices include GST and cover the coach and the lane — there is nothing to
                        pay at the centre on the night. Every player starts with the assessment session
                        at the top of this list; everything below it is what you can book afterwards,
                        once Alex has assigned your coach.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                    {PRICING.map((p, i) => (
                        <motion.div
                            key={p.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05 }}
                            className={`bg-white rounded-2xl border p-7 flex flex-col ${
                                p.key === 'consult' ? 'border-rr-pink md:col-span-2' : 'border-slate-200'
                            }`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                <h3 className="text-lg md:text-xl font-black text-rr-dark uppercase tracking-tight leading-tight max-w-sm">
                                    {p.label}
                                </h3>
                                <div className="flex items-end gap-2.5 shrink-0">
                                    <span className={`text-3xl font-black tracking-tight leading-none ${p.accent === 'blue' ? 'text-rr-blue' : 'text-rr-pink'}`}>
                                        {p.price}
                                    </span>
                                    {p.wasPrice && (
                                        <span className="text-xl font-bold text-slate-400 line-through leading-none mb-0.5">
                                            {p.wasPrice}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-[11px] font-bold text-rr-charcoal/60 uppercase tracking-widest mb-4">
                                {p.unit}
                            </p>

                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed mb-5">
                                {p.detail}
                            </p>

                            <p className="mt-auto text-sm font-semibold text-rr-dark border-t border-slate-100 pt-4">
                                <span className="text-rr-pink">Minimum booking:</span> {p.minimum}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Launch offer on groups — separate from the $50 assessment offer. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-rr-dark rounded-2xl p-7 md:p-9 mb-12"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">
                        {LAUNCH_OFFER.headline}
                    </p>
                    <p className="text-white/85 font-medium leading-relaxed max-w-3xl">
                        {LAUNCH_OFFER.detail}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {BOOKING_RULES.map((r, i) => (
                        <motion.div
                            key={r.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.06 }}
                            className="border-t-2 border-rr-pink/30 pt-5"
                        >
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-tight leading-tight mb-2.5">
                                {r.title}
                            </h3>
                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">
                                {r.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-rr-charcoal font-medium mb-6 max-w-2xl mx-auto">
                        Nothing is paid online. Register your interest, our administration team will
                        organise your time, and you decide on your block after the assessment session.
                    </p>
                    <button
                        onClick={() => scrollTo('eoi-form')}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Register Your Interest
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default PCPricing;
