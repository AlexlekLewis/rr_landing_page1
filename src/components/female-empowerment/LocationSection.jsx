import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const LocationSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-slate-50 border-t-8" style={{ borderImage: 'linear-gradient(90deg, #1226AA, #E11F8F) 1' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6"
                    >
                        PROGRAM <span className="text-rr-pink">LOCATION</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        All sessions are held at a state-of-the-art indoor facility in northern Melbourne. Dates and times will be confirmed shortly — register now to secure your place.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                >
                    {/* Gradient bar */}
                    <div className="h-4" style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }} />

                    {/* Venue photo */}
                    <div className="h-56 overflow-hidden">
                        <img
                            src="/assets/fe-batting-drive.jpeg"
                            alt="Female cricketer batting"
                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="p-8 md:p-10">
                        <div className="md:flex md:items-start md:gap-10">
                            <div className="flex-1 mb-8 md:mb-0">
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-1">Northern Melbourne</p>
                                <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-1">
                                    Bundoora Indoor Sports Centre
                                </h3>
                                <p className="text-rr-charcoal font-semibold text-sm mb-6">Bundoora, VIC</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Dates TBC</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Times TBC</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Full Court + Net Set Up</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-rr-blue shrink-0" />
                                        <span className="text-rr-charcoal font-semibold text-sm">Max 30 participants per cohort</span>
                                    </div>
                                </div>

                                <div className="bg-rr-pink/5 border border-rr-pink/20 rounded-xl px-4 py-3">
                                    <p className="text-rr-pink text-xs font-bold uppercase tracking-wide">
                                        Dates & times being finalised — register now to hold your spot.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 md:w-56">
                                <button
                                    onClick={scrollToForm}
                                    className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-sm"
                                >
                                    Secure Your Place
                                </button>
                                <a
                                    href="https://maps.google.com/?q=Bundoora+Indoor+Sports+Centre+VIC"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-rr-dark font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 text-sm text-center"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LocationSection;
