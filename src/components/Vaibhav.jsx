import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Vaibhav = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-slate-900 text-white relative">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-12 items-center">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-12 lg:col-span-5 order-2 lg:order-1"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-[3/4] flex items-center justify-center">
                            <img
                                src="/assets/sooryavanchi-arms-raised.jpg"
                                alt="Vaibhav Sooryavanchi"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
                                <p className="text-white font-bold text-xl">VAIBHAV SOORYAVANCHI</p>
                                <p className="text-yellow-400 text-sm">Royals Academy Star</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-12 lg:col-span-7 order-1 lg:order-2"
                    >
                        <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 mb-8 tracking-tighter">
                            GET NOTICED!
                        </h2>

                        <div className="space-y-8 text-lg text-slate-300 leading-relaxed font-light">
                            <p>
                                This is not just another coaching program. Designed and managed by one of the <strong className="text-white">biggest cricket brands on the planet</strong>, the Elite program draws on decades of global T20 experience and success at the very highest levels, and provides opportunities previously not available in Australia.
                            </p>
                            <p>
                                And, the Royals know how to uncover T20 talent like nobody else.
                            </p>

                            <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                                <h3 className="text-2xl font-bold text-white mb-4">EARN YOUR CHANCE TO BREAK INTO THE GLOBAL T20 SCENE</h3>
                                <p>
                                    All Elite program players will be monitored by the Royals Group coaching team. For those who demonstrate star quality and regularly perform to the benchmarks set by the Royals Group have the chance to earn themselves opportunities to display their skills in front of Royals Group decision makers.
                                </p>
                                <p className="mt-4">
                                    Key Royals coach visits to Bundoora’s Academy, online mentoring opportunities as well as invitations to attend training sessions and/or trials at Rajasthan, Paarl or Barbados Royals franchises are rewards for those who develop into the best of the best performers at the Rajasthan Royals Academy Australia.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">BECOME A MATCH WINNER AND CHANGE YOUR CAREER</h3>
                                <p className="mb-8">
                                    For ALL graduates who complete the Elite program, you are guaranteed to be exposed to and develop the necessary tools to push your career forward and perform at a higher level. Become a true match winner and a star that performs at crucial times for your club or representative side by building the speed, power, skillset and mindset that the very best T20 performers have perfected in order to play on the biggest stage.
                                </p>
                                <Button onClick={scrollToForm} variant="gold">
                                    APPLY TO SECURE YOUR PLACE
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Vaibhav;
