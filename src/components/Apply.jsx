import React from 'react';
import Button from './Button';

const InputField = ({ label, type = "text", placeholder }) => (
    <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-slate-900"
        />
    </div>
);

const Apply = () => {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100" id="apply-form">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
                        START YOUR JOURNEY
                    </h2>
                    <p className="text-lg text-slate-600">
                        Ready to become a T20 star? Fill out the form below to apply for the Rajasthan Royals Academy Australia Elite Program.
                    </p>
                </div>

                <form className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                    <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="First Name" placeholder="Your first name" />
                        <InputField label="Last Name" placeholder="Your last name" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Age" type="number" placeholder="e.g. 16" />
                        <InputField label="Date of Birth" type="date" />
                    </div>

                    <InputField label="Email Address" type="email" placeholder="you@example.com" />
                    <InputField label="Phone Number" type="tel" placeholder="0400 000 000" />
                    <InputField label="Primary Suburb" placeholder="e.g. Bundoora" />

                    <InputField label="Play Cricket Profile Link" placeholder="https://..." />
                    <InputField label="Current Club(s)" placeholder="Your club name" />

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Representative History</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-slate-900 h-32"
                            placeholder="List your representative achievements..."
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Written Bio</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-slate-900 h-32"
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Career Goals</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-slate-900 h-32"
                                placeholder="Where do you want to be in 5 years?"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Attach Cricket CV</label>
                        <input
                            type="file"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                    </div>

                    <Button className="w-full py-4 text-xl">
                        SUBMIT APPLICATION
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default Apply;
