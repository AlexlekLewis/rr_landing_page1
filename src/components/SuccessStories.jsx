import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

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

const SuccessStories = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden" id="success-stories">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rr-pink/50 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">UNCOVERING TALENT</h2>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-rr-light-pink mb-4">
                        The T20 game has changed. Have you?
                    </p>
                    <p className="text-lg text-slate-300 font-light">
                        Rajasthan Royals have developed a reputation for uncovering and developing talent across the world.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {players.map((player, i) => (
                        <motion.div
                            key={player.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="group relative rounded-2xl overflow-hidden shadow-xl aspect-video cursor-pointer"
                        >
                            <img
                                src={player.image}
                                alt={player.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{player.name}</h3>
                                <p className="text-rr-pink font-medium text-sm">{player.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button onClick={scrollToForm} variant="primary">
                        APPLY NOW
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default SuccessStories;
