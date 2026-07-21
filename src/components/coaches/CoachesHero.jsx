import React from 'react';
import { motion } from 'framer-motion';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const CoachesHero = () => {
    return (
        <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-rr-dark">
            {/* Background — the coaching group in the Academy nets */}
            <div className="absolute inset-0">
                <img
                    src="/assets/community-coaches.jpg"
                    alt="Rajasthan Royals Academy Melbourne coaches and players in the nets"
                    className="w-full h-full object-cover object-top"
                />
                {/* Busy full-frame group photo — needs a heavy base scrim before the directional fades */}
                <div className="absolute inset-0 bg-rr-dark/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/70 to-transparent md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/60 md:to-transparent" />
            </div>

            <div className="relative w-full max-w-6xl mx-auto px-6 pb-20 pt-40 md:pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">
                        Rajasthan Royals Academy Melbourne
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        The Coaches
                    </h1>
                    <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-2xl mb-10">
                        An academy is only as good as the people on the floor of the nets. Meet the
                        coaching group that leads every session across Mickleham, Hallam and
                        Williamstown — and the standards they hold every player to.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => scrollTo('leadership')}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            Meet the Leadership
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('mission')}
                            className="text-white/80 hover:text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/25 hover:border-white/60 transition-colors w-full sm:w-auto"
                        >
                            Our Mission
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        </section>
    );
};

export default CoachesHero;
