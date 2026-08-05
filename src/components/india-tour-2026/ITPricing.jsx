import React from 'react';
import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// India Tour 2026 — what it costs.
//
// Two prices for the SAME camp. Confirmed by Alex 2026-08-05:
//   • Royals program players  $2,100 incl GST
//   • External (invited)      $2,700 incl GST
// Both EXCLUDE flights. Flights are booked through an RRA group booking link
// so the whole squad travels together.
//
// The two placeholders below are the only things still to be filled in. Both
// degrade to an honest "we'll confirm it" line while they are null, so the
// page never quotes a number we haven't actually set.
// ---------------------------------------------------------------------------

// Indicative return airfare per player, AUD. e.g. 1450
const FLIGHT_ESTIMATE_AUD = null;
// Deposit that confirms a place, AUD incl GST. e.g. 500
const DEPOSIT_AUD = null;

export const TIERS = [
    {
        key: 'royals_program',
        eyebrow: 'For players already with us',
        heading: 'RRA Program Player',
        price: 2100,
        who:
            'Your player is currently training in a Rajasthan Royals Academy Melbourne program — ' +
            'Junior Royals, the Academy Elite Program, or Power Pre-Season.',
    },
    {
        key: 'external',
        eyebrow: 'For players joining us for the tour',
        heading: 'Invited Player',
        price: 2700,
        who:
            'Your player has been invited to tour but is not currently training in one of our ' +
            'programs. They join the touring squad for the camp and train alongside our program players.',
    },
];

// Everything the program fee covers, straight from the confirmed HPC camp plan.
const INCLUDED = [
    {
        title: 'Seven nights at the Royals HPC',
        body:
            'Shared air-conditioned rooms inside the Rajasthan Royals High Performance Centre in Nagpur. ' +
            'You arrive Saturday 19 September and fly home Saturday 26 September 2026.',
    },
    {
        title: 'All meals, every day',
        body:
            'Breakfast, lunch, evening refreshments and dinner, plus drinking water and sports drinks. ' +
            'You do not need to budget for food while you are there.',
    },
    {
        title: 'Six full days of coaching',
        body:
            'Turf nets, centre-wicket practice, a practice match on turf, and full use of the training ' +
            'grounds, gym and indoor facilities.',
    },
    {
        title: 'The Royals coaching panel',
        body:
            'Batting and leadership with Faiz Fazal — a former India international and Ranji Trophy-winning ' +
            'captain — and with Romi Bhinder, the Rajasthan Royals team manager. Bowling with Somi Bhinder, ' +
            'the HPC ground curator and a former bowler and coach.',
    },
    {
        title: 'Individual video analysis and a written plan',
        body:
            'Your player is filmed, assessed, and sat down one-on-one with a coach for feedback. They come ' +
            'home with their own written development plan setting out what to work on next.',
    },
    {
        title: 'The full pro support team',
        body:
            'Strength and conditioning with Raccalerate (Chennai), physio-led injury management, two ' +
            'mental performance sessions with Dr Neeta Adhau, and nutrition and hydration education.',
    },
    {
        title: 'Recovery and downtime',
        body: 'Use of the recovery facilities and pool, and the indoor recreation rooms between sessions.',
    },
    {
        title: 'All transport once you land',
        body:
            'Nagpur airport pick-up and drop-off, and the daily shuttle between the accommodation and the ' +
            'grounds. Six items of laundry per player are included too.',
    },
];

// Named plainly so nobody gets a surprise bill.
const NOT_INCLUDED = [
    'Flights — see the flights section above; we book these together as a squad',
    'Passport and Indian visa — every traveller needs both, and you pay for your own',
    'Travel insurance — you must have this in place before departure',
    'Vaccinations or any medical costs',
    'Personal spending money and souvenirs',
    'Extra laundry beyond the six items included',
];

const fmt = (n) => `$${n.toLocaleString('en-AU')}`;

const ITPricing = () => (
    <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
            {/* Heading */}
            <div className="max-w-3xl">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                >
                    What It Costs
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5"
                >
                    Two Prices — <span className="text-rr-pink">Here's Yours</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                >
                    There are two prices for this tour, and which one applies to you depends on one thing
                    only: whether your player already trains in a Rajasthan Royals Academy Melbourne
                    program. Players already with us pay the lower of the two, because they pay into the
                    academy across the year. <strong className="text-rr-dark">Both groups do exactly the
                    same camp</strong> — same accommodation, same coaches, same sessions, same analysis.
                    Nobody gets a lesser version.
                </motion.p>
            </div>

            {/* The two tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {TIERS.map((t, i) => (
                    <motion.div
                        key={t.key}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col"
                    >
                        <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.2em]">
                            {t.eyebrow}
                        </p>
                        <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mt-2">
                            {t.heading}
                        </h3>

                        <div className="mt-6 pb-6 border-b border-slate-100">
                            <p className="text-5xl font-black text-rr-dark leading-none">{fmt(t.price)}</p>
                            <p className="text-sm font-bold text-rr-charcoal mt-2">
                                per player, including GST
                            </p>
                            <p className="text-sm text-rr-charcoal/70 font-medium mt-1">
                                That is the total program fee — there is no tax or booking fee added on top.
                                Flights are separate and are explained below.
                            </p>
                        </div>

                        <p className="text-xs font-black text-rr-dark uppercase tracking-widest mt-6 mb-2">
                            This is you if…
                        </p>
                        <p className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed flex-1">
                            {t.who}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Not sure which one you are */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sm text-rr-charcoal font-medium mt-6"
            >
                Not sure which one you are? Tell us in the form below and we will confirm your price in
                writing before you pay anything.
            </motion.p>

            {/* Flights */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 bg-rr-dark rounded-2xl p-8 md:p-10"
            >
                <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.2em]">
                    On Top Of The Program Fee
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mt-2">
                    Flights To India
                </h3>
                <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                    Flights are <strong className="text-white">not included</strong> in either price. We want
                    the whole squad on the same flights, arriving and leaving together, so we book the group
                    ourselves and then send you a{' '}
                    <strong className="text-white">group booking link</strong>. You use that link to pay for
                    your own player's seat directly — the money does not come to us, and you are not left
                    hunting for flights on your own.
                </p>
                <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                    {FLIGHT_ESTIMATE_AUD
                        ? `Budget roughly ${fmt(FLIGHT_ESTIMATE_AUD)} per player for the return airfare
                           Melbourne–Nagpur. We will confirm the exact figure when the group booking link
                           goes out.`
                        : `We will confirm the exact return airfare, per player, at the same time as we send
                           the group booking link — so you will have the real number in front of you before
                           you commit to it.`}
                </p>
                <p className="text-base text-white/80 font-medium leading-relaxed mt-4 max-w-3xl">
                    So your total outlay for the tour is the program fee above <em>plus</em> the airfare,
                    and then the few personal items listed under "what it does not cover". There is nothing
                    else coming from us.
                </p>
            </motion.div>

            {/* What's in / what's out */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                {/* Included */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-slate-200 p-8"
                >
                    <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                        What your fee covers
                    </h3>
                    <p className="text-sm text-rr-charcoal/70 font-medium mt-2 mb-6">
                        Identical for both prices. Once you are in Nagpur, everything below is already paid
                        for.
                    </p>
                    <div className="space-y-5">
                        {INCLUDED.map((item) => (
                            <div key={item.title} className="flex items-start gap-4">
                                <span className="mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <div>
                                    <h4 className="text-sm font-black text-rr-dark uppercase tracking-wide">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-rr-charcoal font-medium leading-relaxed mt-1">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Not included + next steps */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="bg-white rounded-2xl border border-slate-200 p-8"
                    >
                        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                            What it does not cover
                        </h3>
                        <p className="text-sm text-rr-charcoal/70 font-medium mt-2 mb-6">
                            So there are no surprises later, here is everything you pay for separately.
                        </p>
                        <ul className="space-y-3">
                            {NOT_INCLUDED.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rr-charcoal/40 shrink-0" />
                                    <span className="text-sm text-rr-charcoal font-medium leading-relaxed">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.16 }}
                        className="bg-white rounded-2xl border border-slate-200 p-8"
                    >
                        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide">
                            How paying works
                        </h3>
                        <ol className="mt-5 space-y-4">
                            {[
                                'Register your interest using the form below. It costs nothing and does not commit you to the tour.',
                                'We come back to you in writing with your confirmed price, the payment dates, and the group flight booking link.',
                                DEPOSIT_AUD
                                    ? `A ${fmt(DEPOSIT_AUD)} deposit confirms your player's place in the touring squad, and comes off the program fee — it is not an extra charge.`
                                    : "A deposit confirms your player's place in the touring squad. It comes off the program fee — it is not an extra charge — and we will tell you the amount and the due date in that same email.",
                                'The balance of the program fee is due before departure, on the dates set out in your confirmation.',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <span className="w-7 h-7 rounded-full bg-rr-pink text-white text-xs font-black flex items-center justify-center shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-rr-charcoal font-medium leading-relaxed pt-1">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

export default ITPricing;
