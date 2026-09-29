import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LogIn, UserCheck, HardHat, GlassWater, AlertCircle } from 'lucide-react';
import { fadeUp, SectionHeading } from '../performance-squads/shared';
import {
    SUPERVISION, ON_THE_DAY, CONCERNS_CONTACT, CONCERNS_IS_EMAIL,
} from './sidJuniorsData';

// Who looks after the players, and what a parent needs to know on the day.
// Every line comes from sidJuniorsData.js: the number of places renders from
// each session's config, and a sign-in line only appears once that session's
// time is confirmed. Coach names are not published.
const DAY_ICONS = {
    'sign-in': LogIn,
    'pick-up': UserCheck,
    helmet: HardHat,
    water: GlassWater,
};

const SidJuniorsSupervision = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading eyebrow={SUPERVISION.eyebrow} title={SUPERVISION.title} />

            <div className="grid md:grid-cols-2 gap-5">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={0}
                    className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-3xl p-7 sm:p-9"
                >
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-rr-pink mb-5">The Coaches</p>
                    <ul className="space-y-5">
                        {SUPERVISION.points.map((point) => (
                            <li key={point} className="flex items-start gap-3.5">
                                <ShieldCheck className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                                <span className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={0.08}
                    className="bg-white/5 border border-white/10 rounded-3xl p-7 sm:p-9"
                >
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-rr-pink mb-5">On The Day</p>
                    <ul className="space-y-5">
                        {ON_THE_DAY.map(({ key, icon, text }) => {
                            const Icon = DAY_ICONS[icon] || ShieldCheck;
                            return (
                                <li key={key} className="flex items-start gap-3.5">
                                    <Icon className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                                    <span className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed">{text}</span>
                                </li>
                            );
                        })}
                    </ul>
                </motion.div>
            </div>

            <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0.12}
                className="flex items-start sm:items-center justify-center gap-2.5 text-white/65 text-[15px] font-medium leading-relaxed mt-8 text-center"
            >
                <AlertCircle className="w-4 h-4 text-rr-pink shrink-0 mt-1 sm:mt-0" />
                <span>
                    Concerns about a player&apos;s safety? Contact{' '}
                    {CONCERNS_IS_EMAIL ? (
                        <a href={`mailto:${CONCERNS_CONTACT}`} className="text-rr-light-pink underline hover:text-white">
                            {CONCERNS_CONTACT}
                        </a>
                    ) : (
                        <span className="text-white">{CONCERNS_CONTACT}</span>
                    )}
                    .
                </span>
            </motion.p>
        </div>
    </section>
);

export default SidJuniorsSupervision;
