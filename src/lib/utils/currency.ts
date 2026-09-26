import { STORE } from "@/lib/constants";

/**
 * Format a number as PKR currency
 * 3500 → "Rs. 3,500"
 */
export function formatPrice(amount: number, currency = STORE.currencySymbol): string {
  return `${currency} ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Calculate discount percentage
 * (5000, 3500) → 30
 */
export function discountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Calculate order total with tax + delivery
 */
export function calculateTotal(
  subtotal: number,
  options: {
    taxRate?: number;
    deliveryFee?: number;
    freeDeliveryAbove?: number;
    discount?: number;
  } = {}
): { subtotal: number; discount: number; tax: number; delivery: number; total: number } {
  const {
    taxRate = 0.15,
    deliveryFee = 200,
    freeDeliveryAbove = 5000,
    discount = 0,
  } = options;

  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = Math.round(afterDiscount * taxRate);
  const delivery = afterDiscount >= freeDeliveryAbove ? 0 : deliveryFee;
  const total = afterDiscount + tax + delivery;

  return { subtotal, discount, tax, delivery, total };
}