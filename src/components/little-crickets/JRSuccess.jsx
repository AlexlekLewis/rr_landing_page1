import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { supabase } from '../../lib/supabase';

const JRSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        const recordId = localStorage.getItem('jr_record_id');
        const location = localStorage.getItem('jr_location');
        if (recordId && location) {
            const table = location === 'bundoora' ? 'junior_royals_bundoora' : 'junior_royals_hallam';
            supabase.from(table)
                .update({ payment_status: 'completed' })
                .eq('id', recordId)
                .then(() => {
                    localStorage.removeItem('jr_record_id');
                    localStorage.removeItem('jr_location');
                });
        }
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.6, ease: 'easeOut', delay }
        })
    };

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans selection:bg-rr-pink selection:text-white relative overflow-hidden flex flex-col">
            {/* Background orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
            </div>

            <Navbar variant="junior-royals" />

            <main className="flex-1 flex items-center justify-center px-6 py-32">
                <div className="relative z-10 max-w-2xl w-full mx-auto text-center">

                    {/* Logo */}
                    <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-10">
                        <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-16 md:h-20 mx-auto brightness-0 invert" />
                    </motion.div>

                    {/* Tick */}
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
                        <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">Enrolment Confirmed</p>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
                            YOU'RE{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">IN.</span>
                        </h1>
                    </motion.div>

                    {/* Divider */}
                    <motion.div initial="hidden" animate="visible" custom={0.35} variants={fadeUp} className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mx-auto my-8" />

                    {/* Welcome */}
                    <motion.p initial="hidden" animate="visible" custom={0.4} variants={fadeUp} className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed mb-6">
                        Welcome to the Junior Royals — Term 2, 2026.
                    </motion.p>

                    {/* Body */}
                    <motion.p initial="hidden" animate="visible" custom={0.5} variants={fadeUp} className="text-base md:text-lg text-white/70 leading-relaxed mb-6 max-w-lg mx-auto font-medium">
                        You are now enrolled in the program and our team are looking forward to working with you as you continue your cricketing journey — the Royals Way.
                    </motion.p>

                    {/* Confirmation notice */}
                    <motion.div initial="hidden" animate="visible" custom={0.55} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-6 text-left backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/90 mb-1">Place Confirmation</p>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    A member of our team will confirm your place in the program via email within 24 hours of receipt, on the first business day following your online enrolment. Our office hours are Monday to Friday, 8:30am – 5:30pm.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div initial="hidden" animate="visible" custom={0.6} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-10 text-left backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/90 mb-1">Questions in the meantime?</p>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Reach out to our team at{' '}
                                    <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline transition-all">
                                        info@rramelbourne.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div initial="hidden" animate="visible" custom={0.7} variants={fadeUp}>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] group"
                        >
                            Back to Home
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>

                    <motion.p initial="hidden" animate="visible" custom={0.85} variants={fadeUp} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">
                        HALLA BOL
                    </motion.p>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default JRSuccess;
