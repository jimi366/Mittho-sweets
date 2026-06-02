/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Users, Layers, ShieldCheck, MessageCircle, DollarSign } from 'lucide-react';
import { CateringPackage, Inquiry } from '../types';

interface CateringEstimatorProps {
  packages: CateringPackage[];
  onAddInquiry: (inquiry: Inquiry) => void;
  contactPhone: string;
}

export default function CateringEstimator({ packages, onAddInquiry, contactPhone }: CateringEstimatorProps) {
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage>(packages[0] || {} as CateringPackage);
  const [guests, setGuests] = useState<number>(150);
  const [includeWelcomeBeverages, setIncludeWelcomeBeverages] = useState<boolean>(true);
  const [includeVIPPlaques, setIncludeVIPPlaques] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [contactName, setContactName] = useState<string>('');
  const [contactPhoneNum, setContactPhoneNum] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');

  const welcomeDrinkPrice = 50;
  const vipPlaquesPrice = 80;

  const calculatePerHeadPrice = () => {
    let base = selectedPackage.pricePerHead;
    if (includeWelcomeBeverages) base += welcomeDrinkPrice;
    if (includeVIPPlaques) base += vipPlaquesPrice;
    return base;
  };

  const calculateGrandTotal = () => {
    return calculatePerHeadPrice() * guests;
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhoneNum || !eventDate) {
      alert('Please fill out your Name, Phone Number, and Event Date to request the catering quote.');
      return;
    }

    const detailsText = `Catering Package: ${selectedPackage.name} | Guests: ${guests} | Per Head: Rs. ${calculatePerHeadPrice()} | Include Drinks: ${includeWelcomeBeverages ? 'Yes' : 'No'} | Include VIP: ${includeVIPPlaques ? 'Yes' : 'No'} | Grand Est: Rs. ${calculateGrandTotal()}`;

    const newInquiry: Inquiry = {
      id: `inq-cat-${Date.now()}`,
      type: 'catering',
      name: contactName,
      phone: contactPhoneNum,
      date: eventDate,
      status: 'pending',
      details: detailsText,
      timestamp: new Date().toLocaleString()
    };

    onAddInquiry(newInquiry);
    setSubmitted(true);

    const checkLabel = (check: boolean) => check ? '✅ Enclosed' : '❌ Excluded';
    const waText = `Assalam-o-Alaikum Mittho Sweets & Bakers Gojra! 🕊️\n\nI want to request a *Wedding & Event Catering Proposal*:\n\n👤 *Client Name*: ${contactName}\n📞 *WhatsApp*: ${contactPhoneNum}\n📅 *Event Date*: ${eventDate}\n📦 *Selected Package*: ${selectedPackage.name}\n👥 *Guest Count*: ${guests} heads\n\n📌 *Addons selected*:\n- Welcome Beverages: ${checkLabel(includeWelcomeBeverages)}\n- Royal VIP Sweet Plaques: ${checkLabel(includeVIPPlaques)}\n\n💰 *Estimated Total Budget*: Rs. ${calculateGrandTotal().toLocaleString()} (approx Rs. ${calculatePerHeadPrice()}/head)\n\nPlease coordinate package fine-tuning, customization of sweet menus and buffet setups. JazakAllah!`;
    const encoded = encodeURIComponent(waText);
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

    // Reset fields
    setContactName('');
    setContactPhoneNum('');
    setEventDate('');

    setTimeout(() => {
      window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div id="catering-estimator" className="p-6 md:p-10 bg-cream rounded-lg border border-beige shadow-xl max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="mb-4">
            <span className="text-gold-600 font-semibold tracking-widest text-xs uppercase block mb-1">
              Event Sweet Configurer
            </span>
            <h3 className="text-2xl font-serif text-maroon-950 font-bold">
              Event Budget Planner & Estimator
            </h3>
            <p className="text-[#555] text-xs mt-1">
              Select an exquisite catering package, slide your guest capacity, and customize extra premium additions of your choice.
            </p>
          </div>

          {/* Package Selector Cards */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-3">
              1. Select Culinary Foundation
            </label>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded border-2 transition-all cursor-pointer flex justify-between items-center ${
                    selectedPackage.id === pkg.id
                      ? 'border-maroon-900 bg-maroon-50/10'
                      : 'border-beige bg-cream hover:bg-cream-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-maroon-950 font-bold leading-tight">
                        {pkg.name}
                      </h4>
                      <p className="text-[11px] text-[#555] line-clamp-1 mt-0.5">
                        {pkg.items.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded font-semibold mb-1 inline-block">
                      {pkg.badge || 'Assortment'}
                    </span>
                    <div className="font-mono text-xs font-bold text-[#333]">
                      Rs. {pkg.pricePerHead}/head
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest" htmlFor="count-slider">
                2. Sliding Guest Capacity
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-maroon-100 rounded text-maroon-900 font-mono text-sm font-semibold">
                <Users className="w-4 h-4" />
                <span>{guests} Guests</span>
              </div>
            </div>
            <input
              id="count-slider"
              type="range"
              min="50"
              max="2000"
              step="25"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full h-2 bg-beige rounded appearance-none cursor-pointer accent-maroon-900"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>MIN: 50 heads</span>
              <span>250</span>
              <span>500</span>
              <span>1000</span>
              <span>MAX: 2000+ heads</span>
            </div>
          </div>

          {/* Upgrades Addons Checklist */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-3">
              3. Select Luxury Upgrades
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setIncludeWelcomeBeverages(!includeWelcomeBeverages)}
                className={`p-3 rounded border cursor-pointer select-none transition-all flex items-center justify-between ${
                  includeWelcomeBeverages ? 'bg-beige/40 border-maroon-300' : 'bg-cream border-beige'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-maroon-950">Welcome Royal Beverages</div>
                  <div className="text-[10px] text-stone-500 font-mono">+Rs. {welcomeDrinkPrice}/head</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeWelcomeBeverages}
                  onChange={() => {}} // Hanldled by divine click
                  className="rounded text-maroon-900 focus:ring-maroon-900 h-4 w-4 bg-cream"
                />
              </div>

              <div
                onClick={() => setIncludeVIPPlaques(!includeVIPPlaques)}
                className={`p-3 rounded border cursor-pointer select-none transition-all flex items-center justify-between ${
                  includeVIPPlaques ? 'bg-beige/40 border-maroon-300' : 'bg-cream border-beige'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-maroon-950">Satin VIP Gift Trays</div>
                  <div className="text-[10px] text-stone-500 font-mono">+Rs. {vipPlaquesPrice}/head</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeVIPPlaques}
                  onChange={() => {}}
                  className="rounded text-maroon-900 focus:ring-maroon-900 h-4 w-4 bg-cream"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Preview & Submission Box */}
        <div className="lg:col-span-5 bg-maroon-950 rounded-lg p-6 text-cream flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-gold-500" />
              <span className="font-serif text-lg tracking-wide uppercase">Inquiry Summary</span>
            </div>

            {/* Calculations and Lists */}
            <div className="space-y-4 font-mono text-xs text-stone-300 border-b border-white/10 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Base package:</span>
                <span className="text-cream">Rs. {selectedPackage.pricePerHead}/head</span>
              </div>
              {includeWelcomeBeverages && (
                <div className="flex justify-between">
                  <span>Welcome Beverages:</span>
                  <span className="text-cream">+Rs. {welcomeDrinkPrice}/head</span>
                </div>
              )}
              {includeVIPPlaques && (
                <div className="flex justify-between">
                  <span>Royal Satin Trays Addon:</span>
                  <span className="text-cream">+Rs. {vipPlaquesPrice}/head</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-cream border-t border-white/10 pt-2">
                <span>Combined Price Per Head:</span>
                <span className="text-gold-500">Rs. {calculatePerHeadPrice()}/head</span>
              </div>
              <div className="flex justify-between">
                <span>Number of guests:</span>
                <span className="text-cream">{guests} heads</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">Grand Estimated Total</div>
              <div className="text-4xl font-serif text-gold-500 font-bold tracking-tight">
                Rs. {calculateGrandTotal().toLocaleString()}
              </div>
              <span className="text-[9px] font-sans text-stone-300 block mt-1 line-clamp-1 italic">
                *Final invoice may vary based on customization or server staffing required.
              </span>
            </div>

            {/* In-view micro form */}
            {submitted ? (
              <div className="bg-white/5 border border-white/10 p-4 rounded text-center">
                <div className="text-green-400 font-bold mb-1">✓ Proposal Scheduled!</div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  We are now loading custom sweet menu choices on WhatsApp. Speak with our event team now!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3">
                <h5 className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Fill In To Register Event Block
                </h5>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Tariq Chaudhry)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-xs placeholder:text-stone-400 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp No. (e.g. 03001234567)"
                    value={contactPhoneNum}
                    onChange={(e) => setContactPhoneNum(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-xs placeholder:text-stone-400 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-xs placeholder:text-stone-400 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <button
                  id="submit-catering"
                  type="submit"
                  className="w-full py-3 bg-gold-600 hover:bg-gold-700 text-charcoal font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-charcoal fill-charcoal" />
                  Request Catering Details
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Pure Freshness Guarantee since Generations</span>
          </div>
        </div>

      </div>
    </div>
  );
}
