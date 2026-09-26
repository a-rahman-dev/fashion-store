"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { AddToCartForm } from "./AddToCartForm";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/currency";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function ProductDetailContent({
  product,
  relatedProducts,
  hasDiscount,
  discount,
}: {
  product: any;
  relatedProducts: any[];
  hasDiscount: boolean;
  discount: number;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Breadcrumb ──────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-xs text-[#6B6678] mb-6"
      >
        <Link
          href="/shop"
          className="hover:text-[#FF9A3C] transition-colors"
        >
          Shop
        </Link>
        <span>/</span>
        {product.category_name && (
          <>
            <Link
              href={`/shop?category=${product.category?.slug ?? ""}`}
              className="hover:text-[#FF9A3C] transition-colors"
            >
              {product.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#9A94A8] truncate">{product.name}</span>
      </motion.nav>

      {/* ── Back button ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-[#9A94A8] hover:text-[#FF9A3C] transition-colors mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to shop
        </Link>
      </motion.div>

      {/* ── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
        {/* ═══════════════════════════════════════════
            IMAGE
        ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="glass-card relative overflow-hidden rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.8)]">
            {/* Top hairline */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent z-10"
            />

            <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1A1730] to-[#12101F] overflow-hidden group">
              {product.primary_image ? (
                <motion.img
                  src={product.primary_image}
                  alt={product.name}
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.04 }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-6xl text-[#6B6678]">
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 320,
                    damping: 20,
                  }}
                  className="absolute top-4 left-4 z-20"
                >
                  <Badge variant="sale">-{discount}% OFF</Badge>
                </motion.div>
              )}

              {/* Featured badge */}
              {product.is_featured && !hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 320,
                    damping: 20,
                  }}
                  className="absolute top-4 left-4 z-20"
                >
                  <Badge variant="info">Featured</Badge>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            INFO
        ═══════════════════════════════════════════ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-0"
        >
          {/* Category */}
          {product.category_name && (
            <motion.p
              variants={fadeInUp}
              transition={spring}
              className="text-[10px] uppercase tracking-[0.2em] text-[#6B6678] mb-2"
            >
              {product.category_name}
            </motion.p>
          )}

          {/* Name */}
          <motion.h1
            variants={fadeInUp}
            transition={spring}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EFE7] leading-tight mb-4"
          >
            {product.name}
          </motion.h1>

          {/* Rating */}
          {product.rating_avg !== null && product.rating_avg > 0 && (
            <motion.div
              variants={fadeInUp}
              transition={spring}
              className="flex items-center gap-3 mb-6 flex-wrap"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={
                      i <= Math.round(product.rating_avg!)
                        ? "h-4 w-4 fill-[#F4D06F] text-[#F4D06F]"
                        : "h-4 w-4 text-[#6B6678]"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-[#9A94A8]">
                {product.rating_avg} ({product.rating_count} reviews)
              </span>
              {product.total_sold > 0 && (
                <>
                  <span className="text-[#6B6678]">•</span>
                  <span className="text-sm text-[#9A94A8]">
                    {product.total_sold} sold
                  </span>
                </>
              )}
            </motion.div>
          )}

          {/* Price */}
          <motion.div
            variants={fadeInUp}
            transition={spring}
            className="flex items-baseline gap-3 mb-8 flex-wrap"
          >
            <span className="text-3xl sm:text-4xl font-bold text-[#FF9A3C] drop-shadow-[0_0_12px_rgba(255,154,60,0.35)]">
              {formatPrice(product.base_price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-[#6B6678] line-through">
                  {formatPrice(product.compare_at_price!)}
                </span>
                <Badge variant="sale" className="ml-2">
                  Save{" "}
                  {formatPrice(product.compare_at_price! - product.base_price)}
                </Badge>
              </>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeInUp}
            transition={spring}
            className="ember-divider"
          />

          {/* Description */}
          {product.description && (
            <motion.div
              variants={fadeInUp}
              transition={spring}
              className="mb-8 pt-8"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-3 relative inline-block">
                Description
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-[#FF9A3C] to-transparent"
                />
              </h3>
              <p className="text-sm text-[#9A94A8] leading-relaxed mt-4">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <motion.div
              variants={fadeInUp}
              transition={spring}
              className="flex flex-wrap gap-2 mb-8"
            >
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="default" className="normal-case">
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Add to Cart Form */}
          <motion.div variants={fadeInUp} transition={spring}>
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.base_price}
              imageUrl={product.primary_image ?? ""}
            />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            transition={spring}
            className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-[rgba(255,200,120,0.08)]"
          >
            {[
              { icon: Truck, label: "Free Shipping", sub: "Over Rs. 5,000" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7 days" },
              { icon: Shield, label: "Secure Payment", sub: "Stripe" },
            ].map(({ icon: Icon, label, sub }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="text-center group cursor-default"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.15)] mb-2 transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.15)] group-hover:border-[rgba(255,154,60,0.35)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.5)]">
                  <Icon className="h-4 w-4 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="text-xs font-medium text-[#F5EFE7]">{label}</p>
                <p className="text-[10px] text-[#6B6678]">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          RELATED PRODUCTS
      ═══════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <RelatedSection products={relatedProducts} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Related Products Section
   ══════════════════════════════════════════════════════════ */
function RelatedSection({ products }: { products: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="pt-12 border-t border-[rgba(255,200,120,0.08)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
            You may also like
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE7]">
            Related Products
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProductCard
              product={{
                id: p.id,
                slug: p.slug,
                name: p.name,
                base_price: p.base_price,
                compare_at_price: p.compare_at_price,
                image_url: p.primary_image,
                category_name: p.category_name,
                rating_avg: p.rating_avg,
                rating_count: p.rating_count,
                is_featured: p.is_featured,
                total_sold: p.total_sold,
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}