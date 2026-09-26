import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type CategoryStat = {
  name: string;
  products_count: number;
  total_sold: number;
  avg_price: number;
};

export type TopProductByRevenue = {
  id: string;
  name: string;
  slug: string;
  category_name: string | null;
  total_sold: number;
  base_price: number;
  revenue: number;
};

export type StatusDistribution = {
  status: string;
  count: number;
  color: string;
};

// ══════════════════════════════════════════════════════════
// Category Analytics
// ══════════════════════════════════════════════════════════
export async function getCategoryAnalytics(): Promise<CategoryStat[]> {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order");

  if (!categories) return [];

  const { data: products } = await supabase
    .from("products")
    .select("category_id, base_price, total_sold")
    .eq("is_active", true);

  return categories.map((cat) => {
    const catProducts =
      products?.filter((p) => p.category_id === cat.id) ?? [];
    const total_sold = catProducts.reduce(
      (sum, p) => sum + (p.total_sold ?? 0),
      0
    );
    const avg_price =
      catProducts.length > 0
        ? catProducts.reduce((sum, p) => sum + Number(p.base_price), 0) /
          catProducts.length
        : 0;

    return {
      name: cat.name,
      products_count: catProducts.length,
      total_sold,
      avg_price,
    };
  });
}

// ══════════════════════════════════════════════════════════
// Top Products by Revenue
// ══════════════════════════════════════════════════════════
export async function getTopProductsByRevenue(
  limit: number = 5
): Promise<TopProductByRevenue[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, base_price, total_sold, category:categories(name)"
    )
    .eq("is_active", true)
    .order("total_sold", { ascending: false })
    .limit(limit);

  return (data ?? []).map((p: any) => {
    const revenue = Number(p.base_price) * (p.total_sold ?? 0);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_name: p.category?.[0]?.name ?? null,
      total_sold: p.total_sold ?? 0,
      base_price: Number(p.base_price),
      revenue,
    };
  });
}

// ══════════════════════════════════════════════════════════
// Revenue Chart (Last 30 days — simulated)
// ══════════════════════════════════════════════════════════
export type RevenueDataPoint = {
  date: string;
  label: string;
  revenue: number;
};

export async function getRevenueData30Days(): Promise<RevenueDataPoint[]> {
  // Filhaal mock — real orders aane pe real data
  const data: RevenueDataPoint[] = [];
  const baseValue = 15000;

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Simulate realistic revenue fluctuation
    const variation = Math.sin(i * 0.5) * 8000 + Math.random() * 10000;
    const revenue = Math.max(0, Math.round(baseValue + variation));

    data.push({
      date: d.toISOString(),
      label: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue,
    });
  }

  return data;
}

// ══════════════════════════════════════════════════════════
// Order Status Distribution (from mock data)
// ══════════════════════════════════════════════════════════
export function getStatusDistribution(): StatusDistribution[] {
  // Ye mock hai — baad mein real orders se
  return [
    { status: "Delivered", count: 3, color: "#3ECF8E" },
    { status: "Shipped", count: 1, color: "#FF9A3C" },
    { status: "Processing", count: 1, color: "#FFB84D" },
    { status: "Confirmed", count: 1, color: "#7DA9FF" },
    { status: "Pending", count: 1, color: "#FFB84D" },
    { status: "Cancelled", count: 1, color: "#FF5C5C" },
  ];
}

// ══════════════════════════════════════════════════════════
// Overall Analytics Stats
// ══════════════════════════════════════════════════════════
export type AnalyticsStats = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalProducts: number;
  avgRating: number;
  totalSold: number;
};

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("base_price, total_sold, rating_avg")
    .eq("is_active", true);

  const totalProducts = products?.length ?? 0;
  const totalSold =
    products?.reduce((sum, p) => sum + (p.total_sold ?? 0), 0) ?? 0;
  const totalRevenue =
    products?.reduce(
      (sum, p) => sum + Number(p.base_price) * (p.total_sold ?? 0),
      0
    ) ?? 0;
  const avgRating =
    products && products.length > 0
      ? products.reduce((sum, p) => sum + Number(p.rating_avg ?? 0), 0) /
        products.length
      : 0;

  return {
    totalRevenue,
    totalOrders: 8, // Mock
    avgOrderValue: totalRevenue / 8,
    totalProducts,
    avgRating,
    totalSold,
  };
}