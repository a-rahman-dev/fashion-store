import { Suspense } from "react";
import { getProducts, type ProductFilters } from "@/lib/db/queries/products";
import { getCategories } from "@/lib/db/queries/categories";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { ShopContent } from "./components/ShopContent";

// ══════════════════════════════════════════════════════════
// Server page — sirf data fetch karta hai
// Animations ShopContent (client) mein hain
// ══════════════════════════════════════════════════════════
type SearchParams = Promise<{
  category?: string;
  sort?: string;
  search?: string;
  min?: string;
  max?: string;
  sale?: string;
}>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const filters: ProductFilters = {
    categorySlug: params.category,
    search: params.search,
    minPrice: params.min ? parseInt(params.min) : undefined,
    maxPrice: params.max ? parseInt(params.max) : undefined,
    isOnSale: params.sale === "true",
    sortBy: (params.sort as ProductFilters["sortBy"]) ?? "newest",
    limit: 60,
  };

  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const currentCategory = params.category
    ? categories.find((c) => c.slug === params.category)
    : null;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent
        products={products}
        categories={categories}
        currentCategory={currentCategory ?? null}
        params={{
          category: params.category,
          sort: params.sort ?? "newest",
          sale: params.sale === "true",
        }}
      />
    </Suspense>
  );
}