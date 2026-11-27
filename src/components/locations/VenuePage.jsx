import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation, MessageSquare } from 'lucide-react';
import PartnerStack from '../power-game/PartnerStack';
import usePageAnalytics from '../../hooks/usePageAnalytics';
import { HomeHeader, HomeFooter } from '../home-v2/HomeV2Parts';
import HomeMedia from '../home-page/HomeMedia';
import Newsletter from '../home-v2/Newsletter';
import { SMS_NUMBER, SMS_DISPLAY, INFO_EMAIL } from '../../lib/academyContact';
import { LOCATIONS_ROUTE } from './venues';
import { venueView, allVenues } from './locationsData';
import '../home-v2/homeV2.css';
import './locations.css';

// ONE CENTRE, ONE PAGE (Andy, 27 Nov 2026): what runs here, who coaches here, photos and
// videos from here, and how to get here. The page holds no facts of its own: everything is
// read from venues.js and locationsData.js, so it follows the program pages.
// A centre that is not open yet (comingSoon) shows its name and a "tell me when" form only.

const initials = (n) => n.split(' ').map((w) => w[0]).join('');

const VenuePage = ({ venue }) => {
    const v = useMemo(() => venueView(venue), [venue]);
    const others = useMemo(() => allVenues().filter((o) => o.slug !== v.slug), [v.slug]);
    const sections = v.comingSoon
        ? ['venue-hero', 'newsletter', 'venue-others']
        : ['venue-hero', 'venue-programs', 'venue-coaches', 'venue-media', 'venue-find', 'venue-others', 'venue-help'];
    usePageAnalytics(v.route, { sections });
    useEffect(() => { window.scrollTo(0, 0); }, [v.route]);
    const toPrograms = () => document.getElementById(v.comingSoon ? 'newsletter' : 'venue-programs')?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="rrh min-h-screen flex flex-col selection:bg-rr-pink selection:text-white relative">
            <HomeHeader onRegister={toPrograms} />
            <main className="flex-1 w-full overflow-hidden">
                <section className="band band-video pg-hero" id="venue-hero">
                    <div className="wrap">
                        <Link className="loc-back" to={LOCATIONS_ROUTE} data-cta="venue-all-centres">← All centres</Link>
                        <span className="eyebrow">Rajasthan Royals Academy Melbourne · {v.area}</span>
                        <h1>{v.fullName}</h1>
                        {v.comingSoon ? (
                            <p>Rajasthan Royals Academy cricket coaching is coming to {v.fullName}. There are no programs, dates or prices yet. Leave your email and we will tell you first when they open.</p>
                        ) : (
                            <p>
                                Cricket coaching with Rajasthan Royals Academy Melbourne in {v.suburb}, {v.area}.
                                {v.nearList.length > 0 && <> Close to {v.nearList.slice(0, -1).join(', ')} and {v.nearList[v.nearList.length - 1]}.</>}
                            </p>
                        )}
                        {v.address && <p className="loc-addr"><MapPin aria-hidden="true" />{v.address}</p>}
                        <div className="loc-actions">
                            <button type="button" className="btn" onClick={toPrograms} data-cta="venue-hero-programs">
                                {v.comingSoon ? 'Tell Me When It Opens' : 'See What Runs Here'} <ArrowRight />
                            </button>
                            {v.address && (
                                <a className="btn btn-line" href={v.mapsUrl} target="_blank" rel="noopener noreferrer" data-cta="venue-hero-directions">
                                    <Navigation /> Get Directions
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {v.comingSoon && (
                    <Newsletter
                        source={`venue-${v.slug}`}
                        interest={v.name}
                        eyebrow="Coming soon"
                        title={`HEAR FIRST ABOUT ${v.suburb.toUpperCase()}`}
                        body={`We will email you when Rajasthan Royals Academy programs open at ${v.fullName}, with the days, times and prices.`}
                        doneText={`We will email you when programs open at ${v.fullName}. You can unsubscribe at any time.`}
                        button="Tell Me First"
                    />
                )}

                {!v.comingSoon && (
                    <section className="strip" id="venue-programs">
                        <div className="wrap">
                            <div className="strip-head"><div><span className="eyebrow">{v.suburb}</span><h2>PROGRAMS AT THIS CENTRE</h2></div></div>
                            <p className="strip-sub">Choose a program to see the days, times and prices, and to register.</p>
                            {v.invitation && (
                                <Link className="loc-note" to={v.invitation.route} data-cta="venue-invitation">
                                    <span className="tag">{v.invitation.hero.badge}</span>
                                    <span><b>{v.invitation.hero.title.join(' ')}.</b> {v.invitation.hero.footnote}.</span>
                                    <span className="loc-note-go">{v.invitation.cta} <ArrowRight /></span>
                                </Link>
                            )}
                            <div className="prog-grid">
                                {v.programs.map((p) => (
                                    <Link key={p.route} to={p.route} className="prog-card" data-cta={`venue-program-${p.route.slice(1)}`}>
                                        <div className="prog-img">
                                            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" style={p.position ? { objectPosition: p.position } : undefined} />
                                            {p.badge && <span className={p.green ? 'tag green' : 'tag'}>{p.badge}</span>}
                                        </div>
                                        <div className="prog-body">
                                            <h3>{p.name}</h3>
                                            {p.line && <p className="prog-line">{p.line}</p>}
                                            {p.here && <p className="prog-detail loc-here"><MapPin aria-hidden="true" />{p.here}</p>}
                                            <span className="btn prog-btn">{p.cta} <ArrowRight /></span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {v.coaches.length > 0 && (
                    <section className="strip white" id="venue-coaches">
                        <div className="wrap">
                            <div className="strip-head">
                                <div><span className="eyebrow">{v.suburb}</span><h2>COACHES AT THIS CENTRE</h2></div>
                                <Link className="more" to="/coaches" data-cta="venue-all-coaches">Meet all our coaches →</Link>
                            </div>
                            <div className="loc-coaches">
                                {v.coaches.map((c) => (
                                    <Link key={c.slug} className="loc-coach" to={c.link || '/coaches'} data-cta={`venue-coach-${c.slug}`}>
                                        <span className="loc-coach-img">
                                            {c.img
                                                ? <img src={c.img} alt="" loading="lazy" decoding="async" style={{ objectPosition: c.pos }} />
                                                : <span aria-hidden="true">{initials(c.name)}</span>}
                                        </span>
                                        <span className="loc-coach-txt">
                                            <b>{c.name}</b>
                                            <span className="coach-role">{c.role}</span>
                                            {c.specialism && <span className="loc-coach-spec">{c.specialism}</span>}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {v.media.length > 0 && (
                    <HomeMedia
                        id="venue-media"
                        items={v.media}
                        idPrefix={`venue-media-${v.slug}`}
                        eyebrow="Photos & videos"
                        title={<>Inside <span className="text-rr-pink">{v.fullName}</span></>}
                        label={`Photos and videos from ${v.fullName}`}
                        sectionClass="py-12 md:py-16 bg-white"
                    />
                )}

                {!v.comingSoon && (
                    <section className="strip" id="venue-find">
                        <div className="wrap">
                            <div className="strip-head"><div><span className="eyebrow">Find us</span><h2>HOW TO GET HERE</h2></div></div>
                            <div className={v.mapEmbed ? 'loc-find' : 'loc-find nomap'}>
                                <div className="loc-find-txt">
                                    <h3>{v.fullName}</h3>
                                    {v.address
                                        ? <p className="loc-find-addr">{v.address}</p>
                                        : <p className="loc-find-addr">{v.suburb}, {v.area}. We send the street address with your booking.</p>}
                                    {v.nearList.length > 0 && (
                                        <>
                                            <p className="loc-find-label">Close to</p>
                                            <ul className="loc-chips">{v.nearList.map((n) => <li key={n}>{n}</li>)}</ul>
                                        </>
                                    )}
                                    {v.address && (
                                        <a className="btn" href={v.mapsUrl} target="_blank" rel="noopener noreferrer" data-cta="venue-find-directions">
                                            <Navigation /> Get Directions
                                        </a>
                                    )}
                                </div>
                                {v.mapEmbed && (
                                    <iframe className="loc-map" title={`Map: ${v.fullName}, ${v.address}`} src={v.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                )}
                            </div>
                        </div>
                    </section>
                )}

                <section className="strip white" id="venue-others">
                    <div className="wrap">
                        <div className="strip-head">
                            <div><h2>OUR OTHER CENTRES</h2></div>
                            <Link className="more" to={LOCATIONS_ROUTE} data-cta="venue-others-all">Search all centres →</Link>
                        </div>
                        <div className="loc-others">
                            {others.map((o) => (
                                <Link key={o.slug} className="loc-other" to={o.route} data-cta={`venue-other-${o.slug}`}>
                                    <b>{o.fullName}</b>
                                    <span>{o.comingSoon ? `${o.area} · coming soon` : o.area}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {!v.comingSoon && (
                    <section className="strip" id="venue-help">
                        <div className="wrap prog-help">
                            <div>
                                <h2>NOT SURE WHICH PROGRAM IS RIGHT?</h2>
                                <p className="strip-sub">Tell us about your player and we will point you to the right program at {v.suburb}.</p>
                            </div>
                            <div className="loc-actions">
                                <a className="btn" href={`sms:${SMS_NUMBER}`} data-cta="venue-help-text"><MessageSquare /> Text us {SMS_DISPLAY}</a>
                                <a className="btn btn-dark-line" href={`mailto:${INFO_EMAIL}`} data-cta="venue-help-email">Email {INFO_EMAIL}</a>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <PartnerStack theme="light" />
            <HomeFooter />
        </div>
    );
};

export default VenuePage;
