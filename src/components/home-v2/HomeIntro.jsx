import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

// "INTRODUCING RRA MELBOURNE" in the new home-page style (Andy, 23 Nov 2026: the old section looked
// outdated; he chose Option B, "but use another background for Sid"). A full-width banner with
// a photo of Sid coaching; "Watch the video" opens Sid's video in a pop-up. Same video and same
// words as the previous section (home-page/HomeVideo.jsx, kept in the repo).

const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/RRAM%20MAIN/General%20Coaching%20Edit%20RR%20Sid%20V2.mov';
// Sid coaching in the nets (2026), as on the Performance Squads page.
const PHOTO = '/assets/performance-squads/sid-lahiri-coaching-2026.jpg';
const LINE = 'Hear from Siddhartha Lahiri, Head of International Player Development and Performance Coach at the Rajasthan Royals.';

/* Sid's portrait video with play / pause / mute; starts as the pop-up opens. */
const PortraitVideo = () => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const toggle = () => {
        const v = ref.current; if (!v) return;
        if (v.paused) v.play().catch(() => {}); else v.pause();
    };
    useEffect(() => { ref.current?.play().catch(() => {}); }, []);
    return (
        <div className={`iv${playing ? ' playing' : ''}`}>
            <video ref={ref} playsInline preload="metadata" poster={PHOTO}
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
                <source src={VIDEO_URL} type="video/mp4" />
                <source src={VIDEO_URL} type="video/quicktime" />
            </video>
            {!playing && (
                <button type="button" className="iv-play" onClick={toggle} aria-label="Play the video"><Play fill="currentColor" /></button>
            )}
            <div className="iv-ctl">
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
                <button type="button" onClick={() => { if (ref.current) ref.current.muted = !muted; setMuted(!muted); }} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX /> : <Volume2 />}</button>
            </div>
        </div>
    );
};

const HomeIntro = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open) return undefined;
        const k = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', k);
        return () => window.removeEventListener('keydown', k);
    }, [open]);
    return (
        <section className="intro-b" id="video">
            <img className="ib-bg" src={PHOTO} alt="Siddhartha Lahiri coaching in the nets" loading="lazy" decoding="async" />
            <div className="wrap ib-in">
                <span className="eyebrow">From the Academy</span>
                <h2 className="i-h">INTRODUCING<br />RRA MELBOURNE</h2>
                <p className="i-lead">{LINE}</p>
                <button type="button" className="ib-play" onClick={() => setOpen(true)} data-cta="home-intro-watch">
                    <span><Play fill="currentColor" /></span> Watch the video
                </button>
            </div>
            {open && (
                <div className="ib-pop" role="dialog" aria-modal="true" aria-label="Introducing RRA Melbourne" onClick={() => setOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="ib-x" onClick={() => setOpen(false)} aria-label="Close the video"><X /></button>
                        <PortraitVideo />
                    </div>
                </div>
            )}
        </section>
    );
};

export default HomeIntro;
