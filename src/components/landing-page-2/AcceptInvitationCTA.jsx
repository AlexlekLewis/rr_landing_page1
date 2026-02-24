import React from 'react';
import { motion } from 'framer-motion';

const AcceptInvitationCTA = () => {
    const scrollToRSVP = () => {
        document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-12 px-6 lg:px-8 relative z-10 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <button
                    onClick={scrollToRSVP}
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-rr-pink to-rr-blue text-white hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                    Accept Invitation
                </button>
            </motion.div>
        </section>
    );
};

export default AcceptInvitationCTA;
