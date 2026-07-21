import React from 'react';
import { motion } from 'framer-motion';
import { DIRECTOR, REGIONAL_COACHES } from './coachData';

const LocationChip = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 bg-rr-pink/10 border border-rr-pink/25 text-rr-pink text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {children}
    </span>
);

const CoachesLeadership = () => {
    return (
        <section className="bg-slate-50 py-24 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Coaching Leadership</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                        Who Leads the Academy
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        Three coaches carry the program — one directs it, two run the regions. Every
                        centre works to the same standards, the same curriculum, the same pathway.
                    </p>
                </div>

                {/* Tier 1 — Director of Cricket */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
                        <div className="relative h-80 md:h-auto">
                            <img
                                src={DIRECTOR.img}
                                alt={DIRECTOR.name}
                                className={`absolute inset-0 w-full h-full object-cover ${DIRECTOR.imgPosition}`}
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="inline-flex self-start items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                                <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Academy Leadership</span>
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight mb-2">
                                {DIRECTOR.name}
                            </h3>
                            <p className="text-sm font-bold text-rr-pink uppercase tracking-widest mb-4">{DIRECTOR.role}</p>
                            <p className="text-rr-charcoal font-medium leading-relaxed mb-6">{DIRECTOR.tagline}</p>
                            <div className="flex flex-wrap gap-2">
                                <LocationChip>{DIRECTOR.region}</LocationChip>
                                {DIRECTOR.credentials.map((c) => (
                                    <span key={c} className="bg-slate-100 text-rr-charcoal text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tier 2 — Regional Head Coaches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {REGIONAL_COACHES.map((coach, i) => (
                        <motion.div
                            key={coach.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-72">
                                {/* Square headshots in a wide crop — bias the window up so caps stay in frame */}
                                <img
                                    src={coach.img}
                                    alt={coach.name}
                                    className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-2">{coach.name}</h3>
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-4">{coach.role}</p>
                                <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-6 flex-1">{coach.tagline}</p>
                                <div className="flex flex-wrap gap-2">
                                    <LocationChip>{coach.region}</LocationChip>
                                    {coach.credentials.slice(0, 2).map((c) => (
                                        <span key={c} className="bg-slate-100 text-rr-charcoal text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoachesLeadership;
