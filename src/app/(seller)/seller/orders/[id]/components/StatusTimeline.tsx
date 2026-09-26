"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Status config
   ══════════════════════════════════════════════════════════ */
type TimelineStep = {
  status: string;
  date: string;
  completed: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { icon: any; label: string; color: string }
> = {
  pending: {
    icon: Clock,
    label: "Order Placed",
    color: "text-[#FFB84D]",
  },
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    color: "text-[#7DA9FF]",
  },
  processing: {
    icon: Package,
    label: "Processing",
    color: "text-[#FF9A3C]",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    color: "text-[#3ECF8E]",
  },
  delivered: {
    icon: Home,
    label: "Delivered",
    color: "text-[#3ECF8E]",
  },
};

export function StatusTimeline({
  timeline,
  isCancelled,
}: {
  timeline: TimelineStep[];
  isCancelled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const steps = timeline.filter((t) => t.status !== "cancelled");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-6 relative inline-block">
        Order Timeline
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
        />
      </h3>

      {isCancelled ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, ...spring }}
          className="relative flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,92,92,0.08)] border border-[rgba(255,92,92,0.25)] overflow-hidden shadow-[0_0_24px_-8px_rgba(255,92,92,0.5)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-[#FF5C5C] shadow-[0_0_8px_rgba(255,92,92,0.9)]"
          />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-[rgba(255,92,92,0.25)]">
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#FF5C5C]"
            />
            <XCircle className="relative h-5 w-5 text-[#FF5C5C]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#FF5C5C]">
              Order Cancelled
            </p>
            <p className="text-xs text-[#9A94A8]">
              This order was cancelled
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[rgba(255,200,120,0.1)]" />

          {/* Animated fill line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-[#FF9A3C] to-[#E67E22] origin-top shadow-[0_0_8px_rgba(255,154,60,0.6)]"
            style={{ height: "calc(100% - 40px)" }}
          />

          <div className="space-y-6">
            {steps.map((step, idx) => {
              const config = STATUS_CONFIG[step.status] ?? {
                icon: Clock,
                label: step.status,
                color: "text-[#9A94A8]",
              };
              const Icon = config.icon;
              const isCurrent =
                step.completed &&
                (idx === steps.length - 1 || !steps[idx + 1].completed);

              return (
                <motion.div
                  key={step.status}
                  variants={fadeInUp}
                  transition={spring}
                  className="flex items-start gap-4 relative"
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                      step.completed
                        ? "border-[#FF9A3C] bg-[rgba(255,154,60,0.15)] shadow-[0_0_16px_rgba(255,154,60,0.4)]"
                        : "border-[rgba(255,200,120,0.15)] bg-[#12101F]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        step.completed ? config.color : "text-[#6B6678]"
                      )}
                    />
                    {isCurrent && (
                      <motion.span
                        aria-hidden
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute inset-0 rounded-full border-2 border-[#FF9A3C]"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors",
                          step.completed
                            ? "text-[#F5EFE7]"
                            : "text-[#6B6678]"
                        )}
                      >
                        {config.label}
                      </p>
                      {isCurrent && (
                        <motion.span
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6, ...spring }}
                          className="text-[10px] uppercase tracking-wider text-[#FF9A3C] font-semibold px-2 py-0.5 rounded-full bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.25)] shadow-[0_0_12px_-4px_rgba(255,154,60,0.5)]"
                        >
                          Current
                        </motion.span>
                      )}
                    </div>
                    {step.completed && (
                      <p className="text-[10px] text-[#6B6678] mt-0.5">
                        {new Date(step.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}