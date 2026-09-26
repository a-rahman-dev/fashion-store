"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] font-semibold " +
    "shadow-[0_4px_16px_rgba(255,154,60,0.25)] " +
    "hover:shadow-[0_8px_28px_rgba(255,154,60,0.45),0_0_0_1px_rgba(255,200,120,0.35)] " +
    "hover:-translate-y-[1px] " +
    "active:translate-y-0 active:shadow-[0_4px_16px_rgba(255,154,60,0.35)]",
  ghost:
    "bg-transparent text-[#F5EFE7] border border-transparent " +
    "hover:bg-white/5 hover:border-[rgba(255,200,120,0.18)] " +
    "hover:shadow-[0_0_20px_rgba(255,200,120,0.08)]",
  outline:
    "bg-transparent text-[#F5EFE7] border border-[rgba(255,200,120,0.15)] " +
    "hover:bg-[rgba(255,154,60,0.08)] hover:border-[#FF9A3C] hover:text-[#FF9A3C] " +
    "hover:shadow-[0_0_24px_rgba(255,154,60,0.18)]",
  danger:
    "bg-[#FF5C5C] text-white shadow-[0_4px_16px_rgba(255,92,92,0.25)] " +
    "hover:bg-[#FF5C5C]/90 hover:shadow-[0_8px_24px_rgba(255,92,92,0.4)] " +
    "hover:-translate-y-[1px]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-xl",
  icon: "h-10 w-10 rounded-lg",
};

// 👇 Ye woh events hain jo Framer Motion ke saath conflict karte hain — inko omit kar diya
type ConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "style";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingProps> {
  variant?: Variant;
  size?: Size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 " +
            "disabled:opacity-50 disabled:pointer-events-none " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9A3C]/40 " +
            "select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };