import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const locations = [
    {
        name: 'Cutting Edge Cricket',
        suburb: 'Bundoora, VIC',
        dates: 'April 8, 9 & 10',
        time: '9:00 AM – 1:00 PM',
        spots: 40,
        soldOut: false,
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Cutting+Edge+Cricket+Bundoora+VIC+3083',
        tag: 'cutting-edge',
        image: '/assets/cec-lanes.jpg',
    },
    {
        name: 'Cricket Connect',
        suburb: 'Hallam, VIC',
        dates: 'April 14, 15 & 16',
        time: '9:00 AM – 1:00 PM',
        spots: 30,
        soldOut: true,
        gradient: 'linear-gradient(135deg, #E11F8F 0%, #1226AA 60%, #001D48 100%)',
        mapsUrl: 'https://maps.google.com/?q=Cricket+Connect+Hallam+VIC',
        tag: 'hallam',
        image: '/assets/hallam-cricket-centre.png',
    },
];

const LocationsSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

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
                        TWO <span className="text-rr-pink">LOCATIONS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Northern Melbourne and South-East Melbourne. Choose the program that works for your family.
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
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border relative ${loc.soldOut ? 'border-slate-200 opacity-75' : 'border-slate-100'}`}
                        >
                            {/* Sold out overlay badge */}
                            {loc.soldOut && (
                                <div className="absolute top-4 right-4 z-10 bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    Sold Out
                                </div>
                            )}

                            {/* Places filling fast badge */}
                            {!loc.soldOut && (
                                <div className="absolute top-4 right-4 z-10 bg-rr-pink text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    2 Spots Remaining
                                </div>
                            )}

                            {/* Gradient header */}
                            <div className={`h-4 ${loc.soldOut ? 'opacity-40' : ''}`} style={{ background: loc.gradient }} />

                            {/* Venue photo */}
                            <div className="h-44 overflow-hidden">
                                <img
                                    src={loc.image}
                                    alt={loc.name}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${loc.soldOut ? 'grayscale' : 'hover:scale-105'}`}
                                />
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">{loc.name}</h3>
                                <p className={`font-bold text-sm uppercase tracking-widest mb-6 ${loc.soldOut ? 'text-slate-400' : 'text-rr-pink'}`}>{loc.suburb}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.time} daily</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className={`font-semibold text-sm ${loc.soldOut ? 'text-slate-400' : 'text-rr-charcoal'}`}>
                                            {loc.soldOut ? '0 spots remaining — sold out' : loc.tag === "cutting-edge" ? "2 spots remaining" : `${loc.spots} spots available`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {loc.soldOut ? (
                                        <button
                                            onClick={scrollToForm}
                                            className="flex-1 bg-slate-200 text-slate-500 font-bold uppercase tracking-widest py-3 rounded-full text-sm cursor-pointer hover:bg-slate-300 transition-colors"
                                        >
                                            Join Waitlist
                                        </button>
                                    ) : (
                                        <button
                                            onClick={scrollToForm}
                                            className="flex-1 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm"
                                        >
                                            Secure Your Place
                                        </button>
                                    )}
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
