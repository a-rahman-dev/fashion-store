import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
// Seller Dashboard Stats
// ══════════════════════════════════════════════════════════
export type SellerStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  avgOrderValue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
};

export async function getSellerStats(): Promise<SellerStats> {
  const supabase = await createClient();

  // Total products
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Total orders (ye filhaal 0 honge)
  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .neq("status", "cancelled");

  const totalRevenue =
    orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // This month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const ordersThisMonth =
    orders?.filter((o) => new Date(o.created_at) >= monthStart).length ?? 0;
  const revenueThisMonth =
    orders
      ?.filter((o) => new Date(o.created_at) >= monthStart)
      .reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  // Customers (profiles with role customer)
  const { count: customersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  return {
    totalRevenue,
    totalOrders,
    totalProducts: productsCount ?? 0,
    totalCustomers: customersCount ?? 0,
    avgOrderValue,
    ordersThisMonth,
    revenueThisMonth,
  };
}

// ══════════════════════════════════════════════════════════
// Recent Orders (last 5)
// ══════════════════════════════════════════════════════════
export async function getRecentOrders(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ══════════════════════════════════════════════════════════
// Top Products (by total_sold)
// ══════════════════════════════════════════════════════════
export async function getTopProducts(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, base_price, total_sold, rating_avg, category:categories(name)")
    .eq("is_active", true)
    .order("total_sold", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ══════════════════════════════════════════════════════════
// Revenue Chart Data (last 7 days)
// ══════════════════════════════════════════════════════════
export async function getRevenueChartData() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at")
    .neq("status", "cancelled")
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    );

  // Build 7 days
  const days: { date: string; label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders =
      orders?.filter((o) => {
        const odate = new Date(o.created_at);
        return odate >= d && odate < nextDay;
      }) ?? [];

    days.push({
      date: d.toISOString(),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      value: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
    });
  }

  return days;
}