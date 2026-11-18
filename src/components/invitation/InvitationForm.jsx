import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';
import { TABLE, EXPERIENCE, GENDERS, EMPTY_FORM, emptyPlayer, validate, buildRows } from './invitationRules';

// The invitation-list form. Saves one row per player to
// public.invitation_list_registrations (campaign = the campaign's slug).
// No payment, and a saved row is NOT a place: the page says so twice.

const inputCls =
    'w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-rr-dark placeholder-slate-400 focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 transition-colors';
const labelCls = 'block text-xs font-bold text-rr-charcoal uppercase tracking-widest mb-2';

const Field = ({ label, required = true, error, hint, id, children }) => (
    <div id={id ? `field-${id}` : undefined}>
        <label className={labelCls}>
            {label} {required ? <span className="text-rr-pink">*</span> : <span className="text-slate-400 normal-case tracking-normal font-medium">(optional)</span>}
        </label>
        {children}
        {hint && !error && <p className="text-xs text-slate-500 font-medium mt-1.5">{hint}</p>}
        {error && <p className="text-red-600 text-sm font-semibold mt-1.5" role="alert">{error}</p>}
    </div>
);

// Big tap targets instead of a dropdown: most visitors are on a phone.
const Choice = ({ options, value, onChange, name, cols = 'grid-cols-1 sm:grid-cols-2' }) => (
    <div className={`grid ${cols} gap-3`} role="radiogroup">
        {options.map((o) => {
            const on = value === o.value;
            return (
                <button
                    type="button"
                    key={o.value}
                    role="radio"
                    aria-checked={on}
                    data-choice={`${name}-${o.value}`}
                    onClick={() => onChange(o.value)}
                    className={`text-left rounded-xl border-2 px-4 py-3.5 font-bold transition-colors ${on ? 'border-rr-pink bg-pink-50 text-rr-dark' : 'border-slate-300 bg-white text-rr-charcoal hover:border-rr-pink'}`}
                >
                    {o.label}
                    {o.sub && <span className="block text-sm font-medium text-slate-500 mt-0.5">{o.sub}</span>}
                </button>
            );
        })}
    </div>
);

const Check = ({ checked, onChange, error, id, children }) => (
    <div id={id ? `field-${id}` : undefined}>
        <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span aria-hidden="true" className={`mt-0.5 w-6 h-6 rounded shrink-0 border-2 flex items-center justify-center transition-colors ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-400 bg-white group-hover:border-rr-pink'}`}>
                {checked && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
            </span>
            <span className="text-rr-charcoal text-[15px] font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-red-600 text-sm font-semibold mt-1.5 ml-9" role="alert">{error}</p>}
    </div>
);

const SectionTitle = ({ n, children }) => (
    <h3 className="flex items-center gap-3 text-base font-black text-rr-dark uppercase tracking-widest mb-5">
        <span className="w-7 h-7 rounded-full bg-rr-pink text-white text-sm flex items-center justify-center shrink-0" aria-hidden="true">{n}</span>
        {children}
    </h3>
);

const YES_NO = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

const attribution = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
        utm_content: p.get('utm_content') || null,
        page_referrer: document.referrer || null,
    };
};

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));

const Panel = ({ children }) => (
    <section id="register" className="bg-white py-16 md:py-24 scroll-mt-20 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-6">{children}</div>
    </section>
);

const InvitationForm = ({ campaign }) => {
    const cfg = campaign.form;
    const [form, setForm] = useState(EMPTY_FORM);
    const [players, setPlayers] = useState([emptyPlayer()]);
    const [tried, setTried] = useState(false);   // errors show after the first attempt, then clear as each answer is fixed
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sendError, setSendError] = useState('');

    const self = form.attendee_type === 'self';
    const errors = tried ? validate(form, players) : {};
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
    const setPlayer = (i, k) => (e) => setPlayers((ps) => ps.map((p, j) => (j === i ? { ...p, [k]: e?.target ? e.target.value : e } : p)));

    const chooseAttendee = (v) => {
        setForm((f) => ({ ...f, attendee_type: v }));
        if (v === 'self') setPlayers((ps) => ps.slice(0, 1)); // "me" is one person
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const problems = validate(form, players);
        setTried(true);
        setSendError('');
        const first = Object.keys(problems)[0];
        if (first) {
            document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setSubmitting(true);
        const rows = buildRows(campaign.slug, form, players, { submissionId: newId(), attribution: attribution() });
        const { error } = await supabase.from(TABLE).insert(rows);
        setSubmitting(false);
        if (error) {
            setSendError('Sorry, that did not send. Please try again. If it keeps happening, text us using the button in the corner.');
            return;
        }
        // Meta Pixel: campaign name only. Never a name, email, phone or age.
        try {
            if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: campaign.pixelName, content_category: 'Invitation list' });
        } catch { /* never block the family on tracking */ }
        setSubmitted(true);
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!campaign.open) {
        return (
            <Panel>
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">{campaign.closed.title}</h2>
                    <p className="text-lg text-rr-charcoal font-medium mb-8">{campaign.closed.body}</p>
                    <Link to="/" className="inline-block bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-full transition-colors">Explore the Academy</Link>
                </div>
            </Panel>
        );
    }

    if (submitted) {
        return (
            <Panel>
                <div className="text-center" data-invitation-success>
                    <span className="mx-auto w-16 h-16 rounded-full bg-rr-pink flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">{campaign.success.title}</h2>
                    <p className="text-lg text-rr-charcoal font-medium leading-relaxed mb-5">{campaign.success.body}</p>
                    <p className="border-l-4 border-rr-pink bg-pink-50 rounded-r-2xl p-5 text-left text-rr-charcoal font-medium leading-relaxed mb-8">{campaign.success.reminder}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {campaign.success.links.map((l, i) => (
                            <Link key={l.to} to={l.to} className={`font-black uppercase tracking-widest text-sm px-7 py-3.5 rounded-full transition-colors ${i === 0 ? 'bg-rr-pink hover:bg-rr-light-pink text-white' : 'border-2 border-rr-blue text-rr-blue hover:bg-rr-blue hover:text-white'}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </Panel>
        );
    }

    const canAddPlayer = form.attendee_type === 'child' && players.length < cfg.maxPlayers;
    const who = self ? 'Your' : 'Player’s';

    return (
        <Panel>
            <div className="text-center mb-10">
                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{cfg.eyebrow}</p>
                <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-4">{cfg.title}</h2>
                <p className="text-lg text-rr-charcoal font-medium">{cfg.intro}</p>
                {campaign.how.dates && <p className="text-[15px] text-rr-charcoal font-semibold mt-3">Dates are not set yet. We will send your session time with your invitation.</p>}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-12">
                {/* 1. WHO WILL ATTEND */}
                <div>
                    <SectionTitle n="1">Who will attend?</SectionTitle>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mb-4">
                        This is a coaching session. Tell us about the player who will train on the day.
                    </p>
                    <div id="field-attendee_type">
                        <Choice
                            name="attendee"
                            value={form.attendee_type}
                            onChange={chooseAttendee}
                            options={[
                                { value: 'child', label: 'My child', sub: 'I am the parent or guardian' },
                                { value: 'self', label: 'Me', sub: 'I am the player, aged 18 or over' },
                            ]}
                        />
                        {errors.attendee_type && <p className="text-red-600 text-sm font-semibold mt-1.5" role="alert">{errors.attendee_type}</p>}
                    </div>

                    {form.attendee_type && players.map((p, i) => (
                        <div key={i} className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5" data-player={i}>
                            {players.length > 1 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-rr-dark uppercase tracking-widest">Player {i + 1}</p>
                                    {i > 0 && (
                                        <button type="button" onClick={() => setPlayers((ps) => ps.filter((_, j) => j !== i))} className="text-sm font-bold text-rr-blue underline underline-offset-4">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label={`${who} first name`} id={`p${i}_first_name`} error={errors[`p${i}_first_name`]}>
                                    <input className={inputCls} value={p.first_name} onChange={setPlayer(i, 'first_name')} autoComplete={self ? 'given-name' : 'off'} />
                                </Field>
                                <Field label={`${who} last name`} id={`p${i}_last_name`} error={errors[`p${i}_last_name`]}>
                                    <input className={inputCls} value={p.last_name} onChange={setPlayer(i, 'last_name')} autoComplete={self ? 'family-name' : 'off'} />
                                </Field>
                            </div>
                            <div id={`field-p${i}_dob`}>
                                <DateOfBirthInput value={p.dob} onChange={setPlayer(i, 'dob')} required />
                                {errors[`p${i}_dob`] && <p className="text-red-600 text-sm font-semibold mt-1.5" role="alert">{errors[`p${i}_dob`]}</p>}
                            </div>
                            <Field label="Gender" required={false} id={`p${i}_gender`}>
                                <select className={inputCls} value={p.gender} onChange={setPlayer(i, 'gender')}>
                                    <option value="">Select…</option>
                                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </Field>
                            <Field label={self ? 'How much cricket have you played?' : 'How much cricket have they played?'} id={`p${i}_experience`} error={errors[`p${i}_experience`]}>
                                <select className={inputCls} value={p.experience} onChange={setPlayer(i, 'experience')} data-experience={i}>
                                    <option value="">Select…</option>
                                    {EXPERIENCE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                            {(p.experience === 'club' || p.experience === 'representative') && (
                                <Field label="Club name" required={false} id={`p${i}_club_name`}>
                                    <input className={inputCls} value={p.club_name} onChange={setPlayer(i, 'club_name')} />
                                </Field>
                            )}
                        </div>
                    ))}

                    {canAddPlayer && (
                        <button type="button" onClick={() => setPlayers((ps) => [...ps, emptyPlayer()])} className="mt-4 text-sm font-bold text-rr-blue underline underline-offset-4" data-add-player>
                            + Add another child
                        </button>
                    )}
                </div>

                {/* 2. CONTACT */}
                <div>
                    <SectionTitle n="2">How do we contact you?</SectionTitle>
                    <div className="space-y-5">
                        {!self && (
                            <Field label="Your name (parent or guardian)" id="contact_name" error={errors.contact_name}>
                                <input className={inputCls} value={form.contact_name} onChange={set('contact_name')} autoComplete="name" />
                            </Field>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Email" id="email" error={errors.email}>
                                <input className={inputCls} type="email" inputMode="email" value={form.email} onChange={set('email')} autoComplete="email" />
                            </Field>
                            <Field label="Mobile phone" id="phone" error={errors.phone}>
                                <input className={inputCls} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                            </Field>
                        </div>
                    </div>
                </div>

                {/* 3. WHERE YOU LIVE */}
                <div>
                    <SectionTitle n="3">Where do you live?</SectionTitle>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mb-4">
                        Invitations depend on how close you live to {cfg.venueShort}.
                    </p>
                    <div className="space-y-5">
                        <Field label="Do you live in Australia?" id="in_australia" error={errors.in_australia}>
                            <Choice name="aus" cols="grid-cols-2" options={YES_NO} value={form.in_australia} onChange={set('in_australia')} />
                        </Field>

                        {form.in_australia === 'yes' && (
                            <>
                                <Field label="Do you live in Melbourne?" id="in_melbourne" error={errors.in_melbourne}>
                                    <Choice name="melb" cols="grid-cols-2" options={YES_NO} value={form.in_melbourne} onChange={set('in_melbourne')} />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_10rem] gap-5">
                                    <Field label="Suburb" id="suburb" error={errors.suburb}>
                                        <input className={inputCls} value={form.suburb} onChange={set('suburb')} autoComplete="address-level2" />
                                    </Field>
                                    <Field label="Postcode" id="postcode" error={errors.postcode}>
                                        <input className={inputCls} value={form.postcode} onChange={set('postcode')} inputMode="numeric" maxLength={4} autoComplete="postal-code" />
                                    </Field>
                                </div>
                                <Field label="Street address" required={false} id="street_address">
                                    <input className={inputCls} value={form.street_address} onChange={set('street_address')} autoComplete="street-address" />
                                </Field>
                            </>
                        )}

                        {form.in_australia === 'no' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Country" id="country" error={errors.country}>
                                    <input className={inputCls} value={form.country} onChange={set('country')} autoComplete="country-name" />
                                </Field>
                                <Field label="Town or city" id="suburb" error={errors.suburb}>
                                    <input className={inputCls} value={form.suburb} onChange={set('suburb')} autoComplete="address-level2" />
                                </Field>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. CONFIRM */}
                <div>
                    <SectionTitle n="4">Confirm and register</SectionTitle>
                    <div className="space-y-5">
                        <Field label="Anything we should know?" required={false} id="notes">
                            <textarea className={`${inputCls} min-h-[96px]`} value={form.notes} onChange={set('notes')} />
                        </Field>

                        <div className="border-l-4 border-rr-pink bg-pink-50 rounded-r-2xl p-5">
                            <p className="font-black text-rr-dark uppercase tracking-wide text-sm mb-1">{campaign.how.notice.title}</p>
                            <p className="text-rr-charcoal text-[15px] font-medium leading-relaxed">{campaign.how.notice.body}</p>
                        </div>

                        <Check id="accept_terms" checked={form.accept_terms} onChange={set('accept_terms')} error={errors.accept_terms}>
                            I understand that registering does not guarantee an invitation. The information I have given is correct, and I agree to the{' '}
                            <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-pink underline">Terms &amp; Conditions</a> and{' '}
                            <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-pink underline">Privacy Policy</a>.
                            {!self && ' I am the parent or guardian of the player.'} <span className="text-rr-pink">*</span>
                        </Check>
                        <Check checked={form.marketing_opt_in} onChange={set('marketing_opt_in')}>
                            Send me news about Rajasthan Royals Academy Melbourne programs and events. (optional)
                        </Check>

                        {sendError && <p className="text-red-600 font-semibold" role="alert">{sendError}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest text-base px-8 py-5 rounded-full transition-colors duration-300"
                        >
                            {submitting ? 'Sending…' : cfg.submit}
                        </button>
                        <p className="text-center text-sm text-slate-500 font-medium">No payment to register.</p>
                    </div>
                </div>
            </form>
        </Panel>
    );
};

export default InvitationForm;
