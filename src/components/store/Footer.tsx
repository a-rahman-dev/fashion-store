"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { STORE } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

// ──────────────────────────────────────────────────────────
// Simple inline SVGs
// ──────────────────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// Footer Links
// ──────────────────────────────────────────────────────────
type FooterLink = { label: string; href: string };

const FOOTER_LINKS: Record<"shop" | "help" | "company", FooterLink[]> = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?category=new-arrivals" },
    { label: "Sale", href: "/shop?category=sale" },
    { label: "Accessories", href: "/shop?category=accessories" },
  ],
  help: [
    { label: "Contact", href: "/contact" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

// ──────────────────────────────────────────────────────────
// Fade-in animation helper
// ──────────────────────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

// ──────────────────────────────────────────────────────────
// Footer Component
// ──────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      className={cn(
        "relative mt-24",
        "border-t border-[rgba(255,200,120,0.08)]",
        "bg-gradient-to-b from-transparent to-[rgba(255,154,60,0.02)]"
      )}
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0 }}
            className="col-span-2"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
            >
              <span className="font-display text-2xl font-bold text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors relative">
                {STORE.name}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#FF9A3C] to-transparent transition-all duration-300 group-hover:w-full"
                />
              </span>
            </Link>

            <p className="mt-3 text-sm text-[#9A94A8] max-w-xs leading-relaxed">
              {STORE.tagline}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <SocialIcon
                href={`https://instagram.com/${STORE.social.instagram.replace("@", "")}`}
                label="Instagram"
                icon={InstagramIcon}
              />
              <SocialIcon
                href={`https://facebook.com/${STORE.social.facebook}`}
                label="Facebook"
                icon={FacebookIcon}
              />
              <SocialIcon
                href={`mailto:${STORE.email}`}
                label="Email"
                icon={Mail}
              />
            </div>
          </motion.div>

          {/* Shop links */}
          <FooterColumn
            title="Shop"
            links={FOOTER_LINKS.shop}
            delay={0.05}
          />

          {/* Help links */}
          <FooterColumn
            title="Help"
            links={FOOTER_LINKS.help}
            delay={0.1}
          />

          {/* Company links */}
          <FooterColumn
            title="Company"
            links={FOOTER_LINKS.company}
            delay={0.15}
          />
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4",
            "border-t border-[rgba(255,200,120,0.08)]"
          )}
        >
          <p className="text-xs text-[#6B6678]">
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
          </p>
          <p className="text-xs text-[#6B6678]">
            Made with <span className="text-[#FF9A3C]">🔥</span> in Karachi
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const isExternal = href.startsWith("http");

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg",
        "border border-[rgba(255,200,120,0.08)] text-[#9A94A8]",
        "transition-colors duration-200",
        "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
        "hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.5)]"
      )}
    >
      <Icon className="h-4 w-4" />
    </motion.a>
  );
}

function FooterColumn({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: FooterLink[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5EFE7] mb-4 relative inline-block">
        {title}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
        />
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-sm text-[#9A94A8] hover:text-[#FF9A3C] transition-colors duration-200"
            >
              <span
                aria-hidden
                className="inline-block w-0 h-px bg-[#FF9A3C] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}