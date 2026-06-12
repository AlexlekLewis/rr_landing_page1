import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, X, Info } from 'lucide-react';
import {
    TOPS_SIZES, TOPS_MEASURE_TIP,
    SHORTS_SIZES, SHORTS_MEASURE_TIP,
    PANTS_SIZES, PANTS_MEASURE_TIP,
    KIDS_AGE_CHART,
} from '../academy-shop/sizeData';

// Mandatory uniform = training shirt + (shorts OR pants) + cap. Fleece jacket is
// optional, so it's deliberately not listed here. Sizing is the single source of
// truth in academy-shop/sizeData so the shop and this guide never drift.
const GARMENTS = [
    { key: 'shirt',  label: 'Training Shirt', sizes: TOPS_SIZES,   measureKey: 'halfChest', col1: 'Half Chest', tip: TOPS_MEASURE_TIP,   ageGuide: true  },
    { key: 'shorts', label: 'Shorts',         sizes: SHORTS_SIZES, measureKey: 'waist',     col1: 'Waist',      tip: SHORTS_MEASURE_TIP, ageGuide: false, bottom: true },
    { key: 'pants',  label: 'Pants',          sizes: PANTS_SIZES,  measureKey: 'waist',     col1: 'Waist',      tip: PANTS_MEASURE_TIP,  ageGuide: false, bottom: true },
    { key: 'cap',    label: 'Cap',            oneSize: true,       tip: 'One size fits all with an adjustable strap — no measuring needed.' },
];

const SizeTable = ({ rows, measureKey, col1Label }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-xs">
            <thead>
                <tr className="border-b border-slate-200">
                    <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2 pr-3">Size</th>
                    <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2 pr-3">{col1Label} (in)</th>
                    <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2">Length (in)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-1.5 pr-3 font-bold text-rr-dark">{row.label}</td>
                        <td className="py-1.5 pr-3 text-slate-600">{row[measureKey]}</td>
                        <td className="py-1.5 text-slate-600">{row.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AgeGuide = () => (
    <div className="pt-3 mt-3 border-t border-slate-200">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Age Guide (Junior)</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {KIDS_AGE_CHART.map((row, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-500">
                    <span>{row.age}</span>
                    <span className="font-bold text-rr-dark">Top {row.top} / Bottom {row.bottom}</span>
                </div>
            ))}
        </div>
    </div>
);

const UniformSizeGuideModal = ({ open, onClose }) => {
    const [group, setGroup] = useState('junior');
    const [garmentKey, setGarmentKey] = useState('shirt');

    // Close on Escape and lock background scroll while open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    const garment = GARMENTS.find((g) => g.key === garmentKey) ?? GARMENTS[0];
    const rows = garment.sizes?.[group] ?? [];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                role="dialog"
                aria-modal="true"
                aria-label="Uniform size guide"
                className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-rr-blue text-white">
                            <Ruler className="w-4.5 h-4.5" />
                        </span>
                        <div>
                            <h2 className="text-rr-dark font-black uppercase tracking-wide text-sm leading-none">Uniform Size Guide</h2>
                            <p className="text-slate-400 text-[11px] font-medium mt-1">Official RRA Melbourne sizing · measurements in inches</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-rr-dark hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
                    {/* What's mandatory vs optional */}
                    <div className="rounded-xl border border-rr-pink/30 bg-rr-pink/5 px-4 py-3">
                        <p className="text-[11px] font-black text-rr-dark uppercase tracking-wider mb-1.5">Mandatory uniform</p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            A <span className="font-bold text-rr-dark">training shirt</span>, <span className="font-bold text-rr-dark">shorts or pants</span>, and a{' '}
                            <span className="font-bold text-rr-dark">cap</span> are required for all sessions. The fleece jacket is optional.
                        </p>
                    </div>

                    {/* Junior / Senior toggle — not relevant for the one-size cap */}
                    {!garment.oneSize && (
                        <div className="flex bg-slate-100 rounded-full p-1">
                            {['junior', 'senior'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGroup(g)}
                                    className={`flex-1 text-xs font-black uppercase tracking-wider py-2 rounded-full transition-all ${
                                        group === g ? 'bg-rr-pink text-white shadow' : 'text-slate-500 hover:text-rr-dark'
                                    }`}
                                >
                                    {g === 'junior' ? 'Junior' : 'Senior / Adult'}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Garment tabs */}
                    <div className="flex flex-wrap gap-2">
                        {GARMENTS.map((g) => (
                            <button
                                key={g.key}
                                onClick={() => setGarmentKey(g.key)}
                                className={`text-xs font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-all ${
                                    garmentKey === g.key
                                        ? 'bg-rr-dark text-white border-rr-dark'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-rr-pink hover:text-rr-pink'
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-400 -mt-1">Shorts <span className="font-semibold">or</span> pants — you need at least one bottom.</p>

                    {/* Measurement tip */}
                    <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-3.5 py-3">
                        <Info className="w-3.5 h-3.5 text-rr-pink shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">{garment.tip}</p>
                    </div>

                    {/* One-size cap, or a size table for the rest */}
                    {garment.oneSize ? (
                        <div className="rounded-xl border border-slate-200 px-4 py-6 text-center">
                            <p className="text-2xl font-black text-rr-dark uppercase tracking-wide">One Size</p>
                            <p className="text-xs text-slate-500 mt-1">Fits all — adjustable strap. No measuring needed.</p>
                        </div>
                    ) : (
                        <>
                            <SizeTable rows={rows} measureKey={garment.measureKey} col1Label={garment.col1} />
                            {group === 'junior' && garment.ageGuide && <AgeGuide />}
                            <p className="text-[11px] text-slate-400 italic pt-1">
                                All measurements approximate — allow for slight variation. Source: Omtex official size guide.
                            </p>
                        </>
                    )}
                </div>

                {/* Footer note — uniform is a separate, required purchase */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50">
                    <p className="text-[11px] text-slate-500 leading-snug">
                        <span className="font-bold text-rr-dark">Mandatory uniform</span> — a training shirt, shorts or pants, and a cap — is
                        purchased separately and required for all sessions. The fleece jacket is optional. Choose your size here before you order.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default UniformSizeGuideModal;
