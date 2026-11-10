import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import AskUs from '../booking/AskUs';
import { CENTRES } from './coachProfiles';
import { SectionHead } from './CPShared';
import {
    bookingMode, buildBookUrl, coachOffers, formatDay, formatLength, formatMoney, formatTime,
    getCoachSlots, melbourneDate, sessionPriceCents,
} from './bookingClient';

// The booking panel: the coach's next free times, read live from the booking
// system. Tapping a time and Continue opens /book with everything filled in.
// Nothing here saves a booking. "Ask us" sends an enquiry to the admin inbox.

const chip = (on) =>
    `min-h-[46px] rounded-[10px] border-[1.5px] px-3.5 font-bold text-[15px] transition-colors ${on ? 'bg-rr-pink border-rr-pink text-white' : 'border-[#4A5764] text-white hover:border-rr-pink'}`;
const label = 'text-[13px] font-extrabold uppercase tracking-[0.08em] text-white';

export default function CPBook({ profile, catalog, catalogLoading, catalogError, catalogCoach, picks, sourcePage, reader, operationGate }) {
    const navigate = useNavigate();
    const mode = bookingMode();
    const operation = useSyncExternalStore(operationGate.subscribe, operationGate.getSnapshot, operationGate.getSnapshot);
    const centres = catalogCoach?.centres?.length ? catalogCoach.centres : [];
    const offers = coachOffers(catalogCoach);
    const bookable = Boolean(catalogCoach) && centres.length > 0 && Boolean(offers?.one_on_one || offers?.group);

    const [centre, setCentre] = useState(null);
    const [chosenKind, setKind] = useState('one_on_one');
    const [chosenGroupSize, setGroupSize] = useState(2);
    const kind = offers?.[chosenKind] ? chosenKind : offers?.one_on_one ? 'one_on_one' : offers?.group ? 'group' : null;
    const groupSize = catalog?.groupSizes?.includes(chosenGroupSize) ? chosenGroupSize : catalog?.groupSizes?.[0] ?? 2;
    const [minutes, setMinutes] = useState(60);
    const [slotResult, setSlots] = useState(null);
    const [readFor, setReadFor] = useState(null);
    const [slotProblem, setSlotsError] = useState('');
    const [pickedResult, setPicked] = useState(null);
    const [askOpen, setAskOpen] = useState(false);

    const activeCentre = centre || (centres.includes(catalogCoach?.homeCentre) ? catalogCoach.homeCentre : centres[0]) || profile.homeCentre;
    const centreInfo = CENTRES[activeCentre] || CENTRES[profile.homeCentre];
    const pickedStrengths = profile.strengths.filter((s) => picks.includes(s.key));
    const focus = (pickedStrengths[0] || profile.strengths[0]).focus;
    const goals = pickedStrengths.map((s) => s.key);
    const queryKey = JSON.stringify([profile.slug, catalogCoach?.profileId, activeCentre, kind, groupSize, focus, minutes]);
    const slots = readFor === queryKey ? slotResult : null;
    const slotsError = readFor === queryKey ? slotProblem : '';
    const picked = pickedResult?.queryKey === queryKey ? pickedResult.slot : null;

    useEffect(() => {
        if (!bookable || operation.paused) return undefined;
        let live = true; const controller = new AbortController();
        getCoachSlots({ coach: catalogCoach, centre: activeCentre, kind, groupSize, focus, minutes, reader, signal: controller.signal })
            .then((s) => { if (live) { setSlots(s); setSlotsError(''); setReadFor(queryKey); } })
            .catch(problem => { if (live && problem.name !== 'AbortError') { setSlots([]); setReadFor(queryKey); setSlotsError(problem.code === 'rate_limited' ? 'There have been too many checks. Please wait before starting a new visit.' : 'We couldn’t load the free times just now. No availability has been assumed. You can ask us below.'); } });
        return () => { live = false; controller.abort(); };
    }, [bookable, catalogCoach, activeCentre, kind, groupSize, focus, minutes, reader, operation.paused, queryKey]);

    const days = useMemo(() => {
        const byDay = new Map();
        (readFor === queryKey ? slots || [] : []).forEach((s) => {
            const d = melbourneDate(s.startsAt);
            if (!byDay.has(d)) byDay.set(d, []);
            byDay.get(d).push(s);
        });
        return [...byDay.entries()];
    }, [slots, readFor, queryKey]);

    const price = (m) => sessionPriceCents(catalog?.prices, { kind, groupSize, minutes: m });
    const bookUrl = (startsAt) => buildBookUrl({ centre: activeCentre, coach: profile.slug, startsAt, minutes, focus, goals, kind, groupSize });

    const moreUrl = buildBookUrl({ centre: activeCentre, coach: profile.slug, minutes, focus, goals, kind, groupSize });
    const onMore = (e) => {
        e.preventDefault();
        if (operation.paused) return;
        if (mode === 'live') navigate(moreUrl);
    };

    const onContinue = () => {
        if (operation.paused || readFor !== queryKey || !picked || !slots?.some(s => s.startsAt === picked.startsAt && s.endsAt === picked.endsAt) || Date.parse(picked.endsAt) - Date.parse(picked.startsAt) !== minutes * 60000) return;
        const url = bookUrl(picked.startsAt);
        if (mode === 'live') navigate(url);
    };

    const intro = mode === 'off'
        ? `Private coaching bookings with ${profile.first} open soon.`
        : catalogError
            ? 'We couldn’t verify the live coaching catalogue. No availability or eligibility has been assumed. You can ask us below.'
        : bookable
            ? `${profile.first}’s free times at ${centreInfo.short} over the next week. Tap a time to request it. You’re not charged until we confirm it with the centre.`
            : catalogLoading
                ? `Loading ${profile.first}’s free times…`
                : `${profile.first} isn’t taking new private bookings right now. Leave your details and we’ll call you about times with ${profile.first} or another Academy coach.`;

    return (
        <section className="py-16 md:py-24 bg-rr-dark text-slate-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="Book" second={profile.first} lead={intro} dark />

                {bookable && !operation.paused && (
                    <div className="grid gap-7 max-w-3xl">
                        {centres.length > 1 && (
                            <div className="grid gap-2.5">
                                <p className={label} id="cp-centre">Centre</p>
                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cp-centre">
                                    {centres.map((c) => (
                                        <button key={c} type="button" role="radio" aria-checked={activeCentre === c} className={chip(activeCentre === c)} onClick={() => setCentre(c)}>
                                            {CENTRES[c]?.short || c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2.5">
                            <p className={label} id="cp-kind">Who’s training</p>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cp-kind">
                                {offers.one_on_one && <button type="button" role="radio" aria-checked={kind === 'one_on_one'} className={chip(kind === 'one_on_one')} onClick={() => setKind('one_on_one')}>One player</button>}
                                {offers.group && (catalog?.groupSizes || [2, 3, 4]).map((n) => (
                                    <button key={n} type="button" role="radio" aria-checked={kind === 'group' && groupSize === n} className={chip(kind === 'group' && groupSize === n)} onClick={() => { setKind('group'); setGroupSize(n); }}>
                                        Group of {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2.5">
                            <p className={label} id="cp-length">How long</p>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cp-length">
                                {(catalog?.durations || [60, 90, 120]).map((m) => (
                                    <button key={m} type="button" role="radio" aria-checked={minutes === m} className={chip(minutes === m)} onClick={() => setMinutes(m)}>
                                        {formatLength(m)}{price(m) != null && ` · ${formatMoney(price(m))}${kind === 'group' ? ' each' : ''}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <p className={label}>Free times</p>
                            {slots === null && <p>Finding free times…</p>}
                            {slotsError && <p className="text-white">{slotsError}</p>}
                            {slots && !slotsError && days.length === 0 && (
                                <p className="text-white">No free times in the next week for this choice. Try another length, or see more weeks.</p>
                            )}
                            {days.map(([d, list]) => (
                                <div key={d} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 border-b border-[#2A3540] pb-3">
                                    <p className="font-extrabold text-white text-[15px]">{formatDay(list[0].startsAt)}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {list.map((s) => (
                                            <button key={s.startsAt} type="button" aria-pressed={picked?.startsAt === s.startsAt}
                                                className={`${chip(picked?.startsAt === s.startsAt)} min-w-[92px]`}
                                                onClick={() => setPicked({ queryKey, slot: s })}>
                                                {formatTime(s.startsAt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <a href={moreUrl} onClick={onMore} className="inline-flex min-h-[44px] items-center text-white font-bold text-sm underline underline-offset-4 w-fit">
                                See more weeks →
                            </a>
                        </div>

                        {picked && readFor === queryKey && (
                            <div className="grid gap-3 border-t-2 border-rr-pink pt-5" aria-live="polite">
                                <p className="text-white font-extrabold text-lg">
                                    {formatDay(picked.startsAt)}, {formatTime(picked.startsAt)} – {formatTime(picked.endsAt)} at {centreInfo.short} with {profile.first}
                                    {price(minutes) != null && ` · ${formatMoney(price(minutes))}${kind === 'group' ? ' per player' : ''} incl. GST`}
                                </p>
                                <p>{pickedStrengths.length ? `Goals for ${profile.first}: ${pickedStrengths.map((s) => s.title).join(', ')}` : 'No goals picked yet. You can add them on the next screen.'}</p>
                                <button type="button" onClick={onContinue}
                                    className="w-full sm:w-auto min-h-[54px] rounded-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 transition-colors">
                                    Continue: weeks and player details
                                </button>
                                <p className="text-sm">Requesting puts a hold on your card for the first session. Nothing is charged until the centre confirms.</p>
                            </div>
                        )}


                    </div>
                )}

                {operation.paused && <p role="alert" className="text-white">There have been too many checks. This visit is paused.</p>}
                {mode !== 'off' && !catalogLoading && (
                    <div className="mt-8 max-w-3xl">
                        {bookable && !askOpen && (
                            <p className="text-[15px]">
                                Rather talk to someone first?{' '}
                                <button type="button" onClick={() => setAskOpen(true)} className="min-h-[44px] font-extrabold text-white underline underline-offset-4">
                                    Ask us and we’ll call you within 24 hours
                                </button>
                            </p>
                        )}
                        {(askOpen || !bookable) && (
                            <AskUs key={profile.slug} centre={activeCentre} coachProfileId={catalogCoach?.profileId ?? ''} sourcePage={sourcePage} operationGate={operationGate} />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
