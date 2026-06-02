/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Review, GalleryItem, CateringPackage, ContactInfo, Offer } from './types';

// Importing our beautiful, high-resolution custom generated assets matching the user's uploaded pictures
import heartChocolateCake from './assets/images/heart_chocolate_cake_1780341023776.png';
import bakeryShowcase from './assets/images/bakery_showcase_1780341045169.png';
import artisanBreads from './assets/images/artisan_breads_1780341067603.png';
import rainbowBirthdayCake from './assets/images/rainbow_birthday_cake_1780341091049.png';
import sweetheartCupcakes from './assets/images/sweetheart_cupcakes_1780341113694.png';
import fudgeBrownies from './assets/images/fudge_brownies_1780341145632.png';
import whiteWeddingCake from './assets/images/white_wedding_cake_1780341166772.png';
import cremeBruleeTarts from './assets/images/creme_brulee_tarts_1780341186127.png';
import kidsSunCake from './assets/images/kids_sun_cake_1780341210443.png';
import chocolateLavaCake from './assets/images/chocolate_lava_cake_1780341232995.png';
import goldDripCake from './assets/images/gold_drip_cake_1780341265584.png';
import imperialGoldCake from './assets/images/imperial_gold_cake_1780341287111.png';
import redVelvetSlice from './assets/images/red_velvet_slice_1780341306317.png';
import caramelDripCake from './assets/images/caramel_drip_cake_1780341331571.png';
import vanillaBeanCake from './assets/images/vanilla_bean_cake_1780341351747.png';
import strawberryCreamCake from './assets/images/strawberry_cream_cake_1780341373300.png';
import dessertBuffet from './assets/images/dessert_buffet_1780341396019.png';
import luxuryCakeHero from './assets/images/luxury_cake_hero_1780340624611.png';
import traditionalMithai from './assets/images/traditional_mithai_1780373289566.png';
import butterBiscuits from './assets/images/butter_biscuits_1780373310017.png';
import premiumGiftBoxes from './assets/images/premium_gift_boxes_1780373336371.png';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cakes',
    name: 'Celebratory Cakes',
    image: whiteWeddingCake,
    description: 'Luxurious celebratory cakes, designed dynamically for birthdays, weddings, anniversaries, and corporate events.'
  },
  {
    id: 'bakery',
    name: 'Artisan Bakery',
    image: bakeryShowcase,
    description: 'Freshly baked sourdough breads, gourmet tarts, chocolate lava delights, sweet cupcakes, and rich fudge brownies.'
  },
  {
    id: 'catering',
    name: 'Royal Catering',
    image: dessertBuffet,
    description: 'Full-service opulent dessert tables, high-tea sweet platters, and custom gourmet catering for elite weddings and luxury events.'
  },
  {
    id: 'mithai',
    name: 'Traditional Mithai',
    image: traditionalMithai,
    description: 'Authentic gourmet traditional sweets, prepared with absolute pure Desi Ghee and local organic khoya.'
  },
  {
    id: 'biscuits',
    name: 'Cookies & Biscuits',
    image: butterBiscuits,
    description: 'Handmade crisp butter biscuits and almond tea cookies double-baked in wood-fired stone ovens.'
  },
  {
    id: 'gift-boxes',
    name: 'Premium Gift Boxes',
    image: premiumGiftBoxes,
    description: 'Exquisite silk and velvet sweet trunks, packing custom assortment catalogs of happiness for weddings and Eid.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Cakes Category
  {
    id: 'cak-01',
    name: 'Classic White Rose Sovereign Cake',
    category: 'cakes',
    description: 'An elegant multi-tiered white fondant wedding and celebratory cake, beautifully decorated with hand-shaped cascading white edible sugar roses.',
    price: 9500,
    image: luxuryCakeHero,
    weightOptions: ['6 Lbs (3 Kg)', '10 Lbs Royal Cascade'],
    ingredients: ['Royal Fondant Paste', 'Almond Sponge Layers', 'Vanilla Buttercream Swirls', 'Handicrafted Sugar Art Roses'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'cak-02',
    name: 'Heart Chocolate Swirl Cake',
    category: 'cakes',
    description: 'A romantic round dark chocolate mousse cake, styled with a grand intricately piped chocolate heart in the center of the top frosting, surrounded by fine golden sprinkles.',
    price: 3200,
    image: heartChocolateCake,
    weightOptions: ['2 Lbs (1 Kg)', '4 Lbs (2 Kg)'],
    ingredients: ['Premium Cocoa Butter', 'Belgian Chocolate Ganache', 'Edible Gold Sprinkles', 'Chantilly Cream'],
    rating: 4.9,
    bestseller: true
  },
  {
    id: 'cak-03',
    name: 'Royal Ivory Pearl Wedding Cake',
    category: 'cakes',
    description: 'Majestic four-tiered designer wedding cake encrusted with edible pearl beads, delicate lace embroideries, and surrounding strawberry and macaron display trays.',
    price: 18500,
    image: whiteWeddingCake,
    weightOptions: ['12 Lbs Royal Tier', '20 Lbs Grand Banquet Tier'],
    ingredients: ['Italian Ivory Fondant', 'Madagascan Vanilla Sponge', 'Saffron Buttercream', 'Hand-stitched Pearl Swirls'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'cak-04',
    name: 'Celebration Rainbow Candle Cake',
    category: 'cakes',
    description: 'A joyful celebration and birthday cake featuring elegant white whipped cream, a colorful sugar sprinkle coat around the base, topped with dark chocolate curls and birthday candles.',
    price: 2600,
    image: rainbowBirthdayCake,
    weightOptions: ['2 Lbs (1 Kg)', '4 Lbs (2 Kg)'],
    ingredients: ['Fluffy Sponge Cake', 'Whipping Cream', 'Premium Sprinkles', 'Chocolate Flakes'],
    rating: 4.8,
    bestseller: true
  },
  {
    id: 'cak-05',
    name: 'Royal Chocolate Gold Drip Cake',
    category: 'cakes',
    description: 'A grand triple-layered chocolate drip cake drenched in glossy dark chocolate glaze, topped with towering chocolate shards and fine golden edible leaf flakes.',
    price: 4500,
    image: goldDripCake,
    weightOptions: ['3 Lbs (1.5 Kg)', '6 Lbs (3 Kg)'],
    ingredients: ['Dark Chocolate Shards', 'Chocolate Glaze Drip', 'Edible Gold Leaf Flakes', 'Cocoa Butter Sponge'],
    rating: 4.9,
    bestseller: true
  },
  {
    id: 'cak-06',
    name: 'Sunny Days Kids Fondant Cake',
    category: 'cakes',
    description: 'A cheerful custom kids birthday cake decorated with a large smiling fondant sun, pastel chocolate drops, and lovely handcrafted child figurines around the base.',
    price: 5200,
    image: kidsSunCake,
    weightOptions: ['3 Lbs (1.5 Kg)', '5 Lbs (2.5 Kg)'],
    ingredients: ['Fondant Artistry', 'Strawberry Custard Cream', 'Soft Sponge Cake', 'White Chocolate Drops'],
    rating: 4.9,
    bestseller: false
  },
  {
    id: 'cak-07',
    name: 'Imperial Gold-Leaf Ganache Cake',
    category: 'cakes',
    description: 'An luxurious dark chocolate cake dressed in rich velvet smooth chocolate ganache, scattered with shining edible pure gold leaf flakes on a golden platter.',
    price: 3800,
    image: imperialGoldCake,
    weightOptions: ['2 Lbs (1 Kg)', '4 Lbs (2 Kg)'],
    ingredients: ['Imperial Ganache', 'Pure Gold Leaves', 'Belgian Cocoa Mousse', 'Unsalted Buttercream'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'cak-08',
    name: 'Crimson Velvet Dream Slice',
    category: 'cakes',
    description: 'A signature premium slice of deep red velvet sponge, layered and frosted with Madagascan vanilla cream cheese and topped with fine red velvet crumbs.',
    price: 490,
    image: redVelvetSlice,
    weightOptions: ['Single Slice', 'Box of 4 Slices', 'Full 3 Lbs Cake'],
    ingredients: ['Premium Cocoa Cocoa', 'Soft Buttermilk Cream', 'Cream Cheese', 'Vanilla Bean Paste'],
    rating: 4.7,
    bestseller: false
  },
  {
    id: 'cak-09',
    name: 'Golden Caramel Crunch Drip Cake',
    category: 'cakes',
    description: 'A decadent caramel drizzle sponge cake featuring soft peaks of fresh cream, ribbons of slow-cooked liquid golden caramel, and rich crunchy butterscotch crumbs.',
    price: 2800,
    image: caramelDripCake,
    weightOptions: ['2 Lbs (1 Kg)', '4 Lbs (2 Kg)'],
    ingredients: ['Caramel Cream', 'Butterscotch Caramel Drizzle', 'Rich Toffee Cake Sponge', 'Crunchy Crumbs'],
    rating: 4.8,
    bestseller: false
  },
  {
    id: 'cak-10',
    name: 'Madagascan Vanilla Bean Swirl Cake',
    category: 'cakes',
    description: 'A minimalist masterpiece of moist vanilla sponge layers enveloped in beautiful swirls of whipped vanilla bean buttercream and decorated with real whole vanilla pods.',
    price: 2400,
    image: vanillaBeanCake,
    weightOptions: ['2 Lbs (1 Kg)', '4 Lbs (2 Kg)'],
    ingredients: ['Madagascan Vanilla Pods', 'Chiffon Sponge', 'Whipped Egg White Buttercream', 'Sweet Vanilla Sugar'],
    rating: 4.9,
    bestseller: false
  },
  {
    id: 'cak-11',
    name: 'Victoria Strawberry Cream Cake',
    category: 'cakes',
    description: 'A delicate airy vanilla sponge cake layered with premium diplomat chantilly cream and topped with an extraordinary design of ripe, juicy red strawberries with mint.',
    price: 2900,
    image: strawberryCreamCake,
    weightOptions: ['2.5 Lbs (1.2 Kg)', '5 Lbs (2.4 Kg)'],
    ingredients: ['Fresh Organic Strawberries', 'Vanilla Sponge', 'Chantilly Cream', 'Golden Glaze'],
    rating: 4.9,
    bestseller: true
  },

  // Bakery Category
  {
    id: 'bak-01',
    name: 'Warm Chocolate Molten Lava Cake',
    category: 'bakery',
    description: 'Indulgent single-serve warm chocolate cake baked to perfection, sliced open to release an oozing fountain of flowing molten chocolate lava.',
    price: 280,
    image: chocolateLavaCake,
    weightOptions: ['Single Piece', 'Box of 4 Platters', 'Box of 8 Party Pack'],
    ingredients: ['French Dark Chocolate', 'Fresh Farm Butter', 'Cage-free Eggs', 'Unrefined Sugar Dust'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'bak-02',
    name: 'Sweetheart Swirl Pink Cupcakes',
    category: 'bakery',
    description: 'Gourmet moist vanilla cupcakes topped with elegant towering swirls of sweet pink and white vanilla buttercream frosting and fine drops of colorful sugar sprinkles.',
    price: 180,
    image: sweetheartCupcakes,
    weightOptions: ['Single Cupcake', 'Box of 6 Assorted', 'Box of 12 Party Pack'],
    ingredients: ['Moist Vanilla Sponge', 'Buttercream Frosting', 'Rainbow Sprinkles', 'Farm Fresh Butter'],
    rating: 4.9,
    bestseller: true
  },
  {
    id: 'bak-03',
    name: 'Caramelized Creme Brulee Tarts',
    category: 'bakery',
    description: 'Individual sweet pastry tarts filled with rich cooked egg custard cream and baked with a glossy, hard crackled caramelized sugar crust.',
    price: 240,
    image: cremeBruleeTarts,
    weightOptions: ['Single Tart', 'Box of 4', 'Box of 8 Designer Platters'],
    ingredients: ['Buttery Tart Shell', 'Vanilla Custard Cream', 'Caramelized Sugar Top', 'Whipped Cream'],
    rating: 4.8,
    bestseller: true
  },
  {
    id: 'bak-04',
    name: 'Signature Fudge Ganache Brownies',
    category: 'bakery',
    description: 'Extremely dense, chewy dark chocolate fudge brownies stacked on a wooden board and drizzled with warm, glossy dark chocolate ganache.',
    price: 190,
    image: fudgeBrownies,
    weightOptions: ['Single Square Piece', 'Box of 6 Premium Gift Pack', 'Box of 12 Grand Tray'],
    ingredients: ['Cocoa Fudge Biscuit', 'Dark Ganache Drizzle', 'Rich Cream Butter', 'Brown Sugar'],
    rating: 4.7,
    bestseller: false
  },
  {
    id: 'bak-05',
    name: 'Artisanal Sourdough & Crusty Boules',
    category: 'bakery',
    description: 'Traditional slow-fermented crusty sourdough bread boules and classic golden French baguettes baked on wood-fired stones to create an exceptional rustic crumb.',
    price: 480,
    image: artisanBreads,
    weightOptions: ['Standard Sliced Boule', 'Whole French Baguette', 'Assorted Sourdough Basket'],
    ingredients: ['Stoneground Flour', 'Wild Yeast Culture', 'Sea Salt', 'Toasted Sesame seeds'],
    rating: 4.8,
    bestseller: false
  },

  // Mithai Category (using high-quality sweet images)
  {
    id: 'mit-01',
    name: 'Pure Desi Ghee Gulab Jamun',
    category: 'mithai',
    description: 'Gold-fried dumplings of soft cottage cheese (khoya), slow-soaked in aromatic cardamom sugar syrup. Made in 100% pure Desi Ghee.',
    price: 1400,
    image: traditionalMithai,
    weightOptions: ['0.5 Kg', '1 Kg', '2 Kg Assorted Tray'],
    ingredients: ['Pure Cottage Cheese', 'Cardamom', 'Desi Ghee', 'Organic Sugar Syrup', 'Crushed Pistachios'],
    rating: 4.9,
    bestseller: true
  },
  {
    id: 'mit-02',
    name: 'Royal Saffron Kaju Katli',
    category: 'mithai',
    description: 'Melt-in-the-mouth luxury cashew diamonds, decorated with pure silver vark and loaded with fine strands of genuine Kashmiri saffron.',
    price: 2200,
    image: traditionalMithai,
    weightOptions: ['0.5 Kg', '1 Kg'],
    ingredients: ['Premium Cashew Paste', 'Kashmiri Saffron', 'Edible Silver Sheet', 'Refined Sugar'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'mit-03',
    name: 'Premium Khoya Barfi Delight',
    category: 'mithai',
    description: 'Rich, dense, traditional milk cardamoms barfi cooked using slow-simmered organic farm milk (khoya) and draped with real silver leaf layers.',
    price: 1500,
    image: traditionalMithai,
    weightOptions: ['0.5 Kg', '1 Kg', '2 Kg Luxury Tray'],
    ingredients: ['Concentrated Organic Milk', 'Organic Cardamom Pods', 'Lactose Cream', 'Silver Leaves (Vark)'],
    rating: 4.9,
    bestseller: false
  },
  {
    id: 'mit-04',
    name: 'Pistachio Almond Laddu',
    category: 'mithai',
    description: 'Delectable spheres of golden-fried dry fruit semolina bases blended with Desi Ghee and fully loaded with green Persian pistachios and American almonds.',
    price: 1600,
    image: traditionalMithai,
    weightOptions: ['0.5 Kg', '1 Kg'],
    ingredients: ['Dry Roasted Semolina', 'Pure Buffalo Ghee', 'Persian Green Pistachios', 'Toasted Sweet Almonds', 'Organic Cardamom seed powder'],
    rating: 4.8,
    bestseller: false
  },
  {
    id: 'bis-01',
    name: 'Handmade Crispy Butter Biscuits',
    category: 'biscuits',
    description: 'Legendary crispy butter biscuits baked to a gorgeous golden crunch with true local butter. Extremely popular traditional pairing for hot tea sessions across Gojra.',
    price: 380,
    image: butterBiscuits,
    weightOptions: ['0.5 Kg (Standard Box)', '1 Kg (Grand Family Box)'],
    ingredients: ['Pure Unsalted Butter', 'Fine Pastry Flour', 'Raw Sugarcane Powder', 'Madagascan Vanilla essence'],
    rating: 4.9,
    bestseller: true
  },
  {
    id: 'bis-02',
    name: 'Almond Flakes Tea Cookies',
    category: 'biscuits',
    description: 'Crunchy stone-baked herbal tea cookies heavily encrusted with thin slices of sweet golden almonds, perfect for family gatherings.',
    price: 420,
    image: butterBiscuits,
    weightOptions: ['0.5 Kg (Standard Box)', '1 Kg'],
    ingredients: ['Selected Toasted Almond Flakes', 'Whole Milk powder', 'Leaveners', 'Cane Sugar', 'Butter Margarine'],
    rating: 4.8,
    bestseller: false
  },
  {
    id: 'bis-03',
    name: 'Premium Toasted Coconut Macaroons',
    category: 'biscuits',
    description: 'Delicate cookies with a slightly crispy golden coconut exterior and a incredibly moist, sweet coconut kernel interior.',
    price: 450,
    image: butterBiscuits,
    weightOptions: ['0.5 Kg (Box of 16 pieces)', '1 Kg'],
    ingredients: ['Desiccated Premium Coconut Grate', 'Whipped Egg whites', 'Refined Sweet Cane Sugar', 'Pinch of Himalayan Sea Salt'],
    rating: 4.7,
    bestseller: false
  },
  {
    id: 'gif-01',
    name: 'Royal Silk Heritage Gift Trunk',
    category: 'gift-boxes',
    description: 'An elegant velvet-lined luxury heritage trunk packing customizable assortments of our best-selling Desi Ghee traditional sweets, royal nuts, and beautiful premium greeting envelopes.',
    price: 4500,
    image: premiumGiftBoxes,
    weightOptions: ['2.5 Kg Assorted Trunk', '4 Kg Palace Assortment'],
    ingredients: ['Selection of Kaju Katli', 'Selected Gulab Jamuns', 'Handmade Butter Biscuits', 'Assorted Dry Roasted Nuts'],
    rating: 5.0,
    bestseller: true
  },
  {
    id: 'gif-02',
    name: 'Gilded Eid Celebration Sweet Box',
    category: 'gift-boxes',
    description: 'A custom gold-foiled designer cardboard box packed with luxury barfis, saffron kaju katli diamonds, and crispy almond tea biscuits, styled for festivals.',
    price: 2800,
    image: premiumGiftBoxes,
    weightOptions: ['1.5 Kg Regular Box', '3 Kg Special double-layered Box'],
    ingredients: ['Saffron Barfi pieces', 'Pure cashew Kaju Katli', 'Toasted almond biscuits', 'Royal Walnut sweets'],
    rating: 4.9,
    bestseller: false
  },
  {
    id: 'gif-03',
    name: 'Shehnai Wedding Invitation Suite Box',
    category: 'gift-boxes',
    description: 'Bespoke invitation box designed with elegant traditional patterns to distribute delicious sweets along with wedding invitation cards.',
    price: 1800,
    image: premiumGiftBoxes,
    weightOptions: ['1 Kg Invitation Box', '1.5 Kg Premium Invitation Suite'],
    ingredients: ['Melt-in-mouth Kaju Katli', 'Red Velvet Mini bites', 'Gold-leafed Khoya Barfi'],
    rating: 4.9,
    bestseller: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    name: 'Chaudhary Tariq',
    text: 'Highly impressed with their custom designer cakes! The Royal Ivory Pearl Wedding Cake was the center of attention at our daughter\'s reception in Gojra.',
    rating: 5,
    role: 'Local Business Owner (Gojra)',
    date: 'May 15, 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'rev-02',
    name: 'Dr. Fatima Raza',
    text: 'Every week I order their chocolate molten lava cake and standard artisan sourdough boules. The quality of ingredients and beautiful store presentation have raised the bar in our city!',
    rating: 5,
    role: 'Senior Consultant Physician',
    date: 'April 28, 2026',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'rev-03',
    name: 'Kamran Mughal',
    text: 'I bought the Sweetheart Pink cupcakes for my daughter\'s birthday party, and they were beautiful and delicious! Highly recommend Mittho Sweets & Bakers.',
    rating: 5,
    role: 'NFC University Lecturer',
    date: 'May 22, 2026',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    category: 'cakes',
    title: 'Classic White Rose Sovereign Cake',
    image: luxuryCakeHero
  },
  {
    id: 'gal-02',
    category: 'cakes',
    title: 'Royal Ivory Pearl Wedding Cake',
    image: whiteWeddingCake
  },
  {
    id: 'gal-03',
    category: 'bakery',
    title: 'Caramelized Creme Brulee Tarts',
    image: cremeBruleeTarts
  },
  {
    id: 'gal-04',
    category: 'events',
    title: 'Royal Wedding Dessert Catering Buffet',
    image: dessertBuffet
  },
  {
    id: 'gal-05',
    category: 'store',
    title: 'Mittho Confectionery Chandelier Showcase',
    image: bakeryShowcase
  },
  {
    id: 'gal-06',
    category: 'cakes',
    title: 'Royal Chocolate Gold Drip Cake',
    image: goldDripCake
  },
  {
    id: 'gal-07',
    category: 'cakes',
    title: 'Whimsical Sunny Days Kids Birthday Cake',
    image: kidsSunCake
  },
  {
    id: 'gal-08',
    category: 'cakes',
    title: 'Heart Chocolate Swirl Cake',
    image: heartChocolateCake
  },
  {
    id: 'gal-09',
    category: 'bakery',
    title: 'Artisanal Sourdough & Crusty Boules',
    image: artisanBreads
  },
  {
    id: 'gal-10',
    category: 'mithai',
    title: 'Saffron Encrusted Traditional Sweets',
    image: traditionalMithai
  },
  {
    id: 'gal-11',
    category: 'biscuits',
    title: 'Crispy Wood-Fired Almond Tea Biscuits',
    image: butterBiscuits
  },
  {
    id: 'gal-12',
    category: 'gift-boxes',
    title: 'Luxury Silk Wedding Trunk Assortment',
    image: premiumGiftBoxes
  }
];

export const INITIAL_CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'cat-01',
    name: 'Grand Shehnai Sweet Catering Buffet',
    pricePerHead: 480,
    minGuests: 150,
    items: [
      'Royal Wedding Dessert Table Display',
      'Warm Molten Lava Live Counter',
      'Assorted Sweetheart Swirl Cupcakes',
      'Gourmet Creme Brulee Tarts Platters',
      'Kashmiri Pink Tea with Chopped Almonds'
    ],
    image: dessertBuffet,
    badge: 'Popular'
  },
  {
    id: 'cat-02',
    name: 'Mittho Premium Banquet Showcase',
    pricePerHead: 950,
    minGuests: 100,
    items: [
      'Gourmet Fruit & Custard Mini Tarts',
      'Royal Chocolate Gold Drip Cake slicing',
      'Warm Fudge Ganache Brownies live station',
      'Pure Desi Ghee Gulab Jamuns counter',
      'Luxury Fresh Orange Juices & Mocktails'
    ],
    image: bakeryShowcase,
    badge: 'Premium Choice'
  },
  {
    id: 'cat-03',
    name: 'Corporate High-Tea & Sweet Platters',
    pricePerHead: 400,
    minGuests: 50,
    items: [
      'Chantilly Sweet Cupcakes & Brownies',
      'Artisanal Sourdough bread sandwiches board',
      'Caramel Creme Brulee Bite-size Cups',
      'Belgian Dark Chocolate Ganache Truffles',
      'Organic Coffee & Premium Herbal Teas'
    ],
    image: cremeBruleeTarts,
    badge: 'Formal Events'
  }
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  address: 'Main Bazar Road near Ghallah Mandi, Gojra, Punjab, Pakistan',
  phone: '+92 300 4567891',
  whatsapp: '+923004567891',
  email: 'orders@mitthosweets.com',
  workingHours: {
    weekdays: '08:00 AM - 11:00 PM',
    sunday: '08:00 AM - 11:55 PM'
  },
  googleMapsEmbed: 'https://maps.google.com/maps?q=Mittho%20Sweets%20%26%20Bakers%20Main%20Bazar%20Road%20Gojra&t=&z=16&ie=UTF8&iwloc=&output=embed',
  googleMapsUrl: 'https://maps.app.goo.gl/XYQn5zyxBbTW4h389',
  facebookUrl: 'https://facebook.com/mitthosweets.gojra',
  instagramUrl: 'https://instagram.com/mitthosweets.gojra'
};

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-01',
    title: 'Eid-ul-Adha Special Gift Hamper Pre-Booking',
    description: 'Book your Royal Trunks 5 days early and get a flat 15% discount on bulk custom packaging.',
    code: 'EIDPRE15',
    discount: '15% OFF',
    active: true
  },
  {
    id: 'off-02',
    title: 'First Custom Cake Order Delight',
    description: 'Order your customized wedding or birthday cake today and get free delivery and 6 complementary mini cupcakes!',
    code: 'CAKESTART',
    discount: 'Free Cupcakes',
    active: true
  }
];

export const FAQS = [
  {
    question: 'How do I place an order online for Mittho Sweets & Bakers?',
    answer: 'Simply browse our product catalog, select your weight/size options, and click "Order via WhatsApp". The website will draft a beautiful order template and launch your WhatsApp instantly, facilitating hassle-free home delivery.'
  },
  {
    question: 'Do you offer home delivery in Gojra and adjacent towns?',
    answer: 'Yes! We deliver sweets, custom themed cakes, and bakery platters across entire Gojra City in 30-60 minutes. For nearby towns or large royal wedding catering orders, we arrange customized transport to secure product freshness.'
  },
  {
    question: 'How long in advance should I book customized designer cakes?',
    answer: 'For small celebration cakes, 24 to 48 hours is adequate. For major multi-layered custom wedding cakes, we recommend booking at least 5 to 7 days early so our head pastry chefs can craft custom sugar roses and secure structural elements.'
  },
  {
    question: 'Are your premium sweets made with authentic pure Desi Ghee?',
    answer: 'Absolutely! Our premium traditional sweets (including our legendary Gulab Jamuns, motichor laddus, and milk barfis) are made on-site daily using 100% pure organic Desi Ghee sourced from trusted local farms.'
  },
  {
    question: 'Can I request customized dessert catering tables for events?',
    answer: 'Yes! We specialize in designing stunning, luxurious sweet tables with tiered cakes, mini tarts, cream puffs, and live dessert counters that absolutely delight wedding guests.'
  }
];
