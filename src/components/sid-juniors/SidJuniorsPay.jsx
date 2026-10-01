import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { previewBooking, startCheckout } from '../../lib/startCheckout';
import { ROUTE, SUCCESS_ROUTE, CONTACT_EMAIL, SID_NAME, SID_CAVEAT } from './sidJuniorsData';

// /sid-juniors/pay?booking=<row id> — pay for a booking that is already saved.
// Used for:
//   • booking requests made before the page took payment (we email each family
//     their own link), and
//   • a parent who left Stripe Checkout without paying (Stripe's cancel page
//     returns here with &cancelled=1).
// The booking, price and product are read on the server by /api/program-checkout.
const linkClass = 'text-rr-light-pink underline hover:text-white';

const SidJuniorsPay = () => {
    const [params] = useSearchParams();
    const bookingId = params.get('booking') || '';
    const cancelled = params.get('cancelled') === '1';
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Pay For Your Place | Junior Sessions with ${SID_NAME}`;
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    useEffect(() => {
        let live = true;
        previewBooking(bookingId)
            .then((b) => { if (live) setBooking(b); })
            .catch((e) => { if (live) setError(e.message); });
        return () => { live = false; };
    }, [bookingId]);

    const pay = async () => {
        setError(null);
        setPaying(true);
        try {
            await startCheckout({ bookingId, product: booking.product });
        } catch (e) {
            setError(e.message);
            setPaying(false);
        }
    };

    const price = booking ? `$${(booking.amountCents / 100).toFixed(booking.amountCents % 100 ? 2 : 0)}` : '';

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col items-center px-6 py-16 sm:py-20">
            <div className="max-w-xl w-full mx-auto text-center">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4">
                    Junior Sessions with {SID_NAME}
                </p>

                {!booking && !error && <p className="text-white/60 text-base font-medium">Finding your booking…</p>}

                {!booking && error && (
                    <>
                        <h1 className="text-3xl font-black uppercase leading-tight mb-4">Booking Not Found</h1>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-8">
                            {error} If you were sent this link, email{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>{' '}
                            and we will sort it out, or book again on the session page.
                        </p>
                        <a href={ROUTE} className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4">
                            Go to the session page <ArrowRight className="w-4 h-4" />
                        </a>
                    </>
                )}

                {booking && booking.paid && (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-rr-pink mx-auto mb-6" strokeWidth={1.75} />
                        <h1 className="text-3xl font-black uppercase leading-tight mb-4">Already Paid</h1>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-8">
                            {booking.firstName ? `${booking.firstName}'s` : 'This'} place is paid for and booked: {booking.name}.
                            Nothing more to pay.
                        </p>
                        <a href={SUCCESS_ROUTE} className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4">
                            What to bring on the day <ArrowRight className="w-4 h-4" />
                        </a>
                    </>
                )}

                {booking && !booking.paid && (
                    <>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight mb-4">Pay For Your Place</h1>
                        {cancelled && (
                            <p className="text-amber-200 text-sm font-medium leading-relaxed mb-4">
                                The payment was not finished, so nothing has been charged. You can pay below.
                            </p>
                        )}
                        <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-2">
                            {booking.firstName ? `${booking.firstName}: ` : ''}{booking.name}.
                        </p>
                        <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-8">
                            {price} per player. The place is booked once the payment goes through.
                        </p>
                        <button
                            type="button"
                            onClick={pay}
                            disabled={paying}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" /> {paying ? 'Opening secure payment…' : `Pay ${price} Now`}
                        </button>
                        {error && <p role="alert" className="text-amber-200 text-sm font-medium mt-4">{error}</p>}
                        <p className="text-white/50 text-sm font-medium leading-relaxed mt-6">
                            Payments are processed securely by Stripe. {SID_CAVEAT}
                        </p>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mt-4">
                            Can&apos;t make it any more? Email{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className={`inline-flex items-center gap-1 ${linkClass}`}>
                                <Mail className="w-3.5 h-3.5" />{CONTACT_EMAIL}
                            </a>{' '}and we will free the place for another player.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SidJuniorsPay;
