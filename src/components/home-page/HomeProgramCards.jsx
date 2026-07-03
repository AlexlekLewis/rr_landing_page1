import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Value ladder — highest priority first. Junior Royals is the core, high-value
// program (rendered featured), then Power Game / Elite, then Holiday (the entry point).
const PRIORITY = ['junior-royals-term3', 'power-game-program', 'junior-royals-holiday'];
const rank = (id) => { const i = PRIORITY.indexOf(id); return i === -1 ? 99 : i; };
const ctaLabel = (p) => p.program_id === 'junior-royals-term3' ? 'Join Now' : p.urgency_type === 'waitlist' ? 'Join Waitlist' : 'View Program';

// Urgency badge config
const URGENCY_CONFIG = {
    closing_soon: { text: 'Closing Soon', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500', textColor: 'text-orange-500' },
    limited_places: { text: 'Nearly Full', bg: 'bg-rr-pink/10', border: 'border-rr-pink/30', dot: 'bg-rr-pink', textColor: 'text-rr-pink' },
    spots_remaining: { text: '{n} Places Remaining', bg: 'bg-rr-pink/10', border: 'border-rr-pink/30', dot: 'bg-rr-pink', textColor: 'text-rr-pink' },
    open: { text: 'Now Open', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500', textColor: 'text-green-600' },
    waitlist: { text: 'Join Waitlist', bg: 'bg-slate-200/50', border: 'border-slate-300', dot: 'bg-slate-400', textColor: 'text-slate-500' },
    coming_soon: { text: 'Coming Soon', bg: 'bg-rr-pink/10', border: 'border-rr-pink/30', dot: 'bg-rr-pink', textColor: 'text-rr-pink' },
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

const ProgramCard = ({ program }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
            <img
                src={program.image_url || '/assets/hero-celebration-new.jpg'}
                alt={program.name}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${program.image_position === 'top' ? 'object-top' : 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 to-transparent" />
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

            {/* CTA */}
            <Link
                to={program.route}
                className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] flex items-center justify-center gap-2 group/btn text-sm"
                data-cta={`program-card-${program.program_id}`}
            >
                {program.program_id === 'junior-royals-term3' ? 'Join Now' : program.urgency_type === 'waitlist' ? 'Join Waitlist' : 'View Program'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
        </div>
    </motion.div>
);

// Featured card — the value-ladder #1 (Junior Royals). Wider, image + copy side by side,
// with a "Start here" tag so its priority reads at a glance.
const FeaturedCard = ({ program }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full rounded-2xl overflow-hidden bg-white border-2 border-rr-pink/40 shadow-sm hover:shadow-xl transition-all duration-300 grid md:grid-cols-2 group"
    >
        <div className="relative h-56 md:h-auto md:min-h-[300px] overflow-hidden">
            <img
                src={program.image_url || '/assets/hero-celebration-new.jpg'}
                alt={program.name}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${program.image_position === 'top' ? 'object-top' : 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 to-transparent md:bg-gradient-to-r" />
            <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 bg-rr-pink text-white rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest">Start here · Our core program</span>
            </div>
            <div className="absolute bottom-3 left-3">
                <UrgencyBadge type={program.urgency_type} spots={program.spots_remaining} customText={program.urgency_text} />
            </div>
        </div>
        <div className="p-7 md:p-10 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-wide mb-3">{program.name}</h3>
            <p className="text-sm md:text-base text-rr-charcoal/80 font-medium leading-relaxed mb-6">{program.description}</p>
            <Link
                to={program.route}
                className="self-start bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] inline-flex items-center gap-2 group/btn text-sm"
                data-cta={`program-card-${program.program_id}`}
            >
                {ctaLabel(program)}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
        </div>
    </motion.div>
);

const HomeProgramCards = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section id="programs" className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

                {/* Cards grid — ordered by the value ladder, #1 featured */}
                {loading ? (
                    <div className="flex flex-wrap justify-center gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-full sm:w-[360px] rounded-2xl bg-slate-100 animate-pulse h-80" />
                        ))}
                    </div>
                ) : (() => {
                    const ordered = [...programs].sort((a, b) => rank(a.program_id) - rank(b.program_id));
                    const [featured, ...rest] = ordered;
                    return (
                        <div className="flex flex-col items-center gap-6">
                            {featured && (
                                <div className="w-full max-w-5xl">
                                    <FeaturedCard program={featured} />
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center gap-6">
                                {rest.map(p => (
                                    <div key={p.program_id} className="w-full sm:w-[360px]">
                                        <ProgramCard program={p} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </section>
    );
};

export default HomeProgramCards;
export { UrgencyBadge };

