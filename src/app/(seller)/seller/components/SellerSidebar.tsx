"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  BarChart3,
  Settings,
  Menu,
  X,
  Flame,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Nav items
   ══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { href: "/seller/customers", label: "Customers", icon: Users },
  { href: "/seller/coupons", label: "Coupons", icon: Ticket },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

export function SellerSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/seller" ? pathname === href : pathname.startsWith(href);

  /* ── Lock body scroll on mobile drawer open ─────────── */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── Escape closes mobile drawer ────────────────────── */
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
      {/* ═══════════════════════════════════════════
          MOBILE TOP TRIGGER
      ═══════════════════════════════════════════ */}
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-50 rounded-lg p-2 lg:hidden",
          "border border-[rgba(255,200,120,0.15)]",
          "bg-[#1A1730]/85 backdrop-blur-md",
          "hover:border-[rgba(255,154,60,0.4)]",
          "hover:shadow-[0_0_20px_-6px_rgba(255,154,60,0.5)]",
          "transition-all duration-300"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-[#F5EFE7]" />
      </motion.button>

      {/* ═══════════════════════════════════════════
          MOBILE OVERLAY
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════ */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 flex flex-col",
          "border-r border-[rgba(255,200,120,0.10)]",
          "bg-[#0B0A14]/95 backdrop-blur-2xl",
          "shadow-[1px_0_0_rgba(255,200,120,0.05)_inset,8px_0_32px_-12px_rgba(0,0,0,0.7)]",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Right hairline glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,200,120,0.3)] to-transparent"
        />

        {/* ═══════════════════════════════════════════
            BRAND
        ═══════════════════════════════════════════ */}
        <div className="relative flex h-16 items-center justify-between border-b border-[rgba(255,200,120,0.08)] px-5">
          <Link href="/seller" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="ember-glow flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_20px_-4px_rgba(255,154,60,0.7)]"
            >
              <Flame className="h-5 w-5 text-[#0B0A14]" strokeWidth={2.5} />
            </motion.div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors">
                Luvéra
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#FF9A3C]">
                Seller
              </p>
            </div>
          </Link>

          <motion.button
            onClick={() => setOpen(false)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="rounded-md p-1 text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* ═══════════════════════════════════════════
            NAV
        ═══════════════════════════════════════════ */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-gradient-to-r from-[rgba(255,154,60,0.15)] to-[rgba(255,154,60,0.05)] text-[#FF9A3C] shadow-[inset_0_0_0_1px_rgba(255,154,60,0.2),0_0_20px_-8px_rgba(255,154,60,0.4)]"
                    : "text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] hover:shadow-[0_0_16px_-8px_rgba(255,154,60,0.4)]"
                )}
              >
                {/* Active left accent bar — slides between items */}
                {active && (
                  <motion.span
                    layoutId="seller-sidebar-active"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#FF9A3C] to-[#E67E22] shadow-[0_0_8px_rgba(255,154,60,0.8)]"
                    transition={spring}
                  />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    active
                      ? "text-[#FF9A3C] scale-110"
                      : "text-[#6B6678] group-hover:text-[#F5EFE7] group-hover:scale-110"
                  )}
                />

                <span className="relative z-10">{label}</span>

                {active && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF9A3C] live-dot shadow-[0_0_8px_rgba(255,154,60,0.9)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ═══════════════════════════════════════════
            BACK TO STORE
        ═══════════════════════════════════════════ */}
        <div className="border-t border-[rgba(255,200,120,0.08)] p-4">
          <Link
            href="/"
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs",
              "text-[#9A94A8] transition-all duration-300",
              "hover:bg-white/5 hover:text-[#FF9A3C]",
              "hover:shadow-[0_0_16px_-8px_rgba(255,154,60,0.4)]"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to Store
          </Link>
        </div>
      </aside>
    </>
  );
}