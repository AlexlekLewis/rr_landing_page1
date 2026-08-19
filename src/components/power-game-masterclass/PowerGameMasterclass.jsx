import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, CalendarDays, MapPin, Users, Clock, ShieldCheck, Ruler, ChevronDown } from 'lucide-react';
import { TOPS_SIZES, TOPS_MEASURE_TIP } from '../academy-shop/sizeData';
import { supabase } from '../../lib/supabase';
import Navbar from '../Navbar';
import HallaBol from '../holiday-programs/HallaBol';

// ─────────────────────────────────────────────────────────────
// POWER GAME MASTERCLASS — Sept 6 & 13, 2026
// Hidden page: not linked from nav/homepage, noindex.
// Stripe link: paste live URL below when Andy provides it.
// While null, registrants are captured in Supabase and sent to
// the success page with a "we'll be in touch to complete payment" note.
// ─────────────────────────────────────────────────────────────
// Single Stripe link — shirt is an optional line item customers can untick at checkout
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQ9AT4fne8RdhG5bB9Zm0u';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay },
    }),
};

// Ages 14+ — larger junior sizes plus full senior range, sourced from academy-shop sizeData
// ── Bespoke thin-line cricket iconography ──────────────────
const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

const MechanicsIcon = (props) => (
    <svg {...iconProps} {...props}>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const SwingIcon = (props) => (
    <svg {...iconProps} {...props}>
        <path d="M5 19a11.5 11.5 0 0 1 13.2-11.6" strokeDasharray="1.5 3.5" />
        <path d="M15.2 6.1l3.6.4-1.3 3.4" />
        <path d="M4.2 20.5l1.6-1.6" strokeWidth="2" />
    </svg>
);

const VideoIcon = (props) => (
    <svg {...iconProps} {...props}>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M10 9.2l5 2.8-5 2.8z" />
    </svg>
);

const VelocityIcon = (props) => (
    <svg {...iconProps} {...props}>
        <path d="M4 15a8 8 0 0 1 16 0" />
        <path d="M12 15l4.2-4.2" />
        <circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none" />
        <path d="M6.2 10.4l.9.7M17.8 10.4l-.9.7M12 6.8v1.2" />
    </svg>
);

const ProBatIcon = (props) => (
    <svg {...iconProps} {...props}>
        <path d="M13 8.5h5v8a2.5 2.5 0 0 1-5 0z" />
        <path d="M15.5 8.5V3.5" />
        <path d="M3 8h3.5M2 12h3.5M3 16h3.5" />
    </svg>
);

const SixIcon = (props) => (
    <svg {...iconProps} {...props}>
        <path d="M3 18.5C6.5 8.5 13 5.5 18.2 5.9" strokeDasharray="24" />
        <circle cx="20.2" cy="6" r="1.4" />
        <path d="M3 21.5h18" strokeDasharray="2 3" />
    </svg>
);

const MASTER_ITEMS = [
    { icon: MechanicsIcon, label: 'Power hitting mechanics' },
    { icon: SwingIcon, label: 'Bat swing' },
    { icon: VideoIcon, label: 'Video analysis' },
    { icon: VelocityIcon, label: 'Exit velocity testing' },
    { icon: ProBatIcon, label: 'Use of pro-velocity bats' },
    { icon: SixIcon, label: 'Develop the ability to mis-hit sixes' },
];

const SHIRT_SIZE_ROWS = [...TOPS_SIZES.junior.slice(-2), ...TOPS_SIZES.senior];
const SHIRT_SIZES = SHIRT_SIZE_ROWS.map((r) => r.label);

const ComplianceCheckbox = ({ checked, onChange, error, children }) => (
    <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer group">
            <div
                onClick={() => onChange(!checked)}
                className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-white/30 bg-white/5 group-hover:border-rr-pink'}`}
            >
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className="text-white/75 text-sm font-medium leading-relaxed text-left">{children}</span>
        </label>
        {error && <p className="text-rr-pink text-xs font-bold mt-1 ml-8 text-left">{error}</p>}
    </div>
);

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
        shirt_size: '',
    });
    const [hasShirt, setHasShirt] = useState(true);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Power Game Masterclass | Sept 2026';
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
        if (!form.shirt_size) next.shirt_size = 'Training shirt size is required';
        if (!acceptTerms) next.acceptTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
        if (!acceptPlayerCode) next.acceptPlayerCode = 'You must agree to the Player Code of Conduct.';
        if (!acceptParentCode) next.acceptParentCode = 'You must agree to the Parent/Guardian Code of Conduct.';
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
                    shirt_size: form.shirt_size,
                    has_shirt: hasShirt,
                    purchase_shirt: !hasShirt,
                    accept_terms: acceptTerms,
                    accept_player_code: acceptPlayerCode,
                    accept_parent_code: acceptParentCode,
                    accept_social_media: acceptSocialMedia,
                    page_referrer: document.referrer || null,
                    ...utm,
                },
            ]);
            if (error) throw error;

            window.location.href = STRIPE_CHECKOUT_URL;
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
            <Navbar variant="power-game" />

            {/* ───────────── HERO ───────────── */}
            <section className="relative min-h-[94svh] w-full overflow-hidden flex items-end">
                <img
                    src="/assets/masterclass/suryavanshi-six.webp"
                    alt="Suryavanshi hitting a six under lights"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-rr-dark/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/85 to-rr-dark/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/70 via-transparent to-transparent" />

                <div className="relative z-10 w-full max-w-2xl mx-auto sm:mx-0 px-5 pb-24 pt-28 sm:pb-16 sm:pt-36 sm:pl-10 lg:pl-16 text-center sm:text-left">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <img
                            src="/assets/masterclass/power-game-logo-notagline.png"
                            alt="The Power Game"
                            className="h-32 sm:h-44 lg:h-52 w-auto mx-auto sm:mx-0 mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                        />
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
                        POWER HITTING<br />
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
                        <Zap className="w-4 h-4 text-rr-pink flex-shrink-0" strokeWidth={1.75} />
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

            {/* ───────────── WHAT YOU'LL MASTER ───────────── */}
            <section className="relative py-16 sm:py-20 px-5 bg-white/[0.03] border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="text-2xl sm:text-4xl font-black tracking-tight text-center mb-3"
                    >
                        What You&apos;ll <span className="text-rr-pink">Master</span>
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={0.05}
                        className="text-white/70 text-sm sm:text-base font-medium text-center mb-10 max-w-2xl mx-auto"
                    >
                        Four hours dedicated to one thing — turning you into a genuine power hitter.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
                        {MASTER_ITEMS.map(({ icon: Icon, label }, i) => (
                            <motion.div
                                key={label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                variants={fadeUp}
                                custom={i * 0.07}
                                className="group flex items-center gap-5 py-5 border-t border-white/10"
                            >
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-rr-pink/60">
                                    <Icon className="w-[22px] h-[22px] text-rr-pink" />
                                </div>
                                <p className="text-[15px] sm:text-base font-bold text-white leading-snug">{label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        custom={0.45}
                        className="text-center mt-8 text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-rr-pink"
                    >
                        And More!
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
                                <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-rr-pink" strokeWidth={1.5} />
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
                            The official training shirt is required at all sessions — already have one? No need to buy again ($29.95 if you need one, added at registration).
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
                            src="/assets/coaches/alex-thornhill.jpg"
                            alt="Alex Thornhill — Head Coach, South-East Region"
                            className="w-full max-w-xs sm:max-w-none mx-auto aspect-square object-cover object-center rounded-2xl border border-white/10"
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

            {/* ───────────── HALLA BOL ───────────── */}
            <HallaBol />

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

                        {/* Training Shirt — required at sessions; purchase only if they don't own one */}
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-3">
                                Official Training Shirt (Required at all sessions)
                            </p>
                            <label className="flex items-start gap-3 cursor-pointer group mb-3">
                                <div
                                    onClick={() => setHasShirt(!hasShirt)}
                                    className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${hasShirt ? 'bg-rr-pink border-rr-pink' : 'border-white/30 bg-white/5 group-hover:border-rr-pink'}`}
                                >
                                    {hasShirt && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-white/75 text-sm font-medium leading-relaxed text-left">
                                    I already have an official RRA training shirt — <span className="text-white font-bold">untick this box if you don&apos;t have one</span> and you&apos;ll purchase a shirt (<span className="text-white font-bold">$29.95</span>) at checkout.
                                </span>
                            </label>
                            {hasShirt ? (
                                <p className="text-white/50 text-xs font-medium mb-3">
                                    Since you already have a shirt, simply <span className="text-white font-bold">untick the training shirt option on the payment page</span> — your total will be $240.
                                </p>
                            ) : (
                                <p className="text-rr-pink text-xs font-bold mb-3">
                                    Keep the training shirt ticked on the payment page — total $269.95.
                                </p>
                            )}

                            <select
                                value={form.shirt_size}
                                onChange={setField('shirt_size')}
                                className={`${inputClass('shirt_size')} appearance-none ${form.shirt_size ? '' : 'text-white/40'}`}
                            >
                                <option value="" className="bg-rr-dark">Select shirt size *</option>
                                {SHIRT_SIZES.map((sz) => (
                                    <option key={sz} value={sz} className="bg-rr-dark">{sz}</option>
                                ))}
                            </select>
                            {errors.shirt_size && <p className="text-rr-pink text-xs font-bold mt-1.5">{errors.shirt_size}</p>}

                            {/* Size guide — ages 14+ */}
                            <button
                                type="button"
                                onClick={() => setShowSizeGuide(!showSizeGuide)}
                                className="mt-3 inline-flex items-center gap-1.5 text-rr-pink hover:text-rr-light-pink text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                <Ruler className="w-3.5 h-3.5" strokeWidth={2.5} />
                                {showSizeGuide ? 'Hide size guide' : 'View size guide (ages 14+)'}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSizeGuide ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                            </button>
                            {showSizeGuide && (
                                <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto">
                                    <p className="text-[11px] text-white/50 font-medium mb-3">{TOPS_MEASURE_TIP}</p>
                                    <table className="w-full text-xs text-left">
                                        <thead>
                                            <tr className="border-b border-white/15">
                                                <th className="font-black text-white uppercase tracking-wider py-2 pr-3">Size</th>
                                                <th className="font-black text-white uppercase tracking-wider py-2 pr-3">Half Chest (in)</th>
                                                <th className="font-black text-white uppercase tracking-wider py-2">Length (in)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {SHIRT_SIZE_ROWS.map((row) => (
                                                <tr key={row.label}>
                                                    <td className="py-1.5 pr-3 font-bold text-white">{row.label}</td>
                                                    <td className="py-1.5 pr-3 text-white/60">{row.halfChest}</td>
                                                    <td className="py-1.5 text-white/60">{row.length}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Agreements & Consent */}
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">
                                Agreements &amp; Consent
                            </p>
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode} error={errors.acceptPlayerCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode} error={errors.acceptParentCode}>
                                I have read, understood, and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a> (applies where the player is under 18).
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                                I am happy for photos and videos from the masterclass featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                            </ComplianceCheckbox>
                        </div>

                        {errors.form && (
                            <p className="text-rr-pink text-sm font-bold text-center">{errors.form}</p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(225,31,143,0.5)]"
                        >
                            {submitting ? 'Registering…' : `Register & Pay ${hasShirt ? '$240' : '$269.95'}`}
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
