import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, X } from 'lucide-react';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, HomeFooter } from '../home-v2/HomeV2Parts';
import { INFO_EMAIL } from '../../lib/academyContact';
import { LOCATIONS_ROUTE } from './venues';
import { allVenues, searchVenues } from './locationsData';
import '../home-v2/homeV2.css';
import './locations.css';

// /locations: find a centre (Andy, 27 Nov 2026: "people feel like they're not just searching
// programs, but they're searching areas"). Type a suburb, a postcode, a side of town, a program
// or a coach; each card goes to that centre's own page. Data: venues.js + locationsData.js.
const SECTIONS = ['locations-hero', 'locations-list', 'locations-help'];

const LocationsPage = () => {
    usePageAnalytics(LOCATIONS_ROUTE, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const venues = useMemo(() => allVenues(), []);
    const [query, setQuery] = useState('');
    const shown = searchVenues(venues, query);
    const toList = () => document.getElementById('locations-list')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={toList} />
            <main className="flex-1 w-full overflow-hidden">
                <section className="band band-video pg-hero" id="locations-hero">
                    <div className="wrap">
                        <span className="eyebrow">Rajasthan Royals Academy Melbourne</span>
                        <h1>FIND YOUR CENTRE</h1>
                        <p>Cricket coaching close to home. Search by suburb or postcode to see the programs and coaches at your nearest Rajasthan Royals Academy centre.</p>
                        <form className="loc-search" role="search" onSubmit={(e) => { e.preventDefault(); toList(); }}>
                            <Search aria-hidden="true" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Suburb, postcode or program"
                                aria-label="Search our centres by suburb, postcode, program or coach"
                                autoComplete="off"
                                enterKeyHint="search"
                            />
                            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X /></button>}
                        </form>
                    </div>
                </section>

                <section className="strip" id="locations-list">
                    <div className="wrap">
                        <p className="loc-count" role="status">
                            {query.trim()
                                ? `${shown.length} of ${venues.length} centres match “${query.trim()}”`
                                : `${venues.length} centres`}
                        </p>
                        {shown.length === 0 && (
                            <div className="loc-empty">
                                <p><b>No centre matches that yet.</b> Try the name of a nearby suburb, or see every centre.</p>
                                <button type="button" className="btn" onClick={() => setQuery('')} data-cta="locations-show-all">Show All Centres</button>
                            </div>
                        )}
                        <div className="loc-grid">
                            {shown.map((v) => (
                                <Link key={v.slug} to={v.route} className="loc-card" data-cta={`locations-${v.slug}`}>
                                    <div className="loc-card-top">
                                        <span className="eyebrow">{v.area}</span>
                                        {v.comingSoon && <span className="tag">Coming soon</span>}
                                        {v.badge && <span className="tag green">{v.badge}</span>}
                                    </div>
                                    <h2>{v.fullName}</h2>
                                    <p className="loc-card-addr"><MapPin aria-hidden="true" />{v.address || v.suburb}</p>
                                    {v.near && <p className="prog-detail">Close to {v.near}</p>}
                                    {v.programs.length > 0 && (
                                        <ul className="loc-chips">{v.programs.map((p) => <li key={p.route}>{p.name}</li>)}</ul>
                                    )}
                                    {v.comingSoon && <p className="prog-detail">No programs yet. Register to hear first when they open.</p>}
                                    <span className="btn prog-btn">{v.comingSoon ? 'Hear First' : 'View Centre'} <ArrowRight /></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="strip white" id="locations-help">
                    <div className="wrap prog-help">
                        <div>
                            <h2>NO CENTRE NEAR YOU?</h2>
                            <p className="strip-sub">Tell us your suburb. It helps us decide where the Academy opens next.</p>
                        </div>
                        <a className="btn" href={`mailto:${INFO_EMAIL}?subject=${encodeURIComponent('A Royals Academy centre near me')}`} data-cta="locations-help-email">Email {INFO_EMAIL}</a>
                    </div>
                </section>
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
        </div>
    );
};

export default LocationsPage;
