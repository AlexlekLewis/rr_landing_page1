import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AcceptanceHero from './AcceptanceHero';
import AcceptanceForm from './AcceptanceForm';
import usePageAnalytics from '../../hooks/usePageAnalytics';

const LP3_SECTIONS = [
    'lp3-hero', 'acceptance-form'
];

const LandingPage3 = () => {
    usePageAnalytics('/offer/acceptance', { sections: LP3_SECTIONS });
    const [acceptStatus, setAcceptStatus] = useState('undecided'); // 'undecided', 'yes', 'no'

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="lp3" />

            <main className="flex-1 overflow-hidden relative">
                {/* Hero section with Offer copy and Yes/No buttons */}
                <AcceptanceHero acceptStatus={acceptStatus} setAcceptStatus={setAcceptStatus} />

                {/* Form and Payment links - Only visible if 'Yes' */}
                {acceptStatus === 'yes' && <AcceptanceForm />}

            </main>

            <Footer />
        </div>
    );
};

export default LandingPage3;
