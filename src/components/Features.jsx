import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, description, image, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-pink-600 hover:-translate-y-2 transition-transform duration-300"
    >
        <div className="h-48 bg-slate-100 rounded-xl mb-6 overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </motion.div>
);

const Features = () => {
    const features = [
        {
            title: "Power Hitting",
            description: "Never before has the need to develop a power game and optimise ball exit velocity and trajectory been so critical.",
            image: "/assets/jaiswal-power.webp"
        },
        {
            title: "360 Degree Striking",
            description: "Playing a true 360 degree style of play confuses opponents and wins matches...if done with skill and with strategy.",
            image: "/assets/360-degree.webp"
        },
        {
            title: "Winning T20 Mindset",
            description: "Learn how and why the elite T20 cricketers think the way they do, and transform results with an advanced mindset.",
            image: "/assets/winning-mindset.jpg"
        },
        {
            title: "Off Pace or On Pace?",
            description: "That is the question. When, where, what, how are questions you’ll learn to answer as a pace or spin bowler.",
            image: "/assets/on-pace-off-pace.jpg"
        }
    ];

    return (
        <section className="py-24 bg-slate-50" id="program">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">CRITICAL COMPONENTS</h2>
                    <p className="text-lg text-slate-600">
                        With T20 cricket at the heart of the Rajasthan Royals Australia Elite Program, expect an education in the formats that matter.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 0.1} />
                    ))}
                </div>

                <div className="text-center mt-12 text-slate-500 italic">
                    "We have not omitted an element of the modern day game required to help you succeed."
                </div>
            </div>
        </section>
    );
};

export default Features;
