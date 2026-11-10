import React, { useState } from 'react';
import { JR_VIDEOS } from './jrTerm4Data';
import { VideoCard } from '../india-tour-2026/ITVideos';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';
import JRSectionCTA from './JRSectionCTA';

// Videos under the photo strip (Andy, 10 Nov 2026), built like the /tours video section:
// the same portrait player (VideoCard: big play button, play/pause + mute, one video at a
// time) in the same swipeable carousel. Videos are listed in JR_VIDEOS (jrTerm4Data.js);
// with none listed the section is hidden.
const JRVideos = () => {
    const total = JR_VIDEOS.length;
    const carousel = useCarousel(total);
    const [activeId, setActiveId] = useState(null);
    if (total === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-rr-dark overflow-hidden" data-jr-videos>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Watch a session</p>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                        Junior Royals <span className="text-rr-pink">in action</span>
                    </h2>
                </div>

                <CarouselTrack carousel={carousel} label="Videos from Junior Royals sessions">
                    {JR_VIDEOS.map((v, i) => (
                        <div key={v.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[72%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3rem)/4)]">
                            <VideoCard v={v} id={i} activeId={activeId} setActiveId={setActiveId} />
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous video" nextLabel="Next video" dark idPrefix="jr-videos" />
                <JRSectionCTA id="videos" />
            </div>
        </section>
    );
};

export default JRVideos;
