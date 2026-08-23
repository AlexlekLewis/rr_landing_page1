import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Only list programs a visitor can act on today, and only ones whose page sits
// inside the site's navigation. "Elite Program" was dropped in Aug 2026: it
// pointed at /elite-royals, which renders the closed Power Game sales page with
// no Navbar — a dead end. Put Elite back when there is an open intake AND a page
// with the site chrome on it.
// Review date: the Masterclass badge expires 13 Sep 2026.
const PROGRAMS = [
    { label: 'Junior Royals Holiday Program', route: '/junior-royals-holiday', badge: 'Early Bird $299 — Sept/Oct', badgeColor: 'bg-rr-pink' },
    { label: 'Performance Squads', route: '/performance-squads', badge: 'Trials 6, 11 & 13 Sept', badgeColor: 'bg-green-500' },
    { label: 'Power Game Masterclass', route: '/power-game-masterclass', badge: '6 & 13 Sept · Ages 14+', badgeColor: 'bg-green-500' },
    { label: 'Junior Royals', route: '/junior-royals', badge: 'Term 4 Entries Open', badgeColor: 'bg-green-500' },
];

const HomeHero = ({ onRegisterClick }) => {
    return (
        <section className="relative min-h-screen flex items-end overflow-hidden bg-rr-dark">

            {/* Dark base */}
            <div className="absolute inset-0 bg-rr-dark" />

            {/* Background image — full original, Vaibhav top right */}
            <img
                src="/assets/hero-vs-full.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none md:hidden"
                style={{ objectPosition: '55% top' }}
            />
            <img
                src="/assets/hero-vs-full.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none hidden md:block"
                style={{ objectPosition: '60% top' }}
            />

            {/* Gradient — dark on left for text, clear on right for Vaibhav */}
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/95 via-rr-dark/70 to-rr-dark/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/80 via-transparent to-transparent" />

            {/* Gradient overlays — keep text readable on left */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-rr-dark from-30% via-rr-dark/80 via-50% to-transparent" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-transparent" />

            <div className="relative z-20 w-full">
                <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-6 sm:pb-10 max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">2026 Programs Now Open</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-4 sm:mb-6">
                        PLAY THE<br /><span className="text-rr-pink">ROYALS WAY.</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-base sm:text-lg md:text-2xl text-white font-semibold mb-2 sm:mb-3">
                        Melbourne's Official Rajasthan Royals Academy.
                    </motion.p>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-sm md:text-lg text-white/75 font-medium mb-6 sm:mb-8 max-w-xl">
                        From elite players to beginners, we provide opportunities for male and female cricketers, players of all ages and abilities. The Royals Way has shaped IPL, global and local cricket stars — now available to cricketers across Melbourne.
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }} className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 max-w-3xl">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 md:p-6">
                        <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3 sm:mb-4">Choose a current program</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                            {PROGRAMS.map(p => p.route ? (
                                <Link key={p.label} to={p.route} className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all group" data-cta={`hero-program-${p.label}`}>
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${p.badgeColor} shrink-0`} />
                                        <div className="min-w-0">
                                            <p className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight truncate">{p.label}</p>
                                            <p className="text-white/50 text-xs font-medium">{p.badge}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                </Link>
                            ) : (
                                <button key={p.label} onClick={onRegisterClick} className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all group w-full text-left">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${p.badgeColor} shrink-0 animate-pulse`} />
                                        <div className="min-w-0">
                                            <p className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight truncate">{p.label}</p>
                                            <p className="text-white/50 text-xs font-medium">{p.badge}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="flex-1 h-px bg-white/15" />
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/15" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button onClick={onRegisterClick} data-cta="hero-register-now" className="flex-1 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.5)] flex items-center justify-center gap-2 group text-sm">
                                Register Now
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                            <a href="#programs" className="flex-1 border border-white/30 hover:border-white/60 text-white font-bold uppercase tracking-widest py-3.5 sm:py-4 rounded-full transition-all text-center text-sm">
                                Explore All Programs
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
            </motion.div>
        </section>
    );
};

export default HomeHero;
