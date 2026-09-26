import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/db";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  sortBy?: "newest" | "price-asc" | "price-desc" | "popular" | "rating";
  limit?: number;
  offset?: number;
};

export type ProductWithCategory = Product & {
  category?: Pick<Category, "id" | "slug" | "name"> | null;
};

export type ProductWithDetails = ProductWithCategory & {
  primary_image: string | null;
  category_name: string | null;
};

// ══════════════════════════════════════════════════════════
// Fetch Products (with filters)
// ══════════════════════════════════════════════════════════
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    isFeatured,
    isOnSale,
    isNewArrival,
    sortBy = "newest",
    limit = 60,
    offset = 0,
  } = filters;

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, slug, name)
    `
    )
    .eq("is_active", true);

  // Category filter
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  // Search filter
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // Price filter
  if (minPrice !== undefined) {
    query = query.gte("base_price", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("base_price", maxPrice);
  }

  // Featured filter
  if (isFeatured) {
    query = query.eq("is_featured", true);
  }

  // Sale filter — products with compare_at_price > base_price
  if (isOnSale) {
    query = query.not("compare_at_price", "is", null);
  }

  // New arrivals — products created in last 30 days
  if (isNewArrival) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte("created_at", thirtyDaysAgo.toISOString());
  }

  // Sort
  switch (sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price-asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("base_price", { ascending: false });
      break;
    case "popular":
      query = query.order("total_sold", { ascending: false });
      break;
    case "rating":
      query = query.order("rating_avg", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error("getProducts error:", error);
    return [];
  }

  // Map with primary image
  return (data || []).map((p: any) => ({
    ...p,
    primary_image: `/products/${p.slug}.jpg`,
    category_name: p.category?.name ?? null,
  }));
}

// ══════════════════════════════════════════════════════════
// Fetch Single Product by Slug
// ══════════════════════════════════════════════════════════
export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, slug, name)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    console.error("getProductBySlug error:", error);
    return null;
  }

  return {
    ...data,
    primary_image: `/products/${data.slug}.jpg`,
    category_name: (data as any).category?.name ?? null,
  } as ProductWithDetails;
}

// ══════════════════════════════════════════════════════════
// Fetch Featured Products (homepage)
// ══════════════════════════════════════════════════════════
export async function getFeaturedProducts(
  limit: number = 4
): Promise<ProductWithDetails[]> {
  return getProducts({ isFeatured: true, sortBy: "popular", limit });
}

// ══════════════════════════════════════════════════════════
// Fetch Related Products (product detail page)
// ══════════════════════════════════════════════════════════
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit: number = 4
): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  if (!categoryId) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, slug, name)
    `
    )
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts error:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    primary_image: `/products/${p.slug}.jpg`,
    category_name: p.category?.name ?? null,
  }));
}

// ══════════════════════════════════════════════════════════
// Fetch Products by IDs (order/cart)
// ══════════════════════════════════════════════════════════
export async function getProductsByIds(
  ids: string[]
): Promise<ProductWithDetails[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, slug, name)
    `
    )
    .in("id", ids);

  if (error) {
    console.error("getProductsByIds error:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    primary_image: `/products/${p.slug}.jpg`,
    category_name: p.category?.name ?? null,
  }));
}


// ══════════════════════════════════════════════════════════
// Get Featured Products (for homepage)
// ══════════════════════════════════════════════════════════
export async function getFeaturedProductsForHome(
  limit: number = 4
): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, slug, name)
    `
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("total_sold", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProductsForHome error:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    primary_image: `/products/${p.slug}.jpg`,
    category_name: p.category?.name ?? null,
  }));
}