import React from 'react';

// Small cricket diagrams for the strength cards. Decorative (aria-hidden):
// the card text says everything the picture shows.
const PINK = '#E11F8F';
const BLUE = '#1226AA';
const DARK = '#111921';
const GRASS = '#E7F2E4';
const GRASS_LINE = '#B9D3B2';
const PITCH = '#D9C7A0';
const LABEL = { fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 800 };

function Field({ children }) {
    return (
        <svg viewBox="0 0 200 150" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            <ellipse cx="100" cy="75" rx="92" ry="68" fill={GRASS} />
            {children}
        </svg>
    );
}

function Wagon() {
    const ends = [[100, 24], [170, 30], [168, 84], [148, 122], [96, 126], [46, 116], [14, 68], [52, 32]];
    return (
        <Field>
            <ellipse cx="100" cy="75" rx="80" ry="58" fill="none" stroke={DARK} strokeWidth="1.5" strokeDasharray="5 5" />
            <rect x="95" y="62" width="10" height="26" rx="2" fill={PITCH} />
            {ends.map(([x, y]) => <line key={`${x}-${y}`} x1="100" y1="75" x2={x} y2={y} stroke={PINK} strokeWidth="3" strokeLinecap="round" />)}
            <circle cx="170" cy="30" r="5" fill={PINK} />
            <circle cx="14" cy="68" r="5" fill={PINK} />
            <circle cx="100" cy="75" r="4" fill={DARK} />
        </Field>
    );
}

function Overs() {
    return (
        <svg viewBox="0 14 220 104" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            <text x="10" y="30" fontSize="10" fill="#323E48" letterSpacing="1" style={LABEL}>THE 20 OVERS OF A T20 INNINGS</text>
            {Array.from({ length: 20 }, (_, i) => (
                <rect key={i} x={10 + i * 10} y="42" width="8" height="38" rx="2" fill={i < 6 ? BLUE : i < 15 ? '#C9D1D9' : PINK} />
            ))}
            <line x1="10" y1="88" x2="68" y2="88" stroke={BLUE} strokeWidth="2.5" />
            <line x1="70" y1="88" x2="158" y2="88" stroke="#8A96A3" strokeWidth="2.5" />
            <line x1="160" y1="88" x2="208" y2="88" stroke={PINK} strokeWidth="2.5" />
            <g fontSize="9" textAnchor="middle" letterSpacing=".5" style={LABEL}>
                <text x="39" y="102" fill={BLUE}>POWERPLAY</text><text x="39" y="114" fill="#323E48">OVERS 1–6</text>
                <text x="114" y="102" fill="#5B6773">MIDDLE</text><text x="114" y="114" fill="#323E48">OVERS 7–15</text>
                <text x="184" y="102" fill={PINK}>DEATH</text><text x="184" y="114" fill="#323E48">16–20</text>
            </g>
        </svg>
    );
}

function Fielders() {
    const dots = [[100, 98], [100, 50], [70, 40], [140, 44], [38, 70], [166, 76], [58, 112], [146, 110], [100, 20], [34, 38], [168, 40]];
    return (
        <Field>
            <ellipse cx="100" cy="75" rx="44" ry="33" fill="none" stroke={GRASS_LINE} strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="95" y="62" width="10" height="26" rx="2" fill={PITCH} />
            {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={BLUE} />)}
            <circle cx="118" cy="66" r="4" fill={PINK} />
        </Field>
    );
}

function Keeping() {
    return (
        <svg viewBox="0 0 230 120" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            <text x="10" y="18" fontSize="10" fill="#323E48" letterSpacing="1" style={LABEL}>WHERE THE KEEPER STANDS</text>
            <rect x="10" y="48" width="160" height="24" rx="3" fill={PITCH} />
            <g fill={DARK}><rect x="18" y="52" width="3" height="16" /><rect x="23" y="52" width="3" height="16" /><rect x="28" y="52" width="3" height="16" /></g>
            <g fill={DARK}><rect x="150" y="52" width="3" height="16" /><rect x="155" y="52" width="3" height="16" /><rect x="160" y="52" width="3" height="16" /></g>
            <circle cx="140" cy="60" r="6" fill={BLUE} />
            <circle cx="178" cy="60" r="7" fill={PINK} />
            <circle cx="214" cy="60" r="7" fill={PINK} />
            <g fontSize="9" letterSpacing=".5" textAnchor="middle" style={LABEL}>
                <text x="178" y="42" fill={PINK}>UP</text>
                <text x="214" y="42" fill={PINK}>BACK</text>
                <text x="178" y="86" fill="#5B6773">SPIN</text>
                <text x="214" y="86" fill="#5B6773">PACE</text>
            </g>
            <text x="10" y="88" fontSize="9" fill="#5B6773" letterSpacing=".5" style={LABEL}>BOWLER’S END</text>
        </svg>
    );
}

function Order() {
    return (
        <svg viewBox="0 0 220 120" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            <text x="10" y="18" fontSize="10" fill="#323E48" letterSpacing="1" style={LABEL}>BATTING ORDER</text>
            {Array.from({ length: 11 }, (_, i) => (
                <g key={i}>
                    <rect x={10 + i * 19} y={30 + i * 4} width="15" height={70 - i * 4} rx="2" fill={i < 3 ? PINK : '#C9D1D9'} />
                    <text x={17.5 + i * 19} y="114" fontSize="9" textAnchor="middle" fill="#323E48" style={LABEL}>{i + 1}</text>
                </g>
            ))}
            <text x="38" y="26" fontSize="9" textAnchor="middle" fill={PINK} letterSpacing=".5" style={LABEL}>TOP 3</text>
        </svg>
    );
}

function Worm() {
    const pts = '10,100 40,94 70,86 100,74 130,64 160,46 190,22';
    return (
        <svg viewBox="0 0 210 120" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            <text x="10" y="18" fontSize="10" fill="#323E48" letterSpacing="1" style={LABEL}>RUNS AS THE INNINGS GOES ON</text>
            {[40, 60, 80, 100].map((y) => <line key={y} x1="10" y1={y} x2="200" y2={y} stroke="#E2E8F0" strokeWidth="1" />)}
            <polyline points={pts} fill="none" stroke={PINK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="190" cy="22" r="5" fill={PINK} />
            <text x="10" y="114" fontSize="9" fill="#5B6773" style={LABEL}>BALLS FACED →</text>
        </svg>
    );
}

function Group() {
    const players = [[50, 40], [150, 40], [50, 100], [150, 100]];
    return (
        <svg viewBox="0 0 200 140" className="h-[132px] w-auto max-w-full" aria-hidden="true">
            {players.map(([x, y]) => <line key={`l${x}${y}`} x1="100" y1="70" x2={x} y2={y} stroke="#C9D1D9" strokeWidth="2" />)}
            {players.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="13" fill={BLUE} />)}
            <circle cx="100" cy="70" r="15" fill={PINK} />
            <text x="100" y="134" fontSize="10" textAnchor="middle" fill="#323E48" letterSpacing="1" style={LABEL}>2 TO 4 PLAYERS, ONE COACH</text>
        </svg>
    );
}

const FIGURES = { wagon: Wagon, overs: Overs, field: Fielders, keeping: Keeping, order: Order, worm: Worm, group: Group };

export default function StrengthFigure({ kind }) {
    const Fig = FIGURES[kind] || Fielders;
    return (
        <div className="bg-slate-50 rounded-xl h-[150px] flex items-center justify-center" aria-hidden="true">
            <Fig />
        </div>
    );
}
