import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, SectionHeading } from './shared';
import { SQUAD_COACHES } from './data';

const CoachesSection = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Your Coaches"
                title="Led By The Royals Way"
                sub="Each Performance Squad is led by a Royals accredited Head Coach who sets the standard, picks the teams, and drives the squad through the season."
            />
            <div className="grid sm:grid-cols-2 gap-5">
                {SQUAD_COACHES.map((coach, i) => (
                    <motion.div
                        key={coach.name}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={i * 0.1}
                        className="bg-white/5 border border-white/10 hover:border-rr-pink/50 rounded-2xl overflow-hidden flex flex-col transition-colors"
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-rr-navy">
                            <img
                                src={coach.img}
                                alt={coach.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-transparent" />
                            <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rr-pink rounded-full px-3 py-1.5">
                                {coach.credential}
                            </span>
                        </div>
                        <div className="p-7">
                            <h3 className="text-2xl font-black uppercase mb-1">{coach.name}</h3>
                            <p className="text-rr-light-pink text-sm font-bold uppercase tracking-wider mb-4">
                                {coach.role}
                            </p>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">
                                {coach.bio}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default CoachesSection;
