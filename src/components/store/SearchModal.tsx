"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  TrendingUp,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_at_price: number | null;
  image_url: string;
  category_name: string | null;
  rating_avg: number;
  rating_count: number;
};

const TRENDING = [
  "Sherwani",
  "Kashmiri Pheran",
  "Gold Jhumka",
  "Wedding dress",
  "Watch",
  "Leather bag",
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Load recent searches ──────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("luvera_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // ── Focus input when modal opens ──────────────────────────
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ── Escape key handler ────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Lock body scroll ──────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Debounced search ──────────────────────────────────────
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setResults(data.products ?? []);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ── Save to recent searches ───────────────────────────────
  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "luvera_recent_searches",
        JSON.stringify(updated)
      );
    }
  };

  const handleSelect = (term: string) => {
    saveRecent(term);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-card overflow-hidden fade-in-up shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,200,120,0.1)]">
          <Search className="h-5 w-5 text-[#FF9A3C] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-base text-[#F5EFE7] placeholder-[#6B6678] focus:outline-none"
          />
          {loading && (
            <Loader2 className="h-4 w-4 text-[#FF9A3C] animate-spin flex-shrink-0" />
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading */}
          {loading && query.length >= 2 && (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 text-[#FF9A3C] animate-spin mx-auto" />
              <p className="mt-3 text-xs text-[#9A94A8]">Searching...</p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678]">
                  Products ({results.length})
                </p>
                <button
                  onClick={() => handleSelect(query)}
                  className="text-[10px] text-[#FF9A3C] hover:text-[#FFB566] uppercase tracking-wider"
                >
                  View all
                </button>
              </div>
              <div className="space-y-1">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    onClick={() => handleSelect(product.name)}
                    className="group flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Image */}
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1730] to-[#12101F]">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5EFE7] line-clamp-1 group-hover:text-[#FF9A3C] transition-colors">
                        {product.name}
                      </p>
                      {product.category_name && (
                        <p className="text-[10px] text-[#6B6678] mt-0.5">
                          {product.category_name}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-[#FF9A3C]">
                        {formatPrice(product.base_price)}
                      </p>
                      {product.compare_at_price && (
                        <p className="text-[10px] text-[#6B6678] line-through">
                          {formatPrice(product.compare_at_price)}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-[#6B6678] group-hover:text-[#FF9A3C] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,154,60,0.08)]">
                <Package className="h-5 w-5 text-[#FF9A3C]" />
              </div>
              <p className="text-sm text-[#9A94A8] mb-1">No products found</p>
              <p className="text-xs text-[#6B6678]">
                Try different keywords
              </p>
            </div>
          )}

          {/* Empty state — Trending + Recent */}
          {!query && (
            <div className="p-4 space-y-5">
              {/* Recent */}
              {recentSearches.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-3 px-1 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Recent
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-lg border border-[rgba(255,200,120,0.1)] bg-white/[0.03] px-3 py-1.5 text-xs text-[#9A94A8] hover:border-[#FF9A3C] hover:text-[#FF9A3C] transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6678] mb-3 px-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-lg border border-[rgba(255,200,120,0.1)] bg-white/[0.03] px-3 py-1.5 text-xs text-[#9A94A8] hover:border-[#FF9A3C] hover:text-[#FF9A3C] transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[rgba(255,200,120,0.1)] flex items-center justify-between text-[10px] text-[#6B6678]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[rgba(255,200,120,0.15)] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px]">
                ESC
              </kbd>
              to close
            </span>
          </div>
          <span>Press Enter to search</span>
        </div>
      </div>
    </div>
  );
}