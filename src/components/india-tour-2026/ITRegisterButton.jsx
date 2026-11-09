import React from 'react';
import { TOUR_STATUS } from './itCopy';

// The one "Register Now" button used in every section of /tours. It scrolls to
// the form. `tone` = 'pink' (default, for white or navy sections) or 'outline'
// (a quieter version for dark sections that already have a pink button).
// `id` becomes data-cta so analytics can tell the buttons apart.
const ITRegisterButton = ({ label, id, className = '', fullOnMobile = true }) => {
    if (TOUR_STATUS === 'closed') return null;
    const go = () => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    return (
        <button
            type="button"
            onClick={go}
            data-cta={id}
            className={`group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] inline-flex items-center gap-3 justify-center ${fullOnMobile ? 'w-full sm:w-auto' : ''} ${className}`}
        >
            {label}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </button>
    );
};

export default ITRegisterButton;
