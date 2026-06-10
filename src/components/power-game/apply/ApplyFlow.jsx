import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, ArrowLeft, Clock, Users, Check, AlertCircle, Loader2 } from 'lucide-react';
import DateOfBirthInput from '../../DateOfBirthInput';
import { REP_GROUPS, CLUB_GROUPS, groupsForGender } from './levels';
import { CENTRES, CENTRE_BY_SLUG, squadsForPlacement } from '../../../lib/booking/squads';
import { inventory } from '../../../lib/booking/inventory';
import { applications, applicationFromPlacement } from '../../../lib/booking/applications';
import { BLANK_FORM, validateStep, computePlacement, isMinor, BLOCK_FEE, secondaryOptions, consentsOk } from './flow';
import DnaRevealCard from './DnaRevealCard';
import { submitApplication } from './submit';

const INPUT_STEPS = ['centre', 'player', 'profile', 'history'];
// Real Stripe checkout only when explicitly enabled (test/live keys + deployed fn).
// Default: local confirm, so the funnel runs fully offline.
const LIVE_PAYMENTS = !!(import.meta?.env?.VITE_PG_LIVE_PAYMENTS === '1');
const inputCls = 'w-full bg-white/5 border border-white/15 rounded-lg px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rr-pink transition-colors';

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

export default function ApplyFlow({ embedded = false }) {
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [step, setStep] = useState('centre');
  const [errors, setErrors] = useState([]);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState(null); // { dna, placement }
  const [selected, setSelected] = useState(null); // squad
  const [hold, setHold] = useState(null); // { holdId }
  const [appId, setAppId] = useState(null); // persisted application id
  const [spotsTick, setSpotsTick] = useState(0); // force spots re-read
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const rootRef = useRef(null);
  useEffect(() => {
    // Embedded (inline on the PGP page): keep the funnel section in view on each step.
    // Standalone route: scroll the window to top.
    if (embedded) rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // QA deep-link: /PGP2026/apply?demo=perf|review|soldout jumps to the reveal with a sample case.
  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get('demo');
    if (!demo) return;
    if (demo === 'history') {
      setForm({ ...BLANK_FORM, centre: 'williamstown', player_name: 'Sam Smith', player_dob: '2012-01-01', gender: 'M', parent_name: 'Parent Name', contact_phone: '0400000000', contact_email: 's@e.com', suburb: 'Williamstown', skill: 'batting', batting_hand: 'right' });
      setStep('history');
      return;
    }
    const PERF = { ...BLANK_FORM, centre: 'williamstown', player_name: 'Sam Smith', player_dob: '2012-01-01', gender: 'M', contact_phone: '0400000000', contact_email: 'sam@example.com', suburb: 'Williamstown', skill: 'batting', batting_hand: 'right', rep_level: 'P16M', format: 't20', rep_games: '10', rep_bat_avg: '38', rep_bat_runs: '420' };
    const REVIEW = { ...BLANK_FORM, centre: 'williamstown', player_name: 'Alex Young', player_dob: '2011-01-01', gender: 'M', contact_phone: '0400000000', contact_email: 'alex@example.com', suburb: 'Williamstown', skill: 'batting', batting_hand: 'right', club_level: 'CS-2T', format: 'od', club_games: '8', club_bat_avg: '22', club_bat_runs: '160' };
    const demoForm = demo === 'review' ? REVIEW : PERF;
    if (demo === 'soldout') {
      (async () => { for (const id of ['w-fri-perf-1416', 'w-sat4-perf-1416']) for (let i = 0; i < 12; i++) await inventory.createHold({ squadId: id, ref: `seed-${id}-${i}` }); })();
    }
    const r = computePlacement(demoForm);
    setForm(demoForm);
    setResult(r);
    const app = applications.create(applicationFromPlacement(demoForm, r, r.placement.requiresReview ? 'review' : 'auto'));
    setAppId(app.id);
    setStep('reveal');
  }, []);

  const repGroups = useMemo(() => groupsForGender(REP_GROUPS, form.gender), [form.gender]);
  const clubGroups = useMemo(() => groupsForGender(CLUB_GROUPS, form.gender), [form.gender]);

  const idx = INPUT_STEPS.indexOf(step);
  const progress = idx >= 0 ? (idx / INPUT_STEPS.length) * 100 : step === 'centre' ? 0 : 100;

  function next() {
    if (INPUT_STEPS.includes(step)) {
      const errs = validateStep(step, form);
      setErrors(errs);
      if (errs.length) return;
    }
    if (step === 'centre') return setStep('player');
    if (step === 'player') return setStep('profile');
    if (step === 'profile') return setStep('history');
    if (step === 'history') {
      // run the engine, persist the application, show the analysing beat, then reveal
      const r = computePlacement(form);
      setResult(r);
      const app = applications.create(applicationFromPlacement(form, r, r.placement.requiresReview ? 'review' : 'auto'));
      setAppId(app.id);
      setAnalysing(true);
      setStep('reveal');
      setTimeout(() => setAnalysing(false), 1600);
      return;
    }
  }
  function back() {
    setErrors([]);
    const order = ['centre', 'player', 'profile', 'history'];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
    else if (step === 'slot') setStep('reveal');
    else if (step === 'secure') setStep('slot');
  }

  function afterReveal() {
    // A coming-soon venue has no squads to book → capture interest (review path).
    const comingSoon = CENTRE_BY_SLUG[form.centre]?.comingSoon;
    if (result.placement.requiresReview || comingSoon) setStep('review');
    else setStep('slot');
  }

  async function pickSquad(squad) {
    const ref = `${form.player_name || 'player'}-${Date.now()}`;
    const res = await inventory.createHold({ squadId: squad.id, ref });
    if (res.ok) {
      setSelected(squad);
      setHold({ holdId: res.holdId });
      if (appId) applications.update(appId, { squadId: squad.id, bookingId: res.holdId });
      setSpotsTick((t) => t + 1);
      setStep('secure');
    } else {
      setSpotsTick((t) => t + 1); // refresh — it just filled
      setErrors(['That spot just filled — please pick another time.']);
    }
  }

  async function secure() {
    if (submitting) return;
    setSubmitting(true);
    setErrors([]);
    try {
      // Phase B: persist the real application into power_game_applications (the
      // canonical table the portal ingests). The id is generated client-side so we
      // can link it into checkout without needing SELECT (anon is insert-only).
      const { id } = await submitApplication(form, result.placement, selected, {
        kind: 'standard',
        centreName: CENTRE_BY_SLUG[form.centre]?.name,
      });
      // Live path: Stripe Checkout, then the webhook flips this row to paid.
      // Enabled via VITE_PG_LIVE_PAYMENTS=1 + STRIPE keys.
      if (LIVE_PAYMENTS) {
        const r = await fetch('/api/power-game-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: id, bookingId: hold?.holdId, squadId: selected?.id, email: form.contact_email, playerName: form.player_name }),
        });
        const data = await r.json();
        if (data?.url) { window.location.href = data.url; return; }
        setErrors([data?.error || 'Could not start checkout — please try again.']);
        return;
      }
      // No live-payment keys yet (preview): the application is captured; confirm locally.
      if (hold) await inventory.confirm(hold.holdId);
      if (appId) applications.setStatus(appId, 'booked', { squadId: selected?.id, bookingId: hold?.holdId });
      setStep('confirmed');
    } catch (_e) {
      setErrors(['Could not save your application — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  // Apply but DON'T pay — submit full details + request a call; the spot is not held.
  async function applyWithoutPay() {
    if (submitting) return;
    setSubmitting(true);
    setErrors([]);
    try {
      await submitApplication(form, result.placement, selected, { kind: 'standard', intent: 'callback', centreName: CENTRE_BY_SLUG[form.centre]?.name });
      if (hold) await inventory.release(hold.holdId); // not securing — free the spot back up
      setStep('submitted');
    } catch (_e) {
      setErrors(['Could not submit your application — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  // Soft path (below-floor review or coming-soon venue) — submit with consents, no payment.
  async function submitReview() {
    if (submitting) return;
    setSubmitting(true);
    setErrors([]);
    try {
      await submitApplication(form, result.placement, null, { kind: 'capability', comingSoon: !!CENTRE_BY_SLUG[form.centre]?.comingSoon, centreName: CENTRE_BY_SLUG[form.centre]?.name });
      setStep('reviewed');
    } catch (_e) {
      setErrors(['Could not submit — please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  const matchingSquads = result && !result.placement.requiresReview
    ? squadsForPlacement({ centre: form.centre, band: result.placement.placedBand, stream: result.placement.stream })
    : [];
  // eslint-disable-next-line no-unused-vars
  const _tick = spotsTick; // dependency for live spot reads below

  const statField = (key, label, ph) => (
    <Field label={label}><input type="number" className={inputCls} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={ph} /></Field>
  );
  const consentRow = (k, label) => (
    <div className="flex items-start gap-3">
      <input id={`c_${k}`} type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 w-4 h-4 accent-rr-pink flex-shrink-0 cursor-pointer" />
      <label htmlFor={`c_${k}`} className="text-xs text-white/70 leading-relaxed cursor-pointer">{label}</label>
    </div>
  );
  const renderConsents = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-left">
      <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink mb-1">Compliance &amp; permissions</div>
      {consentRow('accept_playing_standard', <>I understand places are subject to meeting the program&apos;s minimum playing standard, and squads/times are subject to change.</>)}
      {consentRow('accept_terms', <>I have read and agree to the <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Privacy Policy</a>, and confirm all information provided is accurate.</>)}
      {consentRow('accept_player_code', <>I have read, understood and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Player Code of Conduct</a>.</>)}
      {isMinor(form.player_dob) && consentRow('accept_parent_code', <>I have read, understood and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.</>)}
      {consentRow('accept_social_media', <>I&apos;m happy for photos/videos featuring the player to be used on RRA Melbourne&apos;s social media &amp; marketing channels.</>)}
      <div className="border-t border-white/10 pt-3">
        {consentRow('needs_uniform', <>I&apos;d like to order a Power Game playing uniform (a coach will confirm sizing &amp; details).</>)}
      </div>
    </div>
  );
  const levelStats = (prefix, title) => {
    const bats = form.skill === 'batting' || form.skill === 'all_rounder';
    const bowls = form.skill === 'bowling' || form.skill === 'all_rounder';
    const keeps = form.skill === 'wicketkeeper';
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-rr-pink">{title}</div>
        <div className="grid grid-cols-2 gap-3">
          {statField(`${prefix}_games`, 'Games', 'e.g. 12')}
          {bats && statField(`${prefix}_bat_avg`, 'Batting average', 'e.g. 32')}
          {bats && statField(`${prefix}_bat_runs`, 'Total runs', 'e.g. 420')}
          {bowls && statField(`${prefix}_bowl_avg`, 'Bowling average', 'e.g. 22')}
          {bowls && statField(`${prefix}_bowl_wkts`, 'Total wickets', 'e.g. 18')}
          {keeps && statField(`${prefix}_catches`, 'Catches', 'e.g. 14')}
          {keeps && statField(`${prefix}_stumpings`, 'Stumpings', 'e.g. 6')}
        </div>
      </div>
    );
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-rr-dark text-white font-sans scroll-mt-24">
      {/* progress bar */}
      <div className={`${embedded ? 'relative' : 'fixed'} top-0 inset-x-0 h-1 bg-white/10 z-50`}>
        <motion.div className="h-full bg-gradient-rr" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="max-w-xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-1">The Power Game Program</div>
          <div className="text-white/40 text-xs uppercase tracking-widest">Secure your squad spot</div>
        </div>

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
                <p className="text-white/50 text-sm mb-6">Pick your centre — we'll show the squads &amp; times that fit you once we know your cricket.</p>
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
                        </span>
                        {c.comingSoon
                          ? <span className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-rr-blue bg-rr-blue/15 border border-rr-blue/30 rounded-full px-2 py-1">Coming soon</span>
                          : (active && <Check className="w-5 h-5 text-rr-pink" />)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PLAYER ── */}
            {step === 'player' && (
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Player details</h1>
                <Field label="Player's full name"><input className={inputCls} value={form.player_name} onChange={(e) => set('player_name', e.target.value)} placeholder="e.g. Sam Smith" /></Field>
                <Field label="Date of birth"><DateOfBirthInput value={form.player_dob} onChange={(v) => set('player_dob', v)} /></Field>
                <Field label="Gender"><Choice value={form.gender} onChange={(v) => { set('gender', v); set('rep_level', ''); set('club_level', ''); }} options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} /></Field>
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
              </div>
            )}

            {/* ── PROFILE ── */}
            {step === 'profile' && (
              <div className="space-y-5">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">Your game</h1>
                <Field label="Main skill"><Choice cols={2} value={form.skill} onChange={(v) => { set('skill', v); set('secondary_skill', ''); }}
                  options={[{ value: 'batting', label: 'Batter' }, { value: 'bowling', label: 'Bowler' }, { value: 'all_rounder', label: 'All-rounder' }, { value: 'wicketkeeper', label: 'Wicketkeeper' }]} /></Field>
                {(form.skill === 'batting' || form.skill === 'all_rounder' || form.skill === 'wicketkeeper') && (
                  <Field label="Batting hand"><Choice value={form.batting_hand} onChange={(v) => set('batting_hand', v)} options={[{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }]} /></Field>
                )}
                {(form.skill === 'bowling' || form.skill === 'all_rounder') && (
                  <Field label="Bowling type"><Choice cols={3} value={form.bowling_type} onChange={(v) => set('bowling_type', v)} options={[{ value: 'pace', label: 'Pace / Seam' }, { value: 'leg_spin', label: 'Leg spin' }, { value: 'off_spin', label: 'Off spin' }]} /></Field>
                )}
                {form.skill && (
                  <Field label="Secondary skill (optional)"><Choice cols={3} value={form.secondary_skill} onChange={(v) => { set('secondary_skill', v); if (v !== 'bowling') set('secondary_bowling_type', ''); }} options={secondaryOptions(form.skill)} /></Field>
                )}
                {form.secondary_skill === 'bowling' && (
                  <Field label="Secondary bowling type"><Choice cols={3} value={form.secondary_bowling_type} onChange={(v) => set('secondary_bowling_type', v)} options={[{ value: 'pace', label: 'Pace / Seam' }, { value: 'leg_spin', label: 'Leg spin' }, { value: 'off_spin', label: 'Off spin' }]} /></Field>
                )}
              </div>
            )}

            {/* ── HISTORY ── */}
            {step === 'history' && (
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-1">Your last two seasons</h1>
                <p className="text-white/50 text-sm mb-3">Tell us the highest level you've played and your numbers there — it's how we place you.</p>
                <Field label="Highest representative level (primary)">
                  <select className={inputCls} value={form.rep_level} onChange={(e) => set('rep_level', e.target.value)}>
                    <option value="">— none / haven't played rep —</option>
                    {repGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>{g.options.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</optgroup>
                    ))}
                  </select>
                </Field>
                <Field label="Highest club grade (optional)">
                  <select className={inputCls} value={form.club_level} onChange={(e) => set('club_level', e.target.value)}>
                    <option value="">— none / below 2nd grade —</option>
                    {clubGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>{g.options.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</optgroup>
                    ))}
                  </select>
                </Field>
                <p className="text-white/40 text-xs -mt-1">We place you on your <span className="text-rr-pink font-bold">representative</span> level — club grade adds context. Rep floor is VMCU; club is 2nd grade &amp; up.</p>
                <Field label="Format you mostly played"><select className={inputCls} value={form.format} onChange={(e) => set('format', e.target.value)}>
                  <option value="">— select —</option><option value="t20">T20</option><option value="od">One-day</option><option value="multiday">Two/Multi-day</option>
                </select></Field>
                {form.rep_level && levelStats('rep', 'Your representative-level numbers')}
                {form.club_level && levelStats('club', 'Your club-level numbers')}
              </div>
            )}

            {/* ── REVEAL ── */}
            {step === 'reveal' && (
              <div>
                {analysing ? (
                  <div className="text-center py-16">
                    <Loader2 className="w-10 h-10 text-rr-pink animate-spin mx-auto mb-5" />
                    <div className="text-lg font-black uppercase tracking-widest text-white">Analysing your cricket…</div>
                    <div className="text-white/40 text-sm mt-2">Matching you to the right squad</div>
                  </div>
                ) : (
                  <DnaRevealCard dna={result.dna} placement={result.placement} centreName={CENTRE_BY_SLUG[form.centre]?.name} onContinue={afterReveal} />
                )}
              </div>
            )}

            {/* ── SLOT ── */}
            {step === 'slot' && result && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-1">Choose your time</h1>
                <p className="text-white/50 text-sm mb-6">{result.placement.stream === 'performance' ? 'Performance' : 'Pathway'} · {result.placement.placedBand} · {CENTRE_BY_SLUG[form.centre]?.name}</p>
                {matchingSquads.length === 0 ? (
                  <Fallback onOther={() => { const other = CENTRES.find((c) => c.slug !== form.centre); if (other) { set('centre', other.slug); } setStep('slot'); }}
                    onReview={() => setStep('review')} otherName={CENTRES.find((c) => c.slug !== form.centre)?.name} />
                ) : (
                  <div className="space-y-3">
                    {matchingSquads.map((sq) => {
                      const left = inventory.spotsLeft(sq.id);
                      const full = left <= 0;
                      return (
                        <button key={sq.id} data-testid={`slot-${sq.id}`} disabled={full} onClick={() => pickSquad(sq)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${full ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed' : 'bg-white/5 border-white/15 hover:border-rr-pink active:scale-[0.99]'}`}>
                          <Clock className="w-5 h-5 text-rr-pink flex-shrink-0" />
                          <span className="flex-1">
                            <span className="block text-base font-black uppercase tracking-wide">{sq.day} · {sq.startTime}–{sq.endTime}</span>
                            <span className="block text-xs text-white/40 uppercase tracking-widest">{sq.blockLabel}</span>
                          </span>
                          <span className={`text-xs font-black uppercase tracking-widest ${full ? 'text-white/40' : left <= 3 ? 'text-rr-pink' : 'text-green-400'}`}>
                            {full ? 'Full' : `${left} left`}
                          </span>
                        </button>
                      );
                    })}
                    <button onClick={() => setStep('review')} className="w-full text-center text-xs text-white/40 hover:text-white/70 uppercase tracking-widest pt-2">None of these times work →</button>
                  </div>
                )}
              </div>
            )}

            {/* ── SECURE ── */}
            {step === 'secure' && selected && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-6">Secure your spot</h1>
                <div className="bg-white/5 border border-white/15 rounded-2xl p-6 mb-6 space-y-3">
                  <SummaryRow k="Player" v={form.player_name} />
                  <SummaryRow k="Squad" v={`${result.placement.stream === 'performance' ? 'Performance' : 'Pathway'} · ${result.placement.placedBand}`} />
                  <SummaryRow k="Centre" v={CENTRE_BY_SLUG[form.centre]?.name} />
                  <SummaryRow k="Time" v={`${selected.day} ${selected.startTime}–${selected.endTime}`} />
                  <SummaryRow k="Block" v="8-week Power Game block" />
                  <div className="border-t border-white/10 pt-3 flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-widest text-white/50">Total</span>
                    <span className="text-3xl font-black text-white">${BLOCK_FEE}</span>
                  </div>
                </div>
                <div className="mb-5">{renderConsents()}</div>
                <button onClick={secure} disabled={submitting || !consentsOk(form)} className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]">
                  {submitting ? 'Processing…' : `Pay $${BLOCK_FEE} & secure my spot`}
                </button>
                <button onClick={applyWithoutPay} disabled={submitting || !consentsOk(form)} className="w-full mt-3 bg-transparent border border-white/20 hover:border-white/40 disabled:opacity-40 disabled:cursor-not-allowed text-white/80 font-bold uppercase tracking-widest text-[11px] rounded-full px-6 py-3.5 transition-all">
                  Apply without paying — request a call first
                </button>
                {!consentsOk(form) && <p className="text-white/40 text-[11px] text-center mt-3">Please accept the compliances above to continue.</p>}
                <p className="text-white/30 text-[10px] uppercase tracking-widest text-center mt-3">Paying holds your spot for the block · applying without paying does not secure a spot · groups subject to change</p>
              </div>
            )}

            {/* ── REVIEW / WAITLIST (soft path) — submit with consents, no payment ── */}
            {step === 'review' && result && (
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-2">{CENTRE_BY_SLUG[form.centre]?.comingSoon ? 'Register your interest' : 'Apply for coach review'}</h1>
                <p className="text-white/50 text-sm mb-5 max-w-sm">
                  {CENTRE_BY_SLUG[form.centre]?.comingSoon
                    ? `This venue's days & times are being confirmed — submit your details and we'll offer you a spot the moment it opens. No payment needed yet.`
                    : `Submit your details and a Power Game coach will personally review your cricket and be in touch about the best squad for you. No payment needed yet.`}
                </p>
                <div className="mb-5">{renderConsents()}</div>
                <button onClick={submitReview} disabled={submitting || !consentsOk(form)} className="w-full bg-rr-blue hover:bg-rr-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-4 transition-all">
                  {submitting ? 'Submitting…' : 'Submit my application'}
                </button>
                {!consentsOk(form) && <p className="text-white/40 text-[11px] text-center mt-3">Please accept the compliances above to continue.</p>}
              </div>
            )}

            {/* ── REVIEWED / SUBMITTED — soft-path thank-you (no payment taken) ── */}
            {(step === 'reviewed' || step === 'submitted') && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-rr-blue/20 border border-rr-blue/40 flex items-center justify-center mx-auto mb-5"><Check className="w-8 h-8 text-rr-blue" /></div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-3">{step === 'submitted' ? 'Application received' : "You're in our hands"}</h1>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
                  {step === 'submitted'
                    ? `Thanks ${form.player_name?.split(' ')[0] || 'champ'} — we've got your full application. A Power Game coach will call you about your spot and answer any questions. No payment was taken.`
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
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">{form.player_name?.split(' ')[0]}'s spot is locked: <span className="text-white font-bold">{result.placement.stream === 'performance' ? 'Performance' : 'Pathway'} · {result.placement.placedBand}</span>, {selected.day} {selected.startTime}–{selected.endTime} at {CENTRE_BY_SLUG[form.centre]?.name}. A confirmation email is on its way.</p>
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
      </div>
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
      <button onClick={onReview} className="w-full bg-white/10 border border-white/15 text-white font-bold uppercase tracking-widest text-xs rounded-full px-5 py-3 hover:bg-white/20">Apply anyway — coach will help</button>
    </div>
  </div>
);
