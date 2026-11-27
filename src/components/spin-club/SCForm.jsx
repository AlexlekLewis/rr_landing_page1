import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CLUBS, PROGRAM, SPIN_TYPES, SQUAD_STATUS, SQUAD_NOTE, PRICES, CHRISTMAS_BREAK, subscriptionCheckoutUrl, upcomingNights } from './scOptions';
import GovernanceConsents from '../shared/GovernanceConsents';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const EMPTY = {
    player_name: '',
    age: '',
    club_choice: '',
    night: '',
    spin_type: '',
    squad_status: '',
    current_club: '',
    parent_name: '',
    email: '',
    phone: '',
    notes: '',
    intent: false,
};

const SCForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    // The applications.id of this sign-up. Made here, not by the database, so it
    // can go to Stripe as client_reference_id and the webhook can file every
    // weekly payment against this exact row.
    const [applicationId, setApplicationId] = useState(null);
    // Governance boxes (Andy, 10 Nov 2026), saved in the four accept_* columns of `applications`.
    // Players 18 and over aren't asked the Parent/Guardian Code.
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [consentErr, setConsentErr] = useState({});

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const ageNum = parseInt(form.age, 10);

    const validate = () => {
        if (!form.player_name.trim()) return 'Please tell us the player’s name.';
        if (!form.age || Number.isNaN(ageNum)) return 'Please tell us the player’s age.';
        if (ageNum < 10 || ageNum > 25) return 'Spin Club is for players aged 10 to 25.';
        if (!form.club_choice) return 'Please pick Spin Club North or Spin Club South.';
        if (!form.night) return 'Please pick your first Wednesday.';
        if (!form.spin_type) return 'Please tell us what you bowl.';
        if (!form.email.trim() || !form.email.includes('@')) return 'Please give us an email address we can reply to.';
        if (!form.phone.trim()) return 'Please give us a phone number.';
        if (ageNum < 18 && !form.parent_name.trim()) return 'For players under 18, please give a parent or guardian’s name.';
        if (!form.intent) return 'Please tick the box to say you understand how the weekly subscription works.';
        const missing = consentErrors(consents, { adult: ageNum >= 18 });
        setConsentErr(missing);
        if (Object.keys(missing).length) return 'Please tick the Agreements & Consent boxes.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }
        setError('');
        setSubmitting(true);

        const club = CLUBS.find((c) => c.key === form.club_choice);
        const name = form.player_name.trim();
        const utmParams = getUTMParams();
        const notes = [
            `First Wednesday: ${form.night}`,
            form.notes.trim(),
            'Understands the weekly subscription: yes',
        ].filter(Boolean).join('\n\n');

        const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : undefined;
        const { error: insertError } = await supabase.from('applications').insert([
            {
                ...(id ? { id } : {}),
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || null,
                age: ageNum,
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                club: form.current_club.trim() || null,
                parent1_name: form.parent_name.trim() || null,
                cricket_type: form.spin_type,
                experience_level: form.squad_status || null,
                location: club?.key || null,
                program: club?.name || null,
                program_type: 'Spin Club',
                // `applications` has no date column, so the first night rides here.
                payment_option_selected: `Weekly subscription \u2014 first Wednesday ${form.night} (${PRICES[0].headline} a week inc GST)`,
                source: `spin-club-${club?.key || 'unknown'}`,
                bio: notes,
                page_referrer: document.referrer || null,
                ...consentColumns(consents),
                ...utmParams,
            },
        ]);

        setSubmitting(false);

        if (insertError) {
            setError('Something went wrong sending your sign-up. Please try again, or email info@rramelbourne.com and we will add you by hand.');
            return;
        }
        setApplicationId(id || null);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="bg-rr-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-5">
                        We&rsquo;ve got it
                    </h2>
                    <p className="text-base text-white/75 font-medium leading-relaxed mb-8">
                        You are down for{' '}
                        <strong className="text-white">{CLUBS.find((c) => c.key === form.club_choice)?.name}</strong>,
                        starting <strong className="text-white">Wednesday {form.night}</strong>.
                        One thing left — start your subscription and your spot is held every week.
                    </p>

                    {/* Straight to Stripe: the weekly subscription link, tagged with this
                        sign-up's id so the payment files against this row. */}
                    <a
                        href={subscriptionCheckoutUrl(applicationId, form.email.trim().toLowerCase())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-5 rounded-full transition-colors duration-300 mb-5"
                    >
                        Start my subscription &middot; {PRICES[0].headline} a week
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <p className="text-sm text-white/50 font-medium">
                        {PRICES[0].headline} a week, charged on Wednesdays. {CHRISTMAS_BREAK.line} On
                        the payment page, enter the player&rsquo;s name and pick the same centre.
                        Questions:{' '}
                        <span className="text-rr-pink">info@rramelbourne.com</span>.
                    </p>
                </div>
            </section>
        );
    }

    const ic = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink';
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-6">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                    Sign up
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                    Hold your spot
                </h2>
                <p className="text-base text-rr-dark/70 font-medium leading-relaxed mb-4">
                    <strong className="text-rr-dark">Spin Club is for spin bowlers aged {PROGRAM.ages}.</strong>{' '}
                    Pick your centre and your first Wednesday. It is{' '}
                    <strong className="text-rr-dark">{PRICES[0].headline} a week</strong>, and it
                    holds your spot every Wednesday.
                </p>
                <a href={SQUAD_NOTE.href} className="inline-block mb-5 text-rr-blue hover:text-rr-pink font-black uppercase tracking-widest text-xs transition-colors duration-300">
                    {SQUAD_NOTE.joiners} {SQUAD_NOTE.linkLabel} &rarr;
                </a>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-9">
                    <p className="text-sm font-black text-rr-dark uppercase tracking-widest mb-2">
                        What happens next
                    </p>
                    <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                        Sign up below and the payment button comes up straight away &mdash;{' '}
                        <strong className="text-rr-dark">{PRICES[0].headline} a week</strong>, charged
                        on Wednesdays. Your spot is held once your subscription has started. Lanes
                        are limited, so earlier is safer.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="sc-name">Player&rsquo;s name</label>
                            <input id="sc-name" className={ic} value={form.player_name} onChange={set('player_name')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="sc-age">Age</label>
                            <input id="sc-age" className={ic} inputMode="numeric" value={form.age} onChange={set('age')} placeholder={PROGRAM.ages} />
                        </div>
                    </div>

                    <div>
                        <label className={lc} htmlFor="sc-club">Which Spin Club?</label>
                        <select id="sc-club" className={ic} value={form.club_choice} onChange={set('club_choice')}>
                            <option value="">Choose a centre</option>
                            {CLUBS.map((c) => (
                                <option key={c.key} value={c.key}>
                                    {c.name} — {c.venue}, {c.suburb}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={lc} htmlFor="sc-night">Your first Wednesday</label>
                        <select id="sc-night" className={ic} value={form.night} onChange={set('night')}>
                            <option value="">Choose a night</option>
                            {upcomingNights().map((n) => (
                                <option key={n.iso} value={n.label}>{n.label}</option>
                            ))}
                        </select>
                        <p className="text-[13px] text-rr-dark/50 font-medium mt-2">
                            {CHRISTMAS_BREAK.line}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="sc-spin">What do you bowl?</label>
                            <select id="sc-spin" className={ic} value={form.spin_type} onChange={set('spin_type')}>
                                <option value="">Choose one</option>
                                {SPIN_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lc} htmlFor="sc-squad">In a Performance Squad?</label>
                            <select id="sc-squad" className={ic} value={form.squad_status} onChange={set('squad_status')}>
                                <option value="">Choose one</option>
                                {SQUAD_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={lc} htmlFor="sc-current-club">Your cricket club <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(optional)</span></label>
                        <input id="sc-current-club" className={ic} value={form.current_club} onChange={set('current_club')} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="sc-parent">Parent or guardian <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(under 18s)</span></label>
                            <input id="sc-parent" className={ic} value={form.parent_name} onChange={set('parent_name')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="sc-phone">Phone</label>
                            <input id="sc-phone" className={ic} inputMode="tel" value={form.phone} onChange={set('phone')} />
                        </div>
                    </div>

                    <div>
                        <label className={lc} htmlFor="sc-email">Email</label>
                        <input id="sc-email" className={ic} inputMode="email" value={form.email} onChange={set('email')} />
                    </div>

                    <div>
                        <label className={lc} htmlFor="sc-notes">Anything the coach should know? <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(optional)</span></label>
                        <textarea id="sc-notes" rows={3} className={ic} value={form.notes} onChange={set('notes')} placeholder="How long you have bowled spin, and what you want to get better at." />
                    </div>

                    <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 accent-rr-pink shrink-0"
                            checked={form.intent}
                            onChange={(e) => setForm((f) => ({ ...f, intent: e.target.checked }))}
                        />
                        <span className="text-[15px] text-rr-dark font-semibold leading-relaxed">
                            I understand Spin Club is a weekly subscription: {PRICES[0].headline} a
                            week including GST, charged on Wednesdays to hold my spot.
                            <span className="block text-rr-dark/60 font-medium mt-1">
                                It is charged whether or not we make it that night. It pauses over
                                Christmas (nothing charged after 16 December until 27 January), and we can stop any time by
                                emailing info@rramelbourne.com before a Wednesday.
                            </span>
                        </span>
                    </label>

                    <GovernanceConsents value={consents} errors={consentErr} adult={ageNum >= 18}
                        onChange={(v) => { setConsents(v); setConsentErr((p) => Object.fromEntries(Object.entries(p).filter(([k]) => !v[k]))); }} />

                    {error && (
                        <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300"
                    >
                        {submitting ? 'Sending…' : 'Sign me up'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SCForm;
