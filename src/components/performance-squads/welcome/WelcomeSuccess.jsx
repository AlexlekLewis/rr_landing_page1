import React, { useEffect } from 'react';
import { CheckCircle2, Mail, Shirt, MessageCircle } from 'lucide-react';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import { WELCOME, HALLA_BOL } from './welcomeConfig';
import { Eyebrow } from './welcomeShared';

// ─────────────────────────────────────────────────────────────
// Where a player lands after paying the Joining Fee, and after a kit order.
// HIDDEN: noindex, not in nav or sitemap.
//
// The Stripe Payment Link must have its confirmation page set to redirect here:
//   https://rramelbourne.com/performance-squads/welcome/success
// (Stripe Dashboard → Payment Links → the Joining Fee link → After payment.)
// ─────────────────────────────────────────────────────────────

const WelcomeSuccess = () => {
    const c = WELCOME;
    const kitOrdered = new URLSearchParams(window.location.search).get('kit') === 'ordered';

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'You are in | Rajasthan Royals Academy Melbourne';
        let meta = document.head.querySelector('meta[name="robots"]');
        const created = !meta;
        const previous = meta ? meta.getAttribute('content') : null;
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'robots');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'noindex,nofollow');
        return () => {
            if (created) meta.remove();
            else if (previous !== null) meta.setAttribute('content', previous);
        };
    }, []);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="performance-squads-welcome" />

            <main className="flex-1 w-full overflow-hidden">
                <section
                    className="relative px-5 pt-32 pb-16 sm:pt-40 sm:pb-24 text-center overflow-hidden"
                    style={{ backgroundImage: 'var(--image-gradient-rr)' }}
                >
                    <img
                        src="/assets/rr-rampant-lion-white.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute z-0 left-1/2 -translate-x-1/2 lg:left-[8%] lg:translate-x-0 top-1/2 -translate-y-1/2 h-[110%] w-auto max-w-none opacity-[0.18] lg:opacity-25"
                    />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <CheckCircle2 aria-hidden="true" className="w-16 h-16 mx-auto mb-6" strokeWidth={1.75} />
                        <p className="text-[11px] sm:text-sm font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-4">
                            Performance Squad · Season 2026/27
                        </p>
                        <h1 className="text-[40px] sm:text-6xl font-black uppercase leading-[0.98] mb-6">
                            {kitOrdered ? 'Kit ordered' : "You're in"}
                        </h1>
                        <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                            {kitOrdered
                                ? 'Thanks — your kit order is confirmed. A receipt is on its way to your email.'
                                : 'Your place in the Performance Squad is confirmed. A receipt is on its way to your email.'}
                        </p>
                    </div>
                </section>

                <section className="px-5 py-14 sm:py-20">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageCircle aria-hidden="true" className="w-6 h-6 text-rr-pink shrink-0" strokeWidth={2} />
                                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">What happens now</h2>
                            </div>
                            <ul className="space-y-3">
                                {c.afterConfirm.map((line) => (
                                    <li key={line.slice(0, 30)} className="flex gap-3 text-white/85 text-base font-medium leading-relaxed">
                                        <span aria-hidden="true" className="text-rr-pink mt-1.5 shrink-0">•</span>
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {!kitOrdered && (
                            <div className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shirt aria-hidden="true" className="w-6 h-6 text-rr-pink shrink-0" strokeWidth={2} />
                                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">Your kit</h2>
                                </div>
                                <p className="text-white/85 text-base font-medium leading-relaxed mb-5">
                                    Every player needs at least one training shirt, one pair of training pants
                                    (recommended) or training shorts, and a training hat. Order it at participant
                                    prices on the welcome page — or pick it up at squad training sessions, where
                                    training apparel will also be available.
                                </p>
                                <a
                                    href="/performance-squads/welcome#kit"
                                    className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                                >
                                    Order your kit
                                </a>
                            </div>
                        )}

                        {/* Only players who confirm inside the window can be considered. */}
                        <div className="rounded-2xl border-2 border-rr-light-pink/60 bg-rr-pink/10 p-6 sm:p-8">
                            <Eyebrow className="mb-3">September games</Eyebrow>
                            <p className="text-white/90 text-base font-medium leading-relaxed">
                                Because you confirmed within {c.confirmWindow} of being notified, you may be invited to
                                play on {c.septemberGames.dates} at {c.septemberGames.venue}. Invitations are sent
                                separately — only players with an offer can play.
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    className="relative px-5 py-16 sm:py-24 text-center overflow-hidden"
                    style={{ backgroundImage: 'var(--image-gradient-rr)' }}
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <img src={HALLA_BOL} alt="Halla Bol!" className="h-20 sm:h-28 w-auto mx-auto mb-7 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
                        <p className="text-2xl sm:text-4xl font-black uppercase tracking-wide">
                            See you on {c.season.firstTraining.date}!
                        </p>
                        <p className="mt-5 text-white/90 text-base font-medium">
                            <Mail aria-hidden="true" className="inline w-4 h-4 mr-2 -mt-0.5" />
                            Any questions? Email{' '}
                            <a href={`mailto:${c.contactEmail}`} className="text-white underline hover:text-white/80">{c.contactEmail}</a>
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default WelcomeSuccess;
