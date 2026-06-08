/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- FOOTBALL JERSEYS ---
  {
    productId: 'jersey-arg',
    title: 'Argentina 2026 Champion Edition Jersey',
    description: 'The iconic Albiceleste stripe jersey with golden 3-star embroidery celebrating football greatness. Features tailored fit, premium moisture wicking fabrics, and high performance stitching identical to team kits worn on pitch.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/20f23eb7f4df4dd4958601c064ffa0d8_9366/Argentina_26_Home_Jersey_White_JM8396_01_laydown.jpg',
      'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/841749a208934f2ab4a0cfa1a8ae237d_9366/Argentina_26_Home_Jersey_White_JM8396_21_model.jpg',
      'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e10e88e911b47a6ad914e3626ea6b67_9366/Argentina_26_Home_Jersey_White_JM8396_25_model.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Home Stripes', 'Away Blue'],
    rating: 4.9,
    reviewsCount: 342,
    stock: 25,
    specs: {
      fit: 'Athletic Slim Fit',
      fabric: '100% Recycled Polyester Doubleknit',
      care: 'Machine wash cold inside out, do not iron badges'
    },
    country: 'Argentina'
  },
  {
    productId: 'jersey-bra',
    title: 'Brazil Seleção Pride Jersey',
    description: 'Boast the vibrant canary yellow of the most decorated nation in football. Highlighted with dynamic green piping, a classic collar, and specialized breathable knit side panels designed for maximum endurance.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Canary Yellow', 'Deep Royal Blue'],
    rating: 4.8,
    reviewsCount: 198,
    stock: 12,
    specs: {
      fit: 'Standard Athletic Fit',
      fabric: 'AEROREADY 100% Polyester Mesh',
      care: 'Tumble dry low, wash cold with similar colors'
    },
    country: 'Brazil'
  },
  {
    productId: 'jersey-por',
    title: 'Portugal Navigators Legacy Jersey',
    description: 'Stand with the Navigators in a deep amaranth body trimmed with royal gold accents. Features custom heat-applied crest and performance stretch panels inspired by legendary squads.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Amaranth Burgundy', 'Teal Green'],
    rating: 4.9,
    reviewsCount: 288,
    stock: 5, // low stock alert trigger!
    specs: {
      fit: 'Sleek Fit',
      fabric: 'High definition breathable jacquard feel',
      care: 'Do not dry clean, wash delicate'
    },
    country: 'Portugal'
  },
  {
    productId: 'jersey-ger',
    title: 'Germany Eagle Vanguard Jersey',
    description: 'Sleek structural design featuring patriotic fire gradients along the shoulders, reflecting contemporary power paired with structured eagle badge accents.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Classic White', 'Carbon Metallic'],
    rating: 4.7,
    reviewsCount: 145,
    stock: 18,
    specs: {
      fit: 'Standard Fit',
      fabric: 'Interlock weave moisture control',
      care: 'Cool iron if needed, do not bleach'
    },
    country: 'Germany'
  },
  {
    productId: 'jersey-fra',
    title: 'France Tricolore Prestige Jersey',
    description: 'Classically designed royal navy jersey decorated with a prominent golden rooster crest and a tri-color cuff detailing representing Parisian royalty.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Prestige', 'Powder White'],
    rating: 4.8,
    reviewsCount: 172,
    stock: 22,
    specs: {
      fit: 'Dri-Fit Tailored',
      fabric: '100% Recycled Ocean Plastics Polyester',
      care: 'Delicate cycle, wash inside out'
    },
    country: 'France'
  },
  {
    productId: 'jersey-esp',
    title: 'Spain La Roja Solar Jersey',
    description: 'Evoke the passion of La Roja in vibrant cardinal red flanked by bright yellow solar piping. Features standard woven badges and athletic sweat-vaporizing paneling.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4899,
    images: [
      'https://images.unsplash.com/photo-1543326135-c5597ea0a543?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cardinal Red', 'Midnight Teal'],
    rating: 4.6,
    reviewsCount: 109,
    stock: 3, // low stock trigger
    specs: {
      fit: 'Comfort Fit',
      fabric: 'Soft feel premium knit polyester',
      care: 'Hang dry in shade, machine wash 30 C'
    },
    country: 'Spain'
  },
  {
    productId: 'jersey-ita',
    title: 'Italy Retro 1990 Azzurri Jersey',
    description: 'A classic tribute to the 1990 Azzurri squad, featuring custom tricolore knit collars, luxury badge embroidery, and premium sky blue sheen fabric.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1504156806559-37db6f49e595?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Azzurri Sky Blue', 'Alpine White'],
    rating: 4.9,
    reviewsCount: 224,
    stock: 14,
    specs: {
      fit: 'Relaxed Retro Fit',
      fabric: '60% Cotton 40% Premium Polyester Blend',
      care: 'Steam iron with protective barrier, hand wash preferred'
    },
    country: 'Italy'
  },
  {
    productId: 'jersey-ned',
    title: 'Netherlands Oranje Tribute Jersey',
    description: 'The striking orange wave with modern geometric prints. Styled for the modern streetwear-sport hybrid user who commands both style and field speed.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Classic Oranje', 'Royal Black Trim'],
    rating: 4.7,
    reviewsCount: 118,
    stock: 19,
    specs: {
      fit: 'Slim-Fit Aero',
      fabric: '100% Breathable Micro-grid polyester',
      care: 'Wash cold, avoid fabric softeners'
    },
    country: 'Netherlands'
  },
  {
    productId: 'jersey-bel',
    title: 'Belgium Devil\'s Crown Jersey',
    description: 'Styled in luxurious deep burgundy featuring elegant black and gold shoulder decals and official crown-and-crest heat stamps.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4899,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Burgundy Devastation', 'Royal Slate'],
    rating: 4.5,
    reviewsCount: 88,
    stock: 15,
    specs: {
      fit: 'Comfort Fit',
      fabric: 'Medium feel doubleknitted polyester',
      care: 'Wash cold inside out'
    },
    country: 'Belgium'
  },
  {
    productId: 'jersey-cro',
    title: 'Croatia Checkered Pride Jersey',
    description: 'The world-famous red and white checkered pattern, redesigned with abstract pixel gradients on the boundaries. Features ultra-breathable stretch mesh fabric.',
    category: 'jerseys',
    subcategory: 'National Teams',
    price: 4999,
    images: [
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Checkerboard Red/White', 'Storm Away Blue Check'],
    rating: 4.8,
    reviewsCount: 139,
    stock: 9,
    specs: {
      fit: 'Standard Performance Fit',
      fabric: 'Dry-vapor micro-knitted mesh',
      care: 'Do not tumble dry'
    },
    country: 'Croatia'
  },

  // --- OVERSIZED T-SHIRTS ---
  {
    productId: 'tee-shogun',
    title: 'Neon Shogun Cyberpunk Oversized Tee',
    description: 'Featuring a stunning cyberpunk samurai artwork printed with premium high-density puff ink. Specially engineered 280GSM heavy-knit cotton provides the perfect streetwear drop-shoulder hang.',
    category: 'oversized',
    subcategory: 'Anime Collection',
    price: 1899,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'Purple', 'Grey'],
    rating: 4.9,
    reviewsCount: 512,
    stock: 45,
    specs: {
      fit: 'Heavy Drop-Shoulder Oversized',
      fabric: '280GSM 100% French Terry Cotton',
      care: 'Cold wash, tumble dry low, do not iron over prints directly'
    }
  },
  {
    productId: 'tee-shadow',
    title: 'Shadow Script Premium heavy Tee',
    description: 'A minimalist piece styled for clean streetwear outfits. Features custom luxury tonal embroidery on the rear collar, standard crewneck ribbing, and subtle side slit detailing.',
    category: 'oversized',
    subcategory: 'Minimal Collection',
    price: 1499,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Purple', 'Grey'],
    rating: 4.7,
    reviewsCount: 201,
    stock: 35,
    specs: {
      fit: 'Boxy Oversized Drop-Shoulder',
      fabric: '240GSM 100% Combed Cotton',
      care: 'Warm wash with light colors'
    }
  },
  {
    productId: 'tee-osaka',
    title: 'Osaka Retro Graphic Tee',
    description: 'Vintage-themed high dynamic range artwork of Osaka streetwear alleys printed in soft-touch discharge ink. Heavy wash gives a textured vintage vibe.',
    category: 'oversized',
    subcategory: 'Graphic Collection',
    price: 1799,
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Grey', 'Black', 'White'],
    rating: 4.8,
    reviewsCount: 264,
    stock: 4, // low stock alert trigger!
    specs: {
      fit: 'Vintage Street Boxy',
      fabric: '260GSM Washed Heavy Cotton',
      care: 'Wash cold inside out, gentle wash cycle'
    }
  },
  {
    productId: 'tee-veloce',
    title: 'Veloce Hypercar Sport Oversized Tee',
    description: 'Tribute to hypercar race line aerodynamics. Features bold speed-typographic silkscreening across the front and stylized checker lines along the lower hem.',
    category: 'oversized',
    subcategory: 'Sports Collection',
    price: 1699,
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Purple'],
    rating: 4.7,
    reviewsCount: 155,
    stock: 20,
    specs: {
      fit: 'Oversized Streetwear Lift',
      fabric: '250GSM Combed Premium Cotton',
      care: 'Tumble dry low, wash cold'
    }
  },
  {
    productId: 'tee-graffiti',
    title: 'Aura Streetwear Graffiti Tee',
    description: 'Artistic splatter and neon purple tags across a heavy-terry canvas. Perfect for bold night outfits or skater sessions.',
    category: 'oversized',
    subcategory: 'Streetwear Collection',
    price: 1899,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Purple', 'Black', 'White'],
    rating: 4.9,
    reviewsCount: 94,
    stock: 17,
    specs: {
      fit: 'Super Boxy Slouch fit',
      fabric: '280GSM French Cotton loopback',
      care: 'Iron inside-out only, avoid bleach'
    }
  },

  // --- GYM VESTS ---
  {
    productId: 'vest-iron',
    title: 'Iron Thread Raw-Edge Stringer',
    description: 'Specially engineered stringer featuring deep drop armholes, custom racerback curves, and split side seams. Designed to amplify range of motion and highlight shoulder contours during heavy lifting.',
    category: 'vests',
    subcategory: 'Stringers',
    price: 999,
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'Grey', 'White'],
    rating: 4.8,
    reviewsCount: 184,
    stock: 40,
    specs: {
      fit: 'Extreme Drop Racerback',
      fabric: '95% Premium Combed Cotton, 5% Lycra',
      care: 'Avoid washing in high heat, hang dry'
    }
  },
  {
    productId: 'vest-therma',
    title: 'Therma Draft Kinetic Tank',
    description: 'Advanced sports tank top equipped with localized mesh weave breathing dots and reflective flat-lock seams. Perfect heat ventilation for intense cardio and conditioning.',
    category: 'vests',
    subcategory: 'Tank Tops',
    price: 1199,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Purple'],
    rating: 4.6,
    reviewsCount: 122,
    stock: 28,
    specs: {
      fit: 'Standard Gym Fit',
      fabric: '100% VaporWick Kinetic Polyester',
      care: 'Delicate wash, swift quick-dry technology'
    }
  },
  {
    productId: 'vest-aero',
    title: 'AeroFit Elite Performance Vest',
    description: 'Our top-of-the-line gym core vest styled in deep black with hyper-vivid neon purple piping. Offers supportive standard compression through chest while flaring slightly towards bottom waistline.',
    category: 'vests',
    subcategory: 'Performance Vests',
    price: 1299,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Black', 'Purple'],
    rating: 4.9,
    reviewsCount: 310,
    stock: 8, // low stock trigger
    specs: {
      fit: 'Semi-compression Fit',
      fabric: '88% Poly-Nylon Performance Thread, 12% Spandex',
      care: 'Do not use bleach or fabric softeners, machine wash warm'
    }
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    couponId: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usageCount: 124
  },
  {
    couponId: 'coup-rietzz15',
    code: 'RIETZZ15',
    discountType: 'percentage',
    discountValue: 15,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    usageCount: 54
  },
  {
    couponId: 'coup-fifa20',
    code: 'FIFA20',
    discountType: 'fixed',
    discountValue: 500, // 500 INR off flat
    expiryDate: '2027-06-30',
    usageLimit: 250,
    usageCount: 19
  }
];

export const COUNTRY_META = [
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', banner: 'https://i.pinimg.com/736x/db/52/91/db5291e757fdb676a3db9222ceffb0ae.jpg', slogan: 'Home of the Golden Triple Crown' },

  { code: 'BRA', name: 'Brazil', flag: '🇧🇷', banner: 'https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/7f5c/live/d265d420-de30-11ef-ac5a-93e8b29ec95c.jpg', slogan: 'Vibrant Samba Joga Bonito Style' },

  { code: 'POR', name: 'Portugal', flag: '🇵🇹', banner: 'https://assets.khelnow.com/news/uploads/2025/06/ronaldo-gettynGs9KL78bYAAUGo0-1-1200x800.jpeg', slogan: 'Unleash the Navigators Fury' },

  { code: 'GER', name: 'Germany', flag: '🇩🇪', banner: 'https://cdn.vox-cdn.com/thumbor/iM-2CLZzfAIVcXHQhGDeSkal5Ug=/0x0:2763x3389/2420x1613/filters:focal(1270x454:1712x896)/cdn.vox-cdn.com/uploads/chorus_image/image/73668499/2178776699.0.jpg', slogan: 'Engineered for Absolute Victory' },

  { code: 'FRA', name: 'France', flag: '🇫🇷', banner: 'https://cdn.pixabay.com/photo/2022/06/08/10/00/kylian-mbappe-7250181_1280.jpg', slogan: 'Elegance of Parisian Football Royalty' },

  { code: 'ESP', name: 'Spain', flag: '🇪🇸', banner: 'https://statico.sportskeeda.com/editor/2024/07/38fc8-17205738387157-1920.jpg', slogan: 'Passionate Fire of La Roja' },

  { code: 'ITA', name: 'Italy', flag: '🇮🇹', banner: 'https://static.independent.co.uk/2024/05/23/15/newFile-2.jpg', slogan: 'Retro Class of the Azzurri Core' },

  { code: 'NED', name: 'Netherlands', flag: '🇳🇱', banner: 'https://assets.goal.com/images/v3/blt96931d6427f6d12d/Memphis_Depay_Netherlands_2022.jpg', slogan: 'Total Orange Street Hybrid Force' },

  { code: 'BEL', name: 'Belgium', flag: '🇧🇪', banner: 'https://cdn.mos.cms.futurecdn.net/YsPZpEoQFxVvzGuPyuZXYG.jpg', slogan: 'Golden Devils Coronation Glory' },

  { code: 'CRO', name: 'Croatia', flag: '🇭🇷', banner: 'https://e0.365dm.com/23/06/1600x900/skysports-luka-modric-croatia_6187674.jpg?20230614224314', slogan: 'Fiery Grid Checkerboard Pride' }
];

export const CLIENT_REVIEWS = [
  {
    name: 'Rohan Sharma',
    rating: 5,
    comment: 'The oversized anime tee is unbelievable. 280GSM fabric feels extremely heavy and high-end. Purple neon glows look very bright under nightclub UV lights. Easily equivalent to luxury designer streetwear!',
    product: 'Neon Shogun Cyberpunk Oversized Tee',
    verified: true,
    date: '2026-05-18'
  },
  {
    name: 'Vikram Singh',
    rating: 5,
    comment: 'Customized the Argentina Home jersey with RITESH #10. The live jersey preview was exact and the stitch framing is sublime. Highly recommended sportswear brand.',
    product: 'Argentina 2026 Champion Edition Jersey',
    verified: true,
    date: '2026-06-01'
  },
  {
    name: 'Deepika K.',
    rating: 4,
    comment: 'Performance vests are extremely comfortable. Lycra blend behaves nicely on dry cleans and maintains sizing. Stretched raw neck gives great breathing room on overhead shoulder presses.',
    product: 'Iron Thread Raw-Edge Stringer',
    verified: true,
    date: '2026-04-29'
  }
];

export const SIZE_SPECIFICATIONS = {
  jerseys: {
    cols: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
    rows: [
      { size: 'S', chest: '36 - 38', waist: '30 - 32', length: '27.5' },
      { size: 'M', chest: '39 - 41', waist: '33 - 35', length: '28.5' },
      { size: 'L', chest: '42 - 44', waist: '36 - 38', length: '29.5' },
      { size: 'XL', chest: '45 - 47', waist: '39 - 41', length: '30.5' },
      { size: 'XXL', chest: '48 - 50', waist: '42 - 44', length: '31.5' },
      { size: 'XXXL', chest: '51 - 53', waist: '45 - 47', length: '32.5' }
    ]
  },
  oversized: {
    cols: ['Size', 'Chest (in)', 'Shoulder (in)', 'Sleeve (in)', 'Length (in)'],
    rows: [
      { size: 'S', chest: '44', shoulder: '21', sleeve: '9', length: '28' },
      { size: 'M', chest: '46', shoulder: '22', sleeve: '9.5', length: '29' },
      { size: 'L', chest: '48', shoulder: '23', sleeve: '10', length: '30' },
      { size: 'XL', chest: '50', shoulder: '24', sleeve: '10.5', length: '31' },
      { size: 'XXL', chest: '52', shoulder: '25', sleeve: '11', length: '32' },
      { size: 'XXXL', chest: '54', shoulder: '26', sleeve: '11.5', length: '33' }
    ]
  },
  vests: {
    cols: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder Drop (in)'],
    rows: [
      { size: 'S', chest: '34 - 36', length: '26', drop: '8.5' },
      { size: 'M', chest: '37 - 39', length: '27', drop: '9.0' },
      { size: 'L', chest: '40 - 42', length: '28', drop: '9.5' },
      { size: 'XL', chest: '43 - 45', length: '29', drop: '10.0' },
      { size: 'XXL', chest: '46 - 48', length: '30', drop: '10.5' },
      { size: 'XXXL', chest: '49 - 51', length: '31', drop: '11.0' }
    ]
  }
};
