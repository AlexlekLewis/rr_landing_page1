import React, { useId } from 'react';

// ─────────────────────────────────────────────────────────────
// Junior Royals skill badges — REDESIGN (Alex, 12 Oct 2026): "A 10-year-old should
// be able to look at them and go, yes, that's exactly the badge that I want."
// So every badge now shows a PLAYER DOING THE SKILL (or a close-up of the hands
// where the skill is in the hands), with the badge's name on a ribbon.
//
// How to check a new or changed badge: show the picture, with no name, to someone
// who has not seen the list and ask which "I can …" line it is for. If they have
// to work it out by elimination, redraw it. One idea per badge; no two badges
// should be the same picture ("ball hits stumps" on its own is not enough).
//
// Brand rules (rra-brand skill): the Royals gradient fill; white pictogram
// artwork with rounded single strokes; pink only on the ball's seam, the two Vs
// and the ribbon; Montserrat Black for words; no gold; the Royals logo is never
// redrawn inside a badge. Shape tells the discipline without relying on colour:
// shield = batting, circle = bowling, hexagon = fielding.
// viewBox 0 0 120 120. Scenes sit inside about x 22–98, y 18–86; the ribbon
// covers y 90–108. With no ribbon the scene drops to the middle (DROP).
// ─────────────────────────────────────────────────────────────

const W = '#FFFFFF';
const PINK = '#E11F8F';
const BLUE = '#1226AA';
const cap = { strokeLinecap: 'round', strokeLinejoin: 'round' };
const thin = { stroke: W, strokeWidth: 2, fill: 'none', ...cap };
const pts = (...p) => p.map(([x, y]) => `${x},${y}`).join(' ');

// ── Parts ──
// A cricket ball: white, with a pink seam so it reads as a cricket ball.
const Ball = ({ x, y, r = 4.6 }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill={W} />
        <path d={`M${x - r * 0.25} ${y - r * 0.85} Q${x + r * 0.5} ${y} ${x - r * 0.25} ${y + r * 0.85}`} stroke={PINK} strokeWidth={Math.max(1, r * 0.26)} fill="none" strokeLinecap="round" />
    </g>
);
// A ball with a number on it (counting balls in an over, or first and second).
const NumBall = ({ x, y, n, r = 7 }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill={W} />
        <path d={`M${x - r * 0.62} ${y - r * 0.6} Q${x - r * 0.25} ${y} ${x - r * 0.62} ${y + r * 0.6}`} stroke={PINK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <text x={x + r * 0.14} y={y + r * 0.42} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={r * 1.2} fill={BLUE}>{n}</text>
    </g>
);
// A small fielder standing ready, seen from the front.
const Mini = ({ x, y }) => (
    <g stroke={W} fill="none" strokeWidth="3.6" {...cap}>
        <circle cx={x} cy={y - 10} r="4.2" fill={W} stroke="none" />
        <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
        <polyline points={`${x - 7},${y + 3} ${x - 5},${y - 3.5} ${x + 5},${y - 3.5} ${x + 7},${y + 3}`} />
        <polyline points={`${x - 4.5},${y + 13} ${x},${y + 4} ${x + 4.5},${y + 13}`} />
    </g>
);
// A big tick.
const Tick = ({ x, y, s: k = 1, w = 3.6 }) => <polyline stroke={W} strokeWidth={w} fill="none" {...cap} points={`${x - 6 * k},${y} ${x - 1.5 * k},${y + 4.5 * k} ${x + 7 * k},${y - 5 * k}`} />;
// Speed lines behind a moving ball or player.
const Speed = ({ x, y, len = 9, n = 3, gap = 4, dir = -1 }) => (
    <g {...thin}>{Array.from({ length: n }).map((_, i) => <line key={i} x1={x} y1={y + (i - (n - 1) / 2) * gap} x2={x + dir * (len - Math.abs(i - (n - 1) / 2) * 2.5)} y2={y + (i - (n - 1) / 2) * gap} />)}</g>
);
const Stumps = ({ x, y = 85, h = 26, gap = 5.5, bails = true }) => (
    <g stroke={W} fill="none" {...cap}>
        {[-gap, 0, gap].map((d) => <line key={d} x1={x + d} y1={y} x2={x + d} y2={y - h} strokeWidth="3" />)}
        {bails && <><line x1={x - gap - 0.5} y1={y - h - 2.6} x2={x - 0.8} y2={y - h - 2.6} strokeWidth="2.2" /><line x1={x + 0.8} y1={y - h - 2.6} x2={x + gap + 0.5} y2={y - h - 2.6} strokeWidth="2.2" /></>}
    </g>
);
// Bails flying off: the stumps have been hit.
const BailsOff = ({ x, y }) => (
    <g stroke={W} strokeWidth="2.2" fill="none" {...cap}>
        <line x1={x - 9} y1={y - 5} x2={x - 3} y2={y - 9} /><line x1={x + 3} y1={y - 10} x2={x + 9} y2={y - 6} />
        <path d={`M${x - 12} ${y + 2} l-4 -3 M${x + 12} ${y + 1} l4 -3 M${x} ${y - 14} v-4`} strokeWidth="1.8" />
    </g>
);
const Ground = ({ x1 = 22, x2 = 98, y = 86 }) => <line {...thin} x1={x1} y1={y} x2={x2} y2={y} />;
const Cone = ({ x, y, s = 1 }) => (
    <g>
        <path d={`M${x - 5 * s} ${y} L${x} ${y - 11 * s} L${x + 5 * s} ${y} Z`} fill={W} /><rect x={x - 7 * s} y={y - 1} width={14 * s} height={2.6} rx="1.3" fill={W} />
        <line x1={x - 2.6 * s} y1={y - 5.4 * s} x2={x + 2.6 * s} y2={y - 5.4 * s} stroke={BLUE} strokeWidth={1.5 * s} />
    </g>
);
const Target = ({ x, y, r = 9, hit }) => (
    <g {...thin}><circle cx={x} cy={y} r={r} fill={hit ? W : 'none'} /><circle cx={x} cy={y} r={r * 0.55} stroke={hit ? BLUE : W} /><circle cx={x} cy={y} r={1.8} fill={hit ? BLUE : W} stroke="none" /></g>
);
// A bat: thin handle, wide blade.
const Bat = ({ from, to }) => {
    const [x1, y1] = from; const [x2, y2] = to;
    const mx = x1 + (x2 - x1) * 0.3; const my = y1 + (y2 - y1) * 0.3;
    return (
        <g stroke={W} {...cap}><line x1={x1} y1={y1} x2={mx} y2={my} strokeWidth="2.8" /><line x1={mx} y1={my} x2={x2} y2={y2} strokeWidth="6.4" /></g>
    );
};
const Arrow = ({ x1, y1, x2, y2, w = 2.6, dash, head = 5.5 }) => {
    const a = Math.atan2(y2 - y1, x2 - x1); const h = head;
    const p = (d) => `${x2 - h * Math.cos(a + d)},${y2 - h * Math.sin(a + d)}`;
    return (
        <g stroke={W} strokeWidth={w} fill="none" {...cap}><line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dash} /><polyline points={`${p(-0.55)} ${x2},${y2} ${p(0.55)}`} /></g>
    );
};
const Word = ({ x, y, size = 9, fill = W, children }) => (
    <text x={x} y={y} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={size} fill={fill} letterSpacing="0.3">{children}</text>
);

// ── The player: a pictogram figure with rounded limbs and a cap ──
// Joints are [x, y]. `f` = the way the player faces (1 = right, -1 = left).
// kF/fF = front knee/foot, kB/fB = back; eF/hF = front elbow/hand, eB/hB = back.
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
// Place a figure (and anything drawn with it) and scale it about its feet.
const At = ({ x = 0, y = 0, s = 1, flip, children }) => (
    <g transform={`translate(${x} ${y}) translate(60 86) scale(${flip ? -s : s} ${s}) translate(-60 -86)`}>{children}</g>
);

// Poses (facing right, feet on y = 85).
const POSE = {
    stance: { head: [58, 33], sh: [58, 42], hip: [54, 60], kF: [64, 71], fF: [66, 84], kB: [50, 72], fB: [46, 84], eF: [66, 50], hF: [70, 58], eB: [62, 52], hB: [68, 60] },
    drive: { head: [54, 34], sh: [54, 43], hip: [48, 60], kF: [62, 70], fF: [68, 84], kB: [42, 72], fB: [34, 84], eF: [64, 50], hF: [70, 58], eB: [60, 53], hB: [68, 60] },
    swing: { head: [52, 34], sh: [52, 43], hip: [48, 60], kF: [58, 71], fF: [62, 84], kB: [42, 72], fB: [36, 84], eF: [62, 46], hF: [70, 48], eB: [60, 50], hB: [68, 50] },
    back: { head: [50, 35], sh: [51, 44], hip: [56, 61], kF: [67, 67], fF: [72, 77], kB: [50, 72], fB: [53, 84], eF: [62, 45], hF: [70, 42], eB: [60, 49], hB: [68, 45] },
    run: { head: [60, 32], sh: [58, 41], hip: [52, 58], kF: [64, 66], fF: [70, 77], kB: [44, 68], fB: [34, 66], eF: [68, 47], hF: [72, 41], eB: [50, 50], hB: [44, 46] },
    bowl: { head: [56, 36], sh: [56, 45], hip: [54, 62], kF: [62, 73], fF: [66, 84], kB: [46, 73], fB: [40, 82], eF: [61, 33], hF: [64, 22], eB: [64, 51], hB: [70, 56] },
    thrown: { head: [54, 35], sh: [54, 44], hip: [52, 61], kF: [62, 72], fF: [66, 84], kB: [44, 72], fB: [38, 84], eF: [64, 40], hF: [73, 37], eB: [46, 49], hB: [42, 55] },
    shout: { head: [56, 34], sh: [56, 43], hip: [56, 62], kF: [60, 73], fF: [62, 84], kB: [52, 73], fB: [50, 84], eF: [65, 45], hF: [64, 35], eB: [50, 52], hB: [48, 60] },
    stand: { head: [56, 34], sh: [56, 43], hip: [56, 62], kF: [60, 73], fF: [62, 84], kB: [52, 73], fB: [50, 84], eF: [64, 48], hF: [72, 44], eB: [50, 52], hB: [48, 60] },
    finish: { head: [54, 34], sh: [54, 43], hip: [48, 60], kF: [62, 70], fF: [68, 84], kB: [42, 72], fB: [34, 84], eF: [64, 44], hF: [71, 37], eB: [62, 48], hB: [69, 40] },
    hit: { head: [52, 34], sh: [52, 43], hip: [48, 60], kF: [58, 71], fF: [62, 84], kB: [42, 72], fB: [36, 84], eF: [61, 50], hF: [68, 55], eB: [58, 53], hB: [66, 57] },
    jogbowl: { head: [57, 33], sh: [57, 42], hip: [55, 59], kF: [63, 69], fF: [65, 81], kB: [49, 70], fB: [41, 76], eF: [60, 30], hF: [62, 19], eB: [64, 48], hB: [70, 53] },
    pickup: { head: [57, 43], sh: [54, 51], hip: [44, 64], kF: [55, 71], fF: [53, 84], kB: [38, 77], fB: [28, 84], eF: [60, 62], hF: [62, 74], eB: [48, 60], hB: [44, 68] },
    ready: { head: [56, 36], sh: [56, 45], hip: [55, 62], kF: [61, 73], fF: [62, 84], kB: [50, 73], fB: [47, 84], eF: [64, 52], hF: [73, 49], eB: [63, 56], hB: [72, 56] },
    side: { head: [60, 31], sh: [60, 40], hip: [60, 58], kF: [67, 70], fF: [70, 84], kB: [53, 70], fB: [48, 84], eF: [68, 46], hF: [74, 52], eB: [66, 49], hB: [73, 54] },
    point: { head: [56, 34], sh: [56, 43], hip: [56, 62], kF: [60, 73], fF: [62, 84], kB: [52, 73], fB: [50, 84], eF: [66, 43], hF: [77, 41], eB: [50, 52], hB: [48, 60] },
};

// ── The 28 scenes ──
const ART = {
    // ── BATTING ──
    // The player's own view of the bat: two hands wrapped round the handle, thumb and finger making a V on each.
    'Two Vs': () => (
        <>
            <path d="M47 0 H73 V20 L66 27 H54 L47 20 Z" fill={W} />
            <rect x="56.5" y="24" width="7" height="76" rx="3" fill={W} />
            <line x1="77" y1="50" x2="112" y2="82" stroke={W} strokeWidth="12" strokeLinecap="round" />
            <line x1="43" y1="78" x2="8" y2="104" stroke={W} strokeWidth="12" strokeLinecap="round" />
            {[30, 58].map((y) => (
                <g key={y}>
                    {[0, 1, 2].map((i) => <rect key={i} x="44" y={y + 12.2 + i * 5.2} width="32" height="4.4" rx="2.2" fill={W} />)}
                    <polyline points={`50,${y + 0.5} 60,${y + 10} 70,${y + 0.5}`} stroke={W} strokeWidth="9" fill="none" {...cap} />
                    <polyline points={`50,${y + 0.5} 60,${y + 10} 70,${y + 0.5}`} stroke={PINK} strokeWidth="5.4" fill="none" {...cap} />
                </g>
            ))}
        </>
    ),
    // A front-foot drive, finish held with the bat high: the ball runs away along the ground.
    'Heel to Toe': () => (
        <>
            <Ground />
            <At x={-18}><Fig {...POSE.finish} /><Bat from={[70, 38]} to={[83, 20]} /></At>
            <line {...thin} strokeDasharray="1 4.2" x1="58" y1="81" x2="80" y2="81" />
            <Speed x={90} y={81} len={8} n={3} gap={3.6} />
            <Ball x={97} y={81} r={4.8} />
        </>
    ),
    // Looking back through the gate: the ball comes straight between the two cones.
    'Through the Gate': () => (
        <>
            <At x={-10} y={-32} s={0.62}><Fig {...POSE.drive} /><Bat from={[69, 59]} to={[80, 79]} /></At>
            <path {...thin} strokeDasharray="1 4.2" d="M53 57 L47 84 M70 57 L76 84" />
            <Cone x={34} y={86} s={1.5} /><Cone x={88} y={86} s={1.5} />
            <Ball x={61.5} y={68} r={5.6} />
            <Arrow x1={61.5} y1={76} x2={61.5} y2={88} w={2.8} />
        </>
    ),
    // The ball comes in and bounces once (dotted line); the bat meets it and it flies away.
    'Bounce and Hit': () => (
        <>
            <Ground />
            <At x={-16}><Fig {...POSE.hit} /><Bat from={[67, 56]} to={[84, 38]} /></At>
            <path {...thin} strokeDasharray="1 4.2" d="M106 56 L92 84 Q78 70 64 50" />
            <path {...thin} strokeWidth="2.4" d="M87 85 l-4 -3 M97 85 l4 -3" />
            <Speed x={84} y={29} len={11} n={3} gap={3.8} />
            <Ball x={92} y={27} r={5} />
        </>
    ),
    // A straight bat in front of the stumps: the ball stops dead.
    'Guard the Stumps': () => (
        <>
            <Ground />
            <Stumps x={32} h={27} />
            <At x={2}><Fig {...POSE.stance} /><Bat from={[69, 58]} to={[71, 83]} /></At>
            <Ball x={84} y={81} /><path {...thin} d="M91 76 l4 -3 M92 81 h5 M91 86 l4 2" />
        </>
    ),
    // Two bats: one swings and the ball flies, one blocks and the ball stops.
    'Hit or Block': () => (
        <>
            <Word x={42} y={30} size={8.5}>HIT</Word><Word x={79} y={30} size={8.5}>BLOCK</Word>
            <line {...thin} strokeDasharray="1 4" x1="60" y1="24" x2="60" y2="84" />
            <Bat from={[30, 44]} to={[46, 70]} /><path {...thin} d="M28 62 Q34 76 48 76" />
            <Ball x={50} y={44} r={4.2} /><Speed x={45} y={48} len={7} n={2} gap={3.4} />
            <Bat from={[78, 40]} to={[78, 82]} /><Ball x={88} y={80} r={4.2} /><path {...thin} d="M94 76 l3 -2 M95 81 h4" />
        </>
    ),
    // Weight on the back foot, hitting a high ball.
    'Rock Back': () => (
        <>
            <Ground />
            <At x={-2}><Fig {...POSE.back} /><Bat from={[69, 43]} to={[88, 35]} /></At>
            <Ball x={91} y={30} /><line {...thin} strokeDasharray="1 4" x1="99" y1="21" x2="95" y2="26" />
            <Arrow x1={40} y1={58} x2={26} y2={58} w={2.8} />
        </>
    ),
    // Twin batters, back to back: a ball on this side is hit to this side, a ball on that side to that side.
    'Line Up, Hit': () => (
        <>
            <Ground />
            <line {...thin} strokeDasharray="1 4.2" x1="60" y1="20" x2="60" y2="62" />
            {[false, true].map((flip) => (
                <At key={String(flip)} x={flip ? -13 : 13} s={0.72} flip={flip}>
                    <Fig {...POSE.side} /><Bat from={[74, 53]} to={[90, 64]} />
                    <Ball x={96} y={55} r={5.6} /><Arrow x1={92} y1={44} x2={104} y2={28} w={3.4} />
                </At>
            ))}
        </>
    ),
    // Two batters and two big arrows: one rocks back to a high ball, one steps forward to a full ball.
    'Rock or Step': () => (
        <>
            <Ground y={72} />
            <At x={-27} y={-14} s={0.66}><Fig {...POSE.back} /><Bat from={[69, 43]} to={[88, 35]} /></At>
            <Ball x={55} y={34} r={3.8} />
            <At x={22} y={-14} s={0.66}><Fig {...POSE.drive} /><Bat from={[69, 59]} to={[80, 79]} /></At>
            <Ball x={99} y={68} r={3.8} />
            <Word x={62} y={25} size={10.5}>OR</Word>
            <Arrow x1={46} y1={81.5} x2={22} y2={81.5} w={4} head={7} /><Arrow x1={70} y1={81.5} x2={94} y2={81.5} w={4} head={7} />
        </>
    ),
    // A player calling loudly: YES, NO or WAIT.
    'Call It': () => (
        <>
            <Ground x2={62} />
            <At x={-26}><Fig {...POSE.shout} /></At>
            <path d="M56 17 H92 Q98 17 98 23 V38 Q98 44 92 44 H56 Q50 44 50 38 V37 L42 35 L50 30 V23 Q50 17 56 17 Z" fill={W} />
            <Word x={74} y={36} size={13.5} fill={BLUE}>YES!</Word>
            <rect x="50" y="50" width="22" height="12.5" rx="6.25" fill={W} /><Word x={61} y={58.8} size={6.6} fill={BLUE}>NO!</Word>
            <rect x="75" y="50" width="29" height="12.5" rx="6.25" fill={W} /><Word x={89.5} y={58.8} size={6.6} fill={BLUE}>WAIT!</Word>
        </>
    ),
    // The ball goes through the gap between two fielders; the batter runs.
    'Gap and Go': () => (
        <>
            <Ground x2={70} />
            <At x={-18} s={0.84}><Fig {...POSE.run} /><Bat from={[44, 46]} to={[34, 30]} /></At>
            <Speed x={24} y={74} len={7} n={3} gap={4.5} />
            <Mini x={78} y={31} /><Mini x={95} y={68} />
            <Arrow x1={62} y1={59} x2={103} y2={43} dash="1 4.2" w={2.2} /><Ball x={89} y={48.5} r={4.6} />
        </>
    ),
    // Two batters, gloves together, chasing a score.
    'Chase Together': () => (
        <>
            <Ground />
            <rect x="34" y="17" width="52" height="15" rx="3" fill={W} /><Word x={60} y={28.2} size={8.2} fill={BLUE}>12 TO WIN</Word>
            <At x={-17} s={0.86}><Fig {...POSE.stand} /><Bat from={[48, 60]} to={[44, 84]} /></At>
            <At x={17} s={0.86} flip><Fig {...POSE.stand} /><Bat from={[48, 60]} to={[44, 84]} /></At>
            <circle cx="60" cy="50" r="4.4" fill={W} /><path {...thin} d="M60 42 v-4 M54 44 l-3 -3 M66 44 l3 -3" />
        </>
    ),
    // ── BOWLING ──
    // Close-up: the ball held in the fingers, not the palm, and a straight line to the target.
    'Straight to the Target': () => (
        <>
            <line x1="12" y1="96" x2="26" y2="74" stroke={W} strokeWidth="13" strokeLinecap="round" />
            <circle cx="29" cy="65" r="10.5" fill={W} />
            <g stroke={W} strokeWidth="6.6" fill="none" {...cap}>
                <path d="M25 60 Q26 27 51 25" /><path d="M31 59 Q36 35 56 33.5" /><path d="M35 72 Q46 77 54 66" />
            </g>
            <Ball x={55} y={50} r={12.5} />
            <line {...thin} strokeDasharray="1 4.2" x1="71" y1="48" x2="80" y2="46" />
            <Target x={93} y={43} r={10.5} />
        </>
    ),
    // A bowler walks in and bowls into the keeper’s gloves, held up behind the stumps.
    'Keeper’s Gloves': () => (
        <>
            <Ground />
            <At x={-27} s={0.84}><Fig {...POSE.bowl} /></At>
            <path {...thin} d="M12 74 h6 M10 80 h6" />
            <line {...thin} strokeDasharray="1 4.2" x1="41" y1="31" x2="54" y2="37" /><Ball x={60} y={39.5} r={4.6} />
            <line {...thin} strokeDasharray="1 4.2" x1="66" y1="42" x2="74" y2="45" />
            {[1, -1].map((d) => (
                <g key={d} transform={`translate(${88 + d * 9.4} 50) scale(${d * 0.7} 0.7)`}>
                    <path d="M-8 -14 Q-9 -19 -5 -19 Q-2 -19 -2 -15 Q-1 -21 3 -20 Q6 -19 5 -14 Q9 -17 10 -12 L8 4 Q7 12 -1 12 H-4 Q-10 12 -10 5 Z" fill={W} />
                    <rect x="-9" y="13.5" width="15" height="6" rx="2.5" fill={W} />
                </g>
            ))}
            <Stumps x={88} h={14} gap={4.2} />
        </>
    ),
    // Close-up: a low ball hits the very bottom of the stumps.
    'Base of the Stump': () => (
        <>
            <Ground y={86} />
            <Stumps x={76} y={85} h={46} gap={11} />
            <g stroke={W} strokeWidth="4.4" strokeLinecap="round">{[-11, 0, 11].map((d) => <line key={d} x1={76 + d} y1="85" x2={76 + d} y2="39" />)}</g>
            <Ball x={54} y={77} r={7.4} />
            <Speed x={43} y={77} len={13} n={3} gap={5} />
            <path {...thin} strokeWidth="2.4" d="M58 65 l-3 -5 M48 66 l-5 -4" />
            <Arrow x1={101} y1={50} x2={101} y2={76} w={3} />
        </>
    ),
    // Ball 1 and ball 2, side by side and exactly the same, each with a tick.
    'Two the Same': () => (
        <>
            <Ground x1={14} x2={106} y={82} />
            {[36, 86].map((x, i) => (
                <g key={x}>
                    <Stumps x={x + 5} y={81} h={24} gap={5} />
                    <Ball x={x - 9} y={74} r={5} />
                    <line {...thin} strokeDasharray="1 4.2" x1={x - 20} y1={54} x2={x - 13} y2={68} />
                    <Word x={x - 10} y={42} size={13}>{i + 1}</Word><Tick x={x + 5} y={38} s={1.1} w={3.8} />
                </g>
            ))}
            <line {...thin} strokeDasharray="1 4.2" x1="60" y1="28" x2="60" y2="78" />
        </>
    ),
    // The same bowler on three numbered marks, near, middle and far: each ball reaches the stumps.
    'Length Ladder': () => (
        <>
            <Ground x1={12} x2={108} y={80} />
            {[[24, 3], [48, 2], [70, 1]].map(([x, n]) => (
                <g key={n}>
                    <At x={x - 58} y={-11} s={0.44}><Fig {...POSE.bowl} /></At>
                    <circle cx={x} cy="82" r="6.2" fill={W} /><text x={x} y="85.4" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="9.4" fill={BLUE}>{n}</text>
                </g>
            ))}
            <Stumps x={98} y={79} h={22} gap={4.4} />
            <g {...thin} strokeDasharray="1 4.2"><path d="M30 44 Q66 4 94 54" /><path d="M54 44 Q78 18 94 55" /><path d="M76 44 Q88 34 94 56" /></g>
        </>
    ),
    // A bowler jogs in, arm straight up at the near stumps; the ball goes straight to the far stumps.
    'Jog and Bowl': () => (
        <>
            <Ground />
            <At x={-25} y={3}><Fig {...POSE.jogbowl} /></At>
            <Ball x={39} y={17} r={4.4} />
            <Speed x={17} y={62} len={7} n={3} gap={6} />
            <Stumps x={60} h={25} gap={4.6} />
            <Arrow x1={45} y1={20} x2={92} y2={60} dash="1 4.2" w={2.2} />
            <Stumps x={99} h={13} gap={3} />
        </>
    ),
    // The ball on its way to the stumps with the seam standing straight up.
    'Seam Up': () => (
        <>
            <Ground x1={76} x2={106} y={84} />
            <circle cx="46" cy="55" r="23" fill={W} />
            <path d="M42.4 32.4 V77.6 M49.6 32.4 V77.6" stroke={PINK} strokeWidth="2" strokeLinecap="round" />
            <path d="M42.4 38 h-4.6 M42.4 44.8 h-4.6 M42.4 51.6 h-4.6 M42.4 58.4 h-4.6 M42.4 65.2 h-4.6 M42.4 72 h-4.6 M49.6 38 h4.6 M49.6 44.8 h4.6 M49.6 51.6 h4.6 M49.6 58.4 h4.6 M49.6 65.2 h4.6 M49.6 72 h4.6" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" />
            <Arrow x1={46} y1={27} x2={46} y2={12} w={3} />
            <Speed x={19} y={55} len={8} n={3} gap={7} />
            <line {...thin} strokeDasharray="1 4.2" x1="72" y1="60" x2="85" y2="66" />
            <Stumps x={94} y={83} h={20} gap={4.2} />
        </>
    ),
    // One stump on its own, hit by the ball; the arrow shows it gets moved to other spots.
    'One Stump': () => (
        <>
            <Ground />
            <line stroke={W} strokeWidth="5.4" {...cap} x1="56" y1="85" x2="56" y2="46" />
            <line stroke={W} strokeWidth="4.6" strokeLinecap="round" strokeDasharray="0.1 7" x1="95" y1="84" x2="95" y2="47" />
            <path {...thin} strokeWidth="2.4" d="M61 38 Q76 20 91 38" /><polyline {...thin} strokeWidth="2.4" points="60.5,31.5 61,38 67.5,37" /><polyline {...thin} strokeWidth="2.4" points="84.5,37 91,38 91.5,31.5" />
            <Ball x={46.5} y={64} r={6} /><line {...thin} strokeDasharray="1 4.2" x1="12" y1="54" x2="38" y2="62" />
            <path {...thin} strokeWidth="2.6" d="M63 56 l5 -3 M64 64 h6 M63 72 l5 3" />
        </>
    ),
    // The batter swings and misses; the ball hits the stumps.
    'Beat the Bat': () => (
        <>
            <Ground />
            <At x={-20} s={0.92}><Fig {...POSE.swing} /><Bat from={[69, 49]} to={[86, 42]} /></At>
            <Stumps x={88} h={22} gap={4.6} bails={false} /><BailsOff x={88} y={58} />
            <path {...thin} strokeDasharray="1 4.2" d="M28 30 Q60 50 80 70" /><Ball x={80} y={71} r={4.4} />
        </>
    ),
    // Six balls, all on target: one tidy over.
    'Tidy Over': () => (
        <>
            {[0, 1, 2, 3, 4, 5].map((i) => <NumBall key={i} x={38 + (i % 3) * 22} y={32 + Math.floor(i / 3) * 21} n={i + 1} r={8.4} />)}
            <polyline stroke={W} strokeWidth="4.6" fill="none" {...cap} points="45,74 56,84 77,66" />
        </>
    ),
    // A partner calls which target; the ball hits that one.
    'Partner’s Pick': () => (
        <>
            <Ground />
            <At x={-30} s={0.8}><Fig {...POSE.point} /></At>
            <path d="M22 15 H66 Q71 15 71 20 V29 Q71 34 66 34 H42 L33 41 L35 34 H22 Q17 34 17 29 V20 Q17 15 22 15 Z" fill={W} />
            <Word x={44} y={28} size={7.6} fill={BLUE}>THAT ONE!</Word>
            <Target x={91} y={27} r={7.4} /><Target x={91} y={48} r={8.4} hit /><Target x={91} y={69} r={7.4} />
            <line {...thin} strokeDasharray="1 4.2" x1="54" y1="80" x2="74" y2="58" /><Ball x={79} y={53} r={4.6} />
            <path {...thin} d="M102 42 l4 -3 M103 48 h5 M102 54 l4 3" />
        </>
    ),
    // A big scoreboard says LAST OVER: the stumps are hit when it counts.
    'Last Over': () => (
        <>
            <Ground />
            <rect x="30" y="15" width="60" height="32" rx="4" fill={W} />
            <Word x={60} y={29} size={12} fill={BLUE}>LAST</Word><Word x={60} y={42} size={12} fill={BLUE}>OVER</Word>
            <Stumps x={72} h={22} gap={5} bails={false} /><BailsOff x={72} y={59} />
            <Ball x={56} y={74} r={5} /><line {...thin} strokeDasharray="1 4.2" x1="28" y1="60" x2="49" y2="71" />
        </>
    ),
    // ── FIELDING ──
    // A fielder with both hands up: the ball caught in one hand, and the same catch waiting in the other.
    'Safe Hands': () => (
        <>
            <Ground x1={36} x2={84} />
            <g stroke={W} fill="none" {...cap}>
                <polyline points="60,64 53,75 51,85" strokeWidth="5.4" /><polyline points="60,64 67,75 69,85" strokeWidth="5.4" />
                <line x1="60" y1="47" x2="60" y2="64" strokeWidth="8" />
                <polyline points="60,49 73,50 80,39" strokeWidth="4.6" /><polyline points="60,49 47,50 40,39" strokeWidth="4.6" />
                <circle cx="60" cy="36" r="6.4" fill={W} stroke="none" />
                <line x1="52" y1="33" x2="68" y2="33" strokeWidth="2.6" />
                <path d="M75 37 q5.5 6 11 0 M34 37 q5.5 6 11 0" strokeWidth="2.6" />
            </g>
            <Ball x={80.5} y={31} r={6.2} />
            <circle {...thin} strokeDasharray="1.4 3.2" cx="39.5" cy="31" r="6.2" />
            <path {...thin} strokeWidth="2.4" d="M80.5 15 v6 M74.5 17 l2 5 M86.5 19 l-2 4" />
        </>
    ),
    // A fielder bends to pick the ball up; the throw hits the stumps.
    'Stump Hitter': () => (
        <>
            <Ground />
            <At x={-13}><Fig {...POSE.pickup} /></At>
            <Ball x={53} y={79.5} r={4.8} />
            <path {...thin} strokeDasharray="1 4.2" d="M57 72 Q66 40 84 58" />
            <Stumps x={92} h={24} gap={4.6} bails={false} /><BailsOff x={92} y={56} />
        </>
    ),
    // Thrower, a fielder at the stumps the ball has got past, and the fielder behind (arrow) who stops it.
    'Back Me Up': () => (
        <>
            <Ground />
            <At x={-35} s={0.62}><Fig {...POSE.thrown} /></At>
            <Stumps x={46} h={16} gap={3.6} />
            <At x={-1} s={0.62} flip><Fig {...POSE.ready} /></At>
            <At x={34} s={0.62} flip><Fig {...POSE.ready} /></At>
            <path {...thin} strokeDasharray="1 4.2" d="M34 55 Q53 38 70 52" /><Ball x={74.5} y={56} r={4.6} />
            <path {...thin} strokeWidth="2.2" d="M49 54 l-3 -4 M53 52 l0 -5" />
            <Arrow x1={95} y1={36} x2={95} y2={48} w={2.8} />
        </>
    ),
    // The fielder’s throw breaks the stumps before the runner gets home.
    'Run-out Ready': () => (
        <>
            <Ground />
            <At x={-30} s={0.9}><Fig {...POSE.thrown} /></At>
            <line {...thin} strokeDasharray="1 4.2" x1="46" y1="44" x2="64" y2="59" /><Ball x={68} y={62.5} r={4.6} />
            <Stumps x={76} h={22} gap={4.4} bails={false} /><BailsOff x={76} y={58} />
            <At x={35} s={0.48} flip><Fig {...POSE.run} /><Bat from={[72, 41]} to={[84, 56]} /></At>
            <Word x={84} y={38} size={9.4}>OUT!</Word>
        </>
    ),
};

// ── Badge shapes: one per discipline ──
const SHAPE = {
    bat: 'M60 3 L109 17 V60 C109 86 88 106 60 115 C32 106 11 86 11 60 V17 Z',
    bowl: 'M60 3 A56 56 0 1 1 59.99 3 Z',
    field: 'M60 3 L110 31 V87 L60 115 L10 87 V31 Z',
};
export const KIND_LABEL = { bat: 'Batting', bowl: 'Bowling', field: 'Fielding' };
// With no ribbon the picture drops into the middle of the badge.
const DROP = { bat: 5, bowl: 7, field: 7 };

// One badge. `ribbon` puts the badge's name on a ribbon (use it at 110px and up).
export const Badge = ({ name, kind, ribbon = false, className = 'w-20 h-20' }) => {
    const id = useId().replace(/:/g, '');
    const Art = ART[name];
    const size = Math.min(9.6, 134 / name.length);
    return (
        <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`${name} badge (${KIND_LABEL[kind]})`}>
            <defs>
                <linearGradient id={`g${id}`} x1="0.15" y1="0" x2="0.85" y2="1">
                    <stop offset="0" stopColor="#001D48" /><stop offset="0.35" stopColor={BLUE} /><stop offset="1" stopColor={PINK} />
                </linearGradient>
                <clipPath id={`c${id}`}><path d={SHAPE[kind]} /></clipPath>
            </defs>
            <path d={SHAPE[kind]} fill={`url(#g${id})`} stroke={W} strokeWidth="2.6" strokeLinejoin="round" />
            <path d={SHAPE[kind]} fill="none" stroke={W} strokeWidth="1" opacity=".35" transform="translate(60 59) scale(0.92) translate(-60 -59)" />
            <g clipPath={`url(#c${id})`}><g transform={ribbon ? undefined : `translate(0 ${DROP[kind]})`}>{Art ? <Art /> : null}</g></g>
            {ribbon && (
                <g>
                    <path d="M3 90 H117 L111 99.5 L117 109 H3 L9 99.5 Z" fill={PINK} stroke={W} strokeWidth="1.6" strokeLinejoin="round" />
                    <text x="60" y={99.5 + size * 0.36} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={size} fill={W} letterSpacing="0.2">{name.toUpperCase()}</text>
                </g>
            )}
        </svg>
    );
};

export const hasArt = (name) => Boolean(ART[name]);
