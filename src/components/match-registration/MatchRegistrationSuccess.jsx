import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, MapPin, Clock, Shirt, AlertTriangle, Mail, ArrowRight,
} from 'lucide-react';
import { ACTIVE_MATCH } from './matchConfig';

// Branded confirmation shown after payment. Reached via the Stripe Payment
// Link's after_completion redirect:
//   /match-registration/success
const MatchRegistrationSuccess = () => {
    const m = ACTIVE_MATCH;

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Spot Confirmed | ${m.name}`;
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, [m.name]);

    const fadeUp = {
        hidden: { opacity: 0, y: 22 },
        visible: (delay = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.55, ease: 'easeOut', delay },
        }),
    };

    const onTheDay = [
        { icon: MapPin, text: `${m.venue.name}, ${m.venue.address}` },
        { icon: Clock, text: m.times },
        { icon: Shirt, text: 'Royals training top, white trousers, white pads, pink Royals hat only. Royals caps will be available to purchase on the day.' },
        { icon: AlertTriangle, text: 'Helmet and stem guard are both mandatory — no stem guard, no batting.' },
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
                        {m.eyebrow} · {m.name}
                    </motion.p>
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
                        className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4"
                    >
                        Your Spot Is Confirmed
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
                        className="text-white/70 text-[15px] sm:text-base font-medium leading-relaxed"
                    >
                        Payment received — you're locked in for {m.datesLabel}. Teams will be
                        announced in the next week, and we'll send more detail closer to the time.
                    </motion.p>
                </div>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
                    className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8 mt-10"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">
                        On The Day
                    </p>
                    <ul className="space-y-4">
                        {onTheDay.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                <span className="text-white/75 text-[15px] font-medium leading-relaxed">{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-white/55 text-sm font-medium leading-relaxed mt-5 pt-5 border-t border-white/10">
                        Bring plenty of water, sunscreen, and your own food and drink — it's a long
                        day and there's no canteen at this stage.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp} custom={0.25}
                    className="text-center mt-10"
                >
                    <p className="text-white/50 text-sm font-medium mb-5">
                        Questions? Get in touch and we'll sort it.
                    </p>
                    <a
                        href={`mailto:${m.contactEmail}`}
                        className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        <Mail className="w-4 h-4" /> {m.contactEmail}
                    </a>
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

export default MatchRegistrationSuccess;
