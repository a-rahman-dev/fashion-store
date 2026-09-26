"use client";

import { useState, useEffect, useCallback } from "react";
import { STORE, ORDER } from "@/lib/constants";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type StoreSettings = {
  // Store info
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;

  // Shipping
  deliveryFee: number;
  freeDeliveryAbove: number;

  // Tax
  taxRate: number; // as decimal (0.15 = 15%)

  // Social
  instagram: string;
  facebook: string;
  tiktok: string;
};

const STORAGE_KEY = "luvera_store_settings";

const DEFAULT_SETTINGS: StoreSettings = {
  name: STORE.name,
  tagline: STORE.tagline,
  description: STORE.description,
  email: STORE.email,
  phone: STORE.phone,
  address: STORE.address,
  deliveryFee: ORDER.deliveryFee,
  freeDeliveryAbove: ORDER.freeDeliveryAbove,
  taxRate: ORDER.taxRate,
  instagram: STORE.social.instagram,
  facebook: STORE.social.facebook,
  tiktok: STORE.social.tiktok,
};

// ══════════════════════════════════════════════════════════
// Hook
// ══════════════════════════════════════════════════════════
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // ── Save ──────────────────────────────────────────────────
  const saveSettings = useCallback((newSettings: StoreSettings) => {
    setSettings(newSettings);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      window.dispatchEvent(new CustomEvent("settings-updated"));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }, []);

  // ── Reset ─────────────────────────────────────────────────
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("settings-updated"));
    } catch (e) {
      console.error("Failed to reset settings:", e);
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
    defaultSettings: DEFAULT_SETTINGS,
  };
}