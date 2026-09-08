import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, X } from 'lucide-react';
import { ACTIVE_MATCH } from './matchConfig';

// Confirmation + payment step. Registration is already written to Supabase by
// the time this opens, so nothing is lost if the player leaves the page.
const MatchPaymentModal = ({ open, registration, onClose }) => {
    const closeRef = useRef(null);
    const panelRef = useRef(null);

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

    const lineItems = [
        ACTIVE_MATCH.datesLabel,
        ACTIVE_MATCH.venue.name,
        '4 games per player across the two days',
    ];

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
                        aria-labelledby="mr-pay-title"
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

                        <h3 id="mr-pay-title" className="text-2xl sm:text-3xl font-black uppercase leading-tight mb-2">
                            Registration Received
                        </h3>

                        <p className="text-white/65 text-[15px] font-medium leading-relaxed mb-6">
                            Last step{registration?.playerName ? `, ${registration.playerName.split(' ')[0]}` : ''} — lock the
                            spot in by paying now. Places are limited and it's first come, first served.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-3">
                                {ACTIVE_MATCH.name}
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
                                <span className="text-sm font-bold uppercase tracking-wider text-white/70">Both days</span>
                                <span className="text-2xl font-black text-rr-light-pink">${ACTIVE_MATCH.price}</span>
                            </div>
                        </div>

                        {/* ── DO NOT PUT target="_blank" BACK ON THIS LINK ──
                            Same reason as the Performance Squads modal: the Instagram
                            in-app browser silently refuses to open a new tab, so the
                            player taps Pay and nothing happens. This navigates in the
                            SAME tab. Nothing is lost by leaving — the registration row
                            is already saved. ── */}
                        <a
                            href={ACTIVE_MATCH.paymentLink}
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" /> Pay ${ACTIVE_MATCH.price} Now
                        </a>

                        <p className="text-white/35 text-xs font-medium text-center mt-4">
                            Payments are processed securely by Stripe. Please pay by{' '}
                            {ACTIVE_MATCH.deadlineLabel}.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MatchPaymentModal;
