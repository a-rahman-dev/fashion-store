"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/* ============================================================
   CARD — Luxury glass surface with bronze-gold glowing border
   ============================================================ */

type MotionConflicts =
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

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, MotionConflicts> {
  /** Enable soft hover lift + glow (default: false to keep static cards calm) */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    const base =
      "glass-card relative text-[#F5EFE7] rounded-2xl overflow-hidden " +
      "border border-[rgba(255,200,120,0.10)] " +
      "shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)] " +
      "transition-shadow duration-300";

    const interactiveCls =
      "hover:border-[rgba(255,200,120,0.22)] " +
      "hover:shadow-[0_1px_0_rgba(255,200,120,0.10)_inset,0_18px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-6px_rgba(255,154,60,0.18)]";

    if (!interactive) {
      return (
        <div
          ref={ref}
          className={cn(base, className)}
          {...props}
        >
          {/* Subtle top hairline glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
          />
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(base, interactiveCls, className)}
        {...props}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
        />
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

/* ============================================================
   HEADER
   ============================================================ */

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 pb-3 relative z-10", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ============================================================
   TITLE — with subtle golden accent underline
   ============================================================ */

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold text-[#F5EFE7] tracking-tight relative",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ============================================================
   CONTENT
   ============================================================ */

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 pt-0 relative z-10", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/* ============================================================
   FOOTER — with soft bronze-gold divider
   ============================================================ */

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-5 pt-4 mt-3 relative z-10 " +
        "border-t border-[rgba(255,200,120,0.10)]",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";