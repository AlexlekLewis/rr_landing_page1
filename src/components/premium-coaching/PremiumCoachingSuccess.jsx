import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Copy, Check, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { SMS_NUMBER, SMS_DISPLAY, INFO_EMAIL } from '../../lib/academyContact';
import { ROUTE, SUCCESS, PROGRAM_NAME, centreOf, money } from './premiumCoachingData';
import { nightLabel, timeLabel } from './useCoachAvailability';
import { waDigits, telHref } from './pcHelpers';

// The confirmation page every Royals Private Coaching payment lands on (Andy, 22 Nov 2026:
// "a purpose-built confirmation page to say thank you … and a pixel"). Stripe sends families
// here: /private-coaching/success?session_id=…&b=<booking id>.
//  1. Confirms the payment with Stripe (api/notify-private-coaching-bookings.js marks the
//     booking paid if the webhook hasn't yet, and emails the coach).
//  2. Reads the booking from the server (works on any device, not just the one that booked).
//  3. Fires the Meta Purchase pixel once, with the amount actually paid and the Stripe
//     session id as eventID.
//  4. Thank you, what was booked, what happens next, and who to contact: the coach, a text to
//     the Academy (Text Us number), or info@rramelbourne.com.

const PremiumCoachingSuccess = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const sessionId = params.get('session_id');
    const bookingId = params.get('b');
    const local = useMemo(() => {
        try { return JSON.parse(sessionStorage.getItem('premium_pc_booking') || '{}'); } catch { return {}; }
    }, []);
    const [info, setInfo] = useState(null);
    const [copied, setCopied] = useState(false);
    const fired = useRef(false);
    const paid = !!sessionId;

    // Confirm with Stripe, then load the booking (retry once in case Stripe is a moment behind).
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!paid || !bookingId) return undefined;
        let stop = false;
        const load = () => fetch(`/api/private-coaching-pay?b=${encodeURIComponent(bookingId)}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
        (async () => {
            await fetch('/api/notify-private-coaching-bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: bookingId, session_id: sessionId }) }).catch(() => {});
            let j = await load();
            if (!j?.paid) { await new Promise((r) => setTimeout(r, 3000)); j = (await load()) || j; }
            if (!stop && j) setInfo(j);
        })();
        return () => { stop = true; };
    }, [paid, bookingId, sessionId]);

    // Meta Purchase pixel: once per Stripe session, with the real amount paid.
    useEffect(() => {
        if (!paid || fired.current) return undefined;
        const fire = (value) => {
            if (fired.current) return;
            fired.current = true;
            try {
                const key = `premium_pc_purchase_${sessionId}`;
                if (typeof window.fbq === 'function' && !sessionStorage.getItem(key)) {
                    window.fbq('track', 'Purchase', { content_name: PROGRAM_NAME, content_category: 'Private coaching', value: Number(value) || 0, currency: 'AUD' }, { eventID: sessionId });
                    sessionStorage.setItem(key, '1');
                }
            } catch { /* never blocks the page */ }
        };
        if (info?.amountPaidCents) { fire(info.amountPaidCents / 100); return undefined; }
        // Fallback if the server can't say yet: what the family saw before paying.
        const t = setTimeout(() => fire((local.total || 0) + (needsShirt(local.shirt) ? TRAINING_SHIRT.price : 0)), 8000);
        return () => clearTimeout(t);
    }, [paid, sessionId, info, local]);

    const coachName = info?.coach?.name || local.coachName;
    const first = coachName?.split(' ')[0];
    const player = info?.details?.player_first_name || local.first;
    const centre = info?.centre?.name ? info.centre : centreOf(local.centre);
    const format = info?.format || local.format;
    const share = info?.share || local.share;
    const sessions = info?.sessions || local.sessions;
    const per = info?.per ?? local.per;
    const times = info ? (info.times?.length ? info.times : null) : (local.picked?.length ? local.picked : null);
    const timesNote = info?.timesNote;
    const shirtSize = info ? info.shirtSize : (needsShirt(local.shirt) ? local.shirt.size : null);
    const partner = info?.partner || local.partner;
    const partnerLink = bookingId ? `${window.location.origin}${ROUTE}/partner?b=${bookingId}` : null;
    const contact = info?.contact;

    const rows = [
        coachName && ['Coach', coachName],
        centre?.name && ['Where', `${centre.name}${centre.address ? `, ${centre.address}` : centre.suburb ? `, ${centre.suburb}` : ''}`],
        format && ['Session', `${format === '1-2' ? `Training partner session${partner ? ` with ${partner}` : ''}` : '1-to-1'}${share === 2 ? ' (your half)' : ''}`],
        sessions > 0 && per != null && ['Sessions', `${sessions} × ${money(per)}`],
        times && ['Times', times.map((p) => `${nightLabel(p.date)} ${timeLabel(p.start)}`).join(', ')],
        !times && timesNote && ['Times', timesNote],
        !times && !timesNote && first && ['Times', `${first} will contact you within 24 hours to lock them in`],
        (info || local.shirt?.has) && ['Training shirt', shirtSize ? `Size ${String(shirtSize).split(' ')[0]}, ordered with this booking (${TRAINING_SHIRT.priceLabel})` : 'Already has one'],
        info?.amountPaidCents && ['Paid', `${money(info.amountPaidCents / 100)} incl. GST`],
    ].filter(Boolean);

    const copy = async () => { try { await navigator.clipboard.writeText(partnerLink); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ } };
    const waText = encodeURIComponent(`Hi! I've booked our Royals private coaching sessions. Before the first session, please fill in this short form for your player: ${partnerLink}`);
    const pill = 'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-white';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="WHAT HAPPENS NEXT" ctaTargetOverride="next" />
            <main className="flex-1 bg-rr-dark pt-32 pb-24 px-4 sm:px-6" data-confirmation>
                <div className="max-w-xl mx-auto">
                    <div className="text-center">
                        <span className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">
                            {paid ? <>Thank you{info?.details?.parent_name ? `, ${info.details.parent_name.split(' ')[0]}` : ''}</> : 'Payment not finished'}
                        </h1>
                        <p className="text-white/85 font-medium leading-relaxed mb-10">
                            {paid
                                ? <>{player ? `${player} is booked in` : 'You’re booked in'}{coachName ? ` with ${coachName}` : ''}. Payment received{info?.amountPaidCents ? ` (${money(info.amountPaidCents / 100)})` : ''}. {first ? `${first} has been told.` : 'Your coach has been told.'}</>
                                : SUCCESS.unpaid}
                        </p>
                    </div>

                    {paid && format === '1-2' && share !== 2 && partnerLink && (
                        <div className="rounded-2xl p-6 mb-6 border-2 border-rr-pink bg-white" data-partner-link>
                            <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-1">Important</p>
                            <h2 className="text-lg font-black text-rr-dark mb-2">{SUCCESS.partnerTitle}</h2>
                            <p className="text-sm text-rr-charcoal font-medium leading-relaxed mb-4">{SUCCESS.partnerBody}</p>
                            <p className="text-xs font-mono bg-slate-100 rounded-lg px-3 py-2 text-rr-dark break-all mb-3">{partnerLink}</p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={copy} className={`${pill} bg-rr-dark`}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy link'}</button>
                                <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer" className={`${pill} bg-[#1A9E52]`}>Send by WhatsApp</a>
                                <a href={`sms:?&body=${waText}`} className={`${pill} bg-rr-blue`}>Send by text</a>
                            </div>
                        </div>
                    )}

                    {paid && rows.length > 0 && (
                        <dl className="bg-white rounded-2xl p-6 space-y-4 mb-6" data-booking-summary>
                            <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink -mb-1">Your booking</p>
                            {rows.map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-[11px] font-black uppercase tracking-widest text-slate-500">{k}</dt>
                                    <dd className="text-rr-dark font-semibold text-sm">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {paid && (
                        <div id="next" className="bg-white rounded-2xl p-6 mb-6 scroll-mt-28">
                            <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-2">What happens next</p>
                            <ul className="space-y-2 text-sm font-medium text-rr-charcoal">
                                <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />{times ? `${first || 'Your coach'} will see you at your first session.` : `${first || 'Your coach'} will be in touch to confirm your times.`}</li>
                                {centre?.name && <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />Your sessions are at {centre.name}{centre.address ? `, ${centre.address}` : ''}.</li>}
                                {shirtSize && <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />{player ? `${player}’s` : 'Your'} training shirt (size {String(shirtSize).split(' ')[0]}) is ordered with this booking.</li>}
                            </ul>
                        </div>
                    )}

                    {/* Questions: the coach, the Academy by text, or email */}
                    <div className="bg-white/5 border border-white/15 rounded-2xl p-6 mb-10" data-contacts>
                        <p className="text-[11px] font-black uppercase tracking-widest text-rr-light-pink mb-4">Any questions?</p>
                        <div className="space-y-5">
                            {coachName && (contact?.mobile || contact?.email) && (
                                <div>
                                    <p className="text-white font-black">Your coach, {coachName}</p>
                                    {contact.mobile && <p className="text-white/80 text-sm font-semibold">{contact.mobile}</p>}
                                    {contact.email && <p className="text-white/80 text-sm font-semibold break-all">{contact.email}</p>}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {contact.mobile && <a href={telHref(contact.mobile)} className={`${pill} bg-white/15`}><Phone className="w-3.5 h-3.5" />Call</a>}
                                        {contact.mobile && <a href={`https://wa.me/${waDigits(contact.mobile)}`} target="_blank" rel="noreferrer" className={`${pill} bg-[#1A9E52]`}><MessageCircle className="w-3.5 h-3.5" />WhatsApp</a>}
                                        {contact.email && <a href={`mailto:${contact.email}`} className={`${pill} bg-white/15`}><Mail className="w-3.5 h-3.5" />Email</a>}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-white font-black">Text the Academy</p>
                                <p className="text-white/80 text-sm font-semibold">{SMS_DISPLAY}</p>
                                <a href={`sms:${SMS_NUMBER}`} className={`${pill} bg-rr-pink mt-2`}><MessageCircle className="w-3.5 h-3.5" />Text us</a>
                            </div>
                            <div>
                                <p className="text-white font-black">Email the Academy</p>
                                <a href={`mailto:${INFO_EMAIL}`} className="text-rr-light-pink text-sm font-semibold underline underline-offset-2">{INFO_EMAIL}</a>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to={ROUTE} className="inline-block text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/30 hover:border-white transition-colors">Back to Royals Private Coaching</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PremiumCoachingSuccess;
