import React from 'react';
import { motion } from 'framer-motion';

const coaches = [
    {
        name: 'Siddhartha Lahiri',
        role: 'Head of Academy',
        bio: 'With deep roots in the Rajasthan Royals organisation, Siddhartha leads the RRA Melbourne vision — bridging IPL-level performance philosophy with grassroots cricket development across Victoria.',
        image: null, // Replace with: '/assets/coaches/siddhartha-lahiri.jpg'
        initials: 'SL',
    },
    {
        name: 'Andy Crook',
        role: 'Director of Coaching',
        bio: 'An experienced elite cricket coach and administrator, Andy oversees the coaching standards and program delivery across all RRA Melbourne programs, ensuring every session reflects the Royals Way.',
        image: null, // Replace with: '/assets/coaches/andy-crook.jpg'
        initials: 'AC',
    },
];

const HomeCoaches = () => {
    return (
        <section id="coaches" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Leadership</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-4">
                        THE PEOPLE BEHIND <span className="text-rr-pink">THE ROYALS WAY</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        Our leadership brings IPL franchise experience and elite coaching credentials directly to Melbourne cricketers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col sm:flex-row gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                            {/* Avatar */}
                            <div className="shrink-0">
                                {coach.image ? (
                                    <img
                                        src={coach.image}
                                        alt={coach.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl text-white"
                                        style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }}>
                                        {coach.initials}
                                    </div>
                                )}
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">{coach.name}</h3>
                                <p className="text-sm font-bold text-rr-pink uppercase tracking-widest mb-3">{coach.role}</p>
                                <p className="text-sm text-rr-charcoal/80 font-medium leading-relaxed">{coach.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCoaches;
