"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AIProductCard } from "./ProductCard";
import type { AIProductResult } from "@/lib/ai/tool-handlers";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 320, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════ */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: AIProductResult[];
};

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  /* ── User message ─────────────────────────────── */
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        className="flex justify-end mb-3"
      >
        <div className="relative max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#0B0A14] font-medium whitespace-pre-wrap shadow-[0_4px_16px_-4px_rgba(255,154,60,0.5),0_1px_0_rgba(255,255,255,0.3)_inset]">
          {message.content}
        </div>
      </motion.div>
    );
  }

  /* ── Assistant message ────────────────────────── */
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex justify-start mb-3"
    >
      <div className="max-w-[90%] w-full">
        {/* AI Badge */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="flex items-center gap-1.5 mb-1.5"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_12px_-2px_rgba(255,154,60,0.6)]"
          >
            <Sparkles
              className="h-2.5 w-2.5 text-[#0B0A14]"
              strokeWidth={2.5}
            />
          </motion.div>
          <span className="text-[9px] uppercase tracking-wider text-[#6B6678]">
            Luvéra Assistant
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="relative rounded-2xl rounded-bl-sm border border-[rgba(255,200,120,0.12)] bg-white/[0.04] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#F5EFE7] whitespace-pre-wrap shadow-[0_1px_0_rgba(255,200,120,0.05)_inset,0_4px_16px_-8px_rgba(0,0,0,0.4)]"
        >
          {/* Top hairline */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.2)] to-transparent rounded-t-2xl"
          />
          {message.content}
        </motion.div>

        {/* Products */}
        {message.products && message.products.length > 0 && (
          <motion.div
            variants={fadeInUp}
            transition={{ ...spring, delay: 0.15 }}
            className="mt-2 space-y-2"
          >
            {message.products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.2 + i * 0.06 }}
              >
                <AIProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}