import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, MapPin } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import JuniorRoyalsForm from './JuniorRoyalsForm';
import { Rich, SectionHead, scrollToId } from './JuniorRoyalsShared';
import {
    MOCKUP, OPEN_QUESTIONS, HERO, CTA, WHY, HOW, GROUPS, CENTRES, MEMBERSHIP, FEES, YEARLY,
    CALENDAR, MATCHES, WHERE, CENTRES_APART, NOT_RUNNING, FIRST_SESSION, FORM, FAQS, money,
} from './juniorRoyalsData';

// ─────────────────────────────────────────────────────────────
// JUNIOR ROYALS — /junior-royals. Year-round membership (Alex, 5 Oct 2026).
// Built with the rr-page-generator skill: Why → How → What, every fact and line
// of copy in ./juniorRoyalsData.js. Interest only for now: no payment, no place
// held. Section ids match JRM_NAV in Navbar.jsx.
// ─────────────────────────────────────────────────────────────

const SECTIONS = ['hero', 'why', 'how', 'membership', 'matches', 'where', 'register', 'faq'];

const fade = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

const PrimaryButton = ({ className = '' }) => (
    <button onClick={() => scrollToId('register')}
        className={`inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors ${className}`}>
        {CTA.primary} <ArrowRight className="w-4 h-4" />
    </button>
);

const Tick = ({ children, dark }) => (
    <li className="flex items-start gap-3">
        <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" strokeWidth={3} />
        <span className={`text-[15px] sm:text-base font-medium leading-relaxed ${dark ? 'text-white/80' : 'text-rr-charcoal'}`}>{children}</span>
    </li>
);

// ── Review banner (mock-up only) ──
const MockupBanner = () => {
    const [open, setOpen] = useState(false);
    if (!MOCKUP) return null;
    return (
        <div className="bg-yellow-300 text-rr-dark">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 py-3">
                <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 text-left">
                    <span className="text-sm font-bold">
                        <span className="font-black uppercase tracking-wider">Mock-up for review, not live.</span>{' '}
                        Yellow = still to confirm ({OPEN_QUESTIONS.length} items). The form saves nothing.
                    </span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                    <ol className="mt-3 mb-1 list-decimal pl-5 space-y-1 text-sm font-medium">
                        {OPEN_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
                    </ol>
                )}
            </div>
        </div>
    );
};

// ── 1. Hero: one line of Why + the facts + the button (conversion.md §2) ──
const Hero = () => (
    <section className="relative overflow-hidden bg-rr-dark">
        <img src="/assets/little-crickets-hero.jpeg" alt="A Junior Royals coach talking to a group of young players in the nets"
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/85 to-rr-dark/40 md:bg-gradient-to-r md:from-rr-dark md:via-rr-dark/90 md:to-rr-dark/10" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-16 pb-16 md:pt-24 md:pb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-xl">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">{HERO.eyebrow}</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white mb-5">{HERO.title}</h1>
                <p className="text-lg sm:text-xl font-bold text-rr-light-pink leading-snug mb-8">{HERO.why}</p>
                <dl className="space-y-2.5 mb-8">
                    {HERO.facts.map((f) => (
                        <div key={f.k} className="flex gap-4">
                            <dt className="w-16 shrink-0 text-xs font-black uppercase tracking-widest text-rr-pink pt-1">{f.k}</dt>
                            <dd className="text-white text-[15px] sm:text-base font-semibold leading-snug"><Rich v={f.v} /></dd>
                        </div>
                    ))}
                </dl>
                <div className="flex flex-col sm:flex-row gap-3">
                    <PrimaryButton />
                    <button onClick={() => scrollToId('membership')}
                        className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors">
                        {CTA.secondary}
                    </button>
                </div>
                <p className="mt-4 text-sm font-medium text-white/70">{HERO.noPayment}</p>
            </motion.div>
        </div>
    </section>
);

// ── 2. Why ──
const Why = () => (
    <section className="bg-white py-16 md:py-24">
        <motion.div {...fade} className="max-w-3xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={WHY.eyebrow} title={WHY.title} />
            {WHY.body.map((p) => <p key={p} className="text-lg text-rr-charcoal font-medium leading-relaxed mb-5">{p}</p>)}
        </motion.div>
    </section>
);

// ── 3. How ──
const How = () => (
    <section className="bg-rr-dark py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={HOW.eyebrow} title={HOW.title} dark />
            {HOW.intro.map((p) => <p key={p} className="max-w-3xl text-lg text-white/80 font-medium leading-relaxed mb-10">{p}</p>)}

            <div className="grid sm:grid-cols-2 gap-8 mb-14 max-w-3xl">
                {GROUPS.map((g) => (
                    <motion.div {...fade} key={g.time} className="border-t-2 border-rr-pink pt-4">
                        <p className="text-2xl font-black text-white">{g.time}</p>
                        <p className="text-white/70 font-medium mt-1"><Rich v={g.who} /></p>
                    </motion.div>
                ))}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-6">What your player works on</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-14">
                {HOW.ageBands.map((b, i) => (
                    <motion.div {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} key={b.ages}>
                        <p className="text-xl font-black text-white uppercase mb-3">Ages {b.ages}</p>
                        <ul className="space-y-2.5">{b.points.map((pt) => <Tick key={pt} dark>{pt}</Tick>)}</ul>
                    </motion.div>
                ))}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-6">Your Head Coach</h3>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {CENTRES.map(({ coach, suburb }) => (
                    <motion.div {...fade} key={suburb} className="flex gap-5 items-start">
                        <img src={coach.img} alt={coach.name} className="w-24 h-24 rounded-full object-cover shrink-0 border-2 border-white/20" />
                        <div>
                            <p className="text-xl font-black text-white">{coach.name}</p>
                            <p className="text-rr-light-pink text-xs font-bold uppercase tracking-widest mt-1 mb-2"><Rich v={coach.jrRole} /></p>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">{coach.credentials.join(' · ')}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <ul className="space-y-3 max-w-3xl">
                {HOW.details.map((d, i) => <Tick key={i} dark><Rich v={d} /></Tick>)}
            </ul>
        </div>
    </section>
);

// ── 4. Membership — the money, in words a 10-year-old can follow ──
const Membership = () => (
    <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={MEMBERSHIP.eyebrow} title={MEMBERSHIP.title} />
            <p className="text-xl text-rr-dark font-bold leading-relaxed max-w-3xl mb-10">{MEMBERSHIP.lead}</p>

            {/* The three numbers, side by side. No boxes: lines only. */}
            <div className="grid grid-cols-3 border-y border-slate-300 divide-x divide-slate-300 mb-10">
                {[
                    { n: money(FEES.joining), l: 'to join, once' },
                    { n: money(FEES.weekly), l: 'a week, all year' },
                    { n: money(YEARLY), l: 'a year in total' },
                ].map((x) => (
                    <div key={x.l} className="py-6 px-2 text-center">
                        <p className="text-3xl sm:text-5xl font-black text-rr-dark">{x.n}</p>
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rr-charcoal mt-2">{x.l}</p>
                    </div>
                ))}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-5">The simple version</h3>
            <ol className="space-y-5 mb-8 max-w-3xl">
                {MEMBERSHIP.simple.map((line, i) => (
                    <li key={line} className="flex gap-4">
                        <span className="text-2xl font-black text-rr-pink leading-none w-8 shrink-0">{i + 1}</span>
                        <span className="text-lg text-rr-dark font-semibold leading-relaxed">{line}</span>
                    </li>
                ))}
            </ol>
            <p className="text-rr-charcoal font-medium leading-relaxed max-w-3xl mb-2"><Rich v={MEMBERSHIP.firstPayment} /></p>
            <p className="text-rr-charcoal font-bold mb-14">{MEMBERSHIP.gst}</p>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-5">{MEMBERSHIP.includesTitle}</h3>
                    <ul className="space-y-4">
                        {MEMBERSHIP.includes.map((it) => (
                            <li key={it.title} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" strokeWidth={3} />
                                <span>
                                    <span className="block font-black text-rr-dark">{it.title}</span>
                                    <span className="block text-rr-charcoal font-medium leading-relaxed"><Rich v={it.body} /></span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rr-pink mb-5">When we train</h3>
                    <table className="w-full text-left">
                        <tbody>
                            {CALENDAR.map((c) => (
                                <tr key={c.label} className="border-b border-slate-200">
                                    <td className={`py-3 pr-3 font-black ${c.holiday ? 'text-rr-charcoal' : 'text-rr-dark'}`}>{c.label}</td>
                                    <td className="py-3 pr-3 text-rr-charcoal font-medium text-sm">{c.dates}</td>
                                    <td className="py-3 text-right font-bold text-sm text-rr-dark whitespace-nowrap">
                                        {c.holiday ? <span className="text-rr-pink">Payments continue</span> : `${c.sessions} sessions`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-sm text-rr-charcoal font-medium mt-3">
                        Training follows the Victorian school terms. There is no training in the school holidays, and the weekly payment continues.
                    </p>
                </div>
            </div>
            <div className="mt-12"><PrimaryButton /></div>
        </div>
    </section>
);

// ── 5. Sunday match days ──
const Matches = () => (
    <section className="bg-rr-dark py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <motion.div {...fade} className="max-w-3xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={MATCHES.eyebrow} title={MATCHES.title} dark />
            {MATCHES.body.map((p) => <p key={p} className="text-lg text-white/80 font-medium leading-relaxed mb-5">{p}</p>)}
            <ul className="space-y-3 mt-6">
                {MATCHES.details.map((d, i) => <Tick key={i} dark><Rich v={d} /></Tick>)}
            </ul>
        </motion.div>
    </section>
);

// ── 6. Where ──
const Where = () => (
    <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={WHERE.eyebrow} title={WHERE.title} />
            <div className="grid md:grid-cols-2 gap-10 mb-8">
                {CENTRES.map((c) => (
                    <motion.div {...fade} key={c.value} className="border-l-4 border-rr-pink pl-5">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-2">{c.region}</p>
                        <p className="text-2xl font-black text-rr-dark uppercase leading-tight">{c.venue}</p>
                        <p className="text-lg font-bold text-rr-dark">{c.suburb}</p>
                        <p className="text-rr-charcoal font-medium mt-2">{c.address}</p>
                        <p className="text-rr-charcoal font-medium">Wednesdays from {FIRST_SESSION.short} · 6:00pm and 7:00pm groups</p>
                        <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-rr-pink font-bold text-sm hover:underline">
                            <MapPin className="w-4 h-4" /> Get directions
                        </a>
                    </motion.div>
                ))}
            </div>
            <p className="text-rr-charcoal font-medium">{CENTRES_APART} {NOT_RUNNING}</p>
        </div>
    </section>
);

// ── 7. Register ──
const Register = () => (
    <section className="bg-rr-dark py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
            <SectionHead eyebrow={FORM.eyebrow} title={FORM.title} dark />
            <p className="text-lg text-white/80 font-medium leading-relaxed mb-8"><Rich v={FORM.intro} /></p>
            <JuniorRoyalsForm />
        </div>
    </section>
);

// ── 8. FAQ ──
const Faq = () => {
    const [open, setOpen] = useState(0);
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-5 sm:px-6">
                <SectionHead eyebrow="Questions" title="Questions parents ask" />
                <div className="border-t border-slate-200">
                    {FAQS.map((f, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={f.q} className="border-b border-slate-200">
                                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full py-5 text-left flex justify-between items-center gap-4">
                                    <span className={`font-bold text-base md:text-lg ${isOpen ? 'text-rr-pink' : 'text-rr-dark'}`}>{f.q}</span>
                                    <ChevronDown className={`w-5 h-5 shrink-0 text-rr-charcoal transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <p className="pb-5 text-rr-charcoal font-medium leading-relaxed"><Rich v={f.a} /></p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
                <p className="mt-8 text-rr-charcoal font-medium">
                    Anything else? Email <a href={`mailto:${FORM.contact}`} className="text-rr-pink font-bold hover:underline">{FORM.contact}</a>.
                </p>
            </div>
        </section>
    );
};

// ── Sticky bar on phones, after the hero ──
const StickyBar = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const on = () => {
            const reg = document.getElementById('register')?.getBoundingClientRect();
            const inForm = reg && reg.top < window.innerHeight && reg.bottom > 0;
            setShow(window.scrollY > 600 && !inForm);
        };
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);
    if (!show) return null;
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-rr-dark border-t border-white/15 px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-white text-sm font-bold leading-tight">{CTA.sticky}</span>
            <button onClick={() => scrollToId('register')} className="bg-rr-pink text-white font-black uppercase tracking-wider text-xs rounded-full px-5 py-3 whitespace-nowrap">
                {CTA.primary}
            </button>
        </div>
    );
};

const JuniorRoyals = () => {
    usePageAnalytics('/junior-royals', { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col">
            <Navbar variant="junior-royals-membership" />
            <main className="flex-1 w-full overflow-hidden pt-[84px] md:pt-[112px]">
                <MockupBanner />
                <div id="hero" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Hero /></div>
                <div id="why" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Why /></div>
                <div id="how" className="scroll-mt-[84px] md:scroll-mt-[112px]"><How /></div>
                <div id="membership" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Membership /></div>
                <div id="matches" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Matches /></div>
                <div id="where" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Where /></div>
                <div id="register" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Register /></div>
                <div id="faq" className="scroll-mt-[84px] md:scroll-mt-[112px]"><Faq /></div>
            </main>
            <Footer />
            <StickyBar />
        </div>
    );
};

export default JuniorRoyals;
