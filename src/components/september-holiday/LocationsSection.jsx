import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import DualCTA from './DualCTA';

// CRANBOURNE NORTH ONLY these school holidays (Alex, 26 September 2026).
// The Mickleham camp set for 23–25 September was cancelled, so it is removed
// rather than left on sale — the home page's program card says the same. If a second centre is added, put it back in this array —
// the section counts the array, it does not hard-code "three centres".
const locations = [
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
        // A date a parent can check, not "selling fast" — the calendar does the
        // work here. Three days, starting Wednesday 30 September.
        urgency: 'Starts Wednesday 30 September',
        urgencyColor: 'bg-rr-pink',
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
                    <span className="text-xs font-black text-rr-pink uppercase tracking-widest">One Centre These Holidays</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                >
                    WHERE IT <span className="text-rr-pink">RUNS</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                >
                    These school holidays the program runs at one centre only — the Elite Cricket Centre in
                    Cranbourne North, over three days: Wednesday 30 September, Thursday 1 October and Friday
                    2 October, 9:00 AM to 1:00 PM each day. The Mickleham camp that was set for 23, 24 and 25 September was cancelled. If you are in
                    the north, our weekly Junior Royals program at Mickleham starts back on Wednesday 7 October.
                </motion.p>
            </div>

            {/* With one centre the card is centred instead of being stranded in
                column one of a three-column grid. Add a centre to `locations`
                and the grid widens itself back out. */}
            <div className={`grid gap-6 ${locations.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {locations.map((loc, i) => (
                    <motion.div
                        key={loc.tag}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative"
                    >
                        <div className={`absolute top-4 right-4 z-10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${loc.onSale ? 'bg-rr-pink' : 'bg-rr-blue'}`}>
                            {loc.onSale ? 'On Sale' : 'Taking Interest'}
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
                                    <span className="text-slate-500 font-semibold text-sm">{loc.dates ? loc.dates : 'Three days in the September / October holidays'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span className="text-slate-500 font-semibold text-sm">{loc.time ? loc.time + ' daily' : 'Exact days and times emailed to you once set'}</span>
                                </div>
                                {loc.coach && (
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-rr-pink shrink-0" />
                                    <span className="text-rr-dark font-bold text-sm">Lead Coach: {loc.coach}</span>
                                </div>
                                )}
                            </div>

                            {loc.onSale && loc.urgency && (
                                <div className={`${loc.urgencyColor} rounded-xl px-4 py-2.5 mb-4 flex items-center justify-center gap-2`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <p className="text-white font-black text-[11px] uppercase tracking-widest text-center">{loc.urgency}</p>
                                </div>
                            )}

                            <button
                                onClick={() => document.getElementById('secure-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-3.5 rounded-full text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)]"
                            >
                                {loc.onSale ? 'Secure Your Place Now' : 'Secure Your Place'}
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
