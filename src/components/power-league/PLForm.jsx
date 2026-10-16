import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MATCH, ROLES } from './plOptions';

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const EMPTY = {
    player_name: '', age: '', club: '', role: '',
    parent_name: '', email: '', phone: '', notes: '',
    squad_interest: false, available: false,
};

const PLForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));
    const ageNum = parseInt(form.age, 10);

    const validate = () => {
        if (!form.player_name.trim()) return 'Please tell us the player’s name.';
        if (!form.age || Number.isNaN(ageNum)) return 'Please tell us the player’s age.';
        if (ageNum < 10 || ageNum > 25) return 'Power League is for players aged 10 to 25.';
        if (!form.role) return 'Please tell us what the player does.';
        if (!form.email.trim() || !form.email.includes('@')) return 'Please give us an email address we can reply to.';
        if (!form.phone.trim()) return 'Please give us a phone number.';
        if (ageNum < 18 && !form.parent_name.trim()) return 'For players under 18, please give a parent or guardian’s name.';
        if (!form.available) return 'Please confirm the player is available on ' + MATCH.date + '.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) { setError(problem); return; }
        setError(''); setSubmitting(true);

        const name = form.player_name.trim();
        const notes = [
            `Nominated for Power League, ${MATCH.date}`,
            `Plays: ${form.role}`,
            form.club.trim() ? `Club: ${form.club.trim()}` : '',
            form.squad_interest ? 'Also wants to hear about Performance Squad trials: yes' : '',
            form.notes.trim(),
        ].filter(Boolean).join('\n\n');

        const { error: insertError } = await supabase.from('applications').insert([{
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || null,
            age: ageNum,
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            club: form.club.trim() || null,
            parent1_name: form.parent_name.trim() || null,
            cricket_type: form.role,
            program_type: 'Power League',
            program: `Power League — ${MATCH.date}`,
            source: 'power-league-nomination',
            payment_option_selected: `${MATCH.fee} ${MATCH.feeUnit}`,
            bio: notes,
            page_referrer: document.referrer || null,
            ...getUTMParams(),
        }]);

        setSubmitting(false);
        if (insertError) {
            setError('Something went wrong sending your nomination. Please try again, or email alex.lewis@rramelbourne.com and we will add you by hand.');
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
                        Nomination in
                    </h2>
                    <p className="text-base text-white/75 font-medium leading-relaxed mb-4">
                        <strong className="text-white">{form.player_name.trim()}</strong> is down for{' '}
                        <strong className="text-white">{MATCH.date}</strong>. Nominations close{' '}
                        <strong className="text-white">{MATCH.closes}</strong> and {MATCH.picked.toLowerCase()}
                    </p>
                    <p className="text-sm text-white/50 font-medium">
                        Nothing has been charged. The {MATCH.fee} match fee is only paid if the player is
                        picked. Questions: <span className="text-rr-pink">alex.lewis@rramelbourne.com</span>.
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
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">Nominate</p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                    Put a player forward
                </h2>
                <p className="text-base text-rr-dark/70 font-medium leading-relaxed mb-4">
                    Players can nominate themselves, or a coach or parent can do it for them. You do
                    not need any connection to the Academy.
                </p>
                <div className="bg-rr-pink/5 border-2 border-rr-pink/35 rounded-2xl p-5 mb-9">
                    <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-2">What happens next</p>
                    <p className="text-[15px] text-rr-dark/80 font-semibold leading-relaxed">
                        Nominations close <strong className="text-rr-dark">{MATCH.closes}</strong>.{' '}
                        {MATCH.picked} The <strong className="text-rr-dark">{MATCH.fee}</strong> match fee is
                        only paid if the player is picked — nothing is taken on this page.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-name">Player&rsquo;s name</label>
                            <input id="pl-name" className={ic} value={form.player_name} onChange={set('player_name')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-age">Age</label>
                            <input id="pl-age" className={ic} inputMode="numeric" value={form.age} onChange={set('age')} placeholder="10 to 25" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-role">What do they do?</label>
                            <select id="pl-role" className={ic} value={form.role} onChange={set('role')}>
                                <option value="">Choose one</option>
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-club">Their cricket club <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(optional)</span></label>
                            <input id="pl-club" className={ic} value={form.club} onChange={set('club')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-parent">Parent or guardian <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(under 18s)</span></label>
                            <input id="pl-parent" className={ic} value={form.parent_name} onChange={set('parent_name')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-phone">Phone</label>
                            <input id="pl-phone" className={ic} inputMode="tel" value={form.phone} onChange={set('phone')} />
                        </div>
                    </div>

                    <div>
                        <label className={lc} htmlFor="pl-email">Email</label>
                        <input id="pl-email" className={ic} inputMode="email" value={form.email} onChange={set('email')} />
                    </div>

                    <div>
                        <label className={lc} htmlFor="pl-notes">Anything the coaches should know? <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(optional)</span></label>
                        <textarea id="pl-notes" rows={3} className={ic} value={form.notes} onChange={set('notes')} placeholder="What grade they play, what they are working on, or anything about availability on the day." />
                    </div>

                    <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-5 h-5 accent-rr-pink shrink-0"
                               checked={form.available}
                               onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} />
                        <span className="text-[15px] text-rr-dark font-semibold leading-relaxed">
                            They are available on {MATCH.date}.
                            <span className="block text-rr-dark/60 font-medium mt-1">
                                We pick teams on the Tuesday night, so we need to know they can be there.
                            </span>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-5 h-5 accent-rr-pink shrink-0"
                               checked={form.squad_interest}
                               onChange={(e) => setForm((f) => ({ ...f, squad_interest: e.target.checked }))} />
                        <span className="text-[15px] text-rr-dark font-semibold leading-relaxed">
                            Tell me when Performance Squad trials are announced.
                            <span className="block text-rr-dark/60 font-medium mt-1">
                                Dates are not set yet. Nothing to pay, and you can say no later.
                            </span>
                        </span>
                    </label>

                    {error && (
                        <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                    )}

                    <button type="submit" disabled={submitting}
                        className="w-full sm:w-auto bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300">
                        {submitting ? 'Sending…' : 'Nominate this player'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default PLForm;
