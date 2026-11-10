import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ITSectionHeader from './ITSectionHeader';
import ITRegisterButton from './ITRegisterButton';
import { VideoCard } from './ITVideos';
import { PRODUCED_HERE } from './itCopy';

// "The Home Of The Rajasthan Royals": the HPC promo video beside the story of the
// centre (Andy, 10 Nov 2026): the Royals' home base, where aspiring players trial
// and Brijesh Sharma and Vaibhav Sooryavanshi were discovered, and where the next
// generation (on this tour, the reader) trains. Then the players who trained here.
const ITHomeOfRoyals = ({ copy }) => {
    const c = copy.home;
    const [activeId, setActiveId] = useState(null);

    return (
        <section className="relative py-20 md:py-24 bg-rr-navy overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-16 items-center">
                    {/* Portrait video, same player as the home page */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1 w-full max-w-[300px] sm:max-w-[340px] mx-auto"
                    >
                        <VideoCard v={c.video} id="home" activeId={activeId} setActiveId={setActiveId} />
                    </motion.div>

                    {/* The story */}
                    <div className="order-1 lg:order-2">
                        <ITSectionHeader eyebrow={c.eyebrow} heading={c.heading} accent={c.headingAccent} dark />
                        <div className="space-y-4">
                            {c.paragraphs.map((t, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                    className={`text-base md:text-lg font-medium leading-relaxed ${i === c.paragraphs.length - 1 ? 'text-white' : 'text-white/75'}`}
                                >
                                    {t}
                                </motion.p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* The players who trained here */}
                <div className="mt-14">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">{c.listHeading}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PRODUCED_HERE.map((p) => (
                            <li key={p.name} className="rounded-xl border border-white/15 bg-white/5 px-5 py-4">
                                <span className="block text-base font-black text-white uppercase tracking-wide">{p.name}</span>
                                <span className="block text-xs text-white/60 font-bold uppercase tracking-widest mt-1">{p.note}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10">
                    <ITRegisterButton label={copy.hero.cta} id="home-of-royals-register" />
                </div>
            </div>
        </section>
    );
};

export default ITHomeOfRoyals;
