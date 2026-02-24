import React from 'react';
import { motion } from 'framer-motion';

const playerImages = [
    { src: "/assets/vaibhav-first-ball.jpg", alt: "Vaibhav Sooryavanshi — First Ball" },
    { src: "/assets/lp2/jofra-archer.png", alt: "Jofra Archer" },
    { src: "/assets/vaibhav-batting.jpg", alt: "Vaibhav Sooryavanshi Batting" },
    { src: "/assets/lp2/sam-curran.png", alt: "Sam Curran" },
    { src: "/assets/jadeja-young-ipl.jpg", alt: "Ravindra Jadeja — Early IPL Days" },
    { src: "/assets/lp2/dhruv-jurel.png", alt: "Dhruv Jurel" },
    { src: "/assets/hero-celebration-new.jpg", alt: "Rajasthan Royals Celebrating" },
    { src: "/assets/sooryavanchi-arms-raised.jpg", alt: "Vaibhav Sooryavanshi Century Celebration" },
];

const PlayerImageStrip = () => {
    return (
        <section className="py-12 relative z-10 bg-slate-50 overflow-hidden">
            <div className="flex animate-scroll-x">
                {/* Double the images for infinite scroll effect */}
                {[...playerImages, ...playerImages].map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 w-48 h-48 mx-2 rounded-xl overflow-hidden relative group shadow-md"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PlayerImageStrip;
