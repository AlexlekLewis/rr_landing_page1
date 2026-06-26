import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import MicklehamHero from './MicklehamHero';
import MicklehamForm from './MicklehamForm';

const SECTIONS = ['hero', 'whats-on', 'elite-info', 'register'];

const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const MicklehamOpenDay = () => {
    usePageAnalytics('/PGP2026/mickleham', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="lp2" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><MicklehamHero /></div>

                {/* ── WHAT'S ON — the two-part split ── */}
                <section id="whats-on" className="py-24 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Sunday 5 July · 9:00am–12:00pm</p>
                            <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-4">Two ways to join us</h2>
                            <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                                Come for the open play, the Elite trial, or both. Here's how the morning runs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
                            {/* Turn up & play */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 flex flex-col">
                                <div className="inline-flex items-center gap-2 bg-rr-blue/10 border border-rr-blue/25 rounded-full px-4 py-2 self-start mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rr-blue" />
                                    <span className="text-xs font-bold text-rr-blue uppercase tracking-widest">Open to everyone · No sign-up</span>
                                </div>
                                <p className="text-3xl font-black text-rr-dark uppercase tracking-tight leading-none">9:00 – 10:30<span className="text-xl align-top">am</span></p>
                                <h3 className="text-2xl font-black text-rr-dark uppercase tracking-tight mt-3 mb-4">Turn up &amp; play</h3>
                                <p className="text-rr-charcoal font-medium leading-relaxed mb-6">
                                    Open doors for <strong>everyone</strong>. Come and try <strong>Junior Royals</strong>, have a hit, have fun and meet our coaches. Bring the family — <strong>no registration, no commitment</strong>. Just show up.
                                </p>
                                <ul className="mt-auto space-y-3">
                                    {['All ages welcome', 'Junior Royals fun & games', 'Meet the coaching team', 'No booking — just come along'].map((t) => (
                                        <li key={t} className="flex items-center gap-3">
                                            <span className="w-5 h-5 rounded-full bg-rr-blue/15 flex items-center justify-center shrink-0">
                                                <svg className="w-3 h-3 text-rr-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </span>
                                            <span className="text-rr-dark font-semibold text-sm">{t}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Elite trial */}
                            <div className="relative rounded-2xl p-8 md:p-10 flex flex-col text-white overflow-hidden" style={{ background: 'linear-gradient(155deg, #001D48 0%, #1226AA 45%, #E11F8F 130%)' }}>
                                <div className="absolute -top-16 -right-16 w-60 h-60 bg-rr-pink/30 rounded-full blur-[90px] pointer-events-none" />
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-2 self-start mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Ages 12+ · Registration required</span>
                                    </div>
                                    <p className="text-3xl font-black text-white uppercase tracking-tight leading-none">10:30 – 12:00<span className="text-xl align-top">pm</span></p>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-3 mb-4">Elite Program trial</h3>
                                    <p className="text-white/90 font-medium leading-relaxed mb-6">
                                        Chasing a spot in the <strong className="text-white">Elite Program</strong>? This is your trial. Meet the <strong className="text-white">Head Coach and the Elite coaching team</strong>, get put through your paces, and show us what you've got.
                                    </p>
                                    <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-6">
                                        <p className="text-white font-bold text-sm">👉 You must register to take part in the trial.</p>
                                    </div>
                                    <button
                                        onClick={scrollToRegister}
                                        className="mt-auto group bg-white text-rr-navy font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] flex items-center justify-center gap-3"
                                    >
                                        Register for the Trial
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── ABOUT THE ELITE PROGRAM ── */}
                <section id="elite-info" className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10">
                            <div className="text-center mb-8">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">What you can trial for</p>
                                <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">The Elite Program at Mickleham</h2>
                                <p className="text-rr-charcoal font-medium max-w-2xl mx-auto mt-4">
                                    Our 8-week <strong>Power Game Pre-Season</strong> — building real power, a 360° game and performance under pressure, the Royals way. Ages 12–26.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { l: 'Main sessions', v: 'Saturdays', s: '2–6pm · pick a 2-hr block (2–4 or 4–6pm)' },
                                    { l: 'Also available', v: 'Fridays', s: 'Evening blocks — 6–8pm or 8–10pm' },
                                    { l: 'Program dates', v: '8 Weeks', s: 'Sat 1 Aug – 19 Sep · 2 hours a week' },
                                ].map((c) => (
                                    <div key={c.l} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                                        <p className="text-[10px] font-black text-rr-pink uppercase tracking-widest mb-2">{c.l}</p>
                                        <p className="text-xl font-black text-rr-dark uppercase tracking-tight leading-none">{c.v}</p>
                                        <p className="text-rr-charcoal/80 text-xs font-medium mt-2 leading-snug">{c.s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── REGISTER (Elite trial form) ── */}
                <MicklehamForm />
            </main>
            <Footer />
        </div>
    );
};

export default MicklehamOpenDay;
