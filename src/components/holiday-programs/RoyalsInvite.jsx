import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const RoyalsInvite = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">

            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rr-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-rr-blue/5 blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-5 py-2">
                        <Lock className="w-3 h-3 text-rr-pink" />
                        <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Exclusive to Rajasthan Royals Academy Melbourne Participants</span>
                    </div>
                </motion.div>

                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative rounded-3xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 50%, #E11F8F 100%)' }}
                >
                    {/* Inner border shimmer */}
                    <div className="absolute inset-[1px] rounded-3xl bg-rr-dark/80 z-0" />

                    <div className="relative z-10 p-8 md:p-14">

                        {/* Logo + program row */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                            <img
                                src="/assets/MELBOURNE_OFFICIAL.png"
                                alt="Rajasthan Royals Academy Melbourne"
                                className="h-16 md:h-20 object-contain brightness-0 invert opacity-90"
                            />
                            <div className="h-px sm:h-16 w-16 sm:w-px bg-white/20" />
                            <div className="text-center sm:text-left">
                                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">April 2026</p>
                                <p className="text-white font-black text-lg uppercase tracking-wide">Junior Royals Holiday Camp</p>
                            </div>
                        </div>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
                            THE ROYALS<br />
                            <span className="text-rr-pink">INVITE.</span>
                        </h2>

                        {/* Divider */}
                        <div className="w-16 h-1 rounded-full mb-8" style={{ background: 'linear-gradient(90deg, #E11F8F, #1226AA)' }} />

                        {/* Body copy */}
                        <p className="text-white/90 text-lg md:text-xl font-semibold leading-relaxed max-w-2xl mb-6">
                            Register for the Junior Royals Holiday Camp and unlock an exclusive invitation to a <span className="text-white font-black">live group Q&amp;A session with a 2026 Rajasthan Royals IPL player.</span>
                        </p>
                        <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xl mb-10">
                            This invitation is not available to the general public. Rajasthan Royals Academy Melbourne participants only. Exclusively for those registered in the April 2026 Junior Royals Holiday Camp.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                            {[
                                { icon: '🏏', text: 'Group Q&A session with an IPL star' },
                                { icon: '🔒', text: 'RRA Melbourne participants only' },
                                { icon: '⭐', text: 'Not available to the public' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                                    <span className="text-base">{item.icon}</span>
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wide">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_32px_rgba(229,6,149,0.55)]"
                        >
                            Registration Opening Soon
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                    </div>
                </motion.div>

                {/* Fine print */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-slate-400 text-xs font-medium mt-8"
                >
                    The Royals Invite is subject to availability and confirmation of the IPL participant. RRA will communicate full details to registered participants ahead of the event.
                </motion.p>

            </div>
        </section>
    );
};

export default RoyalsInvite;
