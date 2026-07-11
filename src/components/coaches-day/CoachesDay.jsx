import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import CoachesDayHero from './CoachesDayHero';
import CoachesDayDetails from './CoachesDayDetails';
import CoachesDayForm from './CoachesDayForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'from-the-coach', 'details', 'registration-form'];

const CoachesDay = () => {
    usePageAnalytics('/coaches-day', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="lp2" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <CoachesDayHero />
                </div>
                <CoachesDayDetails />
                <CoachesDayForm />
            </main>
            <Footer />
        </div>
    );
};

export default CoachesDay;
