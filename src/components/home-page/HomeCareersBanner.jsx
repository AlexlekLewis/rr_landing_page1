import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HomeCareersBanner = () => (
    <section className="py-10 md:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(225,31,143,0.35)]"
                style={{
                    background: 'linear-gradient(90deg, #3B1670 0%, #7A1D8F 45%, #E11F8F 100%)',
                }}
            >
                {/* Decorative lion silhouette on the right */}
                <img
                    src="/assets/MELBOURNE_OFFICIAL.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -right-16 -bottom-8 w-64 md:w-96 lg:w-[28rem] opacity-15 pointer-events-none select-none"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />

                <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center px-6 py-10 md:px-14 md:py-14">
                    {/* Left — RRA logo (hidden on small mobile to keep the tile clean) */}
                    <div className="hidden sm:flex justify-center md:justify-start shrink-0">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="w-24 md:w-32 lg:w-36 h-auto"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                    </div>

                    {/* Right — Content */}
                    <div className="text-white">
                        <p className="text-xs md:text-sm font-bold tracking-[0.25em] text-white/80 uppercase mb-3 md:mb-4">
                            We're Hiring
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] mb-4 md:mb-6">
                            Shape The Next<br className="hidden sm:inline" /> Generation
                        </h2>
                        <p className="text-sm md:text-base text-white/85 font-medium max-w-xl leading-relaxed mb-6 md:mb-8">
                            Coaching, content, social media and admin roles inside the Royals Academy network.
                            See the roles and how to apply.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Link
                                to="/careers"
                                className="inline-flex items-center justify-center gap-2 bg-rr-dark hover:bg-rr-navy text-white font-black uppercase tracking-widest text-xs md:text-sm px-6 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,29,72,0.45)] hover:-translate-y-0.5 group w-fit"
                                data-cta="home-careers-banner"
                            >
                                See The Roles
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <p className="text-xs text-white/70 font-medium mt-6 max-w-2xl leading-relaxed">
                            Casual or contract · Working with Children Check required. RRA Melbourne is
                            committed to the safety and wellbeing of every child in our care.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default HomeCareersBanner;
