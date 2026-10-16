import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import { fadeUp, SectionHeading, FieldError, inputClass, PSCheckbox } from '../performance-squads/shared';
import {
    DB_TABLE, SUCCESS_ROUTE, MIN_AGE, MAX_AGE, AGES_SPOKEN, PROGRAM_NAME, CLUB, CONTACT_EMAIL,
    FORM_COPY, CLUB_OPTIONS, NOTES_FIELD, PHOTO_CONSENT, MARKETING_OPT_IN, STATE_COPY, DB_REFUSALS, STORE,
} from './lpJrDayData';
import { placesLine } from './usePlaces';

// Registration for the free Junior Royals Carnival at Lower Plenty.
//
// One row per player in lower_plenty_junior_royals_day_registrations. The id
// is made here and the insert never chains .select(): the public role cannot
// read the table back, so asking for the row would report a failure after it
// was saved.
//
// The database refuses an insert once 60 places are taken (EVENT_FULL) or
// after Friday 23 October, 9:00pm Melbourne (REGISTRATIONS_CLOSED). The form
// shows those refusals in plain words.
//
// A brother or sister: after saving, the parent's details are kept in this
// browser's session storage (never in the address bar), so the next player
// only needs the player fields.

const THROTTLE_KEY = 'lpjrday_last_submit';
const THROTTLE_MS = 15 * 1000;
const HOURLY_KEY = 'lpjrday_submits_hour';
const HOURLY_CAP = 6;

const throttleCheck = () => {
    try {
        const now = Date.now();
        const last = Number(window.localStorage.getItem(THROTTLE_KEY) || 0);
        if (now - last < THROTTLE_MS) return 'That went through a moment ago. Wait a few seconds before sending another.';
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]').filter((t) => now - t < 3600000);
        if (recent.length >= HOURLY_CAP) {
            return `That is a lot of players from one device. Please email ${CONTACT_EMAIL} and we will add the rest by hand.`;
        }
        return null;
    } catch {
        return null; // storage blocked — never stop a real parent on it
    }
};
const throttleRecord = () => {
    try {
        const now = Date.now();
        window.localStorage.setItem(THROTTLE_KEY, String(now));
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]').filter((t) => now - t < 3600000);
        recent.push(now);
        window.localStorage.setItem(HOURLY_KEY, JSON.stringify(recent));
    } catch { /* nothing to record */ }
};

const collectUtm = () => {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => {
        if (params.get(k)) utm[k] = params.get(k).slice(0, 200);
    });
    return utm;
};

const newId = () => (window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }));

const FieldLabel = ({ htmlFor, children, required, hint }) => (
    <label htmlFor={htmlFor} className="block text-white/75 text-xs font-bold uppercase tracking-wider mb-1.5 text-left">
        {children} {required && <span className="text-rr-pink">*</span>}
        {hint && <span className="normal-case font-medium text-white/45"> {hint}</span>}
    </label>
);

const linkClass = 'text-rr-light-pink underline hover:text-white';

const EMPTY_PLAYER = { player_first_name: '', player_last_name: '', player_age: '', club_status: '', club_name: '', notes: '' };
const EMPTY_CONSENTS = {
    accept_terms: false,
    accept_player_code: false,
    accept_parent_code: false,
    photo_consent_academy: false,
    photo_consent_royals: false,
    marketing_opt_in: false,
};
const EMPTY_PARENT = { parent_name: '', email: '', phone: '', suburb: '' };

const savedParent = () => {
    try {
        const p = JSON.parse(window.sessionStorage.getItem(STORE.parent) || 'null');
        return p && typeof p === 'object' ? { ...EMPTY_PARENT, ...p } : EMPTY_PARENT;
    } catch {
        return EMPTY_PARENT;
    }
};

const ageError = (raw) => {
    const v = String(raw).trim();
    if (!v) return "Please enter the player's age";
    const age = Number(v);
    if (!Number.isInteger(age)) return 'Please enter the age in whole years, for example 9';
    if (age < MIN_AGE || age > MAX_AGE) return `This morning is for players aged ${AGES_SPOKEN}.`;
    return null;
};

const Notice = ({ title, body }) => (
    <section className="bg-rr-dark text-white py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">{title}</h2>
            <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">{body}</p>
            <p className="text-white/55 text-sm font-medium">
                Questions? Email <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
            </p>
        </div>
    </section>
);

const RegistrationForm = ({ places }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState(() => ({ ...EMPTY_PLAYER, ...savedParent(), ...EMPTY_CONSENTS, company: '' }));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [returning, setReturning] = useState(false);

    useEffect(() => {
        try { setReturning(Boolean(window.sessionStorage.getItem(STORE.parent))); } catch { /* ignore */ }
    }, []);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));
    const ic = (key) => inputClass(errors, key);

    const validate = () => {
        const next = {};
        if (!form.player_first_name.trim()) next.player_first_name = "Please enter the player's first name";
        if (!form.player_last_name.trim()) next.player_last_name = "Please enter the player's last name";
        const ageMsg = ageError(form.player_age);
        if (ageMsg) next.player_age = ageMsg;
        if (!form.club_status) next.club_status = 'Please choose one';
        if (!form.parent_name.trim()) next.parent_name = "Please enter the parent or guardian's name";
        if (!form.email.trim()) next.email = 'Please enter an email address';
        else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please enter a valid email address';
        if (!form.phone.trim()) next.phone = 'Please enter a mobile number';
        else if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'Please check the mobile number';
        if (!form.accept_terms) next.accept_terms = 'Please agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'Please agree to the Player Code of Conduct';
        if (!form.accept_parent_code) next.accept_parent_code = 'Please agree to the Parent/Guardian Code of Conduct';
        return next;
    };

    const finish = (firstName) => {
        try {
            window.sessionStorage.setItem(STORE.done, firstName);
            window.sessionStorage.setItem(STORE.parent, JSON.stringify({
                parent_name: form.parent_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                suburb: form.suburb.trim(),
            }));
        } catch { /* storage blocked — the success page still works without the name */ }
        navigate(SUCCESS_ROUTE);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            document.getElementById(`lp-${Object.keys(next)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const firstName = form.player_first_name.trim();

        // A filled honeypot means a script: same outcome on screen, nothing written.
        if (isHoneypotTripped(form.company)) {
            finish(firstName);
            return;
        }
        const held = throttleCheck();
        if (held) {
            setErrors({ form: held });
            return;
        }

        setErrors({});
        setSubmitting(true);
        try {
            const { error } = await supabase.from(DB_TABLE).insert([{
                id: newId(),
                player_first_name: firstName,
                player_last_name: form.player_last_name.trim(),
                player_age: Number(form.player_age.trim()),
                club_status: form.club_status,
                club_name: form.club_status === 'other-club' ? (form.club_name.trim() || null)
                    : form.club_status === 'lower-plenty' ? CLUB : null,
                notes: form.notes.trim() || null,
                parent_name: form.parent_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                suburb: form.suburb.trim() || null,
                accept_terms: form.accept_terms,
                accept_player_code: form.accept_player_code,
                accept_parent_code: form.accept_parent_code,
                photo_consent_academy: form.photo_consent_academy,
                photo_consent_royals: form.photo_consent_royals,
                marketing_opt_in: form.marketing_opt_in,
                page_referrer: document.referrer ? document.referrer.slice(0, 500) : null,
                ...collectUtm(),
            }]);
            if (error) throw error;
            throttleRecord();
            // Meta Pixel: a registration was saved. Program and place only — never
            // a name, email, phone or age.
            try {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead', { content_name: PROGRAM_NAME, content_category: 'Lower Plenty' });
                }
            } catch { /* never block the family on tracking */ }
            finish(firstName);
        } catch (err) {
            console.error('Lower Plenty registration error:', err);
            const msg = String(err?.message || '');
            const refusal = Object.keys(DB_REFUSALS).find((k) => msg.includes(k));
            setErrors({
                form: refusal
                    ? DB_REFUSALS[refusal]
                    : `Something went wrong and nothing was saved. Please try again, or email ${CONTACT_EMAIL} and we will add the player by hand.`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-rr-dark text-white py-16 sm:py-24 px-5">
            <div className="max-w-2xl mx-auto">
                <SectionHeading eyebrow={FORM_COPY.eyebrow} title={FORM_COPY.title} sub={FORM_COPY.sub} />
                <p className="text-center text-rr-light-pink text-sm font-black uppercase tracking-wider -mt-6 mb-8">
                    {placesLine(places)}
                </p>

                <motion.form
                    onSubmit={handleSubmit}
                    noValidate
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp} custom={0}
                    className="relative border border-white/15 rounded-2xl p-5 sm:p-9"
                >
                    <input
                        type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true"
                        className="absolute left-[-9999px] top-0 w-px h-px opacity-0"
                        value={form.company} onChange={set('company')}
                    />

                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">Player</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div id="lp-player_first_name">
                            <FieldLabel htmlFor="lp-in-first" required>First name</FieldLabel>
                            <input id="lp-in-first" type="text" autoComplete="off" maxLength={100}
                                value={form.player_first_name} onChange={set('player_first_name')} className={ic('player_first_name')} />
                            <FieldError msg={errors.player_first_name} />
                        </div>
                        <div id="lp-player_last_name">
                            <FieldLabel htmlFor="lp-in-last" required>Last name</FieldLabel>
                            <input id="lp-in-last" type="text" autoComplete="off" maxLength={100}
                                value={form.player_last_name} onChange={set('player_last_name')} className={ic('player_last_name')} />
                            <FieldError msg={errors.player_last_name} />
                        </div>
                    </div>
                    <div id="lp-player_age" className="mb-5 max-w-[12rem]">
                        <FieldLabel htmlFor="lp-in-age" required hint={`(${AGES_SPOKEN})`}>Age on the day</FieldLabel>
                        <input id="lp-in-age" type="text" inputMode="numeric" maxLength={2}
                            value={form.player_age} onChange={set('player_age')} placeholder="e.g. 9" className={ic('player_age')} />
                        <FieldError msg={errors.player_age} />
                    </div>

                    <div id="lp-club_status" className="mb-5">
                        <p id="lp-club-label" className="block text-white/75 text-xs font-bold uppercase tracking-wider mb-2">
                            Does your player play at a club? <span className="text-rr-pink">*</span>
                        </p>
                        <div role="radiogroup" aria-labelledby="lp-club-label" className="grid gap-2">
                            {CLUB_OPTIONS.map((o) => {
                                const picked = form.club_status === o.value;
                                return (
                                    <button
                                        key={o.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={picked}
                                        onClick={() => {
                                            setForm((f) => ({ ...f, club_status: o.value }));
                                            if (errors.club_status) setErrors((er) => ({ ...er, club_status: undefined }));
                                        }}
                                        className={`w-full min-h-[48px] flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${picked ? 'border-rr-pink bg-rr-pink/15' : `${errors.club_status ? 'border-rr-pink' : 'border-white/15'} hover:border-rr-pink/60`}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${picked ? 'border-rr-pink' : 'border-white/40'}`}>
                                            {picked && <span className="w-2 h-2 rounded-full bg-rr-pink" />}
                                        </span>
                                        <span className="text-white text-[15px] font-semibold">{o.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <FieldError msg={errors.club_status} />
                        {form.club_status === 'other-club' && (
                            <div className="mt-3">
                                <FieldLabel htmlFor="lp-in-club" hint="(optional)">Club name</FieldLabel>
                                <input id="lp-in-club" type="text" maxLength={200}
                                    value={form.club_name} onChange={set('club_name')} className={ic('club_name')} />
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <FieldLabel htmlFor="lp-in-notes" hint="(optional)">{NOTES_FIELD.label}</FieldLabel>
                        <p id="lp-notes-help" className="text-white/50 text-[13px] font-medium leading-relaxed mb-2.5">{NOTES_FIELD.help}</p>
                        <textarea id="lp-in-notes" rows={3} maxLength={1000} aria-describedby="lp-notes-help"
                            value={form.notes} onChange={set('notes')} className={`${ic('notes')} resize-none`} />
                    </div>

                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">Parent or Guardian</p>
                    <p className="text-white/55 text-[13px] font-medium leading-relaxed mb-5">
                        {returning
                            ? 'Your details from the last player are filled in. Check them, then add the next player above.'
                            : 'Every player is under 18, so we use these details to tell you about any change to the morning.'}
                    </p>
                    <div id="lp-parent_name" className="mb-4">
                        <FieldLabel htmlFor="lp-in-parent" required>Parent / Guardian name</FieldLabel>
                        <input id="lp-in-parent" type="text" autoComplete="name" maxLength={200}
                            value={form.parent_name} onChange={set('parent_name')} className={ic('parent_name')} />
                        <FieldError msg={errors.parent_name} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div id="lp-email">
                            <FieldLabel htmlFor="lp-in-email" required>Email</FieldLabel>
                            <input id="lp-in-email" type="email" autoComplete="email" maxLength={320}
                                value={form.email} onChange={set('email')} className={ic('email')} />
                            <FieldError msg={errors.email} />
                        </div>
                        <div id="lp-phone">
                            <FieldLabel htmlFor="lp-in-phone" required>Mobile</FieldLabel>
                            <input id="lp-in-phone" type="tel" autoComplete="tel" maxLength={50}
                                value={form.phone} onChange={set('phone')} placeholder="04__ ___ ___" className={ic('phone')} />
                            <FieldError msg={errors.phone} />
                        </div>
                    </div>
                    <div className="mb-8">
                        <FieldLabel htmlFor="lp-in-suburb" hint="(optional)">Suburb you live in</FieldLabel>
                        <input id="lp-in-suburb" type="text" autoComplete="address-level2" maxLength={100}
                            value={form.suburb} onChange={set('suburb')} className={ic('suburb')} />
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">Agreements</p>
                        <div id="lp-accept_terms">
                            <PSCheckbox checked={form.accept_terms} onToggle={() => toggle('accept_terms')} error={errors.accept_terms}>
                                I have read and agree to the{' '}
                                <a href="/terms-conditions" target="_blank" rel="noreferrer" className={linkClass}>Terms &amp; Conditions</a>{' '}and{' '}
                                <a href="/privacy-policy" target="_blank" rel="noreferrer" className={linkClass}>Privacy Policy</a>, and the details above are correct.
                            </PSCheckbox>
                        </div>
                        <div id="lp-accept_player_code">
                            <PSCheckbox checked={form.accept_player_code} onToggle={() => toggle('accept_player_code')} error={errors.accept_player_code}>
                                I agree to the{' '}
                                <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Player Code of Conduct</a>.
                            </PSCheckbox>
                        </div>
                        <div id="lp-accept_parent_code">
                            <PSCheckbox checked={form.accept_parent_code} onToggle={() => toggle('accept_parent_code')} error={errors.accept_parent_code}>
                                I am the player&apos;s parent or guardian, and I agree to the{' '}
                                <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Parent/Guardian Code of Conduct</a>.
                            </PSCheckbox>
                        </div>
                    </div>

                    {/* Photo consent: two separate, optional answers, unticked to start. */}
                    <div className="pt-6 mt-4 border-t border-white/10">
                        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">
                            <Camera className="w-3.5 h-3.5" /> Photos &amp; video <span className="text-white/45">(optional)</span>
                        </p>
                        <p className="text-white/55 text-[13px] font-medium leading-relaxed mb-4">{PHOTO_CONSENT.intro}</p>
                        <PSCheckbox checked={form.photo_consent_academy} onToggle={() => toggle('photo_consent_academy')}>
                            {PHOTO_CONSENT.academy}
                        </PSCheckbox>
                        <PSCheckbox checked={form.photo_consent_royals} onToggle={() => toggle('photo_consent_royals')}>
                            {PHOTO_CONSENT.royals}
                        </PSCheckbox>
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/10">
                        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">
                            <Mail className="w-3.5 h-3.5" /> Hear about more <span className="text-white/45">(optional)</span>
                        </p>
                        <PSCheckbox checked={form.marketing_opt_in} onToggle={() => toggle('marketing_opt_in')}>
                            {MARKETING_OPT_IN}
                        </PSCheckbox>
                    </div>

                    {errors.form && (
                        <p role="alert" className="text-rr-pink text-sm font-bold mt-6 text-center">{errors.form}</p>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-7 inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-4 transition-colors"
                    >
                        {submitting ? 'Saving…' : FORM_COPY.submit}
                        {!submitting && <ArrowRight className="w-4 h-4" />}
                    </button>
                    <p className="text-white/50 text-xs font-medium text-center mt-4">{FORM_COPY.footnote}</p>
                </motion.form>
            </div>
        </section>
    );
};

// What #register renders, by the live state of the morning.
const LPForm = ({ places }) => {
    if (places.state === 'closed') return <Notice {...STATE_COPY.closed} />;
    if (places.state === 'full') return <Notice {...STATE_COPY.full} />;
    return <RegistrationForm places={places} />;
};

export default LPForm;
