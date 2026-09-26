"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils/currency";
import { ORDER } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   CartDrawer — right-side slide-in panel
   ══════════════════════════════════════════════════════════ */
export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, isLoaded, updateQuantity, removeItem, subtotal } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const freeDeliveryProgress = Math.min(
    (subtotal / ORDER.freeDeliveryAbove) * 100,
    100
  );
  const remainingForFree = ORDER.freeDeliveryAbove - subtotal;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* ── Backdrop ─────────────────────────────── */}
          <motion.div
            key="cartdrawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* ── Panel ────────────────────────────────── */}
          <motion.aside
            key="cartdrawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className={cn(
              "relative w-full max-w-md h-full flex flex-col",
              "bg-[#0B0A14]/95 backdrop-blur-2xl",
              "border-l border-[rgba(255,200,120,0.15)]",
              "shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.9)]"
            )}
          >
            {/* Top hairline glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
            />

            {/* ── Header ───────────────────────────── */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(255,200,120,0.10)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_20px_-4px_rgba(255,154,60,0.6)]">
                  <ShoppingBag
                    className="h-4 w-4 text-[#0B0A14]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#F5EFE7]">
                    Your Cart
                  </h2>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B6678]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9A3C]/40"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* ── Content ──────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!isLoaded ? (
                <DrawerLoading />
              ) : items.length === 0 ? (
                <DrawerEmpty onClose={onClose} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((item) => (
                      <DrawerItemRow
                        key={`${item.product_id}-${item.size ?? "n"}-${
                          item.color ?? "n"
                        }`}
                        item={item}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        onClose={onClose}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Footer (Summary + Checkout) ──────── */}
            {isLoaded && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative border-t border-[rgba(255,200,120,0.10)] px-5 py-4 space-y-4 bg-gradient-to-b from-transparent to-[rgba(255,154,60,0.02)]"
              >
                {/* Free delivery progress */}
                {remainingForFree > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-[#FF9A3C] flex items-center gap-1.5">
                      <Truck className="h-3 w-3" />
                      Add{" "}
                      <span className="font-semibold">
                        {formatPrice(remainingForFree)}
                      </span>{" "}
                      for FREE delivery
                    </p>
                    <div className="h-1 rounded-full bg-[rgba(255,154,60,0.15)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeDeliveryProgress}%` }}
                        transition={{
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full bg-gradient-to-r from-[#FF9A3C] to-[#F4D06F] shadow-[0_0_8px_rgba(255,154,60,0.8)]"
                      />
                    </div>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#9A94A8]">
                    Subtotal
                  </span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 22,
                    }}
                    className="font-display text-xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]"
                  >
                    {formatPrice(subtotal)}
                  </motion.span>
                </div>

                <p className="text-[10px] text-[#6B6678] text-center">
                  Shipping & taxes calculated at checkout
                </p>

                {/* CTA buttons */}
                <div className="space-y-2">
                  <Link href="/checkout" onClick={onClose}>
                    <Button size="lg" className="w-full group">
                      Checkout
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={onClose}>
                    <Button variant="outline" size="md" className="w-full">
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   Drawer Item Row
   ══════════════════════════════════════════════════════════ */
function DrawerItemRow({
  item,
  updateQuantity,
  removeItem,
  onClose,
}: {
  item: {
    product_id: string;
    slug: string;
    name: string;
    image_url: string | null;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  };
  updateQuantity: (
    productId: string,
    qty: number,
    size?: string,
    color?: string
  ) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  onClose: () => void;
}) {
  // ✅ NEW: Handle remove with toast
  const handleRemove = () => {
    removeItem(item.product_id, item.size, item.color);
    showToast(`"${item.name}" removed from cart`, "info");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: 40,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group/row relative overflow-hidden p-3 flex gap-3 rounded-xl border border-[rgba(255,200,120,0.10)] transition-all duration-300 hover:border-[rgba(255,200,120,0.22)]"
    >
      {/* Image */}
      <Link
        href={`/shop/${item.slug}`}
        onClick={onClose}
        className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]"
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover group-hover/row:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-lg text-[#6B6678]">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/shop/${item.slug}`}
              onClick={onClose}
              className="text-xs font-medium text-[#F5EFE7] hover:text-[#FF9A3C] transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {(item.size && item.size !== "One Size") || item.color ? (
              <p className="text-[10px] text-[#6B6678] mt-0.5 truncate">
                {item.size && item.size !== "One Size" && item.size}
                {item.size && item.size !== "One Size" && item.color && " • "}
                {item.color && item.color}
              </p>
            ) : null}
          </div>
          <motion.button
            type="button"
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex-shrink-0 p-1 rounded-md text-[#6B6678] hover:text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.1)] transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        </div>

        {/* Bottom row: qty + price */}
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <div className="flex items-center rounded-md border border-[rgba(255,200,120,0.15)] bg-white/[0.03]">
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
              className="flex h-7 w-7 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
              aria-label="Decrease"
            >
              <Minus className="h-2.5 w-2.5" />
            </motion.button>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={item.quantity}
                initial={{ y: -5, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 5, opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="w-7 text-center text-xs font-semibold text-[#F5EFE7] inline-block"
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
              className="flex h-7 w-7 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
              aria-label="Increase"
            >
              <Plus className="h-2.5 w-2.5" />
            </motion.button>
          </div>

          <motion.p
            key={item.price * item.quantity}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="text-xs font-semibold text-[#FF9A3C]"
          >
            {formatPrice(item.price * item.quantity)}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Loading State
   ══════════════════════════════════════════════════════════ */
function DrawerLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9A3C] border-t-transparent shadow-[0_0_20px_rgba(255,154,60,0.4)]" />
      <p className="mt-3 text-xs text-[#9A94A8]">Loading cart...</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Empty State
   ══════════════════════════════════════════════════════════ */
function DrawerEmpty({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
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
        className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_30px_rgba(255,154,60,0.4),0_1px_0_rgba(255,255,255,0.3)_inset]"
      >
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#FF9A3C]"
        />
        <ShoppingBag
          className="relative h-7 w-7 text-[#0B0A14]"
          strokeWidth={2.5}
        />
      </motion.div>

      <h3 className="font-display text-lg font-semibold text-[#F5EFE7] mb-1.5">
        Your cart is empty
      </h3>
      <p className="text-xs text-[#9A94A8] max-w-xs mb-6 leading-relaxed">
        Add some beautiful pieces to get started.
      </p>

      <Link href="/shop" onClick={onClose}>
        <Button size="md" className="group">
          Start Shopping
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
    </motion.div>
  );
}