import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const steps = [
    {
        num: 1,
        title: "Apply",
        desc: "Complete the online application form below and our selection team will work through yours and all other applications.",
    },
    {
        num: 2,
        title: "Assess",
        desc: "On Sunday March 1st, a select group of applicants will be invited to a trial and skill assessment session led by Sid Lahiri.",
    },
    {
        num: 3,
        title: "Offer",
        desc: "Shortly following the session on Sunday March 1st, successful candidates will receive an official offer to join the Elite Program.",
    },
    {
        num: 4,
        title: "Alternative",
        desc: "Should you be unsuccessful, the road doesn't end. Your application details will remain with us and we will provide invitations to alternative suitable program options.",
    },
];

/* Curved arrow SVG — a swooping arc with arrowhead */
const CurvedArrow = ({ id }) => (
    <svg viewBox="0 0 80 50" className="w-20 h-12 shrink-0 -mx-2" style={{ filter: 'drop-shadow(0 0 4px rgba(225,31,143,0.3))' }}>
        <defs>
            <linearGradient id={`ca-${id}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#E11F8F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1226AA" stopOpacity="0.8" />
            </linearGradient>
        </defs>
        <path
            d="M 4 38 Q 40 -10 72 30"
            fill="none"
            stroke={`url(#ca-${id})`}
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        <polygon
            points="66,22 76,32 64,34"
            fill="#E11F8F"
            opacity="0.8"
        />
    </svg>
);

import { TopRightCurve } from './Decals';

const SelectionProcess = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <TopRightCurve />
            <div className="container mx-auto px-6 relative z-10">
                {/* Contained light card */}
                <div
                    className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative border border-slate-200 shadow-2xl bg-white ring-1 ring-slate-50"
                >
                    {/* Subtle circuit pattern overlay - adjusted for light theme */}
                    <div className="absolute inset-0 opacity-[0.4]" style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #1226AA 0.5px, transparent 0.5px),
                                          radial-gradient(circle at 80% 20%, #E11F8F 0.5px, transparent 0.5px)`,
                        backgroundSize: '40px 40px',
                    }} />

                    <div className="relative z-10 px-8 pt-16 pb-16 md:px-12 md:pt-20 md:pb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-center text-rr-dark mb-4">SELECTION PROCESS</h2>
                        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16 text-base md:text-lg leading-relaxed font-medium">
                            Places in the Rajasthan Royals Academy Melbourne Elite Program are limited and as such the selection process is designed to identify talented cricketers ready to take the next step in their development. Here's how the process works.
                        </p>

                        {/* Desktop: horizontal timeline with curved arrows */}
                        <div className="hidden md:flex items-start justify-center gap-0">
                            {steps.map((step, i) => (
                                <React.Fragment key={step.num}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15, duration: 0.5 }}
                                        className="flex flex-col items-center text-center"
                                        style={{ width: '180px' }}
                                    >
                                        {/* Glowing number circle - Light Theme */}
                                        <div
                                            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mb-5 relative shrink-0 shadow-xl shadow-rr-pink/20"
                                            style={{
                                                background: 'linear-gradient(135deg, #E11F8F 0%, #1226AA 100%)',
                                            }}
                                        >
                                            {/* Outer ring */}
                                            <div className="absolute inset-[-4px] rounded-full border-2 border-white/50" />
                                            {step.num}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-bold uppercase tracking-wider text-rr-dark mb-2">{step.title}</h3>

                                        <p className="text-slate-500 text-sm leading-relaxed px-2 font-medium">{step.desc}</p>
                                    </motion.div>

                                    {/* Curved arrow between steps */}
                                    {i < steps.length - 1 && (
                                        <div className="flex items-center pt-4 shrink-0 opacity-40">
                                            <CurvedArrow id={i} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Mobile: vertical timeline */}
                        <div className="md:hidden space-y-8 relative pl-14">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rr-pink to-rr-blue opacity-30" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="relative"
                                >
                                    {/* Number circle */}
                                    <div
                                        className="absolute -left-14 top-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg"
                                        style={{
                                            background: 'linear-gradient(135deg, #E11F8F 0%, #1226AA 100%)',
                                        }}
                                    >
                                        {step.num}
                                    </div>

                                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                                        <h3 className="text-lg font-bold uppercase text-rr-dark mb-1">{step.title}</h3>
                                        <p className="text-slate-600 text-sm font-medium">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Button onClick={scrollToForm} variant="primary" className="text-base px-8 py-4 shadow-xl shadow-rr-blue/20">
                                APPLY NOW
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SelectionProcess;
