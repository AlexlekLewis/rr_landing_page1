import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Mail, Check, ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { ROUTE, FORMAT_LABELS, FORMAT_BLURBS, coachOf, centreOf, coachPrice, money, TECH } from './premiumCoachingData';
import { Field, Photo } from './pcUi';
import { input, labelCls, utm, waDigits, telHref } from './pcHelpers';
import { SMS_DISPLAY, INFO_EMAIL } from '../../lib/academyContact';

// A coach's own page (Andy, 22 Nov 2026, coach-led like the "cash coach" economy):
// /private-coaching-<coach>. Their bio, prices, usual times, terms and specialities.
// Book Now → the family leaves basic details → we show the coach's contact details and
// tell the coach (email, and text once Twilio is set up). The coach then agrees the times
// with the family and the centre, and sends a pay link from their coach page.

const EMPTY = { format_pref: '', parent_name: '', player_name: '', email: '', phone: '', suburb: '', website: '' };

const Enquire = ({ coach, onDone }) => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState('');
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const first = coach.name.split(' ')[0];

    const submit = async (e) => {
        e.preventDefault();
        const err = {};
        if (!form.format_pref) err.format_pref = 'Please choose one.';
        if (form.parent_name.trim().length < 2) err.parent_name = 'Please enter your name.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) err.email = 'Please enter a valid email address.';
        if (form.phone.replace(/\D/g, '').length < 8) err.phone = 'Please enter a valid phone number.';
        if (form.suburb.trim().length < 2) err.suburb = 'Please enter your suburb.';
        setErrors(err);
        if (Object.keys(err).length) return;
        setBusy(true); setFailed('');
        try {
            const r = await fetch('/api/private-coaching-enquiry', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coach: coach.slug, ...form, ...utm(), page_referrer: document.referrer || null }),
            });
            const out = await r.json().catch(() => ({}));
            if (!r.ok) { setErrors(out.errors || {}); throw new Error(out.error || 'Something went wrong.'); }
            try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: `Private coaching: ${coach.name}` }); } catch { /* optional */ }
            onDone({ contact: out.contact, name: form.parent_name.trim().split(' ')[0] });
        } catch (x) {
            setFailed(x.message || 'Something went wrong. Please try again.');
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-4" data-enquiry>
            <p className="text-sm text-rr-charcoal font-medium">A few details, then we’ll show you {first}’s number so you can arrange your times. We’ll let {first} know you’re coming too.</p>
            <div id="f-format_pref">
                <p className={labelCls}>What are you looking for? *</p>
                <div className="grid sm:grid-cols-3 gap-2" role="radiogroup" aria-label="What are you looking for?">
                    {[['1-1', '1-to-1', coachPrice(coach, '1-1', 1)], ['1-2', 'Training partner session', coachPrice(coach, '1-2', 1)], ['not-sure', 'Not sure yet', null]].map(([v, label, price]) => (
                        <button key={v} type="button" role="radio" aria-checked={form.format_pref === v} data-pref={v} onClick={() => { setForm((f) => ({ ...f, format_pref: v })); setErrors((x) => ({ ...x, format_pref: undefined })); }}
                            className={`text-left rounded-xl border-2 px-4 py-3 transition-colors ${form.format_pref === v ? 'border-rr-pink bg-rr-pink/5' : errors.format_pref ? 'border-red-300' : 'border-slate-200 hover:border-rr-pink/50'}`}>
                            <span className="block text-sm font-black text-rr-dark">{label}</span>
                            <span className="block text-xs font-semibold text-slate-500">{v === 'not-sure' ? 'Talk it through' : price != null ? `${money(price)} a session` : 'Ask the coach'}</span>
                        </button>
                    ))}
                </div>
                {errors.format_pref && <p className="text-red-500 text-xs font-medium mt-1">{errors.format_pref}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <Field id="parent_name" label="Your name" error={errors.parent_name}><input id="parent_name" value={form.parent_name} onChange={set('parent_name')} className={input(errors.parent_name)} autoComplete="name" /></Field>
                <Field id="player_name" label="Player’s name, if different" optional><input id="player_name" value={form.player_name} onChange={set('player_name')} className={input(false)} /></Field>
                <Field id="email" label="Email" error={errors.email}><input id="email" type="email" value={form.email} onChange={set('email')} className={input(errors.email)} autoComplete="email" /></Field>
                <Field id="phone" label="Mobile" error={errors.phone}><input id="phone" type="tel" value={form.phone} onChange={set('phone')} className={input(errors.phone)} autoComplete="tel" /></Field>
                <Field id="suburb" label="Suburb you live in" error={errors.suburb}><input id="suburb" value={form.suburb} onChange={set('suburb')} className={input(errors.suburb)} autoComplete="address-level2" /></Field>
            </div>
            <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {failed && <p className="text-red-600 text-sm font-semibold">{failed}</p>}
            <button type="submit" disabled={busy} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                {busy ? 'One moment…' : `Get ${first}’s contact details`}
            </button>
        </form>
    );
};

const Contact = ({ coach, done }) => {
    const first = coach.name.split(' ')[0];
    const c = done.contact;
    const msg = encodeURIComponent(`Hi ${first}, it's ${done.name}. I've just enquired about private coaching on the Royals Academy website.`);
    const btn = 'flex items-center justify-center gap-2 rounded-full px-5 py-3.5 font-black uppercase tracking-widest text-sm text-white';
    return (
        <div className="space-y-4" data-contact>
            <div className="flex items-start gap-3"><Check className="w-6 h-6 text-green-600 shrink-0" /><p className="font-bold text-rr-dark">Thanks {done.name}. {first} has your details and will be in touch.</p></div>
            {c ? (
                <>
                    <p className="text-sm text-rr-charcoal font-medium">Want to get started sooner? Contact {first} now to arrange your times:</p>
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                        {c.mobile && <p className="text-lg font-black text-rr-dark">{c.mobile}</p>}
                        {c.email && <p className="text-sm font-semibold text-rr-charcoal break-all">{c.email}</p>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2">
                        {c.mobile && <a href={telHref(c.mobile)} className={`${btn} bg-rr-dark`}><Phone className="w-4 h-4" />Call</a>}
                        {c.mobile && <a href={`https://wa.me/${waDigits(c.mobile)}?text=${msg}`} target="_blank" rel="noreferrer" className={`${btn} bg-[#1A9E52]`}><MessageCircle className="w-4 h-4" />WhatsApp</a>}
                        {c.email && <a href={`mailto:${c.email}?subject=${encodeURIComponent('Private coaching')}`} className={`${btn} bg-rr-pink`}><Mail className="w-4 h-4" />Email</a>}
                    </div>
                </>
            ) : <p className="text-sm text-rr-charcoal font-medium">We’ve passed your details to {first}, who will call you within 24 hours to arrange your times. Questions before then? Text us on {SMS_DISPLAY} or email {INFO_EMAIL}.</p>}
            <p className="text-xs text-slate-500 font-medium">{coach.payLinks ? `Once you’ve agreed your times, ${first} books the lane and sends you a link to confirm and pay.` : `Once you’ve agreed your times, ${first} books the lane and confirms your sessions with you.`}</p>
        </div>
    );
};

const CoachPage = ({ slug }) => {
    usePageAnalytics();
    const coach = coachOf(slug);
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(null);
    useEffect(() => { window.scrollTo(0, 0); }, []);
    if (!coach) return null;
    const first = coach.name.split(' ')[0];
    const formats = ['1-1', '1-2'].filter((f) => coachPrice(coach, f, 1) != null);
    const book = () => { setOpen(true); setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="BOOK NOW" ctaTargetOverride="book" />
            <main className="flex-1 w-full">
                {/* The coach */}
                <section className="bg-rr-dark text-white pt-28 md:pt-36 pb-14 md:pb-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <Link to={`${ROUTE}#coaches`} className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rr-light-pink mb-6"><ArrowLeft className="w-4 h-4" />All coaches</Link>
                        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                            <div className="md:col-span-5"><div className="aspect-square rounded-3xl overflow-hidden"><Photo c={coach} /></div></div>
                            <div className="md:col-span-7">
                                <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-light-pink">Royals Private Coaching</p>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-3">{coach.name}</h1>
                                {coach.role && <p className="text-lg font-bold text-white/85 mb-4">{coach.role}</p>}
                                <p className="flex items-start gap-1.5 text-sm font-semibold text-white/75 mb-6"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-light-pink" />{coach.centres.map((c) => centreOf(c)?.suburb).join(' · ')}</p>
                                {coach.bio && <p className="text-white/85 font-medium leading-relaxed mb-7">{coach.bio}</p>}
                                <button type="button" onClick={book} className="bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors" data-cta="book-now">Book now</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prices, times, specialities, terms */}
                <section className="py-14 md:py-20 bg-slate-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-5">Sessions and prices</h2>
                            {!formats.length && <p className="bg-white rounded-2xl border border-slate-200 p-5 text-sm font-semibold text-rr-charcoal">1-to-1 and training partner sessions. Ask {first} for prices when you get in touch.</p>}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {formats.map((f) => (
                                    <div key={f} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                                        <p className="text-lg font-black uppercase tracking-tight">{FORMAT_LABELS[f]}</p>
                                        <p className="text-sm text-slate-500 font-semibold mt-1">{FORMAT_BLURBS[f]}</p>
                                        <p className="mt-4"><span className="text-4xl font-black">{money(coachPrice(coach, f, 1))}</span> <span className="text-sm font-semibold text-slate-500">per one-hour session, incl. GST</span></p>
                                        {f === '1-2' && <p className="text-xs text-slate-500 font-medium mt-2">One family can pay for both players, or each family pays half.</p>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-3">Every session is in a Royals lane with {first}’s full coaching tools. Lane booked by {first} with the centre.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-3">What {first} coaches</h3>
                                <ul className="space-y-2 text-sm font-medium text-rr-charcoal">
                                    {coach.specialism && <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-rr-pink shrink-0" />{coach.specialism}</li>}
                                    <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-rr-pink shrink-0" />{coach.allAspects}</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-rr-pink shrink-0" />{TECH.title}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-3">Where and when</h3>
                                <ul className="space-y-2 text-sm font-medium text-rr-charcoal">
                                    {coach.centres.map((c) => { const x = centreOf(c); return <li key={c} className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-rr-pink shrink-0" />{x.name}{x.address ? `, ${x.address}` : ''}</li>; })}
                                    <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-rr-pink shrink-0" />{coach.normalTimes || `Times arranged directly with ${first}.`}</li>
                                </ul>
                            </div>
                        </div>

                        {coach.terms && (
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-3">{first}’s terms</h3>
                                <p className="text-sm font-medium text-rr-charcoal leading-relaxed whitespace-pre-line">{coach.terms}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-3">How it works</h3>
                            <ol className="grid sm:grid-cols-4 gap-3 text-sm font-medium text-rr-charcoal">
                                {[`Tap Book now and leave your details.`, `Contact ${first} (or ${first} contacts you) to agree your times.`, coach.payLinks ? `${first} books the lane and texts you a link to confirm and pay.` : `${first} books the lane and confirms your sessions.`, 'Train. Your player’s own data, every session.'].map((t, i) => (
                                    <li key={t} className="bg-white rounded-2xl border border-slate-200 p-4"><span className="block text-2xl font-black text-rr-pink mb-1">0{i + 1}</span>{t}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Book now */}
                <section id="book" className="py-14 md:py-20 scroll-mt-24">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-5">Book {first}</h2>
                        {done ? <Contact coach={coach} done={done} />
                            : open ? <Enquire coach={coach} onDone={setDone} />
                                : <button type="button" onClick={() => setOpen(true)} className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-colors">Book now</button>}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CoachPage;
