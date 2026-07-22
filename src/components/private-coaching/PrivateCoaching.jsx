import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PCHero from './PCHero';
import PCHowItWorks from './PCHowItWorks';
import PCForm from './PCForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const SECTIONS = ['hero', 'how-it-works', 'eoi-form'];

const PrivateCoaching = () => {
    usePageAnalytics('/private-coaching', { sections: SECTIONS });

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Private Coaching | Rajasthan Royals Academy Melbourne';
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="private-coaching" />
            <main className="flex-1 w-full overflow-hidden">
                <div id="hero">
                    <PCHero />
                </div>
                <div id="how-it-works">
                    <PCHowItWorks />
                </div>
                <div id="eoi-form">
                    <PCForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivateCoaching;
