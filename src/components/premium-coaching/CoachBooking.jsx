import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import GovernanceConsents from '../shared/GovernanceConsents';
import TrainingShirtStep from '../shared/TrainingShirtStep';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';
import { EMPTY_SHIRT, shirtError, shirtTag, needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import {
    PACKAGES, FORMAT_LABELS, FORMAT_BLURBS, DB_TABLE, PROGRAM_NAME, SUCCESS_ROUTE, AVAILABILITY_NOTE,
    coachOf, centreOf, coachPrice, coachTotal, money,
} from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel, slotKey } from './useCoachAvailability';

// The coach's profile and booking, in one panel (Andy, 18 Nov 2026: "find your coach ...
// click in there, find the time and find the price ... one-on-one or a one-on-two ... they
// click on it ... and then they pay"). Opened from a coach card; full screen on a phone.
//   1. Choose your option: the coach's own rate card, 1-to-1 or 1-to-2, 1, 3 or 5 sessions.
//   2. Choose your times: exactly that many of the coach's open times at this location.
//   3. Player and contact details, training shirt (CLAUDE.md), the four governance boxes.
//   → summary with the total → pay (api/private-coaching-checkout.js prices it on the server
//     from the same rate card, holds the times for 30 minutes and opens Stripe).
// 1-to-2: the booker pays it all; the partner completes /partner before the first session.
// The insert never chains .select(): the public role can insert but not read back.

const newId = () => (window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }));
const utm = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source'), utm_medium: p.get('utm_medium'), utm_campaign: p.get('utm_campaign'), utm_content: p.get('utm_content') };
};

const input = (bad) => `w-full bg-slate-50 border ${bad ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-sm`;
const labelCls = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
const Err = ({ children }) => (children ? <p className="text-red-500 text-xs font-medium mt-1">{children}</p> : null);
const Field = ({ id, label, error, optional, children, hint }) => (
    <div id={`f-${id}`}>
        <label htmlFor={id} className={labelCls}>{label}{!optional && ' *'}{optional && <span className="text-slate-400 normal-case tracking-normal font-medium"> (optional)</span>}</label>
        {children}
        {hint && <p className="text-slate-500 text-xs font-medium mt-1">{hint}</p>}
        <Err>{error}</Err>
    </div>
);
const StepTitle = ({ n, children }) => (
    <h3 className="flex items-center gap-2.5 text-base font-black text-rr-dark uppercase tracking-wide mb-3">
        <span className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center shrink-0" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{n}</span>
        {children}
    </h3>
);

const EMPTY = {
    format: '', sessions: 0, partner: '',
    player_first_name: '', player_last_name: '', player_age: '',
    parent_name: '', email: '', phone: '', notes: '',
    [HONEYPOT_FIELD]: '',
};

const CoachBooking = ({ coachSlug, centreSlug, onClose }) => {
    const navigate = useNavigate();
    const coach = coachOf(coachSlug);
    const [centre, setCentre] = useState(centreSlug && coach?.centres.includes(centreSlug) ? centreSlug : coach?.centres[0]);
    const [form, setForm] = useState(EMPTY);
    const [picked, setPicked] = useState([]);
    const [shirt, setShirt] = useState(EMPTY_SHIRT);
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState('');
    const { slots, loaded } = useAllAvailability();

    useEffect(() => {
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', onKey); };
    }, [onClose]);

    if (!coach) return null;
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const ev = (k) => (e) => set(k, e.target.value);
    const age = parseInt(form.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    const nights = groupByNight(slots, coach.slug, centre);
    const openCount = nights.reduce((n, x) => n + x.slots.length, 0);
    const per = form.format && form.sessions ? coachPrice(coach, form.format, form.sessions) : null;
    const total = form.format && form.sessions ? coachTotal(coach, form.format, form.sessions) : null;
    const grand = total != null ? total + (needsShirt(shirt) ? TRAINING_SHIRT.price : 0) : null;

    const chooseOption = (format, sessions) => { setForm((f) => ({ ...f, format, sessions, partner: format === '1-2' ? f.partner : '' })); setPicked((p) => p.slice(0, sessions)); };
    const chooseCentre = (slug) => { setCentre(slug); setPicked([]); };
    const togglePick = (s) => setPicked((p) => {
        const k = slotKey(s);
        if (p.some((x) => slotKey(x) === k)) return p.filter((x) => slotKey(x) !== k);
        if (p.length >= form.sessions) return p;
        return [...p, s];
    });

    const validate = () => {
        const e = {};
        if (!form.format) e.option = 'Please choose 1-to-1 or a training partner session.';
        else if (!form.sessions) e.option = 'Please choose how many sessions.';
        if (form.sessions && picked.length !== form.sessions) e.times = `Please choose ${form.sessions} time${form.sessions > 1 ? 's' : ''} (${picked.length} chosen).`;
        if (form.format === '1-2' && !form.partner.trim()) e.partner = 'Please tell us who is training with your player.';
        if (!form.player_first_name.trim()) e.player_first_name = 'Please enter the player’s first name.';
        if (!form.player_last_name.trim()) e.player_last_name = 'Please enter the player’s last name.';
        if (!Number.isFinite(age) || age < 5 || age > 70) e.player_age = 'Please enter the player’s age.';
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
            document.getElementById(first.startsWith('accept_') ? `consent-${first}` : `f-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        if (isHoneypotTripped(form[HONEYPOT_FIELD])) { navigate(SUCCESS_ROUTE); return; }

        setSubmitting(true);
        const id = newId();
        const row = {
            id,
            centre,
            format: form.format,
            coach_slug: coach.slug,
            coach_tier: coach.tier,
            other_players: form.format === '1-2' ? form.partner.trim() : null,
            package_sessions: form.sessions,
            price_per_session: per,
            package_total: total,
            selected_slots: picked,
            payment_status: 'request', // checkout API → sent_to_stripe, webhook → paid
            player_first_name: form.player_first_name.trim(),
            player_last_name: form.player_last_name.trim(),
            player_age: age,
            focus: 'not-sure',
            parent_name: form.parent_name.trim() || null,
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
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
            setFailed('Something went wrong saving your booking. Please try again, or text us with the chat button.');
            return;
        }
        try {
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', { content_name: PROGRAM_NAME, content_category: centre }, { eventID: id });
                window.fbq('track', 'InitiateCheckout', { content_name: PROGRAM_NAME, value: grand, currency: 'AUD' });
            }
        } catch { /* never blocks the booking */ }
        try {
            sessionStorage.setItem('premium_pc_booking', JSON.stringify({
                id, first: row.player_first_name, centre, format: form.format, partner: row.other_players,
                coachName: coach.name, sessions: form.sessions, per, total, picked, shirt,
            }));
        } catch { /* optional */ }
        try {
            const r = await fetch('/api/private-coaching-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            const out = await r.json().catch(() => ({}));
            if (r.ok && out.url) { window.location.assign(out.url); return; }
            setSubmitting(false);
            if (r.status === 409) setPicked([]);
            setFailed(out.error || 'Payment could not start. Please try again, or text us with the chat button.');
        } catch {
            setSubmitting(false);
            setFailed('Payment could not start. Please check your connection and try again.');
        }
    };

    const loc = centreOf(centre);

    return (
        <div className="fixed inset-0 z-[90] flex items-stretch sm:items-center justify-center bg-rr-dark/80 sm:p-6" role="dialog" aria-modal="true" aria-label={`Book ${coach.name}`} onClick={onClose}>
            <div className="relative bg-white w-full sm:max-w-3xl sm:rounded-3xl overflow-y-auto max-h-full" onClick={(e) => e.stopPropagation()} data-coach-booking={coach.slug}>
                <button type="button" onClick={onClose} aria-label="Close" className="sticky top-3 float-right mr-3 mt-3 z-10 w-10 h-10 rounded-full bg-rr-dark text-white flex items-center justify-center"><X className="w-5 h-5" /></button>

                {/* The coach: photo and name side by side, bio full width underneath */}
                <div className="p-5 sm:p-8 pb-0 sm:pb-0">
                    <div className="flex items-center gap-4 sm:gap-6 pr-12">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                            {coach.img
                                ? <img src={coach.img} alt={coach.name} className="w-full h-full object-cover object-top" />
                                : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{coach.name.split(' ').map((p) => p[0]).join('')}</div>}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-black text-rr-dark uppercase tracking-tight leading-none">{coach.name}</h2>
                            <p className="mt-1.5 text-sm font-bold text-rr-pink">{coach.specialism || 'Coaches all aspects of the game'}</p>
                        </div>
                    </div>
                    {coach.bio && <p className="mt-4 text-sm text-rr-charcoal font-medium leading-relaxed">{coach.bio}</p>}
                    <p className="mt-1.5 text-xs text-slate-500 font-semibold">{coach.allAspects}</p>
                </div>

                <form onSubmit={submit} noValidate className="p-5 sm:p-8 space-y-8">
                    <input type="text" name={HONEYPOT_FIELD} value={form[HONEYPOT_FIELD]} onChange={ev(HONEYPOT_FIELD)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                    {/* Location, if the coach works at more than one */}
                    <div>
                        <p className={labelCls}>Location</p>
                        {coach.centres.length > 1 ? (
                            <div className="flex flex-wrap gap-2">
                                {coach.centres.map((c) => (
                                    <button key={c} type="button" onClick={() => chooseCentre(c)} aria-pressed={centre === c}
                                        className={`px-4 py-2 rounded-full border-2 text-sm font-bold ${centre === c ? 'border-rr-dark bg-rr-dark text-white' : 'border-slate-200 text-rr-dark'}`}>{centreOf(c).suburb}</button>
                                ))}
                            </div>
                        ) : null}
                        <p className="text-sm font-semibold text-rr-charcoal flex items-start gap-1.5 mt-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />{loc?.name}{loc?.address ? `, ${loc.address}` : `, ${loc?.suburb}`}</p>
                    </div>

                    {!loaded && <p className="text-sm text-slate-500">Checking {coach.name.split(' ')[0]}’s times…</p>}
                    {loaded && openCount === 0 && (
                        <div className="rounded-2xl bg-slate-50 p-5 text-sm text-rr-charcoal font-medium">
                            {coach.name.split(' ')[0]} has no open times at {loc?.suburb} right now. New times are added every week, so please check back soon{coach.centres.length > 1 ? ', or try their other location' : ''}.
                        </div>
                    )}

                    {loaded && openCount > 0 && (
                        <>
                            {/* 1. Session type, with the coach's price per session */}
                            <div id="f-option">
                                <StepTitle n={1}>Choose your session</StepTitle>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {['1-1', '1-2'].map((fmt) => {
                                        const one = coachPrice(coach, fmt, 1);
                                        if (one == null) return null;
                                        const on = form.format === fmt;
                                        return (
                                            <button key={fmt} type="button" onClick={() => chooseOption(fmt, form.sessions || 0)} aria-pressed={on} data-format={fmt}
                                                className={`text-left rounded-2xl border-2 p-4 sm:p-5 transition-colors ${on ? 'border-rr-pink bg-rr-pink/5' : errors.option && !form.format ? 'border-red-300' : 'border-slate-200 hover:border-rr-pink/50'}`}>
                                                <span className="block text-lg font-black text-rr-dark uppercase tracking-tight leading-tight">{FORMAT_LABELS[fmt]}</span>
                                                <span className="block text-xs font-semibold text-slate-500 mt-1">{FORMAT_BLURBS[fmt]}</span>
                                                <span className="block mt-3"><span className="text-3xl font-black text-rr-dark">{money(one)}</span> <span className="text-sm font-semibold text-slate-500">per one-hour session, incl. GST</span></span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* How many sessions, with the total */}
                                {form.format && (
                                    <div className="mt-5" id="f-sessions">
                                        <p className={labelCls}>How many sessions?</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {PACKAGES.map((p) => {
                                                const price = coachPrice(coach, form.format, p.sessions);
                                                if (price == null) return null;
                                                const on = form.sessions === p.sessions;
                                                const short = openCount < p.sessions;
                                                const discounted = price < coachPrice(coach, form.format, 1);
                                                return (
                                                    <button key={p.sessions} type="button" disabled={short} onClick={() => chooseOption(form.format, p.sessions)} aria-pressed={on}
                                                        className={`rounded-xl border-2 px-3 py-3 text-center transition-colors disabled:opacity-40 ${on ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 text-rr-dark hover:border-rr-pink/50'}`}>
                                                        <span className="block text-sm font-black">{p.label}</span>
                                                        <span className="block text-base font-black mt-0.5">{money(price * p.sessions)}</span>
                                                        <span className={`block text-[11px] font-semibold ${on ? 'text-white/80' : 'text-slate-500'}`}>{short ? `Only ${openCount} open now` : discounted ? `${money(price)} a session` : 'total'}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <Err>{errors.option}</Err>
                                {form.format === '1-2' && (
                                    <div className="mt-4">
                                        <Field id="partner" label="Training partner" error={errors.partner} hint="Their name and age. You pay for the session; their family fills in a short form before the first session.">
                                            <input id="partner" value={form.partner} onChange={ev('partner')} className={input(errors.partner)} placeholder="e.g. Sam Lee (12)" />
                                        </Field>
                                    </div>
                                )}
                            </div>

                            {/* 2. Times */}
                            {form.sessions > 0 && (
                                <div id="f-times">
                                    <StepTitle n={2}>Choose your {form.sessions > 1 ? `${form.sessions} times` : 'time'}</StepTitle>
                                    <p className="text-xs text-rr-charcoal font-medium mb-3">{picked.length} of {form.sessions} chosen.</p>
                                    <div className="space-y-3">
                                        {nights.map((n) => (
                                            <div key={n.date} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                                                <p className="text-xs font-black text-rr-dark uppercase tracking-wide sm:w-32 shrink-0">{nightLabel(n.date)}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {n.slots.map((s) => {
                                                        const on = picked.some((x) => slotKey(x) === slotKey(s));
                                                        const full = !on && picked.length >= form.sessions;
                                                        return (
                                                            <button type="button" key={slotKey(s)} onClick={() => togglePick(s)} disabled={full} aria-pressed={on}
                                                                className={`px-3.5 py-2 rounded-lg border-2 text-xs font-black transition-colors disabled:opacity-40 ${on ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 text-rr-dark hover:border-rr-pink/50'}`}>
                                                                {timeLabel(s.start)}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Err>{errors.times}</Err>
                                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-3">{AVAILABILITY_NOTE}</p>
                                </div>
                            )}

                            {/* 3. Details */}
                            {form.sessions > 0 && (
                                <div className="space-y-5">
                                    <StepTitle n={3}>Your details</StepTitle>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Field id="player_first_name" label="Player first name" error={errors.player_first_name}><input id="player_first_name" value={form.player_first_name} onChange={ev('player_first_name')} className={input(errors.player_first_name)} /></Field>
                                        <Field id="player_last_name" label="Player last name" error={errors.player_last_name}><input id="player_last_name" value={form.player_last_name} onChange={ev('player_last_name')} className={input(errors.player_last_name)} /></Field>
                                        <Field id="player_age" label="Player age" error={errors.player_age}><input id="player_age" type="number" inputMode="numeric" value={form.player_age} onChange={ev('player_age')} className={input(errors.player_age)} /></Field>
                                        {!adult && <Field id="parent_name" label="Parent or guardian name" error={errors.parent_name}><input id="parent_name" value={form.parent_name} onChange={ev('parent_name')} className={input(errors.parent_name)} autoComplete="name" /></Field>}
                                        <Field id="email" label="Email" error={errors.email}><input id="email" type="email" value={form.email} onChange={ev('email')} className={input(errors.email)} autoComplete="email" /></Field>
                                        <Field id="phone" label="Mobile" error={errors.phone}><input id="phone" type="tel" value={form.phone} onChange={ev('phone')} className={input(errors.phone)} autoComplete="tel" /></Field>
                                    </div>
                                    <Field id="notes" label="Goals, or anything the coach should know" optional><textarea id="notes" rows={3} value={form.notes} onChange={ev('notes')} className={input(false)} /></Field>
                                    <div id="f-shirt"><TrainingShirtStep value={shirt} onChange={setShirt} playerName={form.player_first_name} playerAge={form.player_age} error={errors.shirt} /></div>
                                    <GovernanceConsents value={consents} onChange={setConsents} errors={errors} adult={adult} />
                                </div>
                            )}

                            {/* Summary + pay */}
                            {form.sessions > 0 && (
                                <div className="rounded-2xl bg-rr-dark text-white p-5 sm:p-6" data-summary>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink mb-3">Your booking</p>
                                    <dl className="space-y-1.5 text-sm">
                                        <div className="flex justify-between gap-4"><dt className="text-white/70">Coach</dt><dd className="font-bold text-right">{coach.name}, {loc?.suburb}</dd></div>
                                        <div className="flex justify-between gap-4"><dt className="text-white/70">Session</dt><dd className="font-bold text-right">{FORMAT_LABELS[form.format]} · {form.sessions} × {money(per)}</dd></div>
                                        {picked.length > 0 && <div className="flex justify-between gap-4"><dt className="text-white/70">Times</dt><dd className="font-bold text-right">{picked.map((p) => `${nightLabel(p.date)} ${timeLabel(p.start)}`).join(', ')}</dd></div>}
                                        {needsShirt(shirt) && shirt.size && <div className="flex justify-between gap-4"><dt className="text-white/70">Training shirt</dt><dd className="font-bold text-right">Size {String(shirt.size).split(' ')[0]} · {money(TRAINING_SHIRT.price)}</dd></div>}
                                        <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-white/15 text-base"><dt className="font-black">Total incl. GST</dt><dd className="font-black">{money(grand)}</dd></div>
                                    </dl>
                                </div>
                            )}

                            {failed && <p className="text-red-600 text-sm font-semibold text-center">{failed}</p>}
                            {Object.keys(errors).length > 0 && !failed && <p className="text-red-600 text-sm font-semibold text-center">Please check the {Object.keys(errors).length === 1 ? 'item' : `${Object.keys(errors).length} items`} marked in red.</p>}
                            <button type="submit" disabled={submitting || !form.sessions}
                                className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-50 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                                {submitting ? 'Opening secure payment…' : grand != null ? `Pay ${money(grand)}` : 'Choose your session to continue'}
                            </button>
                            <p className="text-center text-xs text-slate-500 font-medium">You pay securely by card with Stripe.</p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CoachBooking;
