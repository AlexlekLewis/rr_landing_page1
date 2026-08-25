import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, X } from 'lucide-react';
import {
    TRIAL_PRICE,
    REGISTRATION_WEEKLY_PRICE,
    REGISTRATION_UPFRONT_PRICE,
    getTrialSessions,
    resolvePaymentLink,
    getSignupType,
    ACTIVE_CENTRES,
} from './data';

// Single confirmation + payment step for the whole flow. Registration writes
// to Supabase, then this opens immediately with the right payment for whatever
// the player chose in the "What are you signing up for?" dropdown — trial
// (per session), weekly registration, or upfront registration.
const PaymentModal = ({ open, registration, onClose }) => {
    const closeRef = useRef(null);
    const panelRef = useRef(null);

    const centre = registration?.centre;
    const signup = getSignupType(registration?.signupType) || getSignupType('trial');
    const sessionIds = registration?.sessionIds || [];
    const sessions = sessionIds.length;

    const centreName = ACTIVE_CENTRES.find((c) => c.slug === centre)?.name || '';
    const sessionLabels = getTrialSessions(centre)
        .filter((s) => sessionIds.includes(s.id))
        .map((s) => s.label);

    // Work out what's being charged, and the link, per signup type.
    const isTrial = signup.key === 'trial';
    let amountLabel = '';
    let lineItems = [];
    if (isTrial) {
        amountLabel = `$${TRIAL_PRICE * sessions}`;
        lineItems = sessionLabels;
    } else if (signup.key === 'registration_weekly') {
        amountLabel = `$${REGISTRATION_WEEKLY_PRICE} / week`;
        lineItems = ['Weekly squad registration', 'Charged by subscription across the season'];
    } else if (signup.key === 'registration_upfront') {
        amountLabel = REGISTRATION_UPFRONT_PRICE ? `$${REGISTRATION_UPFRONT_PRICE}` : 'Discounted rate';
        lineItems = ['Full-season squad registration', 'One discounted upfront payment'];
    }

    const payLink = resolvePaymentLink(centre, signup.linkKey, sessions || 1);
    const needsPayment = isTrial ? sessions > 0 : true;

    // Lock scroll, trap focus, wire Esc.
    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        const lastFocused = document.activeElement;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();

        const onKey = (e) => {
            if (e.key === 'Escape') { onClose?.(); return; }
            if (e.key !== 'Tab') return;
            const nodes = panelRef.current?.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            if (!nodes?.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            lastFocused?.focus?.();
        };
    }, [open, onClose]);

    const ctaText = signup.key === 'registration_weekly'
        ? 'Start Weekly Payment'
        : `Pay ${amountLabel} Now`;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5"
                >
                    <div className="absolute inset-0 bg-rr-dark/85 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ps-pay-title"
                        initial={{ y: 40, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="relative w-full sm:max-w-lg bg-rr-dark border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 sm:p-9 max-h-[92svh] overflow-y-auto"
                    >
                        <button
                            ref={closeRef}
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-white/70" />
                        </button>

                        <div className="w-12 h-12 rounded-full bg-rr-pink flex items-center justify-center mb-5">
                            <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>

                        <h3 id="ps-pay-title" className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-2">
                            {needsPayment ? 'Registration Received' : "You're Registered"}
                        </h3>

                        {needsPayment ? (
                            <>
                                <p className="text-white/65 text-[15px] font-medium leading-relaxed mb-6">
                                    {isTrial
                                        ? "Last step — secure your trial spot by paying now. Your place isn't confirmed until payment is received."
                                        : 'Last step — complete your Registration Fee below to confirm your squad place.'}
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-3">
                                        {centreName} · {signup.short}
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                        {lineItems.map((l) => (
                                            <li key={l} className="flex items-start gap-2.5">
                                                <Check className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                                <span className="text-white/80 text-sm font-medium">{l}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <span className="text-sm font-bold uppercase tracking-wider text-white/70">
                                            {isTrial
                                                ? `${sessions} session${sessions > 1 ? 's' : ''} × $${TRIAL_PRICE}`
                                                : 'Total'}
                                        </span>
                                        <span className="text-2xl font-black text-rr-light-pink">{amountLabel}</span>
                                    </div>
                                </div>

                                {/* ── DO NOT PUT target="_blank" BACK ON THIS LINK ──
                                    Most of this page's traffic arrives from Instagram, and the
                                    Instagram in-app browser silently refuses to open a new tab:
                                    the player taps Pay and nothing happens at all. Between 21-24
                                    Aug 2026, every registration that came from Instagram (3 of 3)
                                    paid nothing, while direct traffic paid 13 of 20.

                                    It also used to close the modal on tap, so after the dead tap
                                    the button itself vanished. Both are gone: this navigates in
                                    the SAME tab and leaves the modal alone. Nothing is lost by
                                    leaving the page — the registration row is already saved. ── */}
                                {payLink ? (
                                    <a
                                        href={payLink}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                                    >
                                        <CreditCard className="w-4 h-4" /> {ctaText}
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white/40 font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 cursor-not-allowed"
                                    >
                                        <CreditCard className="w-4 h-4" /> Payment link coming soon
                                    </button>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full text-white/45 hover:text-white/70 text-xs font-bold uppercase tracking-wider mt-4 py-2 transition-colors"
                                >
                                    I'll pay later
                                </button>
                                <p className="text-white/35 text-xs font-medium text-center mt-2">
                                    Payments are processed securely by Stripe. If you close this,
                                    use the <span className="text-white/60">Complete Payment</span> button
                                    on the form to come back to it.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-white/65 text-[15px] font-medium leading-relaxed mb-6">
                                    Thanks — we've got your details. Our team will be in touch with your
                                    next steps.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                                >
                                    Done
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
