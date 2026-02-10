import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        num: 1,
        title: "Apply",
        desc: "Complete the online application form with player details and cricket history.",
        month: "OCT",
        day: "23",
    },
    {
        num: 2,
        title: "Assess",
        desc: "Participate in a structured trial and skills assessment session.",
        month: "NOV",
        day: "10",
    },
    {
        num: 3,
        title: "Offer",
        desc: "Successful candidates will receive an official academy offer letter.",
        month: "NOV",
        day: "25",
    },
    {
        num: 4,
        title: "Alternative",
        desc: "Feedback provided with development pathways or future trial options.",
        month: "DEC",
        day: "05",
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

const SelectionProcess = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-100 to-white">
            <div className="container mx-auto px-6">
                {/* Contained dark card matching the mockup */}
                <div
                    className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(145deg, #0a1628 0%, #0f1d3a 50%, #0a1628 100%)',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Subtle circuit pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #1226AA 1px, transparent 1px),
                                          radial-gradient(circle at 80% 20%, #E11F8F 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                    <div className="relative z-10 px-8 py-16 md:px-12 md:py-20">
                        <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-4">SELECTION PROCESS</h2>
                        <p className="text-center text-slate-300 max-w-2xl mx-auto mb-16 text-base md:text-lg leading-relaxed">
                            The Rajasthan Royals Academy Melbourne selection process is designed to identify talented cricketers ready to take the next step. Here's how it works.
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
                                        {/* Glowing number circle */}
                                        <div
                                            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mb-5 relative shrink-0"
                                            style={{
                                                background: 'linear-gradient(135deg, #E11F8F 0%, #7B2FBE 50%, #1226AA 100%)',
                                                boxShadow: '0 0 30px rgba(225,31,143,0.35), 0 0 60px rgba(18,38,170,0.2), inset 0 0 20px rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            {/* Outer ring glow */}
                                            <div className="absolute inset-[-3px] rounded-full" style={{
                                                border: '1.5px solid rgba(225,31,143,0.3)',
                                                boxShadow: '0 0 15px rgba(225,31,143,0.15)',
                                            }} />
                                            {step.num}
                                        </div>

                                        {/* Title + Date badge row */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-base font-bold uppercase tracking-wider text-white">{step.title}</h3>
                                            <span
                                                className="inline-flex flex-col items-center leading-none rounded px-1.5 py-0.5"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(225,31,143,0.25), rgba(18,38,170,0.25))',
                                                    border: '1px solid rgba(225,31,143,0.3)',
                                                    fontSize: '0.55rem',
                                                }}
                                            >
                                                <span className="text-rr-pink font-bold" style={{ fontSize: '0.5rem' }}>{step.month}</span>
                                                <span className="text-white font-bold text-xs">{step.day}</span>
                                            </span>
                                        </div>

                                        <p className="text-slate-400 text-sm leading-relaxed px-2">{step.desc}</p>
                                    </motion.div>

                                    {/* Curved arrow between steps */}
                                    {i < steps.length - 1 && (
                                        <div className="flex items-center pt-4 shrink-0">
                                            <CurvedArrow id={i} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Mobile: vertical timeline */}
                        <div className="md:hidden space-y-8 relative pl-14">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{
                                background: 'linear-gradient(to bottom, #E11F8F, #7B2FBE, #1226AA)',
                                opacity: 0.4,
                            }} />

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
                                        className="absolute -left-14 top-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #E11F8F 0%, #7B2FBE 50%, #1226AA 100%)',
                                            boxShadow: '0 0 20px rgba(225,31,143,0.3)',
                                        }}
                                    >
                                        {step.num}
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold uppercase text-white">{step.title}</h3>
                                            <span
                                                className="inline-flex flex-col items-center leading-none rounded px-1.5 py-0.5"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(225,31,143,0.25), rgba(18,38,170,0.25))',
                                                    border: '1px solid rgba(225,31,143,0.3)',
                                                    fontSize: '0.55rem',
                                                }}
                                            >
                                                <span className="text-rr-pink font-bold" style={{ fontSize: '0.5rem' }}>{step.month}</span>
                                                <span className="text-white font-bold text-xs">{step.day}</span>
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SelectionProcess;
