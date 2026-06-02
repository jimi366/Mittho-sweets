import React, { useState } from 'react';
import { Offer } from '../../types';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, Calendar, Image as ImageIcon, X } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface OffersCMSProps {
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  addActivityLog: (action: string, details: string) => void;
}

export default function OffersCMS({ offers, setOffers, addActivityLog }: OffersCMSProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<{ id: string; title: string } | null>(null);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    code: '',
    discount: '',
    active: true,
    status: 'active',
    startDate: '',
    endDate: '',
  });

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.description || !newOffer.discount) {
      alert('Fill out offer title, description, and discount value.');
      return;
    }

    const created: Offer = {
      id: `off-${Date.now()}`,
      title: newOffer.title,
      description: newOffer.description,
      code: (newOffer.code || '').trim().toUpperCase(),
      discount: newOffer.discount,
      active: newOffer.active ?? true,
      status: newOffer.status || 'active',
      startDate: newOffer.startDate || '',
      endDate: newOffer.endDate || '',
      image: newOffer.image || ''
    };

    setOffers([created, ...offers]);
    addActivityLog('Create Offer', `Created dynamic campaign offer: "${created.title}"`);
    setNewOffer({
      title: '',
      description: '',
      code: '',
      discount: '',
      active: true,
      status: 'active',
      startDate: '',
      endDate: '',
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    setOffers(offers.map(o => o.id === editingOffer.id ? editingOffer : o));
    addActivityLog('Update Offer', `Modified promotional campaign: "${editingOffer.title}"`);
    setEditingOffer(null);
  };

  const handleDeleteOffer = (id: string, title: string) => {
    setOfferToDelete({ id, title });
  };

  const handleDeleteConfirm = () => {
    if (!offerToDelete) return;
    const { id, title } = offerToDelete;
    setOffers(offers.filter(o => o.id !== id));
    addActivityLog('Delete Offer', `Permanently deleted campaign promo text: "${title}"`);
    setOfferToDelete(null);
  };

  const handleToggleActive = (id: string) => {
    const target = offers.find(o => o.id === id);
    if (!target) return;
    const nextActiveState = !target.active;
    
    setOffers(offers.map(o => {
      if (o.id === id) {
        return { ...o, active: nextActiveState, status: nextActiveState ? 'active' : 'inactive' };
      }
      // If setting this offer to active, we can opt to keep others active, or limit to 1 active high-featured at a time
      return o;
    }));
    
    addActivityLog('Toggle Offer Status', `promotional coupon "${target.title}" set to ${nextActiveState ? 'ACTIVE & DISPLAYED' : 'PAUSED'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-serif text-maroon-950 font-bold">Promotional Campaigns Ledger</h4>
          <p className="text-xs text-stone-500">Configure discount triggers, voucher codes, holiday promotions, and top navigation bar tickers.</p>
        </div>
        
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingOffer(null);
          }}
          className="px-4 py-2 bg-maroon-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-maroon-950 shadow-md select-none cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Launch Celebration Promo</span>
        </button>
      </div>

      {/* CREATE OFFER CODES */}
      {showAddForm && (
        <div className="w-full space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Offers List
            </button>
          </div>
          <form onSubmit={handleAddOffer} className="bg-cream border border-beige p-5 rounded-xl space-y-4 shadow-sm">
            <div className="border-b border-beige pb-2 mb-3 flex items-center justify-between gap-4 border-dashed">
              <h5 className="font-serif text-maroon-950 font-bold text-sm">Design Brand Banner Campaign</h5>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); }}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cut</span>
              </button>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Promo Ticker Title (Heading)</label>
              <input
                type="text"
                required
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                placeholder="FREE DELIVERY OR SUNDAY MITHAI SPECIAL"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Discount Tag line</label>
              <input
                type="text"
                required
                value={newOffer.discount}
                onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                placeholder="Buy 2 Get 1 Free or 15% OFF"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Detailed Description (Appears on Ticker & Modals)</label>
              <input
                type="text"
                required
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                placeholder="Get a free box of bespoke wood-baked almond cookies on all Custom Cakes above Rs. 4000."
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Promo Coupon Code (Optional)</label>
              <input
                type="text"
                value={newOffer.code}
                onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                placeholder="EIDMUBARAK"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Schedule Launch Date</label>
              <input
                type="date"
                value={newOffer.startDate}
                onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Promotional Expiration Date</label>
              <input
                type="date"
                value={newOffer.endDate}
                onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs select-none"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 hover:bg-maroon-950 text-white rounded text-xs font-bold"
            >
              Add Active Promotion
            </button>
          </div>
        </form>
        </div>
      )}

      {/* EDITING FORMS CODES */}
      {editingOffer && (
        <div className="w-full space-y-4 animate-fade-in">
          <div className="flex justify-between items-center bg-amber-50/10">
            <button
              type="button"
              onClick={() => setEditingOffer(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Offers List
            </button>
          </div>
          <form onSubmit={handleSaveEdit} className="bg-cream border border-gold-600/30 p-5 rounded-xl space-y-4 shadow-sm bg-amber-50/15">
            <div className="border-b border-beige pb-2 mb-3 flex items-center justify-between gap-4 border-dashed">
              <h5 className="font-serif text-maroon-950 font-bold text-sm">Edit Active Promo Code Parameters</h5>
              <button
                type="button"
                onClick={() => setEditingOffer(null)}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cut</span>
              </button>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Promo Heading / Header Title</label>
              <input
                type="text"
                required
                value={editingOffer.title}
                onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Voucher Discount Label</label>
              <input
                type="text"
                required
                value={editingOffer.discount}
                onChange={(e) => setEditingOffer({ ...editingOffer, discount: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Full Offer Details Message</label>
              <input
                type="text"
                required
                value={editingOffer.description}
                onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Promo Code SKU</label>
              <input
                type="text"
                value={editingOffer.code || ''}
                onChange={(e) => setEditingOffer({ ...editingOffer, code: e.target.value.toUpperCase() })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Event Start Time / Date</label>
              <input
                type="date"
                value={editingOffer.startDate || ''}
                onChange={(e) => setEditingOffer({ ...editingOffer, startDate: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Event End Time / Expiration</label>
              <input
                type="date"
                value={editingOffer.endDate || ''}
                onChange={(e) => setEditingOffer({ ...editingOffer, endDate: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Campaign Status</label>
              <select
                value={editingOffer.status || (editingOffer.active ? 'active' : 'inactive')}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingOffer({ 
                    ...editingOffer, 
                    status: val as Offer['status'],
                    active: val === 'active'
                  });
                }}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none"
              >
                <option value="active">Active (On Header Block)</option>
                <option value="inactive">Paused (Archived)</option>
                <option value="scheduled">Scheduled Draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditingOffer(null)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs select-none"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 text-white rounded text-xs font-bold"
            >
              Post Updated Campaign
            </button>
          </div>
        </form>
        </div>
      )}

      {/* RENDER DYNAMIC CARDS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {offers.map((item) => (
          <div key={item.id} className="relative group bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            {/* Coupon Ribbon Tag decoration */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
              <span className="px-2.5 py-0.5 bg-gold-600 border border-gold-550 text-charcoal text-[9px] uppercase font-extrabold rounded-full font-sans tracking-wide">
                {item.discount}
              </span>
              {item.code && (
                <span className="px-2 py-0.5 bg-[#A32D30] text-cream text-[9px] font-mono font-bold rounded">
                  {item.code}
                </span>
              )}
            </div>

            {/* Campaign Options overlay */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10 select-none">
              <button
                onClick={() => handleToggleActive(item.id)}
                className={`p-1.5 rounded-full shadow border transition-colors cursor-pointer text-[10px] ${
                  item.active
                    ? 'bg-green-600 text-cream border-green-500'
                    : 'bg-white text-stone-500 border-beige/65 hover:bg-beige/10'
                }`}
                title={item.active ? 'Mute Billboard' : 'Set active & Display'}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upper Content Banner */}
            <div className="p-5 pt-12 space-y-3 flex-grow bg-radial-vibe">
              <h5 className="font-serif text-maroon-950 font-bold text-lg leading-tight group-hover:text-maroon-900 transition-colors">
                {item.title}
              </h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.description}
              </p>

              {(item.startDate || item.endDate) && (
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-mono mt-2">
                  <Calendar className="w-3 h-3 text-gold-600" />
                  <span>
                    {item.startDate || 'Immediate'} → {item.endDate || 'No limits'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Footer row */}
            <div className="p-4 border-t border-beige/65 bg-cream-dark/25 flex items-center justify-between gap-2.5">
              <span className={`text-[9px] uppercase tracking-wider font-extrabold font-mono ${
                item.active ? 'text-green-700' : 'text-stone-400'
              }`}>
                ● {item.active ? 'Visible On Live Site' : 'Disabled (Hidden)'}
              </span>

              <div className="flex items-center gap-1 select-none">
                <button
                  onClick={() => {
                    setEditingOffer(item);
                    setShowAddForm(false);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-1 px-2 border border-beige hover:border-maroon-900 text-stone-600 hover:text-maroon-900 rounded text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteOffer(item.id, item.title)}
                  className="p-1 px-2 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {offerToDelete && (
        <DeleteConfirmModal 
          isOpen={offerToDelete !== null}
          onClose={() => setOfferToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Promo Campaign?"
          message={`Are you sure you want to delete the offer "${offerToDelete.title}"? This campaign and its promo code will no longer be visible on your homepage.`}
        />
      )}
    </div>
  );
}
