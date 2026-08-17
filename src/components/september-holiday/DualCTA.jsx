import React from 'react';

// Primary CTA: "Secure Your Place" — scrolls to the registration form (#secure-form).
// variant: 'dark' for dark backgrounds, 'light' for white/slate backgrounds. size: 'lg' | 'sm'.
const DualCTA = ({ variant = 'dark', size = 'lg', className = '' }) => {
    const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const pad = size === 'lg' ? 'px-8 py-4 text-sm' : 'px-5 py-3 text-xs';
    const primary = `bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(225,31,143,0.55)] ${pad}`;
    const secondary = variant === 'dark'
        ? `border-2 border-white/40 hover:border-white text-white font-black uppercase tracking-widest rounded-full transition-all duration-300 ${pad}`
        : `border-2 border-rr-pink/50 hover:border-rr-pink text-rr-pink font-black uppercase tracking-widest rounded-full transition-all duration-300 ${pad}`;

    return (
        <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
            <button onClick={() => go('secure-form')} className={primary}>
                Secure Your Place
            </button>
        </div>
    );
};

export default DualCTA;
