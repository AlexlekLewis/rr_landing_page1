import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, RotateCcw, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  SECTIONS, FIELDS, DEFAULTS, CONTENT_TABLE, CONTENT_KEY,
  fetchJrContent, cleanEdits, diffFromDefaults,
} from '../junior-royals-t3/jrContent';

// Junior Royals Editor: change the wording on /junior-royals without a deploy.
// Saves only the fields that differ from the code (jrTerm4Data.js) to site_content.
// Prices, Stripe links, dates and centres are changed in code, not here.

const fmtDate = (d) => d
  ? new Date(d).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '-';

// Lists are edited as one item per line.
const toInput = (f, v) => (f.type === 'list' ? (v || []).join('\n') : v || '');
const fromInput = (f, s) => (f.type === 'list' ? s.split('\n') : s);

const formFrom = (content) => {
  const saved = cleanEdits(content);
  return Object.fromEntries(FIELDS.map((f) => [f.path, toInput(f, f.path in saved ? saved[f.path] : DEFAULTS[f.path])]));
};

const JuniorRoyalsEditor = () => {
  const [form, setForm] = useState(() => formFrom({}));
  const [savedForm, setSavedForm] = useState(() => formFrom({}));
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // State is set in the promise callbacks, never synchronously in the effect.
  const load = useCallback(() => fetchJrContent()
    .then((row) => {
      const f = formFrom(row?.content);
      setForm(f);
      setSavedForm(f);
      setMeta(row);
    })
    .catch((e) => setMessage({ kind: 'error', text: `Could not load the saved wording: ${e.message}` }))
    .finally(() => setLoading(false)), []);

  useEffect(() => { load(); }, [load]);

  const values = useMemo(() => Object.fromEntries(FIELDS.map((f) => [f.path, fromInput(f, form[f.path])])), [form]);
  const edits = useMemo(() => diffFromDefaults(values), [values]);
  const dirty = FIELDS.some((f) => form[f.path] !== savedForm[f.path]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const { data: { session } } = await supabase.auth.getSession();
    const row = { key: CONTENT_KEY, content: edits, updated_at: new Date().toISOString(), updated_by: session?.user?.email || null };
    const { error } = await supabase.from(CONTENT_TABLE).upsert(row, { onConflict: 'key' });
    if (error) {
      setMessage({ kind: 'error', text: `Not saved: ${error.message}` });
    } else {
      const f = formFrom(edits);
      setForm(f);
      setSavedForm(f);
      setMeta(row);
      setMessage({ kind: 'ok', text: 'Saved. The live page shows the new wording on its next load.' });
    }
    setSaving(false);
  };

  const set = (path, v) => setForm((s) => ({ ...s, [path]: v }));
  const reset = (f) => set(f.path, toInput(f, DEFAULTS[f.path]));

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Junior Royals Editor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Change the wording on the Junior Royals landing page. Prices, payment links, dates and centres are changed by the developer.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {Object.keys(edits).length} field(s) changed from the original · Last saved {fmtDate(meta?.updated_at)}{meta?.updated_by ? ` by ${meta.updated_by}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/junior-royals" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ExternalLink width={16} height={16} /> View page
          </a>
          <button onClick={() => { setLoading(true); setMessage(null); load(); }} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw width={16} height={16} /> Reload
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.kind === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="space-y-6 pb-24">
          {SECTIONS.map((section) => (
            <section key={section.title} className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.fields.map((f) => {
                  const changed = form[f.path] !== toInput(f, DEFAULTS[f.path]);
                  const Input = f.type === 'text' ? 'input' : 'textarea';
                  return (
                    <div key={f.path}>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor={f.path} className="text-xs font-bold text-slate-600">
                          {f.label}
                          {f.type === 'list' && <span className="font-normal text-slate-400"> (one per line)</span>}
                          {changed && <span className="ml-2 text-rr-pink">· edited</span>}
                        </label>
                        {changed && (
                          <button type="button" onClick={() => reset(f)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
                            <RotateCcw width={12} height={12} /> Original
                          </button>
                        )}
                      </div>
                      <Input id={f.path} value={form[f.path]} onChange={(e) => set(f.path, e.target.value)}
                        rows={f.type === 'list' ? 4 : f.type === 'textarea' ? 3 : undefined}
                        className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rr-pink/40 ${changed ? 'border-rr-pink/50 bg-pink-50/30' : 'border-slate-200'}`} />
                      {!form[f.path].trim() && <p className="text-xs text-slate-400 mt-1">Empty: the page will show the original wording.</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-4xl ml-auto mr-6 mb-6 flex justify-end pointer-events-auto">
          <button onClick={save} disabled={!dirty || saving || loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rr-pink text-white text-sm font-black uppercase tracking-wider disabled:opacity-40">
            <Save width={16} height={16} /> {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuniorRoyalsEditor;
