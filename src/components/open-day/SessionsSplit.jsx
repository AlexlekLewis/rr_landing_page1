import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JUNIOR_ROYALS, ELITE_ROYALS } from './configs';

// Shared "WHICH ONE ARE YOU?" two-card split (Junior Royals blue · Elite Royals
// pink). Used by every open-day page (Williamstown, Hallam, Mickleham) so the
// three stay identical. Both cards' CTAs scroll to the on-page register anchors:
//   Junior → #register-junior   ·   Elite → #register
// `eliteAges` / `juniorAges` override the default age lines per centre.
//
// Optional age helper (polish): a player can pop in their age and we HIGHLIGHT
// the right path — under 11 points firmly to Junior Royals (Elite dimmed +
// rerouted, never a dead-end); 11 & over sees BOTH cards lit as open ("the
// choice is yours") — we never gate an 11+ player out of either option.
const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const Tick = ({ tone }) => (
    <svg className={`w-4 h-4 shrink-0 mt-0.5 ${tone}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const StatusPill = ({ tone, children }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest ${tone}`}>
        {children}
    </span>
);

const SessionsSplit = ({ config, eliteAges, juniorAges }) => {
    const [age, setAge] = useState('');
    const ageNum = parseInt(age, 10);
    const hasAge = Number.isInteger(ageNum) && ageNum >= 1 && ageNum <= 99;
    const under11 = hasAge && ageNum < 11;
    const elevenPlus = hasAge && ageNum >= 11;

    return (
        <section id="sessions" className="bg-rr-dark py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-4">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Two sessions · one day</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">Which one are you?</h2>
                </div>
                <p className="text-center text-white/60 font-medium max-w-2xl mx-auto mb-8">
                    If you just want to <strong className="text-white">come and have a go</strong>, you're a Junior Royal.
                    If you're <strong className="text-white">serious about your cricket and want to be tested</strong>, you're an Elite Royal.
                    <span className="block mt-1 text-white/80">Both need to register — pick your session below.</span>
                </p>

                {/* Optional age helper — highlights the right path */}
                <div className="flex flex-col items-center gap-3 mb-12">
                    <label htmlFor="ss-age" className="text-[11px] font-black uppercase tracking-[0.25em] text-white/70">How old is the player?</label>
                    <input
                        id="ss-age"
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                        inputMode="numeric"
                        placeholder="Age"
                        className="w-24 text-center bg-white/95 rounded-xl px-3 py-2.5 text-rr-dark font-black text-lg placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-rr-pink"
                    />
                    {hasAge ? (
                        <p className="text-sm md:text-base font-bold text-white text-center max-w-xl">
                            {under11 ? (
                                <>Under 11 — <span style={{ color: '#9DB6FF' }}>Junior Royals</span> is your session. Just register below.</>
                            ) : (
                                <>You're {ageNum} — <span className="text-rr-light-pink">the choice is yours.</span> Register for Junior Royals <em>or</em> the Elite trial.</>
                            )}
                        </p>
                    ) : (
                        <p className="text-xs text-white/40 font-medium">Optional — we'll point you to the right session</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* JUNIOR ROYALS — blue (open to all ages) */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className={`rounded-3xl overflow-hidden border flex flex-col transition-all duration-300 ${hasAge ? 'border-[#9DB6FF]/50 ring-2 ring-[#9DB6FF]/40' : 'border-white/10'}`}
                        style={{ background: 'linear-gradient(160deg,#0a1f6b 0%,#0b1230 100%)' }}
                    >
                        <div className="px-7 pt-7 pb-5 border-b border-white/10">
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9DB6FF' }}>{config.juniorTime}</span>
                                </div>
                                {hasAge && <StatusPill tone="bg-[#9DB6FF]/15 border border-[#9DB6FF]/40 text-[#9DB6FF]">✓ {under11 ? 'Your session' : 'Open to you'}</StatusPill>}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Junior Royals</h3>
                            <p className="text-lg font-black uppercase tracking-tight mt-1" style={{ color: '#9DB6FF' }}>{JUNIOR_ROYALS.tagline}</p>
                            <p className="text-sm font-bold text-white/50 uppercase tracking-widest mt-3">{juniorAges || JUNIOR_ROYALS.ages}</p>
                            <p className="text-white/75 font-medium leading-relaxed mt-3">{JUNIOR_ROYALS.blurb}</p>
                        </div>
                        <ul className="px-7 py-6 space-y-2.5 flex-1">
                            {JUNIOR_ROYALS.points.map((p) => (
                                <li key={p} className="flex items-start gap-3 text-white/85 font-medium text-sm md:text-base">
                                    <Tick tone="text-[#9DB6FF]" />{p}
                                </li>
                            ))}
                        </ul>
                        <div className="px-7 pb-7">
                            <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-3 text-center mb-4">
                                <p className="text-sm font-black text-white uppercase tracking-widest">Registration required</p>
                            </div>
                            <button
                                onClick={() => scrollTo('register-junior')}
                                className="group w-full text-white font-black uppercase tracking-widest px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                                style={{ background: '#1226AA' }}
                            >
                                Register for Junior Royals
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* ELITE ROYALS — pink (ages 11+) */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className={`rounded-3xl overflow-hidden border flex flex-col transition-all duration-300 ${under11 ? 'opacity-50 border-white/10' : elevenPlus ? 'border-rr-pink/60 ring-2 ring-rr-pink/40' : 'border-rr-pink/30'}`}
                        style={{ background: 'linear-gradient(160deg,#4a0538 0%,#1a0518 100%)' }}
                    >
                        <div className="px-7 pt-7 pb-5 border-b border-white/10">
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-3 py-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink">{config.eliteTime}</span>
                                </div>
                                {under11 && <StatusPill tone="bg-white/10 border border-white/25 text-white/80">Ages 11+</StatusPill>}
                                {elevenPlus && <StatusPill tone="bg-rr-pink/15 border border-rr-pink/40 text-rr-light-pink">✓ Open to you</StatusPill>}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Elite Royals</h3>
                            <p className="text-lg font-black uppercase tracking-tight mt-1 text-rr-light-pink">{ELITE_ROYALS.tagline}</p>
                            <p className="text-sm font-bold text-white/50 uppercase tracking-widest mt-3">{eliteAges || ELITE_ROYALS.ages}</p>
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
                                <p className="text-sm font-black text-white uppercase tracking-widest">{under11 ? 'Ages 11 & over' : 'Registration required'}</p>
                            </div>
                            <button
                                onClick={() => scrollTo(under11 ? 'register-junior' : 'register')}
                                className="group w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-6 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3"
                            >
                                {under11 ? 'Register for Junior Royals' : 'Register for the trial'}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SessionsSplit;
