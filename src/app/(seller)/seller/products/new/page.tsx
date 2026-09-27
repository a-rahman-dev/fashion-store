"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Yahan aap apna API call ya Supabase logic add karein
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Product saved successfully! (Demo)");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/seller/products"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[#9A94A8] hover:text-[#F5EFE7]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F5EFE7]">
            Add New Product
          </h2>
          <p className="mt-1 text-sm text-[#9A94A8]">
            Fill in the details below to add a new product to your catalog.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-[#13111C] border border-white/5 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Premium Wireless Headphones"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Price ($)</label>
            <input
              type="number"
              required
              placeholder="99.99"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#F5EFE7]">Description</label>
          <textarea
            rows={4}
            required
            placeholder="Describe your product..."
            className="w-full px-4 py-2.5 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Category</label>
            <select className="w-full px-4 py-2.5 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] focus:outline-none focus:border-[#FF9A3C] transition-colors">
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home & Garden</option>
              <option>Sports</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Stock Quantity</label>
            <input
              type="number"
              required
              placeholder="100"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] font-semibold shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_28px_rgba(255,154,60,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}