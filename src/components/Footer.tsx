/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { ContactInfo } from '../types';

interface FooterProps {
  currentView: string;
  onSetView: (view: string) => void;
  contactInfo: ContactInfo;
}

export default function Footer({ currentView, onSetView, contactInfo }: FooterProps) {
  
  const handleNavClick = (viewId: string) => {
    onSetView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = contactInfo.phone.replace(/[^0-9]/g, '');

  return (
    <footer id="main-footer" className="bg-maroon-900 text-[#FCF9F3]/80 border-t border-[#D4AF37]/20 font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        
        {/* Column 1: Brand & Bio */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5 cursor-pointer block" onClick={() => handleNavClick('home')}>
            <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-maroon-900 font-bold font-serif italic text-lg shadow">
              M
            </div>
            <div>
              <span className="font-serif text-lg font-bold uppercase tracking-widest text-cream block leading-none">
                Mittho
              </span>
              <span className="font-sans text-[8px] font-semibold text-[#C5A059] uppercase tracking-widest block mt-0.5">
                Sweets & Bakers
              </span>
            </div>
          </div>
          <p className="text-[#FCF9F3]/70 text-xs leading-relaxed max-w-sm">
            Crafting premium traditional sweets, custom designer cakes, and artisanal baked assets in Gojra since generations. Our recipe is deeply rooted in absolute freshness, hygienic kitchens, and family trust.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={contactInfo.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-cream/5 hover:bg-[#C5A059] hover:text-maroon-900 flex items-center justify-center transition-all text-cream"
              aria-label="Find us on Facebook"
            >
              <Facebook className="w-4 h-4 fill-current" />
            </a>
            <a
              href={contactInfo.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded bg-cream/5 hover:bg-[#C5A059] hover:text-maroon-900 flex items-center justify-center transition-all text-cream"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-serif text-cream font-bold text-sm uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs font-semibold">
            <li>
              <button onClick={() => handleNavClick('home')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('about')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                About
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('products')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                Products
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('custom-cakes')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                Custom Cakes
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('catering')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                Catering Menu
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('gallery')} className="hover:text-[#C5A059] transition-colors uppercase tracking-wider text-[#FCF9F3]/70 hover:translate-x-1 transition-all inline-block">
                Photo Gallery
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Hours */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-serif text-cream font-bold text-sm uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">
            Gojra Outlet
          </h4>
          <ul className="space-y-3 text-xs text-[#FCF9F3]/70">
            <li className="flex gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>{contactInfo.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">{contactInfo.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
            </li>
            <li className="flex gap-2.5 pt-2 border-t border-[#FCF9F3]/10">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <p className="font-semibold text-cream">Open Hours:</p>
                <p className="text-[10px] mt-0.5 text-[#FCF9F3]/60">Mon - Sat: {contactInfo.workingHours.weekdays}</p>
                <p className="text-[10px] text-[#FCF9F3]/60 font-mono">Sunday: {contactInfo.workingHours.sunday}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 4: Google Map Mini View (Local SEO) */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-serif text-cream font-bold text-sm uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">
            Our Location
          </h4>
          <div className="h-32 rounded-lg overflow-hidden border border-[#FCF9F3]/10 shadow-md relative group">
            <iframe
              src={contactInfo.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mittho Sweets Gojra Map View"
            ></iframe>
            {/* Visual overlay for local SEO trust */}
            <div className="absolute inset-0 bg-transparent pointer-events-none border border-[#FCF9F3]/10 group-hover:border-[#C5A059] transition-colors"></div>
          </div>
          <p className="text-[10px] text-[#FCF9F3]/50 font-mono tracking-wide uppercase leading-tight">
            📍 Sweet Shop in Gojra Punjab | Walkins Welcome!
          </p>
          {contactInfo.googleMapsUrl && (
            <a 
              href={contactInfo.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] hover:text-[#FCF9F3] tracking-wide uppercase group pt-1"
            >
              <span>🗺️ Navigate via Google Maps App</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          )}
        </div>

      </div>

      {/* SEO & Location Keywords list */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-[#FCF9F3]/5 py-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[10px] text-[#FCF9F3]/40 font-mono font-medium">
          <span>🏷️ GOJRA PREMIUM BAKERY</span>
          <span>• BEST CUSTOM CAKES IN GOJRA</span>
          <span>• FRESH DESI GHEE MITHAI GOJRA</span>
          <span>• WEDDING SWEET PLATTERS</span>
          <span>• BIRTHDAY CAKES IN GOJRA</span>
        </div>
      </div>

      {/* Brand Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-[#FCF9F3]/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FCF9F3]/50">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} Mittho Sweets & Bakers. All rights preserved.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Handcrafted with</span>
          <Heart className="w-3.5 h-3.5 text-cream fill-[#C5A059]" />
          <span>for premium confectionery.</span>
          <button
            onClick={handleScrollToTop}
            className="ml-4 p-2 bg-cream/5 hover:bg-[#C5A059] hover:text-maroon-900 rounded transition-all"
            title="Scroll to Top"
            aria-label="Scroll to top of the page"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
