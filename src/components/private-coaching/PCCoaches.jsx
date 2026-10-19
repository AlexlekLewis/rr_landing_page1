import React from 'react';
import { motion } from 'framer-motion';
import { CENTRE, MICKLEHAM_COACHES } from './pcOptions';

// The coaches Alex assigns players to after the assessment. Same shape as the
// Head Coach section (photo left, story right, record below) so the page reads
// as one team. Players are still placed by Alex — this is who they may meet,
// not a menu to pick from (see step 04 in PCHowItWorks).

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);

const CoachPhoto = ({ coach }) => (
    <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm border border-slate-200 bg-rr-dark">
        {coach.image ? (
            <img
                src={coach.image}
                alt={`${coach.name} — ${coach.role}`}
                className="absolute inset-0 w-full h-full object-cover object-top"
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rr-dark via-rr-dark to-rr-pink/40">
                <span className="text-7xl font-black text-white/90 tracking-tight">{initials(coach.name)}</span>
            </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rr-dark/70 to-transparent" />
        <p className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold uppercase tracking-widest">
            {CENTRE.name}
        </p>
    </div>
);

const CoachProfile = ({ coach }) => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 md:gap-14 items-start">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <CoachPhoto coach={coach} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h3 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-2">
                    {coach.name}
                </h3>
                <p className="text-sm font-bold text-rr-pink uppercase tracking-widest mb-6">
                    {coach.role}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {coach.chips.map((chip) => (
                        <span
                            key={chip}
                            className="text-[11px] font-bold uppercase tracking-widest text-rr-dark bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
                {coach.intro.map((para, i) => (
                    <p
                        key={i}
                        className={`text-rr-charcoal font-medium leading-relaxed ${i === coach.intro.length - 1 ? 'mb-8' : 'mb-4'}`}
                    >
                        {para}
                    </p>
                ))}

                {coach.quote && (
                    <div className="border-l-4 border-rr-pink pl-6">
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">How He Coaches</p>
                        <p className="text-xl md:text-2xl font-black text-rr-dark leading-tight tracking-tight">
                            “{coach.quote}”
                        </p>
                    </div>
                )}
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14"
        >
            {coach.record.map((group, gi) => (
                <div key={group.heading} className={gi > 0 ? 'mt-14' : ''}>
                    <h4 className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-6">
                        {group.heading}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8">
                        {group.items.map((item, i) => {
                            // Odd count: run the last entry full width rather than
                            // leave a half-width orphan (same rule as PCAlex).
                            const orphan = group.items.length % 2 === 1 && i === group.items.length - 1;
                            return (
                                <div
                                    key={item.title}
                                    className={`border-t-2 border-slate-200 pt-4 ${orphan ? 'md:col-span-2' : ''}`}
                                >
                                    <p className="text-[15px] font-black text-rr-dark uppercase tracking-tight leading-snug mb-1.5">
                                        {item.title}
                                    </p>
                                    <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">
                                        {item.detail}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {coach.accreditation && (
                <div className="mt-12 bg-rr-dark rounded-2xl px-7 py-6">
                    <p className="text-white font-black uppercase tracking-tight text-lg leading-tight mb-1.5">
                        {coach.accreditation.title}
                    </p>
                    <p className="text-white/70 font-medium leading-relaxed">
                        {coach.accreditation.detail}
                    </p>
                </div>
            )}
        </motion.div>
    </div>
);

const PCCoaches = () => {
    if (!MICKLEHAM_COACHES.length) return null;
    return (
        <section className="bg-white py-24 border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Your Coaches at Mickleham</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                        Who Alex places you with
                    </h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">
                        After the assessment, Alex matches every player to the coach who suits their
                        game. These are the coaches taking private and small-group sessions at{' '}
                        {CENTRE.name}.
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {MICKLEHAM_COACHES.map((coach) => (
                        <CoachProfile key={coach.slug} coach={coach} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PCCoaches;
