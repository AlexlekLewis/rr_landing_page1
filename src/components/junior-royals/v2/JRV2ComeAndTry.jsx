import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, MapPin, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../../lib/security/bot.js';
import { MOCKUP } from '../juniorRoyalsData';
import { Rich } from '../JuniorRoyalsShared';
import { TRY, FORM } from './jrV2Content';
import { COME_AND_TRY, tryTime } from './jrV2Facts';

// ─────────────────────────────────────────────────────────────
// Junior Royals — the free come and try day pop-up (Alex, 12 Oct 2026):
// "We want a pop-up to come up on the page to say register for free come and try
// day for the new program. And that gets the parent name, player name, player
// age, choose a [day], offer this only at Mickleham for now, and email and mobile."
// Later the same day: no "for now"; a highlighted "Other centres launching soon";
// and the date shown as to be confirmed.
//
// - It opens by itself a few seconds after the page loads, once per visit, and
//   never on top of another pop-up or while someone is typing in the form.
// - Anything on the page can open it again: window.dispatchEvent(new Event(TRY_OPEN_EVENT)).
// - The time is not asked. It is worked out from the player's age and the day
//   (jrV2Facts COME_AND_TRY) and shown before the family registers.
//
// Writes to public.junior_royals_come_and_try (NOT created yet; one row = one
// player registered for the free come and try day; no payment). While MOCKUP is
// true it validates and shows the success state but saves nothing. When the
// table ships it needs its sheet tab and a watchdog test insert, like every form.
// ─────────────────────────────────────────────────────────────

const TABLE = 'junior_royals_come_and_try';
const SEEN_KEY = 'jr-come-and-try-seen';
const OPEN_AFTER_MS = 4000;
export const TRY_OPEN_EVENT = 'jr-come-and-try-open';
const EMPTY = { parent_name: '', player_name: '', player_age: '', day: '', email: '', phone: '' };
const AGE_OPTIONS = Array.from({ length: COME_AND_TRY.ages.max - COME_AND_TRY.ages.min + 1 }, (_, i) => COME_AND_TRY.ages.min + i);

// Every value this form can send for its choice columns (listed in the tests).
export const TRY_VALUES = {
    centre: [COME_AND_TRY.centre],
    day: COME_AND_TRY.days.map((d) => d.value),
    session_time: [...new Set(COME_AND_TRY.days.flatMap((d) => d.times.map((t) => t.value)))],
    player_age: AGE_OPTIONS,
};

const inputClass = (err) =>
    `w-full bg-white border ${err ? 'border-rr-pink' : 'border-slate-300'} rounded-xl px-4 py-3 text-rr-dark text-[16px] focus:outline-none focus:border-rr-pink transition-colors`;

const Field = ({ id, label, error, children }) => (
    <div>
        <label htmlFor={id} className="block mb-1.5 text-xs font-black uppercase tracking-widest text-rr-dark">{label} <span className="text-rr-pink">*</span></label>
        {children}
        {error ? <p className="text-rr-pink text-sm font-bold mt-1">{error}</p> : null}
    </div>
);

const seen = () => { try { return window.sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; } };
const markSeen = () => { try { window.sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode: the pop-up may show again */ } };

const Modal = ({ onClose }) => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [honeypot, setHoneypot] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(null);   // { day, time } once registered
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; });

    // Open: lock page scroll, focus Close, Esc closes, Tab stays inside. Close: give focus back.
    useEffect(() => {
        const opener = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') { onCloseRef.current(); return; }
            if (e.key !== 'Tab' || !panelRef.current) return;
            const f = [...panelRef.current.querySelectorAll('button, a[href], input, select')].filter((el) => !el.disabled && el.tabIndex !== -1);
            if (!f.length) return;
            if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; opener?.focus?.(); };
    }, []);

    const set = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
    };

    const age = Number(form.player_age) || null;
    const day = COME_AND_TRY.days.find((d) => d.value === form.day) || null;
    const slot = age && day ? tryTime(day.value, age) : null;

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Please enter your name.';
        if (!form.player_name.trim()) e.player_name = 'Please enter your player’s first name.';
        if (!TRY_VALUES.player_age.includes(age)) e.player_age = 'Please choose your player’s age.';
        if (!TRY_VALUES.day.includes(form.day)) e.day = 'Please choose a day.';
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
        if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please enter your mobile number.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        const result = { day: day.label, time: slot.time };
        if (isHoneypotTripped(honeypot)) { setDone(result); return; }
        setSubmitting(true);
        try {
            if (!MOCKUP) {
                const p = new URLSearchParams(window.location.search);
                const { error } = await supabase.from(TABLE).insert([{
                    id: crypto.randomUUID(),
                    parent_name: form.parent_name.trim(),
                    player_name: form.player_name.trim(),
                    player_age: age,
                    centre: COME_AND_TRY.centre,
                    day: day.value,
                    session_time: slot.value,
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    page_referrer: document.referrer || null,
                    utm_source: p.get('utm_source') || null, utm_medium: p.get('utm_medium') || null, utm_campaign: p.get('utm_campaign') || null,
                }]);
                if (error) throw error;
                try { window.fbq?.('track', 'Lead', { content_name: 'Junior Royals come and try day', content_category: COME_AND_TRY.centre }); } catch { /* analytics never blocks */ }
            }
            setDone(result);
        } catch (err) {
            console.error(err);
            setErrors({ form: `Something went wrong and your details were not saved. Please try again, or email ${FORM.contact} and we'll add you.` });
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div data-jr-try-modal className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-rr-dark/80" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="jr-try-title"
                className="relative w-full md:max-w-xl max-h-[94dvh] md:max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl md:rounded-2xl border-t-8 border-rr-pink">
                <div className="px-5 sm:px-7 pt-5 pb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-rr-pink">{TRY.eyebrow}</p>
                            <h2 id="jr-try-title" className="text-2xl sm:text-3xl font-black uppercase text-rr-dark leading-none mt-1.5">{TRY.title}</h2>
                        </div>
                        <button ref={closeRef} type="button" onClick={onClose} aria-label={TRY.close}
                            className="shrink-0 w-11 h-11 rounded-full bg-rr-dark text-white flex items-center justify-center">
                            <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>

                    {done ? (
                        <div className="mt-5 border-l-4 border-rr-pink pl-5 py-1" role="status">
                            <h3 className="text-xl font-black uppercase text-rr-dark">{TRY.done.title}</h3>
                            <p className="mt-2 text-[15px] sm:text-base font-medium text-rr-dark leading-relaxed">{TRY.done.body(done.day, done.time)}</p>
                            {MOCKUP && <p className="mt-3 text-sm font-bold text-rr-dark bg-yellow-300 rounded-lg px-3 py-2">{TRY.mockupNote}</p>}
                            <button type="button" onClick={onClose} className="mt-5 inline-flex items-center justify-center min-h-[48px] px-7 rounded-full border-2 border-rr-dark text-rr-dark font-black uppercase tracking-wider text-sm">{TRY.close}</button>
                        </div>
                    ) : (
                        <>
                            <p className="mt-3 text-[17px] font-semibold text-rr-dark leading-snug">{TRY.lead}</p>
                            <p className="mt-2 flex items-start gap-2 text-[15px] font-medium text-rr-charcoal leading-snug"><MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" aria-hidden="true" />{TRY.where}</p>
                            <p className="mt-2 pl-6"><span data-jr-try-other className="inline-block rounded-md bg-rr-pink text-white text-xs font-black uppercase tracking-wider px-3 py-1.5">{TRY.otherCentres}</span></p>
                            <p data-jr-try-date className="mt-3 flex items-start gap-2 text-[15px] font-black text-rr-dark leading-snug"><CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" aria-hidden="true" />{TRY.date}</p>

                            <form onSubmit={submit} noValidate className="mt-5 grid sm:grid-cols-2 gap-4">
                                <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                                    className="absolute left-[-9999px] top-0 w-px h-px opacity-0" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                                <div className="sm:col-span-2">
                                    <Field id="try_parent_name" label={TRY.labels.parent} error={errors.parent_name}>
                                        <input id="try_parent_name" name="parent_name" autoComplete="name" value={form.parent_name} onChange={set} className={inputClass(errors.parent_name)} />
                                    </Field>
                                </div>
                                <Field id="try_player_name" label={TRY.labels.player} error={errors.player_name}>
                                    <input id="try_player_name" name="player_name" autoComplete="off" value={form.player_name} onChange={set} className={inputClass(errors.player_name)} />
                                </Field>
                                <Field id="try_player_age" label={TRY.labels.age} error={errors.player_age}>
                                    <select id="try_player_age" name="player_age" value={form.player_age} onChange={set} className={inputClass(errors.player_age)}>
                                        <option value="">{TRY.agePlaceholder}</option>
                                        {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </Field>

                                <fieldset className="sm:col-span-2">
                                    <legend className="block mb-1.5 text-xs font-black uppercase tracking-widest text-rr-dark">{TRY.labels.day} <span className="text-rr-pink">*</span></legend>
                                    <div className="grid grid-cols-2 gap-2">
                                        {COME_AND_TRY.days.map((d) => {
                                            const on = form.day === d.value;
                                            return (
                                                <label key={d.value} className={`flex items-center gap-3 cursor-pointer rounded-xl border-2 px-4 py-3 min-h-[48px] transition-colors ${on ? 'border-rr-pink' : errors.day ? 'border-rr-pink/50' : 'border-slate-300 hover:border-rr-pink/60'}`}>
                                                    <input type="radio" name="day" value={d.value} checked={on} onChange={set} className="accent-rr-pink" />
                                                    <span className="font-black text-rr-dark text-[15px]">{d.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.day ? <p className="text-rr-pink text-sm font-bold mt-1">{errors.day}</p> : null}
                                    {/* Both days' times are always shown; the player's own session appears once age and day are chosen. */}
                                    <ul className="mt-2 space-y-0.5">
                                        {TRY.dayLines.map((ln) => <li key={ln} className="text-sm font-medium text-rr-charcoal leading-snug">{ln}</li>)}
                                    </ul>
                                    <p className="mt-2 text-sm font-medium text-rr-charcoal" aria-live="polite">
                                        {slot ? <span className="font-black text-rr-dark">{TRY.yourSession(day.label, slot.time)}</span> : TRY.ageWhy}
                                    </p>
                                </fieldset>

                                <Field id="try_email" label={TRY.labels.email} error={errors.email}>
                                    <input id="try_email" name="email" type="email" autoComplete="email" value={form.email} onChange={set} className={inputClass(errors.email)} />
                                </Field>
                                <Field id="try_phone" label={TRY.labels.mobile} error={errors.phone}>
                                    <input id="try_phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set} className={inputClass(errors.phone)} />
                                </Field>

                                <div className="sm:col-span-2">
                                    {errors.form && <p className="mb-3 text-sm font-bold text-rr-pink">{errors.form}</p>}
                                    <button type="submit" disabled={submitting}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 min-h-[52px] transition-colors">
                                        {submitting ? 'Sending…' : TRY.button} {!submitting && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                    <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-rr-dark"><Check className="w-4 h-4 text-rr-pink" strokeWidth={3} />{TRY.under}</p>
                                    <p className="mt-3 text-xs font-medium text-rr-charcoal leading-relaxed">
                                        <Rich v={FORM.privacy} />{' '}
                                        <Link to="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
};

// Mount once on the page. Opens itself after a few seconds (once per visit), and
// whenever something on the page fires TRY_OPEN_EVENT.
const JRV2ComeAndTry = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const show = () => { markSeen(); setOpen(true); };
        const busy = () => Boolean(document.querySelector('[role="dialog"]')) || ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName);
        const t = seen() ? null : window.setTimeout(() => { if (!busy()) show(); }, OPEN_AFTER_MS);
        window.addEventListener(TRY_OPEN_EVENT, show);
        return () => { if (t) window.clearTimeout(t); window.removeEventListener(TRY_OPEN_EVENT, show); };
    }, []);
    return open ? <Modal onClose={() => setOpen(false)} /> : null;
};

export default JRV2ComeAndTry;
