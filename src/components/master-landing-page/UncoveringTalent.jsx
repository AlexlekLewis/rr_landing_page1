import React from 'react';
import { motion } from 'framer-motion';

const players = [
    {
        name: "YASHASVI JAISWAL",
        label: "T20 Superstar",
        image: "/assets/jaiswal-100.jpg",
    },
    {
        name: "KWENA MAPHAKA",
        label: "T20 Bowling Sensation",
        image: "/assets/kwena-maphaka.webp",
    },
    {
        name: "LHUAN-DRE PRETORIUS",
        label: "IPL Breakout Star",
        image: "/assets/lhuan-pretorius.jpg",
    },
    {
        name: "RAVINDRA JADEJA",
        label: "Uncovered by the Royals",
        image: "/assets/jadeja-rr-bowling.webp",
    },
    {
        name: "VAIBHAV SOORYAVANSHI",
        label: "Youngest IPL Centurion",
        image: "/assets/vaibhav-debut-six.jpg",
    },
    {
        name: "RIYAN PARAG",
        label: "Young Gun to Royals Captain",
        image: "/assets/riyan-parag-batting.jpg",
    },
];

const UncoveringTalent = () => (
    <section className="py-24 bg-rr-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rr-pink/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">The Royals Pedigree</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                    Uncovering{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Talent</span>
                </h2>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-rr-pink/80 mb-4">
                    The T20 game has changed. Have you?
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-6" />
                <p className="text-lg text-white/50 font-medium max-w-2xl mx-auto leading-relaxed">
                    Rajasthan Royals have developed a reputation for uncovering and developing talent across the world.
                </p>
            </motion.div>

            {/* Player grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {players.map((player, i) => (
                    <motion.div
                        key={player.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="group relative rounded-2xl overflow-hidden shadow-2xl aspect-video"
                    >
                        <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        {/* Pink accent line at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rr-pink to-rr-blue" />
                        {/* Text */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wide leading-tight mb-1">{player.name}</h3>
                            <p className="text-rr-pink text-xs font-bold uppercase tracking-widest">{player.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
);

export default UncoveringTalent;
