import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check } from 'lucide-react';
import { fadeUp, SectionHeading, Label, Chevron, selectClass } from './shared';
import {
    ACTIVE_CENTRES,
    PAYMENT_OPTIONS,
    TRIAL_PRICE,
    FINANCIAL_CONDITION,
    getTrialSessions,
    getMaxTrialSessions,
    resolvePaymentLink,
} from './data';

// `registration` is the just-submitted form result: { centre, sessionIds }.
// When present, the trial quantity is locked to what the player registered
// for, so the form and the payment can't disagree.
const PaymentsSection = ({ registration }) => {
    const [payCentre, setPayCentre] = useState(ACTIVE_CENTRES[0].slug);
    const [payType, setPayType] = useState('trial');
    const [sessions, setSessions] = useState(1);

    const lockedToRegistration =
        !!registration?.sessionIds?.length && payType === 'trial' && payCentre === registration.centre;

    const maxSessions = getMaxTrialSessions(payCentre);
    const centreSessions = getTrialSessions(payCentre);
    const showSessions = payType === 'trial' && maxSessions > 0;

    // Follow the registration once it lands.
    useEffect(() => {
        if (registration?.centre) {
            setPayCentre(registration.centre);
            setPayType('trial');
            setSessions(registration.sessionIds?.length || 1);
        }
    }, [registration]);

    // Never let a quantity survive a change of centre or payment type.
    useEffect(() => {
        if (!showSessions) setSessions(1);
        else setSessions((n) => Math.min(Math.max(n, 1), maxSessions));
    }, [showSessions, maxSessions, payCentre, payType]);

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

    const registeredLabels = lockedToRegistration
        ? centreSessions.filter((s) => registration.sessionIds.includes(s.id)).map((s) => s.label)
        : [];

    const sc = (key) => selectClass({}, key);

    return (
        <section className="py-20 px-5 bg-white/[0.02]">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow="Already Registered?"
                    title="Make A Payment"
                    sub="Selected players paying their Registration Fee, or a trial fee you didn't pay at registration."
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

                    {/* Locked: quantity mirrors the registration exactly. */}
                    {showSessions && lockedToRegistration && (
                        <div className="mb-6 bg-rr-pink/10 border border-rr-pink/30 rounded-xl p-5">
                            <div className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-black uppercase tracking-wider mb-2">
                                        Matched to your registration
                                    </p>
                                    <ul className="space-y-1 mb-2">
                                        {registeredLabels.map((l) => (
                                            <li key={l} className="text-white/75 text-sm font-medium">{l}</li>
                                        ))}
                                    </ul>
                                    <p className="text-white/45 text-xs font-medium">
                                        ${TRIAL_PRICE} per player, per session. To change this, resubmit the registration form above.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Unlocked: paying without registering in this visit. */}
                    {showSessions && !lockedToRegistration && (
                        <div className="mb-6">
                            <Label required>How many trial sessions?</Label>
                            <div className={`grid gap-3 ${maxSessions === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {Array.from({ length: maxSessions }, (_, i) => i + 1).map((n) => (
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
                                ${TRIAL_PRICE} per player, per session
                                {centreSessions.length > maxSessions
                                    ? ` — up to ${maxSessions} of the ${centreSessions.length} sessions on offer.`
                                    : '.'}
                            </p>
                        </div>
                    )}

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
