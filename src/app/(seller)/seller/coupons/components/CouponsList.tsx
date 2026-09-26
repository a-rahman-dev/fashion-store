"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Plus,
  Search,
  Ticket,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  Check,
  Loader2,
  Calendar,
  TrendingUp,
  Sparkles,
  Percent,
  DollarSign,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { Coupon } from "@/types/db";
import type { CouponStats } from "@/lib/db/queries/coupons";
import { toggleCouponActive, deleteCoupon } from "../actions";
import { CouponForm } from "./CouponForm";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Type Badge
   ══════════════════════════════════════════════════════════ */
function TypeBadge({ type }: { type: Coupon["discount_type"] }) {
  const config: Record<
    Coupon["discount_type"],
    { icon: any; label: string; color: string; bg: string; border: string }
  > = {
    percentage: {
      icon: Percent,
      label: "Percentage",
      color: "text-[#FF9A3C]",
      bg: "bg-[rgba(255,154,60,0.1)]",
      border: "border-[rgba(255,154,60,0.25)]",
    },
    fixed: {
      icon: DollarSign,
      label: "Fixed",
      color: "text-[#7DA9FF]",
      bg: "bg-[rgba(125,169,255,0.1)]",
      border: "border-[rgba(125,169,255,0.25)]",
    },
    free_shipping: {
      icon: Truck,
      label: "Free Shipping",
      color: "text-[#3ECF8E]",
      bg: "bg-[rgba(62,207,142,0.1)]",
      border: "border-[rgba(62,207,142,0.25)]",
    },
  };

  const { icon: Icon, label, color, bg, border } = config[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium",
        color,
        bg,
        border
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function CouponsList({
  coupons,
  stats,
}: {
  coupons: Coupon[];
  stats: CouponStats;
}) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  /* ── Filtered ─────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return coupons;
    const q = search.toLowerCase();
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  /* ── Stats Cards ───────────────────────────────── */
  const statCards = [
    {
      label: "Total Coupons",
      value: stats.totalCoupons.toString(),
      icon: Ticket,
    },
    {
      label: "Active",
      value: stats.activeCoupons.toString(),
      icon: CheckCircle2,
    },
    {
      label: "Total Uses",
      value: stats.totalUses.toString(),
      icon: TrendingUp,
    },
    {
      label: "Discount Given",
      value: formatPrice(stats.totalDiscountGiven),
      icon: Sparkles,
    },
  ];

  /* ── Helpers ───────────────────────────────────── */
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied "${code}" to clipboard`, "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (coupon: Coupon) => {
    setTogglingId(coupon.id);
    const result = await toggleCouponActive(coupon.id, !coupon.is_active);
    if (result && "error" in result && result.error) {
      showToast(result.error, "error");
    } else {
      showToast(
        `Coupon ${coupon.is_active ? "deactivated" : "activated"}`,
        "success"
      );
    }
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteCoupon(deleteTarget.id);
    if (result && "error" in result && result.error) {
      showToast(result.error, "error");
      setDeleting(false);
      return;
    }
    showToast(`Coupon "${deleteTarget.code}" deleted`, "success");
    setDeleteTarget(null);
    setDeleting(false);
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    }
    if (coupon.discount_type === "fixed") {
      return formatPrice(coupon.discount_value);
    }
    return "FREE";
  };

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <motion.div
        ref={statsRef}
        variants={stagger}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            variants={fadeInUp}
            transition={{ ...spring, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group glass-card relative overflow-hidden p-5 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.22)] cursor-default"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]">
                <Icon className="h-5 w-5 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-1">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-[#F5EFE7] transition-colors duration-300 group-hover:text-[#FF9A3C]">
              {value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          ACTIONS BAR
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={spring}
        className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)] flex flex-col md:flex-row gap-3"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        <div className="relative flex-1 group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6678] pointer-events-none z-10 transition-colors group-focus-within/search:text-[#FF9A3C]" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
            className="w-full h-11 ember-input text-sm"
          />
        </div>

        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} transition={spring}>
          <Button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create Coupon
          </Button>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          COUPONS LIST
      ═══════════════════════════════════════════ */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden p-12 text-center rounded-2xl border border-[rgba(255,200,120,0.10)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 320,
              damping: 22,
            }}
            className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)]"
          >
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full bg-[#FF9A3C]"
            />
            <Ticket className="relative h-7 w-7 text-[#FF9A3C]" />
          </motion.div>
          <h3 className="font-display text-lg font-semibold text-[#F5EFE7] mb-2">
            {search ? "No coupons found" : "No coupons yet"}
          </h3>
          <p className="text-sm text-[#9A94A8] max-w-md mx-auto mb-6">
            {search
              ? "Try changing your search"
              : "Create your first discount code to boost sales"}
          </p>
          {!search && (
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              className="inline-block"
            >
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Create First Coupon
              </Button>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((coupon) => {
              const isExpired =
                coupon.valid_until &&
                new Date(coupon.valid_until) < new Date();
              const isExhausted =
                coupon.usage_limit && coupon.used_count >= coupon.usage_limit;

              return (
                <motion.div
                  key={coupon.id}
                  layout
                  variants={fadeInUp}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    transition: { duration: 0.3 },
                  }}
                  transition={spring}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "group/coupon glass-card relative overflow-hidden p-5 rounded-2xl border transition-all duration-500",
                    !coupon.is_active
                      ? "opacity-60 border-[rgba(255,200,120,0.10)]"
                      : "border-[rgba(255,200,120,0.10)] hover:border-[rgba(255,200,120,0.25)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.25)]"
                  )}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent opacity-0 group-hover/coupon:opacity-100 transition-opacity"
                  />

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <motion.button
                          onClick={() => copyCode(coupon.code)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={spring}
                          className="group/code flex items-center gap-1.5 rounded-lg border border-[rgba(255,154,60,0.25)] bg-[rgba(255,154,60,0.08)] px-2.5 py-1.5 font-mono text-sm font-bold text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.15)] hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)] transition-all duration-300"
                        >
                          {coupon.code}
                          <AnimatePresence mode="wait" initial={false}>
                            {copiedCode === coupon.code ? (
                              <motion.span
                                key="copied"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                              >
                                <Check className="h-3 w-3 text-[#3ECF8E]" strokeWidth={3} />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                              >
                                <Copy className="h-3 w-3 opacity-60 group-hover/code:opacity-100 transition-opacity" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>

                      {coupon.description && (
                        <p className="text-xs text-[#9A94A8] line-clamp-2">
                          {coupon.description}
                        </p>
                      )}
                    </div>

                    {/* Toggle + Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        onClick={() => handleToggle(coupon)}
                        disabled={togglingId === coupon.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={spring}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300",
                          coupon.is_active
                            ? "border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.1)] text-[#3ECF8E] hover:shadow-[0_0_16px_-4px_rgba(62,207,142,0.5)]"
                            : "border-[rgba(255,255,255,0.1)] bg-white/[0.03] text-[#6B6678] hover:border-[rgba(62,207,142,0.3)] hover:text-[#3ECF8E]"
                        )}
                        aria-label={
                          coupon.is_active ? "Deactivate" : "Activate"
                        }
                      >
                        {togglingId === coupon.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : coupon.is_active ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() => setDeleteTarget(coupon)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={spring}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(255,92,92,0.15)] bg-[rgba(255,92,92,0.05)] text-[#9A94A8] hover:border-[#FF5C5C] hover:text-[#FF5C5C] hover:bg-[rgba(255,92,92,0.1)] hover:shadow-[0_0_16px_-4px_rgba(255,92,92,0.5)] transition-all duration-300"
                        aria-label="Delete coupon"
                      >
                        <Trash2 className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Discount value */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display text-3xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]">
                      {formatDiscount(coupon)}
                    </span>
                    <span className="text-xs text-[#6B6678]">OFF</span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,200,120,0.08)]">
                    <TypeBadge type={coupon.discount_type} />

                    <div className="text-right">
                      <p className="text-[10px] text-[#6B6678] uppercase tracking-wider">
                        Used
                      </p>
                      <p className="text-xs font-medium text-[#F5EFE7]">
                        {coupon.used_count}
                        {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                      </p>
                    </div>
                  </div>

                  {/* Status row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,200,120,0.08)]">
                    {coupon.valid_until ? (
                      <span className="text-[10px] text-[#9A94A8] flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-[#6B6678]" />
                        {isExpired ? (
                          <span className="text-[#FF5C5C] font-medium">
                            Expired
                          </span>
                        ) : (
                          <>
                            Until{" "}
                            {new Date(
                              coupon.valid_until
                            ).toLocaleDateString()}
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6B6678]">
                        No expiry
                      </span>
                    )}

                    {coupon.min_order_amount && coupon.min_order_amount > 0 && (
                      <span className="text-[10px] text-[#6B6678]">
                        Min: {formatPrice(coupon.min_order_amount)}
                      </span>
                    )}
                  </div>

                  {/* Exhausted badge */}
                  <AnimatePresence>
                    {isExhausted && (
                      <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={spring}
                        className="absolute top-0 right-0 rounded-bl-lg bg-[rgba(255,92,92,0.15)] border-l border-b border-[rgba(255,92,92,0.25)] px-2 py-1 shadow-[0_0_16px_-4px_rgba(255,92,92,0.5)]"
                      >
                        <span className="text-[9px] font-medium uppercase tracking-wider text-[#FF5C5C]">
                          Used up
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          CREATE COUPON DIALOG
      ═══════════════════════════════════════════ */}
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <CouponForm onClose={() => setShowCreate(false)} />
      </Dialog>

      {/* ═══════════════════════════════════════════
          DELETE DIALOG
      ═══════════════════════════════════════════ */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
      >
        {deleteTarget && (
          <>
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-[rgba(255,92,92,0.25)] shadow-[0_0_24px_-6px_rgba(255,92,92,0.55)]"
            >
              <motion.span
                aria-hidden
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#FF5C5C]"
              />
              <Trash2 className="relative h-5 w-5 text-[#FF5C5C]" />
            </motion.div>

            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-bold text-[#F5EFE7] mb-2">
                Delete Coupon?
              </h3>
              <p className="text-sm text-[#9A94A8]">
                Are you sure you want to delete the coupon{" "}
                <span className="font-mono font-bold text-[#FF9A3C]">
                  {deleteTarget.code}
                </span>
                ? This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <motion.button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                whileHover={!deleting ? { y: -1 } : {}}
                whileTap={!deleting ? { scale: 0.97 } : {}}
                transition={spring}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl",
                  "bg-[#FF5C5C] text-white text-sm font-semibold",
                  "hover:bg-[#ff4444]",
                  "hover:shadow-[0_8px_24px_rgba(255,92,92,0.5)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-300"
                )}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}