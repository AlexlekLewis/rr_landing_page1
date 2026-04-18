import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const locations = [
    {
        name: 'Bundoora Indoor Sports Centre',
        suburb: 'Bundoora, VIC',
        area: 'Northern Melbourne',
        dates: 'Starting Thursday 7 May 2026 — finishing 26 June 2026',
        time: '5:00 PM – 6:00 PM weekly',
        note: 'Full Court — indoor facility',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Bundoora+Indoor+Sports+Centre+VIC',
        tag: 'bundoora',
        image: '/assets/hallam-cricket-centre.png',
        confirmed: true,
    },
];

const LocationsSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        OUR <span className="text-rr-pink">LOCATION</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Register now to secure your place at Bundoora Indoor Sports Centre — Thursdays from 7 May, 5:00–6:00 PM.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {locations.map((loc, i) => (
                        <motion.div
                            key={loc.tag}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                        >
                            {/* Gradient header bar */}
                            <div className="h-4" style={{ background: loc.gradient }} />

                            {/* Venue photo */}
                            <div className="h-44 overflow-hidden">
                                <img
                                    src={loc.image}
                                    alt={loc.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-8">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">{loc.area}</p>
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">{loc.name}</h3>
                                <p className="text-rr-charcoal font-semibold text-sm mb-6">{loc.suburb}</p>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.note}</span>
                                    </div>
                                </div>

                                {/* Confirmed or TBC notice */}
                                {loc.confirmed ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-wide">
                                            Dates & times confirmed
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-rr-pink/5 border border-rr-pink/20 rounded-xl px-4 py-3 mb-6">
                                        <p className="text-rr-pink text-xs font-bold uppercase tracking-wide">
                                            Dates & times being finalised — register now to hold your spot.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={scrollToForm}
                                        className="flex-1 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm"
                                    >
                                        Secure Your Place
                                    </button>
                                    <a
                                        href={loc.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-rr-dark font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 text-sm text-center"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationsSection;
