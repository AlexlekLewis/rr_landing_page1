import React from 'react';
import { motion } from 'framer-motion';

const playerImages = [
    { src: "/assets/lp2/action/rr-vs-gt-action1.jpg", alt: "RR vs GT — Match Action" },
    { src: "/assets/lp2/action/csk-vs-rr-action2.jpg", alt: "CSK vs RR — Match Action" },
    { src: "/assets/lp2/action/rr-vs-mi-action1.jpg", alt: "RR vs MI — Match Action" },
    { src: "/assets/lp2/action/rr-vs-gt-action5.jpg", alt: "RR vs GT — Match Action" },
    { src: "/assets/lp2/action/csk-vs-rr-action4.jpg", alt: "CSK vs RR — Match Action" },
    { src: "/assets/lp2/action/rr-vs-mi-action4.jpg", alt: "RR vs MI — Match Action" },
    { src: "/assets/lp2/action/rr-vs-gt-action9.jpg", alt: "RR vs GT — Match Action" },
    { src: "/assets/lp2/action/csk-vs-rr-action6.jpg", alt: "CSK vs RR — Match Action" },
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
                        className="flex-shrink-0 w-64 h-44 mx-2 rounded-xl overflow-hidden relative group shadow-md"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PlayerImageStrip;
