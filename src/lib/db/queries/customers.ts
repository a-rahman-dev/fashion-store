import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/db";

// ══════════════════════════════════════════════════════════
// Customer with order stats
// ══════════════════════════════════════════════════════════
export type CustomerWithStats = Profile & {
  orders_count: number;
  total_spent: number;
  last_order_date: string | null;
};

// ══════════════════════════════════════════════════════════
// Get All Customers
// ══════════════════════════════════════════════════════════
export async function getCustomers(): Promise<CustomerWithStats[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCustomers error:", error);
    return [];
  }

  return (profiles ?? []).map((p) => ({
    ...p,
    orders_count: 0,
    total_spent: 0,
    last_order_date: null,
  }));
}

// ══════════════════════════════════════════════════════════
// Customer Stats
// ══════════════════════════════════════════════════════════
export type CustomerStats = {
  totalCustomers: number;
  newThisMonth: number;
  activeCustomers: number;
  totalOrders: number;
};

export function computeCustomerStats(
  customers: CustomerWithStats[]
): CustomerStats {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return {
    totalCustomers: customers.length,
    newThisMonth: customers.filter((c) => new Date(c.created_at) >= monthStart)
      .length,
    activeCustomers: customers.filter((c) => c.orders_count > 0).length,
    totalOrders: customers.reduce((sum, c) => sum + c.orders_count, 0),
  };
}