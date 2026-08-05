import React from 'react';
import { motion } from 'framer-motion';

// Reusable mid-page call to action. The page is long — coaches, pillars, a
// day-by-day timeline, inclusions, pricing — and previously a reader who was sold
// halfway down had to scroll to the very bottom or back up to the nav to act.
// This drops a register prompt at the end of the long sections.
//
// tone: 'navy' on white sections, 'light' on the slate-50 sections, so the band
// always separates from what it follows.
const ITCtaBand = ({ copy, heading, body, tone = 'navy' }) => {
    const scrollToRegister = () =>
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

    const isNavy = tone === 'navy';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
                isNavy ? 'bg-rr-navy' : 'bg-white border border-slate-200'
            }`}
        >
            <div>
                <h3
                    className={`text-xl md:text-2xl font-black uppercase tracking-wide ${
                        isNavy ? 'text-white' : 'text-rr-dark'
                    }`}
                >
                    {heading}
                </h3>
                <p
                    className={`text-sm md:text-base font-medium leading-relaxed mt-2 max-w-xl ${
                        isNavy ? 'text-white/70' : 'text-rr-charcoal'
                    }`}
                >
                    {body}
                </p>
            </div>
            <button
                onClick={scrollToRegister}
                data-cta="band-register"
                className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 inline-flex items-center gap-3 justify-center shrink-0 w-full md:w-auto"
            >
                {copy.hero.cta}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </motion.div>
    );
};

export default ITCtaBand;
