import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CreditCard, Mail, UserPlus, Camera, CalendarClock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { trackLead, trackCheckout } from '../../lib/metaPixel';
import { fillAttribution, LEAD_ATTR_COLUMNS } from '../../lib/attribution';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import {
    fadeUp, SectionHeading, FieldError, inputClass, PSCheckbox,
} from '../performance-squads/shared';
import {
    DB_TABLE, SESSION_VIEW, PAGE_STATE, STATE_BADGE, getSession, MIN_AGE, MAX_AGE, AGE_RANGE,
    FORM_COPY, FULL_COPY, CLOSED_COPY, NOTES_FIELD, PHOTO_CONSENT, CONTACT_EMAIL,
    submitCopyFor,
} from './sidJuniorsData';

// Booking section for /sid-juniors. What it renders depends on PAGE_STATE in
// sidJuniorsData.js:
//
//   open   — the form, while at least one session takes bookings. The parent
//            must choose a session; a session that is closed or full is shown
//            but cannot be chosen.
//   closed — no session is taking bookings yet. No form, just when places open.
//   full   — every session is full. No form.
//
// Each session is either a BOOKING REQUEST (no payment link: the details are
// saved, no money is taken, and the page says so) or PAY TO BOOK (details are
// saved first, then the parent goes to Stripe in the SAME tab, because the
// Instagram in-app browser silently refuses to open a new tab).
//
// One row per booking in match_registrations, tagged with the session's slug.
// The insert never chains .select(): the row cannot be read back from the
// browser, so asking for it would report a failure after the row was saved.

// ── Anti-bot, as on the open age trial: a honeypot plus a per-browser throttle.
const THROTTLE_KEY = 'sid_juniors_last_submit';
const THROTTLE_MS = 20 * 1000;
const HOURLY_KEY = 'sid_juniors_submits_hour';
const HOURLY_CAP = 5;

const throttleCheck = () => {
    try {
        const now = Date.now();
        const last = Number(window.localStorage.getItem(THROTTLE_KEY) || 0);
        if (now - last < THROTTLE_MS) {
            return 'That went through a moment ago. Give it a few seconds before sending another.';
        }
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]')
            .filter((t) => now - t < 60 * 60 * 1000);
        if (recent.length >= HOURLY_CAP) {
            return `That is a lot of bookings from one device. Please email ${CONTACT_EMAIL} and we will add the rest by hand.`;
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
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]')
            .filter((t) => now - t < 60 * 60 * 1000);
        recent.push(now);
        window.localStorage.setItem(HOURLY_KEY, JSON.stringify(recent));
    } catch {
        /* storage blocked — nothing to record */
    }
};

// Off-screen rather than display:none, not a tab stop, hidden from screen
// readers. Field name shared with src/lib/security/bot.js.
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

// Same look as the shared Label, but tied to its input for screen readers.
const FieldLabel = ({ htmlFor, children, required, hint }) => (
    <label htmlFor={htmlFor} className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 text-left">
        {children} {required && <span className="text-rr-pink">*</span>}
        {hint && <span className="normal-case font-medium text-white/40"> {hint}</span>}
    </label>
);

const collectUtm = () => {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        if (params.get(k)) utm[k] = params.get(k);
    });
    return utm;
};

const ageError = (raw) => {
    const v = String(raw).trim();
    if (!v) return "Please enter the player's age";
    const age = Number(v);
    if (!Number.isInteger(age)) return 'Please enter the age in whole years, for example 10';
    if (age < MIN_AGE || age > MAX_AGE) return `These sessions are for players aged ${AGE_RANGE}.`;
    return null;
};

const EMPTY_PLAYER = { session: '', player_name: '', player_age: '', club: '', notes: '' };
// Every agreement and both photo answers start unticked, and are asked again
// for each player rather than carried over.
const EMPTY_CONSENTS = {
    accept_terms: false,
    accept_player_code: false,
    accept_parent_code: false,
    accept_social_media: false, // photo box 1: RRA Melbourne's own channels
    accept_royals_media: false, // photo box 2: the Rajasthan Royals' channels
};
const EMPTY = {
    ...EMPTY_PLAYER,
    parent_name: '',
    email: '',
    phone: '',
    ...EMPTY_CONSENTS,
    company: '',
};

const linkClass = 'text-rr-light-pink underline hover:text-white';

const Notice = ({ eyebrow, title, children }) => (
    <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
            <SectionHeading eyebrow={eyebrow} title={title} />
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-10 text-center">
                {children}
            </div>
        </div>
    </section>
);

// ── No session is taking bookings yet: no form, and no dead end either. ──
const ClosedNotice = () => (
    <Notice eyebrow={CLOSED_COPY.eyebrow} title={CLOSED_COPY.title}>
        <CalendarClock className="w-8 h-8 text-rr-pink mx-auto mb-4" />
        <p className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed">
            {CLOSED_COPY.body}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
        </p>
    </Notice>
);

// ── Every session is full. ──
const FullNotice = () => (
    <Notice eyebrow={FULL_COPY.eyebrow} title={FULL_COPY.title}>
        <p className="text-white/75 text-[15px] font-medium leading-relaxed mb-5">{FULL_COPY.body}</p>
        <p className="text-white/55 text-sm font-medium leading-relaxed">
            Questions? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
        </p>
    </Notice>
);

// ── The session choice. Required; only sessions taking bookings can be chosen. ──
const SessionChoice = ({ value, onChoose, error }) => (
    <div id="sj-session" className="mb-8">
        <p id="sj-session-label" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2 text-left">
            Which session? <span className="text-rr-pink">*</span>
        </p>
        <div role="radiogroup" aria-labelledby="sj-session-label" className="grid sm:grid-cols-2 gap-3">
            {SESSION_VIEW.map((s) => {
                const selectable = s.state === 'open';
                const picked = value === s.key;
                return (
                    <button
                        key={s.key}
                        type="button"
                        role="radio"
                        aria-checked={picked}
                        aria-disabled={!selectable}
                        disabled={!selectable}
                        onClick={() => selectable && onChoose(s.key)}
                        className={`w-full flex items-start gap-3 text-left rounded-xl border px-4 py-3.5 transition-colors ${picked
                            ? 'bg-rr-pink/15 border-rr-pink'
                            : selectable
                                ? `bg-white/5 ${error ? 'border-rr-pink' : 'border-white/15'} hover:border-rr-pink/60`
                                : 'bg-white/[0.03] border-white/10 cursor-not-allowed opacity-60'}`}
                    >
                        <span className={`mt-1 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${picked ? 'border-rr-pink' : 'border-white/35'}`}>
                            {picked && <span className="w-2 h-2 rounded-full bg-rr-pink" />}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-white font-black uppercase text-sm tracking-wide">{s.centreName}</span>
                            <span className="block text-white/75 text-sm font-medium">{s.dayLabel}</span>
                            <span className="block text-white/75 text-sm font-medium whitespace-nowrap">{s.timeLabel}</span>
                            <span className="block text-white/45 text-xs font-medium mt-0.5">{s.venue}</span>
                            {!selectable && (
                                <span className="inline-block mt-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200/80">
                                    {STATE_BADGE[s.state]}
                                </span>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
        <FieldError msg={error} />
    </div>
);

const BookingForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(null); // { firstName, email, sessionKey } once saved
    const doneRef = useRef(null);

    // The long form collapses into a short card, so bring the card into view
    // rather than leaving the parent looking at the FAQ.
    useEffect(() => {
        if (done) doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [done]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));
    const ic = (key) => inputClass(errors, key);
    const chosen = getSession(form.session);
    const submitCopy = submitCopyFor(chosen);

    const validate = () => {
        const next = {};
        if (!chosen) next.session = 'Please choose a session';
        else if (chosen.state !== 'open') next.session = 'That session is not taking bookings. Please choose another.';
        if (!form.player_name.trim()) next.player_name = "Please enter the player's name";
        const ageMsg = ageError(form.player_age);
        if (ageMsg) next.player_age = ageMsg;
        if (!form.parent_name.trim()) next.parent_name = "Please enter the parent or guardian's name";
        if (!form.email.trim()) next.email = 'Please enter an email address';
        else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please enter a valid email address';
        if (!form.phone.trim()) next.phone = 'Please enter a mobile number';
        else if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'Please check the mobile number';
        if (!form.accept_terms) next.accept_terms = 'Please agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'Please agree to the Player Code of Conduct';
        if (!form.accept_parent_code) next.accept_parent_code = 'Please agree to the Parent/Guardian Code of Conduct';
        // Neither photo answer is checked here. Consent you cannot book without
        // is not consent, and saying no makes no difference to the place.
        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            document.getElementById(`sj-${Object.keys(next)[0]}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const firstName = form.player_name.trim().split(/\s+/)[0];
        const email = form.email.trim().toLowerCase();
        const s = chosen;

        // A filled honeypot means a script. Same success card, nothing written.
        if (isHoneypotTripped(form.company)) {
            setDone({ firstName, email, sessionKey: s.key });
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
            const { error } = await supabase.from(DB_TABLE).insert([
                fillAttribution({
                    // The slug records WHICH session this booking is for.
                    match_slug: s.payToBook ? s.dbSlug : s.requestSlug,
                    match_name: s.dbName,
                    player_name: form.player_name.trim(),
                    player_age: Number(form.player_age.trim()),
                    // Every player here is 8 to 16, so the contact of record is
                    // always the parent or guardian's.
                    parent_name: form.parent_name.trim(),
                    email,
                    phone: form.phone.trim(),
                    club: form.club.trim() || null,
                    notes: form.notes.trim() || null,
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    accept_royals_media: form.accept_royals_media,
                    // Nothing is owed until a place is confirmed, so a booking
                    // request carries no amount.
                    amount: s.payToBook ? s.price : null,
                    page_referrer: document.referrer || null,
                    ...collectUtm(),
                }, LEAD_ATTR_COLUMNS),
            ]);
            if (error) throw error;
            throttleRecord();
            trackLead({ program: 'Sid junior session', centre: s.key, value: s.payToBook ? s.price : undefined });
            setDone({ firstName, email, sessionKey: s.key });
        } catch (err) {
            console.error('Sid juniors booking error:', err);
            setErrors({
                form: `Something went wrong and nothing was saved. Please try again, or email ${CONTACT_EMAIL} and we will add the player by hand.`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Another player in the same family: keep the parent's details, clear the
    // player's (session included), and ask for the agreements again rather
    // than pre-ticking them.
    const addAnother = () => {
        setForm((f) => ({ ...f, ...EMPTY_PLAYER, ...EMPTY_CONSENTS, company: '' }));
        setErrors({});
        setDone(null);
        setTimeout(() => document.getElementById('sj-session-label')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    };

    const doneSession = done ? getSession(done.sessionKey) : null;
    const sessionLine = doneSession ? `${doneSession.centreName} on ${doneSession.dayLabel}, ${doneSession.timeLabel}` : '';

    return (
        <section className="py-20 px-5">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow={FORM_COPY.eyebrow}
                    title={FORM_COPY.title}
                    sub={done ? undefined : FORM_COPY.sub}
                />

                {done && doneSession?.payToBook && (
                    <motion.div
                        ref={doneRef}
                        initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-7 sm:p-10 text-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Details Received</h3>
                        <p className="text-white/75 text-[15px] font-medium leading-relaxed mb-6">
                            One more step: pay ${doneSession.price} to book {done.firstName}&apos;s place at {sessionLine}.
                            The place is not booked until the payment goes through.
                        </p>
                        {/* DO NOT add target="_blank". Same tab, on purpose (see top). */}
                        <a
                            // The parent's email goes into Stripe, so the payment matches the booking.
                            href={`${doneSession.paymentLink}?prefilled_email=${encodeURIComponent(done.email)}`}
                            onClick={() => trackCheckout({ program: 'Sid junior session', value: doneSession.price })}
                            data-cta="Pay now (Sid juniors)"
                            data-cta-target="stripe"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" /> Pay ${doneSession.price} Now
                        </a>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mt-5">
                            At checkout, use <span className="text-white/80">{done.email}</span> so we can
                            match the payment to this booking. Payments are processed securely by Stripe.
                        </p>
                    </motion.div>
                )}

                {done && !doneSession?.payToBook && (
                    <motion.div
                        ref={doneRef}
                        initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-7 sm:p-10"
                    >
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3 text-center">Booking Request Received</h3>
                        <p className="text-white/85 text-[15px] font-bold leading-relaxed mb-6 text-center">
                            Thanks, we have {done.firstName}&apos;s details for {sessionLine}.
                        </p>
                        <ul className="space-y-3.5">
                            {[
                                `No payment has been taken, and no place is held for ${done.firstName} yet.`,
                                `We will email you at ${done.email} to confirm the place and tell you how to pay.`,
                            ].map((line) => (
                                <li key={line} className="flex items-start gap-3">
                                    <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                    <span className="text-white/70 text-[15px] font-medium leading-relaxed">{line}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-7 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                            <button
                                type="button"
                                onClick={addAnother}
                                className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-full px-6 py-3 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" /> Book a place for another player
                            </button>
                            <p className="text-white/50 text-sm font-medium leading-relaxed text-center">
                                If that email address is wrong, or you have a question, email{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`} className={`inline-flex items-center gap-1 ${linkClass}`}>
                                    <Mail className="w-3.5 h-3.5" />{CONTACT_EMAIL}
                                </a>.
                            </p>
                        </div>
                    </motion.div>
                )}

                {!done && (
                    <motion.form
                        onSubmit={handleSubmit}
                        noValidate
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={fadeUp} custom={0}
                        className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9"
                    >
                        <Honeypot value={form.company} onChange={set('company')} />

                        <SessionChoice
                            value={form.session}
                            onChoose={(key) => {
                                setForm((f) => ({ ...f, session: key }));
                                if (errors.session) setErrors((er) => ({ ...er, session: undefined }));
                            }}
                            error={errors.session}
                        />

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">Player</p>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div id="sj-player_name">
                                <FieldLabel htmlFor="sj-in-player_name" required>Player Name</FieldLabel>
                                <input id="sj-in-player_name" type="text" autoComplete="off" maxLength={200}
                                    value={form.player_name} onChange={set('player_name')}
                                    placeholder="Full name" className={ic('player_name')} />
                                <FieldError msg={errors.player_name} />
                            </div>
                            <div id="sj-player_age">
                                <FieldLabel htmlFor="sj-in-player_age" required hint={`(${AGE_RANGE})`}>Player Age</FieldLabel>
                                <input id="sj-in-player_age" type="text" inputMode="numeric" maxLength={2}
                                    value={form.player_age} onChange={set('player_age')}
                                    placeholder="e.g. 12" className={ic('player_age')} />
                                <FieldError msg={errors.player_age} />
                            </div>
                        </div>
                        <div className="mb-4" id="sj-club">
                            <FieldLabel htmlFor="sj-in-club" hint="(optional)">Current Club</FieldLabel>
                            <input id="sj-in-club" type="text" maxLength={200}
                                value={form.club} onChange={set('club')}
                                placeholder="Club or association" className={ic('club')} />
                        </div>
                        <div className="mb-8" id="sj-notes">
                            <FieldLabel htmlFor="sj-in-notes" hint="(optional)">{NOTES_FIELD.label}</FieldLabel>
                            <p id="sj-notes-help" className="text-white/45 text-[13px] font-medium leading-relaxed mb-2.5">
                                {NOTES_FIELD.help}
                            </p>
                            <textarea id="sj-in-notes" rows={3} maxLength={1000} aria-describedby="sj-notes-help"
                                value={form.notes} onChange={set('notes')}
                                className={`${ic('notes')} resize-none`} />
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">Parent or Guardian</p>
                        <p className="text-white/50 text-[13px] font-medium leading-relaxed mb-5">
                            Every player at these sessions is under 18, so these are the details we use to
                            confirm the place and to tell you about any change to the session. At pick-up we
                            release the player only to the person named here.
                        </p>
                        <div className="mb-4" id="sj-parent_name">
                            <FieldLabel htmlFor="sj-in-parent_name" required>Parent / Guardian Name</FieldLabel>
                            <input id="sj-in-parent_name" type="text" autoComplete="name" maxLength={200}
                                value={form.parent_name} onChange={set('parent_name')}
                                placeholder="Full name" className={ic('parent_name')} />
                            <FieldError msg={errors.parent_name} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div id="sj-email">
                                <FieldLabel htmlFor="sj-in-email" required>Email</FieldLabel>
                                <input id="sj-in-email" type="email" autoComplete="email" maxLength={320}
                                    value={form.email} onChange={set('email')}
                                    placeholder="you@example.com" className={ic('email')} />
                                <FieldError msg={errors.email} />
                            </div>
                            <div id="sj-phone">
                                <FieldLabel htmlFor="sj-in-phone" required>Mobile</FieldLabel>
                                <input id="sj-in-phone" type="tel" autoComplete="tel" maxLength={50}
                                    value={form.phone} onChange={set('phone')}
                                    placeholder="04__ ___ ___" className={ic('phone')} />
                                <FieldError msg={errors.phone} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-4">
                                Agreements
                            </p>
                            <div id="sj-accept_terms">
                                <PSCheckbox checked={form.accept_terms} onToggle={() => toggle('accept_terms')} error={errors.accept_terms}>
                                    I have read and agree to the{' '}
                                    <a href="/terms-conditions" target="_blank" rel="noreferrer" className={linkClass}>Terms &amp; Conditions</a>{' '}and{' '}
                                    <a href="/privacy-policy" target="_blank" rel="noreferrer" className={linkClass}>Privacy Policy</a>, and confirm the information provided is accurate.
                                </PSCheckbox>
                            </div>
                            <div id="sj-accept_player_code">
                                <PSCheckbox checked={form.accept_player_code} onToggle={() => toggle('accept_player_code')} error={errors.accept_player_code}>
                                    I have read, understood, and agree to the{' '}
                                    <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Player Code of Conduct</a>.
                                </PSCheckbox>
                            </div>
                            <div id="sj-accept_parent_code">
                                <PSCheckbox checked={form.accept_parent_code} onToggle={() => toggle('accept_parent_code')} error={errors.accept_parent_code}>
                                    I am the player&apos;s parent or guardian. I have read, understood, and agree to the{' '}
                                    <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Parent/Guardian Code of Conduct</a>.
                                </PSCheckbox>
                            </div>
                        </div>

                        {/* Photo consent: two separate answers, both optional, both
                            unticked to start. Neither one can stop a booking. */}
                        <div className="pt-6 mt-4 border-t border-white/10">
                            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">
                                <Camera className="w-3.5 h-3.5" /> Photos &amp; Video <span className="text-white/40">(optional)</span>
                            </p>
                            <p className="text-white/55 text-[13px] font-medium leading-relaxed mb-4">
                                {PHOTO_CONSENT.intro}
                            </p>
                            <PSCheckbox checked={form.accept_social_media} onToggle={() => toggle('accept_social_media')}>
                                {PHOTO_CONSENT.rra}
                            </PSCheckbox>
                            <PSCheckbox checked={form.accept_royals_media} onToggle={() => toggle('accept_royals_media')}>
                                {PHOTO_CONSENT.royals}
                            </PSCheckbox>
                            <p className="text-white/45 text-[13px] font-medium leading-relaxed mt-2">
                                {PHOTO_CONSENT.after}
                            </p>
                        </div>

                        {errors.form && (
                            <p role="alert" className="text-rr-pink text-sm font-bold mt-6 text-center">{errors.form}</p>
                        )}
                        <button
                            type="submit"
                            data-cta="Submit Sid booking" data-cta-target="submit"
                            disabled={submitting}
                            className="w-full mt-7 inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-[13px] sm:text-sm rounded-full px-5 sm:px-8 py-4 transition-colors"
                        >
                            {submitting ? 'Sending…' : submitCopy.submit}
                            {!submitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                        <p className="text-white/40 text-xs font-medium text-center mt-4 leading-relaxed">
                            {submitCopy.footnote}
                        </p>
                    </motion.form>
                )}
            </div>
        </section>
    );
};

// The one thing #register-pay renders.
const SidJuniorsForm = () => {
    if (PAGE_STATE === 'closed') return <ClosedNotice />;
    if (PAGE_STATE === 'full') return <FullNotice />;
    return <BookingForm />;
};

export default SidJuniorsForm;
