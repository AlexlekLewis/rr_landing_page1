import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

// Junior Royals — HOLDING NOTICE while the page is rebuilt (Alex, 5 Oct 2026:
// "hide this page while we build it as number one priority").
//
// Why: the Term 4 entry form on the old page lost every Cranbourne North entry
// from 27 Sep to 5 Oct (a database rule rejected 'cranbourne-north'), and the
// page still read as a Term 3 page. This notice replaces it with NO FORM, so no
// parent can hit a broken form, and the route is off every promo surface and
// noindex (src/seo/pageSeo.js).
//
// Facts here are only the ones Alex confirmed on 5 Oct 2026: Junior Royals moves
// from terms to a year-round membership, Wednesday nights in school terms, at
// Mickleham and Cranbourne North, first session Wednesday 28 October. No price
// on this notice — the price needs the full membership explanation beside it,
// which the rebuilt page will carry.
//
// REVIEW 28 Oct 2026 — the rebuilt page must replace this before then.

const CENTRES = [
    { venue: 'Mickleham Indoor Sports Centre', suburb: 'Mickleham', region: 'North Melbourne' },
    { venue: 'Elite Cricket Centre', suburb: 'Cranbourne North', region: 'South-East Melbourne' },
];

const CONTACT_EMAIL = 'info@rramelbourne.com';

const JuniorRoyalsHolding = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-rr-dark text-white">
            <Navbar variant="coaches" />
            <main className="flex-1 px-6 pt-36 pb-24">
                <div className="max-w-2xl mx-auto">
                    <p className="text-rr-pink font-black tracking-[0.25em] uppercase text-xs">
                        Rajasthan Royals Academy · Melbourne
                    </p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Junior Royals
                    </h1>

                    <p className="mt-6 text-lg text-white/85 leading-relaxed">
                        Junior Royals is our weekly cricket coaching for junior players. We are changing how it
                        runs, and this page is being rebuilt.
                    </p>

                    <h2 className="mt-10 text-xl font-black uppercase tracking-wide">What's changing</h2>
                    <p className="mt-3 text-white/85 leading-relaxed">
                        From <span className="font-bold text-white">Wednesday 28 October</span>, Junior Royals will
                        run every week of the school year, on Wednesday nights, instead of in separate terms.
                        It will run at two centres:
                    </p>
                    <ul className="mt-4 space-y-3">
                        {CENTRES.map((c) => (
                            <li key={c.suburb} className="border-l-4 border-rr-pink pl-4">
                                <span className="font-bold text-white">{c.venue}, {c.suburb}</span>
                                <span className="block text-sm text-white/70">{c.region}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-white/85 leading-relaxed">
                        There is no Junior Royals at Hallam or Williamstown.
                    </p>
                    <p className="mt-4 text-white/85 leading-relaxed">
                        The full details, including the price and how to join, will be on this page soon.
                    </p>

                    <h2 className="mt-10 text-xl font-black uppercase tracking-wide">Already entered for Term 4?</h2>
                    <p className="mt-3 text-white/85 leading-relaxed">
                        We have your details. You don't need to do anything. We will email you about the new
                        program.
                    </p>

                    <h2 className="mt-10 text-xl font-black uppercase tracking-wide">Questions</h2>
                    <p className="mt-3 text-white/85 leading-relaxed">
                        Email us at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-rr-pink font-bold hover:underline">
                            {CONTACT_EMAIL}
                        </a>
                        .
                    </p>

                    <div className="mt-12">
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 rounded-full bg-rr-pink text-white font-bold text-sm uppercase tracking-wide hover:bg-white hover:text-rr-dark transition-colors"
                        >
                            See our other programs
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default JuniorRoyalsHolding;
