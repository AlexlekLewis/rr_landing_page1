import React from 'react';
import { motion } from 'framer-motion';

export const Tick = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0 mt-[3px]">
        <circle cx="10" cy="10" r="10" fill="#E11F8F" />
        <path d="M5.5 10.3l3 3 6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TickList = ({ items, className = '' }) => (
    <ul className={`grid gap-2.5 ${className}`}>
        {items.map((t) => (
            <li key={t} className="flex gap-2.5 items-start min-w-0"><Tick /><span>{t}</span></li>
        ))}
    </ul>
);

export const SectionHead = ({ first, second, lead, dark = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-4 mb-9 max-w-3xl"
    >
        <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-wide leading-[1.05] ${dark ? 'text-white' : 'text-rr-dark'}`}>
            {first} <span className="block text-rr-pink">{second}</span>
        </h2>
        {lead && <p className={`text-lg font-medium ${dark ? 'text-slate-300' : 'text-rr-charcoal'}`}>{lead}</p>}
    </motion.div>
);

export const Photo = ({ profile, className = '', small = false }) => (
    <div className={`overflow-hidden bg-rr-pink flex items-center justify-center ${className}`}>
        {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" style={{ objectPosition: profile.photoPosition }} />
        ) : (
            <span className={`text-white font-black tracking-wider ${small ? 'text-sm' : 'text-[clamp(2rem,8vw,3.5rem)]'}`} aria-label={profile.name}>{profile.initials}</span>
        )}
    </div>
);
