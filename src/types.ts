/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string; // 'mithai' | 'cakes' | 'bakery' | 'biscuits' | 'gift-boxes' | 'snacks' | 'seasonal'
  description: string;
  price: number; // In PKR or local currency (e.g., Rs.)
  image: string;
  weightOptions: string[];
  ingredients: string[];
  rating: number;
  bestseller: boolean;
  
  // CMS Fields
  slug?: string;
  shortDescription?: string;
  discountPrice?: number;
  sku?: string;
  subCategory?: string;
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  
  // CMS Fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  displayOrder?: number;
  status?: 'active' | 'inactive';
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  role: string;
  date: string;
  image?: string;
  
  // CMS Fields
  status?: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
}

export interface Inquiry {
  id: string;
  type: 'custom-cake' | 'catering' | 'general';
  name: string;
  phone: string;
  email?: string;
  date: string;
  status: 'pending' | 'reviewed' | 'completed';
  details: string; // Dynamic details like size, flavor, package etc.
  timestamp: string;
  
  // CMS Fields
  adminNotes?: string;
  budget?: string;
  cakeType?: string;
  cakeSize?: string;
  referenceImage?: string;
  eventType?: string;
  guests?: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  active: boolean;
  
  // CMS Fields
  image?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive' | 'scheduled';
}

export interface GalleryItem {
  id: string;
  category: 'cakes' | 'mithai' | 'bakery' | 'events' | 'store' | 'packaging' | 'biscuits' | 'gift-boxes';
  title: string;
  image: string;
}

export interface CateringPackage {
  id: string;
  name: string;
  pricePerHead: number;
  minGuests: number;
  items: string[];
  image: string;
  badge?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: {
    weekdays: string;
    sunday: string;
  };
  googleMapsEmbed: string;
  googleMapsUrl?: string;
  facebookUrl: string;
  instagramUrl: string;
  
  // Settings/Brand Assets CMS
  businessName?: string;
  logoUpload?: string;
  faviconUpload?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Content Manager' | 'Editor';
  status: 'active' | 'inactive';
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface HomepageCMSConfig {
  heroHeading: string;
  heroSubheading: string;
  heroButtonText: string;
  heroButtonSecondaryText: string;
  heroImage: string;
  aboutHeading: string;
  aboutText: string;
  aboutImage1: string;
  aboutImage2: string;
  whyChooseHeading: string;
  whyChooseCards: { title: string; desc: string; icon: string }[];
  ctaHeading: string;
  ctaSubheading: string;
  ctaButtonText: string;
}

