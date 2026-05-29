import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const LOCATIONS = [
    {
        name: 'Elite Cricket Centre',
        suburb: 'Hallam',
        region: 'South East Melbourne',
        accent: 'bg-rr-pink',
    },
    {
        name: 'Cutting Edge Cricket',
        suburb: 'Bundoora',
        region: 'North Melbourne',
        accent: 'bg-rr-blue',
    },
    {
        name: 'The Netz',
        suburb: 'Williamstown',
        region: 'West Melbourne',
        accent: 'bg-gradient-to-br from-rr-pink to-rr-blue',
    },
];

const LocationsSection = () => {
    return (
        <section className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        TRAIN ACROSS <span className="text-rr-pink">MELBOURNE</span>
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        Three elite venues. One performance environment.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {LOCATIONS.map((loc, idx) => (
                        <motion.div
                            key={loc.name}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-rr-pink/40 transition-all duration-300 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 ${loc.accent}`} />

                            <div className="w-14 h-14 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center mb-6">
                                <MapPin className="w-7 h-7 text-rr-pink" />
                            </div>

                            <div className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">
                                {loc.region}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mb-2">
                                {loc.name}
                            </h3>

                            <div className="text-lg font-bold text-white/80 uppercase tracking-wide">
                                {loc.suburb}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationsSection;
