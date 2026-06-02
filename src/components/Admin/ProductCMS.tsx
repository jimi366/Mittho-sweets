import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { Search, Plus, Edit, Trash2, Filter, Image as ImageIcon, Check, X, Star } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ProductCMSProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  addActivityLog: (action: string, details: string) => void;
  handleOptimizedImageUpload: (file: File, callback: (base64: string) => void) => void;
}

export default function ProductCMS({
  products,
  setProducts,
  categories,
  addActivityLog,
  handleOptimizedImageUpload
}: ProductCMSProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form states (simplified)
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'mithai');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [image, setImage] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [weightOptions, setWeightOptions] = useState<string[]>(['0.5 Kg', '1 Kg', '2 Kg']);

  // Set default weight presets when category drops or changes
  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    if (catId === 'cakes') {
      setWeightOptions(['2 Lbs (1 Kg)', '4 Lbs (2 Kg)', '6 Lbs (3 Kg)']);
    } else if (catId === 'mithai') {
      setWeightOptions(['0.5 Kg', '1 Kg', '2 Kg']);
    } else {
      setWeightOptions(['0.5 Kg', '1 Kg']);
    }
  };

  // Reset form helper
  const resetForm = () => {
    setName('');
    const firstCat = categories[0]?.id || 'mithai';
    setCategory(firstCat);
    setPrice('');
    setShortDescription('');
    setImage('');
    setBestseller(false);
    setStatus('active');
    if (firstCat === 'cakes') {
      setWeightOptions(['2 Lbs (1 Kg)', '4 Lbs (2 Kg)', '6 Lbs (3 Kg)']);
    } else if (firstCat === 'mithai') {
      setWeightOptions(['0.5 Kg', '1 Kg', '2 Kg']);
    } else {
      setWeightOptions(['0.5 Kg', '1 Kg']);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a product name.');
    if (!price || Number(price) <= 0) return alert('Please enter a valid price.');
    if (!image) return alert('Please upload or provide a product image.');

    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      slug: cleanSlug,
      shortDescription: shortDescription.trim(),
      description: shortDescription.trim(), // Mirror shortDescription for simple full description
      category: category,
      price: Number(price),
      image: image,
      bestseller: bestseller,
      status: status,
      // Fallback defaults to keep types satisfied
      subCategory: '',
      weightOptions: weightOptions.map(opt => opt.trim()).filter(Boolean),
      ingredients: [],
      tags: [],
      rating: 5.0
    };

    setProducts([created, ...products]);
    addActivityLog('Add Product', `Added product "${created.name}"`);
    resetForm();
    setShowAddForm(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd) return;
    if (!editingProd.name.trim()) return alert('Please enter a product name.');
    if (!editingProd.price || Number(editingProd.price) <= 0) return alert('Please enter a valid price.');
    if (!editingProd.image) return alert('Please upload or provide a product image.');

    const updatedList = products.map(p => {
      if (p.id === editingProd.id) {
        return {
          ...editingProd,
          slug: editingProd.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          description: editingProd.shortDescription
        };
      }
      return p;
    });

    setProducts(updatedList);
    addActivityLog('Edit Product', `Updated product details for "${editingProd.name}"`);
    setEditingProd(null);
  };

  const handleDeleteProduct = (id: string, prodName: string) => {
    setProductToDelete({ id, name: prodName });
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;
    setProducts(products.filter(p => p.id !== id));
    addActivityLog('Delete Product', `Deleted product "${name}"`);
    setProductToDelete(null);
  };

  // Filter list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-xs text-left animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-[#1C1917]">Products Management</h2>
          <p className="text-stone-500 mt-1">Easily update sweets list, edit pricing details, and set featured items.</p>
        </div>
        
        {!showAddForm && !editingProd && (
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="flex items-center justify-center gap-2 p-3 bg-maroon-900 text-white rounded-xl font-bold cursor-pointer hover:bg-maroon-950 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* 1. ADD NEW PRODUCT FORM (Clean, Single Column, Large Input) */}
      {showAddForm && (
        <div className="w-full max-w-2xl mx-auto space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); resetForm(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Product List
            </button>
          </div>
          <form onSubmit={handleCreateProduct} className="bg-cream border border-beige p-6 rounded-2xl space-y-5 shadow-sm w-full">
            <div className="border-b border-beige pb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-extrabold text-maroon-950">Add New Product</h3>
                <p className="text-[11px] text-stone-500">Provide details to register this confectionery to your site menu.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); resetForm(); }}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5 animate-pulse" />
                <span>Cut</span>
              </button>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Product Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Special Desi Ghee Laddu"
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category / Department</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Weight / size options (E.g. Cakes Lbs, Mithai Kgs)</label>
              <div className="space-y-2 p-3 bg-white border border-beige rounded-xl">
                <input
                  type="text"
                  value={weightOptions.join(', ')}
                  onChange={(e) => {
                    const vals = e.target.value.split(',').map(s => s.trim());
                    setWeightOptions(vals);
                  }}
                  placeholder="e.g. 0.5 Kg, 1 Kg, 2 Kg (comma separated)"
                  className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded-lg focus:ring-1 focus:ring-maroon-900 focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] text-stone-500 font-bold">Standard Presets:</span>
                  <button
                    type="button"
                    onClick={() => setWeightOptions(['0.5 Kg', '1 Kg', '2 Kg'])}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Mithai (Kg / g)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightOptions(['2 Lbs (1 Kg)', '3 Lbs (1.5 Kg)', '4 Lbs (2 Kg)', '6 Lbs (3 Kg)'])}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Cakes (Lbs/Kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightOptions(['1 Lb', '2 Lbs', '3 Lbs', '4 Lbs'])}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Simple Lbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightOptions(['Single Piece', 'Box of 6', 'Box of 12'])}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Portion Packs
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 pt-1 leading-normal italic">Tip: You can type and add custom sizes/weights. Separate each size with a comma (,)</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Price (Rs.)</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Short Description</label>
              <textarea
                required
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Describe your delicious helper item details..."
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            {/* PRODUCT IMAGE UPLOAD */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Product Image</label>
              <div className="border border-dashed border-beige bg-white p-4 rounded-xl text-center select-none">
                {image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={image} className="w-24 h-24 object-cover rounded-xl border border-beige" alt="Product preview" />
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
                    <span className="text-xs text-stone-500 font-bold">Upload product photo from files</span>
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

            {/* FEATURED TOGGLE */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-600">
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="w-4 h-4 rounded text-maroon-900 focus:ring-maroon-900 border-beige cursor-pointer"
                />
                <span>Set as Featured Product on Homepage</span>
              </label>
            </div>

            {/* STATUS TOGGLE */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-600">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.checked ? 'active' : 'draft')}
                  className="w-4 h-4 rounded text-maroon-900 focus:ring-maroon-900 cursor-pointer border-beige"
                />
                <span>Publish Immediately (Make visible to customers)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-beige select-none">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); resetForm(); }}
              className="px-5 py-2.5 border border-beige text-stone-600 hover:bg-stone-50 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-xl cursor-pointer"
            >
              Save Product
            </button>
          </div>
        </form>
        </div>
      )}

      {/* 2. EDITING PRODUCT FORM */}
      {editingProd && (
        <div className="w-full max-w-2xl mx-auto space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setEditingProd(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-maroon-950 bg-cream/80 hover:bg-[#C5A059]/10 border border-beige rounded-lg transition-all cursor-pointer shadow-sm select-none uppercase tracking-wider"
            >
              ← Back to Product List
            </button>
          </div>
          <form onSubmit={handleUpdateProduct} className="bg-cream border border-beige p-6 rounded-2xl space-y-5 shadow-sm w-full">
            <div className="border-b border-beige pb-3 flex items-center justify-between gap-4 border-dashed">
              <div>
                <h3 className="text-base font-serif font-extrabold text-maroon-950">Edit Product</h3>
                <p className="text-[11px] text-stone-500">Update specifications and details for "{editingProd.name}".</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProd(null)}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg hover:text-red-800 transition-colors cursor-pointer border border-red-200/40 text-[10px] font-bold flex items-center gap-1"
                title="Close Form"
              >
                <X className="w-3.5 h-3.5 animate-pulse" />
                <span>Cut</span>
              </button>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Product Name</label>
              <input
                required
                type="text"
                value={editingProd.name}
                onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Category / Department</label>
              <select
                value={editingProd.category}
                onChange={(e) => setEditingProd({ ...editingProd, category: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Weight / size options (E.g. Cakes Lbs, Mithai Kgs)</label>
              <div className="space-y-2 p-3 bg-white border border-beige rounded-xl">
                <input
                  type="text"
                  value={(editingProd.weightOptions || []).join(', ')}
                  onChange={(e) => {
                    const vals = e.target.value.split(',').map(s => s.trim());
                    setEditingProd({ ...editingProd, weightOptions: vals });
                  }}
                  placeholder="e.g. 0.5 Kg, 1 Kg, 2 Kg (comma separated)"
                  className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded-lg focus:ring-1 focus:ring-maroon-900 focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] text-stone-500 font-bold">Standard Presets:</span>
                  <button
                    type="button"
                    onClick={() => setEditingProd({ ...editingProd, weightOptions: ['0.5 Kg', '1 Kg', '2 Kg'] })}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Mithai (Kg / g)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProd({ ...editingProd, weightOptions: ['2 Lbs (1 Kg)', '3 Lbs (1.5 Kg)', '4 Lbs (2 Kg)', '6 Lbs (3 Kg)'] })}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Cakes (Lbs/Kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProd({ ...editingProd, weightOptions: ['1 Lb', '2 Lbs', '3 Lbs', '4 Lbs'] })}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Simple Lbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProd({ ...editingProd, weightOptions: ['Single Piece', 'Box of 6', 'Box of 12'] })}
                    className="px-2 py-0.5 bg-maroon-50 hover:bg-maroon-100 border border-maroon-100 text-[9px] font-bold text-maroon-900 rounded cursor-pointer transition-all"
                  >
                    Portion Packs
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 pt-1 leading-normal italic">Tip: Separate each weight/size option with a comma (,)</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Price (Rs.)</label>
              <input
                required
                type="number"
                value={editingProd.price}
                onChange={(e) => setEditingProd({ ...editingProd, price: Number(e.target.value) })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Short Description</label>
              <textarea
                required
                rows={3}
                value={editingProd.shortDescription}
                onChange={(e) => setEditingProd({ ...editingProd, shortDescription: e.target.value })}
                className="w-full text-sm px-4 py-3 bg-white border border-beige rounded-xl focus:ring-1 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            {/* PRODUCT IMAGE UPLOAD */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Product Image</label>
              <div className="border border-dashed border-beige bg-white p-4 rounded-xl text-center select-none">
                {editingProd.image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={editingProd.image} className="w-24 h-24 object-cover rounded-xl border border-beige" alt="Product preview" />
                    <button 
                      type="button" 
                      onClick={() => setEditingProd({ ...editingProd, image: '' })} 
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-xs text-stone-500 font-bold">Upload product photo from files</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOptimizedImageUpload(file, (b64) => setEditingProd({ ...editingProd, image: b64 }));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* FEATURED TOGGLE */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-600">
                <input
                  type="checkbox"
                  checked={editingProd.bestseller}
                  onChange={(e) => setEditingProd({ ...editingProd, bestseller: e.target.checked })}
                  className="w-4 h-4 rounded text-maroon-900 focus:ring-maroon-900 border-beige cursor-pointer"
                />
                <span>Set as Featured Product on Homepage</span>
              </label>
            </div>

            {/* STATUS TOGGLE */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-600">
                <input
                  type="checkbox"
                  checked={editingProd.status === 'active'}
                  onChange={(e) => setEditingProd({ ...editingProd, status: e.target.checked ? 'active' : 'draft' })}
                  className="w-4 h-4 rounded text-maroon-900 focus:ring-maroon-900 cursor-pointer border-beige"
                />
                <span>Publish Immediately (Make visible to customers)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-beige select-none">
            <button
              type="button"
              onClick={() => setEditingProd(null)}
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

      {/* FILTER AND SEARCH CONTROLS */}
      {!showAddForm && !editingProd && (
        <>
          <div className="bg-cream border border-beige p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs px-3 py-2 bg-white border border-beige rounded-xl cursor-pointer focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PRODUCTS LIST */}
          <div className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm">
            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left font-sans border-collapse">
                <thead>
                  <tr className="bg-cream-dark text-stone-500 uppercase tracking-wider text-[10px] font-bold font-mono border-b border-beige">
                    <th className="py-3 px-4 w-16 text-center">Image</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige text-xs text-stone-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-450 italic font-mono">No products matched query.</td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-beige/10 transition-colors">
                        <td className="py-3 px-4">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-beige mx-auto"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.bestseller && (
                              <span className="p-0.5 px-1.5 text-[8px] bg-amber-100 text-[#C5A059] border border-amber-300 rounded font-bold uppercase font-mono flex items-center gap-0.5">
                                <Star className="w-2 h-2 fill-current" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-500 uppercase tracking-wide text-[10px]">
                          {categories.find(c => c.id === p.category)?.name || p.category}
                        </td>
                        <td className="py-3 px-4 font-bold font-mono text-stone-800 text-sm">
                          Rs. {p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-mono ${
                            p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProd(p)}
                              className="p-1 px-2.5 border border-beige rounded-lg hover:border-maroon-900 hover:bg-maroon-50 text-stone-600 hover:text-maroon-900 font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="block md:hidden p-4 space-y-4 divide-y divide-beige/45">
              {filteredProducts.length === 0 ? (
                <p className="py-6 text-center text-stone-400 italic">No products matched query.</p>
              ) : (
                filteredProducts.map((p, idx) => (
                  <div key={p.id} className={`pt-4 first:pt-0 pb-1 space-y-3`}>
                    <div className="flex items-start gap-3">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-beige shrink-0"
                      />
                      <div className="space-y-1 py-0.5">
                        <p className="font-serif font-extrabold text-stone-900 text-sm">{p.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest leading-none">
                          {categories.find(c => c.id === p.category)?.name || p.category}
                        </p>
                        <p className="font-bold text-maroon-950 font-mono">Rs. {p.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.bestseller && (
                          <span className="p-0.5 px-1.5 text-[8px] bg-amber-100 text-[#C5A059] border border-amber-300 rounded font-bold uppercase font-mono">
                            ★ Featured
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold font-mono ${
                          p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingProd(p)}
                          className="p-1.5 border border-beige rounded-lg hover:border-maroon-900 text-stone-600 focus:bg-beige/10 cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-sm transition-colors"
                          title="Delete"
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
        </>
      )}
      {productToDelete && (
        <DeleteConfirmModal 
          isOpen={productToDelete !== null}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Product?"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action is permanent and cannot be undone.`}
        />
      )}
    </div>
  );
}
