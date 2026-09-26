// ══════════════════════════════════════════════════════════
// LUVÉRA — Database Types
// Auto-synced with Supabase schema
// ══════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────
// Core Types
// ──────────────────────────────────────────────────────────
export type UUID = string;
export type Timestamp = string;
export type Currency = "PKR";

// ──────────────────────────────────────────────────────────
// Profiles
// ──────────────────────────────────────────────────────────
export type ProfileRole = "customer" | "seller";

export interface Profile {
  id: UUID;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: ProfileRole;
  avatar_url: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────────────────
export interface Category {
  id: UUID;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: UUID | null;
  sort_order: number;
  is_active: boolean;
  created_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────────────────
export interface Product {
  id: UUID;
  slug: string;
  name: string;
  description: string | null;
  category_id: UUID | null;
  base_price: number;
  compare_at_price: number | null;
  currency: Currency;
  is_active: boolean;
  is_featured: boolean;
  tags: string[] | null;
  total_sold: number;
  rating_avg: number | null;
  rating_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Product Images
// ──────────────────────────────────────────────────────────
export interface ProductImage {
  id: UUID;
  product_id: UUID;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Product Variants
// ──────────────────────────────────────────────────────────
export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  sku: string | null;
  size: string | null;
  color: string | null;
  price_override: number | null;
  stock: number;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Addresses
// ──────────────────────────────────────────────────────────
export interface Address {
  id: UUID;
  user_id: UUID;
  label: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  created_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Cart Items
// ──────────────────────────────────────────────────────────
export interface CartItem {
  id: UUID;
  user_id: UUID;
  variant_id: UUID;
  quantity: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Coupons
// ──────────────────────────────────────────────────────────
export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: UUID;
  code: string;
  description: string | null;
  discount_type: CouponType;
  discount_value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  per_user_limit: number | null;
  valid_from: Timestamp;
  valid_until: Timestamp | null;
  is_active: boolean;
  created_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface Order {
  id: UUID;
  order_number: string;
  user_id: UUID | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  total: number;
  currency: Currency;
  coupon_code: string | null;
  shipping_address: ShippingAddress;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ──────────────────────────────────────────────────────────
// Order Items
// ──────────────────────────────────────────────────────────
export interface OrderItem {
  id: UUID;
  order_id: UUID;
  variant_id: UUID | null;
  product_name: string;
  variant_label: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
  created_at: Timestamp;
}