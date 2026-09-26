"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Titles map
   ══════════════════════════════════════════════════════════ */
const TITLES: Record<string, string> = {
  "/seller": "Dashboard",
  "/seller/products": "Products",
  "/seller/orders": "Orders",
  "/seller/customers": "Customers",
  "/seller/coupons": "Coupons",
  "/seller/analytics": "Analytics",
  "/seller/settings": "Settings",
};

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

export function SellerHeader() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "px-4 sm:px-6 lg:px-8",
        "bg-[#0B0A14]/80 backdrop-blur-2xl",
        "border-b border-[rgba(255,200,120,0.08)]",
        "shadow-[0_1px_0_rgba(255,200,120,0.05)_inset,0_8px_32px_-12px_rgba(0,0,0,0.7)]"
      )}
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      {/* ═══════════════════════════════════════════
          TITLE
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 pl-12 lg:pl-0"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678]">
            Luvéra Seller Console
          </p>
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-base font-semibold text-[#F5EFE7]"
          >
            {title}
          </motion.h1>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ACTIONS
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2"
      >
        {/* ── Live indicator ─────────────────────── */}
        <div
          className={cn(
            "hidden items-center gap-2 rounded-full px-3 py-1.5 sm:flex",
            "border border-[rgba(62,207,142,0.25)] bg-[rgba(62,207,142,0.08)]",
            "shadow-[0_0_16px_-6px_rgba(62,207,142,0.5)]"
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ECF8E] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ECF8E] shadow-[0_0_6px_rgba(62,207,142,0.9)]" />
          </span>
          <span className="text-[11px] font-medium text-[#3ECF8E]">Live</span>
        </div>

        {/* ── Add Product ────────────────────────── */}
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} transition={spring}>
          <Link
            href="/seller/products/new"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "border border-[rgba(255,154,60,0.25)] bg-[rgba(255,154,60,0.08)] text-[#FF9A3C]",
              "hover:bg-[rgba(255,154,60,0.15)] hover:border-[rgba(255,154,60,0.4)]",
              "hover:shadow-[0_0_20px_-6px_rgba(255,154,60,0.5)]",
              "transition-all duration-300"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </motion.div>

        {/* ── Search ─────────────────────────────── */}
        <IconButton label="Search">
          <Search className="h-4 w-4" />
        </IconButton>

        {/* ── Notifications ──────────────────────── */}
        <IconButton label="Notifications" badge>
          <Bell className="h-4 w-4" />
        </IconButton>
      </motion.div>
    </motion.header>
  );
}

/* ══════════════════════════════════════════════════════════
   Reusable icon button
   ══════════════════════════════════════════════════════════ */
function IconButton({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={cn(
        "relative rounded-lg p-2",
        "border border-[rgba(255,200,120,0.08)] bg-white/[0.03]",
        "text-[#9A94A8]",
        "hover:border-[rgba(255,200,120,0.20)] hover:bg-white/[0.06] hover:text-[#F5EFE7]",
        "hover:shadow-[0_0_20px_-6px_rgba(255,154,60,0.4)]",
        "transition-all duration-300"
      )}
      aria-label={label}
    >
      {children}

      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 500, damping: 22 }}
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#FF9A3C] shadow-[0_0_8px_rgba(255,154,60,0.9)]"
        />
      )}
    </motion.button>
  );
}