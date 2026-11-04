import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPublicClient, publicError } from './public-client';
import { clearDraft, enquiryDraftKey, readAttempt, readDraft, writeAttempt, writeDraft } from './private-draft';
import { emptyDraft } from './booking-model';
import Turnstile from './Turnstile';
import { creditError } from './credit-client';
import './booking.css';
const idleSnapshot = Object.freeze({ paused: false }), readIdle = () => idleSnapshot, subscribeIdle = () => () => {};
export default function AskUs({ centre = '', coachProfileId = '', sourcePage = '/book', onClose, operationGate }) {
  const operation = useSyncExternalStore(operationGate?.subscribe ?? subscribeIdle, operationGate?.getSnapshot ?? readIdle, readIdle);
  const key = enquiryDraftKey(sourcePage), scope = `enquiry:${sourcePage}`;
  const [draft, setDraft] = useState(() => readDraft(undefined, Date.now(), key) ?? emptyDraft());
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [receipt, setReceipt] = useState(null), [token, setToken] = useState(''), [reset, setReset] = useState(0);
  const [initialAttempt] = useState(() => readAttempt(scope));
  const attempt = useRef(initialAttempt), active = useRef(true), controller = useRef(null);
  useEffect(() => { active.current = true; return () => { active.current = false; controller.current?.abort(); }; }, []);
  useEffect(() => { if (!receipt) writeDraft(draft, undefined, Date.now(), key); }, [draft, key, receipt]);
  const change = (field, value) => setDraft(d => field === 'note' ? { ...d, note: value } : field === 'name' || field === 'age' ? { ...d, players: [{ ...d.players[0], [field]: value }] } : { ...d, parent: { ...d.parent, [field === 'name_contact' ? 'name' : field]: value } });
  async function submit(event) {
    event.preventDefault(); if (pending) return;
    try { operationGate?.assertReadable(); } catch (problem) { setError(creditError(problem)); return; }
    if (new FormData(event.currentTarget).get('company_website')) { setError('Check the form and try again.'); return; }
    const player = draft.players[0], age = Number(player.age);
    if (!/^\d{1,3}$/.test(String(player.age)) || age > 120 || !player.name.trim() || (age < 18 && !draft.parent.name.trim())) { setError('Enter the player’s name and age, plus a parent or guardian for anyone under 18.'); return; }
    if (!token) { setError('Complete the security check before sending.'); return; }
    const intent = { ...(centre ? { centre } : {}), ...(coachProfileId ? { coach_profile_id: coachProfileId } : {}), player_name: player.name.trim(), player_age: age, parent_name: draft.parent.name.trim() || null, email: draft.parent.email.trim(), mobile: draft.parent.mobile.trim(), note: draft.note.trim(), source_page: sourcePage };
    const payload = JSON.stringify(intent);
    if (attempt.current?.payload !== payload) attempt.current = { nonce: crypto.randomUUID(), payload };
    writeDraft(draft, undefined, Date.now(), key); writeAttempt(scope, attempt.current); setPending(true); setError(''); controller.current = new AbortController();
    try { const saved = await createPublicClient().enquiry(intent, token, attempt.current.nonce, controller.current.signal); if (active.current) { clearDraft(undefined, key); writeAttempt(scope, null); setReceipt(saved); } }
    catch (problem) { if (problem.code === 'rate_limited') operationGate?.pause(); if (active.current && problem.name !== 'AbortError') { setError(operationGate ? creditError(problem) : publicError(problem)); setToken(''); setReset(n => n + 1); } }
    finally { if (active.current) setPending(false); }
  }
  return <section className="booking-card ph-no-capture" aria-label="Ask us about private coaching">
    <div className="booking-row"><div><p className="booking-kicker">Prefer to talk?</p><h2 tabIndex={onClose ? -1 : undefined} data-dialog-initial-focus={onClose ? '' : undefined}>Ask us</h2></div>{onClose ? <button type="button" className="booking-link" onClick={onClose}>Back to my request</button> : null}</div>
    {receipt ? <div role="status"><h3>Thanks — your enquiry is with the Academy.</h3><p>We’ll call you {receipt.call_by_plain}.</p><p className="booking-help">This is an enquiry. No session has been booked and no payment has been taken.</p></div> : <form onSubmit={submit} className="booking-stack">
      <p>Tell us who’s playing and what you need. The admin team will get back to you.</p>
      <fieldset disabled={pending || operation.paused} className="booking-fields">
        <label>Player’s name<input name="player_name" required maxLength={120} autoComplete="off" value={draft.players[0].name} onChange={e => change('name', e.target.value)} /></label>
        <label>Player’s age<input name="player_age" type="number" min="0" max="120" required value={draft.players[0].age} onChange={e => change('age', e.target.value)} /></label>
        <label>Parent or guardian’s name {Number(draft.players[0].age) < 18 ? '(required under 18)' : '(optional)'}<input name="parent_name" required={draft.players[0].age !== '' && Number(draft.players[0].age) < 18} maxLength={120} autoComplete="name" value={draft.parent.name} onChange={e => change('name_contact', e.target.value)} /></label>
        <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" value={draft.parent.email} onChange={e => change('email', e.target.value)} /></label>
        <label>Mobile<input name="mobile" type="tel" required minLength={7} maxLength={30} autoComplete="tel" value={draft.parent.mobile} onChange={e => change('mobile', e.target.value)} /></label>
        <label>What would you like help with? (optional)<textarea name="note" maxLength={3000} rows="4" value={draft.note} onChange={e => change('note', e.target.value)} /></label>
        <label className="booking-trap" aria-hidden="true">Company website<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
      </fieldset>
      <Turnstile onToken={setToken} reset={reset} />
      {error ? <p role="alert" className="booking-error">{error}</p> : null}
      <button className="booking-primary" disabled={pending || operation.paused || !token}>{pending ? 'Sending…' : 'Send my enquiry'}</button>
      <p className="booking-help">No payment. Your draft stays in this tab for up to two hours. <a href="/privacy-policy">Privacy policy</a></p>
    </form>}
  </section>;
}
