import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, Calendar, MapPin, ArrowRight, Shirt, Loader2 } from 'lucide-react';
import { fmtAud } from './kit';

// Stripe redirect lands here after a Power Game payment. We do NOT trust the
// redirect alone: /api/power-game-verify-session re-checks the session against
// Stripe server-side (second validation layer), backstops the DB row to paid if
// the webhook was missed, and logs the confirmation + Purchase-pixel fire into
// power_game_payment_confirmations. The Meta Purchase pixel fires ONLY once the
// payment is verified (or when verification is unreachable — never when Stripe
// says the session is unpaid).
export default function PowerGameSuccess() {
  const [ref, setRef] = useState('');
  const [order, setOrder] = useState(null);     // stashed by the funnel pre-redirect
  const [verify, setVerify] = useState({ state: 'checking' }); // checking | paid | unpaid | unknown

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "You're in — The Power Game Program";

    let sid = '';
    try {
      sid = new URLSearchParams(window.location.search).get('session_id') || '';
      if (sid) setRef(sid.slice(-8).toUpperCase());
    } catch (_) { /* no-op */ }

    try {
      const stash = sessionStorage.getItem('pgp_confirmation');
      if (stash) setOrder(JSON.parse(stash));
    } catch (_) { /* no-op */ }

    const firePurchase = (amountCents) => {
      try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Purchase', {
            content_name: 'Power Game Program',
            content_category: 'power-game-application',
            value: amountCents ? amountCents / 100 : 989,
            currency: 'AUD',
          });
          return true;
        }
      } catch (_) { /* never let analytics break the page */ }
      return false;
    };

    (async () => {
      if (!sid) { setVerify({ state: 'unknown' }); firePurchase(null); return; }
      try {
        const r = await fetch('/api/power-game-verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid }),
        });
        const data = r.ok ? await r.json() : null;
        if (data && data.paid) {
          setVerify({ state: 'paid', amountCents: data.amountCents });
          const fired = firePurchase(data.amountCents);
          if (fired) {
            // Stamp the pixel fire in the audit table (best-effort).
            fetch('/api/power-game-verify-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: sid, pixelFired: true }),
            }).catch(() => {});
          }
        } else if (data && data.paid === false) {
          setVerify({ state: 'unpaid' }); // payment still processing — no pixel
        } else {
          setVerify({ state: 'unknown' });
          firePurchase(null); // verification unreachable — keep legacy behaviour
        }
      } catch (_) {
        setVerify({ state: 'unknown' });
        firePurchase(null);
      }
    })();
  }, []);

  const paidBadge =
    verify.state === 'paid' ? 'Payment confirmed' :
    verify.state === 'unpaid' ? 'Payment processing' :
    verify.state === 'checking' ? 'Confirming payment…' : 'Payment received';

  const STEPS = [
    {
      Icon: Mail,
      title: 'Check your inbox',
      body: 'A confirmation email with your receipt is on its way. If you don’t see it within a few minutes, check your spam folder.',
    },
    {
      Icon: Calendar,
      title: 'Your squad & schedule',
      body: 'We’ll confirm your allocated squad, training day and times shortly, so you know exactly when and where to be.',
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
              {verify.state === 'checking'
                ? <Loader2 className="w-11 h-11 text-green-400 animate-spin" />
                : <CheckCircle2 className="w-11 h-11 text-green-400" />}
            </div>
            <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
              <span className="text-[11px] font-black text-rr-pink uppercase tracking-widest">{paidBadge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide mb-4">
              {order?.playerName ? <>You&apos;re in, {order.playerName.split(' ')[0]}!</> : <>You&apos;re in!</>}
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-lg mx-auto">
              Your place in <span className="text-white font-bold">The Power Game Program</span> is locked in. Welcome to the Royals Academy — we can&apos;t wait to see you train.
            </p>
            {verify.state === 'unpaid' && (
              <p className="text-amber-300/80 text-sm mt-4 max-w-md mx-auto">
                Your payment is still processing with Stripe — your spot is reserved and your receipt will follow by email. No need to pay again.
              </p>
            )}
            {ref && (
              <p className="text-white/35 text-xs uppercase tracking-widest mt-5">
                Order reference: <span className="text-white/60 font-bold">{ref}</span>
                {verify.state === 'paid' && verify.amountCents ? <> · Paid {fmtAud(verify.amountCents)}</> : null}
              </p>
            )}
          </div>

          {/* Booking + kit order summary (handed over by the funnel) */}
          {order && (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-5 text-center">Your booking</h2>
              <div className="space-y-2 text-sm">
                {order.centreName ? <Row k="Centre" v={order.centreName} /> : null}
                {order.slot ? <Row k="Session" v={order.slot} /> : null}
                {order.band ? <Row k="Age group" v={order.band} /> : null}
              </div>
              {Array.isArray(order.kit) && order.kit.length > 0 && (
                <div className="border-t border-white/10 mt-5 pt-5">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Shirt className="w-4 h-4 text-rr-pink" />
                    <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.3em]">Your kit order</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {order.kit.map((line, i) => (
                      <Row key={i} k={line.name} v={`Size ${line.size}${line.priceCents ? ` · ${fmtAud(line.priceCents)}` : ''}`} />
                    ))}
                  </div>
                  <p className="text-white/35 text-[11px] mt-3 text-center">We&apos;ll double-check sizing with you before anything is ordered.</p>
                </div>
              )}
            </div>
          )}

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

const Row = ({ k, v }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="text-white/45">{k}</span>
    <span className="text-white font-bold text-right">{v}</span>
  </div>
);
