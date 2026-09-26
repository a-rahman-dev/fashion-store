import { getProducts } from "@/lib/db/queries/products";
import { ProductsTable } from "./components/ProductsTable";
import { ProductsHeader } from "./components/ProductsHeader";

export const metadata = {
  title: "Products — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations client components mein hain
// ══════════════════════════════════════════════════════════
export default async function SellerProductsPage() {
  const products = await getProducts({ limit: 100 });

  return (
    <div className="space-y-6">
      <ProductsHeader />
      <ProductsTable products={products} />
    </div>
  );
}