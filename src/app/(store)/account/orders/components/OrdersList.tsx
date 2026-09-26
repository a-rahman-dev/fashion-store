"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type {
  CustomerOrder,
  CustomerOrderStats,
} from "@/lib/db/queries/customer-orders";

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
   Status config
   ══════════════════════════════════════════════════════════ */
const STATUS_CONFIG: Record<
  string,
  {
    icon: any;
    color: string;
    bg: string;
    border: string;
    glow: string;
    label: string;
  }
> = {
  pending: {
    icon: Clock,
    color: "text-[#FFB84D]",
    bg: "bg-[rgba(255,184,77,0.1)]",
    border: "border-[rgba(255,184,77,0.25)]",
    glow: "0_0_16px_-4px_rgba(255,184,77,0.5)",
    label: "Pending",
  },
  confirmed: {
    icon: CheckCircle2,
    color: "text-[#7DA9FF]",
    bg: "bg-[rgba(125,169,255,0.1)]",
    border: "border-[rgba(125,169,255,0.25)]",
    glow: "0_0_16px_-4px_rgba(125,169,255,0.5)",
    label: "Confirmed",
  },
  processing: {
    icon: Package,
    color: "text-[#FF9A3C]",
    bg: "bg-[rgba(255,154,60,0.1)]",
    border: "border-[rgba(255,154,60,0.25)]",
    glow: "0_0_16px_-4px_rgba(255,154,60,0.5)",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-[#3ECF8E]",
    bg: "bg-[rgba(62,207,142,0.1)]",
    border: "border-[rgba(62,207,142,0.25)]",
    glow: "0_0_16px_-4px_rgba(62,207,142,0.5)",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-[#3ECF8E]",
    bg: "bg-[rgba(62,207,142,0.15)]",
    border: "border-[rgba(62,207,142,0.35)]",
    glow: "0_0_20px_-4px_rgba(62,207,142,0.6)",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-[#FF5C5C]",
    bg: "bg-[rgba(255,92,92,0.1)]",
    border: "border-[rgba(255,92,92,0.25)]",
    glow: "0_0_16px_-4px_rgba(255,92,92,0.5)",
    label: "Cancelled",
  },
};

/* ══════════════════════════════════════════════════════════
   StatusBadge
   ══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    icon: Package,
    color: "text-[#9A94A8]",
    bg: "bg-white/[0.05]",
    border: "border-white/[0.1]",
    glow: "0_0_16px_-4px_rgba(255,255,255,0.2)",
    label: status,
  };

  const { icon: Icon, color, bg, border, label } = config;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-shadow duration-300",
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
  orders: CustomerOrder[];
  stats: CustomerOrderStats;
}) {
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["pending", "confirmed", "processing", "shipped"].includes(
        o.status
      );
    if (filter === "delivered") return o.status === "delivered";
    return true;
  });

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
    },
    {
      label: "Active",
      value: stats.activeOrders.toString(),
      icon: Package,
    },
    {
      label: "Total Spent",
      value: formatPrice(stats.totalSpent),
      icon: DollarSign,
    },
  ];

  /* ── Empty State ─────────────────────────────────── */
  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            variants={fadeInUp}
            transition={{ ...spring, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group glass-card relative overflow-hidden p-5 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.2)] cursor-default"
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
            <p className="font-display text-2xl font-bold text-[#F5EFE7] transition-colors group-hover:text-[#FF9A3C]">
              {value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          FILTER TABS
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={spring}
        className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)] flex flex-wrap gap-2"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        {(
          [
            { key: "all", label: "All Orders" },
            { key: "active", label: "Active" },
            { key: "delivered", label: "Delivered" },
          ] as const
        ).map(({ key, label }) => {
          const active = filter === key;
          const count =
            key === "all"
              ? orders.length
              : key === "active"
              ? stats.activeOrders
              : orders.filter((o) => o.status === "delivered").length;

          return (
            <motion.button
              key={key}
              onClick={() => setFilter(key)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300",
                active
                  ? "bg-[rgba(255,154,60,0.15)] border-[#FF9A3C] text-[#FF9A3C] shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]"
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
                  active ? "bg-[rgba(255,154,60,0.25)]" : "bg-white/[0.05]"
                )}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ═══════════════════════════════════════════
          ORDERS LIST
      ═══════════════════════════════════════════ */}
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Order Row
   ══════════════════════════════════════════════════════════ */
function OrderRow({ order }: { order: CustomerOrder }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/account/orders/${order.id}`}
        className="group glass-card relative overflow-hidden p-4 sm:p-5 flex items-center gap-4 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.25)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_18px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.2)]"
      >
        {/* Top hairline */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        {/* Image */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]">
          {order.first_item_image ? (
            <img
              src={order.first_item_image}
              alt={order.first_item_name ?? "Order"}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-6 w-6 text-[#6B6678]" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-sm font-semibold text-[#F5EFE7] font-mono">
              {order.order_number}
            </p>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-[#9A94A8] line-clamp-1 mb-1">
            {order.first_item_name ?? "Order"}
            {order.items_count > 1 && ` + ${order.items_count - 1} more`}
          </p>
          <p className="text-[10px] text-[#6B6678]">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Total + Arrow */}
        <div className="text-right flex items-center gap-3">
          <div>
            <p className="text-[10px] text-[#6B6678] uppercase tracking-wider mb-0.5">
              Total
            </p>
            <p className="text-base font-semibold text-[#FF9A3C] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,154,60,0.5)]">
              {formatPrice(order.total)}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#6B6678] group-hover:text-[#FF9A3C] group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Empty Orders
   ══════════════════════════════════════════════════════════ */
function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-12 sm:p-16 text-center rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.8)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
      />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
        className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_30px_rgba(255,154,60,0.4),0_1px_0_rgba(255,255,255,0.3)_inset]"
      >
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#FF9A3C]"
        />
        <ShoppingBag
          className="relative h-9 w-9 text-[#0B0A14]"
          strokeWidth={2.5}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE7] mb-3"
      >
        No orders yet
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="text-sm text-[#9A94A8] max-w-md mx-auto mb-8"
      >
        You haven&apos;t placed any orders yet. Start shopping to see your
        orders here.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.5 }}
      >
        <Link href="/shop">
          <motion.span
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-5 py-3 text-sm font-semibold text-[#0B0A14] shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_28px_rgba(255,154,60,0.5)] transition-shadow"
          >
            Start Shopping
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}