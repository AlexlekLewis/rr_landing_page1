import React from 'react';
import ITSectionHeader from './ITSectionHeader';
import ITRegisterButton from './ITRegisterButton';
import { VIDEOS, VIDEO_PLACEHOLDER_IMAGE } from './itMedia';

// Video section near the top of /tours. Videos are listed in itMedia.js: the
// first is shown large, any others in a grid beneath it. With no videos yet it
// shows a "coming soon" frame so the layout is ready for them.

const VideoFrame = ({ v, large = false }) => (
    <figure>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
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
                <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                />
            )}
        </div>
        {(v.title || v.caption) && (
            <figcaption className="mt-3">
                {v.title && (
                    <span className={`block font-black text-white uppercase tracking-wide ${large ? 'text-lg' : 'text-sm'}`}>
                        {v.title}
                    </span>
                )}
                {v.caption && <span className="block text-sm text-white/65 font-medium mt-1">{v.caption}</span>}
            </figcaption>
        )}
    </figure>
);

const ITVideos = ({ copy }) => {
    const c = copy.videos;
    const [first, ...rest] = VIDEOS;

    return (
        <section className="py-20 md:py-24 bg-rr-navy">
            <div className="max-w-6xl mx-auto px-6">
                <ITSectionHeader eyebrow={c.eyebrow} heading={c.heading} accent={c.headingAccent} lead={c.lead} dark />

                <div className="mt-10">
                    {first ? (
                        <>
                            <VideoFrame v={first} large />
                            {rest.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {rest.map((v) => <VideoFrame key={v.src || v.embed} v={v} />)}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl" data-video-placeholder>
                            {VIDEO_PLACEHOLDER_IMAGE && <img
                                src={VIDEO_PLACEHOLDER_IMAGE}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover object-[50%_45%]"
                                loading="lazy"
                            />}
                            <div className="absolute inset-0 bg-rr-navy/70" />
                            <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-xl">
                                    <svg className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                                <p className="mt-5 text-lg md:text-2xl font-black text-white uppercase tracking-wide">{c.comingSoonTitle}</p>
                                <p className="mt-2 text-sm md:text-base text-white/75 font-medium max-w-md">{c.comingSoonBody}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <ITRegisterButton label={copy.hero.cta} id="videos-register" />
                </div>
            </div>
        </section>
    );
};

export default ITVideos;
