import React from 'react';
import { MOCKUP } from './juniorRoyalsData';

// A value Alex hasn't confirmed. Highlighted on the mock-up; the hover/long-press
// title says what needs deciding. Plain text once MOCKUP is false.
export const Tbc = ({ text, why }) =>
    MOCKUP ? (
        <mark title={why} className="bg-yellow-300 text-rr-dark font-bold px-1 rounded-sm">{text}</mark>
    ) : (
        <>{text}</>
    );

// Renders copy from the data file: a string, a tbc() value, or an array of both.
export const Rich = ({ v }) => {
    const parts = Array.isArray(v) ? v : [v];
    return parts.map((p, i) =>
        p && typeof p === 'object' && p.tbc ? <Tbc key={i} text={p.text} why={p.why} /> : <React.Fragment key={i}>{p}</React.Fragment>,
    );
};

export const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const SectionHead = ({ eyebrow, title, dark = false }) => (
    <div className="mb-10">
        <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-3">{eyebrow}</p>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4 ${dark ? 'text-white' : 'text-rr-dark'}`}>
            {title}
        </h2>
        <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue" />
    </div>
);
