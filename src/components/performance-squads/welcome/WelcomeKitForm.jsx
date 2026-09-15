import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Loader2, UserRound } from 'lucide-react';
import { Label, FieldError, Chevron, inputClass, selectClass, scrollTo } from '../shared';
import { Eyebrow } from './welcomeShared';
import { REGIONS } from './welcomeConfig';
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

const ITEMS = [
    { key: 'shirt', label: 'Training Shirt', priceCents: 2995, sizes: TOPS_SIZES, required: true, guide: 'training-shirt' },
    { key: 'pants', label: 'Training Pants', priceCents: 3700, sizes: PANTS_SIZES, note: 'Recommended', guide: 'training-pants' },
    { key: 'shorts', label: 'Training Shorts', priceCents: 3500, sizes: SHORTS_SIZES, note: 'Instead of, or as well as, pants', guide: 'training-shorts' },
    { key: 'cap', label: 'Cap', priceCents: 2500, oneSize: true, required: true },
    { key: 'jacket', label: 'Fleece Jacket', priceCents: 4900, sizes: JACKET_SIZES, note: 'Optional — runs small, consider one size up', guide: 'fleece-jacket' },
];

const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

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
    const [manual, setManual] = useState(false);       // typing details without Step 1
    const [typed, setTyped] = useState(BLANK);
    const player = confirmed ? { ...BLANK, ...confirmed } : typed;
    const setPlayer = setTyped;
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState('');

    const chosen = useMemo(() => ITEMS.filter((i) => picks[i.key]), [picks]);
    const subtotal = chosen.reduce((sum, i) => sum + i.priceCents, 0);

    const setField = (k) => (e) => {
        setPlayer((p) => ({ ...p, [k]: e.target.value }));
        setErrors((x) => ({ ...x, [k]: undefined }));
    };

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
        if (!confirmed && !manual) next.player = 'Please confirm your place in Step 1 first — your details carry over to this order.';
        if (!player.region) next.region = 'Please choose your region';
        if (!player.first_name.trim()) next.first_name = 'Please enter the player\u2019s first name';
        if (!player.last_name.trim()) next.last_name = 'Please enter the player\u2019s last name';
        if (!/^\S+@\S+\.\S+$/.test(player.email.trim())) next.email = 'Please enter a valid email';
        if (!player.mobile.trim()) next.mobile = 'Please enter a mobile number';
        if (chosen.length === 0) next.kit = 'Please choose at least one item';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        setBusy(true);
        setFailed('');
        try {
            const region = REGIONS.find((r) => r.slug === player.region);
            const res = await fetch('/api/performance-squad-kit-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                    fulfillment: 'pickup',
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
            <Eyebrow className="mb-4">Choose your kit</Eyebrow>

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
                                <p className="font-black text-lg shrink-0">{fmt(item.priceCents)}</p>
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
            <FieldError msg={errors.kit} />

            {/* Minimum-kit checklist */}
            {!complete && (
                <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-medium text-white/75 leading-relaxed">
                    Still to choose:{' '}
                    {[!hasShirt && 'a training shirt', !hasLegs && 'training pants (recommended) and/or shorts', !hasHat && 'a cap']
                        .filter(Boolean)
                        .join(', ')}.
                </div>
            )}

            <div className="mt-7 pt-6 border-t border-white/10">
                <Eyebrow className="mb-3">Collection</Eyebrow>
                <p className="text-white/85 text-base font-medium leading-relaxed">
                    Kit is collected at squad training — nothing is posted. Bring your receipt to your first session.
                </p>
            </div>

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
                ) : !manual ? (
                    <div className="rounded-xl bg-white/5 border border-white/12 p-4 text-base font-medium text-white/85 leading-relaxed">
                        <p>Confirm your place in Step 1 first — the details you enter there carry over to this order, so you only type them once.</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm">
                            <button type="button" onClick={() => scrollTo('confirm')} className="text-rr-light-pink font-black uppercase tracking-wider hover:text-white">Go to Step 1</button>
                            <button type="button" onClick={() => setManual(true)} className="text-white/60 underline hover:text-white">Already confirmed on another device? Enter details</button>
                        </div>
                        <FieldError msg={errors.player} />
                    </div>
                ) : (
                    <>
                        <div className="relative mb-4">
                            <Label required>Region / location you were selected in</Label>
                            <div className="relative">
                                <select value={player.region} onChange={setField('region')} className={selectClass(errors, 'region')}>
                                    <option value="" disabled>Choose your region</option>
                                    {REGIONS.map((r) => (
                                        <option key={r.slug} value={r.slug}>{r.name} — {r.venue}</option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                            <FieldError msg={errors.region} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label required>Player first name</Label>
                                <input value={player.first_name} onChange={setField('first_name')} className={inputClass(errors, 'first_name')} />
                                <FieldError msg={errors.first_name} />
                            </div>
                            <div>
                                <Label required>Player last name</Label>
                                <input value={player.last_name} onChange={setField('last_name')} className={inputClass(errors, 'last_name')} />
                                <FieldError msg={errors.last_name} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label>Parent or guardian name <span className="text-white/45 font-medium normal-case">(if the player is under 18)</span></Label>
                            <input value={player.parent_name} onChange={setField('parent_name')} className={inputClass(errors, 'parent_name')} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label required>Email</Label>
                                <input type="email" value={player.email} onChange={setField('email')} placeholder="you@email.com" className={inputClass(errors, 'email')} />
                                <FieldError msg={errors.email} />
                            </div>
                            <div>
                                <Label required>Mobile</Label>
                                <input type="tel" value={player.mobile} onChange={setField('mobile')} placeholder="04xx xxx xxx" className={inputClass(errors, 'mobile')} />
                                <FieldError msg={errors.mobile} />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-7 pt-6 border-t border-white/10">
                <div className="flex items-baseline justify-between mb-5">
                    <p className="font-black uppercase tracking-wider text-sm text-white/70">Total</p>
                    <p className="text-3xl font-black">{fmt(subtotal)}</p>
                </div>
                {chosen.length > 0 && (
                    <p className="text-white/55 text-sm font-medium mb-5 leading-relaxed">
                        {chosen.map((i) => `${i.label} (${picks[i.key]})`).join(', ')}
                    </p>
                )}
                <button
                    type="button"
                    onClick={submit}
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                >
                    {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Taking you to checkout</> : <>Order kit <ArrowRight className="w-4 h-4" /></>}
                </button>
                {failed && <p className="text-rr-light-pink text-sm font-bold mt-3 text-center">{failed}</p>}
                <p className="text-white/45 text-sm font-medium mt-3 text-center">Payments are processed by Stripe.</p>
            </div>
        </div>
    );
};

export default WelcomeKitForm;
