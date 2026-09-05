import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { fadeUp, SectionHeading, Label, FieldError, Chevron, inputClass, selectClass } from './shared';
import { ACTIVE_CENTRES, PLAYING_ROLES, MIN_AGE, MAX_AGE } from './data';

// ─────────────────────────────────────────────────────────────
// PERFORMANCE SQUADS — "I can't make a trial" registration
// /performance-squads/interest
//
// For current Academy players who want a squad place but cannot attend any of
// the September trial sessions. Same details as the trial form, minus the two
// things that don't apply: no session picker and NO TRIAL FEE. These players
// are not paying anything, so nothing here touches Stripe.
//
// Writes to the SAME table as the trial form (performance_squad_leads) with
// entry_type = 'unable-to-trial'. That keeps one list per centre in the Google
// Sheet, with a "Registration Type" column separating the two, rather than a
// second table nobody remembers to look at.
//
// IMPORTANT: because these players owe nothing, the sheet must not show them as
// unpaid. sync-performance-squads.js reads entry_type and writes "No trial fee"
// in the Payment Check column for them — otherwise they land on the chase list
// and get rung up for money they were never asked for.
// ─────────────────────────────────────────────────────────────

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

const InterestPage = () => {
    usePageAnalytics('/performance-squads/interest', { sections: ['hero', 'form'] });

    const [form, setForm] = useState({
        player_name: '',
        player_age: '',
        parent_name: '',
        email: '',
        phone: '',
        club: '',
        preferred_centre: '',
        playing_role: '',
        accept_terms: false,
        accept_player_code: false,
        accept_parent_code: false,
        accept_social_media: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Title and the noindex flag come from <RouteSeo/> (see src/seo/pageSeo.js).
    // Setting document.title here would overwrite it.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const set = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));
    };
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

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
            } else if (age < MIN_AGE || age > MAX_AGE) {
                // Typos are caught above, so a number landing here is a real age
                // outside the squads' range — say so plainly rather than showing
                // the generic "enter an age" message.
                next.player_age = `Performance Squads are for players aged ${MIN_AGE} to ${MAX_AGE}.`;
            }
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'A valid email is required';
        if (!form.phone.trim()) next.phone = 'Phone number is required';
        if (!form.preferred_centre) next.preferred_centre = 'Please choose a centre';
        if (!form.playing_role) next.playing_role = 'Please choose a playing role';
        if (!form.accept_terms) next.accept_terms = 'You must agree to the Terms & Conditions and Privacy Policy';
        if (!form.accept_player_code) next.accept_player_code = 'You must agree to the Player Code of Conduct';
        if (!form.accept_parent_code) next.accept_parent_code = 'You must agree to the Parent/Guardian Code of Conduct';
        // Photo/video consent is deliberately NOT required. A parent who says no
        // to their child being photographed must still be able to register.
        if (Object.keys(next).length) { setErrors(next); return; }

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
                    entry_type: 'unable-to-trial',
                    playing_role: form.playing_role,
                    trial_sessions: null,
                    trial_session_dates: null,
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Performance Squads interest registration error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com' });
        } finally {
            setSubmitting(false);
        }
    };

    const ic = (key) => inputClass(errors, key);
    const sc = (key) => selectClass(errors, key);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="performance-squads" />

            <main className="flex-1 w-full overflow-hidden">
                <section id="hero" className="relative pt-32 pb-10 px-5">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                            Performance Squads
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black uppercase leading-[1.05] mb-5">
                            Can&apos;t Make a Trial?
                        </h1>
                        <p className="text-white/70 text-[15px] sm:text-lg font-medium leading-relaxed">
                            The September trials are how most players get into a Performance Squad. If
                            you already train with the Academy and none of those dates work for you,
                            fill this in instead. Your coach will assess you from your sessions with us
                            and be in touch about a squad place.
                        </p>
                        <p className="text-white/50 text-sm font-medium mt-4">
                            There is no fee for this form. You are not paying a trial fee, because you
                            are not attending a trial.
                        </p>
                    </div>
                </section>

                <section id="form" className="py-10 px-5 pb-24">
                    <div className="max-w-2xl mx-auto">
                        {submitted ? (
                            <motion.div
                                initial="hidden" animate="visible" variants={fadeUp} custom={0}
                                className="bg-white/5 border border-rr-pink/40 rounded-2xl p-10 text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center mx-auto mb-5">
                                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                                </div>
                                <h2 className="text-2xl font-black uppercase mb-3">You&apos;re on the list</h2>
                                <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-2">
                                    Thanks — we have your details and we know you can&apos;t make the
                                    September trials.
                                </p>
                                <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                                    Your Head Coach will assess you from your training with us and come
                                    back to you about a squad place. Nothing to pay right now.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                                <SectionHeading
                                    eyebrow="Register your interest"
                                    title="Your Details"
                                    sub="Same details we take at a trial, so your coach has everything they need."
                                />

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label required>Player Name</Label>
                                        <input className={ic('player_name')} value={form.player_name} onChange={set('player_name')} placeholder="Full name" />
                                        <FieldError msg={errors.player_name} />
                                    </div>
                                    <div>
                                        <Label required>Player Age (in years — {MIN_AGE} to {MAX_AGE})</Label>
                                        <input className={ic('player_age')} value={form.player_age} onChange={set('player_age')} placeholder="e.g. 16 years old" />
                                        <FieldError msg={errors.player_age} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <Label>Parent / Guardian Name (if player is under 18)</Label>
                                    <input className={ic('parent_name')} value={form.parent_name} onChange={set('parent_name')} placeholder="Parent or guardian full name" />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label required>Email</Label>
                                        <input type="email" className={ic('email')} value={form.email} onChange={set('email')} placeholder="you@email.com" />
                                        <FieldError msg={errors.email} />
                                    </div>
                                    <div>
                                        <Label required>Phone</Label>
                                        <input type="tel" className={ic('phone')} value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" />
                                        <FieldError msg={errors.phone} />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <Label>Current Club (optional)</Label>
                                    <input className={ic('club')} value={form.club} onChange={set('club')} placeholder="Club / association" />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label required>Which centre do you want to join?</Label>
                                        <div className="relative">
                                            <select className={sc('preferred_centre')} value={form.preferred_centre} onChange={set('preferred_centre')}>
                                                <option value="">Choose a centre</option>
                                                {ACTIVE_CENTRES.map((c) => (
                                                    <option key={c.slug} value={c.slug}>
                                                        {c.name} — {c.venue}
                                                    </option>
                                                ))}
                                            </select>
                                            <Chevron />
                                        </div>
                                        <FieldError msg={errors.preferred_centre} />
                                    </div>
                                    <div>
                                        <Label required>Playing Role</Label>
                                        <div className="relative">
                                            <select className={sc('playing_role')} value={form.playing_role} onChange={set('playing_role')}>
                                                <option value="">Choose a role</option>
                                                {PLAYING_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <Chevron />
                                        </div>
                                        <FieldError msg={errors.playing_role} />
                                    </div>
                                </div>

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
                                    <PSCheckbox checked={form.accept_social_media} onToggle={() => toggle('accept_social_media')}>
                                        I am happy for photos and videos featuring the player to be used on
                                        Rajasthan Royals Academy Melbourne&apos;s social media and marketing
                                        channels. <span className="text-white/40">(Optional — leave unticked if you would rather we didn&apos;t.)</span>
                                    </PSCheckbox>
                                </div>

                                {errors.form && (
                                    <p className="text-rr-pink text-sm font-medium mb-4 text-center">{errors.form}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                                >
                                    {submitting ? 'Sending…' : <>Register My Interest <ArrowRight className="w-4 h-4" /></>}
                                </button>
                                <p className="text-white/35 text-xs font-medium text-center mt-3">
                                    No payment required. Registering interest does not guarantee a squad place.
                                </p>
                            </form>
                        )}
                    </div>
                </section>

                <PartnerStack theme="dark" />
            </main>

            <Footer />
        </div>
    );
};

export default InterestPage;
