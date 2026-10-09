import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../../lib/security/bot.js';
import { MOCKUP, AGES, AGES_TEXT, PS_ROUTE } from '../juniorRoyalsData';
import { ageAtStart } from '../JuniorRoyalsForm';
import { Rich } from '../JuniorRoyalsShared';
import { FORM, CTA, REGION_LABEL, V2_CENTRES, DAYS, MIN_DAYS } from './jrV2Content';

// ─────────────────────────────────────────────────────────────
// Junior Royals v2 — Register Your Interest.
//
// Alex, 8 Oct 2026: expressions of interest first, "so we can understand what our
// bookings are and our lane hires". So beyond the contact details the form asks
// the centre, 2 or more weekdays the player could train, and a time. Each says
// why it is asked (copy-esl.md §1.7).
//
// Writes to public.junior_royals_interest (not created yet; one row = a family who
// wants a Junior Royals place; NO payment taken, NO place held). Asks centre
// (incl. Ravenhall, coming soon), 2+ weekdays and a time (Alex, 9 Oct 2026). While MOCKUP is
// true it validates and shows the success state but saves nothing.
//
// Choice columns get NO list-of-values CHECK in the database (the 27 Sep – 5 Oct
// Cranbourne North outage); every value this form can send is listed in the tests
// and must be added to the hourly watchdog's test inserts when the table ships.
// ─────────────────────────────────────────────────────────────

const TABLE = 'junior_royals_interest';
const EMPTY = { parent_name: '', email: '', phone: '', player_name: '', player_dob: '', centre: '', preferred_days: [], preferred_time: '' };

export const FORM_VALUES = {
    centre: V2_CENTRES.map((c) => c.value),
    preferred_days: DAYS.map((d) => d.value),
    preferred_time: FORM.timeChoices.map((c) => c.value),
};

const collectUtm = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source') || null, utm_medium: p.get('utm_medium') || null, utm_campaign: p.get('utm_campaign') || null };
};

const inputClass = (err) =>
    `w-full bg-white border ${err ? 'border-rr-pink' : 'border-slate-300'} rounded-xl px-4 py-3.5 text-rr-dark text-[16px] focus:outline-none focus:border-rr-pink transition-colors`;

const Label = ({ children, htmlFor, why, optional }) => (
    <label htmlFor={htmlFor} className="block mb-2">
        <span className="text-xs font-black uppercase tracking-widest text-rr-dark">{children} {optional ? <span className="normal-case tracking-normal font-semibold text-rr-charcoal">(optional)</span> : <span className="text-rr-pink">*</span>}</span>
        {why && <span className="block text-sm font-medium text-rr-charcoal normal-case tracking-normal mt-0.5">{why}</span>}
    </label>
);

const Err = ({ msg }) => (msg ? <p className="text-rr-pink text-sm font-bold mt-1">{msg}</p> : null);

const Choices = ({ name, legend, why, items, value, onChange, error, cols = 'sm:grid-cols-3' }) => (
    <fieldset className="sm:col-span-2">
        <legend className="block mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-rr-dark">{legend} <span className="text-rr-pink">*</span></span>
            {why && <span className="block text-sm font-medium text-rr-charcoal mt-0.5">{why}</span>}
        </legend>
        <div className={`grid gap-2 ${cols}`}>
            {items.map((c) => {
                const on = value === c.value;
                return (
                    <label key={c.value} className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 px-4 py-3 min-h-[48px] transition-colors ${on ? 'border-rr-pink' : error ? 'border-rr-pink/50' : 'border-slate-300 hover:border-rr-pink/60'}`}>
                        <input type="radio" name={name} value={c.value} checked={on} onChange={onChange} className="mt-1 accent-rr-pink" />
                        <span>
                            <span className="block font-bold text-rr-dark text-[15px]">{c.label}</span>
                            {c.sub && <span className="block text-sm text-rr-charcoal">{c.sub}</span>}
                        </span>
                    </label>
                );
            })}
        </div>
        <Err msg={error} />
    </fieldset>
);

const JRV2Form = () => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [honeypot, setHoneypot] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const set = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
    };

    const toggleDay = (e) => {
        const { value, checked } = e.target;
        setForm((f) => ({ ...f, preferred_days: checked ? [...f.preferred_days, value] : f.preferred_days.filter((d) => d !== value) }));
        if (errors.preferred_days) setErrors((x) => ({ ...x, preferred_days: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Please enter your name.';
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email.';
        if (form.phone && form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please check the number, or leave it blank.';
        if (!form.player_name.trim()) e.player_name = "Please enter your player's first name.";
        if (!form.player_dob) e.player_dob = "Please enter your player's date of birth.";
        else {
            const age = ageAtStart(form.player_dob);
            if (age === null) e.player_dob = "Please enter your player's date of birth.";
            else if (age > AGES.max) e.player_dob = 'older';
            else if (age < AGES.min) e.player_dob = `Junior Royals is for players aged ${AGES_TEXT}.`;
        }
        for (const k of ['centre', 'preferred_time']) {
            if (!FORM_VALUES[k].includes(form[k])) e[k] = 'Please choose one.';
        }
        if (form.preferred_days.filter((d) => FORM_VALUES.preferred_days.includes(d)).length < MIN_DAYS) e.preferred_days = FORM.daysError;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        if (isHoneypotTripped(honeypot)) { setDone(true); return; }
        setSubmitting(true);
        try {
            if (!MOCKUP) {
                const { error } = await supabase.from(TABLE).insert([{
                    id: crypto.randomUUID(),
                    parent_name: form.parent_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    player_name: form.player_name.trim(),
                    player_dob: form.player_dob,
                    centre: form.centre,
                    preferred_days: DAYS.map((d) => d.value).filter((d) => form.preferred_days.includes(d)),
                    preferred_time: form.preferred_time,
                    page_referrer: document.referrer || null,
                    ...collectUtm(),
                }]);
                if (error) throw error;
                try { window.fbq?.('track', 'Lead', { content_name: 'Junior Royals', content_category: form.centre }); } catch { /* analytics never blocks */ }
            }
            setDone(true);
        } catch (err) {
            console.error(err);
            setErrors({ form: `Something went wrong and your details were not saved. Please try again, or email ${FORM.contact} and we'll add you.` });
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="border-l-4 border-rr-pink pl-6 py-2" role="status">
                <h3 className="text-2xl font-black uppercase text-white mb-3">{FORM.done.title}</h3>
                <p className="text-white/85 font-medium leading-relaxed">{FORM.done.body}</p>
                {MOCKUP && <p className="mt-4 text-sm font-bold text-yellow-300">{FORM.mockupNote}</p>}
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate className="relative bg-white rounded-2xl p-5 sm:p-8">
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="absolute left-[-9999px] top-0 w-px h-px opacity-0" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            {MOCKUP && <p className="mb-5 text-sm font-bold text-rr-dark bg-yellow-300 rounded-lg px-3 py-2">{FORM.mockupNote}</p>}

            <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <Label htmlFor="parent_name">Parent or guardian name</Label>
                    <input id="parent_name" name="parent_name" autoComplete="name" value={form.parent_name} onChange={set} className={inputClass(errors.parent_name)} />
                    <Err msg={errors.parent_name} />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={set} className={inputClass(errors.email)} />
                    <Err msg={errors.email} />
                </div>
                <div>
                    <Label htmlFor="phone" optional>Mobile</Label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set} className={inputClass(errors.phone)} />
                    <Err msg={errors.phone} />
                </div>
                <div>
                    <Label htmlFor="player_name">Player's first name</Label>
                    <input id="player_name" name="player_name" autoComplete="off" value={form.player_name} onChange={set} className={inputClass(errors.player_name)} />
                    <Err msg={errors.player_name} />
                </div>
                <div>
                    <Label htmlFor="player_dob" why={FORM.why.dob}>Player's date of birth</Label>
                    <input id="player_dob" name="player_dob" type="date" value={form.player_dob} onChange={set} className={inputClass(errors.player_dob)} />
                    {errors.player_dob === 'older' ? (
                        <p className="text-rr-pink text-sm font-bold mt-1">
                            Junior Royals is for players aged {AGES_TEXT}. Players aged 13 or older can trial for our Performance Squads.{' '}
                            <Link to={PS_ROUTE} className="underline underline-offset-2">See Performance Squads</Link>
                        </p>
                    ) : <Err msg={errors.player_dob} />}
                </div>

                <Choices name="centre" legend="Centre" value={form.centre} onChange={set} error={errors.centre}
                    items={V2_CENTRES.map((c) => ({ value: c.value, label: c.venueText ? c.venueText : `${c.venue}, ${c.suburb}`, sub: c.comingSoon ? `${REGION_LABEL[c.value]} · coming soon` : REGION_LABEL[c.value] }))} />
                <fieldset className="sm:col-span-2">
                    <legend className="block mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-rr-dark">Days your player could train <span className="text-rr-pink">*</span></span>
                        <span className="block text-sm font-medium text-rr-charcoal mt-0.5">{FORM.why.days}</span>
                    </legend>
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-5">
                        {DAYS.map((d) => {
                            const on = form.preferred_days.includes(d.value);
                            return (
                                <label key={d.value} className={`flex items-center gap-3 cursor-pointer rounded-xl border-2 px-4 py-3 min-h-[48px] transition-colors ${on ? 'border-rr-pink' : errors.preferred_days ? 'border-rr-pink/50' : 'border-slate-300 hover:border-rr-pink/60'}`}>
                                    <input type="checkbox" name="preferred_days" value={d.value} checked={on} onChange={toggleDay} className="accent-rr-pink" />
                                    <span className="font-bold text-rr-dark text-[15px]">{d.label}</span>
                                </label>
                            );
                        })}
                    </div>
                    <Err msg={errors.preferred_days} />
                </fieldset>
                <Choices name="preferred_time" legend="Time" why={FORM.why.time} value={form.preferred_time} onChange={set} error={errors.preferred_time} items={FORM.timeChoices} />
            </div>

            {errors.form && <p className="mt-5 text-sm font-bold text-rr-pink">{errors.form}</p>}

            <button type="submit" disabled={submitting}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 min-h-[52px] transition-colors">
                {submitting ? 'Sending…' : CTA.primary} {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-rr-charcoal">
                <Check className="w-4 h-4 text-rr-pink" strokeWidth={3} />
                No payment now. No place is held yet.
            </p>
            <p className="mt-4 text-xs font-medium text-rr-charcoal leading-relaxed">
                <Rich v={FORM.privacy} />{' '}
                <Link to="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>
            </p>
        </form>
    );
};

export default JRV2Form;
