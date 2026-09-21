import React from 'react';
import { motion } from 'framer-motion';
import { GlobalBallIcon } from '../performance-squads/CricketIcons';
import { fadeUp, SectionHeading } from '../performance-squads/shared';
import { SID, SID_SECTION } from './openAgeData';

// Sits second on the page so nobody scrolls past it.
//
// EVERYTHING said about Sid here comes from openAgeData.SID_SECTION, and that
// is the whole evidence base: his name, his title, his employer, the photo, and
// the fact he is at the trial. Do not add honours, former clubs, years of
// service, quotes, or claims about players he has produced.
const SidSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading eyebrow={SID_SECTION.eyebrow} title={SID_SECTION.title} />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-3xl overflow-hidden grid sm:grid-cols-[minmax(0,260px)_1fr]"
            >
                <div className="relative bg-rr-navy min-h-[260px]">
                    <img
                        src={SID.photo}
                        alt={SID.photoAlt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 via-transparent to-transparent" />
                </div>

                <div className="p-7 sm:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <GlobalBallIcon className="w-7 h-7 text-rr-pink shrink-0" />
                        <div>
                            <p className="text-xl sm:text-2xl font-black uppercase leading-none">{SID.name}</p>
                            <p className="text-rr-light-pink text-xs font-black uppercase tracking-wider mt-1.5">
                                {SID.titleLine}
                            </p>
                        </div>
                    </div>

                    {SID_SECTION.paragraphs.map((p) => (
                        <p key={p} className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-3 last:mb-0">
                            {p}
                        </p>
                    ))}

                    {/* Separation. Sid is in the hero and the global opportunities
                        list names Paarl and Barbados further down the page. Without
                        this line a reader can reasonably join those two things up.
                        It is also a stronger flex than the implication. */}
                    <p className="text-white/70 text-[15px] sm:text-base font-medium leading-relaxed mt-5 pt-5 border-t border-white/10">
                        {SID.separation}
                    </p>

                    {/* The attendance hedge, in the same words as the hero, the
                        booking card and the FAQ. */}
                    <p className="text-white/50 text-[13px] font-medium leading-relaxed mt-4">
                        {SID.attendance}
                    </p>

                    <p className="text-white/35 text-xs font-medium leading-relaxed mt-5 pt-4 border-t border-white/10">
                        {SID.photoCaption}
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default SidSection;
