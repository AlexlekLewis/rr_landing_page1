import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

// The three centres the Academy currently runs. Exact camp dates and daily times
// are deliberately NOT stated — they are set once we see where the interest is,
// and every family on the interest list is emailed them first.
const locations = [
    {
        name: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham, VIC',
        region: 'Northern Melbourne',
        venue: 'Mickleham Indoor Sports Centre',
        tag: 'mickleham',
        dates: 'September 23, 24 & 25',
        time: '9:00 AM – 1:00 PM',
        onSale: true,
        coach: 'Alex Lewis',
        urgency: 'Early Bird $299 — Ends 11pm Sun 30 Aug',
        urgencyColor: 'bg-rr-pink',
    },
    {
        name: 'Elite Cricket Centre',
        suburb: 'Cranbourne North, VIC',
        region: 'South-East Melbourne',
        venue: 'Elite Cricket Centre',
        tag: 'cranbourne-north',
        dates: 'September 30, October 1 & 2',
        time: '9:00 AM – 1:00 PM',
        onSale: true,
        coach: 'Alex Thornhill',
        urgency: 'Early Bird $299 — Ends 11pm Sun 30 Aug',
        urgencyColor: 'bg-rr-pink',
    },
    {
        name: 'Venue TBC',
        suburb: 'Western Melbourne',
        region: 'Western Melbourne',
        venue: 'TBC',
        tag: 'western-melbourne',
        onSale: false,
    },
    {
        name: 'Venue TBC',
        suburb: 'Eastern Melbourne',
        region: 'Eastern Melbourne',
        venue: 'TBC',
        tag: 'eastern-melbourne',
        onSale: false,
    },
];

const LocationsSection = () => {
    return (
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
                    <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Three Centres Across Melbourne</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                >
                    PICK YOUR <span className="text-rr-pink">CENTRE</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                >
                    The camp runs at our centres across Melbourne. Tell us which one you would come to — the centre
                    with the most interest gets scheduled first, and we email you the dates before anyone else.
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
                        {/* Every centre is at the same stage: taking interest, dates not yet set */}
                        <div className="absolute top-4 right-4 z-10 bg-rr-pink text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Taking Interest
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
                                    <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-500 font-semibold text-sm">Venue — {loc.venue}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-500 font-semibold text-sm">Three days in the September / October holidays</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-500 font-semibold text-sm">Exact days and times emailed to you once set</span>
                                </div>
                            </div>

                            <button
                                onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-3 rounded-full text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)]"
                            >
                                Register Interest
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
    );
};

export default LocationsSection;
