import React from 'react';
import { motion } from 'framer-motion';

const ICON_SQUAD = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);
const ICON_GROUP = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ICON_START = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

// Coaching roles only (Andy, 13 Nov 2026: "focus purely on it as a coaching page").
const ROLES = [
    {
        title: 'Performance Squad Coach',
        anchor: 'role-performance-squad-coach',
        level: 'Experienced coaches',
        body: 'Lead a Performance Squad — our representative teams. You design the sessions, write each player a development plan, sit down with them to review it, and coach the squad at weekend matches.',
        engagement: ['Casual', 'Part-Time', 'Full-Time'],
        icon: ICON_SQUAD,
    },
    {
        title: 'Junior Royals Coach',
        anchor: 'role-junior-royals-coach',
        level: 'Lead & Assistant Coaches',
        body: 'Coach Junior Royals, our program for younger players. Lead Coaches own the quality of a group and mentor the coaches under them; Assistant Coaches co-deliver sessions and work 10 paid assisted hours alongside a Lead before running a group solo.',
        engagement: ['Casual', 'Part-Time'],
        icon: ICON_GROUP,
    },
    {
        title: 'Cadet Coach',
        anchor: 'role-cadet-coach',
        level: 'New to coaching',
        body: 'Start coaching here. You observe, support stations and run supervised drills, with a mentor beside you — and a set route from Cadet to Assistant to Lead Coach.',
        engagement: ['Volunteer', 'Work Experience', 'Casual'],
        highlight: true,
        icon: ICON_START,
    },
];

const RolesSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rr-blue/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-3xl mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Coaching Roles
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        Coaching <span className="text-rr-pink">Roles.</span>
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
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                    >
                        Three ways in, depending on where you are as a coach today. Experienced coaches lead our Performance Squads; Junior Royals coaches work with our younger players; and if you are new to coaching, you start as a Cadet with a mentor. Find where you fit, then apply below.
                    </motion.p>
                </div>

                {/* Roles grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {ROLES.map((role, i) => (
                        <motion.button
                            type="button"
                            key={role.title}
                            id={role.anchor}
                            onClick={scrollToForm}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.08 * i }}
                            className={`text-left rounded-2xl p-7 md:p-8 border transition-all duration-300 group cursor-pointer ${
                                role.highlight
                                    ? 'bg-rr-dark border-rr-pink/40 hover:border-rr-pink hover:shadow-[0_0_28px_rgba(229,6,149,0.25)]'
                                    : 'bg-white border-slate-200 hover:border-rr-pink/30 hover:shadow-lg'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                                {role.icon}
                            </div>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 ${role.highlight ? 'text-white/60' : 'text-rr-pink'}`}>{role.level}</p>
                            <h3 className={`text-lg font-black uppercase tracking-tight mb-3 ${role.highlight ? 'text-white' : 'text-rr-dark'}`}>
                                {role.title}
                            </h3>
                            <p className={`font-medium leading-relaxed text-sm md:text-base mb-5 ${role.highlight ? 'text-white/70' : 'text-rr-charcoal'}`}>
                                {role.body}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {role.engagement.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                            role.highlight
                                                ? 'bg-rr-pink/15 border border-rr-pink/40 text-rr-pink'
                                                : 'bg-white border border-slate-200 text-rr-charcoal/80'
                                        }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${role.highlight ? 'text-rr-pink' : 'text-rr-pink'}`}>
                                Apply for this role
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Section CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <button
                        onClick={scrollToForm}
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3"
                    >
                        Apply to Coach
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <p className="text-xs text-rr-charcoal/60 font-medium mt-4">
                        One form covers every coaching role. About ten minutes — the coaching CV boxes are what we read first, so they are worth the time.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default RolesSection;
