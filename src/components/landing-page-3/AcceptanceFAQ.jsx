import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Format newlines in answer to handle breaks naturally
    const formattedAnswer = answer.split('\n').map((line, i) => (
        <React.Fragment key={i}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-rr-pink transition-colors focus:outline-none"
                type="button"
            >
                <span className="font-bold text-lg text-rr-dark pr-8">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-rr-pink flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-slate-600 leading-relaxed font-medium">
                            {formattedAnswer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AcceptanceFAQ = () => {
    const faqs = [
        {
            q: "I live a long way from Bundoora. I don't mind travelling, however there are certain times that will work best for us as we travel. Are we able to request our preferred times?",
            a: "Yes — we understand that travelling to Bundoora is a bigger commitment for some families, and we want to make that as manageable as possible.\nParents and players are welcome to nominate their preferred session times, particularly where travel distance is significant.\nA number of factors will shape the final scheduling, but travel time will be one of the primary considerations. We'll do our best to find the right fit for your family."
        },
        {
            q: "We have holidays planned during the period of the program, how do we manage this as we don't want to miss out?",
            a: "We completely understand — life doesn't stop for a 12-week program, and we don't expect it to. Our coaching team will track any players with pre-booked or unavoidable travel commitments.\nWhere a player is set to miss several sessions, we'll work to arrange make-up sessions that bring those players together at an alternative time. This will be managed on a best-endeavours basis, and we'll communicate with you early to find the best solution."
        },
        {
            q: "Are there payment options available for players and parent?",
            a: "Yes — we want to make the program as accessible as possible. We offer AfterPay as well as other staged payment plan options to help spread the cost.\nFor families who choose to pay in full upfront, we'll include an additional training shirt and training pants at no extra charge as a thank you."
        },
        {
            q: "I don't understand why players are in squads? This isn't what normally happens?",
            a: "Great question — and it's one of the things that makes this program genuinely different.\n\nThink of squads like homeroom at school. Each player belongs to a consistent group with their own squad coach — their go-to person for the entire 12 weeks.\nAt the start of every session, the squad comes together to set the context: what are we working on today, what are your personal goals, and how does this connect to your development plan?\n\nFrom there, players break out into their specific skill work based on the theme of the session — Power Hitting, Athletic Development, Spin development, Wicket Keeping — almost like heading off to different subjects.\nThen at the end of the session, the squad regroups for that all-important reflection: what did you learn, what did you try, what will you take into next time?\n\nThis structure creates something you can't get in a standard coaching environment. Players build real peer-to-peer learning relationships.\nThey share ideas, challenge each other, and grow together. And because the same squad coach is with them throughout the program, that coach truly knows their game — they're not starting from scratch every session.\nThey can track progress, adjust individual development plans, and provide a detailed report on each player's growth by the end of the 12 weeks.\n\nIt's about consistency, connection, and making sure no player falls through the cracks."
        },
        {
            q: "What are the dates of the Elite Program?",
            a: "Our Onboarding Week begins on Sunday the 13th of April, where players will receive their apparel pack and have their first online Zoom meetings with their squad coaches.\nThe first training session of the 12-week program will be Tuesday the 1st of April — sorry, Tuesday the 25th...\n\nThe program runs for 12 weeks through to Sunday the 13th of July."
        },
        {
            q: "I heard there are discounted rates that we can apply for?",
            a: "We understand that the investment is significant, and we appreciate you asking. At this stage, there are no discounted rates available for the Elite Program.\nThe pricing reflects the quality and depth of what's included — dedicated squad coaching, individual development plans, specialist masterclasses, world-class technology, official Royals apparel,\nand a genuine pathway into the Rajasthan Royals global network. We do offer flexible payment options including AfterPay and staged payment plans to help make it more manageable."
        },
        {
            q: "Will you open up more slots if all the Academy fills?",
            a: "We appreciate the interest, and it's great to see such strong demand. However, we do have a firm cap on the number of players in the Elite Program, and this is something we won't compromise on.\nThe cap exists to protect the quality of the experience — it ensures every player receives genuine coaching attention, meaningful time with their squad coach, and the development depth that the program promises.\nIf the program fills, we encourage you to register your interest so you're first in line for future intakes as the Royals Academy continues to grow."
        },
        {
            q: "We would love to know who the specialist coaches are for the 12 week program so we know who will be a part of the sessions?",
            a: "The Elite Program coaching team brings together a genuine mix of professional T20 experience and specialist expertise across cricket formats. We're building something special, and the calibre of coaches reflects that.\n\nHead Coach Alex Lewis, an experienced academy director with over 20 years developing players for Premier Cricket and representative pathways, leads the program and has confirmed the following specialist coaches:\n\nBatting — Power Hitting & 360\n• Matthew Spoors: Globally experienced in the BBL and international arenas, Spoors is recognized as one of the most explosive and hardest-hitting batsmen in the modern game. As a regular contributor throughout the Elite Program, he will unpack the mechanics of powerplay dominance, giving players direct access to elite-level technical knowledge and match-day execution strategies.\n• Jared Rogers: Victorian State Baseball batting coach and power hitting mechanics expert, supporting foundation technical elements and testing key power metrics including bat speed and ball exit velocity.\n\nBowling — Spin\n• Harkirat Bajwa: Australian U19 and Premier Cricket young gun, considered a modern 'mystery spinner' capable of spinning the ball both ways.\n\nFurther specialist coaching announcements will be made in the coming days — watch this space."
        }
    ];

    return (
        <div className="space-y-6 mb-12 border-t border-slate-100 pt-8" id="acceptance-faq">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-2">Program FAQ</h3>
                <p className="text-slate-500 font-medium">Common questions about the Elite Program structure, scheduling, and coaching.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rr-pink to-rr-blue"></div>
                {faqs.map((item, i) => <FAQItem key={`faq-${i}`} question={item.q} answer={item.a} />)}
            </div>
        </div>
    );
};

export default AcceptanceFAQ;
