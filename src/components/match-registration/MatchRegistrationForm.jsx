import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Video, VideoOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
    fadeUp, SectionHeading, Label, FieldError, Chevron,
    inputClass, selectClass,
} from '../performance-squads/shared';
import { ACTIVE_MATCH, MIN_AGE, MAX_AGE } from './matchConfig';

const MRCheckbox = ({ checked, onToggle, error, children }) => (
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

// Filming is a REQUIRED CHOICE, not a required tick. The original comms offered
// an opt-out ("if you'd rather not appear on the stream, let us know"), so forcing
// a yes would both contradict that and stop anyone who declines from registering
// at all. Both answers let the player through; the answer is stored either way so
// there's a clean list of who to keep off camera.
const FilmingChoice = ({ value, onChange, error }) => {
    const options = [
        { key: 'consented', icon: Video, label: `I'm happy for the player to appear on the ${ACTIVE_MATCH.streaming.partner} stream` },
        { key: 'declined', icon: VideoOff, label: 'Please keep the player off the stream' },
    ];
    return (
        <div className="mb-2">
            {options.map((o) => {
                const active = value === o.key;
                const Icon = o.icon;
                return (
                    <button
                        key={o.key}
                        type="button"
                        onClick={() => onChange(o.key)}
                        aria-pressed={active}
                        className={`w-full flex items-start gap-3 text-left rounded-xl border px-4 py-3.5 mb-2.5 transition-colors ${active ? 'bg-rr-pink/12 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-rr-pink/50'}`}
                    >
                        <span className={`mt-0.5 w-5 h-5 rounded-full shrink-0 border flex items-center justify-center ${active ? 'bg-rr-pink border-rr-pink' : 'border-white/30'}`}>
                            {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-rr-light-pink' : 'text-white/40'}`} />
                        <span className="text-white/80 text-[13px] font-medium leading-relaxed">{o.label}</span>
                    </button>
                );
            })}
            {error && <p className="text-rr-pink text-xs font-medium mt-1">{error}</p>}
        </div>
    );
};

const MatchRegistrationForm = ({ onRequestPayment }) => {
    const [form, setForm] = useState({
        player_name: '',
        player_age: '',
        parent_name: '',
        email: '',
        phone: '',
        accept_terms: false,
        accept_player_code: false,
        accept_parent_code: false,
        accept_safety_equipment: false,
        accept_social_media: false,
        filming_consent: '',
        volunteer: false,
        volunteer_role: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

    const validate = () => {
        const next = {};
        if (!form.player_name.trim()) next.player_name = "Please enter the player's name";

        const age = Number(form.player_age);
        if (!String(form.player_age).trim()) next.player_age = "Please enter the player's age";
        else if (!Number.isFinite(age) || age < MIN_AGE || age > MAX_AGE) {
            next.player_age = `Please enter an age between ${MIN_AGE} and ${MAX_AGE}`;
        }

        if (!form.parent_name.trim()) next.parent_name = "Please enter the parent/guardian's name";
        if (!form.email.trim()) next.email = 'Please enter an email address';
        else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please enter a valid email address';
        if (!form.phone.trim()) next.phone = 'Please enter a contact mobile number';

        if (!form.accept_terms) next.accept_terms = 'You must agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'You must agree to the Player Code of Conduct';
        if (!form.accept_parent_code) next.accept_parent_code = 'You must agree to the Parent/Guardian Code of Conduct';
        if (!form.accept_safety_equipment) next.accept_safety_equipment = 'You must confirm the helmet and stem guard requirement';
        if (!form.accept_social_media) next.accept_social_media = 'Please confirm your social media consent';
        if (!form.filming_consent) next.filming_consent = 'Please choose one of the two options above';

        if (form.volunteer && !form.volunteer_role) next.volunteer_role = 'Please choose where you can help';
        return next;
    };

    const handleSubmit = async () => {
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            const firstKey = Object.keys(next)[0];
            document.getElementById(`mr-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            const { error } = await supabase.from('match_registrations').insert([
                {
                    match_slug: ACTIVE_MATCH.slug,
                    match_name: ACTIVE_MATCH.name,
                    player_name: form.player_name.trim(),
                    player_age: Number(form.player_age),
                    parent_name: form.parent_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_safety_equipment: form.accept_safety_equipment,
                    accept_social_media: form.accept_social_media,
                    filming_consent: form.filming_consent,
                    volunteer: form.volunteer,
                    volunteer_role: form.volunteer ? form.volunteer_role : null,
                    amount: ACTIVE_MATCH.price,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;

            setSubmitted(true);
            // Registration and payment are one flow — open payment immediately.
            onRequestPayment?.({ playerName: form.player_name.trim() });
        } catch (err) {
            console.error('Match registration error:', err);
            setErrors({ form: `Something went wrong. Please try again or email ${ACTIVE_MATCH.contactEmail}` });
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
                    title="Confirm Your Spot"
                    sub={`Enter the player's details, confirm the checklist below, and pay — all in one step. Your spot isn't locked in until payment is received. Please pay by ${ACTIVE_MATCH.deadlineLabel}.`}
                />

                {submitted ? (
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-3">Registration Received</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-6">
                            Thanks — we've got the details. The spot isn't locked in until payment
                            is received, so finish up below if you haven't already.
                        </p>
                        <button
                            onClick={() => onRequestPayment?.({ playerName: form.player_name.trim() })}
                            className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            Complete Payment <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={fadeUp} custom={0}
                        className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-9"
                    >
                        {/* ── Player ── */}
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">
                            Player Details
                        </p>

                        <div className="mb-5" id="mr-player_name">
                            <Label required>Player Name</Label>
                            <input
                                type="text" value={form.player_name} className={ic('player_name')}
                                placeholder="Full name"
                                onChange={(e) => set('player_name', e.target.value)}
                            />
                            <FieldError msg={errors.player_name} />
                        </div>

                        <div className="mb-5" id="mr-player_age">
                            <Label required>Player Age</Label>
                            <input
                                type="number" inputMode="numeric" min={MIN_AGE} max={MAX_AGE}
                                value={form.player_age} className={ic('player_age')}
                                placeholder="e.g. 14"
                                onChange={(e) => set('player_age', e.target.value)}
                            />
                            <FieldError msg={errors.player_age} />
                        </div>

                        <div className="mb-5" id="mr-parent_name">
                            <Label required>Parent / Guardian Name</Label>
                            <input
                                type="text" value={form.parent_name} className={ic('parent_name')}
                                placeholder="Full name"
                                onChange={(e) => set('parent_name', e.target.value)}
                            />
                            <FieldError msg={errors.parent_name} />
                        </div>

                        <div className="mb-5" id="mr-email">
                            <Label required>Email</Label>
                            <input
                                type="email" value={form.email} className={ic('email')}
                                placeholder="you@example.com"
                                onChange={(e) => set('email', e.target.value)}
                            />
                            <FieldError msg={errors.email} />
                        </div>

                        <div className="mb-8" id="mr-phone">
                            <Label required>Mobile</Label>
                            <input
                                type="tel" value={form.phone} className={ic('phone')}
                                placeholder="04__ ___ ___"
                                onChange={(e) => set('phone', e.target.value)}
                            />
                            <FieldError msg={errors.phone} />
                        </div>

                        {/* ── Governance ── */}
                        <div className="pt-7 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-5">
                                Agreements &amp; Consent
                            </p>

                            <div id="mr-accept_terms">
                                <MRCheckbox
                                    checked={form.accept_terms}
                                    onToggle={() => toggle('accept_terms')}
                                    error={errors.accept_terms}
                                >
                                    I have read and agree to the{' '}
                                    <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Terms &amp; Conditions</a> and{' '}
                                    <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Privacy Policy</a>, and confirm the information provided is accurate.
                                </MRCheckbox>
                            </div>

                            <div id="mr-accept_player_code">
                                <MRCheckbox
                                    checked={form.accept_player_code}
                                    onToggle={() => toggle('accept_player_code')}
                                    error={errors.accept_player_code}
                                >
                                    I have read, understood, and agree to the{' '}
                                    <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Player Code of Conduct</a>.
                                </MRCheckbox>
                            </div>

                            <div id="mr-accept_parent_code">
                                <MRCheckbox
                                    checked={form.accept_parent_code}
                                    onToggle={() => toggle('accept_parent_code')}
                                    error={errors.accept_parent_code}
                                >
                                    I have read, understood, and agree to the{' '}
                                    <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-light-pink underline hover:text-white">Parent/Guardian Code of Conduct</a>.
                                </MRCheckbox>
                            </div>

                            <div id="mr-accept_safety_equipment">
                                <MRCheckbox
                                    checked={form.accept_safety_equipment}
                                    onToggle={() => toggle('accept_safety_equipment')}
                                    error={errors.accept_safety_equipment}
                                >
                                    I understand a <strong className="text-white/90">helmet and stem guard are both mandatory</strong>, and that
                                    the player will not be permitted to bat without a stem guard.
                                </MRCheckbox>
                            </div>

                            <div id="mr-accept_social_media">
                                <MRCheckbox
                                    checked={form.accept_social_media}
                                    onToggle={() => toggle('accept_social_media')}
                                    error={errors.accept_social_media}
                                >
                                    I am happy for photos and videos featuring the player to be used on Rajasthan
                                    Royals Academy Melbourne's social media and marketing channels.
                                </MRCheckbox>
                            </div>
                        </div>

                        {/* ── Filming ── */}
                        <div className="pt-7 mt-6 border-t border-white/10" id="mr-filming_consent">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">
                                Live Streaming
                            </p>
                            <p className="text-white/55 text-[13px] font-medium leading-relaxed mb-4">
                                {ACTIVE_MATCH.streaming.partner} will be producing and streaming the matches.
                                Please choose one — both options are fine, we just need to know.
                            </p>
                            <FilmingChoice
                                value={form.filming_consent}
                                onChange={(v) => set('filming_consent', v)}
                                error={errors.filming_consent}
                            />
                        </div>

                        {/* ── Volunteers ── */}
                        <div className="pt-7 mt-6 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink mb-2">
                                Can You Help?
                            </p>
                            <p className="text-white/55 text-[13px] font-medium leading-relaxed mb-4">
                                {ACTIVE_MATCH.volunteers.blurb}
                            </p>
                            <MRCheckbox checked={form.volunteer} onToggle={() => toggle('volunteer')}>
                                Yes — I can help out across the two days.
                            </MRCheckbox>

                            {form.volunteer && (
                                <div className="mt-3 ml-8" id="mr-volunteer_role">
                                    <Label required>Where can you help?</Label>
                                    <div className="relative">
                                        <select
                                            value={form.volunteer_role} className={sc('volunteer_role')}
                                            onChange={(e) => set('volunteer_role', e.target.value)}
                                        >
                                            <option value="">Select an option</option>
                                            {ACTIVE_MATCH.volunteers.roles.map((r) => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                        <Chevron />
                                    </div>
                                    <FieldError msg={errors.volunteer_role} />
                                </div>
                            )}
                        </div>

                        {errors.form && (
                            <p className="text-rr-pink text-sm font-bold mt-6 text-center">{errors.form}</p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full mt-8 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-[13px] sm:text-sm rounded-full px-5 sm:px-8 py-4 transition-colors"
                        >
                            {submitting ? 'Submitting…' : (
                                <>Continue To Payment · ${ACTIVE_MATCH.price} <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        <p className="text-white/35 text-xs font-medium text-center mt-4">
                            Payments are processed securely by Stripe. Your spot is not held until
                            payment is received.
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default MatchRegistrationForm;
