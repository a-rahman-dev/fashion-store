"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function ProductsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between gap-4 flex-wrap"
    >
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-2xl font-semibold text-[#F5EFE7]"
        >
          Products
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-1 text-sm text-[#9A94A8]"
        >
          Manage your store&apos;s product catalog
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
      >
        <Link
          href="/seller/products/new"
          className="group flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-4 py-2.5 text-sm font-semibold text-[#0B0A14] shadow-[0_4px_16px_rgba(255,154,60,0.3),0_1px_0_rgba(255,255,255,0.3)_inset] hover:shadow-[0_8px_28px_rgba(255,154,60,0.5),0_1px_0_rgba(255,255,255,0.35)_inset] transition-shadow duration-300"
        >
          <Plus
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
            strokeWidth={2.5}
          />
          Add Product
        </Link>
      </motion.div>
    </motion.div>
  );
}