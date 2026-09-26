"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { AssistantWindow } from "./AssistantWindow";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const spring = { type: "spring" as const, stiffness: 380, damping: 26 };

export function AssistantButton() {
  const [open, setOpen] = useState(false);

  /* ── Keyboard: Escape closes window ──────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* ═══════════════════════════════════════════
          FLOATING TRIGGER BUTTON
      ═══════════════════════════════════════════ */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 320,
          damping: 22,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-4 sm:right-6 z-40 group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_8px_32px_rgba(255,154,60,0.5),0_1px_0_rgba(255,255,255,0.3)_inset] hover:shadow-[0_12px_44px_rgba(255,154,60,0.75),0_1px_0_rgba(255,255,255,0.35)_inset] transition-shadow duration-300"
        aria-label={open ? "Close assistant" : "Open AI assistant"}
      >
        {/* Pulse ring — only when closed */}
        {!open && (
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#FF9A3C]"
          />
        )}

        {/* Icon swap with AnimatePresence */}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <X
                className="h-7 w-7 text-[#0B0A14]"
                strokeWidth={2.5}
              />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle
                className="h-7 w-7 text-[#0B0A14] transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2.5}
              />
            </motion.span>
          )}
        </AnimatePresence>

        {/* AI Badge — only when closed */}
        <AnimatePresence>
          {!open && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.15, ...spring }}
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex h-5 min-w-7 items-center justify-center rounded-full bg-[#0B0A14] border-2 border-[#FF9A3C] px-1 shadow-[0_0_12px_rgba(255,154,60,0.6)]"
            >
              <Sparkles className="h-2 w-2 text-[#FF9A3C]" />
              <span className="font-display text-[9px] font-bold tracking-wider text-[#FF9A3C] ml-0.5">
                AI
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ═══════════════════════════════════════════
          CHAT WINDOW
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {open && <AssistantWindow onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}