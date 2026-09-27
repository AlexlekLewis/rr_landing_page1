import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2, CalendarDays, MapPin, Mail, ArrowRight, Navigation, LogIn, UserCheck, HardHat, GlassWater,
} from 'lucide-react';
import { fadeUp } from '../performance-squads/shared';
import {
    PAY_TO_BOOK, ROUTE, SESSION, MAPS_URL, SID_NAME, SID_CAVEAT, CONTACT_EMAIL, ON_THE_DAY,
} from './sidJuniorsData';

// /sid-juniors/success — where the Stripe Payment Link sends a parent after
// paying (its after-payment redirect must point here; see sidJuniorsData.js).
//
// While there is no payment link, nobody can have paid, so the page refuses
// to say "payment received" and sends the visitor to the booking page.
//
// Like the match registration success page, it does not write to the
// database: anon has no UPDATE on the table, on purpose. Payments are matched
// to bookings in Stripe by the payer's email.
const Content = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Payment Received | Junior Session with ${SID_NAME}`;
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    const dayIcons = { 'sign-in': LogIn, 'pick-up': UserCheck, helmet: HardHat, water: GlassWater };
    const details = [
        { icon: CalendarDays, text: `${SESSION.dateLabel}, ${SESSION.timeLabel}` },
        { icon: MapPin, text: `${SESSION.venue}, ${SESSION.address}` },
        // Sign-in (once confirmed), pick-up, helmet and water: the same lines as the page.
        ...ON_THE_DAY.map(({ key, text }) => ({ icon: dayIcons[key] || UserCheck, text })),
    ];

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
                        Junior Session with {SID_NAME}
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
                    </motion.p>
                </div>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
                    className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8 mt-10"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">The Session</p>
                    <ul className="space-y-4">
                        {details.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                <span className="text-white/75 text-[15px] font-medium leading-relaxed">{text}</span>
                            </li>
                        ))}
                    </ul>
                    <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-sm font-bold mt-4 underline underline-offset-4"
                    >
                        <Navigation className="w-3.5 h-3.5" /> Get directions
                    </a>
                    <p className="text-white/55 text-sm font-medium leading-relaxed mt-5 pt-5 border-t border-white/10">
                        {SID_CAVEAT}
                    </p>
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

const SidJuniorsSuccess = () => (PAY_TO_BOOK ? <Content /> : <Navigate to={ROUTE} replace />);

export default SidJuniorsSuccess;
