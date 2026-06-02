/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Star, ChevronLeft, ChevronRight, Eye, Phone, Mail, Clock, MapPin, 
  Search, SlidersHorizontal, ArrowRight, Instagram, CheckCircle2, ChevronRightCircle,
  HelpCircle, Gift, ShieldAlert, Award, LogIn, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroBg from './assets/images/luxury_cake_hero_1780340624611.png';
import sweetheartCupcakes from './assets/images/sweetheart_cupcakes_1780341113694.png';
import fudgeBrownies from './assets/images/fudge_brownies_1780341145632.png';
import caramelDripCake from './assets/images/caramel_drip_cake_1780341331571.png';
import imperialGoldCake from './assets/images/imperial_gold_cake_1780341287111.png';
import bakeryShowcase from './assets/images/bakery_showcase_1780341045169.png';
import artisanBreads from './assets/images/artisan_breads_1780341067603.png';

// Type definitions
import { Product, Category, Review, GalleryItem, Inquiry, Offer, ContactInfo, HomepageCMSConfig } from './types';

// Seed data
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_REVIEWS, INITIAL_GALLERY, 
  INITIAL_CATERING_PACKAGES, DEFAULT_CONTACT_INFO, INITIAL_OFFERS, FAQS 
} from './data';

// Custom sub-components
import Header from './components/Header';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CakeInquiryForm from './components/CakeInquiryForm';
import CateringEstimator from './components/CateringEstimator';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // --- Persistent Storage State Synchronizers ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mittho_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed = JSON.parse(saved) as Product[];
      
      // Sanitize/Refresh images for default products so they never point to old URLs, clocks, or bikes
      const updated = parsed.map(p => {
        const defaultProduct = INITIAL_PRODUCTS.find(dp => dp.id === p.id);
        if (defaultProduct) {
          return { ...p, image: defaultProduct.image };
        }
        return p;
      });

      const existingIds = new Set(updated.map(p => p.id));
      const missingDefaults = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
      const merged = missingDefaults.length > 0 ? [...updated, ...missingDefaults] : updated;
      localStorage.setItem('mittho_products', JSON.stringify(merged));
      return merged;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mittho_categories');
    if (!saved) return INITIAL_CATEGORIES;
    try {
      const parsed = JSON.parse(saved) as Category[];
      
      // Sanitize/Refresh images for default categories
      const updated = parsed.map(c => {
        const defaultCategory = INITIAL_CATEGORIES.find(dc => dc.id === c.id);
        if (defaultCategory) {
          return { ...c, image: defaultCategory.image };
        }
        return c;
      });

      const existingIds = new Set(updated.map(c => c.id));
      const missingDefaults = INITIAL_CATEGORIES.filter(c => !existingIds.has(c.id));
      const merged = missingDefaults.length > 0 ? [...updated, ...missingDefaults] : updated;
      localStorage.setItem('mittho_categories', JSON.stringify(merged));
      return merged;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mittho_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('mittho_gallery');
    if (!saved) return INITIAL_GALLERY;
    try {
      const parsed = JSON.parse(saved) as GalleryItem[];
      
      // Sanitize/Refresh images for default gallery items
      const updated = parsed.map(g => {
        const defaultGallery = INITIAL_GALLERY.find(dg => dg.id === g.id);
        if (defaultGallery) {
          return { ...g, image: defaultGallery.image };
        }
        return g;
      });

      const existingIds = new Set(updated.map(g => g.id));
      const missingDefaults = INITIAL_GALLERY.filter(g => !existingIds.has(g.id));
      const merged = missingDefaults.length > 0 ? [...updated, ...missingDefaults] : updated;
      localStorage.setItem('mittho_gallery', JSON.stringify(merged));
      return merged;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('mittho_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('mittho_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('mittho_contact_info');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACT_INFO;
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageCMSConfig>(() => {
    const raw = localStorage.getItem('mittho_cms_homepage_config');
    if (raw) return JSON.parse(raw);
    return {
      heroHeading: 'Freshly Crafted Sweets, Cakes & Bakery Delights',
      heroSubheading: 'Premium quality traditional sweets, custom themed wedding cakes, and butter biscuits engineered with absolute love, fresh handpicked ingredients, and pure desi ghee.',
      heroButtonText: 'Order Sweets Now',
      heroButtonSecondaryText: 'Explore Collections',
      heroImage: '',
      aboutHeading: 'Crafting Genuine Joy Since 2011',
      aboutText: 'Begun in Main Bazar, Gojra, Mittho Sweets & Bakers was founded on a simple, profound truth: true sweetness is built of pure ingredients. Unlike conventional commercial bakeries that utilize bulk vegetable margarine and chemical preservatives, our sweet masterpieces are made exclusively list of 100% thick milk extracts (Khoya) and Desi Ghee.',
      whyChooseHeading: 'Why Choose Mittho Sweets',
      whyChooseCards: [],
      ctaHeading: 'Planning an Elite Wedding?',
      ctaSubheading: 'Collaborate with our sweet artisans.',
      ctaButtonText: ''
    };
  });

  // --- UI Layout state controller ---
  const [currentView, setCurrentView] = useState<string>('home'); // home, about, products, custom-cakes, catering, gallery, contact, admin
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [directCheckoutMode, setDirectCheckoutMode] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keep homepage config synced when currentView transitions
  useEffect(() => {
    const raw = localStorage.getItem('mittho_cms_homepage_config');
    if (raw) {
      setHomepageConfig(JSON.parse(raw));
    }
  }, [currentView]);

  // --- Product Browsing States (filtering & sorting) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc, rating
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');

  // --- Before-After interactive cake slider state ---
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isSliding, setIsSliding] = useState(false);

  // --- General Form Submission State ---
  const [contactSubmitStatus, setContactSubmitStatus] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  // --- Active Testimonial Carousel state ---
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Sync state modifications dynamically into localStorage
  useEffect(() => {
    localStorage.setItem('mittho_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mittho_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mittho_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mittho_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('mittho_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('mittho_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('mittho_contact_info', JSON.stringify(contactInfo));
  }, [contactInfo]);

  // Automated Testimonials slider tick (every 8 seconds)
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % reviews.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [reviews]);

  // Inquiry Appender Callback
  const handleAddInquiry = (newInq: Inquiry) => {
    setInquiries([newInq, ...inquiries]);
  };

  // General contact form trigger
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert('Please fill out Name and WhatsApp phone fields.');
      return;
    }
    const commentInq: Inquiry = {
      id: `inq-gen-${Date.now()}`,
      type: 'general',
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email,
      date: new Date().toLocaleDateString(),
      status: 'pending',
      details: `Comment: ${contactForm.message}`,
      timestamp: new Date().toLocaleString()
    };
    handleAddInquiry(commentInq);
    setContactSubmitStatus(true);
    setContactForm({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setContactSubmitStatus(false), 5000);
  };

  // Direct checkout formatter for quick buying
  const triggerDirectWhatsAppCheckout = (p: Product) => {
    setDirectCheckoutMode(true);
    setSelectedProduct(p);
  };

  // Parallax / Scroll to specific segment target
  const routeToProductView = (catId?: string) => {
    if (catId) {
      setActiveCategory(catId);
    } else {
      setActiveCategory('all');
    }
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Filter Selector
  const getFilteredProducts = () => {
    let result = [...products];
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  };

  // Before After slider mover helper
  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const activeOffer = offers.find(o => o.active);
  const cleanupPhoneNo = contactInfo.phone.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-600 selection:text-charcoal bg-cream font-sans antialiased text-charcoal">
      
      {/* Main glassmorphic Navigation Header bar */}
      {currentView !== 'admin' && (
        <Header 
          currentView={currentView} 
          onSetView={setCurrentView} 
          contactInfo={contactInfo} 
          activeOffer={activeOffer}
        />
      )}

      {/* Content Outer Wrapper */}
      <div className={`flex-grow relative z-20 ${currentView !== 'admin' ? 'pt-[80px]' : ''}`}>
        <AnimatePresence mode="wait">
          
          {/* ======================================= */}
          {/* VIEW: HOME VIEW (11 DIVISIONS)          */}
          {/* ======================================= */}
          {currentView === 'home' && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 md:space-y-24"
            >
              {/* SECTION 1: HERO SECTION */}
              <section id="hero-segment" className="relative min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] lg:min-h-[650px] py-16 lg:py-0 flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${homepageConfig.heroImage || heroBg})` }}>
                <div className="absolute inset-0 hero-overlay"></div>
                
                {/* Floating Sweet items for aesthetic pairing */}
                <div className="absolute top-20 left-10 w-24 h-24 hidden lg:block opacity-25 animate-float-slow">
                  <img src={sweetheartCupcakes} alt="Float sweetheart cupcakes" className="rounded-full w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-20 right-10 w-28 h-28 hidden lg:block opacity-25 animate-float-medium">
                  <img src={fudgeBrownies} alt="Float fudge brownies" className="rounded-full w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center px-4 md:px-8 space-y-6 z-10">
                  <span className="text-gold-600 font-bold uppercase tracking-widest text-xs md:text-sm block">
                    ✨ SINCE GENERATIONS OF TASTE & HYGIENE
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-[1.1] font-bold">
                    {homepageConfig.heroHeading}
                  </h1>
                  
                  <p className="text-stone-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                    {homepageConfig.heroSubheading}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <a
                      id="hero-wa-cta"
                      href={`https://wa.me/${cleanupPhoneNo}?text=Assalam%20o%20Alaikum%20Mittho%20Sweets%20Gojra!%20I%20want%20to%20order%20sweets.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 bg-maroon-900 border border-maroon-900 hover:bg-maroon-950 text-white font-semibold text-xs tracking-widest uppercase rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      Order on WhatsApp
                    </a>

                    <button
                      id="hero-explore-cta"
                      onClick={() => routeToProductView()}
                      className="px-8 py-3.5 bg-transparent hover:bg-white/10 text-cream border-2 border-beige hover:border-white rounded-xl text-xs font-semibold tracking-widest uppercase transition-all"
                    >
                      Explore Products
                    </button>

                    <button
                      id="hero-cake-cta"
                      onClick={() => { setCurrentView('custom-cakes'); window.scrollTo({ top: 0 }); }}
                      className="px-8 py-3.5 bg-gold-600 hover:bg-gold-700 text-charcoal font-bold text-xs tracking-widest uppercase rounded-xl hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all"
                    >
                      Cake Inquiry
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: TRUST BAR */}
              <section id="trust-bar" className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="bg-maroon-950 rounded-2xl p-6 md:p-8 border border-gold-600/30 text-cream flex overflow-x-auto justify-between items-center gap-6 divide-x divide-white/15 scrollbar-thin">
                  
                  <div className="flex-1 min-w-[140px] text-center p-2">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-500">100%</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-300 mt-1 font-semibold">Fresh Products Daily</div>
                  </div>

                  <div className="flex-1 min-w-[140px] text-center p-2">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-500">12,000+</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-300 mt-1 font-semibold">Happy Customers</div>
                  </div>

                  <div className="flex-1 min-w-[140px] text-center p-2">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-500">4,500+</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-300 mt-1 font-semibold">Custom Cake Orders</div>
                  </div>

                  <div className="flex-1 min-w-[140px] text-center p-2">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-500">15+ Yrs</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-300 mt-1 font-semibold">Cookery Experience</div>
                  </div>

                  <div className="flex-grow min-w-[170px] text-center p-2 shrink-0">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex text-gold-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="font-mono text-sm font-bold text-cream">4.9 / 5</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-300 mt-1 font-semibold">Google Review Rating</div>
                  </div>

                </div>
              </section>

              {/* SECTION 3: FEATURED CATEGORIES */}
              <section id="featured-categories" className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
                <div className="text-center">
                  <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">premium assortment</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">Explore Featured Categories</h2>
                  <p className="text-[#555] text-xs max-w-md mx-auto mt-2">Satisfy your cravings by selecting our gourmet sweet bins designed strictly for you.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => routeToProductView(cat.id)}
                      className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 card-overlay"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-center ">
                        <h3 className="font-serif text-lg font-bold text-white mb-2">{cat.name}</h3>
                        <span className="inline-block text-[10px] uppercase tracking-widest font-extrabold text-[#FCF9F3] bg-maroon-900 hover:bg-maroon-950 border border-[#C5A059]/40 px-4 py-2 rounded-full shadow-lg group-hover:bg-[#C5A059] group-hover:text-charcoal transition-all duration-300">
                          Browse Collection →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4: BEST SELLERS */}
              <section id="best-sellers" className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">signature selections</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">Our Current Bestsellers</h2>
                  </div>
                  <button
                    onClick={() => routeToProductView()}
                    className="text-xs uppercase tracking-wider text-maroon-900 border-b-2 border-maroon-950 pb-0.5 hover:text-gold-600 transition-colors font-bold flex items-center gap-1 self-start sm:self-auto"
                  >
                    View entire catalog →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter(p => p.bestseller).slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="group bg-cream rounded-lg overflow-hidden border border-beige shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Image header with bestseller visual shield */}
                      <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-maroon-900 text-[#FFF] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-ping"></span>
                          Bestseller
                        </div>
                        <div className="absolute top-3 right-3 bg-cream/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded shadow font-mono">
                          ⭐ {item.rating}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="inline-block border border-gold-700/50 text-gold-700 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-gold-100/10 mb-1.5">
                            {item.category.replace('-', ' ')}
                          </div>
                          <h4 className="font-serif text-lg font-bold text-maroon-950">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                          {item.weightOptions && item.weightOptions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.weightOptions.map((opt) => (
                                <span key={opt} className="px-1.5 py-0.5 bg-maroon-50 border border-maroon-100/30 text-maroon-900 rounded text-[9px] font-bold whitespace-nowrap">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-beige pt-4">
                          <div>
                            <div className="text-[9px] text-stone-400 font-mono uppercase">Starting price</div>
                            <div className="text-xl font-serif text-maroon-905 font-bold">
                              Rs. {item.price.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setSelectedProduct(item)}
                              className="p-2 border border-beige hover:border-maroon-900 text-stone-700 hover:text-maroon-900 rounded transition-all hover:scale-105 bg-cream shadow-sm"
                              title="Details / Quick view"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => triggerDirectWhatsAppCheckout(item)}
                              className="px-4 py-2 bg-maroon-900 hover:bg-maroon-950 text-[#FFF] text-xs font-semibold rounded flex items-center gap-1 tracking-wider shadow"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 5: ABOUT PREVIEW */}
              <section id="about-preview" className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-cream-dark/30 p-6 md:p-10 border border-beige rounded-3xl">
                  
                  {/* Left Side text story */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-gold-700 font-semibold tracking-widest text-xs uppercase block">
                      OUR GRAND STORY
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 font-bold leading-tight">
                      Preserving Perfection & Traditon From generations
                    </h2>
                    
                    <div className="space-y-4 text-xs md:text-sm text-[#555] leading-relaxed">
                      <p>
                        At Mittho Sweets & Bakers Gojra, our legacy is defined by purity. Our kitchens maintain uncompromising hygiene levels while preparing sweets using 100% pure milk solid reduction (Khoya) and Desi Ghee.
                      </p>
                      <p>
                        Whether celebration custom design wedding cakes or butter biscuits, our master sweet engineers follow artisanal secrets passed down through decades of culinary passion.
                      </p>
                    </div>

                    <button
                      onClick={() => { setCurrentView('about'); window.scrollTo({ top: 0 }); }}
                      className="px-6 py-3 bg-maroon-900 hover:bg-maroon-950 text-[#FFF] text-xs font-semibold uppercase tracking-widest shadow rounded-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      Read Genuine Legacy Story
                    </button>
                  </div>

                  {/* Right Side gorgeous graphic banner */}
                  <div className="lg:col-span-5 h-72 md:h-96 rounded-2xl overflow-hidden border border-beige shadow-lg">
                    <img
                      src={artisanBreads}
                      alt="Artisanal Kitchen Bakery"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                </div>
              </section>

              {/* SECTION 6: WHY CHOOSE US */}
              <section id="why-choose-us" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="text-center">
                  <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">uncompromising principles</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">{homepageConfig.whyChooseHeading || 'Why Choose Mittho Sweets'}</h2>
                  <p className="text-stone-500 text-xs max-w-md mx-auto mt-1">Six pillars of family trust, making us lead confectionery brands in Gojra.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Fresh Ingredients', desc: 'No artificial preservatives. We secure organic cream, fresh milk and whole nuts from trusted farms.' },
                    { title: 'Daily Production', desc: 'Sweets and bakery loaves are baked in wood fired masonry brick structures fresh every single morning.' },
                    { title: 'Premium Quality', desc: 'Each barfi piece is hand-trimmed, checked for density consistency and layered in silver leaves.' },
                    { title: 'Hygienic Kitchens', desc: 'We execute regular deep clean sanitization audits and require medical certification clearances for chefs.' },
                    { title: 'Experienced Bakers', desc: 'Our head master chefs specialize in French laminations and traditional subcontinent sweet science.' },
                    { title: 'Customer Satisfaction', desc: 'Customizable sugar density settings and fast dispatch delivery across Gojra City limits.' }
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="bg-cream border border-beige rounded-2xl p-6 shadow-sm hover:translate-y-[-4px] hover:border-gold-600/50 transition-all space-y-3 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gold-600/5 rounded-bl-3xl"></div>
                      <div className="w-10 h-10 rounded-xl bg-maroon-900 text-gold-500 flex items-center justify-center text-sm font-bold shadow-inner">
                        0{i+1}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-maroon-950">{card.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 7: CUSTOM CAKES PREVIEW WITH BEFORE-AFTER DYNAMIC SLIDER */}
              <section id="custom-cakes-preview" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="text-center">
                  <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">Interactive custom cake slider</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">Savor Designer Creations</h2>
                  <p className="text-stone-500 text-xs max-w-md mx-auto mt-1">Interact with before-frosted and finished cake design states below</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-cream-dark/20 p-6 md:p-8 rounded-3xl border border-beige">
                  
                  {/* Left explanation and categories list */}
                  <div className="lg:col-span-5 space-y-6">
                    <h3 className="text-2xl font-serif text-maroon-950 font-bold leading-tight">
                      We Cater Your Custom Dreams
                    </h3>
                    
                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                      Slide the visual controller of our signature <strong className="text-maroon-900">Belgian Double Fudge Chocolate Layer Cake</strong>. On the left is base crumbly structure bake; on the right is fully finished luxury rose gold royal frosting!
                    </p>

                    <div className="space-y-2 text-xs font-medium text-stone-700">
                      {[
                        '🎂 Majestic Multi-Tier Wedding Cascades',
                        '🎉 Character themed Birthday Cakes',
                        '💍 Diamond cut anniversary landmarks',
                        '🚀 Corporate branding launch towers'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-gold-700 font-bold" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => { setCurrentView('custom-cakes'); window.scrollTo({ top: 0 }); }}
                      className="px-6 py-3 bg-maroon-900 border border-maroon-900 hover:bg-maroon-950 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer block text-center lg:inline-block w-full"
                    >
                      Inquire Custom Designer Cakes
                    </button>
                  </div>

                  {/* Right: Dynamic Before/After custom image Slider */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    <div 
                      id="interactive-revealer-canvas"
                      className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden border border-beige shadow-xl select-none cursor-ew-resize"
                      onMouseMove={(e) => {
                        const container = e.currentTarget.getBoundingClientRect();
                        handleSliderMove(e.clientX, container);
                      }}
                      onTouchMove={(e) => {
                        if (e.touches && e.touches[0]) {
                          const container = e.currentTarget.getBoundingClientRect();
                          handleSliderMove(e.touches[0].clientX, container);
                        }
                      }}
                    >
                      {/* Before (Unfrosted) - Left layer */}
                      <div className="absolute inset-0 w-full h-full bg-stone-900">
                        <img 
                          src={caramelDripCake} 
                          alt="Cake frosted" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 bg-charcoal/80 backdrop-blur-sm text-[#FFF] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded font-mono">
                          Finished Rose gold Design
                        </div>
                      </div>

                      {/* After (Frosted / Glazed) - Right sliding layer */}
                      <div 
                        className="absolute inset-y-0 right-0 overflow-hidden bg-stone-300" 
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <img 
                          src={imperialGoldCake} 
                          alt="Cake baking crumb" 
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ width: '480px', maxWidth: 'none' }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 right-4 bg-maroon-900/95 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded font-mono">
                          Artistic Royal Fondant
                        </div>
                      </div>

                      {/* Sliding handle line */}
                      <div 
                        className="absolute inset-y-0 w-1 bg-gold-600 cursor-ew-resize flex items-center justify-center transform -translate-x-1/2"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gold-600 text-charcoal flex items-center justify-center font-bold text-xs shadow-lg hover:scale-115 transition-transform select-none">
                          ↔
                        </div>
                      </div>

                    </div>
                    <span className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-2">
                       Swipe left or right across the image canvas to interact
                    </span>
                  </div>

                </div>
              </section>

              {/* SECTION 8: CATERING SERVICES PREVIEW */}
              <section id="catering-preview" className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="text-center">
                  <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">royal banquets & weddings</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">Majestic Catering Platters</h2>
                  <p className="text-stone-500 text-xs max-w-md mx-auto mt-1">We cater sweets display stalls, event packs, and dessert counters for milestones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {INITIAL_CATERING_PACKAGES.map((pkg) => (
                    <div key={pkg.id} className="bg-cream rounded-2xl overflow-hidden border border-beige shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="h-48 overflow-hidden bg-stone-150">
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-xs bg-gold-100 text-gold-700 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {pkg.badge}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-maroon-950 mb-3">{pkg.name}</h3>
                          <ul className="space-y-1.5 mb-6 text-xs text-stone-600 font-mono">
                            {pkg.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-gold-700 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-beige flex items-center justify-between">
                          <div className="font-serif text-lg text-maroon-900 font-bold">Rs. {pkg.pricePerHead}/head</div>
                          <button
                            onClick={() => { setCurrentView('catering'); window.scrollTo({ top: 0 }); }}
                            className="text-[10px] font-bold uppercase tracking-widest bg-maroon-900 text-white px-3 py-1.5 rounded"
                          >
                            Customize Price
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 9: TESTIMONIALS SLIDER */}
              <section id="testimonials" className="bg-[#FAF6EE] py-16 border-y border-beige max-w-full">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6 relative">
                  <span className="text-xs font-mono font-bold tracking-widest text-gold-600 uppercase block">
                    Verified Google Reviews
                  </span>
                  
                  {reviews.length > 0 && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testimonialIndex}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-6 min-h-[180px] flex flex-col justify-center"
                      >
                        {/* Rating stars */}
                        <div className="flex justify-center text-gold-500">
                          {Array.from({ length: reviews[testimonialIndex].rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                          ))}
                        </div>

                        {/* Text */}
                        <p className="font-serif text-lg md:text-xl italic text-maroon-950 font-bold max-w-2xl mx-auto leading-relaxed">
                          "{reviews[testimonialIndex].text}"
                        </p>

                        {/* Author */}
                        <div className="text-xs text-stone-700">
                          <span className="font-bold uppercase tracking-widest block font-sans">
                            — {reviews[testimonialIndex].name}
                          </span>
                          <span className="text-[10px] text-stone-400 block font-mono mt-0.5">
                            {reviews[testimonialIndex].role} | {reviews[testimonialIndex].date}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Manual controls buttons */}
                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={() => setTestimonialIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                      className="w-10 h-10 border border-beige hover:border-maroon-900 bg-cream text-charcoal hover:text-maroon-900 rounded-full flex items-center justify-center hover:scale-105 transition-all"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setTestimonialIndex((prev) => (prev + 1) % reviews.length)}
                      className="w-10 h-10 border border-beige hover:border-maroon-900 bg-cream text-charcoal hover:text-maroon-900 rounded-full flex items-center justify-center hover:scale-105 transition-all"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 10: PHOTO GALLERY INTEGRATED IN PAGE */}
              <section id="gallery-preview" className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">visual perfection</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-1">Mittho Sweets Showcase</h2>
                  </div>
                  <button
                    onClick={() => { setCurrentView('gallery'); window.scrollTo({ top: 0 }); }}
                    className="text-xs uppercase tracking-wider text-charcoal border-b-2 border-charcoal hover:border-maroon-900 hover:text-maroon-900 pb-0.5 transition-colors font-bold flex items-center gap-1 self-start sm:self-auto"
                  >
                    View grand photo lightbox →
                  </button>
                </div>

                {/* Grid display 4 items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.slice(0, 4).map((gal, idx) => (
                    <div
                      key={gal.id}
                      onClick={() => setLightboxIndex(idx)}
                      className="relative rounded-2xl overflow-hidden aspect-square border border-beige cursor-pointer group shadow-sm"
                    >
                      <img src={gal.image} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-350" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-cream">
                        <span className="text-[9px] bg-gold-600 text-charcoal px-2 py-0.5 rounded font-mono font-bold uppercase self-start mb-2">
                          {gal.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm leading-tight">{gal.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 11: FINAL HIGH URGENCY CALL-TO-ACTION */}
              <section id="final-cta" className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
                <div className="bg-gradient-to-r from-maroon-950 to-maroon-900 text-cream rounded-3xl p-8 md:p-14 border border-gold-600/30 text-center space-y-6 relative overflow-hidden">
                  
                  {/* Subtle golden circle ambient background glows */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-gold-600/20 filter blur-3xl transform -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-maroon-300 filter blur-3xl"></div>
                  </div>

                  <div className="relative space-y-4 max-w-2xl mx-auto z-10">
                    <span className="text-gold-500 font-bold uppercase tracking-widest text-xs md:text-sm block">
                      🚚 FASTEST HOME DELIVERY IN GOJRA
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
                      Ready To Order Fresh Confectionery?
                    </h2>
                    <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                      Sweets, biscuits, and bakery orders made on WhatsApp reach Gojra homes within 30-45 minutes. Pre-book wedding trunk packages or sweet buffet lines now.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                      <a
                        id="final-wa-btn"
                        href={`https://wa.me/${cleanupPhoneNo}?text=Assalam%20o%20Alaikum%20Mittho%20Sweets!%20I%20want%20to%20place%20a%20regular%20order%20from%20Gojra.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3.5 bg-gold-600 hover:bg-gold-700 text-charcoal font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                      >
                        WhatsApp Order
                      </a>
                      
                      <a
                        id="final-call-btn"
                        href={`tel:${cleanupPhoneNo}`}
                        className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold uppercase tracking-widest rounded-xl border border-beige/40 transition-colors"
                      >
                        Call Now: {contactInfo.phone}
                      </a>

                      <button
                        onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0 }); }}
                        className="px-8 py-3.5 bg-transparent hover:bg-white/5 border border-white/20 hover:border-gold-600 rounded-xl text-xs font-bold uppercase tracking-widest text-[#FAF6EE] hover:text-gold-500 transition-colors"
                      >
                        Visit Store Outelt
                      </button>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: ABOUT PAGE                        */}
          {/* ======================================= */}
          {currentView === 'about' && (
            <motion.div
              key="about-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-16 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 font-mono text-xs uppercase font-bold tracking-widest">heritage of purity</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">Our Legacy of Sweets & Traditional Baking</h2>
                <div className="h-1 w-20 bg-gold-600 mx-auto mt-4 rounded"></div>
              </div>

              {/* Story division */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <h3 className="text-2xl font-serif text-maroon-950 font-bold">{homepageConfig.aboutHeading}</h3>
                  <div className="space-y-4 text-xs md:text-sm text-stone-700 leading-relaxed font-sans">
                    <p className="whitespace-pre-wrap">
                      {homepageConfig.aboutText}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-beige pt-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-stone-400 mb-1">Our Mission</h4>
                      <p className="text-xs text-[#555] leading-relaxed">
                        To manufacture elite culinary treats that bring bliss to family tables, combining age-old traditions with modern pastry artistry.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-stone-400 mb-1">Our Quality promise</h4>
                      <p className="text-xs text-[#555] leading-relaxed">
                        Zero preservatives, zero synthetic sweet dilutions. Pure Desi Ghee, daily fresh batches, and clean farm-to-table farm milk.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 h-96 rounded-2xl overflow-hidden border border-beige shadow-lg">
                  <img src={bakeryShowcase} alt="Outlet" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Meet the Master Creators */}
              <div className="space-y-8">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-serif text-maroon-950 font-bold">Meet Our Master Sweet Engineers</h3>
                  <p className="text-xs text-stone-500">Combining centuries of family secrets with state of the art dessert craft.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: 'Ustad Abdul Ghafoor', role: 'Head Sweet Carver / Halwai Master', desc: 'Over 28 years mastering dense milk reductions, Persian pistachios, and saffron katli squares.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                    { name: 'Chef Sarah Gilani', role: 'Chief Cake Designer', desc: 'Masters hand-sculpted sugar flowers and luxury Belgian chocolate fudge multi-tier architectural support.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
                    { name: 'Kashif Mittho', role: 'Managing Director & Quality controller', desc: 'Ensures absolute hygienic practices and daily ingredient audits directly from local organic milk collection hubs.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
                  ].map((staff, i) => (
                    <div key={i} className="bg-cream border border-beige rounded-2xl p-4 text-center space-y-3 shadow-sm group">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-gold-600/30 group-hover:scale-105 transition-all">
                        <img src={staff.img} alt={staff.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-serif text-md font-bold text-maroon-950">{staff.name}</h4>
                        <div className="text-[10px] uppercase tracking-wider text-gold-700 font-mono mt-0.5">{staff.role}</div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{staff.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: PRODUCTS PAGE WITH ENGINE FILTERS */}
          {/* ======================================= */}
          {currentView === 'products' && (
            <motion.div
              key="products-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-10 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Heading Banner */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 uppercase font-mono tracking-widest text-xs font-bold">Mittho sweets catalogue</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">Fresh Sweets & Bakery Selections</h2>
                <p className="text-stone-500 text-xs max-w-md mx-auto">Filter by sweet categories, search by item name, and request custom packaging on demand.</p>
              </div>

              {/* Filtering Command Center */}
              <div className="bg-cream p-4 rounded-lg border border-beige space-y-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search query input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sweets, barfis, croissants, cakes..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-cream-dark border-b border-b-stone-300 border-t-0 border-r-0 border-l-0 rounded-none text-[#1b1c1c] focus:outline-none focus:border-b-gold-700 focus:ring-0 transition-all font-sans"
                  />
                </div>

                {/* Sorter Selector */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs font-semibold">
                  <SlidersHorizontal className="w-4 h-4 text-maroon-900" />
                  <span className="text-stone-500 font-mono text-[10px] uppercase">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-cream-dark border border-beige rounded text-xs focus:outline-none focus:ring-1 focus:ring-maroon-900"
                  >
                    <option value="default">Menu Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

              </div>

              {/* Category Filter Pills scroll bar */}
              <div className="flex gap-2 pb-2 overflow-x-auto justify-start sm:justify-center scrollbar-thin">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-none transition-all shrink-0 border ${
                    activeCategory === 'all'
                      ? 'bg-maroon-900 border-maroon-950 text-white shadow-md'
                      : 'bg-cream text-gold-700 border-gold-700/30 hover:border-gold-700 hover:text-gold-800'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-none transition-all shrink-0 border ${
                      activeCategory === cat.id
                        ? 'bg-maroon-900 border-maroon-950 text-white shadow-md'
                        : 'bg-cream text-gold-700 border-gold-700/30 hover:border-gold-700 hover:text-gold-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Products Dynamic Grid view */}
              {getFilteredProducts().length === 0 ? (
                <div className="text-center py-20 bg-cream border border-beige rounded-lg">
                  <ShieldAlert className="w-12 h-12 text-gold-600 block mx-auto mb-2" />
                  <h4 className="font-serif text-lg font-bold text-maroon-950">No matches found</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">Try typing another sweet segment or clear the search query filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredProducts().map((item) => (
                    <div
                      key={item.id}
                      className="group bg-cream rounded-lg overflow-hidden border border-beige shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-stone-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {item.bestseller && (
                          <div className="absolute top-3 left-3 bg-maroon-900 text-[#FFF] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                            Bestseller
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-cream/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded shadow font-mono">
                          ⭐ {item.rating}
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <div className="inline-block border border-gold-700/50 text-gold-700 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-gold-100/10 mb-1.5">
                            {item.category.replace('-', ' ')}
                          </div>
                          <h4 className="font-serif text-lg font-bold text-maroon-950 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                          {item.weightOptions && item.weightOptions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.weightOptions.map((opt) => (
                                <span key={opt} className="px-1.5 py-0.5 bg-maroon-50 border border-maroon-100/30 text-maroon-900 rounded text-[9px] font-bold whitespace-nowrap">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-beige pt-4">
                          <div>
                            <span className="text-[9px] text-stone-400 font-mono uppercase">Starting price</span>
                            <div className="text-lg font-serif text-maroon-900 font-bold">Rs. {item.price.toLocaleString()}</div>
                          </div>

                          <div className="flex gap-1.5">
                            {/* Eye trigger quick detailed modal */}
                            <button
                              onClick={() => setSelectedProduct(item)}
                              className="p-2 border border-beige hover:border-maroon-900 text-stone-700 hover:text-maroon-900 rounded bg-cream shadow-sm"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => triggerDirectWhatsAppCheckout(item)}
                              className="px-4 py-2 bg-maroon-900 hover:bg-maroon-950 text-white text-xs font-semibold rounded flex items-center gap-1 shadow cursor-pointer"
                            >
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: CUSTOM CAKES PAGE WORKSPACE       */}
          {/* ======================================= */}
          {currentView === 'custom-cakes' && (
            <motion.div
              key="custom-cakes-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-16 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 font-mono text-xs uppercase font-bold tracking-widest">Custom bakery design</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">Custom Themed Cake Inquiries</h2>
                <p className="text-stone-500 text-xs max-w-md mx-auto">Order bespoke structural fondant crafts for birthdays and weddings. Select flavors and tiers dynamically.</p>
              </div>

              {/* Master Form Workspace */}
              <CakeInquiryForm 
                onAddInquiry={handleAddInquiry} 
                contactPhone={contactInfo.whatsapp} 
              />

              {/* Cake Portfolio Gallery Showcase */}
              <div className="space-y-6">
                <div className="text-center border-t border-beige pt-12">
                  <h3 className="text-2xl font-serif text-maroon-950 font-bold">Visual Designer Inspiration</h3>
                  <p className="text-xs text-stone-500">A showcase of bespoke gourmet wedding and character cakes designed for Gojra events.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.filter(g => g.category === 'cakes').map((gal, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-square border border-beige group relative shadow-inner">
                      <img src={gal.image} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center text-cream">
                        <span className="font-serif text-sm font-bold">{gal.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: CATERING SERVICES & MENU ESTIMATE */}
          {/* ======================================= */}
          {currentView === 'catering' && (
            <motion.div
              key="catering-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-16 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 font-mono text-xs uppercase font-bold tracking-widest">Royal catering planner</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">Sweets Catering & Wedding Buffet Stalls</h2>
                <p className="text-stone-500 text-xs max-w-md mx-auto">Configure your wedding, mehndi, and corporate dessert spreads with our modern, responsive estimator pricing slider.</p>
              </div>

              {/* Estimator module */}
              <CateringEstimator 
                packages={INITIAL_CATERING_PACKAGES} 
                onAddInquiry={handleAddInquiry} 
                contactPhone={contactInfo.whatsapp} 
              />

              {/* FAQs segment */}
              <div className="space-y-6">
                <div className="text-center border-t border-beige pt-12">
                  <h3 className="text-2xl font-serif text-maroon-950 font-bold">Frequently Consulted Questions</h3>
                  <p className="text-xs text-stone-500">Transparent guidelines on orders, ingredients, and delivery across Gojra City.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="p-4 bg-cream border border-beige rounded-xl shadow-inner">
                      <h4 className="font-serif text-base text-maroon-900 font-bold flex items-start gap-2">
                        <HelpCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed pl-7 mt-1.5">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: MASONRY LIGHTBOX GALLERY PAGE     */}
          {/* ======================================= */}
          {currentView === 'gallery' && (
            <motion.div
              key="gallery-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-10 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 font-mono text-xs uppercase font-bold tracking-widest">Visual Portfolio Grid</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">The Mittho Sweets Showcase</h2>
                <div className="h-1 w-20 bg-gold-600 mx-auto mt-4 rounded"></div>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 pb-2 overflow-x-auto justify-start sm:justify-center scrollbar-thin">
                {['all', 'cakes', 'mithai', 'bakery', 'events', 'store', 'packaging'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategoryFilter(cat)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all shrink-0 capitalize ${
                      galleryCategoryFilter === cat
                        ? 'bg-maroon-900 text-[#FFF] shadow'
                        : 'bg-cream-dark text-stone-700 border border-beige/65 hover:border-beige-dark'
                    }`}
                  >
                    {cat === 'all' ? 'All Visuals' : cat}
                  </button>
                ))}
              </div>

              {/* Dynamic Masonry-like grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getFilteredGalleryItems().map((gal, idx) => (
                  <div
                    key={gal.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="relative rounded-2xl overflow-hidden aspect-square border border-beige group cursor-pointer shadow-sm"
                  >
                    <img src={gal.image} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-cream">
                      <span className="text-[9px] bg-gold-600 text-charcoal px-2 py-0.5 rounded font-mono font-bold uppercase self-start mb-1 ">
                        {gal.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm leading-tight">{gal.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: SECURE CONTACT & DIRECTIONS PAGE  */}
          {/* ======================================= */}
          {currentView === 'contact' && (
            <motion.div
              key="contact-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-12 max-w-7xl mx-auto px-4 md:px-8 py-10"
            >
              {/* Back to Home Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-maroon-900 border border-maroon-900/20 hover:border-maroon-950 bg-cream/85 hover:bg-maroon-900 hover:text-white rounded-full transition-all cursor-pointer shadow-sm select-none uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Home Page</span>
                </button>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <span className="text-gold-700 font-mono text-xs uppercase font-bold tracking-widest">Connect with us</span>
                <h2 className="text-4xl font-serif text-maroon-950 font-bold">Visit Gojra Outlet or Speak to Us</h2>
                <p className="text-stone-500 text-xs max-w-md mx-auto">Get directions, active response timelines, and submit wholesale queries.</p>
              </div>

              {/* Info & Form Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left side details card */}
                <div className="lg:col-span-5 bg-maroon-950 rounded-2xl p-6 text-cream flex flex-col justify-between shadow-lg">
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl tracking-wide uppercase text-gold-500">Contact Channels</h3>
                    
                    <ul className="space-y-4 text-xs">
                      <li className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-white">Our Address</p>
                          <p className="text-stone-300 mt-1">{contactInfo.address}</p>
                        </div>
                      </li>

                      <li className="flex gap-3">
                        <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-white">Call Hotline</p>
                          <a href={`tel:${cleanupPhoneNo}`} className="text-stone-300 hover:text-white mt-1 block">{contactInfo.phone}</a>
                        </div>
                      </li>

                      <li className="flex gap-3">
                        <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-white">Email Inquiries</p>
                          <a href={`mailto:${contactInfo.email}`} className="text-stone-300 hover:text-white mt-1 block font-mono">{contactInfo.email}</a>
                        </div>
                      </li>

                      <li className="flex gap-3">
                        <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-white">Operating Timings</p>
                          <p className="text-stone-300 mt-1">Weekdays & Sat: {contactInfo.workingHours.weekdays}</p>
                          <p className="text-stone-300">Sundays: {contactInfo.workingHours.sunday}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6 text-[11px] text-stone-400 font-mono">
                    📌 Near Ghallah Mandi Sweet and Bakeries, Gojra, Punjab.
                  </div>
                </div>

                {/* Right side interactive feedback Form */}
                <div className="lg:col-span-7 bg-cream border border-beige rounded-2xl p-6 shadow-sm">
                  {contactSubmitStatus ? (
                    <div className="text-center py-10 space-y-3 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-maroon-100 text-maroon-900 flex items-center justify-center mx-auto text-xl font-bold font-mono">✓</div>
                      <h4 className="font-serif text-xl font-bold text-maroon-950">Thank you for writing!</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">Your details are persisted in our system registry, and our customer support line is reviewing comments.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <h3 className="font-serif text-lg text-maroon-950 font-bold mb-4">Send General wholesale Inquiries</h3>
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1" htmlFor="con-name">Full Name *</label>
                        <input
                          id="con-name"
                          required
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Tariq Chaudhry"
                          className="w-full text-xs px-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 focus:border-maroon-900 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1" htmlFor="con-wa">Active WhatsApp phone *</label>
                          <input
                            id="con-wa"
                            required
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="e.g. 03001234567"
                            className="w-full text-xs px-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 focus:border-maroon-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1" htmlFor="con-mail">Active Email address</label>
                          <input
                            id="con-mail"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="e.g. tariq@email.com"
                            className="w-full text-xs px-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1" htmlFor="con-msg">Wholesale / Franchise message *</label>
                        <textarea
                          id="con-msg"
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Describe bulk order counts, budget targets, or event specifications..."
                          className="w-full text-xs px-3 py-2.5 bg-cream-dark border border-beige rounded-xl focus:outline-none focus:ring-1 focus:ring-maroon-900 focus:border-maroon-900 font-sans resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-maroon-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-maroon-950 transition-colors shadow cursor-pointer text-center"
                      >
                        Submit Contact request
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* Large map display */}
              <div className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="h-80">
                  <iframe
                    src={contactInfo.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Mittho Sweets Gojra Google business store Outlet map"
                  ></iframe>
                </div>
                {contactInfo.googleMapsUrl && (
                  <div className="bg-cream-dark/30 border-t border-beige px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-stone-700 text-xs">
                      <span className="text-maroon-900 font-bold">📍 Outlet:</span>
                      <span className="font-medium">Main Bazar Road, near Ghallah Mandi, Gojra, Pakistan</span>
                    </div>
                    <a
                      href={contactInfo.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-maroon-900 text-[#FCF9F3] hover:text-white font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-maroon-950 transition-all shadow hover:shadow-md cursor-pointer flex items-center gap-1.5 select-none"
                    >
                      <span>🗺️ Open In Google Maps</span>
                      <span className="text-xs">→</span>
                    </a>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* ======================================= */}
          {/* VIEW: OWNER DATABASE MANAGEMENT PANEL   */}
          {/* ======================================= */}
          {currentView === 'admin' && (
            <AdminPanel
              products={products}
              setProducts={setProducts}
              categories={categories}
              setCategories={setCategories}
              reviews={reviews}
              setReviews={setReviews}
              gallery={gallery}
              setGallery={setGallery}
              inquiries={inquiries}
              setInquiries={setInquiries}
              offers={offers}
              setOffers={setOffers}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              onClose={() => { setCurrentView('home'); window.scrollTo({ top: 0 }); }}
            />
          )}

        </AnimatePresence>
      </div>

      {/* Floating Utilities */}
      {currentView !== 'admin' && (
        <div id="sticky-floating-triggers" className="fixed bottom-6 right-6 z-30 flex flex-col gap-2 animate-fade-in">
          
          {/* WhatsApp Float */}
          <a
            id="float-whatsapp-anchor"
            href={`https://wa.me/${cleanupPhoneNo}?text=Assalam%20o%20Alaikum%20Mittho%20Sweets!%20I%20want%20to%20place%20an%20order.`}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 border-2 border-white/20"
            title="Sweets Chat Order"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.515 2.266 2.27 3.51 5.284 3.508 8.492-.005 6.66-5.343 11.997-11.956 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.455 4.8 1.457 5.4 0 9.8-4.4 9.8-9.8.0-2.6-1-5-2.8-6.9-1.8-1.9-4.3-2.9-6.9-2.94-5.4 0-9.8 4.4-9.8 9.8.0 2 .5 3.9 1.5 5.6l-.97 3.55 3.7-.97zm11.36-5.46c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-1-.9-1.63-2-1.83-2.35-.1-.35-.02-.54.15-.69.15-.13.3-.3.45-.45.1-.15.2-.25.3-.45.1-.2.05-.35-.02-.5-.1-.15-.67-1.62-.9-2.18-.2-.55-.42-.47-.57-.47h-.5c-.17.0-.45.07-.68.3-.23.27-.88.87-.88 2.12s.9 2.45 1.03 2.62c.13.17 1.78 2.73 4.3 3.8.6.25 1.07.41 1.44.53.6.2 1.15.17 1.58.1.48-.07 1.48-.6 1.7-.18.2.57.2.7.3.15.1-.1.3-.2" />
            </svg>
          </a>

          {/* Hotline Call Float */}
          <a
            id="float-phone-anchor"
            href={`tel:${cleanupPhoneNo}`}
            className="w-12 h-12 rounded-full bg-maroon-900 hover:bg-maroon-950 text-gold-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 border-2 border-white/20"
            title="Call Outlet Helpline"
          >
            <Phone className="w-5 h-5 fill-current" />
          </a>

        </div>
      )}

      {/* Complete visual footer segments */}
      {currentView !== 'admin' && (
        <Footer 
          currentView={currentView} 
          onSetView={setCurrentView} 
          contactInfo={contactInfo} 
        />
      )}

      {/* --- FLOATING LIGHTBOX IMAGE POPUP (Visual Gallery Zoom) --- */}
      {lightboxIndex !== null && (
        <div 
          id="visual-masonry-lightbox" 
          className="fixed inset-0 bg-charcoal/95 backdrop-blur-md z-50 flex flex-col items-center justify-between p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox upper control bar */}
          <div className="w-full flex items-center justify-between text-cream border-b border-white/10 pb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-500">
               Photo {lightboxIndex + 1} of {getFilteredGalleryItems().length}
            </span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-1 text-cream hover:text-gold-500"
            >
              ✕ Close Zoom
            </button>
          </div>

          {/* Lightbox content visual space */}
          <div className="flex-1 w-full flex items-center justify-between gap-4 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
            {/* Prev Image */}
            <button
              onClick={() => setLightboxIndex((prev) => prev !== null ? (prev - 1 + getFilteredGalleryItems().length) % getFilteredGalleryItems().length : null)}
              className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              ←
            </button>

            <div className="flex-grow flex flex-col items-center justify-center max-h-[75vh]">
              <img
                src={getFilteredGalleryItems()[lightboxIndex]?.image}
                alt={getFilteredGalleryItems()[lightboxIndex]?.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />
              <h4 className="text-white font-serif mt-4 text-center text-lg uppercase font-bold">
                {getFilteredGalleryItems()[lightboxIndex]?.title}
              </h4>
              <p className="text-xs text-gold-600 uppercase tracking-wider font-mono mt-0.5">
                {getFilteredGalleryItems()[lightboxIndex]?.category}
              </p>
            </div>

            {/* Next Image */}
            <button
              onClick={() => setLightboxIndex((prev) => prev !== null ? (prev + 1) % getFilteredGalleryItems().length : null)}
              className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            >
              →
            </button>
          </div>

          <div className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
            Click outside the picture to return to showcase list
          </div>
        </div>
      )}

      {/* --- PRODUCT DETAIL MODAL OVERLAY --- */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setDirectCheckoutMode(false);
          }}
          contactPhone={contactInfo.whatsapp}
          relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)}
          onSelectProduct={setSelectedProduct}
          initialCheckout={directCheckoutMode}
        />
      )}

    </div>
  );

  // Gallery view helper filter
  function getFilteredGalleryItems() {
    if (galleryCategoryFilter === 'all') return gallery;
    return gallery.filter(g => g.category === galleryCategoryFilter as any);
  }
}
