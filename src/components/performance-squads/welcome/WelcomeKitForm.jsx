import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, UserRound } from 'lucide-react';
import { FieldError, Chevron, selectClass, scrollTo } from '../shared';
import { Eyebrow } from './welcomeShared';
import { REGIONS, WELCOME } from './welcomeConfig';
import usePrices, { fmt } from './usePrices';
import { TOPS_SIZES, SHORTS_SIZES, PANTS_SIZES, JACKET_SIZES } from '../../academy-shop/sizeData';
import SizeGuide from '../../academy-shop/SizeGuide';

// ─────────────────────────────────────────────────────────────
// Performance Squad kit order — PARTICIPANT prices.
//
// Prices here are DISPLAY ONLY and must match api/_lib/uniformPricing.js, which
// is what the server actually charges. We post garment keys and sizes, never an
// amount. Same participant pricing Power Game uses — not the Academy Shop's
// retail prices — and orders land in performance_squad_kit_orders.
//
// Minimum every player needs: a training shirt, training pants (recommended)
// and/or training shorts, and a cap. The jacket is optional.
// Kit is PICK UP ONLY — collected at squad training. Nothing is posted.
// ─────────────────────────────────────────────────────────────

// Prices come from usePrices() (server-owned); only labels/sizes live here.
const ITEMS = [
    { key: 'shirt', label: 'Training Shirt', sizes: TOPS_SIZES, required: true, guide: 'training-shirt' },
    { key: 'pants', label: 'Training Pants', sizes: PANTS_SIZES, note: 'Recommended', guide: 'training-pants' },
    { key: 'shorts', label: 'Training Shorts', sizes: SHORTS_SIZES, note: 'Instead of, or as well as, pants', guide: 'training-shorts' },
    { key: 'cap', label: 'Cap', oneSize: true, required: true },
    { key: 'jacket', label: 'Fleece Jacket', sizes: JACKET_SIZES, note: 'Optional — runs small, consider one size up', guide: 'fleece-jacket' },
];

// Sizes are split junior/senior in sizeData; 'senior' covers adult sizing.
const sizesFor = (item, group) => {
    if (item.oneSize) return null;
    const s = item.sizes;
    if (Array.isArray(s)) return s;
    return s?.[group] || s?.senior || [];
};

// player: the details saved in Step 1 (confirm form). When present they are shown
// read-only and the order is linked to that registration, so the family never types
// anything twice. Without them (confirmed on another device) the fields are offered.
const BLANK = { region: '', first_name: '', last_name: '', parent_name: '', email: '', mobile: '' };

const WelcomeKitForm = ({ player: confirmed, onChangePlayer }) => {
    const [group, setGroup] = useState('senior');
    const [picks, setPicks] = useState({});           // key -> size ('' = not ordered)
    const [ownKit, setOwnKit] = useState(false);       // "I already have the kit I need"
    const player = { ...BLANK, ...(confirmed || {}) };
    const prices = usePrices();
    const priceOf = (item) => prices.kit[item.key]?.cents ?? 0;
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState('');

    const chosen = useMemo(() => (ownKit ? [] : ITEMS.filter((i) => picks[i.key])), [picks, ownKit]);
    const kitTotal = chosen.reduce((sum, i) => sum + priceOf(i), 0);
    const joiningCents = prices.joiningFeeCents;
    const weeklyCents = prices.squadFeeCents;
    const dueToday = joiningCents + weeklyCents + kitTotal;

    const toggle = (item, size) => {
        setPicks((p) => {
            const next = { ...p };
            if (size) next[item.key] = size;
            else delete next[item.key];
            return next;
        });
        setErrors((x) => ({ ...x, kit: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!confirmed) next.player = 'Please confirm your details in Step 1 first — checkout is recorded against that confirmation.';
        if (!ownKit && chosen.length === 0) next.kit = 'Choose your kit, or tick that you already have what you need';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        setBusy(true);
        setFailed('');
        try {
            const region = REGIONS.find((r) => r.slug === player.region);
            const res = await fetch('/api/performance-squad-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registration_id: confirmed?.registration_id || null,
                    has_own_kit: ownKit,
                    player: {
                        first_name: player.first_name.trim(),
                        last_name: player.last_name.trim(),
                        parent_name: player.parent_name.trim(),
                        email: player.email.trim(),
                        mobile: player.mobile.trim(),
                        centre_slug: region?.slug || '',
                        venue_name: region?.venue || '',
                        registration_id: confirmed?.registration_id || null,
                    },
                    items: chosen.map((i) => ({ key: i.key, size: picks[i.key] })),
                    pickupVenue: region?.slug || '',
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.url) throw new Error(data.error || 'Checkout could not be started');
            // Same tab on purpose: in-app browsers silently block new tabs.
            window.location.href = data.url;
        } catch (e) {
            setFailed(e.message);
            setBusy(false);
        }
    };

    // Minimum-kit reminder, so a player can see at a glance what is still missing.
    const hasShirt = !!picks.shirt;
    const hasLegs = !!picks.pants || !!picks.shorts;
    const hasHat = !!picks.cap;
    const complete = hasShirt && hasLegs && hasHat;

    return (
        <div className="bg-white/5 border border-white/12 rounded-2xl p-6 sm:p-8">
            <Eyebrow className="mb-4">Your training kit</Eyebrow>

            <label className={`flex items-start gap-3 cursor-pointer rounded-xl border p-4 mb-6 transition-colors ${ownKit ? 'border-rr-pink bg-rr-pink/10' : 'border-white/15 bg-white/5 hover:border-rr-pink/60'}`}>
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={ownKit}
                    onClick={() => { setOwnKit((v) => !v); setErrors((x) => ({ ...x, kit: undefined })); }}
                    className={`mt-0.5 w-5 h-5 rounded-md shrink-0 border flex items-center justify-center transition-colors ${ownKit ? 'bg-rr-pink border-rr-pink' : 'border-white/30 bg-white/5'}`}
                >
                    {ownKit && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </button>
                <span className="text-base font-medium text-white/85 leading-relaxed">
                    <span className="font-black text-white">I already have the training kit I need</span>
                    <br />A training shirt, training pants (recommended) and/or training shorts, and a cap.
                </span>
            </label>

            <div className={ownKit ? 'opacity-40 pointer-events-none' : ''}>
            <p className="text-white/70 text-sm font-medium mb-4">Otherwise, choose what you need at participant prices:</p>
            <div className="flex items-center gap-2 mb-6">
                {['junior', 'senior'].map((g) => (
                    <button
                        key={g}
                        type="button"
                        onClick={() => { setGroup(g); setPicks({}); }}
                        className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-colors ${group === g ? 'bg-rr-pink text-white' : 'bg-white/8 text-white/70 hover:text-white'}`}
                    >
                        {g === 'junior' ? 'Junior sizes' : 'Senior sizes'}
                    </button>
                ))}
            </div>

            <ul className="divide-y divide-white/10 mb-2">
                {ITEMS.map((item) => {
                    const sizes = sizesFor(item, group);
                    const unavailable = !item.oneSize && (!sizes || sizes.length === 0);
                    return (
                        <li key={item.key} className="py-5 first:pt-0">
                            <div className="flex items-baseline justify-between gap-4 mb-3">
                                <div className="min-w-0">
                                    <p className="font-black text-base sm:text-lg leading-snug">
                                        {item.label}
                                        {item.required && <span className="text-rr-light-pink"> *</span>}
                                    </p>
                                    {item.note && <p className="text-white/55 text-sm font-medium mt-0.5">{item.note}</p>}
                                </div>
                                <p className="font-black text-lg shrink-0">{fmt(priceOf(item))}</p>
                            </div>
                            {unavailable ? (
                                <p className="text-white/50 text-sm font-medium">Not available in junior sizes.</p>
                            ) : item.oneSize ? (
                                <button
                                    type="button"
                                    onClick={() => toggle(item, picks[item.key] ? '' : 'One size')}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-colors ${picks[item.key] ? 'bg-rr-pink text-white' : 'bg-white/8 text-white/70 hover:text-white'}`}
                                >
                                    {picks[item.key] && <Check className="w-4 h-4" />}
                                    {picks[item.key] ? 'Added — one size' : 'Add — one size'}
                                </button>
                            ) : (
                                <div className="relative max-w-xs">
                                    <select
                                        value={picks[item.key] || ''}
                                        onChange={(e) => toggle(item, e.target.value)}
                                        className={selectClass({}, '')}
                                        aria-label={`${item.label} size`}
                                    >
                                        <option value="">Not ordering this</option>
                                        {sizes.map((s) => {
                                            const val = typeof s === 'string' ? s : s.size || s.label;
                                            return <option key={val} value={val}>{val}</option>;
                                        })}
                                    </select>
                                    <Chevron />
                                </div>
                            )}
                            {item.guide && !unavailable && (
                                <div className="mt-2 [&>div>button]:text-rr-light-pink [&>div>button:hover]:text-white">
                                    <SizeGuide productId={item.guide} ageGroup={group} />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            </div>
            <FieldError msg={errors.kit} />

            {/* Minimum-kit checklist */}
            {!ownKit && !complete && (
                <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-medium text-white/75 leading-relaxed">
                    Still to choose:{' '}
                    {[!hasShirt && 'a training shirt', !hasLegs && 'training pants (recommended) and/or shorts', !hasHat && 'a cap']
                        .filter(Boolean)
                        .join(', ')}.
                </div>
            )}

            {!ownKit && chosen.length > 0 && (
                <div className="mt-7 pt-6 border-t border-white/10">
                    <Eyebrow className="mb-3">Collection</Eyebrow>
                    <p className="text-white/85 text-base font-medium leading-relaxed">
                        Kit is collected at squad training — nothing is posted. Bring your receipt to your first session.
                    </p>
                </div>
            )}

            <div className="mt-7 pt-6 border-t border-white/10">
                <Eyebrow className="mb-4">Player details</Eyebrow>
                {confirmed ? (
                    <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/12 p-4">
                        <UserRound aria-hidden="true" className="w-5 h-5 text-rr-pink shrink-0 mt-0.5" />
                        <div className="min-w-0 text-base font-medium text-white/85 leading-relaxed">
                            <p className="font-black text-white">{confirmed.first_name} {confirmed.last_name}</p>
                            <p>{REGIONS.find((r) => r.slug === confirmed.region)?.name || confirmed.region}</p>
                            <p className="text-white/60 text-sm break-words">{confirmed.email} · {confirmed.mobile}</p>
                            <p className="text-white/55 text-sm mt-2">
                                From Step 1 — this order will be recorded under this name.{' '}
                                <button type="button" onClick={onChangePlayer} className="text-rr-light-pink underline hover:text-white">Not you?</button>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-white/5 border border-white/12 p-4 text-base font-medium text-white/85 leading-relaxed">
                        <p>Complete Step 1 first — the details you enter there carry over, so you only type them once, and your payment is recorded against that confirmation.</p>
                        <div className="mt-3 text-sm">
                            <button type="button" onClick={() => scrollTo('confirm')} className="text-rr-light-pink font-black uppercase tracking-wider hover:text-white">Go to Step 1</button>
                        </div>
                                <FieldError msg={errors.player} />
                    </div>
                )}
            </div>

            <div className="mt-7 pt-6 border-t border-white/10">
                <Eyebrow className="mb-4">Due today</Eyebrow>
                <ul className="space-y-2 text-base font-medium text-white/85 mb-4">
                    <li className="flex justify-between gap-4"><span>Joining Fee <span className="text-white/50 text-sm">(one-off, non-refundable)</span></span><span className="font-black">{fmt(joiningCents)}</span></li>
                    <li className="flex justify-between gap-4"><span>Squad Fee — first week</span><span className="font-black">{fmt(weeklyCents)}</span></li>
                    {chosen.map((i) => (
                        <li key={i.key} className="flex justify-between gap-4"><span>{i.label} <span className="text-white/50 text-sm">({picks[i.key]})</span></span><span className="font-black">{fmt(priceOf(i))}</span></li>
                    ))}
                </ul>
                <div className="flex items-baseline justify-between border-t border-white/15 pt-4 mb-2">
                    <p className="font-black uppercase tracking-wider text-sm text-white/70">Total due today</p>
                    <p className="text-3xl font-black">{fmt(dueToday)}</p>
                </div>
                <p className="text-white/55 text-sm font-medium mb-6 leading-relaxed">
                    Then {fmt(weeklyCents)} a week, charged weekly in advance. {WELCOME.pricing.cancel}
                </p>
                <button
                    type="button"
                    onClick={submit}
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                >
                    {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Taking you to checkout</> : <>Proceed to checkout <ArrowRight className="w-4 h-4" /></>}
                </button>
                {failed && <p className="text-rr-light-pink text-sm font-bold mt-3 text-center">{failed}</p>}
                <p className="text-white/45 text-sm font-medium mt-3 text-center">Payments are processed by Stripe.</p>
            </div>
        </div>
    );
};

export default WelcomeKitForm;
