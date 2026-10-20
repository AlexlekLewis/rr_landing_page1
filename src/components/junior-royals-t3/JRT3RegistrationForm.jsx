import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import { JR_T4, PAY_OPTIONS, WEEKLY_CONFIRMED, WEEKLY_OPENS, weeklyOpen } from './jrTerm4Data';
import { MIN_AGE as PS_MIN_AGE, MAX_AGE as PS_MAX_AGE } from '../performance-squads/data';

// Junior Royals — Term 4 booking form (paid from 19 Oct 2026).
//
// BOOK AND PAY: the entry is saved to jr_term4_waitlist FIRST, with
// an id made here (anon can insert but not read back), then the family goes to
// the Stripe Payment Link they chose with that id as client_reference_id and
// their email prefilled. api/stripe-webhook.js marks the row paid. Neither
// Stripe checkout asks for the player, so this form is where we learn who is
// coming. The database only accepts UNPAID rows from the browser.
//
// A DIFFERENT NIGHT (Alex, 20 Oct 2026): a family can ask for another night instead.
// That is a standby request: saved, no payment, inline confirmation (REQUEST_SOURCE).
//
// TWO CENTRES, EACH ITS OWN NIGHT (Alex, 19 Oct 2026): Mickleham Indoor Sports
// Centre on MONDAYS (26 Oct – 14 Dec) and the Elite Cricket Centre, Cranbourne
// North on WEDNESDAYS (28 Oct – 16 Dec), both 5:00pm – 7:00pm. The night is set by
// the centre, so the form doesn't ask it; preferred_day is saved from the centre. Do not add a centre without a booking behind it.
//
// NEVER LOSE AN ENTRY (5 Oct 2026). The jr_term4_waitlist CHECK on
// preferred_centre still only allows mickleham | hallam | williamstown | any.
// A rejected centre (Postgres 23514) is retried ONCE as 'any', with the real
// centre carried in `source` ("…|centre=cranbourne-north"); the sheet sync reads
// it back from there. When the constraint is widened the first insert succeeds.
export const ENTRY_SOURCE = 'junior-royals-term4-entry';            // entries before payments opened
export const BOOKING_SOURCE = 'junior-royals-term4-booking';         // + "|pay=upfront" / "|pay=weekly"
export const REQUEST_SOURCE = 'junior-royals-term4-night-request';   // + "|day=tuesday": a different night, standby, no payment
export const fallbackSource = (source, centre) => `${source}|centre=${centre}`;
export const PENDING_KEY = 'jr_t4_pending_booking';

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source') || null, utm_medium: p.get('utm_medium') || null, utm_campaign: p.get('utm_campaign') || null };
};

const newId = () => (window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }));

// The Stripe Payment Link for an option, carrying the entry id and the email.
export const payUrl = (option, id, email) => {
    const u = new URL(PAY_OPTIONS[option].link);
    u.searchParams.set('client_reference_id', id);
    if (email) u.searchParams.set('prefilled_email', email);
    return u.toString();
};

const AGE_OPTIONS = Array.from({ length: JR_T4.ageMax - JR_T4.ageMin + 1 }, (_, i) => i + JR_T4.ageMin); // 7–12

const readPending = () => {
    try { return JSON.parse(window.sessionStorage.getItem(PENDING_KEY) || 'null'); } catch { return null; }
};

const JRT3RegistrationForm = () => {
    const weekly = weeklyOpen();
    const [pay, setPay] = useState('upfront');
    const [nightChoice, setNightChoice] = useState('offered');   // 'offered' | 'other'
    const [altDay, setAltDay] = useState('');
    const [standby, setStandby] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [pending, setPending] = useState(readPending);
    const [errors, setErrors] = useState({});
    const [honeypot, setHoneypot] = useState('');
    const [form, setForm] = useState({
        parent_name: '', parent_email: '', parent_phone: '',
        player_name: '', player_age: '', preferred_centre: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email required.';
        if (!form.player_name.trim()) e.player_name = 'Required.';
        if (!form.player_age) e.player_age = 'Required.';
        if (!form.preferred_centre) e.preferred_centre = 'Please pick a centre.';
        if (nightChoice === 'other' && !altDay) e.alt_day = 'Please pick the night you would like.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        // A filled honeypot means a script: nothing is written and it never reaches Stripe.
        if (isHoneypotTripped(honeypot)) return;
        setSubmitting(true);
        const id = newId();
        const option = weekly ? pay : 'upfront';
        const centre = form.preferred_centre;
        const centreInfo = JR_T4.centres.find((c) => c.value === centre) || null;
        const request = nightChoice === 'other';
        // A different night is a standby request: no payment, and the night they asked for
        // rides in `source` (the preferred_day CHECK only knows monday | wednesday).
        const source = request ? `${REQUEST_SOURCE}|day=${altDay}` : `${BOOKING_SOURCE}|pay=${option}`;
        const centreDay = request ? null : centreInfo?.day || null;
        const email = form.parent_email.trim();
        try {
            const row = {
                id,
                parent_name: form.parent_name.trim(),
                parent_email: email,
                parent_phone: form.parent_phone.trim() || null,
                player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10),
                preferred_centre: centre,
                preferred_day: centreDay,
                source,
                page_referrer: document.referrer ? document.referrer.slice(0, 500) : null,
                ...getUTMParams(),
            };
            let { error } = await supabase.from('jr_term4_waitlist').insert([row]);
            if (error && error.code === '23514') {
                // The database refused a value. Save the entry anyway, with the real
                // centre in `source`, rather than turn a family away.
                console.warn('jr_term4_waitlist rejected a value; saving with the fallback', error.message);
                ({ error } = await supabase.from('jr_term4_waitlist').insert([{
                    ...row, preferred_centre: 'any', source: fallbackSource(source, centre),
                }]));
            }
            if (error) throw error;

            if (request) {
                try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'Junior Royals Term 4 night request', content_category: `junior-royals-term4-${centre}` }); } catch { /* never block */ }
                const dayName = altDay.charAt(0).toUpperCase() + altDay.slice(1);
                setStandby({ player: row.player_name, day: dayName, centre: centreInfo });
                setSubmitting(false);
                document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Meta Pixel: program, centre and price only — never a name, email, phone or age.
            try {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    const value = PAY_OPTIONS[option].value;
                    window.fbq('track', 'Lead', { content_name: 'Junior Royals Term 4', content_category: `junior-royals-term4-${centre}`, value, currency: 'AUD' });
                    window.fbq('track', 'InitiateCheckout', { content_name: `Junior Royals Term 4 (${option})`, value, currency: 'AUD' });
                }
            } catch { /* never let analytics block the family */ }

            try { window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id, option, email, player: row.player_name, centre })); } catch { /* storage blocked: payment still works */ }
            // Same tab on purpose: Stripe sends them back to /junior-royals/success.
            window.location.assign(payUrl(option, id, email));
        } catch (err) {
            console.error(err);
            setErrors({ form: "Something went wrong and nothing was saved. Please try again, or email info@rramelbourne.com and we'll book your player by hand." });
            setSubmitting(false);
        }
    };

    const ic = (field) => `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
    const [mickleham, cranbourne] = JR_T4.centres;
    const choice = (on) => `flex-1 text-left rounded-xl border-2 px-4 py-3 transition-colors ${on ? 'border-rr-pink bg-rr-pink/5' : 'border-slate-200 hover:border-rr-pink/50'}`;

    return (
        <section id="registration-form" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-10">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-6">Junior Royals — {JR_T4.term}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        SECURE YOUR <span className="text-rr-pink">PLACE</span>
                    </h2>
                    <p className="text-white/80 font-medium leading-relaxed mb-4">
                        Term 4 runs on <span className="font-black text-white">{mickleham.night} at the {mickleham.venue}, {mickleham.suburb} ({mickleham.datesShort})</span> and <span className="font-black text-white">{cranbourne.night} at the {cranbourne.venue}, {cranbourne.suburb} ({cranbourne.datesShort})</span>, {mickleham.times} at both. Each player trains for one hour a week with players their own age. If your player did Junior Royals last term, nothing carries over automatically, so please book below.
                    </p>
                    <p className="text-white font-black leading-relaxed">{weekly ? JR_T4.priceLine : JR_T4.priceLineBeforeWeekly}</p>
                    <p className="text-white/70 text-sm font-medium leading-relaxed mt-2">{JR_T4.shirtLine}</p>
                </div>

                {pending && (
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-6 text-white" data-jr-t4-pending>
                        <p className="font-black">{pending.player ? `${pending.player}'s booking isn't paid yet.` : "Your booking isn't paid yet."}</p>
                        <p className="text-white/75 text-sm mt-1">The place is booked once you pay. Already paid? Check your email for the Stripe receipt; you don&apos;t need to pay again.</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <a href={payUrl(pending.option in PAY_OPTIONS ? pending.option : 'upfront', pending.id, pending.email)}
                                className="inline-flex items-center bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full">Pay now</a>
                            <button type="button" onClick={() => { try { window.sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ } setPending(null); }}
                                className="text-white/80 underline text-sm font-semibold">Start a new booking</button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl p-8 md:p-10">
                    {standby ? (
                        <div className="text-center py-6" role="status" data-jr-t4-standby>
                            <div className="w-16 h-16 rounded-full bg-rr-pink/10 border-2 border-rr-pink flex items-center justify-center mx-auto mb-5">
                                <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-3">{JR_T4.request.doneTitle}</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed max-w-md mx-auto">{JR_T4.request.done(standby.player, standby.day, standby.centre)}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                                className="absolute left-[-9999px] top-0 w-px h-px opacity-0" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                            <div className="space-y-5">
                                <div><label className={lc}>Parent / Guardian Full Name *</label><input name="parent_name" value={form.parent_name} onChange={handleChange} className={ic('parent_name')} placeholder="e.g. Jane Smith" autoComplete="name" />{errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className={lc}>Email Address *</label><input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={ic('parent_email')} placeholder="e.g. jane@email.com" autoComplete="email" />{errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}</div>
                                    <div><label className={lc}>Phone Number</label><input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={ic('parent_phone')} placeholder="e.g. 0412 345 678" autoComplete="tel" /></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className={lc}>Player Full Name *</label><input name="player_name" value={form.player_name} onChange={handleChange} className={ic('player_name')} placeholder="e.g. Liam Smith" autoComplete="off" />{errors.player_name && <p className="text-red-500 text-xs mt-1">{errors.player_name}</p>}</div>
                                    <div><label className={lc}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={ic('player_age')}>
                                            <option value="">Select age</option>
                                            {AGE_OPTIONS.map(a => <option key={a} value={a}>{a} years old</option>)}
                                        </select>{errors.player_age && <p className="text-red-500 text-xs mt-1">{errors.player_age}</p>}
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed mt-2">
                                            {JR_T4.olderLead} Our Performance Squads are for players aged {PS_MIN_AGE} to {PS_MAX_AGE}.{' '}
                                            <Link to={JR_T4.olderRoute} className="text-rr-pink font-bold underline">{JR_T4.olderLinkLabel}</Link>
                                        </p>
                                    </div>
                                </div>

                                    <>
                                        <div>
                                            <label className={lc}>Centre *</label>
                                            <select name="preferred_centre" value={form.preferred_centre} onChange={handleChange} className={ic('preferred_centre')}>
                                                <option value="">Select a centre</option>
                                                {JR_T4.centres.map(c => <option key={c.value} value={c.value}>{c.venue}, {c.suburb} · {c.night} {c.times}</option>)}
                                            </select>
                                            {errors.preferred_centre && <p className="text-red-500 text-xs mt-1">{errors.preferred_centre}</p>}
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed mt-2">{JR_T4.centresApart} Stripe asks you to confirm the same centre at checkout.</p>
                                        </div>
                                        {(() => {
                                            const c = JR_T4.centres.find((x) => x.value === form.preferred_centre);
                                            if (!c) return null;
                                            return (
                                                <fieldset data-jr-t4-night>
                                                    <legend className={lc}>Which night? *</legend>
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <label className={`${choice(nightChoice === 'offered')} cursor-pointer`}>
                                                            <input type="radio" name="night" value="offered" checked={nightChoice === 'offered'} onChange={() => setNightChoice('offered')} className="sr-only" />
                                                            <span className="block font-black text-rr-dark text-sm">{c.night} {c.times}</span>
                                                            <span className="block text-xs text-rr-charcoal font-medium mt-1 leading-relaxed">{JR_T4.request.offeredLead} From {c.firstSessionLong}.</span>
                                                        </label>
                                                        <label className={`${choice(nightChoice === 'other')} cursor-pointer`}>
                                                            <input type="radio" name="night" value="other" checked={nightChoice === 'other'} onChange={() => setNightChoice('other')} className="sr-only" />
                                                            <span className="block font-black text-rr-dark text-sm">{JR_T4.request.title}</span>
                                                            <span className="block text-xs text-rr-charcoal font-medium mt-1 leading-relaxed">{JR_T4.request.lead}</span>
                                                        </label>
                                                    </div>
                                                    {nightChoice === 'other' && (
                                                        <div className="mt-3">
                                                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-3">{JR_T4.request.why(c)}</p>
                                                            <label className={lc} htmlFor="alt_day">{JR_T4.request.dayLabel} *</label>
                                                            <select id="alt_day" value={altDay} onChange={(e) => { setAltDay(e.target.value); if (errors.alt_day) setErrors((p) => ({ ...p, alt_day: undefined })); }} className={ic('alt_day')}>
                                                                <option value="">Select a night</option>
                                                                {JR_T4.days.filter((d) => d !== c.day).map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                                                            </select>
                                                            {errors.alt_day && <p className="text-red-500 text-xs mt-1">{errors.alt_day}</p>}
                                                        </div>
                                                    )}
                                                </fieldset>
                                            );
                                        })()}
                                        {nightChoice !== 'other' && (
                                        <fieldset>
                                            <legend className={lc}>How would you like to pay? *</legend>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                {['upfront', 'weekly'].map((k) => {
                                                    const o = PAY_OPTIONS[k];
                                                    const available = k === 'upfront' || weekly;
                                                    if (k === 'weekly' && !WEEKLY_CONFIRMED) return null;
                                                    const on = (weekly ? pay : 'upfront') === k;
                                                    return (
                                                        <label key={k} data-pay-option={k} className={`${choice(on && available)} ${available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                                                            <input type="radio" name="pay" value={k} checked={on && available} disabled={!available} onChange={() => setPay(k)} className="sr-only" />
                                                            <span className="block font-black text-rr-dark text-sm">{o.title}: {o.amount} <span className="font-semibold text-rr-charcoal">{o.per} incl. GST</span></span>
                                                            <span className="block text-xs text-rr-charcoal font-medium mt-1 leading-relaxed">
                                                                {available ? o.detail : `Opens Tuesday ${WEEKLY_OPENS.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', timeZone: 'Australia/Melbourne' })}. ${o.detail}`}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>
                                        )}
                                    </>
                            </div>
                            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4" data-jr-t4-renewal>
                                <p className="text-xs font-black text-rr-dark uppercase tracking-widest mb-2">{JR_T4.renewTitle}</p>
                                <ul className="space-y-1.5 text-rr-charcoal text-sm font-medium leading-relaxed list-disc pl-5">
                                    {JR_T4.renewLines.map((l) => <li key={l}>{l}</li>)}
                                </ul>
                            </div>
                            {errors.form && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6"><p className="text-red-600 text-sm font-medium">{errors.form}</p></div>}
                            <button type="submit" disabled={submitting}
                                className="mt-8 w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]">
                                {nightChoice === 'other'
                                    ? (submitting ? 'Sending…' : JR_T4.request.button)
                                    : (submitting ? 'Going to payment…' : JR_T4.ctaLabel)}
                            </button>
                            <p className="text-slate-500 text-xs text-center mt-4">
                                {nightChoice === 'other' ? JR_T4.request.note : `Next: Stripe's secure checkout. ${JR_T4.placeLine}`}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default JRT3RegistrationForm;
