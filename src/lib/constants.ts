// ══════════════════════════════════════════════════════════
// LUVÉRA — Brand Identity
// "Wear the night."
// ══════════════════════════════════════════════════════════
export const STORE = {
  name: "Luvéra",
  tagline: "Wear the night.",
  description: "Modern fashion, after dark.",
  email: "hello@luvera.store",
  phone: "+92-21-1234567",
  address: "123 Fashion Avenue, Karachi, Pakistan",
  currency: "PKR",
  currencySymbol: "Rs.",
  timezone: "Asia/Karachi",
  social: {
    instagram: "@luvera.store",
    facebook: "luverastore",
    tiktok: "@luvera.store",
  },
} as const;

// ══════════════════════════════════════════════════════════
// Navigation
// ══════════════════════════════════════════════════════════
export const NAV_LINKS: ReadonlyArray<{
  href: string;
  label: string;
  highlight?: boolean;
}> = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=watches", label: "Watches" },
  { href: "/shop?category=jewelry", label: "Jewelry" },
  { href: "/shop?category=bags", label: "Bags" },
  { href: "/shop?category=sale", label: "Sale", highlight: true },
];

// ══════════════════════════════════════════════════════════
// Categories (matches Supabase)
// ══════════════════════════════════════════════════════════
export const CATEGORIES = [
  { slug: "women", name: "Women" },
  { slug: "men", name: "Men" },
  { slug: "footwear", name: "Footwear" },
  { slug: "watches", name: "Watches" },
  { slug: "jewelry", name: "Jewelry" },
  { slug: "bags", name: "Bags" },
  { slug: "new-arrivals", name: "New Arrivals" },
  { slug: "sale", name: "Sale" },
] as const;

// ══════════════════════════════════════════════════════════
// Product Sizes
// ══════════════════════════════════════════════════════════
export const SIZES = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"] as const,
  footwear: ["36", "37", "38", "39", "40", "41", "42", "43", "44"] as const,
  accessories: ["One Size"] as const,
  watches: ["One Size"] as const,
} as const;

// ══════════════════════════════════════════════════════════
// Order Rules
// ══════════════════════════════════════════════════════════
export const ORDER = {
  taxRate: 0.15,
  deliveryFee: 200,
  freeDeliveryAbove: 5000,
  minOrderAmount: 500,
  currency: "PKR",
} as const;

// ══════════════════════════════════════════════════════════
// Coupon Types
// ══════════════════════════════════════════════════════════
export const COUPON_TYPES = ["percentage", "fixed", "free_shipping"] as const;
export type CouponType = (typeof COUPON_TYPES)[number];

// ══════════════════════════════════════════════════════════
// Order Status Flow
// ══════════════════════════════════════════════════════════
export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

// ══════════════════════════════════════════════════════════
// AI Assistant
// ══════════════════════════════════════════════════════════
export const AI = {
  maxToolRounds: 5,
  maxHistoryMessages: 10,
  maxResponseTokens: 2000,
} as const;

// ══════════════════════════════════════════════════════════
// Session
// ══════════════════════════════════════════════════════════
export const SESSION_COOKIE = "luvera_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours