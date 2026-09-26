import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/db";

// ══════════════════════════════════════════════════════════
// Fetch All Active Categories
// ══════════════════════════════════════════════════════════
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories error:", error);
    return [];
  }

  return data || [];
}

// ══════════════════════════════════════════════════════════
// Fetch Single Category by Slug
// ══════════════════════════════════════════════════════════
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("getCategoryBySlug error:", error);
    return null;
  }

  return data;
}

// ══════════════════════════════════════════════════════════
// Fetch Categories with Product Counts
// ══════════════════════════════════════════════════════════
export type CategoryWithCount = Category & {
  product_count: number;
};

export async function getCategoriesWithCounts(): Promise<
  CategoryWithCount[]
> {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (catError || !categories) {
    console.error("getCategoriesWithCounts error:", catError);
    return [];
  }

  const { data: products } = await supabase
    .from("products")
    .select("category_id")
    .eq("is_active", true);

  const countMap = new Map<string, number>();
  (products || []).forEach((p: any) => {
    if (p.category_id) {
      countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
    }
  });

  return categories.map((c) => ({
    ...c,
    product_count: countMap.get(c.id) ?? 0,
  }));
}