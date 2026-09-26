"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { CustomerOrderDetail as OrderDetailType } from "@/lib/db/queries/customer-orders";

// ══════════════════════════════════════════════════════════
// Status Badge
// ══════════════════════════════════════════════════════════
function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { icon: any; color: string; bg: string; border: string; label: string }
  > = {
    pending: {
      icon: Clock,
      color: "text-[#FFB84D]",
      bg: "bg-[rgba(255,184,77,0.1)]",
      border: "border-[rgba(255,184,77,0.2)]",
      label: "Pending",
    },
    confirmed: {
      icon: CheckCircle2,
      color: "text-[#7DA9FF]",
      bg: "bg-[rgba(125,169,255,0.1)]",
      border: "border-[rgba(125,169,255,0.2)]",
      label: "Confirmed",
    },
    processing: {
      icon: Package,
      color: "text-[#FF9A3C]",
      bg: "bg-[rgba(255,154,60,0.1)]",
      border: "border-[rgba(255,154,60,0.2)]",
      label: "Processing",
    },
    shipped: {
      icon: Truck,
      color: "text-[#3ECF8E]",
      bg: "bg-[rgba(62,207,142,0.1)]",
      border: "border-[rgba(62,207,142,0.2)]",
      label: "Shipped",
    },
    delivered: {
      icon: CheckCircle2,
      color: "text-[#3ECF8E]",
      bg: "bg-[rgba(62,207,142,0.15)]",
      border: "border-[rgba(62,207,142,0.3)]",
      label: "Delivered",
    },
    cancelled: {
      icon: XCircle,
      color: "text-[#FF5C5C]",
      bg: "bg-[rgba(255,92,92,0.1)]",
      border: "border-[rgba(255,92,92,0.2)]",
      label: "Cancelled",
    },
  };

  const { icon: Icon, color, bg, border, label } = config[status] ?? {
    icon: Package,
    color: "text-[#9A94A8]",
    bg: "bg-white/[0.05]",
    border: "border-white/[0.1]",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
        color,
        bg,
        border
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════
// Order Timeline
// ══════════════════════════════════════════════════════════
const TIMELINE_CONFIG: Record<
  string,
  { icon: any; label: string; color: string }
> = {
  pending: { icon: Clock, label: "Order Placed", color: "text-[#FFB84D]" },
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    color: "text-[#7DA9FF]",
  },
  processing: { icon: Package, label: "Processing", color: "text-[#FF9A3C]" },
  shipped: { icon: Truck, label: "Shipped", color: "text-[#3ECF8E]" },
  delivered: { icon: CheckCircle2, label: "Delivered", color: "text-[#3ECF8E]" },
};

function OrderTimeline({
  timeline,
  isCancelled,
}: {
  timeline: OrderDetailType["timeline"];
  isCancelled: boolean;
}) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-6">
        Order Timeline
      </h2>

      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgba(255,92,92,0.08)] border border-[rgba(255,92,92,0.2)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)]">
            <XCircle className="h-5 w-5 text-[#FF5C5C]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#FF5C5C]">
              Order Cancelled
            </p>
            <p className="text-xs text-[#9A94A8]">This order was cancelled</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[rgba(255,200,120,0.1)]" />

          <div className="space-y-6">
            {timeline.map((step, idx) => {
              const config = TIMELINE_CONFIG[step.status] ?? {
                icon: Clock,
                label: step.status,
                color: "text-[#9A94A8]",
              };
              const Icon = config.icon;
              const isCurrent =
                step.completed &&
                (idx === timeline.length - 1 || !timeline[idx + 1].completed);

              return (
                <div
                  key={step.status}
                  className="flex items-start gap-4 relative"
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      step.completed
                        ? "border-[#FF9A3C] bg-[rgba(255,154,60,0.15)] shadow-[0_0_16px_rgba(255,154,60,0.3)]"
                        : "border-[rgba(255,200,120,0.15)] bg-[#12101F]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        step.completed ? config.color : "text-[#6B6678]"
                      )}
                    />
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#FF9A3C] animate-ping opacity-40" />
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          step.completed
                            ? "text-[#F5EFE7]"
                            : "text-[#6B6678]"
                        )}
                      >
                        {config.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider text-[#FF9A3C] font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    {step.completed && (
                      <p className="text-[10px] text-[#6B6678] mt-0.5">
                        {new Date(step.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════
export function CustomerOrderDetail({ order }: { order: OrderDetailType }) {
  const isCancelled = order.status === "cancelled";

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <div className="fade-in-up">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[#9A94A8] hover:text-[#FF9A3C] transition-colors group mb-6"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to My Orders
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B6678] mb-1">
              Order Number
            </p>
            <h1 className="font-display text-3xl font-bold text-[#F5EFE7] font-mono">
              {order.order_number}
            </h1>
            <p className="text-xs text-[#9A94A8] mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MAIN GRID
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── LEFT: Items + Summary ────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag className="h-4 w-4 text-[#FF9A3C]" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
                Items ({order.items.length})
              </h2>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-[rgba(255,200,120,0.08)] bg-white/[0.02] p-3"
                >
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-[#6B6678]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5EFE7] line-clamp-1">
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

                  <p className="text-sm font-semibold text-[#FF9A3C]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="h-4 w-4 text-[#FF9A3C]" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
                Payment Summary
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#9A94A8]">Subtotal</span>
                <span className="text-[#F5EFE7]">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#9A94A8]">Discount</span>
                  <span className="text-[#3ECF8E]">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#9A94A8]">Tax (15%)</span>
                <span className="text-[#F5EFE7]">
                  {formatPrice(order.tax)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9A94A8]">Delivery</span>
                {order.delivery_fee === 0 ? (
                  <span className="text-[#3ECF8E] font-medium">FREE</span>
                ) : (
                  <span className="text-[#F5EFE7]">
                    {formatPrice(order.delivery_fee)}
                  </span>
                )}
              </div>

              <div className="ember-divider my-2" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#F5EFE7]">
                  Total
                </span>
                <span className="font-display text-2xl font-bold text-[#FF9A3C]">
                  {formatPrice(order.total)}
                </span>
              </div>

              <div className="pt-3 border-t border-[rgba(255,200,120,0.08)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6678]">Payment Method</span>
                  <span className="text-[#F5EFE7]">
                    {order.payment_method}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-[#6B6678]">Payment Status</span>
                  <span
                    className={
                      order.payment_status === "paid"
                        ? "text-[#3ECF8E]"
                        : "text-[#FFB84D]"
                    }
                  >
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Shipping + Timeline ────────── */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="h-4 w-4 text-[#FF9A3C]" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
                Shipping Address
              </h2>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="text-[#F5EFE7] font-medium">
                {order.shipping_address.full_name}
              </p>
              <p className="text-[#9A94A8]">
                {order.shipping_address.address_line1}
              </p>
              {order.shipping_address.address_line2 && (
                <p className="text-[#9A94A8]">
                  {order.shipping_address.address_line2}
                </p>
              )}
              <p className="text-[#9A94A8]">
                {order.shipping_address.city},{" "}
                {order.shipping_address.postal_code}
              </p>
              <p className="text-[#9A94A8]">
                {order.shipping_address.country}
              </p>

              <div className="pt-3 mt-3 border-t border-[rgba(255,200,120,0.08)] space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3 w-3 text-[#6B6678]" />
                  <span className="text-[#9A94A8]">
                    {order.shipping_address.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <OrderTimeline
            timeline={order.timeline}
            isCancelled={isCancelled}
          />

          {/* Help */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-[#FF9A3C]" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
                Need Help?
              </h2>
            </div>
            <p className="text-xs text-[#9A94A8] mb-4">
              Questions about your order? Contact our support team.
            </p>
            <a href="mailto:hello@luvera.store">
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="h-3.5 w-3.5" />
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}