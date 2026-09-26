"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/currency";
import { ORDER } from "@/lib/constants";

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
   Local CartItem type — size/color optional
   ══════════════════════════════════════════════════════════ */
type LocalCartItem = {
  product_id: string;
  slug: string;
  name: string;
  image_url: string | null;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
};

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function CartContent() {
  const router = useRouter();
  const { items, isLoaded, updateQuantity, removeItem, subtotal } = useCart();

  /* ── Loading state ──────────────────────────────────── */
  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card relative overflow-hidden p-12 text-center rounded-2xl border border-[rgba(255,200,120,0.10)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#FF9A3C] border-t-transparent shadow-[0_0_20px_rgba(255,154,60,0.4)]" />
        <p className="mt-4 text-sm text-[#9A94A8]">Loading your cart...</p>
      </motion.div>
    );
  }

  /* ── Empty cart ─────────────────────────────────────── */
  if (items.length === 0) {
    return <EmptyCart />;
  }

  /* ── Totals ─────────────────────────────────────────── */
  const tax = Math.round(subtotal * ORDER.taxRate);
  const delivery =
    subtotal >= ORDER.freeDeliveryAbove ? 0 : ORDER.deliveryFee;
  const total = subtotal + tax + delivery;

  const remainingForFree = ORDER.freeDeliveryAbove - subtotal;
  const freeDeliveryProgress = Math.min(
    (subtotal / ORDER.freeDeliveryAbove) * 100,
    100
  );

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      {/* ═══════════════════════════════════════════
          ITEMS LIST
      ═══════════════════════════════════════════ */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item) => (
            <CartItemRow
              key={`${item.product_id}-${item.size ?? "nosize"}-${
                item.color ?? "nocolor"
              }`}
              item={item as LocalCartItem}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </AnimatePresence>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#9A94A8] hover:text-[#FF9A3C] transition-colors group"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          ORDER SUMMARY
      ═══════════════════════════════════════════ */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="lg:sticky lg:top-24 lg:h-fit"
      >
        <div className="glass-card relative overflow-hidden p-6 space-y-5 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]">
          {/* Top hairline glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
          />

          <h2 className="font-display text-xl font-semibold text-[#F5EFE7] relative inline-block">
            Order Summary
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-8 bg-gradient-to-r from-[#FF9A3C] to-transparent"
            />
          </h2>

          <div className="space-y-3 text-sm mt-4">
            <SummaryRow
              label="Subtotal"
              value={formatPrice(subtotal)}
              delay={0.1}
            />
            <SummaryRow
              label={`Tax (${(ORDER.taxRate * 100).toFixed(0)}%)`}
              value={formatPrice(tax)}
              delay={0.15}
            />

            {/* Delivery */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <span className="text-[#9A94A8]">Delivery</span>
              {delivery === 0 ? (
                <span className="text-[#3ECF8E] font-medium flex items-center gap-1 drop-shadow-[0_0_8px_rgba(62,207,142,0.5)]">
                  <Truck className="h-3.5 w-3.5" />
                  FREE
                </span>
              ) : (
                <span className="text-[#F5EFE7] font-medium">
                  {formatPrice(delivery)}
                </span>
              )}
            </motion.div>

            {/* Free delivery progress */}
            {remainingForFree > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="rounded-lg bg-[rgba(255,154,60,0.06)] border border-[rgba(255,154,60,0.15)] px-3 py-2.5 space-y-2"
              >
                <p className="text-[11px] text-[#FF9A3C]">
                  Add{" "}
                  <span className="font-semibold">
                    {formatPrice(remainingForFree)}
                  </span>{" "}
                  more for{" "}
                  <span className="font-semibold">FREE delivery</span>
                </p>
                <div className="h-1 rounded-full bg-[rgba(255,154,60,0.15)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full bg-gradient-to-r from-[#FF9A3C] to-[#F4D06F] shadow-[0_0_8px_rgba(255,154,60,0.8)]"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="ember-divider my-0" />

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-baseline justify-between"
          >
            <span className="text-sm uppercase tracking-wider text-[#F5EFE7] font-semibold">
              Total
            </span>
            <motion.span
              key={total}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="font-display text-2xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]"
            >
              {formatPrice(total)}
            </motion.span>
          </motion.div>

          {/* Checkout Button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Button
              onClick={handleCheckout}
              size="lg"
              className="w-full group"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="pt-4 border-t border-[rgba(255,200,120,0.08)] space-y-2.5"
          >
            {[
              { icon: Truck, text: "Free shipping over Rs. 5,000" },
              { icon: RotateCcw, text: "7-day easy returns" },
              { icon: Shield, text: "Secure checkout with Stripe" },
            ].map(({ icon: Icon, text }) => (
              <motion.div
                key={text}
                variants={fadeInUp}
                transition={spring}
                className="flex items-center gap-2.5 group/badge"
              >
                <Icon className="h-3.5 w-3.5 text-[#FF9A3C] flex-shrink-0 transition-transform duration-300 group-hover/badge:scale-110" />
                <span className="text-[11px] text-[#9A94A8]">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.aside>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SummaryRow
   ══════════════════════════════════════════════════════════ */
function SummaryRow({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <span className="text-[#9A94A8]">{label}</span>
      <span className="text-[#F5EFE7] font-medium">{value}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   CartItemRow
   ══════════════════════════════════════════════════════════ */
function CartItemRow({
  item,
  updateQuantity,
  removeItem,
}: {
  item: LocalCartItem;
  updateQuantity: (
    productId: string,
    qty: number,
    size?: string,
    color?: string
  ) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={rowRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      exit={{
        opacity: 0,
        x: -40,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group/row relative overflow-hidden p-4 sm:p-5 flex gap-4 sm:gap-6 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_18px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.2)]"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
      />

      {/* Image */}
      <Link
        href={`/shop/${item.slug}`}
        className="relative flex-shrink-0 w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]"
      >
        {item.image_url ? (
          <motion.img
            src={item.image_url}
            alt={item.name}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-[#6B6678]">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Name + Remove */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <Link
              href={`/shop/${item.slug}`}
              className="text-sm sm:text-base font-medium text-[#F5EFE7] hover:text-[#FF9A3C] transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {item.size && item.size !== "One Size" && (
              <p className="text-xs text-[#6B6678] mt-1">
                Size: <span className="text-[#9A94A8]">{item.size}</span>
              </p>
            )}
            {item.color && (
              <p className="text-xs text-[#6B6678] mt-0.5">
                Color: <span className="text-[#9A94A8]">{item.color}</span>
              </p>
            )}
          </div>

          <motion.button
            type="button"
            onClick={() =>
              removeItem(item.product_id, item.size, item.color)
            }
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex-shrink-0 p-1.5 rounded-md text-[#6B6678] hover:text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.1)] hover:shadow-[0_0_16px_-4px_rgba(255,92,92,0.5)] transition-all duration-300"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Price + Quantity */}
        <div className="mt-auto flex items-end justify-between gap-4">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-[rgba(255,200,120,0.15)] bg-white/[0.03] transition-all duration-300 hover:border-[rgba(255,200,120,0.28)] hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.4)]">
            <motion.button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.product_id,
                  item.quantity - 1,
                  item.size,
                  item.color
                )
              }
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="flex h-9 w-9 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </motion.button>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={item.quantity}
                initial={{ y: -6, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 6, opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="w-10 text-center text-sm font-semibold text-[#F5EFE7] inline-block"
              >
                {item.quantity}
              </motion.span>
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.product_id,
                  item.quantity + 1,
                  item.size,
                  item.color
                )
              }
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="flex h-9 w-9 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </motion.button>
          </div>

          {/* Price */}
          <div className="text-right">
            <motion.p
              key={item.price * item.quantity}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="text-base font-semibold text-[#FF9A3C]"
            >
              {formatPrice(item.price * item.quantity)}
            </motion.p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-[#6B6678]">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Empty Cart
   ══════════════════════════════════════════════════════════ */
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-12 sm:p-16 text-center rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.8)]"
    >
      {/* Top hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
      />

      {/* Glow behind icon */}
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
        {/* Pulse ring */}
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
        Your cart is empty
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="text-sm text-[#9A94A8] max-w-md mx-auto mb-8"
      >
        Looks like you haven&apos;t added anything yet. Explore our
        collection and discover something beautiful.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.5 }}
      >
        <Link href="/shop">
          <Button size="lg" className="group">
            Start Shopping
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}