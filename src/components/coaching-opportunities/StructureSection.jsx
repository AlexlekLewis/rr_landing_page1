import React from 'react';
import { motion } from 'framer-motion';

const RoleNode = ({ title, subtitle, accent = 'pink', size = 'md', delay = 0 }) => {
    const sizeClasses = {
        lg: 'p-5 md:p-6 max-w-md',
        md: 'p-4 md:p-5 max-w-sm',
        sm: 'p-3 md:p-4 max-w-xs',
    };

    const accentMap = {
        pink: 'border-rr-pink/40 bg-rr-pink/[0.06]',
        blue: 'border-rr-blue/50 bg-rr-blue/[0.08]',
        slate: 'border-white/15 bg-white/[0.03]',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
            className={`relative w-full ${sizeClasses[size]} mx-auto rounded-xl border ${accentMap[accent]} ${sizeClasses[size]} backdrop-blur-sm`}
        >
            <p className={`text-xs md:text-sm font-black uppercase tracking-wider text-white leading-tight`}>{title}</p>
            {subtitle && (
                <p className="text-[11px] md:text-xs text-white/60 font-medium leading-snug mt-1.5">{subtitle}</p>
            )}
        </motion.div>
    );
};

const Connector = ({ height = 'h-8' }) => (
    <div className={`w-px ${height} bg-gradient-to-b from-white/20 to-white/5 mx-auto`} />
);

const StructureSection = () => {
    return (
        <section className="relative py-24 md:py-32 bg-rr-dark overflow-hidden">
            {/* Ambient effects */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rr-blue/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        The Pathway
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6"
                    >
                        A Clear Path. <span className="text-rr-pink">A Real Career.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-8 origin-center"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-base md:text-lg text-white/70 font-medium leading-relaxed"
                    >
                        Whether you're starting out or stepping up, there's a defined route through our coaching structure.
                    </motion.p>
                </div>

                {/* Org chart */}
                <div className="space-y-0">
                    {/* Top: Head Coach */}
                    <RoleNode
                        title="Head Coach / Head of Programming"
                        subtitle="Owns Royals Way standards, season strategy, coach development, and program quality."
                        accent="pink"
                        size="lg"
                        delay={0}
                    />
                    <Connector />

                    {/* Centre Coordinators */}
                    <RoleNode
                        title="Centre Coordinators"
                        subtitle="Operational leads at each delivery centre — scheduling, equipment, on-the-ground execution."
                        accent="blue"
                        size="md"
                        delay={0.1}
                    />
                    <Connector />

                    {/* Stream split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto pt-2">
                        {/* Elite Stream */}
                        <div className="space-y-0">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-center mb-3"
                            >
                                <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.3em]">Elite Stream</p>
                            </motion.div>
                            <RoleNode
                                title="Elite Squad Coach"
                                subtitle="Lead coach for an Elite squad — session design, IDP delivery, performance reviews."
                                accent="pink"
                                size="sm"
                                delay={0.3}
                            />
                            <Connector />
                            <RoleNode
                                title="Elite Assistant Coach"
                                subtitle="Supports squad delivery, runs stations, contributes to player feedback and tracking."
                                accent="slate"
                                size="sm"
                                delay={0.4}
                            />
                        </div>

                        {/* Junior Royals Stream */}
                        <div className="space-y-0">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-center mb-3"
                            >
                                <p className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.3em]">Junior Royals Stream</p>
                            </motion.div>
                            <RoleNode
                                title="Junior Royals Lead Coach"
                                subtitle="Owns delivery quality across a Junior Royals group; mentors Assistant and Cadet coaches."
                                accent="pink"
                                size="sm"
                                delay={0.3}
                            />
                            <Connector />
                            <RoleNode
                                title="Junior Royals Assistant Coach"
                                subtitle="Co-delivers sessions; completes 10 paid assisted hours with a Lead before independent delivery."
                                accent="slate"
                                size="sm"
                                delay={0.4}
                            />
                            <Connector />
                            <RoleNode
                                title="Junior Royals Cadet Coach"
                                subtitle="Entry-level pathway role — observation, station support, supervised drills."
                                accent="slate"
                                size="sm"
                                delay={0.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Footnote */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-xs md:text-sm text-white/40 font-medium text-center max-w-2xl mx-auto mt-14"
                >
                    Role definitions and progression criteria are reviewed pre-season annually.
                </motion.p>
            </div>
        </section>
    );
};

export default StructureSection;
