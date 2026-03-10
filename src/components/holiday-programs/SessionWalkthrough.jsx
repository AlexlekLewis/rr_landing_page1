import React from 'react';
import { motion } from 'framer-motion';

const slots = [
    {
        time: '9:00 – 9:15 AM',
        title: 'Warm-Up',
        desc: 'Dynamic warm-up to get every player moving, activated, and ready. Sets the tone for the day ahead.',
        tag: 'Physical Prep',
    },
    {
        time: '9:15 – 10:00 AM',
        title: 'First Station',
        desc: 'Players rotate through their first skill station — batting, bowling, or fielding. Small groups, focused coaching, individual attention.',
        tag: 'Skill Station 1',
    },
    {
        time: '10:00 – 10:45 AM',
        title: 'Second Station',
        desc: 'Rotation to the second skill station. Every player works across all three disciplines across the day.',
        tag: 'Skill Station 2',
    },
    {
        time: '10:45 – 11:30 AM',
        title: 'Third Station',
        desc: 'Final skill station rotation. Coaches provide real-time feedback and individual focus points throughout.',
        tag: 'Skill Station 3',
    },
    {
        time: '11:30 AM – 12:45 PM',
        title: 'Match Scenarios & Gameplay',
        desc: 'Players put everything into practice in match situations — run chases, last-over finishes, and pressure gameplay. The best part of the day.',
        tag: 'Game Time',
    },
    {
        time: '12:45 – 1:00 PM',
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
                        9:00 AM – 1:00 PM. Every minute structured. Every player challenged.
                    </motion.p>
                </div>

                <div className="space-y-0">
                    {slots.map((slot, i) => (
                        <motion.div
                            key={slot.time}
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
