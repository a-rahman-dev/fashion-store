"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STORE, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { CartCount } from "./CartCount";
import { CartDrawer } from "./CartDrawer";
import { SearchModal } from "./SearchModal";
import { Flame, Package, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Keyboard shortcut: Ctrl/Cmd + K ──────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "sticky top-0 z-50 bg-[#0B0A14]/80 backdrop-blur-2xl",
          "border-b border-[rgba(255,200,120,0.08)]",
          "shadow-[0_1px_0_rgba(255,200,120,0.05)_inset,0_8px_32px_-12px_rgba(0,0,0,0.7)]"
        )}
      >
        {/* Top hairline glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
        />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="font-display text-2xl font-bold text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors relative"
            >
              {STORE.name}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#FF9A3C] to-transparent transition-all duration-300 group-hover:w-full"
              />
            </motion.span>
            <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-[#FF9A3C] live-dot shadow-[0_0_8px_rgba(255,154,60,0.8)]" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-[#FF9A3C]"
                      : "text-[#9A94A8] hover:text-[#F5EFE7]"
                  )}
                >
                  {link.label}

                  {active && (
                    <motion.span
                      layoutId="navbar-active-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-[#FF9A3C] to-transparent shadow-[0_0_8px_rgba(255,154,60,0.6)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {"highlight" in link && link.highlight && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#FF9A3C] shadow-[0_0_6px_rgba(255,154,60,0.8)] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search — opens modal */}
            <NavIconButton
              onClick={() => setSearchOpen(true)}
              icon={Search}
              label="Search"
            />

            <NavIconButton
              href="/account/wishlist"
              icon={Heart}
              label="Wishlist"
            />

            {/* Cart — opens drawer */}
            <NavIconButton
              onClick={() => setCartOpen(true)}
              icon={ShoppingBag}
              label="Open cart"
              badge={<CartCount />}
            />

            {/* Account dropdown */}
            <div className="relative group/account">
              <NavIconButton
                href="/account"
                icon={User}
                label="Account"
                iconSize="h-6 w-6"
              />

              {/* Hover Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-200 z-50">
                <div className="w-56 glass-card p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  {/* Dashboards */}
                  <Link
                    href="/seller"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.15)] transition-all font-medium"
                  >
                    <Flame className="h-4 w-4" />
                    Seller Console
                  </Link>

                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#FF9A3C] hover:bg-[rgba(255,154,60,0.15)] transition-all font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <div className="ember-divider my-1.5" />

                  {/* Customer links */}
                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#F5EFE7] hover:bg-[rgba(255,154,60,0.1)] hover:text-[#FF9A3C] transition-all"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>

                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#F5EFE7] hover:bg-[rgba(255,154,60,0.1)] hover:text-[#FF9A3C] transition-all"
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>

                  <Link
                    href="/account/wishlist"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#F5EFE7] hover:bg-[rgba(255,154,60,0.1)] hover:text-[#FF9A3C] transition-all"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="md:hidden overflow-hidden border-t border-[rgba(255,200,120,0.08)] bg-[#0B0A14]/95 backdrop-blur-2xl"
            >
              <div className="space-y-1 p-4">
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-[rgba(255,154,60,0.1)] text-[#FF9A3C] border border-[rgba(255,154,60,0.2)]"
                            : "text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7]"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   NAV ICON BUTTON
   ══════════════════════════════════════════════════════════ */
function NavIconButton({
  href,
  onClick,
  icon: Icon,
  label,
  hidden,
  badge,
  iconSize = "h-4 w-4",
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hidden?: boolean;
  badge?: React.ReactNode;
  iconSize?: string;
}) {
  const classes = cn(
    "relative flex h-10 w-10 items-center justify-center rounded-lg",
    "text-[#9A94A8] transition-all duration-200",
    "hover:bg-white/5 hover:text-[#F5EFE7]",
    "hover:shadow-[0_0_20px_-6px_rgba(255,154,60,0.4)]",
    hidden && "hidden sm:flex"
  );

  const content = (
    <>
      <Icon className={iconSize} />
      {badge}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
        aria-label={label}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} aria-label={label}>
      {content}
    </button>
  );
}