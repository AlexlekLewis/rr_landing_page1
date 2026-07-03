import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import RegisterDrawer from './home-page/RegisterDrawer';

// The site shell. The global nav + footer are mounted ONCE here and persist across
// every core page; only the <Outlet/> content swaps on navigation. This is what makes
// the pages one unified website instead of a set of standalone landing pages.
//
// The nav is context-aware only for its SECONDARY links (per-page section anchors) —
// the PRIMARY nav (logo + value-ladder Programs dropdown) is identical everywhere.
const variantForPath = (p) => {
    if (p === '/') return 'home';
    if (p.startsWith('/junior-royals-holiday')) return 'holiday';
    if (p.startsWith('/junior-royals')) return 'junior-royals';
    if (p.startsWith('/elite-royals') || p.startsWith('/PGP2026')) return 'power-game';
    return 'home';
};

const SiteLayout = () => {
    const { pathname } = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const openRegister = () => setDrawerOpen(true);
    const variant = variantForPath(pathname);

    return (
        <div className="min-h-screen flex flex-col bg-white text-rr-dark font-sans selection:bg-rr-pink selection:text-white">
            <Navbar variant={variant} onRegisterClick={openRegister} />
            <div className="flex-1 flex flex-col">
                <Outlet context={{ openRegister }} />
            </div>
            <Footer />
            <RegisterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    );
};

export default SiteLayout;
