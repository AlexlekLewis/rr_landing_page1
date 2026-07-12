import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// ─────────────────────────────────────────────────────────────────────────────
// Elite Program 2026 — feedback + win-back survey  (public, share link with the cohort)
//
// Two jobs: (1) hear how the families who DID the 12-week Elite Program feel about the
// product, across its core elements (Explore / Challenge / Execute), the format and value;
// (2) capture WHY they are / aren't continuing into the next program (Power Game Pre-Season)
// so non-re-signers can be followed up with the right incentive. Identity is required.
//
// Posts to the service-role /api/program-feedback (anon key never touches this table).
// ─────────────────────────────────────────────────────────────────────────────

const BARRIERS = [
  'Cost — too expensive',
  'Not clear what the next program (Power Game) involves',
  'Want to learn more before committing',
  'Not clear on the Performance Squad pathway / incentives',
  'The time commitment is too much',
  "Session times don't suit (e.g. Sat 2–4 / 4–6pm)",
  'The Aug/Sept timing is hard (clashes / weather)',
  'Travel / location',
  'My child lost interest',
  "Didn't see enough improvement",
  'Taking a break / other sport this season',
];

const STAY_REASONS = [
  'My child improved',
  'My child loves it',
  'The coaching',
  'Good value',
  'The pathway / where it leads',
  'The community & environment',
];

// ── small building blocks ────────────────────────────────────────────────────

const Section = ({ eyebrow, title, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
    {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.25em] text-rr-pink mb-1">{eyebrow}</p>}
    {title && <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-rr-dark mb-5">{title}</h2>}
    <div className="space-y-6">{children}</div>
  </div>
);

const Field = ({ label, hint, children, required }) => (
  <div>
    <label className="block text-sm font-bold text-rr-dark mb-2">
      {label} {required && <span className="text-rr-pink">*</span>}
    </label>
    {hint && <p className="text-xs text-slate-400 -mt-1 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls =
  'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20';

// 1–5 (or 0–10 NPS) numbered scale with anchor labels. No shadows — bordered pills.
const Scale = ({ value, onChange, low, high, min = 1, max = 5 }) => {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(value === n ? 0 : n)}
            className={`h-11 ${max > 5 ? 'w-10' : 'flex-1 min-w-[2.75rem]'} rounded-xl border text-sm font-bold transition-colors ${
              value === n
                ? 'bg-rr-pink border-rr-pink text-white'
                : 'bg-white border-slate-300 text-slate-600 hover:border-rr-pink/60'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {(low || high) && (
        <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      )}
    </div>
  );
};

// A rated question: label + 1–5 scale + optional free-text comment.
const RatedQ = ({ label, hint, value, onChange, low = 'Poor', high = 'Excellent', comment, onComment, commentPlaceholder }) => (
  <Field label={label} hint={hint}>
    <Scale value={value} onChange={onChange} low={low} high={high} />
    {onComment && (
      <input
        value={comment}
        onChange={(e) => onComment(e.target.value)}
        placeholder={commentPlaceholder || 'Anything to add? (optional)'}
        className={`${inputCls} mt-3`}
      />
    )}
  </Field>
);

// Single-choice pill row.
const Choice = ({ options, value, onChange }) => (
  <div className="grid sm:grid-cols-2 gap-2" role="radiogroup">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="radio"
        aria-checked={value === o.value}
        onClick={() => onChange(o.value)}
        className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
          value === o.value
            ? 'bg-rr-pink/10 border-rr-pink text-rr-dark'
            : 'bg-white border-slate-300 text-slate-600 hover:border-rr-pink/60'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// Multi-select checkbox rows.
const MultiChoice = ({ options, values, onToggle }) => (
  <div className="space-y-2">
    {options.map((o) => {
      const on = values.includes(o);
      return (
        <button
          key={o}
          type="button"
          aria-pressed={on}
          onClick={() => onToggle(o)}
          className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
            on ? 'bg-rr-pink/10 border-rr-pink text-rr-dark' : 'bg-white border-slate-300 text-slate-600 hover:border-rr-pink/60'
          }`}
        >
          <span className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border ${on ? 'bg-rr-pink border-rr-pink' : 'border-slate-400'}`} />
          {o}
        </button>
      );
    })}
  </div>
);

const EMPTY = {
  respondent_name: '', respondent_email: '', player_name: '', respondent_role: 'Parent',
  rating_overall: 0, enjoyment: 0,
  imp_shot_range: 0, imp_batting_smart: 0, imp_bowling_smart: 0, imp_power: 0, imp_game_understanding: 0,
  explore_rating: 0, explore_comment: '', challenge_rating: 0, challenge_comment: '', execute_rating: 0, execute_comment: '',
  matchcentre_rating: 0, matchcentre_unique: 0, matchcentre_comment: '', scouting_reports_use: '', matchcentre_own_time: '',
  format_fit: '', times_rating: 0, times_better: '', location_rating: 0, value_rating: 0,
  coaching_rating: 0, specialist_jarryd: 0, specialist_bowlstrong: 0, specialist_callum: 0, specialist_bajwa: 0, specialist_zach: 0,
  neuro_fitness_rating: 0, guests_rating: 0, communication_rating: 0, pathway_clarity: 0,
  nps: -1, continue_next: '', stay_reasons: [], stay_reason_other: '', barriers: [], barrier_other: '', change_mind: '',
  love_most: '', would_change: '', anything_else: '',
  consent_contact: false, hp_website: '',
};

const ProgramFeedback = () => {
  usePageAnalytics('/elite-feedback', { sections: ['hero', 'form'] });

  const [f, setF] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const toggle = (k, o) => setF((s) => ({ ...s, [k]: s[k].includes(o) ? s[k].filter((x) => x !== o) : [...s[k], o] }));

  const staying = f.continue_next === 'signed_up' || f.continue_next === 'intend';
  const leaving = f.continue_next === 'unsure' || f.continue_next === 'no';

  // Language adapts to who's answering: Player (you), Parent (your child), Both (the player).
  const isPlayer = f.respondent_role === 'Player';
  const isBoth = f.respondent_role === 'Both';
  const childWord = isPlayer ? 'you' : isBoth ? 'the player' : 'your child';   // subject noun
  const theyWord = isPlayer ? 'you' : 'they';                                   // subject pronoun
  const themWord = isPlayer ? 'you' : 'them';                                   // object pronoun
  const theirWord = isPlayer ? 'your' : 'their';                                // possessive

  // Specific improvement dimensions (replaces the single generic "did they improve" question).
  const IMPROVEMENTS = [
    ['imp_shot_range', 'A wider shot range — more ways to score'],
    ['imp_batting_smart', 'Smarter batting — better decisions at the crease'],
    ['imp_bowling_smart', `Smarter bowling (if ${theyWord} bowl)`],
    ['imp_power', 'More power — hitting the ball harder'],
    ['imp_game_understanding', 'A better understanding of the game'],
  ];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.respondent_name.trim()) return setError('Please add your name.');
    if (!f.respondent_email.includes('@')) return setError('Please add a valid email.');
    if (!f.player_name.trim()) return setError("Please add the player's name.");
    if (!f.consent_contact) return setError('Please tick the box so we can act on your feedback and follow up.');

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const payload = {
        ...f,
        nps: f.nps < 0 ? undefined : f.nps,
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        page_referrer: document.referrer || null,
      };
      const res = await fetch('/api/program-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const continueOptions = useMemo(() => ([
    { value: 'signed_up', label: 'Yes — already signed up' },
    { value: 'intend', label: 'Yes — planning to' },
    { value: 'unsure', label: 'Not sure yet' },
    { value: 'no', label: 'No, not this time' },
  ]), []);

  return (
    <div className="min-h-screen bg-slate-50 text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
      <Navbar variant="power-game" />

      <main className="flex-1 w-full">
        {/* HERO */}
        <section
          id="hero"
          className="relative px-6 pt-28 pb-16 text-white text-center overflow-hidden"
          style={{ background: 'var(--image-gradient-rr)' }}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70 mb-4">
              Rajasthan Royals Academy · Elite Program 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide leading-tight">
              Congratulations!
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed">
              You've finished the Rajasthan Royals Academy Melbourne Elite Program — 12 weeks of Explore,
              Challenge and Execute. Now tell us honestly what worked and what didn't — it takes around
              five minutes, and it directly shapes what we build next.
            </p>
            <a
              href="#form"
              className="mt-8 inline-block px-8 py-3 rounded-full font-bold text-lg bg-white text-rr-blue hover:bg-slate-100 transition-colors"
            >
              Start the survey
            </a>
          </div>
        </section>

        {/* FORM */}
        <section id="form" className="px-4 sm:px-6 py-12 md:py-16 max-w-2xl mx-auto w-full">
          {submitted ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 text-center">
              <CheckCircle2 width={60} height={60} className="text-rr-pink mx-auto" />
              <h2 className="mt-5 text-2xl md:text-3xl font-black uppercase tracking-wide text-rr-dark">Thank you</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                We've got your feedback — every answer helps us make the program better and gets read by the
                coaching team. If you flagged something we can fix, we may reach out.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              {/* honeypot */}
              <input
                type="text" tabIndex={-1} autoComplete="off"
                value={f.hp_website} onChange={(e) => up('hp_website', e.target.value)}
                className="hidden" aria-hidden="true"
              />

              {/* ── Identity ── */}
              <Section eyebrow="Confirm your details" title="About you">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Your name" required>
                    <input value={f.respondent_name} onChange={(e) => up('respondent_name', e.target.value)} placeholder="e.g. Priya" className={inputCls} required />
                  </Field>
                  <Field label="Player's name" required>
                    <input value={f.player_name} onChange={(e) => up('player_name', e.target.value)} placeholder="Your child's name" className={inputCls} required />
                  </Field>
                </div>
                <Field label="Email" required hint="So we can follow up if you'd like us to.">
                  <input type="email" value={f.respondent_email} onChange={(e) => up('respondent_email', e.target.value)} placeholder="you@email.com" className={inputCls} required />
                </Field>
                <Field label="Who's filling this in?">
                  <Choice
                    options={[{ value: 'Parent', label: 'Parent / guardian' }, { value: 'Player', label: 'Player' }, { value: 'Both', label: 'Both together' }]}
                    value={f.respondent_role}
                    onChange={(v) => up('respondent_role', v)}
                  />
                </Field>
              </Section>

              {/* ── Overall ── */}
              <Section eyebrow="The big picture" title="Overall experience">
                <RatedQ label="Overall, how would you rate the Elite Program?" value={f.rating_overall} onChange={(v) => up('rating_overall', v)} low="Poor" high="Excellent" />
                <RatedQ label={`How much did ${childWord} enjoy it?`} value={f.enjoyment} onChange={(v) => up('enjoyment', v)} low="Not much" high="Loved it" />
              </Section>

              {/* ── Specific improvement gains (replaces the single "did they improve?" question) ── */}
              <Section eyebrow="Specific gains" title={`How did ${childWord} improve?`}>
                <p className="text-sm text-slate-500 -mt-1">Rate the change over the 12 weeks — 1 (no change) to 5 (big improvement). Skip any that don't apply.</p>
                {IMPROVEMENTS.map(([key, label]) => (
                  <RatedQ key={key} label={label} low="" high="" value={f[key]} onChange={(v) => up(key, v)} />
                ))}
              </Section>

              {/* ── Core elements ── */}
              <Section eyebrow="The three phases · weeks 2–12" title="Explore · Challenge · Execute">
                <p className="text-sm text-slate-500 -mt-1">After the opening assessment week, your 12 weeks moved through three phases. Rate how each one landed.</p>
                <RatedQ
                  label="Explore phase"
                  hint="Closed-skill work (ramps, sweeps, playing spin mats), short-ball training with the plastic balls, power-hitting with Jarryd Rogers, and getting comfortable making mistakes in order to learn."
                  value={f.explore_rating} onChange={(v) => up('explore_rating', v)}
                  comment={f.explore_comment} onComment={(v) => up('explore_comment', v)}
                  commentPlaceholder="What stood out, or what was missing? (optional)"
                />
                <RatedQ
                  label="Challenge phase"
                  hint="The challenge cards (Beat the Spin, Power Play, Beat the Yorker), the bowling technical block, and building the fundamental base on weekends."
                  value={f.challenge_rating} onChange={(v) => up('challenge_rating', v)}
                  comment={f.challenge_comment} onComment={(v) => up('challenge_comment', v)}
                  commentPlaceholder="Too easy? Too hard? Just right? (optional)"
                />
                <RatedQ
                  label="Execute phase"
                  hint="Bat v Ball match-ups in the Match Centre, and the tactical + mental-performance side of the game."
                  value={f.execute_rating} onChange={(v) => up('execute_rating', v)}
                  comment={f.execute_comment} onComment={(v) => up('execute_comment', v)}
                  commentPlaceholder="Did it translate to their game? (optional)"
                />

                {/* The Match Centre — the iPad match-up tool introduced in the Execute phase */}
                <div className="pt-2 space-y-6 border-t border-slate-100">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-rr-pink pt-3">The Match Centre</p>
                  <RatedQ
                    label={`How valuable were the Match Centre match-ups — using the iPad to visualise the field, the scenario, where ${theyWord} bowled, where the ball went, and the ground dimensions?`}
                    value={f.matchcentre_rating} onChange={(v) => up('matchcentre_rating', v)}
                    low="Not valuable" high="Extremely valuable"
                    comment={f.matchcentre_comment} onComment={(v) => up('matchcentre_comment', v)}
                    commentPlaceholder={`How did it help ${themWord} build context? (optional)`}
                  />
                  <RatedQ
                    label="Compared to other cricket training, how unique were the Match Centre match-ups?"
                    value={f.matchcentre_unique} onChange={(v) => up('matchcentre_unique', v)}
                    low="Not unique" high="One of a kind"
                  />
                  <Field label={`Did ${childWord} use the scouting reports to better understand the opposition before the evening's match-ups?`}>
                    <Choice
                      options={[{ value: 'yes', label: 'Yes — most sessions' }, { value: 'sometimes', label: 'A few times' }, { value: 'no', label: "No / didn't know about them" }]}
                      value={f.scouting_reports_use}
                      onChange={(v) => up('scouting_reports_use', v)}
                    />
                  </Field>
                  <Field label={`Would ${childWord} want to use the Match Centre app in ${theirWord} own time, outside the program?`}>
                    <Choice
                      options={[{ value: 'yes', label: 'Yes — definitely' }, { value: 'maybe', label: 'Maybe' }, { value: 'no', label: 'Probably not' }]}
                      value={f.matchcentre_own_time}
                      onChange={(v) => up('matchcentre_own_time', v)}
                    />
                  </Field>
                </div>
              </Section>

              {/* ── Format & value ── */}
              <Section eyebrow="How it ran" title="Format & value">
                <Field label="The program ran as two 2-hour sessions a week — one weekday + one weekend — across 12 weeks. Was that the right amount?">
                  <Choice
                    options={[{ value: 'too_much', label: 'Too much' }, { value: 'just_right', label: 'Just right' }, { value: 'not_enough', label: 'Not enough' }]}
                    value={f.format_fit}
                    onChange={(v) => up('format_fit', v)}
                  />
                </Field>
                <RatedQ
                  label="How well did the session days & times suit your family?"
                  value={f.times_rating} onChange={(v) => up('times_rating', v)} low="Didn't suit" high="Suited well"
                  comment={f.times_better} onComment={(v) => up('times_better', v)}
                  commentPlaceholder="What days/times would suit better? (optional)"
                />
                <RatedQ label="How convenient was the location / travel?" value={f.location_rating} onChange={(v) => up('location_rating', v)} low="Difficult" high="Very easy" />
                <RatedQ label="Value for money, for what was included?" value={f.value_rating} onChange={(v) => up('value_rating', v)} low="Poor value" high="Great value" />
              </Section>

              {/* ── Coaching, specialists & pathway ── */}
              <Section eyebrow="Coaching & what's next" title="Coaching, specialists & pathway">
                <RatedQ label="How would you rate the quality of the coaching?" value={f.coaching_rating} onChange={(v) => up('coaching_rating', v)} />

                {/* Per-specialist ratings — who to bring back next time */}
                <div className="pt-2 space-y-5 border-t border-slate-100">
                  <div className="pt-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-rr-pink">The specialists</p>
                    <p className="mt-1.5 text-xs text-slate-400">Rate each from 1 (not valuable) to 5 (loved it). Skip any that {theyWord} didn't work with.</p>
                  </div>
                  <RatedQ label="Jarryd Rogers — power hitting" value={f.specialist_jarryd} onChange={(v) => up('specialist_jarryd', v)} low="" high="" />
                  <RatedQ label="BowlStrong — bowling assessments" value={f.specialist_bowlstrong} onChange={(v) => up('specialist_bowlstrong', v)} low="" high="" />
                  <RatedQ label="Callum Stow" value={f.specialist_callum} onChange={(v) => up('specialist_callum', v)} low="" high="" />
                  <RatedQ label="Harkirat Bajwa" value={f.specialist_bajwa} onChange={(v) => up('specialist_bajwa', v)} low="" high="" />
                  <RatedQ label="Zac Parr" value={f.specialist_zach} onChange={(v) => up('specialist_zach', v)} low="" high="" />
                  <RatedQ
                    label="The NeuroVision training and the fitness program & assessments"
                    value={f.neuro_fitness_rating} onChange={(v) => up('neuro_fitness_rating', v)} low="Not valuable" high="Extremely valuable"
                  />
                  <RatedQ
                    label="The guest speakers"
                    hint="Mindset & mentoring sessions with Kyle Hogg and Lhuan-dre Pretorius from the Rajasthan Royals."
                    value={f.guests_rating} onChange={(v) => up('guests_rating', v)} low="Not valuable" high="Loved them"
                  />
                </div>
                <RatedQ label={`Communication & feedback on ${childWord}'s progress`} hint="Including the assessment week and the player DNA profile." value={f.communication_rating} onChange={(v) => up('communication_rating', v)} low="Poor" high="Excellent" />
                <RatedQ
                  label="How clear are you on the pathway ahead — the Power Game Pre-Season, what's next, and how they progress?"
                  value={f.pathway_clarity} onChange={(v) => up('pathway_clarity', v)} low="Not clear" high="Very clear"
                />
              </Section>

              {/* ── Recommend + continuation ── */}
              <Section eyebrow="Would you recommend us — and what's next" title="Recommend & continuing on">
                <Field label="How likely are you to recommend the program to another family?" hint="0 = not at all likely, 10 = extremely likely">
                  <Scale value={f.nps} onChange={(v) => up('nps', v === f.nps ? -1 : v)} min={0} max={10} low="Not likely" high="Extremely likely" />
                </Field>

                <Field label="Our next program is the Power Game Pre-Season (Aug–Sep). Will you be joining?">
                  <Choice options={continueOptions} value={f.continue_next} onChange={(v) => up('continue_next', v)} />
                </Field>

                {staying && (
                  <div className="space-y-4 rounded-xl bg-slate-50 border border-slate-200 p-5">
                    <Field label="Great — what's the main reason you're staying with us?">
                      <MultiChoice options={STAY_REASONS} values={f.stay_reasons} onToggle={(o) => toggle('stay_reasons', o)} />
                    </Field>
                    <input value={f.stay_reason_other} onChange={(e) => up('stay_reason_other', e.target.value)} placeholder="Anything else? (optional)" className={inputCls} />
                  </div>
                )}

                {leaving && (
                  <div className="space-y-4 rounded-xl bg-slate-50 border border-slate-200 p-5">
                    <Field label="No problem — what's holding you back? (tick any that apply)">
                      <MultiChoice options={BARRIERS} values={f.barriers} onToggle={(o) => toggle('barriers', o)} />
                    </Field>
                    <input value={f.barrier_other} onChange={(e) => up('barrier_other', e.target.value)} placeholder="Something else? (optional)" className={inputCls} />
                    <Field label="What would change your mind?" hint="Be honest — this is exactly the kind of thing we want to fix.">
                      <textarea rows={3} value={f.change_mind} onChange={(e) => up('change_mind', e.target.value)} placeholder="e.g. an earlier session time, a payment plan, more clarity on the pathway…" className={`${inputCls} resize-y`} />
                    </Field>
                  </div>
                )}
              </Section>

              {/* ── Open text ── */}
              <Section eyebrow="In your words" title="A few last thoughts">
                <Field label="The ONE thing you loved most">
                  <textarea rows={2} value={f.love_most} onChange={(e) => up('love_most', e.target.value)} placeholder="Optional" className={`${inputCls} resize-y`} />
                </Field>
                <Field label="The ONE thing you'd change">
                  <textarea rows={2} value={f.would_change} onChange={(e) => up('would_change', e.target.value)} placeholder="Optional" className={`${inputCls} resize-y`} />
                </Field>
                <Field label="Anything else you'd like to tell us?">
                  <textarea rows={2} value={f.anything_else} onChange={(e) => up('anything_else', e.target.value)} placeholder="Optional" className={`${inputCls} resize-y`} />
                </Field>
              </Section>

              {/* ── Consent + submit ── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={f.consent_contact} onChange={(e) => up('consent_contact', e.target.checked)} className="mt-1 w-4 h-4 accent-rr-pink" />
                  <span className="text-sm text-slate-600">
                    I'm happy for the academy to use this feedback to improve the program and to contact me about it if needed. *
                  </span>
                </label>

                {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

                <button
                  type="submit" disabled={submitting}
                  className="mt-6 w-full px-8 py-4 rounded-full font-bold text-lg bg-rr-pink text-white hover:bg-rr-light-pink transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {submitting ? (<><Loader2 width={18} height={18} className="animate-spin" /> Sending…</>) : 'Submit feedback'}
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">Your answers go straight to the coaching team. We never publish them.</p>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramFeedback;
