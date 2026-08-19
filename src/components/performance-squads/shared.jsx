import React from 'react';
import { ChevronDown } from 'lucide-react';

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
};

export const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const SectionHeading = ({ eyebrow, title, sub }) => (
    <div className="max-w-3xl mx-auto text-center mb-12">
        {eyebrow && (
            <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-3">
                {eyebrow}
            </span>
        )}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight">{title}</h2>
        {sub && <p className="text-white/65 text-[15px] sm:text-base font-medium mt-4 leading-relaxed">{sub}</p>}
    </div>
);

export const Label = ({ children, required }) => (
    <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 text-left">
        {children} {required && <span className="text-rr-pink">*</span>}
    </label>
);

export const FieldError = ({ msg }) =>
    msg ? <p className="text-rr-pink text-xs font-bold mt-1 text-left">{msg}</p> : null;

export const Chevron = () => (
    <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
);

export const inputClass = (errors, key) =>
    `w-full bg-white/5 border ${errors?.[key] ? 'border-rr-pink' : 'border-white/15'} rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-[15px] focus:outline-none focus:border-rr-pink/70 transition-colors`;

export const selectClass = (errors, key) =>
    `${inputClass(errors, key)} appearance-none pr-10 cursor-pointer [&>option]:text-rr-dark`;
