import React from 'react';
import HomeMedia from '../home-page/HomeMedia';
import { SC_MEDIA } from './scMedia';

// The photo and video strip under the hero (Andy, 23 Nov 2026), the same carousel as the
// home page. What's in it, and what's still to come: scMedia.js.
const SCMedia = () => (
    <HomeMedia
        media={SC_MEDIA}
        eyebrow="Photos & videos"
        title={<>Inside <span className="text-rr-pink">Spin Club</span></>}
        intro="Our spinners, our Royal Spin Coaches, and the wickets they are taking for their clubs."
    />
);

export default SCMedia;
