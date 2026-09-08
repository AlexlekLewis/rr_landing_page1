import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, Trophy, DollarSign, Shirt, Backpack,
    Radio, HandHeart, AlertTriangle, ArrowRight,
} from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { fadeUp, scrollTo, SectionHeading } from '../performance-squads/shared';
import { ACTIVE_MATCH } from './matchConfig';
import MatchRegistrationForm from './MatchRegistrationForm';
import MatchPaymentModal from './MatchPaymentModal';

// ─────────────────────────────────────────────────────────────
// MATCH REGISTRATION — /match-registration
// HIDDEN PAGE: not linked from nav/homepage/sitemap, noindex.
// Direct URL only — this is a comms page for invited players.
//
// Deliberately reusable: every match-specific detail (name, dates,
// venue, price, Stripe link, kit list) lives in ./matchConfig.js.
// The next match block is a config swap, not a new page.
// ─────────────────────────────────────────────────────────────

const DetailCard = ({ icon: Icon, label, children, delay = 0 }) => (
    <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp} custom={delay}
        className="bg-white/5 border border-white/12 rounded-2xl p-6"
    >
        <div className="flex items-center gap-2.5 mb-3">
            <Icon className="w-4 h-4 text-rr-pink shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink">{label}</span>
        </div>
        <div className="text-white/80 text-[15px] font-medium leading-relaxed">{children}</div>
    </motion.div>
);

const ListCard = ({ icon: Icon, title, items, delay = 0 }) => (
    <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp} custom={delay}
        className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8"
    >
        <div className="flex items-center gap-2.5 mb-5">
            <Icon className="w-5 h-5 text-rr-pink shrink-0" />
            <h3 className="text-lg font-black uppercase tracking-wide">{title}</h3>
        </div>
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                    <span className="text-white/75 text-[15px] font-medium leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

const MatchRegistration = () => {
    const [payModal, setPayModal] = useState(null);
    const m = ACTIVE_MATCH;

    // ── Hidden page: noindex + title ──
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${m.name} | Rajasthan Royals Academy Melbourne`;
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, [m.name]);

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="performance-squads" />

            <main className="flex-1 w-full overflow-hidden">
                {/* ── HERO ── */}
                {/* Navbar is fixed and overlays the page — pt clears it so the
                    Power League logo isn't clipped on mobile. */}
                <section className="relative px-5 pt-28 pb-14 sm:pt-36 sm:pb-20">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-15%] left-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] rounded-full bg-rr-pink/10 blur-[130px]" />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <motion.img
                            initial="hidden" animate="visible" variants={fadeUp} custom={0}
                            src="/assets/power-league-logo-rra.png"
                            alt="Power League"
                            className="h-16 sm:h-20 w-auto mx-auto mb-7"
                        />
                        <motion.span
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
                            className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-4"
                        >
                            {m.eyebrow}
                        </motion.span>
                        <motion.h1
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.05] mb-4"
                        >
                            {m.name}
                        </motion.h1>
                        <motion.p
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
                            className="text-xl sm:text-2xl font-black text-rr-light-pink uppercase tracking-wide mb-6"
                        >
                            {m.datesLabel}
                        </motion.p>
                        <motion.p
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
                            className="text-white/65 text-[15px] sm:text-base font-medium leading-relaxed max-w-xl mx-auto mb-8"
                        >
                            Everything you need is below. We need a yes and payment from you to lock
                            your spot in — places are naturally limited, so if you'd like to take
                            part, please don't delay.
                        </motion.p>

                        <motion.button
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.25}
                            onClick={() => scrollTo('register-pay')}
                            className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-9 py-4 transition-colors"
                        >
                            Register &amp; Pay · ${m.price} <ArrowRight className="w-4 h-4" />
                        </motion.button>

                        {/* Deadline */}
                        <motion.div
                            initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
                            className="mt-8 inline-flex items-start gap-3 bg-rr-pink/12 border border-rr-pink/40 rounded-2xl px-5 py-4 text-left max-w-md mx-auto"
                        >
                            <AlertTriangle className="w-5 h-5 text-rr-light-pink shrink-0 mt-0.5" />
                            <p className="text-white/85 text-sm font-bold leading-relaxed">
                                To confirm your spot, please pay by {m.deadlineLabel}.
                                <span className="block font-medium text-white/60 mt-1">{m.deadlineNote}</span>
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── DETAILS ── */}
                <section className="px-5 py-14 sm:py-20">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading eyebrow="The Detail" title="Where, When &amp; What" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <DetailCard icon={MapPin} label="Where" delay={0}>
                                {m.venue.name}
                                <a
                                    href={m.venue.mapsUrl} target="_blank" rel="noreferrer"
                                    className="block text-rr-light-pink underline hover:text-white mt-1"
                                >
                                    {m.venue.address}
                                </a>
                            </DetailCard>
                            <DetailCard icon={Clock} label="When" delay={0.05}>{m.times}</DetailCard>
                            <DetailCard icon={Trophy} label="Format" delay={0.1}>{m.format}</DetailCard>
                            <DetailCard icon={DollarSign} label="Cost" delay={0.15}>
                                <span className="text-2xl font-black text-rr-light-pink block mb-1">
                                    ${m.price}
                                </span>
                                {m.priceNote}
                            </DetailCard>
                        </div>
                    </div>
                </section>

                {/* ── KIT ── */}
                <section className="px-5 py-14 sm:py-20">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading eyebrow="On The Day" title="What To Wear &amp; Bring" />
                        <div className="grid md:grid-cols-2 gap-5">
                            <ListCard icon={Shirt} title="What To Wear" items={m.wear} delay={0} />
                            <ListCard icon={Backpack} title="What To Bring" items={m.bring} delay={0.08} />
                        </div>
                    </div>
                </section>

                {/* ── STREAMING ── */}
                <section className="px-5 py-14 sm:py-20">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp} custom={0}
                            className="bg-white/5 border border-white/12 rounded-2xl p-7 sm:p-10 text-center"
                        >
                            <Radio className="w-8 h-8 text-rr-pink mx-auto mb-5" strokeWidth={1.75} />
                            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-rr-pink mb-3">
                                Live on {m.streaming.partner}
                            </span>
                            <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed">
                                {m.streaming.blurb}
                            </p>
                            <p className="text-white/50 text-sm font-medium leading-relaxed mt-4">
                                You'll be asked to confirm your streaming preference in the form below —
                                if you'd rather the player didn't appear, just say so there.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── VOLUNTEERS ── */}
                <section className="px-5 py-14 sm:py-20">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp} custom={0}
                            className="bg-rr-pink/8 border border-rr-pink/30 rounded-2xl p-7 sm:p-10 text-center"
                        >
                            <HandHeart className="w-8 h-8 text-rr-pink mx-auto mb-5" strokeWidth={1.75} />
                            <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4">Can You Help?</h3>
                            <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed">
                                {m.volunteers.blurb}
                            </p>
                            <p className="text-white/50 text-sm font-medium mt-4">
                                Tick the volunteer box in the form below and we'll be in touch.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── REGISTER ── */}
                <div id="register-pay" className="scroll-mt-28 lg:scroll-mt-32">
                    <MatchRegistrationForm onRequestPayment={setPayModal} />
                </div>
            </main>

            <Footer />
            <MatchPaymentModal
                open={!!payModal}
                registration={payModal}
                onClose={() => setPayModal(null)}
            />
        </div>
    );
};

export default MatchRegistration;
