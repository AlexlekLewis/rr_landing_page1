import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, Calendar, MapPin, ArrowRight } from 'lucide-react';

// Stripe redirect lands here after a successful Power Game payment. The webhook
// has already confirmed the booking server-side; this is the friendly receipt.
export default function PowerGameSuccess() {
  const [ref, setRef] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "You're in — The Power Game Program";
    // Surface a short order reference from the Stripe session id (if present).
    try {
      const sid = new URLSearchParams(window.location.search).get('session_id');
      if (sid) setRef(sid.slice(-8).toUpperCase());
    } catch (_) { /* no-op */ }
    // Meta Pixel — record the completed purchase / registration.
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          content_name: 'Power Game Program',
          content_category: 'power-game-application',
          value: 989,
          currency: 'AUD',
        });
      }
    } catch (_) { /* never let analytics break the page */ }
  }, []);

  const STEPS = [
    {
      Icon: Mail,
      title: 'Check your inbox',
      body: 'A confirmation email with your receipt is on its way. If you don\u2019t see it within a few minutes, check your spam folder.',
    },
    {
      Icon: Calendar,
      title: 'Your squad & schedule',
      body: 'We\u2019ll confirm your allocated squad, training day and times shortly, so you know exactly when and where to be.',
    },
    {
      Icon: MapPin,
      title: 'Arrive ready to train',
      body: 'Turn up to your first session at your chosen venue. Bring your kit — the rest is taken care of.',
    },
  ];

  return (
    <div className="min-h-screen bg-rr-dark text-white font-sans flex flex-col">
      {/* Brand bar */}
      <div className="h-1 bg-gradient-rr w-full" />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img src="/assets/rr-logo-pink.png" alt="Rajasthan Royals Academy Melbourne" className="h-16 w-auto object-contain" />
          </div>

          {/* Success header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-11 h-11 text-green-400" />
            </div>
            <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
              <span className="text-[11px] font-black text-rr-pink uppercase tracking-widest">Payment Confirmed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide mb-4">You're in!</h1>
            <p className="text-white/65 text-base leading-relaxed max-w-lg mx-auto">
              Your place in <span className="text-white font-bold">The Power Game Program</span> is locked in. Welcome to the Royals Academy — we can't wait to see you train.
            </p>
            {ref && (
              <p className="text-white/35 text-xs uppercase tracking-widest mt-5">
                Order reference: <span className="text-white/60 font-bold">{ref}</span>
              </p>
            )}
          </div>

          {/* What happens next */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-6 text-center">What happens next</h2>
            <div className="space-y-5">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-rr-pink/10 border border-rr-pink/25 flex items-center justify-center">
                    <s.Icon className="w-5 h-5 text-rr-pink" />
                  </div>
                  <div>
                    <div className="font-black text-white uppercase tracking-wide text-sm mb-1">{s.title}</div>
                    <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact + CTA */}
          <div className="text-center">
            <p className="text-white/50 text-sm mb-6">
              Questions about your booking? Email us at{' '}
              <a href="mailto:info@rramelbourne.com" className="text-rr-blue hover:text-white underline underline-offset-2 transition-colors">info@rramelbourne.com</a>
            </p>
            <a
              href="/PGP2026"
              className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.45)]"
            >
              Back to the Power Game <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
