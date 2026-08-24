import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HolidayProgramSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fire the Meta Purchase conversion. Stripe's Payment Link redirects here after
    // payment; we verify the checkout session server-side before firing (never fire
    // when Stripe says unpaid), use the real charged amount, and guard against a
    // double-fire on reload. The base Pixel (fbq init + PageView) lives in index.html.
    useEffect(() => {
        const firePurchase = (valueAud) => {
            try {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    window.fbq('track', 'Purchase', {
                        content_name: 'Junior Royals Holiday Program',
                        content_category: 'holiday-program',
                        value: (typeof valueAud === 'number' && valueAud > 0) ? valueAud : 299,
                        currency: 'AUD',
                    });
                }
            } catch (e) { /* never let analytics break the page */ }
        };

        let sid = '';
        try { sid = new URLSearchParams(window.location.search).get('session_id') || ''; } catch (e) { /* no-op */ }

        // De-dupe: fire at most once per checkout session (or once per visit if no id).
        const guardKey = `jr_holiday_purchase_fired:${sid || 'nosession'}`;
        try { if (sessionStorage.getItem(guardKey)) return; } catch (e) { /* no-op */ }
        const markFired = () => { try { sessionStorage.setItem(guardKey, '1'); } catch (e) { /* no-op */ } };

        (async () => {
            if (!sid) { firePurchase(); markFired(); return; } // no session to verify — fire once
            try {
                const r = await fetch(`/api/get-stripe-payment?session_id=${encodeURIComponent(sid)}`);
                const data = r.ok ? await r.json() : null;
                if (data && data.payment_status === 'paid') {
                    firePurchase(typeof data.amount_total === 'number' ? data.amount_total / 100 : undefined);
                    markFired();
                } else if (data && data.payment_status && data.payment_status !== 'paid') {
                    // Stripe says not paid yet (async/processing) — do NOT fire a Purchase.
                } else {
                    firePurchase(); markFired(); // verification unreachable — don't lose the conversion
                }
            } catch (e) {
                firePurchase(); markFired();
            }
        })();
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut', delay }
        })
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans selection:bg-rr-pink selection:text-white relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">

            {/* Background gradient orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-rr-navy/60 blur-[80px]" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 max-w-2xl w-full mx-auto text-center">

                {/* Logo */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={fadeUp}
                    className="mb-10"
                >
                    <img
                        src="/assets/MELBOURNE_OFFICIAL.png"
                        alt="Rajasthan Royals Academy Melbourne"
                        className="h-16 md:h-20 mx-auto brightness-0 invert"
                    />
                </motion.div>

                {/* Tick icon */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.15}
                    variants={fadeUp}
                    className="flex items-center justify-center mb-8"
                >
                    <div className="relative">
                        {/* Outer pulse ring */}
                        <div className="absolute inset-0 rounded-full bg-rr-pink/20 animate-ping scale-110" />
                        {/* Icon circle */}
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shadow-[0_0_48px_rgba(225,31,143,0.4)]">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.25}
                    variants={fadeUp}
                    className="mb-4"
                >
                    <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">
                        Registration Confirmed
                    </p>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
                        YOU'RE{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">
                            IN.
                        </span>
                    </h1>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.35}
                    variants={fadeUp}
                    className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mx-auto my-8"
                />

                {/* Welcome message */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={0.4}
                    variants={fadeUp}
                    className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed mb-6"
                >
                    You're registered for the Junior Royals Holiday Program!
                </motion.p>

                {/* Body copy */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={0.5}
                    variants={fadeUp}
                    className="text-base md:text-lg text-white/70 leading-relaxed mb-6 max-w-lg mx-auto font-medium"
                >
                    Your place is secured for the September / October school holidays. We can't wait to see you at the Junior Royals Holiday Program!
                </motion.p>

                {/* What to bring */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.55}
                    variants={fadeUp}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-2">What to Bring</p>
                            <ul className="text-sm text-white/60 leading-relaxed space-y-1">
                                <li>• A drink bottle and water</li>
                                <li>• Wear your cricket club training kit or a Royals shirt</li>
                                <li>• If you ordered a shirt, it will be available to collect prior to your first session</li>
                                <li>• Please arrive <span className="text-white font-bold">15 minutes early</span> for the first session</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Confirmation email */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.6}
                    variants={fadeUp}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-1">Keep an Eye on Your Inbox</p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                You will receive an email in the days leading into the program with further details — including your exact session times, venue information and everything you need for day one.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Questions */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.65}
                    variants={fadeUp}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-10 text-left backdrop-blur-sm"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-1">Questions?</p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Reach out to our team at{' '}
                                <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">
                                    info@rramelbourne.com
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0.7}
                    variants={fadeUp}
                >
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] group"
                    >
                        Back to Home
                        <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>

                {/* HALLA BOL footer stamp */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={0.85}
                    variants={fadeUp}
                    className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20"
                >
                    HALLA BOL
                </motion.p>

            </div>
        </div>
    );
};

export default HolidayProgramSuccess;
