"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { SellerStats } from "@/lib/db/queries/seller-stats";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

type Trend = "up" | "down" | "neutral";

type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  icon: typeof DollarSign;
};

export function StatsCards({ stats }: { stats: SellerStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const cards: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      change: `+${formatPrice(stats.revenueThisMonth)} this month`,
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      change: `${stats.ordersThisMonth} this month`,
      trend: "up",
      icon: ShoppingCart,
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toString(),
      change: "In catalog",
      trend: "neutral",
      icon: Package,
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toString(),
      change: "Registered",
      trend: "neutral",
      icon: Users,
    },
  ];

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map(({ label, value, change, trend, icon: Icon }, i) => (
        <motion.div
          key={label}
          variants={fadeInUp}
          transition={{ ...spring, delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className={cn(
            "group glass-card relative overflow-hidden p-5 rounded-2xl",
            "border border-[rgba(255,200,120,0.10)]",
            "transition-all duration-500",
            "hover:border-[rgba(255,200,120,0.22)]",
            "hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.22)]"
          )}
        >
          {/* Top hairline */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />

          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]"
            >
              <Icon className="h-5 w-5 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
            </motion.div>

            {trend === "up" && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.3 + i * 0.06,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex items-center gap-1 rounded-full bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.25)] px-2 py-0.5 shadow-[0_0_16px_-6px_rgba(62,207,142,0.55)]"
              >
                <TrendingUp className="h-3 w-3 text-[#3ECF8E]" />
                <span className="text-[10px] font-medium text-[#3ECF8E]">
                  Up
                </span>
              </motion.div>
            )}

            {trend === "down" && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.3 + i * 0.06,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex items-center gap-1 rounded-full bg-[rgba(255,92,92,0.1)] border border-[rgba(255,92,92,0.25)] px-2 py-0.5 shadow-[0_0_16px_-6px_rgba(255,92,92,0.55)]"
              >
                <TrendingDown className="h-3 w-3 text-[#FF5C5C]" />
                <span className="text-[10px] font-medium text-[#FF5C5C]">
                  Down
                </span>
              </motion.div>
            )}
          </div>

          {/* Label */}
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
            {label}
          </p>

          {/* Value */}
          <p className="font-display text-2xl font-bold text-[#F5EFE7] mb-1.5 transition-colors duration-300 group-hover:text-[#FF9A3C] group-hover:drop-shadow-[0_0_10px_rgba(255,154,60,0.4)]">
            {value}
          </p>

          {/* Change */}
          <p className="text-[11px] text-[#9A94A8]">{change}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}