import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, X, ShieldCheck, Users, Trophy, Plane } from 'lucide-react';

// "INTRODUCING RRA MELBOURNE" in the new home-page style: DRAFT OPTIONS for Andy (23 Nov 2026:
// "at the moment it's pretty poorly presented in the old style ... Please provide me with some
// options"). Same video and same words as the live section (home-page/HomeVideo.jsx); the
// pillar lines in option C are copy already approved elsewhere on the site (homeV2Data
// WELCOME_SLIDE / ROYALS_WAY, the High Performance Camp slide). Preview: /?intro=a|b|c.

const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/RRAM%20MAIN/General%20Coaching%20Edit%20RR%20Sid%20V2.mov';
// Cover photo: Sid running a net session at the Rajasthan Royals High Performance Centre (India
// tour). The video's own cover (intro-video-poster.jpg) is a blurry logo.
const POSTER = '/assets/news/india-tour-sid-lahiri-nets.jpg';
const SID = {
    name: 'Siddhartha Lahiri',
    role: 'Head of International Player Development and Performance Coach',
    org: 'Rajasthan Royals',
    img: '/assets/coaches/sid-lahiri-halla.jpg',
};
const LINE = 'Hear from Siddhartha Lahiri, Head of International Player Development and Performance Coach at the Rajasthan Royals.';

/* The portrait video with play / pause / mute, as on the live section. */
const PortraitVideo = ({ autoPlay = false, id }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const toggle = () => {
        const v = ref.current; if (!v) return;
        if (v.paused) v.play().catch(() => {}); else v.pause();
    };
    return (
        <div className={`iv${playing ? ' playing' : ''}`}>
            <video ref={ref} playsInline preload="metadata" poster={POSTER} autoPlay={autoPlay}
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
                <source src={VIDEO_URL} type="video/mp4" />
                <source src={VIDEO_URL} type="video/quicktime" />
            </video>
            {!playing && (
                <button type="button" className="iv-play" onClick={toggle} aria-label="Play the video" data-cta={`intro-play-${id}`}><Play fill="currentColor" /></button>
            )}
            <div className="iv-ctl">
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
                <button type="button" onClick={() => { if (ref.current) ref.current.muted = !muted; setMuted(!muted); }} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX /> : <Volume2 />}</button>
            </div>
        </div>
    );
};

const Credit = () => (
    <div className="i-credit">
        <img src={SID.img} alt={SID.name} />
        <div><strong>{SID.name.toUpperCase()}</strong><span>{SID.role}</span><em>{SID.org}</em></div>
    </div>
);

/* A: pink band, words left, video right (like the banner and Leadership sections). */
const IntroA = () => (
    <section className="band band-video strip intro-a" id="video">
        <div className="wrap ia-grid">
            <div>
                <span className="eyebrow">From the Academy</span>
                <h2 className="i-h">INTRODUCING<br />RRA MELBOURNE</h2>
                <p className="i-lead">{LINE}</p>
                <Credit />
                <div className="i-btns">
                    <Link className="btn btn-white" to="/coaches" data-cta="intro-a-coaches">Meet Our Coaches</Link>
                </div>
            </div>
            <PortraitVideo id="a" />
        </div>
    </section>
);

/* B: full-width video banner; the video opens in a pop-up. Shortest on the page. */
const IntroB = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open) return undefined;
        const k = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', k);
        return () => window.removeEventListener('keydown', k);
    }, [open]);
    return (
        <section className="intro-b" id="video">
            <img className="ib-bg" src={POSTER} alt="" />
            <div className="wrap ib-in">
                <span className="eyebrow">From the Academy</span>
                <h2 className="i-h">INTRODUCING RRA MELBOURNE</h2>
                <p className="i-lead">{LINE}</p>
                <button type="button" className="ib-play" onClick={() => setOpen(true)} data-cta="intro-b-play">
                    <span><Play fill="currentColor" /></span> Watch the video
                </button>
            </div>
            {open && (
                <div className="ib-pop" role="dialog" aria-modal="true" aria-label="Introducing RRA Melbourne" onClick={() => setOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="ib-x" onClick={() => setOpen(false)} aria-label="Close"><X /></button>
                        <PortraitVideo id="b" autoPlay />
                    </div>
                </div>
            )}
        </section>
    );
};

/* C: white strip, like News: the video beside four cards on who we are. */
const PILLARS = [
    { icon: <ShieldCheck />, t: 'The official Royals Academy', d: 'The official cricket development arm of the Rajasthan Royals IPL franchise.' },
    { icon: <Users />, t: 'Royals qualified coaches', d: 'Guided by Royals qualified coaches who live and breathe the Royals Way.' },
    { icon: <Trophy />, t: 'For every cricketer', d: 'Male and female cricketers, players of all ages and abilities.' },
    { icon: <Plane />, t: 'A pathway to India', d: 'Our April 2027 tour to the Rajasthan Royals High Performance Centre.', to: '/tours' },
];
const IntroC = () => (
    <section className="strip white intro-c" id="video">
        <div className="wrap">
            <div className="strip-head"><div><h2>INTRODUCING RRA MELBOURNE</h2></div><Link className="more" to="/coaches">Our Coaches</Link></div>
            <p className="strip-sub">{LINE}</p>
            <div className="ic-grid">
                <PortraitVideo id="c" />
                <div className="ic-side">
                    <div className="ic-cards">
                        {PILLARS.map(({ icon, t, d, to }) => {
                            const body = <><span className="ic-ico">{icon}</span><h3>{t}</h3><p>{d}</p></>;
                            return to
                                ? <Link key={t} className="ic-card" to={to} data-cta="intro-c-tours">{body}</Link>
                                : <div key={t} className="ic-card">{body}</div>;
                        })}
                    </div>
                    <Credit />
                </div>
            </div>
        </div>
    </section>
);

const HomeIntro = ({ option }) => (option === 'a' ? <IntroA /> : option === 'b' ? <IntroB /> : <IntroC />);
export default HomeIntro;
