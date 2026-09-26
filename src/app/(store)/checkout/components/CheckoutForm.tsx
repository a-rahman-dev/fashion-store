"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Check,
  Loader2,
  User,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils/currency";
import { createOrder, type CheckoutInput } from "../actions";
import { cn } from "@/lib/utils/cn";

type Step = "shipping" | "payment";

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

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, isLoaded, clearCart } = useCart();

  const [step, setStep] = useState<Step>("shipping");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [shipping, setShipping] = useState<CheckoutInput>({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Pakistan",
    notes: "",
  });

  // Mock card state
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  /* ── Redirect if empty ─────────────────────────────── */
  useEffect(() => {
    if (isLoaded && items.length === 0 && !processing) {
      router.replace("/cart");
    }
  }, [isLoaded, items.length, processing, router]);

  /* ── Totals ────────────────────────────────────────── */
  const tax = Math.round(subtotal * 0.15);
  const delivery = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + tax + delivery;

  /* ── Shipping submit ──────────────────────────────── */
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shipping.full_name.trim()) return setError("Full name is required");
    if (!shipping.phone.trim()) return setError("Phone is required");
    if (!shipping.address_line1.trim()) return setError("Address is required");
    if (!shipping.city.trim()) return setError("City is required");

    setStep("payment");
  };

  /* ── Payment submit ───────────────────────────────── */
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (card.number.replace(/\s/g, "").length < 16) {
      return setError("Card number must be 16 digits");
    }
    if (card.expiry.length < 5) return setError("Expiry is required");
    if (card.cvc.length < 3) return setError("CVC is required");

    setProcessing(true);

    await new Promise((r) => setTimeout(r, 2000));

    const result = await createOrder(shipping, {
      items: items.map((i) => ({
        product_id: i.product_id,
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image_url: i.image_url,
        size: i.size,
        color: i.color,
      })),
      subtotal,
    });

    if (result && "error" in result && result.error) {
      setError(result.error);
      setProcessing(false);
      return;
    }

    // ✅ NEW: Success toast
    showToast("Order placed successfully!", "success");

    clearCart();
    router.push(`/checkout/success?order=${result.orderNumber}`);
  };

  /* ── Card formatting ──────────────────────────────── */
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, "").replace(/\D/g, "");
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  /* ── Loading ──────────────────────────────────────── */
  if (!isLoaded || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card relative overflow-hidden p-12 text-center rounded-2xl border border-[rgba(255,200,120,0.10)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9A3C] mx-auto drop-shadow-[0_0_12px_rgba(255,154,60,0.6)]" />
        <p className="mt-4 text-sm text-[#9A94A8]">Loading...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════
          PROGRESS STEPS
      ═══════════════════════════════════════════ */}
      <ProgressSteps step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* ═══════════════════════════════════════════
            MAIN FORM
        ═══════════════════════════════════════════ */}
        <div className="space-y-5">
          <AnimatePresence mode="wait" initial={false}>
            {step === "shipping" ? (
              <motion.form
                key="shipping-form"
                onSubmit={handleShippingSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative overflow-hidden p-6 space-y-5 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
                />

                <SectionTitle icon={MapPin} title="Shipping Information" />

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  {/* Full name + Phone */}
                  <motion.div
                    variants={fadeInUp}
                    transition={spring}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <FormField label="Full Name *" icon={User}>
                      <input
                        type="text"
                        required
                        value={shipping.full_name}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            full_name: e.target.value,
                          })
                        }
                        placeholder="Ayesha Khan"
                        className="ember-input text-sm"
                      />
                    </FormField>

                    <FormField label="Phone *" icon={Phone}>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) =>
                          setShipping({ ...shipping, phone: e.target.value })
                        }
                        placeholder="+92-300-1234567"
                        className="ember-input text-sm"
                      />
                    </FormField>
                  </motion.div>

                  {/* Address 1 */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Address Line 1 *">
                      <input
                        type="text"
                        required
                        value={shipping.address_line1}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            address_line1: e.target.value,
                          })
                        }
                        placeholder="House 123, Street 45"
                        className="ember-input text-sm"
                      />
                    </FormField>
                  </motion.div>

                  {/* Address 2 */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Address Line 2">
                      <input
                        type="text"
                        value={shipping.address_line2 ?? ""}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            address_line2: e.target.value,
                          })
                        }
                        placeholder="Apartment, suite, etc. (optional)"
                        className="ember-input text-sm"
                      />
                    </FormField>
                  </motion.div>

                  {/* City + Postal */}
                  <motion.div
                    variants={fadeInUp}
                    transition={spring}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <FormField label="City *">
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        placeholder="Karachi"
                        className="ember-input text-sm"
                      />
                    </FormField>

                    <FormField label="Postal Code">
                      <input
                        type="text"
                        value={shipping.postal_code ?? ""}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            postal_code: e.target.value,
                          })
                        }
                        placeholder="75500"
                        className="ember-input text-sm"
                      />
                    </FormField>
                  </motion.div>

                  {/* Country */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Country">
                      <input
                        type="text"
                        value={shipping.country}
                        onChange={(e) =>
                          setShipping({ ...shipping, country: e.target.value })
                        }
                        className="ember-input text-sm"
                      />
                    </FormField>
                  </motion.div>

                  {/* Notes */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Order Notes">
                      <textarea
                        rows={2}
                        value={shipping.notes ?? ""}
                        onChange={(e) =>
                          setShipping({ ...shipping, notes: e.target.value })
                        }
                        placeholder="Delivery instructions (optional)"
                        className="ember-input text-sm resize-none"
                      />
                    </FormField>
                  </motion.div>

                  {/* Error */}
                  <ErrorBanner error={error} />

                  {/* Submit */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <Button type="submit" size="lg" className="w-full">
                      Continue to Payment
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                key="payment-form"
                onSubmit={handlePaymentSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card relative overflow-hidden p-6 space-y-5 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
                />

                {/* Back */}
                <motion.button
                  type="button"
                  onClick={() => setStep("shipping")}
                  disabled={processing}
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-1.5 text-xs text-[#9A94A8] hover:text-[#FF9A3C] transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to shipping
                </motion.button>

                <SectionTitle icon={CreditCard} title="Payment Information" />

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  {/* Demo notice */}
                  <motion.div
                    variants={fadeInUp}
                    transition={spring}
                    className="rounded-lg bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.18)] px-3 py-2.5 flex items-start gap-2 shadow-[0_0_20px_-8px_rgba(255,154,60,0.5)]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FF9A3C] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#FF9A3C] leading-relaxed">
                      <strong>Demo mode:</strong> Use test card{" "}
                      <span className="font-mono">4242 4242 4242 4242</span>,
                      any future expiry, any CVC
                    </p>
                  </motion.div>

                  {/* Card number */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Card Number *">
                      <input
                        type="text"
                        required
                        value={card.number}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            number: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="ember-input text-sm font-mono"
                      />
                    </FormField>
                  </motion.div>

                  {/* Name on card */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <FormField label="Name on Card *">
                      <input
                        type="text"
                        required
                        value={card.name}
                        onChange={(e) =>
                          setCard({ ...card, name: e.target.value })
                        }
                        placeholder="AYESHA KHAN"
                        className="ember-input text-sm uppercase"
                      />
                    </FormField>
                  </motion.div>

                  {/* Expiry + CVC */}
                  <motion.div
                    variants={fadeInUp}
                    transition={spring}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FormField label="Expiry *">
                      <input
                        type="text"
                        required
                        value={card.expiry}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="ember-input text-sm font-mono"
                      />
                    </FormField>

                    <FormField label="CVC *">
                      <input
                        type="text"
                        required
                        value={card.cvc}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                          })
                        }
                        placeholder="123"
                        maxLength={4}
                        className="ember-input text-sm font-mono"
                      />
                    </FormField>
                  </motion.div>

                  {/* Security notice */}
                  <motion.div
                    variants={fadeInUp}
                    transition={spring}
                    className="flex items-center gap-2 pt-2 text-[10px] text-[#6B6678]"
                  >
                    <Lock className="h-3 w-3 text-[#3ECF8E] drop-shadow-[0_0_6px_rgba(62,207,142,0.5)]" />
                    <span>Your payment info is encrypted and secure</span>
                  </motion.div>

                  {/* Error */}
                  <ErrorBanner error={error} />

                  {/* Submit */}
                  <motion.div variants={fadeInUp} transition={spring}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={processing}
                      className="w-full"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Pay {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════
            ORDER SUMMARY
        ═══════════════════════════════════════════ */}
        <OrderSummary
          items={items}
          subtotal={subtotal}
          tax={tax}
          delivery={delivery}
          total={total}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ProgressSteps
   ══════════════════════════════════════════════════════════ */
function ProgressSteps({ step }: { step: Step }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-4 flex items-center justify-center gap-3 sm:gap-6 rounded-2xl border border-[rgba(255,200,120,0.10)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      {[
        { id: "cart", label: "Cart", done: true, active: false },
        {
          id: "shipping",
          label: "Shipping",
          done: step === "payment",
          active: step === "shipping",
        },
        {
          id: "payment",
          label: "Payment",
          done: false,
          active: step === "payment",
        },
      ].map((s, idx) => (
        <div key={s.id} className="flex items-center gap-2 sm:gap-3">
          {idx > 0 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
              className={cn(
                "h-px w-6 sm:w-12 origin-left transition-colors",
                s.done ? "bg-[#3ECF8E]" : "bg-[rgba(255,200,120,0.15)]"
              )}
            />
          )}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: s.active ? [1, 1.08, 1] : 1,
              }}
              transition={{
                duration: 1.6,
                repeat: s.active ? Infinity : 0,
                ease: "easeInOut",
              }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                s.done
                  ? "bg-[#3ECF8E] text-[#0B0A14] shadow-[0_0_12px_rgba(62,207,142,0.5)]"
                  : s.active
                  ? "bg-[#FF9A3C] text-[#0B0A14] shadow-[0_0_16px_rgba(255,154,60,0.6)]"
                  : "bg-white/[0.05] text-[#6B6678]"
              )}
            >
              {s.done ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                idx + 1
              )}
            </motion.div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:inline transition-colors",
                s.done || s.active ? "text-[#F5EFE7]" : "text-[#6B6678]"
              )}
            >
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SectionTitle
   ══════════════════════════════════════════════════════════ */
function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2 relative">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.18)]">
        <Icon className="h-4 w-4 text-[#FF9A3C]" />
      </div>
      <h2 className="font-display text-lg font-semibold text-[#F5EFE7]">
        {title}
      </h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FormField
   ══════════════════════════════════════════════════════════ */
function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
        {Icon && <Icon className="inline h-3 w-3 mr-1" />}
        {label}
      </label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ErrorBanner
   ══════════════════════════════════════════════════════════ */
function ErrorBanner({ error }: { error: string | null }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -12, height: 0 }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -12, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.08)] px-3 py-2.5 shadow-[0_0_24px_-8px_rgba(255,92,92,0.5)]"
          >
            <p className="text-xs text-[#FF5C5C]">{error}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   Order Summary
   ══════════════════════════════════════════════════════════ */
function OrderSummary({
  items,
  subtotal,
  tax,
  delivery,
  total,
}: {
  items: any[];
  subtotal: number;
  tax: number;
  delivery: number;
  total: number;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="lg:sticky lg:top-24 lg:h-fit"
    >
      <div className="glass-card relative overflow-hidden p-6 space-y-5 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />

        <h2 className="font-display text-lg font-semibold text-[#F5EFE7] relative inline-block">
          Order Summary
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-8 bg-gradient-to-r from-[#FF9A3C] to-transparent"
          />
        </h2>

        {/* Items */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mt-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.product_id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              className="flex gap-3"
            >
              <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F] border border-[rgba(255,200,120,0.08)]">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[10px] font-bold text-[#0B0A14] shadow-[0_0_8px_rgba(255,154,60,0.6)]">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#F5EFE7] line-clamp-2">
                  {item.name}
                </p>
                {item.size && item.size !== "One Size" && (
                  <p className="text-[10px] text-[#6B6678] mt-0.5">
                    Size: {item.size}
                  </p>
                )}
                <p className="text-xs font-semibold text-[#FF9A3C] mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="ember-divider my-0" />

        {/* Totals */}
        <div className="space-y-2.5 text-sm">
          <SummaryRow label="Subtotal" value={formatPrice(subtotal)} delay={0.15} />
          <SummaryRow label="Tax (15%)" value={formatPrice(tax)} delay={0.2} />
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <span className="text-[#9A94A8]">Delivery</span>
            {delivery === 0 ? (
              <span className="text-[#3ECF8E] font-medium flex items-center gap-1 drop-shadow-[0_0_8px_rgba(62,207,142,0.5)]">
                <Truck className="h-3 w-3" />
                FREE
              </span>
            ) : (
              <span className="text-[#F5EFE7]">{formatPrice(delivery)}</span>
            )}
          </motion.div>
        </div>

        <div className="ember-divider my-0" />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-baseline justify-between"
        >
          <span className="text-sm uppercase tracking-wider text-[#F5EFE7] font-semibold">
            Total
          </span>
          <motion.span
            key={total}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="font-display text-2xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]"
          >
            {formatPrice(total)}
          </motion.span>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="pt-4 border-t border-[rgba(255,200,120,0.08)] space-y-2.5"
        >
          {[
            { icon: Truck, text: "Free shipping over Rs. 5,000" },
            { icon: Shield, text: "Secure demo checkout" },
            { icon: Check, text: "7-day easy returns" },
          ].map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              variants={fadeInUp}
              transition={spring}
              className="flex items-center gap-2.5 group/badge"
            >
              <Icon className="h-3.5 w-3.5 text-[#FF9A3C] flex-shrink-0 transition-transform duration-300 group-hover/badge:scale-110" />
              <span className="text-[11px] text-[#9A94A8]">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════════════════════
   SummaryRow
   ══════════════════════════════════════════════════════════ */
function SummaryRow({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <span className="text-[#9A94A8]">{label}</span>
      <span className="text-[#F5EFE7]">{value}</span>
    </motion.div>
  );
}