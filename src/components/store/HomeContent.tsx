"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Quote,
  ShoppingBag,
  TrendingUp,
  Award,
  Clock,
  Flame,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCountUp } from "@/hooks/useCountUp";
import { HeroParticles } from "./HeroParticles";
import { ScrollProgress } from "./ScrollProgress";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  compare_at_price?: number | null;
  primary_image?: string | null;
  category_name?: string | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  is_featured?: boolean;
  total_sold?: number;
};

export function HomeContent({ featured }: { featured: FeaturedProduct[] }) {
  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />
      <HeroSection />
      <TrustMarquee />
      <TrustBar />
      <FeaturedSection featured={featured} />
      <GoldDivider />
      <CategoriesSection />
      <GoldDivider />
      <WhyChooseSection />
      <TestimonialsSection />
      <FinalCTASection />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   1. HERO — CINEMATIC with background image
   ══════════════════════════════════════════════════════════ */
function HeroSection() {
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 150 : 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, isDesktop ? 0 : 1]
  );

  // 👇 NEW: Background image parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 100 : 0]);
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, isDesktop ? 1.1 : 1]
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════════════════════════════════════
          NEW: BACKGROUND IMAGE with parallax + overlays
      ═══════════════════════════════════════════ */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"      >
        {/* Actual image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/products/luvera-hero.jpg')",
          }}
        />

        {/* Dark overlay — text readability */}
        <div className="absolute inset-0 bg-[#0B0A14]/75" />

        {/* Radial vignette — corners darker */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,10,20,0.6)_70%,rgba(11,10,20,0.95)_100%)]" />

        {/* Top gradient — blend with navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B0A14] to-transparent" />

        {/* Bottom gradient — blend with next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0A14] to-transparent" />
      </motion.div>

      {isDesktop && <HeroParticles count={25} />}

      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <motion.div
          animate={
            isDesktop
              ? { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }
              : {}
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#FF9A3C]/10 blur-[120px]"
        />
        <motion.div
          animate={
            isDesktop
              ? { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }
              : {}
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#E67E22]/5 blur-[100px]"
        />
      </motion.div>

      {isDesktop && (
        <motion.div
          style={{ left: mouseX, top: mouseY }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,154,60,0.08),transparent_70%)] z-0"
        />
      )}

      <motion.div
        animate={
          isDesktop ? { y: [0, -18, 0], rotate: [12, 18, 12] } : {}
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-8 text-6xl opacity-[0.06] select-none pointer-events-none"
      >
        ✨
      </motion.div>
      <motion.div
        animate={
          isDesktop ? { y: [0, 20, 0], rotate: [-12, -18, -12] } : {}
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-32 right-8 text-8xl opacity-[0.06] select-none pointer-events-none"
      >
        🌙
      </motion.div>

      <motion.div
        style={{ opacity }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative text-center max-w-5xl mx-auto z-20"      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,200,120,0.15)] bg-[rgba(255,154,60,0.05)] px-4 py-1.5 mb-8 mt-12 backdrop-blur-sm shadow-[0_0_24px_-8px_rgba(255,154,60,0.5)]"        >
          <motion.span
            animate={isDesktop ? { rotate: [0, 15, -10, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF9A3C]" />
          </motion.span>
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-[#FF9A3C]">
            New Collection 2026
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-[#F5EFE7] leading-[0.95] mb-8"
        >
          Wear the
          <motion.span
            initial={{ backgroundPosition: "0% 50%" }}
            animate={isDesktop ? { backgroundPosition: "100% 50%" } : {}}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="block bg-gradient-to-r from-[#FF9A3C] via-[#FFB566] to-[#F4D06F] bg-clip-text text-transparent bg-[length:200%_100%]"
          >
            night.
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeInUp}
          transition={spring}
          className="text-lg sm:text-xl text-[#9A94A8] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Modern Pakistani fashion, crafted for those who move after dark.
          Discover timeless elegance in every thread.
        </motion.p>

        {/* CTAs — 4 buttons */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <MagneticButton href="/shop">
            <Button size="lg" className="group">
              <ShoppingBag className="h-4 w-4" />
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </MagneticButton>

          <Link href="/shop?category=new-arrivals">
            <Button variant="outline" size="lg">
              New Arrivals
            </Button>
          </Link>

          <Link href="/seller">
            <Button variant="outline" size="lg" className="group">
              <Flame className="h-4 w-4 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              Seller Console
            </Button>
          </Link>

          <Link href="/account">
            <Button variant="outline" size="lg" className="group">
              <LayoutDashboard className="h-4 w-4 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeInUp}
          transition={spring}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
        >
          <StatItem value={60} suffix="+" label="Products" delay={0.8} />
          <StatItem
            value={10}
            suffix="K+"
            label="Customers"
            delay={0.9}
            isDesktop={isDesktop}
          />
          <StatItem
            value={4.8}
            suffix="★"
            label="Rating"
            delay={1.0}
            isDecimal
          />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={isDesktop ? { y: [0, 8, 0] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#FF9A3C]/60 to-transparent" />
          <span className="text-[10px] uppercase tracking-widest text-[#6B6678]">
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Magnetic Button wrapper
   ══════════════════════════════════════════════════════════ */
function MagneticButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isDesktop = useIsDesktop();
  const { ref, springX, springY, handleMouseMove, handleMouseLeave } =
    useMagnetic(isDesktop ? 0.35 : 0);

  if (!isDesktop) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <Link href={href}>{children}</Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Stat item with count-up
   ══════════════════════════════════════════════════════════ */
function StatItem({
  value,
  suffix,
  label,
  delay,
  isDecimal = false,
  isDesktop = true,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isDecimal?: boolean;
  isDesktop?: boolean;
}) {
  const { ref, count } = useCountUp<HTMLParagraphElement>(
    isDecimal ? value * 10 : value,
    1800
  );
  const display = isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...spring }}
      className="text-center group cursor-default"
    >
      <p
        ref={ref}
        className="font-display text-3xl sm:text-4xl font-bold text-[#FF9A3C] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,154,60,0.6)]"
      >
        {display}
        {suffix}
      </p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mt-1">
        {label}
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Trust Marquee
   ══════════════════════════════════════════════════════════ */
function TrustMarquee() {
  const items = [
    "✦ Handcrafted in Pakistan",
    "✦ Premium Fabrics",
    "✦ Free Shipping Over Rs. 5,000",
    "✦ 7-Day Returns",
    "✦ AI-Powered Shopping",
    "✦ 10,000+ Happy Customers",
    "✦ Secure Payments",
    "✦ Fast Delivery",
  ];

  return (
    <div className="relative overflow-hidden border-y border-[rgba(255,200,120,0.08)] bg-gradient-to-r from-transparent via-[rgba(255,154,60,0.02)] to-transparent py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-8"
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-xs uppercase tracking-[0.2em] text-[#9A94A8] hover:text-[#FF9A3C] transition-colors"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Gold Divider
   ══════════════════════════════════════════════════════════ */
function GoldDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px origin-center bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.3)] to-transparent"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   2. TRUST BAR
   ══════════════════════════════════════════════════════════ */
function TrustBar() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isDesktop = useIsDesktop();

  const items = [
    { icon: Truck, label: "Free Shipping", sub: "Over Rs. 5,000" },
    { icon: Shield, label: "Secure Payment", sub: "100% Protected" },
    { icon: RotateCcw, label: "Easy Returns", sub: "7-Day Policy" },
    { icon: Clock, label: "Fast Support", sub: "24/7 Help" },
  ];

  return (
    <section
      ref={ref}
      className="relative border-y border-[rgba(255,200,120,0.08)] bg-white/[0.01]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.2)] to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.2)] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {items.map(({ icon: Icon, label, sub }) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              transition={spring}
              whileHover={isDesktop ? { y: -3 } : {}}
              className="flex items-center gap-3 group cursor-default"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.15)] group-hover:border-[rgba(255,154,60,0.35)] group-hover:shadow-[0_0_20px_-4px_rgba(255,154,60,0.5)]">
                <Icon className="h-4 w-4 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F5EFE7]">{label}</p>
                <p className="text-[10px] text-[#6B6678]">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   3. FEATURED PRODUCTS
   ══════════════════════════════════════════════════════════ */
function FeaturedSection({ featured }: { featured: FeaturedProduct[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="flex items-end justify-between mb-10"
      >
        <motion.div variants={fadeInUp} transition={spring}>
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
            ✨ Featured
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
            Curated for you
          </h2>
          <p className="text-sm text-[#9A94A8] mt-2 max-w-md">
            Handpicked pieces that define modern Pakistani elegance
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} transition={spring}>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#9A94A8] hover:text-[#FF9A3C] transition-colors group"
          >
            View all products
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      {featured.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  base_price: product.base_price,
                  compare_at_price: product.compare_at_price,
                  image_url: product.primary_image,
                  category_name: product.category_name,
                  rating_avg: product.rating_avg,
                  rating_count: product.rating_count,
                  is_featured: product.is_featured,
                  total_sold: product.total_sold,
                }}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-[#9A94A8]">Loading products...</p>
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <Link href="/shop">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   4. CATEGORIES — 3D tilt
   ══════════════════════════════════════════════════════════ */
function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isDesktop = useIsDesktop();

  const visibleCategories = CATEGORIES.filter(
    (c) => !["new-arrivals", "sale"].includes(c.slug)
  );

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-12"
      >
        <motion.p
          variants={fadeInUp}
          transition={spring}
          className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2"
        >
          Browse by
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          transition={spring}
          className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]"
        >
          Shop Categories
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            isDesktop={isDesktop}
          />
        ))}
      </motion.div>
    </section>
  );
}

function CategoryCard({
  category,
  isDesktop,
}: {
  category: { slug: string; name: string };
  isDesktop: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={fadeInUp}
      transition={spring}
      style={isDesktop ? { rotateX, rotateY, transformPerspective: 1000 } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isDesktop ? { y: -6, scale: 1.02 } : {}}
    >
      <Link
        href={`/shop?category=${category.slug}`}
        className="group relative glass-card overflow-hidden aspect-[4/3] flex items-center justify-center rounded-2xl border border-[rgba(255,200,120,0.10)] transition-all duration-500 hover:border-[rgba(255,200,120,0.25)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(255,154,60,0.25)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,154,60,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        <div className="relative text-center z-10">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE7] group-hover:text-[#FF9A3C] transition-colors duration-300">
            {category.name}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#6B6678] group-hover:text-[#FF9A3C] transition-colors duration-300">
            Explore
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#FF9A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(255,154,60,0.8)]" />
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   5. WHY CHOOSE US
   ══════════════════════════════════════════════════════════ */
function WhyChooseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isDesktop = useIsDesktop();

  const items = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Handcrafted by skilled Pakistani artisans using the finest fabrics and materials",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Shopping",
      description:
        "Our intelligent assistant helps you find the perfect piece in seconds",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Free shipping on orders over Rs. 5,000, delivered within 3-5 days",
    },
    {
      icon: TrendingUp,
      title: "Trending Designs",
      description:
        "Stay ahead with the latest fashion — traditional meets modern",
    },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-12"
      >
        <motion.p
          variants={fadeInUp}
          transition={spring}
          className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2"
        >
          Why Luvéra
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          transition={spring}
          className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]"
        >
          Crafted with care
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {items.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={fadeInUp}
            transition={spring}
            whileHover={isDesktop ? { y: -6 } : {}}
            className="group glass-card relative p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] overflow-hidden transition-all duration-500 hover:border-[rgba(255,200,120,0.25)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(255,154,60,0.2)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,154,60,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,154,60,0.1)] border border-[rgba(255,154,60,0.15)] mb-5 transition-all duration-300 group-hover:bg-[rgba(255,154,60,0.18)] group-hover:border-[rgba(255,154,60,0.4)] group-hover:shadow-[0_0_24px_-4px_rgba(255,154,60,0.55)]">
                <Icon className="h-5 w-5 text-[#FF9A3C] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#F5EFE7] mb-2">
                {title}
              </h3>
              <p className="text-xs text-[#9A94A8] leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   6. TESTIMONIALS
   ══════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isDesktop = useIsDesktop();

  const testimonials = [
    {
      name: "Ayesha Khan",
      city: "Karachi",
      text: "The Kashmiri Pheran I ordered was stunning — quality exceeded my expectations. The AI assistant helped me find the perfect size!",
      rating: 5,
    },
    {
      name: "Hassan Ali",
      city: "Lahore",
      text: "Ordered a Sherwani for my wedding — got so many compliments. Delivery was fast and packaging was premium.",
      rating: 5,
    },
    {
      name: "Fatima Zahra",
      city: "Islamabad",
      text: "Absolutely love the jewelry collection. The Gold Jhumka is an heirloom piece. Customer service is top-notch!",
      rating: 5,
    },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-12"
      >
        <motion.p
          variants={fadeInUp}
          transition={spring}
          className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2"
        >
          Loved by
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          transition={spring}
          className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]"
        >
          What our customers say
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.name}
            variants={fadeInUp}
            transition={spring}
            whileHover={isDesktop ? { y: -6 } : {}}
            className="group glass-card relative p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] overflow-hidden transition-all duration-500 hover:border-[rgba(255,200,120,0.25)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(255,154,60,0.2)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <Quote className="absolute top-4 right-4 h-8 w-8 text-[#FF9A3C] opacity-10 transition-opacity duration-500 group-hover:opacity-25" />

            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={
                    i <= testimonial.rating
                      ? "h-3.5 w-3.5 fill-[#F4D06F] text-[#F4D06F]"
                      : "h-3.5 w-3.5 text-[#6B6678]"
                  }
                />
              ))}
            </div>

            <p className="text-sm text-[#9A94A8] leading-relaxed mb-5 italic">
              &ldquo;{testimonial.text}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,200,120,0.08)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_16px_-2px_rgba(255,154,60,0.5)]">
                <span className="font-display text-xs font-bold text-[#0B0A14]">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#F5EFE7]">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-[#6B6678]">{testimonial.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   7. FINAL CTA
   ══════════════════════════════════════════════════════════ */
function FinalCTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isDesktop = useIsDesktop();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        className="glass-card relative overflow-hidden p-12 sm:p-16 text-center rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_30px_80px_-20px_rgba(0,0,0,0.85)]"
      >
        {isDesktop && (
          <motion.div
            style={{ left: mouseX, top: mouseY }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,154,60,0.12),transparent_70%)]"
          />
        )}

        <motion.div
          animate={
            isDesktop
              ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
              : {}
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-[#FF9A3C]/10 blur-[100px]"
        />
        <motion.div
          animate={
            isDesktop
              ? { scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }
              : {}
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#E67E22]/5 blur-[100px]"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.4)] to-transparent"
        />

        <div className="relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5EFE7] mb-5">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#FF9A3C] to-[#F4D06F] bg-clip-text text-transparent">
              explore?
            </span>
          </h2>
          <p className="text-base text-[#9A94A8] max-w-xl mx-auto mb-10">
            Discover our collection of 60+ premium Pakistani fashion pieces.
            Free shipping on orders over Rs. 5,000.
          </p>

          <MagneticButton href="/shop">
            <Button size="lg" className="group">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}