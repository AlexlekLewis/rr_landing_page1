import React from 'react';
import { motion } from 'framer-motion';

// Partner stack — tiered by partnership level.
// Drop real logo files into /public/assets/powergame/partners/ and set the
// `logo` path on each partner. Until then, a clean placeholder is shown.
const TIERS = [
    {
        level: 'Presenting Partner',
        size: 'large',
        partners: [
            { name: 'Total Aluminium', logo: '' },
        ],
    },
    {
        level: 'Venue Partners',
        size: 'medium',
        partners: [
            { name: 'The Netz', logo: '/assets/powergame/partners/the-netz.svg' },
            { name: 'Elite Cricket Centre', logo: '/assets/powergame/partners/elite-cricket-centre.webp' },
        ],
    },
    {
        level: 'Performance Partners',
        size: 'medium',
        partners: [
            { name: 'Str8ght Bat', logo: '' },
            { name: 'Full Track AI', logo: '' },
            { name: 'Shah NeuroVision', logo: '/assets/powergame/partners/shah-neurovision.webp', dark: true },
        ],
    },
];

const sizeClasses = {
    large: 'h-24 md:h-28 px-10',
    medium: 'h-20 md:h-24 px-8',
};

const PartnerLogo = ({ partner, size }) => (
    <div
        className={`flex items-center justify-center rounded-2xl border ${sizeClasses[size]} min-w-[180px] md:min-w-[220px] transition-all duration-300 hover:border-rr-pink/40 hover:shadow-[0_8px_30px_rgba(225,31,143,0.10)] ${partner.dark ? 'bg-rr-dark border-white/10' : 'bg-white border-slate-200'}`}
    >
        {partner.logo ? (
            <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain"
            />
        ) : (
            <div className="text-center">
                <div className="text-[10px] font-bold text-rr-charcoal/40 uppercase tracking-widest mb-1">
                    Logo
                </div>
                <div className="text-sm md:text-base font-black text-rr-dark uppercase tracking-wide leading-tight">
                    {partner.name}
                </div>
            </div>
        )}
    </div>
);

const PartnerStack = () => {
    return (
        <section className="bg-white py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Our Partners
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        POWERED BY OUR <span className="text-rr-pink">PARTNERS</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        The Power Game Program is proudly supported by a network of leading commercial, venue, and performance partners.
                    </p>
                </motion.div>

                <div className="space-y-14">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={tier.level}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                        >
                            <div className="flex items-center gap-4 mb-7">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                                <span className="text-xs md:text-sm font-black text-rr-blue uppercase tracking-widest text-center">
                                    {tier.level}
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
                                {tier.partners.map((partner) => (
                                    <PartnerLogo key={partner.name} partner={partner} size={tier.size} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnerStack;
