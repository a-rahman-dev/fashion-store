"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "sale";

const variants: Record<Variant, string> = {
  default:
    "bg-[rgba(255,255,255,0.05)] text-[#9A94A8] border-[rgba(255,255,255,0.08)] " +
    "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
  success:
    "bg-[rgba(62,207,142,0.1)] text-[#3ECF8E] border-[rgba(62,207,142,0.25)] " +
    "shadow-[0_0_12px_-2px_rgba(62,207,142,0.35),0_1px_0_rgba(62,207,142,0.15)_inset]",
  warning:
    "bg-[rgba(255,184,77,0.1)] text-[#FFB84D] border-[rgba(255,184,77,0.25)] " +
    "shadow-[0_0_12px_-2px_rgba(255,184,77,0.35),0_1px_0_rgba(255,184,77,0.15)_inset]",
  danger:
    "bg-[rgba(255,92,92,0.1)] text-[#FF5C5C] border-[rgba(255,92,92,0.25)] " +
    "shadow-[0_0_12px_-2px_rgba(255,92,92,0.35),0_1px_0_rgba(255,92,92,0.15)_inset]",
  info:
    "bg-[rgba(125,169,255,0.1)] text-[#7DA9FF] border-[rgba(125,169,255,0.25)] " +
    "shadow-[0_0_12px_-2px_rgba(125,169,255,0.35),0_1px_0_rgba(125,169,255,0.15)_inset]",
  sale:
    "relative overflow-hidden bg-gradient-to-r from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] " +
    "border-transparent font-semibold " +
    "shadow-[0_2px_14px_-2px_rgba(255,154,60,0.55),0_1px_0_rgba(255,255,255,0.25)_inset]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  /** Adds a soft pulsing glow ring (good for "LIVE", "NEW", "SALE" tags) */
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "default",
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 " +
          "text-[11px] font-medium uppercase tracking-wider " +
          "transition-shadow duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Pulse dot */}
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}

      {/* Shine sweep on sale variant */}
      {variant === "sale" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: "badge-shine 3s ease-in-out infinite" }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </span>
  );
}