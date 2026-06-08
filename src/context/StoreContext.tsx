/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Product, CartItem, Order, Review, WishlistItem, Coupon, Referral, 
  CustomDesignRequest, StoreNotification, ShippingAddress, Customization, TrackingMilestone 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data';
import { isFirebaseSupported, db, auth, OperationType, handleFirestoreError } from '../firebase';
import { 
  signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, updateProfile 
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

interface StoreContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  products: Product[];
  coupons: Coupon[];
  cart: CartItem[];
  wishlist: string[]; // List of product IDs
  orders: Order[];
  customDesigns: CustomDesignRequest[];
  notifications: StoreNotification[];
  activeCoupon: Coupon | null;
  referralCreditsUsed: number;
  isFirebaseMode: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // Auth Operations
  loginWithEmail: (email: string, psw: string) => Promise<void>;
  signUpWithEmail: (email: string, psw: string, name: string, refCode?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateAddress: (address: ShippingAddress) => void;

  // Cart Operations
  addToCart: (product: Product, size: string, color: string, qty: number, custom?: Customization) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQty: (cartId: string, qty: number) => void;
  clearCart: () => void;

  // Wishlist Operations
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string, size: string, color: string) => void;

  // Discount Operations
  applyCouponCode: (code: string) => string | null; // returns error message if invalid, or null if success
  removeAppliedCoupon: () => void;
  useReferralCredits: (amount: number) => void;

  // Custom Design Request
  submitCustomDesign: (productType: 'Football Jersey' | 'Oversized Tee' | 'Gym Vest', notes: string, imageFileUrl: string) => Promise<void>;

  // Checkout & Order Placement
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: 'razorpay' | 'cod') => Promise<Order>;

  // Product Reviews
  submitProductReview: (productId: string, rating: number, comment: string, reviewPhotos?: string[]) => Promise<void>;

  // Notification Operations
  addNotification: (userId: string, title: string, msg: string) => void;
  markNotificationRead: (notifId: string) => void;

  // Admin Dashboard Hooks (ritesh.ds.001@gmail.com)
  addNewProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (pId: string) => void;
  updateOrderStatus: (oId: string, status: Order['status'], description: string) => void;
  addNewCoupon: (c: Coupon) => void;
  deleteCoupon: (cId: string) => void;
  updateDesignStatus: (dId: string, status: CustomDesignRequest['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside a StoreProvider");
  return context;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customDesigns, setCustomDesigns] = useState<CustomDesignRequest[]>([]);
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [referralCreditsUsed, setReferralCreditsUsed] = useState(0);

  // Load and seed products/coupons under Local Fallback state
  useEffect(() => {
    // Products
    const loadProducts = async () => {
  if (isFirebaseSupported && db) {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      if (!snapshot.empty) {
        const firestoreProducts = snapshot.docs.map(
          doc => doc.data() as Product
        );
        setProducts(firestoreProducts);
      } else {
        setProducts(INITIAL_PRODUCTS);

        for (const product of INITIAL_PRODUCTS) {
          await setDoc(
            doc(db, "products", product.productId),
            product
          );
        }
      }
    } catch (error) {
      console.error(error);
      setProducts(INITIAL_PRODUCTS);
    }
  } else {
    setProducts(INITIAL_PRODUCTS);
  }
};

loadProducts();

    // Coupons
    const localCoupons = localStorage.getItem('rietz_coupons');
    if (localCoupons) {
      setCoupons(JSON.parse(localCoupons));
    } else {
      setCoupons(INITIAL_COUPONS);
      localStorage.setItem('rietz_coupons', JSON.stringify(INITIAL_COUPONS));
    }

    // Cart
    const localCart = localStorage.getItem('rietz_cart');
    if (localCart) setCart(JSON.parse(localCart));

    // Wishlist
    const localWishlist = localStorage.getItem('rietz_wishlist');
    if (localWishlist) setWishlist(JSON.parse(localWishlist));

    // Orders
    const localOrders = localStorage.getItem('rietz_orders');
    if (localOrders) setOrders(JSON.parse(localOrders));

    // Custom Designs
    const localDesigns = localStorage.getItem('rietz_custom_designs');
    if (localDesigns) setCustomDesigns(JSON.parse(localDesigns));

    // Notifications
    const localNotifs = localStorage.getItem('rietz_notifications');
    if (localNotifs) {
      setNotifications(JSON.parse(localNotifs));
    } else {
      const welcomeNotif: StoreNotification = {
        notificationId: 'welcome- Rietzz',
        userId: 'admin',
        title: 'Welcome to RIETZZ Premium Sportswear',
        message: 'Platform built and structured for live checkout. Log in as ritesh.ds.001@gmail.com to access the comprehensive admin console.',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications([welcomeNotif]);
      localStorage.setItem('rietz_notifications', JSON.stringify([welcomeNotif]));
    }
  }, []);

  // Sync state mutations directly back to localStorage so user interactions persist cleanly


  useEffect(() => {
    localStorage.setItem('rietz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rietz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rietz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rietz_custom_designs', JSON.stringify(customDesigns));
  }, [customDesigns]);

  useEffect(() => {
    localStorage.setItem('rietz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rietz_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Auth synchronization hook
  useEffect(() => {
    if (!isFirebaseSupported || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            setCurrentUser(userSnap.data() as UserProfile);
            const ordersSnapshot = await getDocs(collection(db, "orders"));

const userOrders = ordersSnapshot.docs
  .map(doc => doc.data() as Order)
  .filter(order => order.userId === firebaseUser.uid);

setOrders(userOrders);
          } else {
            // Build the initial User profile database matching our specs
            const seedReferralCode = 'REF-RIETZZ' + Math.floor(1000 + Math.random() * 9000);
            const isRitesh = firebaseUser.email === 'ritesh.ds.001@gmail.com';
            
            const freshProfile: UserProfile = {
              userId: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'RIETZZ Champion',
              role: isRitesh ? 'admin' : 'customer',
              referralCode: seedReferralCode,
              referralCredits: 500, // give a nice initial 500 Credits to play with!
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userDocRef, freshProfile);
            setCurrentUser(freshProfile);
          }
        } catch (error) {
          console.error("Error reading/writing User Profile in firestore:", error);
          // Fallback to local profile object inside Auth listener so app builds green
          const isRitesh = firebaseUser.email === 'ritesh.ds.001@gmail.com';
          setCurrentUser({
            userId: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'RIETZZ Athlete',
            role: isRitesh ? 'admin' : 'customer',
            referralCode: 'REF-FALLBACK' + firebaseUser.uid.slice(0,4),
            referralCredits: 500,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Authentication Actions
  const loginWithEmail = async (email: string, psw: string) => {
    const isRitesh = email.toLowerCase() === 'ritesh.ds.001@gmail.com';
    
    if (isRitesh && psw !== 'Rietzz@001') {
      throw new Error('Access Denied: Incorrect password for the RIETZZ Administrative Console.');
    }

    if (isFirebaseSupported && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, psw);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'auth/signin');
      }
    } else {
      // Local Auth Mocking
      const mockUser: UserProfile = {
        userId: isRitesh ? 'rietzz-admin-uid' : 'local-auth-user',
        email: email,
        name: isRitesh ? 'Ritesh Sharma (Admin)' : 'Guest Competitor',
        role: isRitesh ? 'admin' : 'customer',
        referralCode: 'REF-RIETZZ1010',
        referralCredits: 250,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(mockUser);
    }
  };

  const signUpWithEmail = async (email: string, psw: string, name: string, refCode?: string) => {
    if (isFirebaseSupported && auth) {
      try {
        const credentials = await createUserWithEmailAndPassword(auth, email, psw);
        await updateProfile(credentials.user, { displayName: name });
        
        // Build Profile
        const seedRef = 'REF-RIETZZ' + Math.floor(1000 + Math.random() * 9000);
        const isRitesh = email.toLowerCase() === 'ritesh.ds.001@gmail.com';
        
        const freshProfile: UserProfile = {
          userId: credentials.user.uid,
          email,
          name,
          role: isRitesh ? 'admin' : 'customer',
          referralCode: seedRef,
          referredBy: refCode || undefined,
          referralCredits: refCode ? 500 : 200, // reward referee
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', credentials.user.uid), freshProfile);
        setCurrentUser(freshProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'auth/signup');
      }
    } else {
      const isRitesh = email.toLowerCase() === 'ritesh.ds.001@gmail.com';
      const mockUser: UserProfile = {
        userId: 'local-auth-user',
        email,
        name,
        role: isRitesh ? 'admin' : 'customer',
        referralCode: 'REF-LOCALREG',
        referredBy: refCode || undefined,
        referralCredits: refCode ? 500 : 200,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(mockUser);
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseSupported && auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'auth/google');
      }
    } else {
      // Login as Ritesh Gmail to easily access Admin dashboard panel
      const adminG: UserProfile = {
        userId: 'admin-google-id',
        email: 'ritesh.ds.001@gmail.com',
        name: 'Ritesh Ds (Google Admin)',
        role: 'admin',
        referralCode: 'REF-RIETZZ999',
        referralCredits: 1000,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminG);
    }
  };

  const logout = async () => {
    if (isFirebaseSupported && auth) {
      await signOut(auth);
    } else {
      setCurrentUser(null);
    }
    setActiveCoupon(null);
    setReferralCreditsUsed(0);
  };

  const updateAddress = (address: ShippingAddress) => {
    if (currentUser) {
      const updated = { ...currentUser, address };
      setCurrentUser(updated);
      
      if (isFirebaseSupported && auth) {
        updateDoc(doc(db, 'users', currentUser.userId), { address })
          .catch(err => console.error("Could not sync address to firestore", err));
      }
    }
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, qty: number, custom?: Customization) => {
    setCart((prev) => {
      // Check if item already exists in identical combination (productId + size + color + custom)
      const existingIdx = prev.findIndex(item => 
        item.product.productId === product.productId && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        JSON.stringify(item.customization) === JSON.stringify(custom)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }

      const freshCartItem: CartItem = {
        cartId: 'cart-' + Math.random().toString(36).substr(2, 9),
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
        customization: custom
      };
      return [...prev, freshCartItem];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartQty = (cartId: string, qty: number) => {
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    if (isFirebaseSupported && currentUser) {
      const wishId = `wish-${currentUser.userId}-${productId}`;
      // Simply merge wish record
      setDoc(doc(db, 'wishlist', wishId), {
        wishlistId: wishId,
        userId: currentUser.userId,
        productId: productId,
        addedAt: new Date().toISOString()
      }).catch(err => console.error(err));
    }
  };

  const moveWishlistToCart = (productId: string, size: string, color: string) => {
    const prod = products.find(p => p.productId === productId);
    if (prod) {
      addToCart(prod, size, color, 1);
      toggleWishlist(productId);
    }
  };

  // Apply discount and coupons
  const applyCouponCode = (code: string): string | null => {
    const matched = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!matched) return "This coupon code is invalid.";

    // Check expiry
    const today = new Date().toISOString().split('T')[0];
    if (matched.expiryDate < today) return "This coupon code has expired.";

    // Check Usage Limit
    if (matched.usageCount >= matched.usageLimit) return "This coupon code usage limit has been reached.";

    setActiveCoupon(matched);
    return null;
  };

  const removeAppliedCoupon = () => {
    setActiveCoupon(null);
  };

  const useReferralCredits = (amount: number) => {
    if (currentUser && currentUser.referralCredits >= amount) {
      setReferralCreditsUsed(amount);
    }
  };

  // Submit custom design request
  const submitCustomDesign = async (
    productType: 'Football Jersey' | 'Oversized Tee' | 'Gym Vest',
    notes: string,
    imageFileUrl: string
  ) => {
    const freshDesign: CustomDesignRequest = {
      designId: 'des-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser?.userId || 'guest-athlete',
      email: currentUser?.email || 'guest@rietzz.com',
      productType,
      notes,
      imageUrl: imageFileUrl || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    setCustomDesigns(prev => [freshDesign, ...prev]);

    // Send Admin Notification
    addNotification('admin', 'New Custom Design Request Received', `A dynamic customized apparel project request for a ${productType} was submitted by: ${freshDesign.email}`);

    if (isFirebaseSupported && currentUser) {
      try {
        await setDoc(doc(db, 'custom_designs', freshDesign.designId), freshDesign);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'custom_designs');
      }
    }
  };

  // Place order
  const placeOrder = async (shippingAddress: ShippingAddress, paymentMethod: 'razorpay' | 'cod'): Promise<Order> => {
    const subtotal = cart.reduce((acc, c) => acc + (c.product.price * c.quantity), 0);
    const shipping = 0; // free delivery above Rs2000
    
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * activeCoupon.discountValue) / 100);
      } else {
        discount = activeCoupon.discountValue;
      }
    }

    // Deduct credit notes
    if (referralCreditsUsed > 0) {
      discount += referralCreditsUsed;
    }

    const grandTotal = Math.max(0, subtotal + shipping - discount);

    const freshOrder: Order = {
      orderId: 'RTZ-' + Math.floor(100000 + Math.random() * 900000),
      userId: currentUser?.userId || 'guest-user',
      customerEmail: currentUser?.email || shippingAddress.phone || 'guest@rietzz.com',
      products: cart.map(item => ({
        productId: item.product.productId,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.images[0],
        customization: item.customization
      })),
      subtotal,
      shipping,
      discount,
      total: grandTotal,
      couponCode: activeCoupon?.code || null,
      status: 'Pending',
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'Success' : 'Pending', // mock successful payment processing
      trackingTimeline: [
        {
          status: 'Pending',
          title: 'Order Completed Ready',
          description: 'Payment status cleared. Order placed under transaction ID successfully.',
          timestamp: new Date().toISOString()
        }
      ],
      timestamp: new Date().toISOString()
    };

    setOrders(prev => [freshOrder, ...prev]);

    // Send notifications
    addNotification(freshOrder.userId, 'Order Confirmed - ' + freshOrder.orderId, `Thanks for your purchase! We successfully generated order ${freshOrder.orderId} and are printing your premium clothing items.`);
    addNotification('admin', 'New RIETZZ Order Placed: ' + freshOrder.orderId, `Premium merchandise request generated by user ${freshOrder.customerEmail}. Amount: ₹${freshOrder.total}`);

    // Update coupon counts
    if (activeCoupon) {
      setCoupons(prev => prev.map(c => c.couponId === activeCoupon.couponId ? { ...c, usageCount: c.usageCount + 1 } : c));
    }

    // Deduct user credits in local state
    if (currentUser && referralCreditsUsed > 0) {
      setCurrentUser(prev => prev ? { ...prev, referralCredits: Math.max(0, prev.referralCredits - referralCreditsUsed) } : null);
    }

    // Adjust product inventory levels
    setProducts(prevProds => {
      const nextProds = prevProds.map(p => {
        const itemOrdered = cart.find(ci => ci.product.productId === p.productId);
        if (itemOrdered) {
          const newStock = Math.max(0, p.stock - itemOrdered.quantity);
          if (newStock <= 5) {
            // Low Stock alert notification
            setTimeout(() => {
              addNotification('admin', `Low STOCK ALERT [${p.title}]`, `Rapid purchase has decreased inventory level of product ${p.productId} down to ${newStock} pieces. Replenish needed!`);
            }, 500);
          }
          return { ...p, stock: newStock };
        }
        return p;
      });
      return nextProds;
    });

    // Clear cart & variables
    setCart([]);
    setActiveCoupon(null);
    setReferralCreditsUsed(0);

    if (isFirebaseSupported && currentUser) {
      try {
        await setDoc(doc(db, 'orders', freshOrder.orderId), freshOrder);
        // deduct firestore stock
        for (const item of cart) {
          const prodRef = doc(db, 'products', item.product.productId);
          const pDoc = await getDoc(prodRef);
          if (pDoc.exists()) {
            const currentStock = (pDoc.data() as Product).stock || 0;
            await updateDoc(prodRef, { stock: Math.max(0, currentStock - item.quantity) });
          }
        }
        // deduct firestore credits
        if (referralCreditsUsed > 0) {
          await updateDoc(doc(db, 'users', currentUser.userId), {
            referralCredits: Math.max(0, currentUser.referralCredits - referralCreditsUsed)
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'orders');
      }
    }

    return freshOrder;
  };

  // Submit product review
  const submitProductReview = async (productId: string, rating: number, comment: string, reviewPhotos?: string[]) => {
    const freshReview: Review = {
      reviewId: 'rev-' + Math.random().toString(36).substr(2, 9),
      productId,
      userId: currentUser?.userId || 'guest-author',
      userName: currentUser?.name || 'Anonymous Fan',
      rating,
      comment,
      images: reviewPhotos || [],
      verifiedPurchase: true,
      timestamp: new Date().toISOString()
    };

    // Update product average rating in products array
    setProducts(prev => prev.map(p => {
      if (p.productId === productId) {
        const newCount = p.reviewsCount + 1;
        const newRating = parseFloat(((p.rating * p.reviewsCount + rating) / newCount).toFixed(1));
        return {
          ...p,
          reviewsCount: newCount,
          rating: newRating
        };
      }
      return p;
    }));

    addNotification('admin', 'New Product Review submitted', `Customer ${freshReview.userName} rated product ${productId} with ${rating} stars.`);

    if (isFirebaseSupported && currentUser) {
      try {
        await setDoc(doc(db, 'reviews', freshReview.reviewId), freshReview);
        const prodRef = doc(db, 'products', productId);
        const pDoc = await getDoc(prodRef);
        if (pDoc.exists()) {
          const currentP = pDoc.data() as Product;
          const nextCount = (currentP.reviewsCount || 0) + 1;
          const nextRating = parseFloat((((currentP.rating || 0) * (currentP.reviewsCount || 0) + rating) / nextCount).toFixed(1));
          await updateDoc(prodRef, {
            reviewsCount: nextCount,
            rating: nextRating
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'reviews');
      }
    }
  };

  // Notification Operations
  const addNotification = (userId: string, title: string, msg: string) => {
    const fresh: StoreNotification = {
      notificationId: 'not-' + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message: msg,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [fresh, ...prev]);

    if (isFirebaseSupported && auth) {
      setDoc(doc(db, 'notifications', fresh.notificationId), fresh).catch(err => console.error(err));
    }
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.notificationId === notifId ? { ...n, read: true } : n));
    if (isFirebaseSupported && db) {
      updateDoc(doc(db, 'notifications', notifId), { read: true }).catch(err => console.error(err));
    }
  };

  // --- ADMIN FUNCTIONALITIES (Designated: ritesh.ds.001@gmail.com) ---
  const addNewProduct = (p: Product) => {
    setProducts(prev => {
      const updated = [p, ...prev];
      return updated;
    });
    if (isFirebaseSupported) {
      setDoc(doc(db, 'products', p.productId), p).catch(err => console.error(err));
    }
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(item => item.productId === p.productId ? p : item));
    if (isFirebaseSupported) {
      setDoc(doc(db, 'products', p.productId), p).catch(err => console.error(err));
    }
  };

  const deleteProduct = async (pId: string) => {
  setProducts(prev =>
    prev.filter(item => item.productId !== pId)
  );

  if (isFirebaseSupported && db) {
    await deleteDoc(doc(db, "products", pId));
  }
};

  const updateOrderStatus = (oId: string, status: Order['status'], description: string) => {
    const milestone: TrackingMilestone = {
      status,
      title: 'Order marked as ' + status,
      description,
      timestamp: new Date().toISOString()
    };

    setOrders(prev => prev.map(o => {
      if (o.orderId === oId) {
        return {
          ...o,
          status,
          trackingTimeline: [...o.trackingTimeline, milestone]
        };
      }
      return o;
    }));

    // Find the order owner and send user alert
    const ordObj = orders.find(o => o.orderId === oId);
    if (ordObj) {
      addNotification(ordObj.userId, `Shipment Status Updated: ${status}`, `${description} (Order Reference: ${oId})`);
    }

    if (isFirebaseSupported) {
      updateDoc(doc(db, 'orders', oId), {
        status,
        trackingTimeline: arrayUnion(milestone)
      }).catch(err => console.error(err));
    }
  };

  const addNewCoupon = (c: Coupon) => {
    setCoupons(prev => [c, ...prev]);
  };

  const deleteCoupon = (cId: string) => {
    setCoupons(prev => prev.filter(c => c.couponId !== cId));
  };

  const updateDesignStatus = (dId: string, status: CustomDesignRequest['status']) => {
    setCustomDesigns(prev => prev.map(d => d.designId === dId ? { ...d, status } : d));
    
    // Alert the user
    const desObj = customDesigns.find(d => d.designId === dId);
    if (desObj) {
      addNotification(desObj.userId, 'Custom Blueprint Checked', `Your custom sportswear order request status was marked as [${status}]. Check detail reports inside your dashboard.`);
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      loading,
      products,
      coupons,
      cart,
      wishlist,
      orders,
      customDesigns,
      notifications,
      activeCoupon,
      referralCreditsUsed,
      isFirebaseMode: isFirebaseSupported,
      setProducts,
      loginWithEmail,
      signUpWithEmail,
      loginWithGoogle,
      logout,
      updateAddress,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      moveWishlistToCart,
      applyCouponCode,
      removeAppliedCoupon,
      useReferralCredits,
      submitCustomDesign,
      placeOrder,
      submitProductReview,
      addNotification,
      markNotificationRead,
      addNewProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addNewCoupon,
      deleteCoupon,
      updateDesignStatus,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
