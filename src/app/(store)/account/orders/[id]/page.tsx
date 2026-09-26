import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getCustomerOrderDetail } from "@/lib/db/queries/customer-orders";
import { CustomerOrderDetail } from "./components/CustomerOrderDetail";

export const metadata = {
  title: "Order Details — Luvéra",
};

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/login?redirect=/account/orders/${id}`);
  }

  const order = await getCustomerOrderDetail(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <CustomerOrderDetail order={order} />
    </div>
  );
}