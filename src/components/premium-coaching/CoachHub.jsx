import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Mail, Copy, Check, Plus, X } from 'lucide-react';
import { FORMAT_LABELS, PACKAGES, coachOf, coachPrice, money, coachPath } from './premiumCoachingData';
import { nightLabel, timeLabel } from './useCoachAvailability';
import { Field } from './pcUi';
import { input, labelCls, waDigits, telHref } from './pcHelpers';

// The coach's own page (Andy, 22 Nov 2026, coach-led flow): "a page of everything".
// /private-coaching-<coach>/coach?t=<secret>, linked from every enquiry email.
//  • Enquiries: who wants coaching, one tap to call / text / WhatsApp them.
//  • Record a booking once the times are agreed → pay link(s) to send (copy / text /
//    WhatsApp / email). Training partner sessions: one family pays all (+ partner form
//    link), or each family pays half (a pay link each).
//  • Bookings: paid or waiting; after each session tick "Turned up" (releases the coach's
//    and the venue's pay) or "No-show".

const API = '/api/private-coaching-coach';
const card = 'bg-white rounded-3xl p-5 sm:p-6 border border-slate-200';
const chip = (on) => `px-4 py-2.5 rounded-xl border-2 text-sm font-black transition-colors ${on ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 text-rr-dark hover:border-rr-pink/50'}`;
const ago = (d) => new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });

const Share = ({ url, phone, email, name, coachName, what }) => {
    const [copied, setCopied] = useState(false);
    const text = `Hi ${name || ''}, it's ${coachName} from the Rajasthan Royals Academy. Here's the link to ${what}: ${url}`;
    const b = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white';
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" className={`${b} bg-rr-dark`} onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy link'}</button>
            {phone && <a className={`${b} bg-[#1226AA]`} href={`sms:${String(phone).replace(/[^\d+]/g, '')}?&body=${encodeURIComponent(text)}`}><MessageCircle className="w-3.5 h-3.5" />Text</a>}
            {phone && <a className={`${b} bg-[#1A9E52]`} href={`https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</a>}
            {email && <a className={`${b} bg-rr-pink`} href={`mailto:${email}?subject=${encodeURIComponent('Your Royals private coaching')}&body=${encodeURIComponent(text)}`}><Mail className="w-3.5 h-3.5" />Email</a>}
        </div>
    );
};

const blank = (sessions) => Array.from({ length: sessions }, () => ({ date: '', start: '' }));
const EMPTY = {
    enquiry_id: '', player_first_name: '', player_last_name: '', parent_name: '', email: '', phone: '',
    centre: '', format: '1-1', sessions: 1, split: false, partner: '',
    partner_first_name: '', partner_last_name: '', partner_parent_name: '', partner_email: '', partner_phone: '',
    times: blank(1), times_note: '', notes: '',
};

const NewBooking = ({ t, coach, centres, prefill, onCreated, onCancel }) => {
    const [f, setF] = useState(() => ({ ...EMPTY, centre: centres[0]?.slug || '', ...prefill }));
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
    const setSessions = (n) => setF((x) => ({ ...x, sessions: n, times: [...x.times, ...blank(n)].slice(0, n) }));
    const setTime = (i, k, v) => setF((x) => ({ ...x, times: x.times.map((tm, j) => (j === i ? { ...tm, [k]: v } : tm)) }));
    const per = coachPrice(coach, f.format, f.sessions);
    const share = f.format === '1-2' && f.split ? 2 : 1;

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true); setErr('');
        try {
            const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t, action: 'create_booking', ...f }) });
            const out = await r.json().catch(() => ({}));
            if (!r.ok) throw new Error(out.error || 'Could not save.');
            onCreated({ ...out, form: f });
        } catch (x) { setErr(x.message); }
        setBusy(false);
    };

    return (
        <form onSubmit={submit} noValidate className={`${card} space-y-5`} data-new-booking>
            <div className="flex justify-between items-start"><h2 className="text-xl font-black uppercase tracking-tight">Record a booking</h2><button type="button" onClick={onCancel} aria-label="Close"><X className="w-5 h-5" /></button></div>
            <p className="text-sm text-rr-charcoal font-medium -mt-3">Once you’ve agreed the times with the family and booked the lane, record it here. You’ll get a link to send them to confirm and pay.</p>

            <div><p className={labelCls}>Centre</p><div className="flex flex-wrap gap-2">{centres.map((c) => <button key={c.slug} type="button" className={chip(f.centre === c.slug)} onClick={() => setF((x) => ({ ...x, centre: c.slug }))}>{c.suburb}</button>)}</div></div>
            <div><p className={labelCls}>Session</p><div className="flex flex-wrap gap-2">{['1-1', '1-2'].filter((x) => coachPrice(coach, x, 1) != null).map((x) => <button key={x} type="button" className={chip(f.format === x)} onClick={() => setF((y) => ({ ...y, format: x }))}>{FORMAT_LABELS[x]} · {money(coachPrice(coach, x, 1))}</button>)}</div></div>
            <div><p className={labelCls}>How many sessions</p><div className="flex flex-wrap gap-2">{PACKAGES.map((p) => <button key={p.sessions} type="button" className={chip(f.sessions === p.sessions)} onClick={() => setSessions(p.sessions)}>{p.label}</button>)}</div></div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Field id="player_first_name" label="Player first name"><input id="player_first_name" value={f.player_first_name} onChange={set('player_first_name')} className={input(false)} /></Field>
                <Field id="player_last_name" label="Player last name" optional><input id="player_last_name" value={f.player_last_name} onChange={set('player_last_name')} className={input(false)} /></Field>
                <Field id="parent_name" label="Parent name" optional><input id="parent_name" value={f.parent_name} onChange={set('parent_name')} className={input(false)} /></Field>
                <Field id="phone" label="Family mobile"><input id="phone" type="tel" value={f.phone} onChange={set('phone')} className={input(false)} /></Field>
                <Field id="email" label="Family email"><input id="email" type="email" value={f.email} onChange={set('email')} className={input(false)} /></Field>
            </div>

            {f.format === '1-2' && (
                <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                    <p className={labelCls}>Who pays?</p>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className={chip(!f.split)} onClick={() => setF((x) => ({ ...x, split: false }))}>This family pays all</button>
                        <button type="button" className={chip(f.split)} onClick={() => setF((x) => ({ ...x, split: true }))}>Each family pays half</button>
                    </div>
                    {!f.split
                        ? <Field id="partner" label="Training partner (name and age)" hint="Their family gets a short form link (agreements and shirt) to fill in before the first session."><input id="partner" value={f.partner} onChange={set('partner')} className={input(false)} /></Field>
                        : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field id="partner_first_name" label="Partner first name"><input id="partner_first_name" value={f.partner_first_name} onChange={set('partner_first_name')} className={input(false)} /></Field>
                                <Field id="partner_last_name" label="Partner last name" optional><input id="partner_last_name" value={f.partner_last_name} onChange={set('partner_last_name')} className={input(false)} /></Field>
                                <Field id="partner_parent_name" label="Partner’s parent" optional><input id="partner_parent_name" value={f.partner_parent_name} onChange={set('partner_parent_name')} className={input(false)} /></Field>
                                <Field id="partner_phone" label="Partner family mobile"><input id="partner_phone" type="tel" value={f.partner_phone} onChange={set('partner_phone')} className={input(false)} /></Field>
                                <Field id="partner_email" label="Partner family email"><input id="partner_email" type="email" value={f.partner_email} onChange={set('partner_email')} className={input(false)} /></Field>
                            </div>
                        )}
                </div>
            )}

            <div>
                <p className={labelCls}>Agreed dates and times</p>
                <div className="space-y-2">
                    {f.times.map((tm, i) => (
                        <div key={i} className="grid grid-cols-[2rem_1fr_7rem] gap-2 items-center">
                            <span className="text-xs font-black text-slate-400">#{i + 1}</span>
                            <input type="date" aria-label={`Session ${i + 1} date`} value={tm.date} onChange={(e) => setTime(i, 'date', e.target.value)} className={input(false)} />
                            <input type="time" aria-label={`Session ${i + 1} time`} step={900} value={tm.start} onChange={(e) => setTime(i, 'start', e.target.value)} className={input(false)} />
                        </div>
                    ))}
                </div>
                <div className="mt-3"><Field id="times_note" label="Or a note about the times" optional hint="e.g. Tuesdays 5pm for 3 weeks from 2 Dec"><input id="times_note" value={f.times_note} onChange={set('times_note')} className={input(false)} /></Field></div>
            </div>

            {per != null && (
                <div className="rounded-2xl bg-rr-dark text-white p-4 text-sm">
                    <div className="flex justify-between"><span>{f.sessions} × {FORMAT_LABELS[f.format]}</span><span className="font-black">{money(per * f.sessions)}</span></div>
                    {share === 2 && <p className="text-white/70 mt-1">Each family pays {money((per * f.sessions) / 2)}.</p>}
                    <p className="text-white/60 text-xs mt-1">Plus $29.95 if they need a training shirt (asked on the pay page).</p>
                </div>
            )}
            {err && <p className="text-red-600 text-sm font-semibold">{err}</p>}
            <button type="submit" disabled={busy} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full">{busy ? 'Saving…' : 'Save and get the pay link'}</button>
        </form>
    );
};

const Created = ({ c, coach, onClose }) => {
    const f = c.form;
    return (
        <div className={`${card} space-y-4 border-green-300`} data-created>
            <div className="flex justify-between"><h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><Check className="w-6 h-6 text-green-600" />Saved. Now send the link</h2><button type="button" onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button></div>
            <div>
                <p className="font-bold">{f.player_first_name}’s family{c.partner ? ' (their half)' : ''}</p>
                <p className="text-xs text-slate-500 break-all">{c.pay_url}</p>
                <Share url={c.pay_url} phone={f.phone} email={f.email} name={f.parent_name || f.player_first_name} coachName={coach.name} what="confirm and pay for your private coaching" />
            </div>
            {c.partner && (
                <div>
                    <p className="font-bold">{f.partner_first_name}’s family (their half)</p>
                    <p className="text-xs text-slate-500 break-all">{c.partner.pay_url}</p>
                    <Share url={c.partner.pay_url} phone={f.partner_phone} email={f.partner_email} name={f.partner_parent_name || f.partner_first_name} coachName={coach.name} what="confirm and pay for your half of the training partner sessions" />
                </div>
            )}
            <p className="text-xs text-slate-500 font-medium">You’ll get an email as soon as they’ve paid. It’s also below under Bookings.</p>
        </div>
    );
};

const Booking = ({ b, coach, partnerFormUrl, onMark }) => {
    const paid = b.payment_status === 'paid';
    const who = `${b.player_first_name} ${b.player_last_name || ''}`.trim();
    const times = b.selected_slots?.length ? b.selected_slots.map((s) => `${nightLabel(s.date)} ${timeLabel(s.start)}`).join(', ') : b.availability;
    return (
        <div className={card} data-booking={b.id}>
            <div className="flex flex-wrap justify-between gap-2 items-start">
                <div>
                    <p className="font-black text-lg">{who}{b.format === '1-2' && b.other_players ? <span className="font-semibold text-slate-500"> + {b.other_players}</span> : null}</p>
                    <p className="text-sm text-slate-500 font-semibold">{b.package_sessions} × {FORMAT_LABELS[b.format]}{b.pay_share === 2 ? ' (half each)' : ''} · {money(b.package_total)}</p>
                    {times && <p className="text-sm text-rr-charcoal font-medium mt-1">{times}</p>}
                </div>
                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{paid ? 'Paid' : 'Waiting for payment'}</span>
            </div>
            {!paid && <Share url={b.pay_url} phone={b.phone} email={b.email} name={b.parent_name || b.player_first_name} coachName={coach.name} what="confirm and pay for your private coaching" />}
            {paid && b.format === '1-2' && b.pay_share !== 2 && b.created_by === 'coach' && (
                <div className="mt-3"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Training partner form</p><Share url={`${partnerFormUrl}${b.id}`} coachName={coach.name} what="fill in your training partner form before the first session" /></div>
            )}
            {paid && b.sessions?.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">After each session</p>
                    {b.sessions.map((s) => (
                        <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5" data-session={s.id}>
                            <span className="text-sm font-bold">Session {s.seq}{s.session_date ? `: ${nightLabel(s.session_date)}${s.start_time ? ` ${timeLabel(s.start_time.slice(0, 5))}` : ''}` : ''}</span>
                            {s.status === 'scheduled' ? (
                                <span className="flex gap-2">
                                    <button type="button" onClick={() => onMark(s, 'attended')} className="px-3 py-2 rounded-full bg-green-600 text-white text-xs font-black uppercase tracking-wider">Turned up</button>
                                    <button type="button" onClick={() => onMark(s, 'no_show')} className="px-3 py-2 rounded-full bg-slate-300 text-rr-dark text-xs font-black uppercase tracking-wider">No-show</button>
                                </span>
                            ) : <span className={`text-xs font-black uppercase tracking-wider ${s.status === 'attended' ? 'text-green-700' : 'text-slate-500'}`}>{s.status === 'attended' ? '✓ Turned up' : 'No-show'}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CoachHub = ({ slug }) => {
    const t = new URLSearchParams(useLocation().search).get('t') || '';
    const coach = coachOf(slug);
    const [data, setData] = useState(null);
    const [err, setErr] = useState('');
    const [form, setForm] = useState(null); // prefill object when open
    const [created, setCreated] = useState(null);

    const load = useCallback(() => fetch(`${API}?t=${encodeURIComponent(t)}`)
        .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Could not load.'); setData(j); })
        .catch((e) => setErr(e.message)), [t]);
    useEffect(() => { load(); }, [load]);

    const post = async (body) => {
        const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t, ...body }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) alert(j.error || 'Something went wrong.');
        await load();
        return j;
    };
    const mark = (s, status) => {
        const q = status === 'attended' ? `Confirm the player turned up to session ${s.seq}? This releases your pay and the lane hire for it.` : `Mark session ${s.seq} as a no-show? The Academy will follow up.`;
        if (window.confirm(q)) post({ action: 'mark', session_id: s.id, status });
    };

    if (!coach) return null;
    if (err) return <div className="min-h-screen bg-slate-50 p-6"><p className="max-w-xl mx-auto bg-white rounded-2xl p-6 font-semibold">{err}</p></div>;
    if (!data) return <div className="min-h-screen bg-slate-50 p-6 text-slate-500 font-semibold">Loading…</div>;
    const first = coach.name.split(' ')[0];
    const publicUrl = `${window.location.origin}${coachPath(coach.slug)}`;
    const newEnq = data.enquiries.filter((q) => q.status === 'new' || q.status === 'contacted');

    return (
        <div className="min-h-screen bg-slate-50 text-rr-dark font-sans" data-coach-hub>
            <header className="bg-rr-dark text-white px-4 sm:px-6 py-6">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-rr-light-pink mb-1">Royals Private Coaching</p>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Hi {first}</h1>
                    <p className="text-sm text-white/70 font-medium mt-1">Your enquiries, pay links and sessions. Keep this link private.</p>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {!form && !created && <button type="button" onClick={() => setForm({})} className="w-full flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-6 py-4 rounded-full"><Plus className="w-5 h-5" />Record a booking</button>}
                {form && <NewBooking t={t} coach={coach} centres={data.centres} prefill={form} onCancel={() => setForm(null)} onCreated={(c) => { setForm(null); setCreated(c); load(); }} />}
                {created && <Created c={created} coach={coach} onClose={() => setCreated(null)} />}

                <section>
                    <h2 className="text-sm font-black uppercase tracking-widest mb-3">Enquiries ({newEnq.length})</h2>
                    {newEnq.length === 0 && <p className="text-sm text-slate-500 font-medium">No new enquiries. Share your page: <span className="break-all">{publicUrl}</span></p>}
                    <div className="space-y-3">
                        {newEnq.map((q) => (
                            <div key={q.id} className={card} data-enquiry-row={q.id}>
                                <div className="flex flex-wrap justify-between gap-2">
                                    <div>
                                        <p className="font-black text-lg">{q.parent_name}{q.player_name ? <span className="font-semibold text-slate-500"> for {q.player_name}</span> : null}</p>
                                        <p className="text-sm text-slate-500 font-semibold">{q.suburb} · {ago(q.created_at)}{q.status === 'contacted' ? ' · contacted' : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={telHref(q.phone)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-rr-dark text-white text-xs font-black uppercase"><Phone className="w-3.5 h-3.5" />Call</a>
                                        <a href={`https://wa.me/${waDigits(q.phone)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1A9E52] text-white text-xs font-black uppercase"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</a>
                                    </div>
                                </div>
                                <p className="text-sm font-medium mt-1">{q.phone} · <span className="break-all">{q.email}</span></p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <button type="button" onClick={() => { const [fn, ...ln] = String(q.player_name || q.parent_name).split(' '); setCreated(null); setForm({ enquiry_id: q.id, player_first_name: fn, player_last_name: ln.join(' '), parent_name: q.player_name ? q.parent_name : '', email: q.email, phone: q.phone }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-4 py-2 rounded-full bg-rr-pink text-white text-xs font-black uppercase tracking-wider">Record booking</button>
                                    {q.status === 'new' && <button type="button" onClick={() => post({ action: 'enquiry_status', id: q.id, status: 'contacted' })} className="px-4 py-2 rounded-full bg-slate-200 text-xs font-black uppercase tracking-wider">Mark contacted</button>}
                                    <button type="button" onClick={() => post({ action: 'enquiry_status', id: q.id, status: 'closed' })} className="px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider">Not going ahead</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-black uppercase tracking-widest mb-3">Bookings</h2>
                    {data.bookings.length === 0 && <p className="text-sm text-slate-500 font-medium">None yet.</p>}
                    <div className="space-y-3">{data.bookings.map((b) => <Booking key={b.id} b={b} coach={coach} partnerFormUrl={data.partnerFormUrl} onMark={mark} />)}</div>
                </section>
                {!data.coach.stripeConnected && <p className="text-xs text-slate-500 font-medium">Your Stripe payout account isn’t connected yet, so ticks are recorded and paid once it is. The Academy will send you a setup link.</p>}
            </main>
        </div>
    );
};

export default CoachHub;
