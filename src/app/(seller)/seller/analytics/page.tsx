import {
  getCategoryAnalytics,
  getTopProductsByRevenue,
  getRevenueData30Days,
  getStatusDistribution,
  getAnalyticsStats,
} from "@/lib/db/queries/analytics";
import { AnalyticsContent } from "./components/AnalyticsContent";
import { AnalyticsHeader } from "./components/AnalyticsHeader";

export const metadata = {
  title: "Analytics — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations client components mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerAnalyticsPage() {
  const [stats, categories, topProducts, revenueData, statusDistribution] =
    await Promise.all([
      getAnalyticsStats(),
      getCategoryAnalytics(),
      getTopProductsByRevenue(5),
      getRevenueData30Days(),
      getStatusDistribution(),
    ]);

  return (
    <div className="space-y-6">
      <AnalyticsHeader />

      <AnalyticsContent
        stats={stats}
        categories={categories}
        topProducts={topProducts}
        revenueData={revenueData}
        statusDistribution={statusDistribution}
      />
    </div>
  );
}