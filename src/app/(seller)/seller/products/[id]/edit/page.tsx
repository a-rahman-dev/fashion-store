import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/db/queries/categories";
import { ProductForm } from "../../components/ProductForm";

export const metadata = {
  title: "Edit Product — Seller Console",
};

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations ProductForm (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductForm
        categories={categories}
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          category_id: product.category_id ?? "",
          base_price: Number(product.base_price),
          compare_at_price: product.compare_at_price
            ? Number(product.compare_at_price)
            : null,
          image_url: `/products/${product.slug}.jpg`,
          is_active: product.is_active,
          is_featured: product.is_featured,
          tags: product.tags ?? [],
        }}
      />
    </div>
  );
}