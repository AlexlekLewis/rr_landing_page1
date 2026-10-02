import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { fadeUp, scrollTo, SectionHeading } from './shared';
import {
    TRIAL_PRICE,
    MEMBERSHIP,
    MEMBERSHIP_YEARLY,
    MEMBER_PRICING_ON,
    MEMBER_PRICING_RULE,
    TERMS_ROUTE,
    TERMS_MEMBERSHIP_CLAUSE,
    GRACE_PERIOD,
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
        unit: 'per session',
        body: 'To be assessed at a trial. Nothing more to pay unless you are offered a squad place.',
    },
    {
        n: '02',
        label: 'Joining fee',
        price: money(MEMBERSHIP.joiningFee),
        unit: 'one-off',
        body: 'Paid once, when you accept your squad place. Non-refundable.',
    },
    {
        n: '03',
        label: 'Membership',
        price: money(MEMBERSHIP.weeklyFee),
        unit: 'a week',
        body: `Your ${money(MEMBERSHIP_YEARLY)} yearly membership, charged weekly in advance. Cancel any time.`,
    },
];

const MembershipSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Membership"
                title="How Membership Works"
                sub="Performance Squads run on a yearly membership. You pay it weekly, and you can cancel any time."
            />

            {/* The statement Alex wants read before anything else on fees. */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-pink/25 via-rr-navy to-rr-dark border border-rr-pink/50 rounded-2xl p-6 sm:p-10 mb-6">
                <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-4">
                    A yearly membership, paid weekly
                </h3>
                <p className="text-white/85 text-base sm:text-lg font-medium leading-relaxed mb-6">
                    Your Performance Squad membership is a yearly fee of{' '}
                    <span className="text-white font-black">{money(MEMBERSHIP_YEARLY)}</span>. For your convenience,
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
            <div className="grid sm:grid-cols-3 gap-5 mb-6">
                {FEES.map((f, i) => (
                    <motion.div key={f.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08}
                        className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col">
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

            {/* The conditions, in one place. */}
            <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 mb-6">
                {[
                    'Match fees are separate. They are set for each match, depending on whether it is played on turf or synthetic.',
                    `If payments stop without notice, there is a ${GRACE_PERIOD} grace period before your squad place is released.`,
                    'You must stay financial to receive member benefits and to be selected for matches.',
                ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-rr-pink shrink-0 mt-1" strokeWidth={3} />
                        <span className="text-white/75 text-[15px] font-medium leading-relaxed">{line}</span>
                    </li>
                ))}
            </motion.ul>

            {/* Member pricing. */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-10">
                <h3 className="text-lg font-black uppercase mb-1.5">Member pricing</h3>
                <p className="text-white/65 text-sm font-medium leading-relaxed mb-4">
                    Financial members pay member prices on our other programs, including:
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                    {MEMBER_PRICING_ON.map((p) => (
                        <span key={p} className="text-xs sm:text-sm font-bold text-white bg-rr-pink/15 border border-rr-pink/30 rounded-full px-3.5 py-1.5">
                            {p}
                        </span>
                    ))}
                </div>
                {/* Two tiers: programs while active, tours after the minimum period. */}
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {MEMBER_PRICING_RULE}{' '}
                    <a href={TERMS_ROUTE} className="text-rr-light-pink underline underline-offset-2 hover:text-white">
                        See {TERMS_MEMBERSHIP_CLAUSE} of our Terms &amp; Conditions.
                    </a>
                </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => scrollTo('trials')}
                    className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors">
                    See Trial Dates <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => scrollTo('register-pay')}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors">
                    Register Your Interest
                </button>
            </div>
        </div>
    </section>
);

export default MembershipSection;
