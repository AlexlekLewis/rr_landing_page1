import React from 'react';
import { motion } from 'framer-motion';

// Partner stack — tiered by partnership level.
// Drop real logo files into /public/assets/powergame/partners/ and set the
// `logo` path on each partner. Until then, a clean placeholder is shown.
const TIERS = [
    {
        level: 'Venue Partners',
        size: 'medium',
        partners: [
            { name: 'The Netz', logo: '/assets/powergame/partners/the-netz.svg' },
            { name: 'Elite Cricket Centre', logo: '/assets/powergame/partners/elite-cricket-centre.webp' },
            { name: 'Mickleham Indoor Sports Centre', logo: '/assets/powergame/partners/mickleham-isc.png' },
        ],
    },
    {
        level: 'Performance Partners',
        size: 'medium',
        partners: [
            { name: 'The Power Game', logo: '/assets/powergame/power-game-logo-transparent.png', dark: true },
            { name: 'Full Track AI', logo: '/assets/powergame/partners/full-track-ai.png' },
            { name: 'str8bat', logo: '/assets/powergame/partners/str8bat.png' },
            { name: 'Shah NeuroVision', logo: '/assets/powergame/partners/shah-neurovision.webp', dark: true },
            { name: 'Bowlstrong', logo: '/assets/powergame/partners/bowlstrong.png' },
        ],
    },
];

const sizeClasses = {
    large: 'h-24 md:h-28 px-6',
    medium: 'h-20 md:h-24 px-6',
};

const PartnerLogo = ({ partner, size }) => (
    <div
        className={`w-full flex items-center justify-center rounded-2xl border ${sizeClasses[size]} py-4 transition-all duration-300 hover:border-rr-pink/40 hover:shadow-[0_8px_30px_rgba(225,31,143,0.10)] ${partner.dark ? 'bg-rr-dark border-white/10' : 'bg-white border-slate-200'}`}
    >
        {partner.logo ? (
            <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full w-auto max-w-full object-contain"
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

// theme: 'light' (default — white section, used on /elite-royals) or 'dark'
// (transparent over a dark page, used on /performance-squads). Tier data is
// shared, so adding a partner updates every page that renders this component.
const PartnerStack = ({ theme = 'light' }) => {
    const isDark = theme === 'dark';
    return (
        <section className={isDark ? 'py-20 px-5' : 'bg-white py-24 md:py-32'}>
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
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-6 ${isDark ? 'text-white' : 'text-rr-dark'}`}>
                        POWERED BY OUR <span className="text-rr-pink">PARTNERS</span>
                    </h2>
                    <p className={`text-base md:text-lg max-w-2xl mx-auto font-medium ${isDark ? 'text-white/65' : 'text-rr-charcoal'}`}>
                        The Rajasthan Royals Academy is proudly supported by a network of leading commercial, venue, and performance partners.
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
                                <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${isDark ? 'to-white/15' : 'to-slate-200'}`} />
                                <span className={`text-xs md:text-sm font-black uppercase tracking-widest text-center ${isDark ? 'text-rr-light-pink' : 'text-rr-blue'}`}>
                                    {tier.level}
                                </span>
                                <div className={`h-px flex-1 bg-gradient-to-l from-transparent ${isDark ? 'to-white/15' : 'to-slate-200'}`} />
                            </div>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${tier.partners.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5 md:gap-6 ${tier.partners.length >= 3 ? 'max-w-4xl' : 'max-w-2xl'} mx-auto justify-items-center`}>
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
