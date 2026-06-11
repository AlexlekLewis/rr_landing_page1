import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Flame, Eye, Feather, RotateCw, ArrowRight } from 'lucide-react';

// "Who it's for" — the buyer's real questions, answered in the players' own words.
// Quotes are verbatim from 2026 cohort journals (lightly tidied), unattributed by
// design: no names → no minor-consent blocker. Each tile = one program element.
const TILES = [
    {
        Icon: Zap,
        q: 'Will it actually make them a more powerful hitter?',
        quote: 'I have more power than I previously thought.',
    },
    {
        Icon: TrendingUp,
        q: 'Will I be able to level up my game?',
        quote: "I was chasing 14 off 6 and got 22 — it told me I'm capable of more than I think I am.",
    },
    {
        Icon: Flame,
        q: "What if it's self-doubt holding them back, not talent?",
        quote: 'My self-belief can dictate the game.',
    },
    {
        Icon: Eye,
        q: 'Will they actually start seeing the ball sooner?',
        quote: "It's much easier to pick the ball shortly after release — it makes the ball seem slightly slower.",
    },
    {
        Icon: Feather,
        q: 'My kid plays it safe. Will that change?',
        quote: 'I play a lot better with freedom, instead of being tentative and just tapping singles.',
    },
    {
        Icon: RotateCw,
        q: 'Can they really become a 360° batter?',
        quote: 'I learned how to play the same ball in six different areas — multiple shots off the same ball.',
    },
];

// Diagonal light shimmer that sweeps the card once it scrolls into view.
const Shimmer = ({ delay = 0 }) => (
    <motion.span
        aria-hidden
        initial={{ x: '-160%' }}
        whileInView={{ x: '260%' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.15, delay, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
    />
);

const QuoteTile = ({ Icon, q, quote, idx }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: 'easeOut' }}
        className="group relative"
    >
        {/* Glow that pops from behind the card on hover */}
        <div
            aria-hidden
            className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-rr-pink/45 via-rr-pink/15 to-rr-blue/35 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-90"
        />
        <div className="relative h-full overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-white/[0.08] group-hover:border-rr-pink/50">
            <Shimmer delay={0.35 + (idx % 3) * 0.18} />
            <div className="flex items-start gap-2.5 mb-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-rr-pink/12 border border-rr-pink/30 text-rr-pink flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />
                </span>
                <h3 className="font-black text-white text-[15px] leading-snug pt-1.5">{q}</h3>
            </div>
            <blockquote className="border-l-[3px] border-rr-pink pl-3.5 py-1">
                <p className="text-white/85 text-sm italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </blockquote>
        </div>
    </motion.div>
);

const AskThePlayers = () => {
    return (
        <section className="bg-rr-page py-20 md:py-28 relative overflow-hidden">
            {/* Ambient brand glow behind the grid */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,31,143,0.10) 0%, rgba(18,38,170,0.06) 45%, rgba(0,0,0,0) 75%)' }}
            />

            <div className="max-w-6xl mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-3">Who it&apos;s for</div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-5">
                        ASK THE <span className="text-rr-pink">PLAYERS</span>
                    </h2>
                    <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
                        The questions you&apos;re already asking — answered by the players who just did the program.
                    </p>
                </motion.div>

                {/* Question tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {TILES.map((t, i) => (
                        <QuoteTile key={i} {...t} idx={i} />
                    ))}
                </div>

                {/* Before → after — the transformation closer */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="group relative mt-6"
                >
                    <div
                        aria-hidden
                        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-rr-blue/40 to-rr-pink/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-80"
                    />
                    <div className="relative overflow-hidden rounded-2xl border border-rr-pink/30 bg-gradient-to-br from-rr-blue/15 via-transparent to-rr-pink/10 p-6 md:p-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-rr-pink/50">
                        <Shimmer delay={0.5} />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <span className="flex-shrink-0 inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 text-rr-light-pink font-black uppercase tracking-[0.18em] text-[10px] rounded-full px-3.5 py-1.5">
                                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.6} /> Before → After
                            </span>
                            <p className="text-white text-base md:text-lg italic leading-relaxed">
                                &ldquo;Before, I was tentative and worried I&apos;d top-edge the pull shot. Now I&apos;m
                                confident hitting anyone for six over square leg.&rdquo;
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Tie-in to the apply section directly below */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center text-white/50 text-sm mt-12"
                >
                    The next quote could be yours — <span className="text-white font-bold">apply below</span>.
                </motion.p>
            </div>
        </section>
    );
};

export default AskThePlayers;
