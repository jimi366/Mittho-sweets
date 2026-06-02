import React, { useState } from 'react';
import { ContactInfo, HomepageCMSConfig, Review } from '../../types';
import { Building, Layers, Save, UploadCloud, HelpCircle, Star, Plus, Trash2, Edit2 } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface SettingsCMSProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  homepageConfig: HomepageCMSConfig;
  setHomepageConfig: React.Dispatch<React.SetStateAction<HomepageCMSConfig>>;
  activityLogs: any[];
  clearActivityLogs: () => void;
  addActivityLog: (action: string, details: string) => void;
  handleOptimizedImageUpload: (file: File, callback: (base64: string) => void) => void;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export default function SettingsCMS({
  contactInfo,
  setContactInfo,
  homepageConfig,
  setHomepageConfig,
  addActivityLog,
  handleOptimizedImageUpload,
  reviews,
  setReviews
}: SettingsCMSProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'homepage'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('Satisfied Customer');
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; name: string } | null>(null);

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addActivityLog('Update Settings', 'Updated website contact numbers and address');
    triggerNotification('Website Settings saved successfully!');
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    addActivityLog('Update Homepage', 'Modified hero banners and about texts');
    triggerNotification('Homepage Editor updated successfully!');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const fresh: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName,
      text: newReviewText,
      rating: 5,
      role: newReviewRole,
      date: new Date().toLocaleDateString(),
      status: 'approved',
      featured: true
    };

    setReviews([fresh, ...reviews]);
    addActivityLog('Add Review', `Created custom user review for "${newReviewName}"`);

    // Reset Review fields
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRole('Satisfied Customer');
    setShowAddReview(false);
    triggerNotification('Review added to homepage reviews!');
  };

  const handleDeleteReview = (id: string, name: string) => {
    setReviewToDelete({ id, name });
  };

  const handleDeleteConfirm = () => {
    if (!reviewToDelete) return;
    const { id, name } = reviewToDelete;
    setReviews(reviews.filter(r => r.id !== id));
    addActivityLog('Delete Review', `Deleted home page review from "${name}"`);
    triggerNotification('Homepage review deleted.');
    setReviewToDelete(null);
  };

  return (
    <div className="space-y-6 text-xs text-left animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige pb-3">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#1C1917]">Website Settings & Editor</h2>
          <p className="text-stone-500 mt-1">Configure your contact coordinates, brand profile, and front page messaging details.</p>
        </div>

        {/* TABS CONTROLLERS */}
        <div className="flex bg-cream p-1 rounded-xl self-start sm:self-auto select-none gap-1 border border-beige">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'profile' ? 'bg-maroon-900 text-white' : 'text-stone-600 hover:text-stone-850'
            }`}
          >
            🏢 Website Settings
          </button>
          <button
            onClick={() => setActiveSubTab('homepage')}
            className={`px-4 py-2 font-bold rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'homepage' ? 'bg-maroon-900 text-white' : 'text-stone-600 hover:text-stone-850'
            }`}
          >
            🏠 Homepage Editor
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-green-550 border border-green-600 text-green-950 font-bold rounded-xl animate-pulse">
          ✨ {successMsg}
        </div>
      )}

      {/* 1. BRAND & CONTACT SETTINGS */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-cream border border-beige p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 text-maroon-950 border-b border-beige/65 pb-2">
            <Building className="w-5 h-5 text-gold-650" />
            <h3 className="font-serif text-base font-bold">Contact Coordinates / Website Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Business Name</label>
              <input
                type="text"
                required
                value={contactInfo.businessName || 'Mittho Sweets & Bakers'}
                onChange={(e) => setContactInfo({ ...contactInfo, businessName: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">WhatsApp Number</label>
              <input
                type="text"
                required
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Store Address</label>
              <input
                type="text"
                required
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Google Maps Link</label>
              <input
                type="text"
                required
                value={contactInfo.googleMapsEmbed}
                onChange={(e) => setContactInfo({ ...contactInfo, googleMapsEmbed: e.target.value })}
                placeholder="Google Maps Embedded Link (Iframe Src URL)"
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Facebook Link</label>
              <input
                type="text"
                value={contactInfo.facebookUrl || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, facebookUrl: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Instagram Link</label>
              <input
                type="text"
                value={contactInfo.instagramUrl || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, instagramUrl: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-beige">
            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-extrabold rounded-xl text-sm cursor-pointer shadow-sm transition-all"
            >
              Save Website Settings
            </button>
          </div>
        </form>
      )}

      {/* 2. HOMEPAGE EDITOR COPIES */}
      {activeSubTab === 'homepage' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveHomepage} className="bg-cream border border-beige p-6 rounded-2xl space-y-5">
            <div className="flex items-center gap-2 text-maroon-950 border-b border-beige/65 pb-2">
              <Layers className="w-5 h-5 text-gold-650" />
              <h3 className="font-serif text-base font-bold">Homepage Editor Sections</h3>
            </div>

            <div className="space-y-4">
              {/* HERO */}
              <div className="p-4 bg-white/60 border border-beige rounded-xl space-y-4">
                <h4 className="font-serif font-bold text-maroon-900 border-b border-beige/40 pb-1.5 text-xs uppercase tracking-wide">Hero Slogans & Banners</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Hero Title Heading</label>
                    <input
                      type="text"
                      required
                      value={homepageConfig.heroHeading}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, heroHeading: e.target.value })}
                      className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Hero Sub-label Summary</label>
                    <textarea
                      required
                      rows={2}
                      value={homepageConfig.heroSubheading}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, heroSubheading: e.target.value })}
                      className="w-full text-sm px-4 py-2 bg-white border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* HERO BACKGROUND IMAGE */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Hero Image Background</label>
                    <div className="border border-dashed border-beige bg-white p-5 rounded-xl text-center select-none">
                      {homepageConfig.heroImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={homepageConfig.heroImage} className="w-48 h-20 object-cover rounded-xl border border-beige" alt="Hero Background preview" />
                          <button 
                            type="button" 
                            onClick={() => setHomepageConfig({ ...homepageConfig, heroImage: '' })} 
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-650 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Remove / Choose Different Image
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer p-2">
                          <UploadCloud className="w-8 h-8 text-stone-400 mb-1" />
                          <span className="text-[11px] text-stone-550 font-bold block">Upload Hero banner bg photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleOptimizedImageUpload(file, (b64) => setHomepageConfig({ ...homepageConfig, heroImage: b64 }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ABOUT SECTION */}
              <div className="p-4 bg-white/60 border border-beige rounded-xl space-y-4">
                <h4 className="font-serif font-bold text-maroon-900 border-b border-beige/40 pb-1.5 text-xs uppercase tracking-wide">About Sweets Heritage Section</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">About Title Heading</label>
                    <input
                      type="text"
                      required
                      value={homepageConfig.aboutHeading}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, aboutHeading: e.target.value })}
                      className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Heritage Brand Narrative Story</label>
                    <textarea
                      required
                      rows={3}
                      value={homepageConfig.aboutText}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, aboutText: e.target.value })}
                      className="w-full text-sm px-4 py-2 bg-white border border-beige rounded-xl focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* WHY CHOOSE US */}
              <div className="p-4 bg-white/60 border border-beige rounded-xl space-y-4">
                <h4 className="font-serif font-bold text-maroon-900 border-b border-beige/40 pb-1.5 text-xs uppercase tracking-wide">Why Choose Us Section</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Why Choose Us Headline</label>
                    <input
                      type="text"
                      required
                      value={homepageConfig.whyChooseHeading || 'Why Choose Mittho Sweets'}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, whyChooseHeading: e.target.value })}
                      className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] text-stone-500 leading-relaxed pt-6">This section displays dynamic icons highlights on your homepage emphasizing purity, 100% pure Desi Ghee ingredients, and handmade values.</p>
                  </div>
                </div>
              </div>

              {/* PHOTO GALLERY */}
              <div className="p-4 bg-white/60 border border-beige rounded-xl space-y-2">
                <h4 className="font-serif font-bold text-maroon-900 border-b border-beige/40 pb-1.5 text-xs uppercase tracking-wide">Homepage Gallery Portfolio</h4>
                <p className="text-[11px] text-stone-550 leading-relaxed font-sans">
                  The homepage showcases of Cakes, Mithai, Bakery, and Store images are fully synced in real-time using sweet photos loaded under your <strong>Gallery tab</strong>. 
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-beige">
              <button
                type="submit"
                className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-extrabold rounded-xl text-sm cursor-pointer shadow-sm transition-all"
              >
                Save Homepage Slogans
              </button>
            </div>
          </form>

          {/* DYNAMIC HOMEPAGE REVIEWS MANAGER */}
          <div className="bg-cream border border-beige p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-beige/65 pb-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-gold-550 fill-current" />
                <h3 className="font-serif text-base font-bold text-maroon-950">Homepage Reviews / Testimonials ({reviews.length})</h3>
              </div>

              <button
                onClick={() => setShowAddReview(!showAddReview)}
                className="px-3.5 py-1.5 bg-maroon-900 text-white font-bold rounded-lg cursor-pointer hover:bg-maroon-950"
              >
                {showAddReview ? 'Close Form' : '+ Add Testimonial'}
              </button>
            </div>

            {/* ADD REVIEW CONTROL */}
            {showAddReview && (
              <form onSubmit={handleAddReview} className="bg-white p-4 border border-beige rounded-xl space-y-4 shadow-inner">
                <h4 className="font-serif font-bold text-stone-800 text-[11px] uppercase">Record Client Testimony</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-stone-605 mb-1 font-bold uppercase">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Haji Muhammad Saleem"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full text-sm px-4 py-3 bg-cream-dark/35 border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-605 mb-1 font-bold uppercase">Designation / Role</label>
                    <input
                      type="text"
                      value={newReviewRole}
                      onChange={(e) => setNewReviewRole(e.target.value)}
                      className="w-full text-sm px-4 py-3 bg-cream-dark/35 border border-beige rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-stone-605 mb-1 font-bold uppercase">Feedback Message</label>
                    <textarea
                      required
                      placeholder="Loved the pure Desi Ghee Sohan Halwa!..."
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full text-sm px-4 py-2 bg-cream-dark/35 border border-beige rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2 border border-beige rounded-lg text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-900 text-white font-bold rounded-lg hover:bg-maroon-950"
                  >
                    Add Testimonial Box
                  </button>
                </div>
              </form>
            )}

            {/* REVIEWS GRID LIST */}
            {reviews.length === 0 ? (
              <p className="text-stone-400 italic font-mono text-center py-6">No homepage reviews set yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-beige rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{rev.name}</span>
                        <div className="flex text-gold-550">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-450 text-[10px] font-semibold tracking-wide uppercase">{rev.role}</p>
                      <p className="text-stone-700 italic text-xs pt-1">"{rev.text}"</p>
                    </div>

                    <div className="flex justify-end pt-3 mt-3 border-t border-beige/40">
                      <button
                        onClick={() => handleDeleteReview(rev.id, rev.name)}
                        className="p-1 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 font-bold cursor-pointer shadow-sm transition-colors"
                        title="Delete testimony"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {reviewToDelete && (
        <DeleteConfirmModal 
          isOpen={reviewToDelete !== null}
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Homepage Testimony?"
          message={`Are you sure you want to delete the home page testimonial by "${reviewToDelete.name}"? This action cannot be reversed.`}
        />
      )}
    </div>
  );
}
