import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, CalendarDays, MapPin, Users, Clock, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// POWER GAME MASTERCLASS — Sept 6 & 13, 2026
// Hidden page: not linked from nav/homepage, noindex.
// Stripe link: paste live URL below when Andy provides it.
// While null, registrants are captured in Supabase and sent to
// the success page with a "we'll be in touch to complete payment" note.
// ─────────────────────────────────────────────────────────────
const STRIPE_CHECKOUT_URL = null; // TODO: paste Stripe payment link ($240)

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
};

const DETAILS = [
    { icon: MapPin, label: 'Venue', value: 'Cranbourne North Elite Cricket Centre' },
    { icon: CalendarDays, label: 'Dates', value: 'Sunday 6 Sept & Sunday 13 Sept' },
    { icon: Clock, label: 'Time', value: '5:00pm – 7:00pm both weeks' },
    { icon: Users, label: 'Who', value: 'Ages 14 to Open' },
];

const PowerGameMasterclass = () => {
    const [form, setForm] = useState({
        player_name: '',
        email: '',
        phone: '',
        player_age: '',
        club: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Power Game Masterclass | Sept 2026';
        // noindex while page is undiscoverable
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    const setField = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.player_name.trim()) next.player_name = 'Player name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Valid email required';
        if (!form.phone.trim()) next.phone = 'Phone number is required';
        if (!form.player_age.trim()) next.player_age = 'Player age is required';
        return next;
    };

    const handleSubmit = async () => {
        const next = validate();
        if (Object.keys(next).length) {
            setErrors(next);
            return;
        }
        setSubmitting(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const utm = {};
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
                if (params.get(k)) utm[k] = params.get(k);
            });

            const { error } = await supabase.from('masterclass_registrations').insert([
                {
                    player_name: form.player_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    player_age: form.player_age.trim(),
                    club: form.club.trim() || null,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;

            if (STRIPE_CHECKOUT_URL) {
                window.location.href = STRIPE_CHECKOUT_URL;
            } else {
                window.location.href = '/power-game-masterclass/success?pending=1';
            }
        } catch (err) {
            console.error('Masterclass registration error:', err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com' });
            setSubmitting(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    };

    const inputClass = (key) =>
        `w-full bg-white/5 border ${errors[key] ? 'border-rr-pink' : 'border-white/15'} rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-[15px] focus:outline-none focus:border-rr-pink/70 transition-colors`;

    return (
        <div className="min-h-screen bg-rr-dark text-white font-sans selection:bg-rr-pink selection:text-white">

            {/* ───────────── HERO ───────────── */}
            <section className="relative min-h-[94svh] w-full overflow-hidden flex items-end">
                <img
                    src="/assets/masterclass/suryavanshi-six.webp"
                    alt="Suryavanshi hitting a six under lights"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/60 via-transparent to-transparent" />

                <div className="relative z-10 w-full max-w-2xl mx-auto sm:mx-0 px-5 pb-24 pt-28 sm:pb-16 sm:pt-36 sm:pl-10 lg:pl-16 text-center sm:text-left">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white bg-rr-pink rounded-full px-4 py-1.5 mb-5">
                            Strictly Limited Numbers
                        </span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0.1}
                        className="text-[2.4rem] leading-[0.98] sm:text-6xl lg:text-7xl font-black tracking-tight mb-4"
                    >
                        POWER GAME<br />
                        <span className="text-rr-pink">MASTERCLASS</span>
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0.2}
                        className="text-[15px] sm:text-lg text-white/85 font-medium leading-snug max-w-xl mx-auto sm:mx-0 mb-6"
                    >
                        Four hours of elite power-hitting coaching with Alex Thornhill.
                        Two Sunday sessions. One mission — hit the ball harder, further, more often.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0.3}
                        className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm font-bold mb-6"
                    >
                        <Zap className="w-4 h-4 text-rr-pink flex-shrink-0" strokeWidth={2.5} />
                        <span>$240 total · Both weeks included · Ages 14 to Open</span>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.4}>
                        <button
                            onClick={scrollToForm}
                            className="group inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-9 py-4 transition-all hover:shadow-[0_0_30px_rgba(225,31,143,0.5)]"
                        >
                            Secure Your Spot
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                        </button>
                    </motion.div>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0.5}
                        className="mt-6 text-[11px] uppercase tracking-[0.2em] font-bold text-white/50"
                    >
                        Proud Partners of the Rajasthan Royals Academy
                    </motion.p>
                </div>
            </section>

            {/* ───────────── DETAILS ───────────── */}
            <section className="relative py-16 sm:py-20 px-5">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="text-2xl sm:text-4xl font-black tracking-tight text-center mb-10"
                    >
                        The <span className="text-rr-pink">Details</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DETAILS.map(({ icon: Icon, label, value }, i) => (
                            <motion.div
                                key={label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                variants={fadeUp}
                                custom={i * 0.08}
                                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
                            >
                                <div className="w-11 h-11 rounded-xl bg-rr-pink/15 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-rr-pink" strokeWidth={2.25} />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] font-black text-white/50 mb-1">{label}</p>
                                    <p className="text-[15px] sm:text-base font-bold text-white leading-snug">{value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={0.3}
                        className="mt-8 bg-gradient-to-r from-rr-pink/15 to-transparent border border-rr-pink/25 rounded-2xl p-6 text-center sm:text-left"
                    >
                        <p className="text-lg sm:text-xl font-black">
                            4 hours of masterclass coaching · <span className="text-rr-pink">$240</span>
                        </p>
                        <p className="text-white/70 text-sm font-medium mt-1">
                            $60 per hour of specialist power-hitting development. One registration covers both Sundays.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── CREATIVE BREAK ───────────── */}
            <section className="relative w-full overflow-hidden">
                <img
                    src="/assets/masterclass/jaiswal-power.webp"
                    alt="Power hitting through the off side"
                    className="w-full h-[280px] sm:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-rr-dark/40" />
                <div className="absolute bottom-5 left-0 right-0 text-center px-5">
                    <p className="text-lg sm:text-2xl font-black uppercase tracking-[0.15em] text-white drop-shadow-lg">
                        Hit it <span className="text-rr-pink">harder.</span> Hit it <span className="text-rr-pink">further.</span>
                    </p>
                </div>
            </section>

            {/* ───────────── COACH ───────────── */}
            <section className="relative py-16 sm:py-20 px-5 bg-white/[0.03] border-y border-white/10">
                <div className="max-w-4xl mx-auto text-center sm:text-left sm:flex sm:items-center sm:gap-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                        className="sm:w-2/5 mb-8 sm:mb-0"
                    >
                        <img
                            src="/assets/masterclass/suryavanshi-bat-raise.webp"
                            alt="Royals batter raising the bat"
                            className="w-full rounded-2xl border border-white/10 object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="flex-1"
                    >
                        <p className="text-[11px] uppercase tracking-[0.25em] font-black text-rr-pink mb-3">Your Coach</p>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">Alex Thornhill</h2>
                        <p className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed max-w-2xl">
                            Expert batting coach and Head Coach of the Royals Academy South-East Region.
                            Alex leads this masterclass with a clear focus: building the technique, intent and
                            bat speed that turn good batters into genuine power hitters.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ───────────── REGISTRATION ───────────── */}
            <section id="register" className="relative py-16 sm:py-24 px-5">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="text-center mb-8"
                    >
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
                            Secure Your <span className="text-rr-pink">Spot</span>
                        </h2>
                        <p className="text-white/70 text-sm sm:text-base font-medium">
                            Strictly limited numbers. Register below to lock in both sessions.
                        </p>
                    </motion.div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Player full name *"
                                value={form.player_name}
                                onChange={setField('player_name')}
                                className={inputClass('player_name')}
                            />
                            {errors.player_name && <p className="text-rr-pink text-xs font-bold mt-1.5">{errors.player_name}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email *"
                                value={form.email}
                                onChange={setField('email')}
                                className={inputClass('email')}
                            />
                            {errors.email && <p className="text-rr-pink text-xs font-bold mt-1.5">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder="Phone *"
                                value={form.phone}
                                onChange={setField('phone')}
                                className={inputClass('phone')}
                            />
                            {errors.phone && <p className="text-rr-pink text-xs font-bold mt-1.5">{errors.phone}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Player age *"
                                value={form.player_age}
                                onChange={setField('player_age')}
                                className={inputClass('player_age')}
                            />
                            {errors.player_age && <p className="text-rr-pink text-xs font-bold mt-1.5">{errors.player_age}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Club (optional)"
                                value={form.club}
                                onChange={setField('club')}
                                className={inputClass('club')}
                            />
                        </div>

                        {errors.form && (
                            <p className="text-rr-pink text-sm font-bold text-center">{errors.form}</p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(225,31,143,0.5)]"
                        >
                            {submitting ? 'Registering…' : 'Register & Pay $240'}
                            {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-white/50 text-xs font-medium pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                            <span>Secure payment via Stripe</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────── FOOTER ───────────── */}
            <footer className="border-t border-white/10 py-8 px-5 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] font-black text-white/40 mb-1">
                    Power Game
                </p>
                <p className="text-white/40 text-xs font-medium">
                    Proud Partners of the Rajasthan Royals Academy · info@rramelbourne.com
                </p>
            </footer>
        </div>
    );
};

export default PowerGameMasterclass;
