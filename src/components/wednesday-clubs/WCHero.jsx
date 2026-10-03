import React from 'react';
import { motion } from 'framer-motion';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const WCHero = ({ club }) => {
    const [squad, open] = club.prices;
    const [title1, title2] = club.name.split(' ');

    return (
        <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-rr-dark">
            <div className="absolute inset-0">
                <img
                    src="/assets/cec-lanes.jpg"
                    alt="Indoor lanes at a Rajasthan Royals Academy Melbourne centre"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-rr-dark/65" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/60 md:to-transparent" />
            </div>

            <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 pt-40 md:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            {club.startDate ? `Starts ${club.startDate}` : 'Registering interest now'}
                        </span>
                    </div>

                    <p className="text-sm md:text-base font-black text-white/70 uppercase tracking-[0.25em] mb-3">
                        Rajasthan Royals Academy Melbourne
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        {title1}<br />{title2}
                    </h1>

                    {/* The two things people ask first: who it's for, and whether they can get in. */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-rr-pink text-white text-sm md:text-base font-black uppercase tracking-widest rounded-full px-5 py-2.5">
                            {club.tagline}
                        </span>
                        <span className="border-2 border-white/35 text-white text-sm md:text-base font-black uppercase tracking-widest rounded-full px-5 py-2.5">
                            {club.players} aged {club.ages}
                        </span>
                    </div>

                    <p className="text-lg md:text-2xl text-white font-bold leading-snug max-w-2xl mb-5">
                        {club.hero.lead}
                    </p>

                    {club.hero.body.map((p, i) => (
                        <p
                            key={i}
                            className={`text-base md:text-lg text-white/75 font-medium leading-relaxed max-w-2xl ${
                                i === club.hero.body.length - 1 ? 'mb-8' : 'mb-4'
                            }`}
                        >
                            {p}
                        </p>
                    ))}

                    {/* Faces up front: the coach is most of the reason to pick a club. */}
                    <button
                        onClick={() => scrollTo('coaches')}
                        className="flex items-center gap-4 mb-10 group text-left"
                    >
                        <span className="flex -space-x-3">
                            {club.coaches.map((c) => (
                                <img
                                    key={c.name}
                                    src={c.photo}
                                    alt={c.name}
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover object-top border-2 border-rr-pink bg-rr-pink"
                                />
                            ))}
                        </span>
                        <span>
                            <span className="block text-xs font-black text-rr-pink uppercase tracking-[0.2em] mb-1">
                                Mentored by
                            </span>
                            <span className="block text-white text-base md:text-lg font-black uppercase tracking-wide group-hover:underline underline-offset-4">
                                {club.mentors}
                            </span>
                        </span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 max-w-3xl mb-10">
                        {club.hero.facts.map((f) => (
                            <div key={f.title} className="border-t border-white/25 pt-3">
                                <p className="text-white text-sm font-black uppercase tracking-wide leading-tight mb-1.5">
                                    {f.title}
                                </p>
                                <p className="text-white/65 text-[13px] font-medium leading-snug">{f.detail}</p>
                            </div>
                        ))}
                    </div>

                    {/* The price, above the fold. People ask this second, after "is it for me". */}
                    <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 max-w-3xl mb-10 backdrop-blur-sm">
                        <p className="text-xs font-black text-rr-pink uppercase tracking-[0.25em] mb-3">
                            What it costs
                        </p>
                        <p className="text-white text-base md:text-lg font-bold leading-relaxed mb-2">
                            <span className="text-2xl md:text-3xl font-black">{squad.headline}</span> for all {club.weeks} nights
                            if you are in a Royals Academy Performance Squad.
                            <span className="text-white/60"> That is {squad.nightly} a night, GST included.</span>
                        </p>
                        <p className="text-white text-base md:text-lg font-bold leading-relaxed mb-3">
                            <span className="text-2xl md:text-3xl font-black">{open.headline}</span> for all {club.weeks} nights
                            if you are not.
                            <span className="text-white/60"> That is {open.nightly} a night, GST included.</span>
                        </p>
                        <button
                            onClick={() => scrollTo('pricing')}
                            className="text-rr-pink hover:text-white text-[13px] font-bold uppercase tracking-widest underline underline-offset-4 transition-colors"
                        >
                            See how paying works
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => scrollTo('apply')}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Register your interest
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('coaches')}
                            className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/50 transition-all duration-300"
                        >
                            {club.coaches.length > 1 ? 'Meet the coaches' : 'Meet the coach'}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        </section>
    );
};

export default WCHero;
