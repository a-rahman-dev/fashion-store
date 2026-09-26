"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { CouponFormData } from "@/lib/db/queries/coupons";

// ══════════════════════════════════════════════════════════
// Validation
// ══════════════════════════════════════════════════════════
const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code is too long")
    .transform((v) => v.toUpperCase().trim()),
  description: z.string().optional().nullable(),
  discount_type: z.enum(["percentage", "fixed", "free_shipping"]),
  discount_value: z.number().min(0),
  min_order_amount: z.number().min(0),
  usage_limit: z.number().min(1).nullable(),
  valid_until: z.string().nullable(),
  is_active: z.boolean(),
});

// ══════════════════════════════════════════════════════════
// Create Coupon
// ══════════════════════════════════════════════════════════
export async function createCoupon(data: CouponFormData) {
  const parsed = couponSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { valid_until, ...rest } = parsed.data;

  const { error } = await supabase.from("coupons").insert({
    ...rest,
    description: rest.description || null,
    valid_until: valid_until || null,
    used_count: 0,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A coupon with this code already exists" };
    }
    return { error: error.message };
  }

  revalidatePath("/seller/coupons");
  return { success: true };
}

// ══════════════════════════════════════════════════════════
// Toggle Coupon Active
// ══════════════════════════════════════════════════════════
export async function toggleCouponActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/coupons");
  return { success: true };
}

// ══════════════════════════════════════════════════════════
// Delete Coupon
// ══════════════════════════════════════════════════════════
export async function deleteCoupon(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/coupons");
  return { success: true };
}