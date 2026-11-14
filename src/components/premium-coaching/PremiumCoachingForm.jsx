import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import GovernanceConsents from '../shared/GovernanceConsents';
import TrainingShirtStep from '../shared/TrainingShirtStep';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';
import { EMPTY_SHIRT, shirtError, shirtTag, needsShirt } from '../../lib/kit/trainingShirt';
import {
    CENTRES, FORMATS, FOCUS_OPTIONS, LEVEL_OPTIONS, MATCH_ME, DB_TABLE, PROGRAM_NAME, SUCCESS_ROUTE,
    coachesAt, tierOf,
} from './premiumCoachingData';

// Booking REQUEST form for Royals Private Coaching (premium). No payment link exists
// yet (Andy, 13 Nov 2026), so nothing is charged here: the row is a request, our team
// confirms the coach and time, then sends the payment link. The training shirt and the
// four governance boxes are already required, so the form is ready for payment the day
// the links arrive (CLAUDE.md: both rules apply to every paid program sign-up).
//
// The id is made here and the insert never chains .select(): the public role can
// insert but not read the table back.

const newId = () => (window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }));

const utm = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source'), utm_medium: p.get('utm_medium'),
        utm_campaign: p.get('utm_campaign'), utm_content: p.get('utm_content'),
    };
};

const input = (bad) => `w-full bg-slate-50 border ${bad ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-sm`;
const labelCls = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

const Field = ({ id, label, error, optional, children, hint }) => (
    <div id={`f-${id}`}>
        <label htmlFor={id} className={labelCls}>{label}{!optional && ' *'}{optional && <span className="text-slate-400 normal-case tracking-normal font-medium"> (optional)</span>}</label>
        {children}
        {hint && <p className="text-slate-500 text-xs font-medium mt-1">{hint}</p>}
        {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
);

const Choice = ({ on, onClick, title, sub, bad }) => (
    <button type="button" onClick={onClick} aria-pressed={on}
        className={`text-left rounded-xl border-2 px-4 py-3 transition-colors ${on ? 'border-rr-pink bg-rr-pink/5' : bad ? 'border-red-300' : 'border-slate-200 hover:border-rr-pink/50'}`}>
        <span className="block font-black text-rr-dark text-sm">{title}</span>
        {sub && <span className="block text-xs text-rr-charcoal font-medium mt-1 leading-snug">{sub}</span>}
    </button>
);

const EMPTY = {
    centre: '', format: '', coach: '', other_players: '',
    player_first_name: '', player_last_name: '', player_age: '', focus: '', level: '', club: '',
    parent_name: '', email: '', phone: '', suburb: '', availability: '', notes: '',
    [HONEYPOT_FIELD]: '',
};

const PremiumCoachingForm = ({ initialCentre = '' }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...EMPTY, centre: initialCentre });
    const [shirt, setShirt] = useState(EMPTY_SHIRT);
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState('');

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const ev = (k) => (e) => set(k, e.target.value);

    const age = parseInt(form.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    const coaches = useMemo(() => coachesAt(form.centre), [form.centre]);
    const centreHasCoaches = coaches.length > 0;

    const validate = () => {
        const e = {};
        if (!form.centre) e.centre = 'Please choose a centre.';
        if (!form.format) e.format = 'Please choose 1-to-1, 1-to-2 or 1-to-3.';
        if (!form.coach) e.coach = 'Please choose a coach, or “Match me with a coach”.';
        if (form.format && form.format !== '1-1' && !form.other_players.trim()) e.other_players = 'Please tell us who else is in the group.';
        if (!form.player_first_name.trim()) e.player_first_name = 'Please enter the player’s first name.';
        if (!form.player_last_name.trim()) e.player_last_name = 'Please enter the player’s last name.';
        if (!Number.isFinite(age) || age < 5 || age > 70) e.player_age = 'Please enter the player’s age.';
        if (!form.focus) e.focus = 'Please choose what the player wants to work on.';
        if (!adult && !form.parent_name.trim()) e.parent_name = 'Please enter a parent or guardian name.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
        if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number.';
        const s = shirtError(shirt);
        if (s) e.shirt = s;
        Object.assign(e, consentErrors(consents, { adult }));
        return e;
    };

    const submit = async (evt) => {
        evt.preventDefault();
        setFailed('');
        const e = validate();
        setErrors(e);
        const first = Object.keys(e)[0];
        if (first) {
            const el = document.getElementById(first.startsWith('accept_') ? `consent-${first}` : first === 'shirt' ? 'f-shirt' : `f-${first}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        if (isHoneypotTripped(form[HONEYPOT_FIELD])) { navigate(SUCCESS_ROUTE); return; }

        setSubmitting(true);
        const id = newId();
        const coach = form.coach === MATCH_ME ? null : form.coach;
        const tier = coach ? coaches.find((c) => c.slug === coach)?.tier : null;
        const row = {
            id,
            centre: form.centre,
            format: form.format,
            coach_slug: coach,
            coach_tier: tier,
            other_players: form.format === '1-1' ? null : form.other_players.trim(),
            player_first_name: form.player_first_name.trim(),
            player_last_name: form.player_last_name.trim(),
            player_age: age,
            focus: form.focus,
            playing_level: form.level || null,
            club: form.club.trim() || null,
            parent_name: form.parent_name.trim() || null,
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            suburb: form.suburb.trim() || null,
            availability: form.availability.trim() || null,
            notes: form.notes.trim() || null,
            shirt_size: needsShirt(shirt) ? shirt.size : null,
            source: `premium-private-coaching${shirtTag(shirt)}`,
            ...consentColumns(consents),
            ...utm(),
            page_referrer: document.referrer || null,
        };

        const { error } = await supabase.from(DB_TABLE).insert([row]);
        if (error) {
            setSubmitting(false);
            setFailed('Something went wrong sending your request. Please try again, or text us with the chat button.');
            return;
        }

        try {
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', { content_name: PROGRAM_NAME, content_category: form.centre }, { eventID: id });
            }
        } catch { /* never blocks the request */ }

        const coachName = coach ? coaches.find((c) => c.slug === coach)?.name : null;
        navigate(SUCCESS_ROUTE, {
            state: {
                first: row.player_first_name,
                centre: form.centre,
                format: form.format,
                coachName,
                tierName: tier ? tierOf(tier)?.name : null,
                shirt,
            },
        });
    };

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-3">Royals Private Coaching</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-4">Request Your Coach</h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed max-w-xl mx-auto">
                        About three minutes. Nothing to pay today: we confirm your coach and time first, then send the payment link.
                    </p>
                </div>

                <form onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 md:p-10 space-y-8">
                    {/* Honeypot: hidden from people, bots fill it */}
                    <input type="text" name={HONEYPOT_FIELD} value={form[HONEYPOT_FIELD]} onChange={ev(HONEYPOT_FIELD)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                    {/* 1. Centre */}
                    <div id="f-centre">
                        <p className={labelCls}>1. Centre *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {CENTRES.map((c) => (
                                <Choice key={c.slug} on={form.centre === c.slug} bad={errors.centre}
                                    onClick={() => setForm((f) => ({ ...f, centre: c.slug, coach: '' }))}
                                    title={c.suburb} sub={c.name} />
                            ))}
                        </div>
                        {errors.centre && <p className="text-red-500 text-xs font-medium mt-1">{errors.centre}</p>}
                    </div>

                    {/* 2. Format */}
                    <div id="f-format">
                        <p className={labelCls}>2. Format *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {FORMATS.map((f) => (
                                <Choice key={f.value} on={form.format === f.value} bad={errors.format}
                                    onClick={() => set('format', f.value)} title={f.label} sub={f.title} />
                            ))}
                        </div>
                        {errors.format && <p className="text-red-500 text-xs font-medium mt-1">{errors.format}</p>}
                        {form.format && form.format !== '1-1' && (
                            <div className="mt-4">
                                <Field id="other_players" label={`Other player${form.format === '1-3' ? 's' : ''} in the group`} error={errors.other_players}
                                    hint="Names and ages. We send each family their own short form before the first session.">
                                    <input id="other_players" value={form.other_players} onChange={ev('other_players')} className={input(errors.other_players)} placeholder={form.format === '1-3' ? 'e.g. Sam Lee (12), Ava Singh (13)' : 'e.g. Sam Lee (12)'} />
                                </Field>
                            </div>
                        )}
                    </div>

                    {/* 3. Coach */}
                    <div id="f-coach">
                        <p className={labelCls}>3. Coach *</p>
                        {!form.centre && <p className="text-sm text-slate-500 font-medium">Choose a centre first.</p>}
                        {form.centre && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {coaches.map((c) => (
                                    <Choice key={c.slug} on={form.coach === c.slug} bad={errors.coach}
                                        onClick={() => set('coach', c.slug)}
                                        title={c.name} sub={[tierOf(c.tier)?.name || 'Royals Coach', c.specialism].filter(Boolean).join(' · ')} />
                                ))}
                                <Choice on={form.coach === MATCH_ME} bad={errors.coach} onClick={() => set('coach', MATCH_ME)}
                                    title="Match me with a coach"
                                    sub={centreHasCoaches ? 'We choose the best fit for your player.' : 'Coaches at this centre are announced soon. We will match you.'} />
                            </div>
                        )}
                        {errors.coach && <p className="text-red-500 text-xs font-medium mt-1">{errors.coach}</p>}
                    </div>

                    {/* 4. Player */}
                    <div className="pt-6 border-t border-slate-100 space-y-5">
                        <p className={labelCls}>4. The player</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field id="player_first_name" label="First name" error={errors.player_first_name}>
                                <input id="player_first_name" value={form.player_first_name} onChange={ev('player_first_name')} className={input(errors.player_first_name)} autoComplete="off" />
                            </Field>
                            <Field id="player_last_name" label="Last name" error={errors.player_last_name}>
                                <input id="player_last_name" value={form.player_last_name} onChange={ev('player_last_name')} className={input(errors.player_last_name)} autoComplete="off" />
                            </Field>
                            <Field id="player_age" label="Age" error={errors.player_age}>
                                <input id="player_age" type="number" inputMode="numeric" min="5" max="70" value={form.player_age} onChange={ev('player_age')} className={input(errors.player_age)} />
                            </Field>
                            <Field id="focus" label="Wants to work on" error={errors.focus}>
                                <select id="focus" value={form.focus} onChange={ev('focus')} className={input(errors.focus)}>
                                    <option value="">Choose one</option>
                                    {FOCUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                            <Field id="level" label="Playing level" optional>
                                <select id="level" value={form.level} onChange={ev('level')} className={input(false)}>
                                    <option value="">Choose one</option>
                                    {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                            <Field id="club" label="Club" optional>
                                <input id="club" value={form.club} onChange={ev('club')} className={input(false)} />
                            </Field>
                        </div>
                        <div id="f-shirt">
                            <TrainingShirtStep value={shirt} onChange={setShirt} playerName={form.player_first_name} playerAge={form.player_age} error={errors.shirt} />
                        </div>
                    </div>

                    {/* 5. Contact */}
                    <div className="pt-6 border-t border-slate-100 space-y-5">
                        <p className={labelCls}>5. {adult ? 'Your details' : 'Parent or guardian'}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {!adult && (
                                <Field id="parent_name" label="Parent or guardian name" error={errors.parent_name}>
                                    <input id="parent_name" value={form.parent_name} onChange={ev('parent_name')} className={input(errors.parent_name)} autoComplete="name" />
                                </Field>
                            )}
                            <Field id="email" label="Email" error={errors.email}>
                                <input id="email" type="email" value={form.email} onChange={ev('email')} className={input(errors.email)} autoComplete="email" />
                            </Field>
                            <Field id="phone" label="Mobile" error={errors.phone}>
                                <input id="phone" type="tel" value={form.phone} onChange={ev('phone')} className={input(errors.phone)} autoComplete="tel" />
                            </Field>
                            <Field id="suburb" label="Suburb" optional>
                                <input id="suburb" value={form.suburb} onChange={ev('suburb')} className={input(false)} />
                            </Field>
                        </div>
                        <Field id="availability" label="Best days and times" optional hint="e.g. weekday afternoons after 4pm, or Saturday mornings">
                            <input id="availability" value={form.availability} onChange={ev('availability')} className={input(false)} />
                        </Field>
                        <Field id="notes" label="Anything the coach should know" optional hint="Goals, injuries, medical information">
                            <textarea id="notes" rows={3} value={form.notes} onChange={ev('notes')} className={input(false)} />
                        </Field>
                    </div>

                    <GovernanceConsents value={consents} onChange={setConsents} errors={errors} adult={adult} />

                    {failed && <p className="text-red-600 text-sm font-semibold text-center">{failed}</p>}
                    {Object.keys(errors).length > 0 && !failed && (
                        <p className="text-red-600 text-sm font-semibold text-center">Please check the {Object.keys(errors).length === 1 ? 'item' : `${Object.keys(errors).length} items`} marked in red.</p>
                    )}

                    <button type="submit" disabled={submitting}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                        {submitting ? 'Sending…' : 'Request Your Coach'}
                    </button>
                    <p className="text-center text-xs text-slate-500 font-medium">
                        Nothing is charged today.{needsShirt(shirt) && ' The training shirt ($29.95 incl. GST) is added to your first payment.'}
                    </p>
                </form>
            </div>
        </section>
    );
};

export default PremiumCoachingForm;
