"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useState } from "react";
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function AccountContent({ user }: { user: SupabaseUser }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName =
    (user.user_metadata?.full_name as string) || "Guest User";
  const email = user.email ?? "";

  /* ── Logout ────────────────────────────────────────── */
  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();

    // ✅ NEW: Logout toast
    showToast("Signed out successfully", "info");

    router.push("/");
    router.refresh();
  };

  /* ── Quick links ───────────────────────────────────── */
  const quickLinks = [
    {
      href: "/account/orders",
      icon: Package,
      label: "My Orders",
      description: "Track and manage your orders",
    },
    {
      href: "/account/wishlist",
      icon: Heart,
      label: "Wishlist",
      description: "Your saved items",
    },
    {
      href: "/account/addresses",
      icon: MapPin,
      label: "Addresses",
      description: "Manage shipping addresses",
    },
  ];

  /* ── Stats ─────────────────────────────────────────── */
  const stats = [
    { label: "Orders", value: "0", icon: Package },
    { label: "Wishlist", value: "0", icon: Heart },
    { label: "Addresses", value: "0", icon: MapPin },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8"
    >
      {/* ═══════════════════════════════════════════
          PROFILE CARD
      ═══════════════════════════════════════════ */}
      <motion.aside
        variants={fadeInUp}
        transition={spring}
        className="lg:sticky lg:top-24 lg:h-fit"
      >
        <div className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]">
          {/* Top hairline glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.3)] to-transparent"
          />

          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 320,
                damping: 20,
              }}
              className="relative mb-4"
            >
              {/* Pulse ring */}
              <motion.span
                aria-hidden
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#FF9A3C]"
              />

              {/* Avatar circle */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_30px_rgba(255,154,60,0.45),0_1px_0_rgba(255,255,255,0.3)_inset]">
                <span className="font-display text-2xl font-bold text-[#0B0A14]">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </motion.div>

            <h2 className="font-display text-xl font-semibold text-[#F5EFE7] mb-1">
              {fullName}
            </h2>
            <p className="text-xs text-[#9A94A8] flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              {email}
            </p>
          </div>

          <div className="ember-divider my-0" />

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            disabled={loggingOut}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn(
              "mt-6 w-full flex items-center justify-center gap-2 h-11 rounded-xl",
              "border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.08)]",
              "text-sm font-medium text-[#FF5C5C]",
              "hover:bg-[rgba(255,92,92,0.15)] hover:border-[rgba(255,92,92,0.4)]",
              "hover:shadow-[0_0_24px_-6px_rgba(255,92,92,0.5)]",
              "transition-all duration-300",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            <LogOut
              className={cn("h-4 w-4", loggingOut && "animate-pulse")}
            />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </motion.button>
        </div>
      </motion.aside>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════ */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              transition={{ ...spring, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group glass-card relative overflow-hidden p-5 rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.22)] hover:shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_40px_-16px_rgba(0,0,0,0.75),0_0_28px_-8px_rgba(255,154,60,0.2)] cursor-default"
            >
              {/* Top hairline */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />

              <div className="flex items-center justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.55)]">
                  <Icon className="h-4 w-4 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              <p className="font-display text-2xl font-bold text-[#F5EFE7] transition-colors group-hover:text-[#FF9A3C]">
                {value}
              </p>
              <p className="text-xs text-[#6B6678] mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
          />

          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-4 relative inline-block">
            Manage Account
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
            />
          </h3>

          <div className="space-y-2 mt-5">
            {quickLinks.map(({ href, icon: Icon, label, description }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={href}
                  className="group flex items-center gap-4 rounded-xl border border-[rgba(255,200,120,0.08)] bg-white/[0.02] p-4 hover:border-[rgba(255,154,60,0.3)] hover:bg-[rgba(255,154,60,0.05)] hover:shadow-[0_0_24px_-8px_rgba(255,154,60,0.4)] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-transparent group-hover:bg-[rgba(255,154,60,0.15)] group-hover:border-[rgba(255,154,60,0.3)] transition-all duration-300">
                    <Icon className="h-4 w-4 text-[#FF9A3C] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-[#6B6678]">{description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#6B6678] group-hover:text-[#FF9A3C] group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(62,207,142,0.3)] to-transparent"
          />

          <div className="flex items-start gap-3">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 320,
                damping: 20,
              }}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] shadow-[0_0_16px_-4px_rgba(62,207,142,0.4)]"
            >
              <User className="h-4 w-4 text-[#3ECF8E]" />
            </motion.div>
            <div>
              <h4 className="text-sm font-medium text-[#F5EFE7] mb-1 flex items-center gap-1.5">
                Account Active
                <Sparkles className="h-3 w-3 text-[#FF9A3C]" />
              </h4>
              <p className="text-xs text-[#9A94A8]">
                Your account is set up. Start shopping to see your orders
                appear here.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-3 text-xs font-medium text-[#FF9A3C] hover:text-[#FFB566] transition-colors group"
              >
                Browse collection{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}