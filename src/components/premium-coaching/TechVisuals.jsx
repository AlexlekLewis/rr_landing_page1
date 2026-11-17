import React from 'react';

// Example visuals for the "tools in the lane" section (Andy, 18 Nov 2026: "people need to
// see visuals on this page ... more detailed bowling maps, performance partners").
// The bowling map and heat map are ILLUSTRATIONS of what the coach shows in the lane,
// drawn in brand colours and labelled "Example" on the page. Replace each with a real
// screenshot from a session when we have one (put it in public/assets/premium-coaching/
// and swap the component for an <img> in PremiumCoaching.jsx).

const PINK = '#E11F8F';
const BLUE = '#1226AA';
const NAVY = '#001D48';

// Seeded so the dots don't move between renders.
const rand = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ── Bowling map: the pitch from above, every ball where it pitched ──
export const BowlingMap = () => {
    const r = rand(7);
    // x: 0 = middle stump line (negative = leg side, positive = off side), y: metres from batter's stumps
    const balls = [];
    for (let i = 0; i < 22; i++) balls.push({ x: 0.25 + (r() - 0.45) * 0.5, y: 5.2 + (r() - 0.5) * 1.6, good: true });
    for (let i = 0; i < 6; i++) balls.push({ x: (r() - 0.3) * 0.9, y: 2.2 + r() * 1.6, good: false }); // full
    for (let i = 0; i < 6; i++) balls.push({ x: (r() - 0.4) * 0.8, y: 7.4 + r() * 1.8, good: false }); // short
    const W = 300, H = 520, top = 40, mPerPx = 11 / (H - top - 20);
    const px = (x) => W / 2 + x * 110;
    const py = (y) => top + y / mPerPx;
    const band = (from, to, label, fill) => (
        <g key={label}>
            <rect x={70} y={py(from)} width={W - 140} height={py(to) - py(from)} fill={fill} />
            <text x={W - 64} y={(py(from) + py(to)) / 2 + 4} fontSize="11" fontWeight="800" fill="#fff" opacity="0.85">{label}</text>
        </g>
    );
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Example bowling map: most balls pitch on a good length just outside off stump, a few full and a few short">
            <rect width={W} height={H} rx="18" fill={NAVY} />
            <rect x={70} y={top - 10} width={W - 140} height={H - top - 10} fill="#2f7d4a" />
            {band(0, 2, 'YORKER', 'rgba(255,255,255,0.05)')}
            {band(2, 4, 'FULL', 'rgba(255,255,255,0.10)')}
            {band(4, 6.5, 'GOOD', 'rgba(225,31,143,0.55)')}
            {band(6.5, 11, 'SHORT', 'rgba(255,255,255,0.06)')}
            {/* crease and stumps */}
            <line x1={70} x2={W - 70} y1={top} y2={top} stroke="#fff" strokeWidth="2" />
            {[-0.11, 0, 0.11].map((s) => <rect key={s} x={px(s) - 2} y={top - 22} width="4" height="22" fill="#F5C518" />)}
            {balls.map((b, i) => (
                <circle key={i} cx={px(b.x)} cy={py(b.y)} r="6" fill={b.good ? PINK : '#fff'} stroke={b.good ? '#fff' : BLUE} strokeWidth="1.5" opacity="0.95" />
            ))}
            <text x={20} y={H - 14} fontSize="12" fontWeight="800" fill="#fff">22 of 34 on a good length</text>
        </svg>
    );
};

// ── Heat map: where the batter scores, around the ground ──
export const HeatMap = () => {
    const W = 340, H = 340, cx = W / 2, cy = H / 2 + 6, R = 150;
    // runs by direction, clockwise from straight down the ground (0°), off side on the right for a right-hander
    const sectors = [0.55, 0.9, 1.0, 0.7, 0.35, 0.2, 0.15, 0.3, 0.6, 0.45, 0.25, 0.4];
    const arc = (a0, a1, r0, r1) => {
        const p = (a, r) => [cx + r * Math.sin(a), cy + r * Math.cos(a)];
        const [x0, y0] = p(a0, r1), [x1, y1] = p(a1, r1), [x2, y2] = p(a1, r0), [x3, y3] = p(a0, r0);
        return `M${x0},${y0} A${r1},${r1} 0 0 0 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 1 ${x3},${y3} Z`;
    };
    const r = rand(11);
    const shots = Array.from({ length: 16 }, () => {
        let i = Math.floor(r() * sectors.length);
        if (r() > sectors[i]) i = 2; // more shots into the strong areas
        const a = ((i + r()) / sectors.length) * Math.PI * 2;
        const len = 60 + r() * 85;
        return { x: cx + len * Math.sin(a), y: cy + len * Math.cos(a), four: len > 135 };
    });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Example batting heat map: most runs scored square on the off side and straight, very few behind square on the leg side">
            <rect width={W} height={H} rx="18" fill={NAVY} />
            <circle cx={cx} cy={cy} r={R} fill="#2f7d4a" />
            {sectors.map((v, i) => {
                const a0 = (i / sectors.length) * Math.PI * 2, a1 = ((i + 1) / sectors.length) * Math.PI * 2;
                return <path key={i} d={arc(a0, a1, 18, R)} fill={PINK} opacity={0.08 + v * 0.62} />;
            })}
            <circle cx={cx} cy={cy} r={R * 0.55} fill="none" stroke="#fff" strokeDasharray="4 5" opacity="0.6" />
            {shots.map((s, i) => <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={s.four ? '#F5C518' : '#fff'} strokeWidth="1.6" opacity="0.9" />)}
            <rect x={cx - 4} y={cy - 16} width="8" height="32" fill="#c9a96e" />
            <text x={18} y={30} fontSize="12" fontWeight="800" fill="#fff">OFF SIDE →</text>
            <text x={18} y={H - 14} fontSize="12" fontWeight="800" fill="#fff"><tspan fill="#F5C518">■</tspan> boundary  <tspan fill="#fff">■</tspan> runs</text>
        </svg>
    );
};
