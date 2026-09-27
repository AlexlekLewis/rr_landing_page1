import React from 'react';
import { motion } from 'framer-motion';
import { GlobalBallIcon } from '../performance-squads/CricketIcons';
import { fadeUp } from '../performance-squads/shared';
import {
    SID_NAME, SID_TITLE_LINE, SID_PHOTO, SID_PHOTO_ALT, SID_PHOTO_CAPTION,
    SID_SECTION, SID_CAVEAT,
} from './sidJuniorsData';

// Sits second on the page, straight under the hero, in the same card layout
// the open age trial uses for its Sid section. Everything said about him
// comes from sidJuniorsData.js, and that file's evidence base is the whole of
// it: no honours, former clubs, quotes or claims about players.
const SidJuniorsSid = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black uppercase leading-[1.05] text-center mb-12">
                {SID_SECTION.title}
            </h2>

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
                        src={SID_PHOTO}
                        alt={SID_PHOTO_ALT}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 via-transparent to-transparent" />
                </div>

                <div className="p-7 sm:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <GlobalBallIcon className="w-7 h-7 text-rr-pink shrink-0" />
                        <div>
                            <p className="text-xl sm:text-2xl font-black uppercase leading-none">{SID_NAME}</p>
                            <p className="text-rr-light-pink text-xs font-black uppercase tracking-wider mt-1.5">
                                {SID_TITLE_LINE}
                            </p>
                        </div>
                    </div>

                    {SID_SECTION.paragraphs.map((p) => (
                        <p key={p} className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-3 last:mb-0">
                            {p}
                        </p>
                    ))}

                    {/* The caveat, in the same words as the hero, the form's
                        confirmation and the FAQ. */}
                    <p className="text-white/70 text-[15px] sm:text-base font-medium leading-relaxed mt-5 pt-5 border-t border-white/10">
                        {SID_CAVEAT}
                    </p>

                    <p className="text-white/35 text-xs font-medium leading-relaxed mt-5 pt-4 border-t border-white/10">
                        {SID_PHOTO_CAPTION}
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default SidJuniorsSid;
