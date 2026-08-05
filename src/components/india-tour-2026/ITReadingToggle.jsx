import React from 'react';

// Review-only control for comparing the two reading levels. It renders ONLY
// when the URL already carries ?read= (see useReadingMode), so a member of the
// public arriving at /india-tour-2026 never sees it.
const ITReadingToggle = ({ simple, onChange }) => (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1 bg-rr-dark rounded-full p-1 shadow-2xl border border-white/15">
        <span className="pl-3 pr-1 text-[10px] font-bold text-white/50 uppercase tracking-widest select-none">
            Preview
        </span>
        {[
            { key: 'standard', label: 'Club voice' },
            { key: 'simple', label: 'Plain English' },
        ].map((opt) => {
            const active = (opt.key === 'simple') === simple;
            return (
                <button
                    key={opt.key}
                    type="button"
                    onClick={() => onChange(opt.key)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-colors ${
                        active ? 'bg-rr-pink text-white' : 'text-white/70 hover:text-white'
                    }`}
                >
                    {opt.label}
                </button>
            );
        })}
    </div>
);

export default ITReadingToggle;
