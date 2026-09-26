import { CartContent } from "./components/CartContent";

export const metadata = {
  title: "Shopping Cart — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — metadata + layout
// Animations CartContent (client) mein hain
// ══════════════════════════════════════════════════════════
export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          Shopping
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          Your Cart
        </h1>
      </div>

      <CartContent />
    </div>
  );
}