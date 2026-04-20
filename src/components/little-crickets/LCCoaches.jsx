import React from 'react';
import { motion } from 'framer-motion';

const coaches = [
    {
        name: 'Alex Thornhill',
        role: 'Head Coach',
        bio: 'A batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. Alex currently coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College. His technical approach combines video analysis with deep knowledge of what batting looks like at the next level.',
        img: '/assets/coaches/alex-thornhill.jpg',
    },
];

const LCCoaches = () => {
    return (
        <section id="coaches" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        Coaching Staff
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        YOUR <span className="text-rr-pink">COACH</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Junior Royals is delivered by certified coaches trained in the Royals Way — high standards, genuine feedback, and a clear pathway to the next level.
                    </motion.p>
                </div>

                <div className="max-w-sm mx-auto">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 w-full"
                        >
                            {/* Avatar */}
                            <div className="h-56 overflow-hidden bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink">
                                <img
                                    src={coach.img}
                                    alt={coach.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            <div className="p-6">
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

export default LCCoaches;
