import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import Footer from '../Footer';
import DepositGate from './DepositGate';
import DepositForm from './DepositForm';
import heroImg from '../../assets/india-tour-2026/hero-coaching.jpg';

// Shared private-access key. Overridable in Vercel via VITE_INDIA_TOUR_DEPOSIT_KEY.
// Must stay in sync with INDIA_TOUR_DEPOSIT_KEY on the checkout serverless function.
const ACCESS_KEY = import.meta.env.VITE_INDIA_TOUR_DEPOSIT_KEY || 'INDIA2026';

const getKeyFromUrl = () => {
    const p = new URLSearchParams(window.location.search);
    return (p.get('key') || p.get('code') || '').trim();
};

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const SECURES = [
    'Your place in the Rajasthan Royals Academy Melbourne touring squad',
    'The full deposit is applied to your total tour cost',
    'Places are limited and confirmed in order of deposit',
    'Full itinerary, costs and balance schedule sent with your confirmation',
];

const IndiaTourDeposit = () => {
    usePageAnalytics('/india-tour-2026/deposit', { sections: ['hero', 'deposit', 'register'] });

    const [granted, setGranted] = useState(false);

    // Private + off search engines.
    useEffect(() => {
        document.title = 'Secure Your Place | India Tour 2026 | Rajasthan Royals Academy Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        window.scrollTo(0, 0);
        return () => { document.head.removeChild(meta); };
    }, []);

    useEffect(() => {
        if (getKeyFromUrl() === ACCESS_KEY) setGranted(true);
    }, []);

    const tryCode = useCallback((code) => {
        if ((code || '').trim() === ACCESS_KEY) {
            setGranted(true);
            const url = new URL(window.location.href);
            url.searchParams.set('key', ACCESS_KEY);
            window.history.replaceState({}, '', url);
            window.scrollTo(0, 0);
            return true;
        }
        return false;
    }, []);

    if (!granted) return <DepositGate onTryCode={tryCode} />;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <main className="flex-1 w-full overflow-hidden">
                {/* Hero */}
                <section id="hero" className="relative min-h-[80vh] flex items-center overflow-hidden bg-rr-dark">
                    <img src={heroImg} alt="Rajasthan Royals Academy players training in India" className="absolute inset-0 w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-rr-dark/30 md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/80 md:to-transparent" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/20 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative container mx-auto px-6 py-24">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                                <span className="text-xs font-bold text-white uppercase tracking-[0.25em]">Secure Your Place · By Invitation</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                            >
                                India Tour
                                <span className="block text-rr-pink">2026</span>
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
                                className="flex items-center gap-3 mt-5"
                            >
                                <span className="h-px w-10 bg-gradient-to-r from-rr-pink to-rr-blue" />
                                <span className="text-lg md:text-2xl font-black text-white uppercase tracking-[0.35em]">September</span>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
                                className="text-base md:text-xl text-white/80 font-medium leading-relaxed mt-6 max-w-xl"
                            >
                                You've been invited to join the Rajasthan Royals Academy Melbourne touring squad —
                                training and playing in India. Reserve your place with a deposit below.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
                                className="mt-9"
                            >
                                <button
                                    onClick={scrollToRegister}
                                    data-cta="hero-pay-deposit"
                                    className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                                >
                                    Secure My Place · $2,200
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Deposit details */}
                <section id="deposit" className="py-16 md:py-24 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink" />
                                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Your Deposit</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                                    Reserve Your
                                    <span className="block text-rr-pink">Touring Spot</span>
                                </h2>
                                <p className="text-lg text-rr-charcoal font-medium leading-relaxed mb-8">
                                    A deposit confirms your intent to travel and holds your place while we finalise the
                                    touring squad. It comes straight off your total tour cost — nothing is lost.
                                </p>
                                <ul className="space-y-3">
                                    {SECURES.map((s) => (
                                        <li key={s} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-rr-charcoal font-medium leading-snug">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price panel */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10">
                                <p className="text-xs font-black text-rr-dark uppercase tracking-widest mb-2">Deposit due today</p>
                                <div className="flex items-end gap-2 mb-1">
                                    <span className="text-6xl font-black text-rr-dark leading-none">$2,200</span>
                                    <span className="text-lg font-black text-rr-charcoal/70 mb-1">AUD</span>
                                </div>
                                <p className="text-rr-charcoal font-medium mb-6">$2,000 deposit + $200 GST (10%)</p>

                                <div className="h-px bg-slate-200 my-6" />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-rr-charcoal font-medium">Tour deposit</span><span className="font-black text-rr-dark">$2,000.00</span></div>
                                    <div className="flex justify-between"><span className="text-rr-charcoal font-medium">GST (10%)</span><span className="font-black text-rr-dark">$200.00</span></div>
                                    <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-rr-dark font-black uppercase tracking-wide">Total</span><span className="font-black text-rr-pink text-lg">$2,200.00</span></div>
                                </div>

                                <button
                                    onClick={scrollToRegister}
                                    className="mt-8 w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                                >
                                    Pay Deposit
                                </button>
                                <p className="text-center text-xs text-rr-charcoal/60 font-medium mt-4">
                                    After your deposit we'll send the full traveller form (passport &amp; travel details).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info collection + payment */}
                <DepositForm accessKey={ACCESS_KEY} />
            </main>
            <Footer />
        </div>
    );
};

export default IndiaTourDeposit;
