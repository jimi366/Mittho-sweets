/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Sparkles, UserCheck, User } from 'lucide-react';
import { ContactInfo, Offer } from '../types';

interface HeaderProps {
  currentView: string;
  onSetView: (view: string) => void;
  contactInfo: ContactInfo;
  activeOffer?: Offer;
}

export default function Header({ currentView, onSetView, contactInfo, activeOffer }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCampaign, setShowCampaign] = useState(true);

  // Monitor window vertical scroll position to trigger shrinking & Glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'custom-cakes', label: 'Custom Cakes' },
    { id: 'catering', label: 'Catering' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    onSetView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = contactInfo.phone.replace(/[^0-9]/g, '');

  return (
    <>
      <header
        id="main-sticky-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b flex flex-col ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md border-[#D4AF37]/20 shadow-sm'
            : 'bg-cream border-[#D4AF37]/10'
        }`}
      >
        {/* TOP CAMPAIGN ENY OUTLET ANNOUNCEMENT TICKER */}
        {activeOffer && showCampaign && (
          <div id="campaign-popup-banner" className="w-full bg-maroon-950 border-b border-[#D4AF37]/20 text-[#FCF9F3] py-2 px-4 shadow-sm flex items-center justify-between gap-4 font-serif text-[11px] md:text-xs">
            <div className="mx-auto flex flex-wrap items-center justify-center gap-1.5 md:gap-2 px-2 text-center text-cream">
              <span className="inline-block px-1.5 py-0.5 bg-gold-600 text-charcoal rounded-[4px] text-[8px] uppercase tracking-wider font-extrabold animate-pulse">Featured Offer</span>
              <span className="font-sans font-extrabold text-[#C5A059]">{activeOffer.title}:</span>
              <span className="font-sans opacity-95">{activeOffer.description}</span>
              {activeOffer.code && (
                <span className="font-mono text-[9px] font-bold bg-[#A32D30] border border-maroon-800 px-1.5 py-0.5 rounded text-white tracking-wider uppercase ml-1 block sm:inline">
                  Use Code: {activeOffer.code}
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowCampaign(false)}
              className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer block"
              title="Dismiss Offer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className={`max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between w-full transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}>
          
          {/* Brand Logo - Playfair & Gold Accent */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="header-logo"
          >
            <div className="w-10 h-10 rounded-full bg-maroon-900 flex items-center justify-center text-gold-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
              <span className="font-serif text-xl font-bold italic text-[#C5A059]">M</span>
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest text-maroon-900 group-hover:text-maroon-950 transition-colors block leading-none">
                Mittho
              </span>
              <span className="font-sans text-[9px] tracking-[0.2em] font-semibold text-[#C5A059] uppercase block mt-1">
                Sweets & Bakers
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-full ${
                  currentView === item.id
                    ? 'text-maroon-900 bg-[#C5A059]/10'
                    : 'text-charcoal/70 hover:text-maroon-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Secret owner gateway link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2.5 border border-maroon-900/35 text-maroon-900 font-bold rounded-full hover:bg-maroon-900 hover:text-white transition-all duration-300 hover:scale-105 shadow-sm ml-2 ${
                currentView === 'admin' ? 'bg-maroon-900 text-cream border-maroon-905' : 'bg-transparent'
              }`}
              title="Admin Panel"
            >
              <User className="w-4 h-4" />
            </button>
          </nav>

          {/* Action Buttons Right Side */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Call Line */}
            <a
              id="nav-call-btn"
              href={`tel:${cleanPhone}`}
              className="px-5 py-2 border border-maroon-900 text-maroon-900 text-[11px] font-bold rounded-full uppercase tracking-tighter hover:bg-maroon-900 hover:text-cream transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>

            {/* Quick WhatsApp order */}
            <a
              id="nav-whatsapp-btn"
              href={`https://wa.me/${cleanPhone}?text=Assalam-o-Alaikum%20Mittho%20Sweets!%20I%20want%20to%20place%20a%20bakery%20order.`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-maroon-900 text-cream text-[11px] font-bold rounded-full uppercase tracking-tighter flex items-center gap-2 shadow-lg shadow-maroon-900/20 hover:bg-maroon-950 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile owner access */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl border border-maroon-900/35 text-maroon-900 transition-colors ${
                currentView === 'admin' ? 'bg-maroon-900 text-cream' : 'bg-transparent'
              }`}
              title="Admin Portal"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            <button
              id="mobile-drawer-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-maroon-900 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Open mobile navigation drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>

      </header>

    {/* Screen Mobile Drawer overlay and links */}
    {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="fixed inset-0 z-[150] bg-[#2D2D2D]/85 backdrop-blur-md flex justify-end animate-fade-in">
          <div 
            id="mobile-drawer-body"
            className="w-full max-w-xs h-full min-h-screen bg-cream p-6 flex flex-col justify-between border-l border-[#D4AF37]/20 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 mb-6">
                <span className="font-serif text-lg font-bold text-maroon-900">Mittho Menu</span>
                <button
                  id="mobile-drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#2D2D2D]/70 hover:text-maroon-900 hover:bg-[#C5A059]/10 rounded-lg"
                  aria-label="Close drawer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer list */}
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-charcoal text-sm font-semibold uppercase tracking-wider transition-colors ${
                      currentView === item.id
                        ? 'bg-maroon-900 text-cream'
                        : 'hover:bg-[#C5A059]/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Contacts */}
            <div className="space-y-4 border-t border-[#D4AF37]/20 pt-6">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full py-3 bg-transparent text-maroon-900 hover:bg-maroon-900 hover:text-[#FCF9F3] rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-maroon-900 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline</span>
              </a>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-maroon-900 text-[#FCF9F3] font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:bg-maroon-950 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Sweet Order</span>
              </a>

              <div className="text-center text-[10px] text-charcoal/60 font-mono">
                Gojra, Punjab, Pakistan
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
