"use client";

import { motion } from "framer-motion";

/* ══════════════════════════════════════════════════════════
   Dashboard Welcome — animated header
   ══════════════════════════════════════════════════════════ */
export function DashboardWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-2xl font-semibold text-[#F5EFE7]"
      >
        Welcome back{" "}
        <motion.span
          animate={{ rotate: [0, 14, -8, 0] }}
          transition={{
            duration: 1.6,
            delay: 0.6,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
          className="inline-block origin-bottom-right"
        >
          👋
        </motion.span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-1 text-sm text-[#9A94A8]"
      >
        Here&apos;s what&apos;s happening with your store today.
      </motion.p>
    </motion.div>
  );
}