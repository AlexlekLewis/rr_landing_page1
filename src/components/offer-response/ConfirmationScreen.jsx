import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../Button';

const ConfirmationScreen = ({ decision, applicantName }) => {

    // Determine the content based on the decision
    let content = {};

    if (decision === 'yes' || decision === 'yes_but_no_assess' || decision === 'attended') {
        content = {
            icon: <CheckCircle2 className="w-24 h-24 text-rr-pink mx-auto mb-8" />,
            title: "Decision Confirmed",
            subtitle: "You're taking the next step.",
            message: `Thank you for confirming, ${applicantName}. We have received your response and are thrilled to move forward.`,
            details: decision !== 'yes_but_no_assess'
                ? "Please mark your calendar for Sunday March 1 at 2-4pm at Cutting Edge Cricket, Bundoora. We will send a reminder email closer to the date with full details."
                : "We note you cannot attend the assessment but remain interested. Our team will contact you shortly regarding the next steps."
        };
    } else if (decision === 'maybe') {
        content = {
            icon: <AlertCircle className="w-24 h-24 text-rr-blue mx-auto mb-8" />,
            title: "Response Received",
            subtitle: "We're here to help.",
            message: `Thank you for your honesty, ${applicantName}. Making the right decision for your cricket development is important.`,
            details: "One of our Coaching Directors will review your response and give you a call within the next 48 hours to discuss your questions and talk through the logistics."
        };
    } else {
        // 'no' or 'declined'
        content = {
            icon: <CheckCircle2 className="w-24 h-24 text-slate-400 mx-auto mb-8" />,
            title: "Response Received",
            subtitle: "We wish you the best.",
            message: `Thank you for letting us know, ${applicantName}. We appreciate you taking the time to review the offer and provide feedback.`,
            details: "While you won't be joining the Elite Program this time, we wish you the greatest success with your cricket this season. We will keep your details on file should you wish to be considered for future programs."
        };
    }

    return (
        <section className="min-h-screen bg-rr-dark flex items-center justify-center py-24 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-rr-pink/10 to-rr-blue/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl max-w-2xl w-full text-center relative z-10 backdrop-blur-sm shadow-2xl"
            >
                {content.icon}

                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-2">
                    <span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-2">{content.title}</span>
                </h1>

                <p className="text-xl text-rr-pink font-bold uppercase tracking-widest mb-8">
                    <span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-2">{content.subtitle}</span>
                </p>

                <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-12">
                    <p><span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-2">{content.message}</span></p>
                    <p className="p-6 bg-black/30 rounded-xl border border-white/5">
                        <span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-2">{content.details}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = 'https://rramelbourne.com'}
                        className="flex items-center justify-center gap-2"
                    >
                        <span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-1">Return to Main Site</span> <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-sm text-slate-500">
                    <span className="bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded inline-block px-1">If you have any urgent questions, please contact us at <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline">info@rramelbourne.com</a>.</span>
                </div>
            </motion.div>
        </section>
    );
};

export default ConfirmationScreen;
