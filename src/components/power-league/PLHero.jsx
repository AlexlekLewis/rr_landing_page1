import React from 'react';
import { motion } from 'framer-motion';
import { MATCH, nominationsClosed } from './plOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const PLHero = () => {
    const closed = nominationsClosed();
    return (
    <section className="relative min-h-[82vh] flex items-end overflow-hidden bg-rr-dark">
        <div className="absolute inset-0">
            <img src="/assets/cec-lanes.jpg" alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-rr-dark/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/70 md:to-transparent" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 pt-36 md:pb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
                <span className="inline-block bg-rr-pink text-white text-xs md:text-sm font-black uppercase tracking-[0.25em] rounded-full px-5 py-2 mb-6">
                    {closed ? 'Nominations have closed' : `Nominations close ${MATCH.closes}`}
                </span>

                <h1 className="font-black text-white uppercase tracking-tighter mb-6 max-w-4xl">
                    <span className="block text-5xl md:text-7xl lg:text-8xl leading-[0.88]">Power League</span>
                    <span className="block text-2xl md:text-4xl lg:text-5xl leading-[1.05] mt-3 text-rr-pink">
                        Put your hand up for a game
                    </span>
                </h1>

                <p className="text-lg md:text-2xl text-white font-bold leading-snug max-w-2xl mb-4">
                    A Rajasthan Royals Academy T20 match day at Montmorency Park, Melbourne, on{' '}
                    <strong className="text-rr-pink">{MATCH.date}</strong>, open to players aged 10 to 25
                    from any club.
                </p>
                <p className="text-base md:text-lg text-white/75 font-medium leading-relaxed max-w-2xl mb-8">
                    Nominate by <strong className="text-white">{MATCH.closes}</strong>. Picked players
                    hear from us by <strong className="text-white">{MATCH.notifyBy}</strong> and pay{' '}
                    {MATCH.fee} for their game. Nothing is paid unless the player is picked.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    {!closed && <button
                        onClick={() => scrollTo('nominate')}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        Nominate a player
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>}
                    <button
                        onClick={() => scrollTo('squads')}
                        className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/50 transition-all duration-300"
                    >
                        What the squads are
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 max-w-3xl">
                    {[
                        ['When', `${MATCH.date}. ${MATCH.time}.`],
                        ['Where', `${MATCH.where} (Lower Plenty and Montmorency grounds)`],
                        ['Cost', `${MATCH.fee} for the game, only if picked`],
                        ['Ages', `${MATCH.ages}, from any club`],
                    ].map(([t, d]) => (
                        <div key={t} className="border-t border-white/25 pt-3">
                            <p className="text-white text-sm font-black uppercase tracking-wide mb-1.5">{t}</p>
                            <p className="text-white/70 text-[13px] font-medium leading-snug">{d}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
    </section>
    );
};

export default PLHero;
