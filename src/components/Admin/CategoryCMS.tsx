import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface CategoryCMSProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addActivityLog: (action: string, details: string) => void;
  handleOptimizedImageUpload: (file: File, callback: (base64: string) => void) => void;
}

export default function CategoryCMS({
  categories,
  setCategories,
  addActivityLog,
  handleOptimizedImageUpload
}: CategoryCMSProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catToDelete, setCatToDelete] = useState<{ id: string; name: string } | null>(null);

  // Simple Form state fields
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter category name.');
    if (!image) return alert('Please upload category image.');

    const cleanId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    if (categories.some(c => c.id === cleanId)) {
      alert(`A category with name "${name}" already exists!`);
      return;
    }

    const created: Category = {
      id: cleanId,
      name: name.trim(),
      image: image,
      // Default fallback values
      description: `Premium ${name.trim()} range.`,
      displayOrder: categories.length + 1,
      status: 'active'
    };

    setCategories([...categories, created]);
    addActivityLog('Add Category', `Created category "${created.name}"`);
    setName('');
    setImage('');
    setShowAddForm(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    if (!editingCat.name.trim()) return alert('Please enter a valid category name.');
    if (!editingCat.image) return alert('Please select a category image.');

    const updated = categories.map(c => {
      if (c.id === editingCat.id) {
        return {
          ...editingCat,
          description: editingCat.description || `Premium ${editingCat.name.trim()} range.`
        };
      }
      return c;
    });

    setCategories(updated);
    addActivityLog('Edit Category', `Updated category "${editingCat.name}"`);
    setEditingCat(null);
  };

  const handleDeleteCategory = (id: string, catName: string) => {
    setCatToDelete({ id, name: catName });
  };

  const handleDeleteConfirm = () => {
    if (!catToDelete) return;
    const { id, name } = catToDelete;
    setCategories(categories.filter(c => c.id !== id));
    addActivityLog('Delete Category', `Deleted category "${name}"`);
    setCatToDelete(null);
  };

  return (
    <div className="space-y-6 text-xs text-left animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#1C1917]">Baking Departments & Categories</h2>
          <p className="text-stone-500 mt-1">Manage product categories. Default shop layout supports Mithai, Cakes, Bakery, Biscuits, Snacks, Gift Boxes.</p>
        </div>

        {!showAddForm && !editingCat && (
          <button
            onClick={() => { setName(''); setImage(''); setShowAddForm(true); }}
            className="flex items-center justify-center gap-2 p-3 bg-maroon-900 text-white rounded-xl font-bold cursor-pointer hover:bg-maroon-950 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* ADD CATEGORY FORM */}
      {showAddForm && (
        <div className="w-full max-w-xl mx-auto space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setName(''); setImage(''); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Categories
            </button>
          </div>
          <form onSubmit={handleCreateCategory} className="bg-cream border border-beige p-6 rounded-2xl space-y-4 shadow-sm w-full">
            <div className="border-b border-beige pb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-extrabold text-maroon-950">Add Category</h3>
                <p className="text-[11px] text-stone-500">Provide name and landing photo cover for this department.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setName(''); setImage(''); }}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cut</span>
              </button>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mithai"
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category Image</label>
              <div className="border border-dashed border-beige bg-white p-4 rounded-xl text-center select-none">
                {image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={image} className="w-24 h-24 object-cover rounded-xl border border-beige" alt="Category preview" />
                    <button 
                      type="button" 
                      onClick={() => setImage('')} 
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-xs text-stone-500 font-bold">Upload cover JPEG / PNG</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOptimizedImageUpload(file, (b64) => setImage(b64));
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
              onClick={() => { setShowAddForm(false); setName(''); setImage(''); }}
              className="px-5 py-2.5 border border-beige text-stone-600 hover:bg-stone-50 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-xl cursor-pointer"
            >
              Add Collection
            </button>
          </div>
        </form>
        </div>
      )}

      {/* EDIT CATEGORY FORM */}
      {editingCat && (
        <div className="w-full max-w-xl mx-auto space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setEditingCat(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Categories
            </button>
          </div>
          <form onSubmit={handleUpdateCategory} className="bg-cream border border-beige p-6 rounded-2xl space-y-4 shadow-sm w-full">
            <div className="border-b border-beige pb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-extrabold text-maroon-950">Edit Category</h3>
                <p className="text-[11px] text-stone-500">Update cover image and display parameters for "{editingCat.name}".</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cut</span>
              </button>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category Name</label>
              <input
                required
                type="text"
                value={editingCat.name}
                onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category Image</label>
              <div className="border border-dashed border-beige bg-white p-4 rounded-xl text-center select-none">
                {editingCat.image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={editingCat.image} className="w-24 h-24 object-cover rounded-xl border border-beige" alt="Category preview" />
                    <button 
                      type="button" 
                      onClick={() => setEditingCat({ ...editingCat, image: '' })} 
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-xs text-stone-500 font-bold">Upload cover photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOptimizedImageUpload(file, (b64) => setEditingCat({ ...editingCat, image: b64 }));
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
              onClick={() => setEditingCat(null)}
              className="px-5 py-2.5 border border-beige text-stone-600 hover:bg-stone-50 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-xl cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
        </div>
      )}

      {/* CATEGORIES CARD LIST */}
      {!showAddForm && !editingCat && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-32 object-cover border-b border-beige"
              />
              <div className="p-4 space-y-3">
                <p className="font-serif font-extrabold text-[#1C1917] text-sm text-center">{cat.name}</p>
                <div className="flex items-center justify-center gap-2 pt-1 border-t border-beige/65">
                  <button
                    onClick={() => setEditingCat(cat)}
                    className="p-1 px-3 border border-beige rounded-xl hover:border-maroon-900 hover:bg-maroon-50 text-stone-600 hover:text-maroon-900 font-bold transition-all cursor-pointer text-[10px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all cursor-pointer text-[10px] shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {catToDelete && (
        <DeleteConfirmModal 
          isOpen={catToDelete !== null}
          onClose={() => setCatToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Department / Category?"
          message={`Are you sure you want to delete "${catToDelete.name}"? This might hide related products as they depend on categories.`}
        />
      )}
    </div>
  );
}
