"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
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
  visible: { transition: { staggerChildren: 0.08 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function AddToCartForm({
  productId,
  slug,
  name,
  price,
  imageUrl,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("One Size");
  const [justAdded, setJustAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const availableSizes = ["One Size", "S", "M", "L", "XL"];

  const handleAddToCart = () => {
    addItem({
      product_id: productId,
      slug,
      name,
      price,
      image_url: imageUrl,
      size: selectedSize,
      quantity,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = () => {
    setWishlisted((v) => !v);
    // TODO: wishlist logic baad mein
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ═══════════════════════════════════════════
          SIZE SELECTOR
      ═══════════════════════════════════════════ */}
      <motion.div variants={fadeInUp} transition={spring}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7]">
            Select Size
          </h3>
          <button
            type="button"
            className="text-[10px] text-[#6B6678] hover:text-[#FF9A3C] transition-colors"
          >
            Size guide →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const active = selectedSize === size;
            return (
              <motion.button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "relative min-w-[52px] rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-300",
                  active
                    ? "border-[#FF9A3C] bg-[rgba(255,154,60,0.1)] text-[#FF9A3C] shadow-[0_0_16px_-4px_rgba(255,154,60,0.6)]"
                    : "border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8] hover:border-[rgba(255,200,120,0.3)] hover:text-[#F5EFE7] hover:shadow-[0_0_12px_-6px_rgba(255,154,60,0.4)]"
                )}
              >
                {size}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          QUANTITY + WISHLIST
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        transition={spring}
        className="flex items-center gap-4"
      >
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-3">
            Quantity
          </h3>
          <div className="flex items-center rounded-lg border border-[rgba(255,200,120,0.15)] bg-white/[0.03] transition-all duration-300 hover:border-[rgba(255,200,120,0.28)] hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.4)]">
            <motion.button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              whileTap={{ scale: 0.85 }}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </motion.button>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={quantity}
                initial={{ y: -6, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 6, opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="w-12 text-center text-sm font-semibold text-[#F5EFE7] inline-block"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              whileTap={{ scale: 0.85 }}
              className="flex h-10 w-10 items-center justify-center text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Wishlist */}
        <motion.button
          type="button"
          onClick={handleWishlist}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className={cn(
            "mt-7 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300",
            wishlisted
              ? "border-[#FF9A3C] bg-[#FF9A3C] text-[#0B0A14] shadow-[0_0_20px_-4px_rgba(255,154,60,0.7)]"
              : "border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8] hover:border-[#FF9A3C] hover:text-[#FF9A3C] hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]"
          )}
          aria-label="Add to wishlist"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={wishlisted ? "on" : "off"}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Heart
                className={cn("h-4 w-4", wishlisted && "fill-current")}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ADD TO CART + BUY NOW
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        transition={spring}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <Button
          onClick={handleAddToCart}
          size="lg"
          className={cn(
            "flex-1 group transition-all duration-300",
            justAdded &&
              "!bg-[#3ECF8E] !text-[#0B0A14] shadow-[0_4px_24px_rgba(62,207,142,0.5)]"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
        >
          Buy Now
        </Button>
      </motion.div>

      {/* Mini info */}
      <motion.p
        variants={fadeInUp}
        transition={spring}
        className="text-xs text-[#6B6678] text-center"
      >
        ✨ Free delivery on orders over Rs. 5,000
      </motion.p>
    </motion.div>
  );
}