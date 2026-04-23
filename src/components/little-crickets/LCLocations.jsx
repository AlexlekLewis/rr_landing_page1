import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

const BUNDOORA_GROUPS = [
    {
        name: 'Ages 7–9', price: '$265',
        sessions: [
            { label: 'Mondays 6:00pm – 7:00pm · From 27 Apr', availability: 'soldout' },
            { label: 'Fridays 6:00pm – 7:00pm · From 1 May', availability: 'soldout' },
        ],
    },
    {
        name: 'Ages 10–12', price: '$290',
        sessions: [
            { label: 'Mondays 7:00pm – 8:00pm · From 27 Apr', availability: 'limited', spots: 1 },
            { label: 'Fridays 7:00pm – 8:00pm · From 1 May', availability: 'limited', spots: 3 },
        ],
    },
    {
        name: 'Ages 13–15', price: '$310',
        sessions: [
            { label: 'Mondays 6:00pm – 7:00pm · From 27 Apr', availability: 'limited', spots: 3 },
            { label: 'Mondays 7:00pm – 8:00pm · From 27 Apr', availability: 'limited', spots: 2 },
            { label: 'Wednesdays 6:00pm – 7:00pm · From 29 Apr', availability: 'soldout' },
            { label: 'Wednesdays 7:00pm – 8:00pm · From 29 Apr', availability: 'limited', spots: 1 },
        ],
    },
];

const HALLAM_GROUPS = [
    { name: 'Ages 7–9',   price: '$330', sessions: ['Mondays 5:30pm – 6:30pm · From 4 May'] },
    { name: 'Ages 10–12', price: '$330', sessions: ['Mondays 6:30pm – 7:30pm · From 4 May'] },
    { name: 'Ages 13–15', price: '$330', sessions: ['Mondays 7:30pm – 8:30pm · From 4 May'] },
];

const AvailabilityBadge = ({ availability, spots }) => {
    if (availability === 'soldout') {
        return <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shrink-0">Sold Out</span>;
    }
    if (availability === 'limited') {
        return <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full shrink-0">{spots} {spots === 1 ? 'Place' : 'Places'} Left</span>;
    }
    return <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full shrink-0">Available</span>;
};

const GroupAccordion = ({ group, showPrice }) => {
    const [open, setOpen] = useState(false);
    const allSoldOut = Array.isArray(group.sessions) && group.sessions.every(s => s.availability === 'soldout');

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
            >
                <div className="flex items-center gap-2">
                    <span className="font-black text-rr-dark text-sm uppercase tracking-wide">{group.name}</span>
                    {allSoldOut && <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">Sold Out</span>}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 py-3 bg-white space-y-2">
                            {showPrice && (
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">{group.price} per child</p>
                            )}
                            {Array.isArray(group.sessions) && group.sessions[0]?.label !== undefined ? (
                                group.sessions.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className={`w-3.5 h-3.5 shrink-0 ${s.availability === 'soldout' ? 'text-slate-300' : 'text-rr-blue'}`} />
                                            <span className={`text-sm font-medium ${s.availability === 'soldout' ? 'text-slate-400 line-through' : 'text-rr-charcoal'}`}>{s.label}</span>
                                        </div>
                                        <AvailabilityBadge availability={s.availability} spots={s.spots} />
                                    </div>
                                ))
                            ) : (
                                group.sessions.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-rr-blue shrink-0" />
                                        <span className="text-sm font-medium text-rr-charcoal">{s}</span>
                                    </div>
                                ))
                            )}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2">
                                <span className="text-sm shrink-0">👕</span>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">Royals training shirt required — available to purchase with your registration.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const locations = [
    {
        area: 'Northern Melbourne',
        name: 'Cutting Edge Cricket',
        suburb: 'Bundoora, VIC',
        dates: 'Starting Monday 27 Apr or Friday 1 May',
        note: 'Indoor cricket facility',
        confirmed: true,
        image: '/assets/jr-bundoora.png',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Cutting+Edge+Cricket+Bundoora+VIC',
        groups: BUNDOORA_GROUPS,
        showPrice: true,
    },
    {
        area: 'South-Eastern Melbourne',
        name: 'Cricket Connect',
        suburb: 'Hallam, VIC',
        dates: 'Starting Monday 4 May · 8 weeks',
        note: 'Indoor cricket facility',
        confirmed: true,
        image: '/assets/jr-hallam.png',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 60%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Cricket+Connect+Hallam+VIC',
        groups: HALLAM_GROUPS,
        showPrice: true,
    },
];

const LCLocations = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="locations" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        Details
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        OUR <span className="text-rr-pink">LOCATIONS, TIMES &amp; PRICING</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Programs priced from <span className="font-black text-rr-dark">$265</span>. Two Melbourne venues — select a location below to view age groups, times and pricing.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {locations.map((loc, i) => (
                        <motion.div
                            key={loc.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                        >
                            <div className="h-4" style={{ background: loc.gradient }} />

                            <div className="h-44 overflow-hidden">
                                <img
                                    src={loc.image}
                                    alt={loc.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-6">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">{loc.area}</p>
                                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-1">{loc.name}</h3>
                                <p className="text-rr-charcoal font-semibold text-sm mb-5">{loc.suburb}</p>

                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.note}</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                    <p className="text-green-700 text-xs font-bold uppercase tracking-wide">Dates &amp; times confirmed</p>
                                </div>

                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Age Groups &amp; Times</p>
                                <div className="space-y-2 mb-6">
                                    {loc.groups.map(group => (
                                        <GroupAccordion key={group.name} group={group} showPrice={loc.showPrice} />
                                    ))}
                                </div>

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

export default LCLocations;
