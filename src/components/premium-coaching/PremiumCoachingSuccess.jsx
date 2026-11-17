import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { ROUTE, SUCCESS, PROGRAM_NAME, AVAILABILITY_NOTE, centreOf, money } from './premiumCoachingData';
import { nightLabel, timeLabel } from './useCoachAvailability';

// After a booking. Two ways in:
//   • straight from the form (no payment link for that tier yet): router state;
//   • back from Stripe (?session_id=...): the form saved the booking in sessionStorage
//     before sending the family to Stripe. Purchase fires once, here, with the Stripe
//     session id as eventID so a refresh doesn't double count.
const PremiumCoachingSuccess = () => {
    const { state, search } = useLocation();
    const sessionId = new URLSearchParams(search).get('session_id');
    const s = useMemo(() => {
        if (state) return state;
        try { return JSON.parse(sessionStorage.getItem('premium_pc_booking') || '{}'); } catch { return {}; }
    }, [state]);
    const paid = !!sessionId;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!paid) return;
        try {
            const key = `premium_pc_purchase_${sessionId}`;
            if (typeof window.fbq === 'function' && !sessionStorage.getItem(key)) {
                window.fbq('track', 'Purchase', { content_name: PROGRAM_NAME, value: s.total || 0, currency: 'AUD' }, { eventID: sessionId });
                sessionStorage.setItem(key, '1');
            }
        } catch { /* never blocks the page */ }
    }, [paid, sessionId, s.total]);

    const centre = centreOf(s.centre);
    const sizeNo = needsShirt(s.shirt) ? String(s.shirt.size).split(' ')[0] : null;
    const rows = [
        ['Coach', s.coachName ? `${s.coachName}${s.tierName ? ` (${s.tierName})` : ''}` : 'We will match you with a coach'],
        centre && ['Centre', `${centre.name}, ${centre.suburb}`],
        s.format && ['Format', s.format === '1-2' ? '1-to-2, shared with a training partner' : '1-to-1'],
        s.sessions > 0 && s.per != null && ['Package', `${s.sessions} session${s.sessions > 1 ? 's' : ''} × ${money(s.per)} = ${money(s.total)} incl. GST${s.format === '1-2' ? ` (${money(s.total / 2)} each family)` : ''}`],
        s.picked?.length > 0 && ['Times requested', s.picked.map((p) => `${nightLabel(p.date)} ${timeLabel(p.start)}`).join(', ')],
        s.shirt?.has && ['Training shirt', sizeNo ? `Size ${sizeNo}, ordered with this booking (${TRAINING_SHIRT.priceLabel})` : 'Already has one'],
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar variant="private-coaching" navLinksOverride={[]} ctaLabelOverride="WHAT HAPPENS NEXT" ctaTargetOverride="next" />
            <main className="flex-1 bg-rr-dark pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-xl mx-auto text-center">
                    <span className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">
                        {SUCCESS.title}{s.first ? `, ${s.first}` : ''}
                    </h1>
                    <p className="text-white/85 font-medium leading-relaxed mb-2">{paid ? SUCCESS.paid : SUCCESS.body}</p>
                    <p className="text-white/60 font-medium leading-relaxed mb-10">{paid ? AVAILABILITY_NOTE : SUCCESS.nothingPaid}</p>

                    {rows.length > 1 && (
                        <dl className="text-left bg-white rounded-2xl p-6 space-y-4 mb-10">
                            {rows.map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-[11px] font-black uppercase tracking-widest text-rr-pink">{k}</dt>
                                    <dd className="text-rr-dark font-semibold text-sm">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    <Link id="next" to={ROUTE} className="inline-block text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-white/30 hover:border-white transition-colors">
                        Back to Royals Private Coaching
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PremiumCoachingSuccess;
