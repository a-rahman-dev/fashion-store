import { getOrdersForSeller, computeOrderStats } from "@/lib/db/queries/orders";
import { OrdersList } from "./components/OrdersList";
import { OrdersHeader } from "./components/OrdersHeader";

export const metadata = {
  title: "Orders — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations OrdersHeader + OrdersList (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerOrdersPage() {
  const orders = await getOrdersForSeller();
  const stats = computeOrderStats(orders);

  return (
    <div className="space-y-6">
      <OrdersHeader />

      <OrdersList orders={orders} stats={stats} />
    </div>
  );
}