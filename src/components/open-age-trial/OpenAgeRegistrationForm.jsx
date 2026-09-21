import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CalendarClock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import {
    fadeUp, SectionHeading, Label, FieldError, Chevron,
    inputClass, selectClass, PSCheckbox,
} from '../performance-squads/shared';
import {
    CENTRE, PLAYING_ROLES, TRIAL_PRICE, MIN_AGE, MAX_AGE, AGE_AS_AT,
    PARENT_REQUIRED_UNDER, TRIAL_SESSIONS, DATES_CONFIRMED, ALL_SESSIONS_FULL,
    getSelectableSessionCount, getSessionLabel, isSessionFull, WAITLIST,
} from './openAgeData';

// Open age trial registration.
//
// Differences from the Performance Squads trial form, and why:
//   • age gate is MIN_AGE to MAX_AGE from openAgeData (16 to 25), not 10 to 24,
//     and it is pinned to a date so it means the same thing in December
//   • under 18 the contact details collected are the PARENT OR GUARDIAN's, so
//     there is an adult we can actually reach about a child's session
//   • the parent code of conduct is only asked of under 18s, because an adult
//     cannot honestly accept a document that is not theirs
//   • photo and video consent is OPTIONAL, not a gate on registering
//   • one centre, fixed — this trial only recruits into Cranbourne North
//   • while trial dates are unconfirmed it captures a waitlist instead of a
//     booking, so a public promoted page is never a dead end
//
// It writes to the SAME table as the squads trial form, with the same
// preferred_centre and entry_type values, so Alex Thornhill sees these players
// in his existing Google Sheet beside the others. program_type is the only
// thing that marks them as the open age intake. A 'waitlist' row lands in the
// existing interest tab, exactly as a squads waitlist row does.
const PROGRAM_TYPE = 'performance-squads-open-age-2026';

// ── Anti-bot. This page is indexed, in the sitemap and in the nav on every
// page of the site, and the table's only row-level security policy lets the
// browser's anon key insert freely. Nothing here calls a paid service, so the
// risk is junk in the coach's sheet on a trial night rather than a bill.
// A honeypot plus a simple per-browser throttle stops the cheap scripted kind.
// A determined attacker needs a database-side WITH CHECK, which is a schema
// change and therefore Alex's call.
const THROTTLE_KEY = 'oa_trial_last_submit';
const THROTTLE_MS = 20 * 1000;
const HOURLY_KEY = 'oa_trial_submits_hour';
const HOURLY_CAP = 5;

// Returns an error string when this browser should be held off, or null.
const throttleCheck = () => {
    try {
        const now = Date.now();
        const last = Number(window.localStorage.getItem(THROTTLE_KEY) || 0);
        if (now - last < THROTTLE_MS) {
            return 'That went through a moment ago. Give it a few seconds before trying again.';
        }
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]')
            .filter((t) => now - t < 60 * 60 * 1000);
        if (recent.length >= HOURLY_CAP) {
            return 'That is a lot of entries from one device. Get in touch through our website instead.';
        }
        return null;
    } catch {
        // Private browsing or storage blocked. Never block a real player on it.
        return null;
    }
};

const throttleRecord = () => {
    try {
        const now = Date.now();
        window.localStorage.setItem(THROTTLE_KEY, String(now));
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]')
            .filter((t) => now - t < 60 * 60 * 1000);
        recent.push(now);
        window.localStorage.setItem(HOURLY_KEY, JSON.stringify(recent));
    } catch {
        /* storage blocked — nothing to record, and nothing to fail over */
    }
};

// The honeypot. Field name and the "was it tripped" test come from the repo's
// shared src/lib/security/bot.js, so this form and any server check agree on
// what a bot looks like. Off-screen rather than display:none, not a tab stop,
// hidden from screen readers, autoComplete off.
//
// UPGRADE PATH: src/components/security/BotGuard.jsx adds Cloudflare Turnstile
// on top of this, but its token can only be enforced by assertHuman() in a
// server handler, and this form writes straight to Supabase from the browser.
// Wire BotGuard in the day this submission goes through an API route.
const Honeypot = ({ value, onChange }) => (
    <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 w-px h-px opacity-0"
        value={value}
        onChange={onChange}
    />
);

const collectUtm = () => {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        if (params.get(k)) utm[k] = params.get(k);
    });
    return utm;
};

// Shared by both modes so the two never drift on the range or the "as at" date.
const ageError = (raw) => {
    if (!raw.trim()) return 'Player age is required';
    const age = Number(raw.trim());
    if (!Number.isInteger(age) || age < 4 || age > 60) {
        return 'Please enter an age in years (e.g. 18)';
    }
    if (age < MIN_AGE || age > MAX_AGE) {
        return `This trial is for players aged ${MIN_AGE} to ${MAX_AGE} as at ${AGE_AS_AT}.`;
    }
    return null;
};

// ─────────────────────────────────────────────────────────────
// WAITLIST MODE — what #register-pay renders while there are no dates, or
// once every session has filled. Three fields, no money, no governance ticks.
//
// This exists because the page is public, indexed and built to be shared, and
// without it every visitor who arrives before the dates are set leaves no
// trace and there is nobody to tell when the dates land.
// ─────────────────────────────────────────────────────────────
const WaitlistCapture = () => {
    const [form, setForm] = useState({ player_name: '', player_age: '', email: '', company: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const ic = (key) => inputClass(errors, key);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required';
        const ageMsg = ageError(form.player_age);
        if (ageMsg) next.player_age = ageMsg;
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'A valid email is required';
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }

        // Honeypot filled means a script, not a player. Show the same success
        // state and write nothing, so the bot learns nothing from the response.
        if (isHoneypotTripped(form.company)) {
            setDone(true);
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
            const { error } = await supabase.from('performance_squad_leads').insert([
                {
                    player_name: form.player_name.trim(),
                    player_age: form.player_age.trim(),
                    email: form.email.trim(),
                    // NOT NULL in the table, and a waitlist entry has given us no
                    // number. An empty string keeps the row honest without
                    // inventing a contact we do not hold.
                    phone: '',
                    preferred_centre: CENTRE.slug,
                    entry_type: 'waitlist',
                    on_waitlist: true,
                    program_type: PROGRAM_TYPE,
                    // No booking, so no sessions and no fee. The sync script reads
                    // a non-trial entry as owing nothing and will not chase them.
                    trial_sessions: null,
                    trial_session_dates: null,
                    accept_terms: false,
                    accept_player_code: false,
                    accept_parent_code: false,
                    accept_social_media: false,
                    page_referrer: document.referrer || null,
                    ...collectUtm(),
                },
            ]);
            if (error) throw error;
            throttleRecord();
            setDone(true);
        } catch (err) {
            console.error('Open age trial waitlist error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or get in touch through our website.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-20 px-5">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow={ALL_SESSIONS_FULL ? 'Waitlist' : WAITLIST.eyebrow}
                    title={ALL_SESSIONS_FULL ? 'Every Session Is Full' : WAITLIST.title}
                    sub={ALL_SESSIONS_FULL
                        ? 'Leave your details and you are first in line if a place opens up.'
                        : WAITLIST.sub}
                />
                {done ? (
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">You Are On The List</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                            {WAITLIST.done}
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                        <Honeypot value={form.company} onChange={set('company')} />
                        <div className="flex items-start gap-3 mb-6">
                            <CalendarClock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                            <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                                {WAITLIST.body}
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>Player Name</Label>
                                <input type="text" value={form.player_name} onChange={set('player_name')} placeholder="Full name" className={ic('player_name')} />
                                <FieldError msg={errors.player_name} />
                            </div>
                            <div>
                                <Label required>
                                    Player Age{' '}
                                    <span className="normal-case font-medium text-white/40">({MIN_AGE} to {MAX_AGE})</span>
                                </Label>
                                <input type="text" inputMode="numeric" value={form.player_age} onChange={set('player_age')} placeholder="e.g. 18" className={ic('player_age')} />
                                <FieldError msg={errors.player_age} />
                            </div>
                        </div>
                        <div className="mb-6">
                            <Label required>Email</Label>
                            <input type="email" value={form.email} onChange={set('email')} placeholder="Where we send the dates" className={ic('email')} />
                            <FieldError msg={errors.email} />
                        </div>
                        {errors.form && (
                            <p className="text-rr-pink text-sm font-bold mb-4 text-center">{errors.form}</p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            {submitting ? 'Submitting…' : WAITLIST.cta}
                            {!submitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                        <p className="text-white/35 text-xs font-medium text-center mt-4">
                            No payment now, and nothing is booked. We only use this to tell you the dates.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────────────────────
// BOOKING MODE — only rendered once real dates exist and at least one
// session is still open.
// ─────────────────────────────────────────────────────────────
const BookingForm = ({ onRequestPayment }) => {
    const [form, setForm] = useState({
        player_name: '',
        player_age: '',
        parent_name: '',
        email: '',
        phone: '',
        club: '',
        playing_role: '',
        trial_session_dates: [],
        accept_terms: false,
        accept_player_code: false,
        accept_parent_code: false,
        accept_social_media: false,
        company: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedResult, setSubmittedResult] = useState(null);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

    // Drives the parent/guardian rule live, so the fields relabel the moment a
    // minor's age is typed rather than only on submit.
    const ageNum = Number(form.player_age.trim());
    const isMinor = Number.isInteger(ageNum) && ageNum >= MIN_AGE && ageNum < PARENT_REQUIRED_UNDER;

    // The real cap: a trial with one night still open lets a player pick one,
    // whatever MAX_TRIAL_SESSIONS says.
    const cap = getSelectableSessionCount();

    const toggleSession = (id) =>
        setForm((f) => {
            // A full session can never be picked, checked here as well as in the
            // picker and again on submit, so a stale id cannot sneak through.
            if (isSessionFull(id)) return f;
            const picked = f.trial_session_dates;
            if (picked.includes(id)) {
                return { ...f, trial_session_dates: picked.filter((x) => x !== id) };
            }
            if (picked.length >= cap) return f;
            return { ...f, trial_session_dates: [...picked, id] };
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required';
        const ageMsg = ageError(form.player_age);
        if (ageMsg) next.player_age = ageMsg;
        // Under 18, an adult has to be on the registration AND reachable.
        if (isMinor && !form.parent_name.trim()) {
            next.parent_name = `A parent or guardian name is required for players under ${PARENT_REQUIRED_UNDER}.`;
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
            next.email = isMinor
                ? "A valid parent or guardian email is required"
                : 'A valid email is required';
        }
        if (!form.phone.trim()) {
            next.phone = isMinor ? 'A parent or guardian mobile number is required' : 'Phone number is required';
        }
        if (!form.playing_role) next.playing_role = 'Please choose a playing role';
        if (form.trial_session_dates.length === 0) {
            next.trial_session_dates = 'Please choose at least one trial session';
        } else if (form.trial_session_dates.some(isSessionFull)) {
            next.trial_session_dates = 'One of the sessions you picked is now full. Please choose another.';
        }
        if (!form.accept_terms) next.accept_terms = 'You must agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'You must agree to the Player Code of Conduct';
        // Only asked of under 18s. An adult cannot honestly accept a document
        // written for somebody else's parent.
        if (isMinor && !form.accept_parent_code) {
            next.accept_parent_code = 'The parent or guardian must agree to the Parent/Guardian Code of Conduct';
        }
        // accept_social_media is deliberately NOT validated. Consent to marketing
        // use of a player's photos is not real consent if you cannot register
        // without giving it, and this page recruits 16 and 17 year olds.

        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        if (isHoneypotTripped(form.company)) {
            // Honeypot. Same success state, nothing written.
            setSubmitted(true);
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
            const { error } = await supabase.from('performance_squad_leads').insert([
                {
                    player_name: form.player_name.trim(),
                    player_age: form.player_age.trim(),
                    parent_name: form.parent_name.trim() || null,
                    // For a minor these are the PARENT OR GUARDIAN's details. The
                    // table has no separate parent contact column, and the website
                    // database is read only from this branch, so the contact of
                    // record is the adult's rather than the child's. It also makes
                    // the Stripe payer email match the registration, because the
                    // parent is the one who pays.
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    club: form.club.trim() || null,
                    preferred_centre: CENTRE.slug,
                    entry_type: 'trial',
                    on_waitlist: false,
                    program_type: PROGRAM_TYPE,
                    playing_role: form.playing_role,
                    trial_sessions: form.trial_session_dates.length,
                    trial_session_dates: form.trial_session_dates,
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    page_referrer: document.referrer || null,
                    ...collectUtm(),
                },
            ]);
            if (error) throw error;
            throttleRecord();

            const result = {
                centre: CENTRE.slug,
                centreName: CENTRE.name,
                signupType: 'trial',
                sessionIds: form.trial_session_dates,
                sessionLabels: form.trial_session_dates.map(getSessionLabel),
                payerEmailHint: true,
            };
            setSubmitted(true);
            setSubmittedResult(result);
            onRequestPayment?.(result);
        } catch (err) {
            console.error('Open age trial registration error:', err);
            setErrors({ form: 'Something went wrong. Please try again, or get in touch through our website.' });
        } finally {
            setSubmitting(false);
        }
    };

    const ic = (key) => inputClass(errors, key);
    const sc = (key) => selectClass(errors, key);

    return (
        <section className="py-20 px-5">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow="Register & Pay"
                    title="Book Your Trial Place"
                    sub={`Enter your details, choose your session, and pay $${TRIAL_PRICE} a session. Your place is not confirmed until payment is received.`}
                />
                {submitted ? (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Registration Received</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-6">
                            Thanks, we have your details. Your place is not confirmed until payment is
                            received, so finish up below if you have not already.
                        </p>
                        {submittedResult && (
                            <button
                                onClick={() => onRequestPayment?.(submittedResult)}
                                className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                Complete Payment <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                        <Honeypot value={form.company} onChange={set('company')} />
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>Player Name</Label>
                                <input type="text" value={form.player_name} onChange={set('player_name')} placeholder="Full name" className={ic('player_name')} />
                                <FieldError msg={errors.player_name} />
                            </div>
                            <div>
                                <Label required>
                                    Player Age{' '}
                                    <span className="normal-case font-medium text-white/40">(in years, {MIN_AGE} to {MAX_AGE} as at {AGE_AS_AT})</span>
                                </Label>
                                <input type="text" inputMode="numeric" value={form.player_age} onChange={set('player_age')} placeholder="e.g. 18" className={ic('player_age')} />
                                <FieldError msg={errors.player_age} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label required={isMinor}>
                                Parent / Guardian Name{' '}
                                <span className="normal-case font-medium text-white/40">
                                    {isMinor
                                        ? `(required — the player is under ${PARENT_REQUIRED_UNDER})`
                                        : `(required if the player is under ${PARENT_REQUIRED_UNDER})`}
                                </span>
                            </Label>
                            <input type="text" value={form.parent_name} onChange={set('parent_name')} placeholder="Parent or guardian full name" className={ic('parent_name')} />
                            <FieldError msg={errors.parent_name} />
                        </div>
                        {/* Under 18, the contact details are the ADULT's. Without this
                            a cancellation, a venue change or a selection outcome for a
                            16 year old would only ever reach the 16 year old. */}
                        {isMinor && (
                            <p className="text-amber-300/80 text-xs font-medium leading-relaxed mb-4 -mt-1">
                                The player is under {PARENT_REQUIRED_UNDER}, so please give the parent or
                                guardian&apos;s email and mobile below. That is who we contact about the
                                session, any change to it, and the selection outcome.
                            </p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>{isMinor ? 'Parent / Guardian Email' : 'Email'}</Label>
                                <input type="email" value={form.email} onChange={set('email')} placeholder={isMinor ? "Parent or guardian's email" : 'Your email address'} className={ic('email')} />
                                <FieldError msg={errors.email} />
                            </div>
                            <div>
                                <Label required>{isMinor ? 'Parent / Guardian Mobile' : 'Phone'}</Label>
                                <input type="tel" value={form.phone} onChange={set('phone')} placeholder={isMinor ? "Parent or guardian's mobile" : 'Your mobile number'} className={ic('phone')} />
                                <FieldError msg={errors.phone} />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label>Current Club <span className="normal-case font-medium text-white/40">(optional)</span></Label>
                                <input type="text" value={form.club} onChange={set('club')} placeholder="Club / association" className={ic('club')} />
                            </div>
                            <div className="relative">
                                <Label required>Playing Role</Label>
                                <div className="relative">
                                    <select value={form.playing_role} onChange={set('playing_role')} className={sc('playing_role')}>
                                        <option value="" disabled>Choose a role</option>
                                        {PLAYING_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <Chevron />
                                </div>
                                <FieldError msg={errors.playing_role} />
                            </div>
                        </div>

                        <div className="mb-4">
                            <Label required>
                                Which trial sessions will you attend?
                                <span className="normal-case font-medium text-white/40">
                                    {cap > 1 ? ` (choose up to ${cap})` : ''}
                                </span>
                            </Label>
                            <div className="space-y-2.5">
                                {TRIAL_SESSIONS.map((sess) => {
                                    const picked = form.trial_session_dates.includes(sess.id);
                                    const full = sess.full === true;
                                    const atCap = !picked && form.trial_session_dates.length >= cap;
                                    const blocked = full || atCap;
                                    return (
                                        <button
                                            type="button"
                                            key={sess.id}
                                            onClick={() => toggleSession(sess.id)}
                                            disabled={blocked}
                                            aria-disabled={blocked}
                                            aria-pressed={picked}
                                            className={`w-full flex items-center gap-3 text-left rounded-xl px-4 py-3.5 border transition-colors ${picked
                                                ? 'bg-rr-pink/15 border-rr-pink text-white'
                                                : blocked
                                                    ? 'bg-white/[0.03] border-white/10 text-white/30 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/15 text-white/70 hover:border-rr-pink/50'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${picked ? 'bg-rr-pink border-rr-pink' : 'border-white/30'}`}>
                                                {picked && <Check className="w-3.5 h-3.5 text-white" />}
                                            </span>
                                            <span className={`text-sm font-medium ${full ? 'line-through' : ''}`}>{sess.label}</span>
                                            {full && (
                                                <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-amber-300/70">
                                                    {sess.badge || 'Full'}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <FieldError msg={errors.trial_session_dates} />
                            <p className="text-white/40 text-xs font-medium mt-2">
                                ${TRIAL_PRICE} per player, per session
                                {form.trial_session_dates.length > 0 && (
                                    <>
                                        {' — '}you will pay for {form.trial_session_dates.length} session
                                        {form.trial_session_dates.length === 1 ? '' : 's'}
                                        <span className="text-rr-light-pink font-bold">
                                            {' '}(${TRIAL_PRICE * form.trial_session_dates.length})
                                        </span>
                                    </>
                                )}.
                            </p>
                        </div>

                        {/* Governance. Same columns as the squads trial form so Alex
                            Thornhill's sheet reads identically, but three changes:
                            the parent code is only ASKED of under 18s, the photo and
                            video consent is optional, and the wording says who is
                            agreeing rather than assuming a player can tick on a
                            parent's behalf. */}
                        <div className="mt-2 mb-6 pt-6 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">
                                Agreements &amp; Consent
                            </p>
                            <PSCheckbox checked={form.accept_terms} onToggle={() => toggle('accept_terms')} error={errors.accept_terms}>
                                I have read and agree to the{' '}
                                <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Terms &amp; Conditions</a>{' '}and{' '}
                                <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Privacy Policy</a>, and confirm the information provided is accurate.
                            </PSCheckbox>
                            <PSCheckbox checked={form.accept_player_code} onToggle={() => toggle('accept_player_code')} error={errors.accept_player_code}>
                                I have read, understood, and agree to the{' '}
                                <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Player Code of Conduct</a>.
                            </PSCheckbox>
                            {isMinor && (
                                <PSCheckbox checked={form.accept_parent_code} onToggle={() => toggle('accept_parent_code')} error={errors.accept_parent_code}>
                                    I am the player&apos;s parent or guardian. I have read, understood, and agree to the{' '}
                                    <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Parent/Guardian Code of Conduct</a>.
                                </PSCheckbox>
                            )}
                            <PSCheckbox checked={form.accept_social_media} onToggle={() => toggle('accept_social_media')}>
                                <span className="text-white/50">(Optional)</span> I am happy for photos and videos
                                featuring the player to be used on Rajasthan Royals Academy Melbourne&apos;s social
                                media and marketing channels. You can register either way.
                            </PSCheckbox>
                        </div>

                        {errors.form && (
                            <p className="text-rr-pink text-sm font-bold mb-4 text-center">{errors.form}</p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            {submitting ? 'Submitting…' : 'Submit Registration'}
                            {!submitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

// The one thing #register-pay renders. Which mode depends entirely on whether
// openAgeData has real dates in it and whether any of them are still open.
const OpenAgeRegistrationForm = ({ onRequestPayment }) => {
    if (!DATES_CONFIRMED || ALL_SESSIONS_FULL) return <WaitlistCapture />;
    return <BookingForm onRequestPayment={onRequestPayment} />;
};

export default OpenAgeRegistrationForm;
