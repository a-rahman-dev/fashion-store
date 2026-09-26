import { CheckoutForm } from "./components/CheckoutForm";

export const metadata = {
  title: "Checkout — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — metadata + layout
// Animations CheckoutForm (client) mein hain
// ══════════════════════════════════════════════════════════
export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          Almost there
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          Checkout
        </h1>
      </div>

      <CheckoutForm />
    </div>
  );
}