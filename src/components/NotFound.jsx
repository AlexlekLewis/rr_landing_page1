import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Friendly 404 with the full site chrome + direct links to the main pages, so a user
// (or crawler) that lands on a dead URL always has a clear way back into the site.
const LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Junior Royals', to: '/junior-royals' },
    { label: 'Holiday Camps', to: '/junior-royals-holiday' },
    { label: 'Private Coaching', to: '/mickleham' },
    { label: 'Elite Program', to: '/elite-royals' },
    { label: 'Our Coaches', to: '/coaches' },
];

const NotFound = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white text-rr-dark">
            <Navbar variant="coaches" />
            <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
                <div className="text-center max-w-xl">
                    <p className="text-rr-pink font-black tracking-[0.3em] uppercase text-sm">404</p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Page not found
                    </h1>
                    <p className="mt-4 text-rr-charcoal/70 text-lg">
                        That page has moved or never existed. Here's where to head instead:
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {LINKS.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="px-5 py-2.5 rounded-full bg-rr-pink text-white font-bold text-sm hover:bg-rr-dark transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
