import React from 'react';
import { JR_T4 } from './jrTerm4Data';

// The Join Now button (JR_T4.ctaLabel; was "Secure Your Place") at the end of each section (Andy, 10 Nov 2026: "remove the floating
// SECURE YOUR PLACE button, and instead have a secure your place button on each section").
// Same pill as the hero button; takes the family to the booking form. `id` names the section
// for analytics (data-cta="jr-secure-<id>").
export const scrollToForm = () => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });

const JRSectionCTA = ({ id, className = 'mt-12' }) => (
    <div className={`flex justify-center ${className}`}>
        <button type="button" onClick={scrollToForm} data-cta={`jr-secure-${id}`}
            className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-colors duration-300">
            {JR_T4.ctaLabel}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>
    </div>
);

export default JRSectionCTA;
