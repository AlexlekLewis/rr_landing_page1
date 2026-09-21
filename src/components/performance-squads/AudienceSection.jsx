import React from 'react';
import { motion } from 'framer-motion';
import { BatBallIcon } from './CricketIcons';
import { fadeUp, SectionHeading } from './shared';
import { AUDIENCE } from './data';

// Sits directly under the hero so a player can self-identify before they
// hit any logistics. Deliberately names the overlooked and the older player.
//
// Content-driven so other pages can reuse the layout with their own cards.
// Every prop defaults to the Performance Squads copy, so calling it with no
// props renders exactly what /performance-squads has always rendered.
const AudienceSection = ({
    items = AUDIENCE,
    eyebrow = 'Who This Is For',
    title = 'Built For Emerging Cricketers',
    sub = 'Performance Squads are for players serious about a short-format game \u2014 whatever the traditional pathway has decided so far.',
}) => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading eyebrow={eyebrow} title={title} sub={sub} />
            <div className="grid sm:grid-cols-2 gap-5">
                {items.map((a, i) => (
                    <motion.div
                        key={a.title}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={(i % 2) * 0.1}
                        className="bg-white/5 border border-white/10 hover:border-rr-pink/50 rounded-2xl p-7 transition-colors"
                    >
                        <BatBallIcon className="w-7 h-7 text-rr-pink mb-4" />
                        <h3 className="text-lg font-black uppercase mb-2 leading-tight">{a.title}</h3>
                        <p className="text-white/65 text-sm font-medium leading-relaxed">{a.body}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default AudienceSection;
