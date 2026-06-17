// ============================================================
// ReturningSignup — fast, link-only re-signup for players ALREADY in the Academy
// Elite system. They're known, qualified AND already consented (compliance was
// captured at their original enrolment), so this SKIPS the qualify→place funnel:
// identity details, pick an age-appropriate centre + session, a uniform yes/no,
// and straight to the same $989 Stripe checkout.
//
// Reuses the live create-on-payment plumbing verbatim: buildApplicationRow shapes
// the row, /api/power-game-checkout packs it into the Stripe session metadata, and
// the row in power_game_applications is created ONLY after payment is confirmed
// (api/power-game-webhook + api/power-game-verify-session). Rows are tagged
// source='pgp2026-returning' so they're distinguishable from the public funnel.
//
// The five compliance consents are set on the payload automatically — these
// players agreed to them when they first joined the Academy. The checkout API
// still requires them server-side, so they travel as true on the application.
//
// Session filter: a player only ever sees their AGE-APPROPRIATE band OR HIGHER
// (older) bands at the chosen centre — never a younger band. Band logic is the
// same PG_BANDS / homeBandIdx used by the public funnel, so they can't disagree.
//
// Gating: a soft shared passcode (VITE_PGP_RETURNING_CODE, default below). The
// page is unlisted (not in any nav) and noindex. A client-side code only deters
// casual link-sharing — it is NOT real access control.
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, ShieldCheck, Ruler, ArrowRight, MapPin, Clock, Check } from 'lucide-react';
import { calcAge, isMinor, BLANK_FORM } from '../apply/flow';
import { buildApplicationRow } from '../apply/submit';
import UniformSizeGuideModal from '../UniformSizeGuideModal';
import { fmtAud } from '../apply/kit';
import { SQUADS, CENTRE_BY_SLUG, ACTIVE_CENTRES } from '../../../lib/booking/squads';
import { PG_BANDS, homeBandIdx } from '../../../lib/scoring/guardrail';

const ACCESS_CODE = String(import.meta?.env?.VITE_PGP_RETURNING_CODE || 'ROYALS2026').trim().toUpperCase();
const LIVE_PAYMENTS = !!(import.meta?.env?.VITE_PG_LIVE_PAYMENTS === '1');
const BLOCK_FEE_CENTS = 98900; // $989 — 8-week Power Pre-Season (matches api/power-game-checkout)
const GATE_KEY = 'pgp_returning_unlocked';

// One entry per 2-hour session block (the SQUADS list has two stream-teams per
// block — dedupe to the block; the coach assigns the team after payment).
const ALL_BLOCKS = (() => {
  const seen = new Set();
  const out = [];
  for (const s of SQUADS) {
    if (seen.has(s.blockId)) continue;
    seen.add(s.blockId);
    out.push({ blockId: s.blockId, centre: s.centre, band: s.band, day: s.day, startTime: s.startTime, endTime: s.endTime, blockLabel: s.blockLabel, sortOrder: s.sortOrder });
  }
  return out;
})();
const bandIdx = (band) => PG_BANDS.findIndex((b) => b.name === band);

// Day / Month / Year capture — same as the rest of the site (DateOfBirthInput),
// re-themed for the dark page. Emits "YYYY-MM-DD" so calcAge/isMinor work as-is.
const DOB_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const DOB_MONTHS = [
  ['01', 'Jan'], ['02', 'Feb'], ['03', 'Mar'], ['04', 'Apr'], ['05', 'May'], ['06', 'Jun'],
  ['07', 'Jul'], ['08', 'Aug'], ['09', 'Sep'], ['10', 'Oct'], ['11', 'Nov'], ['12', 'Dec'],
];
const DOB_YEARS = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

const BLANK = {
  player_name: '',
  player_dob: '',
  gender: '',
  suburb: '',
  parent_name: '',
  contact_email: '',
  contact_phone: '',
  centre: '',
  needs_uniform: false,
};

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

export default function ReturningSignup() {
  const [unlocked, setUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [gateError, setGateError] = useState('');

  const [form, setForm] = useState(BLANK);
  const [dob, setDob] = useState({ d: '', m: '', y: '' }); // partial DOB parts (preserve incomplete picks)
  const [sessionId, setSessionId] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [localDone, setLocalDone] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  // Day/Month/Year → form.player_dob only once all three are chosen (else empty).
  const setDobPart = (part, val) => {
    const next = { ...dob, [part]: val };
    setDob(next);
    set('player_dob', (next.d && next.m && next.y) ? `${next.y}-${next.m}-${next.d}` : '');
  };
  const minor = isMinor(form.player_dob);
  const age = calcAge(form.player_dob);
  const homeIdx = age != null ? homeBandIdx(age) : null;

  // Age-appropriate-or-higher sessions at the chosen centre (never a younger band).
  const sessions = (form.centre && homeIdx != null)
    ? ALL_BLOCKS.filter((b) => b.centre === form.centre && bandIdx(b.band) >= homeIdx).sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const selectedSession = sessions.find((s) => s.blockId === sessionId) || null;

  useEffect(() => {
    document.title = 'Re-sign up — Power Pre-Season';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    try {
      if (sessionStorage.getItem(GATE_KEY) === '1') setUnlocked(true);
    } catch (_) { /* private mode — gate stays up, no harm */ }
    return () => { try { document.head.removeChild(meta); } catch (_) { /* no-op */ } };
  }, []);

  // If the selected session stops being eligible (centre or DOB changed), drop it.
  useEffect(() => {
    if (sessionId && !sessions.some((s) => s.blockId === sessionId)) setSessionId('');
  }, [sessionId, sessions]);

  function submitGate(e) {
    e.preventDefault();
    if (codeInput.trim().toUpperCase() === ACCESS_CODE) {
      setUnlocked(true);
      setGateError('');
      try { sessionStorage.setItem(GATE_KEY, '1'); } catch (_) { /* no-op */ }
    } else {
      setGateError('That access code isn’t right. Please check the link you were sent.');
    }
  }

  function validate() {
    const e = [];
    if (!form.player_name.trim()) e.push('Please enter the player’s full name.');
    if (!form.player_dob) e.push('Please enter the player’s date of birth.');
    else if (age == null || age < 5 || age > 70) e.push('Please check the date of birth.');
    if (!form.gender) e.push('Please select Male or Female cricket.');
    if (minor && !form.parent_name.trim()) e.push('Parent/guardian name is required for under-18s.');
    if (!emailOk(form.contact_email)) e.push('Please enter a valid contact email.');
    if (!form.contact_phone.trim()) e.push('Please enter a contact phone number.');
    if (!form.centre) e.push('Please choose a centre.');
    else if (!selectedSession) e.push('Please choose a session time.');
    return e;
  }

  function buildPayload() {
    // Reuse the proven row builder. These players already consented at enrolment,
    // so the five compliance flags travel as true (the checkout API requires them).
    const apForm = {
      ...BLANK_FORM, ...form,
      accept_terms: true, accept_player_code: true, accept_parent_code: true,
      accept_social_media: true, accept_playing_standard: true,
    };
    const centre = CENTRE_BY_SLUG[form.centre];
    const placement = selectedSession ? { placedBand: selectedSession.band } : null;
    const squad = selectedSession
      ? { id: selectedSession.blockId, day: selectedSession.day, startTime: selectedSession.startTime, endTime: selectedSession.endTime }
      : null;
    const row = buildApplicationRow(apForm, placement, squad, {
      kind: 'standard', status: 'awaiting_payment', centreName: centre?.name,
    });
    return {
      ...row,
      source: 'pgp2026-returning',
      bio: 'Returning Academy Elite player — express re-signup (compliance on file from original enrolment).',
    };
  }

  async function pay() {
    if (submitting) return;
    const e = validate();
    if (e.length) { setErrors(e); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setErrors([]);
    setSubmitting(true);
    try {
      const application = buildPayload();
      const centre = CENTRE_BY_SLUG[form.centre];
      if (LIVE_PAYMENTS || import.meta?.env?.PROD) {
        try {
          sessionStorage.setItem('pgp_confirmation', JSON.stringify({
            playerName: form.player_name,
            centreName: centre?.name || '',
            slot: selectedSession ? `${selectedSession.day} ${selectedSession.startTime}–${selectedSession.endTime}` : '',
            band: selectedSession?.band || '',
          }));
        } catch (_) { /* no-op */ }
        const r = await fetch('/api/power-game-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application,
            email: form.contact_email,
            playerName: form.player_name,
            squadId: selectedSession?.blockId,
            uniformTotalCents: 0, // uniform sizing + payment handled at Stripe
            uniformSelection: '',
          }),
        });
        const data = await r.json().catch(() => null);
        if (data?.url) { window.location.href = data.url; return; }
        setErrors([data?.error || 'Could not start checkout — please try again.']);
        return;
      }
      // Preview/offline: no payment is taken and nothing is written to the database.
      setLocalDone(true);
    } catch (_) {
      setErrors(['Could not start your payment — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Passcode gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-rr-dark text-white font-sans flex items-center justify-center px-5">
        <div className="h-1 bg-gradient-rr fixed top-0 inset-x-0" />
        <motion.form
          onSubmit={submitGate}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm bg-white/[0.04] border border-white/10 rounded-2xl p-7 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-rr-pink" />
          </div>
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-[11px] mb-1">Power Pre-Season</div>
          <h1 className="text-xl font-black uppercase tracking-wide mb-2">Returning players</h1>
          <p className="text-white/55 text-sm leading-relaxed mb-5">
            This is the private re-signup page for players already in the Academy Elite system. Enter the access code from your invite to continue.
          </p>
          {gateError && (
            <div className="mb-4 bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2.5 text-red-200 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{gateError}</span>
            </div>
          )}
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="w-full bg-white/5 border border-white/15 focus:border-rr-pink/60 rounded-xl px-4 py-3 text-center text-white tracking-[0.2em] uppercase placeholder:tracking-normal placeholder:normal-case placeholder:text-white/30 outline-none transition-colors mb-4"
          />
          <button
            type="submit"
            className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-3.5 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]"
          >
            Unlock
          </button>
        </motion.form>
      </div>
    );
  }

  // ── Local confirmation (preview only — no payment taken) ───────────────────
  if (localDone) {
    return (
      <div className="min-h-screen bg-rr-dark text-white font-sans flex items-center justify-center px-5 text-center">
        <div className="max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-wide mb-2">You’re set, {form.player_name.split(' ')[0]}</h1>
          <p className="text-white/55 text-sm leading-relaxed">
            On the live site this opens secure Stripe checkout for the {fmtAud(BLOCK_FEE_CENTS)} Power Pre-Season. (Payments only run on the deployed site — nothing was charged here.)
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const fieldCls = 'w-full bg-white/5 border border-white/15 focus:border-rr-pink/60 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors';
  const labelCls = 'block text-[11px] font-black uppercase tracking-widest text-white/45 mb-1.5';

  return (
    <div className="min-h-screen bg-rr-dark text-white font-sans">
      <div className="h-1 bg-gradient-rr fixed top-0 inset-x-0 z-50" />
      <UniformSizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      <div className="max-w-xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-1">Power Pre-Season</div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Re-sign up</h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-md mx-auto">
            You’re already in the Academy Elite system — no need to re-qualify. Confirm your details, choose your centre &amp; session, and secure your place for the 8-week Power Pre-Season.
          </p>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-red-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>
          </div>
        )}

        <div className="space-y-5">
          {/* Player */}
          <div>
            <label className={labelCls}>Player full name</label>
            <input type="text" value={form.player_name} onChange={(e) => set('player_name', e.target.value)} placeholder="e.g. Aarav Sharma" className={fieldCls} />
          </div>

          {/* Date of birth — Day / Month / Year (same capture as the rest of the site) */}
          <div>
            <label className={labelCls}>Date of birth</label>
            <div className="grid grid-cols-3 gap-3">
              <select value={dob.d} onChange={(e) => setDobPart('d', e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                <option value="" className="text-rr-dark">Day</option>
                {DOB_DAYS.map((d) => <option key={d} value={d} className="text-rr-dark">{d}</option>)}
              </select>
              <select value={dob.m} onChange={(e) => setDobPart('m', e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                <option value="" className="text-rr-dark">Month</option>
                {DOB_MONTHS.map(([v, l]) => <option key={v} value={v} className="text-rr-dark">{l}</option>)}
              </select>
              <select value={dob.y} onChange={(e) => setDobPart('y', e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                <option value="" className="text-rr-dark">Year</option>
                {DOB_YEARS.map((y) => <option key={y} value={y} className="text-rr-dark">{y}</option>)}
              </select>
            </div>
            {age != null && (
              <p className="text-white/35 text-[11px] mt-1.5">{age} years old{minor ? ' · under 18' : ''}</p>
            )}
          </div>

          {/* Cricket */}
          <div>
            <label className={labelCls}>Cricket</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'M', l: 'Male' }, { v: 'F', l: 'Female' }].map((g) => (
                <button
                  key={g.v}
                  type="button"
                  onClick={() => set('gender', g.v)}
                  className={`rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-wide border transition-colors ${form.gender === g.v ? 'bg-rr-pink/20 border-rr-pink text-white' : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'}`}
                >
                  {g.l}
                </button>
              ))}
            </div>
          </div>

          {minor && (
            <div>
              <label className={labelCls}>Parent / guardian name</label>
              <input type="text" value={form.parent_name} onChange={(e) => set('parent_name', e.target.value)} placeholder="Full name" className={fieldCls} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{minor ? 'Parent/guardian email' : 'Contact email'}</label>
              <input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="you@email.com" className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>{minor ? 'Parent/guardian phone' : 'Contact phone'}</label>
              <input type="tel" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} placeholder="04xx xxx xxx" className={fieldCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Suburb <span className="text-white/25 normal-case tracking-normal font-medium">(optional)</span></label>
            <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)} placeholder="e.g. Point Cook" className={fieldCls} />
          </div>

          {/* Centre + session */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-3">Choose your centre</div>
            <div className="space-y-2">
              {ACTIVE_CENTRES.map((c) => {
                const on = form.centre === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => { set('centre', c.slug); setSessionId(''); }}
                    className={`w-full text-left rounded-xl px-4 py-3 border transition-colors flex items-start gap-3 ${on ? 'bg-rr-pink/20 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-white/30'}`}
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${on ? 'text-rr-pink' : 'text-white/40'}`} />
                    <span>
                      <span className="block text-sm font-bold text-white">{c.name}</span>
                      <span className="block text-white/45 text-[12px]">{c.suburb} · {c.region}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {form.centre && (
              <div className="mt-4">
                <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-3">Choose your session</div>
                {homeIdx == null ? (
                  <p className="text-white/40 text-xs">Enter the player’s date of birth above to see age-appropriate sessions.</p>
                ) : sessions.length === 0 ? (
                  <p className="text-white/40 text-xs">No sessions match this age at this centre — please <a href="/PGP2026#contact" className="text-rr-pink hover:underline">get in touch</a> and we’ll sort it out.</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((s) => {
                      const on = sessionId === s.blockId;
                      const playUp = bandIdx(s.band) > homeIdx;
                      return (
                        <button
                          key={s.blockId}
                          type="button"
                          onClick={() => setSessionId(s.blockId)}
                          className={`w-full text-left rounded-xl px-4 py-3 border transition-colors flex items-center gap-3 ${on ? 'bg-rr-pink/20 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-white/30'}`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${on ? 'bg-rr-pink border-rr-pink' : 'border-white/30'}`}>
                            {on && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-white">{s.blockLabel}</span>
                            <span className="block text-white/45 text-[12px]">Age group {s.band}</span>
                          </span>
                          {playUp && <span className="text-[10px] font-black uppercase tracking-wider text-rr-light-pink bg-rr-pink/10 border border-rr-pink/30 rounded-full px-2 py-1">Playing up</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-white/30 text-[11px] mt-3 leading-relaxed">You only see sessions appropriate for the player’s age (or older). Your coach confirms the final squad after payment.</p>
              </div>
            )}
          </div>

          {/* Uniform */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-3">Playing uniform</div>
            <div className="flex items-start gap-3">
              <input id="needs_uniform" type="checkbox" checked={form.needs_uniform} onChange={(e) => set('needs_uniform', e.target.checked)} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
              <label htmlFor="needs_uniform" className="text-xs text-white/70 leading-relaxed cursor-pointer">
                I need a Royals playing uniform. I’ll choose my sizes and pay for it at the checkout. <span className="text-white/40">(Already have your kit? Leave this unticked.)</span>
              </label>
            </div>
            <button type="button" onClick={() => setShowSizeGuide(true)} className="mt-3 inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-[12px] font-bold uppercase tracking-wide px-3.5 py-2.5 rounded-full border border-rr-light-pink/30 hover:border-rr-light-pink/60 transition-colors">
              <Ruler className="w-3.5 h-3.5" /> View the size guide
            </button>
          </div>

          {/* Pay */}
          <div className="pt-1">
            <button
              onClick={pay}
              disabled={submitting}
              className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)] inline-flex items-center justify-center gap-2"
            >
              {submitting ? 'Processing…' : <>Pay {fmtAud(BLOCK_FEE_CENTS)} &amp; secure my spot <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-white/30 text-[11px] text-center mt-3 leading-relaxed">
              Secure payment via Stripe. Your coach will confirm your squad after payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
