/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Heart, User, Menu, X, Shield, Search, Sparkles, LogOut, CheckCircle, Database 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCartDrawer: () => void;
}

export default function Header({ currentTab, setCurrentTab, openCartDrawer }: HeaderProps) {
  const { currentUser, cart, wishlist, logout, isFirebaseMode } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'football', label: 'Football Jerseys' },
    { id: 'oversized', label: 'Oversized Tees' },
    { id: 'vests', label: 'Gym Vests' },
    { id: 'custom', label: 'Custom Design' },
    { id: 'trending', label: 'Trending' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'profile', label: 'Profile' },
    { id: 'contact', label: 'Contact' }
  ];

  const totalCartItems = cart.reduce((acc, c) => acc + c.quantity, 0);

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-cyan-500/10">
      
      {/* Top Banner indicating DB mode */}
      <div id="top-sync-banner" className="bg-gradient-to-r from-cyan-950 via-neutral-950 to-indigo-950 text-[9px] sm:text-[10px] py-1 px-3 sm:py-1.5 sm:px-4 flex flex-col sm:flex-row justify-between items-center text-neutral-400 font-mono border-b border-cyan-500/10 select-none gap-1 sm:gap-2">
        <span className="flex items-center gap-1.5 text-neutral-300">
          <span className="inline-flex gap-1 text-xs">🇺🇸 🇲🇽 🇨🇦</span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 animate-pulse" />
            FIFA 2026 SERIES
          </span>
          <span className="text-[8px] sm:text-[9px] text-neutral-500 hidden md:inline">| {isFirebaseMode ? 'LIVE AUTH ACTIVE' : 'SECURE LOCAL CACHE'}</span>
        </span>
        <span className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] uppercase tracking-wider text-cyan-300 font-bold text-center">
          🔥 USE CODE <span className="bg-cyan-400/20 border border-cyan-500/30 px-1 py-0.2 rounded text-white text-[8.5px] sm:text-[10px]">FIFA20</span> FOR FLAT ₹500 OFF!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
         <div className="flex h-14 sm:h-16 items-center justify-between">
          
          {/* Brand Logo Identity */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-1.5 group focus:outline-none"
            >
              <span className="text-lg sm:text-2xl font-display tracking-[0.25em] font-black text-white bg-clip-text select-none flex items-center">
                <span>RIET<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">ZZ</span></span>
                <span className="text-[8px] sm:text-[10px] ml-2 px-1.5 py-0.2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black border border-cyan-300/30 rounded font-mono font-black tracking-widest uppercase animate-glow-blink">
                  PRO
                </span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav id="desktop-navbar" className="hidden lg:flex space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-mono font-medium uppercase tracking-wider transition-all rounded-lg ${currentTab === item.id ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-bold border-b-2 border-cyan-400/40 rounded-b-none' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Action elements right aligned */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Wishlist badge */}
            <button
              id="wishlist-header-btn"
              onClick={() => handleNavClick('wishlist')}
              className={`p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all relative ${currentTab === 'wishlist' ? 'text-rose-400 bg-rose-500/5' : ''}`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span id="wishlist-badge-count" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart drawer activator */}
            <button
              id="cart-header-btn"
              onClick={openCartDrawer}
              className="p-2 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span id="cart-badge-count" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white font-mono animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Profile handler */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                
                {/* Admin label indicator */}
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin-dash')}
                    className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono rounded-lg transition-all hover:bg-cyan-500/40"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Console
                  </button>
                )}

                <button
                  id="profile-header-btn"
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-cyan-500/40 rounded-xl transition-all ${currentTab === 'profile' ? 'border-cyan-500 text-cyan-400' : 'text-neutral-300'}`}
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-xs text-cyan-300 font-mono font-bold">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs font-mono font-medium hidden md:inline max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-header-btn"
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl text-xs font-mono tracking-wider uppercase hover:opacity-90 shadow-md shadow-cyan-500/10 transition-all"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Mobile Nav Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 lg:hidden transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu panel */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden bg-neutral-950 border-b border-cyan-500/10 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 text-sm font-mono font-medium rounded-xl uppercase tracking-wider block ${currentTab === item.id ? 'text-cyan-400 bg-cyan-500/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.label}
            </button>
          ))}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin-dash')}
              className="w-full text-left px-4 py-2.5 text-sm font-mono text-cyan-300 font-bold bg-cyan-950/20 border border-cyan-500/20 rounded-xl uppercase tracking-wider block"
            >
              🛡️ Admin Console Dashboard
            </button>
          )}
        </div>
      )}

    </header>
  );
}
