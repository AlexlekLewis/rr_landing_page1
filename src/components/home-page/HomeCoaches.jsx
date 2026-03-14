import React from 'react';
import { motion } from 'framer-motion';

const coaches = [
    {
        name: 'Siddhartha Lahiri',
        role: 'Rajasthan & Paarl Royals Performance Coach, Head of Global Academies',
        org: 'Rajasthan Royals Group',
        bio: 'With deep roots in the Rajasthan Royals organisation, Siddhartha leads the RRA Melbourne vision — bridging IPL-level performance philosophy with grassroots cricket development across Victoria.',
        image: '/assets/coaches/siddhartha-lahiri.jpg',
        initials: 'SL',
    },
    {
        name: 'Andy Crook',
        role: 'Director of Cricket',
        org: 'Rajasthan Royals Academy Melbourne',
        bio: 'An experienced professional cricketer, coach and sports executive, Andy oversees the coaching standards and program delivery across all RRA Melbourne programs, ensuring every session reflects the Royals Way.',
        image: '/assets/coaches/andy-crook.jpg',
        initials: 'AC',
    },
];

const HomeCoaches = () => {
    return (
        <section id="coaches" className="py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                        LEADING THE <span className="text-rr-pink">ROYALS ACADEMY</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        Our leadership team brings IPL franchise experience and elite playing and coaching credentials directly to Melbourne cricketers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                            {/* Photo */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                {coach.image ? (
                                    <img
                                        src={coach.image}
                                        alt={coach.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-5xl text-white"
                                        style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }}>
                                        {coach.initials}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/40 to-transparent" />
                            </div>

                            {/* Text */}
                            <div className="p-6">
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-0.5">{coach.name}</h3>
                                <p className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-widest mb-1">{coach.org}</p>
                                <p className="text-xs sm:text-sm font-bold text-rr-pink uppercase tracking-widest mb-3 leading-tight">{coach.role}</p>
                                <p className="text-sm text-rr-charcoal/80 font-medium leading-relaxed">{coach.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Community photo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative rounded-2xl overflow-hidden"
                >
                    <img
                        src="/assets/community-coaches.jpg"
                        alt="RRA Melbourne — coaches and community"
                        className="w-full object-cover max-h-[480px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white font-black uppercase tracking-wide text-lg">March Junior Program Intake</p>
                        <p className="text-white/70 text-sm font-medium mt-1">The coaches, players and families make RRA Melbourne what it is.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeCoaches;
