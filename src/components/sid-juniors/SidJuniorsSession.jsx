import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Ticket, ArrowRight, Navigation } from 'lucide-react';
import { fadeUp, SectionHeading } from '../performance-squads/shared';
import {
    SESSION, SESSION_SECTION, MAPS_URL, AGE_RANGE, PRICE_LABEL, OLDER_PLAYERS,
} from './sidJuniorsData';

// What, when, where, who and what it costs — the four things a parent needs
// before they decide, each one a fact from sidJuniorsData.js.
const Tile = ({ icon: Icon, label, children, delay }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={delay}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7"
    >
        <div className="flex items-center gap-2.5 mb-3">
            <Icon className="w-5 h-5 text-rr-pink shrink-0" />
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-rr-pink">{label}</p>
        </div>
        {children}
    </motion.div>
);

const Main = ({ children }) => (
    <p className="text-lg sm:text-xl font-black uppercase leading-tight">{children}</p>
);

const Detail = ({ children }) => (
    <p className="text-white/65 text-[15px] font-medium leading-relaxed mt-1.5">{children}</p>
);

const SidJuniorsSession = () => (
    <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
            <SectionHeading {...SESSION_SECTION} />

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <Tile icon={CalendarDays} label="When" delay={0}>
                    <Main>{SESSION.dateLabel}</Main>
                    <Detail>{SESSION.timeLabel}, one hour.</Detail>
                </Tile>

                <Tile icon={MapPin} label="Where" delay={0.05}>
                    <Main>{SESSION.venue}</Main>
                    <Detail>{SESSION.address}. {SESSION.lanes}</Detail>
                    <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-sm font-bold mt-3 underline underline-offset-4"
                    >
                        <Navigation className="w-3.5 h-3.5" /> Get directions
                    </a>
                </Tile>

                <Tile icon={Users} label="Who" delay={0.1}>
                    <Main>Players aged {AGE_RANGE}</Main>
                    {/* Group size and supervision are in the next section. */}
                    <Detail>Coaching, not a trial.</Detail>
                </Tile>

                <Tile icon={Ticket} label="Cost" delay={0.15}>
                    <Main>{PRICE_LABEL}</Main>
                    <Detail>{SESSION_SECTION.costNote}</Detail>
                </Tile>
            </div>

            {/* For families with an older player too. Links out and says no more:
                who is at the trial is that page's to say, not this one's. */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.2}
                className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
                <p className="text-white/55 text-sm font-medium leading-relaxed flex-1">{OLDER_PLAYERS.text}</p>
                <Link
                    to={OLDER_PLAYERS.href}
                    className="inline-flex items-center gap-2 text-white font-black uppercase tracking-wider text-xs border-2 border-white/20 hover:border-rr-pink rounded-full px-5 py-2.5 transition-colors self-start sm:self-auto shrink-0"
                >
                    {OLDER_PLAYERS.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </motion.div>
        </div>
    </section>
);

export default SidJuniorsSession;
