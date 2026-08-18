import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CalendarDays, MapPin, Clock } from 'lucide-react';

const MasterclassSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Registration Confirmed | Power Game Masterclass';
    }, []);

    const pending = new URLSearchParams(window.location.search).get('pending') === '1';

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', delay },
        }),
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-xl w-full mx-auto text-center">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                    <CheckCircle2 className="w-16 h-16 text-rr-pink mx-auto mb-6" strokeWidth={1.75} />
                </motion.div>

                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.1}
                    className="text-3xl sm:text-5xl font-black tracking-tight mb-4"
                >
                    You&apos;re <span className="text-rr-pink">In</span>
                </motion.h1>

                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.2}
                    className="text-white/80 text-[15px] sm:text-lg font-medium leading-relaxed mb-8"
                >
                    {pending
                        ? 'Your registration for the Power Game Masterclass has been received. Our team will be in touch shortly to complete your payment and confirm your spot.'
                        : 'Your registration and payment for the Power Game Masterclass are confirmed. We can\u2019t wait to see you there.'}
                </motion.p>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.3}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-left mb-8"
                >
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-rr-pink flex-shrink-0" strokeWidth={2.25} />
                        <span className="text-sm sm:text-base font-bold">Cranbourne North Elite Cricket Centre</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-rr-pink flex-shrink-0" strokeWidth={2.25} />
                        <span className="text-sm sm:text-base font-bold">Sunday 6 Sept & Sunday 13 Sept</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-rr-pink flex-shrink-0" strokeWidth={2.25} />
                        <span className="text-sm sm:text-base font-bold">5:00pm – 7:00pm both weeks</span>
                    </div>
                </motion.div>

                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.4}
                    className="text-white/50 text-xs font-medium"
                >
                    Questions? Email info@rramelbourne.com
                </motion.p>
            </div>
        </div>
    );
};

export default MasterclassSuccess;
