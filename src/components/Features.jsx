import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const features = [
    {
        title: "Power and 360 Hitting",
        description: "No longer are the terms power hitting and 360 degrees just ‘gimmicks’. They have become critical part of the modern day skillset required to change the momentum of games.",
        image: "/assets/jaiswal-power.webp"
    },
    {
        title: "Game Changing Fielding",
        description: "Elite fielders change the momentum of games. Millimetres matter in the modern game with wins and losses dependant on individual skills.",
        image: "/assets/kwena-catch.png"
    },
    {
        title: "Winning T20 Mindset",
        description: "Learn how and why the elite T20 cricketers think the way they do, and transform results with an advanced mindset.",
        image: "/assets/winning-mindset.jpg"
    },
    {
        title: "Control the Game",
        description: "Powerplay, middle overs or bowling at the death, learn skills to control the game with the ball in hand.",
        image: "/assets/on-pace-off-pace.jpg"
    }
];

const FeatureCard = ({ title, description, image, delay }) => {
    const [showDesc, setShowDesc] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 border-b-4 border-b-rr-pink hover:-translate-y-2 transition-transform duration-300 overflow-hidden cursor-pointer group"
            onMouseEnter={() => setShowDesc(true)}
            onMouseLeave={() => setShowDesc(false)}
            onClick={() => setShowDesc(!showDesc)}
        >
            <div className="relative h-72 md:h-80 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Hover/tap overlay */}
                <AnimatePresence>
                    {showDesc && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="absolute inset-0 bg-gradient-to-t from-rr-blue/90 via-rr-blue/70 to-transparent flex items-end"
                        >
                            <p className="text-white text-sm md:text-base leading-relaxed p-6 md:p-8 font-medium">
                                {description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-rr-dark uppercase tracking-wider">{title}</h3>
            </div>
        </motion.div>
    );
};

const Features = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white relative" id="program">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-rr-pink/5 to-transparent rounded-bl-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark mb-4">CRITICAL MODERN SKILLS</h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-8 rounded-full" />
                    <p className="text-lg text-slate-600 font-medium">
                        With T20 cricket at the heart of the Rajasthan Royals Academy Melbourne Elite Program, expect an education in the skills that matter.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 0.1} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button onClick={scrollToForm} variant="primary">
                        REGISTER INTEREST
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default Features;
