import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, MapPin, Clock, Shirt, Backpack,
    Trophy, Globe2, Plane, GraduationCap, Mail, ArrowRight,
} from 'lucide-react';
import { ACTIVE_CENTRES } from './data';

// Branded confirmation shown after a trial payment. Reached via each Stripe
// trial link's after_completion redirect, e.g.
//   /performance-squads/success?centre=north-melbourne
// Each link is centre-specific, so the centre comes straight off the URL — no
// Stripe session lookup needed. Falls back to a generic message if absent.
const PerformanceSquadsSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Registration Received | Rajasthan Royals Academy Performance Squads';
    }, []);

    const centreSlug = new URLSearchParams(window.location.search).get('centre');
    const centre = ACTIVE_CENTRES.find((c) => c.slug === centreSlug) || null;

    const fadeUp = {
        hidden: { opacity: 0, y: 22 },
        visible: (delay = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.55, ease: 'easeOut', delay },
        }),
    };

    const onTheDay = [
        { icon: Backpack, text: 'Bring your playing equipment.' },
        { icon: Shirt, text: 'Wear your Rajasthan Royals Academy — or your own club — playing or training apparel.' },
        { icon: Clock, text: 'Arrive a minimum of 20 minutes before the Trial commences.' },
    ];

    const opportunities = [
        { icon: Trophy, text: 'Training-partner selection for the SA20 (Paarl Royals) and CPL (Barbados Royals)' },
        { icon: Globe2, text: 'Exclusive training camps at the Royals High Performance Centre' },
        { icon: Plane, text: 'Royals Academy Australia representative tours' },
        { icon: GraduationCap, text: 'Exclusive training opportunities with Rajasthan Royals coaches — and more' },
    ];

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center px-6 py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-12%] left-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
                <div className="absolute bottom-[-12%] right-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
            </div>

            <div className="relative z-10 max-w-xl w-full mx-auto">
                {/* Header */}
                <div className="text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <CheckCircle2 className="w-16 h-16 text-rr-pink mx-auto mb-6" strokeWidth={1.75} />
                    </motion.div>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
                        className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4"
                    >
                        Performance Squads Trial
                    </motion.p>
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
                        className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4"
                    >
                        Registration <span className="text-rr-pink">Received</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.18}
                        className="text-white/80 text-[15px] sm:text-lg font-medium leading-relaxed mb-8"
                    >
                        Thank you — we&apos;ve received your registration and payment for your trial.
                        A receipt is on its way to your inbox from Stripe, and our team will be in
                        touch with your session details.
                    </motion.p>
                </div>

                {/* Centre */}
                {centre && (
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.24}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-5"
                    >
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-rr-pink flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 mb-1">Your Trial Centre</p>
                                <p className="text-sm sm:text-base font-bold">{centre.name}</p>
                                <p className="text-white/60 text-sm font-medium">{centre.venue}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* On the day */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-5"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">On The Day</p>
                    <ul className="space-y-3.5">
                        {onTheDay.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="w-[18px] h-[18px] text-rr-pink flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                                <span className="text-white/80 text-sm font-medium leading-relaxed">{text}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* About the program */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.36}
                    className="bg-white/[0.06] border border-rr-pink/20 rounded-2xl p-5 sm:p-6 mb-8"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-3">About The Program</p>
                    <p className="text-white/80 text-sm font-medium leading-relaxed mb-4">
                        Please be aware you are trialling for the Rajasthan Royals Academy Melbourne
                        Performance Squads — a season-long program. A program fee is required to join
                        and to be eligible for selection for opportunities such as:
                    </p>
                    <ul className="space-y-3 mb-4">
                        {opportunities.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="w-[18px] h-[18px] text-rr-light-pink flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                                <span className="text-white/75 text-sm font-medium leading-relaxed">{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">
                        The final program price will be confirmed soon.
                    </p>
                </motion.div>

                {/* CTA + contact */}
                <div className="text-center">
                    <motion.a
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.42}
                        href="/performance-squads"
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors mb-6"
                    >
                        Back to Performance Squads <ArrowRight className="w-4 h-4" />
                    </motion.a>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.5}
                        className="text-white/50 text-xs font-medium flex items-center justify-center gap-2"
                    >
                        <Mail className="w-3.5 h-3.5" /> Questions? Email info@rramelbourne.com
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceSquadsSuccess;
