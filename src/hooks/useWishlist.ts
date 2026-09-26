"use client";

import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type WishlistItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  category_name: string | null;
  rating_avg: number;
  added_at: string;
};

const STORAGE_KEY = "luvera_wishlist";

// ══════════════════════════════════════════════════════════
// Hook
// ══════════════════════════════════════════════════════════
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load from localStorage ────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    }
    setIsLoaded(true);
  }, []);

  // ── Persist to localStorage ───────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [items, isLoaded]);

  // ── Add item ──────────────────────────────────────────────
  const addItem = useCallback((item: Omit<WishlistItem, "added_at">) => {
    setItems((prev) => {
      if (prev.some((i) => i.product_id === item.product_id)) {
        return prev; // already exists
      }
      return [...prev, { ...item, added_at: new Date().toISOString() }];
    });
  }, []);

  // ── Remove item ───────────────────────────────────────────
  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }, []);

  // ── Toggle item ───────────────────────────────────────────
  const toggleItem = useCallback(
    (item: Omit<WishlistItem, "added_at">) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.product_id === item.product_id);
        if (exists) {
          return prev.filter((i) => i.product_id !== item.product_id);
        }
        return [...prev, { ...item, added_at: new Date().toISOString() }];
      });
    },
    []
  );

  // ── Check if in wishlist ──────────────────────────────────
  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.product_id === productId),
    [items]
  );

  // ── Clear all ─────────────────────────────────────────────
  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    count: items.length,
    isLoaded,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
  };
}

// ══════════════════════════════════════════════════════════
// Get wishlist count (non-hook)
// ══════════════════════════════════════════════════════════
export function getWishlistCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const items: WishlistItem[] = JSON.parse(stored);
    return items.length;
  } catch {
    return 0;
  }
}