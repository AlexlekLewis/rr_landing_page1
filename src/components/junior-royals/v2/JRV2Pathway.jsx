import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, Check, ChevronsDown, Crosshair, Footprints, Hand, Megaphone, Repeat, Shield, Target, X } from 'lucide-react';
import { Rich } from '../JuniorRoyalsShared';
import { PHASES, CURRICULUM, BADGES, AFTER } from './jrV2Facts';
import { PATH, BADGE_COPY } from './jrV2Content';

// ─────────────────────────────────────────────────────────────
// The Junior Royals pathway, ages 7 to 12 (Alex, 8 Oct 2026): show that there is
// a full curriculum behind the program, stage by stage, with skill badges.
//
// - An age ruler (7 … 12, then 13+ by trial) so a 10-year-old can find themselves.
// - One card per stage. Tapping a card opens a pop-up with everything the stage
//   covers. Pop-ups open on tap or click, never on hover alone: 80% of visitors
//   are on phones, which have no hover (copy-esl.md §2).
// - Badge medals: icon + name + the player's own "I can …".
// Colours follow the stage: Discover pink, Develop blue, Elevate dark. White text
// sits on colour only at 20px+ bold (pink is 4.4:1 against white).
// ─────────────────────────────────────────────────────────────

const STAGE = [
    { bg: 'bg-rr-pink', border: 'border-rr-pink' },
    { bg: 'bg-rr-blue', border: 'border-rr-blue' },
    { bg: 'bg-rr-dark', border: 'border-rr-dark' },
];
const TOPIC_KEYS = ['batting', 'bowling', 'fielding'];
const TOPIC_BAR = { batting: 'border-rr-pink', bowling: 'border-rr-blue', fielding: 'border-rr-dark' };
const topicCount = (c) => TOPIC_KEYS.reduce((n, k) => n + c[k].length, 0);

// ── Age ruler ──
const AgeRuler = () => (
    <div className="grid grid-cols-[2fr_2fr_2fr_1.2fr] gap-1.5 mb-8" aria-hidden="true">
        {PHASES.map((p, i) => (
            <div key={p.key}>
                <div className="flex justify-between px-1 text-sm font-black text-rr-dark"><span>{p.min}</span><span>{p.max}</span></div>
                <div className={`h-3 rounded-full ${STAGE[i].bg}`} />
                <p className="mt-1.5 text-center text-xs sm:text-sm font-black uppercase tracking-wide text-rr-dark">{p.name}</p>
            </div>
        ))}
        <div>
            <div className="text-center text-sm font-black text-rr-dark">13+</div>
            <div className="h-3 rounded-full border-2 border-dashed border-rr-dark" />
            <p className="mt-1.5 text-center text-xs sm:text-sm font-black uppercase tracking-wide text-rr-dark">Trial</p>
        </div>
    </div>
);

// ── One stage card (a button: the whole card opens the pop-up) ──
const StageCard = ({ p, i, onOpen }) => {
    const c = CURRICULUM[p.key];
    const sample = TOPIC_KEYS.map((k) => ({ k, t: c[k][0] }));
    return (
        <button type="button" onClick={() => onOpen(i)} aria-haspopup="dialog"
            className={`group w-full text-left rounded-2xl overflow-hidden bg-white border-2 border-slate-200 hover:${STAGE[i].border} focus-visible:outline focus-visible:outline-4 focus-visible:outline-rr-pink transition-colors`}>
            <div className={`${STAGE[i].bg} px-5 pt-4 pb-5`}>
                <p className="text-white text-3xl font-black uppercase leading-none">{p.name}</p>
                <p className="text-white text-xl font-bold mt-1.5">{p.aim}</p>
            </div>
            <div className="px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-rr-charcoal">{PATH.stageLabel(i)} · Ages {p.ages}</p>
                <ul className="mt-3 space-y-1.5">
                    {sample.map(({ k, t }) => (
                        <li key={k} className={`border-l-4 ${TOPIC_BAR[k]} pl-2.5 text-[15px] font-semibold text-rr-dark leading-snug`}>{t}</li>
                    ))}
                </ul>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-rr-dark"><Award className="w-4 h-4 text-rr-pink" aria-hidden="true" />{PATH.certificate(p.name)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] font-black text-rr-dark underline underline-offset-4 decoration-2 decoration-rr-pink">
                    {PATH.open(p.name)} ({PATH.topics(topicCount(c))})
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
            </div>
        </button>
    );
};

// ── Badge medal ──
const BADGE_ICON = {
    'Two Vs': ChevronsDown, 'Heel to Toe': Footprints, 'Guard the Stumps': Shield, 'Call It': Megaphone,
    'Straight to the Target': Target, 'Base of the Stump': Crosshair, 'Two the Same': Repeat, 'Safe Hands': Hand,
};
const RING = { bat: 'border-rr-pink text-rr-pink', bowl: 'border-rr-blue text-rr-blue', field: 'border-rr-dark text-rr-dark' };

const BadgeMedal = ({ b }) => {
    const Icon = BADGE_ICON[b.name] || Award;
    return (
        <li className="flex flex-col items-center text-center">
            <span className={`w-16 h-16 rounded-full border-4 bg-white flex items-center justify-center ${RING[b.kind]}`}>
                <Icon className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="mt-2 text-sm font-black text-rr-dark leading-tight">{b.name}</span>
            <span className="mt-0.5 text-xs font-medium text-rr-charcoal leading-snug">“{BADGE_COPY.iCan} {b.can}”</span>
        </li>
    );
};

// ── The stage pop-up ──
const H = ({ children }) => <h3 className="text-xs font-black uppercase tracking-widest text-rr-dark mb-2">{children}</h3>;

const StageModal = ({ index, onClose, onNav }) => {
    const p = PHASES[index];
    const c = CURRICULUM[p.key];
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; });

    // Open: lock page scroll, focus Close, Esc closes, Tab stays inside. Close: give focus back.
    useEffect(() => {
        const opener = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') { onCloseRef.current(); return; }
            if (e.key !== 'Tab' || !panelRef.current) return;
            const f = [...panelRef.current.querySelectorAll('button, a[href]')].filter((el) => !el.disabled);
            if (!f.length) return;
            if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            opener?.focus?.();
        };
    }, []);
    useEffect(() => { panelRef.current?.scrollTo?.(0, 0); }, [index]);

    const prev = PHASES[index - 1];
    const next = PHASES[index + 1];
    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-rr-dark/80" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="jr-stage-title"
                className="relative w-full md:max-w-3xl h-[100dvh] md:h-auto md:max-h-[90vh] overflow-y-auto bg-white md:rounded-2xl">
                <div className={`${STAGE[index].bg} px-5 sm:px-8 pt-5 pb-6`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-white text-xl font-bold">Ages {p.ages}</p>
                            <h2 id="jr-stage-title" className="text-white text-4xl sm:text-5xl font-black uppercase leading-none mt-1">{p.name}</h2>
                            <p className="text-white text-xl font-bold mt-2">{p.aim}</p>
                        </div>
                        <button ref={closeRef} type="button" onClick={onClose} aria-label={PATH.modal.close}
                            className="shrink-0 w-11 h-11 rounded-full bg-white text-rr-dark flex items-center justify-center">
                            <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="px-5 sm:px-8 py-6 space-y-8">
                    <section>
                        <H>{PATH.modal.means}</H>
                        <p className="text-[16px] text-rr-dark font-medium leading-relaxed">{c.means}</p>
                    </section>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {TOPIC_KEYS.map((k) => (
                            <section key={k}>
                                <h3 className={`border-t-4 ${TOPIC_BAR[k]} pt-2 text-sm font-black uppercase tracking-wider text-rr-dark`}>
                                    {PATH.modal[k]} <span className="text-rr-charcoal">· {c[k].length}</span>
                                </h3>
                                <ul className="mt-2 space-y-2">
                                    {c[k].map((t) => <li key={t} className="text-[15px] text-rr-dark font-medium leading-snug">{t}</li>)}
                                </ul>
                            </section>
                        ))}
                    </div>

                    <section>
                        <H>{PATH.modal.byTheEnd(p.name)}</H>
                        <ul className="space-y-2">
                            {c.byTheEnd.map((t) => (
                                <li key={t} className="flex items-start gap-2.5 text-[15px] text-rr-dark font-medium leading-snug">
                                    <Check className="w-5 h-5 text-rr-pink shrink-0" strokeWidth={3} aria-hidden="true" />{t}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="border-l-4 border-rr-pink pl-4">
                        <H>{PATH.modal.feel}</H>
                        <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed">{p.feel}</p>
                    </section>

                    <section>
                        <H>{PATH.modal.badges}</H>
                        {p.key === 'discover'
                            ? <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 mt-3">{BADGES.discover.slice(0, 4).map((b) => <BadgeMedal key={b.name} b={b} />)}</ul>
                            : <p className="text-[15px] font-medium text-rr-charcoal"><Rich v={PATH.modal.badgesNotWritten} /></p>}
                        <p className="mt-4 text-sm font-semibold text-rr-dark"><Rich v={BADGE_COPY.starts} /></p>
                    </section>

                    <section className="flex items-start gap-3">
                        <Award className="w-8 h-8 text-rr-pink shrink-0" aria-hidden="true" />
                        <div>
                            <H>{PATH.certificate(p.name)}</H>
                            <p className="text-[16px] font-bold text-rr-dark leading-snug">“{c.certificate}”</p>
                        </div>
                    </section>

                    <p className="text-[15px] font-bold text-rr-dark">{c.next}</p>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
                    {prev ? (
                        <button type="button" onClick={() => onNav(-1)} className="inline-flex items-center gap-1.5 min-h-[44px] px-3 font-black text-sm uppercase tracking-wider text-rr-dark">
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {prev.name}
                        </button>
                    ) : <span />}
                    <button type="button" onClick={onClose} className="min-h-[44px] px-4 text-sm font-bold text-rr-charcoal underline underline-offset-4">{PATH.modal.close}</button>
                    {next ? (
                        <button type="button" onClick={() => onNav(1)} className="inline-flex items-center gap-1.5 min-h-[44px] px-3 font-black text-sm uppercase tracking-wider text-rr-dark">
                            {next.name} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    ) : <span />}
                </div>
            </div>
        </div>,
        document.body,
    );
};

// ── The pathway: ruler + three stage cards + what comes after ──
export const StageJourney = () => {
    const [open, setOpen] = useState(null);
    return (
        <>
            <AgeRuler />
            <p className="text-sm font-bold text-rr-charcoal mb-3">{PATH.tapHint}</p>
            <div className="grid md:grid-cols-3 gap-4">
                {PHASES.map((p, i) => <StageCard key={p.key} p={p} i={i} onOpen={setOpen} />)}
            </div>
            {AFTER.map((a) => (
                <div key={a.name} className="mt-4 rounded-2xl border-2 border-dashed border-rr-dark px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <p className="text-xl font-black uppercase text-rr-dark">13+ · {a.name}</p>
                    <p className="text-[15px] font-medium text-rr-charcoal">
                        {a.note}{' '}
                        <Link to={PATH.older.link.to} className="text-rr-dark font-bold underline underline-offset-2 decoration-rr-pink">{PATH.older.link.label}</Link>
                    </p>
                </div>
            ))}
            {open !== null && (
                <StageModal index={open} onClose={() => setOpen(null)}
                    onNav={(d) => setOpen((x) => Math.min(PHASES.length - 1, Math.max(0, x + d)))} />
            )}
        </>
    );
};

// ── Skill badges ──
export const BadgeBlock = () => (
    <div className="mt-14 border-t-2 border-rr-dark pt-10">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-rr-dark mb-2">{BADGE_COPY.eyebrow}</p>
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-rr-dark">{BADGE_COPY.title}</h3>
        <p className="mt-3 text-[15px] font-semibold text-rr-dark"><Rich v={BADGE_COPY.starts} /></p>
        <p className="mt-2 text-[16px] font-medium text-rr-dark leading-relaxed max-w-3xl">{BADGE_COPY.what}</p>
        <ol className="mt-6 grid sm:grid-cols-3 gap-6">
            {BADGE_COPY.steps.map((s) => (
                <li key={s.n} className="border-t-4 border-rr-pink pt-3">
                    <span className="text-3xl font-black text-rr-pink leading-none">{s.n}</span>
                    <p className="mt-1 font-black text-rr-dark">{s.title}</p>
                    <p className="text-[15px] font-medium text-rr-charcoal leading-snug mt-0.5">{s.body}</p>
                </li>
            ))}
        </ol>
        <p className="mt-10 text-sm font-black uppercase tracking-wider text-rr-dark">{BADGE_COPY.sampleTitle}</p>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-7">
            {BADGES.discover.map((b) => <BadgeMedal key={b.name} b={b} />)}
        </ul>
        <p className="mt-8 text-[15px] font-medium text-rr-dark leading-relaxed max-w-3xl">{BADGE_COPY.perYear}</p>
        <ul className="mt-4 space-y-2 max-w-3xl">
            {BADGE_COPY.rules.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[15px] text-rr-charcoal font-medium leading-snug">
                    <Check className="w-5 h-5 text-rr-pink shrink-0" strokeWidth={3} aria-hidden="true" />{r}
                </li>
            ))}
        </ul>

        <h4 className="mt-12 text-xl sm:text-2xl font-black uppercase tracking-tight text-rr-dark">{BADGE_COPY.certificateTitle}</h4>
        <p className="mt-2 text-[16px] font-medium text-rr-dark max-w-3xl">{BADGE_COPY.certificate}</p>
        <ol className="mt-5 grid md:grid-cols-3 gap-4">
            {PHASES.map((p, i) => (
                <li key={p.key} className={`rounded-2xl border-2 ${STAGE[i].border} bg-white px-5 py-4`}>
                    <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-rr-dark">
                        <Award className="w-5 h-5 text-rr-pink" aria-hidden="true" /> {p.name} · ages {p.ages}
                    </p>
                    <p className="mt-2 text-[15px] font-semibold text-rr-dark leading-snug">“{CURRICULUM[p.key].certificate}”</p>
                </li>
            ))}
        </ol>
    </div>
);
