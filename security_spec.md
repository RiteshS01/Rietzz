# RIETZZ Store Security Rules Specification

This document details the security specification for the RIETZZ premium sportswear platform. It outlines data invariants, security payloads, and test plans to ensure standard security compliance.

## 1. Data Invariants and Relational Syncs

*   **User Profiles (`/users/{userId}`)**: Users can only create or update their own profile document where `userId == request.auth.uid`. No user can set their own role to `"admin"` during creation or modification (only `ritesh.ds.001@gmail.com` can have `role` as `"admin"`, or admin roles must be checked in the DB).
*   **Products (`/products/{productId}`)**: Read access is public. Write access (create, update, delete) is restricted exclusively to administrators.
*   **Orders (`/orders/{orderId}`)**: Users can read and write only their own orders (`userId == request.auth.uid`). Admins can read and update all orders. Once order status is marked `"Delivered"`, it is terminal and cannot be directly updated by generic clients.
*   **Reviews (`/reviews/{reviewId}`)**: Read access is public. Customers can only write a review if authenticated, and can only edit or delete their own reviews.
*   **Wishlist (`/wishlist/{wishlistId}`)**: Authenticated users can modify and query their own wishlist records.
*   **Coupons (`/coupons/{couponId}`)**: Read access is public to check codes. Write access is restricted to administrators.
*   **Referrals (`/referrals/{referralId}`)**: Read and write access allows referencing user connections.
*   **Custom Designs (`/custom_designs/{designId}`)**: Users can read or write their own custom design orders. Admins can view and manage all requests.
*   **Notifications (`/notifications/{notificationId}`)**: Users can read notification docs assigned to their userId.

## 2. Invariants Check - The "Dirty Dozen" Payloads

1.  **Identity Spoofing**: User A attempts to write a user profile at `/users/UserB` setting `userId` to `UserB`. (Expected: Denied)
2.  **Role Escalation**: User A attempts to create `/users/UserA` with `"role": "admin"`. (Expected: Denied)
3.  **Malicious Inventory Override**: User A attempts to modify the price of a product inside `/products/jersey1`. (Expected: Denied)
4.  **Order Spoofing**: User A attempts to read User B's order history under `/orders/order123`. (Expected: Denied)
5.  **Status Shortcutting**: User A attempts to mark their own pending order status from `"Pending"` to `"Delivered"` directly. (Expected: Denied)
6.  **Admin Coupon Forgery**: User A attempts to create a custom discount voucher code `FREE100` yielding 100% off inside `/coupons/free`. (Expected: Denied)
7.  **Review Hijacking**: User A attempts to edit a review with ID `/reviews/rev123` owned by User B. (Expected: Denied)
8.  **Notification Sniffing**: User A attempts to query global notifications or read private admin alerts inside `/notifications/notif123`. (Expected: Denied)
9.  **Relational Poisoning**: User A attempts to order a custom design using target `userId: "admin"` to hijack admin status. (Expected: Denied)
10. **Resource Poisoning (1MB ID)**: User A attempts to write an order containing a 2MB generated ID to crash parsing engines. (Expected: Denied)
11. **Improper Timestamp Forge**: User A attempts to set order timestamp back to 2015 to acquire free shipping or older terms. (Expected: Denied)
12. **Anonymous Write Attack**: An unauthenticated user attempts to create a custom design request inside `/custom_designs/req1`. (Expected: Denied)

## 3. Standard Firebase Rules Draft

Let's publish this draft into `/firestore.rules` inside succeeding actions.
