// ============================================================
// ExpressSignup — the shared engine behind the two link-only express pages:
//   • ReturningSignup  (/PGP2026/returning) — players already in the Elite system
//   • AcceptedSignup   (/PGP2026/confirm)   — review/callback players we've offered a spot
//
// Both skip the qualify→place funnel: a little identity (to reconcile against the
// player's existing record), pick the centre + the age-appropriate session, optional
// kit with sizing, and straight to the same $989 create-on-payment Stripe checkout
// (api/power-game-checkout → webhook/verify-session create the paid row). The row is
// tagged with config.source so each audience is distinguishable from the public funnel.
//
// Everything page-specific (copy, source, gate code, which identity fields to show)
// comes from the `config` prop, so the money + session logic lives in ONE place.
//
// Sessions: a player only sees the day/time options for THEIR OWN age band at the
// chosen centre — exactly what the public funnel shows (squadsForPlacement). Under
// the age-based grid each slot can host several bands; play-up is a coach flag, not a
// self-select, so we never offer a band other than the player's own.
//
// Gating: a soft shared passcode (config.accessCode) with ?key= auto-unlock. Page is
// unlisted + noindex. A client-side code only deters casual link-sharing — NOT real
// access control.
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, ShieldCheck, Ruler, ArrowRight, MapPin, Clock, Check } from 'lucide-react';
import { calcAge, isMinor, BLANK_FORM } from '../apply/flow';
import { buildApplicationRow } from '../apply/submit';
import UniformSizeGuideModal from '../UniformSizeGuideModal';
import { fmtAud } from '../apply/kit';
import { squadsForPlacement, CENTRE_BY_SLUG, ACTIVE_CENTRES } from '../../../lib/booking/squads';
import { PG_BANDS, homeBandIdx, eligibleBands as eligibleBandsFor } from '../../../lib/scoring/guardrail';
import { TOPS_SIZES, SHORTS_SIZES, PANTS_SIZES, JACKET_SIZES } from '../../academy-shop/sizeData';

const LIVE_PAYMENTS = !!(import.meta?.env?.VITE_PG_LIVE_PAYMENTS === '1');
const BLOCK_FEE_CENTS = 98900; // $989 — 8-week Power Pre-Season (matches api/power-game-checkout)

// Uniform catalog — prices MUST match api/_lib/uniformPricing.js (server charges
// from there; this drives the on-page size pickers + display total). Sizes reuse
// the academy-shop size tables so they match the size guide.
const UNIFORM = [
  { key: 'shirt',  label: 'Training Shirt',  priceCents: 2995, sizes: TOPS_SIZES },
  { key: 'shorts', label: 'Training Shorts', priceCents: 3500, sizes: SHORTS_SIZES },
  { key: 'pants',  label: 'Training Pants',  priceCents: 3700, sizes: PANTS_SIZES },
  { key: 'cap',    label: 'Cap',             priceCents: 2500, oneSize: true },
  { key: 'jacket', label: 'Fleece Jacket',   priceCents: 4900, sizes: JACKET_SIZES },
];
const BLANK_KIT = { shirt: '', shorts: '', pants: '', cap: '', jacket: '' };

// Early-bird gift offers — MUST mirror api/_lib/uniformPricing.js (GIFT_OFFERS).
// A shared offer link carries ?gift=<id>; these garment keys then show as free on
// the page and are sent to the server, which is the authority that zeroes them.
const GIFT_OFFERS = { mickleham: ['shirt', 'shorts'] };
// Scholarship links — a unique per-player link carries ?s=<token>. We do NOT hardcode
// tokens here (they key a player's saved PII server-side, so they must stay off the
// public bundle). On mount we fetch /api/pgp-scholarship?token=<token>, which returns
// the discounted program price + the player's details to pre-fill ("confirm your info").
const sizeLabels = (sizes, group) => (sizes && Array.isArray(sizes[group]) ? sizes[group].map((s) => s.label) : []);

const DOB_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const DOB_MONTHS = [
  ['01', 'Jan'], ['02', 'Feb'], ['03', 'Mar'], ['04', 'Apr'], ['05', 'May'], ['06', 'Jun'],
  ['07', 'Jul'], ['08', 'Aug'], ['09', 'Sep'], ['10', 'Oct'], ['11', 'Nov'], ['12', 'Dec'],
];
const DOB_YEARS = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

const BLANK = {
  player_name: '', player_dob: '', gender: '', suburb: '', parent_name: '',
  contact_email: '', contact_phone: '', centre: '', needs_uniform: false,
};

// EVERY consent the checkout API (api/power-game-checkout) gates on. Express players
// (offered / returning) already consented in their original application, so all of
// these travel true. This MUST stay in sync with the server's consent gate — if a new
// flag is added there and omitted here, the server 403s and the player can't pay.
// (Guarded by ExpressSignup.consents.test.ts.)
export const EXPRESS_CONSENTS = {
  accept_terms: true,
  accept_player_code: true,
  accept_parent_code: true,
  accept_social_media: true,
  accept_playing_standard: true,
  accept_ability_standard: true,
};

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

export default function ExpressSignup({ config }) {
  const ACCESS_CODE = String(config.accessCode || '').trim().toUpperCase();
  const GATE_KEY = config.gateKey;
  const FIELDS = config.fields || {};
  const requireKit = !!config.requireKit; // scholarship mode: shirt + shorts are mandatory (paid)

  const [unlocked, setUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [gateError, setGateError] = useState('');

  const [form, setForm] = useState(BLANK);
  const [dob, setDob] = useState({ d: '', m: '', y: '' });
  const [kit, setKit] = useState(BLANK_KIT);
  const [sessionId, setSessionId] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [localDone, setLocalDone] = useState(false);
  const [giftOffer, setGiftOffer] = useState('');
  const [scholarship, setScholarship] = useState(null); // { token, programCents } from ?s=<token>

  // The program fee to charge/show — a valid scholarship link discounts it (kit stays full price).
  const programCents = scholarship ? scholarship.programCents : BLOCK_FEE_CENTS;
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setKitSize = (key, size) => setKit((p) => ({ ...p, [key]: size }));
  const freeKeys = giftOffer ? (GIFT_OFFERS[giftOffer] || []) : [];
  const isFreeKit = (key) => freeKeys.includes(key);
  const kitPicks = UNIFORM.filter((u) => (u.oneSize ? kit[u.key] === 'one' : !!kit[u.key]));
  const kitItems = kitPicks.map((u) => ({ key: u.key, size: u.oneSize ? 'One size' : kit[u.key] }));
  const kitTotalCents = kitPicks.reduce((s, u) => s + (isFreeKit(u.key) ? 0 : u.priceCents), 0);
  const kitSummaryText = kitPicks.map((u) => `${u.label} (${u.oneSize ? 'One size' : kit[u.key]})`).join(', ');
  const kitLines = kitPicks.map((u) => ({ name: u.label, size: u.oneSize ? 'One size' : kit[u.key], priceCents: isFreeKit(u.key) ? 0 : u.priceCents }));

  const setDobPart = (part, val) => {
    const next = { ...dob, [part]: val };
    setDob(next);
    set('player_dob', (next.d && next.m && next.y) ? `${next.y}-${next.m}-${next.d}` : '');
  };
  const minor = isMinor(form.player_dob);
  const age = calcAge(form.player_dob);
  const homeBand = age != null ? (PG_BANDS[homeBandIdx(age)]?.name || null) : null;
  // Overlap-aware bands: a 14yo is eligible for BOTH "12-14" and "14-16"; most ages get one.
  const bands = age != null ? eligibleBandsFor(age).map((b) => b.name) : [];

  // The day/time options for the player's eligible age band(s) at the chosen centre (same
  // helper the public funnel uses — keeps the two in lockstep with the grid).
  const sessions = (form.centre && bands.length)
    ? bands
        .flatMap((b) => squadsForPlacement({ centre: form.centre, band: b }))
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const selectedSession = sessions.find((s) => s.id === sessionId) || null;

  useEffect(() => {
    document.title = config.docTitle;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    // ?key=<code> auto-unlock so the link itself is the access.
    let keyOk = false;
    try {
      const k = (new URLSearchParams(window.location.search).get('key') || '').trim().toUpperCase();
      keyOk = !!k && k === ACCESS_CODE;
    } catch (_) { /* no-op */ }
    // ?gift=<id> — a shared early-bird link that gifts certain garments. Pre-tick
    // the kit box so the player just picks sizes to claim their free items.
    try {
      const g = (new URLSearchParams(window.location.search).get('gift') || '').trim().toLowerCase();
      if (GIFT_OFFERS[g]) { setGiftOffer(g); setForm((p) => ({ ...p, needs_uniform: true })); }
    } catch (_) { /* no-op */ }
    // ?s=<token> — a UNIQUE scholarship link. Fetch the discounted program price +
    // the player's saved details from the server (PII never ships in the bundle),
    // then pre-fill the form so they just confirm. All best-effort: any failure
    // leaves the player to type their details in as before.
    try {
      const s = (new URLSearchParams(window.location.search).get('s') || '').trim();
      if (s) {
        fetch(`/api/pgp-scholarship?token=${encodeURIComponent(s)}`)
          .then((r) => r.json())
          .then((d) => {
            if (!d || !d.scholarship) return;
            setScholarship({ token: s, programCents: d.programCents });
            const p = d.prefill;
            if (p) {
              setForm((prev) => ({
                ...prev,
                player_name: p.player_name || prev.player_name,
                contact_email: p.contact_email || prev.contact_email,
                centre: p.centre || prev.centre,
                player_dob: p.player_dob || prev.player_dob,
              }));
              if (typeof p.player_dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.player_dob)) {
                const [yy, mm, dd] = p.player_dob.split('-');
                setDob({ d: dd, m: mm, y: yy });
              }
            }
          })
          .catch(() => { /* no-op */ });
      }
    } catch (_) { /* no-op */ }
    // Scholarship mode: kit (shirt + shorts) is mandatory — always show the picker,
    // no opt-out. Prices are the usual full price; the scholarship discount applies
    // to the program only, via the promo code the player enters at Stripe checkout.
    if (requireKit) setForm((p) => ({ ...p, needs_uniform: true }));
    try {
      if (keyOk || sessionStorage.getItem(GATE_KEY) === '1') {
        setUnlocked(true);
        if (keyOk) sessionStorage.setItem(GATE_KEY, '1');
      }
    } catch (_) {
      if (keyOk) setUnlocked(true);
    }
    return () => { try { document.head.removeChild(meta); } catch (_) { /* no-op */ } };
  }, []);

  // Drop the selected session if it stops being valid (centre or DOB changed).
  useEffect(() => {
    if (sessionId && !sessions.some((s) => s.id === sessionId)) setSessionId('');
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
    else if (age == null || age < 5) e.push('Please check the date of birth.');
    else if (age > 26) e.push('The Power Pre-Season is for players aged 26 and under.');
    if (FIELDS.gender && !form.gender) e.push('Please select Male or Female cricket.');
    if (FIELDS.parentName && minor && !form.parent_name.trim()) e.push('Parent/guardian name is required for under-18s.');
    if (!emailOk(form.contact_email)) e.push('Please enter a valid contact email.');
    if (FIELDS.phone && !form.contact_phone.trim()) e.push('Please enter a contact phone number.');
    if (!form.centre) e.push('Please choose a centre.');
    else if (!selectedSession) e.push('Please choose a session time.');
    if (requireKit) {
      if (!kit.shirt) e.push('Please choose a training shirt size.');
      if (!kit.shorts) e.push('Please choose a training shorts size.');
    }
    return e;
  }

  function buildPayload() {
    // These players already consented (original application), so the five compliance
    // flags travel as true (the checkout API requires them server-side).
    const apForm = { ...BLANK_FORM, ...form, ...EXPRESS_CONSENTS };
    const centre = CENTRE_BY_SLUG[form.centre];
    const placement = selectedSession ? { placedBand: selectedSession.band } : null;
    const squad = selectedSession
      ? { id: selectedSession.id, day: selectedSession.day, startTime: selectedSession.startTime, endTime: selectedSession.endTime }
      : null;
    const row = buildApplicationRow(apForm, placement, squad, {
      kind: 'standard', status: 'awaiting_payment', centreName: centre?.name,
      uniformSelection: form.needs_uniform ? kitSummaryText : '',
      kitTotalCents: form.needs_uniform ? kitTotalCents : 0,
    });
    return { ...row, source: config.source, bio: config.bio };
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
      const wantsKit = form.needs_uniform && kitItems.length > 0;
      if (LIVE_PAYMENTS || import.meta?.env?.PROD) {
        try {
          sessionStorage.setItem('pgp_confirmation', JSON.stringify({
            playerName: form.player_name,
            centreName: centre?.name || '',
            slot: selectedSession ? `${selectedSession.day} ${selectedSession.startTime}–${selectedSession.endTime}` : '',
            band: selectedSession?.band || '',
            kit: wantsKit ? kitLines : [],
          }));
        } catch (_) { /* no-op */ }
        const r = await fetch('/api/power-game-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application,
            email: form.contact_email,
            playerName: form.player_name,
            squadId: selectedSession?.id,
            uniformItems: wantsKit ? kitItems : [],
            giftOffer: giftOffer || undefined,
            scholarshipToken: scholarship?.token || undefined,
            // Private link-only flow (confirm / accepted / returning) — let Stripe
            // show the "Add promotion code" box so an offered player can apply a
            // coupon. The public funnel never sends this (no code-hunting), and a
            // baked scholarship link suppresses it too (discount already applied).
            allowPromo: scholarship ? false : true,
          }),
        });
        const data = await r.json().catch(() => null);
        if (data?.url) { window.location.href = data.url; return; }
        setErrors([data?.error || 'Could not start checkout — please try again.']);
        return;
      }
      setLocalDone(true);
    } catch (_) {
      setErrors(['Could not start your payment — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldCls = 'w-full bg-white/5 border border-white/15 focus:border-rr-pink/60 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors';
  const labelCls = 'block text-[11px] font-black uppercase tracking-widest text-white/45 mb-1.5';

  // ── Passcode gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-rr-dark text-white font-sans flex items-center justify-center px-5">
        <div className="h-1 bg-gradient-rr fixed top-0 inset-x-0" />
        <motion.form onSubmit={submitGate} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-sm bg-white/[0.04] border border-white/10 rounded-2xl p-7 text-center">
          <div className="w-14 h-14 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-rr-pink" />
          </div>
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-[11px] mb-1">Power Pre-Season</div>
          <h1 className="text-xl font-black uppercase tracking-wide mb-2">{config.gateTitle}</h1>
          <p className="text-white/55 text-sm leading-relaxed mb-5">{config.gateBlurb}</p>
          {gateError && (
            <div className="mb-4 bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2.5 text-red-200 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{gateError}</span>
            </div>
          )}
          <input type="text" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Access code" autoFocus
            className="w-full bg-white/5 border border-white/15 focus:border-rr-pink/60 rounded-xl px-4 py-3 text-center text-white tracking-[0.2em] uppercase placeholder:tracking-normal placeholder:normal-case placeholder:text-white/30 outline-none transition-colors mb-4" />
          <button type="submit" className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-3.5 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
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
            On the live site this opens secure Stripe checkout for the {fmtAud(programCents + (form.needs_uniform ? kitTotalCents : 0))} total. (Payments only run on the deployed site — nothing was charged here.)
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-rr-dark text-white font-sans">
      <div className="h-1 bg-gradient-rr fixed top-0 inset-x-0 z-50" />
      <UniformSizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      <div className="max-w-xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-1">Power Pre-Season</div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">{config.headerTitle}</h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-md mx-auto">{config.headerLead}</p>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-red-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>
          </div>
        )}

        <div className="space-y-5">
          {/* Player name */}
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
            {age != null && <p className="text-white/35 text-[11px] mt-1.5">{age} years old{minor ? ' · under 18' : ''}</p>}
          </div>

          {/* Cricket (optional per config) */}
          {FIELDS.gender && (
            <div>
              <label className={labelCls}>Cricket</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ v: 'M', l: 'Male' }, { v: 'F', l: 'Female' }].map((g) => (
                  <button key={g.v} type="button" onClick={() => set('gender', g.v)}
                    className={`rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-wide border transition-colors ${form.gender === g.v ? 'bg-rr-pink/20 border-rr-pink text-white' : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'}`}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {FIELDS.parentName && minor && (
            <div>
              <label className={labelCls}>Parent / guardian name</label>
              <input type="text" value={form.parent_name} onChange={(e) => set('parent_name', e.target.value)} placeholder="Full name" className={fieldCls} />
            </div>
          )}

          {/* Contact — email always; phone optional per config */}
          <div className={FIELDS.phone ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
            <div>
              <label className={labelCls}>{minor ? 'Parent/guardian email' : 'Contact email'}</label>
              <input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="you@email.com" className={fieldCls} />
            </div>
            {FIELDS.phone && (
              <div>
                <label className={labelCls}>{minor ? 'Parent/guardian phone' : 'Contact phone'}</label>
                <input type="tel" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} placeholder="04xx xxx xxx" className={fieldCls} />
              </div>
            )}
          </div>

          {FIELDS.suburb && (
            <div>
              <label className={labelCls}>Suburb <span className="text-white/25 normal-case tracking-normal font-medium">(optional)</span></label>
              <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)} placeholder="e.g. Point Cook" className={fieldCls} />
            </div>
          )}

          {/* Centre + session */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-3">Choose your centre</div>
            <div className="space-y-2">
              {ACTIVE_CENTRES.map((c) => {
                const on = form.centre === c.slug;
                return (
                  <button key={c.slug} type="button" onClick={() => { set('centre', c.slug); setSessionId(''); }}
                    className={`w-full text-left rounded-xl px-4 py-3 border transition-colors flex items-start gap-3 ${on ? 'bg-rr-pink/20 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
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
                {!homeBand ? (
                  <p className="text-white/40 text-xs">Enter the player’s date of birth above to see their session times.</p>
                ) : sessions.length === 0 ? (
                  <p className="text-white/40 text-xs">No sessions for this age at this centre yet — please <a href="/PGP2026#contact" className="text-rr-pink hover:underline">get in touch</a> and we’ll sort it out.</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((s) => {
                      const on = sessionId === s.id;
                      return (
                        <button key={s.id} type="button" onClick={() => setSessionId(s.id)}
                          className={`w-full text-left rounded-xl px-4 py-3 border transition-colors flex items-center gap-3 ${on ? 'bg-rr-pink/20 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-white/30'}`}>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${on ? 'bg-rr-pink border-rr-pink' : 'border-white/30'}`}>
                            {on && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-white">{s.blockLabel}</span>
                            <span className="block text-white/45 text-[12px]">Age group {s.band === '17+' ? '17–26' : s.band}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-white/30 text-[11px] mt-3 leading-relaxed">{config.sessionNote}</p>
              </div>
            )}
          </div>

          {/* Uniform */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-3">Playing uniform</div>
            {giftOffer && (
              <div className="mb-3 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2 text-[12px] text-green-200 leading-relaxed">
                Your early-bird offer includes a <span className="font-bold">free shirt + shorts</span>. Pick your sizes below and they’re added at no charge. Anything extra you need is added at the usual price.
              </div>
            )}
            {requireKit ? (
              <p className="text-xs text-white/70 leading-relaxed">
                Your scholarship covers 50% of the program fee. Your shirt &amp; shorts are part of your playing kit — <span className="text-white font-semibold">choose your sizes below</span> (added at the usual price).
              </p>
            ) : (
              <div className="flex items-start gap-3">
                <input id="needs_uniform" type="checkbox" checked={form.needs_uniform} onChange={(e) => { set('needs_uniform', e.target.checked); if (!e.target.checked) setKit(BLANK_KIT); }} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
                <label htmlFor="needs_uniform" className="text-xs text-white/70 leading-relaxed cursor-pointer">
                  I need Royals playing kit. <span className="text-white/40">(Already have your kit? Leave this unticked.)</span>
                </label>
              </div>
            )}

            {form.needs_uniform && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-white/55 text-xs leading-relaxed">Let’s confirm your sizing — pick a size for each item you need and we’ll add it to your payment.</p>
                  <button type="button" onClick={() => setShowSizeGuide(true)} className="flex-shrink-0 inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-[11px] font-bold uppercase tracking-wide px-3 py-2 rounded-full border border-rr-light-pink/30 hover:border-rr-light-pink/60 transition-colors">
                    <Ruler className="w-3.5 h-3.5" /> Size guide
                  </button>
                </div>

                {UNIFORM.map((u) => (
                  <div key={u.key} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-white truncate">{u.label}</span>
                      <span className="block text-[11px]">
                        {isFreeKit(u.key)
                          ? <span className="text-green-300 font-bold">Free · early-bird gift</span>
                          : <span className="text-white/40">{fmtAud(u.priceCents)}</span>}
                        <span className="text-white/40">{u.oneSize ? ' · one size' : ''}</span>
                      </span>
                    </div>
                    {u.oneSize ? (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={kit[u.key] === 'one'} onChange={(e) => setKitSize(u.key, e.target.checked ? 'one' : '')} className="w-4 h-4 accent-rr-pink cursor-pointer" />
                        <span className="text-white/60 text-xs">Add</span>
                      </label>
                    ) : (
                      <select value={kit[u.key]} onChange={(e) => setKitSize(u.key, e.target.value)} className="w-36 flex-none bg-white/5 border border-white/15 focus:border-rr-pink/60 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors appearance-none cursor-pointer">
                        <option value="" className="text-rr-dark">{(isFreeKit(u.key) || (requireKit && (u.key === 'shirt' || u.key === 'shorts'))) ? 'Select size' : 'Not needed'}</option>
                        {sizeLabels(u.sizes, 'junior').length > 0 && (
                          <optgroup label="Junior">
                            {sizeLabels(u.sizes, 'junior').map((s) => <option key={`j-${s}`} value={s} className="text-rr-dark">{s}</option>)}
                          </optgroup>
                        )}
                        {sizeLabels(u.sizes, 'senior').length > 0 && (
                          <optgroup label="Senior">
                            {sizeLabels(u.sizes, 'senior').map((s) => <option key={`s-${s}`} value={s} className="text-rr-dark">{s}</option>)}
                          </optgroup>
                        )}
                      </select>
                    )}
                  </div>
                ))}

                {kitTotalCents > 0 && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                    <span className="text-white/55">Kit subtotal</span>
                    <span className="font-black text-white">{fmtAud(kitTotalCents)}</span>
                  </div>
                )}
                <p className="text-white/30 text-[11px] leading-relaxed">We’ll double-check sizing with you before anything is made.</p>
              </div>
            )}
          </div>

          {/* Pay */}
          <div className="pt-1">
            <button onClick={pay} disabled={submitting}
              className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)] inline-flex items-center justify-center gap-2">
              {submitting ? 'Processing…' : <>Pay {fmtAud(programCents + (form.needs_uniform ? kitTotalCents : 0))} &amp; secure my spot <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-white/30 text-[11px] text-center mt-3 leading-relaxed">
              Secure payment via Stripe{form.needs_uniform && kitTotalCents > 0 ? <> — {fmtAud(programCents)} program + {fmtAud(kitTotalCents)} kit</> : ''}. Your coach will confirm your squad after payment.
            </p>
            {scholarship && (
              <p className="text-rr-light-pink/80 text-[11px] text-center mt-2 leading-relaxed">
                Your 50% program scholarship is already applied above — nothing to enter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
