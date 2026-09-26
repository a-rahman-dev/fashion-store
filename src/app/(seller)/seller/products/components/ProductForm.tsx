"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  Save,
  ImageIcon,
  Tag,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast";
import { slugify } from "@/lib/utils/slug";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/db";
import {
  createProduct,
  updateProduct,
  type ProductFormInput,
} from "../actions";

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

type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  base_price: number;
  compare_at_price: number | null;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
};

/* ══════════════════════════════════════════════════════════
   Toggle — upgraded
   ══════════════════════════════════════════════════════════ */
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full p-0.5",
        "transition-all duration-300",
        enabled
          ? "bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_16px_-4px_rgba(255,154,60,0.7)]"
          : "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]"
      )}
      aria-checked={enabled}
      role="switch"
    >
      <motion.span
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="h-5 w-5 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   Section Card
   ══════════════════════════════════════════════════════════ */
function SectionCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ ...spring, delay }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl border border-[rgba(255,200,120,0.10)] shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.25)] to-transparent"
      />

      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EFE7] mb-5 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-[#FF9A3C]" />}
        {title}
      </h3>

      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Form
   ══════════════════════════════════════════════════════════ */
export function ProductForm({
  categories,
  initialData,
  mode,
}: {
  categories: Category[];
  initialData?: ProductFormData;
  mode: "create" | "edit";
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "",
      slug: "",
      description: "",
      category_id: categories[0]?.id ?? "",
      base_price: 0,
      compare_at_price: null,
      image_url: "",
      is_active: true,
      is_featured: false,
      tags: [],
    }
  );

  const [tagsInput, setTagsInput] = useState(
    (initialData?.tags ?? []).join(", ")
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Update helper ───────────────────────────── */
  const update = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !isEdit) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  /* ── Submit ──────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ProductFormInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      category_id: form.category_id,
      base_price: Number(form.base_price),
      compare_at_price:
        form.compare_at_price && form.compare_at_price > 0
          ? Number(form.compare_at_price)
          : null,
      image_url: form.image_url.trim(),
      is_active: form.is_active,
      is_featured: form.is_featured,
      tags,
    };

    const result = isEdit
      ? await updateProduct(form.id!, payload)
      : await createProduct(payload);

    if (result && "error" in result && result.error) {
      setError(result.error);
      setSubmitting(false);
      showToast(result.error, "error");
      return;
    }

    // ✅ NEW: Success toast
    showToast(
      isEdit ? "Product updated successfully" : "Product created successfully",
      "success"
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ x: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
          >
            <Link
              href="/seller/products"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "border border-[rgba(255,200,120,0.15)] bg-white/[0.03] text-[#9A94A8]",
                "hover:border-[#FF9A3C] hover:text-[#FF9A3C]",
                "hover:shadow-[0_0_16px_-4px_rgba(255,154,60,0.5)]",
                "transition-all duration-300"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </motion.div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F5EFE7]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[#9A94A8] mt-0.5">
              {isEdit
                ? "Update product details"
                : "Fill in the details to add a new product"}
            </p>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </Button>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ERROR
      ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card relative overflow-hidden p-4 rounded-2xl border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.06)] shadow-[0_0_24px_-8px_rgba(255,92,92,0.5)]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-[#FF5C5C] shadow-[0_0_8px_rgba(255,92,92,0.9)]"
              />
              <div className="flex items-center gap-2.5 pl-2">
                <AlertCircle className="h-4 w-4 text-[#FF5C5C] shrink-0" />
                <p className="text-sm text-[#FF5C5C]">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          LAYOUT
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <SectionCard title="Basic Information" delay={0}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Kashmiri Pheran with Aari Work"
                className="ember-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="kashmiri-pheran-aari-work"
                className="ember-input text-sm font-mono"
              />
              <p className="mt-1.5 text-[10px] text-[#6B6678]">
                Preview:{" "}
                <span className="text-[#FF9A3C]">
                  /shop/{form.slug || "your-product-slug"}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your product..."
                className="ember-input text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                Category *
              </label>
              <select
                required
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                className="ember-input text-sm bg-[#12101F] text-[#F5EFE7] cursor-pointer w-full"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </SectionCard>

          {/* Pricing */}
          <SectionCard icon={DollarSign} title="Pricing" delay={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Base Price (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.base_price || ""}
                  onChange={(e) =>
                    update("base_price", Number(e.target.value))
                  }
                  placeholder="17500"
                  className="ember-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                  Compare Price (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.compare_at_price ?? ""}
                  onChange={(e) =>
                    update(
                      "compare_at_price",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="22000"
                  className="ember-input text-sm"
                />
                <p className="mt-1.5 text-[10px] text-[#6B6678]">
                  Optional — for showing a discount
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Image */}
          <SectionCard icon={ImageIcon} title="Product Image" delay={0.16}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                Image URL *
              </label>
              <input
                type="text"
                required
                value={form.image_url}
                onChange={(e) => update("image_url", e.target.value)}
                placeholder="/products/kashmiri-pheran.jpg"
                className="ember-input text-sm font-mono"
              />
              <p className="mt-1.5 text-[10px] text-[#6B6678]">
                Use path like{" "}
                <span className="text-[#FF9A3C]">/products/filename.jpg</span>
              </p>
            </div>

            <AnimatePresence>
              {form.image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-xl overflow-hidden border border-[rgba(255,200,120,0.18)] aspect-video bg-gradient-to-br from-[#1A1730] to-[#12101F] shadow-[0_0_24px_-8px_rgba(255,154,60,0.3)]"
                >
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <SectionCard title="Visibility" delay={0.06}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#F5EFE7]">Active</p>
                <p className="text-[10px] text-[#6B6678]">Visible on store</p>
              </div>
              <Toggle
                enabled={form.is_active}
                onChange={() => update("is_active", !form.is_active)}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#F5EFE7]">Featured</p>
                <p className="text-[10px] text-[#6B6678]">Show on homepage</p>
              </div>
              <Toggle
                enabled={form.is_featured}
                onChange={() => update("is_featured", !form.is_featured)}
              />
            </div>
          </SectionCard>

          <SectionCard icon={Tag} title="Tags" delay={0.14}>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="kashmiri, pheran, aari"
                className="ember-input text-sm"
              />
            </div>

            <AnimatePresence>
              {tagsInput.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                        }}
                      >
                        <Badge variant="default" className="text-[10px]">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        </div>
      </motion.div>

      {/* FOOTER ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,200,120,0.08)]"
      >
        <Link href="/seller/products">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}