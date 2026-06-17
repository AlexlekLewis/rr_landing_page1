import React from 'react';
import { motion } from 'framer-motion';

// "What the Royals are looking for" — the brochure's value framing for the pathway
// player trying to make it. Three things the next level actually rewards.
const ITEMS = [
    { title: 'Power & 360° hitting', desc: 'Score all around the wheel — find the gaps and clear the rope on demand.' },
    { title: 'Skills under pressure', desc: "Execute when it's hot — in a match, not just at training." },
    { title: 'Decisions under pressure', desc: 'Read the game and make the right call, ball after ball.' },
];

const WhatRoyalsLookingFor = () => (
    <section className="bg-rr-page py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">For the pathway player trying to make it</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-5">
                    What the Royals are <span className="text-rr-pink">looking for</span>
                </h2>
                <p className="max-w-2xl mx-auto text-base md:text-lg text-white/70 font-medium leading-relaxed">
                    Making it isn&apos;t more net time — it&apos;s the skills the next level actually rewards. We develop exactly that, in a structured 8-week build, with every rep measured.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {ITEMS.map((it, i) => (
                    <motion.div
                        key={it.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                        className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-rr-pink/40 transition-colors"
                    >
                        <h3 className="text-lg font-black text-white uppercase tracking-wide mb-2">{it.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{it.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default WhatRoyalsLookingFor;
