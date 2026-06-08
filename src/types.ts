/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  referralCode: string;
  referredBy?: string;
  referralCredits: number;
  address?: ShippingAddress;
  createdAt: string;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  category: 'jerseys' | 'oversized' | 'vests';
  subcategory?: string; // e.g., 'Anime', 'Minimal', 'Stringers'
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  specs: {
    fit?: string;
    fabric?: string;
    care?: string;
    [key: string]: string | undefined;
  };
  country?: string; // For jerseys
}

export interface Customization {
  playerName: string;
  playerNumber: string;
  customBadgeUrl?: string;
}

export interface CartItem {
  cartId: string; // unique ID for this cart combinatorics
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  customization?: Customization;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface TrackingMilestone {
  status: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  orderId: string;
  userId: string;
  customerEmail: string;
  products: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
    customization?: Customization;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out For Delivery' | 'Delivered';
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  trackingTimeline: TrackingMilestone[];
  timestamp: string;
}

export interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  timestamp: string;
}

export interface WishlistItem {
  wishlistId: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface Coupon {
  couponId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
}

export interface Referral {
  referralId: string;
  referrerId: string;
  referredUserId: string;
  rewardClaimed: boolean;
  discountCreditCode?: string;
  timestamp: string;
}

export interface CustomDesignRequest {
  designId: string;
  userId: string;
  email: string;
  productType: 'Football Jersey' | 'Oversized Tee' | 'Gym Vest';
  notes: string;
  imageUrl: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'In Work' | 'Completed';
  timestamp: string;
}

export interface StoreNotification {
  notificationId: string;
  userId: string; // user ID or "admin"
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}
