import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import PartnerStack from './power-game/PartnerStack';
import usePageAnalytics from '../hooks/usePageAnalytics';

// ─────────────────────────────────────────────────────────────
// What a one-off event page shows once its date has passed.
//
// Used by /performance-squads-open-trial and /sid-juniors (closed 16 Oct
// 2026). The address keeps working, because printed posters and old emails
// still point at it, but the page now says plainly that the event is over,
// takes no booking and no payment, and says what to do instead.
//
// Off every promo surface and out of the sitemap, so it is noindex as well.
// Every word comes from the page's own data file (`copy`); this component only
// lays it out.
// ─────────────────────────────────────────────────────────────

// Turns the contact address inside a sentence into a mailto link.
const withEmail = (text, email) => {
    if (!email || !text.includes(email)) return text;
    const parts = text.split(email);
    return parts.flatMap((part, i) => (i < parts.length - 1
        ? [part, (
            <a key={i} href={`mailto:${email}`} className="text-rr-pink font-bold underline underline-offset-2 hover:text-rr-dark">
                {email}
            </a>
        )]
        : [part]));
};

const FinishedEventPage = ({ route, navVariant, copy, sessions, email }) => {
    usePageAnalytics(route, { sections: ['finished', 'next'] });

    useEffect(() => {
        window.scrollTo(0, 0);
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,follow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant={navVariant} ctaLabelOverride={copy.navCta} ctaTargetOverride="next" />
            <main className="flex-1 w-full pt-28 md:pt-40 pb-20 px-5">
                <div id="finished" className="max-w-3xl mx-auto">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4">
                        {copy.kicker}
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase leading-[1.05] mb-5">{copy.title}</h1>
                    <p className="text-rr-charcoal text-base sm:text-lg font-medium leading-relaxed">{copy.intro}</p>

                    <h2 className="mt-12 mb-3 text-xs font-black uppercase tracking-[0.2em] text-rr-charcoal">
                        {copy.sessionsTitle}
                    </h2>
                    <ul className="border-y border-slate-200 divide-y divide-slate-200">
                        {sessions.map((s) => (
                            <li key={s.key} className="py-4 flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-black uppercase tracking-wide">{s.place}</p>
                                    <p className="text-rr-charcoal text-[15px] font-medium">{s.when}</p>
                                    <p className="text-rr-charcoal/70 text-sm font-medium">{s.venue}</p>
                                </div>
                                <span className="shrink-0 text-[11px] font-black uppercase tracking-wider text-rr-charcoal/70 pt-1">
                                    {copy.badge}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <section id="next" className="max-w-3xl mx-auto mt-14 scroll-mt-28 lg:scroll-mt-36">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase mb-6">{copy.nextTitle}</h2>
                    <div className="space-y-7">
                        {copy.next.map((item) => (
                            <div key={item.title} className="border-l-4 border-rr-pink pl-5">
                                <h3 className="font-black uppercase text-lg leading-snug mb-1.5">{item.title}</h3>
                                <p className="text-rr-charcoal text-[15px] sm:text-base font-medium leading-relaxed">
                                    {withEmail(item.body, email)}
                                </p>
                                {item.cta && (
                                    <a
                                        href={item.cta.to}
                                        className="mt-4 inline-flex items-center gap-2 bg-rr-blue hover:bg-rr-dark text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3 transition-colors"
                                    >
                                        {item.cta.label} <ArrowRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="mt-12 text-sm font-medium text-rr-charcoal/70">
                        <Link to="/" className="underline underline-offset-2 hover:text-rr-pink">Back to the Academy home page</Link>
                    </p>
                </section>
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default FinishedEventPage;
