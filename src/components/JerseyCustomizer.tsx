/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Hash, Sparkles, Upload, X } from 'lucide-react';
import { Customization } from '../types';

interface JerseyCustomizerProps {
  initialName?: string;
  initialNumber?: string;
  jerseyColor: string;
  onCustomizationChange: (customization: Customization) => void;
}

export default function JerseyCustomizer({
  initialName = 'RITESH',
  initialNumber = '10',
  jerseyColor,
  onCustomizationChange
}: JerseyCustomizerProps) {
  const [name, setName] = useState(initialName);
  const [number, setNumber] = useState(initialNumber);
  const [activeFont, setActiveFont] = useState<'premier' | 'retro' | 'cyber'>('premier');
  const [customBadge, setCustomBadge] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    const formatted = val.toUpperCase().slice(0, 15).replace(/[^A-Z\s]/g, '');
    setName(formatted);
    onCustomizationChange({ playerName: formatted, playerNumber: number, customBadgeUrl: customBadge || undefined });
  };

  const handleNumberChange = (val: string) => {
    const formatted = val.replace(/[^0-9]/g, '').slice(0, 2);
    setNumber(formatted);
    onCustomizationChange({ playerName: name, playerNumber: formatted, customBadgeUrl: customBadge || undefined });
  };

  const setPreset = (pName: string, pNum: string) => {
    setName(pName);
    setNumber(pNum);
    onCustomizationChange({ playerName: pName, playerNumber: pNum, customBadgeUrl: customBadge || undefined });
  };

  const handleBadgeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const base64 = event.target.result;
        setCustomBadge(base64);
        onCustomizationChange({ playerName: name, playerNumber: number, customBadgeUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const fontStyles = {
    premier: 'font-sans tracking-[0.2em] font-extrabold uppercase',
    retro: 'font-mono tracking-[0.05em] font-bold uppercase',
    cyber: 'font-serif tracking-[0.1em] italic font-black uppercase'
  };

  // Extract a suitable background highlight derived from country meta or selection
  const isYellow = jerseyColor.toLowerCase().includes('yellow') || jerseyColor.toLowerCase().includes('brazil');
  const isBlue = jerseyColor.toLowerCase().includes('blue') || jerseyColor.toLowerCase().includes('argentina');
  const isCrimson = jerseyColor.toLowerCase().includes('amaranth') || jerseyColor.toLowerCase().includes('portugal') || jerseyColor.toLowerCase().includes('cardinal');

  const getJerseyStyle = () => {
    if (isYellow) return 'from-yellow-400 to-amber-500 text-green-950 border-green-500';
    if (isBlue) return 'from-sky-300 via-neutral-100 to-sky-300 text-sky-950 border-sky-400';
    if (isCrimson) return 'from-rose-800 to-amber-700 text-yellow-300 border-yellow-400';
    return 'from-neutral-800 via-purple-950 to-neutral-900 text-purple-200 border-purple-500';
  };

  return (
    <div id="jersey-customizer-root" className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-neutral-900/90 border border-purple-500/20 rounded-2xl">
      
      {/* Visual Live Preview Canvas */}
      <div id="jersey-preview-container" className="md:col-span-6 flex flex-col items-center justify-center bg-black/40 rounded-xl p-6 border border-white/5 min-h-[350px] relative overflow-hidden">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-mono tracking-wider uppercase">
          <Sparkles className="w-3 h-3 animate-pulse" /> Live Customizer Preview
        </div>

        {/* 3D-Like Jersey back representation */}
        <div id="virtual-jersey-card" className={`w-64 h-80 rounded-t-full rounded-b-3xl bg-gradient-to-b ${getJerseyStyle()} p-4 shadow-xl border-t-8 shadow-black/60 flex flex-col justify-between items-center relative transition-all duration-300`}>
          
          {/* Collar detail */}
          <div className="w-24 h-6 bg-neutral-950/20 absolute top-0 rounded-b-full border-b border-white/10" />

          {/* Custom crest badge overlay representation */}
          {customBadge && (
            <div id="virtual-custom-crest" className="absolute top-10 left-10 w-8 h-8 rounded-full border border-white/40 bg-black/70 p-1 flex items-center justify-center overflow-hidden shadow-md">
              <img src={customBadge} alt="Custom Crest" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Player Name */}
          <div className="w-full text-center mt-12 px-2 z-10 select-none">
            <span id="preview-player-name" className={`block text-lg font-black truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${fontStyles[activeFont]}`}>
              {name || 'YOUR NAME'}
            </span>
          </div>

          {/* Player Number */}
          <div className="flex-1 flex items-center justify-center z-10 select-none">
            <span id="preview-player-number" className={`text-8xl font-extrabold font-sans drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-tighter ${activeFont === 'cyber' ? 'italic text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300' : ''}`}>
              {number || '10'}
            </span>
          </div>

          {/* Lower authentic brand tag */}
          <div className="w-full flex justify-between items-center px-4 mb-2 z-10">
            <span className="text-[8px] tracking-widest font-mono uppercase opacity-75">AUTHENTIC</span>
            <span className="text-[10px] font-black tracking-widest font-mono text-purple-500 bg-black/60 px-2 py-0.5 rounded border border-purple-500/30">
              RIETZZ
            </span>
          </div>

          {/* Faux Shoulder Sleeves */}
          <div className="absolute top-10 -left-4 w-6 h-28 bg-current opacity-10 rounded-r-lg skew-y-12" />
          <div className="absolute top-10 -right-4 w-6 h-28 bg-current opacity-10 rounded-l-lg -skew-y-12" />
        </div>
      </div>

      {/* Control Elements Panel */}
      <div id="jersey-customizer-controls" className="md:col-span-6 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-sans font-bold text-white mb-1">Personalize Your Apparel</h4>
            <p className="text-xs text-neutral-400">Add your name, lucky squad number, and custom sponsor logos/crest immediately.</p>
          </div>
          
          {/* Inputs */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-400" /> Player Name
              </label>
              <input
                id="customize-name-input"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="E.G. RONALDO"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 uppercase transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-purple-400" /> Squad Number
              </label>
              <input
                id="customize-number-input"
                type="text"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="E.G. 7"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Device Image Upload Zone */}
          <div id="crest-upload-zone" className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-purple-400" /> Custom Crest or logo emblem
            </label>
            
            <div
              id="crest-droparea"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  handleBadgeUpload(files[0]);
                }
              }}
              onClick={() => document.getElementById('crest-file-picker')?.click()}
              className="border border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-950/5 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <input
                id="crest-file-picker"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    handleBadgeUpload(files[0]);
                  }
                }}
              />
              
              {customBadge ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-left">
                    <img src={customBadge} alt="Crest preview" className="w-8 h-8 object-contain rounded border border-white/20 bg-black" />
                    <div>
                      <span className="block text-[11px] font-mono text-white font-bold uppercase truncate max-w-[140px]">Emblem active</span>
                      <span className="block text-[9px] text-neutral-500">Tap or drag new file</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomBadge(null);
                      onCustomizationChange({ playerName: name, playerNumber: number, customBadgeUrl: undefined });
                    }}
                    className="p-1 h-7 w-7 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-lg transition-colors border border-white/5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-1">
                  <Upload className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 mx-auto mb-1 transition-transform group-hover:-translate-y-0.5" />
                  <span className="block text-[11px] font-mono text-neutral-400">Drag logo here or <span className="text-purple-400 font-bold">browse device</span></span>
                  <span className="block text-[8px] text-neutral-500 mt-0.5">Supports PNG, JPG, WEBP, SVG</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => setPreset('RITESH', '10')} className="px-2.5 py-1 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-xs text-purple-300 font-mono rounded-lg transition-colors">
                RITESH #10
              </button>
              <button type="button" onClick={() => setPreset('RONALDO', '7')} className="px-2.5 py-1 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-xs text-purple-300 font-mono rounded-lg transition-colors">
                RONALDO #7
              </button>
              <button type="button" onClick={() => setPreset('MESSI', '10')} className="px-2.5 py-1 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-xs text-purple-300 font-mono rounded-lg transition-colors">
                MESSI #10
              </button>
              <button type="button" onClick={() => setPreset('HAALAND', '9')} className="px-2.5 py-1 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-xs text-purple-300 font-mono rounded-lg transition-colors">
                HAALAND #9
              </button>
            </div>
          </div>
        </div>

        {/* Font selections */}
        <div className="pt-2 border-t border-white/5">
          <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Number Typeface Style:</span>
          <div className="grid grid-cols-3 gap-2">
            {(['premier', 'retro', 'cyber'] as const).map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => setActiveFont(font)}
                className={`py-1.5 px-2.5 text-xs font-mono rounded-xl border text-center transition-all capitalize ${activeFont === font ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white'}`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
