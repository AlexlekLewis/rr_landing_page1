import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Clock, MapPin, Navigation, Droplets, Sun, Footprints, Users, CloudRain } from 'lucide-react';
import { fadeUp } from '../performance-squads/shared';
import {
    MORNING, BRING, EQUIPMENT_LINE, PARENTS_STAY, WEATHER_LINE, WHO_RUNS_IT, WHERE, MAPS_URL,
    FAQS, FAQ_HEADING,
} from './lpJrDayData';

// The light sections of /lower-plenty-junior-royals-day. White or slate-50,
// dark text, pink accents, no boxes with shadows (Alex, 12 Oct 2026 and
// earlier). Copy lives in lpJrDayData.js.

const Head = ({ eyebrow, title, sub }) => (
    <div className="max-w-3xl mb-10">
        <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-3">{eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight text-rr-dark">{title}</h2>
        {sub && <p className="text-rr-charcoal text-[15px] sm:text-lg font-medium leading-relaxed mt-4">{sub}</p>}
    </div>
);

const Section = ({ tone = 'white', children }) => (
    <section className={`py-16 sm:py-24 px-5 sm:px-6 ${tone === 'slate' ? 'bg-slate-50' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">{children}</div>
    </section>
);

const BRING_ICONS = [Droplets, Sun, Footprints];

// ── The morning, step by step, then what to bring ──
export const LPMorning = () => (
    <Section>
        <Head eyebrow={MORNING.eyebrow} title={MORNING.title} sub={MORNING.sub} />
        <ol className="grid md:grid-cols-3 gap-8 md:gap-10 mb-14">
            {MORNING.steps.map((s, i) => (
                <motion.li
                    key={s.title}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08}
                    className="border-l-4 border-rr-pink pl-5"
                >
                    <p className="flex items-center gap-2 text-rr-pink text-sm font-black uppercase tracking-wider mb-2">
                        <Clock className="w-4 h-4" /> {s.time}
                    </p>
                    <h3 className="text-xl font-black uppercase text-rr-dark mb-2">{s.title}</h3>
                    <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">{s.text}</p>
                </motion.li>
            ))}
        </ol>

        <div className="grid md:grid-cols-2 gap-10 border-t border-slate-200 pt-10">
            <div>
                <h3 className="text-lg font-black uppercase text-rr-dark mb-4">What to bring</h3>
                <ul className="space-y-3">
                    {BRING.map((b, i) => {
                        const Icon = BRING_ICONS[i] || Droplets;
                        return (
                            <li key={b} className="flex items-center gap-3 text-rr-charcoal text-[15px] font-semibold">
                                <Icon className="w-5 h-5 text-rr-pink shrink-0" /> {b}
                            </li>
                        );
                    })}
                </ul>
                <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed mt-4">{EQUIPMENT_LINE}</p>
            </div>
            <div>
                <h3 className="text-lg font-black uppercase text-rr-dark mb-4">Parents and weather</h3>
                <p className="flex items-start gap-3 text-rr-charcoal text-[15px] font-medium leading-relaxed mb-3">
                    <Users className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" /> {PARENTS_STAY}
                </p>
                <p className="flex items-start gap-3 text-rr-charcoal text-[15px] font-medium leading-relaxed">
                    <CloudRain className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" /> {WEATHER_LINE}
                </p>
            </div>
        </div>
    </Section>
);

// ── Where, and who runs it ──
export const LPWhere = () => (
    <Section tone="slate">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
                <Head eyebrow={WHERE.eyebrow} title={WHERE.title} />
                <p className="flex items-start gap-3 text-rr-dark text-lg font-bold leading-snug -mt-4 mb-4">
                    <MapPin className="w-5 h-5 text-rr-pink shrink-0 mt-1" />
                    <span>{WHERE.lines.map((l) => <span key={l} className="block">{l}</span>)}</span>
                </p>
                <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed mb-6">{WHERE.note}</p>
                <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-rr-blue hover:bg-rr-medium-blue text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                >
                    <Navigation className="w-4 h-4" /> {WHERE.directions}
                </a>
            </div>
            <div>
                <Head eyebrow={WHO_RUNS_IT.eyebrow} title={WHO_RUNS_IT.title} />
                <div className="space-y-4 -mt-4">
                    {WHO_RUNS_IT.lines.map((l) => (
                        <p key={l} className="text-rr-charcoal text-[15px] sm:text-base font-medium leading-relaxed">{l}</p>
                    ))}
                </div>
            </div>
        </div>
    </Section>
);

// ── FAQ: tap to open, light ──
export const LPFaq = () => {
    const [open, setOpen] = useState(null);
    return (
        <Section>
            <Head eyebrow={FAQ_HEADING.eyebrow} title={FAQ_HEADING.title} sub={FAQ_HEADING.sub} />
            <div className="max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
                {FAQS.map((f, i) => {
                    const isOpen = open === i;
                    return (
                        <div key={f.q}>
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                className="w-full min-h-[56px] flex items-center justify-between gap-4 text-left py-4"
                            >
                                <span className="text-[15px] sm:text-base font-black uppercase tracking-wide text-rr-dark">{f.q}</span>
                                <ChevronDown className={`w-5 h-5 text-rr-pink shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                                <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed pb-5 -mt-1">{f.a}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Section>
    );
};
