import React from 'react';
import Button from './Button';

const BonusOffer = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-16 bg-gradient-to-r from-ra-blue to-rr-blue text-white">
            <div className="container mx-auto px-6 text-center">
                <div className="inline-block bg-black/10 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-black/10">Time Limited Offer</div>
                <h2 className="text-3xl md:text-5xl font-black mb-6">FREE ASSESSMENT SESSION</h2>
                <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto mb-8 leading-relaxed">
                    Siddhartha Lahiri is coming to Melbourne! Apply before <strong>February XX</strong> for a chance to attend an exclusive assessment session with Siddartha and the coaching team at Cutting Edge Cricket, Bundoora.
                </p>
                <Button onClick={scrollToForm} variant="white">
                    DON'T MISS OUT - APPLY NOW
                </Button>
            </div>
        </section>
    );
};

export default BonusOffer;
