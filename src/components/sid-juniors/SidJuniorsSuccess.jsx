import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2, CalendarDays, MapPin, Mail, ArrowRight, Navigation, LogIn,
} from 'lucide-react';
import { fadeUp } from '../performance-squads/shared';
import { trackPurchaseOnReturn } from '../../lib/purchaseOnReturn';
import {
    ANY_PAY_TO_BOOK, SESSION_VIEW, getSession, ROUTE, SID_NAME, CONTACT_EMAIL,
} from './sidJuniorsData';

// /sid-juniors/success — where a session's Stripe Payment Link sends a parent
// after paying. Each link's after-payment redirect adds ?session=<key>, so the
// page can show that session; without it, it lists every session that takes
// payment.
//
// While no session has a payment link, nobody can have paid, so the page
// refuses to say "payment received" and sends the visitor to the booking page.
// It does not write to the database: payments are matched to bookings in
// Stripe by the payer's email.

const Content = () => {
    const [params] = useSearchParams();
    const picked = getSession(params.get('session'));
    const shown = picked && picked.payToBook ? [picked] : SESSION_VIEW.filter((s) => s.payToBook);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Payment Received | Junior Sessions with ${SID_NAME}`;
        // Meta Purchase only when Stripe sent the family here (?session_id=…).
        trackPurchaseOnReturn({ program: 'Sid junior session', fallbackValue: (picked || shown[0])?.price });
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center px-6 py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-12%] left-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
                <div className="absolute bottom-[-12%] right-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
            </div>

            <div className="relative z-10 max-w-xl w-full mx-auto">
                <div className="text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <CheckCircle2 className="w-16 h-16 text-rr-pink mx-auto mb-6" strokeWidth={1.75} />
                    </motion.div>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
                        className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4"
                    >
                        Junior Sessions with {SID_NAME}
                    </motion.p>
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
                        className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4"
                    >
                        Payment Received
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
                        className="text-white/70 text-[15px] sm:text-base font-medium leading-relaxed"
                    >
                        Thanks. The payment went through, so the place is booked.
                        {shown.length > 1 && ' It is at the session you chose on the form. Both sessions are below so you can check the time and where to go.'}
                    </motion.p>
                </div>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
                    className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8 mt-10"
                >
                    {shown.map((s) => (
                        <div key={s.key} className="mb-6 pb-6 border-b border-white/10 last:mb-0 last:pb-0 last:border-b-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">{s.centreName}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                    <span className="text-white/75 text-[15px] font-medium leading-relaxed">{s.dateLabel}, {s.timeLabel}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                    <span className="text-white/75 text-[15px] font-medium leading-relaxed">{s.venue}, {s.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <LogIn className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                    <span className="text-white/75 text-[15px] font-medium leading-relaxed">{s.arriveLine}</span>
                                </li>
                            </ul>
                            <a
                                href={s.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-sm font-bold mt-3 underline underline-offset-4"
                            >
                                <Navigation className="w-3.5 h-3.5" /> Get directions
                            </a>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.25}
                    className="text-center mt-10"
                >
                    <p className="text-white/50 text-sm font-medium mb-5">
                        Booking another player, or have a question?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href={ROUTE}
                            className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            Book another player <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <Mail className="w-4 h-4" /> Email us
                        </a>
                    </div>
                    <div className="mt-6">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-rr-light-pink text-sm font-bold uppercase tracking-wider transition-colors"
                        >
                            Back to the Academy <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SidJuniorsSuccess = () => (ANY_PAY_TO_BOOK ? <Content /> : <Navigate to={ROUTE} replace />);

export default SidJuniorsSuccess;
