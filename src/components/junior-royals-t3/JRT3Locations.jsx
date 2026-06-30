import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

const EARLY_BIRD_END = new Date('2026-07-12T13:00:00Z');
const isEarlyBird = () => new Date() < EARLY_BIRD_END;
const price = () => isEarlyBird() ? '$299' : '$330';

const VENUE_GROUPS = {
    mickleham: [
        { name: 'Ages 7–9',   sessions: ['Tuesdays 6:00pm – 7:00pm', 'Fridays 6:00pm – 7:00pm'] },
        { name: 'Ages 10–12', sessions: ['Tuesdays 7:00pm – 8:00pm', 'Fridays 7:00pm – 8:00pm'] },
        { name: 'Ages 13–15', sessions: ['Tuesdays 8:00pm – 9:00pm', 'Fridays 8:00pm – 9:00pm'] },
    ],
    hallam: [
        { name: 'Ages 7–9',   sessions: null },
        { name: 'Ages 10–12', sessions: null },
        { name: 'Ages 13–15', sessions: null },
    ],
    williamstown: [
        { name: 'Ages 7–9',   sessions: ['Saturdays 2:00pm – 3:00pm'] },
        { name: 'Ages 10–12', sessions: ['Saturdays 3:00pm – 4:00pm (Group 1)', 'Saturdays 4:00pm – 5:00pm (Group 2)'] },
        { name: 'Ages 13–15', sessions: ['Saturdays 5:00pm – 6:00pm'] },
    ],
};

const GroupAccordion = ({ group }) => {
    const [open, setOpen] = useState(false);
    const hasSessions = group.sessions && group.sessions.length > 0;
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                <span className="font-black text-rr-dark text-sm uppercase tracking-wide">{group.name}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 py-3 bg-white space-y-2">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">{price()} per child</p>
                            {hasSessions ? (
                                group.sessions.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-rr-blue shrink-0" />
                                        <span className="text-sm font-medium text-rr-charcoal">{s}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="text-sm font-medium text-slate-400">Session times coming soon — we will notify you by email</span>
                                </div>
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
        name: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham, VIC',
        dates: 'Starting Tuesday 22 July · Tuesdays & Fridays',
        note: 'Indoor cricket facility',
        confirmed: true,
        image: '/assets/jr-bundoora.png',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Mickleham+Indoor+Sports+Centre+VIC',
        tag: 'mickleham',
    },
    {
        area: 'South-Eastern Melbourne',
        name: 'Elite Cricket Centre',
        suburb: 'Hallam, VIC',
        dates: 'Session dates — Coming Soon',
        note: 'Indoor cricket facility',
        image: '/assets/jr-hallam.png',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 60%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=Elite+Cricket+Centre+Hallam+VIC',
        tag: 'hallam',
    },
    {
        area: 'Western Melbourne',
        name: 'The Netz',
        suburb: 'Williamstown, VIC',
        dates: 'Starting Saturday 19 July · Saturdays',
        note: 'Indoor cricket facility',
        confirmed: true,
        image: '/assets/jr-bundoora.png',
        gradient: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        mapsUrl: 'https://maps.google.com/?q=The+Netz+Williamstown+VIC',
        tag: 'williamstown',
    },
];

const JRT3Locations = () => {
    const scrollToForm = () =>
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });

    const earlyBird = isEarlyBird();

    return (
        <section id="locations" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Details</motion.p>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        OUR <span className="text-rr-pink">LOCATIONS, TIMES &amp; PRICING</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        {earlyBird
                            ? <>Early bird pricing at <span className="font-black text-rr-dark">$299</span> — three Melbourne venues, select a location to view age groups and pricing.</>
                            : <>Programs from <span className="font-black text-rr-dark">$330</span> — three Melbourne venues, select a location to view age groups and pricing.</>
                        }
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {locations.map((loc, i) => (
                        <motion.div key={loc.tag} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="h-4" style={{ background: loc.gradient }} />
                            <div className="h-40 overflow-hidden">
                                <img src={loc.image} alt={loc.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">{loc.area}</p>
                                <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{loc.name}</h3>
                                <p className="text-rr-charcoal font-semibold text-sm mb-4">{loc.suburb}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{loc.note}</span>
                                    </div>
                                </div>

                                {loc.confirmed ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                        <p className="text-green-700 text-xs font-bold uppercase tracking-wide">Dates &amp; times confirmed</p>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                                        <p className="text-amber-700 text-xs font-bold uppercase tracking-wide">⏰ Session times &amp; dates coming soon — register now to lock in your place</p>
                                    </div>
                                )}

                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Age Groups &amp; Times</p>
                                <div className="space-y-2 mb-5">
                                    {(VENUE_GROUPS[loc.tag] || []).map(group => (
                                        <GroupAccordion key={group.name} group={group} />
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button onClick={scrollToForm}
                                        className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm">
                                        {earlyBird ? 'Secure Early Bird Spot' : 'Secure Your Place'}
                                    </button>
                                    <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer"
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-rr-dark font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 text-sm text-center">
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

export default JRT3Locations;
