import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, ShoppingCart, CalendarDays, Share2 } from 'lucide-react';
import { PROGRAMS_DROPDOWN } from '../Navbar';
import { ANNOUNCEMENTS } from '../home-page/openDaysData';
import { faqs } from '../home-page/HomeFAQ';
import { PROGRAMS as FOOTER_PROGRAMS, ACADEMY as FOOTER_ACADEMY, COMPANY as FOOTER_COMPANY } from '../Footer';
import { useStories, storyPath } from '../news/news';
import { useWeekendWrap } from '../news/weekendWrap';
import { WELCOME_SLIDE, PROGRAM_SLIDES, LEADERS, TEAM, ROYALS_WAY, STORE } from './homeV2Data';

// The home page sections in the rajasthanroyals.com layout (Andy's mock-up, 16 Nov 2026).
// Markup and class names follow the mock-up; styles are in homeV2.css (all under .rrh).

const INSTAGRAM = 'https://www.instagram.com/rramelbourne?igsh=MXA3OGx4b3JocTdvcA%3D%3D&utm_source=qr';
const FACEBOOK = 'https://www.facebook.com/share/1HsxoaRXWP/?mibextid=wwXIfr';
const EMAIL = 'info@rramelbourne.com';
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const IgIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 100 13.4 6.7 6.7 0 000-13.4zm0 11a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.9-11.3a1.6 1.6 0 11-3.1 0 1.6 1.6 0 013.1 0z" /></svg>;
const FbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z" /></svg>;

const tagClass = (badgeColor) => (/green/.test(badgeColor || '') ? 'tag green' : 'tag');
const isExternal = (href) => /^https?:/.test(href);

/* ── Header: two rows, like rajasthanroyals.com ─────────────────────────── */
export const HomeHeader = ({ onRegister }) => {
    const [progOpen, setProgOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const progRef = useRef(null);
    useEffect(() => {
        const onDoc = (e) => { if (progRef.current && !progRef.current.contains(e.target)) setProgOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') { setProgOpen(false); setMenuOpen(false); } };
        document.addEventListener('click', onDoc);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
    }, []);
    // A home-page section: scroll to it here, or open the home page at it from another page (/programs).
    const jump = (id) => (e) => {
        e.preventDefault(); setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
        else window.location.assign(`/#${id}`);
    };
    const register = (e) => { e.preventDefault(); setMenuOpen(false); onRegister(); };
    const progLinks = PROGRAMS_DROPDOWN.map((p) => (
        <Link key={p.route} to={p.route} data-cta={`nav-program-${p.route.slice(1)}`} onClick={() => { setProgOpen(false); setMenuOpen(false); }}>
            {p.label} {p.badge && <span className={tagClass(p.badgeColor)}>{p.badge}</span>}
        </Link>
    ));
    return (
        <>
            <header className="hdr" id="top">
                <Link className="hdr-logo" to="/" aria-label="Rajasthan Royals Academy Melbourne, home"><img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" /></Link>
                <div className="hdr-rows">
                    <div className="hdr-top">
                        <div className="toplinks">
                            <a href="https://www.rajasthanroyals.com" target="_blank" rel="noopener noreferrer">rajasthanroyals.com</a>
                            {/* Every centre (Andy, 23 Nov 2026) */}
                            <span>Mickleham · Cranbourne North · Hallam · Ravenhall</span>
                        </div>
                        <div className="topright">
                            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Follow RRA Melbourne on Instagram"><IgIcon /></a>
                            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Follow RRA Melbourne on Facebook"><FbIcon /></a>
                            <span className="sep" aria-hidden="true" />
                            <a href={`mailto:${EMAIL}`} style={{ display: 'inline' }}>{EMAIL}</a>
                        </div>
                    </div>
                    <div className="hdr-main">
                        <nav className="mainnav" aria-label="Main">
                            <div className={`ni${progOpen ? ' open' : ''}`} ref={progRef}>
                                <button className="nl" type="button" data-cta="nav-programs" aria-expanded={progOpen} aria-controls="progMenu" onClick={(e) => { e.stopPropagation(); setProgOpen((o) => !o); }}>
                                    Programs <ChevronDown />
                                </button>
                                <div className="dd" id="progMenu">
                                    {progLinks}
                                    <Link className="all" to="/programs" data-cta="nav-all-programs" onClick={() => setProgOpen(false)}>View All Programs →</Link>
                                </div>
                            </div>
                            <div className="ni"><a className="nl" href="#about" data-cta="nav-about" onClick={jump('about')}>About</a></div>
                            <div className="ni"><a className="nl" href="#coaches" data-cta="nav-coaches" onClick={jump('coaches')}>Coaches</a></div>
                            <div className="ni"><Link className="nl" to="/private-coaching" data-cta="nav-private-coaching">Private Coaching</Link></div>
                            <div className="ni"><Link className="nl" to="/news" data-cta="nav-news">News</Link></div>
                            <div className="ni"><Link className="nl" to="/careers" data-cta="nav-careers">Careers</Link></div>
                            <div className="ni"><a className="nl" href="#faq" data-cta="nav-faq" onClick={jump('faq')}>FAQ</a></div>
                        </nav>
                        <div className="hdr-actions">
                            <Link className="shop-link" to="/academy-shop" data-cta="nav-shop"><ShoppingCart /><span>Shop</span></Link>
                            <a className="btn" href="#register" onClick={register} data-cta="home-header-register">Register Now</a>
                            <button className="menu-btn" type="button" data-cta="nav-phone-menu" aria-expanded={menuOpen} aria-controls="mnav" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((o) => !o)}>
                                {menuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {menuOpen && (
                <div className="mnav" id="mnav">
                    <div className="mlabel">Programs</div>
                    <div className="msub">{progLinks}<Link to="/programs" data-cta="nav-phone-all-programs" onClick={() => setMenuOpen(false)}>View All Programs →</Link></div>
                    <a href="#about" onClick={jump('about')}>About</a>
                    <a href="#coaches" onClick={jump('coaches')}>Coaches</a>
                    <Link to="/private-coaching">Private Coaching</Link>
                    <Link to="/news">News</Link>
                    <Link to="/careers">Careers</Link>
                    <a href="#faq" onClick={jump('faq')}>FAQ</a>
                    <Link to="/academy-shop">Shop</Link>
                    <a className="btn" href="#register" onClick={register}>Register Now</a>
                    <a className="rrlink" href="https://www.rajasthanroyals.com" target="_blank" rel="noopener noreferrer">rajasthanroyals.com</a>
                </div>
            )}
        </>
    );
};

/* ── What's On strip (the same items as the What's On pop-up) ──────────── */
// "What's On" and "See more" open the Programs page (Andy, 23 Nov 2026: no pop-up on arrival).
export const WhatsOn = () => {
    const [hidden, setHidden] = useState(false);
    if (hidden || ANNOUNCEMENTS.length === 0) return null;
    const run = (copy) => (
        <span className="tkc" aria-hidden={copy ? 'true' : undefined}>
            <b className="first">Now on at Rajasthan Royals Academy Melbourne</b>
            {ANNOUNCEMENTS.map((a) => (
                <React.Fragment key={a.key}><span className="star">✦</span><b>{a.name}</b><i>{a.tag}</i></React.Fragment>
            ))}
            <span className="star">✦</span><span className="end">Register now — pick your program</span><span className="star">✦</span>
        </span>
    );
    return (
        <div className="ticker" role="region" aria-label="What's On">
            <Link to="/programs" className="tk-label" data-cta="ticker-label" style={{ color: '#fff', textDecoration: 'none' }}><span className="tk-dot" aria-hidden="true" />WHAT'S ON</Link>
            <div className="tk-track"><div className="tk-run">{run(false)}{run(true)}</div></div>
            <div className="tk-actions">
                <Link className="btn btn-sm tk-more" to="/programs" data-cta="ticker-see-more">See more</Link>
                <button className="tk-x" type="button" aria-label="Hide the What's On strip" data-cta="ticker-close" onClick={() => setHidden(true)}>×</button>
            </div>
        </div>
    );
};

/* ── Banner carousel: centred slide, neighbours peeking, every 5 s, loops ─ */
export const Banner = ({ onRegister }) => {
    const slides = [{ welcome: true }, ...PROGRAM_SLIDES];
    const n = slides.length;
    const all = [slides[n - 1], ...slides, slides[0]]; // clones at both ends for the loop
    const trackRef = useRef(null);
    const viewRef = useRef(null);
    const [pos, setPos] = useState(1);
    const [animate, setAnimate] = useState(false);
    const [offset, setOffset] = useState(0);
    const timer = useRef(null);

    const measure = useCallback(() => {
        const track = trackRef.current; const view = viewRef.current;
        if (!track || !view || !track.children[0]) return;
        const w = track.children[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const vw = view.getBoundingClientRect().width;
        setOffset((vw - w) / 2 - pos * (w + gap));
    }, [pos]);
    useEffect(() => { measure(); }, [measure]);

    // Slides going blank after scrolling (Andy, 27 Nov 2026). On phones the address bar showing and
    // hiding while you scroll fires 'resize'. That used to cancel the slide animation, so the jump
    // from the end clone back to the real slide (on transitionend) never happened, and autoplay then
    // ran past the end of the track into empty space. Now: height-only resizes are ignored; the
    // position is always brought back onto a real slide, by a timer as well as by transitionend;
    // and autoplay pauses while the banner is off screen or the tab is hidden.
    const real = useCallback((p) => (p > n ? p - n : p < 1 ? p + n : p), [n]);
    const lastW = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);
    useEffect(() => {
        const r = () => {
            if (window.innerWidth === lastW.current) return; // address bar, not a real resize
            lastW.current = window.innerWidth;
            setAnimate(false); setPos(real); measure();
        };
        window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
    }, [measure, real]);
    useEffect(() => {
        if (pos >= 1 && pos <= n) return undefined;
        const t = setTimeout(() => { setAnimate(false); setPos(real); }, 700); // the slide takes 600ms
        return () => clearTimeout(t);
    }, [pos, n, real]);

    const go = useCallback((d) => { setAnimate(true); setPos((p) => real(p) + d); }, [real]);
    const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
    const visible = useRef(true);
    const start = useCallback(() => {
        if (reduceMotion()) return; stop();
        timer.current = setInterval(() => { if (visible.current && !document.hidden) go(1); }, 5000);
    }, [go]);
    useEffect(() => { start(); return stop; }, [start]);
    useEffect(() => {
        const el = viewRef.current; if (!el || typeof IntersectionObserver === 'undefined') return undefined;
        const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.25 });
        io.observe(el); return () => io.disconnect();
    }, []);
    const onEnd = (e) => {
        if (e && e.target !== trackRef.current) return; // a slide's own fade, not the track
        if (pos < 1 || pos > n) { setAnimate(false); setPos(real); }
    };
    const sx = useRef(null);

    const slide = (s, i, clone) => {
        const label = `${((i - 1 + n) % n) + 1} of ${n}`;
        const tab = clone ? { tabIndex: -1 } : {};
        if (s.welcome) {
            return (
                <article key={`w${i}`} className={`slide${i === pos ? ' is-active' : ''}`} aria-roledescription="slide" aria-label={label} aria-hidden={clone || undefined}>
                    <img className="bg" src={WELCOME_SLIDE.src} alt="" style={{ objectPosition: WELCOME_SLIDE.position }} />
                    <div className="scrim" />
                    <div className="copy">
                        <span className="kicker">{WELCOME_SLIDE.kicker}</span>
                        {clone ? <p className="h1like" aria-hidden="true"><span>Play the</span><br /><span className="hl">Royals Way.</span></p>
                            : <h1>Play the<br /><span className="hl">Royals Way.</span></h1>}
                        <p className="lead">{WELCOME_SLIDE.lead}</p>
                        <p>{WELCOME_SLIDE.body}</p>
                        <div className="ctas">
                            <a className="btn" href="#register" {...tab} onClick={(e) => { e.preventDefault(); onRegister(); }} data-cta="home-banner-register">Register Now</a>
                            <span className="or">OR</span>
                            <Link className="btn btn-line" to="/programs" {...tab} data-cta="home-banner-programs">Explore All Programs</Link>
                        </div>
                    </div>
                </article>
            );
        }
        return (
            <article key={`${s.href}${i}`} className={`slide${s.split ? ' split' : ''}${i === pos ? ' is-active' : ''}`} aria-roledescription="slide" aria-label={label} aria-hidden={clone || undefined}>
                <img className="bg" src={s.src} alt={clone ? '' : s.alt} style={s.position ? { objectPosition: s.position } : undefined} />
                <div className="scrim" />
                <div className="copy">
                    <span className="kicker">Choose a current program</span>
                    <h2>{s.title}</h2>
                    <p className="line">{s.line}</p>
                    <div className="ctas"><Link className="btn" to={s.href} {...tab} data-cta={`home-banner-${s.href.slice(1)}`}>{s.cta || 'View Program'}</Link></div>
                </div>
            </article>
        );
    };

    return (
        <section className="showcase" aria-roledescription="carousel" aria-label="Featured" id="hero">
            <div className="car" onMouseEnter={stop} onMouseLeave={start}
                onTouchStart={(e) => { sx.current = e.touches[0].clientX; stop(); }}
                onTouchEnd={(e) => { if (sx.current === null) return; const dx = e.changedTouches[0].clientX - sx.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx.current = null; start(); }}>
                <div className="car-view" ref={viewRef}>
                    <div className={`car-track${animate ? '' : ' jump'}`} ref={trackRef} style={{ transform: `translateX(${offset}px)` }} onTransitionEnd={onEnd}>
                        {all.map((s, i) => slide(s, i, i === 0 || i === n + 1))}
                    </div>
                </div>
                <div className="car-nav">
                    <button type="button" aria-label="Previous slide" data-cta="banner-prev" onClick={() => { go(-1); start(); }}><ChevronLeft /></button>
                    <button type="button" aria-label="Next slide" data-cta="banner-next" onClick={() => { go(1); start(); }}><ChevronRight /></button>
                </div>
            </div>
        </section>
    );
};

/* ── News strip (News & features stories, in the mock-up's card style) ─── */
export const NewsStrip = () => {
    const { stories } = useStories();
    const picked = stories.slice(0, 3);
    if (picked.length === 0) return null;
    return (
        <section className="strip" id="news">
            <div className="wrap">
                <div className="strip-head"><h2>NEWS</h2><Link className="more" to="/news" data-cta="home-news-more">View More</Link></div>
                <div className={`row c3`}>
                    {picked.map((s) => (
                        <Link key={s.id} className="ncard" to={storyPath(s.id)} data-cta={`home-news-${s.id}`}>
                            {s.image && <img src={s.image} alt="" loading="lazy" />}
                            <span className="grad" />
                            <span className="nt">
                                <h3>{s.title}</h3>
                                <span className="nmeta"><span><CalendarDays />{s.date}</span><Share2 /></span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── Weekend Wrap: our program players' best club performances (components/news/weekendWrap.js) ── */
const WrapList = ({ title, items }) => (items && items.length ? (
    <div className="wwp">
        <h3>{title}</h3>
        <ul>
            {items.map((p) => (
                <li key={p.name + p.figure}>
                    <span className="wwn"><b>{p.name}</b><small>{p.detail}</small></span>
                    <span className="wwf">{p.figure}</span>
                </li>
            ))}
        </ul>
    </div>
) : null);

export const WeekendWrap = () => {
    const wrap = useWeekendWrap();
    if (!wrap) return null;
    return (
        <section className="strip ww" id="weekend-wrap">
            <div className="wrap">
                <div className="strip-head">
                    <div><span className="eyebrow">{wrap.label} · Club cricket</span><h2>WEEKEND WRAP</h2></div>
                    {wrap.storySlug && <Link className="more" to={storyPath(wrap.storySlug)} data-cta="home-weekend-wrap">Read the weekend wrap</Link>}
                </div>
                <p className="strip-sub">{wrap.headline}.</p>
                <div className="wwg">
                    <WrapList title="Top knocks" items={wrap.knocks.slice(0, 8)} />
                    <div className="wws">
                        <WrapList title="Top spells" items={wrap.spells} />
                        <WrapList title="In the field" items={wrap.fielding} />
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ── Leadership carousel + coaching team row ───────────────────────────── */
export const Leadership = () => {
    const rowRef = useRef(null);
    const step = () => { const tm = rowRef.current?.querySelector('.tm'); return tm ? (tm.getBoundingClientRect().width + 16) * 2 : 300; };
    // The arrows (Andy, 23 Nov 2026: they did nothing): shown only when the row is wider than the
    // screen; at either end they wrap round to the other end.
    const [canScroll, setCanScroll] = useState(false);
    useEffect(() => {
        const el = rowRef.current; if (!el) return undefined;
        const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 4);
        check();
        const ro = new ResizeObserver(check); ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const scroll = (d) => {
        const el = rowRef.current; if (!el) return;
        const behavior = reduceMotion() ? 'auto' : 'smooth';
        const max = el.scrollWidth - el.clientWidth;
        if (d > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior });
        else if (d < 0 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior });
        else el.scrollBy({ left: d * step(), behavior });
    };
    return (
        <section className="band band-players strip" id="coaches">
            <div className="wrap">
                <div className="strip-head"><h2>LEADING THE ROYALS ACADEMY</h2></div>
                <p className="strip-sub">Our leadership team brings a wealth of global cricket knowledge and IPL franchise experience as well as elite playing and coaching credentials directly to Melbourne cricketers.</p>
                {/* The three leaders together in one block (Andy, 25 Nov 2026: "see our three key leaders in
                    one block ... so that everyone's faces turn up"), replacing the one-at-a-time carousel. */}
                <div className="leaders">
                    {LEADERS.map((c) => {
                        const [first, ...rest] = c.name.split(' ');
                        return (
                            <article key={c.name} className="leader">
                                <div className="limg"><img src={c.img} alt={c.name} loading="lazy" decoding="async" /></div>
                                <div className="ltext">
                                    <h3 className="cname"><span className="first">{first.toUpperCase()}</span> <span className="last">{rest.join(' ').toUpperCase()}</span></h3>
                                    <p className="crole">{c.role}</p>
                                    <p className="corg">{c.org}</p>
                                    <p className="cbio">{c.bio}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
                <div className="team">
                    <div className="team-head">
                        <h3>OUR COACHING TEAM</h3>
                        <div className="team-ctl">
                            <Link className="more" to="/coaches" data-cta="home-all-coaches">Meet all our coaches →</Link>
                            {canScroll && <>
                            <button type="button" aria-label="Scroll the coaching team left" data-cta="team-prev" onClick={() => scroll(-1)}><ChevronLeft /></button>
                            <button type="button" aria-label="Scroll the coaching team right" data-cta="team-next" onClick={() => scroll(1)}><ChevronRight /></button>
                            </>}
                        </div>
                    </div>
                    <div className="team-row" ref={rowRef}>
                        {TEAM.map((t) => (
                            <Link key={t.name} className="tm" to="/coaches" data-cta={`coach-${t.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                {t.img
                                    ? <span className="av"><img src={t.img} alt="" style={t.pos ? { objectPosition: t.pos } : undefined} /></span>
                                    : <span className="av av-initials" aria-hidden="true">{t.name.split(' ').map((w) => w[0]).join('')}</span>}
                                <b>{t.name}</b><span>{t.line}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ── The Royals Way in Melbourne ───────────────────────────────────────── */
export const RoyalsWay = () => (
    <section className="strip white" id="about">
        <div className="wrap">
            <div className="strip-head"><div><span className="eyebrow">Who we are</span><h2>THE ROYALS WAY IN MELBOURNE</h2></div></div>
            <div className="about-text">{ROYALS_WAY.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
            <div className="row c2">
                {ROYALS_WAY.tiles.map((t) => (
                    <figure key={t.title} className="tile" style={{ margin: 0 }}>
                        <img src={t.src} alt={t.alt} loading="lazy" style={t.pos ? { objectPosition: t.pos } : undefined} />
                        <span className="grad" />
                        <figcaption className="tt"><h3>{t.title}</h3><p>{t.line}</p></figcaption>
                    </figure>
                ))}
            </div>
        </div>
    </section>
);

/* ── Power Cricket Store band ──────────────────────────────────────────── */
export const Store = () => (
    <section className="band band-shop strip" id="store">
        <div className="wrap">
            <div className="strip-head">
                <div className="store-head"><img className="store-logo" src="/assets/powergame/power-cricket-logo.png" alt="Power Cricket" /><h2>POWER CRICKET STORE</h2></div>
                <Link className="more" to="/academy-shop" data-cta="home-store-more">View More</Link>
            </div>
            <p className="strip-sub">Official RRA Melbourne academy kit — now available online.</p>
            <div className="row">
                {STORE.map((p) => (
                    <article key={p.id} className="scard">
                        <div className="simg"><img src={p.img} alt={p.name} loading="lazy" />{p.badge && <span className="ribbon"><span>{p.badge}</span></span>}</div>
                        <div className="sb">
                            <h3>{p.name}</h3>
                            <div className="price">{p.price} <small>incl. GST</small></div>
                            <Link className="btn btn-sm btn-block" to="/academy-shop" data-cta={`home-store-${p.id}`}>Shop Now</Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

/* ── Common questions ──────────────────────────────────────────────────── */
export const Faq = ({ onRegister }) => {
    const [open, setOpen] = useState(null);
    return (
        <section className="strip" id="faq">
            <div className="wrap">
                <div className="strip-head"><h2>COMMON QUESTIONS</h2></div>
                <p className="strip-sub">Everything you need to know before you register.</p>
                <div className="faq">
                    {faqs.map((f, i) => (
                        <div className="qa" key={f.q}>
                            <button type="button" aria-expanded={open === i} aria-controls={`faq-a${i}`} id={`faq-q${i}`} data-cta={`faq-${i + 1}`} onClick={() => setOpen(open === i ? null : i)}>
                                {f.q}<ChevronDown />
                            </button>
                            <p className="ans" id={`faq-a${i}`} hidden={open !== i}>{f.a}</p>
                        </div>
                    ))}
                </div>
                <a className="btn" href="#register" onClick={(e) => { e.preventDefault(); onRegister(); }} data-cta="home-faq-register">Register Now</a>
            </div>
        </section>
    );
};

/* ── We're hiring (the careers banner's own words) ─────────────────────── */
export const Hire = () => (
    <section className="strip" style={{ paddingTop: 0 }} id="careers-banner">
        <div className="wrap">
            <div className="hire">
                <div>
                    <span className="eyebrow">We're hiring coaches</span>
                    <h2>SHAPE THE NEXT GENERATION</h2>
                    <p>Cricket coaching roles at our Melbourne centres, from Cadet Coach to Performance Squad Coach. See the coaching roles and how to apply.</p>
                    <Link className="btn" to="/careers" data-cta="home-careers-banner">See Coaching Roles</Link>
                    <small>Casual or contract · Working with Children Check required. RRA Melbourne is committed to the safety and wellbeing of every child in our care.</small>
                </div>
                <img className="hlogo" src="/assets/MELBOURNE_OFFICIAL.png" alt="" />
            </div>
        </div>
    </section>
);

/* ── Footer (pink, like the Royals site). Partners sit above it (PartnerStack). ── */
const FootCol = ({ title, links }) => (
    <div className="fcol"><h3>{title}</h3><ul>{links.map((l) => <li key={l.to}>{isExternal(l.to) ? <a href={l.to}>{l.label}</a> : <Link to={l.to}>{l.label}</Link>}</li>)}</ul></div>
);
export const HomeFooter = () => (
    <footer>
        <div className="foot-mid">
            <div className="wrap fgrid">
                <div>
                    <Link to="/" aria-label="Rajasthan Royals Academy Melbourne, home"><img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" /></Link>
                    <p>Melbourne&apos;s Rajasthan Royals Academy — junior programs, performance squads, private coaching, masterclasses and holiday program.</p>
                    <div className="fsoc">
                        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Follow RRA Melbourne on Instagram"><IgIcon /></a>
                        <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Follow RRA Melbourne on Facebook"><FbIcon /></a>
                    </div>
                </div>
                <FootCol title="Programs" links={FOOTER_PROGRAMS} />
                <FootCol title="Academy" links={FOOTER_ACADEMY} />
                <FootCol title="Company" links={FOOTER_COMPANY} />
            </div>
        </div>
        <div className="foot-bot">
            <div className="wrap"><a className="email" href={`mailto:${EMAIL}`}>{EMAIL}</a><span>© {new Date().getFullYear()} Rajasthan Royals Academy Melbourne. All rights reserved.</span></div>
        </div>
    </footer>
);
