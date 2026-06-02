import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Settings, FileText, Globe, Shield, RefreshCw, 
  MapPin, Phone, MessageSquare, Mail, Layers, Eye, Save, AlertCircle, 
  Menu, ChevronLeft, ChevronRight, Search, Sun, Moon, LogOut, Check, X,
  User, Lock, Sparkles, TrendingUp, Calendar, Gift, Star, Image as ImageIcon
} from 'lucide-react';

import { Product, Category, Review, GalleryItem, Inquiry, Offer, ContactInfo, User as UserType, ActivityLog, HomepageCMSConfig } from '../types';

import AdminDashboard from './Admin/AdminDashboard';
import ProductCMS from './Admin/ProductCMS';
import CategoryCMS from './Admin/CategoryCMS';
import GalleryCMS from './Admin/GalleryCMS';
import InquiryCMS from './Admin/InquiryCMS';
import OffersCMS from './Admin/OffersCMS';
import ReviewCMS from './Admin/ReviewCMS';
import UsersCMS from './Admin/UsersCMS';
import SettingsCMS from './Admin/SettingsCMS';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  setProducts,
  categories,
  setCategories,
  reviews,
  setReviews,
  gallery,
  setGallery,
  inquiries,
  setInquiries,
  offers,
  setOffers,
  contactInfo,
  setContactInfo,
  onClose
}: AdminPanelProps) {
  
  // Administrator Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'gallery' | 'offers' | 'reviews' | 'inquiries' | 'users' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Authentication & Forget password
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mittho_admin_authenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Custom states that persist dynamically inside localstorage
  const [users, setUsers] = useState<UserType[]>(() => {
    const raw = localStorage.getItem('mittho_cms_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.some((u: any) => u.email && u.email.includes('mitthosweets.com'))) {
        return [
          { id: '1', name: 'Zohaib Mittho', email: 'admin@gojramittho.com', role: 'Super Admin', status: 'active', lastActive: 'Today' },
          { id: '2', name: 'Abdul Ghafoor', email: 'abdul@gojramittho.com', role: 'Content Manager', status: 'active', lastActive: 'Yesterday' }
        ];
      }
      return parsed;
    }
    return [
      { id: '1', name: 'Zohaib Mittho', email: 'admin@gojramittho.com', role: 'Super Admin', status: 'active', lastActive: 'Today' },
      { id: '2', name: 'Abdul Ghafoor', email: 'abdul@gojramittho.com', role: 'Content Manager', status: 'active', lastActive: 'Yesterday' }
    ];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const raw = localStorage.getItem('mittho_cms_activity_logs');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'log-1', user: 'Zohaib Mittho', role: 'Super Admin', action: 'Auth Secure Session', details: 'Successful administrative login validated through terminal parameters', timestamp: new Date().toLocaleString() }
    ];
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageCMSConfig>(() => {
    const raw = localStorage.getItem('mittho_cms_homepage_config');
    if (raw) return JSON.parse(raw);
    return {
      heroHeading: 'Traditional Desi Ghee Confectioneries & Bespoke Celebration Cakes',
      heroSubheading: 'Since 2011, crafting pure milk mithai products and premium custom baking wonders in Gojra with authentic handcraftsmanship.',
      heroButtonText: 'Order Sweets Now',
      heroButtonSecondaryText: 'Explore Collections',
      aboutHeading: 'Crafting Genuine Joy Since 2011',
      aboutText: 'Mittho Sweets & Bakers was founded on a simple truth: true sweetness is built of pure ingredients. Unlike conventional commercial bakeries that utilize bulk vegetable margarine and chemical preservatives, our sweet masterpieces are made exclusively list of 100% thick milk extracts (Khoya) and Desi Ghee.',
      ctaHeading: 'Planning an Elite Wedding or Family High-Tea Celebration?',
      ctaSubheading: 'Collaborate with our artisan sweet designers to sculpt customizable packaging trunks, theme cakes and custom caters.'
    };
  });

  useEffect(() => {
    localStorage.setItem('mittho_cms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mittho_cms_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('mittho_cms_homepage_config', JSON.stringify(homepageConfig));
  }, [homepageConfig]);

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: 'Zohaib Mittho',
      role: 'Super Admin',
      action,
      details,
      timestamp: new Date().toLocaleString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  // Image upload handler passed down
  const handleOptimizedImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 650;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          callback(compressed);
        } else {
          callback(event.target?.result as string);
        }
      };
    };
  };

  // Auth functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin@gojramittho.com' && password === 'Police.15') {
        setIsAuthenticated(true);
        sessionStorage.setItem('mittho_admin_authenticated', 'true');
        addActivityLog('Secure Login', 'Super Admin session established successfully');
      } else {
        setLoginError('Invalid parameters! Double check admin ID and passcode.');
      }
      setLoginLoading(false);
    }, 650);
  };

  const handleLogout = () => {
    addActivityLog('Secure Logout', 'Admin user explicitly terminated server session');
    setIsAuthenticated(false);
    sessionStorage.removeItem('mittho_admin_authenticated');
  };

  const handlePasswordReset = () => {
    const emailInput = prompt("Enter your verified administrator email address:");
    if (emailInput) {
      if (emailInput.trim().toLowerCase() === "admin@gojramittho.com") {
        alert("A secure security recovery token link has been dispatched to: " + emailInput + "\n\nCheck spam folder if not received in 5 minutes.");
        addActivityLog('Request Password Reset', `Admin password recovery request for ${emailInput}`);
      } else {
        alert("This email is not registered inside our CMS administrator database.");
      }
    }
  };

  // Breadcrumbs labels map
  const breadcrumbLabels = {
    dashboard: 'Dashboard Overview',
    products: 'Confectionery Products Catalog',
    categories: 'Baking Departments',
    gallery: 'Portfolio Showcase Gallery',
    offers: 'Promotional Campaigns',
    reviews: 'Trust Testimonials',
    inquiries: 'Website Mailbox Ledger',
    users: 'Audits & User Roles',
    settings: 'Homepage Copywriting & Metadata Configs'
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col md:flex-row font-sans text-xs h-screen w-screen max-h-screen max-w-screen overflow-hidden ${
      darkMode ? 'bg-zinc-950 text-stone-200' : 'bg-[#FAFAF9] text-stone-800'
    }`}>
      
      {/* 1. SECURE AUTHENTICATION SCREEN IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-charcoal bg-cover bg-no-repeat relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200')" }}>
          <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-md"></div>
          
          <div className="max-w-md w-full bg-cream border border-beige p-8 rounded-3xl relative shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block font-mono">Mittho Sweets & Bakers</span>
              <h2 className="text-2xl font-serif text-maroon-950 font-bold">Bakery CMS Login Portal</h2>
              <p className="text-xs text-stone-500">Secure operator interface to update menus, customize headers, and review inquiries.</p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-100 border border-red-200 text-red-850 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-[11px] leading-tight">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Administrative Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin@yourdomain.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Passphrase Code</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="flex justify-end text-[11px] select-none">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-maroon-900 font-bold hover:underline"
                >
                  Forget code?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-maroon-900 border border-maroon-950 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-maroon-950 transition-colors cursor-pointer select-none"
              >
                {loginLoading ? 'Validating security logs...' : 'Authorize Secure Access'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 text-[10px] tracking-wider uppercase font-mono"
              >
                ✕ Back to Website Layout
              </button>
            </div>
          </div>
        </div>
      ) : (

        // 2. AUTHORIZED COMPLETE METRO CMS BOARD
        <>
          {/* SIDEBAR NAVIGATION DOCKS */}
          <aside className={`hidden md:flex border-r border-beige flex-col justify-between transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } ${darkMode ? 'bg-zinc-900' : 'bg-cream'}`}>
            
            <div className="space-y-6">
              {/* BRAND IDENTITIES OVERLAYS */}
              <div className="p-4 border-b border-beige flex items-center justify-between gap-2 overflow-hidden select-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍪</span>
                  {!sidebarCollapsed && (
                    <div className="leading-tight animate-fade-in">
                      <span className="font-serif text-maroon-950 text-base font-extrabold block">Mittho Sweets</span>
                      <span className="text-[9px] text-[#C5A059] font-mono tracking-widest font-extrabold uppercase">Premium CMS</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 border border-beige hover:border-maroon-900 text-stone-500 hover:text-maroon-900 rounded-lg cursor-pointer"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* NAVIGATION BUTTON ACTIONS */}
              <nav className="px-3.5 space-y-1">
                {[
                  { id: 'dashboard', label: 'Monitor Dashboard', icon: TrendingUp },
                  { id: 'products', label: 'Products list', icon: ShoppingBagIcon },
                  { id: 'categories', label: 'Departments', icon: Layers },
                  { id: 'gallery', label: 'Media Chest', icon: ImageIcon },
                  { id: 'offers', label: 'Campaign Offers', icon: Gift },
                  { id: 'reviews', label: 'Trust Reviews', icon: Star },
                  { id: 'inquiries', label: 'Mailbox Ledger', icon: Mail },
                  { id: 'users', label: 'CMS Operators', icon: User },
                  { id: 'settings', label: 'Homepage & SEO', icon: Settings }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 p-2.5 py-3 rounded-xl transition-all cursor-pointer font-bold select-none text-[11px] ${
                        isActive
                           ? 'bg-maroon-900 text-cream border border-maroon-950 font-extrabold shadow-md'
                          : 'text-stone-600 hover:bg-beige/15 hover:text-stone-900'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="animate-fade-in">{item.label}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* LOWER USER SETTING DOCK */}
            <div className="p-4 border-t border-beige space-y-3">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2.5 leading-none px-1">
                  <div className="w-8 h-8 rounded-full bg-gold-600/35 border border-gold-600 flex items-center justify-center font-bold text-maroon-900">
                    ZM
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-900 block">Zohaib Admin</span>
                    <span className="text-[10px] text-stone-500 font-mono block">Super Operator</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 text-stone-500 hover:text-red-650 hover:bg-red-50 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                {!sidebarCollapsed && <span>End Secure Session</span>}
              </button>
            </div>
          </aside>

          {/* MOBILE DRAWER NAVIGATION SIDEBAR */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                />
                {/* Slide-out Panel */}
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col justify-between border-r border-[#D4AF37]/25 shadow-2xl ${
                    darkMode ? 'bg-zinc-900 text-stone-200' : 'bg-[#FAFAF9] text-[#1b1c1c]'
                  }`}
                >
                  <div className="space-y-6">
                    {/* Brand header */}
                    <div className="p-4 border-b border-beige flex items-center justify-between gap-2 overflow-hidden select-none">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🍪</span>
                        <div className="leading-tight text-left">
                          <span className="font-serif text-maroon-950 text-base font-extrabold block">Mittho Sweets</span>
                          <span className="text-[9px] text-[#C5A059] font-mono tracking-widest font-extrabold uppercase block font-bold">Premium CMS</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-1.5 text-stone-500 hover:text-red-650 hover:bg-red-50 border border-beige rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold"
                        aria-label="Close Mobile Navigation"
                      >
                        <X className="w-4 h-4 text-maroon-900" />
                        <span>Close</span>
                      </button>
                    </div>

                    {/* Links list */}
                    <nav className="px-3.5 space-y-1">
                      {[
                        { id: 'dashboard', label: 'Monitor Dashboard', icon: TrendingUp },
                        { id: 'products', label: 'Products list', icon: ShoppingBagIcon },
                        { id: 'categories', label: 'Departments', icon: Layers },
                        { id: 'gallery', label: 'Media Chest', icon: ImageIcon },
                        { id: 'offers', label: 'Campaign Offers', icon: Gift },
                        { id: 'reviews', label: 'Trust Reviews', icon: Star },
                        { id: 'inquiries', label: 'Mailbox Ledger', icon: Mail },
                        { id: 'users', label: 'CMS Operators', icon: User },
                        { id: 'settings', label: 'Homepage & SEO', icon: Settings }
                      ].map((item) => {
                        const isActive = activeTab === item.id;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2.5 py-3 rounded-xl transition-all cursor-pointer font-bold select-none text-[11px] text-left ${
                              isActive
                                ? 'bg-maroon-900 text-cream border border-maroon-950 font-extrabold shadow-md animate-fade-in'
                                : 'text-stone-600 hover:bg-beige/15 hover:text-stone-900'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            <span className="animate-fade-in">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Profile and Logout info */}
                  <div className="p-4 border-t border-beige space-y-3">
                    <div className="flex items-center justify-between gap-2.5 leading-none px-1">
                      <div className="flex items-center gap-2.5 leading-none">
                        <div className="w-8 h-8 rounded-full bg-gold-600/35 border border-gold-600 flex items-center justify-center font-bold text-maroon-900 shrink-0">
                          ZM
                        </div>
                        <div className="space-y-1 text-left">
                          <span className="text-xs font-bold text-stone-900 block">Zohaib Admin</span>
                          <span className="text-[10px] text-stone-500 font-mono block">Super Operator</span>
                        </div>
                      </div>
                      
                      {/* Dark mode switch in mobile drawer */}
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-1.5 border border-beige hover:border-stone-400 rounded-xl cursor-pointer text-stone-500 transition-colors flex items-center justify-center"
                        title={darkMode ? 'Switch Bright theme' : 'Switch Eye-Safer twilight'}
                      >
                        {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-[#334155]" />}
                      </button>
                    </div>

                    {/* Back to Home Dashboard if inside subtabs */}
                    {activeTab !== 'dashboard' && (
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setMobileSidebarOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#C5A059]/10 text-maroon-900 border border-maroon-900/20 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>← Back to Admin Home</span>
                      </button>
                    )}

                    {/* Exit System Portal shortcut */}
                    <button
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2.5 bg-maroon-900 text-cream border border-maroon-950 rounded-xl text-xs font-bold cursor-pointer hover:bg-maroon-950 transition-colors shadow"
                    >
                      <span>← Back to Website</span>
                      <span className="font-normal opacity-90 text-[10px]">| واپس جائیں</span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2 text-stone-500 hover:text-red-650 hover:bg-red-50 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>End Secure Session</span>
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* MAIN ADMINISTRATIVE CONTENT BOARDS */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* CORE EXECUTIVE HEADER PORT */}
            <header className="h-16 border-b border-beige px-4 md:px-6 flex items-center justify-between gap-4 select-none">
              {/* BREADCRUMB INDICATOR CARDS */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-2 px-3 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-maroon-900 hover:text-maroon-950 rounded-xl border border-maroon-900/30 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-bold select-none text-[10px]"
                  title="Open Navigation Menu"
                  aria-label="Open sidebar drawer"
                >
                  <Menu className="w-4 h-4" />
                  <span>Menu</span>
                </button>

                {activeTab !== 'dashboard' && (
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hidden md:flex p-2 px-3 bg-maroon-900 hover:bg-maroon-950 text-cream rounded-xl border border-maroon-950 items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold shadow-md transition-all cursor-pointer select-none shrink-0"
                    title="Back to Admin Home Dashboard"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>← Admin Home</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-stone-500 font-medium select-none text-[10px] sm:text-[11px]">
                  <span className="hidden md:inline hover:text-stone-800">Admin Portal</span>
                  <span className="hidden md:inline">/</span>
                  <span className="text-stone-900 font-bold max-w-[125px] sm:max-w-none truncate">{breadcrumbLabels[activeTab]}</span>
                </div>
              </div>

              {/* SEARCH FIELD BAR everywhere support */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1.5">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 border border-beige hover:border-stone-400 rounded-xl cursor-pointer text-stone-500 transition-colors"
                    title={darkMode ? 'Switch Bright theme' : 'Switch Eye-Safer twilight'}
                  >
                    {darkMode ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-[#334155]" />}
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2 px-3 sm:px-4 bg-maroon-900 border border-maroon-950 text-cream hover:bg-maroon-950 rounded-xl text-xs font-bold transition-all select-none cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <span>← Back to Website</span>
                    <span className="hidden sm:inline font-normal">| واپس جائیں</span>
                  </button>
                </div>
              </div>
            </header>

            {/* COMPONENT BODY ATTACHS */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  products={products}
                  categories={categories}
                  reviews={reviews}
                  gallery={gallery}
                  inquiries={inquiries}
                  offers={offers}
                  setActiveTab={setActiveTab}
                  setShowAddProduct={() => { setActiveTab('products'); }}
                  setShowAddCategory={() => { setActiveTab('categories'); }}
                  setShowAddGallery={() => { setActiveTab('gallery'); }}
                  setShowAddOffer={() => { setActiveTab('offers'); }}
                />
              )}

              {activeTab === 'products' && (
                <ProductCMS 
                  products={products}
                  setProducts={setProducts}
                  categories={categories}
                  addActivityLog={addActivityLog}
                  handleOptimizedImageUpload={handleOptimizedImageUpload}
                />
              )}

              {activeTab === 'categories' && (
                <CategoryCMS 
                  categories={categories}
                  setCategories={setCategories}
                  addActivityLog={addActivityLog}
                  handleOptimizedImageUpload={handleOptimizedImageUpload}
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryCMS 
                  gallery={gallery}
                  setGallery={setGallery}
                  addActivityLog={addActivityLog}
                  handleOptimizedImageUpload={handleOptimizedImageUpload}
                />
              )}

              {activeTab === 'offers' && (
                <OffersCMS 
                  offers={offers}
                  setOffers={setOffers}
                  addActivityLog={addActivityLog}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewCMS 
                  reviews={reviews}
                  setReviews={setReviews}
                  addActivityLog={addActivityLog}
                  handleOptimizedImageUpload={handleOptimizedImageUpload}
                />
              )}

              {activeTab === 'inquiries' && (
                <InquiryCMS 
                  inquiries={inquiries}
                  setInquiries={setInquiries}
                  addActivityLog={addActivityLog}
                />
              )}

              {activeTab === 'users' && (
                <UsersCMS 
                  users={users}
                  setUsers={setUsers}
                  currentUserRole="Super Admin"
                  addActivityLog={addActivityLog}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsCMS 
                  contactInfo={contactInfo}
                  setContactInfo={setContactInfo}
                  homepageConfig={homepageConfig}
                  setHomepageConfig={setHomepageConfig}
                  activityLogs={activityLogs}
                  clearActivityLogs={clearActivityLogs}
                  addActivityLog={addActivityLog}
                  handleOptimizedImageUpload={handleOptimizedImageUpload}
                  reviews={reviews}
                  setReviews={setReviews}
                />
              )}
            </main>
          </div>
        </>
      )}

    </div>
  );
}

// Sub helper mock icons
function ShoppingBagIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  );
}
