import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Label, FieldError, Chevron, inputClass, selectClass, PSCheckbox } from '../shared';
import { REGIONS } from './welcomeConfig';
import { Pending, Eyebrow } from './welcomeShared';

// The row id is made in the browser. The public can insert into this table but
// can't read rows back, so the id can't come from the database. It is also
// handed to Stripe as client_reference_id, so the Registration Fee payment can
// be matched to this exact confirmation instead of relying on the payer's email.
// Every row also carries the region the player picked (centre_slug / venue_name),
// so confirmations from different regions are told apart at a glance.
const newRowId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
        const r = (Math.random() * 16) | 0;
        return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

const paymentUrl = (link, rowId) => {
    try {
        const url = new URL(link);
        url.searchParams.set('client_reference_id', rowId);
        return url.toString();
    } catch {
        return link;
    }
};

// The 4 agreements every program uses (same wording), then the training and match
// risk acknowledgement, which is saved to accept_liability.
const AGREEMENT_ERRORS = {
    accept_terms: 'You must agree to the Terms & Conditions and Privacy Policy',
    accept_player_code: 'You must agree to the Player Code of Conduct',
    accept_parent_code: 'You must agree to the Parent/Guardian Code of Conduct',
    accept_social_media: 'Please confirm your social media consent',
    accept_liability: 'You must confirm that the player trains and plays matches at their own risk',
};

const linkClass = 'text-rr-light-pink underline hover:text-white';

const WelcomeConfirmForm = ({ config, isDraft }) => {
    const [form, setForm] = useState({
        region: '',
        first_name: '',
        last_name: '',
        parent_name: '',
        email: '',
        phone: '',
        accept_terms: false,
        accept_player_code: false,
        accept_parent_code: false,
        accept_social_media: false,
        accept_liability: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(null); // { id, draft }

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

    const validate = () => {
        const next = {};
        if (!form.region) next.region = 'Please choose the region you were selected in';
        if (!form.first_name.trim()) next.first_name = "Please enter the player's first name";
        if (!form.last_name.trim()) next.last_name = "Please enter the player's last name";
        if (!form.email.trim()) next.email = 'Please enter an email address';
        else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please check the email address';
        if (!form.phone.trim()) next.phone = 'Please enter a mobile number';
        Object.entries(AGREEMENT_ERRORS).forEach(([key, msg]) => {
            if (!form[key]) next[key] = msg;
        });
        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            document.getElementById(`psw-${Object.keys(next)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setErrors({});
        const id = newRowId();

        // While the page is a draft, walk through the flow without saving, so a
        // review click-through never adds test rows to a table of players' records.
        if (isDraft) {
            setSaved({ id, draft: true });
            return;
        }

        setSubmitting(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const first = form.first_name.trim();
            const last = form.last_name.trim();
            const region = REGIONS.find((r) => r.slug === form.region);
            // Plain insert, no .select(): asking for the row back needs read access
            // the public doesn't have, and would make the whole insert fail.
            const { error } = await supabase.from('performance_squads_registrations').insert([
                {
                    id,
                    // Marks a selected player's confirmation, so it can never be mistaken
                    // for a trial sign-up. squad_name stays empty on purpose.
                    program_type: 'performance-squads-selected',
                    status: 'accepted',
                    source: 'performance-squads-welcome',
                    first_name: first,
                    last_name: last,
                    player_name: `${first} ${last}`,
                    parent_name: form.parent_name.trim() || null,
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    centre_slug: region.slug,
                    venue_name: region.venue,
                    accept_terms: form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    accept_liability: form.accept_liability,
                    page_referrer: document.referrer || null,
                    utm_source: params.get('utm_source') || null,
                    utm_medium: params.get('utm_medium') || null,
                    utm_campaign: params.get('utm_campaign') || null,
                },
            ]);
            if (error) throw error;
            setSaved({ id, draft: false });
        } catch (err) {
            console.error('Performance Squad confirmation error:', err);
            setErrors({ form: `Something went wrong. Please try again, or email ${config.contactEmail}` });
        } finally {
            setSubmitting(false);
        }
    };

    if (saved) {
        return (
            <div role="status" className="bg-white/5 border border-rr-pink/40 rounded-2xl p-6 sm:p-9">
                {saved.draft && (
                    <p className="mb-6 rounded-xl bg-amber-300 text-rr-dark px-4 py-3 text-sm font-bold leading-relaxed">
                        Draft preview: nothing was saved. This form saves for real once every detail on this page is confirmed.
                    </p>
                )}
                <div className="text-center">
                    <CheckCircle2 aria-hidden="true" className="w-14 h-14 text-rr-pink mx-auto mb-4" strokeWidth={1.75} />
                    <h3 className="text-2xl sm:text-3xl font-black uppercase mb-3">Thank you</h3>
                    <p className="text-white/85 text-base font-medium leading-relaxed">
                        We have the player&apos;s details and your agreements. No payment has been taken yet.
                    </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <Eyebrow>Next</Eyebrow>
                    <p className="text-xl font-black uppercase tracking-wide mb-2">Pay the Joining Fee</p>
                    <p className="text-white/85 text-base font-medium mb-6">
                        The Joining Fee is {config.pricing.joiningFee.amount}. {config.pricing.joiningFee.note}{' '}
                        The {config.pricing.squadFee.amount} / {config.pricing.squadFee.per} Squad Fee starts once the season begins.
                    </p>
                    {config.paymentLink ? (
                        // Same tab on purpose: in-app browsers (Instagram especially) silently block new tabs.
                        <a
                            href={paymentUrl(config.paymentLink, saved.id)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-[13px] sm:text-sm rounded-full px-5 sm:px-8 py-4 transition-colors"
                        >
                            Pay Joining Fee <ArrowRight className="w-4 h-4" />
                        </a>
                    ) : (
                        <p><Pending>Payment link to be confirmed</Pending></p>
                    )}
                    <p className="text-white/55 text-sm font-medium mt-4">Payments are processed by Stripe.</p>
                </div>
            </div>
        );
    }

    const ic = (key) => inputClass(errors, key);

    return (
        <form onSubmit={handleSubmit} noValidate className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-9">
            <Eyebrow className="mb-5">Your region</Eyebrow>
            <div className="relative mb-8" id="psw-region">
                <Label required>Region / location you were selected in</Label>
                <div className="relative">
                    <select value={form.region} onChange={set('region')} className={selectClass(errors, 'region')}>
                        <option value="" disabled>Choose your region</option>
                        {REGIONS.map((r) => (
                            <option key={r.slug} value={r.slug}>{r.name} — {r.venue}</option>
                        ))}
                    </select>
                    <Chevron />
                </div>
                <FieldError msg={errors.region} />
            </div>

            <Eyebrow className="mb-5">Player details</Eyebrow>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div id="psw-first_name">
                    <Label required>Player first name</Label>
                    <input type="text" autoComplete="given-name" value={form.first_name} onChange={set('first_name')} className={ic('first_name')} />
                    <FieldError msg={errors.first_name} />
                </div>
                <div id="psw-last_name">
                    <Label required>Player last name</Label>
                    <input type="text" autoComplete="family-name" value={form.last_name} onChange={set('last_name')} className={ic('last_name')} />
                    <FieldError msg={errors.last_name} />
                </div>
            </div>
            <div className="mb-4" id="psw-parent_name">
                <Label>
                    Parent or guardian name{' '}
                    <span className="normal-case font-medium text-white/50">(if the player is under 18)</span>
                </Label>
                <input type="text" autoComplete="name" value={form.parent_name} onChange={set('parent_name')} className={ic('parent_name')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div id="psw-email">
                    <Label required>Email</Label>
                    <input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={ic('email')} />
                    <FieldError msg={errors.email} />
                </div>
                <div id="psw-phone">
                    <Label required>Mobile</Label>
                    <input type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" className={ic('phone')} />
                    <FieldError msg={errors.phone} />
                </div>
            </div>

            <div className="pt-7 border-t border-white/10">
                <Eyebrow className="mb-2">Agreements</Eyebrow>
                <p className="text-white/75 text-[15px] font-medium leading-relaxed mb-5">
                    The first 4 are the same for every Royals Academy program. The last one is about training
                    and playing matches. Please open and read each one before you tick the box.
                </p>
                <div id="psw-accept_terms">
                    <PSCheckbox checked={form.accept_terms} onToggle={() => toggle('accept_terms')} error={errors.accept_terms}>
                        I have read and agree to the{' '}
                        <a href="/terms-conditions" target="_blank" rel="noreferrer" className={linkClass}>Terms &amp; Conditions</a>{' '}and{' '}
                        <a href="/privacy-policy" target="_blank" rel="noreferrer" className={linkClass}>Privacy Policy</a>, and confirm the information provided is accurate.
                    </PSCheckbox>
                </div>
                <div id="psw-accept_player_code">
                    <PSCheckbox checked={form.accept_player_code} onToggle={() => toggle('accept_player_code')} error={errors.accept_player_code}>
                        I have read, understood, and agree to the{' '}
                        <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Player Code of Conduct</a>.
                    </PSCheckbox>
                </div>
                <div id="psw-accept_parent_code">
                    <PSCheckbox checked={form.accept_parent_code} onToggle={() => toggle('accept_parent_code')} error={errors.accept_parent_code}>
                        I have read, understood, and agree to the{' '}
                        <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={linkClass}>Parent/Guardian Code of Conduct</a>.
                    </PSCheckbox>
                </div>
                <div id="psw-accept_social_media">
                    <PSCheckbox checked={form.accept_social_media} onToggle={() => toggle('accept_social_media')} error={errors.accept_social_media}>
                        I am happy for photos and videos featuring the player to be used on Rajasthan Royals Academy Melbourne&apos;s social media and marketing channels.
                    </PSCheckbox>
                </div>
                <div id="psw-accept_liability">
                    <PSCheckbox checked={form.accept_liability} onToggle={() => toggle('accept_liability')} error={errors.accept_liability}>
                        I understand that training and playing matches can cause injury, and that the player trains and
                        plays matches at their own risk, as set out in clause 7 of the{' '}
                        <a href="/terms-conditions" target="_blank" rel="noreferrer" className={linkClass}>Terms &amp; Conditions</a>.
                    </PSCheckbox>
                </div>
            </div>

            {errors.form && (
                <p role="alert" className="text-rr-light-pink text-sm font-bold mt-4 text-center">{errors.form}</p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-4 transition-colors"
            >
                {submitting ? 'Saving…' : <>Save and continue <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-white/55 text-sm font-medium text-center mt-4">No payment is taken on this form.</p>
        </form>
    );
};

export default WelcomeConfirmForm;
