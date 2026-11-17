import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { HONEYPOT_FIELD, isHoneypotTripped } from '../../lib/security/bot.js';
import GovernanceConsents from '../shared/GovernanceConsents';
import TrainingShirtStep from '../shared/TrainingShirtStep';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';
import { EMPTY_SHIRT, shirtError, shirtTag, needsShirt, shirtCheckoutUrl, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import {
    CENTRES, FORMATS, PACKAGES, FOCUS_OPTIONS, LEVEL_OPTIONS, MATCH_ME, DB_TABLE, PROGRAM_NAME, SUCCESS_ROUTE,
    AVAILABILITY_NOTE, coachesAt, coachOf, tierOf, centreOf, perSession, packageTotal, money, paymentLinksFor,
} from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel, slotKey } from './useCoachAvailability';

// Booking form for Royals Private Coaching (premium). Andy, 17 Nov 2026:
//   centre → coach → 1-to-1 or 1-to-2 (same price) → 1, 3 or 5 sessions → times from the
//   coach's live availability → player, shirt, contact, governance → summary → book.
// Payment: when the coach's tier has a Stripe Payment Link pair for the package
// (PAYMENT_LINKS in premiumCoachingData.js) the family goes straight to Stripe, with the
// training shirt locked in for "No" (CLAUDE.md). Until then the row is a booking request
// and staff send the payment link. Either way each session is subject to lane
// availability and confirmation.
//
// The id is made here and the insert never chains .select(): the public role can insert
// but not read the table back.

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
const Err = ({ children }) => (children ? <p className="text-red-500 text-xs font-medium mt-1">{children}</p> : null);

const Field = ({ id, label, error, optional, children, hint }) => (
    <div id={`f-${id}`}>
        <label htmlFor={id} className={labelCls}>{label}{!optional && ' *'}{optional && <span className="text-slate-400 normal-case tracking-normal font-medium"> (optional)</span>}</label>
        {children}
        {hint && <p className="text-slate-500 text-xs font-medium mt-1">{hint}</p>}
        <Err>{error}</Err>
    </div>
);

const Choice = ({ on, onClick, title, sub, bad, disabled }) => (
    <button type="button" onClick={onClick} aria-pressed={on} disabled={disabled}
        className={`text-left rounded-xl border-2 px-4 py-3 transition-colors disabled:opacity-40 ${on ? 'border-rr-pink bg-rr-pink/5' : bad ? 'border-red-300' : 'border-slate-200 hover:border-rr-pink/50'}`}>
        <span className="block font-black text-rr-dark text-sm">{title}</span>
        {sub && <span className="block text-xs text-rr-charcoal font-medium mt-1 leading-snug">{sub}</span>}
    </button>
);

const EMPTY = {
    centre: '', coach: '', format: '', partner: '', sessions: 0, preferred_times: '',
    player_first_name: '', player_last_name: '', player_age: '', focus: '', level: '', club: '',
    parent_name: '', email: '', phone: '', suburb: '', notes: '',
    [HONEYPOT_FIELD]: '',
};

const PremiumCoachingForm = ({ initialCentre = '', initialCoach = '' }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...EMPTY, centre: initialCentre, coach: initialCoach });
    const [picked, setPicked] = useState([]); // [{date,start,end,centre}]
    const [shirt, setShirt] = useState(EMPTY_SHIRT);
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState('');
    const { slots } = useAllAvailability();

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const ev = (k) => (e) => set(k, e.target.value);

    const age = parseInt(form.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    const coaches = coachesAt(form.centre);
    const coach = form.coach && form.coach !== MATCH_ME ? coachOf(form.coach) : null;
    const tier = coach?.tier || null;
    const priced = !!(coach?.bookable);
    const coachSlug = coach?.slug || '';
    const nights = coachSlug ? groupByNight(slots, coachSlug, form.centre) : [];
    const per = priced && form.sessions ? perSession(tier, form.sessions) : null;
    const total = priced && form.sessions ? packageTotal(tier, form.sessions) : null;
    const links = priced && form.sessions ? paymentLinksFor(tier, form.sessions) : null;
    const maxPicks = form.sessions || 0;

    const chooseCentre = (slug) => { setForm((f) => ({ ...f, centre: slug, coach: '' })); setPicked([]); };
    const chooseCoach = (slug) => { setForm((f) => ({ ...f, coach: slug, sessions: coachOf(slug)?.bookable ? f.sessions : 0 })); setPicked([]); };
    const chooseSessions = (n) => { set('sessions', n); setPicked((p) => p.slice(0, n)); };
    const togglePick = (s) => setPicked((p) => {
        const k = slotKey(s);
        if (p.some((x) => slotKey(x) === k)) return p.filter((x) => slotKey(x) !== k);
        if (p.length >= maxPicks) return p;
        return [...p, s];
    });

    const validate = () => {
        const e = {};
        if (!form.centre) e.centre = 'Please choose a centre.';
        if (!form.coach) e.coach = 'Please choose a coach, or “Match me with a coach”.';
        if (!form.format) e.format = 'Please choose 1-to-1 or 1-to-2.';
        if (form.format === '1-2' && !form.partner.trim()) e.partner = 'Please tell us who is training with your player.';
        if (priced && !form.sessions) e.sessions = 'Please choose 1, 3 or 5 sessions.';
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
            const el = document.getElementById(first.startsWith('accept_') ? `consent-${first}` : `f-${first}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        if (isHoneypotTripped(form[HONEYPOT_FIELD])) { navigate(SUCCESS_ROUTE); return; }

        setSubmitting(true);
        const id = newId();
        const row = {
            id,
            centre: form.centre,
            format: form.format,
            coach_slug: coach?.slug || null,
            coach_tier: tier,
            other_players: form.format === '1-2' ? form.partner.trim() : null,
            package_sessions: form.sessions || null,
            price_per_session: per,
            package_total: total,
            selected_slots: picked.length ? picked : null,
            payment_status: links ? 'sent_to_stripe' : 'request',
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
            availability: form.preferred_times.trim() || null,
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
            setFailed('Something went wrong sending your booking. Please try again, or text us with the chat button.');
            return;
        }

        try {
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', { content_name: PROGRAM_NAME, content_category: form.centre }, { eventID: id });
                if (links) window.fbq('track', 'InitiateCheckout', { content_name: PROGRAM_NAME, value: total, currency: 'AUD' });
            }
        } catch { /* never blocks the booking */ }

        const summary = {
            first: row.player_first_name, centre: form.centre, format: form.format,
            coachName: coach?.name || null, tierName: tier ? tierOf(tier)?.name : null,
            sessions: form.sessions, per, total, picked, shirt,
        };
        try { sessionStorage.setItem('premium_pc_booking', JSON.stringify(summary)); } catch { /* optional */ }

        if (links) {
            window.location.assign(shirtCheckoutUrl(links, shirt, { id, email: row.email }));
            return;
        }
        navigate(SUCCESS_ROUTE, { state: summary });
    };

    const centre = centreOf(form.centre);

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-3">Royals Private Coaching</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-4">Book Your Coach</h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed max-w-xl mx-auto">About three minutes. {AVAILABILITY_NOTE}</p>
                </div>

                <form onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 md:p-10 space-y-8">
                    <input type="text" name={HONEYPOT_FIELD} value={form[HONEYPOT_FIELD]} onChange={ev(HONEYPOT_FIELD)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                    {/* 1. Centre */}
                    <div id="f-centre">
                        <p className={labelCls}>1. Centre *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {CENTRES.map((c) => (
                                <Choice key={c.slug} on={form.centre === c.slug} bad={errors.centre} onClick={() => chooseCentre(c.slug)}
                                    title={c.suburb} sub={c.badge ? `${c.name} · ${c.badge}` : c.name} />
                            ))}
                        </div>
                        <Err>{errors.centre}</Err>
                    </div>

                    {/* 2. Coach */}
                    <div id="f-coach">
                        <p className={labelCls}>2. Coach *</p>
                        {!form.centre && <p className="text-sm text-slate-500 font-medium">Choose a centre first.</p>}
                        {form.centre && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {coaches.map((c) => (
                                    <Choice key={c.slug} on={form.coach === c.slug} bad={errors.coach} onClick={() => chooseCoach(c.slug)}
                                        title={c.name}
                                        sub={[tierOf(c.tier)?.name || 'Royals Coach', c.bookable ? `${money(perSession(c.tier, 1))} a session` : 'price coming soon'].join(' · ')} />
                                ))}
                                <Choice on={form.coach === MATCH_ME} bad={errors.coach} onClick={() => chooseCoach(MATCH_ME)}
                                    title="Match me with a coach" sub="We choose the best fit and confirm the price with you." />
                            </div>
                        )}
                        <Err>{errors.coach}</Err>
                    </div>

                    {/* 3. Format */}
                    <div id="f-format">
                        <p className={labelCls}>3. 1-to-1 or 1-to-2 *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FORMATS.map((f) => (
                                <Choice key={f.value} on={form.format === f.value} bad={errors.format} onClick={() => set('format', f.value)}
                                    title={`${f.label}${f.recommended ? ' · we recommend' : ''}`} sub={f.value === '1-2' ? 'Same price, shared by the two families.' : f.title} />
                            ))}
                        </div>
                        <Err>{errors.format}</Err>
                        {form.format === '1-2' && (
                            <div className="mt-4">
                                <Field id="partner" label="Training partner" error={errors.partner} hint="Name and age. We send their family a short form before the first session.">
                                    <input id="partner" value={form.partner} onChange={ev('partner')} className={input(errors.partner)} placeholder="e.g. Sam Lee (12)" />
                                </Field>
                            </div>
                        )}
                    </div>

                    {/* 4. Package */}
                    {priced && (
                        <div id="f-sessions">
                            <p className={labelCls}>4. How many sessions? *</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {PACKAGES.map((p) => {
                                    const pp = perSession(tier, p.sessions);
                                    const tt = packageTotal(tier, p.sessions);
                                    return (
                                        <Choice key={p.sessions} on={form.sessions === p.sessions} bad={errors.sessions} onClick={() => chooseSessions(p.sessions)}
                                            title={`${p.label} · ${money(tt)}`}
                                            sub={`${money(pp)} a session incl. GST${form.format === '1-2' ? ` · ${money(tt / 2)} each family` : ''}`} />
                                    );
                                })}
                            </div>
                            <Err>{errors.sessions}</Err>
                        </div>
                    )}

                    {/* 5. Times */}
                    {coach && (
                        <div id="f-times">
                            <p className={labelCls}>{priced ? '5' : '4'}. Choose your times</p>
                            {nights.length > 0 ? (
                                <>
                                    <p className="text-xs text-rr-charcoal font-medium mb-3">
                                        {coach.name.split(' ')[0]}’s open times at {centre?.suburb}.{' '}
                                        {maxPicks ? `Pick up to ${maxPicks} (${picked.length} chosen).` : 'Choose your number of sessions first.'}
                                    </p>
                                    <div className="space-y-3">
                                        {nights.map((n) => (
                                            <div key={n.date}>
                                                <p className="text-xs font-black text-rr-dark uppercase tracking-wide mb-1.5">{nightLabel(n.date)}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {n.slots.map((s) => {
                                                        const on = picked.some((x) => slotKey(x) === slotKey(s));
                                                        const full = !on && (picked.length >= maxPicks);
                                                        return (
                                                            <button type="button" key={slotKey(s)} onClick={() => togglePick(s)} disabled={full} aria-pressed={on}
                                                                className={`px-3 py-2 rounded-lg border-2 text-xs font-black transition-colors disabled:opacity-40 ${on ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 text-rr-dark hover:border-rr-pink/50'}`}>
                                                                {timeLabel(s.start)}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-rr-charcoal font-medium mb-3">{coach.name.split(' ')[0]}’s times for the coming weeks aren’t published yet. Tell us what suits you and we will confirm.</p>
                            )}
                            <div className="mt-4">
                                <Field id="preferred_times" label={nights.length ? 'Other days or times that suit' : 'Days and times that suit'} optional hint="e.g. Tuesday or Thursday after 5pm">
                                    <input id="preferred_times" value={form.preferred_times} onChange={ev('preferred_times')} className={input(false)} />
                                </Field>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-2">{AVAILABILITY_NOTE}</p>
                        </div>
                    )}

                    {/* Player */}
                    <div className="pt-6 border-t border-slate-100 space-y-5">
                        <p className={labelCls}>The player</p>
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

                    {/* Contact */}
                    <div className="pt-6 border-t border-slate-100 space-y-5">
                        <p className={labelCls}>{adult ? 'Your details' : 'Parent or guardian'}</p>
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
                        <Field id="notes" label="Anything the coach should know" optional hint="Goals, injuries, medical information">
                            <textarea id="notes" rows={3} value={form.notes} onChange={ev('notes')} className={input(false)} />
                        </Field>
                    </div>

                    <GovernanceConsents value={consents} onChange={setConsents} errors={errors} adult={adult} />

                    {/* Summary before booking (CLAUDE.md: the shirt shows here) */}
                    {(coach || form.coach === MATCH_ME) && (
                        <div className="rounded-2xl bg-rr-dark text-white p-5 sm:p-6" data-summary>
                            <p className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink mb-3">Your booking</p>
                            <dl className="space-y-1.5 text-sm">
                                <div className="flex justify-between gap-4"><dt className="text-white/70">Coach</dt><dd className="font-bold text-right">{coach ? `${coach.name} · ${tierOf(tier)?.name || 'Royals Coach'}` : 'We will match you'}</dd></div>
                                {centre && <div className="flex justify-between gap-4"><dt className="text-white/70">Centre</dt><dd className="font-bold text-right">{centre.suburb}</dd></div>}
                                {form.format && <div className="flex justify-between gap-4"><dt className="text-white/70">Format</dt><dd className="font-bold text-right">{form.format === '1-2' ? '1-to-2, shared' : '1-to-1'}</dd></div>}
                                {form.sessions > 0 && <div className="flex justify-between gap-4"><dt className="text-white/70">Sessions</dt><dd className="font-bold text-right">{form.sessions} × {money(per)}</dd></div>}
                                {picked.length > 0 && <div className="flex justify-between gap-4"><dt className="text-white/70">Times chosen</dt><dd className="font-bold text-right">{picked.map((p) => `${nightLabel(p.date)} ${timeLabel(p.start)}`).join(', ')}</dd></div>}
                                {needsShirt(shirt) && shirt.size && <div className="flex justify-between gap-4"><dt className="text-white/70">Training shirt</dt><dd className="font-bold text-right">Size {String(shirt.size).split(' ')[0]} · {money(TRAINING_SHIRT.price)}</dd></div>}
                                {total != null && (
                                    <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-white/15 text-base">
                                        <dt className="font-black">Total incl. GST</dt>
                                        <dd className="font-black text-right">{money(total + (needsShirt(shirt) ? TRAINING_SHIRT.price : 0))}{form.format === '1-2' && <span className="block text-xs font-semibold text-rr-light-pink">Sessions shared: {money(total / 2)} each family</span>}</dd>
                                    </div>
                                )}
                            </dl>
                            {!priced && coach && <p className="text-xs text-white/70 mt-3">Price coming soon for this coach. We will confirm it with you before anything is charged.</p>}
                        </div>
                    )}

                    {failed && <p className="text-red-600 text-sm font-semibold text-center">{failed}</p>}
                    {Object.keys(errors).length > 0 && !failed && (
                        <p className="text-red-600 text-sm font-semibold text-center">Please check the {Object.keys(errors).length === 1 ? 'item' : `${Object.keys(errors).length} items`} marked in red.</p>
                    )}

                    <button type="submit" disabled={submitting}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                        {submitting ? 'Sending…' : links ? 'Continue to Payment' : 'Book Your Coach'}
                    </button>
                    <p className="text-center text-xs text-slate-500 font-medium">
                        {links ? 'You will pay securely with Stripe.' : 'Nothing is charged today. We confirm your sessions, then send your payment link.'}
                    </p>
                </form>
            </div>
        </section>
    );
};

export default PremiumCoachingForm;
