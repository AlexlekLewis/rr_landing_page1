import React from 'react';
import { labelCls } from './pcHelpers';

// Small shared form pieces for the coach-led private coaching pages.
export const Err = ({ children }) => (children ? <p className="text-red-500 text-xs font-medium mt-1">{children}</p> : null);
export const Field = ({ id, label, error, optional, hint, children }) => (
    <div id={`f-${id}`}>
        <label htmlFor={id} className={labelCls}>{label}{!optional && ' *'}{optional && <span className="normal-case tracking-normal font-semibold text-slate-400"> (optional)</span>}</label>
        {children}
        {hint && !error && <p className="text-[11px] text-slate-500 font-medium mt-1">{hint}</p>}
        <Err>{error}</Err>
    </div>
);
export const Photo = ({ c, className = '' }) => (
    c?.img
        ? <img src={c.img} alt={c.name} className={`w-full h-full object-cover object-top ${className}`} />
        : <div className={`w-full h-full flex items-center justify-center text-white text-4xl font-black ${className}`} style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{c?.name?.split(' ').map((p) => p[0]).join('')}</div>
);
