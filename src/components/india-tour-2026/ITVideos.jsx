import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ITSectionHeader from './ITSectionHeader';
import ITRegisterButton from './ITRegisterButton';
import { useCarousel, CarouselTrack, CarouselControls } from './ITCarousel';
import { VIDEOS } from './itMedia';

// Video section on /tours. Same player as the home page video (portrait 9:16,
// big pink play button, play/pause + mute bar, academy badge), but several of
// them in a swipeable carousel. Only one plays at a time. Videos are listed in
// itMedia.js; with none listed the section is hidden.

export const VideoCard = ({ v, id, activeId, setActiveId }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [started, setStarted] = useState(false);
    const [muted, setMuted] = useState(false);

    // Another card started: pause this one.
    useEffect(() => {
        if (activeId !== id && ref.current && !ref.current.paused) ref.current.pause();
    }, [activeId, id]);

    const toggle = () => {
        const el = ref.current;
        if (!el) return;
        if (!el.paused) {
            el.pause();
            return;
        }
        setActiveId(id);
        el.play().then(() => setStarted(true)).catch(() => {});
    };
    const toggleMute = () => {
        if (!ref.current) return;
        ref.current.muted = !muted;
        setMuted(!muted);
    };

    return (
        <figure>
            <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] group bg-black aspect-[9/16]">
                {v.embed ? (
                    <iframe
                        src={v.embed}
                        title={v.title || 'Video'}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                ) : (
                    <>
                        <video
                            ref={ref}
                            className="absolute inset-0 w-full h-full object-cover"
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => setPlaying(false)}
                            playsInline
                            preload="metadata"
                            poster={v.poster}
                        >
                            <source src={v.src} type="video/mp4" />
                            {/\.mov$/i.test(v.src) && <source src={v.src} type="video/quicktime" />}
                        </video>

                        {!started && <div className="absolute inset-0 bg-rr-dark/40 pointer-events-none" />}

                        {!playing && (
                            <button onClick={toggle} className="absolute inset-0 flex items-center justify-center group/play" aria-label={`Play: ${v.title || 'video'}`}>
                                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-[0_0_50px_rgba(225,31,143,0.6)] group-hover/play:scale-110 group-hover/play:bg-rr-pink transition-all duration-300">
                                    <Play className="w-8 h-8 md:w-9 md:h-9 text-white ml-1" fill="white" />
                                </span>
                            </button>
                        )}

                        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rr-dark/90 to-transparent transition-opacity duration-300 flex items-center justify-between ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                            <button onClick={toggle} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
                                {playing ? <Pause className="w-4 h-4 text-white" fill="white" /> : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
                            </button>
                            <button onClick={toggleMute} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                                {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                            </button>
                        </div>

                        <div className="absolute top-4 left-4 pointer-events-none">
                            <div className="inline-flex items-center gap-2 bg-rr-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                                <img src="/assets/MELBOURNE_OFFICIAL.png" alt="" className="h-4 w-auto object-contain brightness-0 invert opacity-70" />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {(v.title || v.caption) && (
                <figcaption className="mt-4">
                    {v.title && <span className="block text-sm md:text-base font-black text-white uppercase tracking-wide">{v.title}</span>}
                    {v.caption && <span className="block text-xs md:text-sm text-white/60 font-medium mt-1">{v.caption}</span>}
                </figcaption>
            )}
        </figure>
    );
};

const ITVideos = ({ copy }) => {
    const c = copy.videos;
    const total = VIDEOS.length;
    const carousel = useCarousel(total);
    const [activeId, setActiveId] = useState(null);

    if (total === 0) return null;

    return (
        <section className="py-20 md:py-24 bg-rr-dark overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <ITSectionHeader eyebrow={c.eyebrow} heading={c.heading} accent={c.headingAccent} lead={c.lead} dark />

                <div className="mt-10">
                    <CarouselTrack carousel={carousel} label={c.carouselLabel}>
                        {VIDEOS.map((v, i) => (
                            <div
                                key={v.src || v.embed}
                                data-slide
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} / ${total}`}
                                className="snap-start shrink-0 w-[72%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3rem)/4)]"
                            >
                                <VideoCard v={v} id={i} activeId={activeId} setActiveId={setActiveId} />
                            </div>
                        ))}
                    </CarouselTrack>
                    <CarouselControls carousel={carousel} total={total} prevLabel={c.prevLabel} nextLabel={c.nextLabel} dark idPrefix="videos-carousel" />
                </div>

                <div className="mt-10">
                    <ITRegisterButton label={copy.hero.cta} id="videos-register" />
                </div>
            </div>
        </section>
    );
};

export default ITVideos;
