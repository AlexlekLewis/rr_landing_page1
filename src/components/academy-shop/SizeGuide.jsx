import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ruler, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PRODUCT_SIZE_MAP, KIDS_AGE_CHART } from './sizeData';

const SizeGuide = ({ productId, ageGroup }) => {
  const [open, setOpen] = useState(false);
  const config = PRODUCT_SIZE_MAP[productId];
  if (!config) return null;

  const rows = config.sizes[ageGroup] || [];
  const col1Key = config.measureKey; // 'halfChest' or 'waist'

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-bold text-rr-blue hover:text-rr-pink transition-colors uppercase tracking-wider"
      >
        <Ruler className="w-3.5 h-3.5" />
        Size Guide
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-slate-50 rounded-xl p-4 space-y-3">
              {/* Measurement tip */}
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-rr-pink shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">{config.tip}</p>
              </div>

              {/* Size table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2 pr-3">Size</th>
                      <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2 pr-3">{config.col1Label} (in)</th>
                      <th className="text-left font-black text-rr-dark uppercase tracking-wider py-2">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="py-1.5 pr-3 font-bold text-rr-dark">{row.label}</td>
                        <td className="py-1.5 pr-3 text-slate-600">{row[col1Key]}</td>
                        <td className="py-1.5 text-slate-600">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kids age reference — tops only */}
              {config.showKidsAgeChart && ageGroup === 'junior' && (
                <div className="pt-2 border-t border-slate-200">
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
              )}

              <p className="text-xs text-slate-400 italic">
                All measurements in inches · Source: Omtex official size chart
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SizeGuide;
