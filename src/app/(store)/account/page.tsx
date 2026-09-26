import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { AccountContent } from "./components/AccountContent";

export const metadata = {
  title: "My Account — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — auth check + layout
// Animations AccountContent (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9A3C] mb-2">
          My Account
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE7]">
          Welcome back
        </h1>
      </div>

      <AccountContent user={user} />
    </div>
  );
}