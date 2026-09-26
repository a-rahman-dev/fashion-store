"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
] as const;

export function ShopSort({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Newest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center justify-between gap-2",
          "min-w-[110px] rounded-lg px-3 py-2 text-xs",
          "bg-[#12101F] text-[#F5EFE7] border",
          "transition-colors duration-200",
          open
            ? "border-[#FF9A3C]"
            : "border-[rgba(255,200,120,0.15)] hover:border-[rgba(255,200,120,0.3)]"
        )}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open ? "rotate-180 text-[#FF9A3C]" : "text-[#9A94A8]"
          )}
        />
      </button>

      {/* Dropdown — button ke bilkul neeche */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute left-0 right-0 top-full mt-1.5 z-50",
              "rounded-xl p-1.5 overflow-hidden",
              "bg-[#0B0A14]/95 backdrop-blur-2xl",
              "border border-[rgba(255,200,120,0.15)]",
              "shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)]"
            )}
          >
            {SORT_OPTIONS.map((option) => {
              const active = option.value === currentSort;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => handleChange(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2",
                      "rounded-lg px-3 py-2 text-xs text-left",
                      "transition-colors duration-150",
                      active
                        ? "bg-[rgba(255,154,60,0.12)] text-[#FF9A3C] font-medium"
                        : "text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7]"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {active && (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#FF9A3C]"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}