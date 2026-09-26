"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Percent,
  DollarSign,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { createCoupon } from "../actions";
import type { CouponType } from "@/types/db";

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function CouponForm({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<CouponType>("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | null>(null);
  const [validUntil, setValidUntil] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createCoupon({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrderAmount),
      usage_limit: usageLimit,
      valid_until: validUntil || null,
      is_active: isActive,
    });

    if (result && "error" in result && result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    showToast(`Coupon "${code.toUpperCase()}" created!`, "success");
    onClose();
  };

  const types: { value: CouponType; label: string; icon: any }[] = [
    { value: "percentage", label: "Percentage", icon: Percent },
    { value: "fixed", label: "Fixed", icon: DollarSign },
    { value: "free_shipping", label: "Free Ship", icon: Truck },
  ];

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, ...spring }}
          className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,154,60,0.15)] border border-[rgba(255,154,60,0.25)] shadow-[0_0_24px_-6px_rgba(255,154,60,0.55)]"
        >
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#FF9A3C]"
          />
          <Sparkles className="relative h-5 w-5 text-[#FF9A3C]" />
        </motion.div>
        <h3 className="font-display text-xl font-bold text-[#F5EFE7]">
          Create Coupon
        </h3>
        <p className="text-xs text-[#9A94A8] mt-1">
          Add a new discount code for your customers
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -12, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: -12, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, -6, 6, -4, 4, 0] }}
              transition={{ duration: 0.4 }}
              className="rounded-lg border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.08)] px-3 py-2.5 flex items-center gap-2 shadow-[0_0_24px_-8px_rgba(255,92,92,0.5)]"
            >
              <AlertCircle className="h-3.5 w-3.5 text-[#FF5C5C] shrink-0" />
              <p className="text-xs text-[#FF5C5C]">{error}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
          Coupon Code *
        </label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="WELCOME10"
          maxLength={20}
          className="ember-input text-sm font-mono uppercase"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="10% off for new customers"
          className="ember-input text-sm"
        />
      </div>

      {/* Discount Type */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
          Discount Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {types.map(({ value, label, icon: Icon }) => {
            const active = discountType === value;
            return (
              <motion.button
                key={value}
                type="button"
                onClick={() => setDiscountType(value)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs font-medium transition-all duration-300",
                  active
                    ? "bg-[rgba(255,154,60,0.1)] border-[#FF9A3C] text-[#FF9A3C] shadow-[0_0_20px_-6px_rgba(255,154,60,0.5)]"
                    : "bg-white/[0.03] border-[rgba(255,200,120,0.08)] text-[#9A94A8] hover:border-[rgba(255,154,60,0.3)] hover:text-[#F5EFE7]"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Discount Value + Min Order */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            {discountType === "percentage"
              ? "Percent (%)"
              : discountType === "fixed"
              ? "Amount (PKR)"
              : "Value"}
          </label>
          <input
            type="number"
            min={0}
            disabled={discountType === "free_shipping"}
            value={discountType === "free_shipping" ? 0 : discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            placeholder={discountType === "percentage" ? "10" : "500"}
            className="ember-input text-sm disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            Min Order (PKR)
          </label>
          <input
            type="number"
            min={0}
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(Number(e.target.value))}
            placeholder="0"
            className="ember-input text-sm"
          />
        </div>
      </div>

      {/* Usage Limit + Expiry */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            Usage Limit
          </label>
          <input
            type="number"
            min={1}
            value={usageLimit ?? ""}
            onChange={(e) =>
              setUsageLimit(e.target.value ? Number(e.target.value) : null)
            }
            placeholder="Unlimited"
            className="ember-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
            Valid Until
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="ember-input text-sm"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          <p className="text-sm font-medium text-[#F5EFE7]">
            Active Immediately
          </p>
          <p className="text-[10px] text-[#6B6678]">
            Customers can use it right away
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-300 p-0.5",
            isActive
              ? "bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_16px_-4px_rgba(255,154,60,0.7)]"
              : "bg-[rgba(255,255,255,0.1)]"
          )}
        >
          <motion.span
            animate={{ x: isActive ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="h-5 w-5 rounded-full bg-white shadow-md"
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !code.trim()}
          className="flex-1"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}