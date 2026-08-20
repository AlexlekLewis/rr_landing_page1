import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { fadeUp, scrollTo, SectionHeading } from './shared';
import { PAYMENT_OPTIONS, FINANCIAL_CONDITION } from './data';

// What every squad place includes — DRAFT copy for Andy's review.
const INCLUDED = [
    'A place in your centre’s Performance Squad',
    'Weekly training with your squad led by your Head Coach',
    'Selection for Power League rounds, Sept 2026 – April 2027',
    'Selection for fixtures against external opposition',
    'Rajasthan Royals Academy First XI selection pathway',
    'Ongoing performance feedback from your coaching staff',
    'Royals Group global performance opportunities (High Performance Centre/Training Partners)',
];

const PricingSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Fees"
                title="What It Costs"
                sub="Performance Squads run on three fees — a trial fee, match fees, and an ongoing annual fee."
            />
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
                {PAYMENT_OPTIONS.map((o, i) => (
                    <motion.div
                        key={o.key}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={i * 0.1}
                        className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center flex flex-col"
                    >
                        <h3 className="text-sm font-black uppercase tracking-wider text-white/70 mb-3">
                            {o.label}
                        </h3>
                        <p className={`font-black text-rr-light-pink mb-4 ${o.price.startsWith('$') ? 'text-4xl' : 'text-2xl'}`}>
                            {o.price}
                        </p>
                        <p className="text-white/60 text-sm font-medium leading-relaxed">{o.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="text-center text-white/70 text-sm sm:text-[15px] font-bold max-w-2xl mx-auto mb-12"
            >
                <span className="text-rr-light-pink">{FINANCIAL_CONDITION}</span>
            </motion.p>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10 max-w-3xl mx-auto"
            >
                <h3 className="text-2xl font-black uppercase mb-6 text-center">What’s Included</h3>
                <ul className="space-y-3 mb-8">
                    {INCLUDED.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-white/75 text-[15px] font-medium leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-center">
                    <button
                        onClick={() => scrollTo('registration-form')}
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        Register Your Interest <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    </section>
);

export default PricingSection;
