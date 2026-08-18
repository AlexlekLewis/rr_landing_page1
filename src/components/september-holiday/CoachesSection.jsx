import React from 'react';
import { motion } from 'framer-motion';

// ⚠️ ACTION REQUIRED: Replace placeholder data with real coach details before go-live
const coaches = [
    {
        name: 'Alex Lewis',
        role: 'Lead Coach — Mickleham',
        bio: 'Rajasthan Royals Academy Melbourne Head Coach. Over 20 years coaching cricketers through representative pathways. A current premier-cricket senior assistant and bowling coach, Alex coaches the individual\u2019s game, not a template \u2014 building better cricketers, sharper athletes and tougher competitors.',
        img: '/assets/coaches/alex-lewis.jpg',
    },
    {
        name: 'Alex Thornhill',
        role: 'Lead Coach — Cranbourne North',
        bio: 'Rajasthan Royals Academy Melbourne Elite Program Coach. A batting specialist with experience in England\u2019s County cricket and the Australian premier system. Alex coaches the Fitzroy Doncaster Academy and leads the cricket program at Xavier College. His technical approach combines practical coaching with deep knowledge of what it takes to excel at the next level.',
        img: '/assets/coaches/alex-thornhill.jpg',
    },
];

const CoachesSection = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        YOUR <span className="text-rr-pink">COACHES</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        The Junior Royals Holiday Camp is run by certified coaches trained in the Royals Way — high standards, genuine feedback, no filler.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-10">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.role + i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 w-full"
                        >
                            {/* Avatar */}
                            <div className="h-56 flex items-center justify-center bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink">
                                {coach.img ? (
                                    <img src={coach.img} alt={coach.name} className="w-full h-full object-cover object-top" />
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                            <span className="text-4xl">👤</span>
                                        </div>
                                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Photo Coming Soon</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{coach.name}</h3>
                                <p className="text-rr-pink font-bold text-sm uppercase tracking-widest mb-2">{coach.role}</p>
                                {coach.badge && (
                                    <span className="inline-flex items-center bg-rr-blue/10 border border-rr-blue/20 text-rr-blue text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                                        {coach.badge}
                                    </span>
                                )}
                                {coach.location && (
                                    <span className="inline-flex items-center gap-1.5 bg-rr-blue/10 border border-rr-blue/20 text-rr-blue text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {coach.location}
                                    </span>
                                )}
                                <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-4">{coach.bio}</p>

                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Disclaimer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-rr-charcoal/60 text-xs font-medium"
                >
                    Full coach details will be confirmed and updated prior to each camp date.
                </motion.p>
            </div>
        </section>
    );
};

export default CoachesSection;
