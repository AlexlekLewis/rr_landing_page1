import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { PENDING_KEY } from './JRT3RegistrationForm';
import { JR_T4, PAY_OPTIONS } from './jrTerm4Data';

// /junior-royals/success — where Stripe sends a family after paying for Term 4
// (each Payment Link's after-payment redirect must be
// https://rramelbourne.com/junior-royals/success?session_id={CHECKOUT_SESSION_ID}).
// It writes nothing: api/stripe-webhook.js marks the entry paid. Without a
// Stripe session id it never says "payment received" and sends the visitor to
// the page. Player and centre come from this browser's session storage, never
// the URL. noindex: a confirmation page has no business in search results.
const readPending = () => {
    try { return JSON.parse(window.sessionStorage.getItem(PENDING_KEY) || 'null'); } catch { return null; }
};

const JRT3Success = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const sessionId = params.get('session_id') || '';
    const paid = sessionId.startsWith('cs_');
    const [booking] = useState(readPending);
    const centre = JR_T4.centres.find((c) => c.value === booking?.centre) || null;

    useEffect(() => {
        if (!paid) return;
        // This booking is paid: stop offering "Pay now" for it.
        try { window.sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
        // Meta Pixel Purchase, once per Stripe session. No personal data.
        const key = `px_purchase_${sessionId}`;
        try {
            if (!window.sessionStorage.getItem(key)) {
                window.sessionStorage.setItem(key, '1');
                if (typeof window.fbq === 'function') {
                    const option = PAY_OPTIONS[booking?.option] ? booking.option : 'upfront';
                    window.fbq('track', 'Purchase', { content_name: `Junior Royals Term 4 (${option})`, value: PAY_OPTIONS[option].value, currency: 'AUD' }, { eventID: sessionId });
                }
            }
        } catch { /* never block the page on tracking */ }
    }, [paid, sessionId, booking]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Payment Received | Junior Royals Term 4 | Rajasthan Royals Academy Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    if (!paid) return <Navigate to="/junior-royals" replace />;

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } }),
    };
    const card = 'bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left';

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">
            <div className="relative z-10 max-w-2xl w-full mx-auto text-center">
                <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-10">
                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-16 md:h-20 mx-auto brightness-0 invert" />
                </motion.div>

                <motion.div initial="hidden" animate="visible" custom={0.15} variants={fadeUp} className="mb-4">
                    <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">Junior Royals — {JR_T4.term}</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
                        Payment received. <span className="text-rr-pink">You&apos;re in.</span>
                    </h1>
                </motion.div>

                <motion.p initial="hidden" animate="visible" custom={0.25} variants={fadeUp} className="text-lg md:text-xl font-semibold text-white/90 leading-relaxed my-8">
                    {booking?.player ? `${booking.player}'s place` : 'Your player\'s place'} in Junior Royals, {JR_T4.term}, is booked. Stripe has emailed you a receipt.
                </motion.p>

                <motion.div initial="hidden" animate="visible" custom={0.35} variants={fadeUp} className={card}>
                    <p className="text-sm font-bold text-white/90 mb-2">When and where</p>
                    {centre ? (
                        <p className="text-sm text-white/75 leading-relaxed">
                            <span className="font-bold text-white">{centre.venue}, {centre.address}.</span> {centre.night} {centre.times}, {centre.datesLong} ({JR_T4.weeks} weeks). First session: <span className="font-bold text-white">{centre.firstSessionLong}</span>. {centre.groups}
                        </p>
                    ) : (
                        <p className="text-sm text-white/75 leading-relaxed">
                            {JR_T4.weeks} weeks at the centre you chose, 5:00pm – 7:00pm: Mickleham on {JR_T4.centres[0].night} ({JR_T4.centres[0].datesShort}), Cranbourne North on {JR_T4.centres[1].night} ({JR_T4.centres[1].datesShort}). We confirm your player&apos;s one-hour group by email.
                        </p>
                    )}
                    {booking?.option === 'weekly' && (
                        <p className="text-sm text-white/75 leading-relaxed mt-2">{PAY_OPTIONS.weekly.detail}</p>
                    )}
                </motion.div>

                <motion.div initial="hidden" animate="visible" custom={0.4} variants={fadeUp} className={card}>
                    <p className="text-sm font-bold text-white/90 mb-2">{JR_T4.renewTitle}</p>
                    <ul className="text-sm text-white/75 leading-relaxed space-y-1">
                        {JR_T4.renewLines.map((l) => <li key={l}>• {l}</li>)}
                    </ul>
                </motion.div>

                <motion.div initial="hidden" animate="visible" custom={0.45} variants={fadeUp} className={card}>
                    <p className="text-sm font-bold text-white/90 mb-2">What to bring</p>
                    <ul className="text-sm text-white/70 leading-relaxed space-y-1">
                        <li>• A drink bottle with water</li>
                        <li>• The Junior Royals training shirt (players wear it at every session)</li>
                        <li>• Please arrive <span className="text-white font-bold">10 minutes early</span> for the first session</li>
                    </ul>
                    <p className="text-xs text-white/50 leading-relaxed mt-3">Check your junk, spam and promotions folders for our emails.</p>
                </motion.div>

                <motion.div initial="hidden" animate="visible" custom={0.55} variants={fadeUp} className={`${card} mb-10`}>
                    <p className="text-sm font-bold text-white/90 mb-1">Questions?</p>
                    <p className="text-sm text-white/70 leading-relaxed">
                        Email <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a>. We reply Monday to Friday, 8:30am – 5:30pm.
                    </p>
                </motion.div>

                <motion.div initial="hidden" animate="visible" custom={0.65} variants={fadeUp}>
                    <button onClick={() => navigate('/')}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300">
                        Back to Home
                    </button>
                </motion.div>

                <p className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">HALLA BOL</p>
            </div>
        </div>
    );
};

export default JRT3Success;
