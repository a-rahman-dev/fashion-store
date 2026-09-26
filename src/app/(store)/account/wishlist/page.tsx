import { WishlistContent } from "./components/WishlistContent";

export const metadata = {
  title: "Wishlist — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — metadata + layout
// Animations WishlistContent (client) mein hain
// ══════════════════════════════════════════════════════════
export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          My Account
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          Wishlist
        </h1>
        <p className="mt-2 text-sm text-[#9A94A8]">
          Your saved items — ready when you are
        </p>
      </div>

      <WishlistContent />
    </div>
  );
}