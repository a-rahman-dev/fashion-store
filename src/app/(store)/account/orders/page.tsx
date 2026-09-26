import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import {
  getCustomerOrders,
  computeCustomerOrderStats,
} from "@/lib/db/queries/customer-orders";
import { OrdersList } from "./components/OrdersList";

export const metadata = {
  title: "My Orders — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — auth + data fetch
// Animations OrdersList (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function AccountOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const orders = await getCustomerOrders();
  const stats = computeCustomerOrderStats(orders);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          My Account
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-[#9A94A8]">
          Track and manage your orders
        </p>
      </div>

      <OrdersList orders={orders} stats={stats} />
    </div>
  );
}