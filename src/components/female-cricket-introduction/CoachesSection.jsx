import React from 'react';
import { motion } from 'framer-motion';

const coaches = [
    {
        name: 'Carly Ray',
        role: 'Head Coach',
        bio: 'An experienced and Rajasthan Royals Accredited coach, Carly is passionate about cricket and the development of females of all ages. A current player herself, Carly leads a team to ensure your daughter receives the coaching needed on her journey through the game.',
        img: '/assets/coaches/carly-ray.png',
        credential: 'Royals Accredited',
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
                        YOUR HEAD <span className="text-rr-pink">COACH</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        The Girls Kickstart Program is led by a Royals accredited female coach — bringing passion, experience, and the Royals Way to every session.
                    </motion.p>
                </div>

                <div className="flex justify-center">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 w-full max-w-sm"
                        >
                            {/* Photo */}
                            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink overflow-hidden">
                                {coach.img ? (
                                    <img
                                        src={coach.img}
                                        alt={coach.name}
                                        className="w-full h-full object-cover object-center"
                                    />
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
                                {/* Credential badge */}
                                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/20 rounded-full px-3 py-1 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink" />
                                    <span className="text-rr-pink text-xs font-bold uppercase tracking-widest">{coach.credential}</span>
                                </div>

                                <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{coach.name}</h3>
                                <p className="text-rr-pink font-bold text-sm uppercase tracking-widest mb-4">{coach.role}</p>
                                <p className="text-rr-charcoal text-sm font-medium leading-relaxed">{coach.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoachesSection;
