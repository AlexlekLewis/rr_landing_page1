import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CLUBS, PROGRAM, SPIN_TYPES, SQUAD_STATUS, SQUAD_NOTE, PRICES, STRIPE_LINK, upcomingNights } from './scOptions';

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

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const ageNum = parseInt(form.age, 10);

    const validate = () => {
        if (!form.player_name.trim()) return 'Please tell us the player’s name.';
        if (!form.age || Number.isNaN(ageNum)) return 'Please tell us the player’s age.';
        if (ageNum < 10 || ageNum > 25) return 'Spin Club is for players aged 10 to 25.';
        if (!form.club_choice) return 'Please pick Spin Club North or Spin Club South.';
        if (!form.night) return 'Please pick the Wednesday you want to come to.';
        if (!form.spin_type) return 'Please tell us what you bowl.';
        if (!form.email.trim() || !form.email.includes('@')) return 'Please give us an email address we can reply to.';
        if (!form.phone.trim()) return 'Please give us a phone number.';
        if (ageNum < 18 && !form.parent_name.trim()) return 'For players under 18, please give a parent or guardian’s name.';
        if (!form.intent) return 'Please tick the box to say you will come on the night you picked.';
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
            `Night requested: Wednesday ${form.night}`,
            form.notes.trim(),
            'Will come on the night picked: yes',
        ].filter(Boolean).join('\n\n');

        const { error: insertError } = await supabase.from('applications').insert([
            {
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
                // One night at a time is the only thing sold now, so the night
                // they picked IS the purchase. `applications` has no date column.
                payment_option_selected: `One night \u2014 Wednesday ${form.night} (${PRICES[0].headline} inc GST)`,
                source: `spin-club-${club?.key || 'unknown'}`,
                bio: notes,
                page_referrer: document.referrer || null,
                ...utmParams,
            },
        ]);

        setSubmitting(false);

        if (insertError) {
            setError('Something went wrong sending your sign-up. Please try again, or email info@rramelbourne.com and we will add you by hand.');
            return;
        }
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
                        <strong className="text-white">Wednesday {form.night}</strong> at{' '}
                        <strong className="text-white">{CLUBS.find((c) => c.key === form.club_choice)?.name}</strong>.
                        One thing left — pay for the night and your place is locked in.
                    </p>

                    {/* Straight to Stripe. The link is the $60 Spin Club Session Price. */}
                    <a
                        href={STRIPE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-10 py-5 rounded-full transition-colors duration-300 mb-5"
                    >
                        Pay {PRICES[0].headline} for this night
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <p className="text-sm text-white/50 font-medium">
                        Coming more than once? Pay the same amount again for each night. If a night
                        turns out to be full we will call you and refund it. Questions:{' '}
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
                    Pick a night and sign up
                </h2>
                <p className="text-base text-rr-dark/70 font-medium leading-relaxed mb-4">
                    <strong className="text-rr-dark">Spin Club is for spin bowlers aged {PROGRAM.ages}.</strong>{' '}
                    Pick the centre and the Wednesday you want. It is{' '}
                    <strong className="text-rr-dark">{PRICES[0].headline} a night</strong>, and you
                    only pay for the nights you come to.
                </p>
                {/* The asterisk again, right where a squad member is about to pay full price. */}
                <div className="bg-rr-pink/5 border-2 border-rr-pink/35 rounded-2xl p-5 mb-5">
                    <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-2">
                        * In a Performance Squad?
                    </p>
                    <p className="text-[15px] text-rr-dark/80 font-semibold leading-relaxed mb-3">
                        {SQUAD_NOTE.members}
                    </p>
                    <a href={SQUAD_NOTE.href} className="inline-block text-rr-blue hover:text-rr-pink font-black uppercase tracking-widest text-xs transition-colors duration-300">
                        {SQUAD_NOTE.joiners} {SQUAD_NOTE.linkLabel} &rarr;
                    </a>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-9">
                    <p className="text-sm font-black text-rr-dark uppercase tracking-widest mb-2">
                        What happens next
                    </p>
                    <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                        Sign up below and the payment button comes up straight away &mdash;{' '}
                        <strong className="text-rr-dark">{PRICES[0].headline} for that night</strong>.
                        Your place is confirmed once you have paid. Lanes are limited, so earlier is
                        safer.
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
                        <label className={lc} htmlFor="sc-night">Which Wednesday?</label>
                        <select id="sc-night" className={ic} value={form.night} onChange={set('night')}>
                            <option value="">Choose a night</option>
                            {upcomingNights().map((n) => (
                                <option key={n.iso} value={n.label}>{n.label}</option>
                            ))}
                        </select>
                        <p className="text-[13px] text-rr-dark/50 font-medium mt-2">
                            Want more than one night? Say which in the notes below and we will put
                            them all on the one payment link.
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
                        <textarea id="sc-notes" rows={3} className={ic} value={form.notes} onChange={set('notes')} placeholder="How long you have bowled spin, what you want to get better at, or any other nights you want to come to." />
                    </div>

                    <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 accent-rr-pink shrink-0"
                            checked={form.intent}
                            onChange={(e) => setForm((f) => ({ ...f, intent: e.target.checked }))}
                        />
                        <span className="text-[15px] text-rr-dark font-semibold leading-relaxed">
                            I will be there on the night I picked.
                            <span className="block text-rr-dark/60 font-medium mt-1">
                                We ask because lanes are limited, and a lane held by someone who
                                won&rsquo;t use it is a lane another spinner missed out on.
                            </span>
                        </span>
                    </label>

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
                        {submitting ? 'Sending…' : 'Sign me up for this night'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SCForm;
