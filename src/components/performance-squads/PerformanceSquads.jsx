import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, MapPin, Users, Trophy, Shield, ChevronDown,
    ClipboardCheck, Mail, CalendarDays, Star, CreditCard,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — /performance-squads
// HIDDEN PAGE: not linked from nav/homepage/sitemap, noindex.
// Direct URL only until Andy approves go-live.
//
// Players either TRIAL or are INVITED into a squad. Each squad
// fields a First XI plus additional teams assembled for Power
// League rounds and matches against external opposition.
//
// PLACEHOLDERS (swap when Andy provides real details):
//   • Trial dates/times per centre        → CENTRES[].trialDate
//   • Prices (trial / games / training)   → PAYMENT_OPTIONS[].price
//   • Stripe payment links                → PAYMENT_LINKS
// ─────────────────────────────────────────────────────────────

const CENTRES = [
    {
        slug: 'north-melbourne',
        name: 'North Melbourne',
        venue: 'Mickleham Indoor Sports Centre',
        suburb: 'Mickleham',
        coach: 'Alex Lewis',
        coachTitle: 'Head Coach',
        trialDates: [], // empty → "Trial dates announced soon"
        active: true,
    },
    {
        slug: 'south-east-melbourne',
        name: 'South-East Melbourne',
        venue: 'Elite Cricket Centre',
        suburb: 'Cranbourne North',
        coach: 'Alex Thornhill',
        coachTitle: 'Head Coach',
        trialDates: [
            'Trial 1 — Sunday 6 September · 7:00–8:30 PM',
            'Trial 2 — Friday 11 September · 8:00–9:30 PM',
            'Trial 3 — Sunday 13 September · 7:00–8:30 PM',
        ],
        active: true,
    },
    // Future squads — displayed as "Coming 2027", not selectable.
    { slug: 'west-melbourne', name: 'West Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialDates: [], active: false },
    { slug: 'east-melbourne', name: 'East Melbourne', venue: 'Venue to be announced', suburb: '', coach: null, trialDates: [], active: false },
];

const ACTIVE_CENTRES = CENTRES.filter((c) => c.active);

// Stripe payment links — PASTE LIVE URLs when created in Stripe.
// While null, the pay button shows "Payment link coming soon" and is disabled.
const PAYMENT_LINKS = {
    'north-melbourne': {
        trial: null,    // e.g. 'https://buy.stripe.com/xxxx'
        games: null,
        training: null,
    },
    'south-east-melbourne': {
        trial: null,
        games: null,
        training: null,
    },
};

// PLACEHOLDER prices — swap for real amounts before public launch.
const PAYMENT_OPTIONS = [
    { key: 'trial', label: 'Trial Fee', price: 'TBC', desc: 'One-off fee to take part in your centre’s trial session.' },
    { key: 'games', label: 'Game Fee', price: 'TBC', desc: 'Match-day fee for Power League rounds and external fixtures.' },
    { key: 'training', label: 'Training Fee', price: 'TBC', desc: 'Ongoing squad training at your home centre.' },
];

const PLAYING_ROLES = ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Wicket-Keeper Batter'];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
};

const SectionHeading = ({ eyebrow, title, sub }) => (
    <div className="max-w-3xl mx-auto text-center mb-12">
        {eyebrow && (
            <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-3">
                {eyebrow}
            </span>
        )}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight">{title}</h2>
        {sub && <p className="text-white/65 text-[15px] sm:text-base font-medium mt-4 leading-relaxed">{sub}</p>}
    </div>
);

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Label = ({ children, required }) => (
    <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 text-left">
        {children} {required && <span className="text-rr-pink">*</span>}
    </label>
);
const FieldError = ({ msg }) => msg ? <p className="text-rr-pink text-xs font-bold mt-1 text-left">{msg}</p> : null;
const Chevron = () => (
    <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
);

const PerformanceSquads = () => {
    // ── Hidden page: noindex + title ──
    useEffect(() => {
        document.title = 'Performance Squads | Rajasthan Royals Academy Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    // ── Registration form state ──
    const [form, setForm] = useState({
        player_name: '',
        player_age: '',
        parent_name: '',
        email: '',
        phone: '',
        club: '',
        preferred_centre: '',
        entry_type: 'trial',
        invite_code: '',
        playing_role: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── Payments selector state ──
    const [payCentre, setPayCentre] = useState(ACTIVE_CENTRES[0].slug);
    const [payType, setPayType] = useState('trial');
    const payLink = PAYMENT_LINKS[payCentre]?.[payType] || null;
    const payOption = useMemo(() => PAYMENT_OPTIONS.find((o) => o.key === payType), [payType]);
    const payCentreName = useMemo(() => ACTIVE_CENTRES.find((c) => c.slug === payCentre)?.name, [payCentre]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const chooseCentre = (slug) => {
        setForm((f) => ({ ...f, preferred_centre: slug }));
        scrollTo('register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required';
        if (!form.player_age.trim()) next.player_age = 'Player age is required';
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'A valid email is required';
        if (!form.phone.trim()) next.phone = 'Phone number is required';
        if (!form.preferred_centre) next.preferred_centre = 'Please choose a centre';
        if (!form.playing_role) next.playing_role = 'Please choose a playing role';
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const utm = {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
                if (params.get(k)) utm[k] = params.get(k);
            });
            const { error } = await supabase.from('performance_squad_leads').insert([
                {
                    player_name: form.player_name.trim(),
                    player_age: form.player_age.trim(),
                    parent_name: form.parent_name.trim() || null,
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    club: form.club.trim() || null,
                    preferred_centre: form.preferred_centre,
                    entry_type: form.entry_type,
                    invite_code: form.entry_type === 'invited' ? form.invite_code.trim() || null : null,
                    playing_role: form.playing_role,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            console.error('Performance Squads registration error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com' });
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (key) =>
        `w-full bg-white/5 border ${errors[key] ? 'border-rr-pink' : 'border-white/15'} rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-[15px] focus:outline-none focus:border-rr-pink/70 transition-colors`;
    const selectClass = (key) =>
        `${inputClass(key)} appearance-none pr-10 cursor-pointer [&>option]:text-rr-dark`;

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans selection:bg-rr-pink selection:text-white">

            {/* ───────────── HERO ───────────── */}
            <section className="relative min-h-[92svh] w-full overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-gradient-rr opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/90" />
                <div className="relative z-10 w-full max-w-4xl mx-auto px-5 py-28 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                            Rajasthan Royals Academy Melbourne
                        </span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                            Performance<br />Squads
                        </h1>
                        <p className="text-lg sm:text-2xl font-bold text-rr-light-pink mb-4">
                            Trial. Earn your spot. Represent the Royals.
                        </p>
                        <p className="text-white/70 text-[15px] sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                            Our Performance Squads are the representative arm of the Academy — squads of
                            like-skilled, like-motivated players who train together and compete together.
                            Players either <span className="text-white font-bold">trial</span> for their place
                            or are <span className="text-white font-bold">invited</span> by our coaching staff.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => scrollTo('trials')}
                                className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                Register for a Trial <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scrollTo('pathway')}
                                className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                How it works
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── PATHWAY / HOW IT WORKS ───────────── */}
            <section id="pathway" className="py-20 px-5 scroll-mt-8">
                <div className="max-w-5xl mx-auto">
                    <SectionHeading
                        eyebrow="The Pathway"
                        title="Two Ways In. One Standard."
                        sub="Every Performance Squad player earns their place — through an open trial at their nearest centre, or by direct invitation from our coaches."
                    />
                    <div className="grid sm:grid-cols-2 gap-5 mb-14">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                            className="bg-white/5 border border-white/10 rounded-2xl p-7">
                            <ClipboardCheck className="w-8 h-8 text-rr-pink mb-4" />
                            <h3 className="text-xl font-black uppercase mb-2">Open Trial</h3>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">
                                Register below, pay the trial fee, and show us what you've got at your
                                centre's trial session. Our coaches assess skill, athleticism, and attitude —
                                and successful players are offered a squad place.
                            </p>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
                            className="bg-white/5 border border-white/10 rounded-2xl p-7">
                            <Mail className="w-8 h-8 text-rr-pink mb-4" />
                            <h3 className="text-xl font-black uppercase mb-2">By Invitation</h3>
                            <p className="text-white/65 text-sm font-medium leading-relaxed">
                                Standout players from our programs, clubs, and scouting network are invited
                                directly into a squad. If you've been invited, select "Invited" when you
                                register and include your invite reference if you were given one.
                            </p>
                        </motion.div>
                    </div>

                    {/* Squad structure */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                        className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                        <div className="flex items-start gap-4">
                            <Shield className="w-9 h-9 text-rr-pink shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl font-black uppercase mb-3">How Each Squad Is Built</h3>
                                <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-3">
                                    Every Performance Squad centre fields a <span className="text-white font-bold">First XI</span> —
                                    the squad's premier representative team. Alongside the First XI, additional
                                    teams are assembled from the squad for fixtures in the{' '}
                                    <button onClick={() => scrollTo('power-league')} className="text-rr-light-pink font-bold underline underline-offset-2 hover:text-rr-pink transition-colors">
                                        Power League
                                    </button>{' '}
                                    and matches against external opposition.
                                </p>
                                <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                                    That means every player in the squad gets meaningful game time at their
                                    level — with a clear pathway to push for First XI selection.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── TRIAL CARDS ───────────── */}
            <section id="trials" className="py-20 px-5 bg-white/[0.02] scroll-mt-8">
                <div className="max-w-5xl mx-auto">
                    <SectionHeading
                        eyebrow="Our Centres"
                        title="Trial At Your Centre"
                        sub="Two Performance Squads are live now, with two more centres arriving in 2027."
                    />
                    <div className="grid sm:grid-cols-2 gap-5 mb-6">
                        {ACTIVE_CENTRES.map((c, i) => (
                            <motion.div key={c.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                                className="bg-white/5 border border-white/10 hover:border-rr-pink/50 rounded-2xl p-7 flex flex-col transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink bg-rr-pink/10 rounded-full px-3 py-1.5">
                                        Now Trialling
                                    </span>
                                    <Trophy className="w-5 h-5 text-white/30" />
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-4">{c.name}</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        <span className="text-white/75 text-sm font-medium">
                                            {c.venue}{c.suburb ? `, ${c.suburb}` : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Star className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        <span className="text-white/75 text-sm font-medium">
                                            {c.coachTitle}: <span className="text-white font-bold">{c.coach}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        {c.trialDates.length ? (
                                            <div className="space-y-1.5">
                                                {c.trialDates.map((d) => (
                                                    <div key={d} className="text-white/75 text-sm font-medium">
                                                        {d.includes('—') ? (
                                                            <>
                                                                <span className="text-rr-light-pink font-bold">{d.split('—')[0].trim()}</span>
                                                                {' — '}{d.split('—')[1].trim()}
                                                            </>
                                                        ) : d}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-white/75 text-sm font-medium">Trial dates announced soon</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => chooseCentre(c.slug)}
                                    className="mt-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                                >
                                    Register for Trial <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    {/* Future centres */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        {CENTRES.filter((c) => !c.active).map((c) => (
                            <div key={c.slug} className="bg-white/[0.03] border border-dashed border-white/15 rounded-2xl p-7 opacity-60">
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 bg-white/5 rounded-full px-3 py-1.5 mb-4">
                                    Coming 2027
                                </span>
                                <h3 className="text-2xl font-black uppercase mb-2 text-white/70">{c.name}</h3>
                                <p className="text-white/40 text-sm font-medium">{c.venue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── POWER LEAGUE ───────────── */}
            {/* Reserved explanation section — placeholder copy, refine with Andy. */}
            <section id="power-league" className="py-20 px-5 scroll-mt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Official Power League logo (same asset as the Power Cricket page) —
                        white/pink on transparent, designed for dark backgrounds. */}
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-5">
                            Where Squads Compete
                        </span>
                        <h2 className="sr-only">The Power League</h2>
                        <img
                            src="/assets/power-league-logo.png"
                            alt="The Power League"
                            className="h-24 sm:h-32 lg:h-36 w-auto mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                        />
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                        className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                        <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                            The Power League is the Academy's own match series — the competitive stage where
                            Performance Squad teams from each centre go head-to-head, played at various times
                            from September 2026 through April 2027.
                        </p>
                        <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                            Each centre's First XI and additional squad teams are selected for Power League
                            rounds, alongside fixtures against external opposition — so every squad member
                            competes in real, meaningful cricket throughout the season.
                        </p>
                        <p className="text-white/45 text-xs font-medium italic">
                            Full Power League format, fixtures, and standings will be published here soon.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── REGISTRATION ───────────── */}
            <section id="register" className="py-20 px-5 bg-white/[0.02] scroll-mt-8">
                <div className="max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Step 1"
                        title="Register Your Interest"
                        sub="Trialling or invited — start here. We'll confirm your centre's trial details and next steps by email."
                    />
                    {submitted ? (
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                            className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center">
                            <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-3">You're Registered</h3>
                            <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-6">
                                Thanks — we've got your details. Our team will be in touch with your centre's
                                trial information and next steps. If your trial fee is due, you can pay it now below.
                            </p>
                            <button
                                onClick={() => scrollTo('payments')}
                                className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                Go to Payments <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label required>Player Name</Label>
                                    <input type="text" value={form.player_name} onChange={set('player_name')} placeholder="Full name" className={inputClass('player_name')} />
                                    <FieldError msg={errors.player_name} />
                                </div>
                                <div>
                                    <Label required>Player Age</Label>
                                    <input type="text" inputMode="numeric" value={form.player_age} onChange={set('player_age')} placeholder="e.g. 16" className={inputClass('player_age')} />
                                    <FieldError msg={errors.player_age} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label>Parent / Guardian Name <span className="normal-case font-medium text-white/40">(if player is under 18)</span></Label>
                                <input type="text" value={form.parent_name} onChange={set('parent_name')} placeholder="Parent or guardian full name" className={inputClass('parent_name')} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label required>Email</Label>
                                    <input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={inputClass('email')} />
                                    <FieldError msg={errors.email} />
                                </div>
                                <div>
                                    <Label required>Phone</Label>
                                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" className={inputClass('phone')} />
                                    <FieldError msg={errors.phone} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label>Current Club <span className="normal-case font-medium text-white/40">(optional)</span></Label>
                                <input type="text" value={form.club} onChange={set('club')} placeholder="Club / association" className={inputClass('club')} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div className="relative">
                                    <Label required>Preferred Centre</Label>
                                    <div className="relative">
                                        <select value={form.preferred_centre} onChange={set('preferred_centre')} className={selectClass('preferred_centre')}>
                                            <option value="" disabled>Choose a centre</option>
                                            {ACTIVE_CENTRES.map((c) => (
                                                <option key={c.slug} value={c.slug}>{c.name} — {c.venue}</option>
                                            ))}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <FieldError msg={errors.preferred_centre} />
                                </div>
                                <div className="relative">
                                    <Label required>Playing Role</Label>
                                    <div className="relative">
                                        <select value={form.playing_role} onChange={set('playing_role')} className={selectClass('playing_role')}>
                                            <option value="" disabled>Choose a role</option>
                                            {PLAYING_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <FieldError msg={errors.playing_role} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label required>How are you joining?</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'trial', label: 'Trialling' },
                                        { value: 'invited', label: 'Invited' },
                                    ].map((opt) => (
                                        <button
                                            type="button"
                                            key={opt.value}
                                            onClick={() => setForm((f) => ({ ...f, entry_type: opt.value }))}
                                            className={`rounded-xl px-4 py-3.5 text-sm font-black uppercase tracking-wider border transition-colors ${form.entry_type === opt.value ? 'bg-rr-pink border-rr-pink text-white' : 'bg-white/5 border-white/15 text-white/60 hover:border-rr-pink/50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {form.entry_type === 'invited' && (
                                <div className="mb-4">
                                    <Label>Invite Reference <span className="normal-case font-medium text-white/40">(if provided)</span></Label>
                                    <input type="text" value={form.invite_code} onChange={set('invite_code')} placeholder="e.g. coach name or invite code" className={inputClass('invite_code')} />
                                </div>
                            )}
                            {errors.form && (
                                <p className="text-rr-pink text-sm font-bold mb-4 text-center">{errors.form}</p>
                            )}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                {submitting ? 'Submitting…' : 'Submit Registration'} {!submitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                            <p className="text-white/40 text-xs font-medium text-center mt-4">
                                Your details are only used to manage your Performance Squad registration.
                            </p>
                        </form>
                    )}
                </div>
            </section>

            {/* ───────────── PAYMENTS ───────────── */}
            <section id="payments" className="py-20 px-5 scroll-mt-8">
                <div className="max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Step 2"
                        title="Payments"
                        sub="Choose your centre and what you're paying for — trials, game fees, or squad training."
                    />
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label required>Centre</Label>
                                <div className="relative">
                                    <select value={payCentre} onChange={(e) => setPayCentre(e.target.value)} className={selectClass('pay_centre')}>
                                        {ACTIVE_CENTRES.map((c) => (
                                            <option key={c.slug} value={c.slug}>{c.name}</option>
                                        ))}
                                    </select>
                                    <Chevron />
                                </div>
                            </div>
                            <div>
                                <Label required>Payment Type</Label>
                                <div className="relative">
                                    <select value={payType} onChange={(e) => setPayType(e.target.value)} className={selectClass('pay_type')}>
                                        {PAYMENT_OPTIONS.map((o) => (
                                            <option key={o.key} value={o.key}>{o.label}</option>
                                        ))}
                                    </select>
                                    <Chevron />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-black uppercase tracking-wider">{payCentreName} — {payOption.label}</span>
                                <span className="text-rr-light-pink font-black text-lg">{payOption.price}</span>
                            </div>
                            <p className="text-white/55 text-xs font-medium leading-relaxed">{payOption.desc}</p>
                        </div>
                        {payLink ? (
                            <a
                                href={payLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                <CreditCard className="w-4 h-4" /> Pay Securely with Stripe
                            </a>
                        ) : (
                            <button
                                disabled
                                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white/40 font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 cursor-not-allowed"
                            >
                                <CreditCard className="w-4 h-4" /> Payment link coming soon
                            </button>
                        )}
                        <p className="text-white/40 text-xs font-medium text-center mt-4">
                            Payments are processed securely by Stripe. Register first if you haven't already.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── FOOTER STRIP ───────────── */}
            <footer className="border-t border-white/10 py-10 px-5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-rr-pink" />
                        <span className="text-sm font-black uppercase tracking-wider">Rajasthan Royals Academy Melbourne</span>
                    </div>
                    <p className="text-white/45 text-xs font-medium">
                        Questions about Performance Squads? Email{' '}
                        <a href="mailto:info@rramelbourne.com" className="text-rr-light-pink font-bold hover:text-rr-pink transition-colors">
                            info@rramelbourne.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PerformanceSquads;
