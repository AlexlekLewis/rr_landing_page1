import React from 'react';
import { motion } from 'framer-motion';

const preSessionSteps = [
    {
        label: "Pre-Session",
        title: "Session Plan Delivered",
        duration: "Day Before",
        description: "The day before every session, your child receives a detailed session plan via the WhatsApp group chat — so they arrive knowing exactly what's ahead and what to prepare for.",
        icon: "📋",
    },
    {
        label: "Arrival",
        title: "Arrive & Prepare",
        duration: "15 Min Early",
        description: "Players arrive 15 minutes before the session begins. In batting-focused months, this means padding up and mentally switching on before the clock starts.",
        icon: "⏱",
    },
];

const sessionBlocks = [
    {
        step: 1,
        title: "Daily Vitamin Skills",
        duration: "10 min",
        accent: "rr-pink",
        description: "Every session opens with the same routine — short, sharp fundamental drills like Maxwell-style rapids and underarm drives. Once complete, a quick squad coach briefing sets the objectives for the session ahead.",
        why: "Professional athletes don't practise their fundamentals because they're easy — they practise them so they never get them wrong. When you've done the work a thousand times in training, you can trust those skills completely when the pressure is on in a game. Starting every session with the same routine builds discipline, sharpens focus, and reinforces the movement patterns that form the foundation of everything else. Elite preparation is a professional behaviour — and it starts here.",
        bullets: [
            "Fundamental movement pattern drills",
            "Squad coach briefing on session focus",
            "Routine that builds match-day confidence",
        ],
    },
    {
        step: 2,
        title: "Personalised Technique Work",
        duration: "40 min",
        accent: "rr-blue",
        description: "The heart of individual development. Players work in focused 2-on-1 coaching groups on technique specific to their Individual Development Plan. IDP-specific time is rostered across the month so every player gets dedicated attention on the skills that matter most to their progression.",
        why: "Every player's development trajectory is different. This block ensures coaching is tailored, not generic. The 2-on-1 format means maximum feedback and nowhere to hide. Your child's Individual Development Plan drives every drill — with specific time rostered across the month so no skill gap goes unaddressed. The repetitive, intentional work here isn't about perfection — it's about building skills so robust they hold up under the pressure of match day.",
        bullets: [
            "2-on-1 personalised coaching sessions",
            "Driven by each player's Individual Development Plan",
            "IDP focus areas rostered across the month",
        ],
    },
    {
        step: 3,
        title: "Power Hitting Lab",
        duration: "60 min",
        accent: "rr-pink",
        description: "A specialist session led by Jarryd Rogers, focused on the mechanics of generating power through the hips to create bat speed and exit velocity. Over three weeks, players progress from isolated mechanical drills to applying these skills in live game-scenario situations.",
        why: "T20 cricket rewards players who can score at pace. This isn't about hitting harder — it's about hitting smarter. Understanding how energy transfers through the hips to generate bat speed and exit velocity gives players a mechanical advantage that compounds over time. Over three weeks, these focused drills evolve into live game-scenario application.",
        bullets: [
            "Hip mechanics and kinetic chain fundamentals",
            "Bat speed and exit velocity measurement",
            "Progressive adaptation to game situations",
        ],
    },
    {
        step: 4,
        title: "Cool Down & Reflection",
        duration: "10 min",
        accent: "rr-blue",
        description: "The session closes the way it opened — with daily vitamin skills to reinforce fundamentals. Players then complete their development journals and diaries before a final debrief with their squad coach. Coaches use this time to prepare detailed session notes on each player for the next session.",
        why: "The best academies in the world don't just train bodies — they train minds. Reflection and journalling lock in what was learned, build self-awareness, and give coaches the data they need to optimise the next session. The repeated vitamin skills bookend the session, reinforcing that the quality of your preparation defines the quality of your performance.",
        bullets: [
            "Daily vitamin skills to close",
            "Development journals and diary entries",
            "Squad coach debrief and next-session planning",
        ],
    },
];

const PreSessionCard = ({ step, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5"
    >
        <span className="text-2xl">{step.icon}</span>
        <div>
            <div className="flex items-center gap-3 mb-1">
                <span className="text-white font-black text-sm uppercase tracking-wider">{step.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-bold uppercase tracking-wider">{step.duration}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
        </div>
    </motion.div>
);

const accentStyles = {
    'rr-pink': {
        badge: 'bg-rr-pink text-white',
        pill: 'bg-rr-pink/10 text-rr-pink',
        hoverPill: 'bg-rr-pink/20 text-rr-pink',
    },
    'rr-blue': {
        badge: 'bg-rr-blue text-white',
        pill: 'bg-rr-blue/10 text-rr-blue',
        hoverPill: 'bg-rr-blue/20 text-rr-blue',
    },
};

const SessionCard = ({ block, index }) => {
    const styles = accentStyles[block.accent];
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group bg-white rounded-2xl p-6 md:p-8 relative border border-slate-200 hover:shadow-xl transition-all overflow-hidden"
        >
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>

            {/* Default State */}
            <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center font-black text-sm flex-shrink-0`}>
                        {block.step}
                    </span>
                    <div className="flex-1">
                        <h4 className="text-rr-navy font-black text-lg uppercase tracking-wide leading-tight">{block.title}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full ${styles.pill} text-xs font-bold uppercase tracking-wider flex-shrink-0`}>
                        {block.duration}
                    </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4">
                    {block.description}
                </p>

                <ul className="text-sm text-slate-500 space-y-2">
                    {block.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2 items-start">
                            <span className="text-rr-blue font-bold">✓</span>
                            {bullet}
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-rr-blue/60 font-semibold uppercase tracking-wider mt-4">Hover to learn why</p>
            </div>

            {/* WHY Hover State */}
            <div className="absolute inset-0 bg-rr-dark/95 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-4 group-hover:translate-y-0 z-20">
                <span className={`inline-block px-3 py-1 rounded-full ${styles.hoverPill} text-xs font-bold uppercase tracking-wider mb-3 self-start`}>
                    Why This Matters
                </span>
                <h4 className="text-white font-black text-lg uppercase tracking-wide mb-3">{block.title}</h4>
                <p className="text-white/85 text-sm leading-relaxed">
                    {block.why}
                </p>
                <div className="mt-4 flex">
                    <span className="h-1 w-12 bg-rr-pink rounded-full"></span>
                </div>
            </div>
        </motion.div>
    );
};

const SessionWalkthrough = () => {
    return (
        <section className="py-24 bg-rr-dark text-white relative overflow-hidden" id="session-walkthrough">
            {/* Top gradient bar */}
            <div className="absolute top-0 right-0 w-full h-1 bg-image-gradient-rr"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        INSIDE A <span className="text-rr-pink">SESSION</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        Every session is structured, intentional, and built around your child's Individual Development Plan. Two hours of focused, professional-quality coaching — delivered with the same discipline and preparation you'd find at an IPL franchise academy.
                    </p>
                </div>

                {/* Session duration bar */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm font-bold uppercase tracking-widest">
                        120 Minutes — Structured, Every Time
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                {/* Pre-Session Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {preSessionSteps.map((step, index) => (
                        <PreSessionCard key={index} step={step} index={index} />
                    ))}
                </div>

                {/* Core Session Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sessionBlocks.map((block, index) => (
                        <SessionCard key={index} block={block} index={index} />
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center text-slate-500 text-sm mt-12 max-w-2xl mx-auto"
                >
                    The specialist focus rotates monthly — batting, bowling, fielding — ensuring well-rounded development across the full 12-week program. Hover over each block to understand why every element of the session exists.
                </motion.p>

            </div>
        </section>
    );
};

export default SessionWalkthrough;
