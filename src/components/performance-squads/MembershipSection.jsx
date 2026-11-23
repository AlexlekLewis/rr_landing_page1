import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { fadeUp, scrollTo, SectionHeading } from './shared';
import {
    TRIAL_PRICE,
    MEMBERSHIP,
    MEMBERSHIP_YEARLY,
    MEMBER_PRICING_RULE,
    TERMS_ROUTE,
    TERMS_MEMBERSHIP_CLAUSE,
    money,
} from './data';

// ─────────────────────────────────────────────────────────────
// MEMBERSHIP — /performance-squads only. Replaces the old two-stage fees
// section here, which still said "Registration Fee — TBC".
//
// Alex, 2 October 2026: say it plainly. The membership is a YEARLY fee, broken
// down for the family's convenience into a weekly payment. It can be cancelled
// any time — but cancelling means the joining fee is paid again to come back.
// Every figure comes from MEMBERSHIP in ./data.js.
// ─────────────────────────────────────────────────────────────

const FEES = [
    {
        n: '01',
        label: 'Trial fee',
        price: money(TRIAL_PRICE),
        unit: 'per session, incl. GST',
        body: 'To be assessed at a trial. Nothing more to pay unless you are offered a squad place.',
    },
    {
        n: '02',
        label: 'Joining fee',
        price: money(MEMBERSHIP.joiningFee),
        unit: 'one-off, incl. GST',
        body: 'Paid once, when you accept your squad place. Non-refundable.',
    },
    {
        n: '03',
        label: 'Membership',
        price: money(MEMBERSHIP.weeklyFee),
        unit: 'a week, incl. GST',
        body: `Your ${money(MEMBERSHIP_YEARLY)} yearly membership, charged weekly in advance. Cancel any time.`,
    },
];

const MembershipSection = () => (
    <section className="py-14 sm:py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Membership"
                title="How Membership Works"
                sub="Performance Squads run on a yearly membership. You pay it weekly, and you can cancel any time."
            />

            {/* The statement Alex wants read before anything else on fees. */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-pink/25 via-rr-navy to-rr-dark border border-rr-pink/50 rounded-2xl p-6 sm:p-9 mb-5">
                <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-4">
                    A yearly membership, paid weekly
                </h3>
                <p className="text-white/85 text-base sm:text-lg font-medium leading-relaxed mb-6">
                    Your Performance Squad membership is a yearly fee of{' '}
                    <span className="text-white font-black">{money(MEMBERSHIP_YEARLY)}</span> (incl. GST). For your convenience,
                    it is broken down into weekly payments of{' '}
                    <span className="text-white font-black">{money(MEMBERSHIP.weeklyFee)}</span>.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3.5">
                        <Check className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" strokeWidth={3} />
                        <p className="text-white text-[15px] font-bold leading-snug">You can cancel any time.</p>
                    </div>
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3.5">
                        <AlertCircle className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" />
                        <p className="text-white text-[15px] font-bold leading-snug">
                            If you cancel and later rejoin, you pay the {money(MEMBERSHIP.joiningFee)} joining fee again.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* What is paid, and when. */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {FEES.map((f, i) => (
                    <motion.div key={f.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                        <div className="flex items-baseline justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rr-light-pink">{f.label}</span>
                            <span className="text-2xl font-black text-rr-pink/30 leading-none">{f.n}</span>
                        </div>
                        <p className="mb-3">
                            <span className="text-4xl font-black">{f.price}</span>
                            <span className="text-white/55 text-sm font-bold ml-2">{f.unit}</span>
                        </p>
                        <p className="text-white/65 text-sm font-medium leading-relaxed">{f.body}</p>
                    </motion.div>
                ))}
            </div>

            {/* The conditions (grace period, match fees, staying financial) and
                member pricing moved to the FAQ on 22 Nov 2026 to shorten the page.
                Only the line every family must see before joining stays here. */}
            <p className="text-center text-white/60 text-sm font-medium leading-relaxed mb-8">
                All prices include GST. Match fees are separate and set for each match.{' '}
                {MEMBER_PRICING_RULE.split('.')[0]}.{' '}
                <a href={TERMS_ROUTE} className="text-rr-light-pink underline underline-offset-2 hover:text-white">
                    Full terms: {TERMS_MEMBERSHIP_CLAUSE} of our Terms &amp; Conditions.
                </a>
            </p>

            <div className="flex justify-center">
                <button onClick={() => scrollTo('register-pay')}
                    className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors">
                    Register Your Interest <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </section>
);

export default MembershipSection;
