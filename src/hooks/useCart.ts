"use client";

import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  size?: string;
  color?: string;
  quantity: number;
};

const STORAGE_KEY = "luvera_cart";

// ══════════════════════════════════════════════════════════
// Hook
// ══════════════════════════════════════════════════════════
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load from localStorage on mount ──────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
    setIsLoaded(true);
  }, []);

  // ── Persist to localStorage on change ────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      // Dispatch custom event so navbar can update count
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [items, isLoaded]);

  // ── Add item ─────────────────────────────────────────────
  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product_id === newItem.product_id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }

      return [...prev, newItem];
    });
  }, []);

  // ── Remove item ──────────────────────────────────────────
  const removeItem = useCallback(
    (productId: string, size?: string, color?: string) => {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product_id === productId &&
              item.size === size &&
              item.color === color
            )
        )
      );
    },
    []
  );

  // ── Update quantity ──────────────────────────────────────
  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product_id === productId &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  // ── Clear cart ───────────────────────────────────────────
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // ── Computed values ──────────────────────────────────────
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    itemCount,
    subtotal,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}

// ══════════════════════════════════════════════════════════
// Utility — read cart from localStorage (for non-hook usage)
// ══════════════════════════════════════════════════════════
export function getCartItemCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const items: CartItem[] = JSON.parse(stored);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}