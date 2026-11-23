import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CLUBS, PROGRAM, SPIN_TYPES, SQUAD_STATUS, SQUAD_NOTE, NEXT_PROGRAM } from './scOptions';

// REGISTER INTEREST ONLY (Andy, 23 Nov 2026): Spin Club is off sale until the next program
// is set. Nothing is paid here, so there is no night to pick, no payment button, and no
// shirt or governance step (CLAUDE.md: interest-only forms are out of scope). Those all
// come back with the next program's price and dates. Saved to `applications`,
// program_type 'Spin Club', which the program sign-ups sheet already reads.

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
    spin_type: '',
    squad_status: '',
    current_club: '',
    parent_name: '',
    email: '',
    phone: '',
    notes: '',
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
        if (!form.club_choice) return 'Please pick the centre that suits you best.';
        if (!form.spin_type) return 'Please tell us what you bowl.';
        if (!form.email.trim() || !form.email.includes('@')) return 'Please give us an email address we can reply to.';
        if (!form.phone.trim()) return 'Please give us a phone number.';
        if (ageNum < 18 && !form.parent_name.trim()) return 'For players under 18, please give a parent or guardian’s name.';
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
            'Registered interest in the next Spin Club program',
            form.club_choice === 'either' ? 'Centre: either is fine' : null,
            form.notes.trim(),
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
                location: club?.key || (form.club_choice === 'either' ? 'either' : null),
                program: club?.name || 'Spin Club (either centre)',
                program_type: 'Spin Club',
                payment_option_selected: 'Registered interest \u2014 next program (nothing to pay)',
                source: `spin-club-interest-${club?.key || form.club_choice || 'unknown'}`,
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
        const club = CLUBS.find((c) => c.key === form.club_choice);
        return (
            <section className="bg-rr-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-5">
                        You&rsquo;re on the list
                    </h2>
                    <p className="text-base text-white/75 font-medium leading-relaxed mb-6">
                        Thanks &mdash; <strong className="text-white">{form.player_name.trim().split(' ')[0]}</strong> is
                        registered for the next Spin Club program
                        {club ? <> at <strong className="text-white">{club.name}</strong></> : null}.
                        We will email you first with the dates, the price and how to book, before
                        they go anywhere else.
                    </p>
                    <p className="text-sm text-white/50 font-medium">
                        Nothing to pay now. Questions:{' '}
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
                    {NEXT_PROGRAM.status}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                    Register for the next Spin Club
                </h2>
                <p className="text-base text-rr-dark/70 font-medium leading-relaxed mb-4">
                    <strong className="text-rr-dark">Spin Club is for spin bowlers aged {PROGRAM.ages}.</strong>{' '}
                    {NEXT_PROGRAM.line}
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-9">
                    <p className="text-sm font-black text-rr-dark uppercase tracking-widest mb-2">
                        Nothing to pay now
                    </p>
                    <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                        This just puts you on the list. When the next program is set, you get the
                        dates and the price first, and you decide then.{' '}
                        {SQUAD_NOTE.members}
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
                        <label className={lc} htmlFor="sc-club">Which centre suits you?</label>
                        <select id="sc-club" className={ic} value={form.club_choice} onChange={set('club_choice')}>
                            <option value="">Choose a centre</option>
                            {CLUBS.map((c) => (
                                <option key={c.key} value={c.key}>
                                    {c.name} — {c.venue}, {c.suburb}
                                </option>
                            ))}
                            <option value="either">Either is fine</option>
                        </select>
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
                        {submitting ? 'Sending…' : 'Register my interest'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SCForm;
