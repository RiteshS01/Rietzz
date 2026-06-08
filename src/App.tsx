/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from "axios";
import emailjs from '@emailjs/browser';

import { 
  ShoppingBag, Heart, Trash2, ArrowRight, Star, Sliders, Play, CheckCircle, Clock, Gift,
  MapPin, Eye, Filter, Sparkles, Shirt, Award, Send, Phone, Mail, HelpCircle, AlertCircle, Truck, Upload
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import SizeGuideModal from './components/SizeGuideModal';
import JerseyCustomizer from './components/JerseyCustomizer';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product, CartItem, ShippingAddress, Customization } from './types';
import { COUNTRY_META, CLIENT_REVIEWS } from './data';
import { motion, AnimatePresence } from 'framer-motion';

function StoreApp() {
  const { 
    currentUser, products, coupons, cart, wishlist, orders, customDesigns, notifications,
    activeCoupon, referralCreditsUsed, addToCart, removeFromCart, updateCartQty, clearCart,
    toggleWishlist, moveWishlistToCart, applyCouponCode, removeAppliedCoupon, useReferralCredits,
    submitCustomDesign, placeOrder, submitProductReview, markNotificationRead, loginWithEmail,
    signUpWithEmail, loginWithGoogle, updateAddress
  } = useStore();

  const loadRazorpay = async () => {
  return await new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

  const [currentTab, setCurrentTab] = useState('home');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const WORLD_CUP_SLIDES = [
    {
      id: 0,
      badge: "🏆 FIFA WORLD CUP 2026 OFFICIAL HOST",
      title: "UNITED FOR 2026 • USA",
      subtitle: "CYBER PRESTIGE",
      description: "Dominant athletic contours featuring vibrant cyber-violet highlights, deep oceanic space tones, and high-definition neon trims. Engineered for elite competitors.",
      image: "https://wallpapercave.com/wp/wp15656076.jpg",
      pillColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      gradientColors: "from-cyan-400 via-teal-200 to-purple-500",
      buttonGrad: "from-cyan-600 to-indigo-600 shadow-cyan-500/15",
      subtleBorder: "border-cyan-500/20",
      tabLink: "football"
    },
    {
      id: 1,
      badge: "⚡ ESTADIO AZTECA LEGACY • MEXICO",
      title: "FEEL THE ELITE PASSION",
      subtitle: "HERITAGE COUTURE",
      description: "Vibrant emerald greens, neon-flecked team plates, and historic Aztec-themed sleeve piping. Dominate the space with explosive cultural style.",
      image: "https://editorial.uefa.com/resources/0294-1c8f62642a4e-5c79d91aa296-1000/fbl-wc2026-eur-draw.jpeg",
      pillColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      gradientColors: "from-emerald-400 via-green-300 to-emerald-500",
      buttonGrad: "from-emerald-600 to-green-600 shadow-emerald-500/15",
      subtleBorder: "border-emerald-500/20",
      tabLink: "football"
    },
    {
      id: 2,
      badge: "❄️ THE COAST-TO-COAST PEAKS • CANADA",
      title: "IGNITE THE WINTER SPIRIT",
      subtitle: "GLACIER THERMALS",
      description: "Crisp snowy-peak whites contrasted against bold scarlet red maple symbols. Engineered to sustain absolute core temperatures on freezing pitch nights.",
      image: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_wc26_away_jerseys_multifed_football_ss26_launch_plp_02_banner_snippet_d_b6793e8295.jpg",
      pillColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      gradientColors: "from-rose-400 via-red-300 to-rose-500",
      buttonGrad: "from-rose-600 to-red-600 shadow-rose-500/15",
      subtleBorder: "border-red-500/20",
      tabLink: "football"
    }
  ];

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<'jerseys' | 'oversized' | 'vests'>('jerseys');

  // --- Active Product Detail state ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailSize, setDetailSize] = useState('M');
  const [detailColor, setDetailColor] = useState('');
  const [detailQty, setDetailQty] = useState(1);
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [customizationActive, setCustomizationActive] = useState(false);
  const [jerseyCustom, setJerseyCustom] = useState<Customization>({ playerName: 'RITESH', playerNumber: '10' });

  // --- Country Selection State ---
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // --- Filter states (Oversized Tees Page) ---
  const [selectedOversizedCategory, setSelectedOversizedCategory] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('Best Selling');

  // --- Checkout Form states ---
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [payMethod, setPayMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [paymentStep, setPaymentStep] = useState<'cart' | 'shipping' | 'success' | 'failure'>('cart');
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<any>(null);

  // --- Custom Design request upload state ---
  const [designType, setDesignType] = useState<'Football Jersey' | 'Oversized Tee' | 'Gym Vest'>('Football Jersey');
  const [designNotes, setDesignNotes] = useState('');
  const [designTemplateUrl, setDesignTemplateUrl] = useState('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800');
  const [designSubmitting, setDesignSubmitting] = useState(false);
  const [designSuccess, setDesignSuccess] = useState(false);

  // --- Authentication panel state ---
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authJoinRef, setAuthJoinRef] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // --- New Review States ---
  const [rateStars, setRateStars] = useState(5);
  const [rateComment, setRateComment] = useState('');

  // --- Coupon Code inputs ---
  const [couponCodeInp, setCouponCodeInp] = useState('');
  const [couponErr, setCouponErr] = useState<string | null>(null);

  // --- Referral tracking codes ---
  const [referCreditInp, setReferCreditInp] = useState(0);

  // Sync default color on product detail load
  useEffect(() => {
    if (selectedProduct) {
      setDetailColor(selectedProduct.colors[0]);
      setDetailImageIdx(0);
      setDetailQty(1);
      setCustomizationActive(selectedProduct.category === 'jerseys');
    }
  }, [selectedProduct]);

  // Set default shipping addresses from profile if logged in
  useEffect(() => {
    if (currentUser && currentUser.address) {
      const sa = currentUser.address;
      setFullName(sa.fullName || '');
      setStreet(sa.street || '');
      setCity(sa.city || '');
      setState(sa.state || '');
      setPostalCode(sa.postalCode || '');
      setPhone(sa.phone || '');
    }
  }, [currentUser]);

  // --- Automated Hero Slideshow Effect ---
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Triggering size chart modals
  const triggerSizeGuide = (category: 'jerseys' | 'oversized' | 'vests') => {
    setSelectedSizeCategory(category);
    setSizeModalOpen(true);
  };

  const handleProductDetailClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const executeAddProductToCart = () => {
    if (!selectedProduct) return;
    const finalCustom = (selectedProduct.category === 'jerseys' && customizationActive) ? jerseyCustom : undefined;
    addToCart(selectedProduct, detailSize, detailColor, detailQty, finalCustom);
    setCartDrawerOpen(true);
    setSelectedProduct(null);
  };

  // Handle Coupon Apply triggers
  const executeApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponErr(null);
    const err = applyCouponCode(couponCodeInp);
    if (err) {
      setCouponErr(err);
    } else {
      setCouponCodeInp('');
    }
  };

  // Submit Brand Contact form
  const [contactSuccess, setContactSuccess] = useState(false);
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Submit Bespoke Design orders
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDesignSubmitting(true);
    await submitCustomDesign(designType, designNotes, designTemplateUrl);
    setDesignSubmitting(false);
    setDesignSuccess(true);
    setDesignNotes('');
    setTimeout(() => setDesignSuccess(false), 6000);
  };

  // Review Submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    await submitProductReview(selectedProduct.productId, rateStars, rateComment);
    setRateComment('');
    setRateStars(5);
  };

  // Auth Submit handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await loginWithEmail(authEmail, authPassword);
      } else {
        await signUpWithEmail(authEmail, authPassword, authName, authJoinRef);
      }
    } catch (err: any) {
      setAuthError(err.message || "Credential matching failed.");
    }
  };

  // Checkout order placement
  const executePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !state || !postalCode || !phone) {
      alert("Please complete the shipping address before submitting.");
      return;
    }

    const shippingInfo: ShippingAddress = {
  fullName, street, city, state, postalCode, phone
};

updateAddress(shippingInfo);
const amount = cart.reduce(
  (acc, item) => acc + item.product.price * item.quantity,
  0
);

if (payMethod === 'razorpay') {
  const loaded = await loadRazorpay();
  const orderData = await axios.post(
  "https://rietzz-api.onrender.com/create-order",
  {
    amount,
  }
);

const order = orderData.data;
const options = {
  key: "rzp_live_Sz03abwiJcXs5I",
  amount: order.amount,
  currency: order.currency,
  name: "RIETZZ",
  description: "Sportswear Purchase",
  order_id: order.id,

  handler: async function (response: any) {
  alert("Payment Successful");
  

  const placed = await placeOrder(shippingInfo, payMethod);

  try {
  console.log("EMAILJS STARTED");

  const result = await emailjs.send(
    "service_c2g1joe",
    "template_9mieh3a",
    {
      name: fullName,
      email: authEmail,
      order_id: Math.floor(Math.random() * 100000),
      amount: amount,
      phone: phone,
    },
    "gGoUkEObkX3j-6IgD"
  );

  console.log("EMAIL SENT", result);
  await emailjs.send(
  "service_c2g1joe",
  "template_gaosxdq",
  {
    customer_name: fullName,
    customer_email: authEmail,
    phone: phone,
    order_id: placed.orderId,
    amount: placed.total,
    payment_method: "Razorpay",
    payment_status: "PAID",
    address: street,
    city: city,
    state: state,
    postal_code: postalCode,
    time: new Date().toLocaleString()
  },
  "gGoUkEObkX3j-6IgD"
);

console.log("ADMIN EMAIL SENT");
} catch (err) {
  console.error("EMAIL FAILED", err);
}

  setLatestPlacedOrder(placed);
  setPaymentStep('success');
},

  theme: {
    color: "#a855f7",
  },
};
const paymentObject = new (window as any).Razorpay(options);
paymentObject.open();

return;
}

// ===== COD SECTION =====

const placed = await placeOrder(shippingInfo, payMethod);

try {
  console.log("COD EMAIL STARTED");

  await emailjs.send(
    "service_c2g1joe",
    "template_9mieh3a",
    {
      name: fullName,
      customer_name: fullName,
      email: authEmail,
      order_id: placed.orderId,
      amount: placed.total,
      phone: phone,
    },
    "gGoUkEObkX3j-6IgD"
  );

  console.log("COD EMAIL SENT");
  await emailjs.send(
  "service_c2g1joe",
  "template_gaosxdq",
  {
    customer_name: fullName,
    customer_email: authEmail,
    phone: phone,
    order_id: placed.orderId,
    amount: placed.total,
    payment_method: "Cash On Delivery",
    payment_status: "PENDING",
    address: street,
    city: city,
    state: state,
    postal_code: postalCode,
    time: new Date().toLocaleString()
  },
  "gGoUkEObkX3j-6IgD"
);

console.log("ADMIN EMAIL SENT");
} catch (err) {
  console.error("COD EMAIL FAILED", err);
}

setLatestPlacedOrder(placed);
setPaymentStep('success');
};


return (
    <div id="rietzz-application-box" className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-300">
      
      {/* Platform Navigation */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab); 
          setSelectedProduct(null);
          setSelectedCountry(null);
        }} 
        openCartDrawer={() => setCartDrawerOpen(true)} 
      />

      {/* Main app display frame */}
      <main id="applet-viewport-main" className="flex-1">

        {/* --- DYNAMIC PRODUCT OVERLAY (PRODUCT DETAIL VIEW) --- */}
        {selectedProduct && (
          <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Back indicator button */}
            <button
              id="back-to-catalog-btn"
              onClick={() => setSelectedProduct(null)}
              className="mb-8 font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-purple-400 flex items-center gap-1.5 transition-colors"
            >
              ← Back to collections
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Product Gallery Section */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative w-full aspect-square bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedProduct.images[detailImageIdx] || selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {selectedProduct.stock <= 5 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-[10px] font-mono uppercase tracking-widest font-black px-3 py-1 rounded-full text-white animate-pulse">
                      ONLY {selectedProduct.stock} LEFT
                    </span>
                  )}
                </div>

                {/* Grid Multi Images */}
                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setDetailImageIdx(idx)}
                        className={`aspect-square rounded-xl bg-neutral-900 border overflow-hidden ${detailImageIdx === idx ? 'border-purple-500 shadow-md shadow-purple-500/15' : 'border-white/10 hover:border-purple-500/50'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Configuration panel */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  
                  {/* Category badging */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                      Collection / {selectedProduct.category}
                    </span>
                    {selectedProduct.subcategory && (
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-neutral-900 border border-white/5 text-neutral-400 rounded">
                        {selectedProduct.subcategory}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-black tracking-tight text-white uppercase mb-2">
                    {selectedProduct.title}
                  </h1>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {selectedProduct.rating} ({selectedProduct.reviewsCount} verified reviews)
                    </span>
                  </div>

                  {/* Pricing tag */}
                  <div className="mb-6">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">₹{selectedProduct.price}</span>
                    <span className="text-xs text-neutral-500 font-mono ml-2 uppercase">INCLUSIVE OF GST Vouchers</span>
                  </div>

                  <p className="text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Configuration parameters */}
                  <div className="space-y-4 border-t border-white/5 pt-6 mb-6">
                    
                    {/* Size selector */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Select Size:</label>
                        <button
                          onClick={() => triggerSizeGuide(selectedProduct.category)}
                          className="text-[10px] text-purple-400 hover:underline uppercase tracking-wide font-mono"
                        >
                          Size Guide Popup
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setDetailSize(s)}
                            className={`w-12 py-2 text-xs font-mono rounded-xl border text-center transition-all ${detailSize === s ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color pathways */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Select Color Pathway:</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => setDetailColor(c)}
                            className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all ${detailColor === c ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Select Quantity:</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                          className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center transition-all"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-mono font-bold text-white">
                          {detailQty}
                        </span>
                        <button
                          onClick={() => setDetailQty(Math.min(selectedProduct.stock, detailQty + 1))}
                          className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Interactive Player customizer ONLY if jerseys category */}
                {selectedProduct.category === 'jerseys' && (
                  <div className="mb-6 p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Shirt className="w-4 h-4" /> Personalize Kit Custom badges?
                      </label>
                      <input
                        type="checkbox"
                        checked={customizationActive}
                        onChange={(e) => setCustomizationActive(e.target.checked)}
                        className="rounded bg-black border-purple-500 text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    {customizationActive && (
                      <JerseyCustomizer
                        jerseyColor={detailColor || 'Home Stripes'}
                        onCustomizationChange={(res) => setJerseyCustom(res)}
                      />
                    )}
                  </div>
                )}

                {/* Final Actions panels */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={executeAddProductToCart}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {selectedProduct.stock <= 0 ? 'Out of stock' : 'Add To Shopping Cart'}
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.productId)}
                    className={`px-4 py-4 border rounded-xl transition-all ${wishlist.includes(selectedProduct.productId) ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-white/10 hover:border-white/30 text-neutral-400'}`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Technical description details specs table */}
                <div className="mt-8 border-t border-white/5 pt-6">
                  <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">Product specifications:</h4>
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-300">
                    <div className="py-2.5 px-3 bg-neutral-900 rounded-xl">
                      <span className="block text-[8px] text-neutral-500 uppercase">Fabric structure</span>
                      <span className="font-sans text-neutral-200 mt-0.5 block">{selectedProduct.specs.fabric}</span>
                    </div>
                    <div className="py-2.5 px-3 bg-neutral-900 rounded-xl">
                      <span className="block text-[8px] text-neutral-500 uppercase">Apparel fitment</span>
                      <span className="font-sans text-neutral-200 mt-0.5 block">{selectedProduct.specs.fit}</span>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER REVIEWS BOARD SEC */}
                <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
                  <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Submit Product Review:</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3 bg-neutral-900/40 border border-white/5 p-4 rounded-xl">
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(st => (
                        <button key={st} type="button" onClick={() => setRateStars(st)} className={`text-sm ${rateStars >= st ? 'text-amber-400' : 'text-neutral-600'}`}>
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      required
                      placeholder="Write your honest comments about fabrics fit or packaging design."
                      value={rateComment}
                      onChange={(e) => setRateComment(e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs"
                    />
                    <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white font-mono text-xs uppercase tracking-wider rounded-lg font-bold">
                      Add review
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* --- TAB 1: HOME PAGE GRID --- */}
        {currentTab === 'home' && !selectedProduct && (
          <div id="tab-home" className="space-y-10 sm:space-y-16 pb-10">
            
            {/* HERO HERO GLYPH PANEL - AUTOMATED FIFA WORLD CUP 2026 SLIDESHOW */}
            <div id="home-hero-carousel" className="relative w-full h-[580px] overflow-hidden bg-black flex items-center justify-center border-b border-cyan-500/10">
              <AnimatePresence mode="wait">
                {WORLD_CUP_SLIDES.map((slide, idx) => {
                  if (idx !== activeHeroSlide) return null;
                  return (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center"
                    >
                      {/* Background images under slide pan */}
                      <div 
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-70 animate-subtle-pan" 
                        style={{ backgroundImage: `url('${slide.image}')` }}
                      />
                      {/* Overlay gradients for World Cup visual high-tech depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-0" />
                      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-95 z-0" />
                      
                      {/* Overlying content */}
                      <div className="relative text-center max-w-4xl mx-auto px-6 space-y-6 z-10 select-none">
                        <motion.span 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className={`inline-block px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] font-black rounded-full border ${slide.pillColor} shadow-lg shadow-black/40`}
                        >
                          {slide.badge}
                        </motion.span>
                        <motion.h1 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.5 }}
                          className="text-2xl sm:text-5xl md:text-7.5xl font-display tracking-tight font-black uppercase text-white leading-none"
                        >
                          {slide.title.split(" • ")[0]} <br/> 
                          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.gradientColors}`}>
                            {slide.title.split(" • ")[1] || ""}
                          </span>
                        </motion.h1>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed"
                        >
                          {slide.description}
                        </motion.p>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                          className="flex flex-wrap items-center justify-center gap-4 pt-2"
                        >
                          <button
                            onClick={() => setCurrentTab(slide.tabLink)}
                            className={`px-6 py-3.5 bg-gradient-to-r ${slide.buttonGrad} hover:scale-[1.02] active:scale-[0.98] text-white font-mono text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-lg shadow-black/50`}
                          >
                            Explore {slide.subtitle}
                          </button>
                          <button
                            onClick={() => setCurrentTab('custom')}
                            className="px-6 py-3.5 bg-neutral-900/90 border border-white/10 hover:border-cyan-500/50 hover:bg-black text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition-colors"
                          >
                            Customize Design
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Handheld previous and next indicators */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHeroSlide((prev) => (prev - 1 + WORLD_CUP_SLIDES.length) % WORLD_CUP_SLIDES.length);
                }}
                className="absolute left-4 z-20 p-3 rounded-full bg-black/40 border border-white/5 text-white/55 hover:text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-sm shadow-md"
              >
                &larr;
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHeroSlide((prev) => (prev + 1) % WORLD_CUP_SLIDES.length);
                }}
                className="absolute right-4 z-20 p-3 rounded-full bg-black/40 border border-white/5 text-white/55 hover:text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-sm shadow-md"
              >
                &rarr;
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                {WORLD_CUP_SLIDES.map((slide, sIdx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveHeroSlide(sIdx)}
                    className={`h-2 rounded-full transition-all duration-300 ${sIdx === activeHeroSlide ? 'w-10 bg-cyan-400' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                    title={`Slide ${sIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* BRAND STORY & HERITAGE SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold border-l-2 border-cyan-500 pl-2">The World Cup campaign</span>
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase">
                    REDEFINING FOOTBALL <br/>GLORY IN THE STREETS • 2026
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans pb-1">
                    RIETZZ began as an elite performance design lab preparing for the historical 2026 stadium season with a ultimate mission: to construct custom jerseys and high-density gear that exist on the boundaries of stadium performance and bold underground streetwear cultures.
                  </p>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    Every piece is crafted with high-definition knit stitchings, authentic nation crests, custom player numberings, and temperature-controlled comfort mesh suitable for the heat of the USA, Canada, and Mexico arenas.
                  </p>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="https://wallpapercave.com/wp/wp15656076.jpg" alt="World Cup Training Field" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-cyan-950/25 mix-blend-color" />
                </div>
              </div>
            </div>

            {/* FEATURED APPAREL PRODUCTS SHELF */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-8 md:mb-12">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">🥇 2026 World Cup official drops</span>
                <h3 className="text-lg sm:text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-tight">CHAMPIONS STADIUM EXCLUSIVES</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.slice(0, 3).map((item) => (
                  <div
                    key={item.productId}
                    onClick={() => handleProductDetailClick(item)}
                    className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-all duration-300"
                  >
                    <div className="aspect-square bg-black overflow-hidden relative border-b border-white/5">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-[10px] font-mono text-purple-300 font-bold tracking-wider uppercase flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Quick View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3 font-mono">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-purple-400">{item.category}</span>
                        <span className="text-neutral-500">{item.rating} ★</span>
                      </div>
                      <h4 className="font-sans text-sm font-bold text-white truncate uppercase">{item.title}</h4>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-white">₹{item.price}</span>
                        <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 rounded-lg text-neutral-400 transition-colors">
                          GET APPAREL
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEPARATE COLLECTION FOCUS SLABS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Jerseys Slabs */}
              <div className="relative h-96 rounded-2xl overflow-hidden border border-white/5 group shadow-2xl flex flex-col justify-end p-6">
                <div className="absolute inset-0 bg-[url('https://thejerseyarena.in/wp-content/uploads/2025/03/Best-website-to-buy-Football-Jersey-in-india.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="relative z-10 space-y-2 select-none">
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase block">Stadium Core</span>
                  <h4 className="text-lg sm:text-2xl font-sans font-black text-white uppercase leading-none">FOOTBALL JERSEYS</h4>
                  <button onClick={() => setCurrentTab('football')} className="text-xs font-mono uppercase tracking-widest text-white hover:text-purple-400 flex items-center gap-1 leading-loose pt-2">
                    Shop Country collections <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Oversized Slabs */}
              <div className="relative h-96 rounded-2xl overflow-hidden border border-white/5 group shadow-2xl flex flex-col justify-end p-6">
                <div className="absolute inset-0 bg-[url('https://cdn.corenexis.com/files/c/5827828720.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="relative z-10 space-y-2 select-none">
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase block">Drop Shoulder</span>
                  <h4 className="text-lg sm:text-2xl font-sans font-black text-white uppercase leading-none">OVERSIZED STREET TEES</h4>
                  <button onClick={() => setCurrentTab('oversized')} className="text-xs font-mono uppercase tracking-widest text-white hover:text-purple-400 flex items-center gap-1 leading-loose pt-2">
                    Shop Streetwear catalog <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Gym Vests Slabs */}
              <div className="relative h-96 rounded-2xl overflow-hidden border border-white/5 group shadow-2xl flex flex-col justify-end p-6">
                <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/aa/61/8b/aa618b61fb6925fa3ccaf0912ae5f801.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="relative z-10 space-y-2 select-none">
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase block">Kinetic Thread</span>
                  <h4 className="text-lg sm:text-2xl font-sans font-black text-white uppercase leading-none">GYM CORE VESTS</h4>
                  <button onClick={() => setCurrentTab('vests')} className="text-xs font-mono uppercase tracking-widest text-white hover:text-purple-400 flex items-center gap-1 leading-loose pt-2">
                    Shop Conditioning Vests <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* CUSTOM DESIGN BANNER CALLOUT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-purple-950 via-neutral-900 to-black border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl relative z-10">
                  <span className="text-xs font-mono text-purple-400 font-bold tracking-widest uppercase block">Bespoke Apparel Hub</span>
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase leading-tight">
                    HAVE A CUSTOM MOCKUP? <br/>WE PRINT IT ON TAILORED SHAPE
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">
                    Upload your raw graphic files or team logos, specify your parameters, lucky number badges and notes. Our designers process them right onto specialized heavy cotton or kit fabrics.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('custom')}
                  className="px-6 py-4 bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-xl shadow-black h-fit"
                >
                  Order custom design
                </button>
                <div className="absolute -right-16 -top-16 p-36 bg-purple-500/5 rounded-full" />
              </div>
            </div>

            {/* CUSTOMER REVIEWS SHELF */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-8 md:mb-12">
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400">Squad reviews</span>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-sans font-black text-white uppercase">WHAT SPORT ATHLETES SAY</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CLIENT_REVIEWS.map((r, idx) => (
                  <div key={idx} className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed italic">
                        &quot;{r.comment}&quot;
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 font-mono text-xs flex justify-between items-center">
                      <div>
                        <span className="block font-bold text-white uppercase">{r.name}</span>
                        <span className="block text-[8px] text-purple-400 uppercase tracking-wider">{r.product}</span>
                      </div>
                      <span className="text-[9px] text-green-400 uppercase bg-green-500/10 px-2 py-0.5 border border-green-500/20 rounded">
                        VERIFIED ATHLETE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: FOOTBALL JERSEYS PAGE (10 COUNTRIES INDEPENDENT) --- */}
        {currentTab === 'football' && !selectedProduct && (
          <div id="tab-football" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
            
            {/* National Team country kits banner header */}
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] bg-purple-500/10 text-purple-300 font-mono font-bold tracking-[0.2em] px-4 py-1.5 rounded-full border border-purple-500/20 uppercase animate-pulse inline-block">
                FIFA inspired graphics
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-sans font-black text-white uppercase leading-none">
                National kit collections
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 font-sans">
                Explore individual national configurations. Includes country flags, heritage slogans, the official 2026 kit layout, and complete live badge customizers.
              </p>
            </div>

            {/* COUNTRY KIT SHOWCASE SECTOR COLUMN LIST */}
            {!selectedCountry ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COUNTRY_META.map((cm) => {
                  const countryJerseyModels = products.filter(p => p.category === 'jerseys' && p.country === cm.name);
                  
                  return (
                    <div
                      key={cm.code}
                      onClick={() => setSelectedCountry(cm.name)}
                      className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl"
                    >
                      <div className="h-44 overflow-hidden relative border-b border-white/5 bg-black">
                        <img src={cm.banner} alt={cm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <span className="text-3xl select-none">{cm.flag}</span>
                          <div>
                            <span className="block font-sans font-black text-white text-base uppercase leading-none">{cm.name}</span>
                            <span className="block text-[8px] text-purple-400 tracking-wider font-mono uppercase mt-0.5 font-bold">{cm.slogan}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 p-5 flex justify-between items-center font-mono text-xs">
                        <span className="text-neutral-400">Available: {countryJerseyModels.length} Premium kits</span>
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 font-mono text-[10px] uppercase font-black rounded-lg text-neutral-300 transition-colors">
                          Shop collection button
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Country-specific Jerseys Collection Grid view
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-xl font-sans font-black text-white uppercase">
                    {selectedCountry} Squad kits
                  </h3>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-xs font-mono uppercase text-purple-400 hover:underline"
                  >
                    ← All Countries
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {products
                    .filter(p => p.category === 'jerseys' && p.country === selectedCountry)
                    .map(item => (
                      <div
                        key={item.productId}
                        onClick={() => handleProductDetailClick(item)}
                        className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
                      >
                        <div className="aspect-square bg-neutral-950 relative overflow-hidden border-b border-white/5">
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-5 space-y-3 font-mono">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-purple-400">{item.colors[0]}</span>
                            <span className="text-neutral-500">{item.rating} ★</span>
                          </div>
                          <h4 className="font-sans text-sm font-bold text-white truncate uppercase">{item.title}</h4>
                          <p className="text-[10px] text-neutral-400 font-sans line-clamp-2 leading-relaxed">{item.description}</p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-bold text-white">₹{item.price}</span>
                            <span className="text-[10px] bg-purple-600 text-white font-mono uppercase font-black px-3 py-1.5 rounded-lg">
                              Customize kit
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- TAB 3: OVERSIZED STREET TEES CATALOG --- */}
        {currentTab === 'oversized' && !selectedProduct && (
          <div id="tab-oversized" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Header metadata */}
            <div className="border-b border-white/5 pb-4 md:pb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase">
                Oversized Streetwear collection
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Heavy Terrys dropped-shoulders. Engineered using robust combed 240-280GSM cotton pathways built for raw urban vibes.
              </p>
            </div>

            {/* Custom Filters Board Rows */}
            <div id="oversized-filters-row" className="bg-neutral-900/60 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
              
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Anime Collection', 'Minimal Collection', 'Graphic Collection', 'Sports Collection', 'Streetwear Collection'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedOversizedCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border uppercase tracking-wider transition-all duration-150 ${selectedOversizedCategory === cat ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-md shadow-purple-500/10' : 'bg-transparent border-white/5 text-neutral-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat.replace(' Collection', '')}
                  </button>
                ))}
              </div>

              {/* Specific Filter dropdown selectors */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-[10px] uppercase">
                
                {/* Size filters */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 lowercase">size:</span>
                  <select
                    value={selectedSizeFilter}
                    onChange={(e) => setSelectedSizeFilter(e.target.value)}
                    className="bg-black text-[10px] text-neutral-300 py-1.5 px-2 rounded-lg border border-white/10"
                  >
                    <option value="All">All</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </div>

                {/* Color filters */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 lowercase">color:</span>
                  <select
                    value={selectedColorFilter}
                    onChange={(e) => setSelectedColorFilter(e.target.value)}
                    className="bg-black text-[10px] text-neutral-300 py-1.5 px-2 rounded-lg border border-white/10"
                  >
                    <option value="All">All</option>
                    <option value="Black">Black</option>
                    <option value="Purple">Purple</option>
                    <option value="White">White</option>
                    <option value="Grey">Grey</option>
                  </select>
                </div>

                {/* Sorting options */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 lowercase">sorting:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="bg-black text-[10px] text-neutral-300 py-1.5 px-2 rounded-lg border border-white/10"
                  >
                    <option value="Best Selling">Best Selling</option>
                    <option value="Price: Low-High">Price: Low-High</option>
                    <option value="Price: High-Low">Price: High-Low</option>
                    <option value="Newest">Newest</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products
                .filter(p => p.category === 'oversized')
                .filter(p => selectedOversizedCategory === 'All' || p.subcategory === selectedOversizedCategory)
                .filter(p => selectedSizeFilter === 'All' || p.sizes.includes(selectedSizeFilter))
                .filter(p => selectedColorFilter === 'All' || p.colors.includes(selectedColorFilter))
                .sort((a, b) => {
                  if (selectedSort === 'Price: Low-High') return a.price - b.price;
                  if (selectedSort === 'Price: High-Low') return b.price - a.price;
                  if (selectedSort === 'Trending') return b.rating - a.rating;
                  return 0; // default stability
                })
                .map(item => (
                  <div
                    key={item.productId}
                    onClick={() => handleProductDetailClick(item)}
                    className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl"
                  >
                    <div className="aspect-square bg-neutral-950 relative overflow-hidden border-b border-white/5">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 flex gap-1 font-mono text-[9px] uppercase font-bold text-white tracking-widest z-10">
                        {item.stock <= 5 && <span className="bg-red-600 px-2 py-0.5 rounded">LOW STOCK</span>}
                        <span className="bg-purple-600 px-2 py-0.5 rounded">{item.subcategory?.replace(' Collection','')}</span>
                      </div>
                    </div>
                    <div className="p-4 p-5 space-y-2.5 font-mono">
                      <h4 className="font-sans text-xs font-bold text-white truncate uppercase">{item.title}</h4>
                      <div className="flex justify-between items-center text-[10px] text-neutral-400">
                        <span>SIZES: {item.sizes.slice(0, 3).join('/')}...</span>
                        <span className="text-amber-400">{item.rating} ★</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-bold text-white">₹{item.price}</span>
                        <span className="text-[10px] border border-white/10 px-2.5 py-1 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 rounded-lg text-neutral-400 transition-colors">
                          Add To Cart
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* --- TAB 4: GYM VESTS PAGE --- */}
        {currentTab === 'vests' && !selectedProduct && (
          <div id="tab-vests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            <div className="border-b border-white/5 pb-4 md:pb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase animate-pulse">
                Conditioning gym vest catalog
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Lycra stretch pathways. Drop racerbacks and premium mesh panels constructed for elite weight conditioning performance.
              </p>
            </div>

            {/* Sizing indicators trigger box */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-purple-950/20 border border-purple-500/20 p-5 rounded-2xl">
              <div className="p-3 bg-purple-500/10 text-purple-300 rounded-xl">
                <Shirt className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="block text-xs font-mono font-black text-purple-300 uppercase tracking-widest">PRO SPORTS WEAPONS: Stringers and Tanks</span>
                <span className="block text-xs text-neutral-400 font-sans">Compare physical muscle bounds, overhead stretch drops, and double-knit fibers directly using the metrics selector.</span>
              </div>
              <button
                onClick={() => triggerSizeGuide('vests')}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-black uppercase rounded-xl transition-all"
              >
                Inspect Gym Vest Sizing chart
              </button>
            </div>

            {/* Gym Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products
                .filter(p => p.category === 'vests')
                .map(item => (
                  <div
                    key={item.productId}
                    onClick={() => handleProductDetailClick(item)}
                    className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl"
                  >
                    <div className="aspect-square bg-neutral-950 relative overflow-hidden border-b border-white/5">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <span className="absolute top-2.5 right-2.5 bg-neutral-900 text-purple-400 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider font-bold">
                        {item.subcategory}
                      </span>
                    </div>
                    <div className="p-5 space-y-3 font-mono">
                      <h4 className="font-sans text-sm font-bold text-white truncate uppercase">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-sans font-normal">{item.description}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-white">₹{item.price}</span>
                        <span className="text-[10px] border border-white/10 px-2.5 py-1 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 text-neutral-400 rounded-lg transition-colors">
                          Add To Cart
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* --- TAB 5: CUSTOM DESIGN ORDER FORM --- */}
        {currentTab === 'custom' && (
          <div id="tab-custom-design" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="bg-neutral-900 border border-purple-500/20 rounded-3xl p-5 md:p-10 shadow-2xl space-y-6 md:space-y-8">
              
              <div className="text-center space-y-1.5 border-b border-white/5 pb-5 md:pb-6">
                <span className="inline-block px-2.5 py-0.5 bg-purple-500/10 text-purple-300 font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest rounded border border-purple-500/20">
                  Custom creation board
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase">
                  Bespoke ordering gateway
                </h2>
                <p className="text-xs text-neutral-400 max-w-lg mx-auto font-sans leading-relaxed">
                  Submit customized logos, lettering placements, crest prints, and custom measurements. Our sportswear design teams will evaluate models and push approval milestones straight to your dashboard.
                </p>
              </div>

              {/* Success Notification */}
              {designSuccess && (
                <div id="custom-design-alert-success" className="bg-purple-950/20 border border-purple-500/50 rounded-2xl p-4 flex items-center gap-3 text-purple-300 font-mono text-xs animate-pulse">
                  <CheckCircle className="w-5 h-5 text-purple-400 shrink-0" />
                  <span>CUSTOM PROJECT SUBMITTED! VIEW PROPOSALS milestoning activity live inside the user.</span>
                </div>
              )}

              {/* Form details */}
              <form onSubmit={handleCustomSubmit} className="space-y-6">
                
                {/* 1. Choose Product Type mapping */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">1. Choose Product Type base:</label>
                  <div className="grid grid-cols-3 gap-4">
                    {([
                      { id: 'Football Jersey', label: 'Football Jersey' },
                      { id: 'Oversized Tee', label: 'Oversized Tee' },
                      { id: 'Gym Vest', label: 'Gym Vest' }
                    ] as const).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDesignType(item.id)}
                        className={`py-3.5 px-3 border text-xs font-mono uppercase font-black tracking-wider rounded-xl transition-all ${designType === item.id ? 'bg-purple-500/10 border-purple-500 text-purple-300 shadow-md shadow-purple-500/5' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white hover:border-purple-500/45'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Choose Blueprint files */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">2. Select design mockup format or upload:</label>
                  <p className="text-[10px] text-neutral-500 leading-snug">Choose an aesthetic blueprint preset or upload your custom design files directly from your device.</p>
                  
                  {/* Device upload area with drag and drop */}
                  <div
                    id="design-custom-uploader"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files[0]) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target && typeof event.target.result === 'string') {
                            setDesignTemplateUrl(event.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('design-device-file')?.click()}
                    className="border border-dashed border-purple-500/30 hover:border-purple-400 bg-black/60 rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-purple-950/5 group flex flex-col items-center justify-center gap-2"
                  >
                    <input
                      id="design-device-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                          const file = files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target && typeof event.target.result === 'string') {
                              setDesignTemplateUrl(event.target.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-mono font-bold text-white">Drag & drop your custom design image here</span>
                      <span className="block text-[10px] text-neutral-400 mt-1">or <span className="text-purple-400 underline font-mono">browse local files</span> from your device</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800', note: 'Template A: Athletic raw cuts' },
                      { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800', note: 'Template B: Structured crewneck kit' },
                      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', note: 'Template C: Drop-shoulder heavy terry' },
                      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', note: 'Template D: Skate styled graffiti' }
                    ].map((tmp) => (
                      <button
                        type="button"
                        key={tmp.url}
                        onClick={() => setDesignTemplateUrl(tmp.url)}
                        className={`p-3 bg-neutral-950 border rounded-xl flex items-center gap-3 text-left transition-colors ${designTemplateUrl === tmp.url ? 'border-purple-500 text-purple-300 bg-purple-950/10' : 'border-white/5 hover:border-white/15'}`}
                      >
                        <img src={tmp.url} alt="" className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                        <div>
                          <span className="block text-xs font-mono font-bold">{tmp.note}</span>
                          <span className="block text-[9px] text-neutral-500 select-none">Active template layout</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {designTemplateUrl && (
                    <div className="p-3 bg-purple-950/10 border border-purple-500/20 rounded-xl flex items-center gap-3">
                      <img
                        src={designTemplateUrl}
                        alt="Active preview"
                        className="w-12 h-12 object-cover rounded-lg border border-white/10 bg-black"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100/purple/white?text=BluePrint';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-mono text-white font-bold uppercase">Mockup source loaded</span>
                        <p className="text-[10px] text-neutral-400 truncate max-w-xs">{designTemplateUrl.startsWith('data:image') ? 'Base64 image uploaded from device' : designTemplateUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDesignTemplateUrl('')}
                        className="p-1 px-2 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors text-[9px] font-mono uppercase font-bold rounded"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  <div className="pt-2">
                    <input
                      type="text"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                      value={designTemplateUrl}
                      onChange={(e) => setDesignTemplateUrl(e.target.value)}
                      placeholder="Or paste direct Cloudinary URL link"
                    />
                  </div>
                </div>

                {/* 3. Enter custom parameters */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">3. Project instructions notes:</label>
                  <textarea
                    required
                    rows={4}
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="Provide placement coordinates. E.G.: 
- Place team logo centered on chest
- Render large artwork graphic across back
- Embossed player name RITESH number 10."
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={designSubmitting}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-mono text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                    {designSubmitting ? (
                      'Processing file upload...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit custom project
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* --- TAB 6: TRENDING PAGE --- */}
        {currentTab === 'trending' && !selectedProduct && (
          <div id="tab-trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-4 md:pb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase tracking-tight">Active trending list</h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                The most viewed, wishlisted, and best selling RIETZZ sportswear items this week.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products
                .sort((a,b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
                .slice(0, 4)
                .map((item, idx) => (
                  <div
                    key={item.productId}
                    onClick={() => handleProductDetailClick(item)}
                    className="bg-neutral-900 border border-white/5 hover:border-purple-500/20 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl"
                  >
                    <div className="aspect-square bg-neutral-950 relative overflow-hidden border-b border-white/5">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <span className="absolute top-3 left-3 bg-purple-500 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        RANK 0{idx + 1} Best Seller
                      </span>
                    </div>
                    <div className="p-5 space-y-3 font-mono">
                      <h4 className="font-sans text-sm font-bold text-white truncate uppercase">{item.title}</h4>
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span>{item.category}</span>
                        <span className="text-amber-400 font-bold">{item.rating} ★</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-white">₹{item.price}</span>
                        <span className="text-[10px] border border-white/10 px-2.5 py-1 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 rounded-lg text-neutral-400">
                          Configure Apparel
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- TAB 7: SAVED WISHLIST GRID --- */}
        {currentTab === 'wishlist' && !selectedProduct && (
          <div id="tab-wishlist" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase border-b border-white/5 pb-3">
              Saved athlete Wishlist({wishlist.length})
            </h2>

            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-4">
                <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-sans font-bold text-white text-base">YOUR WISHLIST IS COMPLETELY EMPTY</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">Tap star hearts inside product panels to compile list targets.</p>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-6 py-2.5 bg-purple-600 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl"
                >
                  Explore catalogs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-mono text-xs">
                {products
                  .filter(p => wishlist.includes(p.productId))
                  .map(item => (
                    <div key={item.productId} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                      <div className="aspect-square bg-neutral-950 overflow-hidden relative border-b border-white/5">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button 
                          onClick={() => toggleWishlist(item.productId)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-rose-500 border border-rose-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <span className="block font-sans font-bold text-white uppercase text-sm truncate">{item.title}</span>
                          <span className="block text-[10px] text-purple-400 mt-0.5">{item.category}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-base font-bold text-white">₹{item.price}</span>
                          <button
                            onClick={() => {
                              moveWishlistToCart(item.productId, 'M', item.colors[0]);
                              setCartDrawerOpen(true);
                            }}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] uppercase font-bold rounded-lg transition-colors"
                          >
                            Move To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 8: USER PROFILE & ORDERS TRACKING TIMELINE --- */}
        {currentTab === 'profile' && (
          <div id="tab-profile" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            
            {/* Authenticated Account view */}
            {currentUser ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs text-neutral-300">
                
                {/* Credentials Info block */}
                <div className="lg:col-span-4 bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex justify-center flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-purple-950 border border-purple-500/30 flex items-center justify-center text-2xl font-black text-purple-300">
                      {currentUser.name.slice(0,1).toUpperCase()}
                    </div>
                    <div className="text-center">
                      <span className="block font-sans font-black text-white text-base uppercase">{currentUser.name}</span>
                      <span className="block text-[10px] text-neutral-500 mt-0.5 lowercase">{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-6 border-t border-white/5">
                    
                    {/* Security credentials */}
                    <div>
                      <span className="block text-[9px] text-neutral-500 uppercase tracking-wider">Access Clearance level</span>
                      <span className="block font-bold text-white uppercase mt-0.5">{currentUser.role} permissions</span>
                    </div>

                    {/* Affiliate credits referrals */}
                    <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" /> Affiliate Referral
                        </span>
                        <span className="text-white font-bold bg-purple-500/20 px-2 py-0.5 rounded text-[10px]">
                          ₹{currentUser.referralCredits} Credit Bal
                        </span>
                      </div>
                      <span className="block text-[10px] text-neutral-400 leading-normal">Share code to acquire ₹500 credits on referee checkout cycles:</span>
                      <span className="block text-white font-bold tracking-widest text-center py-1.5 bg-black/60 rounded-lg border border-white/10 mt-2 select-all uppercase">
                        {currentUser.referralCode}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Orders History & Milestone Timelines */}
                <div className="lg:col-span-8 bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
                  <h3 className="text-base font-sans font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-5 h-5 text-purple-500" /> Active Sportswear Order History
                  </h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-black/30 rounded-xl text-neutral-500">
                      NO COMPLETED PURSUITS REGISTERED YET
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((ord) => (
                        <div key={ord.orderId} className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
                          
                          {/* Top summaries */}
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-white/5 pb-3 font-mono text-[11px]">
                            <div>
                              <span className="text-neutral-400">ORDER NO: </span>
                              <span className="text-white font-bold">{ord.orderId}</span>
                            </div>
                            <div className="flex gap-4">
                              <span>Total Paid: <strong className="text-purple-400 font-sans">₹{ord.total}</strong></span>
                              <span>Method: <strong className="uppercase">{ord.paymentMethod}</strong></span>
                            </div>
                          </div>

                          {/* Purchased detail lists */}
                          <div className="space-y-2">
                            {ord.products.map((p, idx) => (
                              <div key={idx} className="flex gap-3 items-center text-xs">
                                <img src={p.image} alt="" className="w-10 h-10 object-cover rounded border border-white/5" />
                                <div className="flex-1">
                                  <span className="block font-sans font-bold text-white uppercase">{p.title}</span>
                                  <span className="block text-[10px] text-neutral-500 uppercase">
                                    Size {p.size} • Color {p.color} • x{p.quantity} Unit
                                  </span>
                                  {p.customization && (
                                    <div className="flex flex-col gap-1 mt-0.5">
                                      <span className="block text-[10px] font-mono text-purple-400 font-bold tracking-wider uppercase">
                                        ★ Customized name: &quot;{p.customization.playerName}&quot; #{p.customization.playerNumber}
                                      </span>
                                      {p.customization.customBadgeUrl && (
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-[9px] text-neutral-500 font-mono">Crest Logo:</span>
                                          <img
                                            src={p.customization.customBadgeUrl}
                                            alt="Custom Crest"
                                            className="w-5 h-5 object-contain border border-white/20 bg-black rounded"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* DELHIVERY / SHIPROCKET PROGRESS LOG TRANSIT TIMELINE */}
                          <div className="pt-4 border-t border-white/5">
                            <span className="block text-[10px] uppercase font-bold text-purple-300 tracking-widest pl-1 mb-3 flex items-center gap-1.5">
                              <Truck className="w-4 h-4" /> Shiprocket Tracking status:
                            </span>

                            {/* Tracking graph steps dots */}
                            <div className="grid grid-cols-5 text-center text-[9px] uppercase font-bold relative mb-4">
                              <div className="absolute top-1.5 left-[10%] right-[10%] h-0.5 bg-neutral-800 z-0" />
                              
                              {[
                                { status: 'Pending', label: 'Received' },
                                { status: 'Processing', label: 'Kitted' },
                                { status: 'Shipped', label: 'Dispatched' },
                                { status: 'Out For Delivery', label: 'Local Depot' },
                                { status: 'Delivered', label: 'Competed' }
                              ].map((step, sIdx) => {
                                const orderStates = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered'];
                                const activeIdx = orderStates.indexOf(ord.status);
                                const isPassed = sIdx <= activeIdx;
                                
                                return (
                                  <div key={step.status} className="flex flex-col items-center relative z-10 select-none">
                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 ${isPassed ? 'bg-purple-600 border-purple-500 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-500'}`} />
                                    <span className={`block mt-1 font-mono tracking-wide ${isPassed ? 'text-purple-300' : 'text-neutral-500'}`}>{step.label}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Milestone timeline logs details */}
                            <div className="bg-neutral-950 border border-white/5 p-3 rounded-xl text-[10px] leading-relaxed text-neutral-400 max-w-sm">
                              {ord.trackingTimeline && ord.trackingTimeline.length > 0 ? (
                                <>
                                  <span className="block font-bold text-neutral-200">{ord.trackingTimeline[ord.trackingTimeline.length - 1].title}</span>
                                  <span className="block mt-0.5">{ord.trackingTimeline[ord.trackingTimeline.length - 1].description}</span>
                                  <span className="block text-[8px] text-neutral-500 mt-1 font-mono">{new Date(ord.trackingTimeline[ord.trackingTimeline.length - 1].timestamp).toLocaleTimeString()}</span>
                                </>
                              ) : (
                                <span>No shipment tags configured yet.</span>
                              )}
                            </div>

                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            ) : (
              // Login / Credentials Signup Panel
              <div id="credentials-form-cover" className="max-w-md mx-auto bg-neutral-900 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl relative">
                
                <div className="text-center space-y-1.5 mb-5">
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-300 font-mono font-bold tracking-widest px-2.5 py-0.5 rounded border border-cyan-500/20 uppercase inline-block">
                    RIETZZ Member access
                  </span>
                  <h3 className="text-base sm:text-xl md:text-2xl font-sans font-black text-white uppercase select-none">
                    ATHLETE CREDENTIALS PORTAL
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans">Access personalized orders, save addresses, share referral links and track custom garments.</p>
                </div>



                {authError && (
                  <div className="mb-4 p-3 bg-red-950/20 border border-red-500/30 font-mono text-[10px] text-red-400 rounded-xl leading-normal">
                    ERROR: {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-mono">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-1">Display Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                        placeholder="e.g. Ritesh Sharma"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white lowercase focus:outline-none focus:border-cyan-500"
                      placeholder="athletic@rietzz.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">Secret Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-neutral-400 uppercase tracking-wider mb-0.5">Referral code joined?</label>
                      <span className="block text-[8px] text-neutral-500 uppercase tracking-widest mb-1.5">(Get ₹500 credits immediately)</span>
                      <input
                        type="text"
                        maxLength={15}
                        className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white uppercase font-bold"
                        placeholder="REF-RIETZZ123"
                        value={authJoinRef}
                        onChange={(e) => setAuthJoinRef(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-mono text-[10px] font-black tracking-widest uppercase rounded-xl transition-all shadow-lg"
                  >
                    {authMode === 'login' ? 'Confirm Sign In Account' : 'Verify and Register Champion'}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="flex-shrink mx-4 text-neutral-500 text-[10px]">OR SIMULATE</span>
                    <div className="flex-grow border-t border-white/5" />
                  </div>

                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border border-white/10 text-neutral-300 font-mono text-[10px] uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4 text-purple-400" /> Auto-Access Admin Simulation panel
                  </button>

                  {/* Toggle Mode */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="text-purple-400 hover:underline text-[10px]"
                    >
                      {authMode === 'login' ? "Don't have an account? Sign Up Squad" : "Already registered? Login here"}
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>
        )}

        {/* --- TAB 9: CONTACT PORTAL --- */}
        {currentTab === 'contact' && (
          <div id="tab-contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 font-mono text-xs text-neutral-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              
              <div className="space-y-4 sm:space-y-6">
                <span className="text-purple-400 font-bold uppercase tracking-widest pl-2 border-l-2 border-purple-500 block">SUPPORT DESK</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white uppercase leading-none">RIETZZ CENTRAL OFFICES</h2>
                <p className="text-neutral-400 leading-relaxed font-sans">Our design centers operate globally. For general apparel custom blueprints or wholesale queries, compile contact tickets right here.</p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl text-purple-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-white uppercase">Corporate HQ</span>
                      <span className="block text-neutral-400 mt-0.5">Connaught Place Central, Block E, New Delhi, India</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl text-purple-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-white uppercase">Athletic hotlines</span>
                      <span className="block text-neutral-400 mt-0.5">+91 1800-419-RIETZZ (Free Toll)</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl text-purple-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-white uppercase">Bespoke Inquiries</span>
                      <span className="block text-purple-400 mt-0.5 lowercase">design@rietzz.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Ticket Form */}
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-sans font-bold text-white uppercase">SUBMIT CONTACT TICKET</h3>
                
                {contactSuccess && (
                  <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-purple-300 text-[10px] animate-pulse">
                    TICKET RECEIVED! OUR APPAREL SUPERVISORS WILL REPLY WITHIN 2 HOURS.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">Your Email</label>
                    <input required type="email" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white lowercase" />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">Your Message</label>
                    <textarea required rows={4} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white leading-relaxed font-sans" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-mono uppercase tracking-widest font-black rounded-xl transition-all shadow-md">
                    Submit ticket
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* --- TAB 10: ADMIN DASHBOARD SPECIAL PANEL ACCESS --- */}
        {currentTab === 'admin-dash' && (
          <div id="tab-admin-spec" className="animate-in fade-in duration-300">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* --- SLIDEOUT SIDE SHOPPING CART DRAWER & CHECKOUT MODULE --- */}
      {cartDrawerOpen && (
        <div id="shopping-cart-drawer-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div id="cart-drawer-content" className="w-full max-w-lg bg-neutral-950 border-l border-purple-500/20 h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 text-xs font-mono text-neutral-300">
            
            {/* Header section */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="text-base font-sans font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-purple-500" /> RIETZZ shopping cart
                </h3>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    setCheckoutOpen(false);
                    setPaymentStep('cart');
                  }}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-sans text-xs tracking-wider"
                >
                  X CLOSE
                </button>
              </div>

              {/* Cart checklist or success logs */}
              {paymentStep === 'success' ? (
                // Success Transaction Panel
                <div id="checkout-panel-success" className="space-y-6 py-8 text-center bg-purple-950/20 border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-purple-400 animate-pulse" />
                  </div>
                  <div className="space-y-2">

  <h4 className="text-lg font-sans font-black text-white uppercase tracking-tight">
    {payMethod === 'cod'
      ? 'ORDER PLACED SUCCESSFULLY'
      : 'RAZORPAY PAYMENT SUCCESSFUL'}
  </h4>

  <p className="text-[10px] text-neutral-400 max-w-xs mx-auto font-sans leading-normal">
    {payMethod === 'cod'
      ? 'Cash on Delivery selected. Your order has been placed successfully.'
      : 'UPI & credit paths confirmed. Order record reference generated successfully.'}
  </p>

</div>
                  <div className="py-2.5 px-3 bg-black/50 border border-white/10 rounded-xl inline-block text-[11px]">
                    Reference code: <strong className="text-purple-300">{latestPlacedOrder?.orderId || 'RTZ-SUCCESS'}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setCartDrawerOpen(false);
                      setCheckoutOpen(false);
                      setPaymentStep('cart');
                      setCurrentTab('profile'); // redirect to tracks
                    }}
                    className="w-full py-3 bg-purple-600 text-white uppercase font-black tracking-widest rounded-xl px-4"
                  >
                    Track shipping timeline
                  </button>
                </div>
              ) : paymentStep === 'failure' ? (
                // Failure Payment panel
                <div id="checkout-panel-failure" className="space-y-6 py-8 text-center bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-sans font-black text-white uppercase">Payment Gateway extraction error</h4>
                    <p className="text-[10px] text-neutral-400 max-w-xs mx-auto leading-normal">
                      Security rules failed connection checks, or credential key validations failed.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentStep('cart')}
                    className="w-full py-3 bg-neutral-900 text-white uppercase font-bold tracking-widest rounded-xl border border-white/10"
                  >
                    Return to shopping cart
                  </button>
                </div>
              ) : checkoutOpen ? (
                // Checkout shipping layout form
                <form onSubmit={executePlaceOrder} className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-sans font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Shipping & Billing Address
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">Full Name</label>
                      <input required type="text" placeholder="e.g. Ritesh Sharma" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">Phone Contact Number</label>
                      <input required type="text" placeholder="+91 99999-xxxxx" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">Consignment Street Address</label>
                      <input required type="text" placeholder="House no, CP Block E" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={street} onChange={e => setStreet(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">City</label>
                        <input required type="text" placeholder="New Delhi" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white animate-pulse" value={city} onChange={e => setCity(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">State</label>
                        <input required type="text" placeholder="Delhi" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white" value={state} onChange={e => setState(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-0.5">PIN Code</label>
                        <input required type="text" placeholder="110001" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-mono" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Payment tunnel choices */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-[10px] text-neutral-400 uppercase tracking-widest">Select secure payment gateway:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPayMethod('razorpay')}
                        className={`py-3.5 px-3 border rounded-xl font-bold tracking-wider transition-all text-center ${payMethod === 'razorpay' ? 'bg-purple-500/15 border-purple-500 text-purple-300' : 'bg-transparent border-white/10 text-neutral-400'}`}
                      >
                        RAZORPAY SECURE
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod('cod')}
                        className={`py-3.5 px-3 border rounded-xl font-bold tracking-wider transition-all text-center ${payMethod === 'cod' ? 'bg-purple-500/15 border-purple-500 text-purple-300' : 'bg-transparent border-white/10 text-neutral-400'}`}
                      >
                        CASH ON DELIVERY (COD)
                      </button>
                    </div>
                    <span className="block text-[9px] text-neutral-500 uppercase mt-2 select-all">* UPI, Net Banking, Credit Cards processed via premium Razorpay mock portals.</span>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="flex-1 py-3 bg-transparent text-neutral-400 hover:text-white uppercase font-bold text-center"
                    >
                      Return to cart
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 font-mono text-[10px] uppercase font-black text-white rounded-xl shadow-lg shadow-purple-500/10 text-center"
                    >
                      Authorize order checkout
                    </button>
                  </div>

                </form>
              ) : (
                // Shopping Cart item checks listing
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 p-3 bg-neutral-900/60 border border-white/5 rounded-xl text-xs relative group">
                      <img src={item.product.images[0]} alt="" className="w-16 h-16 object-cover rounded border border-white/5" />
                      <div className="flex-1 space-y-1.5 font-mono">
                        <div>
                          <span className="block font-sans font-black text-white uppercase text-xs truncate max-w-[180px]">{item.product.title}</span>
                          <span className="block text-[9px] text-neutral-400 uppercase mt-0.5">SIZE {item.selectedSize} • COLOR {item.selectedColor}</span>
                        </div>
                        
                        {item.customization && (
                          <div className="flex flex-col gap-1 pl-1">
                            <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                              ★ BADGE: &quot;{item.customization.playerName}&quot; #{item.customization.playerNumber}
                            </span>
                            {item.customization.customBadgeUrl && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] text-neutral-500 font-mono">Uploaded Crest:</span>
                                <img
                                  src={item.customization.customBadgeUrl}
                                  alt="Custom Crest"
                                  className="w-5 h-5 object-contain border border-white/20 bg-black rounded"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs">
                          <span className="font-sans font-bold text-white">₹{item.product.price}</span>
                          
                          {/* Quantity updates */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateCartQty(item.cartId, Math.max(1, item.quantity - 1))}
                              className="px-2 bg-black border border-white/10 rounded"
                            >
                              -
                            </button>
                            <span className="font-bold text-neutral-300 w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                              className="px-2 bg-black border border-white/10 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="absolute top-2 right-2 text-neutral-500 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div className="text-center py-16 bg-neutral-900/30 border border-dashed border-white/10 rounded-2xl space-y-4">
                      <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-neutral-500 uppercase">Your active shopping cart is completely empty</p>
                    </div>
                  )}

                  {/* Coupons and referrals entry portals */}
                  {cart.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/5 font-mono text-xs">
                      
                      {/* Vouchers lists */}
                      <form onSubmit={executeApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Apply Coupon E.G. RIETZZ15"
                          className="flex-1 bg-black border border-white/10 px-3.5 py-2 text-xs rounded-xl uppercase text-white"
                          value={couponCodeInp}
                          onChange={(e) => setCouponCodeInp(e.target.value)}
                        />
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl">Apply</button>
                      </form>

                      {couponErr && <span className="block text-[10px] text-red-400 font-bold uppercase">{couponErr}</span>}
                      {activeCoupon && (
                        <div className="flex justify-between items-center bg-purple-950/20 px-3.5 py-2 border border-purple-500/20 rounded-xl">
                          <span className="text-purple-300 uppercase tracking-widest font-bold">🎯 ACTIVE: {activeCoupon.code} applied</span>
                          <button type="button" onClick={removeAppliedCoupon} className="text-neutral-500 hover:text-white">X</button>
                        </div>
                      )}

                      {/* Referral credits toggle */}
                      {currentUser && currentUser.referralCredits > 0 && (
                        <div className="flex justify-between items-center bg-purple-950/20 px-3.5 py-2 border border-purple-500/20 rounded-xl">
                          <span className="text-neutral-300">USE DISCOUNTS CREDITS (Bal: ₹{currentUser.referralCredits})</span>
                          <button
                            type="button"
                            onClick={() => useReferralCredits(currentUser.referralCredits)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded uppercase font-bold"
                          >
                            Apply all credits
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price summarizes and actions */}
            {paymentStep !== 'success' && paymentStep !== 'failure' && cart.length > 0 && (
              <div className="border-t border-white/5 pt-4 space-y-4 font-mono text-[11px] select-none">
                <div className="space-y-1.5 text-neutral-400">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span>₹{cart.reduce((acc, c) => acc + (c.product.price * c.quantity),0)}</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-purple-300">
                      <span>Applied Code ({activeCoupon.code})</span>
                      <span>
                        - ₹{activeCoupon.discountType === 'percentage' 
                          ? Math.round((cart.reduce((acc, c) => acc + (c.product.price * c.quantity),0) * activeCoupon.discountValue)/100) 
                          : activeCoupon.discountValue}
                      </span>
                    </div>
                  )}
                  {referralCreditsUsed > 0 && (
                    <div className="flex justify-between text-indigo-300">
                      <span>Referral Credits Used</span>
                      <span>- ₹{referralCreditsUsed}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>{cart.reduce((acc, c) => acc + (c.product.price * c.quantity),0) > 2000 ? <strong className="text-green-400 uppercase tracking-wider">FREE</strong> : '₹0'}</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold text-white uppercase">
                  <span>Grand Total Bill</span>
                  <span>
                    ₹{Math.max(
  0,
  cart.reduce((acc, c) => acc + (c.product.price * c.quantity), 0)
  + 0
  - (
      activeCoupon
        ? (
            activeCoupon.discountType === 'percentage'
              ? Math.round(
                  (cart.reduce((acc, c) => acc + (c.product.price * c.quantity), 0) *
                    activeCoupon.discountValue) / 100
                )
              : activeCoupon.discountValue
          )
        : 0
    )
  - referralCreditsUsed
)}
                  </span>
                </div>

                {/* Submit transitions triggers */}
                {!checkoutOpen ? (
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setCurrentTab('profile');
                        setCartDrawerOpen(false);
                        alert("Please Log In or Simulate an account inside the credentials portal before initiating Checkout.");
                      } else {
                        setCheckoutOpen(true);
                      }
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-mono text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-1"
                  >
                    Proceed to Delivery Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}

              </div>
            )}

          </div>
        </div>
      )}

      {/* --- STANDALONE FIXED INTENSITY SIZE GUIDE POPUP --- */}
      <SizeGuideModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        category={selectedSizeCategory}
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
}
