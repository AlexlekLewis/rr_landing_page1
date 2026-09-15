import React from 'react';

// A detail that isn't confirmed yet. Any unconfirmed detail makes the whole
// page a draft (see getMissingDetails), so this never shows on a finished page.
export const Pending = ({ children }) => (
    <span className="inline-block rounded-md border border-dashed border-amber-300/70 bg-amber-300/10 px-2 py-0.5 text-amber-200 text-[0.9em] font-bold">
        {children}
    </span>
);

// Small labels use light pink: brand pink is too low-contrast for small text
// on the dark background. Brand pink stays on large headings and buttons.
export const Eyebrow = ({ children, className = '' }) => (
    <p className={`text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-rr-light-pink mb-3 ${className}`}>
        {children}
    </p>
);

export const Heading = ({ eyebrow, title, sub }) => (
    <div className="max-w-3xl mx-auto text-center mb-10">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight">{title}</h2>
        {sub && <p className="text-white/75 text-base sm:text-lg font-medium mt-4 leading-relaxed">{sub}</p>}
    </div>
);

export const Card = ({ className = '', children }) => (
    <div className={`bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8 ${className}`}>{children}</div>
);

export const Bullets = ({ items }) => (
    <ul className="space-y-3">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[10px] w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                <span className="text-white/85 text-base font-medium leading-relaxed">{item}</span>
            </li>
        ))}
    </ul>
);
