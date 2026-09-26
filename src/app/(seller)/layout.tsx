import type { Metadata } from "next";
import { SellerSidebar } from "./seller/components/SellerSidebar";
import { SellerHeader } from "./seller/components/SellerHeader";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Seller Console — Luvéra",
  description: "Manage products, orders, and analytics",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ember-root flex min-h-screen">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}