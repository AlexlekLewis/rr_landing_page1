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

                {/* ── WHAT'S ON — intro + diagonal image split ── */}
                <section id="whats-on">
                    <div className="bg-rr-dark text-center pt-20 pb-14 px-6">
                        <p className="text-2xl md:text-4xl font-black text-rr-pink uppercase tracking-tight leading-none mb-2">Sunday 5 July · 9am–12pm</p>
                        <p className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-[0.25em] mb-7">Mickleham Indoor Sports Centre · 3 Eclipse Drive</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Two ways to join us</h2>
                        <p className="text-lg text-white/70 font-medium max-w-2xl mx-auto">
                            Come for the fun, the trial, or both — here's how to tell which one is you.
                        </p>
                    </div>

                    {/* JUNIOR — turn up & play */}
                    <div className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7vw), 0 100%)' }}>
                        <img src="/assets/holiday-program-group.jpg" alt="Junior Royals players having fun" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 28%' }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(0,12,40,0.93) 0%, rgba(0,17,62,0.82) 42%, rgba(12,32,120,0.5) 74%, rgba(18,38,170,0.22) 100%)' }} />
                        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex flex-col justify-center" style={{ paddingTop: '4rem', paddingBottom: 'calc(7vw + 3rem)' }}>
                            <p className="text-sm font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#9DB6FF' }}>9:00 – 10:30am · Everyone welcome</p>
                            <p className="text-base font-bold italic text-white/80 mb-1">Just want to come and have a go?</p>
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Junior Royals</h3>
                            <p className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-2">Turn up &amp; play</p>
                            <p className="text-white/85 font-medium leading-relaxed mt-5 max-w-xl">
                                Open doors for <strong className="text-white">everyone</strong>. Come have a hit, have fun and meet the coaches. Bring the family — no pressure, no commitment.
                            </p>
                            <div className="flex items-center gap-3 mt-6">
                                <svg className="w-6 h-6 shrink-0" style={{ color: '#9DB6FF' }} fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                <span className="text-white font-black uppercase tracking-wide text-lg">No need to register — just turn up ready to have fun</span>
                            </div>
                        </div>
                    </div>

                    {/* pink diagonal seam accent */}
                    <div aria-hidden="true" className="relative" style={{ marginTop: '-7vw', height: 'calc(7vw + 5px)', background: 'var(--color-rr-pink, #E11F8F)', clipPath: 'polygon(0 7vw, 100% 0, 100% calc(7vw + 5px), 0 100%)', zIndex: 1 }} />

                    {/* ELITE — trial */}
                    <div className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex" style={{ marginTop: '-7vw', clipPath: 'polygon(0 7vw, 100% 0, 100% 100%, 0 100%)' }}>
                        <img src="/assets/junior-royals-card.jpg" alt="Elite Program coaching at the academy" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 32%' }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(8,0,26,0.93) 0%, rgba(64,6,56,0.85) 40%, rgba(150,18,110,0.52) 74%, rgba(225,31,143,0.24) 100%)' }} />
                        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex flex-col justify-center" style={{ paddingTop: 'calc(7vw + 4rem)', paddingBottom: '4rem' }}>
                            <p className="text-sm font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#F7A8D6' }}>10:30am – 12:00pm · Ages 12+</p>
                            <p className="text-base font-bold italic text-white/80 mb-1">Serious about your cricket?</p>
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Elite Trial</h3>
                            <p className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-2">Trial for the Elite Program</p>
                            <p className="text-white/85 font-medium leading-relaxed mt-5 max-w-xl">
                                Meet the <strong className="text-white">Head Coach &amp; Elite coaching team</strong>, get put through your paces and show us what you've got.
                            </p>
                            <p className="text-white font-bold leading-relaxed mt-5 max-w-xl border-l-4 border-rr-pink pl-4">
                                Registering is <strong>specifically to trial for the Elite Program</strong> (our Power Game Pre-Season). Here for Junior Royals? You don't need to register.
                            </p>
                            <button
                                onClick={scrollToRegister}
                                className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 mt-7 self-start flex items-center gap-3"
                            >
                                Register for the Elite Trial
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
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
