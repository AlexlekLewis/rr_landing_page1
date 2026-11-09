import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { JR_T4 } from './jrTerm4Data';
import { MIN_AGE as PS_MIN_AGE, MAX_AGE as PS_MAX_AGE } from '../performance-squads/data';

// What your player gets: the benefits in six short cards (Andy, 8 Nov 2026: "be clear
// about the benefits, there is too much stuff"). Replaces the old About the Program
// section. Words live in JR_T4.benefits (editable in the admin Junior Royals Editor).
const fade = (i = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.06 } });

const JRBenefits = () => (
    <section className="py-24 bg-white" data-jr-benefits>
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
                <motion.p {...fade()} className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{JR_T4.benefitsEyebrow}</motion.p>
                <motion.h2 {...fade(1)} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">{JR_T4.benefitsTitle}</motion.h2>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {JR_T4.benefits.map((b, i) => (
                    <motion.li key={b.head} {...fade(i)} className="bg-white border border-slate-200 rounded-2xl p-6">
                        <span className="inline-flex w-9 h-9 rounded-full bg-rr-pink/10 items-center justify-center mb-4">
                            <svg className="w-4 h-4 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        <h3 className="text-lg font-black text-rr-dark uppercase tracking-tight mb-2">{b.head}</h3>
                        <p className="text-rr-charcoal font-medium leading-relaxed">{b.body}</p>
                    </motion.li>
                ))}
            </ul>

            <p className="text-center text-rr-charcoal font-medium mt-10">
                {JR_T4.olderLead} Our Performance Squads are for players aged {PS_MIN_AGE} to {PS_MAX_AGE}.{' '}
                <Link to={JR_T4.olderRoute} className="text-rr-pink font-bold underline underline-offset-2">{JR_T4.olderLinkLabel}</Link>
            </p>
        </div>
    </section>
);

export default JRBenefits;
