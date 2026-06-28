import React, { useEffect, useState, useCallback } from 'react';
import { Star, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// ─────────────────────────────────────────────────────────────────────────────
// Google Business Profile review link.
// Once the GBP is claimed + verified, Google gives a short "review us" link that
// looks like https://g.page/r/XXXXXXXXXXXX/review  — paste it here.
// Until then we fall back to a Google Maps search for the academy, which still
// lets people find the listing and leave a review.
const GOOGLE_REVIEW_URL =
  'https://www.google.com/maps/search/?api=1&query=Rajasthan+Royals+Academy+Melbourne';
// ─────────────────────────────────────────────────────────────────────────────

const PROGRAMS = [
  'Junior Royals',
  'Power Game Program',
  'Holiday Programs',
  'Elite Program',
  'Female Cricket',
  'Coaching / Other',
];

const StarRow = ({ value, size = 18 }) => (
  <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        width={size}
        height={size}
        className={n <= value ? 'fill-rr-pink text-rr-pink' : 'fill-slate-200 text-slate-200'}
      />
    ))}
  </div>
);

const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rr-pink/40 rounded"
        >
          <Star
            width={32}
            height={32}
            className={n <= (hover || value) ? 'fill-rr-pink text-rr-pink' : 'fill-slate-200 text-slate-300'}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ r }) => (
  <div className="break-inside-avoid mb-5 rounded-2xl border border-slate-200 bg-white p-6">
    <StarRow value={r.rating} />
    {r.title && (
      <h3 className="mt-3 text-base font-black uppercase tracking-wide text-rr-dark normal-case">{r.title}</h3>
    )}
    <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.body}</p>
    <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rr-pink">
      <span>{r.reviewer_name}</span>
      {r.reviewer_role && <span className="text-slate-400 font-medium normal-case tracking-normal">· {r.reviewer_role}</span>}
      {r.program && <span className="text-slate-400 font-medium normal-case tracking-normal">· {r.program}</span>}
    </div>
  </div>
);

const Reviews = () => {
  usePageAnalytics('/reviews', { sections: ['hero', 'wall', 'form'] });

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: null });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.ok) {
        setReviews(data.reviews || []);
        setSummary({ count: data.count || 0, average: data.average });
      }
    } catch {
      /* leave empty — the form still works */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [load]);

  // ── form state ──
  const [form, setForm] = useState({
    reviewer_name: '', reviewer_role: 'Parent', program: '', rating: 0,
    title: '', body: '', reviewer_email: '', consent_publish: false, hp_website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.consent_publish) {
      setError('Please tick the box so we can publish your first name and review.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, page_referrer: document.referrer || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white">
      <Navbar variant="holiday" />

      <main className="flex-1 w-full">
        {/* HERO */}
        <section
          id="hero"
          className="relative px-6 pt-28 pb-16 text-white text-center overflow-hidden"
          style={{ background: 'var(--image-gradient-rr)' }}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70 mb-4">
              Rajasthan Royals Academy Melbourne
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide leading-tight">
              What Our Families Say
            </h1>

            {summary.average != null && summary.count > 0 && (
              <div className="mt-6 inline-flex flex-col items-center gap-2">
                <StarRow value={Math.round(summary.average)} size={26} />
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                  {summary.average} / 5 · {summary.count} review{summary.count === 1 ? '' : 's'}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#leave-a-review"
                className="px-8 py-3 rounded-full font-bold text-lg bg-rr-pink text-white hover:bg-rr-light-pink transition-colors"
              >
                Leave a Review
              </a>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full font-bold text-lg bg-white text-rr-blue hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
              >
                Review us on Google <ExternalLink width={18} height={18} />
              </a>
            </div>
          </div>
        </section>

        {/* WALL */}
        <section id="wall" className="px-6 py-16 max-w-5xl mx-auto w-full">
          {loading ? (
            <div className="flex justify-center py-12 text-slate-400">
              <Loader2 className="animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-black uppercase tracking-wide text-rr-dark">Be the first to review us</h2>
              <p className="mt-3 text-slate-500">Your feedback helps other families find us.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
              {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
          )}
        </section>

        {/* FORM */}
        <section id="leave-a-review" className="px-6 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 width={56} height={56} className="text-rr-pink mx-auto" />
                  <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-rr-dark">Thank you!</h2>
                  <p className="mt-3 text-slate-600">
                    Your review has been received and will appear once we've checked it.
                  </p>
                  <p className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                    Loved the academy? Help us most by also posting on Google
                  </p>
                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg bg-rr-blue text-white hover:opacity-90 transition-opacity"
                  >
                    Post on Google <ExternalLink width={18} height={18} />
                  </a>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-rr-dark">
                    Leave a Review
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Reviews are checked before they go live. We only ever publish your first name.
                  </p>

                  {/* honeypot — hidden from humans */}
                  <input
                    type="text" tabIndex={-1} autoComplete="off"
                    value={form.hp_website} onChange={set('hp_website')}
                    className="hidden" aria-hidden="true"
                  />

                  <div className="mt-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Your rating *</label>
                    <StarPicker value={form.rating} onChange={set('rating')} />
                  </div>

                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">First name *</label>
                      <input
                        required value={form.reviewer_name} onChange={set('reviewer_name')}
                        placeholder="e.g. Priya"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">You are a…</label>
                      <select
                        value={form.reviewer_role} onChange={set('reviewer_role')}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20"
                      >
                        <option>Parent</option>
                        <option>Player</option>
                        <option>Coach</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Which program? (optional)</label>
                    <select
                      value={form.program} onChange={set('program')}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20"
                    >
                      <option value="">Select a program</option>
                      {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Headline (optional)</label>
                    <input
                      value={form.title} onChange={set('title')}
                      placeholder="e.g. My son's confidence has soared"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Your review *</label>
                    <textarea
                      required rows={5} value={form.body} onChange={set('body')}
                      placeholder="Tell other families about your experience…"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20 resize-y"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email (optional, never published)</label>
                    <input
                      type="email" value={form.reviewer_email} onChange={set('reviewer_email')}
                      placeholder="So we can thank you / follow up"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rr-pink focus:ring-2 focus:ring-rr-pink/20"
                    />
                  </div>

                  <label className="mt-5 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox" checked={form.consent_publish} onChange={set('consent_publish')}
                      className="mt-1 w-4 h-4 accent-rr-pink"
                    />
                    <span className="text-sm text-slate-600">
                      I'm happy for the academy to publish my first name and review on its website and marketing.
                    </span>
                  </label>

                  {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

                  <button
                    type="submit" disabled={submitting}
                    className="mt-6 w-full px-8 py-4 rounded-full font-bold text-lg bg-rr-pink text-white hover:bg-rr-light-pink transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (<><Loader2 width={18} height={18} className="animate-spin" /> Sending…</>) : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
