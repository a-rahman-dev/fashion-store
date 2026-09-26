import {
  getCustomers,
  computeCustomerStats,
} from "@/lib/db/queries/customers";
import { CustomersList } from "./components/CustomersList";
import { CustomersHeader } from "./components/CustomersHeader";

export const metadata = {
  title: "Customers — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations client components mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerCustomersPage() {
  const customers = await getCustomers();
  const stats = computeCustomerStats(customers);

  return (
    <div className="space-y-6">
      <CustomersHeader />

      <CustomersList customers={customers} stats={stats} />
    </div>
  );
}