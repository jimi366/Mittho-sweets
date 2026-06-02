import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, ArrowRight, UploadCloud, X } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface GalleryCMSProps {
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  addActivityLog: (action: string, details: string) => void;
  handleOptimizedImageUpload: (file: File, callback: (base64: string) => void) => void;
}

export default function GalleryCMS({
  gallery,
  setGallery,
  addActivityLog,
  handleOptimizedImageUpload
}: GalleryCMSProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<{ id: string; title: string } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'cakes' | 'mithai' | 'bakery' | 'store'>('cakes');
  const [tempImage, setTempImage] = useState('');

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempImage) return alert('Please upload / provide an image.');

    const created: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newTitle.trim() || `${newCategory.toUpperCase()} Image`,
      category: newCategory,
      image: tempImage
    };

    setGallery([created, ...gallery]);
    addActivityLog('Upload Gallery Item', `Uploaded brand photo in category "${newCategory}"`);
    setNewTitle('');
    setTempImage('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string, title: string) => {
    setGalleryToDelete({ id, title });
  };

  const handleDeleteConfirm = () => {
    if (!galleryToDelete) return;
    const { id, title } = galleryToDelete;
    setGallery(gallery.filter(g => g.id !== id));
    addActivityLog('Delete Gallery Photo', `Deleted photo "${title}"`);
    setGalleryToDelete(null);
  };

  // Reorder images within the main array
  const moveItem = (index: number, direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gallery.length) return;

    const list = [...gallery];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    setGallery(list);
    addActivityLog('Reorder Gallery', 'Reordered gallery presentation position');
  };

  const galleryCategories: ('cakes' | 'mithai' | 'bakery' | 'store')[] = ['cakes', 'mithai', 'bakery', 'store'];

  // Filter list
  const filteredGallery = gallery.filter(g => {
    // Standardize mapping for old categories just in case
    const cat = g.category === 'events' || g.category === 'packaging' ? 'store' : g.category;
    return activeCategory === 'all' || cat === activeCategory;
  });

  return (
    <div className="space-y-6 text-xs text-left animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#1C1917]">Portfolio Gallery</h2>
          <p className="text-stone-500 mt-1 font-sans">Your portfolio showcase layout. Manage, sort, and display sweets photographs.</p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => { setTempImage(''); setNewTitle(''); setShowAddForm(true); }}
            className="flex items-center justify-center gap-2 p-3 bg-maroon-900 text-white rounded-xl font-bold cursor-pointer hover:bg-maroon-950 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Upload New Image</span>
          </button>
        )}
      </div>

      {/* UPLOAD IMAGES FORM */}
      {showAddForm && (
        <div className="w-full max-w-xl mx-auto space-y-3 animate-fade-in">
          <div className="flex justify-between items-center bg-cream/20">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setTempImage(''); setNewTitle(''); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Gallery List
            </button>
          </div>
          <form onSubmit={handleCreateGallery} className="bg-cream border border-beige p-6 rounded-2xl space-y-4 shadow-sm w-full">
            <div className="border-b border-beige pb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-extrabold text-maroon-950">Upload Portfolio Image</h3>
                <p className="text-[11px] text-stone-500">Add high resolution photos to your customer-facing gallery sections.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setTempImage(''); setNewTitle(''); }}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5 animate-pulse" />
                <span>Cut</span>
              </button>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Photo Title / Label (Optional)</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Special Desi Ghee Sohan Halwa"
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Gallery Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none cursor-pointer capitalize"
              >
                {galleryCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1 font-sans">Select Photo File</label>
              <div className="border border-dashed border-beige bg-white p-6 rounded-xl text-center select-none">
                {tempImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={tempImage} className="w-48 h-32 object-cover rounded-xl border border-beige" alt="Upload preview" />
                    <button 
                      type="button" 
                      onClick={() => setTempImage('')} 
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold"
                    >
                      Choose Different Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-4">
                    <UploadCloud className="w-10 h-10 text-stone-400 mb-2" />
                    <span className="text-xs text-stone-550 font-bold block">Browse files on device</span>
                    <span className="text-[10px] text-stone-400 mt-1 block">Supports JPEGs, PNGs and WebP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOptimizedImageUpload(file, (b64) => setTempImage(b64));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-beige select-none">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setTempImage(''); setNewTitle(''); }}
              className="px-5 py-2.5 border border-beige text-stone-600 hover:bg-stone-50 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-xl cursor-pointer"
            >
              Upload Asset
            </button>
          </div>
        </form>
        </div>
      )}

      {/* FILTER RAIL */}
      {!showAddForm && (
        <>
          <div className="flex flex-wrap items-center gap-1.5 select-none font-sans text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 font-bold rounded-full border transition-all cursor-pointer ${
                activeCategory === 'all' ? 'bg-[#C5A059]/20 text-maroon-900 border-[#C5A059]' : 'bg-transparent text-stone-650 border-beige hover:bg-beige/10'
              }`}
            >
              All Images ({gallery.length})
            </button>
            {galleryCategories.map((folder) => (
              <button
                key={folder}
                onClick={() => setActiveCategory(folder)}
                className={`px-3.5 py-1.5 font-bold rounded-full border capitalize transition-all cursor-pointer ${
                  activeCategory === folder ? 'bg-[#C5A059]/20 text-maroon-900 border-[#C5A059]' : 'bg-transparent text-stone-650 border-beige hover:bg-beige/10'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>

          {/* GALLERY CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGallery.map((photo, index) => (
              <div 
                key={photo.id} 
                className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-square w-full overflow-hidden relative border-b border-beige">
                  <img 
                    src={photo.image} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-charcoal/70 backdrop-blur-sm text-white text-[8px] uppercase font-mono font-bold rounded capitalize">
                    {photo.category === 'events' || photo.category === 'packaging' ? 'store' : photo.category}
                  </span>
                </div>

                <div className="p-3 bg-white space-y-2.5">
                  <p className="text-[11px] font-bold text-stone-800 truncate font-sans text-center">{photo.title}</p>
                  
                  {/* REORDER BUTTONS AND DELETE */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-beige/65 select-none">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(index, 'prev')}
                        disabled={index === 0}
                        className="p-1 border border-beige rounded hover:bg-beige/10 disabled:opacity-30 cursor-pointer"
                        title="Move Up / Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'next')}
                        disabled={index === gallery.length - 1}
                        className="p-1 border border-beige rounded hover:bg-beige/10 disabled:opacity-30 cursor-pointer"
                        title="Move Down / Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(photo.id, photo.title)}
                      className="p-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all cursor-pointer shadow-sm flex items-center justify-center whitespace-nowrap"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {galleryToDelete && (
        <DeleteConfirmModal 
          isOpen={galleryToDelete !== null}
          onClose={() => setGalleryToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Gallery Photo?"
          message={`Are you sure you want to delete this photo "${galleryToDelete.title}"? This action is permanent.`}
        />
      )}
    </div>
  );
}
