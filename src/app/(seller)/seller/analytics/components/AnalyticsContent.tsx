"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Award,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type {
  CategoryStat,
  TopProductByRevenue,
  RevenueDataPoint,
  StatusDistribution,
  AnalyticsStats,
} from "@/lib/db/queries/analytics";

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

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function AnalyticsContent({
  stats,
  categories,
  topProducts,
  revenueData,
  statusDistribution,
}: {
  stats: AnalyticsStats;
  categories: CategoryStat[];
  topProducts: TopProductByRevenue[];
  revenueData: RevenueDataPoint[];
  statusDistribution: StatusDistribution[];
}) {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-60px" });

  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-60px" });

  const statusRef = useRef<HTMLDivElement>(null);
  const statusInView = useInView(statusRef, { once: true, margin: "-60px" });

  const topRef = useRef<HTMLDivElement>(null);
  const topInView = useInView(topRef, { once: true, margin: "-60px" });

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  /* ── Stats Cards ───────────────────────────────── */
  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      sub: `${stats.totalSold} items sold`,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      sub: `Avg ${formatPrice(Math.round(stats.avgOrderValue))}`,
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      sub: `${categories.length} categories`,
    },
    {
      label: "Avg Rating",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      sub: "Across all products",
    },
  ];

  /* ── Max calculations ──────────────────────────── */
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);
  const maxCategorySold = Math.max(
    ...categories.map((c) => c.total_sold),
    1
  );
  const totalStatusCount = statusDistribution.reduce(
    (sum, s) => sum + s.count,
    0
  );
  const totalCategorySold = categories.reduce(
    (sum, c) => sum + c.total_sold,
    0
  );
  const totalRevenue30Days = revenueData.reduce(
    (sum, d) => sum + d.revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════
          STATS CARDS
      ═══════════════════════════════════════════ */}
      <motion.div
        ref={statsRef}
        variants={stagger}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon, sub }, i) => (
          <motion.div
            key={label}
            variants={fadeInUp}
            transition={{ ...spring, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group glass-card relative overflow-hidden p-5 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.22)] cursor-default"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]">
                <Icon className="h-5 w-5 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-[#F5EFE7] mb-1 transition-colors duration-300 group-hover:text-[#FF9A3C]">
              {value}
            </p>
            <p className="text-[10px] text-[#9A94A8]">{sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          REVENUE CHART (Last 30 Days)
      ═══════════════════════════════════════════ */}
      <motion.div
        ref={chartRef}
        initial={{ opacity: 0, y: 20 }}
        animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent"
        />

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              Last 30 Days
            </p>
            <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
              Revenue Trend
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1 flex items-center justify-end gap-1">
              <TrendingUp className="h-3 w-3 text-[#3ECF8E]" />
              Total
            </p>
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={chartInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4, ...spring }}
              className="font-display text-lg font-bold text-[#FF9A3C] drop-shadow-[0_0_10px_rgba(255,154,60,0.35)]"
            >
              {formatPrice(totalRevenue30Days)}
            </motion.p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end justify-between gap-1 h-48">
          {revenueData.map((day, i) => {
            const heightPct = (day.revenue / maxRevenue) * 100;
            const isToday = i === revenueData.length - 1;
            const isHovered = hoveredBar === i;

            return (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-1 relative cursor-pointer"
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-md border border-[rgba(255,200,120,0.2)] bg-[#12101F]/95 backdrop-blur-md px-2 py-1 text-[9px] text-[#FF9A3C] font-medium shadow-[0_4px_20px_-4px_rgba(0,0,0,0.8),0_0_16px_-4px_rgba(255,154,60,0.4)]"
                    >
                      {formatPrice(day.revenue)}
                      <span
                        aria-hidden
                        className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-[rgba(255,200,120,0.2)] bg-[#12101F]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bar */}
                <div className="w-full flex items-end justify-center flex-1 relative">
                  <div className="absolute inset-x-0 bottom-0 top-0 rounded-t bg-[rgba(255,255,255,0.015)]" />

                  <motion.div
                    initial={{ height: 0 }}
                    animate={
                      chartInView
                        ? { height: `${Math.max(heightPct, 5)}%` }
                        : { height: 0 }
                    }
                    transition={{
                      duration: 0.9,
                      delay: 0.2 + i * 0.02,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "w-full rounded-t relative",
                      isToday
                        ? "bg-gradient-to-t from-[#E67E22] via-[#FF9A3C] to-[#FFB566] shadow-[0_0_16px_rgba(255,154,60,0.55)]"
                        : "bg-gradient-to-t from-[rgba(255,154,60,0.25)] to-[rgba(255,154,60,0.5)] group-hover:from-[rgba(255,154,60,0.4)] group-hover:to-[rgba(255,154,60,0.7)]",
                      isHovered &&
                        !isToday &&
                        "from-[rgba(255,154,60,0.5)] to-[rgba(255,154,60,0.8)] shadow-[0_0_16px_rgba(255,154,60,0.4)]"
                    )}
                    style={{ minHeight: "4px" }}
                  >
                    {isToday && (
                      <span
                        aria-hidden
                        className="absolute -top-px inset-x-0 h-0.5 rounded-full bg-[#F4D06F] shadow-[0_0_12px_rgba(244,208,111,0.9)]"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels (every 5th) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={chartInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex justify-between mt-3 text-[9px] text-[#6B6678] uppercase tracking-wider"
        >
          {revenueData
            .filter((_, i) => i % 5 === 0 || i === revenueData.length - 1)
            .map((day) => (
              <span key={day.date}>{day.label}</span>
            ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          TWO COLUMNS: Categories + Status
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <motion.div
          ref={categoriesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
          />

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
                By Category
              </p>
              <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
                Sales Distribution
              </h3>
            </div>
            <Award className="h-4 w-4 text-[#FF9A3C]" />
          </div>

          <div className="space-y-4">
            {categories
              .filter((c) => c.products_count > 0)
              .sort((a, b) => b.total_sold - a.total_sold)
              .map((cat, i) => {
                const pct =
                  totalCategorySold > 0
                    ? (cat.total_sold / totalCategorySold) * 100
                    : 0;
                const barWidth = (cat.total_sold / maxCategorySold) * 100;

                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={
                      categoriesInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -12 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group/cat"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F5EFE7] group-hover/cat:text-[#FF9A3C] transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-[#6B6678]">
                          {cat.products_count} products
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#FF9A3C]">
                          {cat.total_sold} sold
                        </span>
                        <span className="text-[10px] text-[#6B6678] ml-2">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={
                          categoriesInView
                            ? { width: `${barWidth}%` }
                            : { width: 0 }
                        }
                        transition={{
                          duration: 0.9,
                          delay: 0.3 + i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-[#FF9A3C] to-[#E67E22] shadow-[0_0_8px_rgba(255,154,60,0.5)] group-hover/cat:shadow-[0_0_16px_rgba(255,154,60,0.7)] transition-shadow"
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          ref={statusRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statusInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
          />

          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              Order Status
            </p>
            <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
              Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {statusDistribution.map(({ status, count, color }, i) => {
              const pct =
                totalStatusCount > 0 ? (count / totalStatusCount) * 100 : 0;

              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -8 }}
                  animate={
                    statusInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + i * 0.06,
                  }}
                  className="flex items-center gap-3 group/status"
                >
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0 transition-transform duration-300 group-hover/status:scale-125"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}40`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#F5EFE7] group-hover/status:text-[#FF9A3C] transition-colors">
                        {status}
                      </span>
                      <span className="text-xs font-medium text-[#9A94A8]">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={
                          statusInView ? { width: `${pct}%` } : { width: 0 }
                        }
                        transition={{
                          duration: 0.9,
                          delay: 0.35 + i * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}60`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={statusInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 pt-4 border-t border-[rgba(255,200,120,0.08)] flex items-center justify-between"
          >
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678]">
              Total Orders
            </span>
            <span className="font-display text-lg font-bold text-[#FF9A3C] drop-shadow-[0_0_10px_rgba(255,154,60,0.35)]">
              {totalStatusCount}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          TOP PRODUCTS BY REVENUE
      ═══════════════════════════════════════════ */}
      <motion.div
        ref={topRef}
        initial={{ opacity: 0, y: 20 }}
        animate={topInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              Best Performers
            </p>
            <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
              Top Products by Revenue
            </h3>
          </div>
          <Link
            href="/seller/products"
            className="flex items-center gap-1 text-xs text-[#9A94A8] hover:text-[#FF9A3C] transition-colors group"
          >
            View all
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-3">
          {topProducts.map((product, index) => {
            const isTop = index === 0;
            const isPodium = index < 3;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -12 }}
                animate={
                  topInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ x: 3 }}
                className={cn(
                  "group/item flex items-center gap-4 rounded-lg border p-3 transition-all duration-300",
                  isTop
                    ? "border-[rgba(255,154,60,0.25)] bg-[rgba(255,154,60,0.04)] hover:border-[rgba(255,154,60,0.45)] hover:shadow-[0_0_24px_-8px_rgba(255,154,60,0.5)]"
                    : "border-[rgba(255,200,120,0.08)] bg-white/[0.02] hover:border-[rgba(255,154,60,0.3)] hover:bg-[rgba(255,154,60,0.05)] hover:shadow-[0_0_20px_-8px_rgba(255,154,60,0.4)]"
                )}
              >
                {/* Rank */}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={spring}
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
                  <p className="text-sm font-medium text-[#F5EFE7] truncate group-hover/item:text-[#FF9A3C] transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {product.category_name && (
                      <span className="text-[10px] text-[#6B6678] uppercase tracking-wider">
                        {product.category_name}
                      </span>
                    )}
                    <span className="text-[10px] text-[#9A94A8]">
                      {product.total_sold} sold
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover/item:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                    {formatPrice(product.revenue)}
                  </p>
                  <p className="text-[10px] text-[#6B6678]">
                    {formatPrice(product.base_price)} each
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}