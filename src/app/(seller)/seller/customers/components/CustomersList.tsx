"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  Users,
  UserPlus,
  UserCheck,
  ShoppingCart,
  Mail,
  Phone,
  Calendar,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type {
  CustomerWithStats,
  CustomerStats,
} from "@/lib/db/queries/customers";

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
   Avatar
   ══════════════════════════════════════════════════════════ */
function Avatar({ name }: { name: string | null }) {
  const initial = name?.charAt(0).toUpperCase() ?? "?";

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_16px_-2px_rgba(255,154,60,0.4),0_1px_0_rgba(255,255,255,0.25)_inset]"
    >
      <span className="font-display text-sm font-bold text-[#0B0A14]">
        {initial}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function CustomersList({
  customers,
  stats,
}: {
  customers: CustomerWithStats[];
  stats: CustomerStats;
}) {
  const [search, setSearch] = useState("");

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-40px" });

  /* ── Filtered ─────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return customers;

    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  /* ── Stats Cards ───────────────────────────────── */
  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
    },
    {
      label: "New This Month",
      value: stats.newThisMonth.toString(),
      icon: UserPlus,
    },
    {
      label: "Active Customers",
      value: stats.activeCustomers.toString(),
      icon: UserCheck,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
  ];

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
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
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
          SEARCH
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={spring}
        className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,200,120,0.10)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.22)] to-transparent"
        />

        <div className="relative w-full group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6678] pointer-events-none z-10 transition-colors group-focus-within/search:text-[#FF9A3C]" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
            className="w-full h-11 ember-input text-sm"
          />
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          RESULTS COUNT
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between text-xs"
      >
        <p className="text-[#6B6678] uppercase tracking-wider">
          Showing{" "}
          <span className="text-[#FF9A3C] font-semibold">
            {filtered.length}
          </span>{" "}
          of {customers.length} customers
        </p>
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearch("")}
              className="text-[#FF9A3C] hover:text-[#FFB566] transition-colors"
            >
              Clear search
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════
          CUSTOMERS TABLE
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative overflow-hidden rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.28)] to-transparent z-10"
        />

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
          >
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
              <Users className="relative h-7 w-7 text-[#FF9A3C]" />
            </motion.div>
            <h3 className="font-display text-lg font-semibold text-[#F5EFE7] mb-2">
              {search ? "No customers found" : "No customers yet"}
            </h3>
            <p className="text-sm text-[#9A94A8] max-w-md mx-auto">
              {search
                ? "Try changing your search query"
                : "Customers will appear here once they sign up"}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,200,120,0.08)] bg-white/[0.02]">
                  {[
                    { label: "Customer", cls: "" },
                    { label: "Contact", cls: "hidden md:table-cell" },
                    { label: "Joined", cls: "hidden lg:table-cell" },
                    { label: "Orders", cls: "" },
                    { label: "Spent", cls: "hidden sm:table-cell" },
                    { label: "Actions", cls: "text-right" },
                  ].map(({ label, cls }) => (
                    <th
                      key={label}
                      className={cn(
                        "text-left text-[10px] uppercase tracking-wider text-[#6B6678] font-medium px-4 py-3",
                        cls
                      )}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((customer, i) => (
                    <motion.tr
                      key={customer.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(i * 0.02, 0.3),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group/row border-b border-[rgba(255,200,120,0.05)] hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.full_name} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#F5EFE7] line-clamp-1 group-hover/row:text-[#FF9A3C] transition-colors">
                              {customer.full_name ?? "Unnamed User"}
                            </p>
                            <p className="text-[10px] text-[#6B6678] md:hidden mt-0.5">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          {customer.email && (
                            <p className="text-xs text-[#9A94A8] flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-[#6B6678]" />
                              {customer.email}
                            </p>
                          )}
                          {customer.phone && (
                            <p className="text-xs text-[#9A94A8] flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-[#6B6678]" />
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#9A94A8] flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-[#6B6678]" />
                          {new Date(customer.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#9A94A8] transition-colors group-hover/row:text-[#F5EFE7]">
                          <ShoppingBag className="h-3 w-3 text-[#FF9A3C]" />
                          {customer.orders_count}
                        </span>
                      </td>

                      {/* Spent */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm font-semibold text-[#FF9A3C] transition-all duration-300 group-hover/row:drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]">
                          {formatPrice(customer.total_spent)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <motion.div
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={spring}
                          className="inline-block"
                        >
                          <Link
                            href={`/seller/customers/${customer.id}`}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                              "border border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8]",
                              "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
                              "hover:shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]",
                              "transition-all duration-300"
                            )}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Link>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}