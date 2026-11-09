import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { TRAINING_SHIRT, SHIRT_SIZES, suggestedSize } from '../../lib/kit/trainingShirt';
import UniformSizeGuideModal from '../power-game/UniformSizeGuideModal';

// The mandatory training-shirt step for every paid program form (src/lib/kit/trainingShirt.js).
// Controlled: value = { has: 'yes' | 'no' | '', size }, onChange(next). The form blocks
// submission with shirtError(value) and shows `error` here.
//   <TrainingShirtStep value={shirt} onChange={setShirt} playerName={form.player_name} playerAge={form.player_age} error={errors.shirt} />
const TrainingShirtStep = ({ value, onChange, playerName, playerAge, error }) => {
    const [guide, setGuide] = useState(false);
    const who = (playerName || '').trim().split(' ')[0] || 'your player';
    const choice = (on) => `flex-1 text-left rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors ${on ? 'border-rr-pink bg-rr-pink/5' : error && !value.has ? 'border-red-300' : 'border-slate-200 hover:border-rr-pink/50'}`;
    const pick = (has) => onChange({ has, size: has === 'no' ? (value.size || suggestedSize(playerAge)) : '' });

    return (
        <fieldset data-training-shirt>
            <legend className="block text-xs font-black text-rr-dark uppercase tracking-widest mb-2">Training shirt *</legend>
            <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-3">
                Every player trains in the {TRAINING_SHIRT.name}. Does {who} already have one?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <label className={choice(value.has === 'yes')}>
                    <input type="radio" name="training_shirt" value="yes" checked={value.has === 'yes'} onChange={() => pick('yes')} className="sr-only" />
                    <span className="block font-black text-rr-dark text-sm">Yes, they have one</span>
                    <span className="block text-xs text-rr-charcoal font-medium mt-1">Nothing extra to pay.</span>
                </label>
                <label className={choice(value.has === 'no')}>
                    <input type="radio" name="training_shirt" value="no" checked={value.has === 'no'} onChange={() => pick('no')} className="sr-only" />
                    <span className="block font-black text-rr-dark text-sm">No, order one ({TRAINING_SHIRT.priceLabel})</span>
                    <span className="block text-xs text-rr-charcoal font-medium mt-1">Added to the first payment. Players need it from their first session.</span>
                </label>
            </div>
            {value.has === 'no' && (
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="training_shirt_size" className="block text-xs font-black text-rr-dark uppercase tracking-widest">Shirt size *</label>
                        <button type="button" onClick={() => setGuide(true)} className="inline-flex items-center gap-1 text-xs font-bold text-rr-pink underline">
                            <Ruler className="w-3.5 h-3.5" /> Size guide
                        </button>
                    </div>
                    <select id="training_shirt_size" value={value.size} onChange={(e) => onChange({ ...value, size: e.target.value })}
                        className={`w-full bg-slate-50 border ${error && !value.size ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink text-sm`}>
                        <option value="">Select size</option>
                        {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {suggestedSize(playerAge) && <p className="text-slate-500 text-xs font-medium mt-1">Most players aged {playerAge} wear size {suggestedSize(playerAge)}.</p>}
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <UniformSizeGuideModal open={guide} onClose={() => setGuide(false)} />
        </fieldset>
    );
};

export default TrainingShirtStep;
