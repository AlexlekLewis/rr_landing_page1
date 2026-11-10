import React from 'react';
import { motion } from 'framer-motion';
import ITSectionHeader from './ITSectionHeader';
import ITRegisterButton from './ITRegisterButton';

// "What your player gets": the benefits of the tour, each one an outcome for the
// player, not a line from the camp document. (The players the centre has
// developed now sit in ITHomeOfRoyals, with the HPC video.)

// One simple outline icon per benefit, in the same order as copy.benefits.items.
const ICONS = [
    // building / centre
    'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01',
    // whistle / coach (people)
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    // clipboard plan
    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    // heart pulse
    'M3 12h4l2-5 4 10 2-5h6',
    // sun / conditions
    'M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    // trending up / growth
    'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
];

const ITBenefits = ({ copy }) => {
    const c = copy.benefits;
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <ITSectionHeader eyebrow={c.eyebrow} heading={c.heading} accent={c.headingAccent} lead={c.lead} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                    {c.items.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-7"
                        >
                            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ICONS[i % ICONS.length]} />
                                </svg>
                            </span>
                            <h3 className="mt-5 text-lg font-black text-rr-dark uppercase tracking-wide leading-snug">{b.title}</h3>
                            <p className="mt-2 text-sm md:text-base text-rr-charcoal font-medium leading-relaxed">{b.body}</p>
                        </motion.div>
                    ))}
                </div>
                <p className="mt-5 text-xs text-rr-charcoal/70 font-medium">{c.note}</p>

                <div className="mt-10">
                    <ITRegisterButton label={copy.hero.cta} id="benefits-register" />
                </div>
            </div>
        </section>
    );
};

export default ITBenefits;
