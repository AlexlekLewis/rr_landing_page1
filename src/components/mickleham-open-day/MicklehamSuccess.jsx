import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// Dedicated success URL for Mickleham Open Day Elite Trial registrations:
//   /PGP2026/mickleham/success
// The registration form (MicklehamForm) inserts the row, stashes the player's
// first name + parent email in sessionStorage, then navigates here. This gives a
// unique thank-you URL where the Meta Pixel conversion fires — so the campaign is
// attributable/optimisable in Meta Ads and a URL-based Custom Conversion can be
// built on this path. The base Pixel (fbq init + PageView) lives globally in
// index.html; here we register a PageView for this SPA route change plus the Lead
// conversion, firing ONCE per real registration (see the one-shot stash below).

const InfoPanel = ({ icon, title, delay, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-5 text-left backdrop-blur-sm"
    >
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-rr-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            </div>
            <div className="w-full">
                <p className="text-sm font-bold text-white/90 mb-2">{title}</p>
                {children}
            </div>
        </div>
    </motion.div>
);

// Fire the Meta Pixel conversion for a completed Elite Trial registration.
const fireMetaConversion = () => {
    try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            // Register a PageView for this client-side route change (the global base
            // Pixel only fires PageView on the initial document load), then the Lead.
            window.fbq('track', 'PageView');
            window.fbq('track', 'Lead', {
                content_name: 'Mickleham Open Day',
                content_category: 'mickleham-open-day-elite-trial',
            });
        }
    } catch (_) { /* never let analytics break the page */ }
};

const MicklehamSuccess = () => {
    usePageAnalytics('/PGP2026/mickleham/success');
    const [conf, setConf] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "You're in — Mickleham Open Day";
        // Read AND immediately clear the one-shot stash the form set before navigating.
        // Clearing first means a refresh (or a StrictMode double-run) can't re-fire the
        // conversion, and a direct/bookmarked visit (no stash) never fires a phantom one.
        let data = null;
        try {
            const raw = sessionStorage.getItem('mickleham_confirmation');
            if (raw) {
                data = JSON.parse(raw);
                sessionStorage.removeItem('mickleham_confirmation');
            }
        } catch (_) { /* no-op */ }
        if (data) {
            setConf(data);
            fireMetaConversion();
        }
    }, []);

    const firstName = (conf?.firstName || 'You');
    const email = conf?.email || '';

    return (
        <section className="relative overflow-hidden bg-rr-dark text-white min-h-screen flex items-center justify-center px-6 py-16 selection:bg-rr-pink selection:text-white">

            {/* Background gradient orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rr-pink/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rr-blue/15 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-rr-navy/60 blur-[80px]" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-2xl w-full mx-auto text-center">

                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="mb-8">
                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-14 md:h-16 mx-auto brightness-0 invert" />
                </motion.div>

                {/* Tick medallion */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }} className="flex items-center justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-rr-pink/20 animate-ping scale-110" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shadow-[0_0_48px_rgba(225,31,143,0.4)]">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }} className="mb-4">
                    <p className="text-rr-pink font-bold uppercase tracking-widest text-sm md:text-base mb-3">Registration Confirmed</p>
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none">
                        YOU'RE{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">IN.</span>
                    </h2>
                </motion.div>

                {/* Divider */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }} className="w-20 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mx-auto my-8" />

                {/* Welcome + body */}
                <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }} className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed mb-6">
                    You're booked into the Elite Trial.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }} className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto font-medium">
                    Thanks <span className="text-white font-bold">{firstName}</span> — you're registered to trial for the <span className="text-white font-bold">Elite Program</span> (our Power Game Pre-Season) at the Mickleham Open Day. Come ready to show us what you've got.
                </motion.p>

                {/* Your session */}
                <InfoPanel delay={0.55} title="Your Session" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                    <p className="text-sm text-white font-bold mb-1">Sunday 5 July · 10:30am – 12:00pm</p>
                    <p className="text-sm text-white/60 leading-relaxed">Mickleham Indoor Sports Centre · 3 Eclipse Drive, Mickleham VIC 3064</p>
                </InfoPanel>

                {/* What to bring */}
                <InfoPanel delay={0.6} title="What to Bring" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                    <ul className="text-sm text-white/60 leading-relaxed space-y-1">
                        <li>• Please arrive <span className="text-white font-bold">10–15 minutes early</span> in cricket gear</li>
                        <li>• Bring your own bat if you have one</li>
                        <li>• A drink bottle and water</li>
                    </ul>
                </InfoPanel>

                {/* What happens next */}
                <InfoPanel delay={0.65} title="What Happens Next" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                    <p className="text-sm text-white/70 leading-relaxed mb-2">
                        We'll confirm by email {email ? <>at <span className="font-bold text-white">{email}</span></> : 'to the address you provided'}, and our team will be in touch before the day with everything you need to know.
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed">
                        Please check your inbox — including your <span className="font-bold text-white/80">junk, spam and promotions folders</span> — as our confirmation can be filtered.
                    </p>
                </InfoPanel>

                {/* Questions */}
                <InfoPanel delay={0.7} title="Questions?" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    <p className="text-sm text-white/60 leading-relaxed">
                        Reach our team at{' '}
                        <a href="mailto:eliteprogram@rramelbourne.com" className="text-rr-pink font-bold hover:underline">eliteprogram@rramelbourne.com</a>
                    </p>
                </InfoPanel>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.75 }} className="mt-10">
                    <a
                        href="/"
                        className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] group"
                    >
                        Back to Home
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>

                {/* Stamp */}
                <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.85 }} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">
                    HALLA BOL
                </motion.p>

            </div>
        </section>
    );
};

export default MicklehamSuccess;
