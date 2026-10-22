import React, { useEffect } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { CreditCard, CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { ROUTE, PAY_PAGE, REFUND_LINE, CONTACT_EMAIL, DATE_FULL, TIME, VENUE, ADDRESS_LINE, payUrlFor, CANCELLED } from './lpJrDayData';

// /lower-plenty-junior-royals-day/pay?booking=<registration id>
// The link to email a family who registered but didn't finish paying. The id
// is the row's random UUID (no personal details in the address); it goes to
// Stripe as client_reference_id so the webhook marks that row paid.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LowerPlentyJrDayPay = () => {
    const [params] = useSearchParams();
    const booking = params.get('booking') || '';

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Finish Paying | Junior Royals Are Coming to Lower Plenty';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    // Cancelled 23 Oct 2026: no "finish paying" link may reach Stripe. The page says it is cancelled.
    if (CANCELLED || !UUID.test(booking)) return <Navigate to={ROUTE} replace />;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans px-5 py-14 sm:py-20">
            <div className="max-w-xl mx-auto text-center">
                <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-3">{PAY_PAGE.eyebrow}</p>
                <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4">{PAY_PAGE.title}</h1>
                <p className="text-rr-charcoal text-base sm:text-lg font-medium leading-relaxed">{PAY_PAGE.body}</p>

                <ul className="text-left space-y-3 mt-8 border-t border-slate-200 pt-6">
                    <li className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                        <span className="text-[15px] font-semibold">{DATE_FULL}, {TIME}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                        <span className="text-[15px] font-semibold">
                            {VENUE.oval}, {VENUE.park}<br />
                            <span className="font-medium text-rr-charcoal">{ADDRESS_LINE}</span>
                        </span>
                    </li>
                </ul>

                {/* Same tab on purpose: in-app browsers refuse new tabs. */}
                <a
                    href={payUrlFor({ bookingId: booking })}
                    className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                >
                    <CreditCard className="w-4 h-4" /> {PAY_PAGE.button}
                </a>
                <p className="text-rr-charcoal/70 text-xs font-medium leading-relaxed mt-4">{PAY_PAGE.footnote} {REFUND_LINE}</p>
                <p className="text-rr-charcoal text-sm font-medium leading-relaxed mt-8">
                    Already paid, or a question? Email{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-rr-pink underline">{CONTACT_EMAIL}</a>.
                </p>
                <Link to={ROUTE} className="inline-flex items-center gap-2 text-rr-charcoal hover:text-rr-pink text-sm font-bold uppercase tracking-wider mt-6">
                    About the morning <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default LowerPlentyJrDayPay;
