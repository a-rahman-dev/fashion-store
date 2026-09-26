"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/db";

export function ShopFilters({
  categories,
  currentCategory,
  currentSale,
  onFilterClick,
}: {
  categories: Category[];
  currentCategory?: string;
  currentSale?: boolean;
  onFilterClick?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="glass-card relative p-5 space-y-6 rounded-2xl border border-[rgba(255,200,120,0.10)] overflow-hidden shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]">
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      {/* ── Categories ──────────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-3 relative inline-block">
          Categories
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
          />
        </h3>
        <ul className="space-y-1 mt-4">
          <FilterLink
            href={buildUrl({ category: null })}
            active={!currentCategory}
            onClick={onFilterClick}
          >
            All Products
          </FilterLink>

          {categories.map((category) => {
            const active = currentCategory === category.slug;
            return (
              <FilterLink
                key={category.id}
                href={buildUrl({ category: category.slug })}
                active={active}
                onClick={onFilterClick}
              >
                {category.name}
              </FilterLink>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="ember-divider my-0" />

      {/* ── Special Filters ─────────────────────────── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-3 relative inline-block">
          Special
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
          />
        </h3>
        <ul className="space-y-1 mt-4">
          <li>
            <Link
              href={buildUrl({ sale: currentSale ? null : "true" })}
              onClick={onFilterClick}
              className={cn(
                "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-300",
                currentSale
                  ? "bg-[rgba(255,154,60,0.12)] text-[#FF9A3C] font-medium border border-[rgba(255,154,60,0.25)] shadow-[0_0_20px_-6px_rgba(255,154,60,0.4)]"
                  : "text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] border border-transparent hover:border-[rgba(255,200,120,0.12)]"
              )}
            >
              <span>On Sale</span>
              <span className="flex h-4 w-4 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {currentSale && (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Check
                        className="h-3.5 w-3.5 text-[#FF9A3C]"
                        strokeWidth={3}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* ── Clear All ──────────────────────────────── */}
      <AnimatePresence initial={false}>
        {(currentCategory || currentSale) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ember-divider my-0" />
            <Link
              href={pathname}
              onClick={onFilterClick}
              className="block mt-4 text-center rounded-lg px-3 py-2 text-xs font-medium text-[#FF9A3C] border border-[rgba(255,154,60,0.2)] hover:bg-[rgba(255,154,60,0.1)] hover:border-[#FF9A3C] hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.5)] transition-all duration-300"
            >
              Clear All Filters
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FilterLink — reusable with premium active state
   ══════════════════════════════════════════════════════════ */
function FilterLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group relative block rounded-lg px-3 py-2 text-sm transition-all duration-300",
          active
            ? "bg-[rgba(255,154,60,0.12)] text-[#FF9A3C] font-medium border border-[rgba(255,154,60,0.25)] shadow-[0_0_20px_-6px_rgba(255,154,60,0.4)]"
            : "text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] border border-transparent hover:border-[rgba(255,200,120,0.12)] hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.3)]"
        )}
      >
        <span className="relative z-10">{children}</span>

        {/* Active left accent bar */}
        {active && (
          <motion.span
            layoutId="shopfilter-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r-full bg-[#FF9A3C] shadow-[0_0_8px_rgba(255,154,60,0.8)]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </li>
  );
}