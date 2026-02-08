import React from 'react';
import { motion } from 'framer-motion';

const players = [
    {
        name: "YASHASVI JAISWAL",
        label: "Global T20 Superstar",
        image: "/assets/jaiswal-100.webp",
    },
    {
        name: "KWENA MAPHAKA",
        label: "U19 World Cup Sensation",
        image: "/assets/kwena-maphaka.webp",
    },
    {
        name: "LHUAN-DRE PRETORIUS",
        label: "IPL Breakout Star",
        image: "/assets/lhuan-pretorius.jpg",
    },
    {
        name: "MITCHELL OWEN",
        label: "Royals' Australian Star",
        image: "/assets/mitchell-owen.png",
    },
    {
        name: "VAIBHAV SOORYAVANSHI",
        label: "Youngest IPL Centurion",
        image: "/assets/sooryavanchi-arms-raised.jpg",
    },
    {
        name: "RIYAN PARAG",
        label: "Royals Young Gun",
        image: "/assets/lahiri-pirag.jpg",
    },
];

const SuccessStories = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark mb-4">UNCOVERING TALENT</h2>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-rr-pink mb-4">
                        The T20 game has changed. Have you?
                    </p>
                    <p className="text-lg text-rr-grey">
                        Rajasthan Royals have developed a reputation for uncovering and developing talent that others miss. Siddhartha Lahiri and his network leave no stone unturned.
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

                <p className="text-center text-slate-500 italic mt-10 text-sm">
                    "Are you ready to start yours?"
                </p>
            </div>
        </section>
    );
};

export default SuccessStories;
