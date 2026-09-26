"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, TrendingUp, Star, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Product type
   ══════════════════════════════════════════════════════════ */
type Product = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  total_sold: number;
  rating_avg: number | null;
  category: { name: string }[] | null;
};

export function TopProducts({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent"
      />

      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
            Best Sellers
          </p>
          <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
            Top Products
          </h3>
        </div>

        <Link
          href="/seller/products"
          className="group flex items-center gap-1 text-xs text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════
          EMPTY STATE
      ═══════════════════════════════════════════ */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 320,
              damping: 22,
            }}
            className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)]"
          >
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#FF9A3C]"
            />
            <Package className="relative h-5 w-5 text-[#FF9A3C]" />
          </motion.div>
          <p className="text-sm text-[#9A94A8] mb-1">No products yet</p>
          <p className="text-xs text-[#6B6678] max-w-[220px]">
            Top-selling products will appear here
          </p>
        </motion.div>
      ) : (
        /* ═══════════════════════════════════════════
            PRODUCTS LIST
        ═══════════════════════════════════════════ */
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-2"
        >
          {products.map((product, index) => {
            const categoryName =
              product.category && product.category.length > 0
                ? product.category[0].name
                : null;

            const isTop = index === 0;
            const isPodium = index < 3;

            return (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                transition={spring}
                whileHover={{ x: 3 }}
              >
                <Link
                  href={`/seller/products/${product.id}/edit`}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-lg border p-3",
                    "transition-all duration-300",
                    isTop
                      ? "border-[rgba(255,154,60,0.25)] bg-[rgba(255,154,60,0.04)] hover:border-[rgba(255,154,60,0.45)] hover:shadow-[0_0_24px_-8px_rgba(255,154,60,0.5)]"
                      : "border-[rgba(255,200,120,0.08)] bg-white/[0.02] hover:border-[rgba(255,154,60,0.3)] hover:bg-[rgba(255,154,60,0.05)] hover:shadow-[0_0_20px_-8px_rgba(255,154,60,0.4)]"
                  )}
                >
                  {/* Rank */}
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-display font-bold text-xs",
                      isTop
                        ? "bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] shadow-[0_0_16px_rgba(255,154,60,0.55),0_1px_0_rgba(255,255,255,0.3)_inset]"
                        : isPodium
                        ? "bg-[rgba(255,154,60,0.15)] text-[#FF9A3C] border border-[rgba(255,154,60,0.3)]"
                        : "bg-white/[0.05] text-[#9A94A8] border border-white/[0.05]"
                    )}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {categoryName && (
                        <span className="text-[10px] text-[#6B6678] uppercase tracking-wider">
                          {categoryName}
                        </span>
                      )}
                      {product.rating_avg && product.rating_avg > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-[#9A94A8]">
                          <Star className="h-2.5 w-2.5 fill-[#F4D06F] text-[#F4D06F]" />
                          {product.rating_avg.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                      {formatPrice(product.base_price)}
                    </p>
                    <p className="text-[10px] text-[#6B6678] flex items-center justify-end gap-1">
                      <TrendingUp className="h-2.5 w-2.5 text-[#3ECF8E]" />
                      {product.total_sold} sold
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}