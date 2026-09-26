import { getCoupons, computeCouponStats } from "@/lib/db/queries/coupons";
import { CouponsList } from "./components/CouponsList";
import { CouponsHeader } from "./components/CouponsHeader";

export const metadata = {
  title: "Coupons — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations client components mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerCouponsPage() {
  const coupons = await getCoupons();
  const stats = computeCouponStats(coupons);

  return (
    <div className="space-y-6">
      <CouponsHeader />

      <CouponsList coupons={coupons} stats={stats} />
    </div>
  );
}