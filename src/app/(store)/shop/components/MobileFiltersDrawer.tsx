"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ShopFilters } from "./ShopFilters";
import type { Category } from "@/types/db";
import { cn } from "@/lib/utils/cn";

export function MobileFiltersDrawer({
  categories,
  currentCategory,
  currentSale,
}: {
  categories: Category[];
  currentCategory?: string;
  currentSale?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Mobile Filters Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "lg:hidden flex items-center gap-2 rounded-lg px-3 py-2",
          "border border-[rgba(255,200,120,0.15)] bg-white/[0.03]",
          "text-xs font-medium text-[#9A94A8]",
          "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
          "hover:shadow-[0_0_16px_-4px_rgba(255,154,60,0.5)]",
          "transition-all duration-300"
        )}
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[120] flex justify-end lg:hidden">
            {/* Backdrop */}
            <motion.div
              key="filters-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              key="filters-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className={cn(
                "relative w-full max-w-sm h-full flex flex-col",
                "bg-[#0B0A14]/95 backdrop-blur-2xl",
                "border-l border-[rgba(255,200,120,0.15)]",
                "shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.9)]"
              )}
            >
              {/* Top hairline glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
              />

              {/* Header */}
              <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(255,200,120,0.10)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_20px_-4px_rgba(255,154,60,0.6)]">
                    <SlidersHorizontal
                      className="h-4 w-4 text-[#0B0A14]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-[#F5EFE7]">
                      Filters
                    </h2>
                    <p className="text-[10px] uppercase tracking-wider text-[#6B6678]">
                      Refine your search
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setOpen(false)}
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <ShopFilters
                  categories={categories}
                  currentCategory={currentCategory}
                  currentSale={currentSale}
                  onFilterClick={() => setOpen(false)}
                />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}