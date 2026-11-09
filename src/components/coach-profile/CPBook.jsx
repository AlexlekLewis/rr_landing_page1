import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotGuard from '../security/BotGuard';
import { CENTRES } from './coachProfiles';
import { SectionHead } from './CPShared';
import {
    bookingMode, buildBookUrl, formatDay, formatLength, formatTime,
    getCoachSlots, melbourneDate, sendEnquiry,
} from './bookingClient';
import { trackCoachEnquiry } from './coachPixel';

// The booking panel: the coach's next free times, read live from the booking
// system. Tapping a time and Continue opens /book with everything filled in.
// Nothing here saves a booking. "Ask us" sends an enquiry to the admin inbox.
//
// One player or a group is chosen by the page (the hero and "How to train with"
// buttons set it), so `kind` and `groupSize` come in as props. Prices aren't shown
// here: they're in "What it costs" further down, and /book shows the price of
// the family's choice before anything is requested (Alex, 9 Nov 2026).

const chip = (on) =>
    `min-h-[46px] rounded-[10px] border-[1.5px] px-3.5 font-bold text-[15px] transition-colors ${on ? 'bg-rr-pink border-rr-pink text-white' : 'border-[#4A5764] text-white hover:border-rr-pink'}`;
const label = 'text-[13px] font-extrabold uppercase tracking-[0.08em] text-white';
const input = 'w-full rounded-[10px] border-[1.5px] border-[#3A4652] bg-white px-3.5 py-3 text-base font-semibold text-rr-dark';

export default function CPBook({ profile, catalog, catalogLoading, catalogCoach, offers, kind, groupSize, onChoose, sourcePage }) {
    const navigate = useNavigate();
    const mode = bookingMode();
    const centres = catalogCoach?.centres?.length ? catalogCoach.centres : [];
    const bookable = Boolean(catalogCoach) && centres.length > 0 && (offers.one_on_one || offers.group);

    const [centre, setCentre] = useState(null);
    const [minutes, setMinutes] = useState(60);
    const [slots, setSlots] = useState(null);
    const [slotsError, setSlotsError] = useState('');
    const [picked, setPicked] = useState(null);
    const [mockUrl, setMockUrl] = useState('');
    const [askOpen, setAskOpen] = useState(false);

    const activeCentre = centre || (centres.includes(catalogCoach?.homeCentre) ? catalogCoach.homeCentre : centres[0]) || profile.homeCentre;
    const centreInfo = CENTRES[activeCentre] || CENTRES[profile.homeCentre];
    // The coach's main strength decides the net the session needs (Build Plan §5.2).
    const focus = profile.strengths[0].focus;

    useEffect(() => {
        if (!bookable) return undefined;
        let live = true;
        setSlots(null);
        setSlotsError('');
        setPicked(null);
        setMockUrl('');
        getCoachSlots({ coach: catalogCoach, centre: activeCentre, kind, groupSize, focus, minutes })
            .then((s) => { if (live) setSlots(s); })
            .catch(() => { if (live) { setSlots([]); setSlotsError('We couldn’t load the free times just now. Try again in a minute, or ask us below.'); } });
        return () => { live = false; };
    }, [bookable, catalogCoach, activeCentre, kind, groupSize, focus, minutes]);

    const days = useMemo(() => {
        const byDay = new Map();
        (slots || []).forEach((s) => {
            const d = melbourneDate(s.startsAt);
            if (!byDay.has(d)) byDay.set(d, []);
            byDay.get(d).push(s);
        });
        return [...byDay.entries()];
    }, [slots]);

    // No `goals`: the strength cards only describe now (Alex, 9 Nov 2026).
    const bookUrl = (startsAt) => buildBookUrl({ centre: activeCentre, coach: profile.slug, startsAt, minutes, focus, kind, groupSize });
    const moreUrl = bookUrl(undefined);

    const go = (url) => {
        if (mode === 'live') navigate(url);
        else setMockUrl(url);
    };
    const onMore = (e) => { e.preventDefault(); go(moreUrl); };
    const onContinue = () => go(bookUrl(picked.startsAt));

    const who = kind === 'group' ? `a group of ${groupSize}` : 'one player';
    const intro = mode === 'off'
        ? `Private coaching bookings with ${profile.first} open soon.`
        : bookable
            ? `${profile.first}’s free times at ${centreInfo.short} over the next week. Tap a time to request it. You’re not charged until we confirm it with the centre.`
            : catalogLoading
                ? `Loading ${profile.first}’s free times…`
                : `${profile.first} isn’t taking new private bookings right now. Leave your details and we’ll call you about times with ${profile.first} or another Academy coach.`;

    return (
        <section className="py-16 md:py-24 bg-rr-dark text-slate-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead first="Book" second={profile.first} lead={intro} dark />

                {bookable && (
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
                                {offers.one_on_one && (
                                    <button type="button" role="radio" aria-checked={kind === 'one_on_one'} className={chip(kind === 'one_on_one')} onClick={() => onChoose('one_on_one')}>
                                        One player
                                    </button>
                                )}
                                {offers.group && (catalog?.groupSizes || [2, 3, 4]).map((n) => (
                                    <button key={n} type="button" role="radio" aria-checked={kind === 'group' && groupSize === n} className={chip(kind === 'group' && groupSize === n)} onClick={() => onChoose('group', n)}>
                                        Group of {n}
                                    </button>
                                ))}
                            </div>
                            {offers.group && <p className="text-sm">For a group, you bring the players. The person booking adds the other players’ names on the next screen.</p>}
                        </div>

                        <div className="grid gap-2.5">
                            <p className={label} id="cp-length">How long</p>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cp-length">
                                {(catalog?.durations || [60, 90, 120]).map((m) => (
                                    <button key={m} type="button" role="radio" aria-checked={minutes === m} className={chip(minutes === m)} onClick={() => setMinutes(m)}>
                                        {formatLength(m)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm">
                                The next screen shows the price of your choice before you send anything.{' '}
                                <a href="#prices" className="font-bold text-white underline underline-offset-4">See all prices</a>
                            </p>
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
                                                onClick={() => { setPicked(s); setMockUrl(''); }}>
                                                {formatTime(s.startsAt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <a href={moreUrl} onClick={onMore} data-cta="see-more-weeks" className="text-white font-bold text-sm underline underline-offset-4 w-fit">
                                See more weeks →
                            </a>
                        </div>

                        {picked && (
                            <div className="grid gap-3 border-t-2 border-rr-pink pt-5" aria-live="polite">
                                <p className="text-white font-extrabold text-lg">
                                    {formatDay(picked.startsAt)}, {formatTime(picked.startsAt)} – {formatTime(picked.endsAt)} at {centreInfo.short} with {profile.first}, for {who}
                                </p>
                                <p>On the next screen you choose how many weeks and add the player’s details. You can also add a note for {profile.first} about what the player wants to work on.</p>
                                <button type="button" onClick={onContinue} data-cta="continue-to-book"
                                    className="w-full sm:w-auto min-h-[54px] rounded-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 transition-colors">
                                    Continue: weeks and player details
                                </button>
                                <p className="text-sm">Requesting puts a hold on your card for the first session. Nothing is charged until the centre confirms.</p>
                            </div>
                        )}

                        {mockUrl && (
                            <p className="text-[13px] text-white bg-[#1E2A35] rounded-lg px-3.5 py-3 break-all" data-testid="mock-book-url">
                                Mock data: on the live site this opens <code className="text-pink-200">{mockUrl}</code>
                            </p>
                        )}
                    </div>
                )}

                {mode !== 'off' && !catalogLoading && (
                    <div className="mt-8 max-w-3xl">
                        {bookable && !askOpen && (
                            <p className="text-[15px]">
                                Rather talk to someone first?{' '}
                                <button type="button" onClick={() => setAskOpen(true)} data-cta="ask-us-open" className="font-extrabold text-white underline underline-offset-4">
                                    Ask us and we’ll call you within 24 hours
                                </button>
                            </p>
                        )}
                        {(askOpen || !bookable) && (
                            <AskUs profile={profile} centre={activeCentre} catalogCoach={catalogCoach} sourcePage={sourcePage} />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

function AskUs({ profile, centre, catalogCoach, sourcePage }) {
    const [f, setF] = useState({ playerName: '', playerAge: '', parentName: '', mobile: '', email: '', note: '' });
    const [token, setToken] = useState(null);
    const [honeypot, setHoneypot] = useState('');
    const [state, setState] = useState({ sending: false, error: '', done: '' });
    const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!f.playerName.trim() || !f.playerAge || !f.parentName.trim() || !f.mobile.trim()) {
            setState({ sending: false, error: 'Please fill in the player’s name and age, and a parent or guardian’s name and mobile.', done: '' });
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) {
            setState({ sending: false, error: 'Please enter a valid email address.', done: '' });
            return;
        }
        setState({ sending: true, error: '', done: '' });
        try {
            const r = await sendEnquiry({ ...f, centre, coach: catalogCoach, sourcePage, turnstileToken: token, honeypot });
            setState({ sending: false, error: '', done: `Thanks. We’ll call you ${r.callByPlain}.` });
            trackCoachEnquiry(profile, centre);
        } catch {
            setState({ sending: false, error: 'That didn’t send. Please try again, or email info@rramelbourne.com.', done: '' });
        }
    };

    if (state.done) return <p className="text-white font-bold text-lg" aria-live="polite">{state.done}</p>;

    return (
        <form onSubmit={submit} noValidate className="grid gap-4 border-t border-[#2A3540] pt-6">
            <h3 className="text-xl font-black uppercase tracking-wide text-white">Ask us about {profile.first}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><label htmlFor="cp-pn" className={label}>Player’s name</label><input id="cp-pn" className={input} value={f.playerName} onChange={set('playerName')} autoComplete="off" /></div>
                <div className="grid gap-1.5"><label htmlFor="cp-pa" className={label}>Player’s age</label><input id="cp-pa" className={input} value={f.playerAge} onChange={set('playerAge')} inputMode="numeric" /></div>
                <div className="grid gap-1.5"><label htmlFor="cp-gn" className={label}>Parent or guardian</label><input id="cp-gn" className={input} value={f.parentName} onChange={set('parentName')} autoComplete="name" /></div>
                <div className="grid gap-1.5"><label htmlFor="cp-mb" className={label}>Mobile</label><input id="cp-mb" className={input} value={f.mobile} onChange={set('mobile')} type="tel" autoComplete="tel" /></div>
                <div className="grid gap-1.5 sm:col-span-2"><label htmlFor="cp-em" className={label}>Email</label><input id="cp-em" className={input} value={f.email} onChange={set('email')} type="email" autoComplete="email" /></div>
                <div className="grid gap-1.5 sm:col-span-2"><label htmlFor="cp-nt" className={label}>Anything {profile.first} should know (optional)</label><input id="cp-nt" className={input} value={f.note} onChange={set('note')} /></div>
            </div>
            <BotGuard onToken={setToken} onHoneypot={setHoneypot} />
            {state.error && <p className="text-white font-bold">{state.error}</p>}
            <button type="submit" disabled={state.sending} data-cta="ask-us-send"
                className="w-full sm:w-auto min-h-[54px] rounded-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest px-8 transition-colors">
                {state.sending ? 'Sending…' : 'Send'}
            </button>
            <p className="text-sm">We’ll call you within 24 hours. Your details go only to the Academy’s admin team.</p>
        </form>
    );
}
