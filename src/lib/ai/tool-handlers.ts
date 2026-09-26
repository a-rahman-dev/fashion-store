import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/currency";

// ══════════════════════════════════════════════════════════
// Product result type (what AI returns)
// ══════════════════════════════════════════════════════════
export type AIProductResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  category: string | null;
  rating: number;
  in_stock: boolean;
};

// ══════════════════════════════════════════════════════════
// Handle Tool Call
// ══════════════════════════════════════════════════════════
export async function handleToolCall(
  name: string,
  args: Record<string, any>
): Promise<{ result: any; products?: AIProductResult[] }> {
  try {
    switch (name) {
      case "search_products":
        return await searchProducts({
          query: args.query as string | undefined,
          category: args.category as string | undefined,
          max_price: args.max_price as number | undefined,
          min_price: args.min_price as number | undefined,
          limit: args.limit as number | undefined,
        });
      case "get_product_details":
        return await getProductDetails({
          slug: args.slug as string,
        });
      case "check_stock":
        return await checkStock({
          slug: args.slug as string,
        });
      case "recommend_similar":
        return await recommendSimilar({
          slug: args.slug as string,
          limit: args.limit as number | undefined,
        });
      default:
        return { result: { error: `Unknown tool: ${name}` } };
    }
  } catch (e: any) {
    console.error(`Tool ${name} error:`, e);
    return { result: { error: e.message } };
  }
}

// ══════════════════════════════════════════════════════════
// Search Products
// ══════════════════════════════════════════════════════════
async function searchProducts(args: {
  query?: string;
  category?: string;
  max_price?: number;
  min_price?: number;
  limit?: number;
}): Promise<{ result: any; products: AIProductResult[] }> {
  const supabase = await createClient();
  const limit = Math.min(args.limit ?? 5, 10);

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, base_price, compare_at_price, total_sold, rating_avg, category:categories(name)"
    )
    .eq("is_active", true)
    .limit(limit);

  // Category filter
  if (args.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", args.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  // Search filter
  if (args.query) {
    query = query.ilike("name", `%${args.query}%`);
  }

  // Price filters
  if (args.max_price !== undefined) {
    query = query.lte("base_price", args.max_price);
  }
  if (args.min_price !== undefined) {
    query = query.gte("base_price", args.min_price);
  }

  // Order by popular
  query = query.order("total_sold", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return { result: { error: error.message }, products: [] };
  }

  const products: AIProductResult[] = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.base_price),
    compare_price: p.compare_at_price
      ? Number(p.compare_at_price)
      : null,
    image_url: `/products/${p.slug}.jpg`,
    category: p.category?.[0]?.name ?? null,
    rating: Number(p.rating_avg ?? 0),
    in_stock: true, // baad mein variants se check karenge
  }));

  return {
    result: {
      count: products.length,
      products: products.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: formatPrice(p.price),
        category: p.category,
        rating: p.rating,
      })),
    },
    products,
  };
}

// ══════════════════════════════════════════════════════════
// Get Product Details
// ══════════════════════════════════════════════════════════
async function getProductDetails(args: {
  slug: string;
}): Promise<{ result: any; products: AIProductResult[] }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, base_price, compare_at_price, total_sold, rating_avg, rating_count, tags, category:categories(name)"
    )
    .eq("slug", args.slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return {
      result: { error: "Product not found" },
      products: [],
    };
  }

  const product: AIProductResult = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: Number(data.base_price),
    compare_price: data.compare_at_price
      ? Number(data.compare_at_price)
      : null,
    image_url: `/products/${data.slug}.jpg`,
    category: (data as any).category?.[0]?.name ?? null,
    rating: Number(data.rating_avg ?? 0),
    in_stock: true,
  };

  return {
    result: {
      name: data.name,
      description: data.description,
      price: formatPrice(Number(data.base_price)),
      compare_price: data.compare_at_price
        ? formatPrice(Number(data.compare_at_price))
        : null,
      category: product.category,
      rating: data.rating_avg,
      rating_count: data.rating_count,
      sold: data.total_sold,
      tags: data.tags,
    },
    products: [product],
  };
}

// ══════════════════════════════════════════════════════════
// Check Stock
// ══════════════════════════════════════════════════════════
async function checkStock(args: {
  slug: string;
}): Promise<{ result: any; products?: AIProductResult[] }> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("name, is_active")
    .eq("slug", args.slug)
    .single();

  if (!data) {
    return { result: { in_stock: false, message: "Product not found" } };
  }

  return {
    result: {
      product: data.name,
      in_stock: data.is_active,
      message: data.is_active
        ? "Yes, this product is currently available"
        : "Currently out of stock",
    },
  };
}

// ══════════════════════════════════════════════════════════
// Recommend Similar
// ══════════════════════════════════════════════════════════
async function recommendSimilar(args: {
  slug: string;
  limit?: number;
}): Promise<{ result: any; products: AIProductResult[] }> {
  const supabase = await createClient();
  const limit = Math.min(args.limit ?? 3, 6);

  // Get reference product
  const { data: ref } = await supabase
    .from("products")
    .select("id, category_id, base_price")
    .eq("slug", args.slug)
    .single();

  if (!ref) {
    return {
      result: { error: "Reference product not found" },
      products: [],
    };
  }

  // Find similar (same category, exclude reference)
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, base_price, compare_at_price, total_sold, rating_avg, category:categories(name)"
    )
    .eq("is_active", true)
    .eq("category_id", ref.category_id)
    .neq("id", ref.id)
    .order("total_sold", { ascending: false })
    .limit(limit);

  const products: AIProductResult[] = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.base_price),
    compare_price: p.compare_at_price ? Number(p.compare_at_price) : null,
    image_url: `/products/${p.slug}.jpg`,
    category: p.category?.[0]?.name ?? null,
    rating: Number(p.rating_avg ?? 0),
    in_stock: true,
  }));

  return {
    result: {
      count: products.length,
      recommendations: products.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: formatPrice(p.price),
      })),
    },
    products,
  };
}