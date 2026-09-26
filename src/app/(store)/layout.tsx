import type { Metadata } from "next";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { ToastContainer } from "@/components/ui/toast";
import { AssistantButton } from "./assistant/components/AssistantButton";

export const metadata: Metadata = {
  title: "Luvéra — Wear the night.",
  description: "Modern fashion, after dark.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ember-root min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
      <AssistantButton />
    </div>
  );
}