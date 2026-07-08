import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../Footer';

const fmtAUD = (cents) =>
    typeof cents === 'number'
        ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100)
        : '$2,200.00';

// Shown after Stripe redirects back. Confirms the deposit and points the
// traveller to the full details form (passport / travel info) as the next step.
const DepositSuccess = () => {
    const [state, setState] = useState('checking'); // checking | paid | pending | error
    const [info, setInfo] = useState({ name: '', amount: null });

    useEffect(() => {
        document.title = 'Deposit Confirmed | India Tour 2026 | RRA Melbourne';
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        window.scrollTo(0, 0);

        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (!sessionId) { setState('error'); return () => document.head.removeChild(meta); }

        (async () => {
            try {
                const r = await fetch(`/api/india-tour-deposit-verify?session_id=${encodeURIComponent(sessionId)}`);
                const d = await r.json();
                if (d && d.paid) {
                    setInfo({ name: d.name || '', amount: d.amount_total });
                    setState('paid');
                } else {
                    setState('pending');
                }
            } catch (_) {
                setState('error');
            }
        })();

        return () => { document.head.removeChild(meta); };
    }, []);

    const firstName = (info.name || '').trim().split(' ')[0];

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <main className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rr-blue/20 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-xl bg-white rounded-2xl p-8 md:p-12 text-center text-rr-dark"
                >
                    {state === 'checking' && (
                        <div className="py-10">
                            <svg className="animate-spin w-8 h-8 text-rr-pink mx-auto" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <p className="mt-4 text-rr-charcoal font-medium">Confirming your deposit…</p>
                        </div>
                    )}

                    {state === 'paid' && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
                                Your Place Is Secured
                            </h1>
                            <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                            <p className="text-rr-charcoal font-medium leading-relaxed">
                                {firstName ? <>Thank you, <strong>{firstName}</strong>. </> : 'Thank you. '}
                                We've received your <strong>{fmtAUD(info.amount)}</strong> deposit for the
                                India Tour 2026. A receipt is on its way to your email.
                            </p>

                            <div className="mt-8 bg-slate-50 border border-slate-100 rounded-xl p-6 text-left">
                                <p className="text-xs font-black text-rr-dark uppercase tracking-widest mb-3">Next step</p>
                                <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-4">
                                    Please complete your traveller details (passport &amp; travel information) so we can
                                    begin your tour paperwork. It only takes a few minutes.
                                </p>
                                <a
                                    href="/india-tour-intake.html"
                                    className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm px-6 py-3 rounded-full transition-all duration-300"
                                >
                                    Complete Traveller Details
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </>
                    )}

                    {(state === 'pending' || state === 'error') && (
                        <>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                                Thanks — we're confirming your payment
                            </h1>
                            <div className="w-16 h-1 rounded-full bg-rr-pink mx-auto mb-6" />
                            <p className="text-rr-charcoal font-medium leading-relaxed">
                                If your card was charged, your place is secured — you'll receive a receipt by email
                                shortly. If anything looks wrong, email{' '}
                                <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                                    info@rramelbourne.com
                                </a>{' '}
                                and we'll sort it straight away.
                            </p>
                        </>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default DepositSuccess;
