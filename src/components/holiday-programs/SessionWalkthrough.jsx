import React from 'react';
import { motion } from 'framer-motion';

// Timings are shown as elapsed time from the start of the day, not as clock
// times — the daily start time differs by centre (July 2026 ran 9:00am at two
// centres and 1:30pm at the third) and is confirmed to each family by email.
// The four blocks add up to the full four-hour day.
const slots = [
    {
        time: 'First 15 minutes',
        title: 'Warm-Up',
        desc: 'Dynamic warm-up to get every player moving, activated, and ready. Sets the tone for the day ahead.',
        tag: 'Physical Prep',
    },
    {
        time: 'Next 45 minutes',
        title: 'First Station',
        desc: 'Players rotate through their first skill station — batting, bowling, or fielding. Small groups, focused coaching, individual attention.',
        tag: 'Skill Station 1',
    },
    {
        time: 'Next 45 minutes',
        title: 'Second Station',
        desc: 'Rotation to the second skill station. Every player works across all three disciplines across the day.',
        tag: 'Skill Station 2',
    },
    {
        time: 'Next 45 minutes',
        title: 'Third Station',
        desc: 'Final skill station rotation. Coaches provide real-time feedback and individual focus points throughout.',
        tag: 'Skill Station 3',
    },
    {
        time: 'Next 75 minutes',
        title: 'Match Scenarios & Gameplay',
        desc: 'Players put everything into practice in match situations — run chases, last-over finishes, and pressure gameplay. The best part of the day.',
        tag: 'Game Time',
    },
    {
        time: 'Last 15 minutes',
        title: 'Wrap-Up & Presentations',
        desc: 'Coaches wrap up the day, recognise standout performances, and present daily awards. Players leave with clear take-home focus points.',
        tag: 'Presentations',
    },
];

const SessionWalkthrough = () => {
    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden">
            {/* Subtle background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06]"
                style={{ backgroundImage: "url('/assets/SectionPhoto.jpeg')" }}
            />
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6"
                    >
                        A TYPICAL <span className="text-rr-pink">SESSION DAY</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-white/80 max-w-2xl mx-auto font-medium"
                    >
                        Four hours a day, three days running. Every minute structured, every player challenged. Your centre&rsquo;s start and finish times come in your confirmation email.
                    </motion.p>
                </div>

                <div className="space-y-0">
                    {slots.map((slot, i) => (
                        <motion.div
                            key={slot.title}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center py-8 border-b border-white/10 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                        >
                            {/* Time */}
                            <div className="md:w-32 shrink-0">
                                <div className="inline-flex items-center justify-center bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                                    <span className="text-rr-pink font-black text-sm uppercase tracking-widest">{slot.time}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-rr-medium-blue uppercase tracking-widest bg-rr-blue/10 border border-rr-blue/20 px-3 py-1 rounded-full">{slot.tag}</span>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">{slot.title}</h3>
                                <p className="text-white/70 font-medium leading-relaxed">{slot.desc}</p>
                            </div>

                            {/* Step number */}
                            <div className="hidden md:flex md:w-16 shrink-0 items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rr-blue to-rr-pink flex items-center justify-center">
                                    <span className="text-white font-black text-lg">{i + 1}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SessionWalkthrough;
