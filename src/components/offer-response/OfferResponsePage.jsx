import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';
import Footer from '../Footer';

// Sub-components to be built next
import InvitationHero from './InvitationHero';
import ExclusiveVideo from './ExclusiveVideo';
import ProgramDetails from './ProgramDetails';
import RSVPForm from './RSVPForm';
import ConfirmationScreen from './ConfirmationScreen';

const CopyOriginWrapper = ({ label, color, isPreview, children }) => {
    if (isPreview) {
        const borderColor = color === 'emerald' ? 'border-emerald-500' : color === 'amber' ? 'border-amber-500' : 'border-rr-blue';
        const bgColor = color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-rr-blue';
        const textLabel = color === 'emerald' ? "ANDY'S LANGUAGE" : color === 'amber' ? "AI LANGUAGE" : label;

        return (
            <div className={`relative border-l-[12px] ${borderColor} pl-6 md:pl-10 py-6 my-16 mx-4 md:mx-8 rounded-r-3xl bg-slate-50/50 shadow-sm print:my-8 print:break-inside-avoid`}>
                <div className={`absolute -left-3 -top-5 ${bgColor} text-white text-sm md:text-base font-black px-6 py-2 rounded-xl uppercase tracking-widest shadow-xl z-50`}>
                    {textLabel} - {label}
                </div>
                {children}
            </div>
        );
    }
    return children;
};

const OfferResponsePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        // Developer preview bypass (only works on localhost/development)
        if (import.meta.env.DEV && token === 'preview') {
            setTokenData({
                id: 'preview-mode',
                applicant_name: 'Alex Lewis (Preview)',
                status: 'pending'
            });
            setLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid invitation link.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('offer_tokens')
                .select('*')
                .eq('token', token)
                .single();

            if (fetchError || !data) {
                setError('We could not find this invitation. The link may be invalid.');
                return;
            }

            // Check expiry
            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                setError('This invitation link has expired.');
                return;
            }

            // Check if already responded
            if (data.status !== 'pending') {
                setIsSubmitted(true);
                // We'll show the generic accepted/declined state based on status if we wanted, 
                // but for now setting isSubmitted true hides the form.
                setSubmissionResult(data.status); // e.g. 'attended', 'declined'
            }

            setTokenData(data);
        } catch (err) {
            console.error('Error validating token:', err);
            setError('An error occurred while loading your invitation.');
        } finally {
            setLoading(false);
        }
    };

    const handleRSVPSubmit = async (responseData) => {
        // This will be called by RSVPForm
        setIsSubmitted(true);
        setSubmissionResult(responseData.decision);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-rr-pink animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-rr-dark flex items-center justify-center p-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-rr-pink mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4">Invalid Link</h2>
                    <p className="text-slate-400 font-medium mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-rr-blue to-rr-pink text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-rr-pink/20 transition-all w-full"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-rr-dark/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
                    <img
                        src="/rra-white.png"
                        alt="Rajasthan Royals Academy"
                        className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
                        onClick={() => window.open('https://rramelbourne.com', '_blank')}
                    />
                </div>
            </nav>

            {/* Mock Dev Legend - Removed as requested */}

            {/* Main Content Flow */}
            <main className="pt-20">
                {!isSubmitted ? (
                    <>
                        <CopyOriginWrapper isPreview={import.meta.env.DEV && token === 'preview'} label="Hero & Invitation" color="emerald">
                            <InvitationHero applicantName={tokenData.applicant_name} />
                        </CopyOriginWrapper>

                        <CopyOriginWrapper isPreview={import.meta.env.DEV && token === 'preview'} label="Next Steps Video" color="amber">
                            <ExclusiveVideo applicantName={tokenData.applicant_name} />
                        </CopyOriginWrapper>

                        <CopyOriginWrapper isPreview={import.meta.env.DEV && token === 'preview'} label="Program Details & Investment" color="emerald">
                            <ProgramDetails />
                        </CopyOriginWrapper>

                        <CopyOriginWrapper isPreview={import.meta.env.DEV && token === 'preview'} label="RSVP Form" color="amber">
                            <RSVPForm tokenData={tokenData} onSubmitSuccess={handleRSVPSubmit} />
                        </CopyOriginWrapper>
                    </>
                ) : (
                    <ConfirmationScreen decision={submissionResult} applicantName={tokenData.applicant_name} />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default OfferResponsePage;
