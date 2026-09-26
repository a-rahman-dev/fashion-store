import { OrderSuccess } from "./components/OrderSuccess";

export const metadata = {
  title: "Order Confirmed — Luvéra",
};

type SearchParams = Promise<{
  order?: string;
}>;

// ══════════════════════════════════════════════════════════
// Server page — searchParams parse + layout
// Animations OrderSuccess (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderNumber = params.order;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <OrderSuccess orderNumber={orderNumber} />
    </div>
  );
}