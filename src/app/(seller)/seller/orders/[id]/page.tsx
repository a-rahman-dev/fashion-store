import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db/queries/orders";
import { OrderDetail } from "./components/OrderDetail";

export const metadata = {
  title: "Order Details — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations OrderDetail (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <OrderDetail order={order} />
    </div>
  );
}