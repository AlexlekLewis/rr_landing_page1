import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MasterCheckout = () => {
    const [step, setStep] = useState(1);

    // Form state (mock for UI purposes)
    const [formData, setFormData] = useState({
        parentName: '',
        email: '',
        phone: '',
        playerName: '',
        dob: '',
        role: ''
    });

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden" id="checkout-section">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rr-blue/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

            {/* Subtle Pink Logo Watermark */}
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -left-16 top-1/2 -translate-y-1/2 w-auto h-[80%] object-contain opacity-[0.03] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                <div className="text-center mb-12">
                    <img
                        src="/assets/Crest.png"
                        alt="Royal Crest"
                        className="h-20 mx-auto mb-8 brightness-0 invert"
                    />
                    <h2 className="text-4xl font-black text-white uppercase tracking-wide mb-4">
                        COMPLETE YOUR APPLICATION
                    </h2>
                    <p className="text-slate-300 font-medium">Secure your child's spot in the Season 1 Elite intake.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-rr-dark">

                    {/* Progress Indicator */}
                    <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-rr-pink text-white' : 'bg-slate-200 text-slate-400'}`}>1</div>
                            <span className={`font-semibold text-sm ${step >= 1 ? 'text-rr-dark' : 'text-slate-400'}`}>Player Details</span>
                        </div>
                        <div className="flex-1 h-px bg-slate-200 mx-4"></div>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-rr-pink text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
                            <span className={`font-semibold text-sm ${step >= 2 ? 'text-rr-dark' : 'text-slate-400'}`}>Review & Payment</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-10">
                        {step === 1 ? (
                            <form onSubmit={handleNext} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Parent Full Name</label>
                                        <input required type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Best Contact Number</label>
                                        <input required type="tel" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="0400 000 000" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2">Email Address</label>
                                        <input required type="email" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="jane@example.com" />
                                    </div>
                                </div>

                                <hr className="border-slate-200 my-6" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Player Full Name</label>
                                        <input required type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Date of Birth</label>
                                        <input required type="date" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold mb-2">Primary Playing Role</label>
                                        <select required className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rr-blue focus:ring-1 focus:ring-rr-blue">
                                            <option value="">Select Role...</option>
                                            <option value="batsman">Batter</option>
                                            <option value="bowler-pace">Pace Bowler</option>
                                            <option value="bowler-spin">Spin Bowler</option>
                                            <option value="all-rounder">All-Rounder</option>
                                            <option value="wicket-keeper">Wicket-Keeper</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-5 rounded-lg transition-colors mt-8">
                                    Continue to Payment
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Order Summary */}
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                                    <h4 className="font-bold text-lg mb-4">Order Summary</h4>
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                                        <span className="font-medium text-rr-charcoal">RRAA 12-Week Elite Program</span>
                                        <span className="font-bold text-rr-dark">$2995.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-slate-500">
                                        <span>Includes IDP, DNA Profile, and Training Kit</span>
                                        <span>GST Included</span>
                                    </div>
                                </div>

                                {/* Mock Stripe UI */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Card Information</label>
                                        <div className="w-full h-12 bg-slate-50 border border-slate-300 rounded-lg px-4 flex items-center text-slate-400">
                                            Stripe Element Placeholder
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        Payments are secure and encrypted.
                                    </p>
                                </div>

                                <div className="flex items-start gap-4 mt-8">
                                    <button onClick={() => setStep(1)} className="px-6 py-5 rounded-lg font-bold text-rr-charcoal hover:bg-slate-100 transition-colors">
                                        Back
                                    </button>
                                    <button className="flex-1 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-5 rounded-lg transition-colors flex flex-col items-center">
                                        <span>Complete Enrolment</span>
                                    </button>
                                </div>
                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Full refund available within first 2 sessions. <a href="#" className="underline text-rr-blue">See policy.</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </section>
    );
};

export default MasterCheckout;
