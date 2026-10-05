import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { JR_T4_CONFIRMATION } from './JRT3RegistrationForm';
import { JR_T4 } from './jrTerm4Data';

// /junior-royals/success — Term 4 entry received. NOTHING is written from the
// browser here any more: the old Term 3 version marked a jr_term3_* row
// "completed" from localStorage, which anyone could trigger without paying
// (removed 3 Oct 2026). No payment is taken for Term 4 entries and no place
// is held. noindex: a confirmation page has no business in search results.
const JRT3Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Term 4 Entry Received | Junior Royals | Rajasthan Royals Academy Melbourne';
        let meta = document.head.querySelector('meta[name="robots"]');
        const previous = meta ? meta.getAttribute('content') : null;
        const created = !meta;
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'robots');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'noindex, nofollow');
        return () => {
            if (created) meta.remove();
            else if (previous != null) meta.setAttribute('content', previous);
        };
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } })
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans selection:bg-rr-pink selection:text-white relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">

            {/* Background gradient orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-rr-navy/60 blur-[80px]" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 max-w-2xl w-full mx-auto text-center">

                {/* Logo */}
                <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-10">
                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-16 md:h-20 mx-auto brightness-0 invert" />
                </motion.div>

                {/* Tick icon */}
                <motion.div initial="hidden" animate="visible" custom={0.15} variants={fadeUp} className="flex items-center justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-rr-pink/20 animate-ping scale-110" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shadow-[0_0_48px_rgba(225,31,143,0.4)]">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div initial="hidden" animate="visible" custom={0.25} variants={fadeUp} className="mb-4">
                    <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">Junior Royals — {JR_T4.term}</p>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
                        ENTRY{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">RECEIVED.</span>
                    </h1>
                </motion.div>

                {/* Divider */}
                <motion.div initial="hidden" animate="visible" custom={0.35} variants={fadeUp} className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mx-auto my-8" />

                {/* Welcome message */}
                <motion.p initial="hidden" animate="visible" custom={0.4} variants={fadeUp} className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed mb-6">
                    Thanks for registering your interest in Junior Royals, Term 4.
                </motion.p>

                {/* Body copy */}
                <motion.p initial="hidden" animate="visible" custom={0.5} variants={fadeUp} className="text-base md:text-lg text-white/70 leading-relaxed mb-6 max-w-lg mx-auto font-medium">
                    {JR_T4_CONFIRMATION}
                </motion.p>

                {/* What to bring */}
                <motion.div initial="hidden" animate="visible" custom={0.55} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-2">What to Bring</p>
                            <ul className="text-sm text-white/60 leading-relaxed space-y-1">
                                <li>• A drink bottle and water</li>
                                <li>• Please arrive <span className="text-white font-bold">10 minutes early</span> for your first session</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Place confirmation */}
                <motion.div initial="hidden" animate="visible" custom={0.6} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-2">What Happens Next</p>
                            <p className="text-sm text-white/70 leading-relaxed mb-2">
                                We'll email you the Term 4 price and how to book before the first session on <span className="font-bold text-white">{JR_T4.firstSessionLong}</span>. Your player's place is only held once you've booked.
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed mb-2">
                                Please check your email inbox, including your <span className="font-bold text-white/80">junk, spam and promotions folders</span>, as our confirmation may be filtered.
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed mb-2">
                                Once you've booked, you'll get a follow-up email before the first session with everything you need to know.
                            </p>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Office hours: Monday – Friday, 8:30am – 5:30pm. We reply on business days.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Questions */}
                <motion.div initial="hidden" animate="visible" custom={0.65} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-10 text-left backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90 mb-1">Questions?</p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Reach out to our team at{' '}
                                <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div initial="hidden" animate="visible" custom={0.7} variants={fadeUp}>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] group"
                    >
                        Back to Home
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>

                {/* HALLA BOL footer stamp */}
                <motion.p initial="hidden" animate="visible" custom={0.85} variants={fadeUp} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">
                    HALLA BOL
                </motion.p>

            </div>
        </div>
    );
};

export default JRT3Success;
