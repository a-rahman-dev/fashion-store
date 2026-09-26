import { cn } from "@/lib/utils/cn";

/* ============================================================
   BASE SKELETON — bronze-gold shimmer instead of flat pulse
   ============================================================ */

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[rgba(255,255,255,0.04)]",
        "border border-[rgba(255,200,120,0.06)]",
        className
      )}
      {...props}
    >
      {/* Shimmer sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,200,120,0.08) 50%, transparent 100%)",
          animation: "skeleton-shimmer 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ============================================================
   PRODUCT CARD SKELETON — matches upgraded card aesthetic
   ============================================================ */

export function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        "glass-card overflow-hidden rounded-2xl",
        "border border-[rgba(255,200,120,0.10)]",
        "shadow-[0_1px_0_rgba(255,200,120,0.06)_inset,0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.2)] to-transparent"
      />

      <Skeleton className="aspect-[3/4] rounded-none border-0" />

      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-3" />
      </div>
    </div>
  );
}