import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, SectionHeading } from './shared';
import { MEMBER_INCLUDES, MIN_AGE, MAX_AGE } from './data';

// ─────────────────────────────────────────────────────────────
// THE PROGRAM — /performance-squads only.
//
// What the Performance Squads are, now that they are running: who is in them,
// when they train and play, and what every member gets. The six points are the
// welcome page's own list (MEMBER_INCLUDES in ./data.js), so this page and the
// page a family pays on can never promise different things.
// ─────────────────────────────────────────────────────────────

const ProgramSection = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="The Program"
                title="What A Squad Place Gives You"
                sub={`Two squads of players aged ${MIN_AGE}–${MAX_AGE}, one in North Melbourne and one in South-East Melbourne. Squads train every week and play matches from September to April. Here is what every member gets.`}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {MEMBER_INCLUDES.map((item, i) => (
                    <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.05}
                        className="bg-white/5 border border-white/10 rounded-2xl p-7">
                        <span className="block text-3xl font-black text-rr-pink/40 leading-none mb-4">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-lg font-black uppercase mb-2">{item.title}</h3>
                        <p className="text-white/65 text-sm font-medium leading-relaxed">{item.body}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default ProgramSection;
