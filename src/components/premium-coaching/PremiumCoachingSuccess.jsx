import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { ROUTE, SUCCESS, PROGRAM_NAME, centreOf, money } from './premiumCoachingData';
import { nightLabel, timeLabel } from './useCoachAvailability';

// Back from Stripe (?session_id=…&b=<booking id>). The booking details were saved in
// sessionStorage before the family went to Stripe. Purchase fires once, here, with the
// Stripe session id as eventID. We also ping the coach alert, which only sends once the
// webhook has marked the booking paid (the 10-minute job catches it otherwise).
// 1-to-2: the booker is given the second player's form link to send to the other family
// (Andy, 18 Nov 2026: they must complete it before the first session).
const PremiumCoachingSuccess = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const sessionId = params.get('session_id');
    const bookingId = params.get('b');
    const s = useMemo(() => {
        try { return JSON.parse(sessionStorage.getItem('premium_pc_booking') || '{}'); } catch { return {}; }
    }, []);
    const paid = !!sessionId;
    const [copied, setCopied] = useState(false);
    const partnerLink = bookingId ? `${window.location.origin}${ROUTE}/partner?b=${bookingId}` : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!paid) return;
        try {
            const key = `premium_pc_purchase_${sessionId}`;
            if (typeof window.fbq === 'function' && !sessionStorage.getItem(key)) {
                const total = (s.total || 0) + (needsShirt(s.shirt) ? TRAINING_SHIRT.price : 0);
                window.fbq('track', 'Purchase', { content_name: PROGRAM_NAME, value: total, currency: 'AUD' }, { eventID: sessionId });
                sessionStorage.setItem(key, '1');
            }
        } catch { /* never blocks the page */ }
        if (bookingId) {
            // Give the webhook a moment, then ask for the coach alert.
            const t = setTimeout(() => {
                fetch('/api/notify-private-coaching-bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: bookingId }) }).catch(() => {});
            }, 4000);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [paid, sessionId, bookingId, s.total, s.shirt]);

    const centre = centreOf(s.centre);
    const sizeNo = needsShirt(s.shirt) ? String(s.shirt.size).split(' ')[0] : null;
    const rows = [
        s.coachName && ['Coach', s.coachName],
        centre && ['Centre', `${centre.name}, ${centre.suburb}`],
        s.format && ['Format', s.format === '1-2' ? `1-to-2 with ${s.partner || 'a training partner'}` : '1-to-1'],
        s.sessions > 0 && s.per != null && ['Sessions', `${s.sessions} × ${money(s.per)} = ${money(s.total)} incl. GST`],
        s.picked?.length > 0 && ['Your times', s.picked.map((p) => `${nightLabel(p.date)} ${timeLabel(p.start)}`).join(', ')],
        s.shirt?.has && ['Training shirt', sizeNo ? `Size ${sizeNo}, ordered with this booking (${TRAINING_SHIRT.priceLabel})` : 'Already has one'],
    ].filter(Boolean);

    const share = async () => {
        try { await navigator.clipboard.writeText(partnerLink); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ }
    };
    const waText = encodeURIComponent(`Hi! I've booked our Royals private coaching sessions. Before the first session, please fill in this short form for your player: ${partnerLink}`);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="WHAT HAPPENS NEXT" ctaTargetOverride="next" />
            <main className="flex-1 bg-rr-dark pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-xl mx-auto text-center">
                    <span className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">
                        {paid ? `${SUCCESS.title}${s.first ? `, ${s.first}` : ''}` : 'Payment not finished'}
                    </h1>
                    <p className="text-white/85 font-medium leading-relaxed mb-10">{paid ? SUCCESS.paid : SUCCESS.unpaid}</p>

                    {paid && s.format === '1-2' && partnerLink && (
                        <div className="text-left rounded-2xl p-6 mb-8 border-2 border-rr-pink bg-white" data-partner-link>
                            <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-1">Important</p>
                            <h2 className="text-lg font-black text-rr-dark mb-2">{SUCCESS.partnerTitle}</h2>
                            <p className="text-sm text-rr-charcoal font-medium leading-relaxed mb-4">{SUCCESS.partnerBody}</p>
                            <p className="text-xs font-mono bg-slate-100 rounded-lg px-3 py-2 text-rr-dark break-all mb-3">{partnerLink}</p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={share} className="inline-flex items-center gap-1.5 bg-rr-dark text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy link'}
                                </button>
                                <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer" className="bg-[#1A9E52] text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full">Send by WhatsApp</a>
                                <a href={`sms:?&body=${waText}`} className="bg-rr-blue text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full">Send by text</a>
                            </div>
                        </div>
                    )}

                    {paid && rows.length > 1 && (
                        <dl className="text-left bg-white rounded-2xl p-6 space-y-4 mb-10">
                            {rows.map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-[11px] font-black uppercase tracking-widest text-rr-pink">{k}</dt>
                                    <dd className="text-rr-dark font-semibold text-sm">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    <Link id="next" to={paid ? ROUTE : `${ROUTE}#request`} className="inline-block text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/30 hover:border-white transition-colors">
                        {paid ? 'Back to Royals Private Coaching' : 'Book again'}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PremiumCoachingSuccess;
