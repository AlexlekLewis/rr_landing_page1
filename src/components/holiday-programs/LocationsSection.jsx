import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const locations = [
    {
        name: 'Cutting Edge Cricket',
        suburb: 'Bundoora, VIC',
        region: 'Northern Melbourne',
        venue: 'Cutting Edge Cricket',
        tag: 'bundoora',
        dates: 'Tuesday 30 June – Thursday 2 July',
        time: '9:00 AM – 1:00 PM',
    },
    {
        name: 'Hallam',
        suburb: 'Hallam, VIC',
        region: 'South-East Melbourne',
        venue: 'Hallam',
        tag: 'hallam',
    },
];

const LocationsSection = () => (
    <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-5 py-2 mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-black text-rr-pink uppercase tracking-widest">5 Locations Across Melbourne</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                >
                    FIND YOUR <span className="text-rr-pink">NEAREST CAMP</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                >
                    Northern and south-east Melbourne. Register now and secure your Early Bird spot.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((loc, i) => (
                    <motion.div
                        key={loc.tag}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative"
                    >
                        {/* Opening Soon badge */}
                        <div className="absolute top-4 right-4 z-10 bg-rr-blue text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Opening Soon
                        </div>

                        {/* Gradient header */}
                        <div className="h-2" style={{ background: 'linear-gradient(90deg, #001D48, #1226AA, #E11F8F)' }} />

                        <div className="p-7">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-4 h-4 text-rr-pink mt-1 shrink-0" />
                                <div>
                                    <h3 className="text-base font-black text-rr-dark uppercase tracking-wide leading-tight">{loc.region}</h3>
                                    <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mt-0.5">{loc.suburb}</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-400 font-semibold text-sm">{loc.dates ? loc.dates : 'Dates Coming Soon'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-400 font-semibold text-sm">{loc.time ? loc.time + ' daily' : 'Times Coming Soon'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-400 font-semibold text-sm">Venue — {loc.venue}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registration opens soon</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default LocationsSection;
