"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════ */
type DayData = {
  date: string;
  label: string;
  value: number;
};

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function RevenueChart({ data }: { data: DayData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const bestDay = data.reduce(
    (best, d) => (d.value > best.value ? d : best),
    data[0] ?? { value: 0, label: "", date: "" }
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent"
      />

      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
            Last 7 Days
          </p>
          <h3 className="font-display text-lg font-semibold text-[#F5EFE7]">
            Revenue Overview
          </h3>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1 flex items-center justify-end gap-1">
            <TrendingUp className="h-3 w-3 text-[#3ECF8E]" />
            Total
          </p>
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.4, ...spring }}
            className="font-display text-lg font-bold text-[#FF9A3C] drop-shadow-[0_0_10px_rgba(255,154,60,0.35)]"
          >
            {formatPrice(total)}
          </motion.p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          CHART
      ═══════════════════════════════════════════ */}
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((day, i) => {
          const heightPct = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
          const isToday = i === data.length - 1;
          const isHovered = hovered === i;

          return (
            <div
              key={day.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
            >
              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-lg border border-[rgba(255,200,120,0.2)] bg-[#12101F]/95 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-[#FF9A3C] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.8),0_0_16px_-4px_rgba(255,154,60,0.4)]"
                  >
                    {formatPrice(day.value)}
                    <span
                      aria-hidden
                      className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-[rgba(255,200,120,0.2)] bg-[#12101F]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Value label (for large screens, always visible on hover only) */}
              <div
                className={cn(
                  "text-[10px] text-[#FF9A3C] font-medium whitespace-nowrap transition-opacity duration-200",
                  isHovered ? "opacity-0" : "opacity-0"
                )}
              >
                {formatPrice(day.value)}
              </div>

              {/* Bar container */}
              <div className="w-full flex items-end justify-center flex-1 relative">
                {/* Background track */}
                <div className="absolute inset-x-0 bottom-0 top-0 rounded-t-md bg-[rgba(255,255,255,0.015)]" />

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={
                    inView
                      ? {
                          height: `${Math.max(heightPct, 3)}%`,
                        }
                      : { height: 0 }
                  }
                  transition={{
                    duration: 0.9,
                    delay: 0.2 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "w-full rounded-t-md relative",
                    isToday
                      ? "bg-gradient-to-t from-[#E67E22] via-[#FF9A3C] to-[#FFB566] shadow-[0_0_16px_rgba(255,154,60,0.55)]"
                      : "bg-gradient-to-t from-[rgba(255,154,60,0.25)] to-[rgba(255,154,60,0.5)] group-hover:from-[rgba(255,154,60,0.4)] group-hover:to-[rgba(255,154,60,0.7)] group-hover:shadow-[0_0_16px_rgba(255,154,60,0.45)]",
                    "transition-colors duration-300"
                  )}
                  style={{ minHeight: "4px" }}
                >
                  {/* Top cap glow */}
                  {isToday && (
                    <span
                      aria-hidden
                      className="absolute -top-px inset-x-0 h-0.5 rounded-full bg-[#F4D06F] shadow-[0_0_12px_rgba(244,208,111,0.9)]"
                    />
                  )}
                </motion.div>
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wider transition-colors duration-300",
                  isToday
                    ? "text-[#FF9A3C]"
                    : isHovered
                    ? "text-[#F5EFE7]"
                    : "text-[#6B6678]"
                )}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
          FOOTER STATS
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-6 pt-4 border-t border-[rgba(255,200,120,0.08)] flex items-center justify-between text-[10px] uppercase tracking-[0.15em]"
      >
        <span className="text-[#6B6678]">
          Best Day:{" "}
          <span className="text-[#FF9A3C] font-semibold">
            {bestDay.label}
          </span>
        </span>
        <span className="text-[#6B6678]">
          Daily Avg:{" "}
          <span className="text-[#F5EFE7] font-semibold">
            {formatPrice(Math.round(total / Math.max(data.length, 1)))}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}