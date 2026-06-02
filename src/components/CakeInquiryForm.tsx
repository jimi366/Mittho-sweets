/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Layers, Palette, DollarSign, Phone, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { Inquiry } from '../types';

interface CakeInquiryFormProps {
  onAddInquiry: (inquiry: Inquiry) => void;
  contactPhone: string;
}

export default function CakeInquiryForm({ onAddInquiry, contactPhone }: CakeInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventType: 'Birthday Party',
    cakeSize: '4 Lbs (Standard Family)',
    cakeFlavor: 'Belgian Chocolate Fudge',
    budget: 'Rs. 4,000 - 8,000',
    referenceImage: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const eventTypes = [
    'Birthday Party',
    'Royal Wedding Reception',
    'Anniversary Milestone',
    'Kids Character Celebration',
    'Corporate Launch / Event',
    'Other Special Landmark'
  ];

  const cakeSizes = [
    '2 Lbs (Small / Single Layer)',
    '4 Lbs (Standard Family / Wide Base)',
    '6 Lbs (Beautiful Two-Tier Designer)',
    '10 Lbs (Royal Cascade Multi-Tier)',
    '15 Lbs+ (Grand Palace Landmark)'
  ];

  const cakeFlavors = [
    'Belgian Chocolate Fudge (Deep Rich)',
    'Royal Saffron & Pistachio Infusion',
    'Classic Red Velvet Cream Cheese',
    'Madagascar Creamy Vanilla Bean',
    'Lotus Biscoff Salted Caramel',
    'Summer Fresh Mango Mousse (Seasonal)'
  ];

  const budgets = [
    'Rs. 2,500 - Rs. 5,000',
    'Rs. 5,000 - Rs. 10,000',
    'Rs. 10,000 - Rs. 20,000',
    'Rs. 20,000 - Rs. 50,000+',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventDate) {
      alert('Please fill out the mandatory fields (Name, Phone, and Event Date)');
      return;
    }

    const detailString = `Event: ${formData.eventType} | Flavor: ${formData.cakeFlavor} | Size: ${formData.cakeSize} | Budget: ${formData.budget} | Ref Image URL: ${formData.referenceImage || 'None'} | Message: ${formData.message}`;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      type: 'custom-cake',
      name: formData.name,
      phone: formData.phone,
      date: formData.eventDate,
      status: 'pending',
      details: detailString,
      timestamp: new Date().toLocaleString()
    };

    onAddInquiry(newInquiry);
    setSubmitted(true);

    // Double Action: Generate preformatted custom WhatsApp dispatch
    const waMessage = `Assalam-o-Alaikum Mittho Sweets & Bakers Gojra! 🎂\n\nI want to inquire about a *Custom Designer Cake*:\n\n👤 *Client Name*: ${formData.name}\n📞 *Phone*: ${formData.phone}\n📅 *Event Date*: ${formData.eventDate}\n✨ *Celebration*: ${formData.eventType}\n🍰 *Size*: ${formData.cakeSize}\n🍫 *Flavor*: ${formData.cakeFlavor}\n💵 *Tentative Budget*: ${formData.budget}\n🖼️ *Reference Image/Idea*: ${formData.referenceImage || 'Will show in chat'}\n\n📝 *Instructions*: ${formData.message || 'No extra guidelines.'}\n\nLooking forward to your design quote!`;
    const encoded = encodeURIComponent(waMessage);
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

    // Reset Form
    setFormData({
      name: '',
      phone: '',
      eventDate: '',
      eventType: 'Birthday Party',
      cakeSize: '4 Lbs (Standard Family)',
      cakeFlavor: 'Belgian Chocolate Fudge',
      budget: 'Rs. 4,000 - 8,000',
      referenceImage: '',
      message: ''
    });

    // open whatsapp
    setTimeout(() => {
      window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div id="cake-inquiry-box" className="p-6 md:p-10 bg-cream rounded-2xl border border-beige shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-gold-600 font-semibold tracking-widest text-xs uppercase block mb-2">
          artisanal masterpiece
        </span>
        <h3 className="text-2xl md:text-3xl font-serif text-maroon-950 font-bold mb-3">
          Envision Your Dream Cake
        </h3>
        <p className="text-stone-600 max-w-lg mx-auto text-sm leading-relaxed">
          Fill our designer custom inquiry block below. This saves your booking in our queue system and automatically compiles standard cake notes for direct WhatsApp confirmation!
        </p>
      </div>

      {submitted ? (
        <div id="cake-success-card" className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-maroon-900 text-gold-500 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-serif text-maroon-950 font-bold mb-2">
            Inquiry Registered Securely!
          </h4>
          <p className="text-stone-600 max-w-md mx-auto text-sm mb-4">
            We are now redirecting you to WhatsApp to discuss custom reference files, design textures, and finalize toppings.
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Launching secure chat link...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-name">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="cake-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Asfandyar Khan"
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-phone">
                Active WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500 text-xs font-mono">
                  +92
                </span>
                <input
                  id="cake-phone"
                  type="tel"
                  required
                  placeholder="3001234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
                />
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-date">
                Celebration Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="cake-date"
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
                />
              </div>
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-event-type">
                Event Occasion
              </label>
              <select
                id="cake-event-type"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Cake Size */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-size">
                Ideal Cake Size / Tier Weight
              </label>
              <select
                id="cake-size"
                value={formData.cakeSize}
                onChange={(e) => setFormData({ ...formData, cakeSize: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              >
                {cakeSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Flavor preference */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-flavor">
                Preferred Flavor Profile
              </label>
              <select
                id="cake-flavor"
                value={formData.cakeFlavor}
                onChange={(e) => setFormData({ ...formData, cakeFlavor: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              >
                {cakeFlavors.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>

            {/* Budget estimation */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-budget">
                Allocated Budget Target
              </label>
              <select
                id="cake-budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              >
                {budgets.map((budg) => (
                  <option key={budg} value={budg}>{budg}</option>
                ))}
              </select>
            </div>

            {/* Reference Image link */}
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-image-url">
                Reference Image URL <span className="text-stone-400 font-normal">(Optional Pinterest Link)</span>
              </label>
              <input
                id="cake-image-url"
                type="url"
                value={formData.referenceImage}
                onChange={(e) => setFormData({ ...formData, referenceImage: e.target.value })}
                placeholder="https://pinterest.com/pin/xyz..."
                className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300"
              />
            </div>

          </div>

          {/* Message / Custom theme details */}
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2" htmlFor="cake-msg">
              Custom Theme Guidelines & Wording <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="cake-msg"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="e.g. Please put a gold crown topper, name 'Aiza' written in golden cursive, and base colored baby pink..."
              className="w-full px-4 py-3 bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] text-sm focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all/300 resize-none"
            ></textarea>
          </div>

          <div className="pt-4 text-center">
            <button
               id="submit-cake-form"
               type="submit"
               className="px-8 py-4 bg-maroon-900 text-white hover:bg-maroon-700 font-semibold tracking-wide rounded flex items-center justify-center mx-auto gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-gold-300" />
              <span>Submit Inquiry & Open WhatsApp Chat</span>
            </button>
            <p className="text-stone-400 text-[10px] mt-3 uppercase tracking-wider">
              No prepayment is required to request a custom cake quote.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
