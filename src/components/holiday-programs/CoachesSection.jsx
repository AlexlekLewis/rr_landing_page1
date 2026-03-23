import React from 'react';
import { motion } from 'framer-motion';

// ⚠️ ACTION REQUIRED: Replace placeholder data with real coach details before go-live
const coaches = [
    {
        name: 'Alex Thornhill',
        role: 'Head Coach',
        bio: 'A batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. Alex currently coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College. His technical approach combines video analysis with deep knowledge of what batting looks like at the next level.',
        img: '/assets/coaches/alex-thornhill.jpg',
    },
    {
        name: 'Lahiru Thirimanne',
        role: 'Specialist Coach',
        bio: 'Former Sri Lanka international and 2014 ICC World Twenty20 winner. A left-handed opening batter who represented Sri Lanka across all three formats, Lahiru brings firsthand experience of performing at the highest level of the game. Now based in Melbourne, he brings genuine international pedigree and a deep understanding of top-order batting to the RRA coaching environment.',
        img: '/assets/coaches/lahiru-thirimanne.jpg',
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
                        Every RRA clinic is run by certified coaches trained in the Royals Way — high standards, genuine feedback, no filler.
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
                                <p className="text-rr-pink font-bold text-sm uppercase tracking-widest mb-4">{coach.role}</p>
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
                    Full coach details will be confirmed and updated prior to each clinic date.
                </motion.p>
            </div>
        </section>
    );
};

export default CoachesSection;
