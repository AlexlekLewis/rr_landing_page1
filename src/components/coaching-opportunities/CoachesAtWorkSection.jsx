import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

// Our own coaches, in our own sessions: Junior Royals nights at the Melbourne
// centres and the India tour nets. Every image is already in /public — stills taken
// from the Junior Royals and tour session videos plus the Junior Royals gallery.
const PHOTOS = [
    { src: '/assets/junior-royals/benefits/coach-briefing-batters.webp', alt: 'A Royals Academy coach briefing a group of padded-up batters before a net session', caption: 'Briefing the batters before nets', wide: true },
    { src: '/junior-royals/videos/coaching-young-batter.jpg', alt: 'A coach kneeling beside a young batter, adjusting his stance', caption: 'One-on-one with a young batter' },
    { src: '/tours/somi-with-player.jpg', alt: 'A coach talking a player through his batting in outdoor nets in India', caption: 'Feedback in the nets, India tour' },
    { src: '/junior-royals/videos/sweep-shot.jpg', alt: 'A coach demonstrating the sweep shot to young batters', caption: 'Demonstrating the sweep' },
    { src: '/assets/junior-royals/gallery/hands-on-batting.webp', alt: 'A coach working hands-on with a young batter in the indoor nets', caption: 'Hands-on batting work' },
    { src: '/assets/junior-royals/benefits/small-group-two-coaches.webp', alt: 'Two coaches running a small group of young batters', caption: 'Two coaches, one small group', wide: true },
    { src: '/tours/faiz-wet-ball-drill.jpg', alt: 'A coach in Royals kit explaining a wet-ball drill beside the nets', caption: 'Wet-ball drill, India tour' },
    { src: '/tours/sid-downswing.jpg', alt: 'A coach watching a batter practise his downswing in outdoor nets', caption: 'Working on the downswing' },
    { src: '/assets/junior-royals/gallery/coach-demo-bat.webp', alt: 'A coach showing young players how to hold the bat', caption: 'Showing the grip' },
    { src: '/assets/junior-royals/benefits/bowling-arm-drill.webp', alt: 'A coach kneeling to work with young bowlers on their bowling arm', caption: 'Bowling-arm drill' },
];

const CoachesAtWorkSection = () => (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6">
            <SectionHeader
                eyebrow="Coaches at Work"
                title="Our Coaches"
                accent="In Action."
                intro="Small groups, real feedback and hands-on coaching, in the Melbourne nets and on tour in India."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {PHOTOS.map((photo, i) => (
                    <motion.figure
                        key={photo.src}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5, delay: 0.05 * (i % 4) }}
                        className={`relative overflow-hidden rounded-2xl bg-slate-100 ${
                            photo.wide ? 'col-span-2 aspect-[4/3] md:aspect-auto md:row-span-1' : 'aspect-[3/4]'
                        }`}
                    >
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-dark/85 to-transparent px-3 md:px-4 pt-10 pb-3">
                            <span className="text-white text-[11px] md:text-xs font-bold uppercase tracking-wider">{photo.caption}</span>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </div>
    </section>
);

export default CoachesAtWorkSection;
