/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("WELCOME TO THE SQUAD! USE CODE 'WELCOME10' FOR 10% OFF YOUR FIRST SPORTSWEAR PURCHASE.");
    setEmail('');
  };

  return (
    <footer id="main-footer" className="bg-black text-neutral-300 border-t border-purple-500/10 mt-12 py-16">
      
      {/* High-Performance Trust badging */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Premium Express Shipping</h5>
              <p className="text-xs text-neutral-400 mt-1">Dispatched via Shiprocket & Delhivery. Secure global tracking on all sportswear items.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-sans font-bold text-white uppercase tracking-wider">7-Day Premium Replacements</h5>
              <p className="text-xs text-neutral-400 mt-1">Unsatisfied with sizes or fabric? Initiate easy returns with our automated ticket support.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Razorpay-ready Checkout</h5>
              <p className="text-xs text-neutral-400 mt-1">Fully integrated payment tunnels supporting UPI, Credit Cards, and Net Banking tunnels.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Slogan details */}
        <div className="md:col-span-5 space-y-4">
          <span className="text-2xl font-sans tracking-[0.25em] font-black text-white flex items-center gap-2">
            <span>RIET<span className="text-purple-500">ZZ</span></span>
            <span className="text-[10px] px-1.5 py-0.2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-400/30 rounded font-mono font-black tracking-widest uppercase animate-glow-blink">
              PRO
            </span>
          </span>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-sm">
            RIETZZ is an elite athletic and streetwear fusion clothing brand. We engineer premium country football kits, custom-badge apparel, raw-edge gym stringers, and heavy drop-shoulder graphic tees for trendsetting competitors globally.
          </p>
          <div className="text-xs text-neutral-400 font-mono flex flex-wrap gap-2 pt-2">
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Delhivery Certified</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Shiprocket Partner</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Razorpay Secure</span>
          </div>
        </div>

        {/* Categories columns */}
        <div className="md:col-span-3 space-y-4">
          <h6 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-l-2 border-purple-500 pl-2">COLLECTIONS</h6>
          <ul className="space-y-2 text-xs font-sans text-neutral-400">
            <li><button onClick={() => setCurrentTab('football')} className="hover:text-purple-400 transition-colors">Football Jerseys</button></li>
            <li><button onClick={() => setCurrentTab('oversized')} className="hover:text-purple-400 transition-colors">Oversized Street Tees</button></li>
            <li><button onClick={() => setCurrentTab('vests')} className="hover:text-purple-400 transition-colors">Performance Gym Vests</button></li>
            <li><button onClick={() => setCurrentTab('custom')} className="hover:text-purple-400 transition-colors">Custom Designer Board</button></li>
            <li><button onClick={() => setCurrentTab('trending')} className="hover:text-purple-400 transition-colors">Trending Products</button></li>
          </ul>
        </div>

        {/* Newsletter Signup form */}
        <div className="md:col-span-4 space-y-4">
          <h6 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-l-2 border-purple-500 pl-2">SUBSCRIBE FOR EARLY DROPS</h6>
          <p className="text-xs text-neutral-400 font-sans">
            Sign up to acquire exclusive early invitations to collection releases, bespoke player badges, and flash discounts.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {status && (
            <p className="text-[10px] uppercase font-mono font-bold text-purple-400 animate-pulse leading-snug">
              {status}
            </p>
          )}
        </div>

      </div>

      {/* Trademark bottom claims */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <span className="font-sans">© 2026 RIETZZ INC. ALL RIGHTS RESERVED. REGISTERED IN INDIA.</span>
        <div className="flex gap-4 font-mono text-[10px]">
          <a href="#" className="hover:text-neutral-300">PRIVACY POLICY</a>
          <a href="#" className="hover:text-neutral-300">TERMS OF USE</a>
          <a href="#" className="hover:text-neutral-300">SITEMAP</a>
        </div>
      </div>

    </footer>
  );
}
