import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/db/queries/products";
import { ProductCard } from "@/components/store/ProductCard";
import { AddToCartForm } from "./components/AddToCartForm";
import { Badge } from "@/components/ui/badge";
import { formatPrice, discountPercent } from "@/lib/utils/currency";
import { ProductDetailContent } from "./components/ProductDetailContent";

// ══════════════════════════════════════════════════════════
// Server page — data fetch
// Animations ProductDetailContent (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.id, product.category_id, 4)
    : [];

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.base_price;
  const discount = hasDiscount
    ? discountPercent(product.compare_at_price!, product.base_price)
    : 0;

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={relatedProducts}
      hasDiscount={!!hasDiscount}
      discount={discount}
    />
  );
}