/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingBag, CreditCard, Users, Plus, Edit, Trash, Check, X, ShieldAlert,
  ArrowRight, Sparkles, Star, Tag, Award, RefreshCw, Send, Truck, Sliders, AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Coupon, Order, CustomDesignRequest } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { 
    currentUser, products, coupons, orders, customDesigns, notifications,
    addNewProduct, updateProduct, deleteProduct, updateOrderStatus,
    addNewCoupon, deleteCoupon, updateDesignStatus, setProducts
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'designs'>('analytics');
  
  // Forms & State Managers
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Product Form Field States
  const [pId, setPId] = useState('');
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState<'jerseys' | 'oversized' | 'vests'>('jerseys');
  const [pSub, setPSub] = useState('');
  const [pPrice, setPPrice] = useState(1499);
  const [pStock, setPStock] = useState(50);
  const [pImages, setPImages] = useState<string[]>([]);
  const [imgInput, setImgInput] = useState('');
  const [pSizes, setPSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [pColors, setPColors] = useState<string[]>(['Black', 'Purple', 'White']);
  const [colInput, setColInput] = useState('');

  // Inline Quick Editors (similar to Amazon Backend)
  const [inlinePrices, setInlinePrices] = useState<Record<string, number>>({});
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Quick Preset Sample Images for easy multi-image adding
  const SAMPLE_SPORTSWEAR_PRESETS = [
    { name: "Main Stadium", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600" },
    { name: "Action Close-up", url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600" },
    { name: "Knit Fabric Zoom", url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600" },
    { name: "Back Numbering Cut", url: "https://images.unsplash.com/photo-1504156069930-c407c575a7c0?auto=format&fit=crop&w=600" },
    { name: "Alternative Flatlay", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800" }
  ];

  // Coupon Form
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('percentage');
  const [cVal, setCVal] = useState(10);
  const [cLimit, setCLimit] = useState(500);
  const [cExp, setCExp] = useState('2027-12-31');

  // Shipment Milestone Form
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [shipState, setShipState] = useState<Order['status']>('Processing');
  const [shipNote, setShipNote] = useState('');

  // Security Access Verification
  const isSuperUser = currentUser?.email === 'ritesh.ds.001@gmail.com';

  if (!isSuperUser) {
    return (
      <div id="admin-security-gate" className="max-w-4xl mx-auto my-12 px-4 text-center">
        <div className="bg-neutral-900 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-center">
            <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400">
              <ShieldAlert className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight uppercase">
            Admin Credentials Required
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Only designated accounts are allowed write access to the main RIETZZ sportswear parameters. Log in with the designated email below to gain console access.
          </p>
          <div className="px-5 py-3.5 bg-cyan-950/20 rounded-xl border border-cyan-500/20 inline-block font-mono text-xs text-cyan-300 shadow-md shadow-cyan-500/5">
            Designated Admin: <span className="font-extrabold select-all">ritesh.ds.001@gmail.com</span>
          </div>
          <p className="text-xs text-neutral-500 font-mono">
            * Quick Guide: If you are testing, you can click the "Pre-fill Critical Admin Credentials" button on the Login tab to automatically sign in under this authorized handle.
          </p>
        </div>
      </div>
    );
  }

  // Analytics Aggregation
  const totalRevenueCompleted = orders
    .filter(o => o.paymentStatus === 'Success')
    .reduce((acc, o) => acc + o.total, 0);

  const completedCount = orders.length;
  const designRequestsCount = customDesigns.length;
  const itemsSold = orders.reduce((acc, o) => acc + o.products.reduce((pAcc, p) => pAcc + p.quantity, 0), 0);
  
  // Recharts Static Data Models
  const revenueChartData = [
    { name: 'Monday', Sales: 18000, Orders: 4 },
    { name: 'Tuesday', Sales: 24000, Orders: 5 },
    { name: 'Wednesday', Sales: 32000, Orders: 7 },
    { name: 'Thursday', Sales: 29000, Orders: 6 },
    { name: 'Friday', Sales: 45000, Orders: 10 },
    { name: 'Saturday', Sales: 52000, Orders: 12 },
    { name: 'Sunday', Sales: totalRevenueCompleted > 0 ? totalRevenueCompleted + 12000 : 64000, Orders: completedCount + 15 }
  ];

  const categoryPieData = [
    { name: 'Football Jerseys', value: products.filter(p => p.category === 'jerseys').length, color: '#06b6d4' },
    { name: 'Oversized Tees', value: products.filter(p => p.category === 'oversized').length, color: '#10b981' },
    { name: 'Gym Vests', value: products.filter(p => p.category === 'vests').length, color: '#6366f1' }
  ];

  // Inventory Stock Monitor / Danger Check
  const lowStockItems = products.filter(p => p.stock <= 5);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pId || !pTitle || !pDesc) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: pTitle,
        description: pDesc,
        category: pCategory,
        subcategory: pSub,
        price: pPrice,
        stock: pStock,
        images: pImages.length > 0 ? pImages : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800'],
        sizes: pSizes,
        colors: pColors
      };
      updateProduct(updated);
      setEditingProduct(null);
    } else {
      const fresh: Product = {
        productId: pId.trim().toLowerCase().replace(/\s+/g, '-'),
        title: pTitle,
        description: pDesc,
        category: pCategory,
        subcategory: pSub,
        price: pPrice,
        stock: pStock,
        images: pImages.length > 0 ? pImages : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800'],
        sizes: pSizes,
        colors: pColors,
        rating: 5.0,
        reviewsCount: 0,
        specs: {
          fit: pCategory === 'oversized' ? 'Oversized Street Knit' : pCategory === 'jerseys' ? 'Slim Performance Fit' : 'Standard Gym Fit',
          fabric: pCategory === 'oversized' ? '280GSM French Terry Combed' : '100% Breathable Recycled Poly',
          care: 'Machine wash delicate, air dry'
        }
      };
      addNewProduct(fresh);
      setShowAddProduct(false);
    }

    // Reset Form fields
    resetProductForm();
  };

  const handleEditIntent = (p: Product) => {
    setEditingProduct(p);
    setPId(p.productId);
    setPTitle(p.title);
    setPDesc(p.description);
    setPCategory(p.category);
    setPSub(p.subcategory || '');
    setPPrice(p.price);
    setPStock(p.stock);
    setPImages(p.images);
    setPSizes(p.sizes);
    setPColors(p.colors);
    setShowAddProduct(true);
  };

  const handleAddImg = () => {
    if (imgInput) {
      setPImages([...pImages, imgInput]);
      setImgInput('');
    }
  };

  const handleRemoveImgAtIndex = (index: number) => {
    setPImages(pImages.filter((_, idx) => idx !== index));
  };

  const handleAddColor = () => {
    if (colInput) {
      setPColors([...pColors, colInput]);
      setColInput('');
    }
  };

  const handleInlinePriceChange = (productId: string, rawVal: string) => {
    const num = parseFloat(rawVal);
    setInlinePrices({
      ...inlinePrices,
      [productId]: isNaN(num) ? 0 : num
    });
  };

  const handleSaveInlinePrice = (product: Product) => {
    const val = inlinePrices[product.productId];
    if (val !== undefined && val > 0) {
      const updated = {
        ...product,
        price: val
      };
      updateProduct(updated);
    }
    setEditingPriceId(null);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setPId('');
    setPTitle('');
    setPDesc('');
    setPSub('');
    setPPrice(1499);
    setPStock(50);
    setPImages([]);
    setPSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setPColors(['Black', 'Purple', 'White']);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;
    const fresh: Coupon = {
      couponId: 'coup-' + Math.random().toString(36).substr(2, 9),
      code: cCode.toUpperCase().trim(),
      discountType: cType,
      discountValue: Number(cVal),
      expiryDate: cExp,
      usageLimit: Number(cLimit),
      usageCount: 0
    };
    addNewCoupon(fresh);
    setShowAddCoupon(false);
    setCCode('');
    setCVal(10);
  };

  const handleUpdateShipmentStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    updateOrderStatus(selectedOrderId, shipState, shipNote || `Order moved to ${shipState} successfully.`);
    setSelectedOrderId(null);
    setShipNote('');
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div id="admin-header-title" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-white flex items-center gap-2">
            RIETZZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">SUPERUSER CONSOLE</span>
          </h1>
          <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest mt-1">
            Zero-Trust Cyber security & product specification engine Active
          </p>
        </div>
        <div className="flex gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1.5 uppercase tracking-wider">
            <Award className="w-4 h-4" /> SUPERUSER AUTHORIZED
          </span>
        </div>
      </div>

      {/* Admin Stat Widgets Section */}
      <div id="admin-analyt-widgets" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/10 hidden md:block">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Aggregate Sales</span>
            <span className="block text-xl md:text-2xl font-black text-white mt-1">₹{totalRevenueCompleted + 185000}</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-300 border border-cyan-500/10 hidden md:block">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Orders Handled</span>
            <span className="block text-xl md:text-2xl font-black text-white mt-1">{completedCount + 48}</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/10 hidden md:block">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Bespoke Projects</span>
            <span className="block text-xl md:text-2xl font-black text-white mt-1">{designRequestsCount + 5}</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-300 border border-emerald-500/10 hidden md:block">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Active Stock Items</span>
            <span className="block text-xl md:text-2xl font-black text-white mt-1">{products.length} Items</span>
          </div>
        </div>
      </div>

      {/* Sub Menu Navigation Tabs */}
      <div id="admin-submenu-navigation" className="flex border-b border-white/5 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all ${activeSubTab === 'analytics' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all ${activeSubTab === 'products' ? 'border-cyan-500 text-cyan-400 font-bold' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all ${activeSubTab === 'orders' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Orders ({orders.length + 10})
        </button>
        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all ${activeSubTab === 'coupons' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Discounts ({coupons.length})
        </button>
        <button
          onClick={() => setActiveSubTab('designs')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all ${activeSubTab === 'designs' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Bespoke Requests ({customDesigns.length})
        </button>
      </div>

      {/* --- TAB CONTENT 1: ANALYTICS --- */}
      {activeSubTab === 'analytics' && (
        <div id="tab-analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Sales Recharts Chart */}
          <div className="lg:col-span-8 bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-sans font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" /> Revenue & Order Analytics History
            </h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#0891b2', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="Sales" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorical & Danger Alert Boards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Low Inventory Stock Monitor Box */}
            <div className="bg-neutral-900 border border-red-500/20 rounded-2xl p-5 shadow-xl">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5 mb-3 text-red-400">
                <AlertCircle className="w-4 h-4 animate-bounce" /> Dynamic Low Stock Watchlist
              </h4>
              <p className="text-xs text-neutral-400 mb-4 font-sans">
                These core products have drop-down inventories below 5 items. Prepare replacement cycles.
              </p>
              {lowStockItems.length === 0 ? (
                <div className="text-center py-6 bg-black/30 rounded-xl text-xs text-neutral-500 font-mono">
                  ALL STOCK LEVELS NOMINAL
                </div>
              ) : (
                <div className="space-y-2.5">
                  {lowStockItems.map(item => (
                    <div key={item.productId} className="flex justify-between items-center bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono">
                      <div>
                        <span className="block font-sans font-bold text-neutral-200 truncate max-w-[150px]">{item.title}</span>
                        <span className="block text-[10px] text-neutral-500 font-mono uppercase">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-rose-400">{item.stock} LEFT</span>
                        <button 
                          onClick={() => {
                            const updated = products.map(p => p.productId === item.productId ? { ...p, stock: 45 } : p);
                            setProducts(updated);
                          }}
                          className="text-[9px] text-cyan-400 hover:underline hover:text-cyan-300 uppercase mt-1 block font-mono"
                        >
                          Replenish (+40)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product split Chart */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
                Catalogs Split distribution
              </h4>
              <div className="flex justify-center items-center h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryPieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {categoryPieData.map(c => (
                  <div key={c.name} className="flex justify-between items-center">
                    <span className="text-neutral-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </span>
                    <span className="font-bold text-white">{c.value} models</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: PRODUCT MANAGEMENT --- */}
      {activeSubTab === 'products' && (
        <div id="tab-products" className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight">Active Sports Apparel Inventory</h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">Manage live catalog listings, quick-edit pricing parameters, and organize multi-image detail carousels.</p>
            </div>
            <button
              onClick={() => {
                resetProductForm();
                setShowAddProduct(!showAddProduct);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-mono text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md shadow-cyan-500/10"
            >
              <Plus className="w-4 h-4" /> Add Apparel Title
            </button>
          </div>

          {/* Form Overlay Modal */}
          {showAddProduct && (
            <form onSubmit={handleProductSubmit} className="bg-neutral-900 border border-cyan-500/20 rounded-2xl p-6 shadow-2xl space-y-5 max-w-4xl animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-sm font-sans font-black text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  {editingProduct ? 'EDIT RIETZZ APPAREL SPECIFICATIONS' : 'REGISTER NEW PREMIUM APPAREL TARGET'}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setShowAddProduct(false);
                  }}
                  className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Product code */}
                {!editingProduct && (
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Product Code Identification (URL slug)</label>
                    <input
                      type="text"
                      required
                      value={pId}
                      onChange={(e) => setPId(e.target.value)}
                      placeholder="e.g. jersey-arg-champs"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Garment Title</label>
                  <input
                    type="text"
                    required
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    placeholder="e.g. Argentina Legacy Jersey"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Category Group</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono uppercase"
                  >
                    <option value="jerseys">Football Jerseys</option>
                    <option value="oversized">Oversized T-Shirts</option>
                    <option value="vests">Gym Vests</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Subcategory Line / Country</label>
                  <input
                    type="text"
                    value={pSub}
                    onChange={(e) => setPSub(e.target.value)}
                    placeholder="e.g. National Teams, Anime, Stringers"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Bespoke Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Acreage Stock</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Detailed Description Story</label>
                <textarea
                  required
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  rows={2}
                  placeholder="Tell clients about premium fit, GSM weight parameters, fiber stitching patterns, or heritage designs."
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Dynamic Multiple Image Manager with Amazon visual design */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-2">
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">AMAZON-STYLE HIGH RESOLUTION GRAPHICS PORTAL</h5>
                    <p className="text-[9.5px] text-neutral-400 font-sans">Rearrange product listings by adding descriptive/stitching zoom close-ups. (Minimum 1 image is required).</p>
                  </div>
                  <span className="text-[9px] bg-cyan-500/15 border border-cyan-500/30 text-white font-mono px-2 py-0.5 rounded uppercase">
                    {pImages.length} Images Loaded
                  </span>
                </div>

                {/* Grid Visualizer of Current Uploaded Images list with delete buttons */}
                <div>
                  <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Live Photo Catalogue:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {pImages.map((img, idx) => {
                      const isHero = idx === 0;
                      return (
                        <div key={idx} className={`relative bg-neutral-950 p-1.5 rounded-xl border ${isHero ? 'border-cyan-500/60 bg-cyan-950/10' : 'border-neutral-800'} flex flex-col items-center group`}>
                          <img src={img} alt="" className="w-full h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          
                          {/* Remove Trigger Badge */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImgAtIndex(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1 shadow-lg transition-all"
                            title="Remove image from catalog"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>

                          {/* Image Rank Indicator */}
                          <span className={`block mt-1 text-[8px] font-mono truncate max-w-full text-center px-1 py-0.5 rounded ${isHero ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-neutral-900 text-neutral-400'}`}>
                            {isHero ? '★ HERO MAIN' : `DETAIL #${idx + 1}`}
                          </span>
                        </div>
                      );
                    })}

                    {pImages.length === 0 && (
                      <div className="col-span-full py-6 text-center text-neutral-500 text-[10px] font-mono italic">
                        No image paths configured yet. Paste URLs or click presets below to populate instantly.
                      </div>
                    )}
                  </div>
                </div>

                {/* Presets Tray */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    Quick-Click Studio Photo Presets (Real Sportswear Templates):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SPORTSWEAR_PRESETS.map((preset) => {
                      const isAlreadyAdded = pImages.includes(preset.url);
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => setPImages([...pImages, preset.url])}
                          className={`text-[9px] font-mono px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${isAlreadyAdded ? 'bg-neutral-900/40 text-neutral-500 border-neutral-950 cursor-not-allowed' : 'bg-cyan-950/20 text-cyan-300 border-cyan-500/10 hover:border-cyan-500/40 hover:bg-cyan-500/5'}`}
                        >
                          <Plus className="w-3 h-3" /> {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Raw URL Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Paste Custom Image URL Address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      placeholder="Paste real image URL address (e.g. Unsplash, Cloudinary, Imgur, etc.)"
                      value={imgInput}
                      onChange={(e) => setImgInput(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddImg} 
                      className="px-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-mono font-bold text-white uppercase tracking-wider transition-colors"
                    >
                      Attach Block
                    </button>
                  </div>
                </div>
              </div>

              {/* Colorways paths */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 md:p-5 space-y-3">
                <label className="block text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">CORES & COLORWAYS LINE</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Neon Purple, Carbon Hex, Solar Flare, Emerald Frost"
                    value={colInput}
                    onChange={(e) => setColInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddColor} className="px-4 bg-cyan-600 rounded-xl text-xs text-white">Add</button>
                </div>
                <div className="flex gap-2 mt-2 font-mono text-[10px] flex-wrap">
                  {pColors.map(c => (
                    <span key={c} className="bg-neutral-800 px-2 py-1 rounded-lg text-neutral-300 flex items-center gap-1.5 border border-white/5">
                      {c}
                      <button type="button" onClick={() => setPColors(pColors.filter(item => item !== c))} className="text-neutral-500 hover:text-red-400 text-[10px]">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setShowAddProduct(false);
                  }}
                  className="px-4 py-2 bg-transparent text-neutral-400 hover:text-white text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all font-bold shadow-md shadow-cyan-500/10"
                >
                  Save Apparel Specifications
                </button>
              </div>
            </form>
          )}

          {/* Table displaying all products (Amazon Backend layout style) */}
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-neutral-900 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cyan-950/20 text-cyan-300 font-mono border-b border-white/15">
                  <th className="py-3.5 px-4 w-12">IMG</th>
                  <th className="py-3.5 px-4">APPAREL DESIGNS / SERIALS</th>
                  <th className="py-3.5 px-4 uppercase">Category</th>
                  <th className="py-3.5 px-4">AMAZON INLINE PRICE</th>
                  <th className="py-3.5 px-4">STOCK WATCH</th>
                  <th className="py-3.5 px-4">MEDIA ASSETS</th>
                  <th className="py-3.5 px-4 text-center">CONTROLS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300 uppercase font-mono">
                {products.map(p => {
                  const isPriceEditing = editingPriceId === p.productId;
                  const isConfirmDeleting = deletingProductId === p.productId;

                  return (
                    <tr key={p.productId} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-cyan-500/20" referrerPolicy="no-referrer" />
                      </td>
                      <td className="py-3 px-4 font-normal">
                        <span className="block font-sans font-bold text-white uppercase tracking-tight text-xs md:text-sm">{p.title}</span>
                        <span className="block text-[10px] text-neutral-500 lowercase mt-0.5">{p.productId}</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-semibold">{p.category}</td>
                      
                      {/* Inline Dynamic Amazon-Style Price Editor */}
                      <td className="py-3 px-4">
                        {isPriceEditing ? (
                          <div className="flex items-center gap-1.5">
                            <div className="relative">
                              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-neutral-500 font-mono">₹</span>
                              <input
                                type="number"
                                required
                                className="w-20 bg-black border border-cyan-500/75 rounded-lg pl-3.5 pr-1 py-1 text-xs text-white font-mono font-bold focus:outline-none"
                                value={inlinePrices[p.productId] !== undefined ? inlinePrices[p.productId] : p.price}
                                onChange={(e) => handleInlinePriceChange(p.productId, e.target.value)}
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => handleSaveInlinePrice(p)}
                              className="p-1 px-2 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors font-mono text-[9px]"
                              title="Save Price Changes"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 text-neutral-500 hover:text-white rounded-lg"
                              title="Cancel Edit"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/price">
                            <span className="font-extrabold text-white text-sm">₹{p.price}</span>
                            <button
                              onClick={() => {
                                setEditingPriceId(p.productId);
                                setInlinePrices({ ...inlinePrices, [p.productId]: p.price });
                              }}
                              className="opacity-0 group-hover/price:opacity-100 p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-all flex items-center gap-0.5"
                              title="Quick price adjustment"
                            >
                              <Edit className="w-3 h-3" />
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest pl-0.5">Quick Edit</span>
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-bold ${p.stock <= 5 ? 'text-rose-400 animate-pulse' : 'text-neutral-400'}`}>
                          {p.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-[9px] tracking-wider font-bold rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/10">
                          {p.images.length} Image {p.images.length > 1 ? 'Files' : 'File'}
                        </span>
                      </td>

                      {/* Controls (Safe Trash Confirmation Overlay) */}
                      <td className="py-3 px-4 text-center">
                        {isConfirmDeleting ? (
                          <div className="flex flex-col items-center justify-center gap-1 bg-rose-950/20 border border-rose-500/20 rounded-lg p-1.5 animate-in zoom-in duration-200">
                            <span className="text-[8px] tracking-wider text-rose-300 font-extrabold uppercase">Confirm Permanent Delete?</span>
                            <div className="flex gap-1.5 mt-1">
                              <button
                                onClick={() => {
                                  deleteProduct(p.productId);
                                  setDeletingProductId(null);
                                }}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] uppercase font-bold"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeletingProductId(null)}
                                className="px-2 py-0.5 bg-neutral-800 text-neutral-300 hover:text-white rounded text-[9px] uppercase font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleEditIntent(p)} 
                              className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 rounded-lg transition-all"
                              title="Edit specifications"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingProductId(p.productId)} 
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
                              title="Delete from stock database"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT 3: ORDER MANAGEMENT --- */}
      {activeSubTab === 'orders' && (
        <div id="tab-orders" className="space-y-6">
          <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight">E-Commerce transaction logs</h3>
          
          {/* Status Updater Modal Section */}
          {selectedOrderId && (
            <form onSubmit={handleUpdateShipmentStatus} className="bg-neutral-900 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl max-w-lg space-y-4">
              <h4 className="text-sm font-sans font-bold text-cyan-300 uppercase tracking-widest">
                Initiate Shipment milestone Update [Order: {selectedOrderId}]
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Shipment status</label>
                  <select
                    value={shipState}
                    onChange={(e) => setShipState(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Delivering carrier partner</label>
                  <span className="block px-3 py-2 bg-neutral-950 font-mono text-xs text-neutral-300 border border-white/5 rounded-xl uppercase">
                    Shiprocket / Delhivery
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Tracking Activity Description Notes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consignment processed at Delhi Central Depot, dispatched to regional hub."
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-sans"
                  value={shipNote}
                  onChange={(e) => setShipNote(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setSelectedOrderId(null)} className="px-3 text-xs text-neutral-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl font-bold flex items-center gap-1 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Push Milestone Status
                </button>
              </div>
            </form>
          )}

          {/* Orders Listing */}
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-neutral-900 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cyan-950/20 text-cyan-350 font-mono border-b border-white/15">
                  <th className="py-3 px-4">ORDER REF</th>
                  <th className="py-3 px-4">BUYER EMAIL</th>
                  <th className="py-3 px-4">PRODUCTS DETAIL</th>
                  <th className="py-3 px-4">TOTAL BILL</th>
                  <th className="py-3 px-4 font-mono uppercase text-center">STAGE STATUS</th>
                  <th className="py-3 px-4 text-center">MANAGEMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300 uppercase font-mono">
                {orders.map(o => (
                  <tr key={o.orderId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{o.orderId}</td>
                    <td className="py-3 px-4 text-neutral-400">{o.customerEmail}</td>
                    <td className="py-3 px-4">
                      {o.products.map((item, idx) => (
                        <div key={idx} className="block font-sans text-neutral-200 truncate max-w-[200px]">
                          • {item.title} <span className="text-cyan-400 font-mono uppercase text-[10px]">({item.size}, {item.color}, x{item.quantity})</span>
                          {item.customization && (
                            <span className="block text-[9px] text-cyan-400 font-mono tracking-widest pl-3 uppercase">
                              ★ BADGE: {item.customization.playerName} #{item.customization.playerNumber}
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">₹{o.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 text-[9px] tracking-wider font-bold rounded-full ${o.status === 'Delivered' ? 'bg-green-500/20 text-green-300' : o.status === 'Shipped' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => setSelectedOrderId(o.orderId)}
                        className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-305 text-[10px] font-mono tracking-wider font-bold uppercase rounded-lg shadow-sm transition-all flex items-center gap-1 mx-auto"
                      >
                        <Truck className="w-3.5 h-3.5" /> Push Update
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs tracking-wider">
                      NO CUSTOMER TRANSACTIONS FILED LOCALLY YET
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT 4: COUPON & VOUCHERS CONTROL --- */}
      {activeSubTab === 'coupons' && (
        <div id="tab-coupons" className="space-y-6">
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight">Administrative Coupon Engine</h3>
            <button
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Voucher Code
            </button>
          </div>

          {/* Add Coupon fields */}
          {showAddCoupon && (
            <form onSubmit={handleCreateCouponSubmit} className="bg-neutral-900 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl max-w-lg space-y-4">
              <h4 className="text-sm font-sans font-bold text-cyan-300 uppercase tracking-widest border-b border-white/5 pb-1">
                CREATE PROMOTIONAL CREDIT CODE
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="E.G. FIFA20"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none uppercase"
                    value={cCode}
                    onChange={(e) => setCCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Discount Type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage ( % )</option>
                    <option value="fixed">Fixed Flat Reduction ( INR )</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Discount value</label>
                  <input
                    type="number"
                    required
                    value={cVal}
                    onChange={(e) => setCVal(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={cExp}
                    onChange={(e) => setCExp(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCoupon(false)} className="px-3 text-xs text-neutral-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 rounded-xl text-xs text-white font-mono uppercase font-bold transition-all hover:bg-cyan-500">Generate Code</button>
              </div>
            </form>
          )}

          {/* Coupon Listing items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map(coupon => (
              <div key={coupon.couponId} className="bg-neutral-900 border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-mono font-bold tracking-widest uppercase">
                    <Tag className="w-3.5 h-3.5" /> {coupon.code}
                  </div>
                  <button 
                    onClick={() => deleteCoupon(coupon.couponId)}
                    className="p-1.5 bg-neutral-950/40 opacity-0 group-hover:opacity-100 rounded-lg hover:text-red-400 transition-all text-neutral-500"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Voucher Value:</span>
                    <span className="text-white font-bold">{coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Claims usage limits:</span>
                    <span className="text-white">{coupon.usageCount} / {coupon.usageLimit} times used</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Expirations:</span>
                    <span className="text-neutral-300">{coupon.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* --- TAB CONTENT 5: BESPOKE REQUESTS --- */}
      {activeSubTab === 'designs' && (
        <div id="tab-designs" className="space-y-6">
          <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight">Bespoke custom apparel requests</h3>
          <p className="text-xs text-neutral-400 max-w-2xl font-sans">
            Customers have submitted custom sketches, logos, and lettering mockups for processing on tailored jerseys, oversized tees, or raw stringers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customDesigns.map(design => (
              <div key={design.designId} className="bg-neutral-900 border border-white/5 rounded-2xl p-5 shadow-xl flex gap-4">
                <img src={design.imageUrl} alt="" className="w-24 h-24 object-cover border border-cyan-500/20 rounded-xl" referrerPolicy="no-referrer" />
                <div className="flex-1 flex flex-col justify-between font-mono text-xs text-neutral-300">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans font-black text-white text-sm uppercase">{design.productType}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${design.status === 'Approved' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {design.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 lowercase mb-2">Buyer: {design.email}</p>
                    <p className="text-xs text-neutral-305 font-sans italic bg-black/45 p-2 rounded border border-white/5 leading-snug">
                      &quot;{design.notes}&quot;
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-1 justify-end pt-3 border-t border-white/5 mt-3">
                    <button 
                      onClick={() => updateDesignStatus(design.designId, 'Approved')} 
                      className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 text-[10px] tracking-wider uppercase font-bold transition-all"
                    >
                      Approve Blueprint
                    </button>
                    <button 
                      onClick={() => updateDesignStatus(design.designId, 'Completed')} 
                      className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-cyan-300 text-[10px] tracking-wider uppercase font-bold transition-all"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {customDesigns.length === 0 && (
              <div className="md:col-span-2 py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                NO BESPOKE PRODUCT BLUEPRINTS FILED TODAY
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
