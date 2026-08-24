import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import LaunchForm from './LaunchForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { OFFER, CENTRE, INCLUDES, STEPS, daysLeft, endDateLabel } from './launchConfig';

const scrollToForm = () => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const MicklehamLaunch = () => {
    usePageAnalytics('/mickleham-launch', { sections: ['hero', 'offer', 'how', 'register'] });
    const [left, setLeft] = useState(daysLeft());

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${OFFER.price} Consultation — 30-Day Launch Special | Mickleham | RRA Melbourne`;
        const t = setInterval(() => setLeft(daysLeft()), 60000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="private-coaching" />

            <main className="flex-1 w-full overflow-hidden">
                {/* HERO — the offer, the deadline, one button */}
                <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden bg-rr-dark">
                    <div className="absolute inset-0">
                        <img
                            src="/assets/cec-lanes.jpg"
                            alt={`Indoor cricket lanes at ${CENTRE.name}`}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-rr-dark/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/50" />
                        <img
                            src="/assets/rr-lion-white.png"
                            alt=""
                            aria-hidden="true"
                            className="absolute -right-28 -bottom-28 w-[560px] max-w-none opacity-[0.07] pointer-events-none select-none"
                        />
                    </div>

                    <div className="relative w-full max-w-4xl mx-auto px-6 py-28 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            {/* Urgency strip */}
                            <div className="inline-flex items-center gap-2.5 bg-rr-pink rounded-full px-5 py-2.5 mb-7">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                                <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">
                                    {left > 0 ? `${left} Days Left · Ends ${endDateLabel()}` : 'Final Days'}
                                </span>
                            </div>

                            <p className="text-xs md:text-sm font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">
                                {CENTRE.name}
                            </p>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                                Private Coaching<br />Launch Special
                            </h1>

                            {/* The price */}
                            <div className="flex items-end justify-center gap-4 mb-6">
                                <span className="text-6xl md:text-8xl font-black text-white leading-none">{OFFER.price}</span>
                                <span className="text-3xl md:text-4xl font-bold text-white/40 line-through leading-none mb-1.5">{OFFER.wasPrice}</span>
                            </div>

                            <p className="text-base md:text-xl text-white/85 font-semibold leading-relaxed max-w-2xl mx-auto mb-10">
                                One hour with Head Coach{' '}
                                <span className="text-white">Alex Lewis</span>. He looks at your game,
                                picks the right coach for you, and books your training night.
                            </p>

                            <button
                                onClick={scrollToForm}
                                className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-base px-10 md:px-14 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_36px_rgba(229,6,149,0.55)] inline-flex items-center gap-3"
                            >
                                Claim Your Spot
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            <p className="text-white/50 text-sm font-medium mt-5">
                                No payment now · Tuesdays &amp; Fridays · Mickleham
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* WHAT YOU GET */}
                <section id="offer" className="bg-white py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">What You Get</p>
                            <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                                Your First Session
                            </h2>
                            <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                                One hour with Alex. Here’s what happens.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                            {INCLUDES.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.06 * i }}
                                    className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5"
                                >
                                    <span className="w-6 h-6 mt-0.5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <p className="text-rr-charcoal font-semibold leading-snug">{item}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={scrollToForm}
                                className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300"
                            >
                                Claim Your {OFFER.price} Spot
                            </button>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how" className="bg-slate-50 py-20 md:py-24">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">How It Works</p>
                            <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none">
                                Three Steps
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {STEPS.map((s, i) => (
                                <motion.div
                                    key={s.n}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.08 * i }}
                                    className="bg-white border border-slate-200 rounded-2xl p-7"
                                >
                                    <p className="text-3xl font-black text-rr-pink/30 mb-3">{s.n}</p>
                                    <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-2">{s.t}</h3>
                                    <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{s.d}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <LaunchForm />
            </main>

            <Footer />
        </div>
    );
};

export default MicklehamLaunch;
