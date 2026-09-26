"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Loader2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils/currency";

export function WishlistContent() {
  const { items, isLoaded, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  // ── Loading ───────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="glass-card p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9A3C] mx-auto" />
        <p className="mt-4 text-sm text-[#9A94A8]">Loading wishlist...</p>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="glass-card p-12 sm:p-16 text-center fade-in-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5C5C] to-[#E74C3C] shadow-[0_0_30px_rgba(255,92,92,0.3)]">
          <Heart className="h-9 w-9 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE7] mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-[#9A94A8] max-w-md mx-auto mb-8">
          Save your favourite pieces here and shop them whenever you&apos;re ready.
        </p>
        <Link href="/shop">
          <Button size="lg" className="group">
            <ShoppingBag className="h-4 w-4" />
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    );
  }

  // ── Add to Cart ───────────────────────────────────────────
  const handleAddToCart = (item: typeof items[number]) => {
    addItem({
      product_id: item.product_id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      size: "One Size",
      quantity: 1,
    });
    showToast(`"${item.name}" added to cart`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6B6678]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
        <button
          onClick={clearWishlist}
          className="text-xs text-[#FF5C5C] hover:text-[#ff4444] transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.product_id} className="glass-card overflow-hidden group">
            {/* Image */}
            <Link
              href={`/shop/${item.slug}`}
              className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F]"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-4xl text-[#6B6678]">
                    {item.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(item.product_id);
                  showToast(`Removed from wishlist`, "info");
                }}
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0A14]/70 backdrop-blur-md border border-[rgba(255,92,92,0.3)] text-[#FF5C5C] opacity-0 group-hover:opacity-100 hover:bg-[#FF5C5C] hover:text-white transition-all z-10"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Link>

            {/* Info */}
            <div className="p-4 space-y-3">
              {item.category_name && (
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678]">
                  {item.category_name}
                </p>
              )}

              <Link href={`/shop/${item.slug}`}>
                <h3 className="text-sm font-medium text-[#F5EFE7] line-clamp-2 hover:text-[#FF9A3C] transition-colors">
                  {item.name}
                </h3>
              </Link>

              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-[#FF9A3C]">
                  {formatPrice(item.price)}
                </span>
                {item.compare_price && item.compare_price > item.price && (
                  <span className="text-xs text-[#6B6678] line-through">
                    {formatPrice(item.compare_price)}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <Button
                onClick={() => handleAddToCart(item)}
                size="sm"
                className="w-full"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}