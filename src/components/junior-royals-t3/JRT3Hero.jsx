import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EARLY_BIRD_END = new Date('2026-07-15T13:00:00Z'); // 11pm AEST = 1pm UTC

const useCountdown = (target) => {
    const [timeLeft, setTimeLeft] = useState({});
    useEffect(() => {
        const calc = () => {
            const diff = target - new Date();
            if (diff <= 0) return setTimeLeft({ expired: true });
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [target]);
    return timeLeft;
};

const Pad = ({ n }) => String(n).padStart(2, '0');

const JRT3Hero = () => {
    const countdown = useCountdown(EARLY_BIRD_END);

    const scrollToForm = () =>
        document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            <div className="absolute inset-0 bg-gradient-to-br from-rr-dark via-rr-dark/95 to-rr-navy/60" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-20 container mx-auto px-6 pt-32 pb-24 max-w-4xl">
                {/* Early bird badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                        {countdown.expired ? 'Now Enrolling — Term 3, 2026' : 'Early Bird — $299 · Term 3, 2026'}
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6"
                >
                    JUNIOR ROYALS<br />
                    <span className="text-rr-pink">TERM 3</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-white font-semibold mb-4"
                >
                    Term 3, 2026 · 8-Week Program
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-lg text-white/80 font-medium mb-8 max-w-xl"
                >
                    Small group coaching for players aged 7–15 — one hour each week at your preferred session time, in your selected age group, for 8 consecutive weeks. Build foundation skills, develop game sense and take your game to the next level — delivered by Royals and CA accredited coaches.
                </motion.p>

                {/* Venue pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3 mb-6"
                >
                    {[
                        { label: 'Mickleham Indoor Sports Centre', icon: '📍' },
                        { label: 'Elite Cricket Centre, Hallam', icon: '📍' },
                        { label: 'The Netz, Williamstown', icon: '📍' },
                        { label: 'Ages 7–15', icon: '👦' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                            <span className="text-rr-pink font-bold text-xs">{p.icon}</span>
                            <span className="text-white text-xs font-semibold uppercase tracking-wide">{p.label}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 bg-rr-pink/20 border border-rr-pink/40 rounded-full px-4 py-2">
                        <span className="text-rr-pink font-bold text-xs">💰</span>
                        <span className="text-white text-xs font-semibold uppercase tracking-wide">
                            {countdown.expired ? 'Programs from $330' : 'Early Bird from $299'}
                        </span>
                    </div>
                </motion.div>

                {/* Countdown */}
                {!countdown.expired && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-8 inline-block"
                    >
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-3">Early Bird Closes In</p>
                        <div className="flex items-center gap-4">
                            {[
                                { val: countdown.days, label: 'Days' },
                                { val: countdown.hours, label: 'Hrs' },
                                { val: countdown.minutes, label: 'Min' },
                                { val: countdown.seconds, label: 'Sec' },
                            ].map((t, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl md:text-3xl font-black text-white tabular-nums">
                                        <Pad n={t.val ?? 0} />
                                    </div>
                                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-0.5">{t.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                    {/* Coming soon notice */}


                    {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                    >
                        {countdown.expired ? 'Register Now' : 'Secure Early Bird Spot'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
            >
                <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Scroll</span>
                <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
            </motion.div>
        </section>
    );
};

export default JRT3Hero;
