import React from 'react';
import { motion } from 'framer-motion';

const playerImages = [
    { src: "/assets/jaiswal-power.webp", alt: "Yashasvi Jaiswal" },
    { src: "/assets/kwena-maphaka.webp", alt: "Kwena Maphaka" },
    { src: "/assets/mitchell-owen.png", alt: "Mitchell Owen" },
    { src: "/assets/lhuan-pretorius.jpg", alt: "Lhuan-dré Pretorius" },
    { src: "/assets/jaiswal-celebrating.webp", alt: "Jaiswal Celebrating" },
    { src: "/assets/crook-powerhitting.webp", alt: "Power Hitting" },
    { src: "/assets/fielding-dive.webp", alt: "Athletic Fielding" },
    { src: "/assets/crook-celebrates.webp", alt: "Celebrating" },
];

const PlayerImageStrip = () => {
    return (
        <section className="py-6 relative z-10 bg-black/40 overflow-hidden">
            <div className="flex animate-scroll-x">
                {/* Double the images for infinite scroll effect */}
                {[...playerImages, ...playerImages].map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 w-48 h-48 mx-2 rounded-xl overflow-hidden relative group"
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
