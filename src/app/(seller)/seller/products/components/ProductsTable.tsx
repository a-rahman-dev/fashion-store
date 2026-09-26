"use client";

import { useState, useMemo, useTransition, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Package,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { deleteProduct } from "../actions";
import { cn } from "@/lib/utils/cn";
import type { ProductWithDetails } from "@/lib/db/queries/products";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

type SortKey = "name" | "price-asc" | "price-desc" | "popular";

export function ProductsTable({
  products,
}: {
  products: ProductWithDetails[];
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("popular");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ProductWithDetails | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  /* ── Categories from products ───────────────────── */
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return Array.from(set).sort();
  }, [products]);

  /* ── Filtered + sorted ─────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category_name === categoryFilter);
    }

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        list.sort((a, b) => a.base_price - b.base_price);
        break;
      case "price-desc":
        list.sort((a, b) => b.base_price - a.base_price);
        break;
      case "popular":
        list.sort((a, b) => b.total_sold - a.total_sold);
        break;
    }

    return list;
  }, [products, search, categoryFilter, sortBy]);

  /* ── Stats ─────────────────────────────────────── */
  const stats = [
    { label: "Total Products", value: products.length, icon: Package },
    {
      label: "In Catalog",
      value: products.filter((p) => p.is_active).length,
      icon: Package,
    },
    {
      label: "Featured",
      value: products.filter((p) => p.is_featured).length,
      icon: Star,
    },
    {
      label: "On Sale",
      value: products.filter(
        (p) => p.compare_at_price && p.compare_at_price > p.base_price
      ).length,
      icon: TrendingUp,
    },
  ];

  /* ── Handle Delete ─────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const result = await deleteProduct(deleteTarget.id);

    if (result && "error" in result && result.error) {
      showToast(result.error, "error");
      setDeleting(false);
      return;
    }

    showToast(`"${deleteTarget.name}" deleted successfully`, "success");
    setDeleteTarget(null);
    setDeleting(false);

    startTransition(() => {
      // Server action revalidates on next navigation
    });
  };

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <motion.div
        ref={statsRef}
        variants={stagger}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            variants={fadeInUp}
            transition={{ ...spring, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_18px_40px_-16px_rgba(0,0,0,0.7),0_0_28px_-8px_rgba(255,154,60,0.2)] cursor-default"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)]">
                <Icon className="h-3 w-3 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678]">
                {label}
              </p>
            </div>
            <p className="font-display text-xl font-bold text-[#F5EFE7] transition-colors group-hover:text-[#FF9A3C]">
              {value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          FILTERS BAR
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={spring}
        className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3">
          {/* Search */}
          <div className="relative w-full group/search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6678] pointer-events-none z-10 transition-colors group-focus-within/search:text-[#FF9A3C]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
              className="w-full h-11 ember-input text-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 ember-input text-sm bg-[#12101F] text-[#F5EFE7] cursor-pointer w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-11 ember-input text-sm bg-[#12101F] text-[#F5EFE7] cursor-pointer w-full"
          >
            <option value="popular">Most Popular</option>
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
          </select>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          RESULTS COUNT
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between text-xs"
      >
        <p className="text-[#6B6678] uppercase tracking-wider">
          Showing{" "}
          <span className="text-[#FF9A3C] font-semibold">
            {filtered.length}
          </span>{" "}
          of {products.length} products
        </p>
        <AnimatePresence>
          {(search || categoryFilter !== "all") && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
              className="text-[#FF9A3C] hover:text-[#FFB566] transition-colors"
            >
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════
          TABLE
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent z-10"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,200,120,0.08)] bg-white/[0.02]">
                {[
                  { label: "Product", cls: "" },
                  { label: "Category", cls: "hidden sm:table-cell" },
                  { label: "Price", cls: "" },
                  { label: "Sold", cls: "hidden md:table-cell" },
                  { label: "Rating", cls: "hidden lg:table-cell" },
                  { label: "Actions", cls: "text-right" },
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={cn(
                      "text-left text-[10px] uppercase tracking-wider text-[#6B6678] font-medium px-4 py-3",
                      cls
                    )}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-sm text-[#9A94A8] mb-1">
                        No products found
                      </p>
                      <p className="text-xs text-[#6B6678]">
                        Try changing filters or search
                      </p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((product, i) => {
                    const hasDiscount =
                      product.compare_at_price &&
                      product.compare_at_price > product.base_price;

                    return (
                      <motion.tr
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i * 0.02, 0.3),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group/row border-b border-[rgba(255,200,120,0.05)] hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]">
                              {product.primary_image ? (
                                <img
                                  src={product.primary_image}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover/row:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <span className="font-display text-sm text-[#6B6678]">
                                    {product.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/seller/products/${product.id}/edit`}
                                className="text-sm font-medium text-[#F5EFE7] hover:text-[#FF9A3C] transition-colors line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                {product.is_featured && (
                                  <Badge variant="info" className="text-[9px]">
                                    Featured
                                  </Badge>
                                )}
                                {hasDiscount && (
                                  <Badge variant="sale" className="text-[9px]">
                                    Sale
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-[#9A94A8]">
                            {product.category_name ?? "—"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover/row:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                              {formatPrice(product.base_price)}
                            </p>
                            {hasDiscount && (
                              <p className="text-[10px] text-[#6B6678] line-through">
                                {formatPrice(product.compare_at_price!)}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Sold */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-[#9A94A8]">
                            {product.total_sold}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {product.rating_avg && product.rating_avg > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-[#F4D06F] text-[#F4D06F]" />
                              <span className="text-xs text-[#9A94A8]">
                                {product.rating_avg.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#6B6678]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                            <motion.div
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={spring}
                            >
                              <Link
                                href={`/seller/products/${product.id}/edit`}
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                                  "border border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8]",
                                  "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
                                  "hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]",
                                  "transition-all duration-300"
                                )}
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Link>
                            </motion.div>

                            {/* Delete */}
                            <motion.button
                              onClick={() => setDeleteTarget(product)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                              className={cn(
                                "inline-flex items-center justify-center h-7 w-7 rounded-lg",
                                "border border-[rgba(255,92,92,0.15)] bg-[rgba(255,92,92,0.05)]",
                                "text-[#9A94A8]",
                                "hover:border-[#FF5C5C] hover:text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.1)]",
                                "hover:shadow-[0_0_16px_-4px_rgba(255,92,92,0.5)]",
                                "transition-all duration-300"
                              )}
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          DELETE CONFIRMATION DIALOG
      ═══════════════════════════════════════════ */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
      >
        {deleteTarget && (
          <>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-[rgba(255,92,92,0.25)] shadow-[0_0_24px_-6px_rgba(255,92,92,0.55)]"
            >
              <motion.span
                aria-hidden
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#FF5C5C]"
              />
              <Trash2 className="relative h-5 w-5 text-[#FF5C5C]" />
            </motion.div>

            {/* Text */}
            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-bold text-[#F5EFE7] mb-2">
                Delete Product?
              </h3>
              <p className="text-sm text-[#9A94A8]">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#F5EFE7]">
                  &ldquo;{deleteTarget.name}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <motion.button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                whileHover={!deleting ? { y: -1 } : {}}
                whileTap={!deleting ? { scale: 0.97 } : {}}
                transition={spring}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl",
                  "bg-[#FF5C5C] text-white text-sm font-semibold",
                  "hover:bg-[#ff4444]",
                  "hover:shadow-[0_8px_24px_rgba(255,92,92,0.5)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-300"
                )}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}