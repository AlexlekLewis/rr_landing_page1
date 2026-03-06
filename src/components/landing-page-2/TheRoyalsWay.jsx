import React from 'react';
import { motion } from 'framer-motion';

const TheRoyalsWay = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const pillars = [
        { title: "Talent First", desc: "Spot potential early and back it. We select on where players are headed, not just where they've been." },
        { title: "Play the Future", desc: "Technology and data guide decisions — but never replace good coaching judgment. We try new things and keep improving." },
        { title: "Learn by Doing", desc: "Players learn through match simulations and real scenarios. Make a mistake, learn from it, adjust — that's real improvement." },
        { title: "Play Bold", desc: "We reward smart intent and calculated risks — not just results, but the quality of the decisions behind them." },
        { title: "Joy, Curiosity & Lifelong Learning", desc: "Curious players improve faster. Our coaches never stop learning either." },
        { title: "Holistic Development", desc: "Skills, fitness, mindset, recovery, and life off the field. We develop the person, not just the cricketer." },
        { title: "Fairness, Respect & Inclusion", desc: "Every player gets genuine attention. No favourites, no shortcuts. Diverse backgrounds make the group stronger." },
    ];

    return (
        <section className="py-20 px-6 lg:px-8 relative z-10 bg-slate-50 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rr-pink/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                {/* Jaiswal Image */}
                <motion.div variants={fadeIn} className="relative w-full h-40 md:aspect-video md:h-auto rounded-2xl overflow-hidden mb-10 shadow-xl border border-slate-200 group">
                    <img
                        src="/assets/lp2/jaiswal-power-hitting.webp"
                        alt="Yashasvi Jaiswal — Power Hitting"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>

                {/* Heading */}
                <div className="text-center mb-10">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        The Royals Way
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4 mb-4" />
                    <motion.p variants={fadeIn} className="text-base text-slate-600 font-medium max-w-xl mx-auto">
                        The philosophy behind how we coach, develop players, and run our program.
                    </motion.p>
                </div>

                {/* Pillars — compact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`bg-white border border-slate-100 shadow-sm rounded-xl px-5 py-4 flex gap-4 items-start hover:-translate-y-0.5 transition-transform duration-300 relative overflow-hidden
                                ${index === pillars.length - 1 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto' : ''}`}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${index % 2 === 0 ? 'from-rr-pink to-rr-blue' : 'from-rr-blue to-rr-pink'}`} />
                            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-br from-rr-pink to-rr-blue shrink-0 leading-none mt-0.5">
                                {index + 1}.
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-rr-dark mb-1">{pillar.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 pt-14 border-t border-white/10 mt-14">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Entry closes 5pm · March 20 — or when full</span>
                    </div>
                    <a href="#checkout" className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-sm flex items-center gap-3">
                        Secure Your Place Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default TheRoyalsWay;
