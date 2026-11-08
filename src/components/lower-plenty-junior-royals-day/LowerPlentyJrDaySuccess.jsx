import React, { useEffect, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, CalendarDays, MapPin, UserPlus, ArrowRight } from 'lucide-react';
import LPMap from './LPMap';
import { fadeUp } from '../performance-squads/shared';
import { pixelTrack } from '../../lib/metaPixel';
import {
    ROUTE, FORM_ANCHOR, SUCCESS, VENUE, ADDRESS_LINE, DATE_FULL, TIME, STORE, CONTACT_EMAIL, LOGOS, CLUB,
    PRICE, PROGRAM_NAME, CANCELLED,
} from './lpJrDayData';

// /lower-plenty-junior-royals-day/success — where Stripe sends a parent after
// paying the $10 (the Payment Link's after-payment redirect adds
// ?session_id={CHECKOUT_SESSION_ID}). It writes nothing: the webhook marks the
// registration paid. Without a Stripe session id it refuses to say "payment
// received" and sends the visitor to the page. The player's first name comes
// from this browser's session storage, never the URL.

const readDone = () => {
    try { return window.sessionStorage.getItem(STORE.done) || ''; } catch { return ''; }
};

const LowerPlentyJrDaySuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get('session_id') || '';
    const paid = sessionId.startsWith('cs_');
    const [name] = useState(readDone);

    useEffect(() => {
        // Cancelled 23 Oct 2026: a payment that is being refunded is not a Purchase.
        if (!paid || CANCELLED) return;
        // This payment is done: stop offering "Pay $10 now" for it.
        try { window.sessionStorage.removeItem(STORE.pending); } catch { /* ignore */ }
        // Meta Pixel Purchase, once per Stripe session. No personal data.
        const key = `px_purchase_${sessionId}`;
        try {
            if (!window.sessionStorage.getItem(key)) {
                window.sessionStorage.setItem(key, '1');
                {
                    pixelTrack('Purchase', { content_name: PROGRAM_NAME, value: PRICE, currency: 'AUD' }, { eventID: sessionId });
                }
            }
        } catch { /* never block the page on tracking */ }
    }, [paid, sessionId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Payment Received | Junior Royals Are Coming to Lower Plenty";
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    // Cancelled 23 Oct 2026: never say "place booked". Anyone who lands here reads the
    // cancelled notice instead, which says paid players are refunded.
    if (!paid || CANCELLED) return <Navigate to={ROUTE} replace />;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans px-5 py-14 sm:py-20">
            <div className="max-w-xl mx-auto">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center">
                    <CheckCircle2 className="w-14 h-14 text-rr-pink mx-auto mb-5" strokeWidth={1.75} />
                    <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-3">{SUCCESS.eyebrow}</p>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4">{SUCCESS.title}</h1>
                    <p className="text-rr-charcoal text-base sm:text-lg font-medium leading-relaxed">{SUCCESS.lead(name)}</p>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.1} className="mt-10 border-t border-slate-200 pt-8">
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CalendarDays className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-rr-dark text-[15px] font-semibold leading-relaxed">{DATE_FULL}, {TIME}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                            <span className="text-rr-dark text-[15px] font-semibold leading-relaxed">
                                {CLUB}, {VENUE.ground}<br />
                                <span className="font-medium text-rr-charcoal">{ADDRESS_LINE}</span>
                            </span>
                        </li>
                    </ul>
                    <div className="mt-6"><LPMap compact /></div>

                    <h2 className="text-lg font-black uppercase mt-10 mb-4">Before Sunday</h2>
                    <ul className="space-y-3">
                        {SUCCESS.next.map((line) => (
                            <li key={line} className="flex items-start gap-3">
                                <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                <span className="text-rr-charcoal text-[15px] font-medium leading-relaxed">{line}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.2} className="mt-10 border-t border-slate-200 pt-8 text-center">
                    <Link
                        to={`${ROUTE}#${FORM_ANCHOR}`}
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" /> {SUCCESS.another}
                    </Link>
                    <p className="text-rr-charcoal text-sm font-medium leading-relaxed mt-6">
                        Can&apos;t come any more? Email{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-rr-pink underline">{CONTACT_EMAIL}</a>{' '}
                        so we can offer the place to another player.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <img src={LOGOS.club} alt={`${CLUB} logo`} className="h-14 w-auto" />
                        <Link to="/" className="inline-flex items-center gap-2 text-rr-charcoal hover:text-rr-pink text-sm font-bold uppercase tracking-wider">
                            Rajasthan Royals Academy Melbourne <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LowerPlentyJrDaySuccess;
