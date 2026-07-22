import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
    {
        n: '01',
        title: 'Tell Us About Your Game',
        body: 'Register your interest below — age, experience, the specialist coaching you\'re after, and the Tuesday or Friday times that suit.',
    },
    {
        n: '02',
        title: 'The Head Coach Calls You',
        body: 'The Mickleham Head Coach personally reviews every registration and calls to talk through where your game is at and where it needs to go.',
    },
    {
        n: '03',
        title: 'Consultation, Then Your Block',
        body: 'You\'re matched with the Academy coach best suited to your development journey. Your first session is a one-on-one consultation, then your block — a 3-session starter or 6+ — is scheduled.',
    },
];

const FACTS = [
    { label: 'Format', value: '1-on-1 in a dedicated lane' },
    { label: 'First Session', value: '$160 Consultation' },
    { label: 'Blocks', value: '3 or 6+ sessions' },
    { label: 'Days', value: 'Tuesday & Friday' },
];

const PCHowItWorks = () => {
    return (
        <section className="bg-slate-50 py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">How It Works</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                        A Coach Chosen For You
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        You don't pick a name off a list. The Head Coach of the centre matches every
                        player to the right coach for their development journey — and stays across it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                        >
                            <p className="text-4xl font-black text-rr-pink/20 mb-4">{s.n}</p>
                            <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-3">{s.title}</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed">{s.body}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200"
                >
                    {FACTS.map((f) => (
                        <div key={f.label} className="bg-white p-6 text-center">
                            <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em] mb-1.5">{f.label}</p>
                            <p className="text-sm font-black text-rr-dark uppercase tracking-wide leading-snug">{f.value}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default PCHowItWorks;
