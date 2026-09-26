"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import type { AIProductResult } from "@/lib/ai/tool-handlers";

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function AIProductCard({ product }: { product: AIProductResult }) {
  const hasDiscount =
    product.compare_price && product.compare_price > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group relative block rounded-xl border border-[rgba(255,200,120,0.12)] bg-white/[0.03] overflow-hidden transition-all duration-300 hover:border-[rgba(255,154,60,0.35)] hover:bg-[rgba(255,154,60,0.05)] hover:shadow-[0_0_24px_-8px_rgba(255,154,60,0.5)]"
      >
        {/* Top hairline glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        <div className="flex items-center gap-3 p-2.5">
          {/* Image */}
          <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-lg text-[#6B6678]">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#F5EFE7] line-clamp-1 group-hover:text-[#FF9A3C] transition-colors">
              {product.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-[#6B6678] line-through">
                  {formatPrice(product.compare_price!)}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="h-3.5 w-3.5 text-[#6B6678] group-hover:text-[#FF9A3C] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}