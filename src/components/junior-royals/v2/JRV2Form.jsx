import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../../lib/security/bot.js';
import { MOCKUP, CENTRES, AGES, AGES_TEXT, PS_ROUTE } from '../juniorRoyalsData';
import { ageAtStart } from '../JuniorRoyalsForm';
import { Rich } from '../JuniorRoyalsShared';
import { FORM, CTA, REGION_LABEL } from './jrV2Content';

// ─────────────────────────────────────────────────────────────
// Junior Royals v2 — Register Your Interest.
//
// Alex, 8 Oct 2026: expressions of interest first, "so we can understand what our
// bookings are and our lane hires". So beyond the contact details the form asks
// three quick taps: which group size (4s / 6s / either), which time, and how the
// family would likely pay. Each says why it is asked (copy-esl.md §1.7).
//
// Writes to public.junior_royals_interest (not created yet; one row = a family who
// wants a Junior Royals place; NO payment taken, NO place held). While MOCKUP is
// true it validates and shows the success state but saves nothing.
//
// Choice columns get NO list-of-values CHECK in the database (the 27 Sep – 5 Oct
// Cranbourne North outage); every value this form can send is listed in the tests
// and must be added to the hourly watchdog's test inserts when the table ships.
// ─────────────────────────────────────────────────────────────

const TABLE = 'junior_royals_interest';
const EMPTY = { parent_name: '', email: '', phone: '', player_name: '', player_dob: '', centre: '', group_option: '', preferred_time: '', payment_plan: '' };

export const FORM_VALUES = {
    centre: CENTRES.map((c) => c.value),
    group_option: FORM.optionChoices.map((c) => c.value),
    preferred_time: FORM.timeChoices.map((c) => c.value),
    payment_plan: FORM.payChoices.map((c) => c.value),
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
        for (const k of ['centre', 'group_option', 'preferred_time', 'payment_plan']) {
            if (!FORM_VALUES[k].includes(form[k])) e[k] = 'Please choose one.';
        }
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
                    group_option: form.group_option,
                    preferred_time: form.preferred_time,
                    payment_plan: form.payment_plan,
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

                <Choices name="centre" legend="Centre" value={form.centre} onChange={set} error={errors.centre} cols="sm:grid-cols-2"
                    items={CENTRES.map((c) => ({ value: c.value, label: `${c.venue}, ${c.suburb}`, sub: `${REGION_LABEL[c.value]} · Wednesdays` }))} />
                <Choices name="group_option" legend="Group size" why={FORM.why.option} value={form.group_option} onChange={set} error={errors.group_option} items={FORM.optionChoices} />
                <Choices name="preferred_time" legend="Time" why={FORM.why.time} value={form.preferred_time} onChange={set} error={errors.preferred_time} items={FORM.timeChoices} />
                <Choices name="payment_plan" legend="How would you likely pay?" why={FORM.why.pay} value={form.payment_plan} onChange={set} error={errors.payment_plan} cols="sm:grid-cols-2" items={FORM.payChoices} />
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
