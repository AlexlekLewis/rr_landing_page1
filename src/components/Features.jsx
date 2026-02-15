import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const features = [
    {
        title: "Power Hitting",
        description: "Never before has the need to develop a power game and optimise ball exit velocity and trajectory been so critical.",
        image: "/assets/jaiswal-power.webp"
    },
    {
        title: "360 Degrees",
        description: "Playing a true 360 degree style of play confuses opponents and wins matches...if done with skill and with strategy.",
        image: "/assets/360-degree.webp"
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
            className="bg-white rounded-2xl shadow-lg border-b-4 border-rr-pink hover:-translate-y-2 transition-transform duration-300 overflow-hidden cursor-pointer"
            onMouseEnter={() => setShowDesc(true)}
            onMouseLeave={() => setShowDesc(false)}
            onClick={() => setShowDesc(!showDesc)}
        >
            <div className="relative h-72 md:h-80 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />

                {/* Hover/tap overlay */}
                <AnimatePresence>
                    {showDesc && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 flex items-end"
                        >
                            <p className="text-white text-sm md:text-base leading-relaxed p-6 md:p-8">
                                {description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-black text-rr-dark uppercase">{title}</h3>
            </div>
        </motion.div>
    );
};

const Features = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-slate-50" id="program">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark mb-4">CRITICAL MODERN SKILLS</h2>
                    <p className="text-lg text-slate-600">
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
                        APPLY NOW
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default Features;
