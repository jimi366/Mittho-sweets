import React from 'react';
import { Product, Category, GalleryItem, Inquiry } from '../../types';
import { 
  Plus, Mail, Image as ImageIcon, ShoppingCart, Folder, FileText, ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  setActiveTab: (tab: any) => void;
  // Included to keep parent prop compatibility
  reviews?: any[];
  gallery: GalleryItem[];
  inquiries: Inquiry[];
  offers?: any[];
  setShowAddProduct?: () => void;
  setShowAddCategory?: () => void;
  setShowAddGallery?: () => void;
  setShowAddOffer?: () => void;
}

export default function AdminDashboard({
  products,
  categories,
  gallery,
  inquiries,
  setActiveTab
}: AdminDashboardProps) {
  
  // Dashboard Metrics requested:
  // - Total Products
  // - Total Categories
  // - Total Gallery Images
  // - Total Messages
  // - Total Cake Requests
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalGallery = gallery.length;
  
  // Let's filter messages (general) vs cake requests (custom-cake)
  const totalMessages = inquiries.filter(i => i.type === 'general' || !i.type).length;
  const totalCakes = inquiries.filter(i => i.type === 'custom-cake').length;

  const stats = [
    { label: 'Total Products', val: totalProducts, icon: ShoppingCart, color: 'text-maroon-900 bg-maroon-50' },
    { label: 'Total Categories', val: totalCategories, icon: Folder, color: 'text-amber-800 bg-amber-55' },
    { label: 'Total Gallery Images', val: totalGallery, icon: ImageIcon, color: 'text-teal-800 bg-teal-50' },
    { label: 'Total Messages', val: totalMessages, icon: Mail, color: 'text-blue-800 bg-blue-50' },
    { label: 'Total Cake Requests', val: totalCakes, icon: FileText, color: 'text-[#C5A059] bg-yellow-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-xs font-sans">
      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-extrabold text-stone-950">Welcome back, Zohaib!</h1>
        <p className="text-stone-500 text-xs">Here is an overview of your shop's website activities and content.</p>
      </div>

      {/* METRICS GRID - Exact requested fields */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-cream border border-beige rounded-2xl p-4 flex flex-col items-center text-center justify-center space-y-2 shadow-sm"
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-550 block">{item.label}</span>
              <span className="text-xl font-serif font-extrabold block text-stone-900">{item.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK BUTTONS */}
      <div className="bg-cream border border-beige p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-maroon-950 font-extrabold text-sm">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className="flex items-center justify-between p-4 bg-white border border-beige hover:border-maroon-900 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🧁</span>
              <div>
                <span className="block font-bold text-stone-900 text-xs">Add Product</span>
                <span className="block text-[10px] text-stone-400">Add confectioneries to your menu</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>
          
          <button
            onClick={() => setActiveTab('gallery')}
            className="flex items-center justify-between p-4 bg-white border border-beige hover:border-maroon-900 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🖼️</span>
              <div>
                <span className="block font-bold text-stone-900 text-xs">Upload Images</span>
                <span className="block text-[10px] text-[#A3A3A3]">Add new photos to showcase</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className="flex items-center justify-between p-4 bg-maroon-900 text-white hover:bg-maroon-950 rounded-xl transition-all cursor-pointer shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">✉️</span>
              <div>
                <span className="block font-bold text-xs white">View Messages</span>
                <span className="block text-[10px] text-cream/70">Check client orders & inquiries</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cream/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
