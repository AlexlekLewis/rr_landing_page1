import React from 'react';
import { motion } from 'framer-motion';

const PERFORMANCE_SQUAD = [
    { label: 'Playing Background', value: 'Premier Cricket experience (current or past), or equivalent senior representative cricket.' },
    { label: 'Coaching Experience', value: '2+ years as a Head Coach in a school, club, or rep program.' },
    { label: 'Track Record', value: 'Coached at JG Craig Shield level or higher for 2+ consecutive years.' },
    { label: 'Mandatory', value: 'Working With Children Check (VIC – Employee). Royals Coaching Hub – Pro Coaching Foundation, Advanced. We pay for your course; you complete every module.' },
    { label: 'Preferred', value: 'Current First Aid + CPR.' },
];

const JUNIOR = [
    { label: 'Playing Background', value: 'Cricket experience preferred, not mandatory.' },
    { label: 'Coaching Experience', value: 'Welcomed at all levels — entry-level coaches accepted under supervision.' },
    { label: 'Approach', value: 'You can hold a group’s attention for a full session, and you put the player ahead of the drill.' },
    { label: 'Mandatory', value: 'Working With Children Check (VIC – Employee). Royals Coaching Hub – Pro Coaching Foundation, Basic as a minimum. We pay for the level your role needs.' },
    { label: 'Before you coach solo', value: 'You work 10 assisted hours alongside a Lead Coach first, paid at $25/hour on completion. T&Cs apply and are outlined at interview.' },
];

const TierCard = ({ title, accent, items, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-7 md:p-10 backdrop-blur-sm"
    >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${accent}`} />

        <div className="mb-6">
            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-2">Stream</p>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{title}</h3>
        </div>

        <ul className="space-y-5">
            {items.map((item) => (
                <li key={item.label} className="border-l-2 border-white/10 pl-4">
                    <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.2em] mb-1">{item.label}</p>
                    <p className="text-white/85 font-medium text-sm md:text-base leading-relaxed">{item.value}</p>
                </li>
            ))}
        </ul>
    </motion.div>
);

const StandardsSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 bg-rr-dark overflow-hidden">
            {/* Ambient effects */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rr-pink/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rr-blue/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-3xl mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Our Standards
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6"
                    >
                        What We're <span className="text-rr-pink">Looking For.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-8 origin-left"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-base md:text-lg text-white/70 font-medium leading-relaxed"
                    >
                        We run two coaching streams — Performance Squads (our representative teams) and Junior Royals (our program for younger players) — each with different demands. Below is a guide to what we look for in coaches; operations, admin, and media roles are assessed on merit through the application form. If you don't tick every box but believe in our approach, we still want to hear from you.
                    </motion.p>
                </div>

                {/* Two-column tier cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
                    <TierCard
                        title="Performance Squad Coach"
                        accent="bg-gradient-to-r from-rr-pink to-rr-pink/40"
                        items={PERFORMANCE_SQUAD}
                        delay={0}
                    />
                    <TierCard
                        title="Junior Royals Coach"
                        accent="bg-gradient-to-r from-rr-blue to-rr-blue/40"
                        items={JUNIOR}
                        delay={0.15}
                    />
                </div>


                {/* Section CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Apply For A Coaching Role
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>

                {/* Footnote */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-xs md:text-sm text-white/40 font-medium text-center max-w-2xl mx-auto"
                >
                    All team members sign the RRA Code of Conduct and complete a structured onboarding process before working independently. A Working With Children Check is required for every role.
                </motion.p>
            </div>
        </section>
    );
};

export default StandardsSection;
