/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Share2, Star, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  contactPhone: string;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  initialCheckout?: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  contactPhone,
  relatedProducts,
  onSelectProduct,
  initialCheckout = false
}: ProductDetailModalProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>(product.weightOptions[0] || '1 Kg');
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(initialCheckout);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);

  // Simple pricing multiplication fallback (e.g. if 2kg is twice, etc.)
  const getCalculatedPrice = () => {
    let multiplier = 1;
    if (selectedWeight.includes('2') || selectedWeight.toLowerCase().includes('4 lbs') || selectedWeight.includes('12')) {
      multiplier = 1.9; // discount for larger sizes
    } else if (selectedWeight.includes('4') || selectedWeight.includes('10')) {
      multiplier = 3.5;
    }
    return Math.round(product.price * multiplier * quantity);
  };

  const handleShare = () => {
    setCopied(true);
    if (navigator.clipboard) {
      const shareText = `Check out this delicious ${product.name} at Mittho Sweets & Bakers Gojra! Quick Order via WhatsApp.`;
      navigator.clipboard.writeText(`${window.location.origin}/?product=${product.id}`);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProceedToCheckout = () => {
    setIsCheckingOut(true);
  };

  const submitWhatsAppOrder = () => {
    let hasError = false;
    
    if (!fullName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!phone.trim()) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (orderType === 'delivery' && !address.trim()) {
      setAddressError(true);
      hasError = true;
    } else {
      setAddressError(false);
    }

    if (hasError) return;

    const calculatedPrice = getCalculatedPrice();
    const typeLabel = orderType === 'delivery' ? '🛵 Home Delivery' : '🏪 Self Pickup at Gojra Outlet';
    
    const message = `Assalam-o-Alaikum Mittho Sweets & Bakers Gojra! 🌟\n\nI want to place an order. Here are my details:\n\n👤 *Customer Name*: ${fullName.trim()}\n📞 *Phone Number*: ${phone.trim()}\n📦 *Order Type*: ${typeLabel}\n${orderType === 'delivery' ? `📍 *Delivery Address*: ${address.trim()}\n` : ''}${specialNotes.trim() ? `📝 *Special Notes*: ${specialNotes.trim()}\n` : ''}\n-----------------------------\n🛒 *Order Item details*:\n- *Product*: ${product.name}\n- *Weight/Pack*: ${selectedWeight}\n- *Quantity*: ${quantity}x\n- *Total Price*: Rs. ${calculatedPrice}\n-----------------------------\n\nKindly confirm my order and share the estimated delivery time. JazakAllah!`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div 
      id="product-modal-backdrop" 
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-center items-start md:items-center p-2 sm:p-4 bg-charcoal/80 backdrop-blur-md overflow-y-auto animate-fade-in cursor-pointer"
    >
      <div 
        id="product-modal-container"
        className="relative w-full max-w-4xl bg-cream border border-beige rounded-2xl overflow-hidden shadow-2xl my-2 md:my-8 transition-all cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="product-modal-close"
          onClick={onClose}
          className="fixed md:absolute top-4 right-4 z-50 md:z-10 p-2 text-charcoal hover:text-maroon-900 bg-cream/95 backdrop-blur-sm border border-beige rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="relative h-64 sm:h-80 md:h-auto md:min-h-[450px] bg-maroon-950">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Visual labels on image */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-gold-600 text-charcoal rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Mittho Premium
                </span>
                {product.bestseller && (
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-maroon-900 text-white rounded-full shadow-md">
                    Bestseller
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif text-cream leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Right Column: Culinary Specs & Checkout */}
          <div className="p-6 md:p-8 flex flex-col justify-between bg-cream">
            {!isCheckingOut ? (
              // STEP 1: CULINARY SPECS
              <div>
                {/* Category & Ratings */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-maroon-900 bg-maroon-100 px-3 py-1 rounded-md">
                    {product.category.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-gold-600 font-medium text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating} / 5.0 Rating</span>
                  </div>
                </div>

                {/* Real Description */}
                <p className="text-sm md:text-base text-stone-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Weight Selector */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">
                    Select Weight / Pack Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.weightOptions.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                          selectedWeight === weight
                            ? 'bg-maroon-900 text-white border-maroon-900 shadow-md scale-105'
                            : 'bg-cream-dark text-stone-700 border-beige hover:border-beige-dark'
                        }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ingredients Breakdown */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                    Fresh Ingredients Highlight
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs text-stone-600 bg-beige/35 rounded-md flex items-center gap-1 font-mono"
                      >
                        <Check className="w-3 h-3 text-gold-700" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Quantity & Checkout Bar */}
                <div className="pt-6 border-t border-beige">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-stone-500 font-medium">calculated price</div>
                      <div className="text-3xl font-serif text-maroon-950 font-bold">
                        Rs. {getCalculatedPrice().toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center border border-beige rounded-lg bg-cream-dark overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-stone-600 hover:bg-beige/40 transition-colors font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-stone-900 font-medium text-base">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-stone-600 hover:bg-beige/40 transition-colors font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* CTA Action buttons */}
                  <div className="flex gap-3">
                    <button
                      id="modal-wa-checkout"
                      onClick={handleProceedToCheckout}
                      className="flex-1 px-6 py-4 bg-maroon-900 text-white hover:bg-maroon-950 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer font-bold"
                    >
                      <ShoppingBag className="w-5 h-5 fill-current" />
                      <span>Order on WhatsApp</span>
                    </button>

                    <button
                      id="modal-share"
                      onClick={handleShare}
                      className="p-4 bg-cream border border-beige hover:border-beige-dark rounded-xl text-stone-700 hover:text-maroon-900 shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center relative"
                      title="Copy link"
                    >
                      <Share2 className="w-5 h-5" />
                      {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-semibold bg-charcoal text-cream rounded shadow-lg whitespace-nowrap animate-fade-in">
                          Link Copied!
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Highly Visible under-button close link */}
                  <button
                    onClick={onClose}
                    className="mt-4 w-full text-center text-xs font-bold text-stone-500 hover:text-maroon-900 active:text-maroon-950 hover:bg-beige/12 py-3 rounded-xl border border-dashed border-beige transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>✕ Close Description & Return</span>
                  </button>
                </div>
              </div>
            ) : (
              // STEP 2: SHIPPING/DELIVERY FORM
              <div className="flex flex-col justify-between h-full space-y-4">
                <div>
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-maroon-900 hover:text-maroon-950 mb-3 select-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Specifications</span>
                  </button>

                  <h3 className="font-serif text-xl font-bold text-maroon-950 mb-1">
                    Details For Verification
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Kindly complete the shipping and contact details for Gojra limits.
                  </p>

                  <div className="space-y-3.5">
                    {/* Name Input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (e.target.value.trim()) setNameError(false);
                        }}
                        placeholder="e.g. Asfandyar Khan"
                        className={`w-full text-xs px-3 py-2.5 bg-cream-dark border rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 ${
                          nameError ? 'border-red-500 bg-red-50/20' : 'border-beige'
                        }`}
                      />
                      {nameError && (
                        <span className="text-[10px] text-red-500 font-medium block mt-1">Please enter your name</span>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Phone Number / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (e.target.value.trim()) setPhoneError(false);
                        }}
                        placeholder="e.g. 0300 1234567"
                        className={`w-full text-xs px-3 py-2.5 bg-cream-dark border rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 ${
                          phoneError ? 'border-red-500 bg-red-50/20' : 'border-beige'
                        }`}
                      />
                      {phoneError && (
                        <span className="text-[10px] text-red-500 font-medium block mt-1">Please enter your phone number</span>
                      )}
                    </div>

                    {/* Order Type Tabs */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1.5">
                        Delivery Method
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-cream-dark p-1 rounded-xl border border-beige">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                            orderType === 'delivery'
                              ? 'bg-maroon-900 text-cream shadow-sm'
                              : 'text-stone-600 hover:bg-beige/20'
                          }`}
                        >
                          🛵 Home Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                            orderType === 'pickup'
                              ? 'bg-maroon-900 text-cream shadow-sm'
                              : 'text-stone-600 hover:bg-beige/20'
                          }`}
                        >
                          🏪 Self Pickup
                        </button>
                      </div>
                    </div>

                    {/* Conditional Delivery Address Input */}
                    {orderType === 'delivery' && (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                          Delivery Address in Gojra *
                        </label>
                        <textarea
                          required
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (e.target.value.trim()) setAddressError(false);
                          }}
                          rows={2}
                          placeholder="e.g. Ward No. 5 near Ghallah Mandi, Gojra..."
                          className={`w-full text-xs px-3 py-2 bg-cream-dark border rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 resize-none ${
                            addressError ? 'border-red-500 bg-red-50/20' : 'border-beige'
                          }`}
                        ></textarea>
                        {addressError && (
                          <span className="text-[10px] text-red-500 font-medium block mt-1">Please specify delivery address</span>
                        )}
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="e.g. please wrap as birthday gift, send candles"
                        className="w-full text-xs px-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900"
                      />
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="pt-4 border-t border-beige mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-stone-500 font-medium uppercase">Order Bill ({quantity}x {selectedWeight})</p>
                        <p className="text-2xl font-serif text-maroon-950 font-bold">Rs. {getCalculatedPrice().toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] font-mono text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-full uppercase font-bold">
                        🛒 Pure Delicacy
                      </span>
                    </div>

                    <button
                      onClick={submitWhatsAppOrder}
                      className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 fill-current" />
                      <span>Confirm Order via WhatsApp</span>
                    </button>

                    {/* Highly Visible Cancel & Close option under CTA */}
                    <button
                      onClick={onClose}
                      className="mt-3 w-full text-center text-xs font-bold text-stone-500 hover:text-red-750 active:text-red-800 hover:bg-beige/12 py-3 rounded-xl border border-dashed border-beige transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>✕ Close and Return to Menu</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Related Products List */}
        {relatedProducts.length > 0 && !isCheckingOut && (
          <div className="p-6 md:p-8 border-t border-[#dfdfdf] bg-cream-dark/40">
            <h4 className="text-sm font-serif text-maroon-950 uppercase tracking-widest mb-4 font-bold">
              You Might Also Appreciate
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    setSelectedWeight(rel.weightOptions[0] || '1 Kg');
                    setQuantity(1);
                  }}
                  className="group bg-cream p-3 rounded-lg border border-beige/65 hover:border-beige-dark transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="aspect-square w-full rounded-md overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <h5 className="font-serif text-sm text-charcoal font-medium line-clamp-1 group-hover:text-maroon-900">
                    {rel.name}
                  </h5>
                  <p className="text-xs text-maroon-800 font-semibold font-mono mt-1">
                    Rs. {rel.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
