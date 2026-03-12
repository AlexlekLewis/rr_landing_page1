import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown, ArrowRight, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AGE_GROUPS = ['All Ages', 'U10', 'U12', 'U14', 'U16', 'U18', 'Adult'];
const SKILL_LEVELS = ['All Skill Levels', 'Beginner', 'Intermediate', 'Advanced', 'Elite'];
const GENDER_OPTIONS = ['All', 'Male', 'Female', 'Mixed'];

// Urgency badge config
const URGENCY_CONFIG = {
    closing_soon: { text: 'Registration Closing Soon', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500', textColor: 'text-orange-500' },
    limited_places: { text: 'Limited Places', bg: 'bg-rr-pink/10', border: 'border-rr-pink/30', dot: 'bg-rr-pink', textColor: 'text-rr-pink' },
    spots_remaining: { text: '{n} Places Remaining', bg: 'bg-rr-pink/10', border: 'border-rr-pink/30', dot: 'bg-rr-pink', textColor: 'text-rr-pink' },
    open: { text: 'Now Open', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500', textColor: 'text-green-600' },
    waitlist: { text: 'Join Waitlist', bg: 'bg-slate-200/50', border: 'border-slate-300', dot: 'bg-slate-400', textColor: 'text-slate-500' },
    coming_soon: { text: 'Coming Soon', bg: 'bg-rr-blue/10', border: 'border-rr-blue/30', dot: 'bg-rr-blue', textColor: 'text-rr-blue' },
};

const UrgencyBadge = ({ type, spots, customText }) => {
    const config = URGENCY_CONFIG[type] || URGENCY_CONFIG['open'];
    const label = customText || (type === 'spots_remaining' && spots ? `${spots} Places Remaining` : config.text);
    return (
        <span className={`inline-flex items-center gap-1.5 ${config.bg} border ${config.border} rounded-full px-3 py-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
            <span className={`text-xs font-bold ${config.textColor} uppercase tracking-widest`}>{label}</span>
        </span>
    );
};

const ProgramCard = ({ program, onRegisterClick }) => {
    const isComingSoon = program.program_id === '__coming_soon__';

    if (isComingSoon) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-10 text-center min-h-[320px]"
            >
                <div className="w-12 h-12 rounded-full bg-rr-pink/10 flex items-center justify-center mb-4">
                    <span className="text-rr-pink font-black text-xl">+</span>
                </div>
                <h3 className="text-lg font-black text-rr-charcoal uppercase tracking-wide mb-2">More Programs Coming</h3>
                <p className="text-sm text-rr-charcoal/60 font-medium mb-6">Register your interest and we'll notify you when new programs are announced.</p>
                <button
                    onClick={onRegisterClick}
                    className="bg-rr-dark text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-rr-charcoal transition-colors"
                >
                    Stay Informed
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={program.image_url || '/assets/hero-celebration-new.jpg'}
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 to-transparent" />
                {/* Urgency badge on image */}
                <div className="absolute bottom-3 left-3">
                    <UrgencyBadge
                        type={program.urgency_type}
                        spots={program.spots_remaining}
                        customText={program.urgency_text}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-2">{program.name}</h3>
                <p className="text-sm text-rr-charcoal/80 font-medium leading-relaxed mb-4 flex-1">{program.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {program.age_groups?.map(ag => (
                        <span key={ag} className="text-xs font-bold bg-slate-100 text-rr-charcoal rounded-full px-3 py-1 uppercase tracking-wide">{ag}</span>
                    ))}
                    {program.gender && program.gender !== 'mixed' && (
                        <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1 uppercase tracking-wide">{program.gender}</span>
                    )}
                </div>

                {/* CTA */}
                <Link
                    to={program.route}
                    className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] flex items-center justify-center gap-2 group/btn text-sm"
                    data-cta={`program-card-${program.program_id}`}
                >
                    {program.urgency_type === 'waitlist' ? 'Join Waitlist' : 'View Program'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};

const HomeProgramCards = ({ onRegisterClick }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postcode, setPostcode] = useState('');
    const [selectedAge, setSelectedAge] = useState('All Ages');
    const [selectedSkill, setSelectedSkill] = useState('All Skill Levels');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedProgram, setSelectedProgram] = useState('All Programs');

    useEffect(() => {
        const fetchPrograms = async () => {
            const { data, error } = await supabase
                .from('programs_config')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (!error && data) setPrograms(data);
            setLoading(false);
        };
        fetchPrograms();
    }, []);

    const programNames = ['All Programs', ...programs.map(p => p.name)];

    const filtered = programs.filter(p => {
        if (selectedAge !== 'All Ages' && !p.age_groups?.includes(selectedAge)) return false;
        if (selectedSkill !== 'All Skill Levels' && !p.skill_levels?.includes(selectedSkill)) return false;
        if (selectedGender !== 'All' && p.gender !== 'mixed' && p.gender?.toLowerCase() !== selectedGender.toLowerCase()) return false;
        if (selectedProgram !== 'All Programs' && p.name !== selectedProgram) return false;
        return true;
    });

    const displayCards = [...filtered, { program_id: '__coming_soon__' }];

    return (
        <section id="programs" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-4">
                        FIND YOUR <span className="text-rr-pink">PROGRAM</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        From elite 12-week intensives to holiday clinics — there's a Royals program for every cricketer.
                    </p>
                </motion.div>

                {/* Search + Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Postcode */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rr-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Postcode"
                                value={postcode}
                                onChange={e => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark placeholder:text-rr-charcoal/40 focus:outline-none focus:border-rr-pink transition-colors"
                            />
                        </div>

                        {/* Program */}
                        <div className="relative">
                            <select
                                value={selectedProgram}
                                onChange={e => setSelectedProgram(e.target.value)}
                                className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark focus:outline-none focus:border-rr-pink transition-colors bg-white"
                            >
                                {programNames.map(n => <option key={n}>{n}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rr-charcoal/40 pointer-events-none" />
                        </div>

                        {/* Age */}
                        <div className="relative">
                            <select
                                value={selectedAge}
                                onChange={e => setSelectedAge(e.target.value)}
                                className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark focus:outline-none focus:border-rr-pink transition-colors bg-white"
                            >
                                {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rr-charcoal/40 pointer-events-none" />
                        </div>

                        {/* Skill */}
                        <div className="relative">
                            <select
                                value={selectedSkill}
                                onChange={e => setSelectedSkill(e.target.value)}
                                className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark focus:outline-none focus:border-rr-pink transition-colors bg-white"
                            >
                                {SKILL_LEVELS.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rr-charcoal/40 pointer-events-none" />
                        </div>

                        {/* Gender */}
                        <div className="relative">
                            <select
                                value={selectedGender}
                                onChange={e => setSelectedGender(e.target.value)}
                                className="w-full appearance-none px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-rr-dark focus:outline-none focus:border-rr-pink transition-colors bg-white"
                            >
                                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rr-charcoal/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Search button */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <button
                            onClick={() => document.getElementById('program-results')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(229,6,149,0.4)] flex items-center justify-center gap-2 group text-sm"
                        >
                            <Search className="w-4 h-4" />
                            Search Programs
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        {(selectedAge !== 'All Ages' || selectedSkill !== 'All Skill Levels' || selectedGender !== 'All' || selectedProgram !== 'All Programs' || postcode) && (
                            <button
                                onClick={() => { setPostcode(''); setSelectedAge('All Ages'); setSelectedSkill('All Skill Levels'); setSelectedGender('All'); setSelectedProgram('All Programs'); }}
                                className="text-xs font-bold text-rr-charcoal/50 hover:text-rr-pink underline transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>

                    {/* Active filter tags */}
                    {(selectedAge !== 'All Ages' || selectedSkill !== 'All Skill Levels' || selectedGender !== 'All' || selectedProgram !== 'All Programs' || postcode) && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-wide self-center">Filters:</span>
                            {postcode && <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1">Near {postcode}</span>}
                            {selectedProgram !== 'All Programs' && <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1">{selectedProgram}</span>}
                            {selectedAge !== 'All Ages' && <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1">{selectedAge}</span>}
                            {selectedSkill !== 'All Skill Levels' && <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1">{selectedSkill}</span>}
                            {selectedGender !== 'All' && <span className="text-xs font-bold bg-rr-pink/10 text-rr-pink rounded-full px-3 py-1">{selectedGender}</span>}
                            <button
                                onClick={() => { setPostcode(''); setSelectedAge('All Ages'); setSelectedSkill('All Skill Levels'); setSelectedGender('All'); setSelectedProgram('All Programs'); }}
                                className="text-xs font-bold text-rr-charcoal/50 hover:text-rr-pink underline transition-colors ml-1"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Cards grid */}
                <div id="program-results">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-80" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayCards.map(p => (
                                <ProgramCard key={p.program_id} program={p} onRegisterClick={onRegisterClick} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {filtered.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-rr-charcoal font-medium mb-4">No programs match your current filters.</p>
                        <button
                            onClick={onRegisterClick}
                            className="bg-rr-pink text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full text-sm hover:bg-rr-light-pink transition-colors"
                        >
                            Register Interest for Future Programs
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default HomeProgramCards;
export { UrgencyBadge };
