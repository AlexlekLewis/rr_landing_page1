import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Wallet } from 'lucide-react';
import { fadeUp, scrollTo, SectionHeading } from './shared';
import {
    TRIAL_PRICE,
    REGISTRATION_UPFRONT_PRICE,
    REGISTRATION_UPFRONT_NOTE,
    TRIAL_INCLUDES,
    SELECTED_INCLUDES,
    FINANCIAL_CONDITION,
} from './data';

const PricingSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Fees"
                title="Two Stages of the Process"
                sub="You pay a trial fee to be assessed. If you're selected, you then pay a Registration Fee to take up your squad place."
            />

            {/* Stage 1 — trial */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-9 mb-5"
            >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-rr-pink/30 leading-none">01</span>
                        <div>
                            <h3 className="text-xl font-black uppercase leading-tight">Trial Fee</h3>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-wider mt-0.5">
                                Everyone who trials
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-black text-rr-light-pink leading-none">${TRIAL_PRICE}</span>
                        <span className="block text-white/50 text-xs font-bold uppercase tracking-wider mt-1">
                            Per player, per session
                        </span>
                    </div>
                </div>
                <ul className="space-y-2.5">
                    {TRIAL_INCLUDES.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-white/75 text-[15px] font-medium leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Stage 2 — registration, only if selected */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-rr-pink/30 rounded-2xl p-7 sm:p-9 mb-6"
            >
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-black text-rr-pink/40 leading-none">02</span>
                    <div>
                        <h3 className="text-xl font-black uppercase leading-tight">Registration Fee</h3>
                        <p className="text-rr-light-pink text-xs font-bold uppercase tracking-wider mt-0.5">
                            Only if you're selected
                        </p>
                    </div>
                </div>
                <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">
                    Nothing further to pay unless you're offered a squad place.
                </p>

                <div className="mb-7">
                    <div className="bg-white/5 border border-white/15 rounded-xl p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <Wallet className="w-5 h-5 text-rr-pink" />
                            <span className="text-sm font-black uppercase tracking-wider">One-Off Payment</span>
                        </div>
                        <p className="text-3xl font-black text-rr-light-pink leading-none mb-2">
                            {REGISTRATION_UPFRONT_PRICE ? `$${REGISTRATION_UPFRONT_PRICE}` : 'TBC'}
                        </p>
                        <p className="text-white/55 text-xs font-medium leading-relaxed">
                            One payment for the season, taken up if you're offered a squad place.
                            {REGISTRATION_UPFRONT_PRICE ? '' : ` ${REGISTRATION_UPFRONT_NOTE}`}
                        </p>
                    </div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">
                    What your squad place includes
                </p>
                <ul className="space-y-2.5">
                    {SELECTED_INCLUDES.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-white/75 text-[15px] font-medium leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="text-center text-white/70 text-sm sm:text-[15px] font-bold max-w-2xl mx-auto mb-10"
            >
                <span className="text-rr-light-pink">{FINANCIAL_CONDITION}</span>
            </motion.p>

            <div className="text-center">
                <button
                    onClick={() => scrollTo('register-pay')}
                    className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                >
                    Register For A Trial <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </section>
);

export default PricingSection;
