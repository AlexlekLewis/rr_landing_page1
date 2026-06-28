import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, Check, X, Trash2, Pin, PinOff, RefreshCw, Mail, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '-';

const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} width={16} height={16} className={i <= n ? 'fill-rr-pink text-rr-pink' : 'fill-slate-200 text-slate-200'} />
    ))}
  </div>
);

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const ReviewsModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [busy, setBusy] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('academy_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Reviews fetch error:', error);
    setReviews(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const mutate = async (id, patch) => {
    setBusy(id);
    const { error } = await supabase.from('academy_reviews').update(patch).eq('id', id);
    if (error) { console.error('Update error:', error); alert('Could not update: ' + error.message); }
    else setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setBusy(null);
  };

  const remove = async (id) => {
    if (!window.confirm('Permanently delete this review? This cannot be undone.')) return;
    setBusy(id);
    const { error } = await supabase.from('academy_reviews').delete().eq('id', id);
    if (error) { console.error('Delete error:', error); alert('Could not delete: ' + error.message); }
    else setReviews((rs) => rs.filter((r) => r.id !== id));
    setBusy(null);
  };

  const approve = (id) => mutate(id, { status: 'approved', moderated_at: new Date().toISOString() });
  const reject = (id) => mutate(id, { status: 'rejected', moderated_at: new Date().toISOString() });

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    reviews.forEach((r) => { if (c[r.status] != null) c[r.status]++; });
    return c;
  }, [reviews]);

  const visible = useMemo(() => reviews.filter((r) => r.status === tab), [reviews, tab]);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide text-rr-dark">Reviews</h1>
          <p className="text-slate-500 mt-1 text-sm">Approve reviews to publish them on the public /reviews wall.</p>
        </div>
        <button onClick={fetchAll} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-rr-pink">
          <RefreshCw width={16} height={16} /> Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
              tab === t.key ? 'bg-rr-pink text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {t.label} <span className="opacity-70">({counts[t.key]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-slate-400">No {tab} reviews.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {visible.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <span className="text-xs text-slate-400">{fmtDate(r.created_at)}</span>
              </div>

              {r.title && <h3 className="mt-3 font-black text-rr-dark">{r.title}</h3>}
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">{r.body}</p>

              <div className="mt-3 text-xs font-bold uppercase tracking-widest text-rr-pink">
                {r.reviewer_name}
                {r.reviewer_role && <span className="text-slate-400 font-medium normal-case tracking-normal"> · {r.reviewer_role}</span>}
                {r.program && <span className="text-slate-400 font-medium normal-case tracking-normal"> · {r.program}</span>}
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                {r.reviewer_email && <span className="inline-flex items-center gap-1"><Mail width={12} height={12} /> {r.reviewer_email}</span>}
                {r.suburb && <span className="inline-flex items-center gap-1"><MapPin width={12} height={12} /> {r.suburb}</span>}
                {!r.consent_publish && <span className="text-amber-600 font-bold">⚠ No publish consent</span>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.status !== 'approved' && (
                  <button disabled={busy === r.id} onClick={() => approve(r.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                    <Check width={14} height={14} /> Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button disabled={busy === r.id} onClick={() => reject(r.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50">
                    <X width={14} height={14} /> Reject
                  </button>
                )}
                {r.status === 'approved' && (
                  <button disabled={busy === r.id} onClick={() => mutate(r.id, { featured: !r.featured })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 ${
                      r.featured ? 'bg-rr-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {r.featured ? <><PinOff width={14} height={14} /> Unfeature</> : <><Pin width={14} height={14} /> Feature</>}
                  </button>
                )}
                <button disabled={busy === r.id} onClick={() => remove(r.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-50 ml-auto">
                  <Trash2 width={14} height={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsModeration;
