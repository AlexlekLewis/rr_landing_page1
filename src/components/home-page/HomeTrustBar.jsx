import React from 'react';
import { motion } from 'framer-motion';

const trustItems = [
    { label: 'Official Rajasthan Royals Academy' },
    { label: 'IPL Methodology' },
    { label: 'Melbourne\'s #1 Cricket Academy' },
    { label: '500+ Players Trained' },
    { label: 'World-Class Coaches' },
    { label: 'Biomechanics & Data Analytics' },
    { label: 'T20 Performance Environment' },
    { label: 'Programs for All Ages' },
];

const HomeTrustBar = () => {
    const doubled = [...trustItems, ...trustItems];

    return (
        <section className="py-6 bg-rr-dark border-t border-b border-white/10 overflow-hidden">
            <div className="flex animate-scroll-x whitespace-nowrap">
                {doubled.map((item, i) => (
                    <div key={i} className="inline-flex items-center gap-4 px-8 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink" />
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeTrustBar;
