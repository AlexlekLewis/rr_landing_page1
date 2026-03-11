import React from 'react';
import { motion } from 'framer-motion';

// Reusable deadline pill — used across sections
export const DeadlineBanner = ({ className = '' }) => (
    <div className={`inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
            Entries close March 20 — or when full
        </span>
    </div>
);

// Reusable full CTA block — dark background sections
export const SecurePlaceCTADark = ({ label = 'Secure Your Place Now' }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 py-14 border-t border-white/10"
    >
        <DeadlineBanner />
        <a
            href="#checkout"
            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-10 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-xs sm:text-sm flex items-center gap-2 sm:gap-3"
        >
            {label}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </a>
    </motion.div>
);

// Reusable full CTA block — light background sections
export const SecurePlaceCTALight = ({ label = 'Secure Your Place Now' }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 py-14 border-t border-slate-200"
    >
        <div className="inline-flex items-center gap-2 bg-rr-pink/8 border border-rr-pink/25 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                Entries close March 20 — or when full
            </span>
        </div>
        <a
            href="#checkout"
            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-10 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.35)] text-xs sm:text-sm flex items-center gap-2 sm:gap-3"
        >
            {label}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </a>
    </motion.div>
);

export default SecurePlaceCTADark;
