/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { SIZE_SPECIFICATIONS } from '../data';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'jerseys' | 'oversized' | 'vests';
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const specs = SIZE_SPECIFICATIONS[category] || SIZE_SPECIFICATIONS.jerseys;
  const titleMap = {
    jerseys: 'Football Jerseys Size Guide (Slim Athletic Fit)',
    oversized: 'Oversized Streetwear Tees Size Guide (Dropped Shoulders)',
    vests: 'Gym Core Vests & Stringers Size Guide (Flex Fit)'
  };

  return (
    <div id="size-guide-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div id="size-guide-modal-content" className="relative w-full max-w-2xl bg-neutral-900 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-500/10">
        
        {/* Close button */}
        <button
          id="close-size-guide-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="size-guide-title" className="text-xl md:text-2xl font-sans font-bold tracking-tight text-white mb-2 pr-6">
          {titleMap[category]}
        </h3>
        <p id="size-guide-subtitle" className="text-sm text-neutral-400 mb-6 font-sans">
          Measurements are indicated in inches. We recommend sizing down if you prefer a tighter fit, or sizing up for a dramatic slouch fit on street tees.
        </p>

        {/* Table representation */}
        <div id="size-guide-table-scroll" className="overflow-x-auto rounded-xl border border-white/10">
          <table id="size-guide-data-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-950/40 text-purple-300 border-b border-white/10 font-mono text-xs uppercase tracking-wider">
                {specs.cols.map((col, idx) => (
                  <th key={idx} className="py-3 px-4 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-neutral-300 font-mono">
              {specs.rows.map((row: any, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-purple-400">{row.size}</td>
                  {category === 'jerseys' && (
                    <>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.waist}</td>
                      <td className="py-3 px-4">{row.length}</td>
                    </>
                  )}
                  {category === 'oversized' && (
                    <>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.shoulder}</td>
                      <td className="py-3 px-4">{row.sleeve}</td>
                      <td className="py-3 px-4">{row.length}</td>
                    </>
                  )}
                  {category === 'vests' && (
                    <>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.length}</td>
                      <td className="py-3 px-4">{row.drop}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note on fitting */}
        <div id="size-guide-tips-box" className="mt-6 flex flex-col gap-2 p-4 bg-purple-950/20 rounded-xl border border-purple-500/20 text-xs text-neutral-400">
          <span className="font-bold text-purple-300 uppercase tracking-widest font-mono">RIETZZ Fitment Intelligence:</span>
          <span>• <strong>Fabric Shrinkage:</strong> Engineered using preshrunk combed yarns; guarantees minimal shrinkage when air-dried.</span>
          <span>• <strong>Custom Apparel Warning:</strong> Double-check customized player badges since personalized numbers cannot be returned.</span>
        </div>
      </div>
    </div>
  );
}
