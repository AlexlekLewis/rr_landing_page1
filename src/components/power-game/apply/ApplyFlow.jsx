import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, ArrowLeft, Clock, Users, Check, AlertCircle, Loader2, Ruler, Phone, Mail, MessageSquare, Telescope } from 'lucide-react';
import DateOfBirthInput from '../../DateOfBirthInput';
import { REP_GROUPS, CLUB_GROUPS, groupsForGender } from './levels';
import { CENTRES, CENTRE_BY_SLUG, squadsForPlacement, sessionWindow, SQUADS } from '../../../lib/booking/squads';
import { inventory } from '../../../lib/booking/inventory';
import { applications, applicationFromPlacement } from '../../../lib/booking/applications';
import { BLANK_FORM, validateStep, computePlacement, isMinor, calcAge, BLOCK_FEE, consentsOk, REFERRAL_CODE } from './flow';
import { fmtAud } from './kit';
import DnaRevealCard from './DnaRevealCard';
import CentreAvailabilityGrid from '../CentreAvailabilityGrid';
import { submitApplication, buildApplicationRow } from './submit';
import UniformSizeGuideModal from '../UniformSizeGuideModal';
import { TOPS_SIZES, SHORTS_SIZES, PANTS_SIZES, JACKET_SIZES, KIDS_AGE_CHART } from '../../academy-shop/sizeData';

const INPUT_STEPS = ['player'];
// Visible progress stepper — the internal steps collapse into 4 phases families
// always see. "profile" carries BOTH the player's game and their last-3-years
// cricket history in one submission, so the "Cricket" stage is a single screen.
// Branch/terminal steps (review, requestInfo, submitted, confirmed…) have no phase
// and the stepper hides for them.
const PHASES = ['Your details', 'Secure'];
const STEP_PHASE = { centre: 0, player: 0, kit: 0, secure: 1 };
// Real Stripe checkout only when explicitly enabled (test/live keys + deployed fn).
// Default: local confirm, so the funnel runs fully offline.
const LIVE_PAYMENTS = !!(import.meta?.env?.VITE_PG_LIVE_PAYMENTS === '1');
// Enquiry channels for the "Request more information" path (we promise a 72-hour response).
const ENQUIRY_EMAIL = 'eliteprogram@rramelbourne.com';
const ENQUIRY_SMS = '0421261825';
// 16px text on mobile so iOS Safari doesn't auto-zoom into the field on focus.
const inputCls = 'w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-3 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-rr-pink transition-colors';

// Readable labels for the "Is this correct?" review summary.
const levelLabel = (code) => {
  if (!code) return null;
  for (const g of [...REP_GROUPS, ...CLUB_GROUPS]) {
    const o = g.options.find((x) => x.code === code);
    if (o) return o.label;
  }
  return code;
};

const Label = ({ children }) => <span className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5">{children}</span>;
const Field = ({ label, children }) => <label className="block">{label && <Label>{label}</Label>}{children}</label>;

function Choice({ options, value, onChange, cols = 2 }) {
  return (
    <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`text-left px-4 py-3 rounded-xl border transition-all ${active ? 'bg-rr-pink/15 border-rr-pink shadow-[0_0_20px_rgba(225,31,143,0.18)]' : 'bg-white/5 border-white/15 hover:border-rr-pink/40'}`}>
            <span className={`block text-sm font-bold ${active ? 'text-white' : 'text-white/80'}`}>{o.label}</span>
            {o.sub && <span className="block text-[11px] text-white/40 mt-0.5">{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function PhaseStepper({ phase }) {
  const last = PHASES.length - 1;
  return (
    <div className="relative flex justify-between mb-8" role="group" aria-label={`Step ${phase + 1} of ${PHASES.length}: ${PHASES[phase]}`}>
      <div className="absolute top-3 left-[12.5%] right-[12.5%] h-0.5 bg-white/10" aria-hidden />
      <div className="absolute top-3 left-[12.5%] h-0.5 bg-rr-pink transition-all duration-500" style={{ width: `${(phase / last) * 75}%` }} aria-hidden />
      {PHASES.map((label, i) => {
        const done = i < phase;
        const active = i === phase;
        return (
          <div key={label} className="relative z-10 flex flex-col items-center flex-1">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black transition-colors ${active ? 'bg-rr-pink text-white ring-4 ring-rr-pink/20' : done ? 'bg-rr-pink text-white' : 'bg-rr-dark border border-white/25 text-white/40'}`}>
              {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            <span className={`mt-1.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-center leading-none ${active ? 'text-white' : done ? 'text-white/55' : 'text-white/30'}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ApplyFlow({ embedded = false, initialSession = null }) {
  const [seeded] = useState(!!initialSession); // chosen up front via the Locations picker
  const [form, setForm] = useState({ ...BLANK_FORM, ...(initialSession ? { centre: initialSession.centre } : {}) });
  const [step, setStep] = useState(initialSession ? 'player' : 'centre');
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null); // { dna, placement }
  const [selected, setSelected] = useState(initialSession || null); // chosen session
  const [hold, setHold] = useState(null); // { holdId }
  const [appId, setAppId] = useState(null); // persisted application id
  const [spotsTick, setSpotsTick] = useState(0); // force spots re-read
  const [submitting, setSubmitting] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [kitPicks, setKitPicks] = useState({ shirt: '', shorts: '', pants: '', cap: '', jacket: '' });
  const blockFeeCents = BLOCK_FEE * 100;
  const isJunior = calcAge(form.player_dob) != null && calcAge(form.player_dob) < 16;
  const sizeGroup = isJunior ? 'junior' : 'senior';
  // priceCents MUST match api/_lib/uniformPricing.js — the server charges those amounts.
  const KIT_ITEMS_UI = [
    { key: 'shirt',   label: 'Training Shirt',  priceCents: 2995, sizes: TOPS_SIZES[sizeGroup] || [] },
    { key: 'shorts',  label: 'Training Shorts', priceCents: 3500, sizes: SHORTS_SIZES[sizeGroup] || [] },
    { key: 'pants',   label: 'Training Pants',  priceCents: 3700, sizes: PANTS_SIZES[sizeGroup] || [] },
    { key: 'cap',     label: 'Cap',             priceCents: 2500, sizes: null, oneSize: true },
    { key: 'jacket',  label: 'Fleece Jacket',   priceCents: 4900, sizes: JACKET_SIZES[sizeGroup] || [], note: 'Optional — runs small, consider one size up' },
  ].filter((it) => it.oneSize || (Array.isArray(it.sizes) && it.sizes.length > 0));
  // ^ Only offer garments that actually have sizes for this age group. Juniors have no
  //   Fleece Jacket sizing (JACKET_SIZES.junior === null), so it's hidden for them. Without
  //   this, ticking the jacket dead-ended the "Continue" button — no size could ever be
  //   chosen, so kitSizesComplete stayed false and the player was trapped on the kit step.
  const setKit = (key, val) => setKitPicks(p => ({ ...p, [key]: val }));
  // Drive selection state off the OFFERED items only — an item that isn't shown for this
  // age group (e.g. the junior Fleece Jacket) can never block "Continue".
  const anyKitSelected = KIT_ITEMS_UI.some((item) => kitPicks[item.key]);
  const kitSizesComplete = anyKitSelected && KIT_ITEMS_UI.every((item) => {
    const v = kitPicks[item.key];
    if (!v) return true; // not selected — fine
    if (item.oneSize) return true; // one size — no dropdown needed
    return typeof v === 'string' && v !== '' && v !== 'pending'; // real size chosen
  });
  // Kit subtotal shown to the player; the server charges the same via uniformPricing.js.
  const kitTotalCents = KIT_ITEMS_UI.reduce((s, item) => (kitPicks[item.key] ? s + item.priceCents : s), 0);
  const totalDueCents = blockFeeCents + (form.needs_uniform ? kitTotalCents : 0);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const rootRef = useRef(null);
  // Stripe cancel returns to /PGP2026/apply?cancelled=1 — tell the family nothing
  // was charged instead of silently showing a fresh form.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get('cancelled') === '1') {
        setErrors(['Payment was cancelled — nothing was charged. Your application details were saved; go again below to pick your time and pay when you\u2019re ready.']);
      }
    } catch (_) { /* no-op */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Embedded (inline on the PGP page): keep the funnel section in view on each step.
    // Standalone route: scroll the window to top.
    if (embedded) rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // QA deep-link: /PGP2026/apply?demo=1 pre-fills the form with a chosen session so the
  // funnel can be walked form → (kit) → pay deterministically.
  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get('demo');
    if (!demo) return;
    const CONSENTED = { accept_terms: true, accept_player_code: true, accept_parent_code: true, accept_social_media: true, accept_playing_standard: true, accept_ability_standard: true };
    const demoForm = { ...BLANK_FORM, ...CONSENTED, centre: 'williamstown', player_name: 'Sam Smith', player_dob: '2002-01-01', gender: 'M', contact_phone: '0400000000', contact_email: 'sam@example.com', suburb: 'Williamstown' };
    const session = SQUADS.find((s) => s.id === 'w-sat3') || null;
    const r = computePlacement(demoForm);
    setForm(demoForm);
    setResult(r);
    setSelected(session);
    const app = applications.create(applicationFromPlacement(demoForm, r, 'auto'));
    setAppId(app.id);
    setStep('player');
  }, []);

  const repGroups = useMemo(() => groupsForGender(REP_GROUPS, form.gender), [form.gender]);
  const clubGroups = useMemo(() => groupsForGender(CLUB_GROUPS, form.gender), [form.gender]);

  const phase = STEP_PHASE[step];
  const progress = phase !== undefined ? ((phase + 1) / PHASES.length) * 100 : 100;

  function next() {
    if (INPUT_STEPS.includes(step)) {
      const errs = validateStep(step, form);
      setErrors(errs);
      if (errs.length) return;
    }
    if (step === 'player') return proceedToSecure();
  }

  // One clean form is done → build the application payload, hold the chosen session, then
  // go to uniform sizing (only if requested) or straight to the pay screen.
  async function proceedToSecure() {
    const r = computePlacement(form);
    setResult(r);
    const app = applications.create(applicationFromPlacement(form, r, 'auto'));
    setAppId(app.id);
    if (selected && !hold) {
      const ref = `${form.player_name || 'player'}-${Date.now()}`;
      const res = await inventory.createHold({ squadId: selected.id, ref });
      if (!res.ok) { setErrors(['That session just filled — please pick another time.']); return; }
      setHold({ holdId: res.holdId });
      if (app?.id) applications.update(app.id, { squadId: selected.id, bookingId: res.holdId });
    }
    setStep(form.needs_uniform ? 'kit' : 'secure');
  }

  // Step back one stage. Flow is: (centre →) player → (kit) → secure.
  function back() {
    setErrors([]);
    switch (step) {
      case 'player': return setStep('centre');
      case 'kit': return setStep('player');
      case 'secure': return setStep(form.needs_uniform ? 'kit' : 'player');
      default: return;
    }
  }

  // Non-seeded entry: a session was chosen from the in-flow centre picker → hold it and
  // go to the form. (Seeded entries arrive with `selected` already set from Locations.)
  async function pickSquad(squad) {
    if (hold) { await inventory.release(hold.holdId); setHold(null); }
    const ref = `${form.player_name || 'player'}-${Date.now()}`;
    const res = await inventory.createHold({ squadId: squad.id, ref });
    if (res.ok) {
      setSelected(squad);
      setHold({ holdId: res.holdId });
      if (appId) applications.update(appId, { squadId: squad.id, bookingId: res.holdId });
      setSpotsTick((t) => t + 1);
      setStep('player');
    } else {
      setSpotsTick((t) => t + 1); // refresh — it just filled
      setErrors(['That session just filled — please pick another time.']);
    }
  }

  function buildUniformOpts() {
    if (!form.needs_uniform) return {};
    const labels = { shirt: 'Training Shirt', shorts: 'Shorts', pants: 'Pants', cap: 'Cap', jacket: 'Fleece Jacket' };
    const parts = Object.entries(kitPicks).filter(([, v]) => v && v !== 'pending').map(([k, v]) => `${labels[k]} (${v})`);
    if (!parts.length) return {};
    return { uniformSelection: parts.join(', ') };
  }

  async function secure() {
    if (submitting) return;
    if (!consentsOk(form)) { setErrors(['Please accept the compliances above to continue.']); return; }
    setSubmitting(true);
    setErrors([]);
    try {
      if (LIVE_PAYMENTS || import.meta?.env?.PROD) {
        // Build the application payload — but DO NOT write it to the database. The
        // power_game_applications row (the "locked spot") is created ONLY after Stripe
        // confirms payment (api/power-game-webhook, with api/power-game-verify-session as
        // the success-page backstop). So an unpaid applicant never locks a spot in the DB
        // or the Google Sheet. The full payload travels in the Stripe session metadata.
        const application = buildApplicationRow(form, result.placement, selected, {
          kind: 'standard',
          centreName: CENTRE_BY_SLUG[form.centre]?.name,
          ...buildUniformOpts(),
        });
        try {
          sessionStorage.setItem('pgp_confirmation', JSON.stringify({
            playerName: form.player_name,
            centreName: CENTRE_BY_SLUG[form.centre]?.name || '',
            slot: selected ? `${selected.day} ${selected.startTime}–${selected.endTime}` : '',
            band: selected?.band || result.placement.placedBand,
          }));
        } catch (_) { /* private mode — page falls back gracefully */ }

        const r = await fetch('/api/power-game-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application,
            email: form.contact_email,
            playerName: form.player_name,
            squadId: selected?.id,
            // Selected kit → [{ key, size }]; the server prices each garment from the
            // authoritative catalog (uniformPricing.js) and charges it on top of the $989.
            uniformItems: form.needs_uniform
              ? KIT_ITEMS_UI
                  .filter((it) => kitPicks[it.key] && kitPicks[it.key] !== 'pending')
                  .map((it) => ({ key: it.key, size: kitPicks[it.key] === 'OS' ? 'One size' : kitPicks[it.key] }))
              : [],
            uniformSelection: application.uniform_selection || '',
          }),
        });
        const data = await r.json();
        if (data?.url) { window.location.href = data.url; return; }
        setErrors([data?.error || 'Could not start checkout — please try again.']);
        return;
      }
      // Preview/offline (no live-payment keys): confirm the held spot LOCALLY so the
      // funnel can be walked end-to-end. Nothing is written to the database — there is
      // no payment, so there is no locked spot.
      if (hold) await inventory.confirm(hold.holdId);
      if (appId) applications.setStatus(appId, 'booked', { squadId: selected?.id, bookingId: hold?.holdId });
      setStep('confirmed');
    } catch (_e) {
      setErrors(['Could not start your payment — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  // Apply but DON'T pay — submit full details + request a call; the spot is not held.
  async function applyWithoutPay() {
    if (submitting) return;
    if (!consentsOk(form)) { setErrors(['Please accept the compliances above to continue.']); return; }
    setSubmitting(true);
    setErrors([]);
    try {
      await submitApplication(form, result.placement, selected, { kind: 'standard', intent: 'callback', centreName: CENTRE_BY_SLUG[form.centre]?.name, ...buildUniformOpts() });
      if (hold) await inventory.release(hold.holdId);
      setStep('submitted');
    } catch (_e) {
      setErrors(['Could not submit your application — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  // Soft path — submit with consents, no payment. Three audiences:
  //  • placed player who wants a chat first → standard application + callback request
  //  • below-floor / coming-soon → capability review or venue waitlist
  async function submitReview() {
    if (submitting) return;
    if (!consentsOk(form)) { setErrors(['Please accept the compliances above to continue.']); return; }
    setSubmitting(true);
    setErrors([]);
    try {
      if (reviewIsCallback) {
        await submitApplication(form, result.placement, selected, { kind: 'standard', intent: 'callback', centreName: CENTRE_BY_SLUG[form.centre]?.name, ...buildUniformOpts() });
        if (hold) await inventory.release(hold.holdId);
        setStep('submitted');
      } else {
        await submitApplication(form, result.placement, null, { kind: 'capability', comingSoon: comingSoonVenue, centreName: CENTRE_BY_SLUG[form.centre]?.name, ...buildUniformOpts() });
        setStep('reviewed');
      }
    } catch (_e) {
      setErrors(['Could not submit — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  const sessionLabel = selected ? `${selected.day} ${selected.startTime}–${selected.endTime}` : '';
  const comingSoonVenue = !!CENTRE_BY_SLUG[form.centre]?.comingSoon;
  // The soft 'review' step serves three audiences: a below-floor coach review, a
  // coming-soon venue waitlist, and a *placed* player who'd rather talk first — that
  // last one is a callback request (qualified), not a capability review.
  const reviewIsCallback = !!(result && !result.placement.requiresReview && !comingSoonVenue);
  // eslint-disable-next-line no-unused-vars
  const _tick = spotsTick; // dependency for live spot reads below

  const consentRow = (k, label) => (
    <div className="flex items-start gap-3">
      <input id={`c_${k}`} type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
      <label htmlFor={`c_${k}`} className="text-xs text-white/70 leading-relaxed cursor-pointer">{label}</label>
    </div>
  );
  // One UI checkbox covers all mandatory agreements — the DB still records each
  // consent column individually (the box sets them together).
  const AGREEMENT_KEYS = ['accept_terms', 'accept_player_code', 'accept_parent_code', 'accept_playing_standard'];
  const agreementsChecked = AGREEMENT_KEYS.every((k) => !!form[k]);
  const setAgreements = (v) => setForm((p) => ({ ...p, accept_terms: v, accept_player_code: v, accept_parent_code: v, accept_playing_standard: v }));
  const docLink = (href, label) => <a href={href} target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">{label}</a>;
  const renderConsents = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-left">
      <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-1">Compliance &amp; permissions</div>
      <div className="flex items-start gap-3">
        <input id="c_agreements" type="checkbox" checked={agreementsChecked} onChange={(e) => setAgreements(e.target.checked)} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
        <label htmlFor="c_agreements" className="text-xs text-white/70 leading-relaxed cursor-pointer">
          I have read and agree to the {docLink('/terms-conditions', 'Terms & Conditions')}, {docLink('/privacy-policy', 'Privacy Policy')} and {docLink('/assets/RRA_Player_Code_of_Conduct.pdf', 'Player Code of Conduct')}
          {isMinor(form.player_dob) && <> and the {docLink('/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf', 'Parent/Guardian Code of Conduct')}</>}; I understand places are subject to meeting the program&apos;s minimum playing standard (squads &amp; times may change); and I confirm all information provided is accurate — false information may void my application (refund less processing fees).
        </label>
      </div>
      {consentRow('accept_social_media', <>I&apos;m happy for photos/videos featuring the player to be used on RRA Melbourne&apos;s social media &amp; marketing channels.</>)}
      {consentRow('accept_ability_standard', <>I understand the Power Game Program is for <span className="text-white font-semibold">representative-standard cricketers (VMCU level or higher)</span>. If the coaching team assesses a player isn&apos;t yet at this standard, they may be moved to a more suitable session, guided toward another Royals program, or — if I&apos;d prefer not to continue — offered a <span className="text-white font-semibold">refund of the program fee less a $50 administration fee</span>. <a href="/junior-royals" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Not there yet? Start with Junior Royals →</a></>)}
      <div className="flex items-start gap-3">
        <input id="c_needs_uniform" type="checkbox" checked={!!form.needs_uniform} onChange={(e) => { set('needs_uniform', e.target.checked); if (!e.target.checked) setKitPicks({ shirt: '', shorts: '', pants: '', cap: '', jacket: '' }); }} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
        <label htmlFor="c_needs_uniform" className="text-xs text-white/70 leading-relaxed cursor-pointer">I&apos;ll need a Royals playing uniform — I&apos;ll pick my sizes next and pay for it at the checkout.</label>
      </div>
    </div>
  );
  return (
    <div ref={rootRef} className="min-h-screen bg-rr-dark text-white font-sans scroll-mt-24">
      {/* progress bar */}
      <div className={`${embedded ? 'relative' : 'fixed'} top-0 inset-x-0 h-1 bg-white/10 z-50`}>
        <motion.div className="h-full bg-gradient-rr" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="max-w-xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center mb-6">
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-1">Power Pre-Season</div>
          <div className="text-white/40 text-xs uppercase tracking-widest">Secure your session spot</div>
        </div>

        {/* Standard disclaimer — visible on every step, before anyone pays. */}
        <div className="mb-5 rounded-xl border border-rr-pink/30 bg-rr-pink/[0.07] px-4 py-3 text-[12px] text-white/75 leading-snug">
          <span className="font-bold text-white">Power Game is a representative-standard pre-season (VMCU level or higher).</span> If a player isn&apos;t yet at this standard, our coaches may move them to a more suitable session, recommend a better-matched program, or offer a refund less a $50 admin fee if you&apos;d prefer not to continue. New to cricket or still building the basics? <a href="/junior-royals" target="_blank" rel="noreferrer" className="text-rr-pink font-bold hover:underline">Junior Royals is built for you →</a>
        </div>

        {phase !== undefined && <PhaseStepper phase={phase} />}

        {errors.length > 0 && (
          <div className="mb-5 bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-red-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>

            {/* ── CENTRE ── */}
            {step === 'centre' && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Where do you want to train?</h1>
                <p className="text-white/50 text-sm mb-6">Pick your centre — see its squads &amp; times below, and choose the one that suits you.</p>
                <div className="space-y-3">
                  {CENTRES.map((c) => {
                    const active = form.centre === c.slug;
                    return (
                      <button key={c.slug} onClick={() => set('centre', c.slug)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${active ? 'bg-rr-pink/15 border-rr-pink' : 'bg-white/5 border-white/15 hover:border-rr-pink/40'}`}>
                        <MapPin className={`w-6 h-6 ${active ? 'text-rr-pink' : 'text-rr-blue'}`} />
                        <span className="flex-1">
                          <span className="block text-lg font-black uppercase tracking-wide">{c.name}</span>
                          <span className="block text-xs text-white/50 uppercase tracking-widest">{c.suburb}</span>
                          {!c.comingSoon && (
                            <span className="block text-[11px] text-white/40 mt-1 normal-case tracking-normal">{c.address}</span>
                          )}
                        </span>
                        {c.comingSoon
                          ? <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-rr-blue bg-rr-blue/15 border border-rr-blue/30 rounded-full px-2 py-1">Coming soon</span>
                          : (active && <Check className="w-5 h-5 text-rr-pink" />)}
                      </button>
                    );
                  })}
                </div>

                {form.centre && !CENTRE_BY_SLUG[form.centre]?.comingSoon && (
                  <div className="mt-7 pt-6 border-t border-white/10">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <h2 className="text-sm font-black uppercase tracking-widest text-white">Sessions &amp; times at {CENTRE_BY_SLUG[form.centre]?.name}</h2>
                      <span className="hidden sm:block text-[11px] text-white/40 font-bold uppercase tracking-widest">Day · Time</span>
                    </div>
                    <CentreAvailabilityGrid
                      centreSlug={form.centre}
                      selectedId={selected?.id}
                      onPick={pickSquad}
                      spotsLeftFor={(id) => inventory.spotsLeft(id)}
                    />
                    <p className="text-white/35 text-[11px] mt-3">Tap a session to continue — any 12–26 player can pick any time. Prefer a different night? Tap another centre above.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── PLAYER ── */}
            {step === 'player' && (
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Your details</h1>
                {selected && (
                  <div className="rounded-xl border border-rr-pink/30 bg-rr-pink/[0.07] px-4 py-3 text-[12px] text-white/80">
                    You&apos;re applying for <span className="font-bold text-white">{CENTRE_BY_SLUG[form.centre]?.name}</span> · {selected.day} {selected.startTime}–{selected.endTime}{sessionWindow(selected.day) ? ` · ${sessionWindow(selected.day).start}–${sessionWindow(selected.day).end}` : ''}
                  </div>
                )}
                <Field label="Player's full name"><input className={inputCls} value={form.player_name} onChange={(e) => set('player_name', e.target.value)} placeholder="e.g. Sam Smith" /></Field>
                <Field label="Date of birth"><DateOfBirthInput value={form.player_dob} onChange={(v) => set('player_dob', v)} /></Field>
                <Field label="Do you play Male or Female cricket?"><Choice value={form.gender} onChange={(v) => { set('gender', v); set('rep_level', ''); set('club_level', ''); }} options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} /></Field>
                <AnimatePresence>
                  {isMinor(form.player_dob) && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <Field label="Parent / guardian name"><input className={inputCls} value={form.parent_name} onChange={(e) => set('parent_name', e.target.value)} placeholder="e.g. Jane Smith" /></Field>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Best contact mobile"><input className={inputCls} value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} placeholder="0412 345 678" /></Field>
                  <Field label="Suburb"><input className={inputCls} value={form.suburb} onChange={(e) => set('suburb', e.target.value)} placeholder="e.g. Hallam" /></Field>
                </div>
                <Field label="Best contact email"><input className={inputCls} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="jane@email.com" /></Field>

                {/* ── CRICKET (optional) — last-3-years highest level, for our coaches' context only ── */}
                <div className="pt-3 mt-1 border-t border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mt-2">Your cricket <span className="text-white/40 font-semibold normal-case tracking-normal">— optional</span></p>
                  <p className="text-white/45 text-xs mb-3 mt-0.5">Played representative or senior cricket in the last 3 years? Add it — it helps our coaches place you. It won&apos;t change your application or fee. <span className="text-white/35">Levels may be verified.</span></p>
                  <Field label="Current cricket club(s)">
                    <input className={inputCls} value={form.current_club} onChange={(e) => set('current_club', e.target.value)} placeholder="e.g. Footscray CC" />
                  </Field>
                  <div className="mt-3">
                    <Field label="Representative cricket — highest level">
                      <select className={inputCls} value={form.rep_level} onChange={(e) => set('rep_level', e.target.value)}>
                        <option value="">— none / haven&apos;t played rep —</option>
                        {repGroups.map((g) => (<optgroup key={g.label} label={g.label}>{g.options.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</optgroup>))}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Senior cricket — highest grade">
                      <select className={inputCls} value={form.club_level} onChange={(e) => set('club_level', e.target.value)}>
                        <option value="">— none / haven&apos;t played senior —</option>
                        {clubGroups.map((g) => (<optgroup key={g.label} label={g.label}>{g.options.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</optgroup>))}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* ── REFERRAL (optional) — applicant credits the coach / talent scout / player who referred them ── */}
                <div className="pt-3 mt-1 border-t border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-rr-pink mt-2">Were you referred? <span className="text-white/40 font-semibold normal-case tracking-normal">— optional</span></p>
                  <p className="text-white/45 text-xs mb-3 mt-0.5">If a Royals coach, talent scout or player referred you, add their code and name so they get the credit. It won&apos;t change your application or fee.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Referral code"><input className={inputCls} value={form.referral_code || ''} onChange={(e) => set('referral_code', e.target.value)} placeholder="e.g. ROYALS26" /></Field>
                    <Field label="Who referred you?"><input className={inputCls} value={form.referred_by_name || ''} onChange={(e) => set('referred_by_name', e.target.value)} placeholder="Their full name" /></Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Their role"><Choice cols={3} value={form.referred_by_role || ''} onChange={(v) => set('referred_by_role', v)} options={[{ value: 'coach', label: 'Coach' }, { value: 'talent_scout', label: 'Talent scout' }, { value: 'elite_player', label: 'Player' }]} /></Field>
                  </div>
                  {!!(form.referral_code || '').trim() && (
                    <p className={`text-xs mt-2 ${(form.referral_code || '').trim().toUpperCase() === REFERRAL_CODE.toUpperCase() ? 'text-emerald-400' : 'text-white/40'}`}>
                      {(form.referral_code || '').trim().toUpperCase() === REFERRAL_CODE.toUpperCase()
                        ? '✓ Code recognised — add your referrer’s name and we’ll credit them once confirmed.'
                        : 'Enter the code exactly as your referrer gave it to you.'}
                    </p>
                  )}

                  <p className="text-white/35 text-[11px] leading-snug mt-3">
                    <span className="text-white/55 font-semibold">Referral terms:</span> any reward is issued to the referring member as a <span className="text-white/55">credit toward a future RRA program</span>, once the referral is confirmed and fully paid — future programs only. Payments already made for a program are not eligible, credits are not redeemable for cash, and <span className="text-white/55">no refunds or return of money of any kind</span> apply. RRA reserves the right to refuse or withdraw any referral or credit at its sole discretion. See our {docLink('/terms-conditions', 'Terms & Conditions')}.
                  </p>
                </div>

                <div className="pt-1">{renderConsents()}</div>
              </div>
            )}

            {/* ── ROYALS UNIFORM — only reached when "I need a uniform" was ticked at the
                 Details step. Capture which items + sizes; payment happens at Stripe. ── */}
            {step === 'kit' && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-1">Your Royals uniform</h1>
                <p className="text-white/55 text-sm mb-5">
                  Every player trains in the Royals Academy uniform — a <span className="text-white">training shirt, shorts or pants, and a cap</span>. Pick the items and sizes you need; you&apos;ll pay for them at the Stripe checkout. <span className="text-white/30 text-[11px]">({isJunior ? 'Junior' : 'Senior / Adult'} sizes)</span>
                </p>

                <button type="button" onClick={() => setShowSizeGuide(true)} className="inline-flex items-center gap-1.5 text-rr-light-pink hover:text-white text-[12px] font-bold uppercase tracking-wide px-3.5 py-3 rounded-full border border-rr-light-pink/30 hover:border-rr-light-pink/60 transition-colors">
                  <Ruler className="w-3.5 h-3.5" /> View the size guide
                </button>

                <div className="space-y-3 mt-4">
                  {KIT_ITEMS_UI.map((item) => {
                    const picked = !!kitPicks[item.key];
                    const noSizes = !item.sizes || item.sizes.length === 0;
                    return (
                      <div key={item.key} className={`rounded-xl border transition-all ${picked ? 'bg-rr-pink/10 border-rr-pink/40' : 'bg-white/5 border-white/10'} p-4`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={picked}
                            onChange={(e) => setKit(item.key, e.target.checked ? (item.oneSize ? 'OS' : 'pending') : '')}
                            className="w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold text-white">{item.label}</span> <span className="text-sm font-bold text-rr-light-pink">{fmtAud(item.priceCents)}</span>
                            {item.note && <span className="block text-[11px] text-white/40 mt-0.5">{item.note}</span>}
                            {item.oneSize && picked && <span className="block text-[11px] text-white/50 mt-0.5">One size — adjustable strap</span>}
                            {picked && !item.oneSize && noSizes && <span className="block text-[11px] text-rr-pink mt-0.5">No {sizeGroup} sizes available for this item</span>}
                          </div>
                        </div>
                        {picked && !item.oneSize && !noSizes && (
                          <select
                            className={`${inputCls} mt-3`}
                            value={kitPicks[item.key] === 'pending' ? '' : kitPicks[item.key]}
                            onChange={(e) => setKit(item.key, e.target.value || 'pending')}
                          >
                            <option value="">— select size —</option>
                            {item.sizes.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>

                {anyKitSelected && (
                  <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-white/10">
                    <span className="text-xs uppercase tracking-widest text-white/50">Kit subtotal</span>
                    <span className="text-xl font-black text-white">{fmtAud(kitTotalCents)}</span>
                  </div>
                )}

                <p className="text-white/35 text-[11px] mt-4">Your kit is added to the $989 program fee and paid together at the secure Stripe checkout.</p>

                <button
                  onClick={() => setStep('secure')}
                  disabled={!kitSizesComplete}
                  className="w-full mt-7 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                  Continue →
                </button>
                {!kitSizesComplete && (
                  <p className="text-center text-[12px] text-rr-light-pink mt-3">
                    {anyKitSelected
                      ? 'Pick a size for each item you’ve ticked to continue.'
                      : 'Tick the items you need and choose a size — or go back if you don’t need a uniform.'}
                  </p>
                )}
              </div>
            )}


            {step === 'secure' && selected && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-6">Secure your spot</h1>
                <div className="bg-white/5 border border-white/15 rounded-2xl p-6 mb-6 space-y-3">
                  <SummaryRow k="Player" v={form.player_name} />
                  <SummaryRow k="Centre" v={CENTRE_BY_SLUG[form.centre]?.name} />
                  <SummaryRow k="Session" v={sessionLabel} />
                  {sessionWindow(selected.day) && (
                    <SummaryRow k="Dates" v={`${sessionWindow(selected.day).start} – ${sessionWindow(selected.day).end} · 8 weeks`} />
                  )}
                  {form.needs_uniform && anyKitSelected && (
                    <SummaryRow k="Uniform" v={Object.entries(kitPicks).filter(([,v]) => v && v !== 'pending').map(([k,v]) => `${k === 'cap' ? 'Cap' : k.charAt(0).toUpperCase() + k.slice(1)} ${v === 'OS' ? '' : v}`.trim()).join(' · ')} />
                  )}
                  <div className="border-t border-white/10 pt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-widest text-white/50">Program fee</span>
                      <span className="text-lg font-bold text-white/80">{fmtAud(blockFeeCents)}</span>
                    </div>
                    {form.needs_uniform && kitTotalCents > 0 && (
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs uppercase tracking-widest text-white/50">Royals uniform</span>
                        <span className="text-lg font-bold text-white/80">{fmtAud(kitTotalCents)}</span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-1.5 border-t border-white/10">
                      <span className="text-xs uppercase tracking-widest text-white/50">Total today</span>
                      <span className="text-3xl font-black text-white">{fmtAud(totalDueCents)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/35 text-[11px] -mt-3 mb-5">{form.needs_uniform && kitTotalCents > 0 ? 'Program fee + your selected kit, charged together at the secure Stripe checkout.' : 'Uniform (if you need it) can be added — it’s not part of this fee.'}</p>
                <button onClick={secure} disabled={submitting || !consentsOk(form)} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                  {submitting ? 'Processing…' : `Pay ${fmtAud(totalDueCents)} & secure my spot`}
                </button>
                <p className="text-white/25 text-[11px] text-center mt-3">Your spot is <span className="text-white/45 font-bold">only secured once payment is confirmed</span> — your held time is released if payment isn&apos;t completed. *Squads are subject to change &mdash; we&apos;ll work with you if changes are needed.</p>
              </div>
            )}

            {/* ── REVIEW / WAITLIST (soft path) — submit with consents, no payment ── */}
            {step === 'review' && result && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">{comingSoonVenue ? 'Register your interest' : reviewIsCallback ? 'Request a call' : 'Apply for coach review'}</h1>
                <p className="text-white/50 text-sm mb-5 max-w-sm">
                  {comingSoonVenue
                    ? `This venue's days & times are being confirmed — submit your details and we'll offer you a spot the moment it opens. No payment needed yet.`
                    : reviewIsCallback
                      ? `No rush. Submit your details and a Royals coach will call you to talk through your offer and answer any questions before you commit. No payment needed yet.`
                      : `Submit your details and a Royals coach will personally review your cricket and be in touch about the best squad for you. No payment needed yet.`}
                </p>
                <button onClick={submitReview} disabled={submitting} className="w-full bg-rr-blue hover:bg-rr-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all">
                  {submitting ? 'Submitting…' : reviewIsCallback ? 'Request my call' : 'Submit my application'}
                </button>
                <button onClick={() => setStep('requestInfo')} className="mt-4 w-full text-center text-xs text-white/45 hover:text-white/80 uppercase tracking-widest transition-colors">Just want more info first? &rarr;</button>
              </div>
            )}

            {/* ── REQUEST MORE INFO — three ways to reach us, 72-hour response ── */}
            {step === 'requestInfo' && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Want more information?</h1>
                <p className="text-white/50 text-sm mb-5 max-w-sm">No rush. Pick how you&apos;d like to hear from us — we respond to every enquiry within <span className="text-white font-bold">72 hours</span>.</p>

                {/* Email + Text are instant — no form, no consents needed. */}
                <div className="space-y-3 mb-5">
                  <a href={`mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent('Power Pre-Season enquiry')}`}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-white/5 border-white/15 hover:border-rr-pink/50 transition-all">
                    <Mail className="w-5 h-5 text-rr-pink flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-black uppercase tracking-wide text-white">Email us</span>
                      <span className="block text-[12px] text-white/55 truncate">{ENQUIRY_EMAIL}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                  </a>
                  <a href={`sms:${ENQUIRY_SMS}`}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-white/5 border-white/15 hover:border-rr-pink/50 transition-all">
                    <MessageSquare className="w-5 h-5 text-rr-pink flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-black uppercase tracking-wide text-white">Text us</span>
                      <span className="block text-[12px] text-white/55">0421 261 825</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                  </a>
                </div>

                {/* Callback — high demand, so set the 72h expectation. (Consents were captured
                    on the contact step; applyWithoutPay still guards against missing ones.) */}
                <div className="rounded-2xl border border-rr-blue/30 bg-rr-blue/[0.06] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-rr-blue flex-shrink-0" />
                    <span className="text-sm font-black uppercase tracking-wide text-white">Request a callback</span>
                  </div>
                  <p className="text-[12px] text-white/55 leading-snug mb-3">We&apos;re getting a lot of interest right now — leave it with us and a coach will call you back within 72 hours.</p>
                  <button onClick={applyWithoutPay} disabled={submitting} className="w-full bg-rr-blue hover:bg-rr-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-3.5 transition-all">
                    {submitting ? 'Submitting…' : 'Request my callback'}
                  </button>
                </div>
              </div>
            )}

            {/* ── REVIEWED / SUBMITTED — soft-path thank-you (no payment taken) ── */}
            {(step === 'reviewed' || step === 'submitted') && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-rr-blue/20 border border-rr-blue/40 flex items-center justify-center mx-auto mb-5"><Check className="w-8 h-8 text-rr-blue" /></div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-3">{step === 'submitted' ? 'Application received' : "You're in our hands"}</h1>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
                  {step === 'submitted'
                    ? `Thanks ${form.player_name?.split(' ')[0] || 'champ'} — we've got your full application. A Royals coach will call you about your spot and answer any questions. No payment was taken.`
                    : (CENTRE_BY_SLUG[form.centre]?.comingSoon
                        ? `Thanks ${form.player_name?.split(' ')[0] || 'champ'} — we've saved your details and will offer you a spot the moment this venue opens.`
                        : `Thanks ${form.player_name?.split(' ')[0] || 'champ'} — a coach will review your cricket and be in touch about the best squad for you.`)}
                </p>
              </div>
            )}

            {/* ── CONFIRMED ── */}
            {step === 'confirmed' && selected && (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-5"><Check className="w-10 h-10 text-green-400" /></motion.div>
                <h1 className="text-3xl font-black uppercase tracking-wide mb-2">You're in!</h1>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">{form.player_name?.split(' ')[0]}'s spot is locked: <span className="text-white font-bold">{selected.day} {selected.startTime}–{selected.endTime}</span> at {CENTRE_BY_SLUG[form.centre]?.name}. A confirmation email is on its way.</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* nav */}
        {INPUT_STEPS.includes(step) && (
          <div className="flex items-center gap-3 mt-8">
            {step !== 'centre' && (
              <button onClick={back} className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest px-4 py-3"><ArrowLeft className="w-4 h-4" /> Back</button>
            )}
            <button onClick={next} className="flex-1 inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back for the post-input steps — their forward action lives in the step body, so
            this lets a player return and change anything (details, time, kit) before paying. */}
        {['kit', 'secure', 'review', 'requestInfo'].includes(step) && (
          <div className="mt-6 flex justify-center">
            <button onClick={back} className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-bold uppercase tracking-widest px-4 py-2"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
          </div>
        )}
      </div>

      <UniformSizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}

const SummaryRow = ({ k, v }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-white/40 uppercase tracking-widest text-xs">{k}</span>
    <span className="font-bold text-white">{v}</span>
  </div>
);

const Fallback = ({ onOther, onReview, otherName }) => (
  <div className="bg-white/5 border border-white/15 rounded-2xl p-6 text-center">
    <p className="text-white/70 text-sm mb-5">No squads for your group run at this centre right now. We don't want to lose you — let's find a fit.</p>
    <div className="space-y-2.5">
      {otherName && <button onClick={onOther} className="w-full bg-rr-blue/20 border border-rr-blue/40 text-white font-bold uppercase tracking-widest text-xs rounded-full px-5 py-3 hover:bg-rr-blue/30">Try {otherName} instead</button>}
      <button onClick={onReview} className="w-full bg-white/10 border border-white/15 text-white font-bold uppercase tracking-widest text-xs rounded-full px-5 py-3 hover:bg-white/20">Apply via Wild Card — coach will review</button>
    </div>
  </div>
);
