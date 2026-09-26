"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

// ══════════════════════════════════════════════════════════
// Toast Store (module-level for simplicity)
// ══════════════════════════════════════════════════════════
let listeners: Array<(t: Toast[]) => void> = [];
let toasts: Toast[] = [];

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function showToast(message: string, type: ToastType = "success") {
  const id = Date.now();
  toasts = [...toasts, { id, message, type }];
  emit();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

// ══════════════════════════════════════════════════════════
// Per-type styling map
// ══════════════════════════════════════════════════════════
const typeStyles = {
  success: {
    border: "border-l-[#3ECF8E]",
    iconBg: "bg-[rgba(62,207,142,0.15)]",
    iconColor: "text-[#3ECF8E]",
    glow: "0_0_24px_-6px_rgba(62,207,142,0.35)",
    Icon: Check,
  },
  error: {
    border: "border-l-[#FF5C5C]",
    iconBg: "bg-[rgba(255,92,92,0.15)]",
    iconColor: "text-[#FF5C5C]",
    glow: "0_0_24px_-6px_rgba(255,92,92,0.35)",
    Icon: X,
  },
  info: {
    border: "border-l-[#FF9A3C]",
    iconBg: "bg-[rgba(255,154,60,0.15)]",
    iconColor: "text-[#FF9A3C]",
    glow: "0_0_24px_-6px_rgba(255,154,60,0.35)",
    Icon: AlertCircle,
  },
} as const;

// ══════════════════════════════════════════════════════════
// Toast Container (mount once in layout)
// ══════════════════════════════════════════════════════════
export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast[]) => setItems(t);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence initial={false}>
        {items.map((toast) => {
          const style = typeStyles[toast.type];
          const Icon = style.Icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.92 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
                mass: 0.8,
              }}
              className={cn(
                "glass-card relative overflow-hidden px-4 py-3 flex items-center gap-3 " +
                  "min-w-[280px] max-w-md pointer-events-auto rounded-xl " +
                  "border border-[rgba(255,200,120,0.10)] border-l-2 " +
                  "shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_8px_32px_rgba(0,0,0,0.45)]",
                style.border
              )}
              style={{
                boxShadow: `0 1px 0 rgba(255,200,120,0.06) inset, 0 8px 32px rgba(0,0,0,0.45), ${style.glow.replace(
                  /_/g,
                  " "
                )}`,
              }}
            >
              {/* Top hairline glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
              />

              {/* Icon */}
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                  style.iconBg
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", style.iconColor)}
                  strokeWidth={toast.type === "info" ? 2 : 3}
                />
              </div>

              {/* Message */}
              <p className="text-sm text-[#F5EFE7] leading-snug">
                {toast.message}
              </p>

              {/* Progress bar (auto-dismiss indicator) */}
              <motion.span
                aria-hidden
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] opacity-60",
                  toast.type === "success" && "bg-[#3ECF8E]",
                  toast.type === "error" && "bg-[#FF5C5C]",
                  toast.type === "info" && "bg-[#FF9A3C]"
                )}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}