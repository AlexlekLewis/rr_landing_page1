import React, { useEffect } from 'react';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import EntryForm from './EntryForm';

// The QR-poster landing page: a fast, focused "Register for Entry" door check-in.
// Deliberately minimal — no site nav — so an arriving family taps the QR, fills a
// handful of fields, accepts the entry conditions, and is done. Mirrors the A4
// poster: white RRA crest → centre name → "REGISTER FOR ENTRY".
const EntryPage = ({ config }) => {
    usePageAnalytics(config.route);
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Register for Entry · ${config.centreName} · RRA Melbourne`;
    }, [config]);

    return (
        <div
            className="min-h-screen font-sans text-white selection:bg-rr-pink selection:text-white"
            style={{ background: 'linear-gradient(160deg,#001D48 0%,#2a0a3f 55%,#E11F8F 140%)' }}
        >
            <div className="max-w-xl mx-auto px-5 py-10 md:py-14">
                {/* ── Poster-style header ── */}
                <div className="text-center mb-8">
                    <img
                        src="/assets/Logo_White_Transparent.png"
                        alt="Rajasthan Royals Academy Melbourne"
                        className="h-28 md:h-32 w-auto mx-auto mb-6"
                    />
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-white/90">{config.centreName} Open Day</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                        Register for<br /><span className="text-rr-light-pink">Entry</span>
                    </h1>
                    <p className="text-white/70 font-medium max-w-md mx-auto text-sm md:text-base">
                        Please check in on arrival. It takes 30 seconds and covers everyone in your group for the day.
                    </p>
                    <p className="text-white/45 font-semibold text-xs uppercase tracking-widest mt-3">
                        {config.venueHeadline}{config.dateHeadline ? ` · ${config.dateHeadline}` : ''}
                    </p>
                </div>

                {/* ── The form ── */}
                <EntryForm config={config} />

                <p className="text-center text-white/40 text-xs font-medium mt-6">
                    Rajasthan Royals Academy Melbourne · One check-in per attendee
                </p>
            </div>
        </div>
    );
};

export default EntryPage;
