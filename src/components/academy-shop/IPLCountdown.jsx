import React, { useState, useEffect } from 'react';

// Order closes 10am Monday 4th May 2025 AEST (UTC+10)
const ORDER_CLOSE = new Date('2026-05-04T10:00:00+10:00');

const pad = (n) => String(n).padStart(2, '0');

const IPLCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = ORDER_CLOSE - Date.now();
      if (diff <= 0) {
        setClosed(true);
        setTimeLeft(null);
        return;
      }
      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (closed) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
        <p className="text-xs font-black text-red-600 uppercase tracking-widest">Order Window Closed</p>
        <p className="text-xs text-red-500 mt-1">This order batch has closed. Check back for the next window.</p>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-rr-pink/20 bg-gradient-to-br from-rr-pink/5 to-rr-blue/5">
      {/* Header */}
      <div className="bg-rr-pink px-4 py-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
        <p className="text-xs font-black text-white uppercase tracking-widest">
          Order closes Mon 4 May · 10:00am AEST
        </p>
      </div>

      {/* Countdown */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: timeLeft.days,    label: 'Days' },
            { value: timeLeft.hours,   label: 'Hours' },
            { value: timeLeft.minutes, label: 'Mins' },
            { value: timeLeft.seconds, label: 'Secs' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-black text-rr-dark tabular-nums leading-none">
                {pad(value)}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery info */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-rr-pink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-slate-600 font-medium">
              Available for pickup (Cutting Edge Cricket — Bundoora & Cricket Connect — Hallam) and postage <span className="font-black text-rr-dark">~18th May</span>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-rr-pink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xs text-slate-600 font-medium">
              You'll be updated on your order status via <span className="font-black text-rr-dark">text message</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPLCountdown;
