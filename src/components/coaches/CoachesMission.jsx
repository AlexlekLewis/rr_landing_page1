import React from 'react';
import { motion } from 'framer-motion';

const COMMITMENTS = [
    {
        title: 'Technique First, Player First',
        body: 'Get the fundamentals right and a player’s game grows for a decade. Rush them and it caps out at fifteen. We coach the long way, because it’s the only way that lasts.',
    },
    {
        title: 'Honest Coaching, Clear Next Steps',
        body: 'Every player in our program knows where they stand, what they’re working on and what the next level asks of them. No vague promises — a pathway.',
    },
    {
        title: 'Tougher Competitors, Better People',
        body: 'Sharper athletes, braver decision-makers, teammates first. If cricket is the only thing a player leaves us with, we haven’t finished the job.',
    },
];

const CoachesMission = () => {
    return (
        <section className="bg-rr-dark py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-96 h-96 bg-rr-blue/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-16"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Our Mission as Coaches</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        What We’re Here To Do
                    </h2>
                    <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-8" />
                    <p className="text-xl md:text-2xl text-white font-bold leading-snug mb-6">
                        We’re here to build cricketers who back themselves — in technique, in
                        decision-making, and under pressure.
                    </p>
                    <p className="text-white/70 font-medium leading-relaxed">
                        The Rajasthan Royals became famous for giving young players their chance
                        before anyone else would. That’s the tradition this academy carries in
                        Melbourne. Our job as coaches is to see what a player could become, tell
                        them the truth about where they are, and build the technique and
                        temperament to close the gap.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {COMMITMENTS.map((c, i) => (
                        <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="bg-white/4 border border-white/10 rounded-2xl p-6 md:p-8"
                        >
                            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center mb-5">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide mb-3">{c.title}</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">{c.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoachesMission;
