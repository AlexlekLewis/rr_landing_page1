import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

// Stripe redirect lands here after a successful Power Game payment. The webhook
// has already confirmed the booking server-side; this is the friendly receipt.
export default function PowerGameSuccess() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'You\'re in — The Power Game Program'; }, []);
  return (
    <div className="min-h-screen bg-rr-dark text-white font-sans flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-wide mb-3">You're in!</h1>
        <p className="text-white/60 text-sm mb-8">
          Your spot in The Power Game Program is locked in. A confirmation email with your squad, venue and training times is on its way. We can't wait to see you train.
        </p>
        <a href="/PGP2026" className="inline-block bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-3 transition-colors">
          Back to the Power Game
        </a>
      </div>
    </div>
  );
}
