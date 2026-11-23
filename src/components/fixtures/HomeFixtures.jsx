import React from 'react';
import { Link } from 'react-router-dom';
import FixtureCard from './FixtureCard';
import { upcoming, results } from './fixturesData';

// Home page "Fixtures" strip (DRAFT): the next three matches, in the home page's strip style.
// With nothing coming up it shows the latest result instead; with neither, it hides.
const HomeFixtures = () => {
    const next = upcoming().slice(0, 3);
    const list = next.length ? next : results().slice(0, 3);
    if (list.length === 0) return null;
    return (
        <section className="strip" id="fixtures">
            <div className="wrap">
                <div className="strip-head">
                    <h2>{next.length ? 'UPCOMING FIXTURES' : 'LATEST RESULTS'}</h2>
                    <Link className="more" to="/fixtures" data-cta="home-fixtures-more">All Fixtures</Link>
                </div>
                <p className="strip-sub">Come and watch our players in action across Melbourne.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((f) => <FixtureCard key={f.id} f={f} />)}
                </div>
            </div>
        </section>
    );
};

export default HomeFixtures;
