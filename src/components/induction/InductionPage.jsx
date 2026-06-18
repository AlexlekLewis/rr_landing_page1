import React, { useEffect, useMemo } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import InductionHero from './InductionHero';
import InductionForm from './InductionForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'registration-form'];

const InductionPage = () => {
    usePageAnalytics('/induction', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reusable across launches: /induction?program=Power%20Pre-Season tags every
    // submission with that program name and surfaces it in the hero eyebrow.
    const program = useMemo(() => {
        const p = new URLSearchParams(window.location.search).get('program');
        return p ? p.trim() : '';
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="holiday" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <InductionHero program={program} />
                </div>
                <InductionForm program={program} />
            </main>
            <Footer />
        </div>
    );
};

export default InductionPage;
