"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function Dialog({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  // ── Escape key handler ────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Lock body scroll ──────────────────────────────────────
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            key="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            key="dialog-content"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 26,
              mass: 0.9,
            }}
            className={cn(
              "relative z-10 w-full max-w-md glass-card p-6 rounded-2xl " +
                "border border-[rgba(255,200,120,0.12)] " +
                "shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_30px_80px_-20px_rgba(0,0,0,0.85),0_0_50px_-12px_rgba(255,154,60,0.18)]",
              className
            )}
          >
            {/* Top hairline glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.4)] to-transparent rounded-t-2xl"
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-all hover:rotate-90 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9A3C]/40"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}