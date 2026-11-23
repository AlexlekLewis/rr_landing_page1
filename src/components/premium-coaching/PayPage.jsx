import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import GovernanceConsents from '../shared/GovernanceConsents';
import TrainingShirtStep from '../shared/TrainingShirtStep';
import { EMPTY_CONSENTS, consentErrors, consentColumns } from '../../lib/governance';
import { EMPTY_SHIRT, shirtError, needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { money } from './premiumCoachingData';
import { nightLabel, timeLabel } from './useCoachAvailability';
import { Field, Photo } from './pcUi';
import { input } from './pcHelpers';

// The pay link a coach sends a family (Andy, 22 Nov 2026, coach-led flow):
// /private-coaching/pay?b=<booking id>. Shows what was agreed with the coach, then the
// player's details, the training shirt (CLAUDE.md) and the four governance boxes
// (CLAUDE.md), then Pay. api/private-coaching-pay.js checks all of it again before Stripe.

const PayPage = () => {
    const params = new URLSearchParams(useLocation().search);
    const b = params.get('b');
    const cancelled = params.get('cancelled') === '1';
    const [info, setInfo] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [form, setForm] = useState(null);
    const [shirt, setShirt] = useState(EMPTY_SHIRT);
    const [consents, setConsents] = useState(EMPTY_CONSENTS);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`/api/private-coaching-pay?b=${encodeURIComponent(b || '')}`)
            .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'This link didn’t work.'); setInfo(j); setForm({ ...j.details, player_age: j.details.player_age ? String(j.details.player_age) : '' }); })
            .catch((e) => setLoadError(e.message));
    }, [b]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const age = parseInt(form?.player_age, 10);
    const adult = Number.isFinite(age) && age >= 18;
    const shirtCents = needsShirt(shirt) ? Math.round(TRAINING_SHIRT.price * 100) : 0;

    const submit = async (evt) => {
        evt.preventDefault();
        setFailed('');
        const e = {};
        if (!form.player_first_name?.trim()) e.player_first_name = 'Please enter the player’s first name.';
        if (!form.player_last_name?.trim()) e.player_last_name = 'Please enter the player’s last name.';
        if (!Number.isFinite(age) || age < 5 || age > 70) e.player_age = 'Please enter the player’s age.';
        if (!adult && !form.parent_name?.trim()) e.parent_name = 'Please enter a parent or guardian name.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email?.trim() || '')) e.email = 'Please enter a valid email address.';
        if ((form.phone || '').replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number.';
        const se = shirtError(shirt);
        if (se) e.shirt = se;
        Object.assign(e, consentErrors(consents, { adult }));
        setErrors(e);
        const first = Object.keys(e)[0];
        if (first) { document.getElementById(first.startsWith('accept_') ? `consent-${first}` : `f-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
        setBusy(true);
        try {
            sessionStorage.setItem('premium_pc_booking', JSON.stringify({
                id: info.id, first: form.player_first_name, format: info.format, partner: info.partner, coachName: info.coach.name,
                sessions: info.sessions, per: info.per, total: info.per * info.sessions, picked: info.times, shirt, share: info.share,
            }));
        } catch { /* optional */ }
        try {
            const r = await fetch('/api/private-coaching-pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ b, ...form, shirt, consents: consentColumns(consents) }) }); // the four columns, checked and saved by the API
            const out = await r.json().catch(() => ({}));
            if (r.ok && out.url) { window.location.assign(out.url); return; }
            if (out.errors) setErrors(out.errors);
            setFailed(out.error || 'Payment could not start. Please try again.');
        } catch { setFailed('Payment could not start. Please check your connection and try again.'); }
        setBusy(false);
    };

    const shell = (children) => (
        <div className="min-h-screen bg-slate-50 text-rr-dark font-sans flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="" />
            <main className="flex-1 w-full pt-28 md:pt-32 pb-16"><div className="max-w-2xl mx-auto px-4 sm:px-6">{children}</div></main>
            <Footer />
        </div>
    );
    if (loadError) return shell(<p className="bg-white rounded-2xl p-6 font-semibold">{loadError}</p>);
    if (!info || !form) return shell(<p className="text-slate-500 font-semibold">Loading your booking…</p>);
    const first = info.coach.name?.split(' ')[0] || 'Your coach';
    if (info.paid) return shell(<div className="bg-white rounded-2xl p-6"><h1 className="text-2xl font-black uppercase mb-2">All paid</h1><p className="font-medium">This booking with {info.coach.name} is paid. Thank you! {first} will see you at {info.centre.suburb}.</p></div>);
    if (info.expired) return shell(<div className="bg-white rounded-2xl p-6"><h1 className="text-2xl font-black uppercase mb-2">Link expired</h1><p className="font-medium">Please ask {first} to send you a new link.</p></div>);

    const total = Math.round(info.per * info.sessions * 100) + shirtCents;
    const times = info.times?.length ? info.times.map((t) => `${nightLabel(t.date)} ${timeLabel(t.start)}`).join(', ') : info.timesNote;

    return shell(
        <form onSubmit={submit} noValidate className="space-y-6">
            {cancelled && <p className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm font-semibold">Payment wasn’t completed. You can try again below.</p>}
            <div className="bg-white rounded-3xl p-5 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-rr-pink mb-3">Confirm and pay</p>
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0"><Photo c={info.coach} /></div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">Private coaching with {info.coach.name}</h1>
                        <p className="text-sm font-semibold text-slate-500 flex items-start gap-1 mt-1"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />{info.centre.name}{info.centre.address ? `, ${info.centre.address}` : ''}</p>
                    </div>
                </div>
                <dl className="space-y-2 text-sm" data-agreed>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500 font-semibold">Session</dt><dd className="font-bold text-right">{info.formatLabel}{info.format === '1-2' && info.partner ? ` with ${info.partner}` : ''}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500 font-semibold">Sessions</dt><dd className="font-bold text-right">{info.sessions} × {money(info.per)}{info.share === 2 ? ' (your half)' : ''}</dd></div>
                    {times && <div className="flex justify-between gap-4"><dt className="text-slate-500 font-semibold">Times agreed</dt><dd className="font-bold text-right">{times}</dd></div>}
                </dl>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-7 space-y-5">
                <h2 className="text-lg font-black uppercase tracking-tight">Player details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field id="player_first_name" label="Player first name" error={errors.player_first_name}><input id="player_first_name" value={form.player_first_name || ''} onChange={set('player_first_name')} className={input(errors.player_first_name)} /></Field>
                    <Field id="player_last_name" label="Player last name" error={errors.player_last_name}><input id="player_last_name" value={form.player_last_name || ''} onChange={set('player_last_name')} className={input(errors.player_last_name)} /></Field>
                    <Field id="player_age" label="Player age" error={errors.player_age}><input id="player_age" type="number" inputMode="numeric" value={form.player_age} onChange={set('player_age')} className={input(errors.player_age)} /></Field>
                    {!adult && <Field id="parent_name" label="Parent or guardian name" error={errors.parent_name}><input id="parent_name" value={form.parent_name || ''} onChange={set('parent_name')} className={input(errors.parent_name)} /></Field>}
                    <Field id="email" label="Email" error={errors.email}><input id="email" type="email" value={form.email || ''} onChange={set('email')} className={input(errors.email)} /></Field>
                    <Field id="phone" label="Mobile" error={errors.phone}><input id="phone" type="tel" value={form.phone || ''} onChange={set('phone')} className={input(errors.phone)} /></Field>
                </div>
                <div id="f-shirt"><TrainingShirtStep value={shirt} onChange={setShirt} playerName={form.player_first_name} playerAge={form.player_age} error={errors.shirt} /></div>
                <GovernanceConsents value={consents} onChange={setConsents} errors={errors} adult={adult} />
            </div>

            <div className="rounded-3xl bg-rr-dark text-white p-5 sm:p-7" data-summary>
                <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-white/70">{info.sessions} × {info.formatLabel}</dt><dd className="font-bold">{money(info.per * info.sessions)}</dd></div>
                    {needsShirt(shirt) && shirt.size && <div className="flex justify-between gap-4"><dt className="text-white/70">Training shirt, size {String(shirt.size).split(' ')[0]}</dt><dd className="font-bold">{money(TRAINING_SHIRT.price)}</dd></div>}
                    <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-white/15 text-base"><dt className="font-black">Total incl. GST</dt><dd className="font-black">{money(total / 100)}</dd></div>
                </dl>
            </div>
            {failed && <p className="text-red-600 text-sm font-semibold text-center">{failed}</p>}
            <button type="submit" disabled={busy} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                {busy ? 'Opening secure payment…' : `Pay ${money(total / 100)}`}
            </button>
            <p className="text-center text-xs text-slate-500 font-medium">You pay securely by card with Stripe. {first} is told as soon as you’ve paid.</p>
        </form>
    );
};

export default PayPage;
