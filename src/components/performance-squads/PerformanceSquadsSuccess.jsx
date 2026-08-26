import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Mail, ArrowRight, ClipboardList } from 'lucide-react';
import { ACTIVE_CENTRES } from './data';

// Branded confirmation shown after a trial payment. Reached via each Stripe
// trial link's after_completion redirect, e.g.
//   /performance-squads/success?centre=north-melbourne
// Each link is centre-specific, so the centre comes straight off the URL — no
// Stripe session lookup needed. Falls back to a generic message if the param
// is missing or unknown.
const PerformanceSquadsSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Trial Booked | Rajasthan Royals Academy Performance Squads';
    }, []);

    const params = new URLSearchParams(window.location.search);
    const centreSlug = params.get('centre');
    const centre = ACTIVE_CENTRES.find((c) => c.slug === centreSlug) || null;

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', delay },
        }),
    };

    const bringList = [
        'Your full kit — bat, pads, gloves, helmet and protective gear',
        'Clean, non-marking indoor shoes',
        'Training clothes and a water bottle',
        'Arrive 15 minutes early to check in',
    ];

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-xl w-full mx-auto text-center">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <CheckCircle2 className="w-16 h-16 text-rr-pink mx-auto mb-6" strokeWidth={1.75} />
                </motion.div>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
                    className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4"
                >
                    Performance Squads
                </motion.p>

                <motion.h1
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
                    className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4"
                >
                    You&apos;re <span className="text-rr-pink">Booked In</span>
                </motion.h1>

                <motion.p
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
                    className="text-white/80 text-[15px] sm:text-lg font-medium leading-relaxed mb-8"
                >
                    Your trial spot is secured and your payment is confirmed. A receipt is on its
                    way to your inbox from Stripe, and our team will be in touch with your session
                    details and what to expect on the day.
                </motion.p>

                {centre && (
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-6"
                    >
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-rr-pink flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45 mb-1">Your Centre</p>
                                <p className="text-sm sm:text-base font-bold">{centre.name}</p>
                                <p className="text-white/60 text-sm font-medium">{centre.venue}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.35}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8"
                >
                    <div className="flex items-center gap-2.5 mb-4">
                        <ClipboardList className="w-5 h-5 text-rr-pink" strokeWidth={2.25} />
                        <span className="text-sm font-black uppercase tracking-wider">What to bring</span>
                    </div>
                    <ul className="space-y-2.5">
                        {bringList.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                <span className="text-white/75 text-sm font-medium leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.a
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.4}
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
    );
};

export default PerformanceSquadsSuccess;
