import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import OpenDayHero from './OpenDayHero';
import OpenDayForm from './OpenDayForm';
import { JUNIOR_ROYALS, ELITE_ROYALS } from './configs';

const SECTIONS = ['hero', 'sessions', 'register'];

const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const Tick = ({ tone }) => (
    <svg className={`w-4 h-4 shrink-0 mt-0.5 ${tone}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

// Web replica of the official poster. Two crystal-clear audiences:
//   JUNIOR ROYALS (blue) — free come-and-try, just turn up, NO registration.
//   ELITE ROYALS  (pink) — trial for a scholarship, registration REQUIRED (form below).
const OpenDay = ({ config }) => {
    usePageAnalytics(config.route, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="mickleham" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero"><OpenDayHero config={config} /></div>

                {/* ── WHICH SESSION IS FOR YOU? — the two royals, side by side ── */}
                <section id="sessions" className="bg-rr-dark py-20 md:py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-4">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Two sessions · one day</p>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">Which one are you?</h2>
                        </div>
                        <p className="text-center text-white/60 font-medium max-w-2xl mx-auto mb-14">
                            Not sure? If you just want to <strong className="text-white">come and have a go</strong>, you're a Junior Royal — turn up, no booking.
                            If you're <strong className="text-white">serious about your cricket and want to be tested</strong>, you're an Elite Royal — register below.
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* JUNIOR ROYALS — blue */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                                className="rounded-3xl overflow-hidden border border-white/10 flex flex-col"
                                style={{ background: 'linear-gradient(160deg,#0a1f6b 0%,#0b1230 100%)' }}
                            >
                                <div className="px-7 pt-7 pb-5 border-b border-white/10">
                                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
                                        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9DB6FF' }}>{config.juniorTime}</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Junior Royals</h3>
                                    <p className="text-lg font-black uppercase tracking-tight mt-1" style={{ color: '#9DB6FF' }}>{JUNIOR_ROYALS.tagline}</p>
                                    <p className="text-sm font-bold text-white/50 uppercase tracking-widest mt-3">{JUNIOR_ROYALS.ages}</p>
                                    <p className="text-white/75 font-medium leading-relaxed mt-3">{JUNIOR_ROYALS.blurb}</p>
                                </div>
                                <ul className="px-7 py-6 space-y-2.5 flex-1">
                                    {JUNIOR_ROYALS.points.map((p) => (
                                        <li key={p} className="flex items-start gap-3 text-white/85 font-medium text-sm md:text-base">
                                            <Tick tone="text-[#9DB6FF]" />{p}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mx-7 mb-7 rounded-2xl bg-white/5 border border-white/15 px-5 py-4 text-center">
                                    <p className="text-lg font-black text-white uppercase tracking-tight leading-tight">No booking needed</p>
                                    <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: '#9DB6FF' }}>Just turn up · {config.juniorTime}</p>
                                </div>
                            </motion.div>

                            {/* ELITE ROYALS — pink */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                                className="rounded-3xl overflow-hidden border border-rr-pink/30 flex flex-col"
                                style={{ background: 'linear-gradient(160deg,#4a0538 0%,#1a0518 100%)' }}
                            >
                                <div className="px-7 pt-7 pb-5 border-b border-white/10">
                                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-3 py-1 mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink">{config.eliteTime}</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Elite Royals</h3>
                                    <p className="text-lg font-black uppercase tracking-tight mt-1 text-rr-light-pink">{ELITE_ROYALS.tagline}</p>
                                    <p className="text-sm font-bold text-white/50 uppercase tracking-widest mt-3">{ELITE_ROYALS.ages}</p>
                                    <p className="text-white/75 font-medium leading-relaxed mt-3">{ELITE_ROYALS.blurb}</p>
                                </div>
                                <ul className="px-7 py-6 space-y-2.5 flex-1">
                                    {ELITE_ROYALS.points.map((p) => (
                                        <li key={p} className="flex items-start gap-3 text-white/85 font-medium text-sm md:text-base">
                                            <Tick tone="text-rr-pink" />{p}
                                        </li>
                                    ))}
                                </ul>
                                <div className="px-7 pb-7">
                                    <div className="rounded-2xl bg-rr-pink/10 border border-rr-pink/30 px-5 py-3 text-center mb-4">
                                        <p className="text-sm font-black text-white uppercase tracking-widest">Registration required</p>
                                    </div>
                                    <button
                                        onClick={scrollToRegister}
                                        className="group w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-6 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                                    >
                                        Register for the trial
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── REGISTER (Elite Royals only) ── */}
                <OpenDayForm config={config} />
            </main>
            <Footer />
        </div>
    );
};

export default OpenDay;
