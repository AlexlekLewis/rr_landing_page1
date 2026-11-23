import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import GovernanceConsents from '../shared/GovernanceConsents';
import TrainingShirtStep from '../shared/TrainingShirtStep';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';
import { EMPTY_SHIRT, shirtError, needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { nightLabel } from './useCoachAvailability';

// Second player in a 1-to-2 (Andy, 18 Nov 2026): the booker paid for the sessions; before
// the first session the other player's family completes this. Details, the four governance
// boxes, and the training shirt (paid here, $29.95, if they don't have one). Reached from the
// link on the booker's success page: /private-coaching-premium/partner?b=<booking id>.
// Saved by api/private-coaching-partner.js.

const input = (bad) => `w-full bg-slate-50 border ${bad ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-sm`;
const labelCls = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
const Field = ({ id, label, error, optional, children }) => (
    <div id={`f-${id}`}>
        <label htmlFor={id} className={labelCls}>{label}{!optional && ' *'}</label>
        {children}
        {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
    </div>
);

const EMPTY = { player_first_name: '', player_last_name: '', player_age: '', parent_name: '', email: '', phone: '', notes: '' };

const PremiumCoachingPartner = () => {
    const params = new URLSearchParams(useLocation().search);
    const b = params.get('b');
    const justPaid = params.get('paid') === '1';
    const [info, setInfo] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [form, setForm] = useState(EMPTY);
    const [shirt, setShirt] = useState(EMPTY_SHIRT);
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [failed, setFailed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`/api/private-coaching-partner?b=${encodeURIComponent(b || '')}`)
            .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'This link didn’t work.'); setInfo(j); })
            .catch((e) => setLoadError(e.message));
    }, [b]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const age = parseInt(form.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;

    const submit = async (evt) => {
        evt.preventDefault();
        setFailed('');
        const e = {};
        if (!form.player_first_name.trim()) e.player_first_name = 'Please enter the player’s first name.';
        if (!form.player_last_name.trim()) e.player_last_name = 'Please enter the player’s last name.';
        if (!Number.isFinite(age) || age < 5 || age > 70) e.player_age = 'Please enter the player’s age.';
        if (!adult && !form.parent_name.trim()) e.parent_name = 'Please enter a parent or guardian name.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
        if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number.';
        const se = shirtError(shirt); if (se) e.shirt = se;
        Object.assign(e, consentErrors(consents, { adult }));
        setErrors(e);
        const first = Object.keys(e)[0];
        if (first) { document.getElementById(first.startsWith('accept_') ? `consent-${first}` : `f-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

        setSubmitting(true);
        try {
            const r = await fetch('/api/private-coaching-partner', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ b, ...form, shirt, consents: consentColumns(consents) }),
            });
            const out = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(out.error || 'Something went wrong. Please try again.');
            if (out.url) { window.location.assign(out.url); return; }
            setDone(true);
        } catch (err) { setFailed(err.message); }
        setSubmitting(false);
    };

    const complete = done || justPaid || info?.done;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="THE FORM" ctaTargetOverride="partner-form" />
            <main className="flex-1 bg-slate-50 pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-3 text-center">Royals Private Coaching · 1-to-2</p>
                    <h1 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-4 text-center">Training partner form</h1>

                    {loadError && <p className="text-center text-red-600 font-semibold">{loadError}</p>}
                    {!loadError && !info && <p className="text-center text-slate-500">Loading…</p>}

                    {info && complete && (
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
                            <p className="text-2xl font-black text-rr-dark mb-2">All done, thank you</p>
                            <p className="text-rr-charcoal font-medium">Your player is ready to train with {info.bookedFor}{info.coach ? ` and ${info.coach}` : ''} at {info.centre}.{info.firstSession ? ` First session: ${nightLabel(info.firstSession)}.` : ''}</p>
                        </div>
                    )}

                    {info && !complete && (
                        <>
                            <p className="text-rr-charcoal font-medium leading-relaxed text-center mb-8">
                                Your player is training 1-to-2 with <b>{info.bookedFor}</b>{info.coach ? <> and coach <b>{info.coach}</b></> : null} at {info.centre}. The sessions are paid for. Before the first session{info.firstSession ? ` (${nightLabel(info.firstSession)})` : ''}, please complete this form.
                            </p>
                            {info.shirtOwing && <p className="text-center text-sm font-semibold text-rr-pink mb-4">Your form is saved. The training shirt still needs paying for: submit again to pay.</p>}
                            <form id="partner-form" onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-6" data-partner-form>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field id="player_first_name" label="Player first name" error={errors.player_first_name}><input id="player_first_name" value={form.player_first_name} onChange={set('player_first_name')} className={input(errors.player_first_name)} /></Field>
                                    <Field id="player_last_name" label="Player last name" error={errors.player_last_name}><input id="player_last_name" value={form.player_last_name} onChange={set('player_last_name')} className={input(errors.player_last_name)} /></Field>
                                    <Field id="player_age" label="Age" error={errors.player_age}><input id="player_age" type="number" inputMode="numeric" value={form.player_age} onChange={set('player_age')} className={input(errors.player_age)} /></Field>
                                    {!adult && <Field id="parent_name" label="Parent or guardian name" error={errors.parent_name}><input id="parent_name" value={form.parent_name} onChange={set('parent_name')} className={input(errors.parent_name)} /></Field>}
                                    <Field id="email" label="Email" error={errors.email}><input id="email" type="email" value={form.email} onChange={set('email')} className={input(errors.email)} /></Field>
                                    <Field id="phone" label="Mobile" error={errors.phone}><input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={input(errors.phone)} /></Field>
                                </div>
                                <Field id="notes" label="Anything the coach should know" optional><textarea id="notes" rows={3} value={form.notes} onChange={set('notes')} className={input(false)} /></Field>
                                <div id="f-shirt"><TrainingShirtStep value={shirt} onChange={setShirt} playerName={form.player_first_name} playerAge={form.player_age} error={errors.shirt} /></div>
                                <GovernanceConsents value={consents} onChange={setConsents} errors={errors} adult={adult} />
                                {failed && <p className="text-red-600 text-sm font-semibold text-center">{failed}</p>}
                                <button type="submit" disabled={submitting} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                                    {submitting ? 'Saving…' : needsShirt(shirt) ? `Submit and pay for the shirt (${TRAINING_SHIRT.priceLabel})` : 'Submit'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PremiumCoachingPartner;
