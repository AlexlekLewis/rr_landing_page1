import React from 'react';
import { motion } from 'framer-motion';
import { INCLUSIONS_CONFIRMED } from './itCopy';
import ITCtaBand from './ITCtaBand';

// ---------------------------------------------------------------------------
// India Tour — what it costs.
//
// The two upcoming tours carry ONE estimated price (Alex, 29 Sep 2026): about
// $7,000–$8,000 per player, per tour of about 10 days. It is an estimate, and
// what it includes is not confirmed yet, so this section says exactly that and
// promises the exact price and inclusions in writing before anyone commits.
//
// The inclusions lists (what the fee covers / what it does not) belong to the
// September 2026 camp. They only render once INCLUSIONS_CONFIRMED is true — see
// the note in itCopy.js before switching it on.
//
// All wording lives in itCopy.js in two reading levels; the tours and the price
// live there once and are shared with the hero and the form.
// ---------------------------------------------------------------------------

const ITPricing = ({ copy }) => {
    const c = copy.pricing;
    const steps = c.steps;

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Heading: the estimate itself, then what it is and is not */}
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
                        {c.intro}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    {/* What the price includes: not confirmed yet, so say so */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-rr-navy rounded-2xl p-8 md:p-10"
                    >
                        <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.2em]">
                            {c.includesEyebrow}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mt-2">
                            {c.includesHeading}
                        </h3>
                        <p className="text-base text-white/80 font-medium leading-relaxed mt-4">
                            {c.includesBody}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
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

                {/* What's in / what's out — only once the new tours' inclusions are confirmed */}
                {INCLUSIONS_CONFIRMED && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="bg-white rounded-2xl border border-slate-200 p-8 self-start"
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
                    </div>
                )}

                <div className="mt-12">
                    <ITCtaBand
                        copy={copy}
                        tone="navy"
                        heading={c.ctaAfterPricingHeading || copy.hero.ctaAfterPricing.heading}
                        body={copy.hero.ctaAfterPricing.body}
                    />
                </div>
            </div>
        </section>
    );
};

export default ITPricing;
