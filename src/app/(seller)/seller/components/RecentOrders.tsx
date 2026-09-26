"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Package, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Order type
   ══════════════════════════════════════════════════════════ */
type Order = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: { full_name?: string; city?: string };
};

export function RecentOrders({ orders }: { orders: Order[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)] h-full flex flex-col"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent"
      />

      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
            Latest
          </p>
          <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
            Recent Orders
          </h3>
        </div>

        <Link
          href="/seller/orders"
          className="group flex items-center gap-1 text-xs text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════
          EMPTY STATE
      ═══════════════════════════════════════════ */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 320,
              damping: 22,
            }}
            className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)]"
          >
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#FF9A3C]"
            />
            <Package className="relative h-5 w-5 text-[#FF9A3C]" />
          </motion.div>
          <p className="text-sm text-[#9A94A8] mb-1">No orders yet</p>
          <p className="text-xs text-[#6B6678] max-w-[220px]">
            Orders will appear here once customers start purchasing
          </p>
        </motion.div>
      ) : (
        /* ═══════════════════════════════════════════
            ORDERS LIST
        ═══════════════════════════════════════════ */
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-2 flex-1"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={fadeInUp}
              transition={spring}
              whileHover={{ x: 3 }}
            >
              <Link
                href={`/seller/orders/${order.id}`}
                className="group relative flex items-center gap-4 rounded-lg border border-[rgba(255,200,120,0.08)] bg-white/[0.02] p-3 transition-all duration-300 hover:border-[rgba(255,154,60,0.3)] hover:bg-[rgba(255,154,60,0.05)] hover:shadow-[0_0_20px_-8px_rgba(255,154,60,0.4)]"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_16px_-4px_rgba(255,154,60,0.55)]"
                >
                  <Package className="h-4 w-4 text-[#FF9A3C]" />
                </motion.div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors font-mono truncate">
                      {order.order_number}
                    </p>
                    <Badge variant="info" className="text-[9px] shrink-0">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6B6678] truncate">
                    {order.shipping_address?.full_name}
                    {order.shipping_address?.full_name &&
                      order.shipping_address?.city &&
                      " • "}
                    {order.shipping_address?.city}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-[10px] text-[#6B6678]">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          FOOTER CTA (only when orders exist)
      ═══════════════════════════════════════════ */}
      {orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-4 pt-4 border-t border-[rgba(255,200,120,0.08)]"
        >
          <Link
            href="/seller/orders"
            className={cn(
              "group flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
              "text-[#9A94A8] transition-all duration-300",
              "hover:text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.06)]"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Manage all orders
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
} 