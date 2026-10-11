import React, { useId } from 'react';

// ─────────────────────────────────────────────────────────────
// Junior Royals skill badges — one piece of artwork per badge (Alex, 11 Oct 2026:
// "unique context-aware badges for every badge … distinctly Royals-branded").
//
// Brand rules followed (rra-brand skill):
// - Fill: the signature Royals gradient (navy → blue → pink). Navy only ever
//   appears inside the gradient. No gold.
// - Artwork: the Royals icon style — single stroke, curved edges, ONE colour
//   (white). Movement is shown with the Royals arrow device (same width
//   everywhere, never more than 3 on a badge, counting the chevron at the top).
// - The Royals logo is never redrawn or placed inside a badge (logo law).
// - Shape tells the discipline at a glance, without relying on colour:
//   shield = batting, circle = bowling, hexagon = fielding.
// Each drawing shows the skill itself, so a player can read a badge they have
// not seen before. viewBox 0 0 100 100; artwork sits inside about 24–76.
// ─────────────────────────────────────────────────────────────

const W = '#FFFFFF';
const line = { stroke: W, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const thin = { ...line, strokeWidth: 2.2 };

// ── Drawing parts ──
const Ball = ({ x, y, r = 5 }) => <circle cx={x} cy={y} r={r} fill={W} />;
const Stumps = ({ x, y, h = 24, gap = 5 }) => (
    <g {...line} strokeWidth={2.8}>
        <line x1={x - gap} y1={y} x2={x - gap} y2={y - h} />
        <line x1={x} y1={y} x2={x} y2={y - h} />
        <line x1={x + gap} y1={y} x2={x + gap} y2={y - h} />
        <line x1={x - gap - 1.5} y1={y - h - 2.5} x2={x + gap + 1.5} y2={y - h - 2.5} strokeWidth={2.2} />
    </g>
);
const Bat = ({ x, y, rot = 0, len = 34 }) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <rect x={-4.5} y={-len / 2 + 11} width={9} height={len - 11} rx={3} fill={W} />
        <rect x={-1.6} y={-len / 2} width={3.2} height={13} rx={1.6} fill={W} />
    </g>
);
// The Royals arrow: one stroke, same width everywhere.
const Arrow = ({ x1, y1, x2, y2, dash }) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 6;
    const p = (d) => `${x2 - h * Math.cos(a + d)},${y2 - h * Math.sin(a + d)}`;
    return (
        <g {...line}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dash} />
            <polyline points={`${p(-0.55)} ${x2},${y2} ${p(0.55)}`} />
        </g>
    );
};
const Cone = ({ x, y }) => <path d={`M${x - 5.5} ${y} L${x} ${y - 10} L${x + 5.5} ${y} Z`} fill={W} />;
const Target = ({ x, y, r = 10 }) => (
    <g {...thin}><circle cx={x} cy={y} r={r} /><circle cx={x} cy={y} r={r * 0.5} /><circle cx={x} cy={y} r={1.6} fill={W} stroke="none" /></g>
);
const Ground = ({ x1 = 26, x2 = 74, y = 74 }) => <line {...thin} x1={x1} y1={y} x2={x2} y2={y} />;
const Player = ({ x, y }) => (
    <g {...line}><circle cx={x} cy={y - 9} r={4} fill={W} stroke="none" /><path d={`M${x} ${y - 4} V${y + 6} M${x - 5} ${y} H${x + 5}`} /></g>
);

// ── The 28 drawings ──
const ART = {
    // BATTING
    'Two Vs': () => (
        <>
            <rect x="42" y="52" width="16" height="25" rx="4.5" fill={W} />
            <rect x="43.5" y="22" width="13" height="32" rx="5" fill={W} />
            <polyline points="46.5,28 50,33 53.5,28" stroke="#1226AA" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="46.5,39 50,44 53.5,39" stroke="#1226AA" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path {...thin} d="M34 30 L39 33 M34 41 L39 44 M66 30 L61 33 M66 41 L61 44" />
        </>
    ),
    'Heel to Toe': () => (
        <>
            <Ground />
            <path d="M30 74 V61 Q30 55 36 55 H45 L59 65 Q65 67 65 74 Z" fill={W} />
            <Arrow x1={31} y1={45} x2={62} y2={45} />
            <Ball x={71} y={69} r={4.5} />
        </>
    ),
    'Through the Gate': () => (
        <>
            <Cone x={34} y={56} /><Cone x={66} y={56} />
            <Arrow x1={50} y1={66} x2={50} y2={26} />
            <Ball x={50} y={72} />
        </>
    ),
    'Bounce and Hit': () => (
        <>
            <Ground />
            <path {...thin} strokeDasharray="1 5" d="M26 34 Q36 40 42 73 Q48 52 58 46" />
            <Ball x={59} y={45} />
            <Bat x={69} y={54} rot={-32} len={32} />
        </>
    ),
    'Guard the Stumps': () => (
        <>
            <Stumps x={66} y={74} h={26} />
            <Bat x={50} y={57} len={36} />
            <Ball x={35} y={69} />
            <circle {...thin} cx="35" cy="69" r="9.5" strokeDasharray="2 4" />
        </>
    ),
    'Hit or Block': () => (
        <>
            <Ball x={31} y={38} /><Arrow x1={40} y1={38} x2={72} y2={38} />
            <line {...thin} x1="28" y1="50" x2="72" y2="50" strokeDasharray="1 5" />
            <Ball x={31} y={63} /><line {...line} strokeWidth="5" x1="44" y1="55" x2="44" y2="71" />
        </>
    ),
    'Rock Back': () => (
        <>
            <Ball x={67} y={29} />
            <Bat x={50} y={52} rot={38} len={38} />
            <path {...line} d="M66 72 Q50 82 34 70" />
            <polyline {...line} points="36,78 33,69 42,68" />
        </>
    ),
    'Line Up, Hit': () => (
        <>
            <Stumps x={50} y={76} h={18} />
            <Arrow x1={46} y1={50} x2={28} y2={30} dash="1 5" />
            <Arrow x1={54} y1={50} x2={72} y2={30} />
            <Ball x={64} y={54} r={4.5} />
        </>
    ),
    'Rock or Step': () => (
        <>
            <Arrow x1={42} y1={48} x2={42} y2={27} />
            <Arrow x1={42} y1={54} x2={42} y2={75} />
            <ellipse cx="60" cy="38" rx="5" ry="9" fill={W} />
            <ellipse cx="60" cy="64" rx="5" ry="9" fill={W} />
        </>
    ),
    'Call It': () => (
        <>
            <path d="M26 30 H68 Q74 30 74 36 V54 Q74 60 68 60 H46 L36 71 V60 H32 Q26 60 26 54 Z" fill={W} />
            <text x="50" y="50.5" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="13.5" fill="#1226AA">YES!</text>
        </>
    ),
    'Gap and Go': () => (
        <>
            <Player x={31} y={36} /><Player x={69} y={36} />
            <Arrow x1={50} y1={62} x2={50} y2={24} />
            <Ball x={50} y={68} r={4.5} />
            <polyline {...line} points="34,74 40,78 34,82" /><polyline {...line} points="60,74 66,78 60,82" />
        </>
    ),
    'Chase Together': () => (
        <>
            <Bat x={50} y={56} rot={-32} len={40} />
            <Bat x={50} y={56} rot={32} len={40} />
            <Ball x={50} y={27} r={5.5} />
        </>
    ),
    // BOWLING
    'Straight to the Target': () => (
        <>
            <Target x={68} y={38} r={11} />
            <Ball x={30} y={66} r={6} />
            <Arrow x1={38} y1={60} x2={57} y2={46} />
        </>
    ),
    'Keeper’s Gloves': () => (
        <>
            <path d="M30 50 Q30 40 38 40 H44 Q48 40 48 46 V62 Q48 70 40 70 H38 Q30 70 30 62 Z" fill={W} />
            <path d="M70 50 Q70 40 62 40 H56 Q52 40 52 46 V62 Q52 70 60 70 H62 Q70 70 70 62 Z" fill={W} />
            <circle cx="50" cy="55" r="5.5" fill="#1226AA" />
            <Arrow x1={50} y1={20} x2={50} y2={34} />
        </>
    ),
    'Base of the Stump': () => (
        <>
            <Stumps x={56} y={72} h={34} gap={6} />
            <Ball x={41} y={67} r={5.5} />
            <path {...thin} d="M31 60 L26 56 M30 68 H24 M32 76 L27 80" />
        </>
    ),
    'Two the Same': () => (
        <>
            <Ball x={30} y={38} /><Arrow x1={39} y1={38} x2={72} y2={38} />
            <Ball x={30} y={62} /><Arrow x1={39} y1={62} x2={72} y2={62} />
        </>
    ),
    'Length Ladder': () => (
        <>
            <Stumps x={72} y={72} h={22} gap={4} />
            <Ground x1={24} x2={64} y={72} />
            <path {...thin} d="M56 72 Q60 54 66 60" />
            <path {...thin} d="M43 72 Q52 40 66 54" />
            <path {...thin} d="M30 72 Q44 26 66 48" />
            <Ball x={30} y={72} r={3.6} /><Ball x={43} y={72} r={3.6} /><Ball x={56} y={72} r={3.6} />
        </>
    ),
    'Jog and Bowl': () => (
        <>
            <circle cx="44" cy="34" r="5" fill={W} />
            <path {...line} d="M45 40 L43 56 L34 70 M43 56 L53 66 M45 44 L55 32" />
            <Ball x={59} y={27} r={4.5} />
            <path {...thin} d="M24 44 H32 M22 54 H30 M24 64 H30" />
            <Arrow x1={62} y1={44} x2={78} y2={44} />
        </>
    ),
    'Seam Up': () => (
        <>
            <circle cx="50" cy="52" r="21" fill={W} />
            <path d="M46 32 Q41 52 46 72 M54 32 Q59 52 54 72" stroke="#E11F8F" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M43 40 H40 M42.5 48 H39.5 M42.5 56 H39.5 M43 64 H40 M57 40 H60 M57.5 48 H60.5 M57.5 56 H60.5 M57 64 H60" stroke="#E11F8F" strokeWidth="1.8" strokeLinecap="round" />
        </>
    ),
    'One Stump': () => (
        <>
            <line {...thin} x1="32" y1="74" x2="32" y2="44" strokeDasharray="1 5" />
            <line {...thin} x1="46" y1="74" x2="46" y2="44" strokeDasharray="1 5" />
            <line {...line} strokeWidth="4" x1="64" y1="74" x2="64" y2="38" />
            <line {...line} x1="59" y1="35" x2="69" y2="35" />
            <Ball x={54} y={60} r={5} />
            <path {...thin} d="M46 54 L41 50 M45 62 H39" />
        </>
    ),
    'Beat the Bat': () => (
        <>
            <Bat x={44} y={58} len={34} />
            <Stumps x={68} y={74} h={22} gap={4} />
            <path {...thin} strokeDasharray="1 5" d="M24 34 Q56 28 60 56" />
            <Ball x={60} y={58} r={4.5} />
        </>
    ),
    'Tidy Over': () => (
        <>
            {[34, 50, 66].map((x) => <Ball key={`a${x}`} x={x} y={38} r={5.2} />)}
            {[34, 50, 66].map((x) => <Ball key={`b${x}`} x={x} y={54} r={5.2} />)}
            <polyline {...line} points="40,70 47,77 61,65" />
        </>
    ),
    'Partner’s Pick': () => (
        <>
            <Target x={30} y={38} r={8} /><Target x={70} y={38} r={8} />
            <circle cx="50" cy="38" r="9.5" fill={W} />
            <circle cx="50" cy="38" r="3.4" fill="#1226AA" />
            <Arrow x1={50} y1={76} x2={50} y2={55} />
        </>
    ),
    'Last Over': () => (
        <>
            {[30, 38, 46, 54, 62].map((x) => <circle key={x} cx={x} cy="27" r="2.6" fill={W} opacity=".45" />)}
            <circle cx="70" cy="27" r="3.6" fill={W} />
            <Stumps x={54} y={76} h={22} />
            <path {...thin} d="M46 46 L40 40 M62 46 L68 40" />
            <Ball x={38} y={64} r={5} />
        </>
    ),
    // FIELDING
    'Safe Hands': () => (
        <>
            <path {...line} strokeWidth="5" d="M29 50 Q29 75 50 75 Q71 75 71 50" />
            <Ball x={50} y={56} r={8} />
            <Arrow x1={50} y1={22} x2={50} y2={38} />
        </>
    ),
    'Stump Hitter': () => (
        <>
            <Stumps x={66} y={74} h={26} />
            <Ground x1={24} x2={52} y={74} />
            <Arrow x1={30} y1={66} x2={50} y2={56} />
            <Ball x={56} y={53} r={5} />
            <path {...thin} d="M58 42 L60 36 M66 42 V36" />
        </>
    ),
    'Back Me Up': () => (
        <>
            <Stumps x={50} y={72} h={20} gap={4} />
            <Player x={26} y={56} />
            <Player x={76} y={56} />
            <Arrow x1={33} y1={40} x2={66} y2={40} />
        </>
    ),
    'Run-out Ready': () => (
        <>
            <Stumps x={60} y={74} h={22} />
            <path {...line} d="M52 44 L46 38 M68 44 L74 38" />
            <Arrow x1={26} y1={46} x2={46} y2={58} />
            <Ball x={50} y={60} r={4.8} />
            <Ground x1={28} x2={78} y={78} />
        </>
    ),
};

// ── Badge shapes: one per discipline ──
const SHAPE = {
    bat: 'M50 3 L91 15 V52 C91 74 73 91 50 98 C27 91 9 74 9 52 V15 Z',
    bowl: 'M50 3 A47 47 0 1 1 49.99 3 Z',
    field: 'M50 3 L91 26 V74 L50 97 L9 74 V26 Z',
};
export const KIND_LABEL = { bat: 'Batting', bowl: 'Bowling', field: 'Fielding' };

// One badge. `earned={false}` draws the "working on it" state (outline only).
export const Badge = ({ name, kind, earned = true, className = 'w-20 h-20' }) => {
    const id = useId().replace(/:/g, '');
    const Art = ART[name];
    return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${name} badge (${KIND_LABEL[kind]})`}>
            <defs>
                <linearGradient id={`g${id}`} x1="0.15" y1="0" x2="0.85" y2="1">
                    <stop offset="0" stopColor="#001D48" /><stop offset="0.35" stopColor="#1226AA" /><stop offset="1" stopColor="#E11F8F" />
                </linearGradient>
            </defs>
            <path d={SHAPE[kind]} fill={earned ? `url(#g${id})` : 'none'} stroke={W} strokeWidth="2.5" strokeLinejoin="round" />
            <path d={SHAPE[kind]} fill="none" stroke={W} strokeWidth="1" opacity=".4" transform="translate(50 50) scale(0.9) translate(-50 -50)" />
            {/* The Royals arrow at the head of every badge */}
            <polyline points="44,15.5 50,10.5 56,15.5" stroke={W} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <g opacity={earned ? 1 : 0.55}>{Art ? <Art /> : null}</g>
        </svg>
    );
};

export const hasArt = (name) => Boolean(ART[name]);
