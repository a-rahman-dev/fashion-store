"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, discountPercent } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { showToast } from "@/components/ui/toast";

// ──────────────────────────────────────────────────────────
// Type
// ──────────────────────────────────────────────────────────
export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  category_name?: string | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  is_featured?: boolean;
  total_sold?: number;
};

// ──────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────
export function ProductCard({
  product,
  className,
}: {
  product: ProductCardData;
  className?: string;
}) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist, isLoaded } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.base_price;
  const discount = hasDiscount
    ? discountPercent(product.compare_at_price!, product.base_price)
    : 0;

  const inWishlist = isLoaded && isInWishlist(product.id);

  // ── Quick Add Handler ──────────────────────────────────────
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.base_price,
      image_url: product.image_url ?? "",
      size: "One Size",
      quantity: 1,
    });

    showToast(`"${product.name}" added to cart`, "success");

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // ── Wishlist Handler ───────────────────────────────────────
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasInWishlist = isInWishlist(product.id);

    toggleItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.base_price,
      compare_price: product.compare_at_price ?? null,
      image_url: product.image_url ?? "",
      category_name: product.category_name ?? null,
      rating_avg: product.rating_avg ?? 0,
    });

    showToast(
      wasInWishlist ? `Removed from wishlist` : `Added to wishlist`,
      wasInWishlist ? "info" : "success"
    );
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn("group block fade-in-up", className)}
    >
      <div className="glass-card overflow-hidden h-full flex flex-col">
        {/* Image wrapper */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-4xl text-[#6B6678]">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge variant="sale">-{discount}%</Badge>
            </div>
          )}

          {/* Featured badge */}
          {product.is_featured && !hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge variant="info">Featured</Badge>
            </div>
          )}

          {/* Wishlist button — shows state */}
          <button
            type="button"
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 z-10",
              inWishlist
                ? "bg-[#FF5C5C] border-[#FF5C5C] text-white opacity-100 shadow-[0_0_16px_rgba(255,92,92,0.5)]"
                : "bg-[#0B0A14]/60 border-[rgba(255,200,120,0.15)] text-[#F5EFE7] opacity-0 group-hover:opacity-100 hover:bg-[#FF9A3C] hover:border-[#FF9A3C] hover:text-[#0B0A14]"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                inWishlist && "fill-current scale-110"
              )}
            />
          </button>

          {/* Quick add button (hover) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              "absolute bottom-3 left-3 right-3 flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-300 z-10",
              justAdded
                ? "bg-[#3ECF8E] text-[#0B0A14] opacity-100 translate-y-0 shadow-[0_4px_16px_rgba(62,207,142,0.3)]"
                : "bg-[#FF9A3C] text-[#0B0A14] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-[0_4px_16px_rgba(255,154,60,0.3)]"
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Quick Add
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category */}
          {product.category_name && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1.5">
              {product.category_name}
            </p>
          )}

          {/* Name */}
          <h3 className="text-sm font-medium text-[#F5EFE7] line-clamp-2 group-hover:text-[#FF9A3C] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating_avg !== undefined &&
            product.rating_avg !== null &&
            product.rating_avg > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i <= Math.round(product.rating_avg!)
                          ? "fill-[#F4D06F] text-[#F4D06F]"
                          : "text-[#6B6678]"
                      )}
                    />
                  ))}
                </div>
                {product.rating_count ? (
                  <span className="text-[10px] text-[#6B6678]">
                    ({product.rating_count})
                  </span>
                ) : null}
              </div>
            )}

          {/* Price */}
          <div className="mt-auto pt-3 flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#FF9A3C]">
              {formatPrice(product.base_price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#6B6678] line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}