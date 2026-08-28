import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
    fadeUp, scrollTo, SectionHeading, Label, FieldError, Chevron,
    inputClass, selectClass,
} from './shared';
import {
    ACTIVE_CENTRES, PLAYING_ROLES, TRIAL_PRICE,
    getTrialSessions, getMaxTrialSessions,
} from './data';

const PSCheckbox = ({ checked, onToggle, error, children }) => (
    <div className="mb-3.5">
        <label className="flex items-start gap-3 cursor-pointer group">
            <button
                type="button"
                onClick={onToggle}
                aria-pressed={checked}
                className={`mt-0.5 w-5 h-5 rounded-md shrink-0 border flex items-center justify-center transition-colors ${checked ? 'bg-rr-pink border-rr-pink' : 'border-white/30 bg-white/5 group-hover:border-rr-pink/60'}`}
            >
                {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </button>
            <span className="text-white/70 text-[13px] font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-rr-pink text-xs font-medium mt-1 ml-8">{error}</p>}
    </div>
);

const RegistrationForm = ({ selectedCentre, onRequestPayment }) => {
    const [form, setForm] = useState({
        player_name: '',
        player_age: '',
        parent_name: '',
        email: '',
        phone: '',
        club: '',
        preferred_centre: '',
        signup_type: 'trial',   // form is trial-only; kept for the payment modal
        playing_role: '',
        trial_session_dates: [],
        accept_terms: false,
        accept_player_code: false,
        accept_parent_code: false,
        accept_social_media: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedResult, setSubmittedResult] = useState(null);

    // Trial card "Register for Trial" pre-selects that centre.
    useEffect(() => {
        if (selectedCentre) {
            setForm((f) => ({ ...f, preferred_centre: selectedCentre }));
        }
    }, [selectedCentre]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

    const isTrial = true; // trial-only registration
    const trialSessions = getTrialSessions(form.preferred_centre);
    const maxSessions = getMaxTrialSessions(form.preferred_centre);
    const showSessionPicker = isTrial && trialSessions.length > 0;

    // Session ids belong to a centre and only apply to trials.
    useEffect(() => {
        setForm((f) => ({ ...f, trial_session_dates: [] }));
    }, [form.preferred_centre]);

    const toggleSession = (id) =>
        setForm((f) => {
            const picked = f.trial_session_dates;
            if (picked.includes(id)) {
                return { ...f, trial_session_dates: picked.filter((x) => x !== id) };
            }
            if (picked.length >= maxSessions) return f; // cap enforced here
            return { ...f, trial_session_dates: [...picked, id] };
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required';
        if (!form.player_age.trim()) {
            next.player_age = 'Player age is required';
        } else {
            const age = Number(form.player_age.trim());
            if (!Number.isInteger(age) || age < 4 || age > 60) {
                next.player_age = 'Please enter an age in years (e.g. 16)';
            }
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'A valid email is required';
        if (!form.phone.trim()) next.phone = 'Phone number is required';
        if (!form.preferred_centre) next.preferred_centre = 'Please choose a centre';
        if (!form.playing_role) next.playing_role = 'Please choose a playing role';
        if (showSessionPicker && form.trial_session_dates.length === 0) {
            next.trial_session_dates = 'Please choose at least one trial session';
        }
        if (!form.accept_terms) next.accept_terms = 'You must agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'You must agree to the Player Code of Conduct';
        if (!form.accept_parent_code) next.accept_parent_code = 'You must agree to the Parent/Guardian Code of Conduct';
        if (!form.accept_social_media) next.accept_social_media = 'Please confirm your social media consent';
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const utm = {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
                if (params.get(k)) utm[k] = params.get(k);
            });
            const { error } = await supabase.from('performance_squad_leads').insert([
                {
                    player_name: form.player_name.trim(),
                    player_age: form.player_age.trim(),
                    parent_name: form.parent_name.trim() || null,
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    club: form.club.trim() || null,
                    preferred_centre: form.preferred_centre,
                    entry_type: form.signup_type,
                    playing_role: form.playing_role,
                    trial_sessions: showSessionPicker ? form.trial_session_dates.length : null,
                    trial_session_dates: showSessionPicker ? form.trial_session_dates : null,
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;

            const result = {
                centre: form.preferred_centre,
                signupType: form.signup_type,
                sessionIds: showSessionPicker ? form.trial_session_dates : [],
            };
            setSubmitted(true);
            setSubmittedResult(result);
            // Open the payment step immediately — registration and payment
            // are one flow, not two separate sections.
            onRequestPayment?.(result);
        } catch (err) {
            console.error('Performance Squads registration error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com' });
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
                    title="Register & Secure Your Trial Spot"
                    sub="Enter your details, choose your trial session(s), and pay — all in one step. Your trial spot isn't confirmed until payment is received."
                />
                {submitted ? (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Registration Received</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-6">
                            Thanks — we've got your details. Your place isn't confirmed until payment
                            is received, so finish up below if you haven't already.
                        </p>
                        {/* Safety net: reopens the payment step if the modal was dismissed. */}
                        <button
                            onClick={() => onRequestPayment?.(submittedResult)}
                            className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            Complete Payment <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>Player Name</Label>
                                <input type="text" value={form.player_name} onChange={set('player_name')} placeholder="Full name" className={ic('player_name')} />
                                <FieldError msg={errors.player_name} />
                            </div>
                            <div>
                                <Label required>Player Age <span className="normal-case font-medium text-white/40">(in years)</span></Label>
                                <input type="text" inputMode="numeric" value={form.player_age} onChange={set('player_age')} placeholder="e.g. 16 years old" className={ic('player_age')} />
                                <FieldError msg={errors.player_age} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label>Parent / Guardian Name <span className="normal-case font-medium text-white/40">(if player is under 18)</span></Label>
                            <input type="text" value={form.parent_name} onChange={set('parent_name')} placeholder="Parent or guardian full name" className={ic('parent_name')} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>Email</Label>
                                <input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={ic('email')} />
                                <FieldError msg={errors.email} />
                            </div>
                            <div>
                                <Label required>Phone</Label>
                                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" className={ic('phone')} />
                                <FieldError msg={errors.phone} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label>Current Club <span className="normal-case font-medium text-white/40">(optional)</span></Label>
                            <input type="text" value={form.club} onChange={set('club')} placeholder="Club / association" className={ic('club')} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="relative">
                                <Label required>Preferred Centre</Label>
                                <div className="relative">
                                    <select value={form.preferred_centre} onChange={set('preferred_centre')} className={sc('preferred_centre')}>
                                        <option value="" disabled>Choose a centre</option>
                                        {ACTIVE_CENTRES.map((c) => (
                                            <option key={c.slug} value={c.slug}>{c.name} — {c.venue}</option>
                                        ))}
                                    </select>
                                    <Chevron />
                                </div>
                                <FieldError msg={errors.preferred_centre} />
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
                        {showSessionPicker && (
                            <div className="mb-4">
                                <Label required>
                                    Which trial sessions will you attend?
                                    <span className="normal-case font-medium text-white/40">
                                        {' '}(choose up to {maxSessions})
                                    </span>
                                </Label>
                                <div className="space-y-2.5">
                                    {trialSessions.map((sess) => {
                                        const picked = form.trial_session_dates.includes(sess.id);
                                        const atCap = !picked && form.trial_session_dates.length >= maxSessions;
                                        return (
                                            <button
                                                type="button"
                                                key={sess.id}
                                                onClick={() => toggleSession(sess.id)}
                                                disabled={atCap}
                                                aria-pressed={picked}
                                                className={`w-full flex items-center gap-3 text-left rounded-xl px-4 py-3.5 border transition-colors ${picked
                                                    ? 'bg-rr-pink/15 border-rr-pink text-white'
                                                    : atCap
                                                        ? 'bg-white/[0.03] border-white/10 text-white/30 cursor-not-allowed'
                                                        : 'bg-white/5 border-white/15 text-white/70 hover:border-rr-pink/50'}`}
                                            >
                                                <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${picked ? 'bg-rr-pink border-rr-pink' : 'border-white/30'}`}>
                                                    {picked && <Check className="w-3.5 h-3.5 text-white" />}
                                                </span>
                                                <span className="text-sm font-medium">{sess.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <FieldError msg={errors.trial_session_dates} />
                                <p className="text-white/40 text-xs font-medium mt-2">
                                    ${TRIAL_PRICE} per player, per session
                                    {form.trial_session_dates.length > 0 && (
                                        <>
                                            {' '}— you'll pay for {form.trial_session_dates.length} session
                                            {form.trial_session_dates.length === 1 ? '' : 's'}
                                            <span className="text-rr-light-pink font-bold">
                                                {' '}(${TRIAL_PRICE * form.trial_session_dates.length})
                                            </span>
                                        </>
                                    )}.
                                </p>
                            </div>
                        )}

                        {/* Governance — required for every registration, trials included */}
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
                            <PSCheckbox checked={form.accept_parent_code} onToggle={() => toggle('accept_parent_code')} error={errors.accept_parent_code}>
                                I have read, understood, and agree to the{' '}
                                <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Parent/Guardian Code of Conduct</a>.
                            </PSCheckbox>
                            <PSCheckbox checked={form.accept_social_media} onToggle={() => toggle('accept_social_media')} error={errors.accept_social_media}>
                                I am happy for photos and videos featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
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
                            {submitting ? 'Submitting…' : 'Submit Registration'} {!submitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default RegistrationForm;
