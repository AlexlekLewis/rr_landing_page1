import React, { useState } from 'react';
import { motion } from 'framer-motion';

const preSessionSteps = [
    {
        label: "Pre-Session",
        title: "Session Plan Delivered",
        duration: "Day Before",
        description: "The day before every session, you receive a detailed session plan via the WhatsApp group chat — so you arrive knowing exactly what's ahead and what to prepare for.",
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
        title: "Daily Essential Skills",
        duration: "10 min",
        accent: "rr-pink",
        description: "Every session opens with the same routine — short, sharp drills covering the basics like rapid hands work and underarm drives. Once done, a quick squad coach briefing sets the plan for the session ahead.",
        why: "Professional athletes don't practise their basics because they're easy — they practise them so they never get them wrong. When you've done the work a thousand times in training, you can trust those skills completely when the pressure is on in a game. Starting every session with the same routine builds discipline, sharpens focus, and locks in the foundations that everything else is built on. Elite preparation is a professional behaviour — and it starts here.",
        bullets: [
            "Core skill drills to sharpen the basics",
            "Squad coach briefing on the session ahead",
            "Consistent routine that builds match-day confidence",
        ],
    },
    {
        step: 2,
        title: "Skill Acquisition & Technique",
        duration: "40 min",
        accent: "rr-blue",
        description: "The main part of this block is focused, repetitive drills designed to build and sharpen core cricket skills under close coaching. Players also get dedicated one-on-one technique time in small 2-on-1 groups, working on the specific areas identified in their Individual Development Plan. This personalised coaching time is spread across the month so every player gets proper attention.",
        why: "Every player develops differently. The drill work builds a solid foundation — repeating the right movements so often they become automatic, even under pressure. The personalised technique time means coaching is tailored to you, not a one-size-fits-all approach. With just two players per coach, there's nowhere to hide and constant feedback. Your individual development plan drives every session — so nothing gets missed.",
        bullets: [
            "Focused drills to build and sharpen core skills",
            "Personalised 2-on-1 technique coaching",
            "Development plan focus areas spread across the month",
        ],
    },
    {
        step: 3,
        title: "Power Hitting Lab",
        duration: "60 min",
        accent: "rr-pink",
        description: "A specialist session led by Jarryd Rogers, focused on how to generate real power through the hips to hit the ball harder and further. Over three weeks, players progress from learning the technique in drills to using it in live, game-like situations.",
        why: "T20 cricket rewards players who can score at pace. This isn't about swinging harder — it's about hitting smarter. Learning how power transfers through the body to create bat speed gives players a genuine advantage that only grows over time. Over three weeks, these focused drills progress into real game situations where players learn to use their power when it counts.",
        bullets: [
            "How to generate power through the hips and body",
            "Bat speed and ball-striking measurement",
            "Building up from drills to live game situations",
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
            "Daily essential skills to close",
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
    const [flipped, setFlipped] = useState(false);
    const styles = accentStyles[block.accent];
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            onClick={() => setFlipped(f => !f)}
            className="group bg-white rounded-2xl p-6 md:p-8 relative border border-slate-200 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
        >
            {/* Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>

            {/* Default State */}
            <div className={`relative z-10 transition-opacity duration-300 ${flipped ? 'opacity-0' : 'opacity-100'} group-hover:opacity-0`}>
                <div className="flex items-center gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center font-black text-sm flex-shrink-0`}>
                        {block.step}
                    </span>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-rr-navy font-black text-base md:text-lg uppercase tracking-wide leading-tight">{block.title}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full ${styles.pill} text-xs font-bold uppercase tracking-wider flex-shrink-0 hidden sm:block`}>
                        {block.duration}
                    </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4">
                    {block.description}
                </p>

                <ul className="text-sm text-slate-500 space-y-2">
                    {block.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2 items-start">
                            <span className="text-rr-blue font-bold shrink-0">✓</span>
                            {bullet}
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-rr-blue/60 font-semibold uppercase tracking-wider mt-4">Click to learn why</p>
            </div>

            {/* WHY Reveal State — click on mobile, hover on desktop */}
            <div className={`absolute inset-0 bg-rr-dark/95 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-center transition-all duration-500 ease-in-out z-20
                ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                group-hover:opacity-100 group-hover:translate-y-0`}>
                <span className={`inline-block px-3 py-1 rounded-full ${styles.hoverPill} text-xs font-bold uppercase tracking-wider mb-3 self-start`}>
                    Why This Matters
                </span>
                <h4 className="text-white font-black text-base md:text-lg uppercase tracking-wide mb-3">{block.title}</h4>
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
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Example Session</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        INSIDE A <span className="text-rr-pink">SESSION</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        Below is an example of what a session within the program looks like. Session content rotates across the 12 weeks — this is one illustration of how a session is structured, not a format that repeats every time.
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
                    This is one example of a session within the program. The specialist focus rotates monthly — batting, bowling, fielding — ensuring well-rounded development across the full 12 weeks. Tap each block to understand why every element exists.
                </motion.p>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 pt-14 border-t border-slate-200 mt-14">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/8 border border-rr-pink/25 rounded-full px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Entry closes 5pm · March 20 — or when full</span>
                    </div>
                    <a href="#checkout" className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.35)] text-sm flex items-center gap-3">
                        Secure Your Place Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default SessionWalkthrough;
