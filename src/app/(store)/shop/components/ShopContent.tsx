"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "./ShopFilters";
import { ShopSort } from "./ShopSort";
import { MobileFiltersDrawer } from "./MobileFiltersDrawer";
import type { Category } from "@/types/db";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────
type Product = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  compare_at_price?: number | null;
  primary_image?: string | null;
  category_name?: string | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  is_featured?: boolean;
  total_sold?: number;
};

type ShopContentProps = {
  products: Product[];
  categories: Category[];
  currentCategory: { slug: string; name: string } | null;
  params: {
    category?: string;
    sort: string;
    sale: boolean;
  };
};

export function ShopContent({
  products,
  categories,
  currentCategory,
  params,
}: ShopContentProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          Shop
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-[#9A94A8]">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </motion.div>

      {/* ── Layout: Sidebar + Grid ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters Sidebar — Desktop only */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block lg:sticky lg:top-24 lg:h-fit"
        >
          <ShopFilters
            categories={categories}
            currentCategory={params.category}
            currentSale={params.sale}
          />
        </motion.aside>

        {/* Products */}
        <div>
          {/* Sort bar + Mobile Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[rgba(255,200,120,0.08)]"
          >
            {/* Left side: Mobile Filters + Count */}
            <div className="flex items-center gap-3">
              <MobileFiltersDrawer
                categories={categories}
                currentCategory={params.category}
                currentSale={params.sale}
              />
              <p className="text-xs text-[#6B6678] uppercase tracking-wider">
                Showing {products.length} results
              </p>
            </div>

            {/* Right side: Sort */}
            <ShopSort currentSort={params.sort} />
          </motion.div>

          {/* Grid / Empty state */}
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              ref={gridRef}
              variants={stagger}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <ProductCard
                    product={{
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      base_price: product.base_price,
                      compare_at_price: product.compare_at_price,
                      image_url: product.primary_image,
                      category_name: product.category_name,
                      rating_avg: product.rating_avg,
                      rating_count: product.rating_count,
                      is_featured: product.is_featured,
                      total_sold: product.total_sold,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Empty State
   ══════════════════════════════════════════════════════════ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-12 text-center rounded-2xl border border-[rgba(255,200,120,0.10)]"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)] mb-4"
      >
        <PackageOpen className="h-6 w-6 text-[#FF9A3C]" />
      </motion.div>

      <p className="text-[#F5EFE7] text-base font-medium mb-1.5">
        No products found
      </p>
      <p className="text-xs text-[#6B6678]">
        Try changing filters or browse a different category
      </p>
    </motion.div>
  );
}