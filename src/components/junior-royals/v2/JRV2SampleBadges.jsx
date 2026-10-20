import React from 'react';
import { Badge, hasArt } from './JRV2Badges';
import { approvedBadge } from './jrV2BadgeArt';

// ─────────────────────────────────────────────────────────────
// Example badges for Develop and Elevate (Alex, 12 Oct 2026: "make sure you put
// the Develop and Elevate sample badges in there as well").
//
// The 28 Discover badges are drawn in JRV2Badges.jsx, which is being reworked
// badge by badge in a separate piece of work. So that file is not touched here:
// a Develop or Elevate example uses its frame (shape, gradient, ribbon) by asking
// <Badge> for a name it has no picture for, and this file lays its own picture on
// top. When the Develop and Elevate sets are written properly, these four move
// into JRV2Badges.jsx and this file goes.
//
// Every badge Alex has approved (all three phases, with the Melbourne logo, 20 Oct
// 2026, jrV2BadgeArt.js) shows that artwork instead of a drawing, so the Develop
// and Elevate examples below are only drawn if a badge has no approved artwork.
//
// Same drawing rules as the Discover set: a player doing the skill, white
// pictogram on the Royals gradient, pink only on the ball's seam; viewBox
// 0 0 120 120; the scene sits inside about x 22–98, y 18–86.
// ─────────────────────────────────────────────────────────────

const W = '#FFFFFF';
const PINK = '#E11F8F';
const BLUE = '#1226AA';
const cap = { strokeLinecap: 'round', strokeLinejoin: 'round' };
const thin = { stroke: W, strokeWidth: 2, fill: 'none', ...cap };
const pts = (...p) => p.map(([x, y]) => `${x},${y}`).join(' ');
// With no ribbon the picture drops into the middle of the badge (as in JRV2Badges).
const DROP = { bat: 5, bowl: 7, field: 7 };

const Ball = ({ x, y, r = 4.6 }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill={W} />
        <path d={`M${x - r * 0.25} ${y - r * 0.85} Q${x + r * 0.5} ${y} ${x - r * 0.25} ${y + r * 0.85}`} stroke={PINK} strokeWidth={Math.max(1, r * 0.26)} fill="none" strokeLinecap="round" />
    </g>
);
const Stumps = ({ x, y = 85, h = 26, gap = 5.5 }) => (
    <g stroke={W} fill="none" {...cap}>
        {[-gap, 0, gap].map((d) => <line key={d} x1={x + d} y1={y} x2={x + d} y2={y - h} strokeWidth="3" />)}
        <line x1={x - gap - 0.5} y1={y - h - 2.6} x2={x - 0.8} y2={y - h - 2.6} strokeWidth="2.2" /><line x1={x + 0.8} y1={y - h - 2.6} x2={x + gap + 0.5} y2={y - h - 2.6} strokeWidth="2.2" />
    </g>
);
const Ground = ({ x1 = 22, x2 = 98, y = 86 }) => <line {...thin} x1={x1} y1={y} x2={x2} y2={y} />;
const Bat = ({ from, to }) => {
    const [x1, y1] = from; const [x2, y2] = to;
    const mx = x1 + (x2 - x1) * 0.3; const my = y1 + (y2 - y1) * 0.3;
    return <g stroke={W} {...cap}><line x1={x1} y1={y1} x2={mx} y2={my} strokeWidth="2.8" /><line x1={mx} y1={my} x2={x2} y2={y2} strokeWidth="6.4" /></g>;
};
const Arrow = ({ x1, y1, x2, y2, w = 2.6, dash, head = 5.5 }) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const p = (d) => `${x2 - head * Math.cos(a + d)},${y2 - head * Math.sin(a + d)}`;
    return <g stroke={W} strokeWidth={w} fill="none" {...cap}><line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dash} /><polyline points={`${p(-0.55)} ${x2},${y2} ${p(0.55)}`} /></g>;
};
const Word = ({ x, y, size = 9, fill = W, children }) => (
    <text x={x} y={y} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={size} fill={fill} letterSpacing="0.3">{children}</text>
);
const Mini = ({ x, y }) => (
    <g stroke={W} fill="none" strokeWidth="3.6" {...cap}>
        <circle cx={x} cy={y - 10} r="4.2" fill={W} stroke="none" />
        <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
        <polyline points={`${x - 7},${y + 3} ${x - 5},${y - 3.5} ${x + 5},${y - 3.5} ${x + 7},${y + 3}`} />
        <polyline points={`${x - 4.5},${y + 13} ${x},${y + 4} ${x + 4.5},${y + 13}`} />
    </g>
);
const Fig = ({ head, sh, hip, kF, fF, kB, fB, eF, hF, eB, hB, f = 1 }) => (
    <g stroke={W} fill="none" {...cap}>
        <polyline points={pts(hip, kB, fB)} strokeWidth="5.2" />
        <line x1={fB[0]} y1={fB[1]} x2={fB[0] + 3.5 * f} y2={fB[1]} strokeWidth="5.2" />
        {eB && <polyline points={pts(sh, eB, hB)} strokeWidth="4.2" />}
        <line x1={sh[0]} y1={sh[1]} x2={hip[0]} y2={hip[1]} strokeWidth="7.4" />
        <polyline points={pts(hip, kF, fF)} strokeWidth="5.2" />
        <line x1={fF[0]} y1={fF[1]} x2={fF[0] + 3.5 * f} y2={fF[1]} strokeWidth="5.2" />
        {eF && <polyline points={pts(sh, eF, hF)} strokeWidth="4.2" />}
        <circle cx={head[0]} cy={head[1]} r="6" fill={W} stroke="none" />
        <path d={`M${head[0] + 3 * f} ${head[1] - 3.2} H${head[0] + 10.5 * f}`} strokeWidth="2.6" />
    </g>
);
const At = ({ x = 0, y = 0, s = 1, children }) => (
    <g transform={`translate(${x} ${y}) translate(60 86) scale(${s}) translate(-60 -86)`}>{children}</g>
);
const POSE = {
    drive: { head: [54, 34], sh: [54, 43], hip: [48, 60], kF: [62, 70], fF: [68, 84], kB: [42, 72], fB: [34, 84], eF: [64, 50], hF: [70, 58], eB: [60, 53], hB: [68, 60] },
    back: { head: [50, 35], sh: [51, 44], hip: [56, 61], kF: [67, 67], fF: [72, 77], kB: [50, 72], fB: [53, 84], eF: [62, 45], hF: [70, 42], eB: [60, 49], hB: [68, 45] },
    swing: { head: [52, 34], sh: [52, 43], hip: [48, 60], kF: [58, 71], fF: [62, 84], kB: [42, 72], fB: [36, 84], eF: [62, 46], hF: [70, 48], eB: [60, 50], hB: [68, 50] },
    jogbowl: { head: [57, 33], sh: [57, 42], hip: [55, 59], kF: [63, 69], fF: [65, 81], kB: [49, 70], fB: [41, 76], eF: [60, 30], hF: [62, 19], eB: [64, 48], hB: [70, 53] },
};

const ART = {
    // Develop, batting. Two batters under FULL and SHORT: forward to the full ball, back to the short one.
    'Forward or Back': () => (
        <>
            <Word x={36} y={27} size={8.4}>FULL</Word><Word x={85} y={27} size={8.4}>SHORT</Word>
            <line {...thin} strokeDasharray="1 4.2" x1="60" y1="20" x2="60" y2="70" />
            <Ground y={73} />
            <At x={-25} y={-13} s={0.62}><Fig {...POSE.drive} /><Bat from={[69, 59]} to={[80, 79]} /></At>
            <Ball x={52} y={68} r={3.6} />
            <At x={17} y={-13} s={0.62}><Fig {...POSE.back} /><Bat from={[69, 43]} to={[88, 35]} /></At>
            <Ball x={98} y={38} r={3.6} />
            <Arrow x1={26} y1={82} x2={48} y2={82} w={4} head={7} /><Arrow x1={94} y1={82} x2={72} y2={82} w={4} head={7} />
        </>
    ),
    // Elevate, batting. The ball comes in and bounces; the batter picks the shot and hits it into the gap between two fielders.
    'Pick the Length': () => (
        <>
            <Ground />
            <At x={-22} s={0.82}><Fig {...POSE.swing} /><Bat from={[69, 49]} to={[86, 42]} /></At>
            <Mini x={70} y={26} /><Mini x={95} y={62} />
            <Arrow x1={63} y1={49} x2={102} y2={33} dash="1 4.2" w={2.2} /><Ball x={87} y={39.5} r={4.6} />
            <path {...thin} strokeDasharray="1 4" d="M106 70 L84 85 Q72 70 63 56" />
            <path {...thin} strokeWidth="2.2" d="M80 85 l-3 -3 M88 85 l3 -3" />
        </>
    ),
    // Develop, bowling. Off a run-up, the ball lands inside the box marked on the pitch.
    'Length Box': () => (
        <>
            <Ground x1={12} x2={108} />
            <At x={-31} y={3} s={0.8}><Fig {...POSE.jogbowl} /></At>
            <Ball x={31} y={31} r={4.2} />
            <path d="M52 86 L59 74 H86 L79 86 Z" fill="none" stroke={W} strokeWidth="2.6" strokeLinejoin="round" />
            <path {...thin} strokeDasharray="1 4.2" d="M37 31 Q62 30 68 74" />
            <Ball x={69} y={79.5} r={4.8} />
            <path {...thin} strokeWidth="2.2" d="M62 70 l-3 -4 M76 70 l3 -4" />
            <Stumps x={99} h={22} gap={4.2} />
        </>
    ),
    // Elevate, bowling. The coach calls a length; the ball lands in that one of three boxes.
    'Length on Demand': () => (
        <>
            <Ground x1={12} x2={108} />
            <path d="M34 15 H72 Q77 15 77 20 V30 Q77 35 72 35 H50 L42 42 L44 35 H34 Q29 35 29 30 V20 Q29 15 34 15 Z" fill={W} />
            <Word x={53} y={28.6} size={9.4} fill={BLUE}>FULL!</Word>
            <At x={-38} y={3} s={0.6}><Fig {...POSE.jogbowl} /></At>
            {[38, 55, 72].map((x, i) => <path key={x} d={`M${x} 86 L${x + 5} 77 H${x + 17} L${x + 12} 86 Z`} fill="none" stroke={W} strokeWidth={i === 2 ? 2.8 : 1.8} strokeDasharray={i === 2 ? undefined : '2.6 2.6'} strokeLinejoin="round" />)}
            <path {...thin} strokeDasharray="1 4.2" d="M27 46 Q62 38 80 74" />
            <Ball x={81} y={80.5} r={4.4} />
            <Stumps x={102} h={20} gap={3.6} />
        </>
    ),
};

// A badge for any phase: Discover badges come straight from JRV2Badges.jsx; a
// Develop or Elevate example is that file's frame with this file's picture on top.
export const PhaseBadge = ({ name, kind, ribbon = false, className = 'w-20 h-20' }) => {
    // The approved artwork carries its own name ribbon, so `ribbon` doesn't apply to it.
    const src = approvedBadge(name);
    if (src) return <img src={src} alt="" className={`${className} object-contain`} loading="lazy" decoding="async" />;
    const Art = ART[name];
    if (hasArt(name) || !Art) return <Badge name={name} kind={kind} ribbon={ribbon} className={className} />;
    return (
        <span className={`relative inline-block ${className}`}>
            <Badge name={name} kind={kind} ribbon={ribbon} className="w-full h-full block" />
            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <g transform={ribbon ? undefined : `translate(0 ${DROP[kind]})`}><Art /></g>
            </svg>
        </span>
    );
};

export const hasSampleArt = (name) => Boolean(approvedBadge(name)) || hasArt(name) || Boolean(ART[name]);
