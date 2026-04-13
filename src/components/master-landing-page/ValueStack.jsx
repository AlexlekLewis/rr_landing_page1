import React from 'react';
import { motion } from 'framer-motion';

const included = [
    { label: '12 Weeks Elite T20 Coaching' },
    { label: 'Full DNA Performance Profile' },
    { label: 'Individual Development Plan' },
    { label: 'Official Royals Training Kit' },
    { label: 'Post-Program Report' },
];

const paymentOptions = [
    {
        title: 'Flexi Pay',
        tag: 'Most Popular',
        tagColor: 'text-rr-pink',
        desc: '4 payments of $749 — pay as you go with an initial payment plus 3 monthly instalments.',
    },
    {
        title: 'Pay in Full',
        tag: 'Best Value',
        tagColor: 'text-rr-blue',
        desc: 'Pay $2,995 upfront and receive an additional training shirt and training pants — free of charge.',
    },
    {
        title: 'Afterpay',
        tag: 'Split It',
        tagColor: 'text-white/50',
        desc: 'Spread the cost further with Afterpay — available at checkout with no extra steps.',
    },
];

const ValueStack = () => {
    return (
        <section className="py-24 bg-rr-dark text-white relative overflow-hidden">

            {/* Ambient glows */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Season 1 · 2026</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        Program Pricing
                    </h2>
                    <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue" />
                </motion.div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                    {/* Left column */}
                    <div className="space-y-6">

                        {/* What's included */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/4 border border-white/10 rounded-2xl p-6 md:p-8"
                        >
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6">What's Included</p>
                            <ul className="divide-y divide-white/8">
                                {included.map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 py-4">
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-white font-medium">{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Value comparison */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/4 border border-white/10 rounded-2xl p-6 md:p-8"
                        >
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6">What You're Getting</p>
                            <p className="text-white font-black text-lg uppercase tracking-tight mb-5">Elite development, one clear price.</p>

                            {/* Rate comparison */}
                            <div className="grid grid-cols-2 gap-4 mb-6 items-stretch">
                                <div className="bg-white/8 border border-white/20 rounded-xl p-4 text-center">
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Typical Private Coaching</p>
                                    <p className="text-2xl font-black text-white/50 tracking-tight line-through">$90–$120<span className="text-base">/hr</span></p>
                                    <p className="text-[10px] text-white/40 mt-1">Per single coach</p>
                                </div>
                                <div className="relative rounded-xl p-[2px] text-center bg-gradient-to-br from-rr-pink via-rr-pink/80 to-rr-blue shadow-[0_0_30px_rgba(229,6,149,0.4),0_0_60px_rgba(229,6,149,0.15)] scale-[1.05]">
                                    <div className="bg-rr-dark rounded-[10px] p-4 h-full flex flex-col items-center justify-center">
                                        <p className="text-[10px] font-bold text-rr-pink uppercase tracking-widest mb-2">Elite Program Rate</p>
                                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue tracking-tight">~$55<span className="text-lg">/hr</span></p>
                                        <p className="text-[10px] text-rr-pink/80 mt-1 font-bold">Full coaching network</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 leading-relaxed">
                                Includes access to our international coaching network, premium facilities, data monitoring, mental performance training, and S&C programming. Built around developing the skills that matter — helping cricketers of all ages win the key moments that define modern cricket.
                            </p>
                        </motion.div>

                    </div>

                    {/* Right column — price + payment + CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-col gap-6"
                    >

                        {/* Price card */}
                        <div className="bg-white/4 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rr-pink to-rr-blue" />
                            <div className="absolute bottom-4 right-4 opacity-[0.06] pointer-events-none">
                                <img src="/assets/rr-logo-blue.png" alt="" className="h-20 object-contain" />
                            </div>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">T20 Elite Program Price</p>
                            <div className="flex items-baseline gap-1 mb-1">
                                <p className="text-7xl font-black text-white tracking-tighter leading-none">$749</p>
                                <p className="text-white/40 text-lg font-bold tracking-tight">/payment</p>
                            </div>
                            <p className="text-white/50 text-sm font-medium mb-6">4 payments of $749 · Flexi Pay</p>

                            <div className="bg-white/6 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[9px] font-bold text-rr-pink uppercase tracking-[0.2em] bg-rr-pink/15 px-2 py-0.5 rounded-full">Best Value</span>
                                </div>
                                <p className="text-white/70 text-sm font-medium leading-relaxed">
                                    Or pay <span className="text-white font-black">$2,995</span> upfront and receive an additional training shirt and training pants.
                                </p>
                            </div>

                            <p className="text-white/30 text-xs font-medium uppercase tracking-widest mt-4">AUD · Season 1 · 2026</p>
                        </div>

                        {/* Payment options */}
                        <div className="bg-white/4 border border-white/10 rounded-2xl p-6">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-5">Payment Options</p>
                            <div className="space-y-0 divide-y divide-white/8">
                                {paymentOptions.map((opt, i) => (
                                    <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="shrink-0 w-16 mt-0.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${opt.tagColor}`}>{opt.tag}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm uppercase tracking-wide mb-1">{opt.title}</p>
                                            <p className="text-white/40 text-xs leading-relaxed">{opt.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deadline + CTA */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 text-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                                <span className="text-[10px] sm:text-xs font-bold text-rr-pink uppercase tracking-widest">
                                    Autumn Program — Applications Now Closed
                                </span>
                            </div>
                            <a
                                href="#checkout"
                                className="group w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-sm flex items-center justify-center gap-3"
                            >
                                Stay Connected for Future Programs
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />
        </section>
    );
};

export default ValueStack;
