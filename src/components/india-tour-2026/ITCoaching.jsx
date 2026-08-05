import React from 'react';
import { motion } from 'framer-motion';
import ITCtaBand from './ITCtaBand';

// ---------------------------------------------------------------------------
// The resident coaching team, taken from the camp document (source of truth).
//
// This section previously listed only TWO coaches, with roles that did not match
// the document: Sid Lahiri as "Head of International Player Development" and Romi
// Bhinder as "Head of High-Performance Operations". Both are corrected below, and
// the three missing coaches — Faiz Fazal, Somi Bhinder and Dr Neeta Adhau — are
// added. We only hold photographs for Sid and Romi; the rest render a monogram
// rather than a broken image or a stock face.
// ---------------------------------------------------------------------------

const COACHES = [
    {
        name: 'Sid Lahiri',
        role: 'Head of Global Academies · Royals Performance Coach',
        image: '/assets/rra/sid-lahiri-profile.png',
        bio:
            'Sid leads the camp. He heads the Royals\' academies worldwide, coaches batting for ' +
            'Birmingham Phoenix, and oversees the Rajasthan Royals Academy Melbourne.',
        quote:
            'In March this year I witnessed first hand the quality in the Melbourne Rajasthan Royals ' +
            'Academy. We are looking forward to welcoming players from Australia for the first time, and ' +
            'giving them a deep dive into the Royals way of playing the game.',
    },
    {
        name: 'Romi Bhinder',
        role: 'Rajasthan Royals Team Manager · Batting & Leadership',
        image: '/assets/rra/romi-bhinder.png',
        bio:
            'Romi lives at the High Performance Centre and trains the Royals players there all year ' +
            'round. He is the legal guardian of Vaibhav Sooryavanshi. Six days working with a coach at ' +
            'the cutting edge of the game is the rarest part of this camp.',
    },
    {
        name: 'Faiz Fazal',
        role: 'Batting & Leadership',
        bio:
            'A former India international and a Ranji Trophy-winning captain. He brings a long ' +
            'first-class career to the panel, with batting and leadership his focus.',
    },
    {
        name: 'Somi Bhinder',
        role: 'Resident Fast Bowling Coach',
        bio:
            'A former fast bowler and coach, Somi is the centre\'s resident fast bowling coach — there ' +
            'every day, not flown in for the week.',
    },
    {
        name: 'Dr Neeta Adhau',
        role: 'Performance Psychology',
        bio:
            'A performance psychology specialist focused on emotional resilience and athlete ' +
            'development — a core pillar of the High Performance Centre, not an add-on.',
    },
];

const initials = (name) =>
    name.replace(/^Dr\s+/, '').split(' ').map((w) => w[0]).join('').slice(0, 2);

const ITCoaching = ({ copy }) => (
    <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                >
                    Coaching &amp; High Performance
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none"
                >
                    The Resident <span className="text-rr-pink">Coaching Team</span>
                </motion.h2>
                <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto my-5" />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                >
                    These are not guest coaches brought in for a week. Most of them work at the Rajasthan
                    Royals High Performance Centre in Nagpur year round — turf wickets, indoor nets, a gym,
                    pool and residential facilities, in the home of the Royals.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COACHES.map((c, i) => (
                    <motion.div
                        key={c.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06 * i }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-5 ring-1 ring-slate-200 bg-gradient-to-br from-rr-pink/15 to-rr-blue/15 flex items-center justify-center shrink-0">
                            {c.image ? (
                                <img
                                    src={c.image}
                                    alt={c.name}
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                />
                            ) : (
                                <span className="text-xl font-black text-rr-blue tracking-wide">
                                    {initials(c.name)}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide">{c.name}</h3>
                        <p className="text-[11px] font-bold text-rr-pink uppercase tracking-widest mt-1 mb-3">
                            {c.role}
                        </p>
                        <p className="text-sm text-rr-charcoal font-medium leading-relaxed">{c.bio}</p>
                        {c.quote && (
                            <p className="text-sm text-rr-charcoal/80 font-medium italic leading-relaxed mt-4 pt-4 border-t border-slate-100">
                                “{c.quote}”
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-14">
                <ITCtaBand
                    copy={copy}
                    tone="light"
                    heading={copy.hero.ctaAfterCoaches.heading}
                    body={copy.hero.ctaAfterCoaches.body}
                />
            </div>
        </div>
    </section>
);

export default ITCoaching;
