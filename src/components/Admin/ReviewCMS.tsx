import React, { useState } from 'react';
import { Review } from '../../types';
import { Star, Plus, Edit2, Trash2, Check, X, User, Image as ImageIcon, AlertCircle } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ReviewCMSProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addActivityLog: (action: string, details: string) => void;
  handleOptimizedImageUpload: (file: File, callback: (base64: string) => void) => void;
}

export default function ReviewCMS({ reviews, setReviews, addActivityLog, handleOptimizedImageUpload }: ReviewCMSProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; name: string } | null>(null);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: '',
    text: '',
    rating: 5,
    role: 'Local Customer',
    image: '',
    status: 'approved',
    featured: true
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) {
      alert('Fill out customer name and review text.');
      return;
    }

    const created: Review = {
      id: `rev-${Date.now()}`,
      name: newReview.name,
      text: newReview.text,
      rating: newReview.rating ?? 5,
      role: newReview.role ?? 'Verified Customer',
      date: new Date().toLocaleDateString(),
      image: newReview.image || '',
      status: newReview.status || 'approved',
      featured: newReview.featured ?? true
    };

    setReviews([created, ...reviews]);
    addActivityLog('Create Review', `Manually registered new feedback review from client "${created.name}"`);
    setNewReview({
      name: '',
      text: '',
      rating: 5,
      role: 'Local Customer',
      image: '',
      status: 'approved',
      featured: true
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    setReviews(reviews.map(r => r.id === editingReview.id ? editingReview : r));
    addActivityLog('Update Review', `Updated client feedback values for: "${editingReview.name}"`);
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string, name: string) => {
    setReviewToDelete({ id, name });
  };

  const handleDeleteConfirm = () => {
    if (!reviewToDelete) return;
    const { id, name } = reviewToDelete;
    setReviews(reviews.filter(r => r.id !== id));
    addActivityLog('Delete Review', `Permanently deleted customer testimonial from: "${name}"`);
    setReviewToDelete(null);
  };

  const handleSetStatus = (id: string, status: Review['status']) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    const label = status === 'approved' ? 'Approved' : 'Rejected';
    const target = reviews.find(r => r.id === id);
    addActivityLog('Moderate Review', `${label} feedback card for "${target?.name || 'Anonymous'}"`);
  };

  const handleToggleFeatured = (id: string) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        const next = !r.featured;
        addActivityLog('Update Review Feature', `Toggled banner feature on feedback: "${r.name}"`);
        return { ...r, featured: next };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-serif text-maroon-950 font-bold">Client Reviews & Testimonials</h4>
          <p className="text-xs text-stone-500">Moderate submissions, create manual reviews, specify featured feedback for high-trust conversions.</p>
        </div>
        
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingReview(null);
          }}
          className="px-4 py-2 bg-maroon-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-maroon-950 shadow-md select-none cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Testimony</span>
        </button>
      </div>

      {/* ADD TESTIMONIAL FORM */}
      {showAddForm && (
        <div className="w-full space-y-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Testimonials
            </button>
          </div>
          <form onSubmit={handleAddReview} className="bg-cream border border-beige p-5 rounded-xl space-y-4 shadow-sm text-xs">
            <div className="border-b border-beige pb-2 mb-3 flex items-center justify-between gap-4 border-dashed">
              <h5 className="font-serif text-maroon-950 font-bold text-sm">Add Custom Customer Testimony</h5>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="Naveed Ahmed"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Role / Sub-label</label>
              <input
                type="text"
                value={newReview.role}
                onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                placeholder="Gojra Resident, Food Critic"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Stars Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
              </select>
            </div>

            {/* AVATAR PICTURE FILE SELECTOR */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Customer Image / Avatar</label>
              <div className="relative border border-dashed border-beige bg-cream-dark rounded p-1 text-center hover:border-maroon-900 transition-colors cursor-pointer select-none">
                {newReview.image ? (
                  <div className="flex items-center gap-2 justify-center py-1">
                    <img src={newReview.image} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[10px] text-green-700 font-bold">Image loaded</span>
                    <button type="button" onClick={() => setNewReview({ ...newReview, image: '' })} className="text-red-650 ml-1">✕</button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-1 font-bold text-stone-600 hover:text-maroon-900">
                    <span className="text-[10px] block">Upload Profile Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOptimizedImageUpload(file, (b64) => setNewReview({ ...newReview, image: b64 }));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Review text Content</label>
              <textarea
                required
                rows={2}
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Absolutely perfect Mithai. Real Desi Ghee flavor and perfect level of sweetness..."
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div className="flex items-center gap-6 md:col-span-2 py-1">
              <label className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-stone-600 block">
                <input
                  type="checkbox"
                  checked={newReview.status === 'approved'}
                  onChange={(e) => setNewReview({ ...newReview, status: e.target.checked ? 'approved' : 'pending' })}
                  className="rounded text-maroon-900 focus:ring-maroon-900"
                />
                <span>Approve Instantly</span>
              </label>

              <label className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-stone-600 block">
                <input
                  type="checkbox"
                  checked={newReview.featured}
                  onChange={(e) => setNewReview({ ...newReview, featured: e.target.checked })}
                  className="rounded text-maroon-900 focus:ring-maroon-900"
                />
                <span>Featured Homepage Testimony</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 text-white rounded text-xs font-bold"
            >
              Insert Testimonial
            </button>
          </div>
        </form>
        </div>
      )}

      {/* EDITING FORMS CODES */}
      {editingReview && (
        <div className="w-full space-y-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center bg-amber-50/10">
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Testimonials
            </button>
          </div>
          <form onSubmit={handleSaveEdit} className="bg-cream border border-gold-600/30 p-5 rounded-xl space-y-4 shadow-sm bg-amber-50/15 text-xs">
            <div className="border-b border-beige pb-2 mb-3 flex items-center justify-between gap-4 border-dashed">
              <h5 className="font-serif text-maroon-950 font-bold text-sm text-yellow-905">Update Testimony Parameters</h5>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cut</span>
              </button>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={editingReview.name}
                onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Role / Title Label</label>
              <input
                type="text"
                value={editingReview.role}
                onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Review Rating</label>
              <select
                value={editingReview.rating}
                onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            {/* AVATAR PIC */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Modify Picture</label>
              <input 
                type="file" 
                accept="image/*" 
                className="text-[10px]" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleOptimizedImageUpload(file, (b64) => setEditingReview({ ...editingReview, image: b64 }));
                }}
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Content Text Message</label>
              <textarea
                required
                rows={2}
                value={editingReview.text}
                onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded"
              />
            </div>

            <div className="flex gap-4 md:col-span-2 py-1 select-none">
              <label className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-stone-600 block">
                <input
                  type="checkbox"
                  checked={editingReview.status === 'approved'}
                  onChange={(e) => setEditingReview({ ...editingReview, status: e.target.checked ? 'approved' : 'pending' })}
                  className="rounded text-maroon-900"
                />
                <span>Approved</span>
              </label>

              <label className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-stone-600 block">
                <input
                  type="checkbox"
                  checked={editingReview.featured ?? true}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="rounded text-maroon-900"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs select-none"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 text-white rounded text-xs font-bold"
            >
              Post Updated testimonial
            </button>
          </div>
        </form>
        </div>
      )}

      {/* RENDERING FEEDBACK TABLE & WORKSPACE GRID */}
      <div className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-cream-dark text-stone-500 uppercase tracking-wider text-[10px] font-mono border-b border-beige">
                <th className="py-3 px-4 font-bold">Customer Client</th>
                <th className="py-3 px-4 font-bold">Text Review Message</th>
                <th className="py-3 px-4 font-bold text-center">Rating</th>
                <th className="py-3 px-4 text-center font-bold">Featured state</th>
                <th className="py-3 px-4 text-center font-bold">Validation Status</th>
                <th className="py-3 px-4 text-center font-bold">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/55">
              {reviews.map((item) => (
                <tr key={item.id} className="hover:bg-beige/10 transition-colors">
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-2.5">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt="Customer profile" 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-beige shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-maroon-900/10 border border-maroon-900/10 text-maroon-900 flex items-center justify-center font-extrabold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="text-[9px] text-stone-400 font-mono">{item.role || 'Verified Customer'}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-3 px-4 max-w-sm font-sans tracking-wide leading-relaxed text-stone-600 text-xs">
                    "{item.text}"
                    {item.date && (
                      <span className="text-[9px] text-stone-400 block font-mono mt-1">Submitted: {item.date}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-0.5 text-gold-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < item.rating ? 'fill-current' : 'opacity-20'}`} 
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center select-none">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase border transition-all cursor-pointer ${
                        item.featured ?? true 
                          ? 'bg-[#C5A059]/10 text-maroon-900 border-[#C5A059]/30 font-bold' 
                          : 'bg-transparent text-stone-400 border-beige hover:bg-beige/10'
                      }`}
                    >
                      {item.featured ?? true ? '★ Featured' : 'Public List'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center select-none">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold inline-block font-mono ${
                      (item.status || 'approved') === 'approved' 
                        ? 'bg-green-150 text-green-800' 
                        : (item.status === 'rejected' ? 'bg-red-150 text-red-800' : 'bg-amber-150 text-amber-800')
                    }`}>
                      {item.status || 'approved'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Moderation short-circuit buttons */}
                      {(item.status || 'approved') !== 'approved' && (
                        <button
                          onClick={() => handleSetStatus(item.id, 'approved')}
                          className="p-1 text-green-650 hover:bg-green-50 rounded border border-beige cursor-pointer select-none"
                          title="Approve Testimony"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(item.status || 'approved') === 'approved' && (
                        <button
                          onClick={() => handleSetStatus(item.id, 'rejected')}
                          className="p-1 text-red-650 hover:bg-red-50 rounded border border-beige cursor-pointer select-none"
                          title="Reject / Mute Review"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setEditingReview(item);
                          setShowAddForm(false);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="p-1 text-stone-600 hover:text-maroon-900 rounded border border-beige cursor-pointer select-none"
                        title="Edit testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(item.id, item.name)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer select-none shadow-sm flex items-center justify-center transition-colors"
                        title="Delete Testimony"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="block md:hidden p-4 space-y-4 divide-y divide-beige/40">
          {reviews.length === 0 ? (
            <p className="text-stone-400 font-mono italic text-center py-6 text-xs">No feedback list found.</p>
          ) : (
            reviews.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 pb-1 flex flex-col gap-3 font-sans text-xs text-left">
                {/* Header: Client & stars */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover border border-beige"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-maroon-900/10 border border-maroon-900/10 text-maroon-900 flex items-center justify-center font-extrabold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-stone-900 leading-none">{item.name}</p>
                      <p className="text-[9px] text-stone-400 font-mono mt-0.5">{item.role || 'Verified Customer'}</p>
                    </div>
                  </div>

                  {/* Star ratings */}
                  <div className="flex gap-0.5 text-gold-500 shrink-0 bg-gold-400/5 px-2 py-1 rounded-xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < item.rating ? 'fill-current' : 'opacity-20'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Narrative text details */}
                <p className="text-stone-600 bg-beige/5 p-2 rounded-xl border border-beige/10 leading-relaxed text-[11px] font-medium tracking-wide">
                  "{item.text}"
                  {item.date && (
                    <span className="text-[8px] text-stone-400 font-mono block mt-1 uppercase">Post date: {item.date}</span>
                  )}
                </p>

                {/* Badges row & control operations */}
                <div className="flex items-center justify-between gap-4 mt-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border transition-all cursor-pointer ${
                        item.featured ?? true 
                          ? 'bg-[#C5A059]/10 text-maroon-900 border-[#C5A059]/30' 
                          : 'bg-transparent text-stone-400 border-beige hover:bg-beige/10'
                      }`}
                    >
                      {item.featured ?? true ? '★ Featured' : 'Standard'}
                    </button>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold inline-block font-mono border border-transparent ${
                      (item.status || 'approved') === 'approved' 
                        ? 'bg-green-150 text-green-800' 
                        : (item.status === 'rejected' ? 'bg-red-150 text-red-800' : 'bg-amber-150 text-amber-800')
                    }`}>
                      {item.status || 'approved'}
                    </span>
                  </div>

                  {/* Action drawers */}
                  <div className="flex items-center gap-1.5 font-sans">
                    {(item.status || 'approved') !== 'approved' && (
                      <button
                        onClick={() => handleSetStatus(item.id, 'approved')}
                        className="p-1 px-2 border border-green-250 text-green-650 hover:bg-green-50 rounded-md cursor-pointer flex items-center gap-1 font-bold text-[10px]"
                        title="Approve Testimony"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}
                    {(item.status || 'approved') === 'approved' && (
                      <button
                        onClick={() => handleSetStatus(item.id, 'rejected')}
                        className="p-1 px-2 border border-beige text-stone-500 hover:text-red-650 hover:bg-red-50 rounded-md cursor-[#1b1c1c] flex items-center gap-1 font-bold text-[10px]"
                        title="Reject Testimony"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingReview(item);
                        setShowAddForm(false);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="p-2 border border-beige rounded-lg text-stone-600 hover:bg-beige/10 cursor-pointer"
                      title="Edit testimony"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(item.id, item.name)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-sm flex items-center justify-center transition-colors"
                      title="Delete Testimony"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {reviewToDelete && (
        <DeleteConfirmModal 
          isOpen={reviewToDelete !== null}
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer Review?"
          message={`Are you sure you want to delete the testimonial by "${reviewToDelete.name}"? This review will be removed immediately.`}
        />
      )}
    </div>
  );
}
