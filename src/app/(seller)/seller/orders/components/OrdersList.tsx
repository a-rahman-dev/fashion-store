"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { MockOrder, OrderStats } from "@/lib/db/queries/orders";

type StatusFilter = "all" | MockOrder["status"];

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

/* ══════════════════════════════════════════════════════════
   Status config
   ══════════════════════════════════════════════════════════ */
const STATUS_CONFIG: Record<
  MockOrder["status"],
  {
    icon: any;
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  pending: {
    icon: Clock,
    color: "text-[#FFB84D]",
    bg: "bg-[rgba(255,184,77,0.1)]",
    border: "border-[rgba(255,184,77,0.25)]",
    label: "Pending",
  },
  confirmed: {
    icon: CheckCircle2,
    color: "text-[#7DA9FF]",
    bg: "bg-[rgba(125,169,255,0.1)]",
    border: "border-[rgba(125,169,255,0.25)]",
    label: "Confirmed",
  },
  processing: {
    icon: Package,
    color: "text-[#FF9A3C]",
    bg: "bg-[rgba(255,154,60,0.1)]",
    border: "border-[rgba(255,154,60,0.25)]",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-[#3ECF8E]",
    bg: "bg-[rgba(62,207,142,0.1)]",
    border: "border-[rgba(62,207,142,0.25)]",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-[#3ECF8E]",
    bg: "bg-[rgba(62,207,142,0.15)]",
    border: "border-[rgba(62,207,142,0.35)]",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-[#FF5C5C]",
    bg: "bg-[rgba(255,92,92,0.1)]",
    border: "border-[rgba(255,92,92,0.25)]",
    label: "Cancelled",
  },
};

/* ══════════════════════════════════════════════════════════
   Status Badge
   ══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: MockOrder["status"] }) {
  const { icon: Icon, color, bg, border, label } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider",
        color,
        bg,
        border
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function OrdersList({
  orders,
  stats,
}: {
  orders: MockOrder[];
  stats: OrderStats;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  /* ── Filtered ──────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }

    return list;
  }, [orders, search, statusFilter]);

  /* ── Stats Cards ───────────────────────────────── */
  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      label: "Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Avg. Order",
      value: formatPrice(Math.round(stats.avgOrderValue)),
      icon: TrendingUp,
    },
    {
      label: "This Month",
      value: stats.thisMonthOrders.toString(),
      icon: Calendar,
    },
  ];

  /* ── Status tabs ───────────────────────────────── */
  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

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
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon }, i) => (
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

            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]">
                <Icon className="h-5 w-5 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-[#F5EFE7] transition-colors duration-300 group-hover:text-[#FF9A3C]">
              {value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          FILTERS
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={spring}
        className="glass-card relative overflow-hidden p-4 space-y-4 rounded-2xl border border-[rgba(255,200,120,0.10)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        {/* Search */}
        <div className="relative w-full group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6678] pointer-events-none z-10 transition-colors group-focus-within/search:text-[#FF9A3C]" />
          <input
            type="text"
            placeholder="Search by order #, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
            className="w-full h-11 ember-input text-sm"
          />
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(({ key, label }) => {
            const active = statusFilter === key;
            const count =
              key === "all"
                ? orders.length
                : orders.filter((o) => o.status === key).length;

            return (
              <motion.button
                key={key}
                onClick={() => setStatusFilter(key)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300",
                  active
                    ? "bg-[rgba(255,154,60,0.15)] border-[#FF9A3C] text-[#FF9A3C] shadow-[0_0_16px_-6px_rgba(255,154,60,0.55)]"
                    : "bg-white/[0.02] border-[rgba(255,200,120,0.08)] text-[#9A94A8] hover:border-[rgba(255,154,60,0.3)] hover:text-[#F5EFE7] hover:shadow-[0_0_12px_-6px_rgba(255,154,60,0.4)]"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="orders-filter-active"
                    className="absolute inset-0 rounded-lg bg-[rgba(255,154,60,0.15)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {label}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full transition-colors",
                    active
                      ? "bg-[rgba(255,154,60,0.25)]"
                      : "bg-white/[0.05]"
                  )}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ORDERS TABLE
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent z-10"
        />

        {filtered.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 320,
                damping: 22,
              }}
              className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)]"
            >
              <motion.span
                aria-hidden
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-[#FF9A3C]"
              />
              <Package className="relative h-7 w-7 text-[#FF9A3C]" />
            </motion.div>
            <h3 className="font-display text-lg font-semibold text-[#F5EFE7] mb-2">
              No orders found
            </h3>
            <p className="text-sm text-[#9A94A8] max-w-md mx-auto">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter"
                : "Orders will appear here once customers start purchasing"}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,200,120,0.08)] bg-white/[0.02]">
                  {[
                    { label: "Order", cls: "" },
                    { label: "Customer", cls: "hidden md:table-cell" },
                    { label: "Date", cls: "hidden lg:table-cell" },
                    { label: "Total", cls: "" },
                    { label: "Status", cls: "" },
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
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((order, i) => (
                    <motion.tr
                      key={order.id}
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
                      {/* Order # */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-[#F5EFE7] font-mono">
                            {order.order_number}
                          </p>
                          <p className="text-[10px] text-[#6B6678] mt-0.5">
                            {order.items_count}{" "}
                            {order.items_count === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-[#F5EFE7]">
                            {order.customer_name}
                          </p>
                          <p className="text-[10px] text-[#6B6678] mt-0.5">
                            {order.customer_city}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#9A94A8]">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover/row:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                          {formatPrice(order.total)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <motion.div
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={spring}
                          className="inline-block"
                        >
                          <Link
                            href={`/seller/orders/${order.id}`}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                              "border border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8]",
                              "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
                              "hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]",
                              "transition-all duration-300"
                            )}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Link>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}