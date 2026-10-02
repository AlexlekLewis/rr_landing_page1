import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Trophy, Building2 } from 'lucide-react';
import { GlobalBallIcon } from '../performance-squads/CricketIcons';
import { fadeUp } from '../performance-squads/shared';
import {
    SID_NAME, SID_TITLE_LINE, SID_PHOTO, SID_PHOTO_ALT, SID_PHOTO_CAPTION,
    SID_SECTION,
} from './sidJuniorsData';

// Sits second on the page, straight under the hero. Built to be scanned:
// his roles as four labelled tiles, then the players and the academies as
// short lists, then when he is here. Every fact comes from SID_SECTION in
// sidJuniorsData.js, and each one is sourced in the comment above it.
const ListHeading = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-rr-pink shrink-0" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">{children}</h3>
    </div>
);

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
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-3xl overflow-hidden"
            >
                {/* Who he is: photo, name, title, one-line summary */}
                <div className="grid sm:grid-cols-[minmax(0,260px)_1fr]">
                    <div className="relative bg-rr-navy min-h-[280px]">
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
                        <p className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed">
                            {SID_SECTION.intro}
                        </p>

                        {/* His current roles, one tile each */}
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-6">
                            {SID_SECTION.roles.map((r) => (
                                <div key={r.team} className="bg-rr-dark p-4">
                                    <dt className="text-white font-black uppercase text-sm leading-tight">{r.team}</dt>
                                    <dd className="text-white/50 text-xs font-bold mt-0.5">{r.league}</dd>
                                    <dd className="text-rr-light-pink text-[13px] font-bold mt-2">{r.role}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Track record: players and academies */}
                <div className="grid md:grid-cols-2 border-t border-white/10">
                    <div className="p-7 sm:p-10 md:border-r border-white/10">
                        <ListHeading icon={Trophy}>{SID_SECTION.playersTitle}</ListHeading>
                        <ul className="space-y-4">
                            {SID_SECTION.players.map((pl) => (
                                <li key={pl.name}>
                                    <p className="text-white font-black text-base leading-tight">
                                        {pl.name}
                                        <span className="text-rr-light-pink font-bold text-sm"> · {pl.now}</span>
                                    </p>
                                    <p className="text-white/65 text-[14px] font-medium leading-relaxed mt-1">{pl.link}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-7 sm:p-10 border-t md:border-t-0 border-white/10">
                        <ListHeading icon={Building2}>{SID_SECTION.academiesTitle}</ListHeading>
                        <ul className="space-y-3">
                            {SID_SECTION.academies.map((a) => (
                                <li key={a} className="flex items-start gap-3">
                                    <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                                    <span className="text-white/75 text-[14px] font-medium leading-relaxed">{a}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* When he is here */}
                <div className="border-t border-white/10 p-7 sm:px-10 flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                    <p className="text-white text-[15px] sm:text-base font-bold leading-relaxed">{SID_SECTION.visit}</p>
                </div>

                <p className="text-white/35 text-xs font-medium leading-relaxed px-7 sm:px-10 pb-6">
                    Photo: {SID_PHOTO_CAPTION}
                </p>
            </motion.div>
        </div>
    </section>
);

export default SidJuniorsSid;
