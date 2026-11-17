import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

// THE BENEFITS. Andy, 13 Nov 2026: "Coach and influence some of the best up and
// coming players, coach within the Royals ecosystem, opportunities to develop through
// trips to the Rajasthan Royals high performance centre and more."
// Royals-side claims are limited to what the Royals Group papers and the live site
// already state: the three Royals teams, HPC trips, the Coaching Hub course and its
// named IPL coaches, and visits from Royals coaches.
const BENEFITS = [
    {
        title: 'Coach the best young players',
        body: 'Coach and influence some of Melbourne’s best up-and-coming cricketers, from Junior Royals to the players selected for our Performance Squads.',
    },
    {
        title: 'Coach inside the Royals',
        body: 'You coach within the Royals Group, home of the Rajasthan Royals (IPL), Paarl Royals (SA20) and Barbados Royals (CPL), to one coaching philosophy: the Royals Way.',
        logos: true,
    },
    {
        title: 'Trips to the Royals High Performance Centre',
        body: 'Our academy tours go to the Rajasthan Royals High Performance Centre in Nagpur, India. Coaching places on each trip are chosen on performance.',
    },
    {
        title: 'Learn from IPL coaches',
        body: 'We pay for your Royals Coaching Hub course, taught by IPL coaches including Siddhartha Lahiri, Shane Burger and Michael Italiano, and you coach alongside visiting Royals coaches.',
    },
    {
        title: 'A mentor and a clear path up',
        body: 'Onboarding before your first session, a one-to-one catch-up every month and a review every term. Move from Cadet to Assistant, Lead and Performance Squad Coach.',
    },
    {
        title: 'Paid, flexible coaching',
        body: 'Casual, part-time or full-time coaching hours, with volunteer and work experience places for people starting out.',
    },
];

const LOGOS = [
    { src: '/assets/rajasthan-royals-logo.png', alt: 'Rajasthan Royals' },
    { src: '/assets/paarl-royals-logo.png', alt: 'Paarl Royals' },
    { src: '/assets/barbados-royals-logo.png', alt: 'Barbados Royals' },
];

const BenefitsSection = () => (
    <section className="relative py-20 md:py-28 bg-rr-dark overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
            <SectionHeader dark eyebrow="The Benefits" title="Why Coach" accent="With Us." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {BENEFITS.map((b, i) => (
                    <motion.div
                        key={b.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06 * i }}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7"
                    >
                        <span className="block text-rr-pink font-black text-sm mb-3">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight mb-3">{b.title}</h3>
                        <p className="text-white/70 font-medium leading-relaxed text-sm md:text-base">{b.body}</p>
                        {b.logos && (
                            <div className="flex items-center gap-4 mt-5">
                                {LOGOS.map((l) => (
                                    <img key={l.alt} src={l.src} alt={l.alt} loading="lazy" className="h-10 w-auto object-contain" />
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default BenefitsSection;
