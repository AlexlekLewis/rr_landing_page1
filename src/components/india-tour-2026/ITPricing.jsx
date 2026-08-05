import React from 'react';
import { motion } from 'framer-motion';
import { getTiers, fmtAUD, FLIGHT_ESTIMATE_AUD } from './itCopy';

// ---------------------------------------------------------------------------
// India Tour 2026 — what it costs.
//
// Two prices for the SAME camp (confirmed 2026-08-05):
//   • current academy players  $2,100 incl GST
//   • players new to us        $2,700 incl GST
// Both EXCLUDE flights, which are booked through an RRA group booking link.
//
// All wording lives in itCopy.js in two reading levels; prices live there once
// and are shared with the hero and the form.
// ---------------------------------------------------------------------------

const ITPricing = ({ copy }) => {
    const c = copy.pricing;
    const tiers = getTiers(copy);
    const steps = c.steps;

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Heading */}
                <div className="max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        {c.eyebrow}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5"
                    >
                        {c.heading} <span className="text-rr-pink">{c.headingAccent}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                    >
                        {c.intro} <strong className="text-rr-dark">{c.introEmphasis}</strong> {c.introTail}
                    </motion.p>
                </div>

                {/* The two tiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {tiers.map((t, i) => (
                        <motion.div
                            key={t.key}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col"
                        >
                            <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.2em]">
                                {t.eyebrow}
                            </p>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mt-2">
                                {t.heading}
                            </h3>

                            <div className="mt-6 pb-6 border-b border-slate-100">
                                <p className="text-5xl font-black text-rr-dark leading-none">{fmtAUD(t.price)}</p>
                                <p className="text-sm font-bold text-rr-charcoal mt-2">{c.perPlayer}</p>
                                <p className="text-sm text-rr-charcoal/70 font-medium mt-1">{c.priceNote}</p>
                            </div>

                            <p className="text-xs font-black text-rr-dark uppercase tracking-widest mt-6 mb-2">
                                {c.thisIsYou}
                            </p>
                            <p className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed flex-1">
                                {t.who}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-sm text-rr-charcoal font-medium mt-6"
                >
                    {c.notSure}
                </motion.p>

                {/* Flights */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-rr-dark rounded-2xl p-8 md:p-10"
                >
                    <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.2em]">
                        {c.flightsEyebrow}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mt-2">
                        {c.flightsHeading}
                    </h3>
                    <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                        <strong className="text-white">{copy.hero.flightsLead}</strong> {c.flightsBody1}
                    </p>
                    <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                        {FLIGHT_ESTIMATE_AUD ? c.flightsBody2Known(FLIGHT_ESTIMATE_AUD) : c.flightsBody2Unknown}
                    </p>
                    <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                        {c.flightsBody3}
                    </p>
                </motion.div>

                {/* What's in / what's out */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl border border-slate-200 p-8"
                    >
                        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                            {c.includedHeading}
                        </h3>
                        <p className="text-sm text-rr-charcoal/70 font-medium mt-2 mb-6">{c.includedNote}</p>
                        <div className="space-y-5">
                            {c.included.map((item) => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <span className="mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-black text-rr-dark uppercase tracking-wide">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed mt-1">
                                            {item.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="bg-white rounded-2xl border border-slate-200 p-8"
                        >
                            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                                {c.notIncludedHeading}
                            </h3>
                            <p className="text-sm text-rr-charcoal/70 font-medium mt-2 mb-6">
                                {c.notIncludedNote}
                            </p>
                            <ul className="space-y-3">
                                {c.notIncluded.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rr-charcoal/40 shrink-0" />
                                        <span className="text-sm text-rr-charcoal font-medium leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.16 }}
                            className="bg-white rounded-2xl border border-slate-200 p-8"
                        >
                            <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                                {c.howHeading}
                            </h3>
                            <ol className="mt-5 space-y-4">
                                {steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="w-7 h-7 rounded-full bg-rr-pink text-white text-xs font-black flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-rr-charcoal font-medium leading-relaxed pt-1">
                                            {step}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ITPricing;
