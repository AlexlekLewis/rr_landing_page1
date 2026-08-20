import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { fadeUp, SectionHeading, Label, Chevron, selectClass } from './shared';
import {
    ACTIVE_CENTRES,
    PAYMENT_OPTIONS,
    TRIAL_PRICE,
    TRIAL_SESSION_CENTRES,
    FINANCIAL_CONDITION,
    resolvePaymentLink,
} from './data';

const PaymentsSection = () => {
    const [payCentre, setPayCentre] = useState(ACTIVE_CENTRES[0].slug);
    const [payType, setPayType] = useState('trial');
    const [sessions, setSessions] = useState(1);

    // Session options only apply to trials, and only at centres that run
    // multiple trial sessions (currently Cranbourne North).
    const sessionOptions = TRIAL_SESSION_CENTRES[payCentre] || null;
    const showSessions = payType === 'trial' && !!sessionOptions;

    // Reset the count whenever session choice stops being relevant, so a
    // stale quantity can't leak into another centre or payment type.
    useEffect(() => {
        if (!showSessions) setSessions(1);
    }, [showSessions, payCentre, payType]);

    const payLink = resolvePaymentLink(payCentre, payType, sessions);
    const payOption = useMemo(() => PAYMENT_OPTIONS.find((o) => o.key === payType), [payType]);
    const payCentreName = useMemo(
        () => ACTIVE_CENTRES.find((c) => c.slug === payCentre)?.name,
        [payCentre],
    );

    const displayPrice = showSessions ? `$${TRIAL_PRICE * sessions}` : payOption.price;
    const displayLabel = showSessions
        ? `${payOption.label} — ${sessions} session${sessions > 1 ? 's' : ''}`
        : payOption.label;

    const sc = (key) => selectClass({}, key);

    return (
        <section className="py-20 px-5 bg-white/[0.02]">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow="Step 2"
                    title="Payments"
                    sub="Choose your centre and what you're paying for — trial fees, match fees, or your annual fee."
                />
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label required>Centre</Label>
                            <div className="relative">
                                <select value={payCentre} onChange={(e) => setPayCentre(e.target.value)} className={sc('pay_centre')}>
                                    {ACTIVE_CENTRES.map((c) => (
                                        <option key={c.slug} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                        </div>
                        <div>
                            <Label required>Payment Type</Label>
                            <div className="relative">
                                <select value={payType} onChange={(e) => setPayType(e.target.value)} className={sc('pay_type')}>
                                    {PAYMENT_OPTIONS.map((o) => (
                                        <option key={o.key} value={o.key}>{o.label}</option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                        </div>
                    </div>

                    {showSessions && (
                        <div className="mb-6">
                            <Label required>How many trial sessions?</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {sessionOptions.map((n) => (
                                    <button
                                        type="button"
                                        key={n}
                                        onClick={() => setSessions(n)}
                                        aria-pressed={sessions === n}
                                        className={`rounded-xl px-4 py-3.5 border transition-colors ${sessions === n
                                            ? 'bg-rr-pink border-rr-pink text-white'
                                            : 'bg-white/5 border-white/15 text-white/60 hover:border-rr-pink/50'}`}
                                    >
                                        <span className="block text-lg font-black leading-none">{n}</span>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider mt-1">
                                            {n > 1 ? 'Sessions' : 'Session'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-white/45 text-xs font-medium mt-2.5">
                                ${TRIAL_PRICE} per player, per session.
                            </p>
                        </div>
                    )}
                    {!showSessions && <div className="mb-2" />}

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between gap-4 mb-1.5">
                            <span className="text-sm font-black uppercase tracking-wider">{payCentreName} — {displayLabel}</span>
                            <span className="text-rr-light-pink font-black text-lg shrink-0">{displayPrice}</span>
                        </div>
                        <p className="text-white/55 text-xs font-medium leading-relaxed">{payOption.desc}</p>
                    </div>

                    {payLink ? (
                        <a
                            href={payLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" /> Pay Securely with Stripe
                        </a>
                    ) : (
                        <button
                            disabled
                            className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white/40 font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 cursor-not-allowed"
                        >
                            <CreditCard className="w-4 h-4" /> Payment link coming soon
                        </button>
                    )}
                    <p className="text-white/40 text-xs font-medium text-center mt-4">
                        Payments are processed securely by Stripe. Register first if you haven't already.
                        {' '}{FINANCIAL_CONDITION}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default PaymentsSection;
