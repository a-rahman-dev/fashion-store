import { createClient } from "@/lib/supabase/server";
import type { Coupon, CouponType } from "@/types/db";

// ══════════════════════════════════════════════════════════
// Get All Coupons
// ══════════════════════════════════════════════════════════
export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCoupons error:", error);
    return [];
  }

  return data ?? [];
}

// ══════════════════════════════════════════════════════════
// Coupon Stats
// ══════════════════════════════════════════════════════════
export type CouponStats = {
  totalCoupons: number;
  activeCoupons: number;
  totalUses: number;
  totalDiscountGiven: number;
};

export function computeCouponStats(coupons: Coupon[]): CouponStats {
  return {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(
      (c) =>
        c.is_active &&
        (!c.valid_until || new Date(c.valid_until) > new Date())
    ).length,
    totalUses: coupons.reduce((sum, c) => sum + (c.used_count ?? 0), 0),
    totalDiscountGiven: 0, // baad mein real orders se
  };
}

// ══════════════════════════════════════════════════════════
// Coupon Form Validation
// ══════════════════════════════════════════════════════════
export type CouponFormData = {
  code: string;
  description: string;
  discount_type: CouponType;
  discount_value: number;
  min_order_amount: number;
  usage_limit: number | null;
  valid_until: string | null;
  is_active: boolean;
};