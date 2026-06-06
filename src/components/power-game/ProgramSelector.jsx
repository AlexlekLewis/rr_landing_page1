import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, Check, ArrowRight, Loader2 } from 'lucide-react';

// ============================================================
// PROGRAM PRICE — update when confirmed, then checkout is live.
// Set PROGRAM_PRICE_LABEL for display and STRIPE_PRICE_ID for the
// Stripe Price the /api/create-pgp-checkout endpoint will charge.
// ============================================================
const PROGRAM_PRICE = 0;            // e.g. 595  (AUD) — 0 shows "TBC"
const STRIPE_PRICE_ID = '';         // e.g. 'price_xxx' from Stripe
const priceLabel = PROGRAM_PRICE > 0 ? `$${PROGRAM_PRICE.toLocaleString()}` : 'TBC';

// Age groups are consistent across venues
const AGE_GROUPS = [
    { id: '12-14', label: '12 – 14', sub: 'Junior development' },
    { id: '14-16', label: '14 – 16', sub: 'Emerging pathway' },
    { id: '17-open', label: '17 – Open', sub: 'Senior / performance' },
];

// Schedule: venue -> ageGroupId -> { day, time, dates[] }
// Date slips auto-corrected to the obvious weekly cadence.
const VENUES = [
    {
        id: 'hallam',
        venue: 'Elite Cricket Centre',
        suburb: 'Hallam',
        region: 'South East Melbourne',
        schedule: {
            '17-open': { day: 'Thursdays', time: '8:00 – 10:00 PM', dates: ['Thu 30 Jul', 'Thu 6 Aug', 'Thu 13 Aug', 'Thu 20 Aug', 'Thu 27 Aug', 'Thu 3 Sep', 'Thu 10 Sep', 'Thu 17 Sep'] },
            '12-14': { day: 'Saturdays', time: '12:00 – 2:00 PM', dates: ['Sat 1 Aug', 'Sat 8 Aug', 'Sat 15 Aug', 'Sat 22 Aug', 'Sat 29 Aug', 'Sat 5 Sep', 'Sat 12 Sep', 'Sat 19 Sep'] },
            '14-16': { day: 'Saturdays', time: '2:00 – 4:00 PM', dates: ['Sat 1 Aug', 'Sat 8 Aug', 'Sat 15 Aug', 'Sat 22 Aug', 'Sat 29 Aug', 'Sat 5 Sep', 'Sat 12 Sep', 'Sat 19 Sep'] },
        },
    },
    {
        id: 'mickleham',
        venue: 'MISC',
        suburb: 'Mickleham',
        region: 'North Melbourne',
        schedule: {
            '17-open': { day: 'Tuesdays', time: '8:00 – 10:00 PM', dates: ['Tue 28 Jul', 'Tue 4 Aug', 'Tue 11 Aug', 'Tue 18 Aug', 'Tue 25 Aug', 'Tue 1 Sep', 'Tue 8 Sep', 'Tue 15 Sep'] },
            '12-14': { day: 'Sundays', time: '8:00 – 10:00 AM', dates: ['Sun 2 Aug', 'Sun 9 Aug', 'Sun 16 Aug', 'Sun 23 Aug', 'Sun 30 Aug', 'Sun 6 Sep', 'Sun 13 Sep', 'Sun 20 Sep'] },
            '14-16': { day: 'Sundays', time: '10:00 AM – 12:00 PM', dates: ['Sun 2 Aug', 'Sun 9 Aug', 'Sun 16 Aug', 'Sun 23 Aug', 'Sun 30 Aug', 'Sun 6 Sep', 'Sun 13 Sep', 'Sun 20 Sep'] },
        },
    },
    {
        id: 'williamstown',
        venue: 'The Netz',
        suburb: 'Williamstown',
        region: 'West Melbourne',
        schedule: {
            '17-open': { day: 'Fridays', time: '8:00 – 10:00 PM', dates: ['Fri 31 Jul', 'Fri 7 Aug', 'Fri 14 Aug', 'Fri 21 Aug', 'Fri 28 Aug', 'Fri 4 Sep', 'Fri 11 Sep', 'Fri 18 Sep'] },
            '12-14': { day: 'Saturdays', time: '2:00 – 4:00 PM', dates: ['Sat 1 Aug', 'Sat 8 Aug', 'Sat 15 Aug', 'Sat 22 Aug', 'Sat 29 Aug', 'Sat 5 Sep', 'Sat 12 Sep', 'Sat 19 Sep'] },
            '14-16': { day: 'Saturdays', time: '4:00 – 6:00 PM', dates: ['Sat 1 Aug', 'Sat 8 Aug', 'Sat 15 Aug', 'Sat 22 Aug', 'Sat 29 Aug', 'Sat 5 Sep', 'Sat 12 Sep', 'Sat 19 Sep'] },
        },
    },
];

const StepLabel = ({ n, label }) => (
    <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rr-pink text-white text-sm font-black">{n}</span>
        <span className="text-sm font-black text-rr-dark uppercase tracking-widest">{label}</span>
    </div>
);

const ProgramSelector = () => {
    const [venueId, setVenueId] = useState(null);
    const [ageId, setAgeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const venue = VENUES.find((v) => v.id === venueId);
    const slot = venue && ageId ? venue.schedule[ageId] : null;
    const ageLabel = AGE_GROUPS.find((a) => a.id === ageId)?.label;
    const ready = Boolean(venue && slot);

    const handleCheckout = async () => {
        setError('');
        if (!STRIPE_PRICE_ID || PROGRAM_PRICE <= 0) {
            setError('Checkout is not live yet — pricing is being finalised. Please check back shortly.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/create-pgp-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venueId: venue.id,
                    venue: `${venue.venue} · ${venue.suburb}`,
                    ageGroup: ageLabel,
                    day: slot.day,
                    time: slot.time,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Checkout could not be started.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-50 py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Secure Your Place
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        SELECT YOUR <span className="text-rr-pink">PROGRAM</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Two quick steps. Choose your venue and age group, and we'll show you every session date across the 8-week program.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT — selectors */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Step 1 — Venue */}
                        <div>
                            <StepLabel n={1} label="Choose your venue" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {VENUES.map((v) => {
                                    const active = v.id === venueId;
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => { setVenueId(v.id); }}
                                            className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                                                active
                                                    ? 'bg-rr-dark border-rr-pink shadow-[0_8px_30px_rgba(225,31,143,0.25)]'
                                                    : 'bg-white border-slate-200 hover:border-rr-pink/40'
                                            }`}
                                        >
                                            <MapPin className={`w-5 h-5 mb-2 ${active ? 'text-rr-pink' : 'text-rr-blue'}`} />
                                            <div className={`text-sm font-black uppercase tracking-wide leading-tight ${active ? 'text-white' : 'text-rr-dark'}`}>
                                                {v.venue}
                                            </div>
                                            <div className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${active ? 'text-rr-pink' : 'text-rr-charcoal/60'}`}>
                                                {v.suburb}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 2 — Age group */}
                        <div className={venueId ? '' : 'opacity-40 pointer-events-none select-none'}>
                            <StepLabel n={2} label="Choose your age group" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {AGE_GROUPS.map((a) => {
                                    const active = a.id === ageId;
                                    return (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onClick={() => setAgeId(a.id)}
                                            className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                                                active
                                                    ? 'bg-rr-dark border-rr-pink shadow-[0_8px_30px_rgba(225,31,143,0.25)]'
                                                    : 'bg-white border-slate-200 hover:border-rr-pink/40'
                                            }`}
                                        >
                                            <div className={`text-lg font-black uppercase tracking-wide leading-tight ${active ? 'text-white' : 'text-rr-dark'}`}>
                                                {a.label}
                                            </div>
                                            <div className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${active ? 'text-rr-pink' : 'text-rr-charcoal/60'}`}>
                                                {a.sub}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Session dates */}
                        <AnimatePresence mode="wait">
                            {ready && (
                                <motion.div
                                    key={venue.id + ageId}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar className="w-4 h-4 text-rr-pink" />
                                        <span className="text-sm font-black text-rr-dark uppercase tracking-widest">
                                            Your 8 sessions
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {slot.dates.map((d, i) => (
                                            <div
                                                key={d + i}
                                                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5"
                                            >
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rr-pink/10 text-rr-pink text-[10px] font-black">
                                                    {i + 1}
                                                </span>
                                                <span className="text-xs font-bold text-rr-dark uppercase tracking-wide">{d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT — summary / checkout */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-28">
                            <div className="rounded-2xl bg-rr-dark border border-white/10 overflow-hidden">
                                <div className="bg-gradient-rr px-6 py-5">
                                    <div className="text-xs font-black text-white/80 uppercase tracking-widest mb-1">Your selection</div>
                                    <div className="text-xl font-black text-white uppercase tracking-wide">The Power Game · 8 Weeks</div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <SummaryRow icon={MapPin} label="Venue" value={venue ? `${venue.venue} · ${venue.suburb}` : 'Not selected'} muted={!venue} />
                                    <SummaryRow icon={Check} label="Age group" value={ageLabel || 'Not selected'} muted={!ageId} />
                                    <SummaryRow icon={Clock} label="Day & time" value={slot ? `${slot.day} · ${slot.time}` : 'Not selected'} muted={!slot} />

                                    <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                                        <span className="text-xs font-black text-white/60 uppercase tracking-widest">Price</span>
                                        <span className="text-3xl font-black text-white">{priceLabel}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        disabled={!ready || loading}
                                        className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest px-6 py-4 rounded-full transition-all duration-300 ${
                                            ready && !loading
                                                ? 'bg-rr-pink hover:bg-rr-light-pink text-white hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]'
                                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Starting checkout…</>
                                        ) : (
                                            <>Secure your place <ArrowRight className="w-5 h-5" /></>
                                        )}
                                    </button>

                                    {error && (
                                        <p className="text-xs text-rr-light-pink font-medium text-center">{error}</p>
                                    )}
                                    <p className="text-[11px] text-white/40 text-center leading-relaxed">
                                        Places are subject to meeting the program's minimum standard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SummaryRow = ({ icon: Icon, label, value, muted }) => (
    <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${muted ? 'text-white/30' : 'text-rr-pink'}`} />
        <div className="min-w-0">
            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">{label}</div>
            <div className={`text-sm font-bold leading-snug ${muted ? 'text-white/40' : 'text-white'}`}>{value}</div>
        </div>
    </div>
);

export default ProgramSelector;
