"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Package,
  Truck,
  Home,
  Mail,
  ArrowRight,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Confetti Particles
   ══════════════════════════════════════════════════════════ */
function ConfettiBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (i / 24) * Math.PI * 2 + Math.random() * 0.4,
    distance: 100 + Math.random() * 80,
    size: 4 + Math.random() * 6,
    color: ["#FF9A3C", "#3ECF8E", "#F4D06F", "#FFB566", "#E67E22"][
      Math.floor(Math.random() * 5)
    ],
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {particles.map((p) => {
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;
        return (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x,
              y: y + 40,
              opacity: 0,
              scale: 0.6,
              rotate: 360,
            }}
            transition={{
              duration: 1.6,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-1/2 left-1/2 rounded-sm"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function OrderSuccess({ orderNumber }: { orderNumber?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrder = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto text-center"
    >
      {/* ═══════════════════════════════════════════
          SUCCESS ICON with confetti burst
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 18,
          delay: 0.05,
        }}
        className="relative mx-auto mb-8 w-fit"
      >
        {/* Confetti burst — one-time */}
        <ConfettiBurst />

        {/* Pulse rings */}
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#3ECF8E]"
        />
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.6,
          }}
          className="absolute inset-0 rounded-full bg-[#3ECF8E]"
        />

        {/* Main icon */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3ECF8E] to-[#2BA66B] shadow-[0_0_40px_rgba(62,207,142,0.5),0_1px_0_rgba(255,255,255,0.35)_inset]">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: 0.35,
            }}
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          HEADING
      ═══════════════════════════════════════════ */}
      <motion.h1
        variants={fadeInUp}
        transition={spring}
        className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7] mb-4"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        transition={spring}
        className="text-lg text-[#9A94A8] max-w-md mx-auto mb-6"
      >
        Thank you for your order. We&apos;ve received it and will start
        processing it shortly.
      </motion.p>

      {/* ═══════════════════════════════════════════
          ORDER NUMBER with copy button
      ═══════════════════════════════════════════ */}
      {orderNumber && (
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="inline-flex flex-col items-center gap-1 glass-card relative overflow-hidden px-6 py-4 mb-8 rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          {/* Top hairline glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
          />

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B6678]">
            Order Number
          </p>

          <div className="flex items-center gap-2">
            <p className="font-display text-2xl font-bold text-[#FF9A3C] font-mono drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]">
              {orderNumber}
            </p>

            <motion.button
              type="button"
              onClick={handleCopyOrder}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#9A94A8] hover:text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.1)] transition-colors"
              aria-label="Copy order number"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Check className="h-3.5 w-3.5 text-[#3ECF8E]" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          WHAT'S NEXT — Timeline steps
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        transition={spring}
        className="glass-card relative overflow-hidden p-6 sm:p-8 text-left mb-8 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />

        <h2 className="font-display text-xl font-semibold text-[#F5EFE7] mb-6 text-center relative inline-block w-full">
          <span className="relative inline-block">
            What happens next?
            <span
              aria-hidden
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px w-12 bg-gradient-to-r from-transparent via-[#FF9A3C] to-transparent"
            />
          </span>
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {[
            {
              icon: Mail,
              title: "Confirmation Email",
              description:
                "You'll receive an order confirmation with all the details",
            },
            {
              icon: Package,
              title: "Order Processing",
              description:
                "We'll prepare and pack your order with care (1-2 days)",
            },
            {
              icon: Truck,
              title: "Shipping",
              description:
                "Your order will be delivered to your address within 3-5 days",
            },
            {
              icon: Home,
              title: "Delivery",
              description:
                "Track your order anytime from your account",
            },
          ].map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              transition={{ ...spring, delay: i * 0.08 }}
              className="group/step relative flex items-start gap-4"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.06, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.18)] transition-all duration-300 group-hover/step:bg-[rgba(255,154,60,0.16)] group-hover/step:border-[rgba(255,154,60,0.4)] group-hover/step:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]"
              >
                <Icon className="h-4 w-4 text-[#FF9A3C]" />
              </motion.div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-[#F5EFE7]">{title}</p>
                <p className="text-xs text-[#9A94A8] mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Step number */}
              <span className="text-[10px] font-mono text-[#6B6678] mt-2">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ACTIONS
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        transition={spring}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link href="/account/orders">
          <Button size="lg" className="group">
            Track Your Order
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </motion.div>

      {/* ═══════════════════════════════════════════
          FOOTER NOTE
      ═══════════════════════════════════════════ */}
      <motion.p
        variants={fadeInUp}
        transition={spring}
        className="mt-8 text-xs text-[#6B6678]"
      >
        Need help? Contact us at{" "}
        <a
          href="mailto:hello@luvera.store"
          className="text-[#FF9A3C] hover:underline transition-colors"
        >
          hello@luvera.store
        </a>
      </motion.p>
    </motion.div>
  );
}