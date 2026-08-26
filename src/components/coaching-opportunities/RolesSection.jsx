import React from 'react';
import { motion } from 'framer-motion';

const ROLES = [
    {
        title: 'Cricket Coaches',
        anchor: 'role-cricket-coaches',
        body: 'Lead a Performance Squad — our representative teams. You design the sessions, write each player a development plan, and sit down with them to review it.',
        engagement: ['Casual', 'Part-Time', 'Full-Time'],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
    },
    {
        title: 'Junior / Assistant Coaches',
        anchor: 'role-junior-assistant-coaches',
        body: 'Start coaching with Junior Royals, our program for younger players. You are never thrown in alone — you get a mentor, and a set route from Cadet to Assistant to Lead Coach.',
        engagement: ['Volunteer', 'Work Experience', 'Casual', 'Part-Time'],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'Operations & Admin',
        anchor: 'role-operations-admin',
        body: 'Keep the academy running — program coordination, scheduling, family communication, and on-the-ground centre operations.',
        engagement: ['Volunteer', 'Casual', 'Part-Time', 'Full-Time'],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        title: 'Media & Content',
        anchor: 'role-media-content',
        body: 'Tell the Royals story — matchday photography, video, social content, and creative that connects our community to the global brand.',
        engagement: ['Work Experience', 'Volunteer', 'Casual', 'Part-Time'],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: "Don't See Your Role?",
        anchor: 'role-pitch-us',
        body: "If you believe you can make our academy better, pitch us. Tell us what you'd bring in the application form and we'll take it seriously.",
        engagement: ['All Engagement Types'],
        highlight: true,
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
];

const RolesSection = () => {
    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
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
                        Open Roles
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        Current <span className="text-rr-pink">Openings.</span>
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
                        From volunteers and work experience students to full-time professionals — the academy is built by more than coaches. Find where you fit, then tell us about yourself in the application form.
                    </motion.p>
                </div>

                {/* Roles grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
                                    : 'bg-slate-50 border-slate-200 hover:border-rr-pink/30 hover:shadow-lg'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                                {role.icon}
                            </div>
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
                                Apply for this
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
                        One Form, Every Role
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <p className="text-xs text-rr-charcoal/60 font-medium mt-4">
                        One form covers every role. Five minutes if you skip the long-answer boxes — longer if you don’t, and for coaching roles those boxes are what we read first.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default RolesSection;
