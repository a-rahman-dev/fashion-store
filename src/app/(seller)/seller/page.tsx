import {
  getSellerStats,
  getRecentOrders,
  getTopProducts,
  getRevenueChartData,
} from "@/lib/db/queries/seller-stats";
import { StatsCards } from "./components/StatsCards";
import { RevenueChart } from "./components/RevenueChart";
import { RecentOrders } from "./components/RecentOrders";
import { TopProducts } from "./components/TopProducts";
import { DashboardWelcome } from "./components/DashboardWelcome";

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations client components mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerDashboardPage() {
  const [stats, recentOrders, topProducts, revenueData] = await Promise.all([
    getSellerStats(),
    getRecentOrders(5),
    getTopProducts(5),
    getRevenueChartData(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardWelcome />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <RecentOrders orders={recentOrders} />
        </div>
      </div>

      <TopProducts products={topProducts} />
    </div>
  );
}