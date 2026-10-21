import React from 'react';
import { motion } from 'framer-motion';
import { ROYALS_WAY } from './jrTerm4Data';

// "Play the Royals Way", new this term (Alex, 21 Oct 2026: "the site needs to be live with
// the new version" → the Royals Way and badges on the live page, booking unchanged). Same
// words as the Term 4 email. Light section, bordered cards, no shadows (house rules).
const fade = (i = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08 } });

const JRT4RoyalsWay = () => (
    <section className="py-24 bg-slate-50" data-jr-royals-way>
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
                <motion.p {...fade()} className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{ROYALS_WAY.eyebrow}</motion.p>
                <motion.h2 {...fade(1)} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-6">{ROYALS_WAY.title}</motion.h2>
                <motion.p {...fade(2)} className="text-lg text-rr-charcoal font-medium max-w-3xl mx-auto leading-relaxed">{ROYALS_WAY.lead}</motion.p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {ROYALS_WAY.steps.map((s, i) => (
                    <motion.li key={s.head} {...fade(i)} className="bg-white border border-slate-200 rounded-2xl p-6">
                        <span className="inline-flex w-9 h-9 rounded-full bg-rr-pink text-white font-black items-center justify-center mb-4">{i + 1}</span>
                        <h3 className="text-lg font-black text-rr-dark uppercase tracking-tight mb-2">{s.head}</h3>
                        <p className="text-rr-charcoal font-medium leading-relaxed">{s.body}</p>
                    </motion.li>
                ))}
            </ol>

            <p className="text-center text-xs font-bold text-rr-pink uppercase tracking-[0.25em] mt-16 mb-8">{ROYALS_WAY.phasesTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {ROYALS_WAY.phases.map((p, i) => (
                    <motion.figure key={p.phase} {...fade(i)} className="text-center">
                        <img src={p.img} alt={`The ${p.badge} badge, from the ${p.phase} phase of Junior Royals`} className="w-40 h-40 mx-auto object-contain" loading="lazy" />
                        <figcaption className="mt-4">
                            <span className="block text-xs font-black text-rr-pink uppercase tracking-[0.25em]">Phase {i + 1} · {p.phase}</span>
                            <span className="block text-lg font-black text-rr-dark mt-1">{p.badge}</span>
                            <span className="block text-rr-charcoal font-medium mt-1">{p.can}</span>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>

            <p className="text-center text-rr-charcoal font-semibold mt-12">{ROYALS_WAY.note}</p>
        </div>
    </section>
);

export default JRT4RoyalsWay;
