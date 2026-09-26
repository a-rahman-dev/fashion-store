"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItemCount } from "@/hooks/useCart";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCount(getCartItemCount());

    // Listen to cart updates
    const handleUpdate = () => {
      setCount(getCartItemCount());
    };

    window.addEventListener("cart-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 22,
            mass: 0.6,
          }}
          className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-1 text-[10px] font-bold text-[#0B0A14] shadow-[0_0_10px_rgba(255,154,60,0.9),0_1px_0_rgba(255,255,255,0.3)_inset]"
        >
          {/* Pulse ring on appearance */}
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#FF9A3C]"
          />

          <span className="relative z-10">{count > 99 ? "99+" : count}</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}