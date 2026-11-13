import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

// WHAT IT IS: the coaching roles, where and when, and the head coach video.
const ROLES = [
    {
        id: 'role-performance-squad-coach',
        title: 'Performance Squad Coach',
        who: 'Experienced coaches',
        body: 'Lead one of our Performance Squads, our representative teams. Plan the sessions, write each player a development plan and coach the squad at weekend matches.',
    },
    {
        id: 'role-junior-royals-coach',
        title: 'Junior Royals Coach',
        who: 'Lead and Assistant Coaches',
        body: 'Coach our younger players in small groups. Assistant Coaches work 10 paid hours beside a Lead Coach before running a group on their own.',
    },
    {
        id: 'role-cadet-coach',
        title: 'Cadet Coach',
        who: 'New to coaching',
        body: 'Start here. Help run stations and drills with a mentor beside you, then move up to Assistant and Lead Coach.',
    },
];

const FACTS = [
    { label: 'Where', value: 'Mickleham and Cranbourne North, Melbourne' },
    { label: 'When', value: 'October to March · Mon, Wed, Fri' },
    { label: 'Who can apply', value: 'Anyone in Melbourne, 16 or older' },
];

// Hosted on the landing project's public `videos` bucket. preload="none": the file
// is only fetched when someone presses play.
const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/videos/careers/careers-coaches-alex-lewis-v1.mp4';
const POSTER = '/assets/careers-video-poster.jpg';

const WhatItIsSection = () => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const play = () => {
        videoRef.current?.play();
        setPlaying(true);
    };

    return (
        <section className="relative py-20 md:py-28 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeader
                    eyebrow="What It Is"
                    title="Coaching at the"
                    accent="Royals Academy."
                    intro="Rajasthan Royals Academy Melbourne is the official Rajasthan Royals cricket academy in Melbourne. Our coaches run small-group sessions for players from juniors to our Performance Squads, all coached the Royals Way."
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Roles */}
                    <div className="lg:col-span-3 space-y-4">
                        {ROLES.map((r, i) => (
                            <motion.div
                                key={r.id}
                                id={r.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.06 * i }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6"
                            >
                                <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em] mb-1">{r.who}</p>
                                <h3 className="text-lg md:text-xl font-black text-rr-dark uppercase tracking-tight mb-2">{r.title}</h3>
                                <p className="text-rr-charcoal font-medium leading-relaxed text-sm md:text-base">{r.body}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video + facts */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-rr-dark">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                src={VIDEO_URL}
                                poster={POSTER}
                                preload="none"
                                controls={playing}
                                playsInline
                                onPlay={() => setPlaying(true)}
                            />
                            {!playing && (
                                <button
                                    type="button"
                                    onClick={play}
                                    aria-label="Play the video: Head Coach Alex Lewis on coaching with us"
                                    className="absolute inset-0 z-10 flex items-center justify-center group"
                                >
                                    <span className="w-16 h-16 rounded-full bg-rr-pink group-hover:bg-rr-light-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </span>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-rr-charcoal/70 font-medium -mt-2">
                            Alex Lewis and Andy Crook on what coaching with us involves.
                        </p>

                        <dl className="rounded-2xl bg-rr-dark text-white p-5 md:p-6 space-y-4">
                            {FACTS.map((f) => (
                                <div key={f.label}>
                                    <dt className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em] mb-1">{f.label}</dt>
                                    <dd className="text-sm md:text-base font-bold">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatItIsSection;
