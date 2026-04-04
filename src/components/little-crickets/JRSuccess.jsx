import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { supabase } from '../../lib/supabase';

const JRSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Update payment status on the correct location table
        const recordId = localStorage.getItem('jr_record_id');
        const location = localStorage.getItem('jr_location');
        if (recordId && location) {
            const table = location === 'bundoora' ? 'junior_royals_bundoora' : 'junior_royals_hallam';
            supabase.from(table)
                .update({ payment_status: 'completed' })
                .eq('id', recordId)
                .then(() => {
                    localStorage.removeItem('jr_record_id');
                    localStorage.removeItem('jr_location');
                });
        }
    }, []);

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
            <Navbar variant="junior-royals" />
            <main className="flex-1 flex items-center justify-center py-32 px-6">
                <div className="max-w-xl w-full text-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
                        <div className="w-16 h-16 rounded-full bg-rr-pink/10 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-4">You're Registered!</h1>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-4">
                            Thank you for registering for the Junior Royals — Term 2, 2026. Your place is secured and we'll be in touch shortly with everything you need to know before your first session.
                        </p>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-8">
                            Questions? Email us at{' '}
                            <a href="mailto:andy.crook@rramelbourne.com" className="text-rr-pink font-bold hover:underline">andy.crook@rramelbourne.com</a>.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full transition-all duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default JRSuccess;
