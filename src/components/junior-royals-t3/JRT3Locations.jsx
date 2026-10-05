import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { JR_T4 } from './jrTerm4Data';

// Term 4 centres only. The Term 3 cards, session accordions and prices were
// removed on 3 Oct 2026 (Term 3 finished 18–19 Sep). Hallam and Williamstown
// have no Term 4, so they get one plain line instead of a card — a card reads
// as a Term 4 venue. Centres and dates come from jrTerm4Data.js.
const JRT3Locations = () => {
    const scrollToForm = () =>
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section id="locations" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Details</motion.p>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        WHERE <span className="text-rr-pink">&amp; WHEN</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Term 4 runs at two centres, on <span className="font-black text-rr-dark">Wednesday nights from {JR_T4.datesLong}</span>. {JR_T4.centresApart}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {JR_T4.centres.map((loc, i) => (
                        <motion.div key={loc.value} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                            <div className="h-4" style={{ background: loc.gradient }} />
                            <div className="h-40 overflow-hidden">
                                <img src={loc.image} alt={`${loc.venue}, ${loc.suburb}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">{loc.region}</p>
                                <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{loc.venue}</h3>
                                <p className="text-rr-charcoal font-semibold text-sm mb-4">{loc.address}</p>

                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-pink shrink-0" />
                                        <span className="text-rr-dark font-black text-sm">{JR_T4.night} {JR_T4.times}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">{JR_T4.datesShort} · {JR_T4.weeks} weeks</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-4 h-4 text-rr-blue shrink-0 mt-0.5" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Two one-hour groups on the night, 6:00pm and 7:00pm. We confirm which one your player is in by email.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Indoor cricket facility</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button onClick={scrollToForm} data-cta="Register interest (centre card)" data-cta-target="#registration-form"
                                        className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm">
                                        {JR_T4.ctaLabel}
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

                <p className="text-center text-sm text-rr-charcoal font-medium mt-10 max-w-2xl mx-auto">
                    {JR_T4.twoCentres} {JR_T4.centresApart}
                </p>
            </div>
        </section>
    );
};

export default JRT3Locations;
