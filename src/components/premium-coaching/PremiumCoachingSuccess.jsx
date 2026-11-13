import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { needsShirt, TRAINING_SHIRT } from '../../lib/kit/trainingShirt';
import { ROUTE, SUCCESS, centreOf, FORMATS } from './premiumCoachingData';

// After a booking REQUEST. Nothing is paid here (no payment links yet, Andy 13 Nov 2026),
// so this page fires no Purchase event. When payment arrives, the paid confirmation
// (with Purchase) belongs on the Stripe success redirect, and the shirt line stays.
const PremiumCoachingSuccess = () => {
    const { state } = useLocation();
    const s = state || {};
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const centre = centreOf(s.centre);
    const format = FORMATS.find((f) => f.value === s.format);
    const sizeNo = needsShirt(s.shirt) ? String(s.shirt.size).split(' ')[0] : null;

    const rows = [
        centre && ['Centre', `${centre.name}, ${centre.suburb}`],
        format && ['Format', `${format.label}: ${format.title.toLowerCase()}`],
        ['Coach', s.coachName ? `${s.coachName}${s.tierName ? ` (${s.tierName})` : ''}` : 'We will match you with a coach'],
        s.shirt?.has && ['Training shirt', sizeNo ? `Size ${sizeNo}, ordered with this booking (${TRAINING_SHIRT.priceLabel}, added to your first payment)` : 'Already has one'],
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
                    <p className="text-white/85 font-medium leading-relaxed mb-2">{SUCCESS.body}</p>
                    <p className="text-white/60 font-medium leading-relaxed mb-10">{SUCCESS.nothingPaid}</p>

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
