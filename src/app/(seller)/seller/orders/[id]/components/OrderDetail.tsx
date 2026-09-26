"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast";
import { StatusTimeline } from "./StatusTimeline";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { MockOrderDetail } from "@/lib/db/queries/orders";

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
   Section Card — reusable
   ══════════════════════════════════════════════════════════ */
function SectionCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ ...spring, delay }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-5 flex items-center gap-2 relative inline-block">
        {Icon && <Icon className="h-4 w-4 text-[#FF9A3C]" />}
        {title}
      </h3>

      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function OrderDetail({ order }: { order: MockOrderDetail }) {
  const isCancelled = order.status === "cancelled";

  const statusColor =
    order.status === "delivered" || order.status === "shipped"
      ? "success"
      : order.status === "cancelled"
      ? "danger"
      : order.status === "pending"
      ? "warning"
      : "info";

  /* ── Print Invoice handler ─────────────────── */
  const handlePrintInvoice = () => {
    showToast("Print invoice coming soon", "info");
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ x: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
          >
            <Link
              href="/seller/orders"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "border border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8]",
                "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
                "hover:shadow-[0_0_16px_-4px_rgba(255,154,60,0.5)]",
                "transition-all duration-300"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </motion.div>

          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="font-display text-2xl font-semibold text-[#F5EFE7] font-mono">
                {order.order_number}
              </h2>
              <Badge variant={statusColor}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-[#9A94A8]">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={spring}
        >
          <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
            <Printer className="h-3.5 w-3.5" />
            Print Invoice
          </Button>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          MAIN GRID
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── LEFT: Items + Summary ──────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <SectionCard icon={ShoppingBag} title="Order Items" delay={0}>
            <motion.div variants={stagger} className="space-y-3">
              {order.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  transition={{ ...spring, delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className="group/item flex items-center gap-4 rounded-lg border border-[rgba(255,200,120,0.08)] bg-white/[0.02] p-3 transition-all duration-300 hover:border-[rgba(255,154,60,0.25)] hover:bg-[rgba(255,154,60,0.03)] hover:shadow-[0_0_20px_-8px_rgba(255,154,60,0.4)]"
                >
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5EFE7] line-clamp-1 group-hover/item:text-[#FF9A3C] transition-colors">
                      {item.product_name}
                    </p>
                    {item.variant_label && (
                      <p className="text-[10px] text-[#6B6678] mt-0.5">
                        {item.variant_label}
                      </p>
                    )}
                    <p className="text-[10px] text-[#9A94A8] mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover/item:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </SectionCard>

          {/* Payment Summary */}
          <SectionCard icon={CreditCard} title="Payment Summary" delay={0.08}>
            <div className="space-y-3 text-sm">
              <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={`-${formatPrice(order.discount)}`}
                  valueClass="text-[#3ECF8E]"
                />
              )}
              <SummaryRow
                label="Tax (15%)"
                value={formatPrice(order.tax)}
              />
              <div className="flex items-center justify-between">
                <span className="text-[#9A94A8]">Delivery</span>
                {order.delivery_fee === 0 ? (
                  <span className="text-[#3ECF8E] font-medium drop-shadow-[0_0_8px_rgba(62,207,142,0.5)]">
                    FREE
                  </span>
                ) : (
                  <span className="text-[#F5EFE7]">
                    {formatPrice(order.delivery_fee)}
                  </span>
                )}
              </div>

              <div className="ember-divider my-2" />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...spring }}
                className="flex items-baseline justify-between"
              >
                <span className="text-sm font-semibold uppercase tracking-wider text-[#F5EFE7]">
                  Total
                </span>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, ...spring }}
                  className="font-display text-2xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]"
                >
                  {formatPrice(order.total)}
                </motion.span>
              </motion.div>

              <div className="pt-3 border-t border-[rgba(255,200,120,0.08)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6678]">Payment Method</span>
                  <span className="text-[#F5EFE7]">
                    {order.payment_method}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ─── RIGHT: Customer + Timeline ─────────── */}
        <div className="space-y-6">
          {/* Customer */}
          <SectionCard icon={User} title="Customer" delay={0.05}>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#F5EFE7]">
                  {order.customer_name}
                </p>
                <p className="text-[10px] text-[#6B6678] uppercase tracking-wider mt-0.5">
                  Customer
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[rgba(255,200,120,0.08)]">
                <div className="flex items-center gap-2 text-xs group/contact">
                  <Mail className="h-3 w-3 text-[#6B6678] flex-shrink-0 transition-colors group-hover/contact:text-[#FF9A3C]" />
                  <span className="text-[#9A94A8] truncate">
                    {order.customer_email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs group/contact">
                  <Phone className="h-3 w-3 text-[#6B6678] flex-shrink-0 transition-colors group-hover/contact:text-[#FF9A3C]" />
                  <span className="text-[#9A94A8]">
                    {order.shipping_address.phone}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Shipping Address */}
          <SectionCard icon={MapPin} title="Shipping Address" delay={0.1}>
            <div className="space-y-1.5 text-xs">
              <p className="text-[#F5EFE7] font-medium">
                {order.shipping_address.full_name}
              </p>
              <p className="text-[#9A94A8]">
                {order.shipping_address.address_line1}
              </p>
              <p className="text-[#9A94A8]">
                {order.shipping_address.city},{" "}
                {order.shipping_address.postal_code}
              </p>
              <p className="text-[#9A94A8]">
                {order.shipping_address.country}
              </p>
            </div>
          </SectionCard>

          {/* Timeline */}
          <StatusTimeline
            timeline={order.timeline}
            isCancelled={isCancelled}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Summary Row
   ══════════════════════════════════════════════════════════ */
function SummaryRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#9A94A8]">{label}</span>
      <span className={cn("text-[#F5EFE7]", valueClass)}>{value}</span>
    </div>
  );
}